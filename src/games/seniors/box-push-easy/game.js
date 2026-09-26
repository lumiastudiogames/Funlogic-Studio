// Box Push Easy 60+ - Standalone Vanilla JS with Procedural Levels & Pseudo-3D
(() => {
  const TOTAL_LEVELS = 20;
  let currentLevel = 1;
  let startTime = Date.now();
  let stepCount = 0;
  let history = [];
  let isWon = false;
  let soundEnabled = true;

  // Curated procedural warehouse levels (6x6) with walls (1), floor (0), player, box and goal
  const LEVELS_DATA = [
    // Level 1: Straight Push
    {
      map: [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1]
      ],
      player: { r: 2, c: 2 },
      box: { r: 3, c: 3 },
      goal: { r: 3, c: 4 }
    },
    // Level 2: Corner turn
    {
      map: [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1]
      ],
      player: { r: 1, c: 2 },
      box: { r: 2, c: 3 },
      goal: { r: 4, c: 3 }
    },
    // Level 3: Corridor bypass
    {
      map: [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1]
      ],
      player: { r: 2, c: 1 },
      box: { r: 2, c: 2 },
      goal: { r: 4, c: 4 }
    },
    // Level 4: Central pillar
    {
      map: [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1]
      ],
      player: { r: 1, c: 1 },
      box: { r: 3, c: 2 },
      goal: { r: 1, c: 4 }
    },
    // Level 5: L-corridor
    {
      map: [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 1, 0, 0, 1],
        [1, 0, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1]
      ],
      player: { r: 4, c: 1 },
      box: { r: 3, c: 3 },
      goal: { r: 1, c: 3 }
    },
    // Levels 6-20 procedural presets
    ...Array.from({ length: 15 }, (_, i) => {
      const lvl = i + 6;
      const wallPatterns = [
        [[2,2], [3,3]],
        [[2,3], [4,2]],
        [[3,2], [3,4]],
        [[2,4], [4,3]],
        [[2,2], [2,3]]
      ];
      const wp = wallPatterns[i % wallPatterns.length];
      const map = [
        [1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1]
      ];
      wp.forEach(([r, c]) => { map[r][c] = 1; });

      const goals = [{ r: 4, c: 4 }, { r: 1, c: 4 }, { r: 4, c: 1 }, { r: 1, c: 1 }, { r: 2, c: 4 }];
      const goal = goals[i % goals.length];
      const boxes = [{ r: 3, c: 2 }, { r: 2, c: 3 }, { r: 3, c: 3 }, { r: 2, c: 2 }, { r: 3, c: 4 }];
      const box = boxes[i % boxes.length];

      return {
        map,
        player: { r: 1, c: 2 },
        box,
        goal
      };
    })
  ];

  let currentMap = [];
  let player = { r: 2, c: 2 };
  let playerFacing = 'down';
  let box = { r: 3, c: 3 };
  let goal = { r: 3, c: 4 };

  // Audio Synth
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) audioCtx = new AudioCtxClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playStepSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  }

  function playPushSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (_) {}
  }

  function playWinSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.6);
      });
    } catch (_) {}
  }

  const gridEl = document.getElementById('sokoban-grid');
  const stepsCountEl = document.getElementById('steps-count');
  const levelDisplay = document.getElementById('level-display');
  const statusMsg = document.getElementById('status-msg');
  const soundBtn = document.getElementById('btn-sound');
  const undoBtn = document.getElementById('btn-undo');
  const resetBtn = document.getElementById('btn-reset');

  function initLevel(lvlNum = currentLevel) {
    currentLevel = Math.max(1, Math.min(TOTAL_LEVELS, lvlNum));
    const data = LEVELS_DATA[currentLevel - 1];

    currentMap = JSON.parse(JSON.stringify(data.map));
    player = { ...data.player };
    box = { ...data.box };
    goal = { ...data.goal };

    playerFacing = 'down';
    stepCount = 0;
    history = [];
    isWon = false;
    startTime = Date.now();

    if (levelDisplay) levelDisplay.textContent = `Level ${currentLevel}/${TOTAL_LEVELS}`;
    if (statusMsg) {
      statusMsg.textContent = `Push the box 📦 onto target 🎯 (Level ${currentLevel})`;
      statusMsg.style.color = '#7c2d12';
    }

    renderMap();
  }

  function renderMap() {
    gridEl.innerHTML = '';
    const rows = currentMap.length;
    const cols = currentMap[0].length;

    gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cellEl = document.createElement('div');
        cellEl.className = 'sokoban-cell';

        const isWall = currentMap[r][c] === 1;
        const isGoal = goal.r === r && goal.c === c;
        const isPlayer = player.r === r && player.c === c;
        const isBox = box.r === r && box.c === c;

        if (isWall) {
          cellEl.classList.add('cell-wall');
        } else {
          cellEl.classList.add('cell-floor');
          if (isGoal) {
            cellEl.classList.add('cell-goal');
          }

          if (isPlayer) {
            cellEl.innerHTML = `<div class="sticker-3d sticker-player"><span class="player-marker facing-${playerFacing}">🧑‍🌾</span></div>`;
          } else if (isBox) {
            if (isGoal) {
              cellEl.classList.add('cell-box-on-goal');
              cellEl.innerHTML = `<div class="sticker-3d sticker-box"></div>`;
            } else {
              cellEl.innerHTML = `<div class="sticker-3d sticker-box"></div>`;
            }
          } else if (isGoal) {
            cellEl.innerHTML = `<div class="sticker-3d" style="font-size: 26px;">🎯</div>`;
          }
        }

        gridEl.appendChild(cellEl);
      }
    }

    if (stepsCountEl) stepsCountEl.textContent = stepCount;

    if (box.r === goal.r && box.c === goal.c && !isWon) {
      handleWin();
    }
  }

  function move(direction) {
    if (isWon) return;

    let dr = 0;
    let dc = 0;
    if (direction === 'UP') { dr = -1; playerFacing = 'up'; }
    if (direction === 'DOWN') { dr = 1; playerFacing = 'down'; }
    if (direction === 'LEFT') { dc = -1; playerFacing = 'left'; }
    if (direction === 'RIGHT') { dc = 1; playerFacing = 'right'; }

    const nextPlayerR = player.r + dr;
    const nextPlayerC = player.c + dc;

    if (currentMap[nextPlayerR][nextPlayerC] === 1) return;

    if (box.r === nextPlayerR && box.c === nextPlayerC) {
      const nextBoxR = box.r + dr;
      const nextBoxC = box.c + dc;

      if (currentMap[nextBoxR][nextBoxC] === 1) return;

      history.push({
        player: { ...player },
        box: { ...box },
        stepCount
      });

      player.r = nextPlayerR;
      player.c = nextPlayerC;
      box.r = nextBoxR;
      box.c = nextBoxC;
      stepCount++;
      playPushSound();
      renderMap();
    } else {
      history.push({
        player: { ...player },
        box: { ...box },
        stepCount
      });

      player.r = nextPlayerR;
      player.c = nextPlayerC;
      stepCount++;
      playStepSound();
      renderMap();
    }
  }

  function handleWin() {
    isWon = true;
    playWinSound();
    const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    
    if (statusMsg) {
      statusMsg.innerHTML = `🎉 <strong>Level ${currentLevel} Solved!</strong> <button id="btn-next-lvl" style="margin-left:8px; padding: 4px 10px; background: #16a34a; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Next Level ▶</button>`;
      statusMsg.style.color = '#15803d';

      document.getElementById('btn-next-lvl')?.addEventListener('click', () => {
        const nextLvl = currentLevel < TOTAL_LEVELS ? currentLevel + 1 : 1;
        initLevel(nextLvl);
      });
    }

    try {
      window.parent.postMessage({ type: 'win', time: elapsed, level: currentLevel }, '*');
    } catch (_) {}
  }

  // D-Pad buttons
  document.querySelectorAll('.dpad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      move(btn.dataset.dir);
    });
  });

  // Touch Swipe on grid
  let touchStartX = 0;
  let touchStartY = 0;
  gridEl.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  gridEl.addEventListener('touchend', (e) => {
    if (e.changedTouches.length > 0) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (Math.max(absDx, absDy) > 20) {
        if (absDx > absDy) {
          move(dx > 0 ? 'RIGHT' : 'LEFT');
        } else {
          move(dy > 0 ? 'DOWN' : 'UP');
        }
      }
    }
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'KeyW'].includes(e.code)) {
      e.preventDefault();
      move('UP');
    } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
      e.preventDefault();
      move('DOWN');
    } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
      e.preventDefault();
      move('LEFT');
    } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
      e.preventDefault();
      move('RIGHT');
    } else if (['KeyZ', 'Backspace'].includes(e.code)) {
      undoMove();
    } else if (e.code === 'KeyR') {
      initLevel(currentLevel);
    }
  });

  function undoMove() {
    if (history.length === 0 || isWon) return;
    const previous = history.pop();
    player = { ...previous.player };
    box = { ...previous.box };
    stepCount = previous.stepCount;
    playStepSound();
    renderMap();
  }

  undoBtn?.addEventListener('click', undoMove);
  resetBtn?.addEventListener('click', () => initLevel(currentLevel));

  soundBtn?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.innerHTML = soundEnabled ? '🔊 Sound' : '🔇 Muted';
  });

  initLevel(1);
})();
