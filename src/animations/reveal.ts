import gsap from 'gsap';

export interface RevealOptions {
  duration?: number;
  delay?: number;
  distance?: number;
}

/**
 * A gentle reveal used for full-page artwork and other moments that should
 * "print" onto the page rather than pop in.
 */
export function revealIn(el: HTMLElement, opts: RevealOptions = {}): gsap.core.Tween {
  const { duration = 0.7, delay = 0.05, distance = 10 } = opts;
  return gsap.fromTo(
    el,
    { opacity: 0, y: distance, scale: 0.985 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration,
      delay,
      ease: 'power2.out',
      clearProps: 'opacity,y,scale',
    },
  );
}
