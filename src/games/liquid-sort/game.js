// Liquid Sort (Translucent) - Standalone Vanilla JS
(function () {
  'use strict';

  const COLORS = [
    { id: 'c0', name: 'Ruby', gradient: 'linear-gradient(180deg, rgba(239, 68, 68, 0.85) 0%, rgba(185, 28, 28, 0.8) 100%)' },
    { id: 'c1', name: 'Ocean', gradient: 'linear-gradient(180deg, rgba(59, 130, 246, 0.85) 0%, rgba(29, 78, 216, 0.8) 100%)' },
    { id: 'c2', name: 'Emerald', gradient: 'linear-gradient(180deg, rgba(16, 185, 129, 0.85) 0%, rgba(4, 120, 87, 0.8) 100%)' },
    { id: 'c3', name: 'Amber', gradient: 'linear-gradient(180deg, rgba(245, 158, 11, 0.85) 0%, rgba(180, 83, 9, 0.8) 100%)' },
    { id: 'c4', name: 'Amethyst', gradient: 'linear-gradient(180deg, rgba(168, 85, 247, 0.85) 0%, rgba(107, 33, 168, 0.8) 100%)' },
    { id: 'c5', name: 'Cyan', gradient: 'linear-gradient(180deg, rgba(6, 182, 212, 0.85) 0%, rgba(14, 116, 144, 0.8) 100%)' },
  ];

  const TUBE_CAPACITY = 4;
  const NUM_FILLED = 6;
  const NUM_TUBES = 8;

  let tubes = [];
  let selectedTubeIdx = null;
  let history = [];
  let moves = 0;
  let startTime = Date.now();
  let timerInterval = null;
  let soundEnabled = true;
  let isWon = false;
  let isReacting = false;

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

      if (type === 'select') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(840, now + 0.08);
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
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'chemical_sizzle') {
        // Noise buffer for chemical reaction sizzle
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 600;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
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
    isWon = false;
    isReacting = false;
    startTime = Date.now();

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    updateHUD();
    renderTubes();
    hideVictoryModal();
  }

  function updateHUD() {
    document.getElementById('move-counter').textContent = moves;
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
    if (isWon || isReacting) return;
    const tube = tubes[idx];

    if (selectedTubeIdx === null) {
      if (tube.length === 0 || isTubeComplete(tube)) return;
      selectedTubeIdx = idx;
      playSound('select');
      renderTubes();
    } else if (selectedTubeIdx === idx) {
      selectedTubeIdx = null;
      playSound('select');
      renderTubes();
    } else {
      const srcIdx = selectedTubeIdx;
      const dstIdx = idx;

      if (canPour(srcIdx, dstIdx)) {
        executePour(srcIdx, dstIdx);
      } else {
        // EXPLICIT REQUIREMENT: "Se errar, o líquido fica marrom 2 segundos com shake."
        triggerBrownReaction(srcIdx, dstIdx);
      }
    }
  }

  function triggerBrownReaction(srcIdx, dstIdx) {
    isReacting = true;
    playSound('chemical_sizzle');

    const srcEl = document.querySelector(`.tube[data-idx="${srcIdx}"]`);
    const dstEl = document.querySelector(`.tube[data-idx="${dstIdx}"]`);

    if (srcEl) srcEl.classList.add('reaction-brown');
    if (dstEl) dstEl.classList.add('reaction-brown');

    setTimeout(() => {
      if (srcEl) srcEl.classList.remove('reaction-brown');
      if (dstEl) dstEl.classList.remove('reaction-brown');
      selectedTubeIdx = null;
      isReacting = false;
      renderTubes();
    }, 2000); // exactly 2 seconds as requested!
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
    if (history.length === 0 || isWon || isReacting) return;
    tubes = history.pop();
    selectedTubeIdx = null;
    moves = Math.max(0, moves - 1);
    playSound('select');
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
