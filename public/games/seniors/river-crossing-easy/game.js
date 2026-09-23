// River Crossing Easy - Standalone Vanilla JS
(() => {
  const startTime = Date.now();
  let boatLocation = 'LEFT'; // 'LEFT' or 'RIGHT'
  let boatPassenger = null; // null or 'wolf' | 'sheep' | 'cabbage'
  let tripCount = 0;
  let isWon = false;
  let soundEnabled = true;

  // Characters State
  // Location can be 'LEFT', 'BOAT', or 'RIGHT'
  const characters = {
    wolf: { id: 'wolf', name: 'Wolf', icon: '🐺', loc: 'LEFT' },
    sheep: { id: 'sheep', name: 'Sheep', icon: '🐑', loc: 'LEFT' },
    cabbage: { id: 'cabbage', name: 'Cabbage', icon: '🥬', loc: 'LEFT' }
  };

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

  function playRowSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (_) {}
  }

  function playAlertSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
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

  const leftBankEl = document.getElementById('left-bank-items');
  const rightBankEl = document.getElementById('right-bank-items');
  const boatPassengerSlot = document.getElementById('boat-passenger');
  const boatEl = document.getElementById('boat-container');
  const tripsCountEl = document.getElementById('trips-count');
  const statusMsg = document.getElementById('status-msg');
  const rowBtn = document.getElementById('btn-row');
  const soundBtn = document.getElementById('btn-sound');
  const resetBtn = document.getElementById('btn-reset');

  function renderView() {
    leftBankEl.innerHTML = '';
    rightBankEl.innerHTML = '';
    boatPassengerSlot.innerHTML = '';

    // Update boat position
    if (boatLocation === 'LEFT') {
      boatEl.className = 'boat-container boat-left';
      rowBtn.textContent = 'Row Across ➔';
    } else {
      boatEl.className = 'boat-container boat-right';
      rowBtn.textContent = 'Row Back ⬅';
    }

    // Render characters
    Object.values(characters).forEach(char => {
      const card = document.createElement('div');
      card.className = 'char-card';
      if (char.loc === 'BOAT') card.classList.add('in-boat');

      const icon = document.createElement('div');
      icon.className = 'char-icon';
      icon.textContent = char.icon;

      const name = document.createElement('div');
      name.className = 'char-name';
      name.textContent = char.name;

      card.appendChild(icon);
      card.appendChild(name);

      card.addEventListener('click', () => toggleBoarding(char.id));

      if (char.loc === 'LEFT') {
        leftBankEl.appendChild(card);
      } else if (char.loc === 'RIGHT') {
        rightBankEl.appendChild(card);
      } else if (char.loc === 'BOAT') {
        boatPassengerSlot.appendChild(card);
      }
    });

    tripsCountEl.textContent = tripCount;
  }

  function toggleBoarding(charId) {
    if (isWon) return;
    const char = characters[charId];

    if (char.loc === 'BOAT') {
      // Step off to the current bank
      char.loc = boatLocation;
      boatPassenger = null;
      renderView();
    } else if (char.loc === boatLocation) {
      // Board boat if space available
      if (boatPassenger === null) {
        char.loc = 'BOAT';
        boatPassenger = charId;
        renderView();
      } else {
        statusMsg.textContent = 'The boat is full! Only 1 passenger plus the farmer.';
        statusMsg.style.color = '#b91c1c';
      }
    } else {
      statusMsg.textContent = 'The boat is on the other side of the river!';
      statusMsg.style.color = '#b91c1c';
    }
  }

  function checkSafety() {
    // When farmer and boat leave a bank, check if remaining items are safe
    // Left bank check:
    const leftItems = Object.values(characters).filter(c => c.loc === 'LEFT').map(c => c.id);
    const rightItems = Object.values(characters).filter(c => c.loc === 'RIGHT').map(c => c.id);

    // If farmer is on RIGHT, check LEFT bank
    if (boatLocation === 'RIGHT') {
      if (leftItems.includes('wolf') && leftItems.includes('sheep')) {
        return { safe: false, reason: 'Oh no! The Wolf frightened the Sheep on the left bank!' };
      }
      if (leftItems.includes('sheep') && leftItems.includes('cabbage')) {
        return { safe: false, reason: 'Oh no! The Sheep nibbled the Cabbage on the left bank!' };
      }
    }

    // If farmer is on LEFT, check RIGHT bank
    if (boatLocation === 'LEFT') {
      if (rightItems.includes('wolf') && rightItems.includes('sheep')) {
        return { safe: false, reason: 'Oh no! The Wolf frightened the Sheep on the right bank!' };
      }
      if (rightItems.includes('sheep') && rightItems.includes('cabbage')) {
        return { safe: false, reason: 'Oh no! The Sheep nibbled the Cabbage on the right bank!' };
      }
    }

    return { safe: true };
  }

  rowBtn.addEventListener('click', () => {
    if (isWon) return;

    // Row across
    boatLocation = boatLocation === 'LEFT' ? 'RIGHT' : 'LEFT';
    tripCount++;
    playRowSound();
    renderView();

    const check = checkSafety();
    if (!check.safe) {
      playAlertSound();
      statusMsg.textContent = `⚠️ ${check.reason} Try stepping back!`;
      statusMsg.style.color = '#dc2626';
      return;
    }

    // Check if won
    const rightCount = Object.values(characters).filter(c => c.loc === 'RIGHT').length;
    if (rightCount === 3 && boatPassenger === null) {
      handleWin();
    } else {
      statusMsg.textContent = 'A safe crossing! Tap a companion to board or step off.';
      statusMsg.style.color = '#0369a1';
    }
  });

  function handleWin() {
    isWon = true;
    playWinSound();
    const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    statusMsg.textContent = '🎉 Splendid! Everyone safely crossed the river!';
    statusMsg.style.color = '#15803d';

    try {
      window.parent.postMessage({ type: 'win', time: elapsed }, '*');
    } catch (_) {}
  }

  resetBtn.addEventListener('click', () => {
    if (confirm('Restart River Crossing puzzle?')) {
      boatLocation = 'LEFT';
      boatPassenger = null;
      tripCount = 0;
      isWon = false;
      characters.wolf.loc = 'LEFT';
      characters.sheep.loc = 'LEFT';
      characters.cabbage.loc = 'LEFT';
      statusMsg.textContent = 'Tap a companion to board the boat, then Row Across.';
      statusMsg.style.color = '#0369a1';
      renderView();
    }
  });

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
  });

  renderView();
})();
