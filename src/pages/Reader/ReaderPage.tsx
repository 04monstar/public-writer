import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchStory } from '@/data/api';
import { closeBookTimeline, openBookTimeline, bookEntrance } from '@/animations';
import { usePrefersContrast } from '@/hooks/usePrefersContrast';
import { usePagination } from '@/hooks/usePagination';
import { useSettingsStore } from '@/stores/settingsStore';
import { useProgressStore } from '@/stores/progressStore';
import { useBookmarksStore } from '@/stores/bookmarksStore';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { clamp } from '@/utils/text';
import { FONT_STACKS } from '@/utils/text';
import { sound } from '@/utils/audio';
import { themeById, highContrastVarsFor } from '@/types/themes';
import { computeMetrics } from '@/utils/pagination';
import { useElementSize, pageSizeFor } from '@/hooks/useElementSize';
import { ReaderContext } from './readerContext';
import { ReadingRoom } from './components/Book/ReadingRoom';
import { ClosedBook } from './components/Book/ClosedBook';
import { LoadingBook, ErrorBook } from './components/Book/LoadingStates';
import { RushOverlay } from './components/Book/RushOverlay';
import { Spread, type SpreadHandle } from './components/Page/Spread';
import { Toolbar } from './components/ReaderControls/Toolbar';
import { SettingsPanel } from './components/ReaderControls/SettingsPanel';
import { TOCModal } from './components/TOC/TOCModal';
import { ProgressBar } from './components/Progress/ProgressBar';

type Phase = 'loading' | 'closed' | 'opening' | 'open' | 'closing';

export default function ReaderPage() {
  const { storyId = '' } = useParams();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const highContrast = usePrefersContrast();

  const settings = useSettingsStore();
  const savedPositions = useProgressStore((s) => s.positions);
  const setPosition = useProgressStore((s) => s.setPosition);
  const bookmarksMap = useBookmarksStore((s) => s.bookmarks);

  const { data: story, isLoading, error } = useQuery({
    queryKey: ['story', storyId],
    queryFn: () => fetchStory(storyId),
    enabled: !!storyId,
    staleTime: Infinity,
  });

  // Reading area
  const [areaRef, area] = useElementSize<HTMLDivElement>();

  // Single vs spread based on viewport
  const [mode, setMode] = useState<'spread' | 'single'>(
    () => (typeof window !== 'undefined' && window.innerWidth < 720 ? 'single' : 'spread'),
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 719px)');
    const onChange = () => setMode(mq.matches ? 'single' : 'spread');
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const { width: pageWidth, height: pageHeight } = pageSizeFor(area.width, area.height, mode);

  const { layout, status } = usePagination(story ?? null, settings, pageWidth, pageHeight, mode);

  const [phase, setPhase] = useState<Phase>('loading');
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rushing, setRushing] = useState<{ to: number; seed: number } | null>(null);
  const spreadRef = useRef<SpreadHandle | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const openSceneRef = useRef<HTMLDivElement | null>(null);
  const openingRef = useRef(false);
  const closingRef = useRef(false);

  const total = layout?.pages.length ?? 0;

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  // Resume position once typeset
  useEffect(() => {
    if (!layout || status !== 'ready' || phase !== 'closed') return;
    const saved = savedPositions[storyId];
    if (saved != null) {
      setCurrent(clamp(saved, 0, layout.pages.length - 1));
    }
  }, [layout, status, phase, storyId, savedPositions]);

  // Keep sound engine in sync
  useEffect(() => {
    sound.configure(settings.pageSound);
  }, [settings.pageSound]);

  // Apply theme + type variables
  const theme = themeById(settings.themeId);
  const themeStyle = useMemo(
    () => ({
      ...theme.vars,
      ...(highContrast ? highContrastVarsFor(theme.id) : {}),
      '--font-size-body': `${settings.fontSize}px`,
      '--line-height-body': String(settings.lineHeight),
      '--font-family-body': FONT_STACKS[settings.fontFamily],
      '--paper-brightness': String(settings.paperBrightness / 100),
    }),
    [theme, highContrast, settings.fontSize, settings.lineHeight, settings.fontFamily, settings.paperBrightness],
  );

  // phase: loading -> closed once typeset
  useEffect(() => {
    if (status === 'ready' && layout) {
      setPhase((p) => (p === 'loading' ? 'closed' : p));
    }
  }, [status, layout]);

  const activeIndex = useMemo(() => {
    if (!layout) return 0;
    const i = mode === 'spread' ? current + 1 : current;
    return clamp(i, 0, layout.pages.length - 1);
  }, [layout, mode, current]);

  const activePage = useMemo(
    () => (layout ? layout.pages[activeIndex] ?? layout.pages[layout.pages.length - 1]! : null),
    [layout, activeIndex],
  );

  const commitTurn = useCallback(
    (index: number) => {
      setCurrent(index);
      currentRef.current = index;
      setPosition(storyId, index);
    },
    [storyId, setPosition],
  );

  const rushTo = useCallback((index: number) => {
    setRushing({ to: index, seed: Date.now() });
  }, []);

  const animateFlips = useCallback(
    async (target: number, dir: 1 | -1) => {
      const spread = spreadRef.current;
      if (!spread) return;
      for (let i = 0; i < 60; i++) {
        const ok = dir === 1 ? await spread.next() : await spread.prev();
        if (!ok) break;
        if (
          (dir === 1 && currentRef.current >= target) ||
          (dir === -1 && currentRef.current <= target)
        ) {
          break;
        }
      }
    },
    [],
  );

  const goToPage = useCallback(
    (index: number) => {
      if (!layout) return;
      const target = clamp(index, 0, layout.pages.length - 1);
      if (target === currentRef.current) return;
      const delta = target - currentRef.current;
      if (Math.abs(delta) <= 4) {
        void animateFlips(target, delta > 0 ? 1 : -1);
      } else {
        rushTo(target);
      }
    },
    [layout, animateFlips, rushTo],
  );

  const bookmarks = useMemo(
    () => (layout ? (bookmarksMap[storyId] ?? []) : []),
    [bookmarksMap, storyId, layout],
  );

  const toggleBookmark = useCallback(
    (index?: number) => {
      const target = index ?? activeIndex;
      useBookmarksStore.getState().toggle(storyId, target);
      if (settings.pageSound) sound.bookmarkInsert();
    },
    [activeIndex, settings.pageSound, storyId],
  );

  const nextPage = useCallback(() => void spreadRef.current?.next(), []);
  const prevPage = useCallback(() => void spreadRef.current?.prev(), []);

  useKeyboard(
    {
      ArrowRight: () => void spreadRef.current?.next(),
      PageDown: () => void spreadRef.current?.next(),
      ' ': () => void spreadRef.current?.next(),
      ArrowLeft: () => void spreadRef.current?.prev(),
      PageUp: () => void spreadRef.current?.prev(),
      Home: () => goToPage(0),
      End: () => layout && goToPage(layout.pages.length - 1),
      b: () => toggleBookmark(),
    },
    phase === 'open' && !tocOpen && !settingsOpen,
  );

  // Opening animation
  const handleOpen = useCallback(() => {
    if (openingRef.current) return;
    openingRef.current = true;
    if (reduced) {
      setPhase('open');
      if (settings.pageSound) sound.bookOpen();
      return;
    }
    setPhase('opening');
    const cover = coverRef.current;
    const scene = sceneRef.current;
    if (!cover || !scene) {
      setPhase('open');
      return;
    }
    const tl = openBookTimeline(scene, cover, { reduced });
    tl.eventCallback('onComplete', () => {
      setPhase('open');
      if (settings.pageSound) sound.bookOpen();
    });
  }, [reduced, settings.pageSound]);

  // Closing animation: the reading scene zooms out and fades while the
  // closed book remounts and its cover shuts, then we return to the library.
  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    if (reduced) {
      navigate('/');
      return;
    }
    setPhase('closing');
  }, [reduced, navigate]);

  // Build the closing timeline once the closed book has remounted beneath the
  // still-visible reading scene.
  useEffect(() => {
    if (phase !== 'closing') return;
    const cover = coverRef.current;
    const scene = sceneRef.current;
    const overlay = openSceneRef.current;
    if (!cover || !scene || !overlay) return;
    const tl = closeBookTimeline(scene, cover, overlay, { reduced });
    tl.eventCallback('onComplete', () => navigate('/'));
    return () => {
      tl.kill();
    };
  }, [phase, reduced, navigate]);

  // Entrance: the closed book settles onto the desk once typeset
  useEffect(() => {
    if (phase !== 'closed') return;
    const scene = sceneRef.current;
    if (!scene || reduced) return;
    const tween = bookEntrance(scene);
    return () => {
      tween.kill();
    };
  }, [phase, reduced]);

  // After opening, gently resume the reader's saved place
  const resumedRef = useRef(false);
  useEffect(() => {
    if (phase !== 'open' || resumedRef.current || !layout) return;
    const saved = savedPositions[storyId];
    if (saved != null && saved > 2 && saved < layout.pages.length - 1) {
      resumedRef.current = true;
      const t = window.setTimeout(() => {
        goToPage(saved);
        resumedRef.current = false;
      }, 700);
      return () => window.clearTimeout(t);
    }
    resumedRef.current = true;
  }, [phase, layout, storyId, savedPositions, goToPage]);

  const canNext = layout ? (mode === 'spread' ? current + 2 < total : current + 1 < total) : false;
  const canPrev = layout ? current > 0 : false;

  const metrics = useMemo(
    () => computeMetrics(pageWidth, pageHeight, settings, mode),
    [pageWidth, pageHeight, settings, mode],
  );

  const contextValue = useMemo(
    () =>
      layout && story && activePage
        ? {
          story,
          layout,
          settings,
          theme,
          pageWidth,
          pageHeight,
          metrics,
          mode,
          reduced,
          current,
          activePage,
          activeIndex,
          goToPage,
          toggleBookmark,
          bookmarks,
        }
        : null,
    [layout, story, activePage, settings, theme, pageWidth, pageHeight, metrics, mode, reduced, current, activeIndex, goToPage, toggleBookmark, bookmarks],
  );

  if (isLoading || (!story && !error)) {
    return (
      <div className="relative h-full w-full overflow-hidden" style={{ background: theme.room }}>
        <LoadingBook />
      </div>
    );
  }
  if (error || !story || !layout) {
    return (
      <div className="relative h-full w-full overflow-hidden" style={{ background: theme.room }}>
        <ErrorBook message={error?.message ?? 'Unknown error'} />
      </div>
    );
  }

  const ready = !!contextValue;

  return (
    <ReaderContext.Provider value={contextValue}>
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ ...themeStyle, background: theme.room }}
      >
        {!ready ? (
          <LoadingBook />
        ) : (
          <>
            <ReadingRoom />

            <div ref={areaRef} className="absolute inset-0">
              {/* Closed book scene */}
              {(phase === 'closed' || phase === 'opening' || phase === 'closing') && (
                <div
                  ref={sceneRef}
                  className="absolute inset-0"
                  style={{ opacity: phase === 'closing' ? 0 : undefined }}
                >
                  <ClosedBook
                    width={pageWidth}
                    height={pageHeight}
                    coverRef={coverRef}
                    groupRef={groupRef}
                    onOpen={handleOpen}
                  />
                </div>
              )}

              {/* Open reading scene */}
              {(phase === 'opening' || phase === 'open' || phase === 'closing') && (
                <div
                  ref={openSceneRef}
                  className="absolute inset-0"
                  style={{
                    opacity: phase === 'opening' ? 0 : 1,
                    transition: phase === 'closing' ? 'none' : 'opacity 600ms ease',
                    pointerEvents: phase === 'closing' ? 'none' : undefined,
                  }}
                >
                  <div className="relative h-full w-full">
                    <Spread ref={spreadRef} onCommit={commitTurn} soundOn={settings.pageSound} />
                    <Toolbar
                      onBack={handleClose}
                      onOpenTOC={() => setTocOpen(true)}
                      onOpenSettings={() => setSettingsOpen(true)}
                    />
                    <ProgressBar onNext={nextPage} onPrev={prevPage} canNext={canNext} canPrev={canPrev} />
                  </div>
                </div>
              )}
            </div>

            <TOCModal open={tocOpen} onClose={() => setTocOpen(false)} />
            <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
            {rushing && (
              <RushOverlay
                key={rushing.seed}
                onDone={() => {
                  const to = clamp(rushing.to, 0, (layout?.pages.length ?? 1) - 1);
                  commitTurn(to);
                  setRushing(null);
                }}
              />
            )}
          </>
        )}
      </div>
    </ReaderContext.Provider>
  );
}
