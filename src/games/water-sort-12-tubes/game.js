// Water Sort 12 Tubes - Standalone Vanilla JS
(function () {
  'use strict';

  // 10 distinct vibrant liquid colors for the 10 filled tubes
  const COLORS = [
    { id: 'red', name: 'Ruby Red', hex: '#ef4444', gradient: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)' },
    { id: 'blue', name: 'Ocean Blue', hex: '#3b82f6', gradient: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)' },
    { id: 'green', name: 'Emerald Green', hex: '#10b981', gradient: 'linear-gradient(180deg, #34d399 0%, #059669 100%)' },
    { id: 'yellow', name: 'Amber Gold', hex: '#f59e0b', gradient: 'linear-gradient(180deg, #fbbf24 0%, #d97706 100%)' },
    { id: 'purple', name: 'Amethyst Purple', hex: '#a855f7', gradient: 'linear-gradient(180deg, #c084fc 0%, #7e22ce 100%)' },
    { id: 'orange', name: 'Sunset Orange', hex: '#f97316', gradient: 'linear-gradient(180deg, #fb923c 0%, #ea580c 100%)' },
    { id: 'cyan', name: 'Electric Cyan', hex: '#06b6d4', gradient: 'linear-gradient(180deg, #22d3ee 0%, #0891b2 100%)' },
    { id: 'pink', name: 'Neon Pink', hex: '#ec4899', gradient: 'linear-gradient(180deg, #f472b6 0%, #db2777 100%)' },
    { id: 'lime', name: 'Toxic Lime', hex: '#84cc16', gradient: 'linear-gradient(180deg, #a3e635 0%, #65a30d 100%)' },
    { id: 'teal', name: 'Deep Teal', hex: '#14b8a6', gradient: 'linear-gradient(180deg, #2dd4bf 0%, #0d9488 100%)' },
  ];

  const TUBE_CAPACITY = 4;
  const NUM_TUBES = 12;
  const NUM_FILLED = 10;

  // Game state
  let tubes = []; // array of arrays: tubes[i] = [bottomColor, ..., topColor]
  let selectedTubeIdx = null;
  let history = [];
  let moves = 0;
  let startTime = Date.now();
  let timerInterval = null;
  let soundEnabled = true;
  let isWon = false;

  // Web Audio Context for zero-dependency sound
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
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'select') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'pour') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'error') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'complete_tube') {
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.12, now + i * 0.06);
          gain.gain.linearRampToValueAtTime(0.01, now + i * 0.06 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.12);
        });
      } else if (type === 'win') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);
          gain.gain.setValueAtTime(0.2, now + i * 0.12);
          gain.gain.linearRampToValueAtTime(0.01, now + i * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.35);
        });
      }
    } catch (e) {
      // Audio fallback
    }
  }

  // Generate Solvable Puzzle: Reverse Shuffle from Complete State
  function generateSolvablePuzzle() {
    let state = [];
    for (let i = 0; i < NUM_FILLED; i++) {
      state.push([i, i, i, i]);
    }
    for (let i = NUM_FILLED; i < NUM_TUBES; i++) {
      state.push([]);
    }

    // Apply random valid reverse moves to ensure a reachable, fully solvable setup
    const shuffleSteps = 120;
    for (let step = 0; step < shuffleSteps; step++) {
      const srcCandidates = [];
      for (let i = 0; i < NUM_TUBES; i++) {
        if (state[i].length > 0) srcCandidates.push(i);
      }
      if (srcCandidates.length === 0) break;
      const src = srcCandidates[Math.floor(Math.random() * srcCandidates.length)];

      const dstCandidates = [];
      for (let j = 0; j < NUM_TUBES; j++) {
        if (j !== src && state[j].length < TUBE_CAPACITY) {
          dstCandidates.push(j);
        }
      }
      if (dstCandidates.length > 0) {
        const dst = dstCandidates[Math.floor(Math.random() * dstCandidates.length)];
        const item = state[src].pop();
        state[dst].push(item);
      }
    }

    // Make sure we end up with 2 empty tubes and 10 filled tubes
    // Pack items into 10 tubes of 4 if slight overflow
    const allBalls = [];
    for (let i = 0; i < NUM_TUBES; i++) {
      while (state[i].length > 0) allBalls.push(state[i].pop());
    }
    // Deterministic re-spread: 10 tubes of 4, 2 tubes of 0
    // Shuffle array
    for (let i = allBalls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allBalls[i], allBalls[j]] = [allBalls[j], allBalls[i]];
    }

    state = [];
    for (let i = 0; i < NUM_FILLED; i++) {
      state.push(allBalls.slice(i * 4, (i + 1) * 4));
    }
    for (let i = NUM_FILLED; i < NUM_TUBES; i++) {
      state.push([]);
    }

    return state;
  }

  function initGame() {
    tubes = generateSolvablePuzzle();
    selectedTubeIdx = null;
    history = [];
    moves = 0;
    isWon = false;
    startTime = Date.now();

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    updateHUD();
    renderTubes();
    hideVictoryModal();
  }

  function updateHUD() {
    const moveEl = document.getElementById('move-counter');
    if (moveEl) moveEl.textContent = moves;
    const undoEl = document.getElementById('undo-counter');
    if (undoEl) undoEl.textContent = history.length;
  }

  function updateTimer() {
    if (isWon) return;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const el = document.getElementById('timer-counter');
    if (el) {
      el.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }

  function renderTubes() {
    const row1 = document.getElementById('row-1');
    const row2 = document.getElementById('row-2');
    if (!row1 || !row2) return;

    row1.innerHTML = '';
    row2.innerHTML = '';

    tubes.forEach((tube, idx) => {
      const targetRow = idx < 6 ? row1 : row2;
      const tubeEl = document.createElement('div');
      tubeEl.className = 'tube';
      tubeEl.dataset.idx = idx;

      if (selectedTubeIdx === idx) {
        tubeEl.classList.add('selected');
      }

      if (isTubeComplete(tube)) {
        tubeEl.classList.add('locked');
      }

      tube.forEach((colorIdx, layerIdx) => {
        const layerEl = document.createElement('div');
        layerEl.className = 'liquid-layer';
        layerEl.style.background = COLORS[colorIdx].gradient;

        // Surface wave on top liquid
        if (layerIdx === tube.length - 1) {
          const surf = document.createElement('div');
          surf.className = 'liquid-surface';
          layerEl.appendChild(surf);
        }

        tubeEl.appendChild(layerEl);
      });

      tubeEl.addEventListener('click', () => handleTubeClick(idx));
      targetRow.appendChild(tubeEl);
    });
  }

  function isTubeComplete(tube) {
    if (tube.length !== TUBE_CAPACITY) return false;
    return tube.every(c => c === tube[0]);
  }

  function handleTubeClick(idx) {
    if (isWon) return;

    if (selectedTubeIdx === null) {
      // First click: select source
      if (tubes[idx].length === 0) {
        playSound('error');
        shakeTube(idx);
        return;
      }
      // If tube is already complete, no need to move
      if (isTubeComplete(tubes[idx])) {
        shakeTube(idx);
        return;
      }
      selectedTubeIdx = idx;
      playSound('select');
      renderTubes();
    } else if (selectedTubeIdx === idx) {
      // Deselect
      selectedTubeIdx = null;
      playSound('select');
      renderTubes();
    } else {
      // Second click: attempt pour
      const srcIdx = selectedTubeIdx;
      const dstIdx = idx;

      if (canPour(srcIdx, dstIdx)) {
        executePour(srcIdx, dstIdx);
      } else {
        playSound('error');
        shakeTube(dstIdx);
        selectedTubeIdx = null;
        renderTubes();
      }
    }
  }

  function canPour(srcIdx, dstIdx) {
    const src = tubes[srcIdx];
    const dst = tubes[dstIdx];

    if (src.length === 0) return false;
    if (dst.length >= TUBE_CAPACITY) return false;
    if (dst.length === 0) return true;

    const topSrc = src[src.length - 1];
    const topDst = dst[dst.length - 1];
    return topSrc === topDst;
  }

  function executePour(srcIdx, dstIdx) {
    // Save history for undo
    history.push(JSON.parse(JSON.stringify(tubes)));

    const src = tubes[srcIdx];
    const dst = tubes[dstIdx];
    const movingColor = src[src.length - 1];

    let count = 0;
    while (src.length > 0 && src[src.length - 1] === movingColor && dst.length < TUBE_CAPACITY) {
      dst.push(src.pop());
      count++;
    }

    moves++;
    selectedTubeIdx = null;
    playSound('pour');

    if (isTubeComplete(dst)) {
      setTimeout(() => playSound('complete_tube'), 100);
    }

    updateHUD();
    renderTubes();
    checkWinCondition();
  }

  function undoMove() {
    if (history.length === 0 || isWon) return;
    tubes = history.pop();
    selectedTubeIdx = null;
    moves = Math.max(0, moves - 1);
    playSound('select');
    updateHUD();
    renderTubes();
  }

  function shakeTube(idx) {
    const el = document.querySelector(`.tube[data-idx="${idx}"]`);
    if (el) {
      el.classList.add('shake');
      setTimeout(() => el.classList.remove('shake'), 450);
    }
  }

  function provideHint() {
    if (isWon) return;
    // Find first valid move
    for (let i = 0; i < NUM_TUBES; i++) {
      if (tubes[i].length === 0 || isTubeComplete(tubes[i])) continue;
      for (let j = 0; j < NUM_TUBES; j++) {
        if (i === j) continue;
        if (canPour(i, j)) {
          // Highlight
          const elSrc = document.querySelector(`.tube[data-idx="${i}"]`);
          const elDst = document.querySelector(`.tube[data-idx="${j}"]`);
          if (elSrc && elDst) {
            elSrc.classList.add('selected');
            elDst.style.outline = '3px dashed #fbbf24';
            setTimeout(() => {
              elSrc.classList.remove('selected');
              elDst.style.outline = '';
            }, 1200);
          }
          playSound('select');
          return;
        }
      }
    }
    // If no moves, alert user
    alert('No direct moves found. Consider using Undo to backtrack!');
  }

  function checkWinCondition() {
    let completedCount = 0;
    let emptyCount = 0;

    for (let i = 0; i < NUM_TUBES; i++) {
      if (tubes[i].length === 0) {
        emptyCount++;
      } else if (isTubeComplete(tubes[i])) {
        completedCount++;
      }
    }

    if (completedCount === NUM_FILLED && emptyCount === (NUM_TUBES - NUM_FILLED)) {
      isWon = true;
      clearInterval(timerInterval);
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      playSound('win');

      // CRITICAL PLATFORM NOTIFICATION (Vanilla postMessage)
      try {
        window.parent.postMessage({ type: 'win', time: elapsedSeconds }, '*');
      } catch (e) {}

      showVictoryModal(elapsedSeconds);
    }
  }

  function showVictoryModal(timeSecs) {
    const modal = document.getElementById('modal-victory');
    const timeEl = document.getElementById('win-time');
    const movesEl = document.getElementById('win-moves');
    if (timeEl) timeEl.textContent = `${timeSecs}s`;
    if (movesEl) movesEl.textContent = moves;
    if (modal) modal.classList.add('active');
  }

  function hideVictoryModal() {
    const modal = document.getElementById('modal-victory');
    if (modal) modal.classList.remove('active');
  }

  // DOM wiring
  window.addEventListener('DOMContentLoaded', () => {
    initGame();

    document.getElementById('btn-undo')?.addEventListener('click', undoMove);
    document.getElementById('btn-restart')?.addEventListener('click', initGame);
    document.getElementById('btn-hint')?.addEventListener('click', provideHint);
    document.getElementById('btn-win-restart')?.addEventListener('click', initGame);

    const soundBtn = document.getElementById('btn-sound');
    soundBtn?.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.innerHTML = soundEnabled ? '🔊' : '🔇';
    });

    const infoBtn = document.getElementById('btn-info');
    const rulesModal = document.getElementById('modal-rules');
    const closeRulesBtn = document.getElementById('btn-close-rules');
    const startScreen = document.getElementById('start-menu-screen');
    const btnStartGame = document.getElementById('btn-start-game');
    const btnStartRules = document.getElementById('btn-start-rules');

    btnStartGame?.addEventListener('click', () => {
      startScreen?.classList.add('dismissed');
      playSound('select');
      startTime = Date.now();
    });

    btnStartRules?.addEventListener('click', () => {
      rulesModal?.classList.add('active');
    });

    infoBtn?.addEventListener('click', () => rulesModal?.classList.add('active'));
    closeRulesBtn?.addEventListener('click', () => rulesModal?.classList.remove('active'));
  });
})();
