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

  let animFrameId = null;
  let visualPlayer = { x: 0, y: 0 };
  let animTime = 0;

  function initGame() {
    generateMaze();
    player = { r: 0, c: 0 };
    goal = { r: ROWS - 1, c: COLS - 1 };
    visualPlayer = { x: 0, y: 0 };
    visitedPath = [{ r: 0, c: 0 }];
    isWon = false;
    startTime = Date.now();
    document.getElementById('win-modal').classList.remove('active');
    
    if (!animFrameId) {
      animLoop();
    }
  }

  function animLoop() {
    animTime += 0.04;
    // Smoothly interpolate visual player to actual grid position
    visualPlayer.x += (player.c - visualPlayer.x) * 0.25;
    visualPlayer.y += (player.r - visualPlayer.y) * 0.25;

    draw();
    animFrameId = requestAnimationFrame(animLoop);
  }

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const size = 320;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    const cellW = size / COLS;
    const cellH = size / ROWS;

    // Grass / background with subtle 3D lawn tiles
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#bbf7d0' : '#86efac';
        ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
      }
    }

    // Visited trail (cute soft white stepping stones)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    visitedPath.forEach(p => {
      ctx.beginPath();
      ctx.ellipse(p.c * cellW + cellW / 2, p.r * cellH + cellH / 2 + 2, cellW * 0.32, cellH * 0.24, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw 3D Maze Hedge Walls (dark green shadow + vibrant hedge top)
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = c * cellW;
        const y = r * cellH;
        const walls = grid[r][c].walls;

        // Shadow pass
        ctx.strokeStyle = 'rgba(20, 83, 45, 0.4)';
        ctx.lineWidth = 7;
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (walls[0]) { ctx.moveTo(x, y + 2); ctx.lineTo(x + cellW, y + 2); }
        if (walls[1]) { ctx.moveTo(x + cellW, y + 2); ctx.lineTo(x + cellW, y + cellH + 2); }
        if (walls[2]) { ctx.moveTo(x, y + cellH + 2); ctx.lineTo(x + cellW, y + cellH + 2); }
        if (walls[3]) { ctx.moveTo(x, y + 2); ctx.lineTo(x, y + cellH + 2); }
        ctx.stroke();

        // Main Hedge Top
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 6;
        ctx.beginPath();
        if (walls[0]) { ctx.moveTo(x, y); ctx.lineTo(x + cellW, y); }
        if (walls[1]) { ctx.moveTo(x + cellW, y); ctx.lineTo(x + cellW, y + cellH); }
        if (walls[2]) { ctx.moveTo(x, y + cellH); ctx.lineTo(x + cellW, y + cellH); }
        if (walls[3]) { ctx.moveTo(x, y); ctx.lineTo(x, y + cellH); }
        ctx.stroke();
      }
    }

    // Draw Floating Goal (Carrot 🥕) with 3D shadow and bobbing
    const carrotFloat = Math.sin(animTime * 3) * 5;
    const goalX = goal.c * cellW + cellW / 2;
    const goalY = goal.r * cellH + cellH / 2;

    // Carrot Shadow (shrinks when floating up)
    const shadowScale = Math.max(0.6, 1 - (carrotFloat + 5) * 0.04);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(goalX, goalY + cellH * 0.35, cellW * 0.28 * shadowScale, cellH * 0.12 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // High-Resolution Crisp Vector Carrot (never transparent or faded)
    ctx.save();
    ctx.translate(goalX, goalY + carrotFloat);
    const carrotScale = (cellW / 46) * 0.9;
    ctx.scale(carrotScale, carrotScale);

    // Green leafy top
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(-4, -12, 4, 9, -0.4, 0, Math.PI * 2);
    ctx.ellipse(0, -15, 4.5, 11, 0, 0, Math.PI * 2);
    ctx.ellipse(4, -12, 4, 9, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Vibrant Orange Carrot Body
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-11, -7);
    ctx.quadraticCurveTo(-12, 5, 0, 18);
    ctx.quadraticCurveTo(12, 5, 11, -7);
    ctx.quadraticCurveTo(0, -10, -11, -7);
    ctx.closePath();
    ctx.fill();

    // Carrot border
    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Carrot detail wrinkles / texture lines
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-6, -2); ctx.lineTo(1, -1);
    ctx.moveTo(0, 4);   ctx.lineTo(6, 5);
    ctx.moveTo(-4, 9);  ctx.lineTo(3, 10);
    ctx.stroke();

    // Shiny gloss highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.beginPath();
    ctx.ellipse(-4, -1, 2.5, 7, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw Floating Bunny 🐰 with 3D shadow and hop/float bobbing
    const bunnyHop = Math.sin(animTime * 4) * 4;
    const px = visualPlayer.x * cellW + cellW / 2;
    const py = visualPlayer.y * cellH + cellH / 2;

    // Bunny Shadow
    const bShadowScale = Math.max(0.6, 1 - (bunnyHop + 4) * 0.05);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(px, py + cellH * 0.35, cellW * 0.34 * bShadowScale, cellH * 0.14 * bShadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // High-Resolution Crisp Vector Bunny (100% solid, super cute & vivid)
    ctx.save();
    ctx.translate(px, py + bunnyHop);
    const bunnyScale = (cellW / 46) * 0.95;
    ctx.scale(bunnyScale, bunnyScale);

    // Bunny Ears (Back / Outer)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    // Left ear
    ctx.beginPath();
    ctx.ellipse(-7, -14, 5, 11, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Right ear
    ctx.beginPath();
    ctx.ellipse(7, -14, 5, 11, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Inner pink ears
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.ellipse(-7, -14, 2.6, 7.5, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(7, -14, 2.6, 7.5, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Bunny Round Face / Head
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 2, 14, 12.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cheerful Rosy Cheeks
    ctx.fillStyle = 'rgba(251, 113, 133, 0.5)';
    ctx.beginPath();
    ctx.arc(-8, 5, 3.2, 0, Math.PI * 2);
    ctx.arc(8, 5, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Shiny Black Eyes with White Catchlights
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-5.5, 1, 2.4, 0, Math.PI * 2);
    ctx.arc(5.5, 1, 2.4, 0, Math.PI * 2);
    ctx.fill();
    // Eye shines
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-6.2, 0.2, 0.9, 0, Math.PI * 2);
    ctx.arc(4.8, 0.2, 0.9, 0, Math.PI * 2);
    ctx.fill();

    // Cute Little Pink Nose
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.moveTo(0, 3.2);
    ctx.lineTo(-2, 4.8);
    ctx.lineTo(2, 4.8);
    ctx.closePath();
    ctx.fill();

    // Whiskers & Mouth
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    // Mouth curves
    ctx.beginPath();
    ctx.arc(-1.6, 6.2, 1.8, Math.PI * 0.1, Math.PI * 0.9, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(1.6, 6.2, 1.8, Math.PI * 0.1, Math.PI * 0.9, false);
    ctx.stroke();
    // Whiskers
    ctx.beginPath();
    ctx.moveTo(-7, 3.5); ctx.lineTo(-13, 2.5);
    ctx.moveTo(-7, 5.5); ctx.lineTo(-13, 6);
    ctx.moveTo(7, 3.5);  ctx.lineTo(13, 2.5);
    ctx.moveTo(7, 5.5);  ctx.lineTo(13, 6);
    ctx.stroke();

    ctx.restore();
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

  // Touch & Mouse Drag / Swipe on Canvas
  let dragStartX = 0;
  let dragStartY = 0;
  let isDragging = false;

  canvas.addEventListener('touchstart', e => {
    if (e.touches.length > 0) {
      dragStartX = e.touches[0].clientX;
      dragStartY = e.touches[0].clientY;
      isDragging = true;
    }
  }, { passive: true });

  canvas.addEventListener('touchend', e => {
    if (!isDragging || !e.changedTouches.length) return;
    isDragging = false;
    const dx = e.changedTouches[0].clientX - dragStartX;
    const dy = e.changedTouches[0].clientY - dragStartY;
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

  canvas.addEventListener('mousedown', e => {
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    isDragging = true;
  });

  window.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 20) {
      if (absX > absY) {
        tryMove(dx > 0 ? 'right' : 'left');
      } else {
        tryMove(dy > 0 ? 'down' : 'up');
      }
    }
  });

  // Optional D-pad fallback
  document.getElementById('btn-up')?.addEventListener('click', () => tryMove('up'));
  document.getElementById('btn-left')?.addEventListener('click', () => tryMove('left'));
  document.getElementById('btn-down')?.addEventListener('click', () => tryMove('down'));
  document.getElementById('btn-right')?.addEventListener('click', () => tryMove('right'));

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
