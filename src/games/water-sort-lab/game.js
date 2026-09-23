
function triggerPlatformWin(timeInSeconds) {
    const elapsed = Math.round(timeInSeconds || 45);
    try {
        if (typeof window.onWin === 'function') {
            window.onWin(elapsed);
        }
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'win', time: elapsed }, '*');
        }
    } catch(e) { console.error('Platform win notify error:', e); }
}
(() => {
  // water-sort-lab/src/levels.ts
  var PRESET_LEVELS = [
    {
      id: 1,
      name: "Level 1 - Lab Basics",
      hint: "Tap a tube to select the top liquid layer, then tap the empty tube to pour.",
      parMoves: 4,
      tubes: [
        ["yellow", "blue", "yellow", "blue"],
        ["blue", "yellow", "blue", "yellow"],
        []
      ]
    },
    {
      id: 2,
      name: "Level 2 - Three Solutions",
      hint: "Separate Pink, Yellow, and Blue. You can only stack matching colors together!",
      parMoves: 6,
      tubes: [
        ["pink", "yellow", "blue", "pink"],
        ["yellow", "blue", "yellow", "pink"],
        ["blue", "pink", "blue", "yellow"],
        []
      ]
    },
    {
      id: 3,
      name: "Level 3 - Dual Reservoirs",
      hint: "Two empty tubes give you plenty of room to maneuver the chemicals.",
      parMoves: 7,
      tubes: [
        ["green", "orange", "green", "orange"],
        ["orange", "teal", "green", "teal"],
        ["teal", "green", "orange", "teal"],
        [],
        []
      ]
    },
    {
      id: 4,
      name: "Level 4 - Chemical Compound",
      hint: "Focus on isolating one full color first to free up a test tube.",
      parMoves: 9,
      tubes: [
        ["purple", "yellow", "pink", "teal"],
        ["teal", "pink", "yellow", "purple"],
        ["pink", "teal", "purple", "yellow"],
        ["yellow", "purple", "teal", "pink"],
        []
      ]
    },
    {
      id: 5,
      name: "Level 5 - Vibrant Reactions",
      hint: "Try to clear one tube completely in your first few moves.",
      parMoves: 10,
      tubes: [
        ["blue", "orange", "green", "pink"],
        ["pink", "green", "blue", "orange"],
        ["orange", "pink", "green", "blue"],
        ["green", "blue", "orange", "pink"],
        [],
        []
      ]
    },
    {
      id: 6,
      name: "Level 6 - Five Elements",
      hint: "Plan two moves ahead before transferring the top layer.",
      parMoves: 12,
      tubes: [
        ["red", "yellow", "blue", "green"],
        ["green", "purple", "red", "yellow"],
        ["purple", "blue", "green", "red"],
        ["yellow", "red", "purple", "blue"],
        ["blue", "green", "yellow", "purple"],
        [],
        []
      ]
    },
    {
      id: 7,
      name: "Level 7 - Lab Master Challenge",
      hint: "The classic layout! Pour the blue and yellow layers to clear way for green and orange.",
      parMoves: 12,
      tubes: [
        ["teal", "purple"],
        // 2 filled
        ["green", "yellow", "pink", "blue"],
        ["orange", "pink", "yellow", "yellow"],
        ["purple", "orange", "teal", "teal"],
        ["pink", "pink", "green", "blue"],
        ["orange", "green", "green", "blue"],
        ["purple", "purple", "orange", "teal"],
        [],
        []
      ]
    },
    {
      id: 8,
      name: "Level 8 - Prismatic Spectrum",
      hint: "Grouping warm colors (Orange and Yellow) helps organize the rest.",
      parMoves: 14,
      tubes: [
        ["orange", "teal", "purple", "pink"],
        ["yellow", "green", "orange", "blue"],
        ["purple", "blue", "green", "yellow"],
        ["pink", "teal", "blue", "green"],
        ["green", "yellow", "pink", "teal"],
        ["blue", "orange", "purple", "teal"],
        [],
        []
      ]
    },
    {
      id: 9,
      name: "Level 9 - High Density",
      hint: "Every completed tube makes the remaining moves much easier.",
      parMoves: 15,
      tubes: [
        ["red", "blue", "violet", "yellow"],
        ["green", "red", "orange", "blue"],
        ["yellow", "violet", "green", "red"],
        ["orange", "green", "yellow", "violet"],
        ["blue", "orange", "red", "green"],
        ["violet", "yellow", "blue", "orange"],
        [],
        []
      ]
    },
    {
      id: 10,
      name: "Level 10 - Master of Alchemy",
      hint: "Be careful not to block the empty tube with just 1 unit of color.",
      parMoves: 18,
      tubes: [
        ["teal", "purple", "orange", "lime"],
        ["lime", "pink", "teal", "yellow"],
        ["yellow", "orange", "purple", "lime"],
        ["pink", "teal", "yellow", "orange"],
        ["purple", "lime", "pink", "teal"],
        ["orange", "yellow", "lime", "pink"],
        [],
        []
      ]
    }
  ];
  function generateRandomLevel(levelNum) {
    const colorPool = ["teal", "purple", "blue", "pink", "yellow", "green", "orange", "red", "violet", "lime"];
    const numColors = Math.min(8, Math.max(3, Math.floor(3 + levelNum * 0.4)));
    const selectedColors = colorPool.slice(0, numColors);
    const allSegments = [];
    selectedColors.forEach((c) => {
      allSegments.push(c, c, c, c);
    });
    for (let i = allSegments.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allSegments[i], allSegments[j]] = [allSegments[j], allSegments[i]];
    }
    const tubes = [];
    for (let i = 0; i < numColors; i++) {
      tubes.push(allSegments.slice(i * 4, (i + 1) * 4));
    }
    tubes.push([]);
    tubes.push([]);
    return {
      id: levelNum,
      name: `Level ${levelNum} - Procedural`,
      hint: "Transfer matching layers to organize the test tubes.",
      parMoves: numColors * 3 + 2,
      tubes
    };
  }
  function getLevelConfig(levelIndex) {
    if (levelIndex >= 0 && levelIndex < PRESET_LEVELS.length) {
      const base = PRESET_LEVELS[levelIndex];
      return {
        ...base,
        tubes: base.tubes.map((t) => [...t])
      };
    }
    return generateRandomLevel(levelIndex + 1);
  }

  // water-sort-lab/src/audio.ts
  var SoundFX = class {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.pourNoiseSource = null;
      this.pourNoiseGain = null;
      this.pourIntervalId = null;
      this.pourAutoStopTimer = null;
      this.isCurrentlyPouring = false;
      const saved = localStorage.getItem("water_sort_lab_sound");
      this.enabled = saved !== null ? saved === "true" : true;
    }
    initContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {
        });
      }
    }
    isEnabled() {
      return this.enabled;
    }
    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem("water_sort_lab_sound", String(this.enabled));
      if (this.enabled) {
        this.initContext();
        this.playGlassTap();
      } else {
        this.stopPouring();
      }
      return this.enabled;
    }
    playGlassTap(pitchOffset = 0) {
      if (!this.enabled) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1400 + pitchOffset * 120, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } catch {
      }
    }
    /**
     * Generates a single organic liquid bubble glug (Minnaert resonant droplet)
     */
    playWaterDropletGlug(baseFreq) {
      if (!this.ctx || !this.enabled || !this.isCurrentlyPouring) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startFreq = baseFreq + (Math.random() - 0.5) * 80;
        const endFreq = startFreq * (1.6 + Math.random() * 0.4);
        osc.type = "sine";
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.045);
        const vol = 0.06 + Math.random() * 0.05;
        gain.gain.setValueAtTime(1e-3, now);
        gain.gain.linearRampToValueAtTime(vol, now + 8e-3);
        gain.gain.exponentialRampToValueAtTime(1e-4, now + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } catch {
      }
    }
    startPouring(maxDurationMs = 850) {
      if (!this.enabled) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        this.stopPouring();
        this.isCurrentlyPouring = true;
        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 1.5);
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastVal = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          lastVal = lastVal * 0.95 + white * 0.05;
          output[i] = lastVal * 3.5;
        }
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;
        const bpf = this.ctx.createBiquadFilter();
        bpf.type = "bandpass";
        bpf.frequency.setValueAtTime(700, now);
        bpf.frequency.linearRampToValueAtTime(1100, now + maxDurationMs / 1e3);
        bpf.Q.setValueAtTime(3.2, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(5e-3, now);
        noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.08);
        noiseSource.connect(bpf);
        bpf.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noiseSource.start(now);
        this.pourNoiseSource = noiseSource;
        this.pourNoiseGain = noiseGain;
        let glugCount = 0;
        const startTime = performance.now();
        const runGlugs = () => {
          if (!this.isCurrentlyPouring) return;
          const elapsed = performance.now() - startTime;
          const progress = Math.min(1, elapsed / maxDurationMs);
          const pitch = 480 + progress * 320;
          this.playWaterDropletGlug(pitch);
          const nextDelay = 55 + Math.random() * 55;
          this.pourIntervalId = window.setTimeout(runGlugs, nextDelay);
          glugCount++;
        };
        runGlugs();
        this.pourAutoStopTimer = window.setTimeout(() => {
          this.stopPouring();
        }, maxDurationMs + 80);
      } catch {
      }
    }
    stopPouring() {
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
          this.pourNoiseGain.gain.linearRampToValueAtTime(1e-4, now + 0.05);
        } catch {
        }
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
        } catch {
        }
      }, 60);
    }
    playBubble() {
      if (!this.enabled) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } catch {
      }
    }
    playError() {
      if (!this.enabled) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.setValueAtTime(170, now + 0.08);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      } catch {
      }
    }
    playUndo() {
      if (!this.enabled) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.14);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } catch {
      }
    }
    playWin() {
      if (!this.enabled) return;
      this.initContext();
      if (!this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const now = this.ctx.currentTime + idx * 0.12;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
        });
      } catch {
      }
    }
  };
  var sound = new SoundFX();

  // water-sort-lab/src/game-state.ts
  var GameState = class {
    constructor() {
      this.currentLevelIndex = 6;
      this.tubes = [];
      this.selectedTubeIndex = null;
      this.moves = 0;
      this.history = [];
      this.isWon = false;
      this.isAnimating = false;
      this.startTime = Date.now();
      this.elapsedSeconds = 0;
      this.timerInterval = null;
      this.statusMessage = "Tap a test tube to select the top liquid layer";
      this.extraTubesAdded = 0;
      // Animation pouring details
      this.pourAnimation = null;
      this.onStateChangeCallback = null;
      const save = this.loadSave();
      this.currentLevelIndex = save.currentLevel;
      this.loadLevel(this.currentLevelIndex);
    }
    setOnChange(cb) {
      this.onStateChangeCallback = cb;
    }
    notify() {
      if (this.onStateChangeCallback) {
        this.onStateChangeCallback();
      }
    }
    loadSave() {
      const raw = localStorage.getItem("water_sort_lab_save_v2");
      if (raw) {
        try {
          const data = JSON.parse(raw);
          if (typeof data.currentLevel === "number") {
            this.currentLevelIndex = data.currentLevel;
          }
          return {
            currentLevel: typeof data.currentLevel === "number" ? data.currentLevel : 0,
            unlockedLevels: typeof data.unlockedLevels === "number" ? Math.max(1, data.unlockedLevels) : 1,
            bestMoves: data.bestMoves || {}
          };
        } catch {
        }
      }
      return {
        currentLevel: 0,
        // Level 1 in UI
        unlockedLevels: 1,
        // Only Level 1 unlocked initially
        bestMoves: {}
      };
    }
    saveProgress() {
      const currentSave = this.loadSave();
      const save = {
        currentLevel: this.currentLevelIndex,
        unlockedLevels: Math.max(currentSave.unlockedLevels, this.currentLevelIndex + 2),
        bestMoves: {
          ...currentSave.bestMoves
        }
      };
      if (this.isWon) {
        const prevBest = save.bestMoves[this.currentLevelIndex];
        if (prevBest === void 0 || this.moves < prevBest) {
          save.bestMoves[this.currentLevelIndex] = this.moves;
        }
      }
      localStorage.setItem("water_sort_lab_save_v2", JSON.stringify(save));
    }
    getBestMovesForCurrentLevel() {
      const save = this.loadSave();
      return save.bestMoves[this.currentLevelIndex] ?? null;
    }
    loadLevel(levelIndex) {
      sound.stopPouring();
      this.currentLevelIndex = levelIndex;
      this.levelConfig = getLevelConfig(levelIndex);
      this.tubes = this.levelConfig.tubes.map((t) => [...t]);
      this.selectedTubeIndex = null;
      this.moves = 0;
      this.history = [];
      this.isWon = false;
      this.isAnimating = false;
      this.pourAnimation = null;
      this.extraTubesAdded = 0;
      this.startTime = Date.now();
      this.elapsedSeconds = 0;
      this.statusMessage = `Pour liquids to sort each tube by color \u2022 Level ${this.levelConfig.id}`;
      this.startTimer();
      this.notify();
    }
    restartCurrentLevel() {
      this.loadLevel(this.currentLevelIndex);
    }
    nextLevel() {
      this.loadLevel(this.currentLevelIndex + 1);
    }
    prevLevel() {
      if (this.currentLevelIndex > 0) {
        this.loadLevel(this.currentLevelIndex - 1);
      }
    }
    addExtraTube() {
      if (this.extraTubesAdded >= 2) return false;
      this.extraTubesAdded++;
      this.tubes.push([]);
      this.statusMessage = "Extra test tube added to the lab!";
      this.notify();
      return true;
    }
    startTimer() {
      if (this.timerInterval) {
        window.clearInterval(this.timerInterval);
      }
      this.timerInterval = window.setInterval(() => {
        if (!this.isWon) {
          this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1e3);
          this.notify();
        }
      }, 1e3);
    }
    getFormattedTime() {
      const mins = Math.floor(this.elapsedSeconds / 60);
      const secs = this.elapsedSeconds % 60;
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
    canPour(fromIndex, toIndex) {
      if (fromIndex === toIndex) return { valid: false, amount: 0, reason: "Same tube" };
      const from = this.tubes[fromIndex];
      const to = this.tubes[toIndex];
      if (!from || from.length === 0) {
        return { valid: false, amount: 0, reason: "Source tube is empty" };
      }
      if (!to || to.length >= 4) {
        return { valid: false, amount: 0, reason: "Target tube is full (capacity 4)" };
      }
      const topColor = from[from.length - 1];
      if (to.length > 0) {
        const destTopColor = to[to.length - 1];
        if (topColor !== destTopColor) {
          return { valid: false, amount: 0, reason: "Colors do not match" };
        }
      }
      let consecutiveCount = 0;
      for (let i = from.length - 1; i >= 0; i--) {
        if (from[i] === topColor) {
          consecutiveCount++;
        } else {
          break;
        }
      }
      const availableSpace = 4 - to.length;
      const amountToTransfer = Math.min(consecutiveCount, availableSpace);
      return {
        valid: amountToTransfer > 0,
        amount: amountToTransfer,
        color: topColor
      };
    }
    checkWin() {
      for (const tube of this.tubes) {
        if (tube.length === 0) continue;
        if (tube.length !== 4) return false;
        const firstColor = tube[0];
        for (let i = 1; i < tube.length; i++) {
          if (tube[i] !== firstColor) return false;
        }
      }
      return true;
    }
    isTubeComplete(tubeIndex) {
      const tube = this.tubes[tubeIndex];
      if (!tube || tube.length !== 4) return false;
      const c = tube[0];
      return tube.every((seg) => seg === c);
    }
    executeMove(fromIndex, toIndex, onComplete) {
      const check = this.canPour(fromIndex, toIndex);
      if (!check.valid || !check.color) return false;
      this.history.push({
        tubes: this.tubes.map((t) => [...t]),
        moves: this.moves
      });
      this.isAnimating = true;
      const amount = check.amount;
      const color = check.color;
      this.pourAnimation = {
        fromIndex,
        toIndex,
        color,
        amount,
        progress: 0,
        durationMs: 400 + amount * 180,
        startTime: performance.now()
      };
      this.selectedTubeIndex = null;
      this.moves++;
      this.statusMessage = `Transferring liquid layers...`;
      this.notify();
      let isCompleted = false;
      const completeMove = () => {
        if (isCompleted) return;
        isCompleted = true;
        for (let i = 0; i < amount; i++) {
          this.tubes[fromIndex].pop();
          this.tubes[toIndex].push(color);
        }
        this.isAnimating = false;
        this.pourAnimation = null;
        if (this.checkWin()) {
          this.isWon = true;
          this.statusMessage = "Solved! All colors separated! \u{1F389}";
          this.saveProgress();
        } else {
          const remainingMoves = this.calculateRemainingEstimate();
          this.statusMessage = `Tap another tube to pour \u2022 ~${remainingMoves} moves remaining`;
        }
        this.notify();
        if (onComplete) onComplete();
      };
      window.setTimeout(completeMove, this.pourAnimation.durationMs);
      return { duration: this.pourAnimation.durationMs, complete: completeMove };
    }
    undo() {
      if (this.isAnimating || this.history.length === 0) return false;
      const previous = this.history.pop();
      this.tubes = previous.tubes.map((t) => [...t]);
      this.moves = previous.moves;
      this.selectedTubeIndex = null;
      this.isWon = false;
      this.statusMessage = "Move undone successfully";
      this.notify();
      return true;
    }
    getHint() {
      const possibleMoves = [];
      for (let f = 0; f < this.tubes.length; f++) {
        if (this.isTubeComplete(f)) continue;
        for (let t = 0; t < this.tubes.length; t++) {
          if (f === t) continue;
          const check = this.canPour(f, t);
          if (check.valid && check.color) {
            let score = 0;
            const target = this.tubes[t];
            if (target.length > 0) score += 5;
            if (target.length + check.amount === 4) score += 10;
            const isSourceAllOneColor = this.tubes[f].every((c) => c === check.color);
            if (target.length === 0 && isSourceAllOneColor) {
              score -= 20;
            }
            possibleMoves.push({ from: f, to: t, score, color: check.color });
          }
        }
      }
      if (possibleMoves.length === 0) return null;
      possibleMoves.sort((a, b) => b.score - a.score);
      return possibleMoves[0];
    }
    calculateRemainingEstimate() {
      let unseparatedSegments = 0;
      for (const tube of this.tubes) {
        if (tube.length === 0) continue;
        for (let i = 0; i < tube.length - 1; i++) {
          if (tube[i] !== tube[i + 1]) {
            unseparatedSegments++;
          }
        }
      }
      return Math.max(1, unseparatedSegments + 2);
    }
  };

  // water-sort-lab/src/colors.ts
  var LIQUID_COLORS = {
    teal: {
      id: "teal",
      name: "Teal Ocean",
      namePt: "Azul Petr\xF3leo",
      primary: "#0e7490",
      gradientTop: "#22d3ee",
      gradientBottom: "#0e7490",
      highlight: "#a5f3fc",
      stream: "#06b6d4",
      glow: "rgba(14, 116, 144, 0.45)"
    },
    purple: {
      id: "purple",
      name: "Royal Purple",
      namePt: "Roxo Real",
      primary: "#7c3aed",
      gradientTop: "#a78bfa",
      gradientBottom: "#6d28d9",
      highlight: "#ddd6fe",
      stream: "#8b5cf6",
      glow: "rgba(124, 58, 237, 0.45)"
    },
    blue: {
      id: "blue",
      name: "Sky Blue",
      namePt: "Azul Claro",
      primary: "#0284c7",
      gradientTop: "#38bdf8",
      gradientBottom: "#0369a1",
      highlight: "#bae6fd",
      stream: "#0ea5e9",
      glow: "rgba(2, 132, 199, 0.45)"
    },
    pink: {
      id: "pink",
      name: "Rose Pink",
      namePt: "Rosa Choque",
      primary: "#ec4899",
      gradientTop: "#f472b6",
      gradientBottom: "#db2777",
      highlight: "#fbcfe8",
      stream: "#f43f5e",
      glow: "rgba(236, 72, 153, 0.45)"
    },
    yellow: {
      id: "yellow",
      name: "Golden Yellow",
      namePt: "Amarelo Ouro",
      primary: "#eab308",
      gradientTop: "#fde047",
      gradientBottom: "#ca8a04",
      highlight: "#fef08a",
      stream: "#facc15",
      glow: "rgba(234, 179, 8, 0.45)"
    },
    green: {
      id: "green",
      name: "Emerald Green",
      namePt: "Verde Esmeralda",
      primary: "#16a34a",
      gradientTop: "#4ade80",
      gradientBottom: "#15803d",
      highlight: "#bbf7d0",
      stream: "#22c55e",
      glow: "rgba(22, 163, 74, 0.45)"
    },
    orange: {
      id: "orange",
      name: "Vibrant Orange",
      namePt: "Laranja Vivo",
      primary: "#ea580c",
      gradientTop: "#fb923c",
      gradientBottom: "#c2410c",
      highlight: "#fed7aa",
      stream: "#f97316",
      glow: "rgba(234, 88, 12, 0.45)"
    },
    red: {
      id: "red",
      name: "Ruby Red",
      namePt: "Vermelho Rubi",
      primary: "#dc2626",
      gradientTop: "#f87171",
      gradientBottom: "#b91c1c",
      highlight: "#fecaca",
      stream: "#ef4444",
      glow: "rgba(220, 38, 38, 0.45)"
    },
    violet: {
      id: "violet",
      name: "Deep Violet",
      namePt: "Violeta Intenso",
      primary: "#9333ea",
      gradientTop: "#c084fc",
      gradientBottom: "#7e22ce",
      highlight: "#e9d5ff",
      stream: "#a855f7",
      glow: "rgba(147, 51, 234, 0.45)"
    },
    lime: {
      id: "lime",
      name: "Electric Lime",
      namePt: "Verde Lim\xE3o",
      primary: "#65a30d",
      gradientTop: "#a3e635",
      gradientBottom: "#4d7c0f",
      highlight: "#d9f99d",
      stream: "#84cc16",
      glow: "rgba(101, 163, 13, 0.45)"
    }
  };

  // water-sort-lab/src/canvas-renderer.ts
  var CanvasRenderer = class {
    constructor(canvas, state) {
      this.layouts = [];
      this.bubbles = /* @__PURE__ */ new Map();
      this.splashParticles = [];
      this.confettiParticles = [];
      this.animFrameId = null;
      this.lastTime = performance.now();
      this.dpr = 1;
      // Visual offsets for animation
      this.tubeVisualOffsets = /* @__PURE__ */ new Map();
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: true });
      this.state = state;
      this.initBubbles();
      this.startLoop();
    }
    initBubbles() {
      for (let i = 0; i < 12; i++) {
        const tubeBubbles = [];
        const count = 5 + Math.floor(Math.random() * 4);
        for (let b = 0; b < count; b++) {
          tubeBubbles.push({
            x: 0.2 + Math.random() * 0.6,
            y: Math.random(),
            size: 1.5 + Math.random() * 2.5,
            speed: 3e-4 + Math.random() * 6e-4,
            wobbleSpeed: 2e-3 + Math.random() * 3e-3,
            wobbleAmp: 0.03 + Math.random() * 0.04,
            phase: Math.random() * Math.PI * 2,
            alpha: 0.3 + Math.random() * 0.4
          });
        }
        this.bubbles.set(i, tubeBubbles);
      }
    }
    triggerConfetti() {
      this.confettiParticles = [];
      const colors = ["#0284c7", "#ec4899", "#eab308", "#16a34a", "#ea580c", "#7c3aed", "#38bdf8"];
      const w = this.canvas.width / this.dpr;
      const h = this.canvas.height / this.dpr;
      for (let i = 0; i < 90; i++) {
        this.confettiParticles.push({
          x: w * 0.5 + (Math.random() - 0.5) * 80,
          y: h * 0.45 + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 14,
          vy: -7 - Math.random() * 9,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          width: 8 + Math.random() * 6,
          height: 5 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1
        });
      }
    }
    resize() {
      const parent = this.canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const displayWidth = Math.floor(rect.width);
      const isMobile = displayWidth < 600;
      const displayHeight = isMobile ? Math.min(520, Math.max(380, window.innerHeight * 0.54)) : 460;
      this.canvas.width = Math.floor(displayWidth * this.dpr);
      this.canvas.height = Math.floor(displayHeight * this.dpr);
      this.canvas.style.width = `${displayWidth}px`;
      this.canvas.style.height = `${displayHeight}px`;
      this.ctx.resetTransform?.();
      this.ctx.scale(this.dpr, this.dpr);
      this.calculateLayouts(displayWidth, displayHeight);
    }
    calculateLayouts(canvasW, canvasH) {
      this.layouts = [];
      const numTubes = this.state.tubes.length;
      if (numTubes === 0) return;
      const isTwoRows = canvasW < 560 && numTubes > 4;
      if (!isTwoRows) {
        const maxTubeWidth = Math.min(72, (canvasW - 40) / numTubes - 14);
        const tubeWidth = Math.max(38, Math.min(62, maxTubeWidth));
        const tubeHeight = Math.min(canvasH * 0.65, tubeWidth * 3.8);
        const totalWidth = numTubes * tubeWidth + (numTubes - 1) * Math.max(12, (canvasW - numTubes * tubeWidth) / (numTubes + 1));
        const startX = (canvasW - totalWidth) / 2;
        const spacing = numTubes > 1 ? (totalWidth - numTubes * tubeWidth) / (numTubes - 1) : 0;
        const y = canvasH * 0.52 - tubeHeight * 0.45;
        for (let i = 0; i < numTubes; i++) {
          const x = startX + i * (tubeWidth + spacing);
          this.layouts.push({
            index: i,
            x,
            y,
            width: tubeWidth,
            height: tubeHeight,
            rimRadius: tubeWidth * 0.16,
            innerRadius: tubeWidth * 0.46,
            bottomRadius: tubeWidth * 0.48
          });
        }
      } else {
        const topCount = Math.ceil(numTubes / 2);
        const bottomCount = numTubes - topCount;
        const tubeWidth = Math.max(36, Math.min(52, (canvasW - 48) / topCount - 16));
        const tubeHeight = Math.min(canvasH * 0.38, tubeWidth * 3.6);
        const topTotalW = topCount * tubeWidth + (topCount - 1) * 16;
        const topStartX = (canvasW - topTotalW) / 2;
        const topY = canvasH * 0.14;
        for (let i = 0; i < topCount; i++) {
          const x = topStartX + i * (tubeWidth + 16);
          this.layouts.push({
            index: i,
            x,
            y: topY,
            width: tubeWidth,
            height: tubeHeight,
            rimRadius: tubeWidth * 0.16,
            innerRadius: tubeWidth * 0.46,
            bottomRadius: tubeWidth * 0.48
          });
        }
        const btmTotalW = bottomCount * tubeWidth + (bottomCount - 1) * 16;
        const btmStartX = (canvasW - btmTotalW) / 2;
        const btmY = canvasH * 0.56;
        for (let i = 0; i < bottomCount; i++) {
          const x = btmStartX + i * (tubeWidth + 16);
          this.layouts.push({
            index: topCount + i,
            x,
            y: btmY,
            width: tubeWidth,
            height: tubeHeight,
            rimRadius: tubeWidth * 0.16,
            innerRadius: tubeWidth * 0.46,
            bottomRadius: tubeWidth * 0.48
          });
        }
      }
    }
    getTubeAt(canvasX, canvasY) {
      for (const layout of this.layouts) {
        const padding = 12;
        if (canvasX >= layout.x - padding && canvasX <= layout.x + layout.width + padding && canvasY >= layout.y - padding - 20 && canvasY <= layout.y + layout.height + padding) {
          return layout.index;
        }
      }
      return null;
    }
    startLoop() {
      const loop = (timestamp) => {
        const dt = Math.min(timestamp - this.lastTime, 60);
        this.lastTime = timestamp;
        this.update(dt, timestamp);
        this.render(timestamp);
        this.animFrameId = requestAnimationFrame(loop);
      };
      this.animFrameId = requestAnimationFrame(loop);
    }
    stop() {
      if (this.animFrameId) {
        cancelAnimationFrame(this.animFrameId);
      }
    }
    update(dt, timestamp) {
      if (this.state.pourAnimation) {
        const anim = this.state.pourAnimation;
        const elapsed = timestamp - anim.startTime;
        anim.progress = Math.min(1, elapsed / anim.durationMs);
        if (anim.progress > 0.15 && anim.progress < 0.85) {
          const destLayout = this.layouts[anim.toIndex];
          if (destLayout && Math.random() < 0.35) {
            const destTube = this.state.tubes[anim.toIndex];
            const liquidHeight = destTube.length / 4 * destLayout.height * 0.82;
            const surfaceY = destLayout.y + destLayout.height - liquidHeight;
            const colorDef = LIQUID_COLORS[anim.color];
            this.splashParticles.push({
              x: destLayout.x + destLayout.width * 0.5 + (Math.random() - 0.5) * (destLayout.width * 0.6),
              y: surfaceY,
              vx: (Math.random() - 0.5) * 3,
              vy: -2 - Math.random() * 2.5,
              size: 1.5 + Math.random() * 2,
              alpha: 0.9,
              color: colorDef ? colorDef.highlight : "#ffffff"
            });
          }
        }
      }
      for (let i = this.splashParticles.length - 1; i >= 0; i--) {
        const p = this.splashParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.alpha -= 0.03;
        if (p.alpha <= 0) {
          this.splashParticles.splice(i, 1);
        }
      }
      for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
        const c = this.confettiParticles[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.2;
        c.rotation += c.vRot;
        c.alpha -= 5e-3;
        if (c.alpha <= 0 || c.y > this.canvas.height / this.dpr + 50) {
          this.confettiParticles.splice(i, 1);
        }
      }
      this.bubbles.forEach((tubeBubbles) => {
        tubeBubbles.forEach((b) => {
          b.y -= b.speed * dt;
          if (b.y < 0) {
            b.y = 1;
            b.x = 0.2 + Math.random() * 0.6;
          }
        });
      });
    }
    render(timestamp) {
      const w = this.canvas.width / this.dpr;
      const h = this.canvas.height / this.dpr;
      if (w <= 0 || h <= 0) return;
      this.ctx.clearRect(0, 0, w, h);
      this.renderCounterSurface(w, h);
      this.calculateTubePositions(timestamp);
      const pourFromIndex = this.state.pourAnimation?.fromIndex ?? -1;
      const pourToIndex = this.state.pourAnimation?.toIndex ?? -1;
      for (const layout of this.layouts) {
        if (layout.index !== pourFromIndex && layout.index !== this.state.selectedTubeIndex) {
          this.renderSingleTube(layout, timestamp);
        }
      }
      if (this.state.selectedTubeIndex !== null && this.state.selectedTubeIndex !== pourFromIndex) {
        const selectedLayout = this.layouts[this.state.selectedTubeIndex];
        if (selectedLayout) {
          this.renderSingleTube(selectedLayout, timestamp);
        }
      }
      if (pourToIndex >= 0) {
        const destLayout = this.layouts[pourToIndex];
        if (destLayout) {
          this.renderSingleTube(destLayout, timestamp);
        }
      }
      if (this.state.pourAnimation) {
        this.renderLiquidStream(timestamp);
      }
      if (pourFromIndex >= 0) {
        const pourLayout = this.layouts[pourFromIndex];
        if (pourLayout) {
          this.renderSingleTube(pourLayout, timestamp);
        }
      }
      this.renderSplashParticles();
      this.renderConfetti();
    }
    renderCounterSurface(w, h) {
      const grad = this.ctx.createLinearGradient(0, h * 0.85, 0, h);
      grad.addColorStop(0, "rgba(226, 232, 240, 0)");
      grad.addColorStop(1, "rgba(203, 213, 225, 0.25)");
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, h * 0.85, w, h * 0.15);
    }
    calculateTubePositions(timestamp) {
      this.tubeVisualOffsets.clear();
      if (this.state.selectedTubeIndex !== null && !this.state.pourAnimation) {
        const floatY = -18 + Math.sin(timestamp * 5e-3) * 3;
        this.tubeVisualOffsets.set(this.state.selectedTubeIndex, { x: 0, y: floatY, rotation: 0 });
      }
      if (this.state.pourAnimation) {
        const anim = this.state.pourAnimation;
        const srcLayout = this.layouts[anim.fromIndex];
        const dstLayout = this.layouts[anim.toIndex];
        if (srcLayout && dstLayout) {
          const p = anim.progress;
          const isPouringRight = dstLayout.x >= srcLayout.x;
          const targetAngle = isPouringRight ? Math.PI * 0.44 : -Math.PI * 0.44;
          let liftProgress = 0;
          let tiltProgress = 0;
          if (p < 0.2) {
            const t = p / 0.2;
            liftProgress = this.easeOutQuad(t);
            tiltProgress = 0;
          } else if (p < 0.8) {
            liftProgress = 1;
            const t = (p - 0.2) / 0.15;
            tiltProgress = Math.min(1, this.easeInOutCubic(Math.min(1, t)));
            if (p > 0.65) {
              const returnT = (p - 0.65) / 0.15;
              tiltProgress = 1 - this.easeInOutCubic(returnT);
            }
          } else {
            const t = (p - 0.8) / 0.2;
            liftProgress = 1 - this.easeInQuad(t);
            tiltProgress = 0;
          }
          const targetMouthX = isPouringRight ? dstLayout.x - srcLayout.width * 0.5 : dstLayout.x + dstLayout.width - srcLayout.width * 0.5;
          const targetMouthY = dstLayout.y - srcLayout.height * 0.65;
          const currentX = (targetMouthX - srcLayout.x) * liftProgress;
          const currentY = (targetMouthY - srcLayout.y) * liftProgress;
          const currentRot = targetAngle * tiltProgress;
          this.tubeVisualOffsets.set(anim.fromIndex, {
            x: currentX,
            y: currentY,
            rotation: currentRot
          });
        }
      }
    }
    renderSingleTube(layout, timestamp) {
      const ctx = this.ctx;
      const isSelected = this.state.selectedTubeIndex === layout.index;
      const isCompleted = this.state.isTubeComplete(layout.index);
      const offset = this.tubeVisualOffsets.get(layout.index) || { x: 0, y: 0, rotation: 0 };
      ctx.save();
      ctx.translate(layout.x + layout.width * 0.5 + offset.x, layout.y + offset.y);
      ctx.rotate(offset.rotation);
      const halfW = layout.width * 0.5;
      const h = layout.height;
      const bottomRadius = halfW;
      if (offset.y > -5 && Math.abs(offset.rotation) < 0.05) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(0, h + 4, halfW * 0.95, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(15, 23, 42, 0.12)";
        ctx.filter = "blur(4px)";
        ctx.fill();
        ctx.restore();
      }
      if (isSelected) {
        ctx.save();
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 18;
        ctx.beginPath();
        this.traceTubePath(ctx, -halfW, 0, layout.width, h, bottomRadius);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
        ctx.lineWidth = 3.5;
        ctx.stroke();
        ctx.restore();
        this.renderSelectedArrow(ctx, 0, -28, timestamp);
      }
      if (isCompleted) {
        ctx.save();
        ctx.shadowColor = "#22c55e";
        ctx.shadowBlur = 12;
        ctx.beginPath();
        this.traceTubePath(ctx, -halfW, 0, layout.width, h, bottomRadius);
        ctx.strokeStyle = "rgba(34, 197, 94, 0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
      ctx.save();
      ctx.beginPath();
      this.traceTubePath(ctx, -halfW, 0, layout.width, h, bottomRadius);
      ctx.fillStyle = "rgba(241, 245, 249, 0.4)";
      ctx.fill();
      ctx.restore();
      this.renderTubeLiquids(ctx, layout, timestamp);
      this.renderGlassOverlays(ctx, -halfW, 0, layout.width, h, bottomRadius, isSelected);
      ctx.restore();
    }
    renderSelectedArrow(ctx, cx, cy, timestamp) {
      const bounce = Math.sin(timestamp * 7e-3) * 4;
      ctx.save();
      ctx.translate(cx, cy + bounce);
      ctx.shadowColor = "rgba(56, 189, 248, 0.8)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(-7, -12);
      ctx.lineTo(7, -12);
      ctx.lineTo(7, -4);
      ctx.lineTo(14, -4);
      ctx.lineTo(0, 8);
      ctx.lineTo(-14, -4);
      ctx.lineTo(-7, -4);
      ctx.closePath();
      const arrowGrad = ctx.createLinearGradient(0, -12, 0, 8);
      arrowGrad.addColorStop(0, "#93c5fd");
      arrowGrad.addColorStop(1, "#3b82f6");
      ctx.fillStyle = arrowGrad;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    }
    renderTubeLiquids(ctx, layout, timestamp) {
      const tube = this.state.tubes[layout.index] || [];
      const anim = this.state.pourAnimation;
      const isPourSource = anim && anim.fromIndex === layout.index;
      const isPourDest = anim && anim.toIndex === layout.index;
      const maxCapacity = 4;
      const halfW = layout.width * 0.5;
      const totalLiquidMaxH = layout.height * 0.84;
      const segmentH = totalLiquidMaxH / maxCapacity;
      const bottomRadius = halfW;
      ctx.save();
      ctx.beginPath();
      this.traceTubeInnerPath(ctx, -halfW + 2, 2, layout.width - 4, layout.height - 2, bottomRadius - 2);
      ctx.clip();
      let segmentsToRender = [...tube];
      let topSegmentPartial = 1;
      if (isPourSource) {
        const streamProgress = Math.max(0, Math.min(1, (anim.progress - 0.25) / 0.45));
        const totalAmountLost = anim.amount * streamProgress;
        const fullLost = Math.floor(totalAmountLost);
        const partialLost = totalAmountLost - fullLost;
        segmentsToRender = tube.slice(0, Math.max(0, tube.length - fullLost));
        topSegmentPartial = 1 - partialLost;
      } else if (isPourDest) {
        const streamProgress = Math.max(0, Math.min(1, (anim.progress - 0.3) / 0.45));
        const totalGained = anim.amount * streamProgress;
        const fullGained = Math.floor(totalGained);
        const partialGained = totalGained - fullGained;
        for (let i = 0; i < fullGained; i++) {
          segmentsToRender.push(anim.color);
        }
        if (partialGained > 0.01) {
          segmentsToRender.push(anim.color);
          topSegmentPartial = partialGained;
        }
      }
      let currentBottomY = layout.height;
      for (let s = 0; s < segmentsToRender.length; s++) {
        const colorId = segmentsToRender[s];
        const colorDef = LIQUID_COLORS[colorId];
        if (!colorDef) continue;
        const isTopSegment = s === segmentsToRender.length - 1;
        const effectiveFactor = isTopSegment ? topSegmentPartial : 1;
        const thisSegH = segmentH * effectiveFactor;
        const segTopY = currentBottomY - thisSegH;
        const grad = ctx.createLinearGradient(-halfW, segTopY, halfW, currentBottomY);
        grad.addColorStop(0, colorDef.gradientTop);
        grad.addColorStop(0.5, colorDef.primary);
        grad.addColorStop(1, colorDef.gradientBottom);
        ctx.fillStyle = grad;
        ctx.fillRect(-halfW, segTopY, layout.width, thisSegH + 1);
        const innerGlow = ctx.createRadialGradient(0, segTopY + thisSegH * 0.5, 2, 0, segTopY + thisSegH * 0.5, halfW);
        innerGlow.addColorStop(0, "rgba(255, 255, 255, 0.15)");
        innerGlow.addColorStop(1, "rgba(0, 0, 0, 0.12)");
        ctx.fillStyle = innerGlow;
        ctx.fillRect(-halfW, segTopY, layout.width, thisSegH + 1);
        const wave = Math.sin(timestamp * 5e-3 + s) * 0.8;
        ctx.beginPath();
        ctx.ellipse(0, segTopY, halfW * 0.9, 3.5 + wave, 0, 0, Math.PI * 2);
        ctx.fillStyle = colorDef.highlight;
        ctx.globalAlpha = 0.55;
        ctx.fill();
        ctx.globalAlpha = 1;
        if (s > 0) {
          ctx.beginPath();
          ctx.ellipse(0, currentBottomY, halfW * 0.85, 2.5, 0, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        currentBottomY = segTopY;
      }
      if (segmentsToRender.length > 0) {
        const tubeBubbles = this.bubbles.get(layout.index) || [];
        const totalLiquidH = layout.height - currentBottomY;
        tubeBubbles.forEach((b) => {
          const bubbleY = currentBottomY + b.y * totalLiquidH;
          const wobble = Math.sin(timestamp * b.wobbleSpeed + b.phase) * b.wobbleAmp * layout.width;
          const bubbleX = -halfW + b.x * layout.width + wobble;
          ctx.beginPath();
          ctx.arc(bubbleX, bubbleY, b.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(bubbleX - b.size * 0.3, bubbleY - b.size * 0.3, b.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fill();
        });
      }
      ctx.restore();
    }
    renderGlassOverlays(ctx, x, y, w, h, r, isSelected) {
      const halfW = w * 0.5;
      ctx.beginPath();
      this.traceTubePath(ctx, x, y, w, h, r);
      ctx.strokeStyle = isSelected ? "rgba(56, 189, 248, 0.85)" : "rgba(203, 213, 225, 0.85)";
      ctx.lineWidth = 2.2;
      ctx.stroke();
      const rimW = w * 1.14;
      const rimH = 8;
      const rimX = -rimW * 0.5;
      const rimY = -3;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(0, 0, rimW * 0.5, rimH * 0.5, 0, 0, Math.PI * 2);
      const rimGrad = ctx.createLinearGradient(rimX, 0, -rimX, 0);
      rimGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
      rimGrad.addColorStop(0.2, "rgba(226, 232, 240, 0.6)");
      rimGrad.addColorStop(0.8, "rgba(203, 213, 225, 0.6)");
      rimGrad.addColorStop(1, "rgba(255, 255, 255, 0.8)");
      ctx.fillStyle = rimGrad;
      ctx.fill();
      ctx.strokeStyle = "rgba(148, 163, 184, 0.8)";
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 0, halfW * 0.85, (rimH - 3) * 0.5, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(100, 116, 139, 0.5)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      const highlightW = Math.max(3, w * 0.08);
      ctx.rect(-halfW + 4, 6, highlightW, h - halfW - 8);
      const highlightGrad = ctx.createLinearGradient(-halfW + 4, 0, -halfW + 4 + highlightW, 0);
      highlightGrad.addColorStop(0, "rgba(255, 255, 255, 0.7)");
      highlightGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
      highlightGrad.addColorStop(1, "rgba(255, 255, 255, 0.3)");
      ctx.fillStyle = highlightGrad;
      ctx.fill();
      ctx.beginPath();
      ctx.rect(halfW - 6, 6, 2, h - halfW - 8);
      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, h - halfW, halfW - 4, Math.PI * 0.25, Math.PI * 0.75);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
    traceTubePath(ctx, x, y, w, h, r) {
      const straightH = h - r;
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + straightH);
      ctx.arc(x + r, y + straightH, r, Math.PI, 0, true);
      ctx.lineTo(x + w, y);
      ctx.closePath();
    }
    traceTubeInnerPath(ctx, x, y, w, h, r) {
      const straightH = Math.max(0, h - r);
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + straightH);
      ctx.arc(x + r, y + straightH, r, Math.PI, 0, true);
      ctx.lineTo(x + w, y);
      ctx.closePath();
    }
    renderLiquidStream(timestamp) {
      const anim = this.state.pourAnimation;
      if (!anim) return;
      const p = anim.progress;
      if (p < 0.22 || p > 0.78) return;
      const srcLayout = this.layouts[anim.fromIndex];
      const dstLayout = this.layouts[anim.toIndex];
      if (!srcLayout || !dstLayout) return;
      const srcOffset = this.tubeVisualOffsets.get(anim.fromIndex) || { x: 0, y: 0, rotation: 0 };
      const isPouringRight = dstLayout.x >= srcLayout.x;
      const spoutLocalX = isPouringRight ? srcLayout.width * 0.48 : -srcLayout.width * 0.48;
      const spoutLocalY = 2;
      const cosR = Math.cos(srcOffset.rotation);
      const sinR = Math.sin(srcOffset.rotation);
      const startX = srcLayout.x + srcLayout.width * 0.5 + srcOffset.x + (spoutLocalX * cosR - spoutLocalY * sinR);
      const startY = srcLayout.y + srcOffset.y + (spoutLocalX * sinR + spoutLocalY * cosR);
      const endX = dstLayout.x + dstLayout.width * 0.5;
      const destTube = this.state.tubes[anim.toIndex] || [];
      const destLiquidH = destTube.length / 4 * dstLayout.height * 0.82;
      const endY = dstLayout.y + dstLayout.height - destLiquidH;
      const colorDef = LIQUID_COLORS[anim.color];
      if (!colorDef) return;
      const ctx = this.ctx;
      ctx.save();
      const streamW = Math.max(4, srcLayout.width * 0.16) + Math.sin(timestamp * 0.02) * 1.5;
      const cp1X = startX + (isPouringRight ? 15 : -15);
      const cp1Y = startY + 25;
      const cp2X = endX + (isPouringRight ? -5 : 5);
      const cp2Y = startY + (endY - startY) * 0.6;
      ctx.shadowColor = colorDef.primary;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
      ctx.strokeStyle = colorDef.stream;
      ctx.lineWidth = streamW;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
      ctx.strokeStyle = colorDef.highlight;
      ctx.lineWidth = streamW * 0.45;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(endX, endY, streamW * 1.4, streamW * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = colorDef.highlight;
      ctx.fill();
      ctx.restore();
    }
    renderSplashParticles() {
      const ctx = this.ctx;
      ctx.save();
      for (const p of this.splashParticles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
      ctx.restore();
    }
    renderConfetti() {
      if (this.confettiParticles.length === 0) return;
      const ctx = this.ctx;
      ctx.save();
      for (const c of this.confettiParticles) {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        ctx.fillStyle = c.color;
        ctx.globalAlpha = c.alpha;
        ctx.fillRect(-c.width * 0.5, -c.height * 0.5, c.width, c.height);
        ctx.restore();
      }
      ctx.restore();
    }
    easeOutQuad(t) {
      return t * (2 - t);
    }
    easeInQuad(t) {
      return t * t;
    }
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
  };

  // water-sort-lab/src/main.ts
  var WaterSortApp = class {
    constructor() {
      this.currentView = "menu";
      this.appContainer = document.getElementById("app");
      this.state = new GameState();
      this.renderCurrentView();
      this.state.setOnChange(() => {
        if (this.currentView === "game") {
          this.updateInGameUI();
        }
      });
    }
    renderCurrentView() {
      if (this.currentView === "menu") {
        this.renderMainMenu();
      } else {
        this.renderGameView();
      }
    }
    // ==========================================
    // MAIN MENU VIEW
    // ==========================================
    renderMainMenu() {
      const save = this.state.loadSave();
      const currentLvlNum = this.state.currentLevelIndex + 1;
      const isSoundOn = sound.isEnabled();
      this.appContainer.innerHTML = `
      <div class="lab-card w-full max-w-md mx-auto p-6 sm:p-8 flex flex-col items-center text-center relative border border-slate-200 overflow-hidden shadow-2xl">
        <!-- Floating bubbles background effect -->
        <div class="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
          <div class="absolute w-24 h-24 rounded-full bg-cyan-200/50 -top-8 -left-8 blur-xl"></div>
          <div class="absolute w-32 h-32 rounded-full bg-purple-200/50 -bottom-10 -right-10 blur-xl"></div>
          <div class="absolute w-16 h-16 rounded-full bg-amber-200/40 top-1/2 -left-6 blur-lg"></div>
        </div>

        <!-- Animated Chemical Flask Mascot -->
        <div class="relative w-28 h-28 sm:w-32 sm:h-32 mb-4 flex items-center justify-center">
          <div class="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 opacity-90 shadow-xl shadow-blue-500/25 animate-soft-pulse"></div>
          <svg class="w-16 h-16 sm:w-20 sm:h-20 text-white relative z-10 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 2v7.31L4.14 20.3A2 2 0 0 0 6 23h12a2 2 0 0 0 1.86-2.7L14 9.31V2" />
            <path d="M8.5 2h7" />
            <path d="M14 9.3a6.5 6.5 0 0 0-4 0" />
            <circle cx="9" cy="17" r="1.5" fill="currentColor" opacity="0.8"/>
            <circle cx="14" cy="18" r="1" fill="currentColor" opacity="0.8"/>
            <circle cx="12" cy="14" r="1.8" fill="currentColor" opacity="0.9"/>
          </svg>
        </div>

        <!-- Game Title & Subtitle in English -->
        <h1 class="font-outfit font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mb-1">
          Water Sort Lab
        </h1>
        <p class="text-sm font-medium text-slate-500 mb-6">
          Liquid Sorting Puzzle
        </p>

        <!-- Player Progress Pill -->
        <div class="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-3 mb-6 flex items-center justify-around text-xs text-slate-600">
          <div>
            <span class="block text-[10px] font-bold uppercase text-slate-400">Current</span>
            <span class="font-outfit font-extrabold text-base text-slate-800">Level ${currentLvlNum}</span>
          </div>
          <div class="w-px h-6 bg-slate-200"></div>
          <div>
            <span class="block text-[10px] font-bold uppercase text-slate-400">Unlocked</span>
            <span class="font-outfit font-extrabold text-base text-blue-600">${save.unlockedLevels} / ${PRESET_LEVELS.length}</span>
          </div>
        </div>

        <!-- Menu Action Buttons -->
        <div class="w-full flex flex-col gap-3">
          <!-- Play / Resume Button -->
          <button id="menu-btn-play" class="btn-tactile w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <span>${this.state.moves > 0 ? "RESUME GAME" : `PLAY LEVEL ${currentLvlNum}`}</span>
          </button>

          <!-- Level Select Button -->
          <button id="menu-btn-levels" class="btn-tactile w-full py-3 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs">
            <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>SELECT LEVEL</span>
          </button>

          <!-- How to Play Button -->
          <button id="menu-btn-tutorial" class="btn-tactile w-full py-3 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs">
            <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>HOW TO PLAY</span>
          </button>

          <!-- Sound Toggle Button -->
          <button id="menu-btn-sound" class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span>Sound: <strong class="${isSoundOn ? "text-blue-600" : "text-slate-400"}">${isSoundOn ? "ON" : "MUTED"}</strong></span>
          </button>
        </div>
      </div>

      <!-- Shared Modal Container -->
      <div id="modal-container" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"></div>
    `;
      this.modalContainer = document.getElementById("modal-container");
      document.getElementById("menu-btn-play").addEventListener("click", () => {
        sound.playGlassTap(1);
        this.currentView = "game";
        this.renderGameView();
      });
      document.getElementById("menu-btn-levels").addEventListener("click", () => {
        sound.playGlassTap(0);
        this.showLevelSelector();
      });
      document.getElementById("menu-btn-tutorial").addEventListener("click", () => {
        sound.playGlassTap(0);
        this.showHowToPlayModal();
      });
      const soundBtn = document.getElementById("menu-btn-sound");
      soundBtn.addEventListener("click", () => {
        sound.toggle();
        this.renderMainMenu();
      });
    }
    // ==========================================
    // IN-GAME VIEW
    // ==========================================
    renderGameView() {
      this.appContainer.innerHTML = `
      <div id="game-card" class="lab-card w-full max-w-4xl mx-auto flex flex-col overflow-hidden relative border border-slate-200">
        
        <!-- Header Bar: Designed strictly to prevent overflow and never hide the sound button on mobile! -->
        <header class="w-full bg-white/95 px-2.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-slate-100 flex items-center justify-between gap-1.5 sm:gap-3 shadow-xs">
          
          <!-- Left Controls: Menu button, App Title (hidden on tiny screens), Level Badge -->
          <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <!-- Back to Menu Button -->
            <button id="btn-back-menu" class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0" title="Main Menu">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </button>

            <!-- Flask Mascot Icon -->
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 hidden xs:flex items-center justify-center text-white shadow-xs shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 2v7.31L4.14 20.3A2 2 0 0 0 6 23h12a2 2 0 0 0 1.86-2.7L14 9.31V2" />
                <path d="M8.5 2h7" />
              </svg>
            </div>

            <!-- Level Selector Pill -->
            <button id="btn-level-badge" class="lab-pill-blue px-2 sm:px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-blue-100 transition-colors cursor-pointer shrink-0" title="Select level">
              LEVEL ${this.state.levelConfig.id}
            </button>
          </div>

          <!-- Right Controls: Moves, Undo, Reset, Sound (ALL shrink-0 to prevent hidden sound button) -->
          <div class="flex items-center gap-1 sm:gap-2.5 shrink-0">
            <!-- Moves counter box -->
            <div class="bg-slate-50 border border-slate-200/80 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 text-center min-w-[50px] sm:min-w-[76px] shadow-xs shrink-0">
              <span class="block text-[8px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider">MOVES</span>
              <span id="moves-counter" class="font-outfit font-extrabold text-sm sm:text-lg text-slate-900 leading-none">0</span>
            </div>

            <!-- UNDO Button -->
            <button id="btn-undo" class="btn-tactile btn-undo px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1 font-bold text-xs sm:text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0" title="Undo Move">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
              </svg>
              <span class="hidden sm:inline">UNDO</span>
            </button>

            <!-- RESET Button -->
            <button id="btn-reset" class="btn-tactile btn-reset px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1 font-bold text-xs sm:text-sm cursor-pointer shrink-0" title="Restart Level">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
              <span class="hidden sm:inline">RESET</span>
            </button>

            <!-- Sound Toggle Button: Always visible on mobile! -->
            <button id="btn-sound" class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0" title="Toggle Sound">
              <svg id="sound-icon" class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
          </div>
        </header>

        <!-- Top Guide Pill -->
        <div class="w-full flex justify-center px-3 pt-3 pb-1">
          <div id="top-message-pill" class="lab-pill px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-700 max-w-xl text-center shadow-xs transition-all">
            Pour liquids to sort each tube by color \u2022 Level ${this.state.levelConfig.id}
          </div>
        </div>

        <!-- HTML5 Canvas Lab Stage Area -->
        <main class="w-full relative flex items-center justify-center px-2 sm:px-4 py-1 min-h-[350px] sm:min-h-[440px]">
          <canvas id="game-canvas" class="block w-full touch-none select-none cursor-pointer"></canvas>
        </main>

        <!-- Bottom Guide Pill -->
        <div class="w-full flex justify-center px-3 py-1.5">
          <div id="bottom-message-pill" class="lab-pill px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 max-w-lg text-center shadow-xs transition-all">
            Tap a test tube to select the top liquid layer
          </div>
        </div>

        <!-- Footer Stats & Actions Bar -->
        <footer class="w-full bg-slate-50/90 px-3 sm:px-6 py-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-600">
          <div class="flex items-center gap-3 sm:gap-6 font-medium">
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Time: <strong id="time-display" class="text-slate-800 font-semibold font-mono">00:00</strong></span>
            </div>

            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Best: <strong id="best-moves-display" class="text-slate-800 font-semibold">-</strong></span>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-1.5 sm:gap-2">
            <!-- Hint Button (Opens Rewarded Ad) -->
            <button id="btn-hint" class="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer" title="Watch short ad to get a hint">
              <span>\u{1F4A1} Hint (Ad)</span>
            </button>

            <!-- Extra Tube Button -->
            <button id="btn-add-tube" class="btn-tactile btn-add-tube px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer" title="Add an extra reservoir tube">
              <span>+1 Tube</span>
            </button>

            <!-- Levels Button -->
            <button id="btn-levels-modal" class="px-2.5 py-1 rounded-lg bg-slate-200/80 text-slate-700 font-semibold hover:bg-slate-300 transition-colors flex items-center gap-1 cursor-pointer">
              <span>Levels</span>
            </button>

            <!-- How to Play Button -->
            <button id="btn-how-to-play" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-200/80 text-slate-700 font-bold hover:bg-slate-300 transition-colors flex items-center justify-center cursor-pointer" title="How to Play Tutorial">
              <span>?</span>
            </button>
          </div>
        </footer>

      </div>

      <!-- Shared Modal Container -->
      <div id="modal-container" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"></div>
    `;
      this.canvas = document.getElementById("game-canvas");
      this.movesEl = document.getElementById("moves-counter");
      this.levelBadgeEl = document.getElementById("btn-level-badge");
      this.topMessageEl = document.getElementById("top-message-pill");
      this.bottomMessageEl = document.getElementById("bottom-message-pill");
      this.timeEl = document.getElementById("time-display");
      this.bestMovesEl = document.getElementById("best-moves-display");
      this.undoBtn = document.getElementById("btn-undo");
      this.resetBtn = document.getElementById("btn-reset");
      this.soundBtn = document.getElementById("btn-sound");
      this.addTubeBtn = document.getElementById("btn-add-tube");
      this.modalContainer = document.getElementById("modal-container");
      this.initCanvas();
      this.attachInGameEvents();
      this.updateInGameUI();
    }
    initCanvas() {
      this.renderer = new CanvasRenderer(this.canvas, this.state);
      this.renderer.resize();
      const ro = new ResizeObserver(() => {
        this.renderer.resize();
      });
      ro.observe(this.canvas.parentElement || document.body);
      window.addEventListener("resize", () => {
        this.renderer.resize();
      });
    }
    attachInGameEvents() {
      const handlePointerAction = (clientX, clientY) => {
        if (this.state.isAnimating || this.state.isWon) return;
        const rect = this.canvas.getBoundingClientRect();
        const canvasX = clientX - rect.left;
        const canvasY = clientY - rect.top;
        const tubeIndex = this.renderer.getTubeAt(canvasX, canvasY);
        if (tubeIndex === null) {
          if (this.state.selectedTubeIndex !== null) {
            this.state.selectedTubeIndex = null;
            sound.playGlassTap(-1);
            this.state.statusMessage = "Tube deselected";
            this.updateInGameUI();
          }
          return;
        }
        this.handleTubeClick(tubeIndex);
      };
      this.canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          handlePointerAction(touch.clientX, touch.clientY);
        }
      }, { passive: false });
      this.canvas.addEventListener("mousedown", (e) => {
        handlePointerAction(e.clientX, e.clientY);
      });
      document.getElementById("btn-back-menu").addEventListener("click", () => {
        sound.stopPouring();
        sound.playGlassTap(0);
        this.currentView = "menu";
        this.renderMainMenu();
      });
      this.undoBtn.addEventListener("click", () => {
        sound.stopPouring();
        if (this.state.undo()) {
          sound.playUndo();
        } else {
          sound.playError();
        }
      });
      this.resetBtn.addEventListener("click", () => {
        sound.stopPouring();
        sound.playGlassTap(2);
        this.state.restartCurrentLevel();
      });
      this.soundBtn.addEventListener("click", () => {
        const isEnabled = sound.toggle();
        this.updateSoundButton(isEnabled);
      });
      this.addTubeBtn.addEventListener("click", () => {
        if (this.state.addExtraTube()) {
          sound.playGlassTap(1);
          this.renderer.resize();
        } else {
          sound.playError();
        }
      });
      document.getElementById("btn-hint").addEventListener("click", () => {
        this.showRewardedAdForHint();
      });
      document.getElementById("btn-levels-modal").addEventListener("click", () => {
        this.showLevelSelector();
      });
      this.levelBadgeEl.addEventListener("click", () => {
        this.showLevelSelector();
      });
      document.getElementById("btn-how-to-play").addEventListener("click", () => {
        this.showHowToPlayModal();
      });
      window.addEventListener("keydown", (e) => {
        if (this.currentView !== "game") return;
        if (e.key === "u" || e.key === "U") {
          this.undoBtn.click();
        } else if (e.key === "r" || e.key === "R") {
          this.resetBtn.click();
        } else if (e.key === "m" || e.key === "M") {
          this.soundBtn.click();
        }
      });
    }
    handleTubeClick(index) {
      if (this.state.selectedTubeIndex === null) {
        const tube = this.state.tubes[index];
        if (!tube || tube.length === 0) {
          sound.playError();
          this.state.statusMessage = "This test tube is empty. Select a tube with liquid!";
          this.updateInGameUI();
          return;
        }
        this.state.selectedTubeIndex = index;
        sound.playGlassTap(1);
        this.state.statusMessage = `Tube ${index + 1} selected. Now tap a destination tube to pour!`;
        this.updateInGameUI();
      } else {
        if (this.state.selectedTubeIndex === index) {
          this.state.selectedTubeIndex = null;
          sound.playGlassTap(0);
          this.state.statusMessage = "Tube deselected";
          this.updateInGameUI();
          return;
        }
        const check = this.state.canPour(this.state.selectedTubeIndex, index);
        if (!check.valid) {
          sound.playError();
          this.state.statusMessage = `Invalid move: ${check.reason || "Colors do not match or tube is full"}`;
          const targetTube = this.state.tubes[index];
          if (targetTube && targetTube.length > 0) {
            this.state.selectedTubeIndex = index;
            sound.playGlassTap(1);
            this.state.statusMessage = `Switched to Tube ${index + 1}. Tap destination tube to pour`;
          } else {
            this.state.selectedTubeIndex = null;
          }
          this.updateInGameUI();
          return;
        }
        const fromIndex = this.state.selectedTubeIndex;
        const toIndex = index;
        const moveResult = this.state.executeMove(fromIndex, toIndex, () => {
          sound.stopPouring();
          sound.playBubble();
          if (this.state.isWon) {
            sound.playWin();
            this.renderer.triggerConfetti();
            setTimeout(() => {
              this.showWinModal();
            }, 800);
          }
        });
        if (moveResult) {
          sound.startPouring(moveResult.duration);
        }
      }
    }
    updateInGameUI() {
      if (this.movesEl) this.movesEl.textContent = String(this.state.moves);
      if (this.levelBadgeEl) this.levelBadgeEl.textContent = `LEVEL ${this.state.levelConfig.id}`;
      if (this.topMessageEl) this.topMessageEl.textContent = `Pour liquids to sort each tube by color \u2022 Level ${this.state.levelConfig.id}`;
      if (this.bottomMessageEl) this.bottomMessageEl.textContent = this.state.statusMessage;
      if (this.timeEl) this.timeEl.textContent = this.state.getFormattedTime();
      const best = this.state.getBestMovesForCurrentLevel();
      if (this.bestMovesEl) this.bestMovesEl.textContent = best !== null ? `${best} moves` : "-";
      if (this.undoBtn) this.undoBtn.disabled = this.state.history.length === 0 || this.state.isAnimating;
      if (this.addTubeBtn) this.addTubeBtn.disabled = this.state.extraTubesAdded >= 2 || this.state.isAnimating;
      this.updateSoundButton(sound.isEnabled());
    }
    updateSoundButton(enabled) {
      if (!this.soundBtn) return;
      if (enabled) {
        this.soundBtn.innerHTML = `
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      `;
      } else {
        this.soundBtn.innerHTML = `
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      `;
      }
    }
    // ==========================================
    // REWARDED AD MODAL FOR HINT
    // ==========================================
    showRewardedAdForHint() {
      let secondsLeft = 5;
      let timerId = null;
      this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-5 sm:p-7 max-w-sm w-full mx-auto shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        <!-- Ad Header Badge -->
        <div class="w-full flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
            Sponsored Ad
          </span>
          <span id="ad-timer-badge" class="text-xs font-mono font-bold text-slate-500">
            Reward in ${secondsLeft}s
          </span>
        </div>

        <!-- Simulated Video Ad Screen -->
        <div class="w-full h-44 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-4 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-inner mb-4">
          <!-- Animated glowing beaker inside ad -->
          <div class="w-14 h-14 rounded-2xl bg-blue-500/20 border border-cyan-400/40 flex items-center justify-center mb-2 animate-pulse">
            <svg class="w-8 h-8 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 2v7.31L4.14 20.3A2 2 0 0 0 6 23h12a2 2 0 0 0 1.86-2.7L14 9.31V2" />
              <path d="M8.5 2h7" />
            </svg>
          </div>
          <span class="font-outfit font-extrabold text-base tracking-wide text-cyan-200">CHEM-TECH PRO</span>
          <span class="text-xs text-slate-300 mt-0.5">High Purity Reagents & Smart Laboratory Glassware</span>
          
          <!-- Progress bar -->
          <div class="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
            <div id="ad-progress-bar" class="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-0 transition-all duration-1000 ease-linear"></div>
          </div>
        </div>

        <!-- Ad Status / Claim Button -->
        <div class="w-full flex flex-col gap-2">
          <button id="ad-claim-btn" disabled class="w-full py-3 bg-slate-200 text-slate-400 font-extrabold text-sm rounded-xl transition-all cursor-not-allowed">
            Watching sponsor ad (${secondsLeft}s)...
          </button>
          <button id="ad-skip-btn" class="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            Skip Ad (No Hint)
          </button>
        </div>
      </div>
    `;
      this.modalContainer.classList.remove("hidden");
      const timerBadge = document.getElementById("ad-timer-badge");
      const progressBar = document.getElementById("ad-progress-bar");
      const claimBtn = document.getElementById("ad-claim-btn");
      const skipBtn = document.getElementById("ad-skip-btn");
      setTimeout(() => {
        progressBar.style.width = "20%";
      }, 50);
      timerId = window.setInterval(() => {
        secondsLeft--;
        const progressPercent = (5 - secondsLeft) / 5 * 100;
        progressBar.style.width = `${progressPercent}%`;
        if (secondsLeft > 0) {
          timerBadge.textContent = `Reward in ${secondsLeft}s`;
          claimBtn.textContent = `Watching sponsor ad (${secondsLeft}s)...`;
        } else {
          if (timerId !== null) clearInterval(timerId);
          timerBadge.textContent = `Ready! \u2705`;
          claimBtn.disabled = false;
          claimBtn.className = "w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-500/25 transition-all cursor-pointer";
          claimBtn.textContent = "Claim Your Free Hint! \u{1F4A1}";
          skipBtn.classList.add("hidden");
        }
      }, 1e3);
      claimBtn.addEventListener("click", () => {
        if (claimBtn.disabled) return;
        this.modalContainer.classList.add("hidden");
        sound.playWin();
        this.executeHintReward();
      });
      skipBtn.addEventListener("click", () => {
        if (timerId !== null) clearInterval(timerId);
        this.modalContainer.classList.add("hidden");
        this.state.statusMessage = "Ad skipped: Hint not unlocked";
        this.updateInGameUI();
      });
    }
    executeHintReward() {
      const hint = this.state.getHint();
      if (hint) {
        this.state.selectedTubeIndex = hint.from;
        this.state.statusMessage = `\u{1F4A1} Hint: Pour from Tube ${hint.from + 1} into Tube ${hint.to + 1}!`;
        this.updateInGameUI();
      } else {
        sound.playError();
        this.state.statusMessage = "No obvious single move. Try Undo or adding an extra tube (+1 Tube)!";
        this.updateInGameUI();
      }
    }
    // ==========================================
    // HOW TO PLAY MODAL
    // ==========================================
    showHowToPlayModal() {
      this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full mx-auto shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div class="flex items-center gap-2">
            <span class="text-xl">\u{1F9EA}</span>
            <h3 class="font-outfit font-extrabold text-xl text-slate-900">How to Play</h3>
          </div>
          <button id="modal-close" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- 3 Illustrated Steps -->
        <div class="flex flex-col gap-3.5 mb-6 text-left">
          <!-- Step 1 -->
          <div class="flex items-start gap-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-outfit font-extrabold flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-900 mb-0.5">Select a Tube</h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                Tap any test tube with liquid. The tube will rise to show it is selected.
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex items-start gap-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div class="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 font-outfit font-extrabold flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-900 mb-0.5">Pour Matching Colors</h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                Tap another tube to pour. You can only pour if the target has room and its top color matches (or the target tube is empty).
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex items-start gap-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-outfit font-extrabold flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-900 mb-0.5">Sort Each Solution</h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                Continue transferring layers until each test tube holds only one uniform color. Sort all colors to clear the level!
              </p>
            </div>
          </div>
        </div>

        <!-- Confirm Button -->
        <button id="modal-got-it" class="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer">
          Got it, Let's Play!
        </button>
      </div>
    `;
      this.modalContainer.classList.remove("hidden");
      const closeModal = () => {
        this.modalContainer.classList.add("hidden");
      };
      document.getElementById("modal-close").addEventListener("click", closeModal);
      document.getElementById("modal-got-it").addEventListener("click", closeModal);
    }
    // ==========================================
    // LEVEL SELECTOR MODAL (PROGRESSIVE UNLOCK)
    // ==========================================
    showLevelSelector() {
      const save = this.state.loadSave();
      const unlocked = save.unlockedLevels;
      let levelButtonsHtml = "";
      const totalPresets = PRESET_LEVELS.length;
      for (let i = 0; i < totalPresets; i++) {
        const lvlId = i + 1;
        const isCurrent = i === this.state.currentLevelIndex;
        const isUnlocked = lvlId <= unlocked;
        const best = save.bestMoves[i];
        levelButtonsHtml += `
        <button data-level="${i}" ${!isUnlocked ? "disabled" : ""} class="p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center relative ${isCurrent ? "bg-blue-50 border-blue-400 text-blue-700 font-bold shadow-xs cursor-pointer" : isUnlocked ? "bg-white border-slate-200 hover:border-blue-300 text-slate-800 cursor-pointer hover:shadow-xs" : "bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed"}">
          <span class="text-[10px] uppercase tracking-wider ${isCurrent ? "text-blue-600" : "text-slate-400"} font-bold">Level</span>
          <span class="font-outfit font-extrabold text-lg sm:text-xl my-0.5">${lvlId}</span>
          <span class="text-[9px] sm:text-[10px] font-medium text-slate-500">
            ${best !== void 0 ? `\u{1F3C6} ${best}` : isUnlocked ? "Unlocked" : "\u{1F512} Locked"}
          </span>
        </button>
      `;
      }
      this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full mx-auto shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div class="flex items-center gap-2">
            <span class="text-xl">\u{1F9EA}</span>
            <h3 class="font-outfit font-extrabold text-xl text-slate-900">Select Level</h3>
          </div>
          <button id="modal-close" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-4 sm:grid-cols-5 gap-2 overflow-y-auto p-1 mb-4 flex-1">
          ${levelButtonsHtml}
        </div>

        <p class="text-xs text-center text-slate-500">
          Complete each level to progressively unlock the next laboratory challenge!
        </p>
      </div>
    `;
      this.modalContainer.classList.remove("hidden");
      document.getElementById("modal-close").addEventListener("click", () => {
        this.modalContainer.classList.add("hidden");
      });
      const btns = this.modalContainer.querySelectorAll("button[data-level]");
      btns.forEach((b) => {
        b.addEventListener("click", (e) => {
          const target = e.currentTarget.getAttribute("data-level");
          if (target !== null) {
            const lvlIdx = parseInt(target, 10);
            sound.playGlassTap(1);
            this.state.loadLevel(lvlIdx);
            this.modalContainer.classList.add("hidden");
            if (this.currentView === "menu") {
              this.currentView = "game";
              this.renderGameView();
            } else {
              this.renderer.resize();
              this.updateInGameUI();
            }
          }
        });
      });
    }
    // ==========================================
    // LEVEL COMPLETE WIN MODAL
    // ==========================================
    showWinModal() {
      const moves = this.state.moves;
      const par = this.state.levelConfig.parMoves;
      const stars = moves <= par ? 3 : moves <= par + 4 ? 2 : 1;
      let starIcons = "";
      for (let i = 1; i <= 3; i++) {
        if (i <= stars) {
          starIcons += `
          <svg class="w-8 h-8 text-amber-400 fill-amber-400 drop-shadow-sm" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        `;
        } else {
          starIcons += `
          <svg class="w-8 h-8 text-slate-200 fill-slate-200" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        `;
        }
      }
      this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full mx-auto text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <svg class="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h2 class="font-outfit font-extrabold text-2xl text-slate-900 mb-1">Level Complete!</h2>
        <p class="text-sm text-slate-500 mb-4">You sorted all chemical solutions perfectly!</p>

        <div class="flex justify-center gap-2 mb-6">
          ${starIcons}
        </div>

        <div class="grid grid-cols-2 gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div class="text-center">
            <span class="block text-xs uppercase text-slate-400 font-bold">Moves</span>
            <span class="font-outfit font-extrabold text-xl text-slate-800">${moves}</span>
          </div>
          <div class="text-center">
            <span class="block text-xs uppercase text-slate-400 font-bold">Time</span>
            <span class="font-outfit font-extrabold text-xl text-slate-800">${this.state.getFormattedTime()}</span>
          </div>
        </div>

        <div class="flex flex-col gap-2.5">
          <button id="modal-btn-next" class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer">
            Next Level
          </button>
          <button id="modal-btn-replay" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all cursor-pointer">
            Play Again
          </button>
          <button id="modal-btn-menu" class="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            Back to Main Menu
          </button>
        </div>
      </div>
    `;
      this.modalContainer.classList.remove("hidden");
      document.getElementById("modal-btn-next").addEventListener("click", () => {
        this.modalContainer.classList.add("hidden");
        sound.playGlassTap(1);
        this.state.nextLevel();
        this.renderer.resize();
      });
      document.getElementById("modal-btn-replay").addEventListener("click", () => {
        this.modalContainer.classList.add("hidden");
        sound.playGlassTap(0);
        this.state.restartCurrentLevel();
      });
      document.getElementById("modal-btn-menu").addEventListener("click", () => {
        this.modalContainer.classList.add("hidden");
        sound.playGlassTap(0);
        this.currentView = "menu";
        this.renderMainMenu();
      });
    }
  };
  window.addEventListener("DOMContentLoaded", () => {
    new WaterSortApp();
  });
})();
