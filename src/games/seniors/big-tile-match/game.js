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

  // 16-Tile Solvable 3D Multi-Layer Configuration
  // 12 Tiles on Layer 0 (Base perimeter), 4 Tiles on Layer 1 (Top Tier center)
  const TILE_CONFIGS = [
    // Layer 0 - Top Row
    { row: 1, col: 1, layer: 0, pairIdx: 0 },
    { row: 1, col: 2, layer: 0, pairIdx: 1 },
    { row: 1, col: 3, layer: 0, pairIdx: 2 },
    { row: 1, col: 4, layer: 0, pairIdx: 3 },

    // Layer 0 - Middle Edges
    { row: 2, col: 1, layer: 0, pairIdx: 4 },
    { row: 2, col: 4, layer: 0, pairIdx: 5 },
    { row: 3, col: 1, layer: 0, pairIdx: 6 },
    { row: 3, col: 4, layer: 0, pairIdx: 7 },

    // Layer 0 - Bottom Row
    { row: 4, col: 1, layer: 0, pairIdx: 0 },
    { row: 4, col: 2, layer: 0, pairIdx: 2 },
    { row: 4, col: 3, layer: 0, pairIdx: 4 },
    { row: 4, col: 4, layer: 0, pairIdx: 6 },

    // Layer 1 - Center Elevated Deck (Top Tier)
    { row: 2, col: 2, layer: 1, pairIdx: 1 },
    { row: 2, col: 3, layer: 1, pairIdx: 3 },
    { row: 3, col: 2, layer: 1, pairIdx: 5 },
    { row: 3, col: 3, layer: 1, pairIdx: 7 }
  ];

  let tiles = TILE_CONFIGS.map((cfg, index) => ({
    uid: index,
    row: cfg.row,
    col: cfg.col,
    layer: cfg.layer,
    pairId: TILE_PAIRS[cfg.pairIdx].id,
    icon: TILE_PAIRS[cfg.pairIdx].icon,
    name: TILE_PAIRS[cfg.pairIdx].name,
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

  // Change tiles-grid class to mahjong-arena
  if (gridEl) {
    gridEl.className = 'mahjong-arena';
  }

  function spawnMatchStars(x, y) {
    const emojis = ['✨', '⭐', '🌟', '🀄', '🌸'];
    for (let i = 0; i < 10; i++) {
      const star = document.createElement('span');
      star.className = 'match-star';
      star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      star.style.left = `${x}px`;
      star.style.top = `${y}px`;

      const angle = (Math.PI * 2 * i) / 10;
      const dist = 30 + Math.random() * 50;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      star.style.setProperty('--dx', `${dx}px`);
      star.style.setProperty('--dy', `${dy}px`);
      star.style.fontSize = `${16 + Math.random() * 12}px`;

      document.body.appendChild(star);
      setTimeout(() => star.remove(), 950);
    }
  }

  // Mahjong Playability Rules:
  // 1. Layer 1 (Top Tier) tiles are never covered from above. A layer 1 tile is free if left or right is open.
  // 2. Layer 0 (Base) tiles: outer corners/edges are open.
  function isTileFree(index) {
    const tile = tiles[index];
    if (tile.matched) return false;

    // Check same-layer left and right neighbors
    const leftNeighbor = tiles.find(t => !t.matched && t.layer === tile.layer && t.row === tile.row && t.col === tile.col - 1);
    const rightNeighbor = tiles.find(t => !t.matched && t.layer === tile.layer && t.row === tile.row && t.col === tile.col + 1);

    const leftFree = !leftNeighbor;
    const rightFree = !rightNeighbor;

    return leftFree || rightFree;
  }

  function renderBoard() {
    gridEl.innerHTML = '';
    tiles.forEach((tile, index) => {
      const tileEl = document.createElement('div');
      tileEl.className = `mahjong-tile layer-${tile.layer}`;
      tileEl.dataset.index = index;

      tileEl.style.gridRow = `${tile.row}`;
      tileEl.style.gridColumn = `${tile.col}`;

      if (tile.matched) {
        tileEl.classList.add('matched');
      } else {
        const free = isTileFree(index);
        if (!free) {
          tileEl.classList.add('blocked');
        }

        if (firstSelected === index) {
          tileEl.classList.add('selected');
        }

        if (tile.layer === 1) {
          const badge = document.createElement('div');
          badge.className = 'tier-badge';
          badge.textContent = 'TOP';
          tileEl.appendChild(badge);
        }

        const icon = document.createElement('div');
        icon.className = 'tile-icon';
        icon.textContent = tile.icon;

        const label = document.createElement('div');
        label.className = 'tile-label';
        label.textContent = tile.name;

        tileEl.appendChild(icon);
        tileEl.appendChild(label);

        tileEl.addEventListener('click', (e) => {
          handleTileClick(index, e);
        });
      }

      gridEl.appendChild(tileEl);
    });

    pairsLeftEl.textContent = 8 - matchesFound;
  }

  function handleTileClick(index, event) {
    if (isWon) return;
    const tile = tiles[index];
    if (tile.matched) return;

    if (!isTileFree(index)) {
      statusMsg.textContent = tile.layer === 0 
        ? 'Tile on bottom level is blocked. Free the outer edge first!'
        : 'Tile is trapped between others. Free one side!';
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

        if (event && event.clientX) {
          spawnMatchStars(event.clientX, event.clientY);
        }

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
    statusMsg.textContent = '🎉 Wonderful! All 8 pairs across both levels matched!';
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
