import gsap from 'gsap';

export interface BookOpenOptions {
  /** scale the whole sequence; 1.7s matches the cinematic opener */
  duration?: number;
  /** when reduced motion is on, return an empty timeline */
  reduced?: boolean;
}

/**
 * The signature open-the-book sequence.
 *
 * 1. A slight camera zoom toward the book (scene scale + brightness).
 * 2. The front cover rotates around its spine hinge.
 * 3. The cover lifts back a touch (z), suggesting it is leaving the page block.
 * 4. The closed-book scene fades out, handing off to the reading spread.
 *
 * All timings are derived from `duration` so the whole piece can be retimed
 * from a single knob.
 */
export function openBookTimeline(
  scene: HTMLElement,
  cover: HTMLElement,
  { duration = 1.7, reduced = false }: BookOpenOptions = {},
): gsap.core.Timeline {
  const tl = gsap.timeline();
  if (reduced) return tl;

  const s = duration / 1.7;

  // Normalise any leftover state (e.g. a mid-flight entrance tween) so the
  // opener is deterministic.
  tl.set(scene, { opacity: 1, y: 0, scale: 1 }, 0);
  tl.to(scene, { scale: 1.05, filter: 'brightness(1.1)', duration: duration, ease: 'power2.inOut' }, 0);
  tl.fromTo(
    cover,
    { rotationY: 0 },
    { rotationY: -158, duration: 1.55 * s, ease: 'power2.inOut' },
    0.12 * s,
  );
  tl.fromTo(cover, { z: 0 }, { z: -6, duration: 1.1 * s, ease: 'power1.out' }, 0.3 * s);
  tl.to(scene, { opacity: 0, duration: 0.5, ease: 'power1.in' }, 1.15 * s);
  return tl;
}
