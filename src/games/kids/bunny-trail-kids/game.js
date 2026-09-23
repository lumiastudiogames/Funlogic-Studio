// Bunny Trail Kids - 7x7 Garden Maze for Children
(function() {
  'use strict';

  const COLS = 7;
  const ROWS = 7;

  let grid = [];
  let player = { r: 0, c: 0 };
  let goal = { r: 6, c: 6 };
  let visitedPath = [];
  let startTime = Date.now();
  let isWon = false;
  let soundEnabled = true;

  const canvas = document.getElementById('maze-canvas');
  const ctx = canvas.getContext('2d');

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

    if (type === 'hop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.07);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'bump') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      gain.gain.setValueAtTime(0.1, now);
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
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.3);
      });
    }
  }

  // Maze Cell representation with walls: top, right, bottom, left
  class Cell {
    constructor(r, c) {
      this.r = r;
      this.c = c;
      this.walls = [true, true, true, true]; // T, R, B, L
      this.visited = false;
    }
  }

  function generateMaze() {
    grid = [];
    for (let r = 0; r < ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < COLS; c++) {
        grid[r][c] = new Cell(r, c);
      }
    }

    // DFS Recursive Backtracker
    const stack = [];
    const current = grid[0][0];
    current.visited = true;
    stack.push(current);

    while (stack.length > 0) {
      const curr = stack[stack.length - 1];
      const neighbors = getUnvisitedNeighbors(curr);

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        removeWalls(curr, next);
        next.visited = true;
        stack.push(next);
      } else {
        stack.pop();
      }
    }

    // Add extra random openings so the maze is friendly for kids (multiple fun paths)
    for (let i = 0; i < 4; i++) {
      const r = Math.floor(Math.random() * (ROWS - 1));
      const c = Math.floor(Math.random() * (COLS - 1));
      if (Math.random() < 0.5) {
        grid[r][c].walls[1] = false;
        grid[r][c + 1].walls[3] = false;
      } else {
        grid[r][c].walls[2] = false;
        grid[r + 1][c].walls[0] = false;
      }
    }
  }

  function getUnvisitedNeighbors(cell) {
    const list = [];
    const { r, c } = cell;

    if (r > 0 && !grid[r - 1][c].visited) list.push(grid[r - 1][c]);
    if (c < COLS - 1 && !grid[r][c + 1].visited) list.push(grid[r][c + 1]);
    if (r < ROWS - 1 && !grid[r + 1][c].visited) list.push(grid[r + 1][c]);
    if (c > 0 && !grid[r][c - 1].visited) list.push(grid[r][c - 1]);

    return list;
  }

  function removeWalls(a, b) {
    const dr = b.r - a.r;
    const dc = b.c - a.c;

    if (dr === -1) { a.walls[0] = false; b.walls[2] = false; }
    else if (dc === 1) { a.walls[1] = false; b.walls[3] = false; }
    else if (dr === 1) { a.walls[2] = false; b.walls[0] = false; }
    else if (dc === -1) { a.walls[3] = false; b.walls[1] = false; }
  }

  function initGame() {
    generateMaze();
    player = { r: 0, c: 0 };
    goal = { r: ROWS - 1, c: COLS - 1 };
    visitedPath = [{ r: 0, c: 0 }];
    isWon = false;
    startTime = Date.now();
    document.getElementById('win-modal').classList.remove('active');
    draw();
  }

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const size = 308;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    const cellW = size / COLS;
    const cellH = size / ROWS;

    // Grass / background
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(0, 0, size, size);

    // Visited trail (cute paw prints / soft yellow glow)
    ctx.fillStyle = '#ffffff';
    visitedPath.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.c * cellW + cellW / 2, p.r * cellH + cellH / 2, cellW * 0.38, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw walls
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c * cellW;
        const y = r * cellH;
        const walls = grid[r][c].walls;

        ctx.beginPath();
        if (walls[0]) { ctx.moveTo(x, y); ctx.lineTo(x + cellW, y); }
        if (walls[1]) { ctx.moveTo(x + cellW, y); ctx.lineTo(x + cellW, y + cellH); }
        if (walls[2]) { ctx.moveTo(x, y + cellH); ctx.lineTo(x + cellW, y + cellH); }
        if (walls[3]) { ctx.moveTo(x, y); ctx.lineTo(x, y + cellH); }
        ctx.stroke();
      }
    }

    // Draw Goal (Carrot 🥕)
    const goalX = goal.c * cellW + cellW / 2;
    const goalY = goal.r * cellH + cellH / 2 + 8;
    ctx.font = `${Math.floor(cellW * 0.72)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🥕', goalX, goalY);

    // Draw Player (Bunny 🐰)
    const playerX = player.c * cellW + cellW / 2;
    const playerY = player.r * cellH + cellH / 2 + 8;
    ctx.fillText('🐰', playerX, playerY);
  }

  function tryMove(dir) {
    if (isWon) return;

    const curr = grid[player.r][player.c];
    let newR = player.r;
    let newC = player.c;
    let canMove = false;

    if (dir === 'up' && !curr.walls[0] && player.r > 0) {
      newR--;
      canMove = true;
    } else if (dir === 'right' && !curr.walls[1] && player.c < COLS - 1) {
      newC++;
      canMove = true;
    } else if (dir === 'down' && !curr.walls[2] && player.r < ROWS - 1) {
      newR++;
      canMove = true;
    } else if (dir === 'left' && !curr.walls[3] && player.c > 0) {
      newC--;
      canMove = true;
    }

    if (canMove) {
      player.r = newR;
      player.c = newC;
      visitedPath.push({ r: newR, c: newC });
      playSound('hop');
      draw();

      if (player.r === goal.r && player.c === goal.c) {
        handleWin();
      }
    } else {
      playSound('bump');
    }
  }

  function handleWin() {
    isWon = true;
    playSound('win');
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));

    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'win', time: elapsedSeconds }, '*');
      }
    } catch (e) {}

    setTimeout(() => {
      const wtEl = document.getElementById('win-time');
      if (wtEl) wtEl.textContent = `${elapsedSeconds}s`;
      document.getElementById('win-modal').classList.add('active');
    }, 400);
  }

  // Keyboard navigation
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') { e.preventDefault(); tryMove('up'); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); tryMove('right'); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); tryMove('down'); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); tryMove('left'); }
  });

  // Touch Swipe on Canvas
  let touchStartX = 0;
  let touchStartY = 0;
  canvas.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  canvas.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 20) {
      if (absX > absY) {
        tryMove(dx > 0 ? 'right' : 'left');
      } else {
        tryMove(dy > 0 ? 'down' : 'up');
      }
    }
  }, { passive: true });

  // D-pad
  document.getElementById('btn-up').addEventListener('click', () => tryMove('up'));
  document.getElementById('btn-left').addEventListener('click', () => tryMove('left'));
  document.getElementById('btn-down').addEventListener('click', () => tryMove('down'));
  document.getElementById('btn-right').addEventListener('click', () => tryMove('right'));

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-play-again').addEventListener('click', initGame);

  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playSound('hop');
  });

  const howBtn = document.getElementById('btn-how');
  const howModal = document.getElementById('how-modal');
  const closeHowBtn = document.getElementById('btn-close-how');

  howBtn.addEventListener('click', () => {
    howModal.classList.add('active');
    playSound('hop');
  });
  closeHowBtn.addEventListener('click', () => {
    howModal.classList.remove('active');
  });

  initGame();
})();
