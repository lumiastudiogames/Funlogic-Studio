// Memory Care - Standalone Vanilla JS
(() => {
  const startTime = Date.now();
  let flippedCards = [];
  let isChecking = false;
  let matchesFound = 0;
  let moveCount = 0;
  let isWon = false;
  let soundEnabled = true;

  // 6 Comforting Memory Care Themes
  const THEMES = [
    { id: 'sunflower', name: 'Sunflower', icon: '🌻' },
    { id: 'tea',       name: 'Warm Tea',  icon: '☕' },
    { id: 'kitten',    name: 'Kitten',    icon: '🐱' },
    { id: 'home',      name: 'Cozy Home', icon: '🏡' },
    { id: 'bread',     name: 'Warm Bread',icon: '🍞' },
    { id: 'music',     name: 'Melody',    icon: '🎵' }
  ];

  // 12 Cards (2 of each)
  let deck = [];
  THEMES.forEach((item, index) => {
    deck.push({ uid: `${item.id}-a`, id: item.id, name: item.name, icon: item.icon, matched: false, flipped: false });
    deck.push({ uid: `${item.id}-b`, id: item.id, name: item.name, icon: item.icon, matched: false, flipped: false });
  });

  // Calm predictable friendly layout
  function shuffleDeck() {
    deck.sort(() => Math.random() - 0.5);
  }
  shuffleDeck();

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

  function playFlipSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (_) {}
  }

  function playMatchSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (_) {}
  }

  function playWinSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
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

  const gridEl = document.getElementById('cards-grid');
  const pairsFoundEl = document.getElementById('pairs-found');
  const statusMsg = document.getElementById('status-msg');
  const soundBtn = document.getElementById('btn-sound');
  const resetBtn = document.getElementById('btn-reset');

  function renderGrid() {
    gridEl.innerHTML = '';
    deck.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'memory-card';
      if (card.flipped) cardEl.classList.add('flipped');
      if (card.matched) cardEl.classList.add('matched');

      // Front
      const front = document.createElement('div');
      front.className = 'card-face card-front';
      const symbol = document.createElement('div');
      symbol.className = 'card-symbol';
      symbol.textContent = card.icon;
      const name = document.createElement('div');
      name.className = 'card-name';
      name.textContent = card.name;
      front.appendChild(symbol);
      front.appendChild(name);

      // Back
      const back = document.createElement('div');
      back.className = 'card-face card-back';
      const backPattern = document.createElement('div');
      backPattern.className = 'card-back-pattern';
      backPattern.textContent = '🌿';
      back.appendChild(backPattern);

      cardEl.appendChild(front);
      cardEl.appendChild(back);

      cardEl.addEventListener('click', () => handleCardClick(index));
      gridEl.appendChild(cardEl);
    });

    pairsFoundEl.textContent = `${matchesFound} / 6`;
  }

  function handleCardClick(index) {
    if (isChecking || isWon) return;
    const card = deck[index];
    if (card.flipped || card.matched) return;

    playFlipSound();
    card.flipped = true;
    flippedCards.push({ index, card });
    renderGrid();

    if (flippedCards.length === 2) {
      moveCount++;
      isChecking = true;
      const [first, second] = flippedCards;

      if (first.card.id === second.card.id) {
        // Matched!
        setTimeout(() => {
          first.card.matched = true;
          second.card.matched = true;
          matchesFound++;
          flippedCards = [];
          isChecking = false;
          playMatchSound();
          renderGrid();

          if (matchesFound === 6) {
            handleWin();
          }
        }, 800); // Wait for the slow 0.8s flip to complete smoothly
      } else {
        // Not matched, flip back after giving the player ample time to see
        setTimeout(() => {
          first.card.flipped = false;
          second.card.flipped = false;
          flippedCards = [];
          isChecking = false;
          renderGrid();
        }, 1200);
      }
    }
  }

  function handleWin() {
    isWon = true;
    playWinSound();
    const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    statusMsg.textContent = '🎉 Wonderful! You matched all pairs with great focus!';
    statusMsg.style.color = '#15803d';

    try {
      window.parent.postMessage({ type: 'win', time: elapsed }, '*');
    } catch (_) {}
  }

  resetBtn.addEventListener('click', () => {
    if (confirm('Restart Memory Care?')) {
      deck.forEach(c => {
        c.flipped = false;
        c.matched = false;
      });
      shuffleDeck();
      matchesFound = 0;
      moveCount = 0;
      flippedCards = [];
      isChecking = false;
      isWon = false;
      statusMsg.textContent = 'Tap any two cards to find matching pairs.';
      statusMsg.style.color = '#065f46';
      renderGrid();
    }
  });

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
  });

  renderGrid();
})();
