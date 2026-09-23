// Number Calm 60+ - Standalone Vanilla JS
(() => {
  const TARGET = 512;
  const startTime = Date.now();
  let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];
  let history = [];
  let isWon = false;
  let highestTile = 2;
  let soundEnabled = true;

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

  function playSlideSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (_) {}
  }

  function playMergeSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (_) {}
  }

  function playWinSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [440, 554.37, 659.25, 880].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.6);
      });
    } catch (_) {}
  }

  const gridEl = document.getElementById('grid-container');
  const highestTileEl = document.getElementById('highest-tile');
  const statusMsg = document.getElementById('status-msg');
  const soundBtn = document.getElementById('btn-sound');
  const undoBtn = document.getElementById('btn-undo');
  const resetBtn = document.getElementById('btn-reset');

  function initGame() {
    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    // Start with gentle pre-seeded 64, 32, 16 so achieving 512 is calm and delightful!
    board[0][0] = 64;
    board[0][1] = 64;
    board[1][0] = 32;
    board[1][1] = 16;
    history = [];
    isWon = false;
    highestTile = 64;
    renderBoard();
  }

  function spawnRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length > 0) {
      const rand = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[rand.r][rand.c] = Math.random() < 0.7 ? 2 : 4;
    }
  }

  function renderBoard() {
    gridEl.innerHTML = '';
    let currentMax = 2;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = board[r][c];
        if (val > currentMax) currentMax = val;

        const cellEl = document.createElement('div');
        cellEl.className = 'grid-cell';
        if (val > 0) {
          cellEl.classList.add(`tile-${val}`);
          cellEl.textContent = val;
        }
        gridEl.appendChild(cellEl);
      }
    }

    highestTile = currentMax;
    highestTileEl.textContent = highestTile;

    if (highestTile >= TARGET && !isWon) {
      handleWin();
    }
  }

  function slide(row) {
    let arr = row.filter(val => val !== 0);
    let merged = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        arr[i + 1] = 0;
        merged = true;
      }
    }
    arr = arr.filter(val => val !== 0);
    while (arr.length < 4) {
      arr.push(0);
    }
    return { row: arr, merged };
  }

  function moveLeft() {
    let changed = false;
    let anyMerged = false;
    const newBoard = [];
    for (let r = 0; r < 4; r++) {
      const res = slide(board[r]);
      newBoard.push(res.row);
      if (res.merged) anyMerged = true;
      for (let c = 0; c < 4; c++) {
        if (board[r][c] !== newBoard[r][c]) changed = true;
      }
    }
    return { newBoard, changed, anyMerged };
  }

  function rotateClockwise(b) {
    const res = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        res[c][3 - r] = b[r][c];
      }
    }
    return res;
  }

  function move(direction) {
    if (isWon) return;

    // Save history for undo
    const prevBoard = board.map(row => [...row]);

    let rotCount = 0;
    if (direction === 'UP') rotCount = 3;
    if (direction === 'RIGHT') rotCount = 2;
    if (direction === 'DOWN') rotCount = 1;

    for (let i = 0; i < rotCount; i++) {
      board = rotateClockwise(board);
    }

    const { newBoard, changed, anyMerged } = moveLeft();
    board = newBoard;

    for (let i = 0; i < (4 - rotCount) % 4; i++) {
      board = rotateClockwise(board);
    }

    if (changed) {
      history.push(prevBoard);
      if (anyMerged) {
        playMergeSound();
      } else {
        playSlideSound();
      }
      spawnRandomTile();
      renderBoard();
    }
  }

  function handleWin() {
    isWon = true;
    playWinSound();
    const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    statusMsg.textContent = '🎉 Splendid! You reached the 512 tile!';
    statusMsg.style.color = '#15803d';

    try {
      window.parent.postMessage({ type: 'win', time: elapsed }, '*');
    } catch (_) {}
  }

  // Direction buttons
  document.querySelectorAll('.dpad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      move(btn.dataset.dir);
    });
  });

  // Physical keyboard arrows
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

  // Touch Swipe
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
      if (Math.abs(diffX) > 30) {
        move(diffX > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(diffY) > 30) {
        move(diffY > 0 ? 'DOWN' : 'UP');
      }
    }
  }, { passive: true });

  undoBtn.addEventListener('click', () => {
    if (history.length > 0 && !isWon) {
      board = history.pop();
      renderBoard();
    }
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Restart Number Calm?')) {
      statusMsg.textContent = 'Slide matching numbers together. Goal: 512.';
      statusMsg.style.color = '#92400e';
      initGame();
    }
  });

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
  });

  initGame();
})();
