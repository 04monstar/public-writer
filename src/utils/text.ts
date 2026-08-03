export type FontKey = 'serif' | 'elegant' | 'modern' | 'letter' | 'display';

export const FONT_STACKS: Record<FontKey, string> = {
  serif: `'EB Garamond', 'Cormorant Garamond', Georgia, 'Times New Roman', serif`,
  elegant: `'Cormorant Garamond', 'EB Garamond', Georgia, serif`,
  modern: `'Avenir Next', 'Segoe UI', system-ui, 'Helvetica Neue', Arial, sans-serif`,
  letter: `'Great Vibes', 'Dancing Script', 'Snell Roundhand', cursive`,
  display: `'Playfair Display', 'Cormorant Garamond', Georgia, serif`,
};

/** Build a CSS/canvas font shorthand string. */
export function fontString(family: string, sizePx: number, weight = 400): string {
  return `${weight} ${sizePx}px ${family}`;
}

/**
 * Lightweight canvas text measurer with an LRU-ish memo cache.
 * All measurement is synchronous; callers are responsible for ensuring the
 * font faces are loaded (await document.fonts.ready first).
 */
export class TextMeasurer {
  private ctx: CanvasRenderingContext2D;
  private wordCache = new Map<string, Map<string, number>>();
  private lineCache = new Map<string, string[]>();

  constructor() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 512;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D unavailable');
    this.ctx = ctx;
  }

  measure(word: string, font: string): number {
    let byFont = this.wordCache.get(font);
    if (!byFont) {
      byFont = new Map();
      this.wordCache.set(font, byFont);
    }
    const cached = byFont.get(word);
    if (cached !== undefined) return cached;
    this.ctx.font = font;
    const width = this.ctx.measureText(word).width;
    if (byFont.size > 40000) byFont.clear();
    byFont.set(word, width);
    return width;
  }

  spaceWidth(font: string): number {
    return this.measure(' ', font);
  }

  /**
   * Greedy line-breaking that mirrors CSS `white-space: normal`.
   * Newlines inside `text` are treated as hard breaks.
   */
  breakLines(text: string, font: string, widthPx: number): string[] {
    const cacheKey = `${font}|${widthPx}|${text}`;
    const cached = this.lineCache.get(cacheKey);
    if (cached) return cached;
    if (this.lineCache.size > 5000) this.lineCache.clear();

    const hardSegments = text.split('\n');
    const lines: string[] = [];
    for (const segment of hardSegments) {
      const words = segment.trim().split(/\s+/).filter(Boolean);
      if (words.length === 0) {
        if (lines.length === 0 || lines[lines.length - 1] !== '') lines.push('');
        continue;
      }
      let current = '';
      let currentWidth = 0;
      const space = this.spaceWidth(font);
      for (const word of words) {
        const w = this.measure(word, font);
        const add = current.length === 0 ? w : w + space;
        if (current.length > 0 && currentWidth + add > widthPx) {
          lines.push(current);
          current = word;
          currentWidth = w;
        } else {
          current = current.length === 0 ? word : `${current} ${word}`;
          currentWidth += add;
        }
      }
      if (current.length > 0) lines.push(current);
    }
    this.lineCache.set(cacheKey, lines);
    return lines;
  }
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** True when the user has requested reduced motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
