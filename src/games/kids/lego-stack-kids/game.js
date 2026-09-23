// Lego Stack Kids - 6x6 2-Block Puzzle for Children
(function() {
  'use strict';

  const BOARD_SIZE = 6;
  const PIECE_SHAPES = [
    // 2-block horizontal
    { name: 'Duo-H', cells: [[0, 0], [0, 1]], color: 'color-red' },
    // 2-block vertical
    { name: 'Duo-V', cells: [[0, 0], [1, 0]], color: 'color-blue' },
    // 2-block horizontal yellow
    { name: 'Duo-H', cells: [[0, 0], [0, 1]], color: 'color-yellow' },
    // 2-block vertical green
    { name: 'Duo-V', cells: [[0, 0], [1, 0]], color: 'color-green' },
    // 1-block single
    { name: 'Single', cells: [[0, 0]], color: 'color-blue' }
  ];

  let board = [];
  let dockPieces = [];
  let selectedPieceIdx = null;
  let piecesPlaced = 0;
  let linesCleared = 0;
  let startTime = Date.now();
  let isWon = false;
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

    if (type === 'select') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'snap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'clear') {
      const notes = [523, 659, 784, 1046];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.15);
      });
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

  function initGame() {
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    selectedPieceIdx = null;
    piecesPlaced = 0;
    linesCleared = 0;
    isWon = false;
    startTime = Date.now();
    document.getElementById('win-modal').classList.remove('active');

    // Pre-populate a couple of friendly colorful studs so placing a 2-block brick can easily complete lines
    board[0][0] = 'color-red';
    board[0][1] = 'color-red';
    board[0][2] = 'color-blue';
    board[0][3] = 'color-blue';

    generateDock();
    updateHint('Pick a toy brick below and snap it on the board!');
    renderBoard();
    renderDock();
  }

  function generateDock() {
    dockPieces = [];
    for (let i = 0; i < 3; i++) {
      const choice = PIECE_SHAPES[Math.floor(Math.random() * PIECE_SHAPES.length)];
      dockPieces.push({ ...choice });
    }
  }

  function updateHint(text) {
    const el = document.getElementById('hint-bar');
    if (el) el.textContent = text;
  }

  function renderBoard() {
    const boardEl = document.getElementById('board-6x6');
    boardEl.innerHTML = '';

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const cell = document.createElement('div');
        cell.className = 'lego-cell';

        const color = board[r][c];
        if (color) {
          cell.classList.add('filled', color);
        }

        cell.addEventListener('click', () => handleCellClick(r, c));
        boardEl.appendChild(cell);
      }
    }
  }

  function renderDock() {
    const dockEl = document.getElementById('dock');
    dockEl.innerHTML = '';

    dockPieces.forEach((piece, idx) => {
      if (!piece) return;

      const item = document.createElement('div');
      item.className = 'dock-item';
      if (selectedPieceIdx === idx) item.classList.add('selected');

      const preview = document.createElement('div');
      preview.className = 'piece-preview';

      // Shape layout
      const maxR = Math.max(...piece.cells.map(c => c[0])) + 1;
      const maxC = Math.max(...piece.cells.map(c => c[1])) + 1;
      preview.style.gridTemplateRows = `repeat(${maxR}, 22px)`;
      preview.style.gridTemplateColumns = `repeat(${maxC}, 22px)`;

      piece.cells.forEach(([r, c]) => {
        const dot = document.createElement('div');
        dot.className = `piece-dot ${piece.color}`;
        dot.style.gridRow = r + 1;
        dot.style.gridColumn = c + 1;
        preview.appendChild(dot);
      });

      item.appendChild(preview);
      item.addEventListener('click', () => {
        if (isWon) return;
        selectedPieceIdx = idx;
        playSound('select');
        updateHint(`Selected ${piece.name}! Tap where to place it.`);
        renderDock();
      });

      dockEl.appendChild(item);
    });
  }

  function canPlace(piece, startR, startC) {
    for (let [dr, dc] of piece.cells) {
      const r = startR + dr;
      const c = startC + dc;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return false;
      if (board[r][c] !== null) return false;
    }
    return true;
  }

  function handleCellClick(r, c) {
    if (isWon || selectedPieceIdx === null) return;
    const piece = dockPieces[selectedPieceIdx];
    if (!piece) return;

    if (canPlace(piece, r, c)) {
      // Place piece
      for (let [dr, dc] of piece.cells) {
        board[r + dr][c + dc] = piece.color;
      }
      dockPieces[selectedPieceIdx] = null;
      selectedPieceIdx = null;
      piecesPlaced++;
      playSound('snap');

      // Check row/column clears
      checkClears();

      // Refill dock if all used
      if (dockPieces.every(p => p === null)) {
        generateDock();
      }

      renderBoard();
      renderDock();

      // Win condition: cleared at least 1 line or placed 5 pieces!
      if (linesCleared >= 1 || piecesPlaced >= 5) {
        handleWin();
      }
    } else {
      playSound('select');
      updateHint("Brick doesn't fit there! Try another open spot.");
    }
  }

  function checkClears() {
    const rowsToClear = [];
    const colsToClear = [];

    // Rows
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (board[r].every(cell => cell !== null)) {
        rowsToClear.push(r);
      }
    }
    // Cols
    for (let c = 0; c < BOARD_SIZE; c++) {
      let full = true;
      for (let r = 0; r < BOARD_SIZE; r++) {
        if (board[r][c] === null) { full = false; break; }
      }
      if (full) colsToClear.push(c);
    }

    if (rowsToClear.length > 0 || colsToClear.length > 0) {
      playSound('clear');
      linesCleared += rowsToClear.length + colsToClear.length;
      updateHint('POP! Line cleared! 🌟');

      rowsToClear.forEach(r => {
        for (let c = 0; c < BOARD_SIZE; c++) board[r][c] = null;
      });
      colsToClear.forEach(c => {
        for (let r = 0; r < BOARD_SIZE; r++) board[r][c] = null;
      });
    }
  }

  function handleWin() {
    isWon = true;
    playSound('win');
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    updateHint('🎉 Super Builder! Lego lines conquered!');

    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'win', time: elapsedSeconds }, '*');
      }
    } catch (e) {}

    setTimeout(() => {
      document.getElementById('win-time').textContent = `${elapsedSeconds}s`;
      document.getElementById('win-modal').classList.add('active');
    }, 500);
  }

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-play-again').addEventListener('click', initGame);

  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playSound('select');
  });

  const howBtn = document.getElementById('btn-how');
  const howModal = document.getElementById('how-modal');
  const closeHowBtn = document.getElementById('btn-close-how');

  howBtn.addEventListener('click', () => {
    howModal.classList.add('active');
    playSound('select');
  });
  closeHowBtn.addEventListener('click', () => {
    howModal.classList.remove('active');
  });

  initGame();
})();
