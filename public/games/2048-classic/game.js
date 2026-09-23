// 2048 Classic Game Engine (Vanilla JS)
(function () {
  'use strict';

  // --- Web Audio Engine ---
  const AudioEngine = {
    ctx: null,
    muted: false,
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },
    playSlide() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    },
    playMerge(val) {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      const baseFreq = 260 + Math.min(1000, Math.log2(val) * 80);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  };

  const SIZE = 4;
  let grid = [];
  let score = 0;
  let bestScore = parseInt(localStorage.getItem('2048_best') || '0', 10);
  let history = null;
  let startTime = Date.now();
  let wonAlready = false;

  const scoreEl = document.getElementById('score-val');
  const bestEl = document.getElementById('best-val');
  const boardEl = document.getElementById('board');

  bestEl.textContent = bestScore;

  function initGame() {
    grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    score = 0;
    history = null;
    wonAlready = false;
    startTime = Date.now();
    updateScore(0);
    spawnTile();
    spawnTile();
    renderBoard();
  }

  function saveHistory() {
    history = {
      grid: grid.map((r) => [...r]),
      score
    };
    document.getElementById('btn-undo').disabled = false;
  }

  function undo() {
    if (!history) return;
    grid = history.grid;
    score = history.score;
    history = null;
    document.getElementById('btn-undo').disabled = true;
    updateScore(0);
    renderBoard();
  }

  function spawnTile() {
    const emptyCells = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  function updateScore(delta) {
    score += delta;
    scoreEl.textContent = score;
    if (score > bestScore) {
      bestScore = score;
      bestEl.textContent = bestScore;
      localStorage.setItem('2048_best', bestScore.toString());
    }
  }

  function renderBoard(mergedCell = null) {
    boardEl.innerHTML = '';
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const val = grid[r][c];
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        if (val > 0) {
          cell.textContent = val;
          const classKey = val <= 2048 ? `tile-${val}` : 'tile-super';
          cell.classList.add(classKey);
          if (mergedCell && mergedCell.r === r && mergedCell.c === c) {
            cell.classList.add('pop');
          }
        }
        boardEl.appendChild(cell);
      }
    }
  }

  function slideLine(line) {
    const nonZero = line.filter((v) => v !== 0);
    const result = [];
    let lineScore = 0;
    let mergedPos = -1;

    for (let i = 0; i < nonZero.length; i++) {
      if (i < nonZero.length - 1 && nonZero[i] === nonZero[i + 1]) {
        const val = nonZero[i] * 2;
        result.push(val);
        lineScore += val;
        mergedPos = result.length - 1;
        i++; // skip next
      } else {
        result.push(nonZero[i]);
      }
    }
    while (result.length < SIZE) {
      result.push(0);
    }
    return { line: result, lineScore, mergedPos };
  }

  function move(direction) {
    // 0: up, 1: right, 2: down, 3: left
    AudioEngine.init();
    saveHistory();

    let moved = false;
    let totalAdded = 0;
    let maxValInBoard = 0;

    if (direction === 3) {
      // Left
      for (let r = 0; r < SIZE; r++) {
        const original = [...grid[r]];
        const { line, lineScore } = slideLine(original);
        grid[r] = line;
        totalAdded += lineScore;
        if (line.some((v, i) => v !== original[i])) moved = true;
      }
    } else if (direction === 1) {
      // Right
      for (let r = 0; r < SIZE; r++) {
        const original = [...grid[r]].reverse();
        const { line, lineScore } = slideLine(original);
        grid[r] = line.reverse();
        totalAdded += lineScore;
        if (grid[r].some((v, i) => v !== original[SIZE - 1 - i])) moved = true;
      }
    } else if (direction === 0) {
      // Up
      for (let c = 0; c < SIZE; c++) {
        const original = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
        const { line, lineScore } = slideLine(original);
        for (let r = 0; r < SIZE; r++) grid[r][c] = line[r];
        totalAdded += lineScore;
        if (line.some((v, i) => v !== original[i])) moved = true;
      }
    } else if (direction === 2) {
      // Down
      for (let c = 0; c < SIZE; c++) {
        const original = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
        const { line, lineScore } = slideLine(original);
        grid[3][c] = line[0];
        grid[2][c] = line[1];
        grid[1][c] = line[2];
        grid[0][c] = line[3];
        totalAdded += lineScore;
        if (line.some((v, i) => v !== original[i])) moved = true;
      }
    }

    if (moved) {
      if (totalAdded > 0) {
        AudioEngine.playMerge(totalAdded);
      } else {
        AudioEngine.playSlide();
      }
      updateScore(totalAdded);
      spawnTile();
      renderBoard();

      // Check 2048 Win condition
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (grid[r][c] >= 2048) maxValInBoard = Math.max(maxValInBoard, grid[r][c]);
        }
      }

      if (maxValInBoard >= 2048 && !wonAlready) {
        wonAlready = true;
        const TIME = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        // Golden rule: notify platform win
        window.parent.postMessage({ type: 'win', time: TIME }, '*');
      }
    }
  }

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        move(0);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        move(1);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        move(2);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        move(3);
        break;
    }
  });

  // Touch Swipe controls
  let touchStartX = 0;
  let touchStartY = 0;

  boardEl.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  boardEl.addEventListener('touchend', (e) => {
    if (e.changedTouches.length > 0) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (Math.max(absX, absY) > 30) {
        if (absX > absY) {
          move(dx > 0 ? 1 : 3);
        } else {
          move(dy > 0 ? 2 : 0);
        }
      }
    }
  }, { passive: true });

  // D-Pad buttons
  document.querySelectorAll('[data-dir]').forEach((btn) => {
    btn.addEventListener('click', () => {
      move(parseInt(btn.getAttribute('data-dir'), 10));
    });
  });

  // UI buttons
  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-undo').addEventListener('click', undo);
  document.getElementById('btn-sound').addEventListener('click', function () {
    AudioEngine.muted = !AudioEngine.muted;
    this.innerHTML = AudioEngine.muted ? '🔇' : '🔊';
  });

  initGame();
})();
