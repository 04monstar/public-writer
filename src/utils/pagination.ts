import type { ReaderSettings } from '@/types/reader';
import type { StoryBlock, StoryMeta } from '@/types/story';
import type {
  BookLayout,
  ChapterRow,
  HeadingRow,
  ImageRow,
  LetterRow,
  ListRow,
  Page,
  PageKind,
  PoemRow,
  QuoteRow,
  Row,
  SeparatorRow,
  TableRow,
  TextLine,
  TocEntry,
} from '@/types/reader';
import { FONT_STACKS, TextMeasurer, wordCount } from './text';

export interface PageMetrics {
  pageWidth: number;
  pageHeight: number;
  contentWidth: number;
  contentHeight: number;
  marginX: number;
  marginTop: number;
  marginBottom: number;
  fontSize: number;
  lineHeight: number;
  paraGap: number;
  font: string;
  displayFont: string;
  mode: 'spread' | 'single';
  dropCaps: boolean;
}

export function computeMetrics(
  pageWidth: number,
  pageHeight: number,
  settings: ReaderSettings,
  mode: 'spread' | 'single',
): PageMetrics {
  const mX =
    pageWidth * (settings.margins === 'cozy' ? 0.09 : settings.margins === 'airy' ? 0.16 : 0.12);
  const mTop = pageHeight * (settings.margins === 'cozy' ? 0.07 : settings.margins === 'airy' ? 0.12 : 0.1);
  const mBottom = pageHeight * (settings.margins === 'airy' ? 0.16 : 0.12);
  const fontSize = settings.fontSize;
  const lineHeight = fontSize * settings.lineHeight;
  const stack = FONT_STACKS[settings.fontFamily] ?? FONT_STACKS.serif;
  return {
    pageWidth,
    pageHeight,
    contentWidth: pageWidth - mX * 2,
    contentHeight: pageHeight - mTop - mBottom,
    marginX: mX,
    marginTop: mTop,
    marginBottom: mBottom,
    fontSize,
    lineHeight,
    paraGap: fontSize * 0.55,
    font: `400 ${fontSize}px ${stack}`,
    displayFont: `500 ${fontSize}px ${FONT_STACKS.display}`,
    mode,
    dropCaps: settings.dropCaps,
  };
}

export interface Group {
  blockId: string;
  kind: Row['kind'];
  rows: Row[];
  heights?: number[];
  height?: number;
  words: number;
  splittable: boolean;
  wholeIfFitsPage: boolean;
  granular: 'line' | 'whole';
}

const EPS = 0.5;

/** Flatten story blocks into splittable groups ready for pagination. */
function flatten(blocks: StoryBlock[], m: TextMeasurer, pm: PageMetrics): Group[] {
  const groups: Group[] = [];
  const size = pm.fontSize;
  const lh = pm.lineHeight;

  const textGroup = (block: Extract<StoryBlock, { kind: 'paragraph' }>): Group => {
    const lines = m.breakLines(block.text, pm.font, pm.contentWidth);
    const dropCap = !!block.dropCap && pm.dropCaps;
    const heights = lines.map((_, i) =>
      i === 0 && dropCap ? size * (pm.lineHeight + 0.65) : lh,
    );
    const rows: TextLine[] = lines.map((text, i) => ({
      kind: 'text',
      text,
      blockId: block.id,
      lineInPara: i,
      paraLines: lines.length,
      dropCap: i === 0 && dropCap,
      indent: !!block.indent && !dropCap,
      gap: i === 0 ? pm.paraGap : undefined,
    }));
    return {
      blockId: block.id,
      kind: 'text',
      rows,
      heights,
      words: wordCount(block.text),
      splittable: true,
      wholeIfFitsPage: true,
      granular: 'line',
    };
  };

  for (const block of blocks) {
    switch (block.kind) {
      case 'paragraph':
        groups.push(textGroup(block));
        break;

      case 'chapter': {
        const titleSize = size * 2.1;
        const titleLh = titleSize * 1.22;
        const titleLines = m.breakLines(block.title, `500 ${titleSize}px ${FONT_STACKS.display}`, pm.contentWidth);
        let height = size * 1.1 + titleLines.length * titleLh + size * 1.3;
        if (block.epigraph) {
          const epiLines = m.breakLines(block.epigraph, pm.font, pm.contentWidth * 0.8);
          height += epiLines.length * lh + (block.epigraphAuthor ? lh : 0) + size * 1.4;
        }
        const row: ChapterRow = {
          kind: 'chapter',
          blockId: block.id,
          number: block.number,
          title: block.title,
          epigraph: block.epigraph,
          epigraphAuthor: block.epigraphAuthor,
        };
        groups.push({
          blockId: block.id,
          kind: 'chapter',
          rows: [row],
          height,
          words: wordCount(block.title),
          splittable: false,
          wholeIfFitsPage: true,
          granular: 'whole',
        });
        break;
      }

      case 'break':
        groups.push({
          blockId: block.id,
          kind: 'break',
          rows: [],
          height: 0,
          words: 0,
          splittable: false,
          wholeIfFitsPage: true,
          granular: 'whole',
        });
        break;

      case 'heading': {
        const isH2 = block.level === 2;
        const hSize = size * (isH2 ? 1.55 : 1.2);
        const hLh = hSize * 1.3;
        const lines = m.breakLines(block.text, `500 ${hSize}px ${FONT_STACKS.display}`, pm.contentWidth);
        const row: HeadingRow = {
          kind: 'heading',
          blockId: block.id,
          level: block.level,
          text: block.text,
        };
        groups.push({
          blockId: block.id,
          kind: 'heading',
          rows: [row],
          height: lines.length * hLh + size * 0.9,
          words: wordCount(block.text),
          splittable: false,
          wholeIfFitsPage: true,
          granular: 'whole',
        });
        break;
      }

      case 'poem': {
        if (block.title) {
          const row: HeadingRow = { kind: 'heading', blockId: block.id, level: 2, text: block.title };
          groups.push({
            blockId: block.id,
            kind: 'heading',
            rows: [row],
            height: size * 1.6 * 1.4 + size,
            words: wordCount(block.title),
            splittable: false,
            wholeIfFitsPage: true,
            granular: 'whole',
          });
        }
        block.stanzas.forEach((stanza, stanzaIndex) => {
          const heights: number[] = [];
          const rows: PoemRow[] = stanza.map((line, lineIdx) => {
            heights.push(lh);
            return {
              kind: 'poem',
              blockId: block.id,
              stanzaIndex,
              line,
              firstOfStanza: lineIdx === 0,
              lastOfStanza: lineIdx === stanza.length - 1,
              gap: lineIdx === 0 ? lh * 0.8 : undefined,
            };
          });
          groups.push({
            blockId: block.id,
            kind: 'poem',
            rows,
            heights,
            words: wordCount(stanza.join(' ')),
            splittable: true,
            wholeIfFitsPage: true,
            granular: 'line',
          });
        });
        break;
      }

      case 'quote': {
        const lines = m.breakLines(block.text, pm.font, pm.contentWidth * 0.86);
        const heights = lines.map((_, i) => {
          const pad = i === 0 || i === lines.length - 1 ? size * 0.55 : 0;
          return lh + pad;
        });
        const rows: QuoteRow[] = lines.map((text, i) => ({
          kind: 'quote',
          blockId: block.id,
          text,
          firstOfBlock: i === 0,
          lastOfBlock: i === lines.length - 1,
          author: block.author,
          source: block.source,
        }));
        groups.push({
          blockId: block.id,
          kind: 'quote',
          rows,
          heights,
          words: wordCount(block.text),
          splittable: true,
          wholeIfFitsPage: true,
          granular: 'line',
        });
        break;
      }

      case 'image': {
        const fullPage = !!block.fullPage;
        const captionPad = block.caption ? size * 0.95 : 0;
        const height = fullPage ? pm.pageHeight : pm.contentWidth / block.aspect + captionPad;
        const row: ImageRow = {
          kind: 'image',
          blockId: block.id,
          src: block.src,
          alt: block.alt,
          caption: block.caption,
          aspect: block.aspect,
          fullPage,
          height,
          resolved: true,
        };
        groups.push({
          blockId: block.id,
          kind: 'image',
          rows: [row],
          height,
          words: 0,
          splittable: false,
          wholeIfFitsPage: true,
          granular: 'whole',
        });
        break;
      }

      case 'table': {
        const rowHeight = size * 1.55;
        const mk = (headers: string[], cells: string[]): TableRow => ({
          kind: 'table',
          blockId: block.id,
          title: block.title,
          headers,
          cells,
          height: rowHeight,
        });
        const chunkRows = (headers: string[], cells: string[]): Group => ({
          blockId: block.id,
          kind: 'table',
          rows: [mk(headers, cells)],
          height: rowHeight,
          words: wordCount(cells.join(' ')),
          splittable: false,
          wholeIfFitsPage: true,
          granular: 'whole',
        });
        if (block.title || block.headers.length) {
          groups.push(chunkRows(block.headers, []));
        }
        for (const row of block.rows) groups.push(chunkRows([], row));
        break;
      }

      case 'list': {
        block.items.forEach((item, idx) => {
          const lines = m.breakLines(item, pm.font, pm.contentWidth - size * 2.4);
          const heights = lines.map(() => lh);
          const rows: ListRow[] = lines.map((text, i) => ({
            kind: 'list',
            blockId: block.id,
            ordered: !!block.ordered,
            index: idx,
            text,
            continuation: i > 0,
            gap: i === 0 ? size * 0.55 : undefined,
          }));
          groups.push({
            blockId: block.id,
            kind: 'list',
            rows,
            heights,
            words: wordCount(item),
            splittable: true,
            wholeIfFitsPage: true,
            granular: 'line',
          });
        });
        break;
      }

      case 'letter': {
        const letterGroup = (type: LetterRow['type'], text: string, h: number): Group => ({
          blockId: block.id,
          kind: 'letter',
          rows: [{ kind: 'letter', blockId: block.id, type, text }],
          height: h,
          words: wordCount(text),
          splittable: false,
          wholeIfFitsPage: true,
          granular: 'whole',
        });
        if (block.salutation) groups.push(letterGroup('salutation', block.salutation, size * 1.4));
        groups.push(letterGroup('gap', '', size * 0.6));
        for (const para of block.paragraphs) {
          const lines = m.breakLines(para, pm.font, pm.contentWidth);
          const heights = lines.map(() => lh);
          const rows: LetterRow[] = lines.map((text, i) => ({
            kind: 'letter',
            blockId: block.id,
            type: 'body',
            text,
            gap: i === 0 ? size * 0.55 : undefined,
          }));
          groups.push({
            blockId: block.id,
            kind: 'letter',
            rows,
            heights,
            words: wordCount(para),
            splittable: true,
            wholeIfFitsPage: true,
            granular: 'line',
          });
          groups.push(letterGroup('gap', '', size * 0.55));
        }
        if (block.closing) groups.push(letterGroup('closing', block.closing, size * 1.3));
        if (block.signature) groups.push(letterGroup('signature', block.signature, size * 1.6));
        break;
      }

      case 'separator': {
        const row: SeparatorRow = {
          kind: 'separator',
          blockId: block.id,
          variant: block.variant ?? 'asterism',
        };
        groups.push({
          blockId: block.id,
          kind: 'separator',
          rows: [row],
          height: size * 1.7,
          words: 0,
          splittable: false,
          wholeIfFitsPage: true,
          granular: 'whole',
        });
        break;
      }
    }
  }
  return groups;
}

interface PendingPage {
  kind: PageKind;
  rows: Row[];
  words: number;
  blockIds: Set<string>;
  chapterNumber?: number;
  chapterTitle?: string;
}

function makePage(pp: PendingPage, index: number): Page {
  return {
    index,
    kind: pp.kind,
    rows: pp.rows,
    words: pp.words,
    blockIds: [...pp.blockIds],
    chapterNumber: pp.chapterNumber,
    chapterTitle: pp.chapterTitle,
  };
}

const blankPage = (index: number): Page => ({
  index,
  kind: 'body',
  rows: [],
  words: 0,
  blockIds: [],
});

function paginateBody(groups: Group[], pm: PageMetrics): { pages: Page[]; chapterStarts: { chapterNumber: number; title: string; pageIndex: number }[] } {
  const pages: Page[] = [];
  const chapterStarts: { chapterNumber: number; title: string; pageIndex: number }[] = [];
  let pending: PendingPage | null = null;
  let rem = pm.contentHeight;

  const flush = (forceKind?: PageKind) => {
    if (pending && (pending.rows.length > 0 || pending.kind !== 'body')) {
      pages.push(makePage(pending, pages.length));
    }
    pending = { kind: forceKind ?? 'body', rows: [], words: 0, blockIds: new Set() };
    rem = pm.contentHeight;
  };

  const ensureRecto = () => {
    if (pm.mode === 'single') return;
    if (pages.length % 2 === 0) {
      pages.push(blankPage(pages.length));
    }
  };

  const rowGap = (row: Row): number => (row as { gap?: number }).gap ?? 0;

  const placeRows = (rows: Row[], words: number) => {
    if (!pending) flush();
    if (!pending) return;
    for (const row of rows) {
      pending.rows.push(row);
      if (row.blockId) pending.blockIds.add(row.blockId);
    }
    pending.words += words;
  };

  let i = 0;
  while (i < groups.length) {
    const g = groups[i]!;
    if (g.kind === 'break') {
      if (pending && pending.rows.length > 0) flush();
      i++;
      continue;
    }
    if (g.kind === 'chapter') {
      if (pending && pending.rows.length > 0) flush();
      ensureRecto();
      pending = {
        kind: 'chapterStart',
        rows: [],
        words: 0,
        blockIds: new Set([g.blockId]),
        chapterNumber: (g.rows[0] as ChapterRow).number,
        chapterTitle: (g.rows[0] as ChapterRow).title,
      };
      pending.rows.push(g.rows[0] as ChapterRow);
      pending.words += g.words;
      rem = pm.contentHeight - (g.height ?? 0);
      chapterStarts.push({
        chapterNumber: (g.rows[0] as ChapterRow).number,
        title: (g.rows[0] as ChapterRow).title,
        pageIndex: pages.length,
      });
      i++;
      continue;
    }

    const total = g.height ?? (g.heights ?? []).reduce((a, b) => a + b, 0);

    // Illustration pages (full page images) force their own page.
    if (g.kind === 'image' && (g.rows[0] as ImageRow).fullPage) {
      if (pending && pending.rows.length > 0) flush();
      ensureRecto();
      pending = { kind: 'illustration', rows: [], words: 0, blockIds: new Set([g.blockId]) };
      pending.rows.push(g.rows[0] as ImageRow);
      rem = 0;
      flush();
      i++;
      continue;
    }

    if (total <= rem + EPS) {
      const atTop = !pending || pending.rows.length === 0;
      const gap = atTop || !g.rows[0] ? 0 : rowGap(g.rows[0]);
      if (!atTop && total + gap > rem + EPS) {
        flush();
      }
      placeRows(g.rows, g.words);
      const finalAtTop = !pending || pending.rows.length === g.rows.length;
      rem -= total + (finalAtTop ? 0 : gap);
      i++;
      continue;
    }

    if (g.wholeIfFitsPage && total <= pm.contentHeight + EPS) {
      if (pending && pending.rows.length > 0) flush();
      placeRows(g.rows, g.words);
      rem -= total;
      i++;
      continue;
    }

    // The group must be split (splittable, line granular, taller than a page).
    if (g.splittable && g.granular === 'line' && g.rows.length > 0) {
      const rows = g.rows;
      const heights = g.heights ?? [];
      let consumed = 0;
      while (consumed < rows.length) {
        const rest = rows.length - consumed;
        if (rest === 0) break;
        let k = 0;
        let used = 0;
        while (consumed + k < rows.length && used + (heights[consumed + k] ?? 0) <= rem + EPS) {
          used += heights[consumed + k] ?? 0;
          k++;
        }
        if (k === 0) {
          if (pending && pending.rows.length > 0) flush();
          if (rest >= 1) {
            while (consumed + k < rows.length && used + (heights[consumed + k] ?? 0) <= rem + EPS) {
              used += heights[consumed + k] ?? 0;
              k++;
            }
          }
          if (k === 0) {
            consumed = rows.length;
            break;
          }
        }
        // widow / orphan guards
        if (rest > 1) {
          if (k === 1) k = 0;
          if (k === rest - 1) k = Math.max(0, k - 1);
        }
        if (k === 0) {
          if (pending && pending.rows.length > 0) flush();
          continue;
        }
        // Apply the opening gap for the first row when not at the top of a page.
        const atTop = !pending || pending.rows.length === 0;
        const gap = atTop ? 0 : (k > 0 ? rowGap(rows[consumed]!) : 0);
        if (used + gap > rem + EPS && k > 1) k--;
        for (let j = 0; j < k; j++) {
          const row = rows[consumed + j]!;
          if (!pending) flush();
          if (!pending) break;
          pending.rows.push(row);
          if (row.blockId) pending.blockIds.add(row.blockId);
          if (row.kind === 'text') pending.words += wordCount(row.text);
          else if (row.kind === 'poem') pending.words += wordCount(row.line);
          else if (row.kind === 'quote') pending.words += wordCount(row.text);
          else if (row.kind === 'list') pending.words += wordCount(row.text);
          else if (row.kind === 'letter') pending.words += wordCount(row.text);
        }
        const appliedGap = atTop || !pending ? 0 : gap;
        rem -= used + appliedGap;
        consumed += k;
        if (consumed < rows.length) flush();
      }
      i++;
      continue;
    }

    // Unbreakable whole group taller than remaining AND taller than a page.
    if (g.kind === 'image') {
      if (pending && pending.rows.length > 0) flush();
      const img = g.rows[0] as ImageRow;
      const maxH = pm.contentHeight;
      const scaled = Math.min(img.height, maxH);
      const capRow: ImageRow = { ...img, height: scaled };
      g.rows[0] = capRow;
      placeRows(g.rows, g.words);
      rem -= scaled;
      i++;
      continue;
    }

    // Fallback: place whole on a fresh page.
    if (pending && pending.rows.length > 0) flush();
    placeRows(g.rows, g.words);
    rem -= total;
    i++;
  }

  if (pending && pending.rows.length > 0) pages.push(makePage(pending, pages.length));
  return { pages, chapterStarts };
}

function buildTocPages(
  toc: TocEntry[],
  pm: PageMetrics,
): Page[] {
  const size = pm.fontSize;
  const lh = size * 1.9;
  const entriesPerPage = Math.max(4, Math.floor(pm.contentHeight / lh) - 2);
  const pages: Page[] = [];
  for (let start = 0; start < toc.length; start += entriesPerPage) {
    const entries = toc.slice(start, start + entriesPerPage);
    pages.push({
      index: 0,
      kind: 'toc',
      rows: [],
      words: 0,
      blockIds: [],
      tocEntries: entries,
    });
  }
  return pages.map((p, i) => ({ ...p, index: i }));
}

/**
 * Full pagination pipeline: front matter + body + back matter.
 * Synchronous and pure — callers should memoize by input key.
 */
export function paginateStory(
  blocks: StoryBlock[],
  meta: StoryMeta,
  m: TextMeasurer,
  pm: PageMetrics,
): BookLayout {
  return assembleLayout(flattenBlocks(blocks, m, pm), meta, pm);
}

/** Flatten a slice of blocks, appending groups to `out`. */
export function flattenBlocks(
  blocks: StoryBlock[],
  m: TextMeasurer,
  pm: PageMetrics,
  out: Group[] = [],
): Group[] {
  const groups = flatten(blocks, m, pm);
  out.push(...groups);
  return out;
}

/** Assemble a full layout from pre-flattened groups. */
export function assembleLayout(
  groups: Group[],
  meta: StoryMeta,
  pm: PageMetrics,
): BookLayout {
  const { pages: bodyPages, chapterStarts } = paginateBody(groups, pm);

  const toc: TocEntry[] = chapterStarts.map((cs, i) => ({
    chapterNumber: cs.chapterNumber,
    title: cs.title,
    pageIndex: i + 1,
  }));

  const tocPages = buildTocPages(toc, pm);
  const bodyStartIndex = 3 + tocPages.length;

  const frontMatter: Page[] = [
    { index: 0, kind: 'title', rows: [], words: 0, blockIds: [] },
    { index: 1, kind: 'colophon', rows: [], words: 0, blockIds: [] },
  ];
  const shiftedToc = toc.map((t) => ({ ...t, pageIndex: bodyStartIndex + (t.pageIndex - 1) }));
  const shiftedStarts = chapterStarts.map((cs) => ({
    chapterNumber: cs.chapterNumber,
    title: cs.title,
    pageIndex: bodyStartIndex + cs.pageIndex,
  }));

  const allPages: Page[] = [];
  let cursor = 0;
  const push = (pages: Page[]) => {
    for (const p of pages) {
      allPages.push({ ...p, index: cursor });
      cursor++;
    }
  };
  push(frontMatter);
  push(tocPages);
  push(bodyPages.map((p) => ({ ...p })));

  const endIndex = allPages.length;
  allPages.push({ index: cursor, kind: 'end', rows: [], words: 0, blockIds: [] });
  cursor++;

  const totalWords = groups.reduce((a, g) => a + g.words, 0);

  return {
    meta,
    pages: allPages,
    toc: shiftedToc,
    titleIndex: 1,
    colophonIndex: 2,
    tocStartIndex: 3,
    bodyStartIndex,
    endIndex,
    totalWords,
    chapterStarts: shiftedStarts,
  };
}

/** Build the input key so callers can cache layouts cheaply. */
export function paginationKey(settings: ReaderSettings, pageWidth: number, pageHeight: number, mode: 'spread' | 'single'): string {
  return `${settings.fontFamily}|${settings.fontSize}|${settings.lineHeight}|${settings.margins}|${settings.dropCaps ? 1 : 0}|${Math.round(pageWidth)}x${Math.round(pageHeight)}|${mode}`;
}
