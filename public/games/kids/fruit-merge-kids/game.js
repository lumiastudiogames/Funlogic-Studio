// Fruit Merge Kids - 3x3 2048 with Fruits
(function() {
  'use strict';

  const FRUITS = {
    2: { emoji: '🍎', name: 'Apple' },
    4: { emoji: '🍌', name: 'Banana' },
    8: { emoji: '🍇', name: 'Grapes' },
    16: { emoji: '🍊', name: 'Orange' },
    32: { emoji: '🍉', name: 'Watermelon' }
  };

  const SIZE = 3;
  let grid = [];
  let startTime = Date.now();
  let isWon = false;
  let isGameOver = false;
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

    if (type === 'slide') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'merge') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.09);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
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
    grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    isWon = false;
    isGameOver = false;
    startTime = Date.now();
    document.getElementById('win-modal').classList.remove('active');

    spawnRandom();
    spawnRandom();
    render();
  }

  function spawnRandom() {
    const emptyCells = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return;
    const choice = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // In kid mode, 85% 2 (Apple), 15% 4 (Banana)
    grid[choice.r][choice.c] = Math.random() < 0.85 ? 2 : 4;
  }

  function render() {
    const container = document.getElementById('tiles-layer');
    container.innerHTML = '';

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const val = grid[r][c];
        if (val !== 0) {
          const tile = document.createElement('div');
          tile.className = `tile tile-${val}`;
          // Position relative to cell in 300x300 container
          // cell size is 88px + 8px gap + 8px padding
          const left = 8 + c * (82 + 8);
          const top = 8 + r * (82 + 8);
          tile.style.left = `${left}px`;
          tile.style.top = `${top}px`;

          const fruit = FRUITS[val] || { emoji: '✨', name: 'Magic' };
          tile.innerHTML = `
            <span class="tile-emoji">${fruit.emoji}</span>
            <span class="tile-level">${fruit.name}</span>
          `;
          container.appendChild(tile);
        }
      }
    }
  }

  function slide(row) {
    let arr = row.filter(v => v !== 0);
    let merged = false;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        arr[i + 1] = 0;
        merged = true;
        if (arr[i] === 32 && !isWon) {
          handleWin();
        }
      }
    }
    arr = arr.filter(v => v !== 0);
    while (arr.length < SIZE) {
      arr.push(0);
    }
    return { arr, merged };
  }

  function move(direction) {
    if (isWon || isGameOver) return;
    let moved = false;
    let anyMerged = false;

    if (direction === 'left') {
      for (let r = 0; r < SIZE; r++) {
        const oldRow = [...grid[r]];
        const { arr, merged } = slide(grid[r]);
        grid[r] = arr;
        if (merged) anyMerged = true;
        if (oldRow.some((val, idx) => val !== arr[idx])) moved = true;
      }
    } else if (direction === 'right') {
      for (let r = 0; r < SIZE; r++) {
        const oldRow = [...grid[r]];
        const reversed = [...grid[r]].reverse();
        const { arr, merged } = slide(reversed);
        grid[r] = arr.reverse();
        if (merged) anyMerged = true;
        if (oldRow.some((val, idx) => val !== grid[r][idx])) moved = true;
      }
    } else if (direction === 'up') {
      for (let c = 0; c < SIZE; c++) {
        const col = [grid[0][c], grid[1][c], grid[2][c]];
        const oldCol = [...col];
        const { arr, merged } = slide(col);
        for (let r = 0; r < SIZE; r++) grid[r][c] = arr[r];
        if (merged) anyMerged = true;
        if (oldCol.some((val, idx) => val !== arr[idx])) moved = true;
      }
    } else if (direction === 'down') {
      for (let c = 0; c < SIZE; c++) {
        const col = [grid[2][c], grid[1][c], grid[0][c]];
        const oldCol = [...col];
        const { arr, merged } = slide(col);
        grid[2][c] = arr[0];
        grid[1][c] = arr[1];
        grid[0][c] = arr[2];
        if (merged) anyMerged = true;
        if (oldCol[0] !== arr[0] || oldCol[1] !== arr[1] || oldCol[2] !== arr[2]) moved = true;
      }
    }

    if (moved) {
      if (anyMerged) playSound('merge');
      else playSound('slide');

      spawnRandom();
      render();
      checkGameOver();
    }
  }

  function checkGameOver() {
    // Check if any empty cell
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) return;
      }
    }
    // Check if any adjacent matches
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return;
        if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return;
      }
    }
    // No moves left
    isGameOver = true;
    setTimeout(() => {
      alert('Tray is full! Try again to get the Watermelon!');
      initGame();
    }, 400);
  }

  function handleWin() {
    isWon = true;
    playSound('win');
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));

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

  // Keyboard navigation
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); move('left'); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); move('right'); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move('up'); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); move('down'); }
  });

  // Touch Swipe
  let touchStartX = 0;
  let touchStartY = 0;
  const boardEl = document.getElementById('board-container');

  boardEl.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  boardEl.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 25) {
      if (absX > absY) {
        move(dx > 0 ? 'right' : 'left');
      } else {
        move(dy > 0 ? 'down' : 'up');
      }
    }
  }, { passive: true });

  // D-pad Buttons
  document.getElementById('btn-up').addEventListener('click', () => move('up'));
  document.getElementById('btn-left').addEventListener('click', () => move('left'));
  document.getElementById('btn-down').addEventListener('click', () => move('down'));
  document.getElementById('btn-right').addEventListener('click', () => move('right'));

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-play-again').addEventListener('click', initGame);

  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playSound('slide');
  });

  const howBtn = document.getElementById('btn-how');
  const howModal = document.getElementById('how-modal');
  const closeHowBtn = document.getElementById('btn-close-how');

  howBtn.addEventListener('click', () => {
    howModal.classList.add('active');
    playSound('slide');
  });
  closeHowBtn.addEventListener('click', () => {
    howModal.classList.remove('active');
  });

  initGame();
})();
