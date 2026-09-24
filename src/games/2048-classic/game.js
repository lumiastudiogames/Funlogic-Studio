// 2048 Classic Game Engine with Smooth Sliding & Star Particle Merges
(function () {
  'use strict';

  // --- Web Audio Engine ---
  const AudioEngine = {
    ctx: null,
    muted: false,
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },
    playSlide() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.05);
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
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const baseFreq = 260 + Math.min(1000, Math.log2(val) * 80);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, now + 0.12);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    },
    playWin() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      [440, 554, 659, 880].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.25);
        osc.start(this.ctx.currentTime + i * 0.1);
        osc.stop(this.ctx.currentTime + i * 0.1 + 0.25);
      });
    }
  };

  const SIZE = 4;
  let tiles = []; // Array of Tile objects { id, r, c, val, prevR, prevC, mergedInto, isNew }
  let tileIdCounter = 1;
  let score = 0;
  let bestScore = parseInt(localStorage.getItem('2048_best') || '0', 10);
  let history = null;
  let startTime = Date.now();
  let wonAlready = false;

  const scoreEl = document.getElementById('score-val');
  const bestEl = document.getElementById('best-val');
  const boardEl = document.getElementById('board');
  const btnSound = document.getElementById('btn-sound');
  const btnUndo = document.getElementById('btn-undo');
  const btnRestart = document.getElementById('btn-restart');

  bestEl.textContent = bestScore;

  // Setup DOM container structure
  boardEl.innerHTML = `
    <div class="grid-background">
      ${Array.from({ length: SIZE * SIZE }).map(() => '<div class="grid-cell-bg"></div>').join('')}
    </div>
    <div id="tile-container" class="tile-container"></div>
  `;
  const tileContainer = document.getElementById('tile-container');

  function initGame() {
    tiles = [];
    tileIdCounter = 1;
    score = 0;
    history = null;
    wonAlready = false;
    startTime = Date.now();
    btnUndo.disabled = true;
    updateScore(0);
    spawnTile();
    spawnTile();
    renderTiles();
  }

  function saveHistory() {
    history = {
      tiles: tiles.map(t => ({ id: t.id, r: t.r, c: t.c, val: t.val })),
      score
    };
    btnUndo.disabled = false;
  }

  function undo() {
    if (!history) return;
    tiles = history.tiles.map(t => ({ ...t }));
    score = history.score;
    history = null;
    btnUndo.disabled = true;
    updateScore(0);
    renderTiles();
  }

  function getTileAt(r, c) {
    return tiles.find(t => t.r === r && t.c === c && !t.mergedInto);
  }

  function spawnTile() {
    const emptyCells = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (!getTileAt(r, c)) {
          emptyCells.push({ r, c });
        }
      }
    }
    if (emptyCells.length === 0) return null;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const val = Math.random() < 0.9 ? 2 : 4;
    const newTile = {
      id: tileIdCounter++,
      r,
      c,
      val,
      prevR: r,
      prevC: c,
      isNew: true
    };
    tiles.push(newTile);
    return newTile;
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

  function spawnStarParticles(r, c, val) {
    const containerRect = tileContainer.getBoundingClientRect();
    const cellW = (containerRect.width - (SIZE - 1) * 10) / SIZE;
    const cellH = (containerRect.height - (SIZE - 1) * 10) / SIZE;
    const x = c * (cellW + 10) + cellW / 2;
    const y = r * (cellH + 10) + cellH / 2;

    const count = 8;
    const stars = ['✨', '⭐', '🌟', '✦', '★'];
    const palette = val >= 1024 
      ? ['#ffd700', '#ff9f43', '#ee5253', '#ffffff'] 
      : ['#ffd700', '#ffaa00', '#fffb96', '#ffffff', '#74b9ff'];

    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      star.className = 'star-sparkle';
      star.textContent = stars[Math.floor(Math.random() * stars.length)];

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const distance = 25 + Math.random() * 35;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const color = palette[Math.floor(Math.random() * palette.length)];

      star.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        font-size: ${14 + Math.random() * 8}px;
        color: ${color};
        text-shadow: 0 0 8px ${color};
        pointer-events: none;
        z-index: 100;
        transform: translate(-50%, -50%) scale(0.2);
        opacity: 1;
        transition: transform 0.4s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.4s ease-out;
      `;

      tileContainer.appendChild(star);

      requestAnimationFrame(() => {
        star.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${0.7 + Math.random() * 0.6}) rotate(${(Math.random() - 0.5) * 140}deg)`;
        star.style.opacity = '0';
      });

      setTimeout(() => star.remove(), 420);
    }
  }

  function renderTiles() {
    tileContainer.innerHTML = '';
    const containerW = tileContainer.clientWidth;
    const gap = 10;
    const cellW = (containerW - (SIZE - 1) * gap) / SIZE;

    tiles.forEach(tile => {
      const el = document.createElement('div');
      const val = tile.val;
      const classKey = val <= 2048 ? `tile-${val}` : 'tile-super';
      el.className = `tile ${classKey}`;
      if (tile.isNew) el.classList.add('tile-new');
      if (tile.isMerged) el.classList.add('tile-merged');

      el.textContent = val;
      el.style.width = `${cellW}px`;
      el.style.height = `${cellW}px`;

      const x = tile.c * (cellW + gap);
      const y = tile.r * (cellW + gap);

      // If tile moved, start from prev position then slide to new position
      if (tile.prevR !== undefined && (tile.prevR !== tile.r || tile.prevC !== tile.c)) {
        const prevX = tile.prevC * (cellW + gap);
        const prevY = tile.prevR * (cellW + gap);
        el.style.transform = `translate(${prevX}px, ${prevY}px)`;
        requestAnimationFrame(() => {
          el.style.transform = `translate(${x}px, ${y}px)`;
        });
      } else {
        el.style.transform = `translate(${x}px, ${y}px)`;
      }

      tileContainer.appendChild(el);
    });

    // Reset temporary flags after render
    tiles.forEach(t => {
      t.isNew = false;
      t.isMerged = false;
      t.prevR = t.r;
      t.prevC = t.c;
    });
  }

  function move(direction) {
    // 0: up, 1: right, 2: down, 3: left
    AudioEngine.init();
    saveHistory();

    const vectors = [
      { r: -1, c: 0 }, // 0: Up
      { r: 0, c: 1 },  // 1: Right
      { r: 2, c: 0 },  // 2: Down
      { r: 0, c: -1 }  // 3: Left
    ];

    let moved = false;
    let totalScoreAdded = 0;
    const mergedPositions = [];

    // Order traversal based on direction
    const rows = [0, 1, 2, 3];
    const cols = [0, 1, 2, 3];
    if (direction === 0) { // Up
      // rows 0..3
    } else if (direction === 2) { // Down
      rows.reverse();
    } else if (direction === 1) { // Right
      cols.reverse();
    } // Left: cols 0..3

    // Build working board representation
    const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
    tiles.forEach(t => {
      board[t.r][t.c] = t;
      t.prevR = t.r;
      t.prevC = t.c;
      t.mergedInto = null;
    });

    const newTiles = [];

    rows.forEach(r => {
      cols.forEach(c => {
        const tile = board[r][c];
        if (!tile) return;

        let nextR = r;
        let nextC = c;

        // Slide as far as possible in the direction
        while (true) {
          const testR = nextR + (direction === 0 ? -1 : direction === 2 ? 1 : 0);
          const testC = nextC + (direction === 3 ? -1 : direction === 1 ? 1 : 0);

          if (testR < 0 || testR >= SIZE || testC < 0 || testC >= SIZE) break;

          const target = board[testR][testC];
          if (!target) {
            board[nextR][nextC] = null;
            board[testR][testC] = tile;
            nextR = testR;
            nextC = testC;
            moved = true;
          } else if (target.val === tile.val && !target.hasMerged && !tile.hasMerged) {
            // Merge with target!
            board[nextR][nextC] = null;
            board[testR][testC] = {
              id: tileIdCounter++,
              r: testR,
              c: testC,
              val: tile.val * 2,
              prevR: r,
              prevC: c,
              isMerged: true,
              hasMerged: true
            };
            totalScoreAdded += tile.val * 2;
            mergedPositions.push({ r: testR, c: testC, val: tile.val * 2 });
            moved = true;
            break;
          } else {
            break;
          }
        }
      });
    });

    if (moved) {
      // Flatten new board state
      const finalTiles = [];
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (board[r][c]) {
            board[r][c].r = r;
            board[r][c].c = c;
            delete board[r][c].hasMerged;
            finalTiles.push(board[r][c]);
          }
        }
      }
      tiles = finalTiles;

      if (totalScoreAdded > 0) {
        AudioEngine.playMerge(totalScoreAdded);
      } else {
        AudioEngine.playSlide();
      }

      updateScore(totalScoreAdded);
      spawnTile();
      renderTiles();

      // Trigger star sparkles on merged positions
      mergedPositions.forEach(p => {
        spawnStarParticles(p.r, p.c, p.val);
      });

      // Check win 2048
      if (!wonAlready && tiles.some(t => t.val >= 2048)) {
        wonAlready = true;
        AudioEngine.playWin();
        const secs = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        try {
          window.parent.postMessage({ type: 'win', time: secs }, '*');
        } catch (e) {}
      }
    } else {
      // Revert history since no move was made
      history = null;
      btnUndo.disabled = true;
    }
  }

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    let handled = false;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      move(0);
      handled = true;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      move(1);
      handled = true;
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      move(2);
      handled = true;
    } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      move(3);
      handled = true;
    }
    if (handled) e.preventDefault();
  });

  // Pointer Drag & Swipe Controls (Touch + Mouse)
  let isPointerDown = false;
  let startX = 0;
  let startY = 0;
  const MIN_DRAG_DIST = 20;

  boardEl.addEventListener('pointerdown', (e) => {
    isPointerDown = true;
    startX = e.clientX;
    startY = e.clientY;
    boardEl.setPointerCapture?.(e.pointerId);
  }, { passive: true });

  boardEl.addEventListener('pointerup', (e) => {
    if (!isPointerDown) return;
    isPointerDown = false;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.hypot(dx, dy) >= MIN_DRAG_DIST) {
      if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? 1 : 3); // Right or Left
      } else {
        move(dy > 0 ? 2 : 0); // Down or Up
      }
    }
  }, { passive: true });

  boardEl.addEventListener('pointercancel', () => {
    isPointerDown = false;
  }, { passive: true });

  // Buttons
  btnRestart.addEventListener('click', initGame);
  btnUndo.addEventListener('click', undo);
  btnSound.addEventListener('click', () => {
    AudioEngine.muted = !AudioEngine.muted;
    btnSound.textContent = AudioEngine.muted ? '🔇' : '🔊';
  });

  window.addEventListener('resize', () => {
    renderTiles();
  });

  initGame();
})();
