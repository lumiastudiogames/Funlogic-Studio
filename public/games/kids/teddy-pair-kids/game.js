// Teddy Pair Kids - 12 Card Memory Game for Children
(function() {
  'use strict';

  const ICONS = ['🧸', '🐼', '🐨', '🦁', '🐰', '🦊'];

  let cards = [];
  let flippedIndices = [];
  let matchedIndices = new Set();
  let lockBoard = false;
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

    if (type === 'flip') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'match') {
      const notes = [587.33, 880]; // D, High A
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.2);
      });
    } else if (type === 'mismatch') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.setValueAtTime(200, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
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
    // 6 pairs = 12 cards
    const deck = [...ICONS, ...ICONS];
    deck.sort(() => Math.random() - 0.5);
    cards = deck;

    flippedIndices = [];
    matchedIndices = new Set();
    lockBoard = false;
    startTime = Date.now();
    document.getElementById('win-modal').classList.remove('active');
    updateStatus('Find all 6 pairs of fluffy friends!');
    render();
  }

  function updateStatus(text) {
    const el = document.getElementById('status-bar');
    if (el) el.textContent = text;
  }

  function render() {
    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '';

    cards.forEach((icon, idx) => {
      const card = document.createElement('div');
      card.className = 'card-wrapper';

      const isFlipped = flippedIndices.includes(idx);
      const isMatched = matchedIndices.has(idx);

      if (isFlipped) card.classList.add('flipped');
      if (isMatched) card.classList.add('matched');

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-back">⭐</div>
          <div class="card-front">${icon}</div>
        </div>
      `;

      card.addEventListener('click', () => handleCardClick(idx));
      grid.appendChild(card);
    });
  }

  function handleCardClick(idx) {
    if (lockBoard) return;
    if (matchedIndices.has(idx)) return;
    if (flippedIndices.includes(idx)) return;

    playSound('flip');
    flippedIndices.push(idx);
    render();

    if (flippedIndices.length === 2) {
      lockBoard = true;
      const [first, second] = flippedIndices;

      if (cards[first] === cards[second]) {
        // Match
        setTimeout(() => {
          playSound('match');
          matchedIndices.add(first);
          matchedIndices.add(second);
          flippedIndices = [];
          lockBoard = false;
          render();

          const pairsLeft = 6 - (matchedIndices.size / 2);
          if (pairsLeft > 0) {
            updateStatus(`Yay! ${pairsLeft} pair${pairsLeft > 1 ? 's' : ''} left!`);
          } else {
            handleWin();
          }
        }, 400);
      } else {
        // Mismatch
        setTimeout(() => {
          playSound('mismatch');
          flippedIndices = [];
          lockBoard = false;
          render();
        }, 900);
      }
    }
  }

  function handleWin() {
    playSound('win');
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    updateStatus('🎉 Awesome memory! All pairs found!');

    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'win', time: elapsedSeconds }, '*');
      }
    } catch (e) {}

    setTimeout(() => {
      document.getElementById('win-time').textContent = `${elapsedSeconds}s`;
      document.getElementById('win-modal').classList.add('active');
    }, 500);
  }

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-play-again').addEventListener('click', initGame);

  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playSound('flip');
  });

  const howBtn = document.getElementById('btn-how');
  const howModal = document.getElementById('how-modal');
  const closeHowBtn = document.getElementById('btn-close-how');

  howBtn.addEventListener('click', () => {
    howModal.classList.add('active');
    playSound('flip');
  });
  closeHowBtn.addEventListener('click', () => {
    howModal.classList.remove('active');
  });

  initGame();
})();
