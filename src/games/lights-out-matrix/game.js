(() => {
  // src/audio.ts
  var SoundManager = class {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      const saved = localStorage.getItem("lights_out_muted");
      this.isMuted = saved === "true";
    }
    initCtx() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }
    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem("lights_out_muted", String(this.isMuted));
      return this.isMuted;
    }
    getIsMuted() {
      return this.isMuted;
    }
    /**
     * Bulb toggle sound: click + warm incandescent ping
     */
    playBulbToggle(isTurningOn) {
      if (this.isMuted) return;
      try {
        this.initCtx();
        const ctx = this.ctx;
        if (!ctx) return;
        const now = ctx.currentTime;
        const oscClick = ctx.createOscillator();
        const gainClick = ctx.createGain();
        oscClick.type = "triangle";
        oscClick.frequency.setValueAtTime(isTurningOn ? 320 : 180, now);
        oscClick.frequency.exponentialRampToValueAtTime(40, now + 0.04);
        gainClick.gain.setValueAtTime(0.25, now);
        gainClick.gain.exponentialRampToValueAtTime(1e-3, now + 0.04);
        oscClick.connect(gainClick);
        gainClick.connect(ctx.destination);
        oscClick.start(now);
        oscClick.stop(now + 0.05);
        const oscHarmonic = ctx.createOscillator();
        const gainHarmonic = ctx.createGain();
        oscHarmonic.type = "sine";
        if (isTurningOn) {
          oscHarmonic.frequency.setValueAtTime(587.33, now);
          oscHarmonic.frequency.exponentialRampToValueAtTime(880, now + 0.08);
          gainHarmonic.gain.setValueAtTime(0.18, now);
          gainHarmonic.gain.exponentialRampToValueAtTime(1e-3, now + 0.16);
        } else {
          oscHarmonic.frequency.setValueAtTime(440, now);
          oscHarmonic.frequency.exponentialRampToValueAtTime(220, now + 0.1);
          gainHarmonic.gain.setValueAtTime(0.12, now);
          gainHarmonic.gain.exponentialRampToValueAtTime(1e-3, now + 0.12);
        }
        oscHarmonic.connect(gainHarmonic);
        gainHarmonic.connect(ctx.destination);
        oscHarmonic.start(now);
        oscHarmonic.stop(now + 0.2);
      } catch {
      }
    }
    /**
     * Tactile button click sound
     */
    playButtonClick() {
      if (this.isMuted) return;
      try {
        this.initCtx();
        const ctx = this.ctx;
        if (!ctx) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(1e-3, now + 0.035);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } catch {
      }
    }
    /**
     * Reset / Shuffle rattle sound
     */
    playRattle() {
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
          osc.type = "triangle";
          osc.frequency.setValueAtTime(300 + Math.random() * 200, time);
          gain.gain.setValueAtTime(0.12, time);
          gain.gain.exponentialRampToValueAtTime(1e-3, time + 0.03);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + 0.04);
        }
      } catch {
      }
    }
    /**
     * Hint chime
     */
    playHint() {
      if (this.isMuted) return;
      try {
        this.initCtx();
        const ctx = this.ctx;
        if (!ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.5];
        const now = ctx.currentTime;
        notes.forEach((freq, idx) => {
          const time = now + idx * 0.06;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, time);
          gain.gain.setValueAtTime(0.15, time);
          gain.gain.exponentialRampToValueAtTime(1e-3, time + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + 0.3);
        });
      } catch {
      }
    }
    /**
     * Victory fanfare arpeggio
     */
    playVictory() {
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
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, time);
          gain.gain.setValueAtTime(0.2, time);
          gain.gain.exponentialRampToValueAtTime(1e-3, time + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + 0.5);
        });
      } catch {
      }
    }
  };
  var sound = new SoundManager();

  // src/display.ts
  var DisplayManager = class {
    constructor(canvas, onResize) {
      this.dpr = 1;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.onResizeCallback = onResize;
      if (this.canvas.parentElement) {
        const observer = new ResizeObserver(() => this.resize());
        observer.observe(this.canvas.parentElement);
      } else {
        window.addEventListener("resize", () => this.resize());
      }
      setTimeout(() => this.resize(), 0);
    }
    resize() {
      if (!this.canvas.parentElement) return;
      const parentRect = this.canvas.parentElement.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cssWidth = parentRect.width;
      const cssHeight = parentRect.height;
      if (cssWidth === 0 || cssHeight === 0) return;
      this.canvas.width = Math.floor(cssWidth * this.dpr);
      this.canvas.height = Math.floor(cssHeight * this.dpr);
      this.canvas.style.width = `${cssWidth}px`;
      this.canvas.style.height = `${cssHeight}px`;
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);
      if (this.onResizeCallback) {
        this.onResizeCallback(cssWidth, cssHeight);
      }
    }
    getGameCoordinates(clientX, clientY) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
    getContext() {
      return this.ctx;
    }
  };

  // src/solver.ts
  var LightsOutSolver = class {
    /**
     * Builds the adjacency matrix A for an (n x m) grid over GF(2).
     */
    static buildAdjacencyMatrix(rows, cols) {
      const N = rows * cols;
      const A = Array.from({ length: N }, () => new Array(N).fill(0));
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          A[i][i] = 1;
          if (r > 0) A[(r - 1) * cols + c][i] = 1;
          if (r < rows - 1) A[(r + 1) * cols + c][i] = 1;
          if (c > 0) A[r * cols + (c - 1)][i] = 1;
          if (c < cols - 1) A[r * cols + (c + 1)][i] = 1;
        }
      }
      return A;
    }
    /**
     * Solves A * x = b over GF(2).
     * b is 1 where the light is currently OFF (since we want to turn ON all lamps: 0 flips to 1, 1 stays 1).
     * Returns an array of booleans representing the presses for each tile,
     * or null if unsolvable.
     */
    static solve(board) {
      const rows = board.length;
      const cols = board[0].length;
      const N = rows * cols;
      const A = this.buildAdjacencyMatrix(rows, cols);
      const b = new Array(N).fill(0);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          b[r * cols + c] = board[r][c] ? 0 : 1;
        }
      }
      const M = A.map((row, idx) => [...row, b[idx]]);
      const pivotCols = [];
      let lead = 0;
      for (let r = 0; r < N; r++) {
        if (lead >= N) break;
        let i = r;
        while (M[i][lead] === 0) {
          i++;
          if (i === N) {
            i = r;
            lead++;
            if (lead === N) break;
          }
        }
        if (lead >= N) break;
        const temp = M[i];
        M[i] = M[r];
        M[r] = temp;
        pivotCols.push(lead);
        for (let j = 0; j < N; j++) {
          if (j !== r && M[j][lead] === 1) {
            for (let k = 0; k <= N; k++) {
              M[j][k] = (M[j][k] ^ M[r][k]) & 1;
            }
          }
        }
        lead++;
      }
      for (let r = 0; r < N; r++) {
        let allZeros = true;
        for (let c = 0; c < N; c++) {
          if (M[r][c] === 1) {
            allZeros = false;
            break;
          }
        }
        if (allZeros && M[r][N] === 1) {
          return null;
        }
      }
      const freeCols = [];
      for (let c = 0; c < N; c++) {
        if (!pivotCols.includes(c)) {
          freeCols.push(c);
        }
      }
      const numFree = freeCols.length;
      let bestWeight = Infinity;
      let bestX = null;
      const totalCombinations = 1 << Math.min(numFree, 8);
      for (let combo = 0; combo < totalCombinations; combo++) {
        const x = new Array(N).fill(0);
        for (let fi = 0; fi < numFree; fi++) {
          if (combo >> fi & 1) {
            x[freeCols[fi]] = 1;
          }
        }
        for (let pi = 0; pi < pivotCols.length; pi++) {
          const pcol = pivotCols[pi];
          let val = M[pi][N];
          for (let fi = 0; fi < numFree; fi++) {
            const fcol = freeCols[fi];
            if (M[pi][fcol] === 1 && x[fcol] === 1) {
              val ^= 1;
            }
          }
          x[pcol] = val;
        }
        const weight = x.reduce((sum, v) => sum + v, 0);
        if (weight < bestWeight) {
          bestWeight = weight;
          bestX = [...x];
        }
      }
      if (!bestX) return null;
      return bestX.map((v) => v === 1);
    }
    /**
     * Returns a suggested next move (r, c) to advance towards victory.
     */
    static getNextHint(board) {
      const solution = this.solve(board);
      if (!solution) return null;
      const rows = board.length;
      const cols = board[0].length;
      for (let i = 0; i < solution.length; i++) {
        if (solution[i]) {
          return {
            r: Math.floor(i / cols),
            c: i % cols
          };
        }
      }
      return null;
    }
    /**
     * Calculates minimum moves needed from current state.
     */
    static getMinMovesRemaining(board) {
      const solution = this.solve(board);
      if (!solution) return 0;
      return solution.filter(Boolean).length;
    }
  };

  // src/game-state.ts
  var LEVELS = [
    { id: 1, name: "Tutorial: 3x3 Prime", rows: 3, cols: 3, scrambleMoves: 3, parMoves: 3 },
    { id: 2, name: "3x3 Corner Cross", rows: 3, cols: 3, scrambleMoves: 4, parMoves: 4 },
    { id: 3, name: "3x3 Center Glow", rows: 3, cols: 3, scrambleMoves: 5, parMoves: 4 },
    { id: 4, name: "4x4 Grid Genesis", rows: 4, cols: 4, scrambleMoves: 5, parMoves: 5 },
    { id: 5, name: "4x4 Alternator", rows: 4, cols: 4, scrambleMoves: 6, parMoves: 6 },
    { id: 6, name: "5x5 Classic Matrix", rows: 5, cols: 5, scrambleMoves: 6, parMoves: 6 },
    { id: 7, name: "5x5 Quantum Mesh", rows: 5, cols: 5, scrambleMoves: 8, parMoves: 7 },
    { id: 8, name: "5x5 Diamond Wire", rows: 5, cols: 5, scrambleMoves: 9, parMoves: 8 },
    { id: 9, name: "5x5 Binary Eclipse", rows: 5, cols: 5, scrambleMoves: 10, parMoves: 9 },
    { id: 10, name: "5x5 Neon Circuit", rows: 5, cols: 5, scrambleMoves: 11, parMoves: 9 },
    { id: 11, name: "5x5 Master Void", rows: 5, cols: 5, scrambleMoves: 12, parMoves: 10 },
    { id: 12, name: "5x5 Apex Dark", rows: 5, cols: 5, scrambleMoves: 14, parMoves: 11 }
  ];
  var GameState = class {
    constructor() {
      this.rows = 5;
      this.cols = 5;
      this.board = [];
      this.initialBoard = [];
      this.currentLevel = 6;
      // Default to the 5x5 Classic Matrix from image
      this.moves = 0;
      this.history = [];
      this.startTime = 0;
      this.elapsedSeconds = 0;
      this.timerInterval = null;
      this.isWon = false;
      this.activeHint = null;
      this.save = {
        unlockedLevel: 1,
        bestMoves: {},
        stars: {}
      };
      this.loadSave();
      this.currentLevel = Math.min(Math.max(this.save.unlockedLevel, 1), 6);
      this.initLevel(this.currentLevel);
    }
    loadSave() {
      try {
        const stored = localStorage.getItem("lights_out_save");
        if (stored) {
          this.save = JSON.parse(stored);
        }
      } catch {
      }
    }
    persistSave() {
      try {
        localStorage.setItem("lights_out_save", JSON.stringify(this.save));
      } catch {
      }
    }
    initLevel(levelId) {
      this.currentLevel = levelId;
      const config = LEVELS.find((l) => l.id === levelId) || LEVELS[5];
      this.rows = config.rows;
      this.cols = config.cols;
      this.resetGame(config.scrambleMoves);
    }
    /**
     * Generates a guaranteed solvable puzzle by toggling from all-off state.
     */
    resetGame(scrambleCount) {
      this.moves = 0;
      this.history = [];
      this.isWon = false;
      this.activeHint = null;
      this.elapsedSeconds = 0;
      this.startTimer();
      const count = scrambleCount ?? (LEVELS.find((l) => l.id === this.currentLevel)?.scrambleMoves || 7);
      this.board = Array.from({ length: this.rows }, () => new Array(this.cols).fill(true));
      const picked = /* @__PURE__ */ new Set();
      for (let i = 0; i < count; i++) {
        let r, c, key;
        let attempts = 0;
        do {
          r = Math.floor(Math.random() * this.rows);
          c = Math.floor(Math.random() * this.cols);
          key = `${r},${c}`;
          attempts++;
        } while (picked.has(key) && attempts < 20);
        picked.add(key);
        this.toggleInternal(r, c);
      }
      let offCount = this.getTotalBulbs() - this.getOnCount();
      if (offCount < 3) {
        const r = Math.floor(this.rows / 2);
        const c = Math.floor(this.cols / 2);
        this.toggleInternal(r, c);
      }
      this.initialBoard = this.board.map((row) => [...row]);
    }
    /**
     * Resets the board back to its exact initial configuration
     */
    restartCurrentBoard() {
      this.board = this.initialBoard.map((row) => [...row]);
      this.moves = 0;
      this.history = [];
      this.isWon = false;
      this.activeHint = null;
      this.elapsedSeconds = 0;
      this.startTimer();
    }
    startTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
      this.startTime = Date.now() - this.elapsedSeconds * 1e3;
      this.timerInterval = window.setInterval(() => {
        if (!this.isWon) {
          this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1e3);
        }
      }, 1e3);
    }
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }
    /**
     * Internal toggle without counting player moves
     */
    toggleInternal(r, c) {
      const deltas = [
        [0, 0],
        // Self
        [-1, 0],
        // Up
        [1, 0],
        // Down
        [0, -1],
        // Left
        [0, 1]
        // Right
      ];
      for (const [dr, dc] of deltas) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
          this.board[nr][nc] = !this.board[nr][nc];
        }
      }
    }
    /**
     * Player action: click bulb (r, c)
     */
    playerClickBulb(r, c) {
      if (this.isWon) {
        return { affected: [], wasTurningOn: false, won: true };
      }
      this.activeHint = null;
      const wasOn = this.board[r][c];
      this.toggleInternal(r, c);
      this.moves++;
      this.history.push({ r, c });
      const affected = [
        { r, c },
        ...r > 0 ? [{ r: r - 1, c }] : [],
        ...r < this.rows - 1 ? [{ r: r + 1, c }] : [],
        ...c > 0 ? [{ r, c: c - 1 }] : [],
        ...c < this.cols - 1 ? [{ r, c: c + 1 }] : []
      ];
      this.isWon = this.checkVictory();
      if (this.isWon) {
        this.stopTimer();
        this.handleVictory();
      }
      return {
        affected,
        wasTurningOn: !wasOn,
        won: this.isWon
      };
    }
    /**
     * Undo last move
     */
    undo() {
      if (this.history.length === 0 || this.isWon) return null;
      const last = this.history.pop();
      this.toggleInternal(last.r, last.c);
      this.moves = Math.max(0, this.moves - 1);
      this.activeHint = null;
      return last;
    }
    checkVictory() {
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (!this.board[r][c]) {
            return false;
          }
        }
      }
      return true;
    }
    handleVictory() {
      const lvl = this.currentLevel;
      const config = LEVELS.find((l) => l.id === lvl);
      const par = config ? config.parMoves : 8;
      let stars = 1;
      if (this.moves <= par) stars = 3;
      else if (this.moves <= Math.ceil(par * 1.5)) stars = 2;
      const prevBest = this.save.bestMoves[lvl] || Infinity;
      if (this.moves < prevBest) {
        this.save.bestMoves[lvl] = this.moves;
      }
      const prevStars = this.save.stars[lvl] || 0;
      if (stars > prevStars) {
        this.save.stars[lvl] = stars;
      }
      if (lvl + 1 <= LEVELS.length) {
        this.save.unlockedLevel = Math.max(this.save.unlockedLevel, lvl + 1);
      }
      this.persistSave();
    }
    getOnCount() {
      let count = 0;
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (this.board[r][c]) count++;
        }
      }
      return count;
    }
    getTotalBulbs() {
      return this.rows * this.cols;
    }
    getBestMovesForCurrent() {
      return this.save.bestMoves[this.currentLevel] ?? null;
    }
    requestHint() {
      const hint = LightsOutSolver.getNextHint(this.board);
      this.activeHint = hint;
      return hint;
    }
  };

  // src/particles.ts
  var ParticleSystem = class {
    constructor() {
      this.particles = [];
      this.ambientDust = [];
      this.width = 800;
      this.height = 600;
      this.initDust();
    }
    setDimensions(w, h) {
      this.width = w;
      this.height = h;
    }
    initDust() {
      this.ambientDust = [];
      for (let i = 0; i < 35; i++) {
        this.ambientDust.push({
          x: Math.random() * 800,
          y: Math.random() * 600,
          r: 1 + Math.random() * 2,
          alpha: 0.1 + Math.random() * 0.25,
          speed: 0.15 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    /**
     * Spawns radiant electrical/amber spark particles when a bulb toggles
     */
    spawnBulbSparks(x, y, isTurningOn) {
      const count = isTurningOn ? 22 : 12;
      const colors = isTurningOn ? ["#fef08a", "#fde047", "#f59e0b", "#fbbf24", "#ffffff"] : ["#94a3b8", "#64748b", "#cbd5e1", "#475569"];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4.5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (isTurningOn ? 0.8 : 0),
          radius: isTurningOn ? 1.5 + Math.random() * 2.5 : 1 + Math.random() * 1.5,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          decay: 0.025 + Math.random() * 0.035,
          life: 1,
          gravity: 0.08
        });
      }
    }
    /**
     * Spawns victory confetti and firework sparks
     */
    spawnVictoryExplosion(centerX, centerY) {
      const colors = ["#fbbf24", "#f59e0b", "#38bdf8", "#34d399", "#f43f5e", "#a855f7", "#ffffff"];
      for (let i = 0; i < 90; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 7;
        this.particles.push({
          x: centerX + (Math.random() - 0.5) * 80,
          y: centerY + (Math.random() - 0.5) * 80,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.5,
          radius: 2 + Math.random() * 3,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          decay: 0.012 + Math.random() * 0.018,
          life: 1,
          gravity: 0.12,
          spin: (Math.random() - 0.5) * 0.2,
          angle: Math.random() * Math.PI
        });
      }
    }
    /**
     * Update and render all particles to Canvas
     */
    render(ctx) {
      ctx.save();
      const time = performance.now() * 1e-3;
      ctx.shadowBlur = 0;
      for (const dust of this.ambientDust) {
        dust.y -= dust.speed;
        dust.x += Math.sin(time + dust.phase) * 0.2;
        if (dust.y < -10) dust.y = this.height + 10;
        if (dust.x < -10) dust.x = this.width + 10;
        if (dust.x > this.width + 10) dust.x = -10;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${dust.alpha * (0.6 + 0.4 * Math.sin(time * 2 + dust.phase))})`;
        ctx.fill();
      }
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.gravity) p.vy += p.gravity;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.alpha -= p.decay;
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.radius * 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }
  };

  // src/screen-manager.ts
  var ScreenController = class {
    constructor() {
      this.currentModal = "NONE";
      this.adTimer = null;
      this.adSecondsLeft = 5;
      this.bindGlobalKeys();
    }
    bindGlobalKeys() {
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          if (this.currentModal !== "NONE" && this.currentModal !== "REWARDED_AD") {
            this.closeModal();
          }
        }
      });
    }
    openModal(modal, onAdReward) {
      this.currentModal = modal;
      this.onAdCompleted = onAdReward;
      if (modal === "REWARDED_AD") {
        this.startRewardedAdFlow();
      }
      this.render();
    }
    closeModal() {
      if (this.adTimer) {
        clearInterval(this.adTimer);
        this.adTimer = null;
      }
      this.currentModal = "NONE";
      this.render();
    }
    getCurrentModal() {
      return this.currentModal;
    }
    startRewardedAdFlow() {
      this.adSecondsLeft = 5;
      const claimBtn = document.getElementById("ad-claim-btn");
      const progressEl = document.getElementById("ad-progress-bar");
      const timerText = document.getElementById("ad-countdown-text");
      if (claimBtn) {
        claimBtn.disabled = true;
        claimBtn.classList.add("opacity-50", "cursor-not-allowed");
        claimBtn.classList.remove("opacity-100", "cursor-pointer");
        claimBtn.innerText = `Please wait (${this.adSecondsLeft}s)`;
      }
      if (progressEl) {
        progressEl.style.width = "0%";
      }
      if (timerText) {
        timerText.innerText = `${this.adSecondsLeft}s`;
      }
      if (this.adTimer) clearInterval(this.adTimer);
      const startTime = Date.now();
      const duration = 5e3;
      this.adTimer = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1e3));
        const percent = Math.min(100, elapsed / duration * 100);
        if (progressEl) {
          progressEl.style.width = `${percent}%`;
        }
        if (timerText) {
          timerText.innerText = remaining > 0 ? `${remaining}s` : "Ready!";
        }
        if (claimBtn && remaining > 0) {
          claimBtn.innerText = `Please wait (${remaining}s)`;
        }
        if (elapsed >= duration) {
          if (this.adTimer) clearInterval(this.adTimer);
          this.adTimer = null;
          if (claimBtn) {
            claimBtn.disabled = false;
            claimBtn.classList.remove("opacity-50", "cursor-not-allowed");
            claimBtn.classList.add("opacity-100", "cursor-pointer", "bg-amber-500", "hover:bg-amber-400");
            claimBtn.innerHTML = `\u{1F4A1} Claim Exact Hint!`;
          }
        }
      }, 100);
    }
    claimReward() {
      if (this.onAdCompleted) {
        this.onAdCompleted();
      }
      this.closeModal();
    }
    render() {
      const modalOverlay = document.getElementById("modal-overlay");
      const modalStartMenu = document.getElementById("modal-start-menu");
      const modalLevelSelect = document.getElementById("modal-level-select");
      const modalHowToPlay = document.getElementById("modal-how-to-play");
      const modalRewardedAd = document.getElementById("modal-rewarded-ad");
      const modalVictory = document.getElementById("modal-victory");
      if (!modalOverlay) return;
      if (this.currentModal === "NONE") {
        modalOverlay.classList.add("hidden");
        modalStartMenu?.classList.add("hidden");
        modalLevelSelect?.classList.add("hidden");
        modalHowToPlay?.classList.add("hidden");
        modalRewardedAd?.classList.add("hidden");
        modalVictory?.classList.add("hidden");
        return;
      }
      modalOverlay.classList.remove("hidden");
      modalStartMenu?.classList.toggle("hidden", this.currentModal !== "START_MENU");
      modalLevelSelect?.classList.toggle("hidden", this.currentModal !== "LEVEL_SELECT");
      modalHowToPlay?.classList.toggle("hidden", this.currentModal !== "HOW_TO_PLAY");
      modalRewardedAd?.classList.toggle("hidden", this.currentModal !== "REWARDED_AD");
      modalVictory?.classList.toggle("hidden", this.currentModal !== "VICTORY");
    }
  };

  // src/main.ts
  var LightsOutApp = class {
    constructor() {
      this.tooltipEl = null;
      this.hasInteracted = false;
      this.state = new GameState();
      this.screens = new ScreenController();
      this.particles = new ParticleSystem();
      this.canvas = document.getElementById("game-canvas");
      this.gridContainer = document.getElementById("lights-matrix-grid");
      this.tooltipEl = document.getElementById("matrix-tooltip");
      this.display = new DisplayManager(this.canvas, (w, h) => {
        this.particles.setDimensions(w, h);
      });
      this.bindEvents();
      this.updateHUD();
      this.updateStartMenuStats();
      this.renderBoard();
      this.renderLevelSelectModal();
      this.startRenderLoop();
      this.screens.openModal("START_MENU");
    }
    /**
     * Generates the SVG lightbulb graphic matching the user's reference image
     */
    generateBulbSVG(isOn) {
      if (isOn) {
        return `
        <svg viewBox="0 0 56 68" class="w-full h-full max-h-[82%] drop-shadow-[0_0_12px_rgba(251,191,36,0.95)]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Glowing radial bulb gradient -->
            <radialGradient id="bulbGlowOn" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="25%" stop-color="#fef08a" />
              <stop offset="65%" stop-color="#fbbf24" />
              <stop offset="100%" stop-color="#f59e0b" />
            </radialGradient>
            <!-- Hot filament glow filter -->
            <filter id="filamentHotGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <!-- Outer luminous halo -->
          <circle cx="28" cy="27" r="26" fill="rgba(254, 240, 138, 0.2)" />
          
          <!-- Bulb Glass Dome -->
          <path d="M 28 6 C 16 6 8 15 8 26 C 8 34 13 40 18 46 C 20 49 21 52 21 55 L 35 55 C 35 52 36 49 38 46 C 43 40 48 34 48 26 C 48 15 40 6 28 6 Z"
                fill="url(#bulbGlowOn)" stroke="#fef08a" stroke-width="1" />

          <!-- Internal glowing hot tungsten filament -->
          <g filter="url(#filamentHotGlow)">
            <path d="M 23 55 L 24 33" stroke="#fef08a" stroke-width="1.8" stroke-linecap="round" />
            <path d="M 33 55 L 32 33" stroke="#fef08a" stroke-width="1.8" stroke-linecap="round" />
            <path d="M 24 33 C 24 22, 32 22, 32 33" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
            <circle cx="28" cy="24" r="3.5" fill="#ffffff" />
          </g>

          <!-- Glass Specular Reflection Highlight -->
          <path d="M 14 19 C 14 12 19 8 26 8" fill="none" stroke="rgba(255, 255, 255, 0.85)" stroke-width="2.5" stroke-linecap="round" />

          <!-- Screw Base Collar & Contact Base -->
          <rect x="21" y="55" width="14" height="3" rx="1.2" fill="#94a3b8" />
          <rect x="22" y="59" width="12" height="3" rx="1.2" fill="#64748b" />
          <path d="M 24 63 L 32 63 L 30 66 L 26 66 Z" fill="#334155" />
        </svg>
      `;
      } else {
        return `
        <svg viewBox="0 0 56 68" class="w-full h-full max-h-[82%]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bulbDarkGlass" cx="42%" cy="32%" r="60%">
              <stop offset="0%" stop-color="#475569" />
              <stop offset="50%" stop-color="#334155" />
              <stop offset="90%" stop-color="#1e293b" />
              <stop offset="100%" stop-color="#0f172a" />
            </radialGradient>
          </defs>
          
          <!-- Contact shadow inside recessed tile -->
          <ellipse cx="28" cy="58" rx="13" ry="4" fill="rgba(0,0,0,0.4)" />

          <!-- Dark Frosted Glass Dome -->
          <path d="M 28 6 C 16 6 8 15 8 26 C 8 34 13 40 18 46 C 20 49 21 52 21 55 L 35 55 C 35 52 36 49 38 46 C 43 40 48 34 48 26 C 48 15 40 6 28 6 Z"
                fill="url(#bulbDarkGlass)" stroke="rgba(148, 163, 184, 0.25)" stroke-width="1" />

          <!-- Dark Inactive Filament Structure -->
          <path d="M 23 55 L 24 33" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round" />
          <path d="M 33 55 L 32 33" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round" />
          <path d="M 24 33 C 24 24, 32 24, 32 33" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" />

          <!-- Subtle Specular Glass Reflection -->
          <path d="M 14 18 C 14 12 19 8 25 8" fill="none" stroke="rgba(255, 255, 255, 0.22)" stroke-width="2" stroke-linecap="round" />

          <!-- Matte Metal Screw Base -->
          <rect x="21" y="55" width="14" height="3" rx="1.2" fill="#475569" />
          <rect x="22" y="59" width="12" height="3" rx="1.2" fill="#334155" />
          <path d="M 24 63 L 32 63 L 30 66 L 26 66 Z" fill="#1e293b" />
        </svg>
      `;
      }
    }
    /**
     * Renders the matrix grid of bulbs into the DOM
     */
    renderBoard() {
      this.gridContainer.innerHTML = "";
      this.gridContainer.style.gridTemplateColumns = `repeat(${this.state.cols}, minmax(0, 1fr))`;
      this.gridContainer.style.gridTemplateRows = `repeat(${this.state.rows}, minmax(0, 1fr))`;
      for (let r = 0; r < this.state.rows; r++) {
        for (let c = 0; c < this.state.cols; c++) {
          const isOn = this.state.board[r][c];
          const isHinted = this.state.activeHint?.r === r && this.state.activeHint?.c === c;
          const tile = document.createElement("button");
          tile.id = `bulb-tile-${r}-${c}`;
          tile.className = `bulb-tile ${isOn ? "bulb-on" : "bulb-off"} ${isHinted ? "hint-pulse" : ""}`;
          tile.setAttribute("aria-label", `L\xE2mpada linha ${r + 1}, coluna ${c + 1}, ${isOn ? "ligada" : "desligada"}`);
          tile.innerHTML = this.generateBulbSVG(isOn);
          tile.addEventListener("click", (e) => {
            this.handleBulbClick(r, c, e);
          });
          tile.addEventListener("mouseenter", () => {
            if (!this.hasInteracted && r === 2 && c === 2) {
              this.showTooltipAt(tile);
            }
          });
          this.gridContainer.appendChild(tile);
        }
      }
      if (!this.hasInteracted) {
        setTimeout(() => {
          const centerTile = document.getElementById(`bulb-tile-${Math.floor(this.state.rows / 2)}-${Math.floor(this.state.cols / 2)}`);
          if (centerTile) {
            this.showTooltipAt(centerTile);
          }
        }, 350);
      }
    }
    /**
     * Shows the contextual hint tooltip anchored near an element
     */
    showTooltipAt(target) {
      if (!this.tooltipEl) return;
      const stageRect = document.getElementById("matrix-stage-container")?.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      if (stageRect) {
        const top = targetRect.top - stageRect.top + targetRect.height + 6;
        const left = targetRect.left - stageRect.left + targetRect.width / 2 - 100;
        this.tooltipEl.style.top = `${Math.max(10, top)}px`;
        this.tooltipEl.style.left = `${Math.max(10, Math.min(left, stageRect.width - 230))}px`;
        this.tooltipEl.classList.remove("hidden");
      }
    }
    hideTooltip() {
      if (this.tooltipEl) {
        this.tooltipEl.classList.add("hidden");
      }
    }
    /**
     * Handles bulb press
     */
    handleBulbClick(r, c, event) {
      this.hasInteracted = true;
      this.hideTooltip();
      const wasOn = this.state.board[r][c];
      const { affected, won } = this.state.playerClickBulb(r, c);
      sound.playBulbToggle(!wasOn);
      if (event) {
        this.particles.spawnBulbSparks(event.clientX, event.clientY, !wasOn);
      } else {
        const tile = document.getElementById(`bulb-tile-${r}-${c}`);
        if (tile) {
          const rect = tile.getBoundingClientRect();
          this.particles.spawnBulbSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, !wasOn);
        }
      }
      for (const pt of affected) {
        const tileEl = document.getElementById(`bulb-tile-${pt.r}-${pt.c}`);
        if (tileEl) {
          const isNowOn = this.state.board[pt.r][pt.c];
          tileEl.className = `bulb-tile ${isNowOn ? "bulb-on" : "bulb-off"}`;
          tileEl.innerHTML = this.generateBulbSVG(isNowOn);
          tileEl.classList.add("just-toggled");
          setTimeout(() => tileEl.classList.remove("just-toggled"), 220);
        }
      }
      this.updateHUD();
      if (won) {
        this.handleVictorySequence();
      }
    }
    handleVictorySequence() {
      sound.playVictory();
      const rect = this.gridContainer.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      this.particles.spawnVictoryExplosion(cx, cy);
      setTimeout(() => this.particles.spawnVictoryExplosion(cx - 120, cy - 80), 200);
      setTimeout(() => this.particles.spawnVictoryExplosion(cx + 120, cy + 80), 400);
      const movesEl = document.getElementById("victory-moves");
      const timeEl = document.getElementById("victory-time");
      const starsEl = document.getElementById("victory-stars");
      if (movesEl) movesEl.innerText = String(this.state.moves);
      if (timeEl) {
        const mins = Math.floor(this.state.elapsedSeconds / 60);
        const secs = this.state.elapsedSeconds % 60;
        timeEl.innerText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      }
      const currentStars = this.state.save.stars[this.state.currentLevel] || 3;
      if (starsEl) {
        starsEl.innerHTML = Array.from(
          { length: 3 },
          (_, i) => i < currentStars ? "<span>\u2B50</span>" : '<span class="opacity-25 grayscale">\u2B50</span>'
        ).join("");
      }
      this.renderLevelSelectModal();
      try {
        if (typeof window.triggerPlatformWin === "function") {
          window.triggerPlatformWin(this.state.elapsedSeconds);
        }
      } catch (e) {
      }
      setTimeout(() => {
        this.screens.openModal("VICTORY");
      }, 600);
    }
    /**
     * Updates Header & Footer HUD counters
     */
    updateHUD() {
      const movesEl = document.getElementById("hud-moves");
      const bestEl = document.getElementById("hud-best");
      const levelBadge = document.getElementById("header-level-badge");
      const footerState = document.getElementById("footer-state-counter");
      if (movesEl) {
        movesEl.innerText = String(this.state.moves);
      }
      if (bestEl) {
        const best = this.state.getBestMovesForCurrent();
        bestEl.innerText = best !== null ? String(best) : "--";
      }
      if (levelBadge) {
        levelBadge.innerText = `LEVEL ${this.state.currentLevel}`;
      }
      if (footerState) {
        const onCount = this.state.getOnCount();
        const total = this.state.getTotalBulbs();
        footerState.innerText = `state: ${onCount}/${total} ON \u2022 ${total - onCount}/${total} OFF`;
      }
    }
    /**
     * Updates stats displayed on the Start Menu modal
     */
    updateStartMenuStats() {
      const unlockedEl = document.getElementById("menu-unlocked-level");
      const starsEl = document.getElementById("menu-total-stars");
      const playText = document.getElementById("menu-btn-play-text");
      if (unlockedEl) {
        unlockedEl.innerText = `Level ${this.state.save.unlockedLevel} / ${LEVELS.length}`;
      }
      if (starsEl) {
        const totalStars = Object.values(this.state.save.stars).reduce((a, b) => a + b, 0);
        starsEl.innerText = `\u2B50 ${totalStars}`;
      }
      if (playText) {
        playText.innerText = this.state.moves > 0 ? `Continue Level ${this.state.currentLevel}` : `Play Level ${this.state.currentLevel}`;
      }
    }
    /**
     * Renders the progressive Level Select modal grid
     */
    renderLevelSelectModal() {
      const grid = document.getElementById("levels-grid");
      if (!grid) return;
      grid.innerHTML = "";
      const unlocked = this.state.save.unlockedLevel;
      LEVELS.forEach((lvl) => {
        const isUnlocked = lvl.id <= unlocked;
        const isCurrent = lvl.id === this.state.currentLevel;
        const best = this.state.save.bestMoves[lvl.id];
        const stars = this.state.save.stars[lvl.id] || 0;
        const card = document.createElement("button");
        card.className = `btn-tactile p-3 rounded-2xl flex flex-col items-center justify-between gap-1 text-center border transition-all ${isCurrent ? "bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/50" : isUnlocked ? "bg-slate-800/90 hover:bg-slate-700/90 border-white/10 text-white cursor-pointer" : "bg-slate-900/50 border-white/5 text-slate-500 opacity-60 cursor-not-allowed"}`;
        if (!isUnlocked) {
          card.disabled = true;
        }
        card.innerHTML = `
        <div class="flex items-center justify-between w-full text-[10px] text-slate-400">
          <span>${lvl.rows}x${lvl.cols}</span>
          ${isUnlocked ? `<span>${stars > 0 ? "\u2B50".repeat(stars) : ""}</span>` : "<span>\u{1F512}</span>"}
        </div>
        <div class="text-base sm:text-lg font-black my-1 ${isUnlocked ? "text-white" : "text-slate-600"}">
          #${lvl.id}
        </div>
        <div class="text-[10px] text-slate-400 truncate w-full">
          ${isUnlocked ? best ? `Best: ${best}` : "New" : "Locked"}
        </div>
      `;
        if (isUnlocked) {
          card.addEventListener("click", () => {
            sound.playButtonClick();
            this.state.initLevel(lvl.id);
            this.updateHUD();
            this.renderBoard();
            this.renderLevelSelectModal();
            this.screens.closeModal();
          });
        }
        grid.appendChild(card);
      });
    }
    /**
     * Binds UI controls and listeners
     */
    bindEvents() {
      document.getElementById("btn-open-menu")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.updateStartMenuStats();
        this.screens.openModal("START_MENU");
      });
      document.getElementById("menu-btn-play")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.closeModal();
      });
      document.getElementById("menu-btn-levels")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.renderLevelSelectModal();
        this.screens.openModal("LEVEL_SELECT");
      });
      document.getElementById("menu-btn-how-to-play")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.openModal("HOW_TO_PLAY");
      });
      const soundBtn = document.getElementById("btn-sound");
      const soundIcon = document.getElementById("sound-icon");
      if (soundBtn && soundIcon) {
        soundIcon.innerText = sound.getIsMuted() ? "\u{1F507}" : "\u{1F50A}";
        soundBtn.addEventListener("click", () => {
          const muted = sound.toggleMute();
          soundIcon.innerText = muted ? "\u{1F507}" : "\u{1F50A}";
          if (!muted) sound.playButtonClick();
        });
      }
      document.getElementById("btn-open-levels")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.openModal("LEVEL_SELECT");
      });
      document.getElementById("modal-close-levels")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.closeModal();
      });
      document.getElementById("btn-how-to-play")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.openModal("HOW_TO_PLAY");
      });
      document.getElementById("modal-close-help")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.closeModal();
      });
      document.getElementById("modal-btn-got-it")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.closeModal();
      });
      document.getElementById("btn-undo")?.addEventListener("click", () => {
        const last = this.state.undo();
        if (last) {
          sound.playButtonClick();
          this.updateHUD();
          this.renderBoard();
        }
      });
      document.getElementById("btn-reset")?.addEventListener("click", () => {
        sound.playRattle();
        this.state.restartCurrentBoard();
        this.updateHUD();
        this.renderBoard();
      });
      document.getElementById("btn-new-puzzle")?.addEventListener("click", () => {
        sound.playRattle();
        this.state.resetGame();
        this.updateHUD();
        this.renderBoard();
      });
      document.getElementById("btn-hint")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.openModal("REWARDED_AD", () => {
          this.applyHint();
        });
      });
      document.getElementById("ad-claim-btn")?.addEventListener("click", () => {
        sound.playHint();
        this.screens.claimReward();
      });
      document.getElementById("ad-skip-btn")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.closeModal();
      });
      document.getElementById("victory-next-btn")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.closeModal();
        const nextId = Math.min(this.state.currentLevel + 1, LEVELS.length);
        this.state.initLevel(nextId);
        this.updateHUD();
        this.renderBoard();
        this.renderLevelSelectModal();
      });
      document.getElementById("victory-replay-btn")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.closeModal();
        this.state.restartCurrentBoard();
        this.updateHUD();
        this.renderBoard();
      });
    }
    /**
     * Applies hint: calculates optimal move via GF(2) linear solver,
     * pulses target tile and anchors tooltip
     */
    applyHint() {
      const hint = this.state.requestHint();
      if (!hint) return;
      sound.playHint();
      this.renderBoard();
      const targetTile = document.getElementById(`bulb-tile-${hint.r}-${hint.c}`);
      if (targetTile) {
        targetTile.classList.add("hint-pulse");
        if (this.tooltipEl) {
          this.tooltipEl.innerHTML = `<span>\u{1F4A1}</span><span>Tap here to toggle matrix!</span>`;
          this.showTooltipAt(targetTile);
        }
      }
    }
    /**
     * 60FPS Canvas Animation Loop for continuous particle physics
     */
    startRenderLoop() {
      const ctx = this.display.getContext();
      const loop = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.render(ctx);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  };
  window.addEventListener("DOMContentLoaded", () => {
    new LightsOutApp();
  });
})();
