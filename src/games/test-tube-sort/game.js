// Test Tube Sort (Chemistry Lab Edition) - Standalone Vanilla JS
(function () {
  'use strict';

  const COLORS = [
    { id: 'c0', name: 'Cobalt', gradient: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)' },
    { id: 'c1', name: 'Chromium', gradient: 'linear-gradient(180deg, #10b981 0%, #047857 100%)' },
    { id: 'c2', name: 'Potassium', gradient: 'linear-gradient(180deg, #ec4899 0%, #be185d 100%)' },
    { id: 'c3', name: 'Sulfur', gradient: 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)' },
    { id: 'c4', name: 'Iodine', gradient: 'linear-gradient(180deg, #8b5cf6 0%, #5b21b6 100%)' },
    { id: 'c5', name: 'Copper', gradient: 'linear-gradient(180deg, #06b6d4 0%, #0e7490 100%)' },
    { id: 'c6', name: 'Lithium', gradient: 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)' },
    { id: 'c7', name: 'Nickel', gradient: 'linear-gradient(180deg, #84cc16 0%, #4d7c0f 100%)' },
  ];

  const TUBE_CAPACITY = 4;
  const NUM_FILLED = 8;
  const NUM_TUBES = 10;

  let tubes = [];
  let selectedTubeIdx = null;
  let history = [];
  let moves = 0;
  let hintsUsed = 0;
  let hintTimeout = null;
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

      if (type === 'glass_clink') {
        // High frequency glass resonance
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'pour') {
        // Chemical fluid stream
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(560, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.22);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'hint') {
        // Bell chime for hint
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
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
    hintsUsed = 0;
    clearHintHighlights();
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
      const targetRow = idx < 5 ? row1 : row2;
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

  function handleTubeClick(idx) {
    if (isWon) return;
    clearHintHighlights();
    const tube = tubes[idx];

    if (selectedTubeIdx === null) {
      if (tube.length === 0 || isTubeComplete(tube)) return;
      selectedTubeIdx = idx;
      playSound('glass_clink');
      renderTubes();
    } else if (selectedTubeIdx === idx) {
      selectedTubeIdx = null;
      playSound('glass_clink');
      renderTubes();
    } else {
      const srcIdx = selectedTubeIdx;
      const dstIdx = idx;

      if (canPour(srcIdx, dstIdx)) {
        executePour(srcIdx, dstIdx);
      } else {
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
    return src[src.length - 1] === dst[dst.length - 1];
  }

  function executePour(srcIdx, dstIdx) {
    history.push(JSON.parse(JSON.stringify(tubes)));

    const src = tubes[srcIdx];
    const dst = tubes[dstIdx];
    const color = src[src.length - 1];

    while (src.length > 0 && src[src.length - 1] === color && dst.length < TUBE_CAPACITY) {
      dst.push(src.pop());
    }

    moves++;
    selectedTubeIdx = null;
    playSound('pour');

    updateHUD();
    renderTubes();
    checkWinCondition();
  }

  function undoMove() {
    if (history.length === 0 || isWon) return;
    clearHintHighlights();
    tubes = history.pop();
    selectedTubeIdx = null;
    moves = Math.max(0, moves - 1);
    playSound('glass_clink');
    updateHUD();
    renderTubes();
  }

  // EXPLICIT REQUIREMENT: Hint button that flashes next possible move
  function giveHint() {
    if (isWon) return;
    clearHintHighlights();

    // Priority 1: Moves that combine matching colors onto a non-empty tube
    for (let i = 0; i < NUM_TUBES; i++) {
      if (tubes[i].length === 0 || isTubeComplete(tubes[i])) continue;
      const topCol = tubes[i][tubes[i].length - 1];

      for (let j = 0; j < NUM_TUBES; j++) {
        if (i === j) continue;
        if (tubes[j].length > 0 && tubes[j].length < TUBE_CAPACITY && tubes[j][tubes[j].length - 1] === topCol) {
          flashHint(i, j);
          return;
        }
      }
    }

    // Priority 2: Moves into empty tube (avoid moving if tube is already pure single color)
    for (let i = 0; i < NUM_TUBES; i++) {
      if (tubes[i].length === 0 || isTubeComplete(tubes[i])) continue;
      const isPure = tubes[i].every(c => c === tubes[i][0]);
      if (isPure) continue; // don't waste empty tube on pure column

      for (let j = 0; j < NUM_TUBES; j++) {
        if (tubes[j].length === 0) {
          flashHint(i, j);
          return;
        }
      }
    }

    // Any valid move fallback
    for (let i = 0; i < NUM_TUBES; i++) {
      for (let j = 0; j < NUM_TUBES; j++) {
        if (i !== j && canPour(i, j)) {
          flashHint(i, j);
          return;
        }
      }
    }
  }

  function flashHint(srcIdx, dstIdx) {
    playSound('hint');
    hintsUsed++;

    const srcEl = document.querySelector(`.tube[data-idx="${srcIdx}"]`);
    const dstEl = document.querySelector(`.tube[data-idx="${dstIdx}"]`);

    if (srcEl) srcEl.classList.add('hint-pulse-src');
    if (dstEl) dstEl.classList.add('hint-pulse-dst');

    if (hintTimeout) clearTimeout(hintTimeout);
    hintTimeout = setTimeout(() => {
      clearHintHighlights();
    }, 3000);
  }

  function clearHintHighlights() {
    if (hintTimeout) clearTimeout(hintTimeout);
    document.querySelectorAll('.tube').forEach(el => {
      el.classList.remove('hint-pulse-src', 'hint-pulse-dst');
    });
  }

  function checkWinCondition() {
    let completed = 0;
    let empty = 0;

    for (let i = 0; i < NUM_TUBES; i++) {
      if (tubes[i].length === 0) empty++;
      else if (isTubeComplete(tubes[i])) completed++;
    }

    if (completed === NUM_FILLED && empty === 2) {
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

    document.getElementById('btn-hint')?.addEventListener('click', giveHint);
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
