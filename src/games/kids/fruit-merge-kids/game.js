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

  let score = 0;
  let newlyMergedCoords = [];

  function spawnFruitSparkles(tileEl) {
    if (!tileEl) return;
    const rect = tileEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const stars = ['✨', '⭐', '🌟', '✦', '🍓', '🍉'];
    stars.forEach((s, i) => {
      const sp = document.createElement('span');
      sp.className = 'fruit-sparkle';
      sp.textContent = s;
      const angle = (i / stars.length) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
      const dist = 32 + Math.random() * 28;
      sp.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      sp.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      sp.style.setProperty('--rot', `${(Math.random() - 0.5) * 120}deg`);
      sp.style.left = `${cx}px`;
      sp.style.top = `${cy}px`;
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 700);
    });
  }

  function initGame() {
    grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    score = 0;
    const scoreEl = document.getElementById('score-val');
    if (scoreEl) scoreEl.textContent = '0';
    newlyMergedCoords = [];
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

  function updateFruitCards() {
    let maxVal = 2;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] > maxVal) maxVal = grid[r][c];
      }
    }

    const valToTier = { 2: 1, 4: 2, 8: 3, 16: 4, 32: 5 };
    const currentMaxTier = valToTier[maxVal] || 1;

    document.querySelectorAll('.fruit-card').forEach(card => {
      const tier = parseInt(card.dataset.tier, 10);
      if (tier <= currentMaxTier) {
        card.classList.add('unlocked');
      } else {
        card.classList.remove('unlocked');
      }
      if (tier === currentMaxTier) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  function render() {
    updateFruitCards();
    const container = document.getElementById('tiles-layer');
    const boardEl = document.getElementById('board-container');
    container.innerHTML = '';
    const boardWidth = boardEl ? boardEl.clientWidth : 300;
    const padding = 8;
    const gap = 8;
    const cellSize = (boardWidth - (padding * 2) - (gap * (SIZE - 1))) / SIZE;

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const val = grid[r][c];
        if (val !== 0) {
          const tile = document.createElement('div');
          const isMerged = newlyMergedCoords.some(coord => coord.r === r && coord.c === c);
          tile.className = `tile tile-${val}` + (isMerged ? ' tile-merged' : '');

          const left = padding + c * (cellSize + gap);
          const top = padding + r * (cellSize + gap);
          tile.style.left = `${left}px`;
          tile.style.top = `${top}px`;
          tile.style.width = `${cellSize}px`;
          tile.style.height = `${cellSize}px`;

          const fruit = FRUITS[val] || { emoji: '✨', name: 'Magic' };
          tile.innerHTML = `
            <span class="tile-emoji">${fruit.emoji}</span>
            <span class="tile-level">${fruit.name}</span>
          `;
          container.appendChild(tile);

          if (isMerged) {
            setTimeout(() => spawnFruitSparkles(tile), 20);
          }
        }
      }
    }
    newlyMergedCoords = [];
  }

  function slide(row) {
    let arr = row.filter(v => v !== 0);
    let merged = false;
    let gained = 0;
    let mergedIndices = [];
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        gained += arr[i];
        arr[i + 1] = 0;
        merged = true;
        mergedIndices.push(i);
        if (arr[i] === 32 && !isWon) {
          handleWin();
        }
      }
    }
    arr = arr.filter(v => v !== 0);
    while (arr.length < SIZE) {
      arr.push(0);
    }
    return { arr, merged, gained, mergedIndices };
  }

  function move(direction) {
    if (isWon || isGameOver) return;
    let moved = false;
    let anyMerged = false;
    let stepScore = 0;
    newlyMergedCoords = [];

    if (direction === 'left') {
      for (let r = 0; r < SIZE; r++) {
        const oldRow = [...grid[r]];
        const { arr, merged, gained, mergedIndices } = slide(grid[r]);
        grid[r] = arr;
        if (merged) {
          anyMerged = true;
          stepScore += gained;
          mergedIndices.forEach(idx => newlyMergedCoords.push({ r, c: idx }));
        }
        if (oldRow.some((val, idx) => val !== arr[idx])) moved = true;
      }
    } else if (direction === 'right') {
      for (let r = 0; r < SIZE; r++) {
        const oldRow = [...grid[r]];
        const reversed = [...grid[r]].reverse();
        const { arr, merged, gained, mergedIndices } = slide(reversed);
        grid[r] = arr.reverse();
        if (merged) {
          anyMerged = true;
          stepScore += gained;
          mergedIndices.forEach(idx => newlyMergedCoords.push({ r, c: (SIZE - 1) - idx }));
        }
        if (oldRow.some((val, idx) => val !== grid[r][idx])) moved = true;
      }
    } else if (direction === 'up') {
      for (let c = 0; c < SIZE; c++) {
        const col = [grid[0][c], grid[1][c], grid[2][c]];
        const oldCol = [...col];
        const { arr, merged, gained, mergedIndices } = slide(col);
        for (let r = 0; r < SIZE; r++) grid[r][c] = arr[r];
        if (merged) {
          anyMerged = true;
          stepScore += gained;
          mergedIndices.forEach(idx => newlyMergedCoords.push({ r: idx, c }));
        }
        if (oldCol.some((val, idx) => val !== arr[idx])) moved = true;
      }
    } else if (direction === 'down') {
      for (let c = 0; c < SIZE; c++) {
        const col = [grid[2][c], grid[1][c], grid[0][c]];
        const oldCol = [...col];
        const { arr, merged, gained, mergedIndices } = slide(col);
        grid[2][c] = arr[0];
        grid[1][c] = arr[1];
        grid[0][c] = arr[2];
        if (merged) {
          anyMerged = true;
          stepScore += gained;
          mergedIndices.forEach(idx => newlyMergedCoords.push({ r: (SIZE - 1) - idx, c }));
        }
        if (oldCol[0] !== arr[0] || oldCol[1] !== arr[1] || oldCol[2] !== arr[2]) moved = true;
      }
    }

    if (moved) {
      if (anyMerged) {
        score += stepScore;
        const scoreEl = document.getElementById('score-val');
        if (scoreEl) scoreEl.textContent = score;
        playSound('merge');
      } else {
        playSound('slide');
      }

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
      const wtEl = document.getElementById('win-time');
      if (wtEl) wtEl.textContent = `${elapsedSeconds}s`;
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

  // Mouse Drag / Swipe
  let mouseStartX = 0;
  let mouseStartY = 0;
  let isMouseDragging = false;

  boardEl.addEventListener('mousedown', e => {
    mouseStartX = e.clientX;
    mouseStartY = e.clientY;
    isMouseDragging = true;
  });

  window.addEventListener('mouseup', e => {
    if (!isMouseDragging) return;
    isMouseDragging = false;
    const dx = e.clientX - mouseStartX;
    const dy = e.clientY - mouseStartY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 20) {
      if (absX > absY) {
        move(dx > 0 ? 'right' : 'left');
      } else {
        move(dy > 0 ? 'down' : 'up');
      }
    }
  });

  // D-pad Buttons
  document.querySelectorAll('.d-pad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.dataset.dir ? btn.dataset.dir.toLowerCase() : '';
      if (dir) move(dir);
    });
  });

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
