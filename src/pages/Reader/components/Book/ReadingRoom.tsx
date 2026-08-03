import { useMemo } from 'react';
import { useReader } from '../../readerContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface DustSpec {
  left: string;
  top: string;
  size: number;
  duration: number;
  delay: number;
  dx: string;
  dy: string;
  op: number;
}

function makeDust(count: number): DustSpec[] {
  const specs: DustSpec[] = [];
  for (let i = 0; i < count; i++) {
    specs.push({
      left: `${5 + Math.random() * 90}%`,
      top: `${8 + Math.random() * 75}%`,
      size: 1 + Math.random() * 2.4,
      duration: 9 + Math.random() * 16,
      delay: -Math.random() * 20,
      dx: `${(Math.random() - 0.5) * 70}px`,
      dy: `${-20 - Math.random() * 90}px`,
      op: 0.15 + Math.random() * 0.35,
    });
  }
  return specs;
}

/**
 * The immersive reading room: wall gradient, table, vignette, floating dust
 * and a soft moving light.
 */
export function ReadingRoom() {
  const { theme } = useReader();
  const reduced = useReducedMotion();
  const dust = useMemo(() => makeDust(reduced ? 0 : 26), [reduced]);

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Walls */}
      <div
        className="absolute inset-0"
        style={{ background: theme.room, transition: 'background 900ms ease' }}
      />
      {/* Wall details: faint shelves / moulding */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '8%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(255,240,210,0.07), transparent)',
        }}
      />
      {/* Table */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: 0,
          height: '42%',
          background: theme.table,
          transition: 'background 900ms ease',
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: '42%',
          height: '6px',
          background:
            'linear-gradient(180deg, rgba(255,240,200,0.10), transparent)',
        }}
      />
      {/* Soft moving light */}
      <div
        className="absolute"
        style={{
          left: '30%',
          top: '18%',
          width: '48%',
          height: '38%',
          background:
            'radial-gradient(closest-side, rgba(255,226,170,0.10), transparent 70%)',
          filter: 'blur(18px)',
          animation: 'lampFlicker 11s ease-in-out infinite',
        }}
      />
      {/* Vignette */}
      <div className="room-vignette" />
      {/* Floating dust */}
      {dust.map((d, i) => (
        <span
          key={i}
          className="dust"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animation: `dustFloat ${d.duration}s linear ${d.delay}s infinite`,
            ['--dx' as string]: d.dx,
            ['--dy' as string]: d.dy,
            ['--dust-op' as string]: d.op,
          }}
        />
      ))}
    </div>
  );
}
