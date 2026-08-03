import { useEffect, useRef } from 'react';

type Handler = (e: KeyboardEvent) => void;

export function useKeyboard(
  keymap: Record<string, Handler | undefined>,
  enabled = true,
) {
  const ref = useRef(keymap);
  ref.current = keymap;

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const handler = ref.current[e.key];
      if (handler) {
        const target = e.target as HTMLElement | null;
        const typing =
          target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
        if (typing) return;
        handler(e);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
