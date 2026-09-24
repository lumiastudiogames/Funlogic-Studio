/**
 * Procedural Audio Synthesizer for Ancient Egypt Logic Grid
 * Generates thematic ancient Egyptian sound effects using Web Audio API
 */

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientNodes = null;
    this.ambientInterval = null;
    // Load mute state from localStorage
    const saved = localStorage.getItem('egypt_logic_muted');
    this.isMuted = saved === 'true';
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('egypt_logic_muted', String(this.isMuted));
    if (!this.isMuted) {
      this.playClick();
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
    return this.isMuted;
  }

  startAmbient() {
    if (this.isMuted || this.ambientNodes) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.06, now + 1.5);
      masterGain.connect(this.ctx.destination);

      // Dual drone oscillators: Root D2 (73.42 Hz) + Fifth A2 (110 Hz)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(73.42, now);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110.0, now);

      // Low pass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);

      // LFO for slow atmospheric breathing
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.08, now);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(100, now);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      osc1.start();
      osc2.start();
      lfo.start();

      this.ambientNodes = { masterGain, osc1, osc2, lfo, filter };

      this.ambientInterval = setInterval(() => {
        if (!this.isMuted && this.ctx && this.ambientNodes) {
          this.playMysticNote();
        }
      }, 5000);
    } catch (e) {
      console.warn('Ambient start failed:', e);
    }
  }

  playMysticNote() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const scale = [293.66, 349.23, 392.00, 440.00, 523.25];
    const freq = scale[Math.floor(Math.random() * scale.length)];
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.02, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 2.3);
  }

  stopAmbient() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.ambientNodes) {
      try {
        const { masterGain, osc1, osc2, lfo } = this.ambientNodes;
        const now = this.ctx ? this.ctx.currentTime : 0;
        masterGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
            lfo.stop();
          } catch (e) {}
        }, 600);
      } catch (e) {}
      this.ambientNodes = null;
    }
  }

  // Stone tap click (UI button)
  playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(420, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Chisel stone carving sound for ❌ (NO)
  playMarkNo() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.09);
  }

  // Golden chime for ✔️ (YES / MATCH CONFIRMED)
  playMarkYes() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [587.33, 880, 1174.66]; // D5, A5, D6 Egyptian chord

    freqs.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.03);

      gain.gain.setValueAtTime(0.12 / (i + 1), now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4 + i * 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.03);
      osc.stop(now + 0.5 + i * 0.05);
    });
  }

  // Papyrus ink stroke / clue crossed out
  playClueCross() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.07);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.08);
  }

  // Clear / erase cell
  playClear() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.07);
  }

  // Mystical hint sound
  playHint() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 830.61, 880]; // Egyptian harmonic minor

    notes.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.08);

      gain.gain.setValueAtTime(0.15, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.4);
    });
  }

  // Royal Tomb Fanfare / Victory sound
  playWin() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const melody = [
      { f: 293.66, dur: 0.18 }, // D4
      { f: 349.23, dur: 0.18 }, // F4
      { f: 440.00, dur: 0.22 }, // A4
      { f: 587.33, dur: 0.35 }, // D5
      { f: 523.25, dur: 0.18 }, // C5
      { f: 587.33, dur: 0.60 }, // D5 high fanfare
    ];

    let t = now;
    melody.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, t);

      // Warm filter for brassy Egyptian trumpet feel
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.dur + 0.02);
      t += note.dur + 0.04;
    });
  }

  // Error / Invalid deduction thud
  playError() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.16);
  }
}

export const soundManager = new SoundSystem();
