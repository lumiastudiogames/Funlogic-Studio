/**
 * Clock Gears: Ratio & Rotation Speed Challenge
 * Pure Vanilla JavaScript & HTML5 Canvas 2D/2.5D
 * Multi-Gear Train (3+ Gears) with Final Output Activation & Level Locking System
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GearTrainGame = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  // --- PROCEDURAL AUDIO SYNTHESIZER ---
  class AudioEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.whirOsc = null;
      this.whirGain = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      if (!this.enabled && this.whirGain && this.ctx) {
        this.whirGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      return this.enabled;
    }

    playTick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900 + Math.random() * 150, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.035);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.035);
    }

    playSnap() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, t);
      osc.frequency.exponentialRampToValueAtTime(920, t + 0.07);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.08);
    }

    playClank() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    }

    playWin() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.08);

        gain.gain.setValueAtTime(0, t + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, t + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + idx * 0.08);
        osc.stop(t + idx * 0.08 + 1.2);
      });
    }

    playError() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.setValueAtTime(110, t + 0.08);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    }

    updateWhir(speed) {
      if (!this.enabled || !this.ctx) return;
      const targetGain = Math.min(Math.abs(speed) * 0.0006, 0.04);
      const targetFreq = 70 + Math.min(Math.abs(speed) * 1.3, 280);

      if (!this.whirOsc) {
        this.whirOsc = this.ctx.createOscillator();
        this.whirGain = this.ctx.createGain();
        this.whirOsc.type = 'triangle';
        this.whirOsc.frequency.setValueAtTime(targetFreq, this.ctx.currentTime);
        this.whirGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.whirOsc.connect(this.whirGain);
        this.whirGain.connect(this.ctx.destination);
        this.whirOsc.start();
      }

      const t = this.ctx.currentTime;
      this.whirGain.gain.setTargetAtTime(targetGain, t, 0.1);
      this.whirOsc.frequency.setTargetAtTime(targetFreq, t, 0.1);
    }
  }

  // --- GEAR SPECS (TEETH, METALLIC THEME) ---
  const GEAR_SPECS = {
    10: { teeth: 10, color: 'copper' },
    12: { teeth: 12, color: 'copper' },
    15: { teeth: 15, color: 'brass' },
    16: { teeth: 16, color: 'brass' },
    18: { teeth: 18, color: 'steel' },
    20: { teeth: 20, color: 'steel' },
    24: { teeth: 24, color: 'gold' },
    30: { teeth: 30, color: 'copper' },
    32: { teeth: 32, color: 'brass' },
    36: { teeth: 36, color: 'copper' },
    40: { teeth: 40, color: 'brass' },
    45: { teeth: 45, color: 'steel' },
    48: { teeth: 48, color: 'gold' },
    50: { teeth: 50, color: 'brass' },
    60: { teeth: 60, color: 'steel' }
  };

  // --- 20 PROGRESSIVE HANDCRAFTED CHALLENGES (MINIMUM 3 GEARS) ---
  const LEVELS = [
    {
      id: 1,
      name: "LEVEL 01",
      topic: "Idler Gear Direct 1:1 Transmission",
      desc: "Gear 1 (24T, 60 RPM ↻) drives Intermediate Gear 2 (16T). Choose Gear 3 (Final Output) to reach 60 RPM Clockwise.",
      gears: [
        { id: 'g1', role: 'input', teeth: 24, rpm: 60, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 16, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 24, expectedRpm: 60, expectedDir: 1, name: "Gear 3" },
      options: [12, 24, 36, 48],
      hint: "Idler gears preserve the speed ratio between the first and last gear: Speed_3 = 60 × (24 / Teeth_3). For 60 RPM, choose 24T."
    },
    {
      id: 2,
      name: "LEVEL 02",
      topic: "Speed Step-Up 2× (Multi-Gear Train)",
      desc: "Gear 1 (24T, 60 RPM ↻) -> Gear 2 (20T). Slot the Final Gear 3 to accelerate output to 120 RPM Clockwise.",
      gears: [
        { id: 'g1', role: 'input', teeth: 24, rpm: 60, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 20, name: "Gear 2 (Transmission)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 12, expectedRpm: 120, expectedDir: 1, name: "Gear 3" },
      options: [12, 16, 24, 36],
      hint: "Speed_3 = 60 × (24 / 12) = 120 RPM (Clockwise ↻)."
    },
    {
      id: 3,
      name: "LEVEL 03",
      topic: "Speed Reduction (1:2 Half Speed)",
      desc: "Gear 1 (24T, 60 RPM ↻) -> Gear 2 (12T). Slot Final Gear 3 to reduce output speed to 30 RPM Clockwise.",
      gears: [
        { id: 'g1', role: 'input', teeth: 24, rpm: 60, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 12, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 48, expectedRpm: 30, expectedDir: 1, name: "Gear 3" },
      options: [16, 24, 36, 48],
      hint: "Speed_3 = 60 × (24 / 48) = 60 × 0.5 = 30 RPM."
    },
    {
      id: 4,
      name: "LEVEL 04",
      topic: "Ratio 2 : 3 (Clock Tower Chime Train)",
      desc: "Gear 1 (24T, 60 RPM ↻) -> Gear 2 (18T). Select Final Gear 3 to synchronize at exactly 40 RPM Clockwise.",
      gears: [
        { id: 'g1', role: 'input', teeth: 24, rpm: 60, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 18, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 36, expectedRpm: 40, expectedDir: 1, name: "Gear 3" },
      options: [16, 24, 30, 36],
      hint: "Speed_3 = 60 × (24 / 36) = 60 × (2/3) = 40 RPM."
    },
    {
      id: 5,
      name: "LEVEL 05",
      topic: "High Torque Reduction (1:3 Ratio)",
      desc: "Gear 1 (16T, 90 RPM ↻) -> Gear 2 (24T). Select Final Gear 3 to power the heavy pendulum at 30 RPM.",
      gears: [
        { id: 'g1', role: 'input', teeth: 16, rpm: 90, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 24, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 48, expectedRpm: 30, expectedDir: 1, name: "Gear 3" },
      options: [20, 24, 36, 48],
      hint: "Speed_3 = 90 × (16 / 48) = 90 / 3 = 30 RPM."
    },
    {
      id: 6,
      name: "LEVEL 06",
      topic: "Intermediate Slot Tuning",
      desc: "Gear 1 (30T, 60 RPM ↻) connects through Gear 2 to Final Gear 3 (30T). Choose Gear 2 to bridge the train.",
      gears: [
        { id: 'g1', role: 'input', teeth: 30, rpm: 60, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'slot', name: "Gear 2 (Bridge Idler)" },
        { id: 'g3', role: 'fixed', teeth: 30, name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 20, expectedRpm: 60, expectedDir: 1, name: "Gear 3", altTeeth: [15, 20, 24, 30] },
      options: [15, 20, 24, 30],
      hint: "Any idler gear will successfully bridge the rotation and drive the 30T output gear at 60 RPM!"
    },
    {
      id: 7,
      name: "LEVEL 07",
      topic: "Triple Acceleration 3:1 Overdrive",
      desc: "Gear 1 (36T, 40 RPM ↻) -> Gear 2 (24T). Find Final Gear 3 to spin the governor wheel at 120 RPM.",
      gears: [
        { id: 'g1', role: 'input', teeth: 36, rpm: 40, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 24, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 12, expectedRpm: 120, expectedDir: 1, name: "Gear 3" },
      options: [12, 16, 24, 48],
      hint: "Speed_3 = 40 × (36 / 12) = 40 × 3 = 120 RPM."
    },
    {
      id: 8,
      name: "LEVEL 08",
      topic: "4-Gear Train Direction Inversion",
      desc: "Four gears in a line! Gear 1 (24T, 60 RPM ↻) -> Gear 2 (16T) -> Gear 3 (20T). Slot Final Gear 4 for 60 RPM Counterclockwise.",
      gears: [
        { id: 'g1', role: 'input', teeth: 24, rpm: 60, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 16, name: "Gear 2" },
        { id: 'g3', role: 'fixed', teeth: 20, name: "Gear 3" },
        { id: 'g4', role: 'slot', name: "Gear 4 (Final Output)" }
      ],
      target: { teethRequired: 24, expectedRpm: 60, expectedDir: -1, name: "Gear 4" },
      options: [12, 18, 24, 36],
      hint: "With 4 gears (3 meshes), direction alternates 3 times: ↻ -> ↺ -> ↻ -> ↺ (Counterclockwise)."
    },
    {
      id: 9,
      name: "LEVEL 09",
      topic: "Ratio 3 : 5 Precision Escapement",
      desc: "Gear 1 (24T, 50 RPM ↻) -> Gear 2 (15T). Select Final Gear 3 to calibrate rotation to exactly 30 RPM.",
      gears: [
        { id: 'g1', role: 'input', teeth: 24, rpm: 50, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 15, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 40, expectedRpm: 30, expectedDir: 1, name: "Gear 3" },
      options: [20, 24, 30, 40],
      hint: "Speed_3 = 50 × (24 / 40) = 50 × 0.6 = 30 RPM."
    },
    {
      id: 10,
      name: "LEVEL 10",
      topic: "Master Clockwork 3-Gear Mesh",
      desc: "Gear 1 (36T, 60 RPM ↻) -> Gear 2 (24T). Determine Final Gear 3 to power the escapement wheel at 45 RPM.",
      gears: [
        { id: 'g1', role: 'input', teeth: 36, rpm: 60, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 24, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 48, expectedRpm: 45, expectedDir: 1, name: "Gear 3" },
      options: [24, 36, 40, 48],
      hint: "Speed_3 = 60 × (36 / 48) = 60 × 0.75 = 45 RPM."
    },
    {
      id: 11,
      name: "LEVEL 11",
      topic: "Steam Engine Crank (Ratio 2.5×)",
      desc: "Gear 1 (60T, 40 RPM ↻) -> Gear 2 (30T). Slot Final Gear 3 to spin the generator at 100 RPM.",
      gears: [
        { id: 'g1', role: 'input', teeth: 60, rpm: 40, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 30, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 24, expectedRpm: 100, expectedDir: 1, name: "Gear 3" },
      options: [16, 20, 24, 36],
      hint: "Speed_3 = 40 × (60 / 24) = 40 × 2.5 = 100 RPM."
    },
    {
      id: 12,
      name: "LEVEL 12",
      topic: "Heavy Steam Winch (1:4 Reduction)",
      desc: "Gear 1 (12T, 100 RPM ↻) -> Gear 2 (20T). Find Final Gear 3 for 25 RPM heavy torque lifting power.",
      gears: [
        { id: 'g1', role: 'input', teeth: 12, rpm: 100, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 20, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 48, expectedRpm: 25, expectedDir: 1, name: "Gear 3" },
      options: [24, 36, 40, 48],
      hint: "Speed_3 = 100 × (12 / 48) = 100 / 4 = 25 RPM."
    },
    {
      id: 13,
      name: "LEVEL 13",
      topic: "Astronomical Orrery Planet Drive",
      desc: "Gear 1 (24T, 100 RPM ↻) -> Gear 2 (16T). Select Final Gear 3 to simulate orbital speed at exactly 60 RPM.",
      gears: [
        { id: 'g1', role: 'input', teeth: 24, rpm: 100, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 16, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 40, expectedRpm: 60, expectedDir: 1, name: "Gear 3" },
      options: [20, 24, 36, 40],
      hint: "Speed_3 = 100 × (24 / 40) = 100 × 0.6 = 60 RPM."
    },
    {
      id: 14,
      name: "LEVEL 14",
      topic: "Chrono Escapement 2× Overdrive",
      desc: "Gear 1 (48T, 45 RPM ↻) -> Gear 2 (32T). Find Final Gear 3 to spin the second hand at 90 RPM.",
      gears: [
        { id: 'g1', role: 'input', teeth: 48, rpm: 45, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 32, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 24, expectedRpm: 90, expectedDir: 1, name: "Gear 3" },
      options: [16, 20, 24, 36],
      hint: "Speed_3 = 45 × (48 / 24) = 45 × 2 = 90 RPM."
    },
    {
      id: 15,
      name: "LEVEL 15",
      topic: "Ratio 1 : 5 Mega Reduction",
      desc: "Gear 1 (12T, 150 RPM ↻) -> Gear 2 (18T). What final gear drops rotation to 30 RPM?",
      gears: [
        { id: 'g1', role: 'input', teeth: 12, rpm: 150, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 18, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 60, expectedRpm: 30, expectedDir: 1, name: "Gear 3" },
      options: [24, 36, 48, 60],
      hint: "Speed_3 = 150 × (12 / 60) = 150 / 5 = 30 RPM."
    },
    {
      id: 16,
      name: "LEVEL 16",
      topic: "Dual Idler 4-Gear Transmission",
      desc: "Gear 1 (30T, 80 RPM ↻) -> Gear 2 (15T) -> Gear 3 (20T). Select Final Gear 4 to reach 120 RPM Counterclockwise.",
      gears: [
        { id: 'g1', role: 'input', teeth: 30, rpm: 80, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 15, name: "Gear 2" },
        { id: 'g3', role: 'fixed', teeth: 20, name: "Gear 3" },
        { id: 'g4', role: 'slot', name: "Gear 4 (Final Output)" }
      ],
      target: { teethRequired: 20, expectedRpm: 120, expectedDir: -1, name: "Gear 4" },
      options: [15, 20, 24, 30],
      hint: "Speed_4 = 80 × (30 / 20) = 80 × 1.5 = 120 RPM Counterclockwise (↺)."
    },
    {
      id: 17,
      name: "LEVEL 17",
      topic: "Compound Reduction Stage",
      desc: "Gear 1 (40T, 90 RPM ↻) -> Gear 2 (24T). Select Final Gear 3 to regulate speed at 72 RPM.",
      gears: [
        { id: 'g1', role: 'input', teeth: 40, rpm: 90, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 24, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 50, expectedRpm: 72, expectedDir: 1, name: "Gear 3" },
      options: [30, 40, 45, 50],
      hint: "Speed_3 = 90 × (40 / 50) = 90 × 0.8 = 72 RPM."
    },
    {
      id: 18,
      name: "LEVEL 18",
      topic: "High-Speed Whirring Flywheel (4:1)",
      desc: "Gear 1 (48T, 50 RPM ↻) -> Gear 2 (30T). Slot Final Gear 3 to spin the turbo flywheel at 200 RPM.",
      gears: [
        { id: 'g1', role: 'input', teeth: 48, rpm: 50, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 30, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 12, expectedRpm: 200, expectedDir: 1, name: "Gear 3" },
      options: [12, 16, 24, 32],
      hint: "Speed_3 = 50 × (48 / 12) = 50 × 4 = 200 RPM."
    },
    {
      id: 19,
      name: "LEVEL 19",
      topic: "Ratio 4 : 5 Heavy Mill Gear",
      desc: "Gear 1 (32T, 75 RPM ↻) -> Gear 2 (20T). Find Final Gear 3 to match the millstone at 60 RPM.",
      gears: [
        { id: 'g1', role: 'input', teeth: 32, rpm: 75, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 20, name: "Gear 2 (Idler)" },
        { id: 'g3', role: 'slot', name: "Gear 3 (Final Output)" }
      ],
      target: { teethRequired: 40, expectedRpm: 60, expectedDir: 1, name: "Gear 3" },
      options: [24, 32, 40, 48],
      hint: "Speed_3 = 75 × (32 / 40) = 75 × 0.8 = 60 RPM."
    },
    {
      id: 20,
      name: "LEVEL 20",
      topic: "Grand Horologist Master Engine (Final)",
      desc: "Gear 1 (60T, 90 RPM ↻) -> Gear 2 (36T) -> Gear 3 (24T). Slot Final Gear 4 to strike the bell at 150 RPM Counterclockwise!",
      gears: [
        { id: 'g1', role: 'input', teeth: 60, rpm: 90, dir: 1, name: "Gear 1 (Input)" },
        { id: 'g2', role: 'fixed', teeth: 36, name: "Gear 2" },
        { id: 'g3', role: 'fixed', teeth: 24, name: "Gear 3" },
        { id: 'g4', role: 'slot', name: "Gear 4 (Final Output)" }
      ],
      target: { teethRequired: 36, expectedRpm: 150, expectedDir: -1, name: "Gear 4" },
      options: [18, 24, 36, 45],
      hint: "Speed_4 = 90 × (60 / 36) = 90 × 1.666... = 150 RPM Counterclockwise (↺)!"
    }
  ];

  // --- GAME ENGINE CONTROLLER ---
  class GameEngine {
    constructor(container, onWinCallback) {
      this.container = container;
      this.onWinCallback = onWinCallback || function () {};
      this.audio = new AudioEngine();

      // Load unlocked level from storage (default 1)
      this.unlockedLevel = 1;
      try {
        const saved = localStorage.getItem('geartrain_unlocked_level');
        if (saved) {
          this.unlockedLevel = Math.max(1, Math.min(20, parseInt(saved, 10) || 1));
        }
      } catch (e) {
        this.unlockedLevel = 1;
      }

      this.currentLevelIdx = 0; // Starts at Level 1 (or user can switch)
      this.score = 500;
      this.maxScore = 2000;
      this.startTime = Date.now();
      this.timerSeconds = 0;
      
      this.placedGears = {}; // Keyed by gear slot ID (e.g. 'g3' or 'g2')
      this.draggedGear = null;
      this.hoverSlotId = null;
      this.particles = [];

      this.gearAngles = {}; // Track rotation angle for each gear in train
      this.currentView = 'menu'; // Starts in the Initial Start Menu

      this.createDOM();
      this.initCanvas();
      this.initEvents();
      this.showMenuView();
      this.startTimer();
      this.startRenderLoop();
    }

    createDOM() {
      this.container.innerHTML = `
        <div id="game-stage" class="w-full h-full max-w-5xl mx-auto flex flex-col relative overflow-hidden bg-[#150e09] md:rounded-xl shadow-2xl metallic-frame select-none">
          
          <!-- ============================================== -->
          <!-- 0. INITIAL START MENU VIEW                     -->
          <!-- ============================================== -->
          <div id="menu-view" class="w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-[#241710] via-[#1a0f0a] to-[#120a06] overflow-y-auto relative z-20">
            
            <!-- Steampunk Background Ambience Cogs -->
            <div class="absolute inset-0 pointer-events-none opacity-20 overflow-hidden flex items-center justify-center">
              <svg class="w-[500px] h-[500px] sm:w-[680px] sm:h-[680px] animate-spin-slow text-[#c86d43]" viewBox="-150 -150 300 300">
                <circle r="120" fill="none" stroke="currentColor" stroke-width="16" stroke-dasharray="24,14"/>
                <circle r="85" fill="none" stroke="currentColor" stroke-width="4"/>
                <circle r="35" fill="currentColor"/>
              </svg>
            </div>

            <!-- Top Badge -->
            <div class="z-10 flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2d1b10] border border-[#78522e] text-[10px] sm:text-xs text-[#ffd166] font-bold shadow-md tracking-wider">
              <span>⚙️ HOROLOGY &amp; TRANSMISSION</span>
              <span>•</span>
              <span class="text-[#ffb894]">20 LEVELS</span>
            </div>

            <!-- Center Title & Animated Icon -->
            <div class="z-10 flex flex-col items-center text-center my-auto py-2">
              <div class="relative w-24 h-24 sm:w-32 sm:h-32 mb-2 sm:mb-3 flex items-center justify-center">
                <!-- Outer Interlocking Gears Animation -->
                <svg class="absolute inset-0 w-full h-full animate-spin-slow" viewBox="-60 -60 120 120">
                  <circle r="48" fill="none" stroke="#d4a036" stroke-width="10" stroke-dasharray="16,8"/>
                  <circle r="38" fill="none" stroke="#8e4420" stroke-width="3"/>
                </svg>
                <svg class="absolute w-14 h-14 sm:w-18 sm:h-18 animate-spin-reverse" viewBox="-40 -40 80 80">
                  <circle r="30" fill="none" stroke="#c86d43" stroke-width="8" stroke-dasharray="12,6"/>
                  <circle r="14" fill="#ffd166"/>
                  <circle r="5" fill="#1b1009"/>
                </svg>
                <span class="absolute text-2xl sm:text-3xl filter drop-shadow">⚙️</span>
              </div>

              <h1 class="text-3xl sm:text-5xl font-black text-[#ffd166] tracking-wider uppercase font-serif drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]">
                CLOCK GEARS
              </h1>
              <p class="text-xs sm:text-sm font-bold text-[#ffb894] tracking-widest uppercase mt-1">
                Gear Ratio &amp; Rotation Speed Challenge
              </p>
              <div class="mt-2 text-[10px] sm:text-xs text-[#cbb088] max-w-sm sm:max-w-md px-2">
                Connect the gear train to transmit torque and achieve the target rotation speed at the final output shaft.
              </div>

              <!-- Menu Actions -->
              <div class="w-full max-w-xs sm:max-w-sm flex flex-col gap-2.5 sm:gap-3 mt-4 sm:mt-6">
                <!-- Play Button -->
                <button id="btn-menu-play" class="btn-tactile btn-gold w-full py-3 sm:py-3.5 px-6 rounded-2xl text-base sm:text-lg font-black flex items-center justify-center gap-2.5 shadow-2xl tracking-wider hover:scale-105 active:scale-95 transition-transform">
                  <span class="text-lg">▶</span>
                  <span id="lbl-menu-play">PLAY</span>
                </button>

                <!-- Level Select Button -->
                <button id="btn-menu-levels" class="btn-tactile btn-dark w-full py-2.5 sm:py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-[#ffd166] border border-[#78522e] hover:scale-102 active:scale-98 transition-transform">
                  <span>⚙️</span>
                  <span>SELECT LEVEL (1 - 20)</span>
                </button>

                <!-- Tutorial / Rules Button -->
                <button id="btn-menu-tutorial" class="btn-tactile btn-dark w-full py-2.5 sm:py-3 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-[#e6ca98] border border-[#5c3e23] hover:scale-102 active:scale-98 transition-transform">
                  <span>📖</span>
                  <span>HOW TO PLAY &amp; RULES</span>
                </button>

                <!-- Sound Button -->
                <button id="btn-menu-sound" class="btn-tactile btn-dark w-full py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 text-[#cbb088] border border-[#4d321c]">
                  <span id="menu-sound-icon">🔊</span>
                  <span id="menu-sound-text">SOUND: ON</span>
                </button>
              </div>
            </div>

            <!-- Bottom: Player Progress Status -->
            <div class="z-10 w-full max-w-xs sm:max-w-md bg-[#19100a] border border-[#5a3d24] rounded-xl p-2.5 sm:p-3 shadow-inner">
              <div class="flex items-center justify-between text-[10px] sm:text-xs mb-1">
                <span class="text-[#cbb088] font-bold flex items-center gap-1">
                  <span>🏆 PROGRESS:</span>
                  <span class="text-[#ffd166] font-black"><span id="menu-unlocked-count">1</span> / 20 Levels</span>
                </span>
                <span class="text-[#cbb088] font-bold">
                  SCORE: <span id="menu-score-count" class="text-[#ffd166] font-black">${this.score}</span>
                </span>
              </div>
              <div class="w-full h-2 bg-[#0d0805] rounded-full overflow-hidden border border-[#452e1a]">
                <div id="menu-unlocked-bar" class="h-full bg-gradient-to-r from-[#d4a036] to-[#ffd166] transition-all duration-500 rounded-full" style="width: 5%"></div>
              </div>
            </div>

          </div>

          <!-- ============================================== -->
          <!-- 1. GAMEPLAY SIMULATION VIEW                    -->
          <!-- ============================================== -->
          <div id="game-view" class="hidden w-full h-full flex flex-col relative overflow-hidden bg-[#150e09]">
            
            <!-- 1.1 TOP HEADER -->
            <header class="w-full h-10 sm:h-11 bg-[#22160f] px-2 sm:px-4 border-b border-[#5c3e23] flex items-center justify-between gap-1.5 sm:gap-2 shrink-0 z-20">
              <!-- Left: Home Menu Button & Title -->
              <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button id="btn-back-to-menu" class="btn-tactile btn-dark px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold text-[#ffd166] border border-[#78522e] flex items-center gap-1 shrink-0 whitespace-nowrap" title="Return to Main Menu">
                  <span>🏠</span>
                  <span>MENU</span>
                </button>
                <div class="w-px h-5 bg-[#5c3e23] hidden xs:block"></div>
                <div class="flex items-baseline gap-1">
                  <h2 class="font-black text-xs sm:text-sm text-[#ffd166] tracking-wider uppercase leading-none whitespace-nowrap">Clock Gears</h2>
                </div>
              </div>

              <!-- Center: Level Tag -->
              <button id="btn-level-select" class="btn-tactile px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-black bg-[#3b2718] text-[#ffd166] border border-[#78522e] flex items-center gap-1 shrink-0 whitespace-nowrap" title="Select Level (1-20)">
                <span id="lbl-level-tag">LEVEL 01</span> ▾
              </button>

              <!-- Right: Score, Timer, Sound -->
              <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <div class="bg-[#1b120c] border border-[#5c3e23] rounded px-1.5 sm:px-2 py-0.5 text-center min-w-[48px] sm:min-w-[56px] shrink-0">
                  <span class="block text-[7px] font-bold text-[#a68660] uppercase leading-none">PTS</span>
                  <span id="hud-score" class="font-black text-[11px] sm:text-xs text-[#ffd166] leading-none">${this.score}</span>
                </div>

                <div class="bg-[#1b120c] border border-[#5c3e23] rounded px-1.5 py-0.5 text-center min-w-[40px] sm:min-w-[44px] shrink-0">
                  <span class="block text-[7px] font-bold text-[#a68660] uppercase leading-none">TIME</span>
                  <span id="hud-timer" class="font-bold text-[11px] sm:text-xs text-[#e6ca98] leading-none font-mono">00:00</span>
                </div>

                <button id="btn-sound" class="btn-tactile btn-dark w-6 h-6 sm:w-7 sm:h-7 rounded flex items-center justify-center shrink-0" title="Toggle Sound">
                  <span id="sound-icon">🔊</span>
                </button>
              </div>
            </header>

            <!-- 1.2 CLICKABLE & EXPANDABLE PROBLEM BANNER -->
            <div id="problem-banner" class="w-full bg-[#1c110a] hover:bg-[#251810] active:bg-[#2c1d13] transition-colors cursor-pointer px-2.5 sm:px-4 py-1 sm:py-1.5 border-b border-[#4d321c] flex items-center justify-between gap-1.5 shrink-0 z-10 select-none" title="Click to expand/collapse problem statement">
              <div class="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
                <span class="text-[9px] sm:text-[10px] font-black text-[#d4a036] tracking-wider uppercase shrink-0 flex items-center gap-1">
                  <span>📖 OBJECTIVE:</span>
                </span>
                <span id="problem-text" class="text-[10px] sm:text-xs text-[#e6ca98] font-medium truncate">
                  Connect the gear train to reach the target speed at the final output shaft.
                </span>
                <span id="problem-toggle-icon" class="text-[8px] sm:text-[9px] font-bold text-[#ffd166] bg-[#3a2517] hover:bg-[#4d321f] px-1 sm:px-1.5 py-0.5 rounded border border-[#6d4625] shrink-0 whitespace-nowrap">
                  INFO ▾
                </span>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <span class="text-[8px] sm:text-[9px] font-bold text-[#a68660] uppercase hidden sm:inline">TARGET:</span>
                <span id="lbl-target-badge" class="px-1.5 sm:px-2 py-0.5 rounded bg-[#382618] border border-[#d4a036] text-[10px] sm:text-[11px] font-black text-[#ffd166] shadow whitespace-nowrap">
                  60 RPM ↻
                </span>
              </div>
            </div>

            <!-- 1.3 EXPANDED PROBLEM DRAWER -->
            <div id="problem-expanded-drawer" class="hidden w-full bg-[#241710] border-b-2 border-[#8e6837] px-3 sm:px-5 py-2 text-xs text-[#e6ca98] shadow-2xl z-20 transition-all shrink-0">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="font-bold text-[#ffd166] text-xs uppercase mb-0.5 flex items-center gap-1.5">
                    <span>📜 COMPLETE CHALLENGE STATEMENT</span>
                  </div>
                  <p id="problem-full-text" class="text-xs sm:text-[13px] leading-relaxed text-[#f3e3c6]">
                    Connect the gear train to activate the output shaft at the required rotation speed and direction.
                  </p>
                  <div class="mt-1 flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-[#cbb088]">
                    <span id="problem-topic-tag" class="font-bold text-[#ffd166]">Topic: Multi-Gear Train Transmission</span>
                    <span>•</span>
                    <span class="text-[#e6ca98]">Rule: Each mesh alternates rotation direction (↻ &harr; ↺). Intermediate idler gears preserve the final speed ratio!</span>
                  </div>
                </div>
                <button id="btn-close-problem-drawer" class="btn-tactile btn-dark px-2 py-1 rounded text-[10px] font-bold text-[#ffd166] shrink-0" title="Close Panel">
                  ✕ CLOSE
                </button>
              </div>
            </div>

            <!-- 1.4 INTERACTIVE CANVAS (MAIN VIEWPORT) -->
            <main class="flex-1 min-h-0 relative w-full bg-[#120c08] overflow-hidden flex flex-col p-1.5 sm:p-2.5 gap-1.5">
              <div id="canvas-container" class="relative w-full flex-1 min-h-[140px] rounded-xl overflow-hidden bg-[#17100a] border border-[#4a321e] shadow-inner">
                <canvas id="game-canvas" class="w-full h-full block"></canvas>
              </div>

              <!-- 1.5 FORMULA PARCHMENT -->
              <div id="parchment-calc" class="w-full parchment rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-md shrink-0">
                <div class="flex items-center justify-between border-b border-[#8e6837]/40 pb-0.5 mb-0.5">
                  <span class="font-bold text-[9px] sm:text-[10px] text-[#5a3818] tracking-widest uppercase flex items-center gap-1">
                    📜 TRANSMISSION FORMULA
                  </span>
                  <span id="badge-calc-status" class="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#3b2718] text-[#ffd166] whitespace-nowrap">
                    AWAITING GEAR PLACEMENT
                  </span>
                </div>
                <div id="calc-formula-content" class="text-[10px] sm:text-[11px] leading-tight font-mono text-[#2c1c0e]">
                  <!-- Populated dynamically -->
                </div>
              </div>
            </main>

            <!-- 1.6 COGS INVENTORY ROW (LARGE BUTTONS) -->
            <div class="w-full bg-[#1b1009] border-t border-[#4d321c] px-3 py-2 flex items-center justify-center shrink-0 z-20 shadow-inner">
              <div id="cogs-dock" class="flex items-center justify-center gap-2.5 sm:gap-4 flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar py-1">
                <!-- Dynamically populated drag gears -->
              </div>
            </div>

            <!-- 1.7 FOOTER (ONLY CHECK BUTTON) -->
            <footer class="w-full bg-[#20140c] border-t border-[#5c3e23] px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-center shrink-0 z-20">
              <button id="btn-check-answer" class="btn-tactile btn-green w-full max-w-xs sm:max-w-sm py-2.5 sm:py-3 px-6 rounded-xl text-sm sm:text-base font-black flex items-center justify-center gap-2 shadow-xl tracking-wide whitespace-nowrap">
                ✓ CHECK
              </button>
            </footer>

          </div>

          <!-- ============================================== -->
          <!-- 2. MODAL: LEVEL SELECTOR (1-20 LEVELS)         -->
          <!-- ============================================== -->
          <div id="modal-level-select" class="hidden absolute inset-0 bg-black/85 backdrop-blur-md z-40 flex items-center justify-center p-3 sm:p-4">
            <div class="bg-[#241710] border-2 border-[#8e6837] rounded-2xl w-full max-w-lg p-3 sm:p-5 shadow-2xl flex flex-col max-h-[90vh]">
              <div class="flex items-center justify-between border-b border-[#5c3e23] pb-2 mb-2">
                <div>
                  <h2 class="text-xs sm:text-base font-bold text-[#ffd166] flex items-center gap-1.5 font-serif">
                    ⚙️ SELECT LEVEL (20 CHALLENGES)
                  </h2>
                  <span class="text-[9px] sm:text-[10px] text-[#cbb088]">Complete stages to unlock the next challenges</span>
                </div>
                <button id="btn-close-levels" class="btn-tactile btn-dark w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-xs font-bold">✕</button>
              </div>
              <div id="levels-grid" class="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2 overflow-y-auto max-h-[50vh] p-1">
                <!-- Populated dynamically with locked/unlocked status -->
              </div>
            </div>
          </div>

          <!-- ============================================== -->
          <!-- 3. MODAL: TUTORIAL & RULES (HOW TO PLAY)       -->
          <!-- ============================================== -->
          <div id="modal-tutorial" class="hidden absolute inset-0 bg-black/85 backdrop-blur-md z-40 flex items-center justify-center p-3 sm:p-4">
            <div class="bg-[#241710] border-2 border-[#8e6837] rounded-2xl w-full max-w-lg p-4 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
              <div class="flex items-center justify-between border-b border-[#5c3e23] pb-2 mb-3">
                <h2 class="text-sm sm:text-base font-bold text-[#ffd166] flex items-center gap-2 font-serif">
                  <span>📖</span> <span>HOW GEARS WORK</span>
                </h2>
                <button id="btn-close-tutorial" class="btn-tactile btn-dark w-7 h-7 rounded-lg text-xs font-bold">✕</button>
              </div>

              <div class="space-y-2.5 text-xs sm:text-sm text-[#e6ca98]">
                <!-- Card 1 -->
                <div class="bg-[#1b1009] border border-[#5c3e23] p-2.5 rounded-xl flex items-start gap-2.5">
                  <div class="text-xl shrink-0">1️⃣</div>
                  <div>
                    <h3 class="font-bold text-[#ffd166] text-xs uppercase mb-0.5">Input Motor Gear</h3>
                    <p class="text-[11px] sm:text-xs text-[#cbb088] leading-relaxed">
                      The primary drive motor powering the gear train. Rotates at a fixed speed (RPM) and defined direction (↻ Clockwise or ↺ Counterclockwise).
                    </p>
                  </div>
                </div>

                <!-- Card 2 -->
                <div class="bg-[#1b1009] border border-[#5c3e23] p-2.5 rounded-xl flex items-start gap-2.5">
                  <div class="text-xl shrink-0">2️⃣</div>
                  <div>
                    <h3 class="font-bold text-[#ffd166] text-xs uppercase mb-0.5">Intermediate Idler Gears</h3>
                    <p class="text-[11px] sm:text-xs text-[#cbb088] leading-relaxed">
                      Each meshing pair reverses the direction of rotation. Idler gears transmit motion across distance and adjust direction <b>without affecting the final speed ratio</b> between the first and last gears!
                    </p>
                  </div>
                </div>

                <!-- Card 3 -->
                <div class="bg-[#1b1009] border border-[#5c3e23] p-2.5 rounded-xl flex items-start gap-2.5">
                  <div class="text-xl shrink-0">3️⃣</div>
                  <div>
                    <h3 class="font-bold text-[#ffd166] text-xs uppercase mb-0.5">RPM &amp; Output Speed Ratio</h3>
                    <p class="text-[11px] sm:text-xs text-[#cbb088] leading-relaxed">
                      Formula: <code class="text-[#ffd166] font-bold">Output_RPM = Input_RPM × (Input_Teeth / Output_Teeth)</code>.<br>
                      Smaller gears turn faster; larger gears turn slower.
                    </p>
                  </div>
                </div>

                <!-- Card 4 -->
                <div class="bg-[#1b1009] border border-[#5c3e23] p-2.5 rounded-xl flex items-start gap-2.5">
                  <div class="text-xl shrink-0">🎯</div>
                  <div>
                    <h3 class="font-bold text-[#ffd166] text-xs uppercase mb-0.5">How to Play</h3>
                    <p class="text-[11px] sm:text-xs text-[#cbb088] leading-relaxed">
                      Drag or click cogs from the bottom tray into empty socket slots. To remove a placed gear, tap on it on the canvas. When your gear train is complete, click <b>✓ CHECK</b>!
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-[#5c3e23] flex items-center justify-end">
                <button id="btn-tutorial-start" class="btn-tactile btn-gold px-5 py-2 rounded-xl text-xs sm:text-sm font-bold">
                  GOT IT, LET'S PLAY! ▶
                </button>
              </div>
            </div>
          </div>

        </div>
      `;

      // Cache DOM elements
      this.menuView = document.getElementById('menu-view');
      this.gameView = document.getElementById('game-view');
      this.canvas = document.getElementById('game-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.cogsDock = document.getElementById('cogs-dock');
      this.calcFormulaContent = document.getElementById('calc-formula-content');
      this.badgeCalcStatus = document.getElementById('badge-calc-status');
      this.problemText = document.getElementById('problem-text');
      this.problemFullText = document.getElementById('problem-full-text');
      this.problemTopicTag = document.getElementById('problem-topic-tag');
      this.problemBanner = document.getElementById('problem-banner');
      this.problemDrawer = document.getElementById('problem-expanded-drawer');
      this.problemToggleIcon = document.getElementById('problem-toggle-icon');
      this.btnCloseProblemDrawer = document.getElementById('btn-close-problem-drawer');
      this.lblTargetBadge = document.getElementById('lbl-target-badge');
      this.lblLevelTag = document.getElementById('lbl-level-tag');
      this.hudScore = document.getElementById('hud-score');
      this.hudTimer = document.getElementById('hud-timer');
      this.menuUnlockedCount = document.getElementById('menu-unlocked-count');
      this.menuUnlockedBar = document.getElementById('menu-unlocked-bar');
      this.menuScoreCount = document.getElementById('menu-score-count');
      this.lblMenuPlay = document.getElementById('lbl-menu-play');
      this.menuSoundIcon = document.getElementById('menu-sound-icon');
      this.menuSoundText = document.getElementById('menu-sound-text');
    }

    showMenuView() {
      this.currentView = 'menu';
      if (this.menuView) this.menuView.classList.remove('hidden');
      if (this.gameView) this.gameView.classList.add('hidden');
      this.updateMenuStats();
    }

    showGameView(levelIdx = null) {
      this.currentView = 'game';
      if (levelIdx !== null) {
        this.currentLevelIdx = Math.max(0, Math.min(LEVELS.length - 1, levelIdx));
      }
      if (this.menuView) this.menuView.classList.add('hidden');
      if (this.gameView) this.gameView.classList.remove('hidden');
      
      this.loadLevel(this.currentLevelIdx);
      if (this.canvas && this.canvas.parentElement) {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.updateGearPositions();
      }
    }

    updateMenuStats() {
      if (this.menuUnlockedCount) {
        this.menuUnlockedCount.innerText = `${this.unlockedLevel}`;
      }
      if (this.menuUnlockedBar) {
        const pct = Math.min(100, Math.max(5, (this.unlockedLevel / 20) * 100));
        this.menuUnlockedBar.style.width = `${pct}%`;
      }
      if (this.menuScoreCount) {
        this.menuScoreCount.innerText = `${this.score}`;
      }
      if (this.lblMenuPlay) {
        this.lblMenuPlay.innerText = this.unlockedLevel > 1 ? `CONTINUE (LEVEL ${this.unlockedLevel.toString().padStart(2, '0')})` : 'PLAY';
      }
    }

    openTutorialModal() {
      const modal = document.getElementById('modal-tutorial');
      if (modal) modal.classList.remove('hidden');
    }

    closeTutorialModal() {
      const modal = document.getElementById('modal-tutorial');
      if (modal) modal.classList.add('hidden');
    }

    initCanvas() {
      this.dpr = 1;
      const resize = () => {
        if (!this.canvas || !this.canvas.parentElement) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.width = rect.width;
        this.height = rect.height;

        this.canvas.width = Math.floor(this.width * this.dpr);
        this.canvas.height = Math.floor(this.height * this.dpr);

        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this.dpr, this.dpr);

        this.updateGearPositions();
      };

      const observer = new ResizeObserver(resize);
      observer.observe(this.canvas.parentElement);
      resize();
    }

    getGearRadius(teeth) {
      if (!teeth) teeth = 24;
      const unit = this.currentUnit || 2.8;
      return Math.max(24, teeth * unit);
    }

    updateGearPositions() {
      if (!this.width || !this.height || !this.currentLevelData) return;
      const centerY = this.height * 0.48;
      const gears = this.currentLevelData.gears;
      const count = gears.length;

      const teethList = gears.map(g => {
        return g.teeth || (this.placedGears[g.id] ? this.placedGears[g.id].teeth : 24);
      });

      // Total span in teeth units: 2 * sum(teeth)
      const totalTeethSum = teethList.reduce((sum, t) => sum + t, 0);
      const totalTeethSpan = 2 * totalTeethSum;

      // Max width we want the gear train to span (up to 88% width, leaving ~20px safe padding on edges)
      const targetWidth = Math.max(80, Math.min(this.width * 0.88, this.width - 32));
      const unitByWidth = targetWidth / Math.max(1, totalTeethSpan);

      // Max gear radius vertically: leave room for top label and bottom RPM
      const maxTeeth = Math.max(...teethList);
      const maxAllowedRadiusH = (this.height - 70) * 0.42;
      const unitByHeight = maxAllowedRadiusH / Math.max(1, maxTeeth);

      // Choose optimal scaling factor
      const unit = Math.min(unitByWidth, unitByHeight);
      this.currentUnit = unit;

      // Compute actual pixel radii
      const radii = teethList.map(t => Math.max(20, t * unit));

      const totalPixelSpan = 2 * radii.reduce((sum, r) => sum + r, 0);
      let startX = (this.width - totalPixelSpan) / 2 + radii[0];

      this.gearPositions = [];
      let currentX = startX;

      for (let i = 0; i < count; i++) {
        if (i > 0) {
          currentX += radii[i - 1] + radii[i];
        }
        this.gearPositions.push({
          id: gears[i].id,
          role: gears[i].role,
          x: currentX,
          y: centerY,
          radius: radii[i],
          originalRadius: radii[i]
        });
      }
    }

    initEvents() {
      // Sound sync function
      const syncSoundIcons = (isOn) => {
        const soundIcon = document.getElementById('sound-icon');
        if (soundIcon) soundIcon.innerText = isOn ? '🔊' : '🔇';
        if (this.menuSoundIcon) this.menuSoundIcon.innerText = isOn ? '🔊' : '🔇';
        if (this.menuSoundText) this.menuSoundText.innerText = isOn ? 'SOUND: ON' : 'SOUND: MUTED';
      };

      // Sound buttons
      const btnSound = document.getElementById('btn-sound');
      if (btnSound) {
        btnSound.addEventListener('click', () => {
          const on = this.audio.toggle();
          syncSoundIcons(on);
        });
      }

      const btnMenuSound = document.getElementById('btn-menu-sound');
      if (btnMenuSound) {
        btnMenuSound.addEventListener('click', () => {
          const on = this.audio.toggle();
          syncSoundIcons(on);
        });
      }

      // Initial Menu: Play Button
      const btnMenuPlay = document.getElementById('btn-menu-play');
      if (btnMenuPlay) {
        btnMenuPlay.addEventListener('click', () => {
          this.audio.playTick();
          const targetLevel = (this.unlockedLevel && this.unlockedLevel > 0) ? this.unlockedLevel - 1 : 0;
          this.showGameView(targetLevel);
        });
      }

      // Initial Menu: Level Select Button
      const btnMenuLevels = document.getElementById('btn-menu-levels');
      if (btnMenuLevels) {
        btnMenuLevels.addEventListener('click', () => {
          this.audio.playTick();
          this.openLevelModal();
        });
      }

      // Initial Menu: Tutorial Button
      const btnMenuTutorial = document.getElementById('btn-menu-tutorial');
      if (btnMenuTutorial) {
        btnMenuTutorial.addEventListener('click', () => {
          this.audio.playTick();
          this.openTutorialModal();
        });
      }

      // Tutorial Close and Start
      const btnCloseTutorial = document.getElementById('btn-close-tutorial');
      if (btnCloseTutorial) {
        btnCloseTutorial.addEventListener('click', () => {
          this.closeTutorialModal();
        });
      }

      const btnTutorialStart = document.getElementById('btn-tutorial-start');
      if (btnTutorialStart) {
        btnTutorialStart.addEventListener('click', () => {
          this.closeTutorialModal();
          const targetLevel = (this.unlockedLevel && this.unlockedLevel > 0) ? this.unlockedLevel - 1 : 0;
          this.showGameView(targetLevel);
        });
      }

      // Header: Back to Menu Button
      const btnBackToMenu = document.getElementById('btn-back-to-menu');
      if (btnBackToMenu) {
        btnBackToMenu.addEventListener('click', () => {
          this.audio.playTick();
          this.showMenuView();
        });
      }

      // Expandable Problem Toggle
      const toggleProblem = () => {
        const isHidden = this.problemDrawer.classList.contains('hidden');
        if (isHidden) {
          this.problemDrawer.classList.remove('hidden');
          this.problemToggleIcon.innerHTML = '▴ COLLAPSE';
          this.audio.playTick();
        } else {
          this.problemDrawer.classList.add('hidden');
          this.problemToggleIcon.innerHTML = 'READ FULL ▾';
        }
      };

      this.problemBanner.addEventListener('click', toggleProblem);
      this.btnCloseProblemDrawer.addEventListener('click', (e) => {
        e.stopPropagation();
        this.problemDrawer.classList.add('hidden');
        this.problemToggleIcon.innerHTML = 'READ FULL ▾';
      });

      // Reset (if present)
      const btnReset = document.getElementById('btn-reset');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          this.audio.playClank();
          this.placedGears = {};
          this.updateGearPositions();
          this.updateCalculationParchment();
        });
      }

      // Hint (if present)
      const btnHint = document.getElementById('btn-hint');
      if (btnHint) {
        btnHint.addEventListener('click', () => {
          this.showHint();
        });
      }

      // Check Answer
      const btnCheck = document.getElementById('btn-check-answer');
      if (btnCheck) {
        btnCheck.addEventListener('click', () => {
          this.checkAnswer();
        });
      }

      // Level Select Modal Trigger from Game View
      document.getElementById('btn-level-select').addEventListener('click', () => {
        this.openLevelModal();
      });

      document.getElementById('btn-close-levels').addEventListener('click', () => {
        document.getElementById('modal-level-select').classList.add('hidden');
      });

      // Pointer / Drag & Drop Handling
      const getCanvasCoords = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
          x: clientX - rect.left,
          y: clientY - rect.top
        };
      };

      // Tap on placed gear to remove it
      this.canvas.addEventListener('click', (e) => {
        const pos = getCanvasCoords(e);
        if (this.gearPositions) {
          for (const gp of this.gearPositions) {
            if (gp.role === 'slot' && this.placedGears[gp.id]) {
              const dist = Math.hypot(pos.x - gp.x, pos.y - gp.y);
              if (dist < gp.radius * 1.05) {
                delete this.placedGears[gp.id];
                this.audio.playClank();
                this.updateGearPositions();
                this.updateCalculationParchment();
                break;
              }
            }
          }
        }
      });

      const onPointerMove = (e) => {
        if (!this.draggedGear) return;
        const pos = getCanvasCoords(e);
        this.draggedGear.x = pos.x;
        this.draggedGear.y = pos.y;

        // Check proximity to any empty slot
        this.hoverSlotId = null;
        if (this.gearPositions) {
          for (const gp of this.gearPositions) {
            if (gp.role === 'slot') {
              const dist = Math.hypot(pos.x - gp.x, pos.y - gp.y);
              if (dist < Math.max(80, gp.radius * 1.25)) {
                this.hoverSlotId = gp.id;
                break;
              }
            }
          }
        }
        e.preventDefault();
      };

      const onPointerUp = (e) => {
        if (!this.draggedGear) return;
        const pos = getCanvasCoords(e);

        let snapped = false;
        if (this.gearPositions) {
          for (const gp of this.gearPositions) {
            if (gp.role === 'slot') {
              const dist = Math.hypot(pos.x - gp.x, pos.y - gp.y);
              if (dist < Math.max(90, gp.radius * 1.35)) {
                // Snap gear into this slot!
                this.placedGears[gp.id] = {
                  teeth: this.draggedGear.teeth,
                  color: GEAR_SPECS[this.draggedGear.teeth]?.color || 'gold'
                };
                this.audio.playSnap();
                this.updateGearPositions();
                this.createSparks(gp.x, gp.y, 24);
                this.updateCalculationParchment();
                snapped = true;
                break;
              }
            }
          }
        }

        if (!snapped) {
          this.audio.playTick();
        }

        this.draggedGear = null;
        this.hoverSlotId = null;
        e.preventDefault();
      };

      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('touchend', onPointerUp, { passive: false });
    }

    loadLevel(idx) {
      this.currentLevelIdx = Math.max(0, Math.min(idx, LEVELS.length - 1));
      const lvl = LEVELS[this.currentLevelIdx];

      this.currentLevelData = lvl;
      this.lblLevelTag.innerText = lvl.name;
      this.problemText.innerText = lvl.desc;
      this.problemFullText.innerText = lvl.desc;
      this.problemTopicTag.innerText = `Topic: ${lvl.topic}`;

      const target = lvl.target;
      this.lblTargetBadge.innerText = `${target.expectedRpm} RPM ${target.expectedDir === 1 ? '↻' : '↺'}`;

      this.placedGears = {};
      this.gearAngles = {};

      this.updateGearPositions();
      this.renderDockCogs(lvl.options);
      this.updateCalculationParchment();
    }

    renderDockCogs(options) {
      this.cogsDock.innerHTML = '';
      options.forEach(teeth => {
        const spec = GEAR_SPECS[teeth] || GEAR_SPECS[24];
        const btn = document.createElement('div');
        btn.className = 'btn-tactile rounded-2xl px-3.5 sm:px-5 py-1.5 sm:py-2 bg-[#2a1b12] border border-[#6b4728] cursor-grab active:cursor-grabbing flex items-center justify-center gap-2 min-w-[70px] sm:min-w-[88px] transition-transform hover:scale-105 active:scale-95 select-none shrink-0 shadow-lg';
        
        btn.innerHTML = `
          <div class="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center pointer-events-none">
            <svg class="w-full h-full" viewBox="-30 -30 60 60">
              <circle r="22" fill="none" stroke="${spec.color === 'copper' ? '#c86d43' : (spec.color === 'gold' ? '#d4a036' : '#94a3b8')}" stroke-width="7" stroke-dasharray="8,5"/>
              <circle r="8" fill="#ffd166"/>
              <circle r="3.5" fill="#1b1009"/>
            </svg>
          </div>
          <span class="text-sm sm:text-base font-black text-[#ffd166] pointer-events-none whitespace-nowrap tracking-wide">${teeth}T</span>
        `;

        const startDrag = (e) => {
          this.audio.init();
          const rect = this.canvas.getBoundingClientRect();
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const clientY = e.touches ? e.touches[0].clientY : e.clientY;

          this.draggedGear = {
            teeth: teeth,
            color: spec.color,
            x: clientX - rect.left,
            y: clientY - rect.top
          };
          this.audio.playTick();
          e.preventDefault();
        };

        btn.addEventListener('mousedown', startDrag);
        btn.addEventListener('touchstart', startDrag, { passive: false });

        // Click to auto-fill first open slot
        btn.addEventListener('click', () => {
          const gears = this.currentLevelData.gears;
          for (const g of gears) {
            if (g.role === 'slot' && !this.placedGears[g.id]) {
              this.placedGears[g.id] = {
                teeth: teeth,
                color: spec.color
              };
              this.audio.playSnap();
              this.updateGearPositions();
              const gp = this.gearPositions.find(p => p.id === g.id);
              if (gp) this.createSparks(gp.x, gp.y, 20);
              this.updateCalculationParchment();
              break;
            }
          }
        });

        this.cogsDock.appendChild(btn);
      });
    }

    calculateTrainSpeed() {
      const gears = this.currentLevelData.gears;
      let currentRpm = gears[0].rpm;
      let currentDir = gears[0].dir;
      let allSlotsFilled = true;
      const speeds = [{ id: gears[0].id, teeth: gears[0].teeth, rpm: currentRpm, dir: currentDir }];

      for (let i = 1; i < gears.length; i++) {
        const prevGear = gears[i - 1];
        const thisGear = gears[i];

        const prevTeeth = prevGear.teeth || (this.placedGears[prevGear.id] ? this.placedGears[prevGear.id].teeth : null);
        const thisTeeth = thisGear.teeth || (this.placedGears[thisGear.id] ? this.placedGears[thisGear.id].teeth : null);

        if (!thisTeeth || !prevTeeth) {
          allSlotsFilled = false;
          speeds.push({ id: thisGear.id, teeth: thisTeeth, rpm: 0, dir: 1, active: false });
        } else {
          currentDir = -currentDir;
          currentRpm = (currentRpm * (prevTeeth / thisTeeth));
          speeds.push({ id: thisGear.id, teeth: thisTeeth, rpm: Math.round(currentRpm * 10) / 10, dir: currentDir, active: true });
        }
      }

      return { allSlotsFilled, speeds, finalOutput: speeds[speeds.length - 1] };
    }

    updateCalculationParchment() {
      const lvl = this.currentLevelData;
      const target = lvl.target;
      const train = this.calculateTrainSpeed();
      const finalGear = train.finalOutput;

      if (!train.allSlotsFilled) {
        this.badgeCalcStatus.innerText = "AWAITING GEAR PLACEMENT";
        this.badgeCalcStatus.className = "text-[9px] sm:text-[10px] font-bold px-2 py-0.2 rounded bg-[#3b2718] text-[#ffd166]";

        this.calcFormulaContent.innerHTML = `
          <div class="text-[#5a3818] font-bold">
            Gear Train Law: Speed<sub>Final</sub> = Speed<sub>Input</sub> × ( Teeth<sub>Input</sub> / Teeth<sub>Final</sub> )
          </div>
          <div class="text-[#7c5630] text-[10px] sm:text-[11px] mt-0.5">
            • Drag or click Cogs from the inventory row into the open socket(s).<br>
            • Goal: Activate <b>${target.name}</b> to spin at exactly <b>${target.expectedRpm} RPM</b> (${target.expectedDir === 1 ? 'Clockwise ↻' : 'Counterclockwise ↺'}).
          </div>
        `;
        return;
      }

      const inputGear = lvl.gears[0];
      const isCorrectTeeth = Array.isArray(target.altTeeth)
        ? target.altTeeth.includes(finalGear.teeth)
        : finalGear.teeth === target.teethRequired;
      const isCorrectRpm = Math.abs(finalGear.rpm - target.expectedRpm) < 0.5;
      const isCorrect = isCorrectTeeth && isCorrectRpm;

      const dirStr = finalGear.dir === 1 ? 'Clockwise ↻' : 'Counterclockwise ↺';

      if (isCorrect) {
        this.badgeCalcStatus.innerText = "✓ TARGET ACTIVATED & MATCHED!";
        this.badgeCalcStatus.className = "text-[9px] sm:text-[10px] font-bold px-2 py-0.2 rounded bg-green-700 text-green-100 animate-pulse";
      } else {
        this.badgeCalcStatus.innerText = "FINAL GEAR MISMATCHED";
        this.badgeCalcStatus.className = "text-[9px] sm:text-[10px] font-bold px-2 py-0.2 rounded bg-amber-700 text-amber-100";
      }

      const ratioStr = `${inputGear.teeth}T &rarr; ${finalGear.teeth}T`;

      this.calcFormulaContent.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] sm:text-[12px]">
          <div>
            <b>1. Train Chain:</b> ${lvl.gears.length} Gears in series (${ratioStr})<br>
            <b>2. Output Rotation:</b> Alternating meshes &rarr; <b>${dirStr}</b>
          </div>
          <div>
            <b>3. Speed Formula:</b><br>
            Speed<sub>Final</sub> = ${inputGear.rpm} RPM × (${inputGear.teeth} / ${finalGear.teeth}) = <b class="${isCorrect ? 'text-green-800 font-black' : 'text-amber-800 font-bold'}">${finalGear.rpm} RPM</b>
          </div>
        </div>
        <div class="mt-1 pt-0.5 border-t border-[#8e6837]/30 text-[10px] sm:text-[11px] flex items-center justify-between">
          <span>&lArr; Activated Output: <b>${finalGear.rpm} RPM, ${dirStr}</b></span>
          <span class="font-bold ${isCorrect ? 'text-green-800' : 'text-amber-800'}">${isCorrect ? '🎯 Target Achieved! Press ACTIVATE & CHECK' : `Target: ${target.expectedRpm} RPM`}</span>
        </div>
      `;
    }

    checkAnswer() {
      const train = this.calculateTrainSpeed();
      if (!train.allSlotsFilled) {
        this.audio.playError();
        alert("Please place gears into all open train slots to activate the final gear!");
        return;
      }

      const target = this.currentLevelData.target;
      const finalGear = train.finalOutput;

      const isCorrectTeeth = Array.isArray(target.altTeeth)
        ? target.altTeeth.includes(finalGear.teeth)
        : finalGear.teeth === target.teethRequired;
      const isCorrectRpm = Math.abs(finalGear.rpm - target.expectedRpm) < 0.5;
      const isCorrect = isCorrectTeeth && isCorrectRpm;

      if (isCorrect) {
        this.audio.playWin();
        const lastGp = this.gearPositions[this.gearPositions.length - 1];
        if (lastGp) this.createSparks(lastGp.x, lastGp.y, 50);

        this.score = Math.min(this.maxScore, this.score + 100);
        this.hudScore.innerText = `${this.score}`;

        // Unlock next level
        if (this.currentLevelIdx + 1 >= this.unlockedLevel && this.unlockedLevel < LEVELS.length) {
          this.unlockedLevel = this.currentLevelIdx + 2;
          try {
            localStorage.setItem('geartrain_unlocked_level', this.unlockedLevel.toString());
          } catch (e) {}
        }

        const totalElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        if (typeof this.onWinCallback === 'function') {
          this.onWinCallback(totalElapsed);
        }
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'win', time: totalElapsed }, '*');
        }

        setTimeout(() => {
          if (this.currentLevelIdx < LEVELS.length - 1) {
            this.loadLevel(this.currentLevelIdx + 1);
          } else {
            alert("🎉 CONGRATULATIONS! You have mastered all 20 Clock Gear Train challenges!");
            this.openLevelModal();
          }
        }, 1600);
      } else {
        this.audio.playError();
      }
    }

    showHint() {
      this.score = Math.max(0, this.score - 10);
      this.hudScore.innerText = `${this.score}`;
      this.audio.playTick();
      const hintMsg = this.currentLevelData.hint || "Speed_Final = Speed_Input * (Teeth_Input / Teeth_Final)";
      alert(`💡 GEAR TRAIN HINT:\n\n${hintMsg}`);
    }

    openLevelModal() {
      const modal = document.getElementById('modal-level-select');
      const grid = document.getElementById('levels-grid');
      grid.innerHTML = '';

      LEVELS.forEach((lvl, idx) => {
        const btn = document.createElement('button');
        const isCurrent = idx === this.currentLevelIdx;
        const isUnlocked = (idx + 1) <= this.unlockedLevel;

        if (isUnlocked) {
          btn.className = `btn-tactile rounded-xl p-2 flex flex-col items-center justify-center transition-all ${isCurrent ? 'btn-gold border-2 border-white' : 'btn-dark hover:border-[#ffd166]'}`;
          btn.innerHTML = `
            <span class="text-xs font-black">${lvl.name}</span>
            <span class="text-[9px] text-[#e6ca98] truncate max-w-[60px]">${lvl.gears.length} Gears</span>
            <span class="text-[8px] text-green-400 font-bold mt-0.5">UNLOCKED</span>
          `;
          btn.onclick = () => {
            modal.classList.add('hidden');
            this.showGameView(idx);
          };
        } else {
          // Locked Level
          btn.className = 'rounded-xl p-2 flex flex-col items-center justify-center bg-[#18110b] border border-[#3b2718] opacity-55 cursor-not-allowed select-none';
          btn.innerHTML = `
            <span class="text-xs font-bold text-[#8a6845] flex items-center gap-1">🔒 ${lvl.name}</span>
            <span class="text-[8px] text-[#6d4f30] mt-0.5">LOCKED</span>
          `;
          btn.onclick = () => {
            this.audio.playError();
          };
        }
        grid.appendChild(btn);
      });

      modal.classList.remove('hidden');
    }

    startTimer() {
      setInterval(() => {
        this.timerSeconds++;
        const mins = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
        const secs = (this.timerSeconds % 60).toString().padStart(2, '0');
        if (this.hudTimer) {
          this.hudTimer.innerText = `${mins}:${secs}`;
        }
      }, 1000);
    }

    createSparks(x, y, count) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4.5;
        this.particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          color: Math.random() > 0.3 ? '#ffd166' : '#ffb894',
          size: 2 + Math.random() * 2.5
        });
      }
    }

    // --- ANIMATION & RENDER LOOP ---
    startRenderLoop() {
      let lastTime = performance.now();

      const loop = (time) => {
        const dt = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        this.update(dt);
        this.render();

        requestAnimationFrame(loop);
      };

      requestAnimationFrame(loop);
    }

    update(dt) {
      if (!this.currentLevelData) return;
      const train = this.calculateTrainSpeed();

      train.speeds.forEach((s) => {
        if (!this.gearAngles[s.id]) this.gearAngles[s.id] = 0;
        if (s.active !== false && s.rpm) {
          const radPerSec = (s.rpm * 2 * Math.PI) / 60;
          this.gearAngles[s.id] += s.dir * radPerSec * dt;
        }
      });

      if (train.finalOutput && train.finalOutput.rpm) {
        this.audio.updateWhir(train.finalOutput.rpm);
      } else {
        this.audio.updateWhir(train.speeds[0].rpm * 0.2);
      }

      // Update particles
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= dt * 1.8;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }

    render() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      if (!ctx || !w || !h) return;

      // 1. Dark Steampunk Canvas Background
      ctx.fillStyle = '#17100b';
      ctx.fillRect(0, 0, w, h);

      // Engineering grid
      ctx.strokeStyle = '#271b12';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      if (!this.gearPositions || this.gearPositions.length === 0) return;

      const train = this.calculateTrainSpeed();
      const count = this.gearPositions.length;

      // 2. Base Plate Beam along all axles
      const firstX = this.gearPositions[0].x;
      const lastX = this.gearPositions[count - 1].x;
      const centerY = this.gearPositions[0].y;

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(firstX - 18, centerY - 14, (lastX - firstX) + 36, 28, 14);
      ctx.fillStyle = '#22150e';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#5a3d24';
      ctx.stroke();
      ctx.restore();

      // 3. Draw each Gear or Slot in the train
      for (let i = 0; i < count; i++) {
        const gp = this.gearPositions[i];
        const gDef = this.currentLevelData.gears[i];
        const speedInfo = train.speeds[i];
        const angle = this.gearAngles[gp.id] || 0;

        const isFinal = (i === count - 1);
        const isInput = (i === 0);

        if (gDef.role === 'slot' && !this.placedGears[gp.id]) {
          // Open Slot
          const isHovered = (this.hoverSlotId === gp.id);
          const r = gp.radius;

          ctx.save();
          ctx.beginPath();
          ctx.arc(gp.x, gp.y, r + 4, 0, Math.PI * 2);
          ctx.strokeStyle = isHovered ? '#ffd166' : '#8e6837';
          ctx.lineWidth = isHovered ? 3 : 2;
          ctx.setLineDash([6, 5]);
          ctx.stroke();

          ctx.fillStyle = isHovered ? 'rgba(212, 160, 54, 0.25)' : 'rgba(0,0,0,0.45)';
          ctx.fill();

          // Axle stud
          ctx.beginPath();
          ctx.arc(gp.x, gp.y, 7, 0, Math.PI * 2);
          ctx.fillStyle = '#ffd166';
          ctx.fill();

          // Header Label above slot
          const topSlotLabel = isFinal ? '★ OUTPUT' : `SLOT ${i + 1}`;
          ctx.save();
          ctx.font = `bold ${Math.max(9, Math.min(12, r * 0.22))}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const labelY = gp.y - r - 12;

          const textMetrics = ctx.measureText(topSlotLabel);
          const padX = 5;
          const padY = 2;
          ctx.fillStyle = 'rgba(23, 16, 11, 0.9)';
          ctx.strokeStyle = '#8e6837';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(gp.x - textMetrics.width / 2 - padX, labelY - 6 - padY, textMetrics.width + padX * 2, 12 + padY * 2, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = isFinal ? '#ffd166' : '#ffb894';
          ctx.fillText(topSlotLabel, gp.x, labelY);

          // Prompt text inside slot
          ctx.fillStyle = isHovered ? '#ffd166' : '#a68660';
          ctx.font = `bold ${Math.max(9, Math.min(12, r * 0.24))}px monospace`;
          ctx.textBaseline = 'middle';
          ctx.fillText(isHovered ? 'DROP!' : 'SLOT GEAR', gp.x, gp.y);
          ctx.restore();
        } else {
          // Gear is present (fixed or placed)
          const teeth = gDef.teeth || this.placedGears[gp.id].teeth;
          const color = isInput ? 'gold' : (isFinal ? 'brass' : (GEAR_SPECS[teeth]?.color || 'steel'));
          const r = gp.radius;

          let topLabel = isInput ? 'INPUT' : (isFinal ? '★ OUTPUT' : `GEAR ${i + 1}`);
          let bottomLabel = '';
          if (speedInfo && speedInfo.active !== false && speedInfo.rpm) {
            bottomLabel = `${speedInfo.rpm} RPM ${speedInfo.dir === 1 ? '↻' : '↺'}`;
          }

          this.drawGear(ctx, gp.x, gp.y, teeth, r, color, angle, topLabel, bottomLabel, isFinal && train.allSlotsFilled);
        }

        // Mesh contact energy sparks between adjacent gears
        if (i > 0) {
          const prevGp = this.gearPositions[i - 1];
          const midX = (prevGp.x + gp.x) / 2;
          const midY = (prevGp.y + gp.y) / 2;
          if (train.speeds[i].active !== false && train.speeds[i - 1].active !== false) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(midX, midY, 4 + Math.sin(Date.now() * 0.018 + i) * 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 209, 102, 0.85)';
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // 4. Draw Dragged Gear
      if (this.draggedGear) {
        ctx.save();
        ctx.globalAlpha = 0.92;
        const dragR = this.getGearRadius(this.draggedGear.teeth);
        this.drawGear(ctx, this.draggedGear.x, this.draggedGear.y, this.draggedGear.teeth, dragR, this.draggedGear.color, 0, '', '', false);
        ctx.restore();
      }

      // 5. Kinetic Particles
      this.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    }

    drawGear(ctx, x, y, teeth, r, colorScheme, angle, topLabel, bottomLabel, isActivatedFinal) {
      // 1. Draw contextual labels if provided
      if (topLabel) {
        ctx.save();
        ctx.font = `bold ${Math.max(9, Math.min(12, r * 0.22))}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const labelY = y - r - 12;

        const textMetrics = ctx.measureText(topLabel);
        const padX = 5;
        const padY = 2;
        ctx.fillStyle = 'rgba(23, 16, 11, 0.9)';
        ctx.strokeStyle = isActivatedFinal ? '#22c55e' : (colorScheme === 'gold' ? '#d4a036' : '#5a3d24');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x - textMetrics.width / 2 - padX, labelY - 6 - padY, textMetrics.width + padX * 2, 12 + padY * 2, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isActivatedFinal ? '#4ade80' : (colorScheme === 'gold' ? '#ffd166' : '#ffb894');
        ctx.fillText(topLabel, x, labelY);
        ctx.restore();
      }

      if (bottomLabel) {
        ctx.save();
        ctx.font = `bold ${Math.max(9, Math.min(12, r * 0.2))}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const labelY = y + r + 14;

        const textMetrics = ctx.measureText(bottomLabel);
        const padX = 5;
        const padY = 2;
        ctx.fillStyle = 'rgba(23, 16, 11, 0.9)';
        ctx.strokeStyle = isActivatedFinal ? '#22c55e' : '#5a3d24';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x - textMetrics.width / 2 - padX, labelY - 6 - padY, textMetrics.width + padX * 2, 12 + padY * 2, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isActivatedFinal ? '#86efac' : '#e6ca98';
        ctx.fillText(bottomLabel, x, labelY);
        ctx.restore();
      }

      // 2. Glow effect if this is the successfully activated final gear
      if (isActivatedFinal) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r + 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.18)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(74, 222, 128, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      // 3. Draw Gear Assembly
      ctx.save();
      ctx.translate(x, y);

      // Contact shadow
      ctx.beginPath();
      ctx.arc(0, 4, r + 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fill();

      // Rotate for teeth & spokes
      ctx.rotate(angle);

      // Metallic Radial Gradient
      let grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r + 5);
      if (colorScheme === 'copper') {
        grad.addColorStop(0, '#ffcfb8');
        grad.addColorStop(0.3, '#c86d43');
        grad.addColorStop(0.8, '#8a3f1b');
        grad.addColorStop(1, '#4a1f0a');
      } else if (colorScheme === 'brass' || colorScheme === 'gold') {
        grad.addColorStop(0, '#fff5cc');
        grad.addColorStop(0.3, '#d4a036');
        grad.addColorStop(0.8, '#9a6e1a');
        grad.addColorStop(1, '#5a3d08');
      } else {
        grad.addColorStop(0, '#f1f5f9');
        grad.addColorStop(0.3, '#94a3b8');
        grad.addColorStop(0.8, '#475569');
        grad.addColorStop(1, '#1e293b');
      }

      // Outer Teeth Profile
      ctx.fillStyle = grad;
      ctx.strokeStyle = colorScheme === 'copper' ? '#ffcfb8' : '#ffeaa7';
      ctx.lineWidth = 1;

      ctx.beginPath();
      const numTeeth = teeth;
      const angleStep = (Math.PI * 2) / numTeeth;
      const toothH = Math.max(5, Math.min(10, r * 0.12));
      const outerR = r + toothH;
      const innerR = r - 2;

      for (let i = 0; i < numTeeth; i++) {
        const a1 = i * angleStep;
        const a2 = a1 + angleStep * 0.25;
        const a3 = a1 + angleStep * 0.55;
        const a4 = a1 + angleStep * 0.8;

        if (i === 0) {
          ctx.moveTo(Math.cos(a1) * innerR, Math.sin(a1) * innerR);
        } else {
          ctx.lineTo(Math.cos(a1) * innerR, Math.sin(a1) * innerR);
        }
        ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
        ctx.lineTo(Math.cos(a3) * outerR, Math.sin(a3) * outerR);
        ctx.lineTo(Math.cos(a4) * innerR, Math.sin(a4) * innerR);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Hollow Rim Cutout
      const cutoutR = r * 0.66;
      ctx.beginPath();
      ctx.arc(0, 0, cutoutR, 0, Math.PI * 2);
      ctx.fillStyle = '#17100b';
      ctx.fill();
      ctx.strokeStyle = '#5a3d24';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Spokes
      const spokes = 6;
      ctx.fillStyle = grad;
      const spokeW = Math.max(3, r * 0.07);
      for (let s = 0; s < spokes; s++) {
        ctx.save();
        ctx.rotate((s * Math.PI * 2) / spokes);
        ctx.fillRect(-spokeW / 2, -cutoutR, spokeW, cutoutR * 2);
        ctx.restore();
      }

      // Central Hub & Axle Nut
      const hubR = Math.max(10, r * 0.32);
      ctx.beginPath();
      ctx.arc(0, 0, hubR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Axle Hole
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(3, hubR * 0.28), 0, Math.PI * 2);
      ctx.fillStyle = '#0f0a07';
      ctx.fill();

      ctx.restore();

      // Center Teeth Count badge (unrotated)
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(9, Math.min(14, hubR * 0.68))}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(`${teeth}T`, 0, 0);
      ctx.restore();
    }
  }

  // --- PLATFORM EXPORT ---
  function render(container, onWin) {
    return new GameEngine(container, onWin);
  }

  return {
    render: render,
    GameEngine: GameEngine
  };
});
