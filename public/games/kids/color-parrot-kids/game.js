// Color Parrot Kids - Musical Simon Sequence Game for Children
(function() {
  'use strict';

  const COLORS = ['green', 'red', 'yellow', 'blue'];
  const FREQS = {
    green: 329.63,
    red: 440.0,
    yellow: 554.37,
    blue: 659.25
  };
  const TARGET_ROUNDS = 5;

  let sequence = [];
  let playerStep = 0;
  let isPlayingSeq = false;
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

  function playTone(color, duration = 0.35) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freq = FREQS[color] || 440;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  function playWinTune() {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
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

  function updateHint(text) {
    const el = document.getElementById('hint-bar');
    if (el) el.textContent = text;
  }

  function initGame() {
    sequence = [];
    playerStep = 0;
    isPlayingSeq = false;
    isWon = false;
    startTime = Date.now();
    document.getElementById('win-modal').classList.remove('active');

    // Add first random color
    addColorToSequence();
    playSequence();
  }

  function addColorToSequence() {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    sequence.push(randomColor);
  }

  function flashButton(color, callback) {
    const btn = document.getElementById(`btn-${color}`);
    if (btn) btn.classList.add('active');
    playTone(color, 0.3);

    setTimeout(() => {
      if (btn) btn.classList.remove('active');
      if (callback) callback();
    }, 380);
  }

  function playSequence() {
    isPlayingSeq = true;
    playerStep = 0;
    updateHint(`Listen to the parrot! (Song: ${sequence.length}/${TARGET_ROUNDS})`);

    let i = 0;
    function next() {
      if (i < sequence.length) {
        flashButton(sequence[i], () => {
          i++;
          setTimeout(next, 180);
        });
      } else {
        isPlayingSeq = false;
        updateHint(`Your turn! Tap the ${sequence.length} color${sequence.length > 1 ? 's' : ''}!`);
      }
    }

    setTimeout(next, 400);
  }

  function handleColorClick(color) {
    if (isPlayingSeq || isWon) return;

    flashButton(color);

    if (color === sequence[playerStep]) {
      playerStep++;

      if (playerStep === sequence.length) {
        // Round passed!
        if (sequence.length >= TARGET_ROUNDS) {
          handleWin();
        } else {
          updateHint('Awesome! Next note coming...');
          addColorToSequence();
          setTimeout(playSequence, 800);
        }
      }
    } else {
      // Gentle mismatch retry
      updateHint('Oops! Let\'s listen once more!');
      setTimeout(playSequence, 900);
    }
  }

  function handleWin() {
    isWon = true;
    playWinTune();
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    updateHint('🦜 Super Musical Star! Song complete!');

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

  // Setup buttons
  COLORS.forEach(color => {
    const btn = document.getElementById(`btn-${color}`);
    if (btn) {
      btn.addEventListener('click', () => handleColorClick(color));
    }
  });

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-play-again').addEventListener('click', initGame);

  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playTone('green');
  });

  const howBtn = document.getElementById('btn-how');
  const howModal = document.getElementById('how-modal');
  const closeHowBtn = document.getElementById('btn-close-how');

  howBtn.addEventListener('click', () => {
    howModal.classList.add('active');
  });
  closeHowBtn.addEventListener('click', () => {
    howModal.classList.remove('active');
  });

  initGame();
})();
