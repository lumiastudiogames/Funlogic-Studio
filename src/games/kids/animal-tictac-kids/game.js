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
      // Puppy cheerful playful bark
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.1);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'meow') {
      // Kitty cute meow
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.linearRampToValueAtTime(680, now + 0.16);
      osc.frequency.linearRampToValueAtTime(520, now + 0.32);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } else if (type === 'win') {
      // Cheerful fanfare
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
    } else if (type === 'lose') {
      // Soft gentle 'oops' slide down (not scary for kids)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.35);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  }

  // Spawn starburst explosion effect on click
  function spawnStarParticles(clientX, clientY) {
    const stars = ['⭐', '✨', '🌟', '💛', '🐾'];
    const count = 7;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star-particle';
      star.textContent = stars[Math.floor(Math.random() * stars.length)];
      
      const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.5 - 0.25);
      const distance = 35 + Math.random() * 45;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const rot = Math.floor(Math.random() * 360) + 'deg';

      star.style.left = `${clientX}px`;
      star.style.top = `${clientY}px`;
      star.style.setProperty('--tx', `${tx}px`);
      star.style.setProperty('--ty', `${ty}px`);
      star.style.setProperty('--rot', rot);

      document.body.appendChild(star);
      setTimeout(() => star.remove(), 700);
    }
  }

  function initGame() {
    board = Array(9).fill(null);
    isPlayerTurn = true;
    isGameOver = false;
    startTime = Date.now();

    document.getElementById('win-modal')?.classList.remove('active');
    document.getElementById('lose-modal')?.classList.remove('active');
    document.getElementById('tie-modal')?.classList.remove('active');

    updateTurnUI(true);
    updateHint('Your turn! Tap a tile to place Puppy 🐶');
    renderBoard();
  }

  function updateTurnUI(isPlayer) {
    const dogCard = document.getElementById('player-card-dog');
    const catCard = document.getElementById('player-card-cat');

    if (isPlayer) {
      dogCard?.classList.add('active-turn');
      catCard?.classList.remove('active-turn');
      const statusDog = dogCard?.querySelector('.player-status');
      const statusCat = catCard?.querySelector('.player-status');
      if (statusDog) statusDog.textContent = 'Your Turn';
      if (statusCat) statusCat.textContent = 'Waiting';
    } else {
      dogCard?.classList.remove('active-turn');
      catCard?.classList.add('active-turn');
      const statusDog = dogCard?.querySelector('.player-status');
      const statusCat = catCard?.querySelector('.player-status');
      if (statusDog) statusDog.textContent = 'Please Wait';
      if (statusCat) statusCat.textContent = 'Thinking...';
    }
  }

  function updateHint(text) {
    const el = document.getElementById('hint-bar');
    if (el) el.textContent = text;
  }

  function renderBoard(winningCombo = null) {
    const boardEl = document.getElementById('tictac-board');
    if (!boardEl) return;
    boardEl.innerHTML = '';

    board.forEach((val, idx) => {
      const cell = document.createElement('div');
      cell.className = 'tictac-cell';

      if (val !== null) {
        cell.classList.add('taken');
        const emojiSpan = document.createElement('span');
        emojiSpan.className = 'emoji-3d';
        emojiSpan.textContent = val;
        cell.appendChild(emojiSpan);
      }

      if (winningCombo && winningCombo.includes(idx)) {
        cell.classList.add('winning-cell');
      }

      cell.addEventListener('click', (e) => {
        handleCellClick(idx, e);
      });

      boardEl.appendChild(cell);
    });
  }

  function handleCellClick(idx, event) {
    if (!isPlayerTurn || isGameOver || board[idx] !== null) return;

    // Starburst particles on click
    if (event) {
      spawnStarParticles(event.clientX, event.clientY);
    }

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
    updateTurnUI(false);
    updateHint('Kitty 🐱 is planning a move...');

    setTimeout(() => {
      aiMove();
    }, 450);
  }

  function aiMove() {
    if (isGameOver) return;

    // Gentle AI with priority:
    // 1. Can Cat win now? Take it!
    // 2. Can Player win? Block it sometimes (65%)
    // 3. Else take center or best open
    let moveIdx = findWinningMove('🐱');
    if (moveIdx === -1 && Math.random() < 0.65) {
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

      // Trigger small starburst on cat placement
      const cells = document.querySelectorAll('.tictac-cell');
      const targetCell = cells[moveIdx];
      if (targetCell) {
        const rect = targetCell.getBoundingClientRect();
        spawnStarParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }

      const winCombo = checkWin('🐱');
      if (winCombo) {
        handleLose(winCombo);
        return;
      }

      if (isBoardFull()) {
        handleTie();
        return;
      }

      isPlayerTurn = true;
      updateTurnUI(true);
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
    updateHint("Friendly tie! 🐶❤️🐱 Tap restart to play again!");
    setTimeout(() => {
      document.getElementById('tie-modal')?.classList.add('active');
    }, 400);
  }

  function handleLose(combo) {
    isGameOver = true;
    renderBoard(combo);
    playSound('lose');
    updateHint('Kitty got 3 in a row! Tap try again 🐱🐾');

    setTimeout(() => {
      document.getElementById('lose-modal')?.classList.add('active');
    }, 500);
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
      const wtEl = document.getElementById('win-time');
      if (wtEl) wtEl.textContent = `${elapsedSeconds}s`;
      document.getElementById('win-modal')?.classList.add('active');
    }, 500);
  }

  document.getElementById('btn-restart')?.addEventListener('click', initGame);
  document.getElementById('btn-play-again')?.addEventListener('click', initGame);
  document.getElementById('btn-try-again')?.addEventListener('click', initGame);
  document.getElementById('btn-tie-again')?.addEventListener('click', initGame);

  const soundBtn = document.getElementById('btn-sound');
  soundBtn?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playSound('bark');
  });

  const howBtn = document.getElementById('btn-how');
  const howModal = document.getElementById('how-modal');
  const closeHowBtn = document.getElementById('btn-close-how');

  howBtn?.addEventListener('click', () => {
    howModal?.classList.add('active');
  });
  closeHowBtn?.addEventListener('click', () => {
    howModal?.classList.remove('active');
  });

  initGame();
})();

