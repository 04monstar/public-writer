export interface ReadingTheme {
  id: string;
  name: string;
  description: string;
  /** CSS custom properties applied to the reader scene */
  vars: Record<string, string>;
  /** css linear-gradient (or image) for the surrounding reading room */
  room: string;
  /** gradient used on the leather/marble table surface */
  table: string;
  /** accent color used for ribbon/foliage/UI hints */
  accent: string;
}

export const READING_THEMES: ReadingTheme[] = [
  {
    id: 'classic',
    name: 'Classic Paper',
    description: 'Warm ivory stock, soft daylight.',
    vars: {
      '--paper': '#f6f0e3',
      '--paper-deep': '#ece2cd',
      '--paper-edge': '#e3d6bc',
      '--ink': '#3c3226',
      '--ink-muted': '#7a6c58',
      '--accent': '#9a6b2f',
      '--page-shadow': 'rgba(58, 40, 18, 0.45)',
      '--page-glow': 'rgba(255, 250, 235, 0.75)',
    },
    room: 'radial-gradient(1200px 800px at 50% 30%, #2a2118 0%, #171310 55%, #0c0a08 100%)',
    table: 'linear-gradient(180deg, #3a2b1c 0%, #241a10 100%)',
    accent: '#c19a5b',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Aged paper, foxing and sepia.',
    vars: {
      '--paper': '#e9dcbb',
      '--paper-deep': '#dccaa2',
      '--paper-edge': '#cbb687',
      '--ink': '#4a3826',
      '--ink-muted': '#8a7356',
      '--accent': '#7c4a20',
      '--page-shadow': 'rgba(56, 38, 14, 0.5)',
      '--page-glow': 'rgba(255, 246, 220, 0.6)',
    },
    room: 'radial-gradient(1200px 800px at 50% 30%, #3a2a16 0%, #1d140c 55%, #0d0a06 100%)',
    table: 'linear-gradient(180deg, #46311c 0%, #2a1c10 100%)',
    accent: '#b0803a',
  },
  {
    id: 'sepia',
    name: 'Sepia',
    description: 'Warm brown, candlelit and intimate.',
    vars: {
      '--paper': '#efe0c8',
      '--paper-deep': '#e2cfad',
      '--paper-edge': '#d2ba90',
      '--ink': '#4a3520',
      '--ink-muted': '#8a6f4c',
      '--accent': '#a3572a',
      '--page-shadow': 'rgba(52, 34, 12, 0.5)',
      '--page-glow': 'rgba(255, 240, 208, 0.65)',
    },
    room: 'radial-gradient(1200px 800px at 50% 35%, #3d2815 0%, #201408 55%, #0e0a05 100%)',
    table: 'linear-gradient(180deg, #402a12 0%, #251608 100%)',
    accent: '#c07130',
  },
  {
    id: 'dark',
    name: 'Dark Reader',
    description: 'Ink and shadow, easy on the eyes.',
    vars: {
      '--paper': '#22242a',
      '--paper-deep': '#1b1d22',
      '--paper-edge': '#14161a',
      '--ink': '#d6d0c0',
      '--ink-muted': '#8e887a',
      '--accent': '#c9a05c',
      '--page-shadow': 'rgba(0, 0, 0, 0.6)',
      '--page-glow': 'rgba(255, 255, 255, 0.05)',
    },
    room: 'radial-gradient(1200px 800px at 50% 30%, #17181d 0%, #0b0c10 55%, #050506 100%)',
    table: 'linear-gradient(180deg, #1a1c22 0%, #0e0f13 100%)',
    accent: '#c9a05c',
  },
  {
    id: 'night',
    name: 'Night Blue',
    description: 'Midnight tones for late reading.',
    vars: {
      '--paper': '#232b3a',
      '--paper-deep': '#1c2331',
      '--paper-edge': '#141a26',
      '--ink': '#d7d3c4',
      '--ink-muted': '#8f8c7e',
      '--accent': '#7f9dd1',
      '--page-shadow': 'rgba(0, 0, 0, 0.6)',
      '--page-glow': 'rgba(160, 190, 255, 0.07)',
    },
    room: 'radial-gradient(1200px 800px at 50% 30%, #121a2e 0%, #0a0f1c 55%, #05070d 100%)',
    table: 'linear-gradient(180deg, #141c30 0%, #0a0f1a 100%)',
    accent: '#8faeec',
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Deep greens, moss and candlelight.',
    vars: {
      '--paper': '#ece4cf',
      '--paper-deep': '#ddd2b7',
      '--paper-edge': '#c9bb99',
      '--ink': '#2e3a2a',
      '--ink-muted': '#67705a',
      '--accent': '#3d6b42',
      '--page-shadow': 'rgba(20, 30, 18, 0.5)',
      '--page-glow': 'rgba(230, 245, 220, 0.55)',
    },
    room: 'radial-gradient(1200px 800px at 50% 30%, #1e2a1a 0%, #10180e 55%, #070b06 100%)',
    table: 'linear-gradient(180deg, #25351f 0%, #131d10 100%)',
    accent: '#5f8a4e',
  },
  {
    id: 'royal',
    name: 'Royal Library',
    description: 'Burgundy leather and gilt trim.',
    vars: {
      '--paper': '#f2ead9',
      '--paper-deep': '#e7dcc6',
      '--paper-edge': '#d8c9ab',
      '--ink': '#33251f',
      '--ink-muted': '#75604f',
      '--accent': '#8c2f28',
      '--page-shadow': 'rgba(50, 20, 16, 0.5)',
      '--page-glow': 'rgba(255, 242, 220, 0.65)',
    },
    room: 'radial-gradient(1200px 800px at 50% 30%, #2c1a18 0%, #160d0d 55%, #0a0606 100%)',
    table: 'linear-gradient(180deg, #3a201c 0%, #211110 100%)',
    accent: '#b2433a',
  },
];

export const themeById = (id: string): ReadingTheme =>
  READING_THEMES.find((t) => t.id === id) ?? READING_THEMES[0]!;

/**
 * CSS variable overrides for `prefers-contrast: more` readers.
 * Dark themes get whiter ink; light themes get near-black ink. Kept separate
 * from the theme list so the available palettes stay tasteful by default.
 */
export const HIGH_CONTRAST_VARS: Record<string, Record<string, string>> = {
  dark: {
    '--paper': '#101216',
    '--paper-deep': '#101216',
    '--ink': '#ffffff',
    '--ink-muted': '#d6d2c6',
    '--accent': '#ffd98a',
    '--page-shadow': 'rgba(0, 0, 0, 0.7)',
    '--page-glow': 'rgba(255, 255, 255, 0.08)',
  },
  night: {
    '--paper': '#0e1420',
    '--paper-deep': '#0e1420',
    '--ink': '#ffffff',
    '--ink-muted': '#cfd6e6',
    '--accent': '#a9c3f5',
    '--page-shadow': 'rgba(0, 0, 0, 0.7)',
    '--page-glow': 'rgba(160, 190, 255, 0.1)',
  },
  light: {
    '--ink': '#161310',
    '--ink-muted': '#3d352a',
    '--accent': '#7a4d10',
  },
};

export const highContrastVarsFor = (themeId: string): Record<string, string> => {
  if (themeId === 'dark' || themeId === 'night') return HIGH_CONTRAST_VARS[themeId]!;
  return HIGH_CONTRAST_VARS.light!;
};
