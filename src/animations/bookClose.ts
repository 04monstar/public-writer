import gsap from 'gsap';

export interface BookCloseOptions {
  duration?: number;
  reduced?: boolean;
}

/**
 * The reverse of {@link openBookTimeline} — returning the book to the shelf.
 *
 * `overlay` is the open reading scene, which zooms out gently while fading;
 * `scene` is the freshly remounted closed-book scene fading in underneath
 * while its cover closes shut.
 */
export function closeBookTimeline(
  scene: HTMLElement,
  cover: HTMLElement,
  overlay: HTMLElement | null,
  { duration = 1.4, reduced = false }: BookCloseOptions = {},
): gsap.core.Timeline {
  const tl = gsap.timeline();
  if (reduced) return tl;

  const s = duration / 1.4;

  tl.set(cover, { rotationY: -158, z: -6 }, 0);
  if (overlay) {
    tl.fromTo(
      overlay,
      { scale: 1.05, opacity: 1 },
      { scale: 1, opacity: 0, duration: 0.7, ease: 'power2.inOut' },
      0,
    );
  }
  tl.fromTo(scene, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out' }, 0);
  tl.to(scene, { scale: 1, filter: 'brightness(1)', duration, ease: 'power2.inOut' }, 0);
  tl.to(cover, { rotationY: 0, duration: 0.85 * duration, ease: 'power2.inOut' }, 0.08 * s);
  tl.to(cover, { z: 0, duration: 0.5 * duration, ease: 'power1.out' }, 0.2 * s);
  return tl;
}
