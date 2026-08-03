import { useCallback, useRef, useState } from 'react';
import gsap from 'gsap';
import { clamp } from '@/utils/text';
import { sound } from '@/utils/audio';

export type TurnDirection = 1 | -1;

interface DragState {
  startX: number;
  startY: number;
  startTime: number;
  /** the leaf's unrotated rect, captured at drag start so angle feedback can't corrupt it */
  homeRect: DOMRect;
}

export function usePageTurn(opts: {
  leafRef: React.RefObject<HTMLDivElement | null>;
  duration: number;
  reduced: boolean;
  soundOn: boolean;
  onTurnStart: (dir: TurnDirection) => void;
  onTurnEnd: (dir: TurnDirection) => void;
  onTurnCancel?: () => void;
  canTurn: (dir: TurnDirection) => boolean;
}) {
  const { leafRef, duration, reduced, soundOn } = opts;
  const dirRef = useRef<TurnDirection>(1);
  const angleRef = useRef(0);
  const busyRef = useRef(false);
  const dragRef = useRef<DragState | null>(null);
  const finishRef = useRef<(() => void) | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const hideLeaf = useCallback(() => {
    const el = leafRef.current;
    if (!el) return;
    gsap.set(el, { rotationY: 0, opacity: 0, pointerEvents: 'none' });
  }, [leafRef]);

  const settle = useCallback(
    (to: number) => {
      const el = leafRef.current;
      if (!el) return;
      const from = angleRef.current;
      const frac = Math.abs(to - from) / 180;
      const dur = reduced ? 0.001 : Math.max(0.28, duration * (0.4 + frac * 0.6));
      const finish = finishRef.current;
      gsap.to(el, {
        rotationY: to,
        duration: dur,
        ease: 'power2.inOut',
        onUpdate() {
          const ang = gsap.getProperty(el, 'rotationY') as number;
          angleRef.current = ang;
          el.style.setProperty('--curl', (Math.abs(ang) / 180).toFixed(3));
        },
        onComplete() {
          angleRef.current = to;
          busyRef.current = false;
          setIsBusy(false);
          finishRef.current = null;
          finish?.();
        },
      });
    },
    [duration, reduced, hideLeaf],
  );

  const startTurn = useCallback(
    (dir: TurnDirection) => {
      if (busyRef.current || dragRef.current) return;
      if (!opts.canTurn(dir)) return;
      dirRef.current = dir;
      opts.onTurnStart(dir);
      if (reduced) {
        // Skip animation, commit immediately.
        opts.onTurnEnd(dir);
        return;
      }
      busyRef.current = true;
      setIsBusy(true);
      finishRef.current = () => opts.onTurnEnd(dir);
      const el = leafRef.current;
      if (el) {
        gsap.set(el, { rotationY: 0, opacity: 1, pointerEvents: 'none' });
        el.style.setProperty('--curl', '0');
      }
      settle(dir === 1 ? -180 : 180);
      if (soundOn) sound.pageTurn();
    },
    [reduced, settle, leafRef, soundOn, opts],
  );

  const forward = useCallback(() => startTurn(1), [startTurn]);
  const backward = useCallback(() => startTurn(-1), [startTurn]);

  const beginDrag = useCallback(
    (dir: TurnDirection, x: number, y: number) => {
      if (busyRef.current) return;
      if (!opts.canTurn(dir)) return;
      dirRef.current = dir;
      opts.onTurnStart(dir);
      const el = leafRef.current;
      if (el) {
        gsap.killTweensOf(el);
        gsap.set(el, { rotationY: 0, opacity: 1, pointerEvents: 'none' });
        el.style.setProperty('--curl', '0');
      }
      const homeRect = el ? el.getBoundingClientRect() : null;
      if (!homeRect) return;
      dragRef.current = { startX: x, startY: y, startTime: performance.now(), homeRect };
      busyRef.current = true;
      setIsBusy(true);
      finishRef.current = () => opts.onTurnEnd(dir);
    },
    [busyRef, opts, leafRef],
  );

  const moveDrag = useCallback(
    (x: number, y: number) => {
      const drag = dragRef.current;
      const el = leafRef.current;
      if (!drag || !el) return;
      const rect = drag.homeRect;
      const dir = dirRef.current;
      const freeEdge = dir === 1 ? rect.left + rect.width : rect.left;
      const travel = Math.abs(freeEdge - x);
      const p = clamp(travel / rect.width, 0, 1);
      const angle = (dir === 1 ? -1 : 1) * p * 180;
      const dy = y - drag.startY;
      gsap.set(el, {
        rotationY: angle,
        skewX: clamp(dy * 0.06, -3, 3),
        y: clamp(dy * 0.12, -14, 14),
      });
      el.style.setProperty('--curl', p.toFixed(3));
      angleRef.current = angle;
      if (soundOn && Math.abs(angle) % 40 < 6) sound.pageDrag();
    },
    [soundOn],
  );

  const endDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    const dir = dirRef.current;
    const el = leafRef.current;
    const p = Math.abs(angleRef.current) / 180;
    const elapsed = performance.now() - drag.startTime;
    if (p > 0.5 || (p < 0.04 && elapsed < 350)) {
      // Commit the turn (a quick tap counts as a forward turn).
      const target = dir === 1 ? -180 : 180;
      const frac = Math.abs(target - angleRef.current) / 180;
      const dur = reduced ? 0.001 : Math.max(0.3, duration * (0.35 + frac * 0.65));
      gsap.killTweensOf(el);
      gsap.to(el, {
        rotationY: target,
        skewX: 0,
        y: 0,
        duration: dur,
        ease: 'power2.out',
        onUpdate() {
          if (!el) return;
          const ang = gsap.getProperty(el, 'rotationY') as number;
          angleRef.current = ang;
          el.style.setProperty('--curl', (Math.abs(ang) / 180).toFixed(3));
        },
        onComplete() {
          busyRef.current = false;
          setIsBusy(false);
          const finish = finishRef.current;
          finishRef.current = null;
          finish?.();
        },
      });
      if (soundOn) sound.pageTurn();
    } else {
      // Return to rest.
      gsap.killTweensOf(el);
      gsap.to(el, {
        rotationY: 0,
        skewX: 0,
        y: 0,
        duration: reduced ? 0.001 : 0.5,
        ease: 'power3.out',
        onUpdate() {
          if (!el) return;
          const ang = gsap.getProperty(el, 'rotationY') as number;
          angleRef.current = ang;
          el.style.setProperty('--curl', (Math.abs(ang) / 180).toFixed(3));
        },
        onComplete() {
          busyRef.current = false;
          setIsBusy(false);
          finishRef.current = null;
          hideLeaf();
          opts.onTurnCancel?.();
        },
      });
    }
  }, [reduced, soundOn, leafRef, hideLeaf, opts]);

  const cancelDrag = useCallback(() => {
    dragRef.current = null;
    if (busyRef.current && finishRef.current) {
      finishRef.current = null;
    }
    const el = leafRef.current;
    if (el) {
      gsap.killTweensOf(el);
      gsap.set(el, { rotationY: 0, skewX: 0, y: 0, opacity: 0 });
    }
    busyRef.current = false;
    setIsBusy(false);
    opts.onTurnCancel?.();
  }, [leafRef, opts]);

  return {
    forward,
    backward,
    beginDrag,
    moveDrag,
    endDrag,
    cancelDrag,
    isBusy,
    angleRef,
    dirRef,
  };
}
