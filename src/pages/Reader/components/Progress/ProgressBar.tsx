import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useReader } from '../../readerContext';

interface ProgressProps {
  onNext: () => void;
  onPrev: () => void;
  canNext: boolean;
  canPrev: boolean;
}

function formatEta(minutes: number): string {
  if (minutes < 1) return '<1 min';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h > 0) return `${h} hr ${m} min`;
  return `${m} min`;
}

/** Minimal, elegant reading progress with statistics. */
export function ProgressBar({ onNext, onPrev, canNext, canPrev }: ProgressProps) {
  const { layout, activeIndex, settings } = useReader();
  const total = layout.pages.length;

  const stats = useMemo(() => {
    const remaining = layout.pages.reduceRight((acc, p, i) => {
      if (i > activeIndex) acc += p.words;
      return acc;
    }, 0);
    const etaMin = remaining / (settings.readingSpeed / 60);
    return { etaMin };
  }, [layout, activeIndex, settings.readingSpeed]);

  const chapter = useMemo(() => {
    let found: (typeof layout.chapterStarts)[number] | null = null;
    for (const c of layout.chapterStarts) {
      if (activeIndex >= c.pageIndex) found = c;
      else break;
    }
    return found;
  }, [layout.chapterStarts, activeIndex]);

  const percent = total <= 1 ? 0 : Math.round((activeIndex / (total - 1)) * 100);

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 px-4 pb-3 pt-6" style={{ background: 'linear-gradient(0deg, rgba(8,6,4,0.7), transparent)' }}>
      <div className="mx-auto flex max-w-3xl items-center gap-3">
        <button className="toolbar-btn" onClick={onPrev} disabled={!canPrev} aria-label="Previous page" style={{ opacity: canPrev ? 1 : 0.3 }}>
          <ChevronLeft size={17} />
        </button>

        <div className="flex-1">
          <div className="mb-1.5 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.18em] text-[#9a917e]">
            <span className="shrink-0">
              Page <span className="text-[#e8dfc9]">{activeIndex + 1}</span> / {total}
            </span>
            {chapter && (
              <span className="hidden min-w-0 truncate lg:block" title={`Chapter ${chapter.chapterNumber} · ${chapter.title}`}>
                Chapter {chapter.chapterNumber} · {chapter.title}
              </span>
            )}
            <span className="hidden items-center gap-1 sm:flex shrink-0">
              <Clock size={11} />
              {formatEta(stats.etaMin)} left
            </span>
            <span className="shrink-0 text-[#c9a05c]">{percent}%</span>
          </div>
          <div className="progress-thin" style={{ ['--p' as string]: `${percent}%` }} aria-hidden="true">
            <span />
          </div>
        </div>

        <button className="toolbar-btn" onClick={onNext} disabled={!canNext} aria-label="Next page" style={{ opacity: canNext ? 1 : 0.3 }}>
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
