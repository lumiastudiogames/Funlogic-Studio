// Animal Tic-Tac Kids - Puppy vs Kitten 3x3 for Children
(function() {
  'use strict';

  const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  let board = Array(9).fill(null);
  let isPlayerTurn = true;
  let isGameOver = false;
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

    if (type === 'bark') {
      // Puppy yip
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.09);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'meow') {
      // Kitty meow
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(650, now + 0.15);
      osc.frequency.linearRampToValueAtTime(500, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
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
    board = Array(9).fill(null);
    isPlayerTurn = true;
    isGameOver = false;
    startTime = Date.now();
    document.getElementById('win-modal').classList.remove('active');
    updateHint('Your turn! Tap a tile to place a Puppy 🐶');
    renderBoard();
  }

  function updateHint(text) {
    const el = document.getElementById('hint-bar');
    if (el) el.textContent = text;
  }

  function renderBoard(winningCombo = null) {
    const boardEl = document.getElementById('tictac-board');
    boardEl.innerHTML = '';

    board.forEach((val, idx) => {
      const cell = document.createElement('div');
      cell.className = 'tictac-cell';
      if (val !== null) {
        cell.classList.add('taken');
        cell.textContent = val;
      }
      if (winningCombo && winningCombo.includes(idx)) {
        cell.classList.add('winning-cell');
      }

      cell.addEventListener('click', () => handleCellClick(idx));
      boardEl.appendChild(cell);
    });
  }

  function handleCellClick(idx) {
    if (!isPlayerTurn || isGameOver || board[idx] !== null) return;

    // Player move (Puppy 🐶)
    board[idx] = '🐶';
    playSound('bark');
    renderBoard();

    const winCombo = checkWin('🐶');
    if (winCombo) {
      handleWin(winCombo);
      return;
    }

    if (isBoardFull()) {
      handleTie();
      return;
    }

    // AI Turn (Kitty 🐱)
    isPlayerTurn = false;
    updateHint('Kitty 🐱 is thinking...');

    setTimeout(() => {
      aiMove();
    }, 400);
  }

  function aiMove() {
    if (isGameOver) return;

    // Gentle AI: Check if kitty can win in 1 move, else pick random
    let moveIdx = findWinningMove('🐱');
    if (moveIdx === -1 && Math.random() < 0.6) {
      moveIdx = findWinningMove('🐶'); // friendly block occasionally
    }
    if (moveIdx === -1) {
      const openIndices = board
        .map((val, idx) => val === null ? idx : null)
        .filter(idx => idx !== null);
      if (openIndices.length > 0) {
        moveIdx = openIndices[Math.floor(Math.random() * openIndices.length)];
      }
    }

    if (moveIdx !== -1) {
      board[moveIdx] = '🐱';
      playSound('meow');
      renderBoard();

      const winCombo = checkWin('🐱');
      if (winCombo) {
        isGameOver = true;
        renderBoard(winCombo);
        updateHint('Kitty got 3 in a row! Tap restart to try again.');
        return;
      }

      if (isBoardFull()) {
        handleTie();
        return;
      }

      isPlayerTurn = true;
      updateHint('Your turn! Place Puppy 🐶');
    }
  }

  function findWinningMove(player) {
    for (let combo of WIN_COMBOS) {
      const [a, b, c] = combo;
      const vals = [board[a], board[b], board[c]];
      if (vals.filter(v => v === player).length === 2 && vals.includes(null)) {
        if (board[a] === null) return a;
        if (board[b] === null) return b;
        if (board[c] === null) return c;
      }
    }
    return -1;
  }

  function checkWin(player) {
    for (let combo of WIN_COMBOS) {
      const [a, b, c] = combo;
      if (board[a] === player && board[b] === player && board[c] === player) {
        return combo;
      }
    }
    return null;
  }

  function isBoardFull() {
    return board.every(v => v !== null);
  }

  function handleTie() {
    isGameOver = true;
    updateHint("It's a friendly tie! 🐶❤️🐱 Tap restart to play again!");
  }

  function handleWin(combo) {
    isGameOver = true;
    renderBoard(combo);
    playSound('win');
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    updateHint('🎉 3 Puppies in a row! You won!');

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
    if (soundEnabled) playSound('bark');
  });

  const howBtn = document.getElementById('btn-how');
  const howModal = document.getElementById('how-modal');
  const closeHowBtn = document.getElementById('btn-close-how');

  howBtn.addEventListener('click', () => {
    howModal.classList.add('active');
  });
  closeHowBtn.addEventListener('click', () => {
    howModal.classList.remove('active');
  });

  initGame();
})();
