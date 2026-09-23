// Tube Sort 3D - Standalone Vanilla JS
(function () {
  'use strict';

  const COLORS = [
    { id: 'red', name: 'Ruby', gradient: 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)', hex: '#ef4444' },
    { id: 'blue', name: 'Sapphire', gradient: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)', hex: '#3b82f6' },
    { id: 'green', name: 'Emerald', gradient: 'linear-gradient(90deg, #10b981 0%, #047857 100%)', hex: '#10b981' },
    { id: 'yellow', name: 'Topaz', gradient: 'linear-gradient(90deg, #f59e0b 0%, #b45309 100%)', hex: '#f59e0b' },
    { id: 'purple', name: 'Amethyst', gradient: 'linear-gradient(90deg, #a855f7 0%, #6b21a8 100%)', hex: '#a855f7' },
    { id: 'cyan', name: 'Cyan', gradient: 'linear-gradient(90deg, #06b6d4 0%, #0e7490 100%)', hex: '#06b6d4' },
  ];

  const TUBE_CAPACITY = 4;
  const NUM_FILLED = 6;
  const NUM_TUBES = 8;
  const RADIUS_3D = 210;

  let tubes = [];
  let selectedTubeIdx = null;
  let history = [];
  let moves = 0;
  let startTime = Date.now();
  let timerInterval = null;
  let soundEnabled = true;
  let isWon = false;

  // 3D rotation state
  let currentRotation = 0;
  let isDragging = false;
  let lastMouseX = 0;
  let momentum = 0;

  // Audio Context
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

      if (type === 'spin') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.005, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'select') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'pour') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
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
    let balls = [];
    for (let c = 0; c < NUM_FILLED; c++) {
      for (let k = 0; k < TUBE_CAPACITY; k++) {
        balls.push(c);
      }
    }
    for (let i = balls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [balls[i], balls[j]] = [balls[j], balls[i]];
    }

    let state = [];
    for (let i = 0; i < NUM_FILLED; i++) {
      state.push(balls.slice(i * 4, (i + 1) * 4));
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
    currentRotation = 0;
    startTime = Date.now();

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    updateHUD();
    render3DTubes();
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

  function isTubeLocked(tube) {
    if (tube.length !== TUBE_CAPACITY) return false;
    return tube.every(c => c === tube[0]);
  }

  function render3DTubes() {
    const carousel = document.getElementById('carousel-3d');
    if (!carousel) return;
    carousel.innerHTML = '';

    const degStep = 360 / NUM_TUBES;
    const rad = Math.PI / 180;

    tubes.forEach((tube, idx) => {
      const tubeAngleDeg = idx * degStep + currentRotation;
      const angleRad = tubeAngleDeg * rad;

      // 3D coordinates
      const x = Math.sin(angleRad) * RADIUS_3D;
      const z = Math.cos(angleRad) * RADIUS_3D;
      const scale = 0.78 + ((z + RADIUS_3D) / (2 * RADIUS_3D)) * 0.38; // 0.78 to 1.16
      const opacity = 0.65 + ((z + RADIUS_3D) / (2 * RADIUS_3D)) * 0.35;
      const zIndex = Math.floor(z + RADIUS_3D + 10);

      const itemEl = document.createElement('div');
      itemEl.className = 'tube-3d-item';
      itemEl.dataset.idx = idx;

      // Position in 3D
      itemEl.style.transform = `translate3d(${x.toFixed(1)}px, 0px, ${z.toFixed(1)}px) scale(${scale.toFixed(2)})`;
      itemEl.style.opacity = opacity.toFixed(2);
      itemEl.style.zIndex = zIndex;

      if (selectedTubeIdx === idx) {
        itemEl.classList.add('selected');
      }
      if (isTubeLocked(tube)) {
        itemEl.classList.add('locked');
      }

      // Shadow
      const shadowEl = document.createElement('div');
      shadowEl.className = 'tube-shadow';
      itemEl.appendChild(shadowEl);

      // Glass Cylinder
      const cylEl = document.createElement('div');
      cylEl.className = 'tube-cylinder';

      const rimEl = document.createElement('div');
      rimEl.className = 'tube-rim';
      itemEl.appendChild(rimEl);

      tube.forEach(colorIdx => {
        const layerEl = document.createElement('div');
        layerEl.className = 'liquid-layer';
        layerEl.style.background = COLORS[colorIdx].gradient;
        cylEl.appendChild(layerEl);
      });

      itemEl.appendChild(cylEl);

      itemEl.addEventListener('click', (e) => {
        e.stopPropagation();
        handleTubeClick(idx);
      });

      carousel.appendChild(itemEl);
    });
  }

  function handleTubeClick(idx) {
    if (isWon) return;
    const tube = tubes[idx];

    if (isTubeLocked(tube)) {
      return;
    }

    if (selectedTubeIdx === null) {
      if (tube.length === 0) return;
      selectedTubeIdx = idx;
      playSound('select');
      render3DTubes();
    } else if (selectedTubeIdx === idx) {
      selectedTubeIdx = null;
      playSound('select');
      render3DTubes();
    } else {
      const srcIdx = selectedTubeIdx;
      const dstIdx = idx;
      if (canPour(srcIdx, dstIdx)) {
        executePour(srcIdx, dstIdx);
      } else {
        selectedTubeIdx = null;
        render3DTubes();
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
    const col = src[src.length - 1];

    while (src.length > 0 && src[src.length - 1] === col && dst.length < TUBE_CAPACITY) {
      dst.push(src.pop());
    }

    moves++;
    selectedTubeIdx = null;
    playSound('pour');

    updateHUD();
    render3DTubes();
    checkWinCondition();
  }

  function undoMove() {
    if (history.length === 0 || isWon) return;
    tubes = history.pop();
    selectedTubeIdx = null;
    moves = Math.max(0, moves - 1);
    playSound('select');
    updateHUD();
    render3DTubes();
  }

  function rotateCarousel(delta) {
    currentRotation += delta;
    if (Math.abs(delta) > 0.5) playSound('spin');
    render3DTubes();
  }

  function checkWinCondition() {
    let lockedCount = 0;
    let emptyCount = 0;

    for (let i = 0; i < NUM_TUBES; i++) {
      if (tubes[i].length === 0) emptyCount++;
      else if (isTubeLocked(tubes[i])) lockedCount++;
    }

    if (lockedCount === NUM_FILLED && emptyCount === (NUM_TUBES - NUM_FILLED)) {
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

  // Pointer drag to spin 3D turntable
  function setupTurntableControls() {
    const stage = document.getElementById('scene-wrapper');
    if (!stage) return;

    let startX = 0;
    let isMoving = false;

    const onPointerDown = (e) => {
      isDragging = true;
      isMoving = false;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      lastMouseX = startX;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - lastMouseX;
      lastMouseX = clientX;

      if (Math.abs(clientX - startX) > 5) {
        isMoving = true;
      }

      currentRotation += deltaX * 0.45;
      render3DTubes();
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    stage.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    stage.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    document.getElementById('btn-rot-left')?.addEventListener('click', () => rotateCarousel(45));
    document.getElementById('btn-rot-right')?.addEventListener('click', () => rotateCarousel(-45));
  }

  window.addEventListener('DOMContentLoaded', () => {
    initGame();
    setupTurntableControls();

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
