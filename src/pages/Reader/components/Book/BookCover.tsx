import { useReader } from '../../readerContext';
import { makeArt } from '@/utils/art';

const artCache = new Map<string, string>();
function artFor(hue: number, seed: number, motif: 'ornament' | 'celestial' | 'coast'): string {
  const key = `${motif}-${hue}-${seed}`;
  if (!artCache.has(key)) artCache.set(key, makeArt({ hue, motif, seed }));
  return artCache.get(key)!;
}

/** The physical front cover: art, gold-foil title, embossed author. */
export function BookCover({ width, height }: { width: number; height: number }) {
  const { story, theme } = useReader();
  const meta = story.meta;
  const isDarkCover = theme.id === 'dark' || theme.id === 'night';
  const leather = isDarkCover
    ? 'linear-gradient(135deg, #2a2118 0%, #171310 60%, #0e0b08 100%)'
    : `linear-gradient(135deg, hsl(${meta.coverHue}, 34%, 26%) 0%, hsl(${meta.coverHue}, 36%, 16%) 60%, hsl(${meta.coverHue}, 38%, 10%) 100%)`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width,
        height,
        background: leather,
        padding: '4%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '2.4%',
          border: '1px solid rgba(216,185,106,0.5)',
          borderRadius: '2px 5px 5px 2px',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.4), inset 0 0 46px rgba(0,0,0,0.5)',
        }}
      />
      {/* Top ornament band */}
      <div
        style={{
          position: 'absolute',
          top: '5.5%',
          left: 0,
          right: 0,
          textAlign: 'center',
          letterSpacing: '0.5em',
          fontFamily: 'var(--display)',
          fontSize: '0.56em',
          color: 'rgba(216,185,106,0.85)',
        }}
      >
        {meta.publisher.toUpperCase()}
      </div>
      {/* Illustration plate */}
      <img
        src={artFor(meta.coverHue, 7, 'ornament')}
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '12%',
          left: '14%',
          width: '72%',
          height: '46%',
          objectFit: 'cover',
          borderRadius: 2,
          boxShadow: '0 10px 26px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(216,185,106,0.35)',
        }}
      />
      {/* Gold foil title */}
      <div
        className="cover-foil"
        style={{
          position: 'absolute',
          top: '62%',
          left: '8%',
          right: '8%',
          textAlign: 'center',
          fontFamily: 'var(--display)',
          fontSize: `${Math.min(1.35, (width / 460) * 1.35)}em`,
          fontWeight: 600,
          lineHeight: 1.22,
        }}
      >
        {meta.title}
      </div>
      {meta.subtitle && (
        <div
          style={{
            position: 'absolute',
            top: '74%',
            left: '12%',
            right: '12%',
            textAlign: 'center',
            fontFamily: 'var(--elegant)',
            fontStyle: 'italic',
            fontSize: '0.62em',
            color: 'rgba(240,224,190,0.75)',
          }}
        >
          {meta.subtitle}
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: '80%',
          width: '38%',
          height: 1,
          background: 'rgba(216,185,106,0.55)',
        }}
      />
      <div
        className="cover-emboss"
        style={{
          position: 'absolute',
          bottom: '6%',
          left: 0,
          right: 0,
          textAlign: 'center',
          letterSpacing: '0.42em',
          textTransform: 'uppercase',
          fontFamily: 'var(--display)',
          fontSize: '0.6em',
        }}
      >
        {meta.author}
      </div>
    </div>
  );
}
