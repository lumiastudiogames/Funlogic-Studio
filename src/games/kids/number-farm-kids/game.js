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
  let musicEnabled = true;

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

  // Cheerful Farm Background Music Engine
  let bgmTimer = null;
  let bgmStep = 0;
  // C major chord progression: C - G - Am - F
  const BGM_CHORDS = [
    [261.63, 329.63, 392.00, 523.25], // C
    [196.00, 246.94, 293.66, 392.00], // G
    [220.00, 261.63, 329.63, 440.00], // Am
    [174.61, 220.00, 261.63, 349.23]  // F
  ];

  function playBGMNote() {
    if (!musicEnabled || isWon) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const chordIdx = Math.floor(bgmStep / 4) % BGM_CHORDS.length;
    const chord = BGM_CHORDS[chordIdx];
    const noteIdx = bgmStep % 4;
    const freq = chord[noteIdx];
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);

    bgmStep++;
  }

  function startBGM() {
    clearInterval(bgmTimer);
    bgmTimer = setInterval(playBGMNote, 420);
  }

  function stopBGM() {
    clearInterval(bgmTimer);
  }

  // Generate 4x4 Sudoku with 2x2 boxes
  function generatePuzzle() {
    const base = [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1]
    ];

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
    updateStatus('Arraste os bichinhos para o cercado ou toque no quadrado!');
    render();
    if (musicEnabled) startBGM();
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
        cell.dataset.r = r;
        cell.dataset.c = c;
        if (fixed[r][c]) cell.classList.add('fixed');
        if (selectedRow === r && selectedCol === c) cell.classList.add('selected');
        if (hasConflict(r, c)) cell.classList.add('conflict');

        const val = board[r][c];
        if (val && ANIMALS[val]) {
          cell.innerHTML = `
            <span class="animal-emoji">${ANIMALS[val].emoji}</span>
            <span class="corner-num">${val}</span>
          `;
        }

        cell.addEventListener('click', () => {
          if (isWon) return;
          if (fixed[r][c]) {
            playSound('tap');
            updateStatus('Este bichinho já está feliz descansando aí! 🌾');
            return;
          }
          selectedRow = r;
          selectedCol = c;
          playSound('tap');
          updateStatus(`Quadrado escolhido! Toque ou arraste um bichinho.`);
          render();
        });

        gridEl.appendChild(cell);
      }
    }
  }

  function placeAnimalAt(r, c, val) {
    if (r === null || c === null || isWon) return;
    if (fixed[r][c]) return;

    board[r][c] = val;
    selectedRow = r;
    selectedCol = c;

    if (val === 0) {
      playSound('tap');
      updateStatus('Quadrado limpo.');
    } else {
      playSound('place');
      updateStatus(`Colocou ${ANIMALS[val].name} ${ANIMALS[val].emoji}!`);
    }

    render();

    if (checkWinCondition()) {
      handleWin();
    }
  }

  function placeAnimal(val) {
    if (selectedRow === null || selectedCol === null) return;
    placeAnimalAt(selectedRow, selectedCol, val);
  }

  function handleWin() {
    isWon = true;
    playSound('win');
    stopBGM();
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    updateStatus('🎉 A fazenda está completa e todos os animais felizes!');

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

  // Setup Drag & Drop Engine (Pointer events for Mobile + Desktop)
  let activeDragVal = null;
  let ghostEl = null;

  function createGhost(val, x, y) {
    if (ghostEl) ghostEl.remove();
    ghostEl = document.createElement('div');
    ghostEl.className = 'drag-ghost';
    if (val === 0) {
      ghostEl.textContent = '❌';
    } else if (ANIMALS[val]) {
      ghostEl.innerHTML = `${ANIMALS[val].emoji}<span class="corner-num" style="top:-8px;right:-8px;">${val}</span>`;
    }
    ghostEl.style.left = `${x}px`;
    ghostEl.style.top = `${y}px`;
    document.body.appendChild(ghostEl);
  }

  function updateGhost(x, y) {
    if (!ghostEl) return;
    ghostEl.style.left = `${x}px`;
    ghostEl.style.top = `${y}px`;

    // Highlight cell under pointer
    document.querySelectorAll('.cell.drop-target').forEach(el => el.classList.remove('drop-target'));
    const target = document.elementFromPoint(x, y);
    if (target) {
      const cell = target.closest('.cell');
      if (cell && !cell.classList.contains('fixed')) {
        cell.classList.add('drop-target');
      }
    }
  }

  function finishDrag(x, y) {
    document.querySelectorAll('.cell.drop-target').forEach(el => el.classList.remove('drop-target'));
    if (ghostEl) {
      ghostEl.remove();
      ghostEl = null;
    }
    if (activeDragVal === null) return;

    const target = document.elementFromPoint(x, y);
    if (target) {
      const cell = target.closest('.cell');
      if (cell && !cell.classList.contains('fixed')) {
        const r = parseInt(cell.dataset.r, 10);
        const c = parseInt(cell.dataset.c, 10);
        placeAnimalAt(r, c, activeDragVal);
      }
    }
    activeDragVal = null;
  }

  // Setup Tray buttons (Click & Drag)
  document.querySelectorAll('.tray-btn').forEach(btn => {
    const val = parseInt(btn.dataset.val, 10);

    btn.addEventListener('click', () => {
      placeAnimal(val);
    });

    btn.addEventListener('pointerdown', (e) => {
      if (isWon) return;
      activeDragVal = val;
      createGhost(val, e.clientX, e.clientY);
      getAudioContext();
      if (musicEnabled && !bgmTimer) startBGM();
    });
  });

  window.addEventListener('pointermove', (e) => {
    if (activeDragVal !== null) {
      e.preventDefault();
      updateGhost(e.clientX, e.clientY);
    }
  });

  window.addEventListener('pointerup', (e) => {
    if (activeDragVal !== null) {
      finishDrag(e.clientX, e.clientY);
    }
  });

  window.addEventListener('pointercancel', () => {
    if (ghostEl) {
      ghostEl.remove();
      ghostEl = null;
    }
    activeDragVal = null;
    document.querySelectorAll('.cell.drop-target').forEach(el => el.classList.remove('drop-target'));
  });

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-play-again').addEventListener('click', initGame);

  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playSound('tap');
  });

  const musicBtn = document.getElementById('btn-music');
  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      musicEnabled = !musicEnabled;
      musicBtn.textContent = musicEnabled ? '🎵' : '🔇';
      if (musicEnabled) {
        startBGM();
      } else {
        stopBGM();
      }
    });
  }

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

  // Start BGM on first user interaction
  window.addEventListener('pointerdown', () => {
    getAudioContext();
    if (musicEnabled && !bgmTimer && !isWon) startBGM();
  }, { once: true });

  initGame();
})();
