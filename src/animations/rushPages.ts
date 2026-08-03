import gsap from 'gsap';

export interface RushPagesOptions {
  duration?: number;
  onComplete?: () => void;
}

/**
 * A rapid, blurred sweep of ghost pages used when jumping many pages at once
 * (e.g. TOC navigation across hundreds of pages).
 */
export function rushPagesTimeline(
  root: HTMLElement,
  pages: HTMLElement[],
  { duration = 0.72, onComplete }: RushPagesOptions = {},
): gsap.core.Timeline {
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    onComplete,
  });
  tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.18 }, 0);
  tl.fromTo(
    pages,
    {
      xPercent: -130,
      rotationY: -70,
      opacity: 0,
      scale: 0.92,
    },
    {
      xPercent: 130,
      rotationY: 60,
      opacity: 0.55,
      scale: 1,
      duration,
      stagger: 0.055,
      ease: 'power1.inOut',
    },
    0.05,
  );
  tl.to(pages, { opacity: 0, duration: 0.12 }, '-=0.15');
  tl.to(root, { opacity: 0, duration: 0.25 }, '-=0.1');
  return tl;
}
