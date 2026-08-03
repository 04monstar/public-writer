import { useReader } from '../../readerContext';

/** The book spine with raised bands and a gilt title. */
export function BookSpine({ width, height }: { width: number; height: number }) {
  const { story } = useReader();
  const meta = story.meta;
  const isDark = story.meta.coverHue < 40;
  const leather = isDark
    ? 'linear-gradient(90deg, #1c1410 0%, #2c2118 40%, #3a2d20 50%, #2c2118 60%, #1c1410 100%)'
    : `linear-gradient(90deg, hsl(${meta.coverHue}, 40%, 8%) 0%, hsl(${meta.coverHue}, 38%, 20%) 40%, hsl(${meta.coverHue}, 38%, 24%) 50%, hsl(${meta.coverHue}, 38%, 20%) 60%, hsl(${meta.coverHue}, 40%, 8%) 100%)`;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        background: leather,
        borderRadius: '4px 0 0 4px',
        boxShadow: 'inset -6px 0 10px rgba(0,0,0,0.5), inset 2px 0 2px rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6% 0',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
        <div style={{ height: width * 0.16, width: '86%', background: 'rgba(216,185,106,0.55)', borderRadius: 1 }} />
        <div style={{ height: width * 0.16, width: '86%', background: 'rgba(216,185,106,0.55)', borderRadius: 1 }} />
      </div>
      <div
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontFamily: 'var(--display)',
          fontSize: `${Math.min(0.82, (height / 640) * 0.82)}em`,
          letterSpacing: '0.24em',
          color: '#d8b96a',
          textShadow: '0 1px 0 rgba(255,255,255,0.12), 0 -1px 2px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
        }}
      >
        {meta.title.toUpperCase()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em' }}>
        <div style={{ height: width * 0.16, width: '86%', background: 'rgba(216,185,106,0.55)', borderRadius: 1 }} />
        <div style={{ height: width * 0.16, width: '86%', background: 'rgba(216,185,106,0.55)', borderRadius: 1 }} />
      </div>
    </div>
  );
}
