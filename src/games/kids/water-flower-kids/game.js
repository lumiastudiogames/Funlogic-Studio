// Water to Flower Kids - 3x3 Pipe Grid Connection Board for Children
(function() {
  'use strict';

  // Openings order: [Top, Right, Bottom, Left]
  const BASE_PIPES = {
    straight: [false, true, false, true], // 0 deg: horizontal
    corner:   [false, true, true, false], // 0 deg: right & bottom (L)
    tpipe:    [false, true, true, true],  // 0 deg: right, bottom, left (T)
  };

  const GRID_SIZE = 3;
  let grid = [];
  let isWon = false;
  let startTime = Date.now();
  let soundEnabled = true;

  // Web Audio Synthesizer
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'turn') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'win') {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.35);
      });
    }
  }

  function getRotatedOpenings(base, rotStep) {
    const res = [false, false, false, false];
    for (let i = 0; i < 4; i++) {
      if (base[i]) {
        res[(i + rotStep) % 4] = true;
      }
    }
    return res;
  }

  // Pre-configured curated solvable configurations
  const PUZZLE_LEVELS = [
    // Level 1: L-curves & straights
    [
      { type: 'corner', targetRot: 0 },   // (0,0) right & bottom
      { type: 'straight', targetRot: 0 }, // (0,1) left & right
      { type: 'corner', targetRot: 1 },   // (0,2) bottom & left
      { type: 'straight', targetRot: 1 }, // (1,0) top & bottom
      { type: 'corner', targetRot: 0 },   // (1,1)
      { type: 'straight', targetRot: 1 }, // (1,2) top & bottom
      { type: 'corner', targetRot: 3 },   // (2,0)
      { type: 'straight', targetRot: 0 }, // (2,1) left & right
      { type: 'corner', targetRot: 2 },   // (2,2) top & left
    ]
  ];

  function initGame() {
    isWon = false;
    startTime = Date.now();
    const winModal = document.getElementById('win-modal');
    if (winModal) winModal.classList.remove('active');
    const flower = document.getElementById('flower-box');
    if (flower) flower.classList.remove('blooming');

    const template = PUZZLE_LEVELS[0];
    grid = [];

    for (let r = 0; r < GRID_SIZE; r++) {
      const row = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        const item = template[r * GRID_SIZE + c];
        // Start scrambled
        const randRot = (item.targetRot + Math.floor(Math.random() * 3) + 1) % 4;
        row.push({
          type: item.type,
          base: BASE_PIPES[item.type],
          rotation: randRot * 90,
          rotStep: randRot,
          targetRot: item.targetRot,
          flowing: false
        });
      }
      grid.push(row);
    }

    renderBoard();
    checkFlow();
  }

  function renderBoard() {
    const board = document.getElementById('pipes-grid');
    if (!board) return;
    board.innerHTML = '';

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = grid[r][c];
        const tile = document.createElement('div');
        tile.className = 'pipe-tile' + (cell.flowing ? ' flowing' : '');
        tile.dataset.r = r;
        tile.dataset.c = c;

        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        canvas.className = 'pipe-canvas';
        drawPipeCanvas(canvas, cell);

        tile.appendChild(canvas);
        tile.addEventListener('click', () => rotatePipe(r, c));
        board.appendChild(tile);
      }
    }
  }

  function drawPipeCanvas(canvas, cell) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 120, 120);

    ctx.save();
    ctx.translate(60, 60);
    ctx.rotate((cell.rotation * Math.PI) / 180);
    ctx.translate(-60, -60);

    const pipeColor = cell.flowing ? '#38bdf8' : '#94a3b8';
    const innerColor = cell.flowing ? '#bae6fd' : '#cbd5e1';
    const borderCol = cell.flowing ? '#0284c7' : '#64748b';

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const openings = cell.base; // [Top, Right, Bottom, Left]

    // Draw central hub
    ctx.fillStyle = pipeColor;
    ctx.beginPath();
    ctx.arc(60, 60, 22, 0, Math.PI * 2);
    ctx.fill();

    // Draw pipe branches
    if (openings[0]) drawBranch(ctx, 60, 60, 60, 0, pipeColor, innerColor, borderCol);   // Top
    if (openings[1]) drawBranch(ctx, 60, 60, 120, 60, pipeColor, innerColor, borderCol); // Right
    if (openings[2]) drawBranch(ctx, 60, 60, 60, 120, pipeColor, innerColor, borderCol); // Bottom
    if (openings[3]) drawBranch(ctx, 60, 60, 0, 60, pipeColor, innerColor, borderCol);   // Left

    // Inner bright water core
    ctx.fillStyle = innerColor;
    ctx.beginPath();
    ctx.arc(60, 60, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawBranch(ctx, x1, y1, x2, y2, outerCol, innerCol, borderCol) {
    // Outer pipe
    ctx.strokeStyle = borderCol;
    ctx.lineWidth = 26;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.strokeStyle = outerCol;
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Inner water core
    ctx.strokeStyle = innerCol;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  function rotatePipe(r, c) {
    if (isWon) return;
    const cell = grid[r][c];
    cell.rotStep = (cell.rotStep + 1) % 4;
    cell.rotation += 90;
    playSound('turn');

    renderBoard();
    checkFlow();
  }

  // Check if water flows from top-left (0,0) [connected to tap on left] to bottom-right (2,2) [connected to flower on right]
  function checkFlow() {
    // Reset flowing flags
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        grid[r][c].flowing = false;
      }
    }

    // Source tap enters at (0,0) from the Left (direction 3)
    const startCell = grid[0][0];
    const startOpenings = getRotatedOpenings(startCell.base, startCell.rotStep);

    // If cell (0,0) does not open to the left, water cannot even enter
    if (!startOpenings[3]) {
      renderBoard();
      return;
    }

    // BFS from (0,0)
    const queue = [{ r: 0, c: 0 }];
    const visited = new Set(['0,0']);
    startCell.flowing = true;

    // Direction offsets: 0: Up (-1, 0), 1: Right (0, +1), 2: Down (+1, 0), 3: Left (0, -1)
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];
    const oppositeDir = [2, 3, 0, 1];

    let reachedGoal = false;

    while (queue.length > 0) {
      const cur = queue.shift();
      const curCell = grid[cur.r][cur.c];
      const curOpenings = getRotatedOpenings(curCell.base, curCell.rotStep);

      // Check if current is (2,2) and opens to Right (direction 1) to exit to Flower!
      if (cur.r === 2 && cur.c === 2 && curOpenings[1]) {
        reachedGoal = true;
      }

      for (let dir = 0; dir < 4; dir++) {
        if (!curOpenings[dir]) continue;
        const nr = cur.r + dr[dir];
        const nc = cur.c + dc[dir];

        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
          const neighbor = grid[nr][nc];
          const nOpenings = getRotatedOpenings(neighbor.base, neighbor.rotStep);
          // Check if neighbor opens back towards current
          if (nOpenings[oppositeDir[dir]]) {
            const key = `${nr},${nc}`;
            if (!visited.has(key)) {
              visited.add(key);
              neighbor.flowing = true;
              queue.push({ r: nr, c: nc });
            }
          }
        }
      }
    }

    renderBoard();

    if (reachedGoal && !isWon) {
      isWon = true;
      playSound('win');

      const flower = document.getElementById('flower-box');
      if (flower) flower.classList.add('blooming');

      const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      const winTimeEl = document.getElementById('win-time');
      if (winTimeEl) winTimeEl.textContent = `${elapsed}s`;

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'win', time: elapsed }, '*');
      }

      setTimeout(() => {
        const winModal = document.getElementById('win-modal');
        if (winModal) winModal.classList.add('active');
      }, 700);
    }
  }

  // Event bindings
  window.addEventListener('DOMContentLoaded', () => {
    initGame();

    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) restartBtn.addEventListener('click', initGame);

    const playAgainBtn = document.getElementById('btn-play-again');
    if (playAgainBtn) playAgainBtn.addEventListener('click', initGame);

    const soundBtn = document.getElementById('btn-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
      });
    }

    const howBtn = document.getElementById('btn-how');
    const closeHowBtn = document.getElementById('btn-close-how');
    const howModal = document.getElementById('how-modal');

    if (howBtn && howModal) howBtn.addEventListener('click', () => howModal.classList.add('active'));
    if (closeHowBtn && howModal) closeHowBtn.addEventListener('click', () => howModal.classList.remove('active'));
  });

})();
