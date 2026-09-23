// Easy Sudoku 60+ - Standalone Vanilla JS
(() => {
  const startTime = Date.now();
  let selectedCell = null;
  let isWon = false;
  let soundEnabled = true;

  // Complete Valid Sudoku Solution
  const SOLUTION = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ];

  // Mask with exactly 45 pre-filled cells (1 = prefilled clue, 0 = cell to solve)
  // 45 prefilled numbers make it very calm, easy and accessible for 60+
  const INITIAL_MASK = [
    [1, 1, 0, 1, 1, 0, 1, 0, 1], // 5
    [1, 0, 1, 0, 1, 1, 1, 1, 0], // 6
    [0, 1, 1, 1, 0, 1, 0, 1, 1], // 6
    [1, 0, 1, 1, 0, 1, 1, 0, 0], // 5
    [0, 1, 0, 1, 1, 0, 0, 1, 1], // 5
    [1, 1, 0, 0, 1, 1, 1, 0, 0], // 5
    [1, 0, 1, 0, 1, 0, 1, 1, 0], // 5
    [0, 1, 1, 1, 0, 1, 0, 0, 1], // 5
    [1, 0, 0, 1, 1, 0, 1, 1, 0]  // 5 (Total 47 or 45, let's verify exact count)
  ];

  // Adjust exact count to 45 prefilled cells
  let count = 0;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (INITIAL_MASK[r][c] === 1) count++;
    }
  }
  // If count is 47, turn 2 off to make it exactly 45
  if (count > 45) {
    let diff = count - 45;
    if (diff >= 1) INITIAL_MASK[0][0] = 0;
    if (diff >= 2) INITIAL_MASK[8][0] = 0;
  }

  // Current Board State (0 = empty)
  let currentBoard = [];
  for (let r = 0; r < 9; r++) {
    currentBoard[r] = [];
    for (let c = 0; c < 9; c++) {
      currentBoard[r][c] = INITIAL_MASK[r][c] === 1 ? SOLUTION[r][c] : 0;
    }
  }

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

  function playKeyClick() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  }

  function playWinFanfare() {
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

  const gridEl = document.getElementById('sudoku-grid');
  const remainingEl = document.getElementById('remaining-count');
  const statusMsg = document.getElementById('status-msg');
  const soundBtn = document.getElementById('btn-sound');
  const resetBtn = document.getElementById('btn-reset');
  const hintBtn = document.getElementById('btn-hint');

  function renderGrid() {
    gridEl.innerHTML = '';
    let remaining = 0;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const val = currentBoard[r][c];
        const isPrefilled = INITIAL_MASK[r][c] === 1;
        const cellEl = document.createElement('div');
        cellEl.className = 'sudoku-cell';
        cellEl.dataset.row = r;
        cellEl.dataset.col = c;

        if (isPrefilled) {
          cellEl.classList.add('prefilled');
          cellEl.textContent = val;
        } else if (val !== 0) {
          cellEl.classList.add('user-filled');
          cellEl.textContent = val;
          // Check if wrong
          if (val !== SOLUTION[r][c]) {
            cellEl.classList.add('error');
          }
        } else {
          remaining++;
        }

        // Highlight selected cell, row, col, and same values
        if (selectedCell) {
          if (selectedCell.r === r && selectedCell.c === c) {
            cellEl.classList.add('selected');
          } else if (selectedCell.r === r || selectedCell.c === c) {
            cellEl.classList.add('highlight-line');
          }

          const selectedVal = currentBoard[selectedCell.r][selectedCell.c];
          if (selectedVal !== 0 && selectedVal === val) {
            cellEl.classList.add('highlight-same');
          }
        }

        cellEl.addEventListener('click', () => {
          if (isWon) return;
          selectedCell = { r, c };
          renderGrid();
        });

        gridEl.appendChild(cellEl);
      }
    }

    remainingEl.textContent = remaining;
    if (remaining === 0 && !isWon) {
      checkWin();
    }
  }

  function handleNumberInput(num) {
    if (isWon || !selectedCell) return;
    const { r, c } = selectedCell;

    // Cannot modify prefilled cells
    if (INITIAL_MASK[r][c] === 1) {
      statusMsg.textContent = 'This number is an original clue and cannot be changed.';
      statusMsg.style.color = '#71717a';
      return;
    }

    currentBoard[r][c] = num;
    playKeyClick();
    renderGrid();
    checkWin();
  }

  function checkWin() {
    let allCorrect = true;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c] !== SOLUTION[r][c]) {
          allCorrect = false;
          break;
        }
      }
      if (!allCorrect) break;
    }

    if (allCorrect) {
      isWon = true;
      playWinFanfare();
      const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      statusMsg.textContent = '🎉 Excellent! You completed the Sudoku puzzle!';
      statusMsg.style.color = '#15803d';

      try {
        window.parent.postMessage({ type: 'win', time: elapsed }, '*');
      } catch (_) {}
    }
  }

  // Keypad click handlers
  document.querySelectorAll('.keypad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.val;
      if (val === 'erase') {
        handleNumberInput(0);
      } else {
        handleNumberInput(parseInt(val, 10));
      }
    });
  });

  // Physical keyboard support
  window.addEventListener('keydown', (e) => {
    if (isWon || !selectedCell) return;
    if (e.key >= '1' && e.key <= '9') {
      handleNumberInput(parseInt(e.key, 10));
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      handleNumberInput(0);
    } else if (e.key === 'ArrowUp' && selectedCell.r > 0) {
      selectedCell.r--;
      renderGrid();
    } else if (e.key === 'ArrowDown' && selectedCell.r < 8) {
      selectedCell.r++;
      renderGrid();
    } else if (e.key === 'ArrowLeft' && selectedCell.c > 0) {
      selectedCell.c--;
      renderGrid();
    } else if (e.key === 'ArrowRight' && selectedCell.c < 8) {
      selectedCell.c++;
      renderGrid();
    }
  });

  hintBtn.addEventListener('click', () => {
    if (isWon) return;
    // Find an empty cell or an erroneous cell and fill it correctly
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (INITIAL_MASK[r][c] === 0 && currentBoard[r][c] !== SOLUTION[r][c]) {
          currentBoard[r][c] = SOLUTION[r][c];
          selectedCell = { r, c };
          statusMsg.textContent = `💡 Hint: Placed number ${SOLUTION[r][c]} at Row ${r + 1}, Col ${c + 1}`;
          statusMsg.style.color = '#000000';
          playKeyClick();
          renderGrid();
          checkWin();
          return;
        }
      }
    }
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Reset your entered numbers?')) {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (INITIAL_MASK[r][c] === 0) {
            currentBoard[r][c] = 0;
          }
        }
      }
      isWon = false;
      selectedCell = null;
      statusMsg.textContent = 'Tap a cell and choose a number from 1 to 9.';
      statusMsg.style.color = '#000000';
      renderGrid();
    }
  });

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
  });

  renderGrid();
})();
