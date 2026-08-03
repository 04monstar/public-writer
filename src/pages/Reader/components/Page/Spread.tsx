import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { clamp } from '@/utils/text';
import type { Page } from '@/types/reader';
import { useReader } from '../../readerContext';
import { usePageTurn, type TurnDirection } from '@/hooks/usePageTurn';
import { useParallax } from '@/hooks/useParallax';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useBookmarksStore, EMPTY_BOOKMARKS } from '@/stores/bookmarksStore';
import { PageSheet } from './PageSheet';
import { Leaf } from './Leaf';
import { BookmarkRibbon } from '../Bookmark/BookmarkRibbon';

export interface SpreadHandle {
  next: () => Promise<boolean>;
  prev: () => Promise<boolean>;
  isBusy: () => boolean;
}

interface TurnState {
  dir: TurnDirection;
  front: Page;
  back: Page;
}

interface SpreadProps {
  onCommit: (index: number) => void;
  soundOn: boolean;
}

const isInteractive = (el: EventTarget | null): boolean =>
  !!el && el instanceof Element && !!el.closest('[data-interactive]');

export const Spread = forwardRef<SpreadHandle, SpreadProps>(({ onCommit, soundOn }, ref) => {
  const { layout, current, mode, pageWidth, pageHeight, settings, reduced } = useReader();
  const pages = layout.pages;
  const bookmarks = useBookmarksStore((s) => s.bookmarks[layout.meta.id] ?? EMPTY_BOOKMARKS);
  const reducedMotion = useReducedMotion() || reduced;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const spreadRef = useRef<HTMLDivElement | null>(null);
  const leafRef = useRef<HTMLDivElement | null>(null);
  const [turning, setTurning] = useState<TurnState | null>(null);
  const pendingResolve = useRef<((ok: boolean) => void) | null>(null);
  const gesture = useRef<{ x: number; y: number; t: number; dir?: TurnDirection } | null>(null);
  const busyRef = useRef(false);
  const wheelAcc = useRef(0);
  const lastWheel = useRef(0);

  const duration = settings.pageTurnSpeed === 'slow' ? 1.6 : settings.pageTurnSpeed === 'fast' ? 0.55 : 1.0;

  const step = mode === 'spread' ? 2 : 1;

  const canTurnNow = useCallback(
    (dir: TurnDirection): boolean => {
      if (mode === 'spread') {
        return dir === 1 ? current + 2 < pages.length : current - 1 >= 0;
      }
      return dir === 1 ? current + 1 < pages.length : current - 1 >= 0;
    },
    [mode, current, pages.length],
  );

  const buildTurn = useCallback(
    (dir: TurnDirection): TurnState | null => {
      if (!canTurnNow(dir)) return null;
      if (mode === 'spread') {
        if (dir === 1) {
          const front = pages[current + 1]!;
          const back = pages[current + 2]!;
          return { dir, front, back };
        }
        const front = pages[current]!;
        const back = pages[current - 1]!;
        return { dir, front, back };
      }
      if (dir === 1) {
        const front = pages[current]!;
        const back = pages[current + 1]!;
        return { dir, front, back };
      }
      const front = pages[current]!;
      const back = pages[current - 1]!;
      return { dir, front, back };
    },
    [canTurnNow, mode, pages, current],
  );

  const turn = usePageTurn({
    leafRef,
    duration,
    reduced: reducedMotion,
    soundOn,
    canTurn: canTurnNow,
    onTurnStart: (dir) => {
      const t = buildTurn(dir);
      if (!t) return;
      flushSync(() => setTurning(t));
    },
    onTurnEnd: (dir) => {
      const nextIndex = clamp(current + dir * step, 0, pages.length - 1);
      onCommit(nextIndex);
      busyRef.current = false;
      setTurning(null);
      const resolve = pendingResolve.current;
      pendingResolve.current = null;
      resolve?.(true);
    },
    onTurnCancel: () => {
      setTurning(null);
    },
  });

  const next = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        if (turn.isBusy || !canTurnNow(1)) return resolve(false);
        pendingResolve.current = resolve;
        turn.forward();
      }),
    [turn, canTurnNow],
  );

  const prev = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        if (turn.isBusy || !canTurnNow(-1)) return resolve(false);
        pendingResolve.current = resolve;
        turn.backward();
      }),
    [turn, canTurnNow],
  );

  useImperativeHandle(
    ref,
    () => ({
      next: () => next(),
      prev: () => prev(),
      isBusy: () => turn.isBusy,
    }),
    [next, prev, turn.isBusy],
  );

  useEffect(() => {
    busyRef.current = turn.isBusy;
  }, [turn.isBusy]);

  // Single-mode underlay: show the destination page beneath the turning leaf.
  const singleBaseIndex =
    mode === 'single' && turning
      ? turning.dir === 1
        ? Math.min(current + 1, pages.length - 1)
        : Math.max(current - 1, 0)
      : current;

  const parallaxRef = useParallax<HTMLDivElement>(
    { x: 4, y: 0 },
    !turn.isBusy && mode === 'spread',
  );

  const handleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (turn.isBusy) return;
    if (isInteractive(e.target)) return;
    gesture.current = { x: e.clientX, y: e.clientY, t: performance.now() };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g) return;
    if (!g.dir) {
      const dx = e.clientX - g.x;
      const dy = e.clientY - g.y;
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
      const rect = e.currentTarget.getBoundingClientRect();
      let dir: TurnDirection;
      if (mode === 'spread') {
        dir = e.clientX > rect.left + rect.width / 2 ? 1 : -1;
      } else {
        if (Math.abs(dy) > Math.abs(dx) * 1.4) return;
        dir = dx < 0 ? 1 : -1;
      }
      if (!canTurnNow(dir)) {
        gesture.current = null;
        return;
      }
      g.dir = dir;
      turn.beginDrag(dir, g.x, g.y);
    }
    turn.moveDrag(e.clientX, e.clientY);
  };

  const handleUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    gesture.current = null;
    if (!g) return;
    if (isInteractive(e.target)) return;
    if (g.dir) {
      turn.endDrag();
      return;
    }
    // A tap: treat as a quick turn in that direction.
    if (turn.isBusy) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let dir: TurnDirection;
    if (mode === 'spread') {
      dir = e.clientX > rect.left + rect.width / 2 ? 1 : -1;
    } else {
      dir = e.clientX > rect.left + rect.width * 0.3 ? 1 : -1;
    }
    if (!canTurnNow(dir)) return;
    turn.beginDrag(dir, e.clientX, e.clientY);
    turn.endDrag();
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!settings.scrollToTurn) return;
    const now = performance.now();
    if (now - lastWheel.current < 420) return;
    wheelAcc.current += e.deltaY;
    if (Math.abs(wheelAcc.current) < 60) return;
    lastWheel.current = now;
    wheelAcc.current = 0;
    if (e.deltaY < 0) void prev();
    else void next();
  };

  const spreadW = pageWidth * (mode === 'spread' ? 2 : 1);
  const currentPage = pages[current]!;

  // During a turn the destination sheet is already underneath the lifting
  // leaf, so the revealed page is correct the moment it clears the top page.
  const displayLeftIdx = turning
    ? turning.dir === 1
      ? current
      : Math.max(current - 2, 0)
    : current;
  const displayRightIdx = turning
    ? turning.dir === 1
      ? Math.min(current + 3, pages.length - 1)
      : current + 1
    : current + 1;
  const displayLeft = pages[displayLeftIdx];
  const displayRight = pages[displayRightIdx];

  return (
    <div
      ref={rootRef}
      className="relative flex items-center justify-center h-full w-full select-none"
      style={{ touchAction: 'none' }}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={() => {
        gesture.current = null;
        turn.cancelDrag();
      }}
      onWheel={handleWheel}
      data-parallax-root
    >
      <div
        ref={parallaxRef}
        style={{
          width: spreadW,
          height: pageHeight,
          transformStyle: 'preserve-3d',
          transform: 'perspective(1800px)',
        }}
      >
        <div
          ref={spreadRef}
          className="relative"
          style={{
            width: spreadW,
            height: pageHeight,
            transformStyle: 'preserve-3d',
          }}
        >
          {mode === 'spread' ? (
            <>
              <div className="absolute" style={{ left: 0, top: 0, width: pageWidth, height: pageHeight, zIndex: 10 }}>
                <PageSheet page={displayLeft!} side="left" />
              </div>
              {displayRight && (
                <div className="absolute" style={{ left: pageWidth, top: 0, width: pageWidth, height: pageHeight, zIndex: 10 }}>
                  <PageSheet page={displayRight} side="right" />
                </div>
              )}
            </>
          ) : (
            <>
              {singleBaseIndex !== current && (
                <div className="absolute" style={{ left: 0, top: 0, width: pageWidth, height: pageHeight, zIndex: 9 }}>
                  <PageSheet page={pages[singleBaseIndex]!} side="neutral" />
                </div>
              )}
              <div className="absolute" style={{ left: 0, top: 0, width: pageWidth, height: pageHeight, zIndex: 10 }}>
                <PageSheet page={currentPage} side="neutral" />
              </div>
            </>
          )}

          {mode === 'spread' && <div className="spread-crease" />}

          {turning && (
            <Leaf
              dir={turning.dir}
              frontPage={turning.front}
              backPage={turning.back}
              leafRef={leafRef}
              single={mode === 'single'}
            />
          )}

          {/* Bookmarks */}
          {mode === 'spread' ? (
            <>
              {bookmarks.includes(displayLeftIdx) && (
                <BookmarkRibbon leftPct={7} index={bookmarks.indexOf(displayLeftIdx)} />
              )}
              {displayRight && bookmarks.includes(displayRightIdx) && (
                <BookmarkRibbon leftPct={52.5} index={bookmarks.indexOf(displayRightIdx)} />
              )}
            </>
          ) : (
            bookmarks.includes(current) && (
              <BookmarkRibbon leftPct={30} index={bookmarks.indexOf(current)} />
            )
          )}
        </div>
      </div>
    </div>
  );
});

Spread.displayName = 'Spread';
