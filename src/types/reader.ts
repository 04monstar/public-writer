import type { StoryMeta } from './story';

/** A pre-measured, pre-broken line of text. */
export interface TextLine {
  kind: 'text';
  text: string;
  blockId: string;
  /** 0-based index of this line inside its paragraph */
  lineInPara: number;
  /** total lines of the paragraph */
  paraLines: number;
  dropCap: boolean;
  indent: boolean;
  /** extra spacing to add when this line opens a paragraph mid-page */
  gap?: number;
}

export interface HeadingRow {
  kind: 'heading';
  blockId: string;
  level: 1 | 2 | 3;
  text: string;
}

export interface ChapterRow {
  kind: 'chapter';
  blockId: string;
  number: number;
  title: string;
  epigraph?: string;
  epigraphAuthor?: string;
}

export interface PoemRow {
  kind: 'poem';
  blockId: string;
  stanzaIndex: number;
  line: string;
  firstOfStanza: boolean;
  lastOfStanza: boolean;
  gap?: number;
}

export interface QuoteRow {
  kind: 'quote';
  blockId: string;
  /** one rendered line of the quotation */
  text: string;
  firstOfBlock: boolean;
  lastOfBlock: boolean;
  author?: string;
  source?: string;
}

export interface ImageRow {
  kind: 'image';
  blockId: string;
  src: string;
  alt: string;
  caption?: string;
  aspect: number;
  fullPage: boolean;
  /** rendered height of the image (before caption) */
  height: number;
  /** true once the intrinsic aspect ratio is known */
  resolved: boolean;
}

export interface TableRow {
  kind: 'table';
  blockId: string;
  title?: string;
  headers: string[];
  cells: string[];
  height: number;
}

export interface ListRow {
  kind: 'list';
  blockId: string;
  ordered: boolean;
  index: number;
  text: string;
  continuation: boolean;
  gap?: number;
}

export interface LetterRow {
  kind: 'letter';
  blockId: string;
  type: 'salutation' | 'body' | 'closing' | 'signature' | 'gap';
  text: string;
  gap?: number;
}

export interface BreakRow {
  kind: 'break';
  blockId: string;
}

export interface SeparatorRow {
  kind: 'separator';
  blockId: string;
  variant: 'asterism' | 'flourish' | 'rule';
}

export type Row =
  | TextLine
  | HeadingRow
  | ChapterRow
  | PoemRow
  | QuoteRow
  | ImageRow
  | TableRow
  | ListRow
  | LetterRow
  | SeparatorRow
  | BreakRow;

export type PageKind =
  | 'body'
  | 'title'
  | 'colophon'
  | 'toc'
  | 'chapterStart'
  | 'illustration'
  | 'end';

export interface Page {
  index: number;
  kind: PageKind;
  /** rows on this page (always present for body/illustration pages) */
  rows: Row[];
  chapterNumber?: number;
  chapterTitle?: string;
  /** toc entries rendered on TOC pages */
  tocEntries?: TocEntry[];
  /** which block ids this page carries (for virtualization keys) */
  blockIds: string[];
  /** word count on the page */
  words: number;
}

export interface ChapterStart {
  chapterNumber: number;
  title: string;
  pageIndex: number;
}

export interface TocEntry {
  chapterNumber: number;
  title: string;
  pageIndex: number;
}

export interface BookLayout {
  meta: StoryMeta;
  pages: Page[];
  toc: TocEntry[];
  titleIndex: number;
  colophonIndex: number;
  tocStartIndex: number;
  bodyStartIndex: number;
  endIndex: number;
  totalWords: number;
  chapterStarts: ChapterStart[];
}

/** Reader settings that change typesetting. */
export interface ReaderSettings {
  fontSize: number;
  lineHeight: number;
  fontFamily: 'serif' | 'elegant' | 'modern' | 'letter';
  margins: 'comfortable' | 'cozy' | 'airy';
  paragraphIndent: boolean;
  dropCaps: boolean;
  justify: boolean;
  themeId: string;
  paperBrightness: number;
  pageTurnSpeed: 'slow' | 'normal' | 'fast';
  pageSound: boolean;
  scrollToTurn: boolean;
  readingSpeed: number;
}
