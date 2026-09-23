/**
 * Web Audio API procedural synthesizer for City Parking Jam
 * Zero external audio files - 100% synthesized soundscapes & SFX
 */

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.musicEnabled = true;

    // Ambient Sound nodes
    this.ambientGain = null;
    this.trafficRumbleOsc = null;
    this.trafficNoiseNode = null;
    this.birdTimer = null;
    this.hornTimer = null;
    this.isAmbientRunning = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.musicEnabled && !this.isAmbientRunning && this.ctx) {
      this.startAmbient();
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopAmbient();
    } else {
      this.initContext();
      this.startAmbient();
    }
  }

  isSound() {
    return this.soundEnabled;
  }

  isMusic() {
    return this.musicEnabled;
  }

  startAmbient() {
    if (this.isAmbientRunning || !this.musicEnabled) return;
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.05, now + 2); // Soft fade-in
      this.ambientGain.connect(this.ctx.destination);

      // 1. Distant Traffic Low Rumble (Warm urban background drone)
      const rumbleOsc = this.ctx.createOscillator();
      const rumbleFilter = this.ctx.createBiquadFilter();
      const rumbleGain = this.ctx.createGain();

      rumbleOsc.type = 'triangle';
      rumbleOsc.frequency.setValueAtTime(54, now);

      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(110, now);

      rumbleGain.gain.setValueAtTime(0.35, now);

      rumbleOsc.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(this.ambientGain);

      rumbleOsc.start(now);
      this.trafficRumbleOsc = rumbleOsc;

      // 2. Distant Asphalt & Breeze Noise (Pink/White noise with gentle slow swell)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(320, now);
      noiseFilter.Q.setValueAtTime(1.2, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.22, now);

      // LFO for gentle traffic swells (cars passing in distance)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.18, now); // ~5.5s swell cycle
      lfoGain.gain.setValueAtTime(140, now);
      lfo.connect(noiseFilter.frequency);
      lfo.start(now);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ambientGain);

      noiseSource.start(now);
      this.trafficNoiseNode = noiseSource;

      this.isAmbientRunning = true;

      this.scheduleNextBirdChirp();
      this.scheduleNextDistantHorn();
    } catch {
      // Audio fallback
    }
  }

  scheduleNextBirdChirp() {
    if (!this.musicEnabled) return;
    const delay = 3500 + Math.random() * 4500;
    this.birdTimer = window.setTimeout(() => {
      this.playProceduralBirdChirp();
      this.scheduleNextBirdChirp();
    }, delay);
  }

  scheduleNextDistantHorn() {
    if (!this.musicEnabled) return;
    const delay = 12000 + Math.random() * 15000;
    this.hornTimer = window.setTimeout(() => {
      this.playDistantCityHorn();
      this.scheduleNextDistantHorn();
    }, delay);
  }

  playProceduralBirdChirp() {
    if (!this.ctx || !this.musicEnabled || !this.ambientGain) return;

    try {
      const now = this.ctx.currentTime;
      const chirpsCount = 2 + Math.floor(Math.random() * 2);
      const baseFreq = 2600 + Math.random() * 800;

      for (let i = 0; i < chirpsCount; i++) {
        const chirpStart = now + i * (0.08 + Math.random() * 0.04);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';

        const peakFreq = baseFreq + 800 + Math.random() * 600;
        const endFreq = baseFreq + (Math.random() * 400 - 200);

        osc.frequency.setValueAtTime(baseFreq, chirpStart);
        osc.frequency.exponentialRampToValueAtTime(peakFreq, chirpStart + 0.03);
        osc.frequency.exponentialRampToValueAtTime(endFreq, chirpStart + 0.07);

        gain.gain.setValueAtTime(0.001, chirpStart);
        gain.gain.linearRampToValueAtTime(0.018 + Math.random() * 0.012, chirpStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, chirpStart + 0.075);

        osc.connect(gain);
        gain.connect(this.ambientGain);

        osc.start(chirpStart);
        osc.stop(chirpStart + 0.08);
      }
    } catch {
      // Ignore
    }
  }

  playDistantCityHorn() {
    if (!this.ctx || !this.musicEnabled || !this.ambientGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      const pitch = 290 + Math.random() * 40;
      osc1.frequency.setValueAtTime(pitch, now);
      osc2.frequency.setValueAtTime(pitch * 1.25, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.012, now + 0.05);
      gain.gain.setValueAtTime(0.012, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch {
      // Ignore
    }
  }

  stopAmbient() {
    if (!this.isAmbientRunning) return;
    if (this.birdTimer) {
      clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
    if (this.hornTimer) {
      clearTimeout(this.hornTimer);
      this.hornTimer = null;
    }
    if (this.ambientGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
        setTimeout(() => {
          this.trafficRumbleOsc?.stop();
          this.trafficNoiseNode?.disconnect();
          this.ambientGain?.disconnect();
          this.ambientGain = null;
          this.trafficRumbleOsc = null;
          this.trafficNoiseNode = null;
        }, 500);
      } catch {
        // Ignore
      }
    }
    this.isAmbientRunning = false;
  }

  playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }

  /**
   * Play distinct vehicle movement & engine acceleration sound
   * based on vehicle model type (sedan vs. suv vs. van) and active garage skin
   */
  playVehicleMove(type = 'sedan', skin = 'default') {
    this.playDriveOut(type, skin);
  }

  playEngineStart(type = 'sedan') {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Ignition starter crank
      const crankOsc = this.ctx.createOscillator();
      const crankGain = this.ctx.createGain();
      crankOsc.type = 'sawtooth';

      const crankPitch = type === 'van' ? 60 : type === 'suv' ? 85 : 120;
      crankOsc.frequency.setValueAtTime(crankPitch, now);
      crankOsc.frequency.exponentialRampToValueAtTime(crankPitch * 2, now + 0.12);

      crankGain.gain.setValueAtTime(0.15, now);
      crankGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      crankOsc.connect(crankGain);
      crankGain.connect(this.ctx.destination);
      crankOsc.start(now);
      crankOsc.stop(now + 0.14);
    } catch {
      // Ignore
    }
  }

  playDriveOut(type = 'sedan', skin = 'default') {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. CYBER NEON HYPERCAR (Electric Sci-Fi Warp Drive)
      if (skin === 'cyber') {
        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        subOsc.type = 'triangle';

        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.4);

        subOsc.frequency.setValueAtTime(110, now);
        subOsc.frequency.exponentialRampToValueAtTime(550, now + 0.4);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        subOsc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        subOsc.start(now);
        osc.stop(now + 0.45);
        subOsc.stop(now + 0.45);
        return;
      }

      // 2. POLICE INTERCEPTOR (V8 Roar + Short Siren Chirp)
      if (skin === 'police') {
        this.playSedanEngine(now);
        // Siren chirp
        const sirenOsc = this.ctx.createOscillator();
        const sirenGain = this.ctx.createGain();
        sirenOsc.type = 'sine';
        sirenOsc.frequency.setValueAtTime(650, now + 0.05);
        sirenOsc.frequency.linearRampToValueAtTime(950, now + 0.2);
        sirenGain.gain.setValueAtTime(0.12, now + 0.05);
        sirenGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        sirenOsc.connect(sirenGain);
        sirenGain.connect(this.ctx.destination);
        sirenOsc.start(now + 0.05);
        sirenOsc.stop(now + 0.35);
        return;
      }

      // 3. TAXI CAB (Engine Acceleration + Quick Horn Beep)
      if (skin === 'taxi') {
        this.playSedanEngine(now);
        // Double horn beep
        const horn1 = this.ctx.createOscillator();
        const hornGain = this.ctx.createGain();
        horn1.type = 'sawtooth';
        horn1.frequency.setValueAtTime(420, now + 0.1);
        hornGain.gain.setValueAtTime(0.08, now + 0.1);
        hornGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        horn1.connect(hornGain);
        hornGain.connect(this.ctx.destination);
        horn1.start(now + 0.1);
        horn1.stop(now + 0.25);
        return;
      }

      // 4. GOLD LUXURY (Exotic V12 Supercar High-RPM Screamer)
      if (skin === 'gold') {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';

        osc1.frequency.setValueAtTime(200, now);
        osc1.frequency.exponentialRampToValueAtTime(750, now + 0.38);

        osc2.frequency.setValueAtTime(204, now); // Slight detune for rich chorus
        osc2.frequency.exponentialRampToValueAtTime(765, now + 0.38);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.42);
        osc2.stop(now + 0.42);
        return;
      }

      // STANDARD MODEL SPECIFIC SOUNDS:
      if (type === 'van') {
        this.playVanEngine(now);
      } else if (type === 'suv') {
        this.playSuvEngine(now);
      } else {
        this.playSedanEngine(now);
      }
    } catch {
      // Ignore
    }
  }

  /**
   * 1. SEDAN ENGINE: Sporty Twin-Cam 4-Cylinder Rev + Tire Friction Squeak
   */
  playSedanEngine(now) {
    // Twin Sawtooth Oscillators for Twin-Cam Engine RPM Ramp
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(130, now);
    osc1.frequency.exponentialRampToValueAtTime(380, now + 0.35);

    osc2.frequency.setValueAtTime(132, now);
    osc2.frequency.exponentialRampToValueAtTime(390, now + 0.35);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(1600, now + 0.35);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.linearRampToValueAtTime(0.26, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);

    // Subtle tire squeal friction chirp on launch
    const tireNoise = this.ctx.createOscillator();
    const tireGain = this.ctx.createGain();
    tireNoise.type = 'sine';
    tireNoise.frequency.setValueAtTime(1600, now);
    tireNoise.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    tireGain.gain.setValueAtTime(0.06, now);
    tireGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    tireNoise.connect(tireGain);
    tireGain.connect(this.ctx.destination);
    tireNoise.start(now);
    tireNoise.stop(now + 0.08);
  }

  /**
   * 2. SUV ENGINE: Throaty V6/V8 Deep Roar & Heavy Low-End Exhaust
   */
  playSuvEngine(now) {
    const osc1 = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    subOsc.type = 'triangle';

    // Deep heavy V8 tone
    osc1.frequency.setValueAtTime(85, now);
    osc1.frequency.exponentialRampToValueAtTime(240, now + 0.4);

    subOsc.frequency.setValueAtTime(42.5, now); // Sub-bass low rumble
    subOsc.frequency.exponentialRampToValueAtTime(120, now + 0.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, now);
    filter.frequency.exponentialRampToValueAtTime(950, now + 0.4);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(filter);
    subOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    subOsc.start(now);
    osc1.stop(now + 0.45);
    subOsc.stop(now + 0.45);
  }

  /**
   * 3. VAN ENGINE: Commercial Heavy Turbo-Diesel Chug & Spooling Whistle
   */
  playVanEngine(now) {
    // Low Chugging Diesel Piston
    const dieselOsc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    dieselOsc.type = 'square';
    dieselOsc.frequency.setValueAtTime(55, now);
    dieselOsc.frequency.exponentialRampToValueAtTime(145, now + 0.45);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, now);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

    dieselOsc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    dieselOsc.start(now);
    dieselOsc.stop(now + 0.48);

    // Spooling Turbocharger High Whistle
    const turboOsc = this.ctx.createOscillator();
    const turboGain = this.ctx.createGain();

    turboOsc.type = 'sine';
    turboOsc.frequency.setValueAtTime(1200, now + 0.05);
    turboOsc.frequency.exponentialRampToValueAtTime(2800, now + 0.4);

    turboGain.gain.setValueAtTime(0.001, now + 0.05);
    turboGain.gain.linearRampToValueAtTime(0.08, now + 0.2);
    turboGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    turboOsc.connect(turboGain);
    turboGain.connect(this.ctx.destination);

    turboOsc.start(now + 0.05);
    turboOsc.stop(now + 0.45);
  }

  playBump() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }

  playLevelWin() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteTime = now + idx * 0.1;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.2, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.3);
      });
    } catch {
      // Ignore
    }
  }

  playStarChime(starIndex = 0) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const starPitches = [523.25, 659.25, 783.99]; // C5, E5, G5
      const freq = starPitches[starIndex % starPitches.length];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Ignore
    }
  }

  playCoin() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Ignore
    }
  }
}

export const sound = new SoundSystem();
