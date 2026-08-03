import { useCallback, useEffect, useRef, useState } from 'react';

export interface Size {
  width: number;
  height: number;
}

/**
 * Observe an element's box size with ResizeObserver.
 *
 * Uses a callback ref so it also works when the element mounts after the
 * owning component's first render (e.g. gated behind a loading branch).
 */
export function useElementSize<T extends HTMLElement = HTMLDivElement>(): [
  (node: T | null) => void,
  Size,
] {
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const roRef = useRef<ResizeObserver | null>(null);

  const setRef = useCallback((node: T | null) => {
    roRef.current?.disconnect();
    if (!node) return;
    const update = () => {
      const rect = node.getBoundingClientRect();
      setSize((prev) => {
        if (Math.abs(prev.width - rect.width) < 0.5 && Math.abs(prev.height - rect.height) < 0.5)
          return prev;
        return { width: rect.width, height: rect.height };
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    roRef.current = ro;
  }, []);

  useEffect(() => () => roRef.current?.disconnect(), []);

  return [setRef, size];
}

/** Compute the leaf size for a spread given the available area. */
export function pageSizeFor(
  areaW: number,
  areaH: number,
  mode: 'spread' | 'single',
): { width: number; height: number } {
  const aspect = 0.72;
  const pad = 16;
  const availW = Math.max(200, areaW - pad * 2);
  const availH = Math.max(200, areaH - pad * 2);
  if (mode === 'spread') {
    let pageH = availH;
    let pageW = pageH * aspect;
    if (pageW * 2 > availW) {
      pageW = availW / 2;
      pageH = pageW / aspect;
    }
    return { width: pageW, height: pageH };
  }
  let pageW = Math.min(availW, availH * aspect);
  const pageH = pageW / aspect;
  return { width: pageW, height: pageH };
}
