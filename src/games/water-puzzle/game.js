// Water Puzzle (Timer Rush 90s) - Standalone Vanilla JS
(function () {
  'use strict';

  const COLORS = [
    { id: 'c0', name: 'Ruby', gradient: 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)' },
    { id: 'c1', name: 'Sapphire', gradient: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)' },
    { id: 'c2', name: 'Emerald', gradient: 'linear-gradient(180deg, #10b981 0%, #047857 100%)' },
    { id: 'c3', name: 'Amber', gradient: 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)' },
  ];

  const TOTAL_TIME = 90;
  const TUBE_CAPACITY = 4;
  const NUM_FILLED = 4;
  const NUM_TUBES = 6;

  let tubes = [];
  let selectedTubeIdx = null;
  let history = [];
  let moves = 0;
  let timeLeft = TOTAL_TIME;
  let timerInterval = null;
  let soundEnabled = true;
  let isWon = false;
  let isGameOver = false;

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

      if (type === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      } else if (type === 'panic_tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1100, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.005, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
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
      } else if (type === 'lose') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
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
    timeLeft = TOTAL_TIME;
    isWon = false;
    isGameOver = false;

    clearInterval(timerInterval);
    timerInterval = setInterval(handleTick, 1000);

    updateHUD();
    renderTubes();
    hideModals();
  }

  function handleTick() {
    if (isWon || isGameOver) return;
    timeLeft--;
    updateHUD();

    if (timeLeft <= 20 && timeLeft > 0) {
      playSound('panic_tick');
    }

    if (timeLeft <= 0) {
      isGameOver = true;
      clearInterval(timerInterval);
      playSound('lose');
      showDefeatModal();
    }
  }

  function updateHUD() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const timerCard = document.getElementById('timer-card');
    const timerText = document.getElementById('timer-counter');

    if (timerText) {
      timerText.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    if (timerCard) {
      if (timeLeft <= 20) {
        timerCard.classList.add('panic');
      } else {
        timerCard.classList.remove('panic');
      }
    }

    const moveEl = document.getElementById('move-counter');
    if (moveEl) moveEl.textContent = moves;
    const undoEl = document.getElementById('undo-counter');
    if (undoEl) undoEl.textContent = history.length;
  }

  function isTubeComplete(tube) {
    if (tube.length !== TUBE_CAPACITY) return false;
    return tube.every(c => c === tube[0]);
  }

  function renderTubes() {
    const container = document.getElementById('tubes-container');
    if (!container) return;
    container.innerHTML = '';

    tubes.forEach((tube, idx) => {
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
      container.appendChild(tubeEl);
    });
  }

  function handleTubeClick(idx) {
    if (isWon || isGameOver) return;
    const tube = tubes[idx];

    if (selectedTubeIdx === null) {
      if (tube.length === 0 || isTubeComplete(tube)) return;
      selectedTubeIdx = idx;
      renderTubes();
    } else if (selectedTubeIdx === idx) {
      selectedTubeIdx = null;
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
    if (history.length === 0 || isWon || isGameOver) return;
    tubes = history.pop();
    selectedTubeIdx = null;
    moves = Math.max(0, moves - 1);
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

    if (completed === NUM_FILLED && empty === 2) {
      isWon = true;
      clearInterval(timerInterval);
      const elapsedSeconds = TOTAL_TIME - timeLeft;
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

  function showDefeatModal() {
    const modal = document.getElementById('modal-defeat');
    if (modal) modal.classList.add('active');
  }

  function hideModals() {
    document.getElementById('modal-victory')?.classList.remove('active');
    document.getElementById('modal-defeat')?.classList.remove('active');
  }

  window.addEventListener('DOMContentLoaded', () => {
    initGame();

    document.getElementById('btn-undo')?.addEventListener('click', undoMove);
    document.getElementById('btn-restart')?.addEventListener('click', initGame);
    document.getElementById('btn-win-restart')?.addEventListener('click', initGame);
    document.getElementById('btn-lose-retry')?.addEventListener('click', initGame);

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
