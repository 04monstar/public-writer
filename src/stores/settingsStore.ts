import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ReaderSettings } from '@/types/reader';
import { READING_THEMES } from '@/types/themes';

const DEFAULTS: ReaderSettings = {
  fontSize: 19,
  lineHeight: 1.78,
  fontFamily: 'serif',
  margins: 'comfortable',
  paragraphIndent: true,
  dropCaps: true,
  justify: true,
  themeId: 'classic',
  paperBrightness: 100,
  pageTurnSpeed: 'normal',
  pageSound: false,
  scrollToTurn: false,
  readingSpeed: 240,
};

interface SettingsState extends ReaderSettings {
  hydrated: boolean;
  set: (patch: Partial<ReaderSettings>) => void;
  reset: () => void;
}

const speedMap: Record<ReaderSettings['pageTurnSpeed'], number> = {
  slow: 1.6,
  normal: 1.05,
  fast: 0.6,
};

export const turnDurationFor = (speed: ReaderSettings['pageTurnSpeed']): number =>
  speedMap[speed] ?? 1.05;

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      hydrated: false,
      set: (patch) => set(patch),
      reset: () => set({ ...DEFAULTS }),
    }),
    {
      name: 'storybound.settings',
      partialize: (s) => {
        const { hydrated: _h, set: _s, reset: _r, ...rest } = s;
        return rest;
      },
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);

export { READING_THEMES };

export const isValidThemeId = (id: string): boolean =>
  READING_THEMES.some((t) => t.id === id);
