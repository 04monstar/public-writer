import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const RIBBON_COLORS = ['#a33327', '#2f5d8a', '#7a6b2f', '#5d3a7a', '#3a7a52', '#8a4a2f'];

/** A silk ribbon hanging from the top of a bookmarked page. */
export function BookmarkRibbon({
  leftPct,
  index,
}: {
  leftPct: number;
  index: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const color = RIBBON_COLORS[index % RIBBON_COLORS.length]!;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) return;
    gsap.fromTo(
      el,
      { yPercent: -130 },
      { yPercent: 0, duration: 0.7, ease: 'power3.out', delay: 0.15 },
    );
  }, [reduced]);

  return (
    <div
      ref={ref}
      className="bookmark-ribbon"
      style={{
        left: `${leftPct}%`,
        background: `linear-gradient(180deg, ${color}, ${color}cc)`,
      }}
    />
  );
}
