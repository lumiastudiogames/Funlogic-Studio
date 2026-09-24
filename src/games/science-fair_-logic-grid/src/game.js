(function () {
  'use strict';

  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = localStorage.getItem('science_fair_muted') === 'true';
      this.ambientInterval = null;
      this.ambientNodes = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('science_fair_muted', this.isMuted);
      if (!this.isMuted) {
        this.startAmbient();
      } else {
        this.stopAmbient();
      }
      return this.isMuted;
    }

    startAmbient() {
      if (this.isMuted || this.ambientNodes) return;
      this.init();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const master = this.ctx.createGain();
        master.gain.setValueAtTime(0.001, now);
        master.gain.exponentialRampToValueAtTime(0.05, now + 1.5);
        master.connect(this.ctx.destination);

        // Soft science lab ambient pad (F3 174.61 Hz + C4 261.63 Hz)
        const osc1 = this.ctx.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(174.61, now);

        const osc2 = this.ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(261.63, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);

        const lfo = this.ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, now);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(120, now);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(master);

        osc1.start();
        osc2.start();
        lfo.start();

        this.ambientNodes = { master, osc1, osc2, lfo };

        // Subtle gentle synthesizer notes (F major pentatonic: F4, G4, A4, C5, D5)
        this.ambientInterval = setInterval(() => {
          if (!this.isMuted && this.ctx && this.ambientNodes) {
            this.playAmbientPluck();
          }
        }, 5000);
      } catch (e) {
        console.warn('Ambient start failed:', e);
      }
    }

    playAmbientPluck() {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const scale = [349.23, 392.00, 440.00, 523.25, 587.33];
      const freq = scale[Math.floor(Math.random() * scale.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 2.1);
    }

    stopAmbient() {
      if (this.ambientInterval) {
        clearInterval(this.ambientInterval);
        this.ambientInterval = null;
      }
      if (this.ambientNodes) {
        try {
          const now = this.ctx ? this.ctx.currentTime : 0;
          this.ambientNodes.master.gain.linearRampToValueAtTime(0.001, now + 0.3);
          const { osc1, osc2, lfo } = this.ambientNodes;
          setTimeout(() => {
            try {
              osc1.stop();
              osc2.stop();
              lfo.stop();
            } catch (e) {}
          }, 400);
        } catch (e) {}
        this.ambientNodes = null;
      }
    }

    playClick() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }

    playCheck() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.12, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.25);
      });
    }

    playCross() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    }

    playErase() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    }

    playVolcano() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.5);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
      noise.stop(this.ctx.currentTime + 0.5);
    }

    playRobot() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [300, 450, 600, 900].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.06, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.04);
      });
    }

    playSolar() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [880, 1174.66, 1318.51, 1760].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.08, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    }

    playHint() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.07);
        gain.gain.setValueAtTime(0.15, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.35);
      });
    }

    playVictory() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const chord = [
        { f: 523.25, t: 0.0, d: 0.15 },
        { f: 659.25, t: 0.12, d: 0.15 },
        { f: 783.99, t: 0.24, d: 0.15 },
        { f: 1046.50, t: 0.36, d: 0.6 },
        { f: 1318.51, t: 0.48, d: 0.8 },
      ];
      chord.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, now + note.t);
        gain.gain.setValueAtTime(0.2, now + note.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + note.t);
        osc.stop(now + note.t + note.d);
      });
    }

    playError() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [310, 290].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + i * 0.1);
        gain.gain.setValueAtTime(0.1, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.18);
      });
    }
  }

  const audio = new SoundEngine();

  const LEVELS = [
    {
      id: 1,
      title: 'Junior Fair',
      difficulty: 'Beginner (3x3)',
      subtitle: 'Discover the projects of Lucas, Sophia, and Beatriz!',
      categories: {
        students: [
          { id: 'lucas', name: 'Lucas', assetKey: 'avatar_boy_1' },
          { id: 'sofia', name: 'Sophia', assetKey: 'avatar_girl_1' },
          { id: 'beatriz', name: 'Beatriz', assetKey: 'avatar_girl_2' }
        ],
        projects: [
          { id: 'volcano', name: 'Volcano', assetKey: 'project_volcano', type: 'volcano' },
          { id: 'robot', name: 'Robot', assetKey: 'project_robot', type: 'robot' },
          { id: 'solar', name: 'Solar Panel', assetKey: 'project_solar', type: 'solar' }
        ],
        awards: [
          { id: 'gold', name: 'Gold (1st)', assetKey: 'award_gold', rank: 1 },
          { id: 'silver', name: 'Silver (2nd)', assetKey: 'award_silver', rank: 2 },
          { id: 'bronze', name: 'Bronze (3rd)', assetKey: 'award_bronze', rank: 3 }
        ]
      },
      clues: [
        {
          id: 'c1',
          text: 'The student who built the Robot won a higher medal than Beatriz.',
          hintTarget: { cat1: 'projects', item1: 'robot', cat2: 'students', item2: 'beatriz', state: 'CROSS', reason: 'The Robot cannot belong to Beatriz since it placed higher than her!' }
        },
        {
          id: 'c2',
          text: 'Sophia did not build the Volcano nor did she win the Bronze Medal.',
          hintTarget: { cat1: 'students', item1: 'sofia', cat2: 'projects', item1_alt: 'volcano', state: 'CROSS', reason: "Sophia didn't build the Volcano." }
        },
        {
          id: 'c3',
          text: 'The Solar Panel project won the Silver Medal.',
          hintTarget: { cat1: 'projects', item1: 'solar', cat2: 'awards', item2: 'silver', state: 'CHECK', reason: 'Solar Panel = Silver Medal!' }
        },
        {
          id: 'c4',
          text: 'Lucas was praised by all teachers for his volcanic eruption project.',
          hintTarget: { cat1: 'students', item1: 'lucas', cat2: 'projects', item2: 'volcano', state: 'CHECK', reason: 'Lucas built the Volcano!' }
        }
      ],
      solution: {
        lucas: { project: 'volcano', award: 'bronze' },
        sofia: { project: 'robot', award: 'gold' },
        beatriz: { project: 'solar', award: 'silver' }
      }
    },
    {
      id: 2,
      title: 'Scientific Innovation',
      difficulty: 'Intermediate (3x3)',
      subtitle: 'Gabriel, Marina, and Enzo created technology projects.',
      categories: {
        students: [
          { id: 'gabriel', name: 'Gabriel', assetKey: 'avatar_boy_2' },
          { id: 'marina', name: 'Marina', assetKey: 'avatar_girl_2' },
          { id: 'enzo', name: 'Enzo', assetKey: 'avatar_boy_1' }
        ],
        projects: [
          { id: 'tesla', name: 'Tesla Coil', assetKey: 'project_tesla', type: 'tesla' },
          { id: 'rocket', name: 'Hydr. Rocket', assetKey: 'project_rocket', type: 'rocket' },
          { id: 'microscope', name: 'Microscope', assetKey: 'project_microscope', type: 'microscope' }
        ],
        awards: [
          { id: 'gold', name: 'Gold (1st)', assetKey: 'award_gold', rank: 1 },
          { id: 'silver', name: 'Silver (2nd)', assetKey: 'award_silver', rank: 2 },
          { id: 'bronze', name: 'Bronze (3rd)', assetKey: 'award_bronze', rank: 3 }
        ]
      },
      clues: [
        {
          id: 'c1',
          text: 'Enzo did not build the Tesla Coil nor the Hydraulic Rocket.',
          hintTarget: { cat1: 'students', item1: 'enzo', cat2: 'projects', item2: 'microscope', state: 'CHECK', reason: 'Enzo built the Microscope!' }
        },
        {
          id: 'c2',
          text: 'The Hydraulic Rocket reached the highest altitude and secured 1st Place (Gold).',
          hintTarget: { cat1: 'projects', item1: 'rocket', cat2: 'awards', item2: 'gold', state: 'CHECK', reason: 'Rocket = Gold!' }
        },
        {
          id: 'c3',
          text: 'Marina won a higher medal than the creator of the Tesla Coil.',
          hintTarget: { cat1: 'students', item1: 'marina', cat2: 'projects', item2: 'tesla', state: 'CROSS', reason: "Marina didn't build the Tesla Coil." }
        },
        {
          id: 'c4',
          text: 'The Microscope impressed the judges and earned the Silver Medal.',
          hintTarget: { cat1: 'projects', item1: 'microscope', cat2: 'awards', item2: 'silver', state: 'CHECK', reason: 'Microscope = Silver!' }
        }
      ],
      solution: {
        enzo: { project: 'microscope', award: 'silver' },
        marina: { project: 'rocket', award: 'gold' },
        gabriel: { project: 'tesla', award: 'bronze' }
      }
    },
    {
      id: 3,
      title: 'State Fair',
      difficulty: 'Advanced (4x4)',
      subtitle: 'Alice, Bernardo, Clara, and David compete for 4 awards!',
      categories: {
        students: [
          { id: 'alice', name: 'Alice', assetKey: 'avatar_girl_1' },
          { id: 'bernardo', name: 'Bernardo', assetKey: 'avatar_boy_1' },
          { id: 'clara', name: 'Clara', assetKey: 'avatar_girl_2' },
          { id: 'davi', name: 'David', assetKey: 'avatar_boy_2' }
        ],
        projects: [
          { id: 'volcano', name: 'Chem. Volcano', assetKey: 'project_volcano', type: 'volcano' },
          { id: 'robot', name: 'AI Robot', assetKey: 'project_robot', type: 'robot' },
          { id: 'solar', name: 'Bifacial Panel', assetKey: 'project_solar', type: 'solar' },
          { id: 'biogen', name: 'Bio-Generator', assetKey: 'project_biogen', type: 'biogen' }
        ],
        awards: [
          { id: 'gold', name: '1st Gold', assetKey: 'award_gold', rank: 1 },
          { id: 'silver', name: '2nd Silver', assetKey: 'award_silver', rank: 2 },
          { id: 'bronze', name: '3rd Bronze', assetKey: 'award_bronze', rank: 3 },
          { id: 'honor', name: 'Hon. Mention', assetKey: 'award_honor', rank: 4 }
        ]
      },
      clues: [
        {
          id: 'c1',
          text: 'Alice won 1st Place (Gold) with algae-free sustainable energy.',
          hintTarget: { cat1: 'students', item1: 'alice', cat2: 'projects', item2: 'solar', state: 'CHECK', reason: 'Alice = Bifacial Panel and Gold!' }
        },
        {
          id: 'c2',
          text: 'The AI Robot scored higher than the Chemical Volcano in the final evaluation.',
          hintTarget: { cat1: 'projects', item1: 'volcano', cat2: 'awards', item2: 'gold', state: 'CROSS', reason: 'Volcano cannot be Gold.' }
        },
        {
          id: 'c3',
          text: 'Bernardo built the Bio-Generator and placed one spot ahead of David.',
          hintTarget: { cat1: 'students', item1: 'bernardo', cat2: 'projects', item2: 'biogen', state: 'CHECK', reason: 'Bernardo = Bio-Generator!' }
        },
        {
          id: 'c4',
          text: 'The student who received Honorable Mention built the Chemical Volcano.',
          hintTarget: { cat1: 'projects', item1: 'volcano', cat2: 'awards', item2: 'honor', state: 'CHECK', reason: 'Volcano = Honorable Mention!' }
        },
        {
          id: 'c5',
          text: 'Clara programmed the artificial intelligence for her autonomous robot.',
          hintTarget: { cat1: 'students', item1: 'clara', cat2: 'projects', item2: 'robot', state: 'CHECK', reason: 'Clara = AI Robot!' }
        }
      ],
      solution: {
        alice: { project: 'solar', award: 'gold' },
        clara: { project: 'robot', award: 'silver' },
        bernardo: { project: 'biogen', award: 'bronze' },
        davi: { project: 'volcano', award: 'honor' }
      }
    },
    {
      id: 4,
      title: 'Eco-Space Symposium',
      difficulty: 'Master (4x4)',
      subtitle: 'Ecological and space projects by Helena, Rafael, Larissa, and Thiago.',
      categories: {
        students: [
          { id: 'helena', name: 'Helena', assetKey: 'avatar_girl_1' },
          { id: 'rafael', name: 'Rafael', assetKey: 'avatar_boy_2' },
          { id: 'larissa', name: 'Larissa', assetKey: 'avatar_girl_2' },
          { id: 'thiago', name: 'Thiago', assetKey: 'avatar_boy_1' }
        ],
        projects: [
          { id: 'rover', name: 'Lunar Rover', assetKey: 'project_rover', type: 'rover' },
          { id: 'wind', name: 'Wind Turbine', assetKey: 'project_wind', type: 'wind' },
          { id: 'filter', name: 'Water Filter', assetKey: 'project_filter', type: 'filter' },
          { id: 'greenhouse', name: 'Smart Greenhouse', assetKey: 'project_greenhouse', type: 'greenhouse' }
        ],
        awards: [
          { id: 'gold', name: '1st Gold', assetKey: 'award_gold', rank: 1 },
          { id: 'silver', name: '2nd Silver', assetKey: 'award_silver', rank: 2 },
          { id: 'bronze', name: '3rd Bronze', assetKey: 'award_bronze', rank: 3 },
          { id: 'honor', name: 'Distinction', assetKey: 'award_honor', rank: 4 }
        ]
      },
      clues: [
        {
          id: 'c1',
          text: 'Helena won 1st Place (Gold) with the Smart Greenhouse.',
          hintTarget: { cat1: 'students', item1: 'helena', cat2: 'projects', item2: 'greenhouse', state: 'CHECK', reason: 'Helena = Greenhouse and Gold!' }
        },
        {
          id: 'c2',
          text: "Larissa's water purification filter earned 3rd Place (Bronze).",
          hintTarget: { cat1: 'students', item1: 'larissa', cat2: 'projects', item2: 'filter', state: 'CHECK', reason: 'Larissa = Water Filter!' }
        },
        {
          id: 'c3',
          text: "The Wind Turbine outperformed Thiago's Lunar Rover in evaluation.",
          hintTarget: { cat1: 'students', item1: 'thiago', cat2: 'projects', item2: 'rover', state: 'CHECK', reason: 'Thiago = Lunar Rover!' }
        },
        {
          id: 'c4',
          text: 'Rafael used aerodynamics and clean energy generation to win Silver.',
          hintTarget: { cat1: 'students', item1: 'rafael', cat2: 'projects', item2: 'wind', state: 'CHECK', reason: 'Rafael = Wind Turbine!' }
        }
      ],
      solution: {
        helena: { project: 'greenhouse', award: 'gold' },
        rafael: { project: 'wind', award: 'silver' },
        larissa: { project: 'filter', award: 'bronze' },
        thiago: { project: 'rover', award: 'honor' }
      }
    },
    {
      id: 5,
      title: 'Grand Championship',
      difficulty: 'Expert (4x4)',
      subtitle: 'The ultimate deduction challenge among the 4 best scientists!',
      categories: {
        students: [
          { id: 'maya', name: 'Maya', assetKey: 'avatar_girl_1' },
          { id: 'caio', name: 'Caio', assetKey: 'avatar_boy_1' },
          { id: 'leticia', name: 'Leticia', assetKey: 'avatar_girl_2' },
          { id: 'pedro', name: 'Pedro', assetKey: 'avatar_boy_2' }
        ],
        projects: [
          { id: 'accelerator', name: 'Mini Accelerator', assetKey: 'project_accelerator', type: 'accelerator' },
          { id: 'bionic', name: 'Bionic Arm', assetKey: 'project_bionic', type: 'bionic' },
          { id: 'cubesat', name: 'CubeSat', assetKey: 'project_cubesat', type: 'cubesat' },
          { id: 'drone', name: 'Pollin. Drone', assetKey: 'project_drone', type: 'drone' }
        ],
        awards: [
          { id: 'diamond', name: 'Champion', assetKey: 'award_diamond', rank: 1 },
          { id: 'gold', name: '1st Gold', assetKey: 'award_gold', rank: 2 },
          { id: 'silver', name: '2nd Silver', assetKey: 'award_silver', rank: 3 },
          { id: 'bronze', name: '3rd Bronze', assetKey: 'award_bronze', rank: 4 }
        ]
      },
      clues: [
        {
          id: 'c1',
          text: "Leticia's Bionic Arm claimed the Grand Champion title.",
          hintTarget: { cat1: 'students', item1: 'leticia', cat2: 'projects', item2: 'bionic', state: 'CHECK', reason: 'Leticia = Bionic Arm and Champion!' }
        },
        {
          id: 'c2',
          text: 'Maya did not build the Mini Accelerator nor the CubeSat Satellite.',
          hintTarget: { cat1: 'students', item1: 'maya', cat2: 'projects', item2: 'drone', state: 'CHECK', reason: 'Maya = Pollinating Drone!' }
        },
        {
          id: 'c3',
          text: 'The creator of the CubeSat Satellite won the Silver Medal.',
          hintTarget: { cat1: 'projects', item1: 'cubesat', cat2: 'awards', item2: 'silver', state: 'CHECK', reason: 'CubeSat = Silver!' }
        },
        {
          id: 'c4',
          text: 'Pedro developed the Mini Accelerator but did not finish last.',
          hintTarget: { cat1: 'students', item1: 'pedro', cat2: 'projects', item2: 'accelerator', state: 'CHECK', reason: 'Pedro = Mini Accelerator!' }
        },
        {
          id: 'c5',
          text: 'Caio tested telemetry for his space project in simulated orbit.',
          hintTarget: { cat1: 'students', item1: 'caio', cat2: 'projects', item2: 'cubesat', state: 'CHECK', reason: 'Caio = CubeSat!' }
        }
      ],
      solution: {
        leticia: { project: 'bionic', award: 'diamond' },
        pedro: { project: 'accelerator', award: 'gold' },
        caio: { project: 'cubesat', award: 'silver' },
        maya: { project: 'drone', award: 'bronze' }
      }
    }
  ];

  class SaveManager {
    static getKey() {
      return 'science_fair_logic_grid_save';
    }

    static load() {
      try {
        const raw = localStorage.getItem(this.getKey());
        if (raw) {
          return JSON.parse(raw);
        }
      } catch (e) {
        console.error(e);
      }
      return {
        unlockedLevel: 1,
        bestTimes: {},
        stars: {}
      };
    }

    static save(data) {
      try {
        localStorage.setItem(this.getKey(), JSON.stringify(data));
      } catch (e) {
        console.error(e);
      }
    }

    static unlockNext(currentLevelId, timeSeconds) {
      const data = this.load();
      const nextId = currentLevelId + 1;
      if (nextId <= LEVELS.length) {
        data.unlockedLevel = Math.max(data.unlockedLevel || 1, nextId);
      }
      if (!data.bestTimes[currentLevelId] || timeSeconds < data.bestTimes[currentLevelId]) {
        data.bestTimes[currentLevelId] = timeSeconds;
      }
      data.stars[currentLevelId] = 3;
      this.save(data);
      return data;
    }
  }

  class ScienceFairDiorama {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.dpr = 1;
      this.particles = [];
      this.booths = [];
      this.level = null;
      this.activeAnimation = 'idle';
      this.time = 0;

      const observer = new ResizeObserver(() => this.resize());
      if (this.canvas.parentElement) {
        observer.observe(this.canvas.parentElement);
      }
      this.setupInteraction();
      this.animate();
    }

    resize() {
      if (!this.canvas.parentElement) return;
      const rect = this.canvas.parentElement.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = rect.width;
      const h = rect.height;

      if (w <= 0 || h <= 0) return;

      this.canvas.width = Math.floor(w * this.dpr);
      this.canvas.height = Math.floor(h * this.dpr);
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;

      this.ctx.scale(this.dpr, this.dpr);
      this.updateBoothsLayout(w, h);
    }

    setLevel(level) {
      this.level = level;
      if (this.canvas.parentElement) {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.updateBoothsLayout(rect.width, rect.height);
      }
    }

    updateBoothsLayout(w, h) {
      if (!this.level || w <= 0 || h <= 0) return;
      const projects = this.level.categories.projects;
      const count = projects.length;
      const spacing = w / (count + 1);
      const baseY = Math.min(h * 0.72, h - 35);

      this.booths = projects.map((p, idx) => ({
        id: p.id,
        name: p.name,
        assetKey: p.assetKey,
        type: p.type,
        x: spacing * (idx + 1),
        y: baseY,
        width: Math.min(w / (count + 1.2), 120),
        height: 70,
        interactiveState: 0
      }));
    }

    setupInteraction() {
      const getPos = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
      };

      const handleHit = (pos) => {
        for (let i = 0; i < this.booths.length; i++) {
          const b = this.booths[i];
          const dist = Math.hypot(pos.x - b.x, pos.y - (b.y - 30));
          if (dist < 45) {
            this.triggerBoothEffect(b);
            break;
          }
        }
      };

      this.canvas.addEventListener('click', (e) => handleHit(getPos(e)));
      this.canvas.addEventListener('touchstart', (e) => handleHit(getPos(e)), { passive: true });
    }

    triggerBoothEffect(b) {
      b.interactiveState = 1.0;
      if (b.type === 'volcano') {
        audio.playVolcano();
        this.spawnVolcanoLava(b.x, b.y - 45);
      } else if (b.type === 'robot') {
        audio.playRobot();
        this.spawnRobotSparks(b.x, b.y - 40);
      } else if (b.type === 'solar') {
        audio.playSolar();
        this.spawnSolarBeams(b.x, b.y - 40);
      } else {
        audio.playHint();
        this.spawnSparkles(b.x, b.y - 35, '#6366f1');
      }
    }

    spawnVolcanoLava(x, y) {
      for (let i = 0; i < 24; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.1;
        const speed = 2.5 + Math.random() * 4.5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.14,
          color: Math.random() > 0.4 ? '#f97316' : '#ef4444',
          size: 3 + Math.random() * 3,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.02
        });
      }
    }

    spawnRobotSparks(x, y) {
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: 0.05,
          color: Math.random() > 0.5 ? '#38bdf8' : '#22d3ee',
          size: 2.5 + Math.random() * 2.5,
          alpha: 1,
          decay: 0.03
        });
      }
    }

    spawnSolarBeams(x, y) {
      for (let i = 0; i < 16; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
        const speed = 2 + Math.random() * 3;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          gravity: -0.02,
          color: '#fbbf24',
          size: 3 + Math.random() * 2,
          alpha: 1,
          decay: 0.025
        });
      }
    }

    spawnSparkles(x, y, color) {
      for (let i = 0; i < 15; i++) {
        this.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          gravity: 0.03,
          color: color || '#a855f7',
          size: 2.5 + Math.random() * 3,
          alpha: 1,
          decay: 0.025
        });
      }
    }

    spawnVictoryConfetti() {
      const w = this.canvas.width / this.dpr;
      const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#eab308'];
      for (let i = 0; i < 80; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: -10 - Math.random() * 50,
          vx: (Math.random() - 0.5) * 3,
          vy: 2 + Math.random() * 4,
          gravity: 0.05,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 4,
          alpha: 1,
          decay: 0.008
        });
      }
    }

    animate() {
      this.time += 0.03;
      const ctx = this.ctx;
      const w = this.canvas.width / this.dpr;
      const h = this.canvas.height / this.dpr;

      if (w > 0 && h > 0) {
        ctx.clearRect(0, 0, w, h);
        this.drawBackground(ctx, w, h);
        this.drawBooths(ctx, w, h);
        this.updateAndDrawParticles(ctx);
      }

      requestAnimationFrame(() => this.animate());
    }

    drawBackground(ctx, w, h) {
      const wallGrad = ctx.createLinearGradient(0, 0, 0, h);
      wallGrad.addColorStop(0, '#0f172a');
      wallGrad.addColorStop(0.65, '#1e293b');
      wallGrad.addColorStop(1, '#334155');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, w, h);

      const floorY = h * 0.76;
      const tableGrad = ctx.createLinearGradient(0, floorY, 0, h);
      tableGrad.addColorStop(0, '#475569');
      tableGrad.addColorStop(0.15, '#334155');
      tableGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = tableGrad;
      ctx.fillRect(0, floorY, w, h - floorY);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(w, floorY);
      ctx.stroke();

      const flagCount = Math.floor(w / 35);
      const flagColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
      for (let i = 0; i < flagCount; i++) {
        const fx = i * 35;
        const fy = 0;
        ctx.fillStyle = flagColors[i % flagColors.length];
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(fx + 35, fy);
        ctx.lineTo(fx + 17.5, fy + 18 + Math.sin(this.time + i) * 2);
        ctx.closePath();
        ctx.fill();
      }

      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.font = '900 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SCIENCE FAIR • BOOTHS', w / 2, 34);
      ctx.restore();
    }

    drawBooths(ctx, w, h) {
      this.booths.forEach((b) => {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(b.x, b.y + 4, b.width * 0.45, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const standW = Math.min(b.width * 0.85, 95);
        const standH = 24;
        const standX = b.x - standW / 2;
        const standY = b.y - 16;

        const woodGrad = ctx.createLinearGradient(standX, standY, standX, standY + standH);
        woodGrad.addColorStop(0, '#78350f');
        woodGrad.addColorStop(0.3, '#92400e');
        woodGrad.addColorStop(1, '#451a03');
        ctx.fillStyle = woodGrad;
        ctx.beginPath();
        ctx.roundRect(standX, standY, standW, standH, 4);
        ctx.fill();

        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.roundRect(standX + 5, standY + 5, standW - 10, standH - 8, 3);
        ctx.fill();

        ctx.fillStyle = '#93c5fd';
        ctx.font = '800 8.5px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(b.name.toUpperCase(), b.x, standY + 16);

        const objY = standY - 6;
        this.renderExperimentProp(ctx, b, b.x, objY);

        if (b.interactiveState > 0) {
          b.interactiveState = Math.max(0, b.interactiveState - 0.03);
        }
      });
    }

    renderExperimentProp(ctx, b, x, y) {
      ctx.save();
      const bounce = Math.sin(this.time * 2 + b.x) * 1.5;

      if (b.type === 'volcano') {
        const vGrad = ctx.createLinearGradient(x - 25, y - 35, x + 25, y);
        vGrad.addColorStop(0, '#78350f');
        vGrad.addColorStop(0.7, '#451a03');
        vGrad.addColorStop(1, '#1c1917');
        ctx.fillStyle = vGrad;
        ctx.beginPath();
        ctx.moveTo(x - 24, y);
        ctx.lineTo(x - 7, y - 28);
        ctx.lineTo(x + 7, y - 28);
        ctx.lineTo(x + 24, y);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.ellipse(x, y - 28, 7, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 2, y - 28);
        ctx.quadraticCurveTo(x - 5, y - 16, x - 10, y);
        ctx.stroke();

        if (Math.random() > 0.75) {
          this.particles.push({
            x: x + (Math.random() - 0.5) * 8,
            y: y - 28,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -1 - Math.random() * 1.5,
            gravity: 0.02,
            color: '#fef08a',
            size: 2,
            alpha: 1,
            decay: 0.04
          });
        }
      } else if (b.type === 'robot') {
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.roundRect(x - 12, y - 5, 24, 6, 2.5);
        ctx.fill();

        const rGrad = ctx.createLinearGradient(x - 10, y - 26, x + 10, y - 5);
        rGrad.addColorStop(0, '#38bdf8');
        rGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = rGrad;
        ctx.beginPath();
        ctx.roundRect(x - 10, y - 22, 20, 16, 3);
        ctx.fill();

        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(x - 7, y - 35 + bounce, 14, 11, 2.5);
        ctx.fill();

        const eyeColor = Math.sin(this.time * 5) > 0 ? '#22d3ee' : '#38bdf8';
        ctx.fillStyle = eyeColor;
        ctx.beginPath();
        ctx.roundRect(x - 4.5, y - 31 + bounce, 9, 3.5, 1.5);
        ctx.fill();

        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, y - 35 + bounce);
        ctx.lineTo(x, y - 40 + bounce);
        ctx.stroke();

        ctx.fillStyle = Math.sin(this.time * 6) > 0 ? '#ef4444' : '#f87171';
        ctx.beginPath();
        ctx.arc(x, y - 41 + bounce, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (b.type === 'solar') {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(x - 2, y - 16, 4, 16);

        ctx.save();
        ctx.translate(x, y - 20 + bounce * 0.5);
        ctx.rotate(-0.15);

        const sGrad = ctx.createLinearGradient(-16, -10, 16, 10);
        sGrad.addColorStop(0, '#1e3a8a');
        sGrad.addColorStop(1, '#1d4ed8');
        ctx.fillStyle = sGrad;
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-15, -9, 30, 18, 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(-5, -9);
        ctx.lineTo(-5, 9);
        ctx.moveTo(5, -9);
        ctx.lineTo(5, 9);
        ctx.moveTo(-15, 0);
        ctx.lineTo(15, 0);
        ctx.stroke();

        ctx.restore();
      } else {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.roundRect(x - 9, y - 25 + bounce, 18, 23, 3);
        ctx.fill();

        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(x - 7, y - 16 + bounce, 14, 12, 2);
        ctx.fill();
      }

      ctx.restore();
    }

    updateAndDrawParticles(ctx) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity || 0;
        p.alpha -= p.decay || 0.02;

        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }

  class ScienceFairLogicApp {
    constructor() {
      this.currentScreen = 'MAIN_MENU';
      this.currentMobileTab = 'GRID';
      this.currentLevelIndex = 0;
      this.level = LEVELS[0];
      this.saveData = SaveManager.load();
      this.gridState = {};
      this.historyStack = [];
      this.startTime = 0;
      this.timerInterval = null;
      this.elapsedSeconds = 0;
      this.isGameActive = false;
      this.cluesCompleted = {};
      this.autoCrossOut = true;
      this.rewardCountdown = 4;
      this.rewardInterval = null;

      this.initDOMElements();
      this.initEvents();
      this.diorama = new ScienceFairDiorama(this.dom.canvas);
      this.updateScreen();
    }

    initDOMElements() {
      this.dom = {
        screenMainMenu: document.getElementById('screen-main-menu'),
        screenLevelSelect: document.getElementById('screen-level-select'),
        screenGameplay: document.getElementById('screen-gameplay'),
        screenHowToPlay: document.getElementById('screen-how-to-play'),
        modalRewardAd: document.getElementById('modal-reward-ad'),
        modalVictory: document.getElementById('modal-victory-local'),

        btnPlay: document.getElementById('btn-play-game'),
        btnLevels: document.getElementById('btn-open-levels'),
        btnHowToPlay: document.getElementById('btn-open-tutorial'),
        btnSoundMenu: document.getElementById('btn-sound-menu'),
        soundIconMenu: document.getElementById('sound-icon-menu'),

        btnPauseMenu: document.getElementById('btn-pause-menu'),
        levelBadgeText: document.getElementById('level-badge-text'),
        timerDisplay: document.getElementById('timer-display'),
        btnUndo: document.getElementById('btn-undo'),
        btnHintAd: document.getElementById('btn-hint-ad'),
        btnSoundHeader: document.getElementById('btn-sound-header'),
        soundIconHeader: document.getElementById('sound-icon-header'),
        btnCheckSolution: document.getElementById('btn-check-solution'),

        tabBtnGrid: document.getElementById('tab-btn-grid'),
        tabBtnClues: document.getElementById('tab-btn-clues'),
        tabBtnSummary: document.getElementById('tab-btn-summary'),
        cluesBadgeCount: document.getElementById('clues-badge-count'),
        mobileClueTicker: document.getElementById('mobile-clue-ticker'),
        tickerClueText: document.getElementById('ticker-clue-text'),

        panelDioramaSummary: document.getElementById('panel-diorama-summary'),
        panelGridClues: document.getElementById('panel-grid-clues'),
        cardCluesWrapper: document.getElementById('card-clues-wrapper'),
        cardGridWrapper: document.getElementById('card-grid-wrapper'),

        canvas: document.getElementById('game-canvas'),
        logicGridContainer: document.getElementById('logic-grid-container'),
        cluesListContainer: document.getElementById('clues-list-container'),
        notebookContainer: document.getElementById('notebook-container'),
        feedbackToast: document.getElementById('feedback-toast'),
        levelMapGrid: document.getElementById('level-map-grid'),

        adTimerText: document.getElementById('ad-timer-text'),
        adProgressBar: document.getElementById('ad-progress-bar'),
        btnClaimReward: document.getElementById('btn-claim-reward'),
        btnSkipAd: document.getElementById('btn-skip-ad'),

        vicLevelTitle: document.getElementById('vic-level-title'),
        vicTimeText: document.getElementById('vic-time-text'),
        btnNextLevel: document.getElementById('btn-next-level'),
        btnReplayLevel: document.getElementById('btn-replay-level'),
        btnVicMenu: document.getElementById('btn-vic-menu')
      };
    }

    initEvents() {
      this.updateSoundIcons();

      this.dom.btnPlay.addEventListener('click', () => {
        audio.playClick();
        this.startLevel(this.saveData.unlockedLevel ? Math.min(this.saveData.unlockedLevel - 1, LEVELS.length - 1) : 0);
      });

      this.dom.btnLevels.addEventListener('click', () => {
        audio.playClick();
        this.renderLevelSelect();
        this.setScreen('LEVEL_SELECT');
      });

      this.dom.btnHowToPlay.addEventListener('click', () => {
        audio.playClick();
        this.setScreen('HOW_TO_PLAY');
      });

      const toggleSound = () => {
        const isMuted = audio.toggleMute();
        this.updateSoundIcons();
        if (!isMuted) audio.playClick();
      };

      this.dom.btnSoundMenu.addEventListener('click', toggleSound);
      this.dom.btnSoundHeader.addEventListener('click', toggleSound);

      document.querySelectorAll('.btn-back-menu').forEach((btn) => {
        btn.addEventListener('click', () => {
          audio.playClick();
          this.stopTimer();
          this.setScreen('MAIN_MENU');
        });
      });

      this.dom.btnPauseMenu.addEventListener('click', () => {
        audio.playClick();
        this.stopTimer();
        this.setScreen('MAIN_MENU');
      });

      if (this.dom.tabBtnGrid) {
        this.dom.tabBtnGrid.addEventListener('click', () => {
          audio.playClick();
          this.setMobileTab('GRID');
        });
      }

      if (this.dom.tabBtnClues) {
        this.dom.tabBtnClues.addEventListener('click', () => {
          audio.playClick();
          this.setMobileTab('CLUES');
        });
      }

      if (this.dom.tabBtnSummary) {
        this.dom.tabBtnSummary.addEventListener('click', () => {
          audio.playClick();
          this.setMobileTab('SUMMARY');
        });
      }

      if (this.dom.mobileClueTicker) {
        this.dom.mobileClueTicker.addEventListener('click', () => {
          audio.playClick();
          this.setMobileTab('CLUES');
        });
      }

      this.dom.btnUndo.addEventListener('click', () => {
        this.undoLastAction();
      });

      this.dom.btnHintAd.addEventListener('click', () => {
        audio.playClick();
        this.openRewardAdModal();
      });

      this.dom.btnSkipAd.addEventListener('click', () => {
        audio.playClick();
        this.closeRewardAdModal();
      });

      this.dom.btnClaimReward.addEventListener('click', () => {
        audio.playClick();
        this.closeRewardAdModal();
        this.giveIntelligentHint();
      });

      this.dom.btnCheckSolution.addEventListener('click', () => {
        this.validateSolution(true);
      });

      if (this.dom.btnNextLevel) {
        this.dom.btnNextLevel.addEventListener('click', () => {
          audio.playClick();
          this.dom.modalVictory.classList.add('hidden');
          const nextIdx = this.currentLevelIndex + 1;
          if (nextIdx < LEVELS.length) {
            this.startLevel(nextIdx);
          } else {
            this.setScreen('LEVEL_SELECT');
          }
        });
      }

      if (this.dom.btnReplayLevel) {
        this.dom.btnReplayLevel.addEventListener('click', () => {
          audio.playClick();
          this.dom.modalVictory.classList.add('hidden');
          this.startLevel(this.currentLevelIndex);
        });
      }

      if (this.dom.btnVicMenu) {
        this.dom.btnVicMenu.addEventListener('click', () => {
          audio.playClick();
          this.dom.modalVictory.classList.add('hidden');
          this.setScreen('MAIN_MENU');
        });
      }

      window.addEventListener('resize', () => {
        this.updateMobileTabVisuals();
      });
    }

    setMobileTab(tab) {
      this.currentMobileTab = tab;
      this.updateMobileTabVisuals();
    }

    updateMobileTabVisuals() {
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;

      const tabs = [
        { id: 'GRID', btn: this.dom.tabBtnGrid },
        { id: 'CLUES', btn: this.dom.tabBtnClues },
        { id: 'SUMMARY', btn: this.dom.tabBtnSummary }
      ];

      tabs.forEach((t) => {
        if (!t.btn) return;
        if (t.id === this.currentMobileTab) {
          t.btn.className = 'mobile-tab-btn flex-1 py-1.5 px-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all bg-indigo-600 text-white shadow-sm';
        } else {
          t.btn.className = 'mobile-tab-btn flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-slate-100 text-slate-600 hover:bg-slate-200';
        }
      });

      if (isDesktop) {
        if (this.dom.panelDioramaSummary) this.dom.panelDioramaSummary.classList.remove('hidden');
        if (this.dom.panelGridClues) this.dom.panelGridClues.classList.remove('hidden');
        if (this.dom.cardCluesWrapper) this.dom.cardCluesWrapper.classList.remove('hidden');
        if (this.dom.cardGridWrapper) this.dom.cardGridWrapper.classList.remove('hidden');
        return;
      }

      if (this.currentMobileTab === 'GRID') {
        if (this.dom.panelDioramaSummary) this.dom.panelDioramaSummary.classList.add('hidden');
        if (this.dom.panelGridClues) this.dom.panelGridClues.classList.remove('hidden');
        if (this.dom.cardGridWrapper) this.dom.cardGridWrapper.classList.remove('hidden');
        if (this.dom.cardCluesWrapper) this.dom.cardCluesWrapper.classList.add('hidden');
        if (this.dom.mobileClueTicker) this.dom.mobileClueTicker.classList.remove('hidden');
      } else if (this.currentMobileTab === 'CLUES') {
        if (this.dom.panelDioramaSummary) this.dom.panelDioramaSummary.classList.add('hidden');
        if (this.dom.panelGridClues) this.dom.panelGridClues.classList.remove('hidden');
        if (this.dom.cardGridWrapper) this.dom.cardGridWrapper.classList.add('hidden');
        if (this.dom.cardCluesWrapper) this.dom.cardCluesWrapper.classList.remove('hidden');
        if (this.dom.mobileClueTicker) this.dom.mobileClueTicker.classList.add('hidden');
      } else if (this.currentMobileTab === 'SUMMARY') {
        if (this.dom.panelDioramaSummary) {
          this.dom.panelDioramaSummary.classList.remove('hidden');
          this.dom.panelDioramaSummary.classList.add('flex');
        }
        if (this.dom.panelGridClues) this.dom.panelGridClues.classList.add('hidden');
        if (this.dom.mobileClueTicker) this.dom.mobileClueTicker.classList.add('hidden');
        setTimeout(() => this.diorama.resize(), 50);
      }
    }

    updateSoundIcons() {
      const icon = audio.isMuted
        ? `<svg class="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>`
        : `<svg class="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>`;

      if (this.dom.soundIconMenu) this.dom.soundIconMenu.innerHTML = icon;
      if (this.dom.soundIconHeader) this.dom.soundIconHeader.innerHTML = icon;
    }

    setScreen(screen) {
      this.currentScreen = screen;
      this.updateScreen();
    }

    updateScreen() {
      const screens = [
        { id: 'MAIN_MENU', el: this.dom.screenMainMenu },
        { id: 'LEVEL_SELECT', el: this.dom.screenLevelSelect },
        { id: 'PLAYING', el: this.dom.screenGameplay },
        { id: 'HOW_TO_PLAY', el: this.dom.screenHowToPlay }
      ];

      screens.forEach((s) => {
        if (s.el) {
          if (s.id === this.currentScreen) {
            s.el.classList.remove('hidden');
          } else {
            s.el.classList.add('hidden');
          }
        }
      });

      if (this.currentScreen === 'PLAYING') {
        this.updateMobileTabVisuals();
        setTimeout(() => this.diorama.resize(), 50);
      }
    }

    renderLevelSelect() {
      this.saveData = SaveManager.load();
      const container = this.dom.levelMapGrid;
      if (!container) return;

      container.innerHTML = '';
      LEVELS.forEach((lvl, idx) => {
        const isUnlocked = idx + 1 <= (this.saveData.unlockedLevel || 1);
        const bestTime = this.saveData.bestTimes[lvl.id];

        const card = document.createElement('div');
        card.className = `p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between ${
          isUnlocked
            ? 'bg-white border-indigo-100 shadow-md hover:border-indigo-400 hover:shadow-lg cursor-pointer btn-tactile'
            : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
        }`;

        card.innerHTML = `
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black ${
                isUnlocked ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-500'
              }">
                LEVEL ${lvl.id}
              </span>
              <div class="flex items-center gap-0.5">
                ${
                  isUnlocked
                    ? `<span class="w-3.5 h-3.5 text-amber-400 inline-block">${window.GameAssets.get('star')}</span>
                       <span class="w-3.5 h-3.5 text-amber-400 inline-block">${window.GameAssets.get('star')}</span>
                       <span class="w-3.5 h-3.5 text-amber-400 inline-block">${window.GameAssets.get('star')}</span>`
                    : `<span class="w-3.5 h-3.5 text-slate-400 inline-block">${window.GameAssets.get('lock')}</span>`
                }
              </div>
            </div>
            <h3 class="font-extrabold text-sm sm:text-base text-slate-800">${lvl.title}</h3>
            <p class="text-[11px] text-slate-500">${lvl.difficulty}</p>
            <p class="text-xs text-slate-600 mt-1.5 line-clamp-2">${lvl.subtitle}</p>
          </div>
          <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
            <span class="text-[11px]">${bestTime ? `Best: ${this.formatTime(bestTime)}` : 'Not completed'}</span>
            <span class="text-indigo-600 font-extrabold flex items-center gap-1 text-[11px]">
              <span>${isUnlocked ? 'PLAY' : 'LOCKED'}</span>
              ${isUnlocked ? `<span class="w-3 h-3">${window.GameAssets.get('arrowRight')}</span>` : ''}
            </span>
          </div>
        `;

        if (isUnlocked) {
          card.addEventListener('click', () => {
            audio.playClick();
            this.startLevel(idx);
          });
        }

        container.appendChild(card);
      });
    }

    startLevel(index) {
      this.currentLevelIndex = index;
      this.level = LEVELS[index];
      this.gridState = {};
      this.historyStack = [];
      this.cluesCompleted = {};
      this.isGameActive = true;
      this.elapsedSeconds = 0;
      this.currentMobileTab = 'GRID';

      this.dom.levelBadgeText.textContent = `LEVEL ${this.level.id}`;
      this.diorama.setLevel(this.level);

      this.buildLogicGridTable();
      this.renderClues();
      this.updateNotebookSummary();
      this.setScreen('PLAYING');
      audio.startAmbient();
      this.startTimer();
    }

    startTimer() {
      this.stopTimer();
      this.startTime = Date.now();
      this.timerInterval = setInterval(() => {
        this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        this.dom.timerDisplay.textContent = this.formatTime(this.elapsedSeconds);
      }, 1000);
      this.dom.timerDisplay.textContent = '00:00';
    }

    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    formatTime(sec) {
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    buildLogicGridTable() {
      const container = this.dom.logicGridContainer;
      container.innerHTML = '';

      const cats = this.level.categories;
      const students = cats.students;
      const projects = cats.projects;
      const awards = cats.awards;

      const table = document.createElement('table');
      table.className = 'border-collapse select-none mx-auto bg-white rounded-xl overflow-hidden shadow-sm';

      const thead = document.createElement('thead');

      const topCatRow = document.createElement('tr');
      topCatRow.innerHTML = `
        <th class="p-1.5 border border-slate-300 bg-slate-100 text-[10px] sm:text-xs font-black text-slate-700">DEDUCTION</th>
        <th colspan="${projects.length}" class="p-1.5 border border-slate-300 bg-indigo-50 text-[10px] sm:text-xs font-black text-indigo-900">
          <div class="flex items-center justify-center gap-1">
            <span class="w-3.5 h-3.5">${window.GameAssets.get('flask')}</span>
            <span>PROJECTS</span>
          </div>
        </th>
        <th colspan="${awards.length}" class="p-1.5 border border-slate-300 bg-amber-50 text-[10px] sm:text-xs font-black text-amber-900">
          <div class="flex items-center justify-center gap-1">
            <span class="w-3.5 h-3.5">${window.GameAssets.get('trophy')}</span>
            <span>AWARDS</span>
          </div>
        </th>
      `;
      thead.appendChild(topCatRow);

      const subItemRow = document.createElement('tr');
      const cornerTh = document.createElement('th');
      cornerTh.className = 'border border-slate-300 bg-slate-50 text-[9px] text-slate-400 font-bold p-1';
      cornerTh.textContent = 'STUDENTS';
      subItemRow.appendChild(cornerTh);

      projects.forEach((proj) => {
        const th = document.createElement('th');
        th.className = 'border border-slate-300 bg-indigo-50/70 p-0.5 text-center';
        th.innerHTML = `
          <div class="flex flex-col items-center justify-end py-1">
            <span class="w-5 h-5 mb-0.5 block">${window.GameAssets.get(proj.assetKey)}</span>
            <span class="header-rotated text-indigo-950">${proj.name}</span>
          </div>
        `;
        subItemRow.appendChild(th);
      });

      awards.forEach((awd) => {
        const th = document.createElement('th');
        th.className = 'border border-slate-300 bg-amber-50/70 p-0.5 text-center';
        th.innerHTML = `
          <div class="flex flex-col items-center justify-end py-1">
            <span class="w-5 h-5 mb-0.5 block">${window.GameAssets.get(awd.assetKey)}</span>
            <span class="header-rotated text-amber-950">${awd.name}</span>
          </div>
        `;
        subItemRow.appendChild(th);
      });

      thead.appendChild(subItemRow);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');

      students.forEach((stud) => {
        const tr = document.createElement('tr');

        const rowHeader = document.createElement('td');
        rowHeader.className = 'border border-slate-300 bg-slate-50 px-1.5 py-1 text-xs font-extrabold text-slate-800 flex items-center gap-1 whitespace-nowrap min-w-[75px] sm:min-w-[90px]';
        rowHeader.innerHTML = `
          <span class="w-4 h-4 sm:w-5 sm:h-5 block shrink-0">${window.GameAssets.get(stud.assetKey)}</span>
          <span class="truncate">${stud.name}</span>
        `;
        tr.appendChild(rowHeader);

        projects.forEach((proj) => {
          const cell = this.createGridCell('students', stud.id, 'projects', proj.id);
          tr.appendChild(cell);
        });

        awards.forEach((awd) => {
          const cell = this.createGridCell('students', stud.id, 'awards', awd.id);
          tr.appendChild(cell);
        });

        tbody.appendChild(tr);
      });

      awards.forEach((awd) => {
        const tr = document.createElement('tr');

        const rowHeader = document.createElement('td');
        rowHeader.className = 'border border-slate-300 bg-amber-50/40 px-1.5 py-1 text-xs font-extrabold text-amber-950 flex items-center gap-1 whitespace-nowrap min-w-[75px] sm:min-w-[90px]';
        rowHeader.innerHTML = `
          <span class="w-4 h-4 sm:w-5 sm:h-5 block shrink-0">${window.GameAssets.get(awd.assetKey)}</span>
          <span class="truncate">${awd.name}</span>
        `;
        tr.appendChild(rowHeader);

        projects.forEach((proj) => {
          const cell = this.createGridCell('awards', awd.id, 'projects', proj.id);
          tr.appendChild(cell);
        });

        for (let i = 0; i < awards.length; i++) {
          const emptyCell = document.createElement('td');
          emptyCell.className = 'border border-slate-200 bg-slate-100/50 cursor-not-allowed';
          tr.appendChild(emptyCell);
        }

        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      container.appendChild(table);
    }

    createGridCell(catA, itemA, catB, itemB) {
      const td = document.createElement('td');
      td.className = 'border border-slate-300 p-0 text-center align-middle';

      const key = this.getCellKey(catA, itemA, catB, itemB);
      const cellDiv = document.createElement('div');
      cellDiv.className = 'grid-cell flex items-center justify-center';
      cellDiv.id = `cell-${key}`;

      const currentState = this.gridState[key] || 'EMPTY';
      this.updateCellVisual(cellDiv, currentState);

      cellDiv.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleCellState(catA, itemA, catB, itemB);
      });

      cellDiv.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.setDirectCellState(catA, itemA, catB, itemB, 'CROSS');
      });

      td.appendChild(cellDiv);
      return td;
    }

    getCellKey(catA, itemA, catB, itemB) {
      const pair = [`${catA}:${itemA}`, `${catB}:${itemB}`].sort();
      return `${pair[0]}|${pair[1]}`;
    }

    toggleCellState(catA, itemA, catB, itemB) {
      const key = this.getCellKey(catA, itemA, catB, itemB);
      const current = this.gridState[key] || 'EMPTY';
      let next = 'CROSS';
      if (current === 'EMPTY') {
        next = 'CROSS';
        audio.playCross();
      } else if (current === 'CROSS') {
        next = 'CHECK';
        audio.playCheck();
      } else {
        next = 'EMPTY';
        audio.playErase();
      }

      this.setCellState(catA, itemA, catB, itemB, next, true);
    }

    setDirectCellState(catA, itemA, catB, itemB, state) {
      audio.playCross();
      this.setCellState(catA, itemA, catB, itemB, state, true);
    }

    setCellState(catA, itemA, catB, itemB, state, recordHistory = true) {
      const key = this.getCellKey(catA, itemA, catB, itemB);
      const previousState = this.gridState[key] || 'EMPTY';
      if (previousState === state) return;

      const subHistory = [{ key, from: previousState, to: state, catA, itemA, catB, itemB }];
      this.gridState[key] = state;

      const el = document.getElementById(`cell-${key}`);
      if (el) this.updateCellVisual(el, state);

      if (state === 'CHECK' && this.autoCrossOut) {
        const crossed = this.applyAutoCrossOut(catA, itemA, catB, itemB);
        subHistory.push(...crossed);
      }

      if (recordHistory) {
        this.historyStack.push(subHistory);
      }

      this.updateNotebookSummary();
      this.checkRealtimeCompletion();
    }

    applyAutoCrossOut(catA, itemA, catB, itemB) {
      const changes = [];
      const cats = this.level.categories;
      const itemsB = cats[catB];
      const itemsA = cats[catA];

      if (itemsB) {
        itemsB.forEach((b) => {
          if (b.id !== itemB) {
            const k = this.getCellKey(catA, itemA, catB, b.id);
            if ((this.gridState[k] || 'EMPTY') !== 'CROSS') {
              changes.push({ key: k, from: this.gridState[k] || 'EMPTY', to: 'CROSS', catA, itemA, catB, itemB: b.id });
              this.gridState[k] = 'CROSS';
              const cell = document.getElementById(`cell-${k}`);
              if (cell) this.updateCellVisual(cell, 'CROSS');
            }
          }
        });
      }

      if (itemsA) {
        itemsA.forEach((a) => {
          if (a.id !== itemA) {
            const k = this.getCellKey(catA, a.id, catB, itemB);
            if ((this.gridState[k] || 'EMPTY') !== 'CROSS') {
              changes.push({ key: k, from: this.gridState[k] || 'EMPTY', to: 'CROSS', catA, itemA: a.id, catB, itemB });
              this.gridState[k] = 'CROSS';
              const cell = document.getElementById(`cell-${k}`);
              if (cell) this.updateCellVisual(cell, 'CROSS');
            }
          }
        });
      }

      return changes;
    }

    updateCellVisual(el, state) {
      el.className = 'grid-cell flex items-center justify-center';
      if (state === 'CHECK') {
        el.classList.add('grid-cell-check');
        el.innerHTML = `<span class="w-3.5 h-3.5 sm:w-4 sm:h-4 block">${window.GameAssets.get('check')}</span>`;
      } else if (state === 'CROSS') {
        el.classList.add('grid-cell-cross');
        el.innerHTML = `<span class="w-3.5 h-3.5 sm:w-4 sm:h-4 block">${window.GameAssets.get('cross')}</span>`;
      } else {
        el.innerHTML = '·';
        el.style.color = '#cbd5e1';
      }
    }

    undoLastAction() {
      if (this.historyStack.length === 0) {
        this.showToast('Nothing to undo!');
        return;
      }
      audio.playErase();
      const lastAction = this.historyStack.pop();
      lastAction.forEach((change) => {
        this.gridState[change.key] = change.from;
        const cell = document.getElementById(`cell-${change.key}`);
        if (cell) this.updateCellVisual(cell, change.from);
      });
      this.updateNotebookSummary();
      this.showToast('Action undone!');
    }

    renderClues() {
      const container = this.dom.cluesListContainer;
      if (!container) return;
      container.innerHTML = '';

      let completedCount = 0;
      let firstIncompleteClue = null;

      this.level.clues.forEach((clue, idx) => {
        const item = document.createElement('div');
        const isDone = !!this.cluesCompleted[clue.id];
        if (isDone) completedCount++;
        if (!isDone && !firstIncompleteClue) firstIncompleteClue = clue.text;

        item.className = `clue-item p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-2 text-xs font-semibold leading-relaxed text-slate-700 shadow-sm ${
          isDone ? 'completed' : ''
        }`;
        item.id = `clue-${clue.id}`;

        item.innerHTML = `
          <span class="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0 font-extrabold text-[10px] ${
            isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
          }">
            ${isDone ? `<span class="w-2.5 h-2.5 sm:w-3 sm:h-3">${window.GameAssets.get('check')}</span>` : idx + 1}
          </span>
          <span class="flex-1">${clue.text}</span>
        `;

        item.addEventListener('click', () => {
          audio.playClick();
          this.cluesCompleted[clue.id] = !this.cluesCompleted[clue.id];
          this.renderClues();
        });

        container.appendChild(item);
      });

      if (this.dom.cluesBadgeCount) {
        this.dom.cluesBadgeCount.textContent = `${completedCount}/${this.level.clues.length}`;
      }
      if (this.dom.tickerClueText) {
        this.dom.tickerClueText.textContent = firstIncompleteClue || 'All clues checked!';
      }
    }

    updateNotebookSummary() {
      const container = this.dom.notebookContainer;
      if (!container) return;
      container.innerHTML = '';

      const cats = this.level.categories;
      const students = cats.students;

      students.forEach((s) => {
        let matchedProj = null;
        let matchedAward = null;

        cats.projects.forEach((p) => {
          const k = this.getCellKey('students', s.id, 'projects', p.id);
          if (this.gridState[k] === 'CHECK') matchedProj = p;
        });

        cats.awards.forEach((a) => {
          const k = this.getCellKey('students', s.id, 'awards', a.id);
          if (this.gridState[k] === 'CHECK') matchedAward = a;
        });

        const card = document.createElement('div');
        card.className = `p-2 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
          matchedProj && matchedAward
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`;

        card.innerHTML = `
          <div class="flex items-center gap-1.5">
            <span class="w-4 h-4 sm:w-5 sm:h-5 block shrink-0">${window.GameAssets.get(s.assetKey)}</span>
            <span class="font-extrabold text-[11px] sm:text-xs">${s.name}</span>
          </div>
          <div class="flex items-center gap-1.5 text-[10px] sm:text-xs">
            <span class="px-1.5 py-0.5 rounded flex items-center gap-1 ${
              matchedProj ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-400'
            }">
              ${
                matchedProj
                  ? `<span class="w-3 h-3 block">${window.GameAssets.get(matchedProj.assetKey)}</span><span>${matchedProj.name}</span>`
                  : `<span>—</span>`
              }
            </span>
            <span class="w-3 h-3 text-slate-400">${window.GameAssets.get('arrowRight')}</span>
            <span class="px-1.5 py-0.5 rounded flex items-center gap-1 ${
              matchedAward ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'
            }">
              ${
                matchedAward
                  ? `<span class="w-3 h-3 block">${window.GameAssets.get(matchedAward.assetKey)}</span><span>${matchedAward.name}</span>`
                  : `<span>—</span>`
              }
            </span>
          </div>
        `;

        container.appendChild(card);
      });
    }

    openRewardAdModal() {
      this.rewardCountdown = 4;
      this.dom.btnClaimReward.disabled = true;
      this.dom.btnClaimReward.classList.add('opacity-50', 'cursor-not-allowed');
      this.dom.adTimerText.textContent = `0${this.rewardCountdown}s`;
      this.dom.adProgressBar.style.width = '0%';
      this.dom.modalRewardAd.classList.remove('hidden');

      if (this.rewardInterval) clearInterval(this.rewardInterval);
      const total = 4;
      let cur = 0;

      this.rewardInterval = setInterval(() => {
        cur += 0.1;
        const remaining = Math.max(0, Math.ceil(total - cur));
        this.dom.adTimerText.textContent = `0${remaining}s`;
        this.dom.adProgressBar.style.width = `${Math.min(100, (cur / total) * 100)}%`;

        if (cur >= total) {
          clearInterval(this.rewardInterval);
          this.rewardInterval = null;
          this.dom.btnClaimReward.disabled = false;
          this.dom.btnClaimReward.classList.remove('opacity-50', 'cursor-not-allowed');
          this.dom.btnClaimReward.classList.add('animate-bounce');
        }
      }, 100);
    }

    closeRewardAdModal() {
      if (this.rewardInterval) {
        clearInterval(this.rewardInterval);
        this.rewardInterval = null;
      }
      this.dom.modalRewardAd.classList.add('hidden');
    }

    giveIntelligentHint() {
      audio.playHint();
      const clues = this.level.clues;
      for (let i = 0; i < clues.length; i++) {
        const c = clues[i];
        if (c.hintTarget) {
          const ht = c.hintTarget;
          const k = this.getCellKey(ht.cat1, ht.item1, ht.cat2, ht.item2 || ht.item1_alt);
          if (this.gridState[k] !== ht.state) {
            this.setCellState(ht.cat1, ht.item1, ht.cat2, ht.item2 || ht.item1_alt, ht.state, true);
            const el = document.getElementById(`cell-${k}`);
            if (el) {
              el.classList.add('grid-cell-highlight');
              setTimeout(() => el.classList.remove('grid-cell-highlight'), 3000);
            }
            this.cluesCompleted[c.id] = true;
            this.renderClues();
            this.showToast(`HINT: ${ht.reason}`);
            return;
          }
        }
      }

      const sol = this.level.solution;
      for (const studentId in sol) {
        const s = sol[studentId];
        const kProj = this.getCellKey('students', studentId, 'projects', s.project);
        if (this.gridState[kProj] !== 'CHECK') {
          this.setCellState('students', studentId, 'projects', s.project, 'CHECK', true);
          this.showToast(`HINT: Project successfully matched!`);
          return;
        }
        const kAward = this.getCellKey('students', studentId, 'awards', s.award);
        if (this.gridState[kAward] !== 'CHECK') {
          this.setCellState('students', studentId, 'awards', s.award, 'CHECK', true);
          this.showToast(`HINT: Medal successfully matched!`);
          return;
        }
      }

      this.showToast('All main deductions are already filled!');
    }

    checkRealtimeCompletion() {
      const sol = this.level.solution;
      let allCorrect = true;

      for (const studentId in sol) {
        const s = sol[studentId];
        const kProj = this.getCellKey('students', studentId, 'projects', s.project);
        const kAward = this.getCellKey('students', studentId, 'awards', s.award);

        if (this.gridState[kProj] !== 'CHECK' || this.gridState[kAward] !== 'CHECK') {
          allCorrect = false;
          break;
        }
      }

      if (allCorrect && this.isGameActive) {
        this.triggerVictory();
      }
    }

    validateSolution(fromButton = false) {
      const sol = this.level.solution;
      let conflicts = 0;
      let checksPlaced = 0;

      for (const studentId in sol) {
        const s = sol[studentId];
        const kProj = this.getCellKey('students', studentId, 'projects', s.project);
        const kAward = this.getCellKey('students', studentId, 'awards', s.award);

        if (this.gridState[kProj] === 'CHECK') checksPlaced++;
        if (this.gridState[kAward] === 'CHECK') checksPlaced++;

        if (this.gridState[kProj] === 'CROSS' || this.gridState[kAward] === 'CROSS') {
          conflicts++;
        }
      }

      if (conflicts > 0) {
        audio.playError();
        this.showToast(`Warning: There are ${conflicts} conflicting marks!`);
        return;
      }

      const totalRequired = Object.keys(sol).length * 2;
      if (checksPlaced < totalRequired) {
        audio.playClick();
        this.showToast(`You have deduced ${checksPlaced}/${totalRequired} relationships.`);
        return;
      }

      this.triggerVictory();
    }

    triggerVictory() {
      if (!this.isGameActive) return;
      this.isGameActive = false;
      this.stopTimer();
      audio.playVictory();
      this.diorama.spawnVictoryConfetti();

      const timeTaken = Math.max(1, this.elapsedSeconds);

      SaveManager.unlockNext(this.level.id, timeTaken);

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'win', time: timeTaken }, '*');
      }

      if (this.dom.vicLevelTitle) {
        this.dom.vicLevelTitle.textContent = `${this.level.title.toUpperCase()} COMPLETED!`;
      }
      if (this.dom.vicTimeText) {
        this.dom.vicTimeText.textContent = `Time: ${this.formatTime(timeTaken)}`;
      }
      if (this.dom.modalVictory) {
        this.dom.modalVictory.classList.remove('hidden');
      }
    }

    showToast(msg) {
      const toast = this.dom.feedbackToast;
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.remove('hidden', 'opacity-0');
      toast.classList.add('opacity-100');

      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.classList.add('hidden'), 300);
      }, 3000);
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new ScienceFairLogicApp();
  });
})();
