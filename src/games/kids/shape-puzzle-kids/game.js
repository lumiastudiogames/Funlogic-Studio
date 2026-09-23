// Shape Puzzle Kids - 3-Shape Cat Tangram for Children
(function() {
  'use strict';

  const SHAPES = [
    { id: 'ears', name: 'Cat Ears', color: '#f43f5e', border: '#9f1239' },
    { id: 'head', name: 'Cat Head', color: '#06b6d4', border: '#0e7490' },
    { id: 'body', name: 'Cat Body', color: '#f59e0b', border: '#b45309' }
  ];

  let selectedShapeId = null;
  let placedShapes = new Set();
  let startTime = Date.now();
  let isWon = false;
  let soundEnabled = true;

  // Web Audio Synthesizer
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
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'select') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'snap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'meow') {
      // Meow simulation: glide up then down
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(700, now + 0.2);
      osc.frequency.linearRampToValueAtTime(450, now + 0.45);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'win') {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.3);
      });
    }
  }

  function initGame() {
    selectedShapeId = null;
    placedShapes = new Set();
    isWon = false;
    startTime = Date.now();
    document.getElementById('win-modal').classList.remove('active');
    document.getElementById('cat-face-details').style.display = 'none';

    updateHint('Tap a shape in the tray, then tap its outline!');
    render();
  }

  function updateHint(text) {
    const el = document.getElementById('hint-bar');
    if (el) el.textContent = text;
  }

  function render() {
    // Tray buttons
    SHAPES.forEach(shape => {
      const btn = document.getElementById(`btn-${shape.id}`);
      if (!btn) return;
      btn.classList.toggle('selected', selectedShapeId === shape.id);
      btn.classList.toggle('used', placedShapes.has(shape.id));
    });

    // Silhouette Slots in SVG
    SHAPES.forEach(shape => {
      const slot = document.getElementById(`slot-${shape.id}`);
      if (!slot) return;
      if (placedShapes.has(shape.id)) {
        slot.setAttribute('fill', shape.color);
        slot.setAttribute('stroke', shape.border);
        slot.setAttribute('stroke-width', '5');
      } else {
        slot.setAttribute('fill', '#f1f5f9');
        slot.setAttribute('stroke', '#cbd5e1');
        slot.setAttribute('stroke-width', '4');
        slot.setAttribute('stroke-dasharray', '6,4');
      }
    });

    if (placedShapes.size === 3 && !isWon) {
      handleWin();
    }
  }

  function handleTrayClick(id) {
    if (isWon || placedShapes.has(id)) return;
    selectedShapeId = id;
    playSound('select');
    const shape = SHAPES.find(s => s.id === id);
    updateHint(`Picked ${shape.name}! Tap its outline on the cat.`);
    render();
  }

  function handleSlotClick(id) {
    if (isWon || placedShapes.has(id)) return;

    if (selectedShapeId === id) {
      placedShapes.add(id);
      selectedShapeId = null;
      playSound('snap');
      updateHint('Perfect snap! 🌟');
      render();
    } else if (selectedShapeId !== null) {
      playSound('select');
      updateHint("That shape belongs somewhere else! Look at the outline.");
    } else {
      playSound('select');
      updateHint("Pick the matching shape from the tray first!");
    }
  }

  function handleWin() {
    isWon = true;
    document.getElementById('cat-face-details').style.display = 'block';
    playSound('meow');
    setTimeout(() => playSound('win'), 400);

    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    updateHint('🐱 Meow! The sweet cat is complete!');

    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'win', time: elapsedSeconds }, '*');
      }
    } catch (e) {}

    setTimeout(() => {
      document.getElementById('win-time').textContent = `${elapsedSeconds}s`;
      document.getElementById('win-modal').classList.add('active');
    }, 600);
  }

  // Setup Event Listeners
  SHAPES.forEach(shape => {
    const btn = document.getElementById(`btn-${shape.id}`);
    if (btn) btn.addEventListener('click', () => handleTrayClick(shape.id));

    const slot = document.getElementById(`slot-${shape.id}`);
    if (slot) slot.addEventListener('click', () => handleSlotClick(shape.id));
  });

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-play-again').addEventListener('click', initGame);

  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playSound('select');
  });

  const howBtn = document.getElementById('btn-how');
  const howModal = document.getElementById('how-modal');
  const closeHowBtn = document.getElementById('btn-close-how');

  howBtn.addEventListener('click', () => {
    howModal.classList.add('active');
    playSound('select');
  });
  closeHowBtn.addEventListener('click', () => {
    howModal.classList.remove('active');
  });

  initGame();
})();
