// Shape Fit Relax - Standalone Vanilla JS
(() => {
  const startTime = Date.now();
  let fittedShapes = {
    roof: false,
    base: false
  };
  let selectedPiece = null;
  let isWon = false;
  let soundEnabled = true;

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

  function playSnapSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (_) {}
  }

  function playWinSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
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

  const pieceRoof = document.getElementById('piece-roof');
  const pieceBase = document.getElementById('piece-base');
  const slotRoof = document.getElementById('slot-roof');
  const slotBase = document.getElementById('slot-base');
  const statusMsg = document.getElementById('status-msg');
  const shapesLeftEl = document.getElementById('shapes-left');
  const soundBtn = document.getElementById('btn-sound');
  const resetBtn = document.getElementById('btn-reset');

  function updateStatus() {
    const left = (fittedShapes.roof ? 0 : 1) + (fittedShapes.base ? 0 : 1);
    shapesLeftEl.textContent = `${2 - left} / 2`;

    if (left === 0 && !isWon) {
      handleWin();
    }
  }

  function fitShape(shapeType) {
    if (shapeType === 'roof' && !fittedShapes.roof) {
      fittedShapes.roof = true;
      slotRoof.innerHTML = '';
      pieceRoof.style.display = 'none';

      // Insert fitted piece into slot
      const fitted = document.createElement('div');
      fitted.className = 'shape-roof';
      fitted.style.boxShadow = 'none';
      fitted.textContent = 'Roof';
      slotRoof.appendChild(fitted);
      playSnapSound();
      updateStatus();
    } else if (shapeType === 'base' && !fittedShapes.base) {
      fittedShapes.base = true;
      slotBase.innerHTML = '';
      pieceBase.style.display = 'none';

      const fitted = document.createElement('div');
      fitted.className = 'shape-base';
      fitted.style.boxShadow = 'none';
      fitted.textContent = 'House Base';
      slotBase.appendChild(fitted);
      playSnapSound();
      updateStatus();
    }
    selectedPiece = null;
    clearSelection();
  }

  function clearSelection() {
    pieceRoof.classList.remove('selected');
    pieceBase.classList.remove('selected');
  }

  // Tap-to-select support
  pieceRoof.addEventListener('click', () => {
    if (fittedShapes.roof) return;
    clearSelection();
    selectedPiece = 'roof';
    pieceRoof.classList.add('selected');
    statusMsg.textContent = 'Roof selected! Now tap the triangular slot on the house.';
  });

  pieceBase.addEventListener('click', () => {
    if (fittedShapes.base) return;
    clearSelection();
    selectedPiece = 'base';
    pieceBase.classList.add('selected');
    statusMsg.textContent = 'House Base selected! Now tap the square slot on the house.';
  });

  slotRoof.addEventListener('click', () => {
    if (selectedPiece === 'roof') {
      fitShape('roof');
    }
  });

  slotBase.addEventListener('click', () => {
    if (selectedPiece === 'base') {
      fitShape('base');
    }
  });

  // Drag and Drop (HTML5 Drag Events)
  [pieceRoof, pieceBase].forEach(el => {
    el.setAttribute('draggable', 'true');
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', el.dataset.shape);
    });
  });

  [slotRoof, slotBase].forEach(slot => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      slot.classList.add('slot-hover');
    });

    slot.addEventListener('dragleave', () => {
      slot.classList.remove('slot-hover');
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      slot.classList.remove('slot-hover');
      const droppedShape = e.dataTransfer.getData('text/plain');
      if (slot.dataset.target === droppedShape) {
        fitShape(droppedShape);
      } else {
        statusMsg.textContent = 'Try fitting that piece into its matching slot.';
      }
    });
  });

  function handleWin() {
    isWon = true;
    playWinSound();
    const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    statusMsg.textContent = '🎉 Splendid! Both shapes fit perfectly into the home!';
    statusMsg.style.color = '#15803d';

    try {
      window.parent.postMessage({ type: 'win', time: elapsed }, '*');
    } catch (_) {}
  }

  resetBtn.addEventListener('click', () => {
    if (confirm('Restart Shape Fit puzzle?')) {
      fittedShapes = { roof: false, base: false };
      selectedPiece = null;
      isWon = false;
      pieceRoof.style.display = 'flex';
      pieceBase.style.display = 'flex';
      slotRoof.innerHTML = '<span style="color:#ffffff; font-weight:700;">Drop Roof</span>';
      slotBase.innerHTML = '<span style="color:#ffffff; font-weight:700;">Drop Base</span>';
      clearSelection();
      statusMsg.textContent = 'Drag or tap the 2 shapes into the home silhouette.';
      statusMsg.style.color = '#44403c';
      updateStatus();
    }
  });

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
  });

  updateStatus();
})();
