// Campo Minado Retrô Engine (Vanilla JS)
(function () {
  'use strict';

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
    playClick() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    },
    playFlag() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(550, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    },
    playExplosion() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(40, now + 0.35);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    },
    playWin() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      [523, 659, 783, 1046].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.09);
        gain.gain.setValueAtTime(0.25, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.25);
      });
    }
  };

  const PRESETS = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 12, cols: 12, mines: 22 },
    hard: { rows: 14, cols: 14, mines: 35 }
  };

  let currentDiff = 'easy';
  let rows = 9;
  let cols = 9;
  let totalMines = 10;
  let flagsLeft = 10;
  let grid = []; // { isMine, revealed, flagged, count }
  let firstClick = true;
  let gameOver = false;
  let flagMode = false;
  let timerInterval = null;
  let elapsedSeconds = 0;

  const boardEl = document.getElementById('mine-grid');
  const flagsEl = document.getElementById('flags-left');
  const timerEl = document.getElementById('timer');
  const faceBtn = document.getElementById('face-btn');
  const btnFlagToggle = document.getElementById('btn-flag-toggle');

  function initGame(diff = currentDiff) {
    currentDiff = diff;
    const p = PRESETS[diff];
    rows = p.rows;
    cols = p.cols;
    totalMines = p.mines;
    flagsLeft = totalMines;
    firstClick = true;
    gameOver = false;
    elapsedSeconds = 0;

    clearInterval(timerInterval);
    timerEl.textContent = '000';
    faceBtn.textContent = '🙂';
    flagsEl.textContent = String(flagsLeft).padStart(3, '0');

    // Create empty grid
    grid = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push({ isMine: false, revealed: false, flagged: false, count: 0 });
      }
      grid.push(row);
    }

    renderGrid();
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      timerEl.textContent = String(Math.min(999, elapsedSeconds)).padStart(3, '0');
    }, 1000);
  }

  function placeMines(excludeR, excludeC) {
    let placed = 0;
    while (placed < totalMines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      // Exclude first clicked cell and its 8 neighbors for a friendly start
      const isAroundFirst = Math.abs(r - excludeR) <= 1 && Math.abs(c - excludeC) <= 1;
      if (!grid[r][c].isMine && !isAroundFirst) {
        grid[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighboring mine numbers
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!grid[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isMine) {
                count++;
              }
            }
          }
          grid[r][c].count = count;
        }
      }
    }
  }

  function renderGrid() {
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        const cellEl = document.createElement('div');
        cellEl.className = 'cell';

        if (cell.revealed) {
          cellEl.classList.add('cell-revealed');
          if (cell.isMine) {
            cellEl.classList.add('cell-mine-exploded');
            cellEl.textContent = '💣';
          } else if (cell.count > 0) {
            cellEl.classList.add(`num-${cell.count}`);
            cellEl.textContent = cell.count;
          }
        } else {
          cellEl.classList.add('cell-unrevealed');
          if (cell.flagged) {
            cellEl.textContent = '🚩';
          }
        }

        cellEl.addEventListener('click', (e) => onCellClick(r, c, e));
        cellEl.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          toggleFlag(r, c);
        });

        boardEl.appendChild(cellEl);
      }
    }
  }

  function onCellClick(r, c, e) {
    if (gameOver) return;
    AudioEngine.init();

    if (flagMode) {
      toggleFlag(r, c);
      return;
    }

    const cell = grid[r][c];
    if (cell.flagged || cell.revealed) return;

    if (firstClick) {
      firstClick = false;
      placeMines(r, c);
      startTimer();
    }

    if (cell.isMine) {
      // Boom!
      cell.revealed = true;
      gameOver = true;
      clearInterval(timerInterval);
      faceBtn.textContent = '😵';
      AudioEngine.playExplosion();

      // Reveal all mines
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (grid[i][j].isMine) grid[i][j].revealed = true;
        }
      }
      renderGrid();
    } else {
      AudioEngine.playClick();
      revealCell(r, c);
      renderGrid();
      checkWin();
    }
  }

  function revealCell(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    const cell = grid[r][c];
    if (cell.revealed || cell.flagged || cell.isMine) return;

    cell.revealed = true;
    if (cell.count === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          revealCell(r + dr, c + dc);
        }
      }
    }
  }

  function toggleFlag(r, c) {
    if (gameOver) return;
    const cell = grid[r][c];
    if (cell.revealed) return;

    AudioEngine.init();
    AudioEngine.playFlag();

    cell.flagged = !cell.flagged;
    flagsLeft += cell.flagged ? -1 : 1;
    flagsEl.textContent = String(flagsLeft).padStart(3, '0');
    renderGrid();
  }

  function checkWin() {
    let unrevealedSafe = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!grid[r][c].isMine && !grid[r][c].revealed) {
          unrevealedSafe++;
        }
      }
    }

    if (unrevealedSafe === 0) {
      gameOver = true;
      clearInterval(timerInterval);
      faceBtn.textContent = '😎';
      AudioEngine.playWin();

      // Auto flag all mines
      flagsEl.textContent = '000';
      const elapsed = Math.max(1, elapsedSeconds);
      window.parent.postMessage({ type: 'win', time: elapsed }, '*');
    }
  }

  // Flag toggle button for mobile touch
  btnFlagToggle.addEventListener('click', function () {
    flagMode = !flagMode;
    this.classList.toggle('active', flagMode);
    this.textContent = flagMode ? '🚩 FLAG: ON' : '⛏️ DIG MODE';
  });

  faceBtn.addEventListener('click', () => initGame(currentDiff));

  // Difficulty buttons
  document.querySelectorAll('.btn-diff').forEach((btn) => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.btn-diff').forEach((b) => b.classList.remove('active'));
      this.classList.add('active');
      const diff = this.getAttribute('data-diff');
      initGame(diff);
    });
  });

  document.getElementById('btn-sound').addEventListener('click', function () {
    AudioEngine.muted = !AudioEngine.muted;
    this.innerHTML = AudioEngine.muted ? '🔇' : '🔊';
  });

  initGame('easy');
})();
