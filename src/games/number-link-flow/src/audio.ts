class AudioManager {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor() {
    const savedMute = localStorage.getItem('number_link_flow_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('number_link_flow_muted', String(this.isMuted));
    if (!this.isMuted) {
      this.playTap();
    }
    return this.isMuted;
  }

  public playTap() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch {
      // AudioContext policy safe fallback
    }
  }

  public playDrawStep(stepIndex: number = 0) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pentatonic scale based on step length
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
      const freq = scale[stepIndex % scale.length];

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.06);
    } catch {
      // Safe fallback
    }
  }

  public playConnect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major high shimmer

      chord.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.03);

        gain.gain.setValueAtTime(0.15, t + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.03 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + i * 0.03);
        osc.stop(t + i * 0.03 + 0.3);
      });
    } catch {
      // Safe fallback
    }
  }

  public playDisconnect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.09);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.09);
    } catch {
      // Safe fallback
    }
  }

  public playWin() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [
        { freq: 440.00, delay: 0 },    // A4
        { freq: 554.37, delay: 0.09 }, // C#5
        { freq: 659.25, delay: 0.18 }, // E5
        { freq: 880.00, delay: 0.27 }, // A5
        { freq: 1108.73, delay: 0.40 } // C#6
      ];

      notes.forEach(({ freq, delay }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + delay);

        gain.gain.setValueAtTime(0.25, t + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + delay);
        osc.stop(t + delay + 0.5);
      });
    } catch {
      // Safe fallback
    }
  }

  public playHint() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const arpeggio = [783.99, 987.77, 1174.66, 1567.98];

      arpeggio.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.05);

        gain.gain.setValueAtTime(0.18, t + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + idx * 0.05);
        osc.stop(t + idx * 0.05 + 0.28);
      });
    } catch {
      // Safe fallback
    }
  }
}

export const audio = new AudioManager();
