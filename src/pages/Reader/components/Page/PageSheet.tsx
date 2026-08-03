import type { Page } from '@/types/reader';
import { useReader } from '../../readerContext';
import { PageContent } from './PageContent';
import { SpecialPage } from './SpecialPages';
import { PaperTexture } from '../Paper/PaperTexture';

function toRoman(n: number): string {
  const map: [number, string][] = [
    [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'],
    [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i'],
  ];
  let out = '';
  for (const [v, sym] of map) {
    while (n >= v) {
      out += sym;
      n -= v;
    }
  }
  return out;
}

export function PageNumber({ page }: { page: Page }) {
  const { layout } = useReader();
  if (page.kind === 'title') return null;
  if (page.kind === 'body' || page.kind === 'chapterStart' || page.kind === 'illustration') {
    const n = page.index - layout.bodyStartIndex + 1;
    if (n < 1) return null;
    return <div className="page-number">{n}</div>;
  }
  return <div className="page-number">{toRoman(page.index + 1)}</div>;
}

/**
 * A single sheet of the book: paper, running head, content and folio.
 * `side` controls the outer-corner rounding and inner shadow.
 */
export function PageSheet({ page, side }: { page: Page; side: 'left' | 'right' | 'neutral' }) {
  const { settings } = useReader();
  const isBlank = page.kind === 'body' && page.rows.length === 0;

  let cls = 'page-sheet';
  if (side === 'left') cls += ' left';
  else if (side === 'right') cls += ' right';

  const isSpecial =
    page.kind === 'title' ||
    page.kind === 'colophon' ||
    page.kind === 'toc' ||
    page.kind === 'end';

  return (
    <div className={cls}>
      <PaperTexture />
      <div className="page-edge-top" />
      <div className="page-edge-bottom" />
      {page.chapterTitle && page.kind === 'body' && (
        <div className="running-head">{page.chapterTitle}</div>
      )}
      {isBlank ? (
        <div
          style={{
            position: 'absolute',
            inset: '10%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.35,
          }}
          aria-hidden="true"
        >
          <div style={{ width: '46%', aspectRatio: '1.4', border: '1px solid currentColor', color: 'var(--ink)', borderRadius: 2 }} />
        </div>
      ) : isSpecial || page.kind === 'illustration' ? (
        <SpecialPage page={page} />
      ) : (
        <div className="reader-body" data-justify={settings.justify}>
          <PageContent page={page} />
        </div>
      )}
      <PageNumber page={page} />
    </div>
  );
}
