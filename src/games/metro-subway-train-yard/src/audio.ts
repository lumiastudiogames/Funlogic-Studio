// Procedural Web Audio Engine for Metro Subway Train Yard

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private trainHumGain: GainNode | null = null;
  private trainHumOsc: OscillatorNode | null = null;
  private isHumming: boolean = false;

  constructor() {
    // Check saved mute preference
    const savedMute = localStorage.getItem('metro_sound_muted');
    this.isMuted = savedMute === 'true';
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('metro_sound_muted', String(this.isMuted));
    if (this.isMuted) {
      this.stopTrainHum();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playSwitchToggle() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Heavy mechanical metallic clack of track switch
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(140, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.08);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(480, now);
    osc2.frequency.exponentialRampToValueAtTime(120, now + 0.06);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.09);
    osc2.stop(now + 0.09);
  }

  public playTrainDispatch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Electric motor spool up / metro air horn chime
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(480, now + 0.12);
    osc.frequency.linearRampToValueAtTime(640, now + 0.22);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playTrainBrake() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // High frequency pneumatic hiss / rail squeak
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playTunnelArrival() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Harmonious dual chime + deep subway woosh
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0.2, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.35);
    });
  }

  public playCollision() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Low boom + metal crunch
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(110, now);
    osc1.frequency.exponentialRampToValueAtTime(30, now + 0.35);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(220, now);
    osc2.frequency.exponentialRampToValueAtTime(50, now + 0.25);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);
  }

  public playVictory() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 523.25, t: 0.00, d: 0.12 }, // C5
      { f: 659.25, t: 0.12, d: 0.12 }, // E5
      { f: 783.99, t: 0.24, d: 0.12 }, // G5
      { f: 1046.50, t: 0.36, d: 0.35 } // C6
    ];

    melody.forEach(({ f, t, d }) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + t);

      gain.gain.setValueAtTime(0.28, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + t);
      osc.stop(now + t + d);
    });
  }

  public updateTrainHum(movingTrainsCount: number) {
    if (this.isMuted || movingTrainsCount <= 0) {
      this.stopTrainHum();
      return;
    }
    this.initCtx();
    if (!this.ctx) return;

    if (!this.isHumming) {
      const now = this.ctx.currentTime;
      this.trainHumOsc = this.ctx.createOscillator();
      this.trainHumGain = this.ctx.createGain();

      this.trainHumOsc.type = 'triangle';
      this.trainHumOsc.frequency.setValueAtTime(65, now);

      this.trainHumGain.gain.setValueAtTime(0.01, now);
      this.trainHumGain.gain.linearRampToValueAtTime(0.06 * Math.min(movingTrainsCount, 3), now + 0.2);

      this.trainHumOsc.connect(this.trainHumGain);
      this.trainHumGain.connect(this.ctx.destination);

      this.trainHumOsc.start(now);
      this.isHumming = true;
    } else if (this.trainHumGain) {
      const targetGain = 0.04 * Math.min(movingTrainsCount, 3);
      this.trainHumGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }
  }

  public stopTrainHum() {
    if (this.isHumming && this.trainHumGain && this.trainHumOsc && this.ctx) {
      try {
        this.trainHumGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.05);
        setTimeout(() => {
          if (this.trainHumOsc) {
            try { this.trainHumOsc.stop(); } catch {}
            this.trainHumOsc.disconnect();
            this.trainHumOsc = null;
          }
          this.isHumming = false;
        }, 60);
      } catch {}
    }
    this.isHumming = false;
  }
}

export const audio = new SoundManager();
