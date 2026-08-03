/**
 * Synthesised paper/leather sounds using the Web Audio API.
 * No audio assets required — everything is generated procedurally.
 */
class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = false;
  private lastPlayed = 0;

  configure(enabled: boolean) {
    this.enabled = enabled;
  }

  private ensure(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private noiseBuffer(seconds: number): AudioBuffer {
    const ctx = this.ctx!;
    const rate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, Math.floor(rate * seconds), rate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  private playFilteredNoise(opts: {
    duration: number;
    filterType: BiquadFilterType;
    freq: number;
    freqEnd?: number;
    q?: number;
    gain: number;
    delay?: number;
  }) {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime + (opts.delay ?? 0);
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(opts.duration);
    const filter = ctx.createBiquadFilter();
    filter.type = opts.filterType;
    filter.frequency.setValueAtTime(opts.freq, now);
    if (opts.freqEnd) filter.frequency.exponentialRampToValueAtTime(opts.freqEnd, now + opts.duration);
    filter.Q.value = opts.q ?? 1;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(opts.gain, now + opts.duration * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);
    src.connect(filter).connect(gain).connect(ctx.destination);
    src.start(now);
    src.stop(now + opts.duration + 0.02);
  }

  pageTurn() {
    const now = performance.now();
    if (now - this.lastPlayed < 60) return;
    this.lastPlayed = now;
    // The "shhh" of paper sliding
    this.playFilteredNoise({
      duration: 0.28,
      filterType: 'bandpass',
      freq: 2200,
      freqEnd: 1400,
      q: 0.8,
      gain: 0.08,
    });
    // The soft catch as the page settles
    this.playFilteredNoise({
      duration: 0.09,
      filterType: 'lowpass',
      freq: 700,
      freqEnd: 300,
      q: 1.2,
      gain: 0.05,
      delay: 0.2,
    });
  }

  pageDrag() {
    const now = performance.now();
    if (now - this.lastPlayed < 90) return;
    this.lastPlayed = now;
    this.playFilteredNoise({
      duration: 0.12,
      filterType: 'bandpass',
      freq: 3000,
      freqEnd: 1800,
      q: 0.6,
      gain: 0.03,
    });
  }

  bookOpen() {
    const ctx = this.ensure();
    if (!ctx) return;
    const now = ctx.currentTime;
    // leather creak
    this.playFilteredNoise({
      duration: 0.4,
      filterType: 'lowpass',
      freq: 900,
      freqEnd: 300,
      q: 1.4,
      gain: 0.09,
    });
    this.playFilteredNoise({
      duration: 0.24,
      filterType: 'highpass',
      freq: 900,
      freqEnd: 2200,
      q: 1,
      gain: 0.035,
      delay: 0.05,
    });
    // wooden settle
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.3);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.06, now + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.connect(g).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  bookmarkInsert() {
    this.playFilteredNoise({
      duration: 0.14,
      filterType: 'bandpass',
      freq: 1800,
      freqEnd: 2600,
      q: 2,
      gain: 0.035,
    });
  }
}

export const sound = new SoundEngine();
