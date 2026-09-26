// Sort Water (Zen Relaxation) - Standalone Vanilla JS
(function () {
  'use strict';

  // Calming pastel shades
  const COLORS = [
    { id: 'c0', name: 'Blush', core: '#f472b6', gradient: 'linear-gradient(180deg, #fbcfe8 0%, #f472b6 100%)' },
    { id: 'c1', name: 'Mint', core: '#34d399', gradient: 'linear-gradient(180deg, #a7f3d0 0%, #34d399 100%)' },
    { id: 'c2', name: 'Sky', core: '#38bdf8', gradient: 'linear-gradient(180deg, #bae6fd 0%, #38bdf8 100%)' },
    { id: 'c3', name: 'Lavender', core: '#c084fc', gradient: 'linear-gradient(180deg, #e9d5ff 0%, #c084fc 100%)' },
    { id: 'c4', name: 'Peach', core: '#fb923c', gradient: 'linear-gradient(180deg, #fed7aa 0%, #fb923c 100%)' },
    { id: 'c5', name: 'Lemon', core: '#facc15', gradient: 'linear-gradient(180deg, #fef08a 0%, #facc15 100%)' },
  ];

  const TUBE_CAPACITY = 4;
  const NUM_FILLED = 6;
  const NUM_TUBES = 8;

  let tubes = [];
  let selectedTubeIdx = null;
  let history = [];
  let startTime = Date.now();
  let soundEnabled = true;
  let isWon = false;
  let isPouring = false;

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

  // Relaxing ambient water droplet synthesizer
  function playSound(type) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'zen_drop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        // Organic water drop glide
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.18);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === 'zen_pour') {
        // Continuous bubbling water stream sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320 + Math.random() * 80, now);
        osc.frequency.exponentialRampToValueAtTime(620 + Math.random() * 120, now + 0.14);
        osc.frequency.exponentialRampToValueAtTime(280 + Math.random() * 60, now + 0.32);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.32);
      } else if (type === 'select') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'zen_chime') {
        // Peaceful pentatonic chime
        [523.25, 587.33, 659.25, 783.99, 880.0].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.15);
          gain.gain.setValueAtTime(0.15, now + i * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.15 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.15);
          osc.stop(now + i * 0.15 + 0.6);
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
    isWon = false;
    startTime = Date.now();

    renderTubes();
    hideVictoryModal();
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
      tubeEl.setAttribute('draggable', tube.length > 0 && !isTubeComplete(tube) ? 'true' : 'false');

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

        // Add subtle floating air bubbles
        if (layerIdx % 2 === 0) {
          const bubble = document.createElement('div');
          bubble.className = 'bubble';
          bubble.style.left = `${15 + (layerIdx * 18) % 65}%`;
          bubble.style.animationDelay = `${(layerIdx * 0.7)}s`;
          layerEl.appendChild(bubble);
        }

        if (layerIdx === tube.length - 1) {
          const surf = document.createElement('div');
          surf.className = 'liquid-surface';
          layerEl.appendChild(surf);
        }

        tubeEl.appendChild(layerEl);
      });

      // Click / Tap support
      tubeEl.addEventListener('click', () => handleTubeClick(idx));

      // Drag and Drop support
      tubeEl.addEventListener('dragstart', (e) => {
        if (tube.length === 0 || isTubeComplete(tube)) {
          e.preventDefault();
          return;
        }
        selectedTubeIdx = idx;
        e.dataTransfer.setData('text/plain', String(idx));
        renderTubes();
      });

      tubeEl.addEventListener('dragover', (e) => {
        e.preventDefault();
      });

      tubeEl.addEventListener('drop', (e) => {
        e.preventDefault();
        const srcIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!isNaN(srcIdx) && srcIdx !== idx) {
          selectedTubeIdx = srcIdx;
          handleTubeClick(idx);
        }
      });

      targetRow.appendChild(tubeEl);
    });
  }

  function handleTubeClick(idx) {
    if (isWon || isPouring) return;
    const tube = tubes[idx];

    if (selectedTubeIdx === null) {
      if (tube.length === 0 || isTubeComplete(tube)) return;
      selectedTubeIdx = idx;
      playSound('select');
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
    if (isPouring) return;
    const src = tubes[srcIdx];
    const dst = tubes[dstIdx];
    const color = src[src.length - 1];

    // Determine how many layers of this color can be poured
    let pourCount = 0;
    for (let i = src.length - 1; i >= 0; i--) {
      if (src[i] === color && dst.length + pourCount < TUBE_CAPACITY) {
        pourCount++;
      } else {
        break;
      }
    }
    if (pourCount === 0) {
      selectedTubeIdx = null;
      renderTubes();
      return;
    }

    isPouring = true;
    history.push(JSON.parse(JSON.stringify(tubes)));
    selectedTubeIdx = null;

    const srcEl = document.querySelector(`.tube[data-idx="${srcIdx}"]`);
    const dstEl = document.querySelector(`.tube[data-idx="${dstIdx}"]`);

    if (!srcEl || !dstEl) {
      for (let i = 0; i < pourCount; i++) {
        dst.push(src.pop());
      }
      isPouring = false;
      renderTubes();
      checkWinCondition();
      return;
    }

    const srcRect = srcEl.getBoundingClientRect();
    const dstRect = dstEl.getBoundingClientRect();
    const isTargetRight = dstRect.left >= srcRect.left;

    // Destination opening position
    const dstMouthX = dstRect.left + dstRect.width / 2;
    const dstMouthY = dstRect.top + 4;

    // Tilt angle and offset
    const tiltAngle = isTargetRight ? 68 : -68;
    const offsetX = dstMouthX - (srcRect.left + srcRect.width / 2) + (isTargetRight ? -36 : 36);
    const offsetY = dstMouthY - srcRect.top - 40;

    srcEl.style.zIndex = '9999';
    srcEl.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.9, 0.35, 1)';
    srcEl.style.transformOrigin = isTargetRight ? '80% 15%' : '20% 15%';
    srcEl.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${tiltAngle}deg)`;

    // Calculate spout (pouring lip) coordinates
    const spoutX = isTargetRight ? (dstMouthX - 10) : (dstMouthX + 10);
    const spoutY = dstMouthY - 6;

    // Tube height and layer height in dstEl
    const layerHeightPx = dstRect.height / TUBE_CAPACITY;

    // Create SVG fluid stream container
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'pour-stream-svg');
    svg.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;overflow:visible;';

    const coreColor = COLORS[color].core || '#38bdf8';

    // Ripple / landing splash indicator
    const ripple = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    ripple.setAttribute('rx', '14');
    ripple.setAttribute('ry', '4');
    ripple.setAttribute('fill', coreColor);
    ripple.setAttribute('opacity', '0.7');

    const streamPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    streamPath.setAttribute('fill', 'none');
    streamPath.setAttribute('stroke', coreColor);
    streamPath.setAttribute('stroke-width', '7');
    streamPath.setAttribute('stroke-linecap', 'round');
    streamPath.style.filter = 'drop-shadow(0 0 6px ' + coreColor + ')';

    svg.appendChild(ripple);
    svg.appendChild(streamPath);
    document.body.appendChild(svg);

    function updateStream(landingY) {
      // Fluid curved stream from spout into dst tube opening down to current liquid level
      const midY = (spoutY + landingY) * 0.45;
      const d = `M ${spoutX} ${spoutY} Q ${dstMouthX} ${midY}, ${dstMouthX} ${landingY}`;
      streamPath.setAttribute('d', d);
      ripple.setAttribute('cx', String(dstMouthX));
      ripple.setAttribute('cy', String(landingY));
    }

    // Initial landing position before pouring (current surface of dstEl)
    let currentDstCount = dst.length;
    let landingY = dstRect.bottom - (currentDstCount * layerHeightPx);
    updateStream(landingY);

    // After tube finishes initial tilt (320ms), pour unit by unit "aos poucos"
    setTimeout(() => {
      let pouredSoFar = 0;
      const stepDuration = 380; // ms per layer

      function pourNextUnit() {
        if (pouredSoFar >= pourCount) {
          // Finished pouring all units
          svg.style.transition = 'opacity 0.18s ease-out';
          svg.style.opacity = '0';

          srcEl.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.9, 0.35, 1)';
          srcEl.style.transform = 'translate(0, 0) rotate(0deg)';

          setTimeout(() => {
            if (svg.parentNode) svg.parentNode.removeChild(svg);
            srcEl.style.zIndex = '';
            srcEl.style.transform = '';
            srcEl.style.transition = '';
            srcEl.style.transformOrigin = '';

            for (let k = 0; k < pourCount; k++) {
              dst.push(src.pop());
            }

            isPouring = false;
            renderTubes();
            checkWinCondition();
          }, 360);
          return;
        }

        pouredSoFar++;
        playSound('zen_pour');

        // 1. Drain one layer from srcEl (top layer)
        const srcLayers = srcEl.querySelectorAll('.liquid-layer');
        if (srcLayers.length > 0) {
          const topSrcLayer = srcLayers[srcLayers.length - pouredSoFar];
          if (topSrcLayer) {
            topSrcLayer.style.transition = 'height 0.34s ease-in, opacity 0.3s ease-in';
            topSrcLayer.style.height = '0%';
            topSrcLayer.style.opacity = '0.3';
          }
        }

        // 2. Add one growing layer to dstEl
        const newLayer = document.createElement('div');
        newLayer.className = 'liquid-layer';
        newLayer.style.background = COLORS[color].gradient;
        newLayer.style.height = '0%';
        newLayer.style.transition = 'height 0.34s cubic-bezier(0.18, 0.85, 0.35, 1.1)';
        dstEl.appendChild(newLayer);

        // Animate stream landing level rising
        currentDstCount++;
        landingY = dstRect.bottom - (currentDstCount * layerHeightPx);
        updateStream(landingY);

        requestAnimationFrame(() => {
          newLayer.style.height = '25%';
        });

        setTimeout(pourNextUnit, stepDuration);
      }

      pourNextUnit();
    }, 320);
  }

  function undoMove() {
    if (history.length === 0 || isWon) return;
    tubes = history.pop();
    selectedTubeIdx = null;
    playSound('select');
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
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      playSound('zen_chime');

      try {
        window.parent.postMessage({ type: 'win', time: elapsedSeconds }, '*');
      } catch (e) {}

      showVictoryModal();
    }
  }

  function showVictoryModal() {
    const modal = document.getElementById('modal-victory');
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
