import { useMemo } from 'react';
import type { Page, Row } from '@/types/reader';
import { useReader } from '../../readerContext';
import { coverOrnament } from '@/data/stories';

interface Segment {
  id: string;
  kind: Row['kind'];
  rows: Row[];
}

function groupRows(rows: Row[]): Segment[] {
  const segments: Segment[] = [];
  for (const row of rows) {
    const last = segments[segments.length - 1];
    if (last && last.kind === row.kind && last.id === row.blockId) {
      last.rows.push(row);
    } else {
      segments.push({ id: row.blockId, kind: row.kind, rows: [row] });
    }
  }
  return segments;
}

function TextSegment({ segment, firstOnPage, page }: { segment: Segment; firstOnPage: boolean; page: Page }) {
  const { settings } = useReader();
  const isChapterOpener = page.kind === 'chapterStart';
  const firstParaOnChapter = isChapterOpener && firstOnPage;
  return (
    <>
      {segment.rows.map((row, i) => {
        const r = row as Extract<Row, { kind: 'text' }>;
        const lastOfPara = r.lineInPara === r.paraLines - 1;
        const indent =
          r.lineInPara === 0 &&
          settings.paragraphIndent &&
          !r.dropCap &&
          !firstParaOnChapter;
        if (r.dropCap) {
          const text = r.text;
          const first = text.charAt(0);
          const rest = text.slice(1);
          return (
            <div key={i} className="text-line is-dropcap">
              <span className="drop-cap">{first}</span>
              {rest}
            </div>
          );
        }
        return (
          <div
            key={i}
            className={`text-line${lastOfPara ? ' is-last-of-para' : ''}`}
            style={indent ? { paddingLeft: '1.7em' } : undefined}
          >
            {r.text}
          </div>
        );
      })}
    </>
  );
}

function PoemSegment({ segment }: { segment: Segment }) {
  return (
    <>
      {segment.rows.map((row, i) => {
        const r = row as Extract<Row, { kind: 'poem' }>;
        return (
          <div
            key={i}
            className="poem-line"
            style={r.firstOfStanza && !r.gap ? { marginTop: '0.9em' } : undefined}
          >
            {r.line}
          </div>
        );
      })}
    </>
  );
}

function QuoteSegment({ segment }: { segment: Segment }) {
  const rows = segment.rows as Extract<Row, { kind: 'quote' }>[];
  const first = rows[0];
  const last = rows[rows.length - 1];
  return (
    <blockquote className="reader-quote">
      {first?.firstOfBlock && <span className="quote-mark">“</span>}
      {rows.map((r, i) => (
        <div key={i} className="text-line is-last-of-para" style={{ whiteSpace: 'pre' }}>
          {r.text}
        </div>
      ))}
      {last?.lastOfBlock && (last.author || last.source) && (
        <div className="quote-attrib">
          {last.author}
          {last.source ? ` — ${last.source}` : ''}
        </div>
      )}
    </blockquote>
  );
}

function HeadingSegment({ segment }: { segment: Segment }) {
  const r = segment.rows[0] as Extract<Row, { kind: 'heading' }>;
  return (
    <div style={{ textAlign: 'center' }}>
      <div className={`reader-heading h${r.level}`}>{r.text}</div>
      <div className="heading-rule" />
    </div>
  );
}

function ChapterSegment({ segment }: { segment: Segment }) {
  const r = segment.rows[0] as Extract<Row, { kind: 'chapter' }>;
  return (
    <div className="chapter-opener">
      <div className="chapter-number">CHAPTER {r.number}</div>
      <h2 className="chapter-title">{r.title}</h2>
      <div className="chapter-divider">
        <img src={coverOrnament(24, 55, 120)} alt="" style={{ height: '1.1em' }} />
      </div>
      {r.epigraph && (
        <>
          <p className="chapter-epigraph">“{r.epigraph}”</p>
          {r.epigraphAuthor && <div className="chapter-epigraph-author">{r.epigraphAuthor}</div>}
        </>
      )}
    </div>
  );
}

function ImageSegment({ segment }: { segment: Segment }) {
  const { metrics } = useReader();
  const r = segment.rows[0] as Extract<Row, { kind: 'image' }>;
  const captionPad = r.caption ? metrics.fontSize * 0.95 : 0;
  const imgH = Math.max(40, r.height - captionPad);
  return (
    <figure className="reader-image" style={{ height: r.height }}>
      <img src={r.src} alt={r.alt} loading="lazy" style={{ height: imgH }} />
      {r.caption && <figcaption>{r.caption}</figcaption>}
    </figure>
  );
}

function TableSegment({ segment }: { segment: Segment }) {
  const rows = segment.rows as Extract<Row, { kind: 'table' }>[];
  const headerRow = rows.find((r) => r.headers.length > 0);
  const bodyRows = rows.filter((r) => r.headers.length === 0);
  return (
    <div className="reader-table-wrap">
      {headerRow?.title && <div className="reader-table-title">{headerRow.title}</div>}
      <table className="reader-table">
        {headerRow && headerRow.headers.length > 0 && (
          <thead>
            <tr>
              {headerRow.headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {bodyRows.map((r, i) => (
            <tr key={i}>
              {r.cells.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListSegment({ segment }: { segment: Segment }) {
  const rows = segment.rows as Extract<Row, { kind: 'list' }>[];
  return (
    <>
      {rows.map((r, i) => (
        <div key={i} className={`reader-list-line${r.continuation ? '' : ' has-marker'}`}>
          {!r.continuation && (
            <span className="list-marker">{r.ordered ? `${r.index + 1}.` : '•'}</span>
          )}
          {r.text}
        </div>
      ))}
    </>
  );
}

function LetterSegment({ segment }: { segment: Segment }) {
  const rows = segment.rows as Extract<Row, { kind: 'letter' }>[];
  const r = rows[0];
  if (!r) return null;
  if (r.type === 'gap') return <div className="letter-gap" />;
  if (r.type === 'signature') {
    return (
      <>
        {rows.map((row, i) => (
          <div key={i} className="letter-signature">
            {row.text}
          </div>
        ))}
      </>
    );
  }
  if (r.type === 'salutation' || r.type === 'closing') {
    return (
      <>
        {rows.map((row, i) => (
          <div key={i} className="letter-salutation">
            {row.text}
          </div>
        ))}
      </>
    );
  }
  return (
    <>
      {rows.map((row, i) => (
        <div key={i} className="letter-body-line">
          {row.text}
        </div>
      ))}
    </>
  );
}

function SeparatorSegment({ segment }: { segment: Segment }) {
  const r = segment.rows[0] as Extract<Row, { kind: 'separator' }>;
  if (r.variant === 'flourish') {
    return (
      <div className="reader-separator">
        <img src={coverOrnament(24, 55, 120)} alt="" />
      </div>
    );
  }
  if (r.variant === 'rule') {
    return (
      <div className="reader-separator" style={{ display: 'block' }}>
        <div style={{ width: '60%', margin: '0 auto', borderTop: '1px solid currentColor', opacity: 0.35 }} />
      </div>
    );
  }
  return <div className="reader-separator">·&ensp;·&ensp;·</div>;
}

function SegmentRenderer({ segment, firstOnPage, page }: { segment: Segment; firstOnPage: boolean; page: Page }) {
  switch (segment.kind) {
    case 'text':
      return <TextSegment segment={segment} firstOnPage={firstOnPage} page={page} />;
    case 'poem':
      return <PoemSegment segment={segment} />;
    case 'quote':
      return <QuoteSegment segment={segment} />;
    case 'heading':
      return <HeadingSegment segment={segment} />;
    case 'chapter':
      return <ChapterSegment segment={segment} />;
    case 'image':
      return <ImageSegment segment={segment} />;
    case 'table':
      return <TableSegment segment={segment} />;
    case 'list':
      return <ListSegment segment={segment} />;
    case 'letter':
      return <LetterSegment segment={segment} />;
    case 'separator':
      return <SeparatorSegment segment={segment} />;
    default:
      return null;
  }
}

/** Renders the body rows of a page (drop caps, poems, quotes, tables…). */
export function PageContent({ page }: { page: Page }) {
  const segments = useMemo(() => groupRows(page.rows), [page.rows]);
  let textSeen = false;
  return (
    <>
      {segments.map((seg, i) => {
        const isFirstText = seg.kind === 'text' && !textSeen;
        if (seg.kind === 'text') textSeen = true;
        return <SegmentRenderer key={`${seg.id}-${i}`} segment={seg} firstOnPage={isFirstText} page={page} />;
      })}
    </>
  );
}
