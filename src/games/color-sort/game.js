// Color Sort (Solid Blocks) - Standalone Vanilla JS
(function () {
  'use strict';

  const COLORS = [
    { id: 'c0', name: 'Crimson', hex: '#ef4444' },
    { id: 'c1', name: 'Ocean', hex: '#3b82f6' },
    { id: 'c2', name: 'Emerald', hex: '#10b981' },
    { id: 'c3', name: 'Amber', hex: '#f59e0b' },
    { id: 'c4', name: 'Amethyst', hex: '#a855f7' },
    { id: 'c5', name: 'Cyan', hex: '#06b6d4' },
  ];

  const TUBE_CAPACITY = 4;
  const NUM_FILLED = 6;
  const NUM_TUBES = 8;

  let tubes = [];
  let selectedTubeIdx = null;
  let history = [];
  let moves = 0;
  let comboStreak = 0;
  let lastMoveTime = 0;
  let startTime = Date.now();
  let timerInterval = null;
  let soundEnabled = true;
  let isWon = false;

  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      if (AudioClass) audioCtx = new AudioClass();
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

      if (type === 'snap') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'lift') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
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
    } catch (e) {}
  }

  function generateSolvablePuzzle() {
    let items = [];
    for (let c = 0; c < NUM_FILLED; c++) {
      for (let k = 0; k < TUBE_CAPACITY; k++) {
        items.push(c);
      }
    }
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    let state = [];
    for (let i = 0; i < NUM_FILLED; i++) {
      state.push(items.slice(i * 4, (i + 1) * 4));
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
    comboStreak = 0;
    lastMoveTime = 0;
    isWon = false;
    startTime = Date.now();

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    updateHUD();
    renderTubes();
    hideVictoryModal();
  }

  function updateHUD() {
    document.getElementById('move-counter').textContent = moves;
    document.getElementById('streak-counter').textContent = comboStreak > 1 ? `${comboStreak}x` : '-';
    document.getElementById('undo-counter').textContent = history.length;
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

  function isTubeComplete(tube) {
    if (tube.length !== TUBE_CAPACITY) return false;
    return tube.every(c => c === tube[0]);
  }

  function renderTubes() {
    const row1 = document.getElementById('row-1');
    const row2 = document.getElementById('row-2');
    if (!row1 || !row2) return;

    row1.innerHTML = '';
    row2.innerHTML = '';

    tubes.forEach((tube, idx) => {
      const targetRow = idx < 4 ? row1 : row2;
      const tubeEl = document.createElement('div');
      tubeEl.className = 'tube';
      tubeEl.dataset.idx = idx;

      if (selectedTubeIdx === idx) {
        tubeEl.classList.add('selected');
      }
      if (isTubeComplete(tube)) {
        tubeEl.classList.add('locked');
      }

      tube.forEach((colorIdx, pos) => {
        const blockEl = document.createElement('div');
        blockEl.className = 'color-block';
        blockEl.style.backgroundColor = COLORS[colorIdx].hex;

        if (selectedTubeIdx === idx && pos === tube.length - 1) {
          blockEl.classList.add('elevated');
        }

        tubeEl.appendChild(blockEl);
      });

      tubeEl.addEventListener('click', () => handleTubeClick(idx));
      targetRow.appendChild(tubeEl);
    });
  }

  function handleTubeClick(idx) {
    if (isWon) return;
    const tube = tubes[idx];

    if (selectedTubeIdx === null) {
      if (tube.length === 0 || isTubeComplete(tube)) return;
      selectedTubeIdx = idx;
      playSound('lift');
      renderTubes();
    } else if (selectedTubeIdx === idx) {
      selectedTubeIdx = null;
      playSound('snap');
      renderTubes();
    } else {
      const srcIdx = selectedTubeIdx;
      const dstIdx = idx;

      if (canPlace(srcIdx, dstIdx)) {
        executePlace(srcIdx, dstIdx);
      } else {
        selectedTubeIdx = null;
        renderTubes();
      }
    }
  }

  function canPlace(srcIdx, dstIdx) {
    const src = tubes[srcIdx];
    const dst = tubes[dstIdx];
    if (src.length === 0) return false;
    if (dst.length >= TUBE_CAPACITY) return false;
    if (dst.length === 0) return true;
    return src[src.length - 1] === dst[dst.length - 1];
  }

  function executePlace(srcIdx, dstIdx) {
    history.push(JSON.parse(JSON.stringify(tubes)));

    const block = tubes[srcIdx].pop();
    tubes[dstIdx].push(block);

    // Speed combo logic
    const now = Date.now();
    if (now - lastMoveTime < 2400) {
      comboStreak++;
    } else {
      comboStreak = 1;
    }
    lastMoveTime = now;

    moves++;
    selectedTubeIdx = null;
    playSound('snap');

    updateHUD();
    renderTubes();
    checkWinCondition();
  }

  function undoMove() {
    if (history.length === 0 || isWon) return;
    tubes = history.pop();
    selectedTubeIdx = null;
    moves = Math.max(0, moves - 1);
    comboStreak = 0;
    playSound('snap');
    updateHUD();
    renderTubes();
  }

  function checkWinCondition() {
    let completed = 0;
    let empty = 0;

    for (let i = 0; i < NUM_TUBES; i++) {
      if (tubes[i].length === 0) empty++;
      else if (isTubeComplete(tubes[i])) completed++;
    }

    if (completed === NUM_FILLED && empty === (NUM_TUBES - NUM_FILLED)) {
      isWon = true;
      clearInterval(timerInterval);
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      playSound('win');

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

  window.addEventListener('DOMContentLoaded', () => {
    initGame();

    document.getElementById('btn-undo')?.addEventListener('click', undoMove);
    document.getElementById('btn-restart')?.addEventListener('click', initGame);
    document.getElementById('btn-win-restart')?.addEventListener('click', initGame);

    const soundBtn = document.getElementById('btn-sound');
    soundBtn?.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.innerHTML = soundEnabled ? '🔊' : '🔇';
    });

    const infoBtn = document.getElementById('btn-info');
    const rulesModal = document.getElementById('modal-rules');
    const closeRulesBtn = document.getElementById('btn-close-rules');

    infoBtn?.addEventListener('click', () => rulesModal?.classList.add('active'));
    closeRulesBtn?.addEventListener('click', () => rulesModal?.classList.remove('active'));
  });
})();
