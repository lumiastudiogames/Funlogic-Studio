// Ball Sort Puzzle - Standalone Vanilla JS
(function () {
  'use strict';

  const BALL_COLORS = [
    { id: 'crimson', name: 'Ruby', gradient: 'radial-gradient(circle at 35% 35%, #fca5a5 0%, #ef4444 45%, #7f1d1d 100%)', glow: '#ef4444' },
    { id: 'sapphire', name: 'Sapphire', gradient: 'radial-gradient(circle at 35% 35%, #93c5fd 0%, #3b82f6 45%, #1e3a8a 100%)', glow: '#3b82f6' },
    { id: 'emerald', name: 'Emerald', gradient: 'radial-gradient(circle at 35% 35%, #86efac 0%, #22c55e 45%, #14532d 100%)', glow: '#22c55e' },
    { id: 'gold', name: 'Gold', gradient: 'radial-gradient(circle at 35% 35%, #fef08a 0%, #eab308 45%, #713f12 100%)', glow: '#eab308' },
    { id: 'purple', name: 'Amethyst', gradient: 'radial-gradient(circle at 35% 35%, #e9d5ff 0%, #a855f7 45%, #581c87 100%)', glow: '#a855f7' },
    { id: 'cyan', name: 'Turquoise', gradient: 'radial-gradient(circle at 35% 35%, #a5f3fc 0%, #06b6d4 45%, #164e63 100%)', glow: '#06b6d4' },
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
  let isAnimating = false;
  let justLandedPos = null; // { tubeIdx, ballPos }

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

      if (type === 'lift') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'drop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'lock') {
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.05);
          gain.gain.setValueAtTime(0.15, now + i * 0.05);
          gain.gain.linearRampToValueAtTime(0.01, now + i * 0.05 + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.15);
        });
      } else if (type === 'error') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
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

  function generateSolvablePuzzle() {
    let balls = [];
    for (let c = 0; c < NUM_FILLED; c++) {
      for (let k = 0; k < TUBE_CAPACITY; k++) {
        balls.push(c);
      }
    }

    // Fisher-Yates shuffle
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
    isAnimating = false;
    justLandedPos = null;
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

  function isTubeLocked(tube) {
    if (tube.length !== TUBE_CAPACITY) return false;
    return tube.every(b => b === tube[0]);
  }

  function spawnTubeStars(targetEl) {
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const count = 16;
    const emojis = ['✨', '⭐', '🌟', '🔮', '💎', '🎉'];

    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      star.className = 'tube-star';
      star.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      const startX = rect.left + rect.width / 2;
      const startY = rect.top + rect.height / 2;
      star.style.left = `${startX}px`;
      star.style.top = `${startY}px`;

      const angle = (Math.PI * 2 * i) / count;
      const dist = 35 + Math.random() * 50;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;

      star.style.setProperty('--dx', `${dx}px`);
      star.style.setProperty('--dy', `${dy}px`);
      star.style.fontSize = `${16 + Math.random() * 12}px`;

      document.body.appendChild(star);
      setTimeout(() => star.remove(), 950);
    }
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

      const locked = isTubeLocked(tube);
      if (locked) {
        tubeEl.classList.add('locked');
      }

      // Tube top rim/lip
      const rimEl = document.createElement('div');
      rimEl.className = 'tube-rim';
      tubeEl.appendChild(rimEl);

      tube.forEach((colorIdx, ballPos) => {
        const ballEl = document.createElement('div');
        ballEl.className = 'ball';
        ballEl.style.background = BALL_COLORS[colorIdx].gradient;
        ballEl.style.color = BALL_COLORS[colorIdx].glow;

        // If this is the selected source tube and this is the top ball, lift it up completely unobscured
        if (selectedTubeIdx === idx && ballPos === tube.length - 1) {
          ballEl.classList.add('lifted');
        }

        // If just landed, trigger squash bounce
        if (justLandedPos && justLandedPos.tubeIdx === idx && justLandedPos.ballPos === ballPos) {
          ballEl.classList.add('landed');
        }

        tubeEl.appendChild(ballEl);
      });

      tubeEl.addEventListener('click', () => handleTubeClick(idx));
      targetRow.appendChild(tubeEl);
    });
  }

  function handleTubeClick(idx) {
    if (isWon || isAnimating) return;
    const tube = tubes[idx];

    // If already locked, ignore
    if (isTubeLocked(tube)) {
      shakeTube(idx);
      return;
    }

    if (selectedTubeIdx === null) {
      // First click: select source ball
      if (tube.length === 0) {
        playSound('error');
        shakeTube(idx);
        return;
      }
      selectedTubeIdx = idx;
      playSound('lift');
      renderTubes();
    } else if (selectedTubeIdx === idx) {
      // Click same tube to cancel/lower ball
      selectedTubeIdx = null;
      playSound('drop');
      renderTubes();
    } else {
      // Second click: attempt to drop ball in target tube
      const srcIdx = selectedTubeIdx;
      const dstIdx = idx;

      if (canDropBall(srcIdx, dstIdx)) {
        animateAndDropBall(srcIdx, dstIdx);
      } else {
        playSound('error');
        shakeTube(dstIdx);
        selectedTubeIdx = null;
        renderTubes();
      }
    }
  }

  function canDropBall(srcIdx, dstIdx) {
    const src = tubes[srcIdx];
    const dst = tubes[dstIdx];

    if (src.length === 0) return false;
    if (dst.length >= TUBE_CAPACITY) return false;
    if (dst.length === 0) return true;

    const topSrc = src[src.length - 1];
    const topDst = dst[dst.length - 1];
    return topSrc === topDst;
  }

  // Smooth Parabolic Arc Flying Ball Animation
  function animateAndDropBall(srcIdx, dstIdx) {
    isAnimating = true;

    // Save history for undo
    history.push(JSON.parse(JSON.stringify(tubes)));

    const ballColorIdx = tubes[srcIdx].pop();
    const colorDef = BALL_COLORS[ballColorIdx];

    const srcEl = document.querySelector(`.tube[data-idx="${srcIdx}"]`);
    const dstEl = document.querySelector(`.tube[data-idx="${dstIdx}"]`);

    selectedTubeIdx = null;
    renderTubes();

    if (!srcEl || !dstEl) {
      tubes[dstIdx].push(ballColorIdx);
      isAnimating = false;
      renderTubes();
      return;
    }

    const srcRect = srcEl.getBoundingClientRect();
    const dstRect = dstEl.getBoundingClientRect();

    const ballSize = srcRect.width * 0.76;
    const startX = srcRect.left + (srcRect.width - ballSize) / 2;
    const startY = srcRect.top - ballSize * 1.1;

    const endX = dstRect.left + (dstRect.width - ballSize) / 2;
    const endY = dstRect.top + (dstRect.height - (tubes[dstIdx].length + 1) * (ballSize + 2)) - 6;

    const flyingBall = document.createElement('div');
    flyingBall.className = 'flying-ball';
    flyingBall.style.width = `${ballSize}px`;
    flyingBall.style.height = `${ballSize}px`;
    flyingBall.style.background = colorDef.gradient;
    flyingBall.style.color = colorDef.glow;
    flyingBall.style.left = `${startX}px`;
    flyingBall.style.top = `${startY}px`;

    document.body.appendChild(flyingBall);

    const duration = 280; // ms
    const animStartTime = performance.now();
    const peakOffset = 50 + Math.abs(endX - startX) * 0.15;

    function frame(now) {
      const elapsed = now - animStartTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease in-out
      const t = progress;

      // Parabolic trajectory
      const curX = startX + (endX - startX) * t;
      const baseCurY = startY + (endY - startY) * t;
      const arc = 4 * peakOffset * t * (1 - t);
      const curY = baseCurY - arc;

      flyingBall.style.left = `${curX}px`;
      flyingBall.style.top = `${curY}px`;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        flyingBall.remove();
        tubes[dstIdx].push(ballColorIdx);
        moves++;
        isAnimating = false;
        justLandedPos = { tubeIdx: dstIdx, ballPos: tubes[dstIdx].length - 1 };

        playSound('drop');
        updateHUD();
        renderTubes();

        setTimeout(() => {
          justLandedPos = null;
        }, 400);

        if (isTubeLocked(tubes[dstIdx])) {
          setTimeout(() => {
            playSound('lock');
            const lockedTubeEl = document.querySelector(`.tube[data-idx="${dstIdx}"]`);
            spawnTubeStars(lockedTubeEl);
          }, 80);
        }

        checkWinCondition();
      }
    }

    requestAnimationFrame(frame);
  }

  function undoMove() {
    if (history.length === 0 || isWon || isAnimating) return;
    tubes = history.pop();
    selectedTubeIdx = null;
    moves = Math.max(0, moves - 1);
    playSound('drop');
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
    if (isWon || isAnimating) return;
    for (let i = 0; i < NUM_TUBES; i++) {
      if (tubes[i].length === 0 || isTubeLocked(tubes[i])) continue;
      for (let j = 0; j < NUM_TUBES; j++) {
        if (i === j || isTubeLocked(tubes[j])) continue;
        if (canDropBall(i, j)) {
          const elSrc = document.querySelector(`.tube[data-idx="${i}"]`);
          const elDst = document.querySelector(`.tube[data-idx="${j}"]`);
          if (elSrc && elDst) {
            elSrc.style.borderColor = '#c084fc';
            elDst.style.outline = '3px dashed #c084fc';
            setTimeout(() => {
              elSrc.style.borderColor = '';
              elDst.style.outline = '';
            }, 1200);
          }
          playSound('lift');
          return;
        }
      }
    }
    alert('No direct matching moves! Try undoing prior moves.');
  }

  function checkWinCondition() {
    let lockedCount = 0;
    let emptyCount = 0;

    for (let i = 0; i < NUM_TUBES; i++) {
      if (tubes[i].length === 0) {
        emptyCount++;
      } else if (isTubeLocked(tubes[i])) {
        lockedCount++;
      }
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

    infoBtn?.addEventListener('click', () => rulesModal?.classList.add('active'));
    closeRulesBtn?.addEventListener('click', () => rulesModal?.classList.remove('active'));
  });
})();
