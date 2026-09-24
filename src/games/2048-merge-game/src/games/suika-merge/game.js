class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('sound_enabled') !== 'false';
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {}
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('sound_enabled', this.enabled);
    return this.enabled;
  }

  playPop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.07);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  playDrop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  playMerge(value) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const exponent = Math.min(11, Math.log2(value || 4));
      const baseFreq = 260 + exponent * 50;

      [baseFreq, baseFreq * 1.5, baseFreq * 2].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = i === 2 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.03);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.25);
        gain.gain.setValueAtTime(0.16 / (i + 1), now + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.03);
        osc.stop(now + 0.3);
      });
    } catch {}
  }

  playVictory() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, index) => {
        const now = this.ctx.currentTime + index * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      });
    } catch {}
  }

  playGameOver() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
    } catch {}
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }
}

class DisplayManager {
  constructor(canvas, onResizeCallback) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.dpr = 1;
    this.logicalWidth = 400;
    this.logicalHeight = 600;
    this.onResizeCallback = onResizeCallback;

    if (this.canvas && this.canvas.parentElement) {
      const observer = new ResizeObserver(() => this.resize());
      observer.observe(this.canvas.parentElement);
    }
    window.addEventListener('resize', () => this.resize());
    this.updateDimensions();
  }

  updateDimensions() {
    if (!this.canvas || !this.canvas.parentElement) return;
    const parentRect = this.canvas.parentElement.getBoundingClientRect();
    if (parentRect.width === 0 || parentRect.height === 0) return;

    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const cssWidth = Math.floor(parentRect.width);
    const cssHeight = Math.floor(parentRect.height);

    this.logicalWidth = cssWidth || 400;
    this.logicalHeight = cssHeight || 600;

    this.canvas.width = Math.floor(this.logicalWidth * this.dpr);
    this.canvas.height = Math.floor(this.logicalHeight * this.dpr);

    this.canvas.style.width = `${this.logicalWidth}px`;
    this.canvas.style.height = `${this.logicalHeight}px`;

    if (this.ctx) {
      this.ctx.resetTransform();
      this.ctx.scale(this.dpr, this.dpr);
    }
  }

  resize() {
    this.updateDimensions();
    if (this.onResizeCallback) {
      this.onResizeCallback(this.logicalWidth, this.logicalHeight);
    }
  }

  getGameCoordinates(clientX, clientY) {
    if (!this.canvas) return { x: 0, y: 0 };
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }
}

const TILE_STYLES = {
  2:    { bgTop: '#ff758c', bgBottom: '#e04070', shadow: '#b01040', text: '#ffffff' },
  4:    { bgTop: '#fb923c', bgBottom: '#ea580c', shadow: '#c2410c', text: '#ffffff' },
  8:    { bgTop: '#fbbf24', bgBottom: '#d97706', shadow: '#b45309', text: '#ffffff' },
  16:   { bgTop: '#f87171', bgBottom: '#dc2626', shadow: '#991b1b', text: '#ffffff' },
  32:   { bgTop: '#34d399', bgBottom: '#059669', shadow: '#047857', text: '#ffffff' },
  64:   { bgTop: '#38bdf8', bgBottom: '#0284c7', shadow: '#0369a1', text: '#ffffff' },
  128:  { bgTop: '#c084fc', bgBottom: '#9333ea', shadow: '#7e22ce', text: '#ffffff' },
  256:  { bgTop: '#2dd4bf', bgBottom: '#0d9488', shadow: '#0f766e', text: '#ffffff' },
  512:  { bgTop: '#a3e635', bgBottom: '#65a30d', shadow: '#4d7c0f', text: '#ffffff' },
  1024: { bgTop: '#f472b6', bgBottom: '#db2777', shadow: '#be185d', text: '#ffffff' },
  2048: { bgTop: '#fde047', bgBottom: '#eab308', shadow: '#a16207', text: '#ffffff' },
  4096: { bgTop: '#ec4899', bgBottom: '#be185d', shadow: '#9d174d', text: '#ffffff' },
};

function getTileStyle(val) {
  return TILE_STYLES[val] || {
    bgTop: '#818cf8',
    bgBottom: '#4f46e5',
    shadow: '#3730a3',
    text: '#ffffff',
  };
}

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.shockwaves = [];
  }

  spawnStarBurst(x, y, colorTheme = '#ffd700', count = 20) {
    const starColors = ['#ffffff', '#ffd700', '#ffea75', '#38bdf8', '#fb923c', '#4ade80', colorTheme];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 2.8 + Math.random() * 5.5;

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        gravity: 0.14,
        drag: 0.96,
        size: 6 + Math.random() * 8,
        alpha: 1.0,
        decay: 0.02 + Math.random() * 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        points: Math.random() > 0.4 ? 4 : 5,
      });
    }

    this.shockwaves.push({
      x: x,
      y: y,
      radius: 8,
      maxRadius: 48,
      alpha: 0.85,
      color: colorTheme,
    });
  }

  spawnLandingDust(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 18,
        y: y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2 - 0.5,
        gravity: 0.1,
        drag: 0.94,
        size: 3 + Math.random() * 4,
        alpha: 0.75,
        decay: 0.04,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: 0.1,
        color: '#ffffff',
        points: 4,
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.rotation += p.rotSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += 2.8;
      sw.alpha -= 0.05;
      if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
        this.shockwaves.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    for (const sw of this.shockwaves) {
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = Math.max(0, sw.alpha);
      ctx.lineWidth = 3;
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      this.drawStar(ctx, p.x, p.y, p.points, p.size, p.size * 0.45, p.rotation);
    }
    ctx.restore();
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, rotation) {
    let rot = (Math.PI / 2) * 3 + rotation;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rot) * outerRadius;
      let y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}

const DIFFICULTIES = {
  easy: {
    id: 'easy',
    name: 'Easy',
    cols: 5,
    rows: 6,
    badgeText: 'EASY',
    description: 'Spacious 5x6 grid, perfect for building massive combos.',
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    cols: 4,
    rows: 5,
    badgeText: 'MEDIUM',
    description: 'Classic 4x5 grid with balanced challenge.',
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    cols: 3,
    rows: 4,
    badgeText: 'HARD',
    description: 'Compact 3x4 grid with high overflow deadline risk.',
  },
};

class GameEngine {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.sound = new SoundFX();
    this.particles = new ParticleSystem();

    const savedDiff = localStorage.getItem('2048_difficulty');
    this.difficulty = DIFFICULTIES[savedDiff] ? savedDiff : 'medium';

    this.COLS = DIFFICULTIES[this.difficulty].cols;
    this.ROWS = DIFFICULTIES[this.difficulty].rows;
    this.grid = Array(this.ROWS).fill(0).map(() => Array(this.COLS).fill(0));

    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('2048_highscore') || '0', 10);

    this.targetTile = 2048;
    this.startTime = Date.now();
    this.combo = 0;
    this.isGameOver = false;
    this.isWon = false;
    this.continuedAfterWin = false;

    this.activeValue = 2;
    this.nextQueue = [4, 8];

    this.isDragging = false;
    this.dragX = 0;
    this.dragY = 0;
    this.hoverCol = -1;

    this.undoState = null;

    this.display = new DisplayManager(this.canvas, (w, h) => this.onResize(w, h));
    this.calculateLayout();

    this.initGame(this.difficulty);
    this.setupInputs();

    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  setDifficulty(diffId) {
    if (!DIFFICULTIES[diffId]) return;
    this.difficulty = diffId;
    localStorage.setItem('2048_difficulty', diffId);

    this.COLS = DIFFICULTIES[diffId].cols;
    this.ROWS = DIFFICULTIES[diffId].rows;

    this.calculateLayout();
    this.initGame(diffId);
  }

  initGame(diffId = this.difficulty) {
    this.isGameOver = false;
    this.isWon = false;
    this.continuedAfterWin = false;
    this.combo = 0;
    this.startTime = Date.now();
    this.undoState = null;
    this.targetTile = 2048;

    this.grid = Array(this.ROWS).fill(0).map(() => Array(this.COLS).fill(0));

    const seedValues = [2, 4, 8];
    const initialTiles = Math.max(2, this.COLS - 1);
    for (let i = 0; i < initialTiles; i++) {
      const col = Math.floor(Math.random() * this.COLS);
      const row = this.ROWS - 1 - Math.floor(Math.random() * 2);
      if (row >= 0 && this.grid[row][col] === 0) {
        this.grid[row][col] = {
          value: seedValues[Math.floor(Math.random() * seedValues.length)],
          scale: 1,
        };
      }
    }

    this.activeValue = this.generateNextValue();
    this.nextQueue = [this.generateNextValue(), this.generateNextValue()];

    this.updateHUD();
  }

  generateNextValue() {
    const r = Math.random();
    if (r < 0.50) return 2;
    if (r < 0.82) return 4;
    if (r < 0.95) return 8;
    return 16;
  }

  onResize(w, h) {
    this.calculateLayout(w, h);
  }

  calculateLayout(customW, customH) {
    const w = customW || (this.display ? this.display.logicalWidth : (this.canvas ? this.canvas.clientWidth : 400)) || 400;
    const h = customH || (this.display ? this.display.logicalHeight : (this.canvas ? this.canvas.clientHeight : 600)) || 600;

    const padding = 14;
    const availableW = w - padding * 2;
    const maxBoardW = Math.min(availableW, 440);

    const maxCellFromHeight = Math.floor((h - 130) / (this.ROWS + 1.2));
    this.cellSize = Math.max(30, Math.min(Math.floor(maxBoardW / this.COLS), maxCellFromHeight));

    this.boardW = this.cellSize * this.COLS;
    this.boardH = this.cellSize * this.ROWS;

    this.boardX = Math.floor((w - this.boardW) / 2);
    this.boardY = Math.max(16, Math.floor((h - this.boardH - this.cellSize * 1.4) * 0.42));

    this.spawnerX = w / 2;
    this.spawnerY = this.boardY + this.boardH + Math.floor(this.cellSize * 0.75);
  }

  setupInputs() {
    this.canvas.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    window.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    window.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    window.addEventListener('pointercancel', (e) => this.handlePointerUp(e));
  }

  handlePointerDown(e) {
    if (this.isGameOver || (this.isWon && !this.continuedAfterWin)) return;
    this.sound.init();

    const coords = this.display.getGameCoordinates(e.clientX, e.clientY);

    this.isDragging = true;
    this.dragX = coords.x;
    this.dragY = coords.y;
    this.sound.playPop();

    this.updateHoverCol(coords.x);
  }

  handlePointerMove(e) {
    if (!this.isDragging) return;
    const coords = this.display.getGameCoordinates(e.clientX, e.clientY);
    this.dragX = coords.x;
    this.dragY = coords.y;

    this.updateHoverCol(coords.x);
  }

  updateHoverCol(x) {
    if (x >= this.boardX && x <= this.boardX + this.boardW) {
      const col = Math.floor((x - this.boardX) / this.cellSize);
      this.hoverCol = Math.max(0, Math.min(this.COLS - 1, col));
    } else if (x < this.boardX) {
      this.hoverCol = 0;
    } else if (x > this.boardX + this.boardW) {
      this.hoverCol = this.COLS - 1;
    } else {
      this.hoverCol = -1;
    }
  }

  handlePointerUp() {
    if (!this.isDragging) return;
    this.isDragging = false;

    if (this.hoverCol >= 0 && this.hoverCol < this.COLS) {
      this.dropTileIntoCol(this.hoverCol);
    }

    this.hoverCol = -1;
  }

  findLowestEmptyRow(col) {
    for (let r = this.ROWS - 1; r >= 0; r--) {
      if (!this.grid[r][col] || this.grid[r][col] === 0) {
        return r;
      }
    }
    return -1;
  }

  saveUndoState() {
    this.undoState = {
      grid: this.grid.map(row => row.map(cell => cell ? { ...cell } : 0)),
      score: this.score,
      activeValue: this.activeValue,
      nextQueue: [...this.nextQueue],
    };
    const undoBtn = document.getElementById('btn-undo');
    if (undoBtn) undoBtn.removeAttribute('disabled');
  }

  undo() {
    if (!this.undoState) return;
    this.grid = this.undoState.grid;
    this.score = this.undoState.score;
    this.activeValue = this.undoState.activeValue;
    this.nextQueue = this.undoState.nextQueue;
    this.undoState = null;

    const undoBtn = document.getElementById('btn-undo');
    if (undoBtn) undoBtn.setAttribute('disabled', 'true');

    this.sound.playClick();
    this.updateHUD();
  }

  dropTileIntoCol(col) {
    const targetRow = this.findLowestEmptyRow(col);

    if (targetRow === -1) {
      if (this.grid[0][col] && this.grid[0][col].value === this.activeValue) {
        this.saveUndoState();
        const newVal = this.grid[0][col].value * 2;
        this.grid[0][col] = {
          value: newVal,
          scale: 1.35,
        };
        this.score += newVal;
        this.sound.playMerge(newVal);

        const cx = this.boardX + col * this.cellSize + this.cellSize / 2;
        const cy = this.boardY + this.cellSize / 2;
        this.particles.spawnStarBurst(cx, cy, getTileStyle(newVal).bgTop, 20);

        this.activeValue = this.nextQueue.shift();
        this.nextQueue.push(this.generateNextValue());

        this.applyGravity();
        this.triggerCascadeMerges();
        this.updateHUD();
        return;
      } else {
        this.triggerGameOver('Column overflowed the Danger Line!');
        return;
      }
    }

    this.saveUndoState();

    const valueToDrop = this.activeValue;

    this.grid[targetRow][col] = {
      value: valueToDrop,
      scale: 0.75,
    };

    this.sound.playDrop();

    const cellCenterX = this.boardX + col * this.cellSize + this.cellSize / 2;
    const cellCenterY = this.boardY + targetRow * this.cellSize + this.cellSize / 2;
    this.particles.spawnLandingDust(cellCenterX, cellCenterY + this.cellSize * 0.35, 8);

    this.activeValue = this.nextQueue.shift();
    this.nextQueue.push(this.generateNextValue());

    this.triggerCascadeMerges();
    this.updateHUD();
  }

  triggerCascadeMerges() {
    let hasMerged = false;

    for (let r = this.ROWS - 1; r >= 0; r--) {
      for (let c = 0; c < this.COLS; c++) {
        const current = this.grid[r][c];
        if (current && current !== 0) {
          if (r + 1 < this.ROWS && this.grid[r + 1][c] && this.grid[r + 1][c].value === current.value) {
            this.executeMerge(r, c, r + 1, c);
            hasMerged = true;
            break;
          }
          if (c + 1 < this.COLS && this.grid[r][c + 1] && this.grid[r][c + 1].value === current.value) {
            this.executeMerge(r, c, r, c + 1);
            hasMerged = true;
            break;
          }
        }
      }
      if (hasMerged) break;
    }

    if (hasMerged) {
      setTimeout(() => {
        this.triggerCascadeMerges();
      }, 140);
    } else {
      this.combo = 0;
      this.checkLimitAndGameOver();
    }
  }

  executeMerge(r1, c1, r2, c2) {
    const val = this.grid[r1][c1].value;
    const newVal = val * 2;
    this.score += newVal;

    this.combo++;
    if (this.combo > 1) {
      this.showComboToast(this.combo);
    }

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('2048_highscore', this.highScore);
    }

    const targetR = Math.max(r1, r2);
    const targetC = targetR === r1 ? c1 : c2;
    const sourceR = targetR === r1 ? r2 : r1;
    const sourceC = targetR === r1 ? c2 : c1;

    this.grid[sourceR][sourceC] = 0;
    this.grid[targetR][targetC] = {
      value: newVal,
      scale: 1.35,
    };

    const cx = this.boardX + targetC * this.cellSize + this.cellSize / 2;
    const cy = this.boardY + targetR * this.cellSize + this.cellSize / 2;
    const tileStyle = getTileStyle(newVal);

    this.particles.spawnStarBurst(cx, cy, tileStyle.bgTop, 22);
    this.sound.playMerge(newVal);

    this.applyGravity();

    if (newVal >= this.targetTile && !this.isWon) {
      this.triggerVictory();
    }

    this.updateHUD();
  }

  applyGravity() {
    for (let c = 0; c < this.COLS; c++) {
      for (let r = this.ROWS - 2; r >= 0; r--) {
        if (this.grid[r][c] && this.grid[r][c] !== 0) {
          let fallRow = r;
          while (fallRow + 1 < this.ROWS && (!this.grid[fallRow + 1][c] || this.grid[fallRow + 1][c] === 0)) {
            this.grid[fallRow + 1][c] = this.grid[fallRow][c];
            this.grid[fallRow][c] = 0;
            fallRow++;
          }
        }
      }
    }
  }

  showComboToast(count) {
    const toast = document.getElementById('combo-toast');
    if (!toast) return;
    toast.textContent = `COMBO x${count}! ✨`;
    toast.classList.remove('hidden');
    toast.style.display = 'block';

    clearTimeout(this.comboTimeout);
    this.comboTimeout = setTimeout(() => {
      toast.classList.add('hidden');
      toast.style.display = 'none';
    }, 1200);
  }

  triggerVictory() {
    this.isWon = true;
    const timeInSeconds = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
    this.sound.playVictory();

    const cx = this.boardX + this.boardW / 2;
    const cy = this.boardY + this.boardH / 2;
    this.particles.spawnStarBurst(cx, cy, '#ffd700', 45);

    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'win', time: timeInSeconds }, '*');
    }

    const winBanner = document.getElementById('victory-banner');
    if (winBanner) {
      document.getElementById('victory-time').textContent = `${timeInSeconds}s`;
      document.getElementById('victory-score').textContent = this.score;
      winBanner.classList.remove('hidden');
      winBanner.style.display = 'flex';
    }
  }

  checkLimitAndGameOver() {
    let emptySpaces = 0;
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        if (!this.grid[r][c] || this.grid[r][c] === 0) emptySpaces++;
      }
    }

    if (emptySpaces > 0) return;

    let hasPossibleMerge = false;
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        const val = this.grid[r][c]?.value;
        if (r + 1 < this.ROWS && this.grid[r + 1][c]?.value === val) hasPossibleMerge = true;
        if (c + 1 < this.COLS && this.grid[r][c + 1]?.value === val) hasPossibleMerge = true;
      }
    }

    if (!hasPossibleMerge) {
      this.triggerGameOver('The board is full with no possible moves!');
    }
  }

  triggerGameOver(reason = 'You crossed the danger line!') {
    this.isGameOver = true;
    this.sound.playGameOver();

    const modal = document.getElementById('game-over-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
    }

    const reasonEl = document.getElementById('game-over-reason');
    if (reasonEl) reasonEl.textContent = reason;

    const scoreEl = document.getElementById('final-score');
    if (scoreEl) scoreEl.textContent = this.score;
  }

  applyHint() {
    let bestCol = -1;
    for (let c = 0; c < this.COLS; c++) {
      const r = this.findLowestEmptyRow(c);
      if (r !== -1) {
        if (r + 1 < this.ROWS && this.grid[r + 1][c]?.value === this.activeValue) {
          bestCol = c;
          break;
        }
        if (c - 1 >= 0 && this.grid[r][c - 1]?.value === this.activeValue) {
          bestCol = c;
          break;
        }
        if (c + 1 < this.COLS && this.grid[r][c + 1]?.value === this.activeValue) {
          bestCol = c;
          break;
        }
      }
    }

    if (bestCol !== -1) {
      this.hoverCol = bestCol;
      const cx = this.boardX + bestCol * this.cellSize + this.cellSize / 2;
      const cy = this.boardY + this.cellSize;
      this.particles.spawnStarBurst(cx, cy, '#38bdf8', 20);
      this.sound.playVictory();
    } else {
      let lowestVal = 999999;
      let targetPos = null;
      for (let r = 0; r < this.ROWS; r++) {
        for (let c = 0; c < this.COLS; c++) {
          if (this.grid[r][c] && this.grid[r][c] !== 0 && this.grid[r][c].value < lowestVal) {
            lowestVal = this.grid[r][c].value;
            targetPos = { r, c };
          }
        }
      }
      if (targetPos) {
        const cx = this.boardX + targetPos.c * this.cellSize + this.cellSize / 2;
        const cy = this.boardY + targetPos.r * this.cellSize + this.cellSize / 2;
        this.particles.spawnStarBurst(cx, cy, '#fbbf24', 24);
        this.grid[targetPos.r][targetPos.c] = 0;
        this.applyGravity();
        this.sound.playMerge(lowestVal);
      }
    }
  }

  updateHUD() {
    const elScore = document.getElementById('score-counter');
    if (elScore) elScore.textContent = this.score;

    const elBest = document.getElementById('best-score-counter');
    if (elBest) elBest.textContent = this.highScore;

    const currentDiffConfig = DIFFICULTIES[this.difficulty] || DIFFICULTIES.medium;
    const elDiff = document.getElementById('current-difficulty-badge');
    if (elDiff) elDiff.textContent = currentDiffConfig.badgeText;

    const elGoal = document.getElementById('level-goal-badge');
    if (elGoal) elGoal.textContent = `GOAL: ${this.targetTile} 🍉`;
  }

  gameLoop(currentTime) {
    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.updateAnimations(dt);
    this.draw();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  updateAnimations(dt) {
    this.particles.update();

    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        const cell = this.grid[r][c];
        if (cell && cell !== 0) {
          if (cell.scale > 1.0) {
            cell.scale = Math.max(1.0, cell.scale - dt * 2.8);
          } else if (cell.scale < 1.0) {
            cell.scale = Math.min(1.0, cell.scale + dt * 3.5);
          }
        }
      }
    }
  }

  draw() {
    if (!this.display || !this.display.ctx) return;
    const ctx = this.display.ctx;
    const w = this.display.logicalWidth || 400;
    const h = this.display.logicalHeight || 600;

    ctx.clearRect(0, 0, w, h);

    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#00b4d8');
    bgGrad.addColorStop(0.5, '#0096c7');
    bgGrad.addColorStop(1, '#0077b6');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    this.drawBoard(ctx);
    this.drawDangerLine(ctx);

    if (this.hoverCol >= 0 && this.hoverCol < this.COLS) {
      this.drawColumnHighlight(ctx, this.hoverCol);
    }

    this.drawGridTiles(ctx);
    this.particles.draw(ctx);
    this.drawDockAndActiveTile(ctx);
  }

  drawBoard(ctx) {
    const x = this.boardX;
    const y = this.boardY;
    const bw = this.boardW;
    const bh = this.boardH;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 30, 60, 0.25)';
    this.drawRoundedRect(ctx, x - 4, y - 2, bw + 8, bh + 12, 18);
    ctx.fill();

    ctx.fillStyle = 'rgba(2, 62, 138, 0.45)';
    this.drawRoundedRect(ctx, x - 4, y - 4, bw + 8, bh + 8, 16);
    ctx.fill();

    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        const cx = x + c * this.cellSize + 4;
        const cy = y + r * this.cellSize + 4;
        const size = this.cellSize - 8;

        if (r === 0) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
        } else {
          ctx.fillStyle = 'rgba(0, 80, 130, 0.22)';
        }
        this.drawRoundedRect(ctx, cx, cy, size, size, 12);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  drawDangerLine(ctx) {
    const y = this.boardY + this.cellSize * 0.95;
    const x1 = this.boardX;
    const x2 = this.boardX + this.boardW;

    let isNearDanger = false;
    for (let c = 0; c < this.COLS; c++) {
      if (this.grid[1] && this.grid[1][c] && this.grid[1][c] !== 0) {
        isNearDanger = true;
        break;
      }
    }

    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.lineWidth = 2.5;

    if (isNearDanger) {
      const pulse = 0.5 + Math.sin(Date.now() / 140) * 0.5;
      ctx.strokeStyle = `rgba(239, 68, 68, ${pulse})`;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
    } else {
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
    }

    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.font = '800 10px Fredoka, sans-serif';
    ctx.fillStyle = isNearDanger ? '#f87171' : 'rgba(255, 255, 255, 0.65)';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('⚠️ DANGER LINE', x2 - 6, y - 2);

    ctx.restore();
  }

  drawColumnHighlight(ctx, col) {
    const x = this.boardX + col * this.cellSize;
    const y = this.boardY;
    const h = this.boardH;

    ctx.save();
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0.05)');
    ctx.fillStyle = grad;
    this.drawRoundedRect(ctx, x + 2, y, this.cellSize - 4, h, 10);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 4);
    ctx.lineTo(x + this.cellSize - 10, y + 4);
    ctx.stroke();

    const lowestRow = this.findLowestEmptyRow(col);
    if (lowestRow !== -1 && !this.isGameOver) {
      const ghostX = this.boardX + col * this.cellSize + this.cellSize / 2;
      const ghostY = this.boardY + lowestRow * this.cellSize + this.cellSize / 2;
      ctx.globalAlpha = 0.42;
      this.drawTile(ctx, ghostX, ghostY, this.activeValue, this.cellSize * 0.88, 1.0, true);
    }
    ctx.restore();
  }

  drawGridTiles(ctx) {
    for (let r = 0; r < this.ROWS; r++) {
      for (let c = 0; c < this.COLS; c++) {
        const cell = this.grid[r][c];
        if (cell && cell !== 0) {
          const cx = this.boardX + c * this.cellSize + this.cellSize / 2;
          const cy = this.boardY + r * this.cellSize + this.cellSize / 2;
          const tileSize = this.cellSize * 0.88;

          this.drawTile(ctx, cx, cy, cell.value, tileSize, cell.scale);
        }
      }
    }
  }

  drawTile(ctx, cx, cy, value, size, scale = 1.0, isGhost = false) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const w = size;
    const h = size * 0.88;
    const radius = 16;
    const depth = isGhost ? 0 : 6;

    const style = getTileStyle(value);

    if (!isGhost) {
      ctx.beginPath();
      ctx.ellipse(0, h / 2 + depth + 2, w * 0.45, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 20, 40, 0.28)';
      ctx.fill();

      ctx.fillStyle = style.shadow;
      this.drawRoundedRect(ctx, -w / 2, -h / 2 + depth, w, h, radius);
      ctx.fill();
    }

    const faceGrad = ctx.createLinearGradient(-w / 2, -h / 2, -w / 2, h / 2);
    faceGrad.addColorStop(0, style.bgTop);
    faceGrad.addColorStop(1, style.bgBottom);
    ctx.fillStyle = faceGrad;
    this.drawRoundedRect(ctx, -w / 2, -h / 2, w, h, radius);
    ctx.fill();

    if (!isGhost) {
      ctx.save();
      ctx.beginPath();
      this.drawRoundedRect(ctx, -w / 2 + 2, -h / 2 + 2, w - 4, h * 0.45, radius - 2);
      const specGrad = ctx.createLinearGradient(0, -h / 2, 0, 0);
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      specGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
      ctx.fillStyle = specGrad;
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = style.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (value === 2048) {
      ctx.font = `800 ${Math.floor(size * 0.35)}px 'Fredoka', 'Nunito', sans-serif`;
      ctx.fillText('🍉 2048', 0, 1);
    } else {
      ctx.font = `800 ${Math.floor(size * 0.40)}px 'Fredoka', 'Nunito', sans-serif`;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 2;
      ctx.fillText(value, 0, 1);
    }

    ctx.restore();
  }

  drawDockAndActiveTile(ctx) {
    const cx = this.spawnerX;
    const cy = this.spawnerY;
    const tileSize = this.cellSize * 0.9;

    const nextVal = this.nextQueue[0];
    if (nextVal) {
      ctx.save();
      const screenW = this.display?.logicalWidth || this.canvas?.clientWidth || 400;
      const nextX = Math.min(screenW - tileSize * 0.5 - 10, cx + tileSize * 1.35);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      this.drawRoundedRect(ctx, nextX - tileSize * 0.35, cy - tileSize * 0.35, tileSize * 0.7, tileSize * 0.7, 10);
      ctx.fill();

      ctx.font = '800 9px Fredoka, sans-serif';
      ctx.fillStyle = '#bae6fd';
      ctx.textAlign = 'center';
      ctx.fillText('NEXT', nextX, cy - tileSize * 0.42);

      this.drawTile(ctx, nextX, cy, nextVal, tileSize * 0.6, 0.95);
      ctx.restore();
    }

    if (this.isDragging) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.ellipse(cx, cy, tileSize * 0.45, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      this.drawTile(ctx, this.dragX, this.dragY - 20, this.activeValue, tileSize, 1.12);
    } else {
      this.drawTile(ctx, cx, cy, this.activeValue, tileSize, 1.0);
    }
  }

  drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}

class ScreenController {
  constructor(engine) {
    this.engine = engine;
    this.setupListeners();
    this.renderDifficultyCards();
  }

  showScreen(screenId) {
    const screens = [
      'screen-main-menu',
      'screen-difficulty-select',
      'screen-how-to-play',
      'screen-pause-modal',
      'screen-hint-ad',
      'game-over-modal',
      'victory-banner',
    ];

    screens.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('hidden');
        el.style.display = 'none';
      }
    });

    if (screenId) {
      const target = document.getElementById(screenId);
      if (target) {
        target.classList.remove('hidden');
        target.style.display = 'flex';
      }
    }

    if (this.engine && this.engine.display) {
      this.engine.display.resize();
    }
  }

  setupListeners() {
    const engine = this.engine;

    const playBtn = document.getElementById('btn-play-game');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        engine.sound.playClick();
        this.showScreen(null);
      });
    }

    const openDiffBtn = document.getElementById('btn-open-difficulty');
    if (openDiffBtn) {
      openDiffBtn.addEventListener('click', (e) => {
        e.preventDefault();
        engine.sound.playClick();
        this.renderDifficultyCards();
        this.showScreen('screen-difficulty-select');
      });
    }

    const badgeDiffBtn = document.getElementById('current-difficulty-badge');
    if (badgeDiffBtn) {
      badgeDiffBtn.addEventListener('click', (e) => {
        e.preventDefault();
        engine.sound.playClick();
        this.renderDifficultyCards();
        this.showScreen('screen-difficulty-select');
      });
    }

    document.getElementById('btn-open-tutorial')?.addEventListener('click', (e) => {
      e.preventDefault();
      engine.sound.playClick();
      this.showScreen('screen-how-to-play');
    });

    document.querySelectorAll('.btn-back-to-menu').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        engine.sound.playClick();
        this.showScreen('screen-main-menu');
      });
    });

    document.getElementById('btn-pause-menu')?.addEventListener('click', (e) => {
      e.preventDefault();
      engine.sound.playClick();
      this.showScreen('screen-pause-modal');
    });

    document.getElementById('btn-resume-game')?.addEventListener('click', (e) => {
      e.preventDefault();
      engine.sound.playClick();
      this.showScreen(null);
    });

    document.getElementById('btn-restart-from-pause')?.addEventListener('click', (e) => {
      e.preventDefault();
      engine.sound.playClick();
      this.showScreen(null);
      engine.initGame(engine.difficulty);
    });

    const soundToggle = (e) => {
      e?.preventDefault();
      const enabled = engine.sound.toggle();
      this.updateSoundIcons(enabled);
    };

    document.getElementById('btn-sound-toggle')?.addEventListener('click', soundToggle);
    document.getElementById('btn-sound-menu')?.addEventListener('click', soundToggle);

    document.getElementById('btn-undo')?.addEventListener('click', (e) => {
      e.preventDefault();
      engine.undo();
    });

    document.getElementById('btn-hint')?.addEventListener('click', (e) => {
      e.preventDefault();
      engine.sound.playClick();
      this.startRewardedAdFlow();
    });

    document.getElementById('btn-restart-game')?.addEventListener('click', (e) => {
      e.preventDefault();
      engine.sound.playClick();
      this.showScreen(null);
      engine.initGame(engine.difficulty);
    });

    document.getElementById('btn-next-level')?.addEventListener('click', (e) => {
      e.preventDefault();
      engine.sound.playClick();
      this.showScreen(null);
      engine.continuedAfterWin = true;
      engine.targetTile = 4096;
      engine.updateHUD();
    });
  }

  updateSoundIcons(enabled) {
    const path = enabled
      ? 'M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z'
      : 'M5.586 15H2V9h3.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l4-4m0 4l-4-4';

    document.querySelectorAll('.sound-icon-path').forEach(p => p.setAttribute('d', path));
  }

  renderDifficultyCards() {
    const container = document.getElementById('difficulty-cards-container');
    if (!container) return;
    container.innerHTML = '';

    const list = [
      { id: 'easy', icon: '🟢', cols: 5, rows: 6, title: 'Easy (5x6)', desc: 'More columns and rows. Spacious and ideal for creating huge combos.', colorClass: 'border-emerald-400/40 bg-emerald-950/40 hover:border-emerald-400' },
      { id: 'medium', icon: '🟡', cols: 4, rows: 5, title: 'Medium (4x5)', desc: 'Classic balanced size. Balanced mental challenge.', colorClass: 'border-amber-400/40 bg-amber-950/40 hover:border-amber-400' },
      { id: 'hard', icon: '🔴', cols: 3, rows: 4, title: 'Hard (3x4)', desc: 'Compact grid. Limited room, high risk of crossing the deadline!', colorClass: 'border-rose-400/40 bg-rose-950/40 hover:border-rose-400' },
    ];

    list.forEach(item => {
      const isSelected = this.engine.difficulty === item.id;

      const card = document.createElement('button');
      card.type = 'button';
      card.className = `w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between gap-3 btn-tactile ${item.colorClass} ${
        isSelected ? 'ring-2 ring-white scale-[1.02] shadow-xl' : 'opacity-85'
      }`;

      card.innerHTML = `
        <div class="flex items-center gap-3.5">
          <span class="text-3xl shrink-0">${item.icon}</span>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-black text-white text-base">${item.title}</span>
              ${isSelected ? '<span class="px-2 py-0.5 rounded text-[10px] font-black bg-white text-slate-900 uppercase">Active</span>' : ''}
            </div>
            <p class="text-xs text-sky-200/80 font-medium mt-0.5">${item.desc}</p>
          </div>
        </div>
        <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 font-black text-sm">
          ${isSelected ? '✓' : '→'}
        </div>
      `;

      card.addEventListener('click', () => {
        this.engine.sound.playClick();
        this.engine.setDifficulty(item.id);
        this.showScreen(null);
      });

      container.appendChild(card);
    });
  }

  startRewardedAdFlow() {
    const modal = document.getElementById('screen-hint-ad');
    const timerText = document.getElementById('ad-countdown-timer');
    const progressBar = document.getElementById('ad-progress-bar');
    const claimBtn = document.getElementById('btn-claim-hint');
    const skipBtn = document.getElementById('btn-skip-ad');

    this.showScreen('screen-hint-ad');
    claimBtn.disabled = true;
    claimBtn.classList.add('opacity-50', 'cursor-not-allowed');
    claimBtn.textContent = 'Please wait...';

    let secondsLeft = 5;
    timerText.textContent = `${secondsLeft}s`;
    progressBar.style.width = '0%';

    const interval = setInterval(() => {
      secondsLeft--;
      timerText.textContent = `${secondsLeft}s`;
      progressBar.style.width = `${((5 - secondsLeft) / 5) * 100}%`;

      if (secondsLeft <= 0) {
        clearInterval(interval);
        claimBtn.disabled = false;
        claimBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        claimBtn.classList.add('btn-3d-green');
        claimBtn.textContent = 'Claim Hint! 💡';
      }
    }, 1000);

    const cleanup = () => {
      clearInterval(interval);
      this.showScreen(null);
    };

    skipBtn.onclick = () => {
      cleanup();
      this.engine.sound.playClick();
    };

    claimBtn.onclick = () => {
      cleanup();
      this.engine.applyHint();
    };
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const engine = new GameEngine();
  const screenCtrl = new ScreenController(engine);
  window.gameEngine = engine;
  window.screenController = screenCtrl;
});
