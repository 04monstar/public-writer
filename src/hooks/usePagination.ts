import { useEffect, useMemo, useRef, useState } from 'react';
import type { Story } from '@/types/story';
import type { BookLayout, ReaderSettings } from '@/types/reader';
import {
  assembleLayout,
  computeMetrics,
  flattenBlocks,
  paginationKey,
  type PageMetrics,
} from '@/utils/pagination';
import { TextMeasurer } from '@/utils/text';

export type TypesetStatus = 'idle' | 'working' | 'ready';

const cache = new Map<string, BookLayout>();
let measurer: TextMeasurer | null = null;
export const getMeasurer = (): TextMeasurer => {
  if (!measurer) measurer = new TextMeasurer();
  return measurer;
};

const tick = () => new Promise<void>((r) => setTimeout(r, 0));

async function paginateChunked(
  story: Story,
  pm: PageMetrics,
  onProgress: (p: number) => void,
  signal: { cancelled: boolean },
): Promise<BookLayout> {
  const m = getMeasurer();
  const out: Parameters<typeof assembleLayout>[0] = [];
  const CHUNK = 5;
  const total = story.blocks.length;
  for (let i = 0; i < total; i += CHUNK) {
    if (signal.cancelled) throw new Error('cancelled');
    flattenBlocks(story.blocks.slice(i, i + CHUNK), m, pm, out);
    onProgress(0.08 + (i / total) * 0.82);
    await tick();
  }
  if (signal.cancelled) throw new Error('cancelled');
  onProgress(0.94);
  const layout = assembleLayout(out, story.meta, pm);
  onProgress(1);
  return layout;
}

export function usePagination(
  story: Story | null,
  settings: ReaderSettings,
  pageWidth: number,
  pageHeight: number,
  mode: 'spread' | 'single',
): { layout: BookLayout | null; status: TypesetStatus; progress: number } {
  const key = story
    ? `${story.id}|${paginationKey(settings, pageWidth, pageHeight, mode)}`
    : '';

  const [layout, setLayout] = useState<BookLayout | null>(null);
  const [status, setStatus] = useState<TypesetStatus>('idle');
  const [progress, setProgress] = useState(0);

  const firstRender = useRef(true);

  useEffect(() => {
    if (!story || pageWidth <= 0 || pageHeight <= 0) {
      setLayout(null);
      setStatus('idle');
      return;
    }
    const cached = cache.get(key);
    if (cached) {
      setLayout(cached);
      setStatus('ready');
      setProgress(1);
      return;
    }

    const signal = { cancelled: false };
    setStatus('working');
    setProgress(0);

    const run = async () => {
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise<void>((resolve) => window.setTimeout(resolve, 1500)),
        ]);
        if (signal.cancelled) return;
        const pm = computeMetrics(pageWidth, pageHeight, settings, mode);
        const result = await paginateChunked(story, pm, setProgress, signal);
        if (signal.cancelled) return;
        cache.set(key, result);
        setLayout(result);
        setStatus('ready');
        setProgress(1);
      } catch (err) {
        if (signal.cancelled) return;
        console.error('Typesetting failed', err);
        setStatus('idle');
      }
    };

    // Skip the microtask deferral on first render so text appears immediately.
    const timer = firstRender.current ? 0 : 16;
    firstRender.current = false;
    const id = window.setTimeout(() => void run(), timer);
    return () => {
      signal.cancelled = true;
      window.clearTimeout(id);
    };
  }, [key, story, settings, pageWidth, pageHeight, mode]);

  return useMemo(
    () => ({ layout, status, progress }),
    [layout, status, progress],
  );
}
