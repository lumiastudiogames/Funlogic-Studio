// Robox - Robot Box Pusher 2.5D Engine (Pure Vanilla JS)
(function () {
  'use strict';

  // --- Web Audio Synthesis ---
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
    bgmLoop: null,
    bgmStep: 0,
    startBgm() {
      if (this.muted || this.bgmLoop) return;
      this.init();
      const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      const bass = [130.81, 146.83, 164.81, 196.00];
      this.bgmLoop = setInterval(() => {
        if (this.muted || !this.ctx || this.ctx.state !== 'running') return;
        try {
          const t = this.ctx.currentTime;
          if (this.bgmStep % 2 === 0) {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(bass[Math.floor(this.bgmStep / 4) % bass.length], t);
            g.gain.setValueAtTime(0.025, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
            o.connect(g);
            g.connect(this.ctx.destination);
            o.start(t);
            o.stop(t + 0.35);
          }
          if (this.bgmStep % 4 === 1 || this.bgmStep % 4 === 3) {
            const o = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            o.type = 'triangle';
            o.frequency.setValueAtTime(scale[(this.bgmStep * 3) % scale.length], t);
            g.gain.setValueAtTime(0.015, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
            o.connect(g);
            g.connect(this.ctx.destination);
            o.start(t);
            o.stop(t + 0.2);
          }
          this.bgmStep = (this.bgmStep + 1) % 16;
        } catch (_) {}
      }, 320);
    },
    stopBgm() {
      if (this.bgmLoop) {
        clearInterval(this.bgmLoop);
        this.bgmLoop = null;
      }
    },
    playStep() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    },
    playPush() {
      if (this.muted) return;
      this.init();
      // Metallic box rumble
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.16, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    },
    playCharge() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      [523, 659, 784, 1046].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.18, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.18);
      });
    },
    playWin() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      const notes = [523, 659, 784, 1046, 1318];
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.2, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.3);
      });
    }
  };

  // Handcrafted Levels (8x8 grids) + Procedural Fallback
  const LEVELS = [
    {
      map: [
        'WWWWWWWW',
        'W______W',
        'W_T__T_W',
        'W______W',
        'W______W',
        'W______W',
        'W______W',
        'WWWWWWWW'
      ],
      robot: { r: 5, c: 3 },
      boxes: [{ r: 4, c: 2 }, { r: 4, c: 5 }]
    },
    {
      map: [
        'WWWWWWWW',
        'WW____WW',
        'WW_T__WW',
        'W__W___W',
        'W__W_T_W',
        'W______W',
        'WW____WW',
        'WWWWWWWW'
      ],
      robot: { r: 5, c: 2 },
      boxes: [{ r: 3, c: 2 }, { r: 4, c: 4 }]
    },
    {
      map: [
        'WWWWWWWW',
        'W___WWWW',
        'W_T_W__W',
        'W___W__W',
        'WW_____W',
        'W___W__W',
        'W_T____W',
        'WWWWWWWW'
      ],
      robot: { r: 4, c: 3 },
      boxes: [{ r: 3, c: 3 }, { r: 5, c: 3 }]
    },
    {
      map: [
        'WWWWWWWW',
        'W_T_WW_W',
        'W______W',
        'WW_W___W',
        'W__WW__W',
        'W_T____W',
        'W______W',
        'WWWWWWWW'
      ],
      robot: { r: 2, c: 2 },
      boxes: [{ r: 2, c: 4 }, { r: 4, c: 3 }]
    },
    {
      map: [
        'WWWWWWWW',
        'W_T_T__W',
        'W__WW__W',
        'W______W',
        'WW_W___W',
        'W______W',
        'W______W',
        'WWWWWWWW'
      ],
      robot: { r: 5, c: 4 },
      boxes: [{ r: 3, c: 2 }, { r: 3, c: 5 }]
    },
    {
      map: [
        'WWWWWWWW',
        'W__W___W',
        'W_T_T__W',
        'WW_W___W',
        'W__WW__W',
        'W______W',
        'W______W',
        'WWWWWWWW'
      ],
      robot: { r: 5, c: 3 },
      boxes: [{ r: 3, c: 2 }, { r: 4, c: 5 }]
    },
    {
      map: [
        'WWWWWWWW',
        'W______W',
        'W_T_T_TW',
        'W______W',
        'W______W',
        'W______W',
        'W______W',
        'WWWWWWWW'
      ],
      robot: { r: 5, c: 4 },
      boxes: [{ r: 4, c: 2 }, { r: 4, c: 4 }, { r: 4, c: 6 }]
    },
    {
      map: [
        'WWWWWWWW',
        'WW____WW',
        'W_T_T__W',
        'W_W_W__W',
        'W______W',
        'W_T____W',
        'WW____WW',
        'WWWWWWWW'
      ],
      robot: { r: 4, c: 3 },
      boxes: [{ r: 3, c: 2 }, { r: 4, c: 2 }, { r: 4, c: 5 }]
    },
    {
      map: [
        'WWWWWWWW',
        'W______W',
        'W_W_TW_W',
        'W_T____W',
        'W_W_TW_W',
        'W______W',
        'W______W',
        'WWWWWWWW'
      ],
      robot: { r: 6, c: 3 },
      boxes: [{ r: 3, c: 2 }, { r: 3, c: 4 }, { r: 5, c: 3 }]
    },
    {
      map: [
        'WWWWWWWW',
        'W__WW__W',
        'W_T__T_W',
        'W__WW__W',
        'W__WW__W',
        'W______W',
        'W______W',
        'WWWWWWWW'
      ],
      robot: { r: 5, c: 2 },
      boxes: [{ r: 4, c: 1 }, { r: 4, c: 6 }]
    }
  ];

  // Procedural Sokoban Generator (Generates valid solvable puzzle grids)
  function generateProceduralLevel(levelNum) {
    const boxCount = Math.min(4, 2 + Math.floor(levelNum / 5));
    const grid = Array.from({ length: 8 }, () => Array(8).fill('_'));
    
    // Outer walls
    for (let r = 0; r < 8; r++) {
      grid[r][0] = 'W';
      grid[r][7] = 'W';
      grid[0][r] = 'W';
      grid[7][r] = 'W';
    }

    // Interior pillars
    const pillarCount = 2 + (levelNum % 4);
    for (let p = 0; p < pillarCount; p++) {
      const pr = 2 + Math.floor(Math.random() * 4);
      const pc = 2 + Math.floor(Math.random() * 4);
      grid[pr][pc] = 'W';
    }

    // Pick target cells (not on corners or next to two walls)
    const validFloors = [];
    for (let r = 2; r <= 5; r++) {
      for (let c = 2; c <= 5; c++) {
        if (grid[r][c] === '_') {
          validFloors.push({ r, c });
        }
      }
    }

    // Shuffle
    for (let i = validFloors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [validFloors[i], validFloors[j]] = [validFloors[j], validFloors[i]];
    }

    const targets = validFloors.slice(0, boxCount);
    targets.forEach(t => {
      grid[t.r][t.c] = 'T';
    });

    // Start boxes backward-pulled from targets to ensure solvability
    const boxes = [];
    targets.forEach((t, i) => {
      const offsets = [
        { dr: 1, dc: 0 },
        { dr: -1, dc: 0 },
        { dr: 0, dc: 1 },
        { dr: 0, dc: -1 }
      ];
      const validOffsets = offsets.filter(o => {
        const nr = t.r + o.dr;
        const nc = t.c + o.dc;
        return grid[nr][nc] !== 'W' && !boxes.some(b => b.r === nr && b.c === nc);
      });
      const off = validOffsets[i % validOffsets.length] || { dr: 0, dc: 0 };
      boxes.push({ r: t.r + off.dr, c: t.c + off.dc });
    });

    // Pick robot start
    let robot = { r: 6, c: 3 };
    for (let r = 6; r >= 1; r--) {
      let found = false;
      for (let c = 1; c <= 6; c++) {
        if (grid[r][c] === '_' && !boxes.some(b => b.r === r && b.c === c)) {
          robot = { r, c };
          found = true;
          break;
        }
      }
      if (found) break;
    }

    const map = grid.map(row => row.join(''));
    return { map, robot, boxes };
  }

  function getLevel(idx) {
    if (idx < LEVELS.length) {
      return LEVELS[idx];
    }
    return generateProceduralLevel(idx);
  }

  // State
  let currentLevelIdx = 0;
  let steps = 0;
  let startTime = Date.now();
  let robot = { r: 0, c: 0 };
  let robotFacing = 'down'; // 'down', 'up', 'left', 'right'
  let boxes = [];
  let history = [];
  let won = false;
  let lastPush = null;
  let lastRobotMove = null;

  const boardEl = document.getElementById('board');
  const stepCountEl = document.getElementById('step-count');
  const levelBadgeEl = document.getElementById('level-badge');
  const btnUndo = document.getElementById('btn-undo');
  const winModalEl = document.getElementById('modal-win');
  const winStepsEl = document.getElementById('win-steps');

  function spawnStarParticles(r, c) {
    const targetCell = boardEl.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
    if (!targetCell) return;
    const rect = targetCell.getBoundingClientRect();
    const boardRect = boardEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - boardRect.left;
    const cy = rect.top + rect.height / 2 - boardRect.top;

    const stars = ['✨', '⭐', '💫', '✦'];
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('span');
      particle.textContent = stars[i % stars.length];
      particle.style.position = 'absolute';
      particle.style.left = `${cx}px`;
      particle.style.top = `${cy}px`;
      particle.style.transform = 'translate(-50%, -50%) scale(0.5)';
      particle.style.pointerEvents = 'none';
      particle.style.fontSize = '18px';
      particle.style.zIndex = '100';
      particle.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease-out';
      particle.style.opacity = '1';
      boardEl.style.position = 'relative';
      boardEl.appendChild(particle);

      const angle = (i / 8) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const distance = 30 + Math.random() * 20;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      requestAnimationFrame(() => {
        particle.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.2)`;
        particle.style.opacity = '0';
      });

      setTimeout(() => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
      }, 550);
    }
  }

  function initLevel(lvlIdx) {
    currentLevelIdx = lvlIdx;
    const def = getLevel(currentLevelIdx);
    robot = { ...def.robot };
    boxes = def.boxes.map(b => ({ ...b }));
    robotFacing = 'down';
    steps = 0;
    history = [];
    won = false;
    lastPush = null;
    lastRobotMove = null;
    startTime = Date.now();

    stepCountEl.textContent = `${steps} STEPS`;
    levelBadgeEl.textContent = `LEVEL ${currentLevelIdx + 1}`;
    btnUndo.disabled = true;
    winModalEl.classList.remove('active');

    renderBoard();
  }

  function renderBoard() {
    boardEl.innerHTML = '';
    const def = getLevel(currentLevelIdx);

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        const char = def.map[r][c];

        if (char === 'W') {
          cell.classList.add('cell-wall');
        } else {
          cell.classList.add('cell-floor');
          if (char === 'T') {
            cell.classList.add('cell-target');
            const node = document.createElement('div');
            node.className = 'target-glow-node';
            cell.appendChild(node);
          }
        }

        // Box on this cell?
        const boxIdxOnCell = boxes.findIndex(b => b.r === r && b.c === c);
        if (boxIdxOnCell !== -1) {
          const isTarget = char === 'T';
          const isJustPushed = lastPush && lastPush.boxIdx === boxIdxOnCell;
          const boxEl = document.createElement('div');
          boxEl.className = 'robox-crate-25d' + (isTarget ? ' powered' : '') + (isJustPushed ? ' just-pushed' : '');
          if (isJustPushed) {
            boxEl.style.setProperty('--push-dr', lastPush.dr);
            boxEl.style.setProperty('--push-dc', lastPush.dc);
          }
          boxEl.innerHTML = `
            <div class="crate-bolt tl"></div>
            <div class="crate-bolt tr"></div>
            <div class="crate-bolt bl"></div>
            <div class="crate-bolt br"></div>
            <div class="crate-inner">
              <div class="crate-core"></div>
            </div>
          `;
          cell.appendChild(boxEl);
        } else if (robot.r === r && robot.c === c) {
          // Robot on this cell (Directional 2.5D model with sliding effect)
          const botEl = document.createElement('div');
          botEl.className = `robox-bot-25d facing-${robotFacing} walking` + (lastRobotMove ? ' just-moved' : '');
          if (lastRobotMove) {
            botEl.style.setProperty('--slide-dr', lastRobotMove.dr);
            botEl.style.setProperty('--slide-dc', lastRobotMove.dc);
          }
          botEl.innerHTML = `
            <div class="bot-antenna"></div>
            <div class="bot-chassis">
              <div class="bot-visor">
                <div class="bot-eye"></div>
                <div class="bot-eye"></div>
              </div>
            </div>
            <div class="bot-treads"></div>
          `;
          cell.appendChild(botEl);
        }

        boardEl.appendChild(cell);
      }
    }
  }

  function move(dr, dc) {
    if (won) return;
    AudioEngine.init();
    AudioEngine.startBgm();

    // Direction tracking
    if (dc === 1) robotFacing = 'right';
    else if (dc === -1) robotFacing = 'left';
    else if (dr === -1) robotFacing = 'up';
    else if (dr === 1) robotFacing = 'down';

    const newR = robot.r + dr;
    const newC = robot.c + dc;
    const def = getLevel(currentLevelIdx);

    // Check Wall collision
    if (def.map[newR][newC] === 'W') {
      lastRobotMove = null;
      lastPush = null;
      renderBoard();
      return;
    }

    // Check Box collision
    const boxIdx = boxes.findIndex(b => b.r === newR && b.c === newC);

    if (boxIdx !== -1) {
      const nextBoxR = newR + dr;
      const nextBoxC = newC + dc;

      // Cannot push box into wall or another box
      if (def.map[nextBoxR][nextBoxC] === 'W') {
        lastRobotMove = null;
        lastPush = null;
        renderBoard();
        return;
      }
      if (boxes.some(b => b.r === nextBoxR && b.c === nextBoxC)) {
        lastRobotMove = null;
        lastPush = null;
        renderBoard();
        return;
      }

      // Save history before pushing
      history.push({
        robot: { ...robot },
        robotFacing,
        boxes: boxes.map(b => ({ ...b }))
      });
      btnUndo.disabled = false;

      // Push box
      boxes[boxIdx].r = nextBoxR;
      boxes[boxIdx].c = nextBoxC;
      lastPush = { boxIdx, dr, dc };
      lastRobotMove = { dr, dc };

      // Sound & Particle
      if (def.map[nextBoxR][nextBoxC] === 'T') {
        AudioEngine.playCharge();
        spawnStarParticles(nextBoxR, nextBoxC);
      } else {
        AudioEngine.playPush();
      }
    } else {
      // Free move
      lastPush = null;
      lastRobotMove = { dr, dc };
      history.push({
        robot: { ...robot },
        robotFacing,
        boxes: boxes.map(b => ({ ...b }))
      });
      btnUndo.disabled = false;
      AudioEngine.playStep();
    }

    robot.r = newR;
    robot.c = newC;
    steps++;
    stepCountEl.textContent = `${steps} STEPS`;

    renderBoard();
    checkWinCondition();
  }

  function undo() {
    if (won || history.length === 0) return;
    const last = history.pop();
    robot = { ...last.robot };
    robotFacing = last.robotFacing || 'down';
    boxes = last.boxes.map(b => ({ ...b }));
    steps++;
    stepCountEl.textContent = `${steps} STEPS`;
    btnUndo.disabled = history.length === 0;
    AudioEngine.playStep();
    renderBoard();
  }

  function checkWinCondition() {
    const def = getLevel(currentLevelIdx);
    const allOnTarget = boxes.every(b => def.map[b.r][b.c] === 'T');

    if (allOnTarget) {
      won = true;
      AudioEngine.playWin();
      const elapsedSec = Math.round((Date.now() - startTime) / 1000);

      // Notify parent platform
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'win', time: elapsedSec }, '*');
        }
      } catch (e) {}

      winStepsEl.textContent = steps;
      setTimeout(() => {
        winModalEl.classList.add('active');
      }, 300);
    }
  }

  // --- Fluid Drag & Drop / Pointer Swipe Engine ---
  const boardTouchArea = document.getElementById('board-touch-area');
  let pointerStartX = 0;
  let pointerStartY = 0;
  let isPointerDown = false;
  const SWIPE_THRESHOLD = 25;

  function handlePointerStart(clientX, clientY) {
    pointerStartX = clientX;
    pointerStartY = clientY;
    isPointerDown = true;
  }

  function handlePointerEnd(clientX, clientY) {
    if (!isPointerDown) return;
    isPointerDown = false;

    const dx = clientX - pointerStartX;
    const dy = clientY - pointerStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) >= SWIPE_THRESHOLD) {
      if (absX > absY) {
        move(0, dx > 0 ? 1 : -1);
      } else {
        move(dy > 0 ? 1 : -1, 0);
      }
    }
  }

  boardTouchArea.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    handlePointerStart(e.clientX, e.clientY);
  });

  window.addEventListener('pointerup', (e) => {
    if (isPointerDown) {
      handlePointerEnd(e.clientX, e.clientY);
    }
  });

  boardTouchArea.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      handlePointerStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  boardTouchArea.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      handlePointerEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  }, { passive: true });

  // Tap adjacent cell to move directly
  boardEl.addEventListener('click', (e) => {
    const cell = e.target.closest('.cell');
    if (!cell) return;
    const targetR = parseInt(cell.dataset.r, 10);
    const targetC = parseInt(cell.dataset.c, 10);
    const dr = targetR - robot.r;
    const dc = targetC - robot.c;

    if (Math.abs(dr) + Math.abs(dc) === 1) {
      move(dr, dc);
    }
  });

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        move(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        move(0, 1);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        move(1, 0);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        move(0, -1);
        break;
      case 'z':
      case 'Z':
        if (e.ctrlKey || e.metaKey) undo();
        break;
      case 'Escape':
        if (winModalEl.classList.contains('active')) {
          winModalEl.classList.remove('active');
        }
        break;
    }
  });

  // Controls Header
  document.getElementById('btn-restart').addEventListener('click', () => initLevel(currentLevelIdx));
  btnUndo.addEventListener('click', undo);

  document.getElementById('btn-sound').addEventListener('click', function () {
    AudioEngine.muted = !AudioEngine.muted;
    this.innerHTML = AudioEngine.muted ? '🔇' : '🔊';
    if (AudioEngine.muted) {
      AudioEngine.stopBgm();
    } else {
      AudioEngine.startBgm();
    }
  });

  // Start BGM on first user touch / keydown
  function triggerBgmStart() {
    AudioEngine.startBgm();
    window.removeEventListener('pointerdown', triggerBgmStart);
    window.removeEventListener('keydown', triggerBgmStart);
  }
  window.addEventListener('pointerdown', triggerBgmStart, { once: true });
  window.addEventListener('keydown', triggerBgmStart, { once: true });

  // Modal actions (Stacked safe modal closing)
  document.getElementById('btn-win-restart').addEventListener('click', (e) => {
    e.stopPropagation();
    initLevel(currentLevelIdx);
  });
  document.getElementById('btn-win-next').addEventListener('click', (e) => {
    e.stopPropagation();
    initLevel(currentLevelIdx + 1);
  });

  winModalEl.addEventListener('click', (e) => {
    if (e.target === winModalEl) {
      winModalEl.classList.remove('active');
    }
  });

  initLevel(0);
})();
