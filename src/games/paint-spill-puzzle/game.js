// Paint Spill Puzzle - Color Flood Engine (Vanilla JS)
(function () {
  'use strict';

  const COLOR_PALETTE = [
    { id: 0, hex: '#ef4444', name: 'Vermelho' },
    { id: 1, hex: '#f59e0b', name: 'Amarelo' },
    { id: 2, hex: '#10b981', name: 'Verde' },
    { id: 3, hex: '#0ea5e9', name: 'Azul' },
    { id: 4, hex: '#8b5cf6', name: 'Roxo' },
    { id: 5, hex: '#ec4899', name: 'Rosa' }
  ];

  const LEVELS = [
    { level: 1, size: 10, colors: 4, maxMoves: 22 },
    { level: 2, size: 10, colors: 4, maxMoves: 21 },
    { level: 3, size: 10, colors: 4, maxMoves: 20 },
    { level: 4, size: 10, colors: 4, maxMoves: 19 },
    { level: 5, size: 12, colors: 4, maxMoves: 24 },
    { level: 6, size: 12, colors: 5, maxMoves: 26 },
    { level: 7, size: 12, colors: 5, maxMoves: 25 },
    { level: 8, size: 12, colors: 5, maxMoves: 24 },
    { level: 9, size: 12, colors: 5, maxMoves: 23 },
    { level: 10, size: 12, colors: 5, maxMoves: 22 },
    { level: 11, size: 14, colors: 5, maxMoves: 30 },
    { level: 12, size: 14, colors: 5, maxMoves: 29 },
    { level: 13, size: 14, colors: 5, maxMoves: 28 },
    { level: 14, size: 14, colors: 6, maxMoves: 32 },
    { level: 15, size: 14, colors: 6, maxMoves: 31 },
    { level: 16, size: 14, colors: 6, maxMoves: 30 },
    { level: 17, size: 14, colors: 6, maxMoves: 29 },
    { level: 18, size: 14, colors: 6, maxMoves: 28 },
    { level: 19, size: 14, colors: 6, maxMoves: 27 },
    { level: 20, size: 14, colors: 6, maxMoves: 26 }
  ];

  // Sound Engine
  const Sound = {
    ctx: null,
    muted: false,
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    splash(freq = 440) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    },
    win() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      [523, 659, 784, 1046].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, t + i * 0.09);
        gain.gain.setValueAtTime(0.2, t + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.09);
        osc.stop(t + i * 0.09 + 0.3);
      });
    },
    fail() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, t);
      osc.frequency.linearRampToValueAtTime(100, t + 0.25);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    }
  };

  let currentLevelIdx = 0;
  let maxUnlocked = 1;
  try {
    const saved = localStorage.getItem('paint_spill_progress');
    if (saved) maxUnlocked = Math.max(1, Math.min(20, parseInt(saved, 10) || 1));
  } catch (e) {}

  let grid = [];
  let size = 10;
  let numColors = 4;
  let movesUsed = 0;
  let maxMoves = 22;
  let history = [];
  let isGameOver = false;
  let startTime = Date.now();

  const gridEl = document.getElementById('spill-grid');
  const paletteDock = document.getElementById('palette-dock');
  const levelNumEl = document.getElementById('level-num');
  const movesUsedEl = document.getElementById('moves-used');
  const movesMaxEl = document.getElementById('moves-max');
  const percentValEl = document.getElementById('percent-val');
  const progressFill = document.getElementById('progress-fill');
  const modalWin = document.getElementById('modal-win');
  const modalOver = document.getElementById('modal-over');
  const modalHelp = document.getElementById('modal-help');
  const winStars = document.getElementById('win-stars');
  const winMoves = document.getElementById('win-moves');
  const winMaxMoves = document.getElementById('win-max-moves');
  const btnUndo = document.getElementById('btn-undo');

  function initLevel(lvlIdx = currentLevelIdx) {
    currentLevelIdx = Math.max(0, Math.min(LEVELS.length - 1, lvlIdx));
    const cfg = LEVELS[currentLevelIdx];
    size = cfg.size;
    numColors = cfg.colors;
    maxMoves = cfg.maxMoves;
    movesUsed = 0;
    history = [];
    isGameOver = false;
    startTime = Date.now();

    levelNumEl.textContent = cfg.level;
    movesMaxEl.textContent = maxMoves;
    movesUsedEl.textContent = '0';
    btnUndo.disabled = true;

    modalWin.classList.remove('open');
    modalOver.classList.remove('open');

    // Build random board with seeded randomness
    grid = [];
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        row.push(Math.floor(Math.random() * numColors));
      }
      grid.push(row);
    }

    renderPalette();
    renderBoard();
    updateProgress();
  }

  function getFloodedCells() {
    const visited = Array.from({ length: size }, () => Array(size).fill(false));
    const originColor = grid[0][0];
    const flooded = [];
    const queue = [[0, 0]];
    visited[0][0] = true;

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      flooded.push([r, c]);

      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (let [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
          if (!visited[nr][nc] && grid[nr][nc] === originColor) {
            visited[nr][nc] = true;
            queue.push([nr, nc]);
          }
        }
      }
    }
    return flooded;
  }

  function spillColor(newColorId) {
    if (isGameOver) return;
    const currentColor = grid[0][0];
    if (newColorId === currentColor) return;

    // Save history for undo
    history.push({
      grid: grid.map(row => [...row]),
      movesUsed: movesUsed
    });
    btnUndo.disabled = false;

    movesUsed++;
    movesUsedEl.textContent = movesUsed;
    Sound.splash(300 + newColorId * 80);

    const flooded = getFloodedCells();

    // Change color of already flooded cells
    for (let [r, c] of flooded) {
      grid[r][c] = newColorId;
    }

    // Expand to newly connected cells of newColorId
    const newlyFlooded = getFloodedCells();

    renderBoard(newlyFlooded);
    updateProgress();

    // Check Win
    const totalCells = size * size;
    if (newlyFlooded.length === totalCells) {
      isGameOver = true;
      Sound.win();
      handleWin();
    } else if (movesUsed >= maxMoves) {
      isGameOver = true;
      Sound.fail();
      setTimeout(() => {
        modalOver.classList.add('open');
      }, 350);
    }
  }

  function handleWin() {
    const cfg = LEVELS[currentLevelIdx];
    if (cfg.level >= maxUnlocked && maxUnlocked < 20) {
      maxUnlocked = cfg.level + 1;
      try {
        localStorage.setItem('paint_spill_progress', String(maxUnlocked));
      } catch (e) {}
    }

    const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'win', level: cfg.level, time: elapsed }, '*');
      }
    } catch (e) {}

    // Calculate stars
    const remaining = maxMoves - movesUsed;
    let stars = '⭐⭐⭐';
    if (remaining <= 1) stars = '⭐';
    else if (remaining <= 3) stars = '⭐⭐';

    winStars.textContent = stars;
    winMoves.textContent = movesUsed;
    winMaxMoves.textContent = maxMoves;

    setTimeout(() => {
      modalWin.classList.add('open');
    }, 400);
  }

  function updateProgress() {
    const flooded = getFloodedCells();
    const total = size * size;
    const pct = Math.floor((flooded.length / total) * 100);
    percentValEl.textContent = `${pct}%`;
    progressFill.style.width = `${pct}%`;
  }

  function renderBoard(animatedCells = []) {
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gridEl.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    const animSet = new Set(animatedCells.map(([r, c]) => `${r},${c}`));

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        const colorId = grid[r][c];
        cell.style.backgroundColor = COLOR_PALETTE[colorId].hex;

        if (animSet.has(`${r},${c}`)) {
          cell.classList.add('spill-ripple');
        }

        gridEl.appendChild(cell);
      }
    }

    // Highlight active color in palette
    const activeColor = grid[0][0];
    document.querySelectorAll('.btn-paint').forEach(btn => {
      const id = parseInt(btn.dataset.colorId, 10);
      if (id === activeColor) {
        btn.classList.add('active-spill');
      } else {
        btn.classList.remove('active-spill');
      }
    });
  }

  function renderPalette() {
    paletteDock.innerHTML = '';
    for (let i = 0; i < numColors; i++) {
      const col = COLOR_PALETTE[i];
      const btn = document.createElement('button');
      btn.className = 'btn-paint';
      btn.dataset.colorId = col.id;
      btn.style.backgroundColor = col.hex;
      btn.title = col.name;

      btn.addEventListener('click', () => {
        spillColor(col.id);
      });

      paletteDock.appendChild(btn);
    }
  }

  function undo() {
    if (history.length === 0 || isGameOver) return;
    const prev = history.pop();
    grid = prev.grid;
    movesUsed = prev.movesUsed;
    movesUsedEl.textContent = movesUsed;
    if (history.length === 0) btnUndo.disabled = true;
    renderBoard();
    updateProgress();
    Sound.splash(280);
  }

  // Event Listeners
  btnUndo.addEventListener('click', undo);
  document.getElementById('btn-restart').addEventListener('click', () => initLevel(currentLevelIdx));
  document.getElementById('btn-sound').addEventListener('click', function () {
    Sound.muted = !Sound.muted;
    this.textContent = Sound.muted ? '🔇' : '🔊';
  });

  document.getElementById('btn-help').addEventListener('click', () => modalHelp.classList.add('open'));
  document.getElementById('btn-close-help').addEventListener('click', () => modalHelp.classList.remove('open'));
  document.getElementById('btn-next-level').addEventListener('click', () => {
    initLevel(currentLevelIdx + 1);
  });
  document.getElementById('btn-retry').addEventListener('click', () => {
    initLevel(currentLevelIdx);
  });

  initLevel(Math.min(maxUnlocked - 1, 19));
})();
