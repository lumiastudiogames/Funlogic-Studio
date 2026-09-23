class SoundFX {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private pourNoiseSource: AudioBufferSourceNode | null = null;
  private pourNoiseGain: GainNode | null = null;
  private pourIntervalId: number | null = null;
  private pourAutoStopTimer: number | null = null;
  private isCurrentlyPouring: boolean = false;

  constructor() {
    const saved = localStorage.getItem('water_sort_lab_sound');
    this.enabled = saved !== null ? saved === 'true' : true;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('water_sort_lab_sound', String(this.enabled));
    if (this.enabled) {
      this.initContext();
      this.playGlassTap();
    } else {
      this.stopPouring();
    }
    return this.enabled;
  }

  public playGlassTap(pitchOffset: number = 0) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400 + pitchOffset * 120, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  /**
   * Generates a single organic liquid bubble glug (Minnaert resonant droplet)
   */
  private playWaterDropletGlug(baseFreq: number) {
    if (!this.ctx || !this.enabled || !this.isCurrentlyPouring) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pitch chirp upwards with slight randomness (acoustic bubble signature)
      const startFreq = baseFreq + (Math.random() - 0.5) * 80;
      const endFreq = startFreq * (1.6 + Math.random() * 0.4);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.045);

      const vol = 0.06 + Math.random() * 0.05;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  public startPouring(maxDurationMs: number = 850) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      this.stopPouring();
      this.isCurrentlyPouring = true;

      const now = this.ctx.currentTime;

      // 1. Soft stream of fluid water noise
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.5);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastVal = 0;
      // Pink/Brownish noise for warm fluid rushing sound
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastVal = (lastVal * 0.95) + (white * 0.05);
        output[i] = lastVal * 3.5;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const bpf = this.ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.setValueAtTime(700, now);
      bpf.frequency.linearRampToValueAtTime(1100, now + (maxDurationMs / 1000));
      bpf.Q.setValueAtTime(3.2, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.005, now);
      noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.08);

      noiseSource.connect(bpf);
      bpf.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noiseSource.start(now);
      this.pourNoiseSource = noiseSource;
      this.pourNoiseGain = noiseGain;

      // 2. Continuous realistic bubbling and liquid glugs
      let glugCount = 0;
      const startTime = performance.now();
      const runGlugs = () => {
        if (!this.isCurrentlyPouring) return;
        const elapsed = performance.now() - startTime;
        const progress = Math.min(1, elapsed / maxDurationMs);

        // Acoustic cavity resonance increases as destination tube fills
        const pitch = 480 + progress * 320;
        this.playWaterDropletGlug(pitch);

        // Next droplet timing with natural fluid rhythm (50ms - 110ms)
        const nextDelay = 55 + Math.random() * 55;
        this.pourIntervalId = window.setTimeout(runGlugs, nextDelay);
        glugCount++;
      };
      runGlugs();

      // 3. Safety auto-stop
      this.pourAutoStopTimer = window.setTimeout(() => {
        this.stopPouring();
      }, maxDurationMs + 80);

    } catch {}
  }

  public stopPouring() {
    this.isCurrentlyPouring = false;

    if (this.pourIntervalId !== null) {
      window.clearTimeout(this.pourIntervalId);
      this.pourIntervalId = null;
    }

    if (this.pourAutoStopTimer !== null) {
      window.clearTimeout(this.pourAutoStopTimer);
      this.pourAutoStopTimer = null;
    }

    if (this.ctx && this.pourNoiseGain) {
      try {
        const now = this.ctx.currentTime;
        this.pourNoiseGain.gain.cancelScheduledValues(now);
        this.pourNoiseGain.gain.setValueAtTime(this.pourNoiseGain.gain.value, now);
        this.pourNoiseGain.gain.linearRampToValueAtTime(0.0001, now + 0.05);
      } catch {}
    }

    const noise = this.pourNoiseSource;
    const gain = this.pourNoiseGain;
    this.pourNoiseSource = null;
    this.pourNoiseGain = null;

    setTimeout(() => {
      try {
        if (noise) {
          noise.stop();
          noise.disconnect();
        }
        if (gain) {
          gain.disconnect();
        }
      } catch {}
    }, 60);
  }

  public playBubble() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  public playError() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(170, now + 0.08);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  public playUndo() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }

  public playWin() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = this.ctx!.currentTime + idx * 0.12;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch {}
  }
}

export const sound = new SoundFX();

