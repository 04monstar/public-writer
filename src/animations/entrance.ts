import gsap from 'gsap';

/**
 * Entrance animation for the closed book settling onto the desk.
 * Runs once when the book first appears after typesetting.
 */
export function bookEntrance(el: HTMLElement): gsap.core.Tween {
  return gsap.fromTo(
    el,
    { opacity: 0, y: 30, scale: 0.97 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
      ease: 'power2.out',
      clearProps: 'y,scale',
    },
  );
}
