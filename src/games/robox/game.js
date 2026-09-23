// Robox - Robot Box Pusher Engine (Vanilla JS)
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
    playStep() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    },
    playPush() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    },
    playCharge() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      [440, 660, 880].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.2, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.2);
      });
    }
  };

  // Levels (8x8 grids)
  // W: Wall, _: Floor, T: Target
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
    }
  ];

  let currentLevelIdx = 0;
  let steps = 0;
  let startTime = Date.now();
  let robot = { r: 0, c: 0 };
  let boxes = [];
  let history = [];
  let won = false;

  const boardEl = document.getElementById('board');
  const stepCountEl = document.getElementById('step-count');
  const levelBadgeEl = document.getElementById('level-badge');
  const btnUndo = document.getElementById('btn-undo');

  function initLevel(lvlIdx) {
    currentLevelIdx = lvlIdx % LEVELS.length;
    const def = LEVELS[currentLevelIdx];
    robot = { ...def.robot };
    boxes = def.boxes.map((b) => ({ ...b }));
    steps = 0;
    history = [];
    won = false;
    startTime = Date.now();

    stepCountEl.textContent = `${steps} PASSOS`;
    levelBadgeEl.textContent = `FASE ${currentLevelIdx + 1}`;
    btnUndo.disabled = true;

    renderBoard();
  }

  function renderBoard() {
    boardEl.innerHTML = '';
    const def = LEVELS[currentLevelIdx];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        const char = def.map[r][c];

        if (char === 'W') {
          cell.classList.add('cell-wall');
        } else {
          cell.classList.add('cell-floor');
          if (char === 'T') {
            cell.classList.add('cell-target');
          }
        }

        // Check if box is on this cell
        const box = boxes.find((b) => b.r === r && b.c === c);
        if (box) {
          const isTarget = char === 'T';
          const boxEl = document.createElement('div');
          boxEl.className = 'entity-box' + (isTarget ? ' powered' : '');
          boxEl.textContent = isTarget ? '⚡' : '📦';
          cell.appendChild(boxEl);
        } else if (robot.r === r && robot.c === c) {
          const botEl = document.createElement('div');
          botEl.className = 'entity-robot';
          botEl.textContent = '🤖';
          cell.appendChild(botEl);
        }

        boardEl.appendChild(cell);
      }
    }
  }

  function move(dr, dc) {
    if (won) return;
    AudioEngine.init();

    const newR = robot.r + dr;
    const newC = robot.c + dc;
    const def = LEVELS[currentLevelIdx];

    // Check Wall collision
    if (def.map[newR][newC] === 'W') return;

    // Check Box collision
    const boxIdx = boxes.findIndex((b) => b.r === newR && b.c === newC);
    let boxPushed = false;

    if (boxIdx !== -1) {
      const nextBoxR = newR + dr;
      const nextBoxC = newC + dc;

      // Cannot push box into wall or another box
      if (def.map[nextBoxR][nextBoxC] === 'W') return;
      if (boxes.some((b) => b.r === nextBoxR && b.c === nextBoxC)) return;

      // Save history before pushing
      history.push({
        robot: { ...robot },
        boxes: boxes.map((b) => ({ ...b }))
      });
      btnUndo.disabled = false;

      // Push box
      boxes[boxIdx].r = nextBoxR;
      boxes[boxIdx].c = nextBoxC;
      boxPushed = true;

      // Sound
      if (def.map[nextBoxR][nextBoxC] === 'T') {
        AudioEngine.playCharge();
      } else {
        AudioEngine.playPush();
      }
    } else {
      // Free move
      history.push({
        robot: { ...robot },
        boxes: boxes.map((b) => ({ ...b }))
      });
      btnUndo.disabled = false;
      AudioEngine.playStep();
    }

    robot.r = newR;
    robot.c = newC;
    steps++;
    stepCountEl.textContent = `${steps} PASSOS`;
    renderBoard();

    checkWin();
  }

  function undo() {
    if (history.length === 0 || won) return;
    const prevState = history.pop();
    robot = prevState.robot;
    boxes = prevState.boxes;
    steps = Math.max(0, steps - 1);
    stepCountEl.textContent = `${steps} PASSOS`;
    if (history.length === 0) btnUndo.disabled = true;
    renderBoard();
  }

  function checkWin() {
    const def = LEVELS[currentLevelIdx];
    const allOnTargets = boxes.every((b) => def.map[b.r][b.c] === 'T');

    if (allOnTargets && !won) {
      won = true;
      AudioEngine.playCharge();
      const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      // Golden rule notification to platform
      window.parent.postMessage({ type: 'win', time: elapsed }, '*');

      setTimeout(() => {
        initLevel(currentLevelIdx + 1);
      }, 1500);
    }
  }

  // Keyboard navigation
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
    }
  });

  // Touch D-Pad buttons
  document.querySelectorAll('[data-dir]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dir = btn.getAttribute('data-dir');
      if (dir === 'up') move(-1, 0);
      else if (dir === 'down') move(1, 0);
      else if (dir === 'left') move(0, -1);
      else if (dir === 'right') move(0, 1);
    });
  });

  document.getElementById('btn-restart').addEventListener('click', () => initLevel(currentLevelIdx));
  btnUndo.addEventListener('click', undo);
  document.getElementById('btn-sound').addEventListener('click', function () {
    AudioEngine.muted = !AudioEngine.muted;
    this.innerHTML = AudioEngine.muted ? '🔇' : '🔊';
  });

  initLevel(0);
})();
