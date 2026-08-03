import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from './useReducedMotion';

/**
 * Subtle camera parallax: the book responds to mouse position with a small
 * rotation, never exceeding a few degrees.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  base: { x: number; y: number },
  active = true,
) {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !active) return;
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.9, ease: 'power2.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.9, ease: 'power2.out' });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      const mx = (e.clientX - r.left) / r.width - 0.5;
      const my = (e.clientY - r.top) / r.height - 0.5;
      rx(base.x - my * 3.5);
      ry(base.y + mx * 6.5);
    };
    const onLeave = () => {
      rx(base.x);
      ry(base.y);
    };
    gsap.set(el, { rotationX: base.x, rotationY: base.y, transformPerspective: 1800 });
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, [base.x, base.y, reduced, active]);

  return ref;
}
