// Box Push Easy 60+ - Standalone Vanilla JS
(() => {
  const startTime = Date.now();
  let stepCount = 0;
  let history = [];
  let isWon = false;
  let soundEnabled = true;

  // 6x6 Map
  // 1 = Wall, 0 = Floor, G = Goal
  const MAP_LAYOUT = [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1]
  ];

  // Initial Positions (Just 1 Box!)
  let player = { r: 2, c: 2 };
  let playerFacing = 'down';
  let box = { r: 3, c: 3 };
  const goal = { r: 3, c: 4 };

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
  const statusMsg = document.getElementById('status-msg');
  const soundBtn = document.getElementById('btn-sound');
  const undoBtn = document.getElementById('btn-undo');
  const resetBtn = document.getElementById('btn-reset');

  function renderMap() {
    gridEl.innerHTML = '';
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const cellEl = document.createElement('div');
        cellEl.className = 'sokoban-cell';

        if (MAP_LAYOUT[r][c] === 1) {
          cellEl.classList.add('cell-wall');
          cellEl.textContent = '🧱';
        } else {
          cellEl.classList.add('cell-floor');

          const isGoal = goal.r === r && goal.c === c;
          const isPlayer = player.r === r && player.c === c;
          const isBox = box.r === r && box.c === c;

          if (isGoal) {
            cellEl.classList.add('cell-goal');
          }

          if (isPlayer) {
            cellEl.innerHTML = `<span class="player-marker facing-${playerFacing}">🧑‍🌾</span>`;
          } else if (isBox) {
            cellEl.textContent = '📦';
            if (isGoal) {
              cellEl.classList.add('cell-box-on-goal');
              cellEl.textContent = '⭐'; // Glows into star on target!
            }
          } else if (isGoal) {
            cellEl.textContent = '🎯';
          }
        }

        gridEl.appendChild(cellEl);
      }
    }

    stepsCountEl.textContent = stepCount;

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

    // Check wall
    if (MAP_LAYOUT[nextPlayerR][nextPlayerC] === 1) return;

    // Check if box is in next cell
    if (box.r === nextPlayerR && box.c === nextPlayerC) {
      const nextBoxR = box.r + dr;
      const nextBoxC = box.c + dc;

      // Box hits wall?
      if (MAP_LAYOUT[nextBoxR][nextBoxC] === 1) return;

      // Valid push!
      history.push({
        player: { ...player },
        box: { ...box },
        stepCount: stepCount
      });

      player.r = nextPlayerR;
      player.c = nextPlayerC;
      box.r = nextBoxR;
      box.c = nextBoxC;
      stepCount++;
      playPushSound();
      renderMap();
    } else {
      // Normal walk
      history.push({
        player: { ...player },
        box: { ...box },
        stepCount: stepCount
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
    statusMsg.textContent = '🎉 Splendid! The box is safely placed on the target!';
    statusMsg.style.color = '#15803d';

    try {
      window.parent.postMessage({ type: 'win', time: elapsed }, '*');
    } catch (_) {}
  }

  // D-Pad buttons
  document.querySelectorAll('.dpad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      move(btn.dataset.dir);
    });
  });

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
    }
  });

  // Swipe support
  let touchStartX = 0;
  let touchStartY = 0;
  gridEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  gridEl.addEventListener('touchend', (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 25) {
        move(diffX > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(diffY) > 25) {
        move(diffY > 0 ? 'DOWN' : 'UP');
      }
    }
  }, { passive: true });

  undoBtn.addEventListener('click', () => {
    if (history.length > 0 && !isWon) {
      const prev = history.pop();
      player = prev.player;
      box = prev.box;
      stepCount = prev.stepCount;
      renderMap();
    }
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Restart Box Push?')) {
      player = { r: 2, c: 2 };
      box = { r: 3, c: 3 };
      stepCount = 0;
      history = [];
      isWon = false;
      statusMsg.textContent = 'Push the single box 📦 onto the target 🎯.';
      statusMsg.style.color = '#9a3412';
      renderMap();
    }
  });

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
  });

  renderMap();
})();
