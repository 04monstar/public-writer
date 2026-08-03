export type StoryType =
  | 'novel'
  | 'poem'
  | 'essay'
  | 'letter'
  | 'children'
  | 'illustrated'
  | 'article';

export interface CoverArt {
  src: string;
  alt: string;
}

/** Every kind of content block that can appear in a story. */
export type StoryBlock =
  | {
      kind: 'paragraph';
      id: string;
      text: string;
      dropCap?: boolean;
      indent?: boolean;
    }
  | { kind: 'heading'; id: string; level: 1 | 2 | 3; text: string }
  | {
      kind: 'chapter';
      id: string;
      number: number;
      title: string;
      epigraph?: string;
      epigraphAuthor?: string;
    }
  | { kind: 'poem'; id: string; title?: string; stanzas: string[][] }
  | { kind: 'quote'; id: string; text: string; author?: string; source?: string }
  | {
      kind: 'image';
      id: string;
      src: string;
      alt: string;
      caption?: string;
      aspect: number;
      fullPage?: boolean;
    }
  | { kind: 'table'; id: string; title?: string; headers: string[]; rows: string[][] }
  | { kind: 'list'; id: string; ordered?: boolean; items: string[] }
  | {
      kind: 'letter';
      id: string;
      salutation?: string;
      paragraphs: string[];
      closing?: string;
      signature?: string;
    }
  | { kind: 'separator'; id: string; variant?: 'asterism' | 'flourish' | 'rule' }
  | { kind: 'break'; id: string };

export interface ChapterMeta {
  id: string;
  number: number;
  title: string;
}

export interface StoryMeta {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  publisher: string;
  edition: string;
  year: number;
  description: string;
  type: StoryType;
  genre: string;
  coverHue: number;
  coverArt?: CoverArt | null;
  chapters: ChapterMeta[];
  /** words per minute assumed for estimated reading time */
  readingSpeed: number;
}

export interface Story {
  id: string;
  meta: StoryMeta;
  blocks: StoryBlock[];
}
