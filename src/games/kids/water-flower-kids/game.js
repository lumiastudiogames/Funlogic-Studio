// Water to Flower Kids - 3 Pipe Connection Puzzle for Children
(function() {
  'use strict';

  // Each pipe has openings: [Top, Right, Bottom, Left]
  // type 'straight': [false, true, false, true] (0 deg: horizontal, 90 deg: vertical)
  // type 'corner':   [true, true, false, false] (0 deg: top-right)
  const PIPE_TYPES = [
    { type: 'straight', baseOpenings: [false, true, false, true] },
    { type: 'corner', baseOpenings: [true, true, false, false] }
  ];

  let pipes = [];
  let isWon = false;
  let startTime = Date.now();
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

    if (type === 'turn') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(550, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'water') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
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

  function getRotatedOpenings(base, rotationStep) {
    // rotationStep: 0: 0deg, 1: 90deg, 2: 180deg, 3: 270deg
    const res = [false, false, false, false];
    for (let i = 0; i < 4; i++) {
      if (base[i]) {
        res[(i + rotationStep) % 4] = true;
      }
    }
    return res;
  }

  function initGame() {
    isWon = false;
    startTime = Date.now();
    document.getElementById('win-modal').classList.remove('active');
    document.getElementById('flower-box').classList.remove('blooming');

    // 3 pipes in a row: Tap enters on Left, exits on Right to Flower
    // Pipes are straightforward: all 3 can connect left to right
    // Pipe 0: straight (base horizontal)
    // Pipe 1: straight (base horizontal)
    // Pipe 2: straight (base horizontal)
    // Randomize initial rotation steps (1, 2, or 3) so they are initially scrambled!
    pipes = [
      { type: 'straight', base: [false, true, false, true], rotation: Math.floor(Math.random() * 2) * 90 + 90 },
      { type: 'straight', base: [false, true, false, true], rotation: Math.floor(Math.random() * 2) * 90 + 90 },
      { type: 'straight', base: [false, true, false, true], rotation: Math.floor(Math.random() * 2) * 90 + 90 }
    ];

    // Ensure at least one pipe is rotated away from horizontal so player has to interact
    if (pipes.every(p => (p.rotation / 90) % 2 === 0)) {
      pipes[1].rotation = 90;
    }

    renderPipes();
    checkFlow();
  }

  function renderPipes() {
    const container = document.getElementById('pipes-list');
    container.innerHTML = '';

    pipes.forEach((p, idx) => {
      const tile = document.createElement('div');
      tile.className = 'pipe-tile';
      tile.id = `pipe-${idx}`;

      const canvas = document.createElement('canvas');
      canvas.width = 160;
      canvas.height = 160;
      canvas.className = 'pipe-canvas';
      drawPipe(canvas, p);

      tile.appendChild(canvas);
      tile.addEventListener('click', () => rotatePipe(idx));
      container.appendChild(tile);
    });
  }

  function drawPipe(canvas, pipe, isFlowing = false) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 160, 160);

    const step = (pipe.rotation / 90) % 4;
    const isHorizontal = step % 2 === 0;

    ctx.save();
    ctx.translate(80, 80);
    ctx.rotate((pipe.rotation * Math.PI) / 180);

    // Outer pipe border
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.roundRect(-80, -22, 160, 44, 8);
    ctx.fill();

    // Inner pipe body
    ctx.fillStyle = isFlowing ? '#38bdf8' : '#94a3b8';
    ctx.beginPath();
    ctx.roundRect(-80, -16, 160, 32, 6);
    ctx.fill();

    // Flowing water core
    if (isFlowing) {
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(-80, -8, 160, 16, 4);
      ctx.fill();
    }

    ctx.restore();
  }

  function rotatePipe(idx) {
    if (isWon) return;
    pipes[idx].rotation += 90;
    playSound('turn');

    const tile = document.getElementById(`pipe-${idx}`);
    if (tile) {
      const canvas = tile.querySelector('canvas');
      drawPipe(canvas, pipes[idx], false);
    }

    checkFlow();
  }

  function checkFlow() {
    // Left enters pipe 0: needs Left and Right open (horizontal)
    // All 3 pipes must be horizontal (rotation % 180 === 0)
    let flows0 = (pipes[0].rotation % 180 === 0);
    let flows1 = flows0 && (pipes[1].rotation % 180 === 0);
    let flows2 = flows1 && (pipes[2].rotation % 180 === 0);

    // Update visuals
    pipes.forEach((p, idx) => {
      const tile = document.getElementById(`pipe-${idx}`);
      if (!tile) return;
      const flowing = (idx === 0 && flows0) || (idx === 1 && flows1) || (idx === 2 && flows2);
      tile.classList.toggle('flowing', flowing);
      const canvas = tile.querySelector('canvas');
      drawPipe(canvas, p, flowing);
    });

    if (flows2 && !isWon) {
      handleWin();
    }
  }

  function handleWin() {
    isWon = true;
    playSound('water');
    setTimeout(() => playSound('win'), 250);

    document.getElementById('flower-box').classList.add('blooming');
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));

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

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-play-again').addEventListener('click', initGame);

  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playSound('turn');
  });

  const howBtn = document.getElementById('btn-how');
  const howModal = document.getElementById('how-modal');
  const closeHowBtn = document.getElementById('btn-close-how');

  howBtn.addEventListener('click', () => {
    howModal.classList.add('active');
    playSound('turn');
  });
  closeHowBtn.addEventListener('click', () => {
    howModal.classList.remove('active');
  });

  initGame();
})();
