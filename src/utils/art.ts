/** Deterministic, self-contained SVG illustration generator. */

export type Motif = 'celestial' | 'coast' | 'garden' | 'forest' | 'city' | 'ornament';

interface ArtOptions {
  hue: number;
  motif: Motif;
  seed?: number;
  dark?: boolean;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hsl = (h: number, s: number, l: number, a = 1) => `hsla(${h}, ${s}%, ${l}%, ${a})`;

function vignette(id: string): string {
  return `<radialGradient id="${id}" cx="50%" cy="50%" r="70%">
    <stop offset="55%" stop-color="rgba(0,0,0,0)"/>
    <stop offset="100%" stop-color="rgba(0,0,0,0.42)"/>
  </radialGradient>`;
}

function noise(): string {
  return `<filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer>
    <feComposite operator="over" in2="SourceGraphic"/>
  </filter>`;
}

export function makeArt({ hue, motif, seed = 7, dark = false }: ArtOptions): string {
  const rnd = mulberry32(seed * 9973 + Math.round(hue));
  const W = 900;
  const H = 1200;
  const sat = dark ? 28 : 42;
  const light = dark ? 34 : 58;
  const h2 = (hue + rnd() * 40 - 20 + 360) % 360;
  const shapes: string[] = [];

  if (motif === 'celestial') {
    const cx = W * (0.5 + (rnd() - 0.5) * 0.2);
    const cy = H * 0.36;
    const r = W * 0.26;
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${hsl(48, 60, dark ? 60 : 68)}" opacity="0.85"/>`);
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r * 0.82}" fill="${hsl(hue, 30, light)}"/>`);
    shapes.push(`<circle cx="${cx - r * 0.42}" cy="${cy - r * 0.4}" r="${r * 0.09}" fill="${hsl(48, 70, 78)}"/>`);
    shapes.push(`<circle cx="${cx + r * 0.3}" cy="${cy + r * 0.35}" r="${r * 0.05}" fill="${hsl(48, 70, 74)}"/>`);
    for (let i = 0; i < 14; i++) {
      shapes.push(
        `<circle cx="${rnd() * W}" cy="${rnd() * H * 0.7}" r="${0.6 + rnd() * 1.6}" fill="${hsl(48, 50, 82)}" opacity="${0.5 + rnd() * 0.5}"/>`,
      );
    }
    for (let i = 0; i < 3; i++) {
      const x = W * (0.15 + rnd() * 0.7);
      const y = H * (0.7 + rnd() * 0.22);
      shapes.push(
        `<path d="M${x} ${y} q${(rnd() - 0.5) * 200} -${80 + rnd() * 60} 0 -${120 + rnd() * 40}" fill="none" stroke="${hsl(hue, sat, light)}" stroke-width="3" opacity="0.7"/>`,
      );
    }
  } else if (motif === 'coast') {
    for (let i = 0; i < 4; i++) {
      const base = H * (0.55 + i * 0.11);
      const amp = 60 + i * 26;
      let d = `M0 ${base}`;
      for (let x = 0; x <= W; x += 60) {
        const y = base - Math.abs(Math.sin((x / W) * Math.PI * (2 + i))) * amp;
        d += ` Q${x - 30} ${base - amp * 1.3} ${x} ${y}`;
      }
      d += ` L${W} ${H} L0 ${H} Z`;
      shapes.push(
        `<path d="${d}" fill="${hsl(hue, sat, light - i * 8)}" opacity="${0.85 - i * 0.18}"/>`,
      );
    }
    shapes.push(
      `<circle cx="${W * 0.72}" cy="${H * 0.24}" r="${W * 0.2}" fill="${hsl(48, 65, 70)}" opacity="0.9"/>`,
    );
    shapes.push(
      `<path d="M${W * 0.72} ${H * 0.24} a${W * 0.2} ${W * 0.2} 0 0 1 0 ${W * 0.4} l-${W * 0.2} 0 Z" fill="${hsl(48, 65, 62)}" opacity="0.8"/>`,
    );
  } else if (motif === 'garden') {
    const cx = W / 2;
    const cy = H * 0.42;
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${W * 0.34}" fill="${hsl(hue + 30, sat + 15, light)}"/>`);
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${W * 0.26}" fill="${hsl(hue + 30, sat + 10, light + 8)}"/>`);
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${W * 0.17}" fill="${hsl(hue + 60, sat + 18, light + 6)}"/>`);
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${W * 0.08}" fill="${hsl(48, 60, 72)}"/>`);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const x = cx + Math.cos(a) * W * 0.34;
      const y = cy + Math.sin(a) * W * 0.34;
      shapes.push(`<ellipse cx="${x}" cy="${y}" rx="${W * 0.09}" ry="${W * 0.03}" fill="${hsl(hue, sat, light - 10)}" transform="rotate(${(a * 180) / Math.PI + 90} ${x} ${y})"/>`);
    }
  } else if (motif === 'forest') {
    for (let i = 0; i < 9; i++) {
      const x = W * (0.06 + i * 0.11);
      const h = H * (0.3 + rnd() * 0.34);
      const w = W * 0.16;
      shapes.push(
        `<path d="M${x} ${H} L${x - w / 2} ${H - h} L${x} ${H - h * 1.6} L${x + w / 2} ${H - h} Z" fill="${hsl(hue, sat, light - i * 4)}"/>`,
      );
    }
    shapes.push(`<circle cx="${W * 0.5}" cy="${H * 0.2}" r="${W * 0.1}" fill="${hsl(48, 55, 68)}"/>`);
  } else if (motif === 'city') {
    for (let i = 0; i < 12; i++) {
      const x = W * 0.04 + i * (W * 0.082);
      const w = W * 0.06;
      const h = H * (0.3 + rnd() * 0.4);
      shapes.push(
        `<rect x="${x}" y="${H - h}" width="${w}" height="${h}" fill="${hsl(hue, sat, light - i * 3)}" rx="2"/>`,
      );
      for (let j = 0; j < 5; j++) {
        shapes.push(
          `<rect x="${x + 6}" y="${H - h + 14 + j * 22}" width="${w - 12}" height="9" fill="${hsl(48, 70, 78)}" opacity="${0.5 + rnd() * 0.5}"/>`,
        );
      }
    }
  } else {
    // ornament: radial medallion
    const cx = W / 2;
    const cy = H / 2;
    for (let i = 0; i < 3; i++) {
      shapes.push(
        `<rect x="${cx - W * 0.24 - i * 14}" y="${cy - W * 0.24 - i * 14}" width="${W * 0.48 + i * 28}" height="${W * 0.48 + i * 28}" fill="none" stroke="${hsl(48, 40, 75)}" stroke-width="${2 + i * 1.5}" transform="rotate(${i * 4} ${cx} ${cy})"/>`,
      );
    }
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${W * 0.2}" fill="${hsl(hue, sat, light)}"/>`);
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${W * 0.2}" fill="none" stroke="${hsl(48, 60, 70)}" stroke-width="3" stroke-dasharray="2 10"/>`);
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${hsl(hue, sat + 6, light + 12)}"/>
      <stop offset="100%" stop-color="${hsl(h2, sat - 6, light - 16)}"/>
    </linearGradient>
    ${vignette('vig')}
    ${noise()}
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  ${shapes.join('\n  ')}
  <rect width="${W}" height="${H}" fill="url(#vig)"/>
  <rect width="${W}" height="${H}" fill="url(#bg)" filter="url(#n)"/>
  <rect width="${W}" height="${H}" fill="none" stroke="${hsl(48, 40, 82)}" stroke-width="6" opacity="0.35" x="18" y="18" width="${W - 36}" height="${H - 36}"/>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/** Small decorative ornament used on cover spines / chapter dividers. */
export function ornamentSvg(hue: number, light = 60, size = 80): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size / 3}" viewBox="0 0 ${size} ${size / 3}">
  <path d="M0 ${size / 6} H${size * 0.32}" stroke="${hsl(hue, 40, light)}" stroke-width="1.5" fill="none" opacity="0.8"/>
  <circle cx="${size * 0.36}" cy="${size / 6}" r="3" fill="${hsl(48, 60, 72)}"/>
  <path d="M${size * 0.42} ${size / 6} q${size * 0.05} -${size * 0.09} ${size * 0.08} 0 q${size * 0.03} ${size * 0.05} ${size * 0.08} 0" stroke="${hsl(hue, 40, light)}" stroke-width="2" fill="none"/>
  <path d="M${size * 0.62} ${size / 6} q${size * 0.05} -${size * 0.09} ${size * 0.08} 0 q${size * 0.03} ${size * 0.05} ${size * 0.08} 0" stroke="${hsl(hue, 40, light)}" stroke-width="2" fill="none"/>
  <circle cx="${size * 0.64}" cy="${size / 6}" r="3" fill="${hsl(48, 60, 72)}"/>
  <path d="M${size * 0.68} ${size / 6} H${size}" stroke="${hsl(hue, 40, light)}" stroke-width="1.5" fill="none" opacity="0.8"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
