import { useEffect, useRef } from 'react';
import type { Page } from '@/types/reader';
import { useReader } from '../../readerContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { revealIn } from '@/animations';
import { makeArt } from '@/utils/art';
import { coverOrnament } from '@/data/stories';

const artCache = new Map<string, string>();
function coverArt(hue: number, seed: number): string {
  const key = `${hue}-${seed}`;
  if (!artCache.has(key)) artCache.set(key, makeArt({ hue, motif: 'ornament', seed }));
  return artCache.get(key)!;
}

function TitlePage() {
  const { story } = useReader();
  const meta = story.meta;
  return (
    <div style={{ position: 'absolute', inset: '7% 9%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <img src={coverArt(meta.coverHue, 3)} alt="" style={{ width: '58%', marginBottom: '1.4em', borderRadius: 2, boxShadow: '0 6px 22px rgba(0,0,0,0.28)' }} />
      <div style={{ fontFamily: 'var(--display)', fontSize: '2.15em', lineHeight: 1.15, fontWeight: 500, color: 'var(--ink)', marginBottom: '0.25em' }}>
        {meta.title}
      </div>
      {meta.subtitle && (
        <div style={{ fontFamily: 'var(--elegant)', fontStyle: 'italic', fontSize: '1.02em', color: 'color-mix(in srgb, var(--ink) 70%, transparent)', marginBottom: '1.1em' }}>
          {meta.subtitle}
        </div>
      )}
      <div style={{ width: 90, height: 1, background: 'color-mix(in srgb, var(--ink) 40%, transparent)', marginBottom: '1.1em' }} />
      <div style={{ fontFamily: 'var(--display)', letterSpacing: '0.28em', textTransform: 'uppercase', fontSize: '0.82em', color: 'var(--ink)' }}>
        {meta.author}
      </div>
      <div style={{ marginTop: '2.4em', opacity: 0.7 }}>
        <img src={coverOrnament(meta.coverHue % 360, 45, 140)} alt="" style={{ height: '1.1em' }} />
      </div>
      <div style={{ marginTop: '2.2em', fontFamily: 'var(--elegant)', fontSize: '0.78em', letterSpacing: '0.22em', color: 'color-mix(in srgb, var(--ink) 55%, transparent)' }}>
        {meta.publisher} · {meta.edition}
      </div>
      <div style={{ fontFamily: 'var(--elegant)', fontSize: '0.7em', letterSpacing: '0.3em', color: 'color-mix(in srgb, var(--ink) 42%, transparent)', marginTop: '0.4em' }}>
        {meta.year}
      </div>
    </div>
  );
}

function ColophonPage() {
  const { story } = useReader();
  const meta = story.meta;
  return (
    <div style={{ position: 'absolute', inset: '12% 14%', fontFamily: 'var(--elegant)', fontSize: '0.86em', lineHeight: 1.8, color: 'color-mix(in srgb, var(--ink) 78%, transparent)', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--display)', fontSize: '1.1em', letterSpacing: '0.3em', color: 'var(--ink)', marginBottom: '1.6em' }}>
        COLOPHON
      </div>
      <p style={{ margin: '0 0 1.2em' }}>
        This edition of <em style={{ color: 'var(--ink)' }}>{meta.title}</em> was set in Garamond and
        Playfair, printed on ivory laid paper, and bound in cloth at the workshop of{' '}
        {meta.publisher}.
      </p>
      <p style={{ margin: '0 0 1.2em' }}>
        {meta.edition} · {meta.year}
      </p>
      <p style={{ margin: 0, fontSize: '0.8em' }}>
        The type was composed by hand, as all honest type should be.
      </p>
    </div>
  );
}

function TocPage({ page }: { page: Page }) {
  const { goToPage, layout } = useReader();
  const entries = page.tocEntries ?? [];
  return (
    <div style={{ position: 'absolute', inset: '9% 10%', fontFamily: 'var(--serif)' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.6em' }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: '1.4em', letterSpacing: '0.24em', color: 'var(--ink)' }}>
          CONTENTS
        </div>
        <div style={{ width: 64, height: 1, background: 'color-mix(in srgb, var(--ink) 40%, transparent)', margin: '0.6em auto 0' }} />
      </div>
      <div>
        {entries.map((e) => (
          <div
            key={e.chapterNumber}
            className="toc-line"
            onClick={() => goToPage(e.pageIndex)}
            role="link"
            tabIndex={0}
            onKeyDown={(ev) => {
              if (ev.key === 'Enter') goToPage(e.pageIndex);
            }}
          >
            <span className="toc-title" style={{ fontFamily: 'var(--serif)', color: 'var(--ink)', fontSize: '1em' }}>
              {e.chapterNumber}.&nbsp;&nbsp;{e.title}
            </span>
            <span className="toc-dots" />
            <span className="toc-page" style={{ color: 'var(--accent)' }}>{e.pageIndex - layout.bodyStartIndex}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EndPage() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'var(--display)', color: 'var(--ink)' }}>
      <div style={{ fontSize: '1.6em', letterSpacing: '0.4em', marginBottom: '1.2em' }}>THE END</div>
      <img src={coverOrnament(24, 55, 140)} alt="" style={{ height: '1.2em', opacity: 0.7 }} />
    </div>
  );
}

function IllustrationPage({ page }: { page: Page }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current) return;
    const tween = revealIn(ref.current);
    return () => {
      tween.kill();
    };
  }, [reduced]);

  const row = page.rows[0];
  if (!row || row.kind !== 'image') return null;
  const img = row;

  return (
    <div ref={ref} style={{ position: 'absolute', inset: 0 }}>
      <img src={img.src} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      {img.caption && (
        <div style={{ position: 'absolute', bottom: '4%', left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--elegant)', fontSize: '0.72em', letterSpacing: '0.14em', color: 'rgba(255,250,235,0.92)', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>
          {img.caption}
        </div>
      )}
    </div>
  );
}

/** Front-matter / back-matter pages with bespoke layouts. */
export function SpecialPage({ page }: { page: Page }) {
  switch (page.kind) {
    case 'title':
      return <TitlePage />;
    case 'colophon':
      return <ColophonPage />;
    case 'toc':
      return <TocPage page={page} />;
    case 'end':
      return <EndPage />;
    case 'illustration':
      return <IllustrationPage page={page} />;
    default:
      return null;
  }
}
