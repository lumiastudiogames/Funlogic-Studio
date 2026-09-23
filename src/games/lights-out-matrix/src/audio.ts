/**
 * Web Audio API synthesizer for tactile mechanical switch clicks,
 * filament hum, electric chimes, and victory fanfare.
 */
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Load persisted sound preference
    const saved = localStorage.getItem('lights_out_muted');
    this.isMuted = saved === 'true';
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('lights_out_muted', String(this.isMuted));
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Bulb toggle sound: click + warm incandescent ping
   */
  public playBulbToggle(isTurningOn: boolean) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      const ctx = this.ctx;
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Mechanical switch click (noise impulse + pop)
      const oscClick = ctx.createOscillator();
      const gainClick = ctx.createGain();
      oscClick.type = 'triangle';
      oscClick.frequency.setValueAtTime(isTurningOn ? 320 : 180, now);
      oscClick.frequency.exponentialRampToValueAtTime(40, now + 0.04);
      gainClick.gain.setValueAtTime(0.25, now);
      gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      oscClick.connect(gainClick);
      gainClick.connect(ctx.destination);
      oscClick.start(now);
      oscClick.stop(now + 0.05);

      // 2. Filament resonance harmonic
      const oscHarmonic = ctx.createOscillator();
      const gainHarmonic = ctx.createGain();
      oscHarmonic.type = 'sine';
      if (isTurningOn) {
        oscHarmonic.frequency.setValueAtTime(587.33, now); // D5
        oscHarmonic.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
        gainHarmonic.gain.setValueAtTime(0.18, now);
        gainHarmonic.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      } else {
        oscHarmonic.frequency.setValueAtTime(440, now); // A4
        oscHarmonic.frequency.exponentialRampToValueAtTime(220, now + 0.1); // A3
        gainHarmonic.gain.setValueAtTime(0.12, now);
        gainHarmonic.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      }
      oscHarmonic.connect(gainHarmonic);
      gainHarmonic.connect(ctx.destination);
      oscHarmonic.start(now);
      oscHarmonic.stop(now + 0.2);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  /**
   * Tactile button click sound
   */
  public playButtonClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      const ctx = this.ctx;
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // silent
    }
  }

  /**
   * Reset / Shuffle rattle sound
   */
  public playRattle() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      const ctx = this.ctx;
      if (!ctx) return;
      const now = ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const time = now + i * 0.04;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300 + Math.random() * 200, time);
        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.04);
      }
    } catch {
      // silent
    }
  }

  /**
   * Hint chime
   */
  public playHint() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      const ctx = this.ctx;
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const time = now + idx * 0.06;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.3);
      });
    } catch {
      // silent
    }
  }

  /**
   * Victory fanfare arpeggio
   */
  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      const ctx = this.ctx;
      if (!ctx) return;
      const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      const now = ctx.currentTime;
      arpeggio.forEach((freq, i) => {
        const time = now + i * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.5);
      });
    } catch {
      // silent
    }
  }
}

export const sound = new SoundManager();
