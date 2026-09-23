(() => {
  // number-link-flow/src/levels.ts
  var COLOR_PALETTES = [
    { id: 1, color: "#2563eb", darkColor: "#1d4ed8", lightColor: "#60a5fa", glowColor: "rgba(37, 99, 235, 0.4)" },
    { id: 2, color: "#dc2626", darkColor: "#b91c1c", lightColor: "#f87171", glowColor: "rgba(220, 38, 38, 0.4)" },
    { id: 3, color: "#16a34a", darkColor: "#15803d", lightColor: "#4ade80", glowColor: "rgba(22, 163, 74, 0.4)" },
    { id: 4, color: "#d97706", darkColor: "#b45309", lightColor: "#fbbf24", glowColor: "rgba(217, 119, 6, 0.4)" },
    { id: 5, color: "#7c3aed", darkColor: "#6d28d9", lightColor: "#a78bfa", glowColor: "rgba(124, 58, 237, 0.4)" },
    { id: 6, color: "#ea580c", darkColor: "#c2410c", lightColor: "#fb923c", glowColor: "rgba(234, 88, 12, 0.4)" },
    { id: 7, color: "#854d0e", darkColor: "#713f12", lightColor: "#ca8a04", glowColor: "rgba(133, 77, 14, 0.4)" },
    { id: 8, color: "#0891b2", darkColor: "#0e7490", lightColor: "#22d3ee", glowColor: "rgba(8, 145, 178, 0.4)" },
    { id: 9, color: "#65a30d", darkColor: "#4d7c0f", lightColor: "#a3e635", glowColor: "rgba(101, 163, 13, 0.4)" },
    { id: 10, color: "#78350f", darkColor: "#451a03", lightColor: "#b45309", glowColor: "rgba(120, 53, 15, 0.4)" },
    { id: 11, color: "#0d9488", darkColor: "#0f766e", lightColor: "#2dd4bf", glowColor: "rgba(13, 148, 136, 0.4)" },
    { id: 12, color: "#c026d3", darkColor: "#a21caf", lightColor: "#e879f9", glowColor: "rgba(192, 38, 211, 0.4)" },
    { id: 13, color: "#e11d48", darkColor: "#be123c", lightColor: "#fb7185", glowColor: "rgba(225, 29, 72, 0.4)" },
    { id: 14, color: "#4f46e5", darkColor: "#3730a3", lightColor: "#818cf8", glowColor: "rgba(79, 70, 229, 0.4)" },
    { id: 15, color: "#059669", darkColor: "#047857", lightColor: "#34d399", glowColor: "rgba(5, 150, 105, 0.4)" }
  ];
  function makePair(id, number, startR, startC, endR, endC) {
    const pal = COLOR_PALETTES[(id - 1) % COLOR_PALETTES.length];
    return {
      id,
      number,
      color: pal.color,
      darkColor: pal.darkColor,
      lightColor: pal.lightColor,
      glowColor: pal.glowColor,
      start: { r: startR, c: startC },
      end: { r: endR, c: endC }
    };
  }
  function generateProceduralLevel(id) {
    let size = 5;
    let difficulty = "Beginner";
    let pairCount = 4;
    if (id <= 40) {
      size = 5;
      difficulty = "Beginner";
      pairCount = 4;
    } else if (id <= 60) {
      size = 6;
      difficulty = "Easy";
      pairCount = 5;
    } else if (id <= 80) {
      size = 7;
      difficulty = "Medium";
      pairCount = 6;
    } else if (id <= 100) {
      size = 8;
      difficulty = "Hard";
      pairCount = 8;
    } else {
      size = 9;
      difficulty = "Master";
      pairCount = 10;
    }
    const allCells = [];
    for (let r = 0; r < size; r++) {
      const rowCells = [];
      for (let c = 0; c < size; c++) {
        rowCells.push({ r, c });
      }
      if (r % 2 === 1) {
        rowCells.reverse();
      }
      allCells.push(...rowCells);
    }
    const solution = {};
    const pairs = [];
    const totalCells = allCells.length;
    const baseSegmentSize = Math.floor(totalCells / pairCount);
    let currentIndex = 0;
    for (let i = 1; i <= pairCount; i++) {
      let segLen = baseSegmentSize;
      if (i === pairCount) {
        segLen = totalCells - currentIndex;
      } else {
        if (currentIndex + segLen + 1 < totalCells && Math.random() > 0.5) {
          segLen++;
        }
      }
      const segment = allCells.slice(currentIndex, currentIndex + segLen);
      currentIndex += segLen;
      if (segment.length < 2) {
        if (segment.length === 1 && allCells[currentIndex]) {
          segment.push(allCells[currentIndex]);
          currentIndex++;
        }
      }
      if (segment.length >= 2) {
        const start = segment[0];
        const end = segment[segment.length - 1];
        solution[i] = segment;
        pairs.push(makePair(i, i, start.r, start.c, end.r, end.c));
      }
    }
    return {
      id,
      name: `Procedural #${id}`,
      difficulty,
      size,
      pairs,
      solution
    };
  }
  var STATIC_LEVELS = [
    {
      id: 1,
      name: "Level 1",
      difficulty: "Beginner",
      size: 5,
      pairs: [
        makePair(1, 1, 0, 0, 4, 0),
        makePair(2, 2, 0, 1, 4, 3),
        makePair(3, 3, 0, 4, 4, 4),
        makePair(4, 4, 1, 3, 3, 2)
      ],
      solution: {
        1: [{ r: 0, c: 0 }, { r: 1, c: 0 }, { r: 2, c: 0 }, { r: 3, c: 0 }, { r: 4, c: 0 }],
        2: [{ r: 0, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 1 }, { r: 3, c: 1 }, { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }],
        3: [{ r: 0, c: 4 }, { r: 1, c: 4 }, { r: 2, c: 4 }, { r: 3, c: 4 }, { r: 4, c: 4 }],
        4: [{ r: 1, c: 3 }, { r: 0, c: 3 }, { r: 0, c: 2 }, { r: 1, c: 2 }, { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 3, c: 3 }, { r: 3, c: 2 }]
      }
    }
  ];
  var TOTAL_LEVELS = 1e3;
  function getLevelData(index) {
    if (index < STATIC_LEVELS.length) {
      return STATIC_LEVELS[index];
    }
    const levelId = index + 1;
    return generateProceduralLevel(levelId);
  }
  var LEVELS = new Proxy([], {
    get(_, prop) {
      if (prop === "length") return TOTAL_LEVELS;
      if (typeof prop === "string" && !isNaN(Number(prop))) {
        return getLevelData(Number(prop));
      }
      return Reflect.get(STATIC_LEVELS, prop);
    }
  });

  // number-link-flow/src/audio.ts
  var AudioManager = class {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      const savedMute = localStorage.getItem("number_link_flow_muted");
      if (savedMute !== null) {
        this.isMuted = savedMute === "true";
      }
    }
    initCtx() {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContextClass();
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }
    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem("number_link_flow_muted", String(this.isMuted));
      if (!this.isMuted) {
        this.playTap();
      }
      return this.isMuted;
    }
    playTap() {
      if (this.isMuted) return;
      try {
        this.initCtx();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
      } catch {
      }
    }
    playDrawStep(stepIndex = 0) {
      if (this.isMuted) return;
      try {
        this.initCtx();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const scale = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25, 783.99, 880];
        const freq = scale[stepIndex % scale.length];
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.06);
      } catch {
      }
    }
    playConnect() {
      if (this.isMuted) return;
      try {
        this.initCtx();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const chord = [523.25, 659.25, 783.99, 1046.5];
        chord.forEach((freq, i) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t + i * 0.03);
          gain.gain.setValueAtTime(0.15, t + i * 0.03);
          gain.gain.exponentialRampToValueAtTime(1e-3, t + i * 0.03 + 0.28);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + i * 0.03);
          osc.stop(t + i * 0.03 + 0.3);
        });
      } catch {
      }
    }
    playDisconnect() {
      if (this.isMuted) return;
      try {
        this.initCtx();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.09);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(1e-3, t + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
      } catch {
      }
    }
    playWin() {
      if (this.isMuted) return;
      try {
        this.initCtx();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const notes = [
          { freq: 440, delay: 0 },
          // A4
          { freq: 554.37, delay: 0.09 },
          // C#5
          { freq: 659.25, delay: 0.18 },
          // E5
          { freq: 880, delay: 0.27 },
          // A5
          { freq: 1108.73, delay: 0.4 }
          // C#6
        ];
        notes.forEach(({ freq, delay }) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, t + delay);
          gain.gain.setValueAtTime(0.25, t + delay);
          gain.gain.exponentialRampToValueAtTime(1e-3, t + delay + 0.45);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + delay);
          osc.stop(t + delay + 0.5);
        });
      } catch {
      }
    }
    playHint() {
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
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t + idx * 0.05);
          gain.gain.setValueAtTime(0.18, t + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(1e-3, t + idx * 0.05 + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t + idx * 0.05);
          osc.stop(t + idx * 0.05 + 0.28);
        });
      } catch {
      }
    }
  };
  var audio = new AudioManager();

  // number-link-flow/src/game-state.ts
  var STORAGE_KEY = "number_link_flow_save_v1";
  var GameState = class {
    constructor() {
      this.currentLevelIndex = 0;
      this.level = LEVELS[0];
      // Paths: pairId -> Array of Points from start towards end
      this.paths = /* @__PURE__ */ new Map();
      // History for undo: snapshot of paths
      this.history = [];
      // Active drawing state
      this.isDrawing = false;
      this.activePairId = null;
      this.currentDrawingPath = [];
      // Gameplay metrics
      this.movesCount = 0;
      this.timeElapsed = 0;
      this.isTimerRunning = false;
      this.isLevelWon = false;
      this.timerInterval = null;
      // Saved progress
      this.progress = {
        unlockedLevel: 1,
        stars: {},
        bestTimes: {},
        soundEnabled: true,
        musicEnabled: true
      };
      this.loadProgress();
    }
    loadProgress() {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          this.progress = {
            unlockedLevel: parsed.unlockedLevel || 1,
            stars: parsed.stars || {},
            bestTimes: parsed.bestTimes || {},
            soundEnabled: parsed.soundEnabled !== false,
            musicEnabled: parsed.musicEnabled !== false
          };
        }
      } catch {
      }
    }
    saveProgress() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
      } catch {
      }
    }
    setLevel(levelIndex) {
      if (levelIndex < 0 || levelIndex >= LEVELS.length) return;
      this.currentLevelIndex = levelIndex;
      this.level = LEVELS[levelIndex];
      this.resetLevelState();
    }
    nextLevel() {
      if (this.currentLevelIndex < LEVELS.length - 1) {
        this.setLevel(this.currentLevelIndex + 1);
        return true;
      }
      return false;
    }
    restartLevel() {
      this.resetLevelState();
    }
    resetLevelState() {
      this.paths.clear();
      this.history = [];
      this.isDrawing = false;
      this.activePairId = null;
      this.currentDrawingPath = [];
      this.movesCount = 0;
      this.timeElapsed = 0;
      this.isLevelWon = false;
      this.stopTimer();
      this.startTimer();
      this.notify();
    }
    startTimer() {
      if (this.timerInterval !== null) {
        clearInterval(this.timerInterval);
      }
      this.isTimerRunning = true;
      this.timerInterval = window.setInterval(() => {
        if (this.isTimerRunning && !this.isLevelWon) {
          this.timeElapsed++;
          this.notify();
        }
      }, 1e3);
    }
    stopTimer() {
      this.isTimerRunning = false;
      if (this.timerInterval !== null) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }
    pauseTimer() {
      this.isTimerRunning = false;
    }
    resumeTimer() {
      if (!this.isLevelWon) {
        this.isTimerRunning = true;
      }
    }
    getPair(id) {
      return this.level.pairs.find((p) => p.id === id);
    }
    getPairAt(r, c) {
      for (const pair of this.level.pairs) {
        if (pair.start.r === r && pair.start.c === c) return { pair, isStart: true };
        if (pair.end.r === r && pair.end.c === c) return { pair, isStart: false };
      }
      return null;
    }
    isEndpoint(r, c) {
      return this.getPairAt(r, c) !== null;
    }
    isPointInBounds(r, c) {
      return r >= 0 && r < this.level.size && c >= 0 && c < this.level.size;
    }
    areNeighbors(p1, p2) {
      return Math.abs(p1.r - p2.r) + Math.abs(p1.c - p2.c) === 1;
    }
    // Find which pair owns a path through cell (r, c)
    getPathAt(r, c) {
      for (const [pairId, path] of this.paths.entries()) {
        for (let i = 0; i < path.length; i++) {
          if (path[i].r === r && path[i].c === c) {
            return { pairId, index: i };
          }
        }
      }
      return null;
    }
    saveHistorySnapshot() {
      const snapshot = /* @__PURE__ */ new Map();
      for (const [id, pts] of this.paths.entries()) {
        snapshot.set(id, pts.map((p) => ({ ...p })));
      }
      this.history.push(snapshot);
      if (this.history.length > 25) {
        this.history.shift();
      }
    }
    undo() {
      if (this.history.length === 0 || this.isLevelWon) return false;
      const prev = this.history.pop();
      this.paths = prev;
      audio.playTap();
      this.notify();
      return true;
    }
    // Start dragging from (r, c)
    handlePointerDown(r, c) {
      if (this.isLevelWon || !this.isPointInBounds(r, c)) return;
      this.saveHistorySnapshot();
      const endpointInfo = this.getPairAt(r, c);
      if (endpointInfo) {
        const pair = endpointInfo.pair;
        this.activePairId = pair.id;
        this.isDrawing = true;
        const startPt = endpointInfo.isStart ? pair.start : pair.end;
        this.paths.set(pair.id, [startPt]);
        audio.playDrawStep(0);
        this.notify();
        return;
      }
      const pathInfo = this.getPathAt(r, c);
      if (pathInfo) {
        const pair = this.getPair(pathInfo.pairId);
        if (!pair) return;
        this.activePairId = pair.id;
        this.isDrawing = true;
        const currentPath = this.paths.get(pair.id) || [];
        const truncated = currentPath.slice(0, pathInfo.index + 1);
        this.paths.set(pair.id, truncated);
        audio.playDrawStep(truncated.length);
        this.notify();
        return;
      }
    }
    // Moving across cells
    handlePointerMove(r, c) {
      if (!this.isDrawing || this.activePairId === null || !this.isPointInBounds(r, c) || this.isLevelWon) {
        return;
      }
      const pair = this.getPair(this.activePairId);
      if (!pair) return;
      let path = this.paths.get(pair.id) || [];
      if (path.length === 0) return;
      const lastPt = path[path.length - 1];
      if (lastPt.r === r && lastPt.c === c) return;
      if (!this.areNeighbors(lastPt, { r, c })) {
        return;
      }
      if (path.length >= 2) {
        const secondLast = path[path.length - 2];
        if (secondLast.r === r && secondLast.c === c) {
          path.pop();
          this.paths.set(pair.id, path);
          audio.playDrawStep(path.length);
          this.notify();
          return;
        }
      }
      const selfIdx = path.findIndex((p) => p.r === r && p.c === c);
      if (selfIdx !== -1) {
        path = path.slice(0, selfIdx + 1);
        this.paths.set(pair.id, path);
        audio.playDrawStep(path.length);
        this.notify();
        return;
      }
      const endpointInfo = this.getPairAt(r, c);
      if (endpointInfo && endpointInfo.pair.id !== pair.id) {
        return;
      }
      const conflict = this.getPathAt(r, c);
      if (conflict && conflict.pairId !== pair.id) {
        const otherPath = this.paths.get(conflict.pairId) || [];
        const shortened = otherPath.slice(0, conflict.index);
        if (shortened.length <= 1) {
          this.paths.delete(conflict.pairId);
        } else {
          this.paths.set(conflict.pairId, shortened);
        }
        audio.playDisconnect();
      }
      path.push({ r, c });
      this.paths.set(pair.id, path);
      audio.playDrawStep(path.length);
      if (endpointInfo && endpointInfo.pair.id === pair.id) {
        const isConnected = this.isPairConnected(pair.id);
        if (isConnected) {
          audio.playConnect();
          if (this.onPairConnected) {
            this.onPairConnected(pair, { r, c });
          }
          this.isDrawing = false;
          this.activePairId = null;
          this.movesCount++;
          this.checkWinCondition();
        }
      }
      this.notify();
    }
    // Pointer released
    handlePointerUp() {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.activePairId = null;
        this.movesCount++;
        this.checkWinCondition();
        this.notify();
      }
    }
    isPairConnected(pairId) {
      const pair = this.getPair(pairId);
      if (!pair) return false;
      const path = this.paths.get(pairId);
      if (!path || path.length < 2) return false;
      const first = path[0];
      const last = path[path.length - 1];
      const startsAtStart = first.r === pair.start.r && first.c === pair.start.c && last.r === pair.end.r && last.c === pair.end.c;
      const startsAtEnd = first.r === pair.end.r && first.c === pair.end.c && last.r === pair.start.r && last.c === pair.start.c;
      return startsAtStart || startsAtEnd;
    }
    getConnectedPairsCount() {
      let count = 0;
      for (const pair of this.level.pairs) {
        if (this.isPairConnected(pair.id)) {
          count++;
        }
      }
      return count;
    }
    getFlowCoveragePercentage() {
      const totalCells = this.level.size * this.level.size;
      const filledCells = /* @__PURE__ */ new Set();
      for (const path of this.paths.values()) {
        for (const pt of path) {
          filledCells.add(`${pt.r},${pt.c}`);
        }
      }
      for (const pair of this.level.pairs) {
        filledCells.add(`${pair.start.r},${pair.start.c}`);
        filledCells.add(`${pair.end.r},${pair.end.c}`);
      }
      return Math.min(100, Math.round(filledCells.size / totalCells * 100));
    }
    checkWinCondition() {
      if (this.isLevelWon) return true;
      const allConnected = this.level.pairs.every((p) => this.isPairConnected(p.id));
      const coverage = this.getFlowCoveragePercentage();
      if (allConnected && coverage === 100) {
        this.isLevelWon = true;
        this.stopTimer();
        const targetTime = this.level.size * 10;
        let stars = 3;
        if (this.timeElapsed > targetTime * 2) {
          stars = 1;
        } else if (this.timeElapsed > targetTime * 1.3) {
          stars = 2;
        }
        const prevStars = this.progress.stars[this.level.id] || 0;
        this.progress.stars[this.level.id] = Math.max(prevStars, stars);
        const prevBest = this.progress.bestTimes[this.level.id];
        if (!prevBest || this.timeElapsed < prevBest) {
          this.progress.bestTimes[this.level.id] = this.timeElapsed;
        }
        this.progress.unlockedLevel = Math.max(this.progress.unlockedLevel, this.level.id + 1);
        this.saveProgress();
        audio.playWin();
        if (this.onWin) {
          this.onWin(this.timeElapsed, stars);
        }
        window.parent.postMessage({ type: "win", time: this.timeElapsed }, "*");
        return true;
      }
      return false;
    }
    // Provide a hint for an unsolved pair
    applyHint() {
      if (this.isLevelWon) return false;
      this.saveHistorySnapshot();
      let solvedAny = false;
      for (const pair of this.level.pairs) {
        if (this.isPairConnected(pair.id)) continue;
        let validPath = null;
        if (this.level.solution && this.level.solution[pair.id]) {
          let solPath = [...this.level.solution[pair.id]];
          if (solPath.length >= 2) {
            const first = solPath[0];
            const last = solPath[solPath.length - 1];
            if (first.r === pair.end.r && first.c === pair.end.c && last.r === pair.start.r && last.c === pair.start.c) {
              solPath.reverse();
            } else if (!(first.r === pair.start.r && first.c === pair.start.c && last.r === pair.end.r && last.c === pair.end.c)) {
              solPath = this.findPathForPair(pair) || solPath;
            }
          }
          validPath = solPath;
        } else {
          validPath = this.findPathForPair(pair);
        }
        if (validPath && validPath.length >= 2) {
          for (const pt of validPath) {
            const conf = this.getPathAt(pt.r, pt.c);
            if (conf && conf.pairId !== pair.id) {
              this.paths.delete(conf.pairId);
            }
          }
          this.paths.set(pair.id, validPath);
          solvedAny = true;
        }
      }
      if (solvedAny) {
        audio.playHint();
        this.checkWinCondition();
        this.notify();
        return true;
      }
      return false;
    }
    findPathForPair(pair) {
      const start = pair.start;
      const target = pair.end;
      const queue = [[start]];
      const visited = /* @__PURE__ */ new Set();
      visited.add(`${start.r},${start.c}`);
      const directions = [
        { r: -1, c: 0 },
        { r: 1, c: 0 },
        { r: 0, c: -1 },
        { r: 0, c: 1 }
      ];
      while (queue.length > 0) {
        const path = queue.shift();
        const curr = path[path.length - 1];
        if (curr.r === target.r && curr.c === target.c) {
          return path;
        }
        for (const d of directions) {
          const nr = curr.r + d.r;
          const nc = curr.c + d.c;
          const key = `${nr},${nc}`;
          if (!this.isPointInBounds(nr, nc) || visited.has(key)) continue;
          const ep = this.getPairAt(nr, nc);
          if (ep && ep.pair.id !== pair.id) continue;
          visited.add(key);
          queue.push([...path, { r: nr, c: nc }]);
        }
      }
      return null;
    }
    notify() {
      if (this.onStateChange) {
        this.onStateChange();
      }
    }
  };

  // number-link-flow/src/display.ts
  var DisplayManager = class {
    constructor(canvas) {
      this.dpr = 1;
      this.cssWidth = 300;
      this.cssHeight = 300;
      this.currentMetrics = {
        boardX: 0,
        boardY: 0,
        boardSize: 300,
        cellSize: 60,
        gridPadding: 16,
        cssWidth: 300,
        cssHeight: 300
      };
      this.gridSize = 5;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: true });
      const observer = new ResizeObserver(() => this.resize());
      if (this.canvas.parentElement) {
        observer.observe(this.canvas.parentElement);
      }
      setTimeout(() => this.resize(), 10);
    }
    setGridSize(size) {
      this.gridSize = size;
      this.recalculateMetrics();
    }
    resize() {
      if (!this.canvas.parentElement) return;
      const parentRect = this.canvas.parentElement.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.cssWidth = Math.max(280, Math.floor(parentRect.width));
      this.cssHeight = Math.max(280, Math.floor(parentRect.height));
      this.canvas.width = Math.floor(this.cssWidth * this.dpr);
      this.canvas.height = Math.floor(this.cssHeight * this.dpr);
      this.canvas.style.width = `${this.cssWidth}px`;
      this.canvas.style.height = `${this.cssHeight}px`;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);
      this.recalculateMetrics();
    }
    recalculateMetrics() {
      const minDim = Math.min(this.cssWidth, this.cssHeight);
      const gridPadding = Math.max(12, Math.min(24, minDim * 0.04));
      const available = Math.min(minDim - gridPadding * 2, 560);
      const boardSize = Math.floor(available);
      const cellSize = boardSize / this.gridSize;
      const boardX = Math.floor((this.cssWidth - boardSize) / 2);
      const boardY = Math.floor((this.cssHeight - boardSize) / 2);
      this.currentMetrics = {
        boardX,
        boardY,
        boardSize,
        cellSize,
        gridPadding,
        cssWidth: this.cssWidth,
        cssHeight: this.cssHeight
      };
      if (this.onResizeCallback) {
        this.onResizeCallback(this.currentMetrics);
      }
    }
    getContext() {
      return this.ctx;
    }
    getGameCoordinates(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
    screenToGrid(clientX, clientY) {
      const coords = this.getGameCoordinates(clientX, clientY);
      const { boardX, boardY, cellSize } = this.currentMetrics;
      const localX = coords.x - boardX;
      const localY = coords.y - boardY;
      if (localX < 0 || localY < 0) return null;
      const c = Math.floor(localX / cellSize);
      const r = Math.floor(localY / cellSize);
      if (r >= 0 && r < this.gridSize && c >= 0 && c < this.gridSize) {
        return { r, c };
      }
      return null;
    }
    gridToScreenCenter(r, c) {
      const { boardX, boardY, cellSize } = this.currentMetrics;
      return {
        x: boardX + c * cellSize + cellSize / 2,
        y: boardY + r * cellSize + cellSize / 2
      };
    }
  };

  // number-link-flow/src/renderer.ts
  var GameRenderer = class {
    constructor(display, state) {
      this.particles = [];
      this.animId = null;
      this.pulseTime = 0;
      this.display = display;
      this.state = state;
    }
    start() {
      if (this.animId !== null) return;
      const loop = () => {
        this.updateAndRender();
        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    }
    stop() {
      if (this.animId !== null) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }
    spawnSparkles(x, y, color, count = 18) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4.5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: 3 + Math.random() * 5,
          color,
          alpha: 1,
          life: 0,
          maxLife: 30 + Math.random() * 25,
          shape: Math.random() > 0.4 ? "star" : "circle"
        });
      }
    }
    spawnWinCelebration() {
      const { cssWidth, cssHeight } = this.display.currentMetrics;
      const colors = ["#2563eb", "#dc2626", "#16a34a", "#d97706", "#7c3aed", "#0891b2", "#c026d3", "#fbbf24"];
      for (let i = 0; i < 90; i++) {
        this.particles.push({
          x: cssWidth * (0.2 + Math.random() * 0.6),
          y: cssHeight * (0.2 + Math.random() * 0.6),
          vx: (Math.random() - 0.5) * 8,
          vy: -2 - Math.random() * 7,
          size: 4 + Math.random() * 7,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          life: 0,
          maxLife: 60 + Math.random() * 40,
          shape: Math.random() > 0.5 ? "square" : "star"
        });
      }
    }
    updateParticles() {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.vx *= 0.98;
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        if (p.life >= p.maxLife) {
          this.particles.splice(i, 1);
        }
      }
    }
    updateAndRender() {
      this.pulseTime += 0.04;
      this.updateParticles();
      const ctx = this.display.getContext();
      const { cssWidth, cssHeight, boardX, boardY, boardSize, cellSize } = this.display.currentMetrics;
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      this.drawBoardBackground(ctx, boardX, boardY, boardSize, cellSize);
      this.drawPipes(ctx, boardX, boardY, cellSize);
      this.drawEndpoints(ctx, boardX, boardY, cellSize);
      this.drawParticles(ctx);
    }
    drawBoardBackground(ctx, bx, by, size, cellSize) {
      const gridSize = this.state.level.size;
      const cornerRadius = 18;
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.06)";
      ctx.shadowBlur = 16;
      ctx.shadowOffsetY = 6;
      ctx.fillStyle = "#f8fafc";
      this.roundRect(ctx, bx, by, size, size, cornerRadius);
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      this.roundRect(ctx, bx, by, size, size, cornerRadius);
      ctx.stroke();
      ctx.restore();
      const inset = Math.max(2, Math.floor(cellSize * 0.06));
      const cellRadius = Math.max(6, Math.floor(cellSize * 0.18));
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const cx = bx + c * cellSize + inset;
          const cy = by + r * cellSize + inset;
          const cw = cellSize - inset * 2;
          const ch = cellSize - inset * 2;
          const cellGrad = ctx.createLinearGradient(cx, cy, cx, cy + ch);
          cellGrad.addColorStop(0, "#f1f5f9");
          cellGrad.addColorStop(1, "#e2e8f0");
          ctx.fillStyle = cellGrad;
          this.roundRect(ctx, cx, cy, cw, ch, cellRadius);
          ctx.fill();
          ctx.strokeStyle = "#cbd5e1";
          ctx.lineWidth = 1;
          this.roundRect(ctx, cx, cy, cw, ch, cellRadius);
          ctx.stroke();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx + cellRadius, cy + 1);
          ctx.lineTo(cx + cw - cellRadius, cy + 1);
          ctx.stroke();
        }
      }
    }
    drawPipes(ctx, bx, by, cellSize) {
      const pipeWidth = Math.max(10, Math.floor(cellSize * 0.36));
      for (const pair of this.state.level.pairs) {
        const path = this.state.paths.get(pair.id);
        if (!path || path.length < 1) continue;
        const isConnected = this.state.isPairConnected(pair.id);
        const isDrawingThis = this.state.activePairId === pair.id;
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = pipeWidth + 4;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
        ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
          const pt = path[i];
          const px = bx + pt.c * cellSize + cellSize / 2;
          const py = by + pt.r * cellSize + cellSize / 2 + 2;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = pipeWidth;
        ctx.strokeStyle = pair.color;
        ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
          const pt = path[i];
          const px = bx + pt.c * cellSize + cellSize / 2;
          const py = by + pt.r * cellSize + cellSize / 2;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = Math.max(3, Math.floor(pipeWidth * 0.32));
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.beginPath();
        for (let i = 0; i < path.length; i++) {
          const pt = path[i];
          const px = bx + pt.c * cellSize + cellSize / 2;
          const py = by + pt.r * cellSize + cellSize / 2 - pipeWidth * 0.15;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();
        const jointRadius = Math.floor(pipeWidth * 0.38);
        for (let i = 1; i < path.length - 1; i++) {
          const pt = path[i];
          const jx = bx + pt.c * cellSize + cellSize / 2;
          const jy = by + pt.r * cellSize + cellSize / 2;
          ctx.save();
          ctx.fillStyle = pair.lightColor;
          ctx.beginPath();
          ctx.arc(jx, jy, jointRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.beginPath();
          ctx.arc(jx - 1, jy - 1, jointRadius * 0.45, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        if (isDrawingThis && path.length > 0) {
          const head = path[path.length - 1];
          const hx = bx + head.c * cellSize + cellSize / 2;
          const hy = by + head.r * cellSize + cellSize / 2;
          const pulseR = pipeWidth * 0.65 + Math.sin(this.pulseTime * 5) * 2;
          ctx.save();
          ctx.strokeStyle = pair.lightColor;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(hx, hy, pulseR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    drawEndpoints(ctx, bx, by, cellSize) {
      const nodeRadius = Math.max(14, Math.floor(cellSize * 0.34));
      for (const pair of this.state.level.pairs) {
        const isConnected = this.state.isPairConnected(pair.id);
        this.renderSingleNode(ctx, pair.start, pair, bx, by, cellSize, nodeRadius, isConnected);
        this.renderSingleNode(ctx, pair.end, pair, bx, by, cellSize, nodeRadius, isConnected);
      }
    }
    renderSingleNode(ctx, pt, pair, bx, by, cellSize, r, isConnected) {
      const cx = bx + pt.c * cellSize + cellSize / 2;
      const cy = by + pt.r * cellSize + cellSize / 2;
      ctx.save();
      ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
      ctx.beginPath();
      ctx.ellipse(cx, cy + r * 0.35, r * 0.95, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      if (isConnected) {
        const glowR = r + 3 + Math.sin(this.pulseTime * 4) * 1.5;
        ctx.save();
        ctx.strokeStyle = pair.lightColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      const nodeGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
      nodeGrad.addColorStop(0, pair.lightColor);
      nodeGrad.addColorStop(0.35, pair.color);
      nodeGrad.addColorStop(1, pair.darkColor);
      ctx.save();
      ctx.fillStyle = nodeGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
      ctx.beginPath();
      ctx.ellipse(cx - r * 0.3, cy - r * 0.35, r * 0.4, r * 0.22, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.save();
      const fontSize = Math.max(12, Math.floor(r * 1.05));
      ctx.font = `800 ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(String(pair.number), cx, cy + 0.5);
      ctx.restore();
    }
    drawParticles(ctx) {
      for (const p of this.particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        if (p.shape === "star") {
          this.drawStar(ctx, p.x, p.y, 4, p.size, p.size * 0.4);
        } else if (p.shape === "square") {
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }
    drawStar(ctx, cx, cy, spikes, outerR, innerR) {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;
      ctx.beginPath();
      ctx.moveTo(cx, cy - outerR);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerR;
        y = cy + Math.sin(rot) * outerR;
        ctx.lineTo(x, y);
        rot += step;
        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerR);
      ctx.closePath();
      ctx.fill();
    }
    roundRect(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
  };

  // number-link-flow/src/screen-manager.ts
  var ScreenManager = class {
    constructor(state) {
      this.currentScreen = "MAIN_MENU";
      // Hint ad countdown state
      this.hintCountdown = 5;
      this.hintInterval = null;
      this.state = state;
      this.initDOM();
      this.bindEvents();
    }
    setScreen(screen) {
      this.currentScreen = screen;
      this.updateScreenVisibility();
      if (screen === "PLAYING") {
        this.state.resumeTimer();
        if (this.onResizeNeeded) {
          setTimeout(() => this.onResizeNeeded?.(), 50);
        }
      } else {
        this.state.pauseTimer();
      }
    }
    initDOM() {
      const root = document.getElementById("root");
      if (!root) return;
      root.innerHTML = `
      <div id="game-stage" class="w-full max-w-4xl h-[100dvh] sm:h-[94vh] sm:max-h-[860px] mx-auto flex flex-col relative overflow-hidden bg-slate-900 text-slate-100 sm:rounded-3xl shadow-2xl border border-slate-800">
        
        <!-- ================= MAIN MENU SCREEN ================= -->
        <div id="screen-main-menu" class="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950">
          <!-- Top Bar in Menu -->
          <div class="w-full flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 text-xs font-black tracking-wider uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                PUZZLE LOGIC
              </span>
            </div>
            <button id="menu-btn-sound" class="btn-tactile w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white" title="Toggle Sound">
              <svg id="menu-icon-sound" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
          </div>

          <!-- Logo & Hero graphic -->
          <div class="flex flex-col items-center text-center my-auto">
            <div class="relative mb-6">
              <!-- Decorative Flow Circuit Graphic -->
              <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 p-1 shadow-xl shadow-blue-500/20 flex items-center justify-center relative">
                <div class="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center p-3 relative overflow-hidden">
                  <div class="absolute inset-0 bg-blue-500/10 backdrop-blur-sm"></div>
                  <!-- Circuit nodes simulation -->
                  <div class="relative w-full h-full flex items-center justify-center">
                    <div class="w-10 h-10 rounded-full bg-blue-500 text-white font-black text-lg flex items-center justify-center shadow-lg border-2 border-white/40 animate-pulse">1</div>
                    <div class="w-8 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <div class="w-10 h-10 rounded-full bg-purple-600 text-white font-black text-lg flex items-center justify-center shadow-lg border-2 border-white/40 animate-pulse">2</div>
                  </div>
                </div>
              </div>
            </div>

            <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 mb-2">
              NUMBER LINK FLOW
            </h1>
            <p class="text-xs sm:text-sm text-slate-400 max-w-xs sm:max-w-md">
              Connect matching colored numbers. Fill 100% of the grid without crossing pipes.
            </p>
          </div>

          <!-- Menu Buttons Action Stack -->
          <div class="w-full max-w-xs flex flex-col gap-3">
            <button id="btn-menu-play" class="btn-tactile w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              <span id="menu-play-text">PLAY LEVEL 1</span>
            </button>

            <button id="btn-menu-levels" class="btn-tactile w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2">
              <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>LEVEL SELECT</span>
            </button>

            <button id="btn-menu-rules" class="btn-tactile w-full py-3 px-6 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 font-bold text-sm flex items-center justify-center gap-2">
              <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>HOW TO PLAY</span>
            </button>
          </div>

          <!-- Footer version tag -->
          <div class="text-[11px] text-slate-500 mt-4">
            Number Link Flow \u2022 Logic Puzzle Game
          </div>
        </div>


        <!-- ================= GAMEPLAY SCREEN ================= -->
        <div id="screen-gameplay" class="absolute inset-0 z-20 flex flex-col hidden bg-slate-900">
          
          <!-- TOP HEADER HUD (Universal Responsive Bar) -->
          <header class="w-full h-14 bg-slate-900/95 px-2.5 sm:px-5 border-b border-slate-800 flex items-center justify-between gap-1.5 shrink-0 z-10 backdrop-blur-md">
            
            <!-- Left Block: Back / Level Badge -->
            <div class="flex items-center gap-1.5 shrink-0">
              <button id="btn-hud-back" class="btn-tactile w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 active:scale-95 text-slate-300 hover:text-white" title="Main Menu">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              
              <div id="hud-level-badge" class="px-2.5 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0 uppercase tracking-wide">
                LEVEL 1
              </div>
            </div>

            <!-- Right Block: Metrics & Quick Controls -->
            <div class="flex items-center gap-1 sm:gap-2 shrink-0">
              
              <!-- Pairs Counter -->
              <div class="bg-slate-800 border border-slate-700 rounded-lg px-2 sm:px-3 py-0.5 text-center min-w-[54px] shrink-0">
                <span class="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">PAIRS</span>
                <span id="hud-pairs-counter" class="font-black text-xs sm:text-sm text-cyan-400 leading-none">0/4</span>
              </div>

              <!-- Stars Counter -->
              <div class="bg-slate-800 border border-slate-700 rounded-lg px-2 sm:px-3 py-0.5 text-center min-w-[50px] shrink-0">
                <span class="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">STARS</span>
                <span id="hud-stars-counter" class="font-black text-xs sm:text-sm text-amber-400 leading-none">\u2605\u2605\u2605</span>
              </div>

              <!-- Timer Counter -->
              <div class="bg-slate-800 border border-slate-700 rounded-lg px-2 sm:px-3 py-0.5 text-center min-w-[50px] shrink-0">
                <span class="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">TIME</span>
                <span id="hud-timer-counter" class="font-black text-xs sm:text-sm text-slate-200 leading-none font-mono">00:00</span>
              </div>

              <!-- Sound Toggle Button -->
              <button id="btn-hud-sound" class="btn-tactile w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300 hover:text-white" title="Toggle Sound">
                <svg id="hud-icon-sound" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>

              <!-- Pause / Settings Button -->
              <button id="btn-hud-pause" class="btn-tactile w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300 hover:text-white" title="Pause Menu">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </header>

          <!-- SUB-BAR: FLOW COVERAGE METER -->
          <div class="w-full px-4 py-1.5 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-xs shrink-0">
            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-semibold text-[11px]">Grid Flow:</span>
              <span id="hud-coverage-text" class="font-extrabold text-blue-400 font-mono">0%</span>
            </div>
            <div class="w-36 sm:w-48 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div id="hud-coverage-bar" class="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-300 w-0"></div>
            </div>
            <div id="hud-difficulty-tag" class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              5x5
            </div>
          </div>

          <!-- CANVAS PLAYING STAGE (Flex-1 central area) -->
          <div id="canvas-container" class="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-2 sm:p-4 bg-slate-900/50">
            <canvas id="game-canvas" class="touch-none cursor-pointer block"></canvas>
          </div>

          <!-- FOOTER HUD: CONTROLS & STATUS -->
          <footer class="w-full h-16 bg-slate-900/95 px-3 sm:px-6 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0 z-10">
            <!-- Hint Button with Rewarded Ad Indicator -->
            <button id="btn-hud-hint" class="btn-tactile px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600/30 to-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 hover:bg-amber-500/30">
              <svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>HINT</span>
              <span class="text-[9px] font-black bg-amber-400 text-slate-950 px-1 rounded uppercase">AD</span>
            </button>

            <!-- Center Status / Solved Pill -->
            <div id="hud-status-pill" class="px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5 shrink-0">
              <span id="hud-status-text">CONNECT ALL PAIRS</span>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <!-- Undo Button -->
              <button id="btn-hud-undo" class="btn-tactile px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 shrink-0 hover:bg-slate-700" title="Undo Move">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span class="hidden sm:inline">UNDO</span>
              </button>

              <!-- Reset Button -->
              <button id="btn-hud-reset" class="btn-tactile px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 shrink-0 hover:bg-slate-700" title="Reset Level">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span class="hidden sm:inline">RESET</span>
              </button>
            </div>
          </footer>
        </div>


        <!-- ================= LEVEL SELECT SCREEN ================= -->
        <div id="screen-level-select" class="absolute inset-0 z-30 flex flex-col hidden bg-slate-900 p-4 sm:p-6 overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4 shrink-0">
            <button id="btn-levels-back" class="btn-tactile w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 class="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              SELECT LEVEL
            </h2>
            <div class="w-10"></div>
          </div>

          <!-- Difficulty Filters -->
          <div id="level-filter-bar" class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 shrink-0">
            <button data-filter="ALL" class="level-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shrink-0">ALL</button>
            <button data-filter="Beginner" class="level-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white shrink-0">5x5 Beginner</button>
            <button data-filter="Easy" class="level-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white shrink-0">6x6 Easy</button>
            <button data-filter="Medium" class="level-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white shrink-0">7x7 Medium</button>
            <button data-filter="Hard" class="level-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white shrink-0">8x8 Hard</button>
            <button data-filter="Master" class="level-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white shrink-0">9x9 Master</button>
          </div>

          <!-- Level Grid Container -->
          <div id="levels-grid-container" class="flex-1 overflow-y-auto pr-1 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5 sm:gap-3.5 pb-6">
            <!-- Populated dynamically -->
          </div>
        </div>


        <!-- ================= HOW TO PLAY SCREEN ================= -->
        <div id="screen-how-to-play" class="absolute inset-0 z-30 flex flex-col hidden bg-slate-900 p-4 sm:p-6 overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4 shrink-0">
            <button id="btn-rules-back" class="btn-tactile w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 class="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              HOW TO PLAY
            </h2>
            <div class="w-10"></div>
          </div>

          <!-- 3 Visual Step Cards (Universal Manual Requirement) -->
          <div class="flex-1 flex flex-col gap-4 max-w-lg mx-auto w-full justify-center">
            
            <!-- Card 1 -->
            <div class="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-black text-lg shrink-0">
                1
              </div>
              <div>
                <h3 class="font-black text-sm sm:text-base text-slate-100 mb-1">CONNECT MATCHING PAIRS</h3>
                <p class="text-xs sm:text-sm text-slate-400">
                  Touch and drag from any numbered circle to connect it with its matching colored number.
                </p>
              </div>
            </div>

            <!-- Card 2 -->
            <div class="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-black text-lg shrink-0">
                2
              </div>
              <div>
                <h3 class="font-black text-sm sm:text-base text-slate-100 mb-1">AVOID CROSSING PIPES</h3>
                <p class="text-xs sm:text-sm text-slate-400">
                  Paths cannot intersect or cross over each other. Crossing another line will cut or disconnect it.
                </p>
              </div>
            </div>

            <!-- Card 3 -->
            <div class="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-lg shrink-0">
                3
              </div>
              <div>
                <h3 class="font-black text-sm sm:text-base text-slate-100 mb-1">FILL 100% OF THE GRID</h3>
                <p class="text-xs sm:text-sm text-slate-400">
                  To win the level, all pairs must be connected AND every single square on the board must be filled with flow!
                </p>
              </div>
            </div>

            <button id="btn-rules-start" class="btn-tactile w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm mt-2">
              GOT IT! LET'S PLAY
            </button>
          </div>
        </div>


        <!-- ================= REWARDED AD HINT MODAL ================= -->
        <div id="modal-hint-ad" class="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 hidden">
          <div class="w-full max-w-sm rounded-3xl bg-slate-800 border border-slate-700 p-6 flex flex-col items-center text-center shadow-2xl relative">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>

            <h3 class="text-lg font-black text-slate-100 mb-1">SPONSORED HINT</h3>
            <p class="text-xs text-slate-400 mb-4">
              Watch this 5-second simulated sponsor ad to reveal a free solution link.
            </p>

            <!-- Video Simulation Box -->
            <div class="w-full h-24 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center p-3 mb-4 relative overflow-hidden">
              <div class="text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>SPONSOR VIDEO PLAYING</span>
              </div>
              <div id="ad-countdown-text" class="text-lg font-black text-amber-400 font-mono">5s remaining</div>
              
              <!-- Ad Progress Bar -->
              <div class="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div id="ad-progress-bar" class="h-full bg-amber-400 w-0 transition-all duration-1000"></div>
              </div>
            </div>

            <!-- Action Buttons -->
            <button id="btn-ad-claim" disabled class="btn-tactile w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-sm disabled:opacity-40 disabled:cursor-not-allowed mb-2 flex items-center justify-center gap-1.5">
              <span>CLAIM FREE HINT</span>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </button>

            <button id="btn-ad-close" class="text-xs text-slate-400 hover:text-slate-200 py-1">
              Skip / Cancel
            </button>
          </div>
        </div>


        <!-- ================= PAUSE / SETTINGS MODAL ================= -->
        <div id="modal-pause" class="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 hidden">
          <div class="w-full max-w-xs rounded-3xl bg-slate-800 border border-slate-700 p-6 flex flex-col items-center text-center shadow-2xl">
            <h3 class="text-xl font-black text-slate-100 mb-4">GAME PAUSED</h3>
            
            <div class="w-full flex flex-col gap-2.5">
              <button id="btn-pause-resume" class="btn-tactile w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm">
                RESUME
              </button>
              <button id="btn-pause-restart" class="btn-tactile w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm">
                RESTART LEVEL
              </button>
              <button id="btn-pause-sound" class="btn-tactile w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm flex items-center justify-center gap-2">
                <span>SOUND FX:</span>
                <span id="pause-sound-status" class="text-cyan-400 font-black">ON</span>
              </button>
              <button id="btn-pause-levels" class="btn-tactile w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm">
                LEVEL SELECT
              </button>
              <button id="btn-pause-menu" class="btn-tactile w-full py-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold text-xs">
                MAIN MENU
              </button>
            </div>
          </div>
        </div>


        <!-- ================= VICTORY MODAL BANNER ================= -->
        <div id="modal-victory" class="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 hidden">
          <div class="w-full max-w-sm rounded-3xl bg-slate-800 border border-slate-700 p-6 flex flex-col items-center text-center shadow-2xl">
            <div class="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3 animate-bounce">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 mb-1">
              LEVEL COMPLETED!
            </h3>
            
            <div id="victory-stars" class="text-3xl text-amber-400 tracking-widest my-2">
              \u2605\u2605\u2605
            </div>

            <div class="w-full bg-slate-900/80 rounded-2xl p-3 border border-slate-700/60 my-3 flex justify-around text-xs">
              <div>
                <span class="block text-slate-400 font-semibold">TIME</span>
                <span id="victory-time-text" class="font-black text-sm text-slate-100 font-mono">00:24</span>
              </div>
              <div class="w-[1px] bg-slate-700"></div>
              <div>
                <span class="block text-slate-400 font-semibold">GRID FLOW</span>
                <span class="font-black text-sm text-emerald-400 font-mono">100%</span>
              </div>
            </div>

            <div class="w-full flex flex-col gap-2.5 mt-2">
              <button id="btn-victory-next" class="btn-tactile w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30">
                NEXT LEVEL
              </button>
              <button id="btn-victory-replay" class="btn-tactile w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs">
                REPLAY
              </button>
              <button id="btn-victory-levels" class="btn-tactile w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold text-xs">
                LEVEL SELECT
              </button>
            </div>
          </div>
        </div>

      </div>
    `;
      this.renderLevelGrid("ALL");
    }
    bindEvents() {
      document.getElementById("btn-menu-play")?.addEventListener("click", () => {
        audio.playTap();
        const currentUnlocked = this.state.progress.unlockedLevel;
        const targetIdx = Math.min(currentUnlocked - 1, LEVELS.length - 1);
        this.state.setLevel(targetIdx);
        this.setScreen("PLAYING");
      });
      document.getElementById("btn-menu-levels")?.addEventListener("click", () => {
        audio.playTap();
        this.renderLevelGrid("ALL");
        this.setScreen("LEVEL_SELECT");
      });
      document.getElementById("btn-menu-rules")?.addEventListener("click", () => {
        audio.playTap();
        this.setScreen("HOW_TO_PLAY");
      });
      const toggleSoundFn = () => {
        const isMuted = audio.toggleMute();
        this.updateSoundIcons(isMuted);
      };
      document.getElementById("menu-btn-sound")?.addEventListener("click", toggleSoundFn);
      document.getElementById("btn-hud-sound")?.addEventListener("click", toggleSoundFn);
      document.getElementById("btn-hud-back")?.addEventListener("click", () => {
        audio.playTap();
        this.setScreen("MAIN_MENU");
      });
      document.getElementById("btn-hud-pause")?.addEventListener("click", () => {
        audio.playTap();
        this.openPauseModal();
      });
      document.getElementById("btn-hud-undo")?.addEventListener("click", () => {
        this.state.undo();
      });
      document.getElementById("btn-hud-reset")?.addEventListener("click", () => {
        audio.playTap();
        this.state.restartLevel();
      });
      document.getElementById("btn-hud-hint")?.addEventListener("click", () => {
        audio.playTap();
        this.openHintModal();
      });
      document.getElementById("btn-levels-back")?.addEventListener("click", () => {
        audio.playTap();
        this.setScreen("MAIN_MENU");
      });
      const filterBtns = document.querySelectorAll(".level-filter-btn");
      filterBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const filter = e.currentTarget.dataset.filter || "ALL";
          filterBtns.forEach((b) => {
            b.classList.remove("bg-blue-600", "text-white");
            b.classList.add("bg-slate-800", "text-slate-400");
          });
          e.currentTarget.classList.remove("bg-slate-800", "text-slate-400");
          e.currentTarget.classList.add("bg-blue-600", "text-white");
          this.renderLevelGrid(filter);
          audio.playTap();
        });
      });
      document.getElementById("btn-rules-back")?.addEventListener("click", () => {
        audio.playTap();
        this.setScreen("MAIN_MENU");
      });
      document.getElementById("btn-rules-start")?.addEventListener("click", () => {
        audio.playTap();
        this.setScreen("PLAYING");
      });
      document.getElementById("btn-ad-claim")?.addEventListener("click", () => {
        this.closeHintModal();
        this.state.applyHint();
      });
      document.getElementById("btn-ad-close")?.addEventListener("click", () => {
        audio.playTap();
        this.closeHintModal();
      });
      document.getElementById("btn-pause-resume")?.addEventListener("click", () => {
        audio.playTap();
        this.closePauseModal();
      });
      document.getElementById("btn-pause-restart")?.addEventListener("click", () => {
        audio.playTap();
        this.closePauseModal();
        this.state.restartLevel();
      });
      document.getElementById("btn-pause-sound")?.addEventListener("click", () => {
        toggleSoundFn();
        const statusEl = document.getElementById("pause-sound-status");
        if (statusEl) statusEl.textContent = audio.isMuted ? "OFF" : "ON";
      });
      document.getElementById("btn-pause-levels")?.addEventListener("click", () => {
        audio.playTap();
        this.closePauseModal();
        this.renderLevelGrid("ALL");
        this.setScreen("LEVEL_SELECT");
      });
      document.getElementById("btn-pause-menu")?.addEventListener("click", () => {
        audio.playTap();
        this.closePauseModal();
        this.setScreen("MAIN_MENU");
      });
      document.getElementById("btn-victory-next")?.addEventListener("click", () => {
        audio.playTap();
        this.closeVictoryModal();
        const hasNext = this.state.nextLevel();
        if (!hasNext) {
          this.renderLevelGrid("ALL");
          this.setScreen("LEVEL_SELECT");
        }
      });
      document.getElementById("btn-victory-replay")?.addEventListener("click", () => {
        audio.playTap();
        this.closeVictoryModal();
        this.state.restartLevel();
      });
      document.getElementById("btn-victory-levels")?.addEventListener("click", () => {
        audio.playTap();
        this.closeVictoryModal();
        this.renderLevelGrid("ALL");
        this.setScreen("LEVEL_SELECT");
      });
    }
    updateScreenVisibility() {
      const screens = {
        "MAIN_MENU": document.getElementById("screen-main-menu"),
        "PLAYING": document.getElementById("screen-gameplay"),
        "LEVEL_SELECT": document.getElementById("screen-level-select"),
        "HOW_TO_PLAY": document.getElementById("screen-how-to-play")
      };
      for (const [key, el] of Object.entries(screens)) {
        if (el) {
          if (key === this.currentScreen) {
            el.classList.remove("hidden");
          } else {
            el.classList.add("hidden");
          }
        }
      }
      if (this.currentScreen === "MAIN_MENU") {
        const playText = document.getElementById("menu-play-text");
        if (playText) {
          playText.textContent = `PLAY LEVEL ${this.state.progress.unlockedLevel}`;
        }
      }
    }
    updateHUD() {
      const levelBadge = document.getElementById("hud-level-badge");
      if (levelBadge) {
        levelBadge.textContent = `LEVEL ${this.state.level.id}`;
      }
      const connected = this.state.getConnectedPairsCount();
      const totalPairs = this.state.level.pairs.length;
      const pairsCounter = document.getElementById("hud-pairs-counter");
      if (pairsCounter) {
        pairsCounter.textContent = `${connected}/${totalPairs}`;
      }
      const starsCounter = document.getElementById("hud-stars-counter");
      if (starsCounter) {
        const stars = this.state.progress.stars[this.state.level.id] || 0;
        starsCounter.textContent = stars === 3 ? "\u2605\u2605\u2605" : stars === 2 ? "\u2605\u2605\u2606" : stars === 1 ? "\u2605\u2606\u2606" : "\u2606\u2606\u2606";
      }
      const timerCounter = document.getElementById("hud-timer-counter");
      if (timerCounter) {
        const mins = Math.floor(this.state.timeElapsed / 60);
        const secs = this.state.timeElapsed % 60;
        timerCounter.textContent = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      }
      const coverage = this.state.getFlowCoveragePercentage();
      const covText = document.getElementById("hud-coverage-text");
      const covBar = document.getElementById("hud-coverage-bar");
      if (covText) covText.textContent = `${coverage}%`;
      if (covBar) covBar.style.width = `${coverage}%`;
      const diffTag = document.getElementById("hud-difficulty-tag");
      if (diffTag) {
        diffTag.textContent = `${this.state.level.size}x${this.state.level.size} ${this.state.level.difficulty}`;
      }
      const statusText = document.getElementById("hud-status-text");
      const statusPill = document.getElementById("hud-status-pill");
      if (statusText && statusPill) {
        if (this.state.isLevelWon) {
          statusText.textContent = "SOLVED! \u{1F389}";
          statusPill.className = "px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5 shrink-0 animate-pulse";
        } else if (connected === totalPairs && coverage < 100) {
          statusText.textContent = "FILL REMAINING CELLS";
          statusPill.className = "px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1.5 shrink-0";
        } else {
          statusText.textContent = `FLOW: ${coverage}%`;
          statusPill.className = "px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5 shrink-0";
        }
      }
    }
    renderLevelGrid(filter = "ALL") {
      const container = document.getElementById("levels-grid-container");
      if (!container) return;
      container.innerHTML = "";
      const unlocked = this.state.progress.unlockedLevel;
      LEVELS.forEach((lvl, idx) => {
        if (filter !== "ALL" && lvl.difficulty !== filter) return;
        const isUnlocked = lvl.id <= unlocked;
        const stars = this.state.progress.stars[lvl.id] || 0;
        const isCurrent = this.state.currentLevelIndex === idx;
        const card = document.createElement("button");
        card.className = `btn-tactile p-3 rounded-2xl flex flex-col items-center justify-between border transition-all ${isUnlocked ? isCurrent ? "bg-blue-600/30 border-blue-500 text-white shadow-md shadow-blue-500/20" : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750" : "bg-slate-900/60 border-slate-800/80 text-slate-600 opacity-60 cursor-not-allowed"}`;
        card.innerHTML = `
        <div class="flex items-center justify-between w-full text-[10px] font-bold text-slate-400">
          <span>${lvl.size}x${lvl.size}</span>
          <span>${isUnlocked ? stars > 0 ? "\u2605".repeat(stars) : "\u2022" : "\u{1F512}"}</span>
        </div>
        <div class="font-black text-lg my-1 ${isUnlocked ? "text-white" : "text-slate-600"}">
          ${lvl.id}
        </div>
        <div class="text-[9px] font-semibold tracking-wide uppercase ${isUnlocked ? "text-blue-400" : "text-slate-600"}">
          ${lvl.difficulty}
        </div>
      `;
        if (isUnlocked) {
          card.addEventListener("click", () => {
            audio.playTap();
            this.state.setLevel(idx);
            this.setScreen("PLAYING");
          });
        }
        container.appendChild(card);
      });
    }
    openPauseModal() {
      this.state.pauseTimer();
      const modal = document.getElementById("modal-pause");
      const statusEl = document.getElementById("pause-sound-status");
      if (statusEl) statusEl.textContent = audio.isMuted ? "OFF" : "ON";
      modal?.classList.remove("hidden");
    }
    closePauseModal() {
      document.getElementById("modal-pause")?.classList.add("hidden");
      this.state.resumeTimer();
    }
    openHintModal() {
      this.state.pauseTimer();
      const modal = document.getElementById("modal-hint-ad");
      const claimBtn = document.getElementById("btn-ad-claim");
      const countText = document.getElementById("ad-countdown-text");
      const progBar = document.getElementById("ad-progress-bar");
      if (!modal) return;
      modal.classList.remove("hidden");
      this.hintCountdown = 5;
      if (claimBtn) claimBtn.disabled = true;
      if (countText) countText.textContent = "5s remaining";
      if (progBar) progBar.style.width = "0%";
      if (this.hintInterval) clearInterval(this.hintInterval);
      this.hintInterval = window.setInterval(() => {
        this.hintCountdown--;
        const percent = Math.round((5 - this.hintCountdown) / 5 * 100);
        if (progBar) progBar.style.width = `${percent}%`;
        if (countText) countText.textContent = this.hintCountdown > 0 ? `${this.hintCountdown}s remaining` : "Hint Ready!";
        if (this.hintCountdown <= 0) {
          if (this.hintInterval) clearInterval(this.hintInterval);
          if (claimBtn) claimBtn.disabled = false;
          audio.playTap();
        }
      }, 1e3);
    }
    closeHintModal() {
      if (this.hintInterval) {
        clearInterval(this.hintInterval);
        this.hintInterval = null;
      }
      document.getElementById("modal-hint-ad")?.classList.add("hidden");
      this.state.resumeTimer();
    }
    showVictoryModal(timeInSeconds, stars) {
      const modal = document.getElementById("modal-victory");
      const starsEl = document.getElementById("victory-stars");
      const timeEl = document.getElementById("victory-time-text");
      if (starsEl) {
        starsEl.textContent = "\u2605".repeat(stars) + "\u2606".repeat(3 - stars);
      }
      if (timeEl) {
        const mins = Math.floor(timeInSeconds / 60);
        const secs = timeInSeconds % 60;
        timeEl.textContent = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      }
      modal?.classList.remove("hidden");
    }
    closeVictoryModal() {
      document.getElementById("modal-victory")?.classList.add("hidden");
    }
    updateSoundIcons(isMuted) {
      const iconPathMuted = "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2";
      const iconPathActive = "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z";
      const path = isMuted ? iconPathMuted : iconPathActive;
      const menuIcon = document.querySelector("#menu-icon-sound path");
      if (menuIcon) menuIcon.setAttribute("d", path);
      const hudIcon = document.querySelector("#hud-icon-sound path");
      if (hudIcon) hudIcon.setAttribute("d", path);
    }
  };

  // number-link-flow/src/main.ts
  function initGame(onWinCallback) {
    const state = new GameState();
    const screenManager = new ScreenManager(state);
    const canvas = document.getElementById("game-canvas");
    if (!canvas) return;
    const display = new DisplayManager(canvas);
    display.setGridSize(state.level.size);
    const renderer = new GameRenderer(display, state);
    renderer.start();
    const handleDown = (e) => {
      canvas.setPointerCapture?.(e.pointerId);
      const grid = display.screenToGrid(e.clientX, e.clientY);
      if (grid) {
        state.handlePointerDown(grid.r, grid.c);
      }
    };
    const handleMove = (e) => {
      if (!state.isDrawing) return;
      const grid = display.screenToGrid(e.clientX, e.clientY);
      if (grid) {
        state.handlePointerMove(grid.r, grid.c);
      }
    };
    const handleUp = (e) => {
      try {
        if (canvas.hasPointerCapture?.(e.pointerId)) {
          canvas.releasePointerCapture?.(e.pointerId);
        }
      } catch {
      }
      state.handlePointerUp();
    };
    canvas.addEventListener("pointerdown", handleDown, { passive: false });
    canvas.addEventListener("pointermove", handleMove, { passive: false });
    canvas.addEventListener("pointerup", handleUp, { passive: false });
    canvas.addEventListener("pointercancel", handleUp, { passive: false });
    canvas.addEventListener("pointerleave", handleUp, { passive: false });
    state.onStateChange = () => {
      display.setGridSize(state.level.size);
      screenManager.updateHUD();
    };
    state.onPairConnected = (pair, pt) => {
      const screenPt = display.gridToScreenCenter(pt.r, pt.c);
      renderer.spawnSparkles(screenPt.x, screenPt.y, pair.color, 24);
    };
    state.onWin = (timeInSeconds, stars) => {
      renderer.spawnWinCelebration();
      screenManager.showVictoryModal(timeInSeconds, stars);
      if (onWinCallback) {
        onWinCallback(timeInSeconds);
      }
    };
    screenManager.onResizeNeeded = () => {
      display.resize();
    };
    display.resize();
    screenManager.updateHUD();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initGame());
  } else {
    initGame();
  }
  function render(container, onWin) {
    if (container && container.id !== "root") {
      container.innerHTML = '<div id="root" class="w-full h-full flex items-center justify-center"></div>';
    }
    initGame(onWin);
  }
})();
