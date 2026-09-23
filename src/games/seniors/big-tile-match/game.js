// Big Tile Match 60+ - Standalone Vanilla JS
(() => {
  const startTime = Date.now();
  let firstSelected = null;
  let matchesFound = 0;
  let isWon = false;
  let soundEnabled = true;

  // 8 Pairs of high-contrast distinct senior-friendly symbols (16 tiles total)
  const TILE_PAIRS = [
    { id: 'dragon', icon: '🀄', name: 'Dragon' },
    { id: 'bamboo', icon: '🎋', name: 'Bamboo' },
    { id: 'orchid', icon: '🌸', name: 'Orchid' },
    { id: 'coin',   icon: '🪙', name: 'Coin' },
    { id: 'lotus',  icon: '🪷', name: 'Lotus' },
    { id: 'crane',  icon: '🦩', name: 'Crane' },
    { id: 'wind',   icon: '🀀', name: 'Wind' },
    { id: 'lantern',icon: '🏮', name: 'Lantern' }
  ];

  // Create 16 tiles (2 of each) in a fixed solvable friendly layout
  let tiles = [];
  const baseOrder = [
    0, 1, 2, 3,
    4, 5, 6, 7,
    0, 2, 4, 6,
    1, 3, 5, 7
  ];

  tiles = baseOrder.map((pairIdx, index) => ({
    uid: index,
    pairId: TILE_PAIRS[pairIdx].id,
    icon: TILE_PAIRS[pairIdx].icon,
    name: TILE_PAIRS[pairIdx].name,
    matched: false
  }));

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

  function playTileClick() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  }

  function playMatchChime() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (_) {}
  }

  function playWinFanfare() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.5);
      });
    } catch (_) {}
  }

  const gridEl = document.getElementById('tiles-grid');
  const pairsLeftEl = document.getElementById('pairs-left');
  const statusMsg = document.getElementById('status-msg');
  const soundBtn = document.getElementById('btn-sound');
  const hintBtn = document.getElementById('btn-hint');
  const resetBtn = document.getElementById('btn-reset');

  // In Mahjong, a tile is playable if at least one side (left or right in its row) is free or outer edge
  function isTileFree(index) {
    const tile = tiles[index];
    if (tile.matched) return false;
    const col = index % 4;

    // Outer left edge or left neighbor is matched
    const leftFree = col === 0 || tiles[index - 1].matched;
    // Outer right edge or right neighbor is matched
    const rightFree = col === 3 || tiles[index + 1].matched;

    return leftFree || rightFree;
  }

  function renderBoard() {
    gridEl.innerHTML = '';
    tiles.forEach((tile, index) => {
      const tileEl = document.createElement('div');
      tileEl.className = 'mahjong-tile';
      tileEl.dataset.index = index;

      if (tile.matched) {
        tileEl.classList.add('matched');
      } else {
        const free = isTileFree(index);
        if (!free) {
          tileEl.style.opacity = '0.6';
          tileEl.style.cursor = 'not-allowed';
        }

        if (firstSelected === index) {
          tileEl.classList.add('selected');
        }

        const icon = document.createElement('div');
        icon.className = 'tile-icon';
        icon.textContent = tile.icon;

        const label = document.createElement('div');
        label.className = 'tile-label';
        label.textContent = tile.name;

        tileEl.appendChild(icon);
        tileEl.appendChild(label);

        tileEl.addEventListener('click', () => handleTileClick(index));
      }

      gridEl.appendChild(tileEl);
    });

    pairsLeftEl.textContent = 8 - matchesFound;
  }

  function handleTileClick(index) {
    if (isWon) return;
    const tile = tiles[index];
    if (tile.matched) return;

    if (!isTileFree(index)) {
      statusMsg.textContent = 'This tile is blocked. Choose a tile with a free side!';
      statusMsg.style.color = '#b91c1c';
      setTimeout(() => {
        if (!isWon) {
          statusMsg.textContent = 'Match 8 pairs of large Mahjong tiles at your pace.';
          statusMsg.style.color = '#6b21a8';
        }
      }, 1500);
      return;
    }

    playTileClick();
    clearHints();

    if (firstSelected === null) {
      firstSelected = index;
      renderBoard();
    } else if (firstSelected === index) {
      firstSelected = null;
      renderBoard();
    } else {
      const firstTile = tiles[firstSelected];
      if (firstTile.pairId === tile.pairId) {
        // Matched!
        firstTile.matched = true;
        tile.matched = true;
        matchesFound++;
        playMatchChime();
        firstSelected = null;

        renderBoard();

        if (matchesFound === 8) {
          handleWin();
        }
      } else {
        // Not a match, select the new one
        firstSelected = index;
        renderBoard();
      }
    }
  }

  function handleWin() {
    isWon = true;
    playWinFanfare();
    const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    statusMsg.textContent = '🎉 Wonderful! All 8 pairs matched successfully!';
    statusMsg.style.color = '#15803d';

    try {
      window.parent.postMessage({ type: 'win', time: elapsed }, '*');
    } catch (_) {}
  }

  function clearHints() {
    document.querySelectorAll('.mahjong-tile').forEach(el => el.classList.remove('hinted'));
  }

  hintBtn.addEventListener('click', () => {
    if (isWon) return;
    clearHints();

    // Find any two free tiles that match
    const freeIndices = [];
    for (let i = 0; i < tiles.length; i++) {
      if (!tiles[i].matched && isTileFree(i)) {
        freeIndices.push(i);
      }
    }

    for (let i = 0; i < freeIndices.length; i++) {
      for (let j = i + 1; j < freeIndices.length; j++) {
        const idxA = freeIndices[i];
        const idxB = freeIndices[j];
        if (tiles[idxA].pairId === tiles[idxB].pairId) {
          const elA = document.querySelector(`.mahjong-tile[data-index="${idxA}"]`);
          const elB = document.querySelector(`.mahjong-tile[data-index="${idxB}"]`);
          if (elA) elA.classList.add('hinted');
          if (elB) elB.classList.add('hinted');
          statusMsg.textContent = `💡 Hint: Try matching the two ${tiles[idxA].name} tiles!`;
          statusMsg.style.color = '#7e22ce';
          return;
        }
      }
    }
    statusMsg.textContent = 'No obvious open pairs found. Clear edge tiles first!';
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Restart Big Tile Match?')) {
      tiles.forEach(t => t.matched = false);
      matchesFound = 0;
      firstSelected = null;
      isWon = false;
      statusMsg.textContent = 'Match 8 pairs of large Mahjong tiles at your pace.';
      statusMsg.style.color = '#6b21a8';
      renderBoard();
    }
  });

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
  });

  renderBoard();
})();
