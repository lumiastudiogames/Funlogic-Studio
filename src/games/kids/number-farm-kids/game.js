// Number Farm Kids - 4x4 Farm Sudoku for Children
(function() {
  'use strict';

  const ANIMALS = {
    1: { emoji: '🐶', name: 'Dog' },
    2: { emoji: '🐱', name: 'Cat' },
    3: { emoji: '🐷', name: 'Pig' },
    4: { emoji: '🐮', name: 'Cow' }
  };

  let solution = [];
  let board = [];
  let fixed = [];
  let selectedRow = null;
  let selectedCol = null;
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

    if (type === 'tap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'place') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
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

  // Generate 4x4 Sudoku with 2x2 boxes
  function generatePuzzle() {
    // Base 4x4 valid Sudoku
    const base = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1]
    ];

    // Permute numbers
    const perm = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
    const map = {};
    for (let i = 1; i <= 4; i++) map[i] = perm[i - 1];

    solution = Array(4).fill(null).map(() => Array(4).fill(0));
    board = Array(4).fill(null).map(() => Array(4).fill(0));
    fixed = Array(4).fill(null).map(() => Array(4).fill(false));

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        solution[r][c] = map[base[r][c]];
      }
    }

    // Keep 9 clues so it's super accessible for young kids (easy, encouraging)
    const positions = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) positions.push([r, c]);
    }
    positions.sort(() => Math.random() - 0.5);

    const clueCount = 9;
    for (let i = 0; i < clueCount; i++) {
      const [r, c] = positions[i];
      board[r][c] = solution[r][c];
      fixed[r][c] = true;
    }
  }

  function initGame() {
    generatePuzzle();
    selectedRow = null;
    selectedCol = null;
    isWon = false;
    startTime = Date.now();
    document.getElementById('win-modal').classList.remove('active');
    updateStatus('Tap a square, then choose a farm pet!');
    render();
  }

  function updateStatus(text) {
    const el = document.getElementById('status-text');
    if (el) el.textContent = text;
  }

  function hasConflict(r, c) {
    const val = board[r][c];
    if (!val) return false;

    // Check row
    for (let col = 0; col < 4; col++) {
      if (col !== c && board[r][col] === val) return true;
    }
    // Check col
    for (let row = 0; row < 4; row++) {
      if (row !== r && board[row][c] === val) return true;
    }
    // Check 2x2 box
    const startR = Math.floor(r / 2) * 2;
    const startC = Math.floor(c / 2) * 2;
    for (let row = startR; row < startR + 2; row++) {
      for (let col = startC; col < startC + 2; col++) {
        if ((row !== r || col !== c) && board[row][col] === val) return true;
      }
    }
    return false;
  }

  function checkWinCondition() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!board[r][c] || hasConflict(r, c)) return false;
      }
    }
    return true;
  }

  function render() {
    const gridEl = document.getElementById('sudoku-grid');
    gridEl.innerHTML = '';

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        if (fixed[r][c]) cell.classList.add('fixed');
        if (selectedRow === r && selectedCol === c) cell.classList.add('selected');
        if (hasConflict(r, c)) cell.classList.add('conflict');

        const val = board[r][c];
        if (val && ANIMALS[val]) {
          cell.textContent = ANIMALS[val].emoji;
        }

        cell.addEventListener('click', () => {
          if (isWon) return;
          if (fixed[r][c]) {
            playSound('tap');
            updateStatus('That animal is already happily resting there!');
            return;
          }
          selectedRow = r;
          selectedCol = c;
          playSound('tap');
          updateStatus(`Square selected! Pick an animal below.`);
          render();
        });

        gridEl.appendChild(cell);
      }
    }
  }

  function placeAnimal(val) {
    if (selectedRow === null || selectedCol === null || isWon) return;
    if (fixed[selectedRow][selectedCol]) return;

    board[selectedRow][selectedCol] = val;
    if (val === 0) {
      playSound('tap');
      updateStatus('Square cleared.');
    } else {
      playSound('place');
      updateStatus(`Placed ${ANIMALS[val].name} ${ANIMALS[val].emoji}!`);
    }

    render();

    if (checkWinCondition()) {
      handleWin();
    }
  }

  function handleWin() {
    isWon = true;
    playSound('win');
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    updateStatus('🎉 Farm is happy! All animals in place!');

    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'win', time: elapsedSeconds }, '*');
      }
    } catch (e) {}

    setTimeout(() => {
      document.getElementById('win-time').textContent = `${elapsedSeconds}s`;
      document.getElementById('win-modal').classList.add('active');
    }, 400);
  }

  // Setup Tray buttons
  document.querySelectorAll('.tray-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.val, 10);
      placeAnimal(val);
    });
  });

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-play-again').addEventListener('click', initGame);

  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playSound('tap');
  });

  const howBtn = document.getElementById('btn-how');
  const howModal = document.getElementById('how-modal');
  const closeHowBtn = document.getElementById('btn-close-how');

  howBtn.addEventListener('click', () => {
    howModal.classList.add('active');
    playSound('tap');
  });
  closeHowBtn.addEventListener('click', () => {
    howModal.classList.remove('active');
  });

  initGame();
})();
