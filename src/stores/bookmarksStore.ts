import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Stable empty array so selectors never return a fresh reference per call. */
export const EMPTY_BOOKMARKS: number[] = [];

interface BookmarksState {
  /** page indices per story id */
  bookmarks: Record<string, number[]>;
  toggle: (storyId: string, pageIndex: number) => void;
  remove: (storyId: string, pageIndex: number) => void;
  clearStory: (storyId: string) => void;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set) => ({
      bookmarks: {},
      toggle: (storyId, pageIndex) =>
        set((s) => {
          const current = s.bookmarks[storyId] ?? [];
          const next = current.includes(pageIndex)
            ? current.filter((p) => p !== pageIndex)
            : [...current, pageIndex].sort((a, b) => a - b);
          return { bookmarks: { ...s.bookmarks, [storyId]: next } };
        }),
      remove: (storyId, pageIndex) =>
        set((s) => ({
          bookmarks: {
            ...s.bookmarks,
            [storyId]: (s.bookmarks[storyId] ?? []).filter((p) => p !== pageIndex),
          },
        })),
      clearStory: (storyId) =>
        set((s) => {
          const next = { ...s.bookmarks };
          delete next[storyId];
          return { bookmarks: next };
        }),
    }),
    { name: 'storybound.bookmarks' },
  ),
);
