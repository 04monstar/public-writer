import { createContext, useContext } from 'react';
import type { Story } from '@/types/story';
import type { BookLayout, Page, ReaderSettings } from '@/types/reader';
import type { ReadingTheme } from '@/types/themes';
import type { PageMetrics } from '@/utils/pagination';

export interface ReaderContextValue {
  story: Story;
  layout: BookLayout;
  settings: ReaderSettings;
  theme: ReadingTheme;
  pageWidth: number;
  pageHeight: number;
  metrics: PageMetrics;
  mode: 'spread' | 'single';
  reduced: boolean;
  current: number;
  activePage: Page;
  activeIndex: number;
  goToPage: (index: number) => void;
  toggleBookmark: (index?: number) => void;
  bookmarks: number[];
}

export const ReaderContext = createContext<ReaderContextValue | null>(null);

export function useReader(): ReaderContextValue {
  const ctx = useContext(ReaderContext);
  if (!ctx) throw new Error('useReader must be used inside ReaderContext');
  return ctx;
}
