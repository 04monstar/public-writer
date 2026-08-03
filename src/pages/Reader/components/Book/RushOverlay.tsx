import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { rushPagesTimeline } from '@/animations';

const PAGE_COUNT = 9;

/** A rapid, blurred sweep of pages used when jumping many pages at once. */
export function RushOverlay({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reduced) {
      const t = window.setTimeout(onDone, 40);
      return () => window.clearTimeout(t);
    }
    const pages = Array.from(root.querySelectorAll<HTMLElement>('[data-ghost]'));
    const tl = rushPagesTimeline(root, pages, { onComplete: onDone });
    return () => {
      tl.kill();
    };
  }, [reduced, onDone]);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 z-[70] flex items-center justify-center overflow-hidden"
      style={{ background: 'rgba(8,6,4,0.9)', perspective: 1200 }}
      aria-hidden="true"
    >
      {Array.from({ length: PAGE_COUNT }).map((_, i) => (
        <div
          key={i}
          data-ghost
          className="absolute"
          style={{
            width: '24%',
            maxWidth: 220,
            aspectRatio: '0.72',
            top: '50%',
            left: '50%',
            marginLeft: -110,
            marginTop: -150,
            borderRadius: '3px 6px 6px 3px',
            background:
              'linear-gradient(115deg, #f4ecd9 0%, #e7dcc4 55%, #d9c9a9 100%)',
            boxShadow: '0 18px 40px rgba(0,0,0,0.6)',
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '10% 12%',
              borderTop: '1px solid rgba(120,100,60,0.35)',
            }}
          />
        </div>
      ))}
    </div>
  );
}
