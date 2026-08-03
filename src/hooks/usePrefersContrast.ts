import { useEffect, useState } from 'react';

export function usePrefersContrast(): boolean {
  const [high, setHigh] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-contrast: more)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-contrast: more)');
    const onChange = () => setHigh(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return high;
}
