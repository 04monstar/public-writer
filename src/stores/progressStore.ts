import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  /** last page index per story id */
  positions: Record<string, number>;
  setPosition: (storyId: string, pageIndex: number) => void;
  clear: (storyId: string) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      positions: {},
      setPosition: (storyId, pageIndex) =>
        set((s) => ({
          positions: { ...s.positions, [storyId]: pageIndex },
        })),
      clear: (storyId) =>
        set((s) => {
          const next = { ...s.positions };
          delete next[storyId];
          return { positions: next };
        }),
    }),
    { name: 'storybound.progress' },
  ),
);
