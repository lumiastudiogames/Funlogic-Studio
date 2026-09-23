// Water Sort 100 Levels - Standalone Vanilla JS
(function () {
  'use strict';

  const ALL_COLORS = [
    { id: 'c0', gradient: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)' }, // Red
    { id: 'c1', gradient: 'linear-gradient(180deg, #60a5fa 0%, #2563eb 100%)' }, // Blue
    { id: 'c2', gradient: 'linear-gradient(180deg, #34d399 0%, #059669 100%)' }, // Green
    { id: 'c3', gradient: 'linear-gradient(180deg, #fbbf24 0%, #d97706 100%)' }, // Yellow
    { id: 'c4', gradient: 'linear-gradient(180deg, #c084fc 0%, #7e22ce 100%)' }, // Purple
    { id: 'c5', gradient: 'linear-gradient(180deg, #fb923c 0%, #ea580c 100%)' }, // Orange
    { id: 'c6', gradient: 'linear-gradient(180deg, #22d3ee 0%, #0891b2 100%)' }, // Cyan
    { id: 'c7', gradient: 'linear-gradient(180deg, #f472b6 0%, #db2777 100%)' }, // Pink
    { id: 'c8', gradient: 'linear-gradient(180deg, #a3e635 0%, #65a30d 100%)' }, // Lime
    { id: 'c9', gradient: 'linear-gradient(180deg, #2dd4bf 0%, #0d9488 100%)' }, // Teal
    { id: 'c10', gradient: 'linear-gradient(180deg, #e879f9 0%, #c026d3 100%)' }, // Fuchsia
    { id: 'c11', gradient: 'linear-gradient(180deg, #94a3b8 0%, #475569 100%)' }, // Slate
  ];

  const TUBE_CAPACITY = 4;
  let currentLevel = 1;
  let unlockedLevel = 1;

  let tubes = [];
  let selectedTubeIdx = null;
  let history = [];
  let undosRemaining = 3;
  let moves = 0;
  let startTime = Date.now();
  let timerInterval = null;
  let soundEnabled = true;
  let isWon = false;

  // Web Audio Context
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
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
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
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
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

  // Seeded PRNG for reproducible level generation
  function pseudoRandom(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function getLevelConfig(level) {
    const numColors = Math.min(12, 3 + Math.floor((level - 1) / 10));
    const numTubes = numColors + 2;
    return { numColors, numTubes };
  }

  function generateLevel(level) {
    const { numColors, numTubes } = getLevelConfig(level);
    const rng = pseudoRandom(level * 7919 + 1337);

    let items = [];
    for (let c = 0; c < numColors; c++) {
      for (let k = 0; k < TUBE_CAPACITY; k++) {
        items.push(c);
      }
    }

    // Shuffle using seeded RNG
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    let state = [];
    for (let i = 0; i < numColors; i++) {
      state.push(items.slice(i * 4, (i + 1) * 4));
    }
    for (let i = numColors; i < numTubes; i++) {
      state.push([]);
    }

    return state;
  }

  function loadSavedState() {
    try {
      const savedUnlocked = parseInt(localStorage.getItem('ws100_unlocked'), 10);
      if (savedUnlocked && !isNaN(savedUnlocked)) unlockedLevel = Math.max(1, Math.min(100, savedUnlocked));
      const savedCur = parseInt(localStorage.getItem('ws100_cur_level'), 10);
      if (savedCur && !isNaN(savedCur)) currentLevel = Math.max(1, Math.min(unlockedLevel, savedCur));
    } catch (e) {}
  }

  function saveProgress() {
    try {
      localStorage.setItem('ws100_unlocked', unlockedLevel.toString());
      localStorage.setItem('ws100_cur_level', currentLevel.toString());
    } catch (e) {}
  }

  function startLevel(lvl) {
    currentLevel = Math.max(1, Math.min(100, lvl));
    tubes = generateLevel(currentLevel);
    selectedTubeIdx = null;
    history = [];
    undosRemaining = 3;
    moves = 0;
    isWon = false;
    startTime = Date.now();

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    saveProgress();
    updateHUD();
    renderTubes();
    hideVictoryModal();
  }

  function updateHUD() {
    const lvlEl = document.getElementById('level-badge-text');
    if (lvlEl) lvlEl.textContent = `LEVEL ${currentLevel} / 100`;
    const moveEl = document.getElementById('move-counter');
    if (moveEl) moveEl.textContent = moves;
    const undoEl = document.getElementById('undo-counter');
    if (undoEl) undoEl.textContent = undosRemaining;
    const undoBtn = document.getElementById('btn-undo');
    if (undoBtn) {
      undoBtn.style.opacity = undosRemaining > 0 && history.length > 0 ? '1' : '0.5';
    }
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
        layerEl.style.background = ALL_COLORS[colorIdx].gradient;

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
    if (isWon) return;
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
    if (undosRemaining <= 0 || history.length === 0 || isWon) return;
    tubes = history.pop();
    undosRemaining--;
    selectedTubeIdx = null;
    moves = Math.max(0, moves - 1);
    playSound('select');
    updateHUD();
    renderTubes();
  }

  function checkWinCondition() {
    const { numColors, numTubes } = getLevelConfig(currentLevel);
    let completed = 0;
    let empty = 0;

    for (let i = 0; i < numTubes; i++) {
      if (tubes[i].length === 0) empty++;
      else if (isTubeComplete(tubes[i])) completed++;
    }

    if (completed === numColors && empty === 2) {
      isWon = true;
      clearInterval(timerInterval);
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);

      // Unlock next level
      unlockedLevel = Math.max(unlockedLevel, Math.min(100, currentLevel + 1));
      saveProgress();

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
    const lvlEl = document.getElementById('win-lvl-text');
    if (lvlEl) lvlEl.textContent = `Level ${currentLevel} Complete!`;
    if (timeEl) timeEl.textContent = `${timeSecs}s`;
    if (movesEl) movesEl.textContent = moves;
    if (modal) modal.classList.add('active');
  }

  function hideVictoryModal() {
    const modal = document.getElementById('modal-victory');
    if (modal) modal.classList.remove('active');
  }

  function openLevelSelectModal() {
    const grid = document.getElementById('level-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let i = 1; i <= 100; i++) {
      const btn = document.createElement('button');
      btn.className = 'level-btn';
      btn.textContent = i;

      if (i === currentLevel) {
        btn.classList.add('current');
      }

      if (i > unlockedLevel) {
        btn.classList.add('locked');
        btn.innerHTML = '🔒';
      } else {
        btn.addEventListener('click', () => {
          document.getElementById('modal-level-select')?.classList.remove('active');
          startLevel(i);
        });
      }

      grid.appendChild(btn);
    }

    document.getElementById('modal-level-select')?.classList.add('active');
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadSavedState();
    startLevel(currentLevel);

    document.getElementById('btn-undo')?.addEventListener('click', undoMove);
    document.getElementById('btn-restart')?.addEventListener('click', () => startLevel(currentLevel));
    document.getElementById('btn-next-level')?.addEventListener('click', () => {
      hideVictoryModal();
      startLevel(Math.min(100, currentLevel + 1));
    });

    document.getElementById('level-badge-btn')?.addEventListener('click', openLevelSelectModal);
    document.getElementById('btn-close-level-select')?.addEventListener('click', () => {
      document.getElementById('modal-level-select')?.classList.remove('active');
    });

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
