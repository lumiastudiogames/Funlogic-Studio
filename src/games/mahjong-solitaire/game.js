/**
 * Mahjong Solitaire Classic - 144 Tiles
 * Standalone Vanilla JS Game
 */

(function () {
  'use strict';

  // --- Tile Definitions ---
  // Suits: Wan (Characters), Sou (Bamboo), Pin (Dots), Winds, Dragons, Flowers, Seasons
  const SUITS = {
    WAN: 'wan',
    SOU: 'sou',
    PIN: 'pin',
    WIND: 'wind',
    DRAGON: 'dragon',
    FLOWER: 'flower',
    SEASON: 'season',
  };

  const TILE_CATALOG = [
    // 9 Wan (x4 = 36)
    ...Array.from({ length: 9 }, (_, i) => ({
      suit: SUITS.WAN,
      val: i + 1,
      name: `${i + 1} Wan`,
      symbol: ['🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏'][i],
      badge: `${i + 1}萬`,
      cssClass: 'suit-wan',
    })),
    // 9 Sou (x4 = 36)
    ...Array.from({ length: 9 }, (_, i) => ({
      suit: SUITS.SOU,
      val: i + 1,
      name: `${i + 1} Sou`,
      symbol: ['🀐', '🀑', '🀒', '🀓', '🀔', '🀕', '🀖', '🀗', '🀘'][i],
      badge: `${i + 1}索`,
      cssClass: 'suit-sou',
    })),
    // 9 Pin (x4 = 36)
    ...Array.from({ length: 9 }, (_, i) => ({
      suit: SUITS.PIN,
      val: i + 1,
      name: `${i + 1} Pin`,
      symbol: ['🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠', '🀡'][i],
      badge: `${i + 1}筒`,
      cssClass: 'suit-pin',
    })),
    // 4 Winds (x4 = 16)
    { suit: SUITS.WIND, val: 'E', name: 'East Wind', symbol: '🀀', badge: '東', cssClass: 'suit-wind' },
    { suit: SUITS.WIND, val: 'S', name: 'South Wind', symbol: '🀁', badge: '南', cssClass: 'suit-wind' },
    { suit: SUITS.WIND, val: 'W', name: 'West Wind', symbol: '🀂', badge: '西', cssClass: 'suit-wind' },
    { suit: SUITS.WIND, val: 'N', name: 'North Wind', symbol: '🀃', badge: '北', cssClass: 'suit-wind' },
    // 3 Dragons (x4 = 12)
    { suit: SUITS.DRAGON, val: 'RED', name: 'Red Dragon', symbol: '🀄', badge: '中', cssClass: 'suit-dragon-red' },
    { suit: SUITS.DRAGON, val: 'GRN', name: 'Green Dragon', symbol: '🀅', badge: '發', cssClass: 'suit-dragon-green' },
    { suit: SUITS.DRAGON, val: 'WHT', name: 'White Dragon', symbol: '🀆', badge: '白', cssClass: 'suit-dragon-white' },
  ];

  // Flowers (1 each = 4)
  const FLOWERS = [
    { suit: SUITS.FLOWER, val: 'F1', name: 'Plum', symbol: '🀢', badge: '梅', cssClass: 'suit-flower' },
    { suit: SUITS.FLOWER, val: 'F2', name: 'Orchid', symbol: '🀣', badge: '蘭', cssClass: 'suit-flower' },
    { suit: SUITS.FLOWER, val: 'F3', name: 'Bamboo', symbol: '🀤', badge: '竹', cssClass: 'suit-flower' },
    { suit: SUITS.FLOWER, val: 'F4', name: 'Chrysanthemum', symbol: '🀥', badge: '菊', cssClass: 'suit-flower' },
  ];

  // Seasons (1 each = 4)
  const SEASONS = [
    { suit: SUITS.SEASON, val: 'S1', name: 'Spring', symbol: '🀦', badge: '春', cssClass: 'suit-season' },
    { suit: SUITS.SEASON, val: 'S2', name: 'Summer', symbol: '🀧', badge: '夏', cssClass: 'suit-season' },
    { suit: SUITS.SEASON, val: 'S3', name: 'Autumn', symbol: '🀨', badge: '秋', cssClass: 'suit-season' },
    { suit: SUITS.SEASON, val: 'S4', name: 'Winter', symbol: '🀩', badge: '冬', cssClass: 'suit-season' },
  ];

  // Total 144 tiles
  function createDeck() {
    const deck = [];
    // 34 standard tiles x 4 each = 136 tiles
    for (const t of TILE_CATALOG) {
      for (let i = 0; i < 4; i++) {
        deck.push({ ...t, matchId: `${t.suit}_${t.val}` });
      }
    }
    // 4 flowers (all match each other in solitaire)
    for (const f of FLOWERS) {
      deck.push({ ...f, matchId: 'FLOWER_WILDCARD' });
    }
    // 4 seasons (all match each other in solitaire)
    for (const s of SEASONS) {
      deck.push({ ...s, matchId: 'SEASON_WILDCARD' });
    }
    return deck;
  }

  // Generate 144-tile classic Turtle Layout
  function createTurtleLayout() {
    const positions = [];
    const add = (x, y, z) => positions.push({ x, y, z });

    // Layer 0: 86 tiles
    // Row 0 (y=0): 12 tiles (x=1..12)
    for (let x = 1; x <= 12; x++) add(x, 0, 0);
    // Row 1 (y=1): 8 tiles (x=3..10)
    for (let x = 3; x <= 10; x++) add(x, 1, 0);
    // Row 2 (y=2): 10 tiles (x=2..11)
    for (let x = 2; x <= 11; x++) add(x, 2, 0);
    // Row 3 (y=3): 12 tiles (x=1..12) + 2 ears
    add(-1, 3.5, 0);
    for (let x = 1; x <= 12; x++) add(x, 3, 0);
    add(13, 3.5, 0);
    // Row 4 (y=4): 12 tiles (x=1..12) + 2 outer ears
    add(-2, 3.5, 0);
    for (let x = 1; x <= 12; x++) add(x, 4, 0);
    add(14, 3.5, 0);
    // Row 5 (y=5): 10 tiles (x=2..11)
    for (let x = 2; x <= 11; x++) add(x, 5, 0);
    // Row 6 (y=6): 8 tiles (x=3..10)
    for (let x = 3; x <= 10; x++) add(x, 6, 0);
    // Row 7 (y=7): 12 tiles (x=1..12)
    for (let x = 1; x <= 12; x++) add(x, 7, 0);

    // Layer 1: 36 tiles (6x6 center at x=4..9, y=1..6)
    for (let x = 4; x <= 9; x++) {
      for (let y = 1; y <= 6; y++) {
        add(x, y, 1);
      }
    }

    // Layer 2: 16 tiles (4x4 at x=5..8, y=2..5)
    for (let x = 5; x <= 8; x++) {
      for (let y = 2; y <= 5; y++) {
        add(x, y, 2);
      }
    }

    // Layer 3: 4 tiles (2x2 at x=6..7, y=3..4)
    for (let x = 6; x <= 7; x++) {
      for (let y = 3; y <= 4; y++) {
        add(x, y, 3);
      }
    }

    // Layer 4: 2 peak tiles
    add(6.5, 3.5, 4);
    add(6.5, 3.5, 5);

    // Total must be exactly 144
    return positions.slice(0, 144);
  }

  // --- Procedural Sound System (Web Audio API) ---
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.muted = false;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.muted = !this.muted;
      return this.muted;
    }

    playClick() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }

    playMatch() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.06);
        osc.stop(this.ctx.currentTime + idx * 0.06 + 0.35);
      });
    }

    playError() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    }

    playWin() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const arpeggio = [523.25, 659.25, 783.99, 1046.5];
      arpeggio.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.22, this.ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.12);
        osc.stop(this.ctx.currentTime + idx * 0.12 + 0.6);
      });
    }
  }

  // --- Game State & Engine ---
  class MahjongGame {
    constructor() {
      this.tiles = [];
      this.selectedTile = null;
      this.history = [];
      this.score = 0;
      this.startTime = Date.now();
      this.timerInterval = null;
      this.elapsedSeconds = 0;
      this.isGameOver = false;

      this.sound = new SoundManager();

      this.boardEl = document.getElementById('mahjong-board');
      this.viewportEl = document.getElementById('board-viewport');
      this.scoreEl = document.getElementById('score-counter');
      this.timerEl = document.getElementById('timer-counter');
      this.tilesLeftEl = document.getElementById('tiles-left-counter');
      this.undoBtn = document.getElementById('btn-undo');
      this.hintBtn = document.getElementById('btn-hint');
      this.shuffleBtn = document.getElementById('btn-shuffle');
      this.soundBtn = document.getElementById('btn-sound-toggle');
      this.soundIcon = document.getElementById('sound-icon');
      this.howToPlayBtn = document.getElementById('btn-how-to-play');
      this.toastEl = document.getElementById('toast');

      this.initDOM();
      this.startNewGame();
    }

    initDOM() {
      // Audio toggle
      if (this.soundBtn) {
        this.soundBtn.addEventListener('click', () => {
          const muted = this.sound.toggle();
          if (this.soundIcon) this.soundIcon.textContent = muted ? '🔇' : '🔊';
        });
      }

      // Undo
      if (this.undoBtn) {
        this.undoBtn.addEventListener('click', () => this.undo());
      }

      // Shuffle
      if (this.shuffleBtn) {
        this.shuffleBtn.addEventListener('click', () => this.shuffleRemaining());
      }

      // Hint / Rewarded Ad modal
      if (this.hintBtn) {
        this.hintBtn.addEventListener('click', () => this.openHintModal());
      }

      // Menu buttons
      const btnMenu = document.getElementById('btn-menu');
      if (btnMenu) {
        btnMenu.addEventListener('click', () => {
          this.sound.playClick();
          const menuModal = document.getElementById('modal-menu');
          if (menuModal) menuModal.classList.add('active');
        });
      }

      const btnStartGame = document.getElementById('btn-start-game');
      if (btnStartGame) {
        btnStartGame.addEventListener('click', () => {
          this.sound.playClick();
          const menuModal = document.getElementById('modal-menu');
          if (menuModal) menuModal.classList.remove('active');
          this.startNewGame();
        });
      }

      const btnMenuTut = document.getElementById('btn-menu-tutorial');
      if (btnMenuTut) {
        btnMenuTut.addEventListener('click', () => {
          this.sound.playClick();
          const tut = document.getElementById('modal-tutorial');
          if (tut) tut.classList.add('active');
        });
      }

      const btnMenuSound = document.getElementById('btn-menu-sound');
      if (btnMenuSound) {
        btnMenuSound.addEventListener('click', () => {
          const muted = this.sound.toggle();
          const soundIcon = document.getElementById('sound-icon');
          if (soundIcon) soundIcon.textContent = muted ? '🔇' : '🔊';
          const menuSoundIcon = document.getElementById('menu-sound-icon');
          if (menuSoundIcon) menuSoundIcon.textContent = muted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
        });
      }

      // How to Play
      if (this.howToPlayBtn) {
        this.howToPlayBtn.addEventListener('click', () => {
          const tut = document.getElementById('modal-tutorial');
          if (tut) tut.classList.add('active');
        });
      }
      const closeTutBtn = document.getElementById('btn-close-tutorial');
      if (closeTutBtn) {
        closeTutBtn.addEventListener('click', () => {
          const tut = document.getElementById('modal-tutorial');
          if (tut) tut.classList.remove('active');
        });
      }

      // Restart button
      const restartBtn = document.getElementById('btn-restart');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          this.sound.playClick();
          this.startNewGame();
          this.showToast('Game restarted!');
        });
      }

      // Window resize observer to auto-fit board perfectly
      if (this.viewportEl) {
        const resizeObserver = new ResizeObserver(() => this.scaleBoard());
        resizeObserver.observe(this.viewportEl);
      }
      window.addEventListener('resize', () => this.scaleBoard());

      // Rewarded Ad Modal handlers
      const skipAdBtn = document.getElementById('btn-skip-ad');
      if (skipAdBtn) skipAdBtn.addEventListener('click', () => this.closeAdModal(false));
      const claimHintBtn = document.getElementById('btn-claim-hint');
      if (claimHintBtn) claimHintBtn.addEventListener('click', () => this.closeAdModal(true));

      // Standalone Win Modal replay
      const replayBtn = document.getElementById('btn-replay');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          const winModal = document.getElementById('modal-win');
          if (winModal) winModal.classList.remove('active');
          this.startNewGame();
        });
      }
    }

    startNewGame() {
      clearInterval(this.timerInterval);
      this.isGameOver = false;
      this.selectedTile = null;
      this.history = [];
      this.score = 0;
      this.elapsedSeconds = 0;
      this.startTime = Date.now();

      this.updateScore(0);
      this.timerEl.textContent = '00:00';
      this.timerInterval = setInterval(() => {
        if (!this.isGameOver) {
          this.elapsedSeconds++;
          const m = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
          const s = String(this.elapsedSeconds % 60).padStart(2, '0');
          this.timerEl.textContent = `${m}:${s}`;
        }
      }, 1000);

      // Prepare deck and shuffle
      const deck = createDeck();
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      const layout = createTurtleLayout();
      this.tiles = layout.map((pos, id) => ({
        id,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        tileData: deck[id],
        removed: false,
        element: null,
      }));

      this.renderBoard();
      this.updateFreeStates();
      this.scaleBoard();
    }

    // Geometry overlap check: tile dimensions are 1x1 in grid space
    // A tile at (x,y,z) occupies [x - 0.49, x + 0.99] x [y - 0.49, y + 0.99]
    overlaps(t1, t2) {
      return (
        Math.abs(t1.x - t2.x) < 0.99 &&
        Math.abs(t1.y - t2.y) < 0.99
      );
    }

    isFree(tile) {
      if (tile.removed) return false;

      // 1. Top check: Any tile at higher layer overlapping this tile?
      const blockedAbove = this.tiles.some(
        (other) => !other.removed && other.z > tile.z && this.overlaps(tile, other)
      );
      if (blockedAbove) return false;

      // 2. Lateral check: A neighbor on the same tier touching left or touching right
      // A tile touching left is at x ~ tile.x - 1 and |y - tile.y| < 0.9
      const blockedLeft = this.tiles.some(
        (other) =>
          !other.removed &&
          other.z === tile.z &&
          other.x < tile.x &&
          tile.x - other.x <= 1.05 &&
          Math.abs(other.y - tile.y) < 0.8
      );

      const blockedRight = this.tiles.some(
        (other) =>
          !other.removed &&
          other.z === tile.z &&
          other.x > tile.x &&
          other.x - tile.x <= 1.05 &&
          Math.abs(other.y - tile.y) < 0.8
      );

      return !blockedLeft || !blockedRight;
    }

    updateFreeStates() {
      let activeCount = 0;
      this.tiles.forEach((t) => {
        if (!t.removed) {
          activeCount++;
          const free = this.isFree(t);
          t.element.classList.toggle('free', free);
          t.element.classList.toggle('blocked', !free);
        }
      });
      this.tilesLeftEl.textContent = activeCount;
      this.undoBtn.disabled = this.history.length === 0;

      // Auto-check for remaining moves
      if (activeCount > 0) {
        const moves = this.getAvailablePairs();
        if (moves.length === 0) {
          this.showToast('No more pairs! Shuffling tiles...');
          setTimeout(() => this.shuffleRemaining(), 1200);
        }
      }
    }

    renderBoard() {
      this.boardEl.innerHTML = '';

      // Compute board dimension bounds
      const minX = -2;
      const maxX = 14;
      const minY = 0;
      const maxY = 7;

      const tileW = 54;
      const tileH = 74;
      const stepX = tileW;
      const stepY = tileH * 0.92;

      this.boardEl.style.width = `${(maxX - minX + 2) * stepX}px`;
      this.boardEl.style.height = `${(maxY - minY + 2) * stepY}px`;

      this.tiles.forEach((t) => {
        const el = document.createElement('div');
        el.className = 'tile';
        el.dataset.id = t.id;

        // Position: offset coordinates so negative indices sit nicely inside container
        const left = (t.x - minX) * stepX + t.z * 5;
        const top = (t.y - minY) * stepY - t.z * 5;
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
        el.style.zIndex = `${t.z * 20 + Math.floor(t.y * 2)}`;

        // Tile inner contents
        el.innerHTML = `
          <span class="tile-symbol ${t.tileData.cssClass}">${t.tileData.symbol}</span>
          <span class="tile-badge ${t.tileData.cssClass}">${t.tileData.badge}</span>
        `;

        el.addEventListener('click', () => this.handleTileClick(t));
        t.element = el;
        this.boardEl.appendChild(el);
      });
    }

    scaleBoard() {
      if (!this.viewportEl || !this.boardEl) return;
      const vRect = this.viewportEl.getBoundingClientRect();
      const bW = parseFloat(this.boardEl.style.width) || 900;
      const bH = parseFloat(this.boardEl.style.height) || 600;

      if (vRect.width <= 0 || vRect.height <= 0) {
        this.boardEl.style.transform = 'scale(0.85)';
        return;
      }

      const scaleX = (vRect.width - 16) / bW;
      const scaleY = (vRect.height - 16) / bH;
      const scale = Math.min(scaleX, scaleY, 1.25);
      this.boardEl.style.transform = `scale(${Math.max(0.2, scale).toFixed(3)})`;
    }

    handleTileClick(tile) {
      if (tile.removed || !this.isFree(tile)) {
        this.sound.playError();
        return;
      }

      this.clearHints();

      // If clicking already selected tile, deselect
      if (this.selectedTile === tile) {
        tile.element.classList.remove('selected');
        this.selectedTile = null;
        this.sound.playClick();
        return;
      }

      // If no tile selected yet, select this one
      if (!this.selectedTile) {
        this.selectedTile = tile;
        tile.element.classList.add('selected');
        this.sound.playClick();
        return;
      }

      // Second tile selected: verify match!
      const first = this.selectedTile;
      if (this.isMatch(first, tile)) {
        // MATCH SUCCESS!
        first.element.classList.remove('selected');
        this.selectedTile = null;

        first.removed = true;
        tile.removed = true;

        first.element.classList.add('matched');
        tile.element.classList.add('matched');

        this.history.push([first, tile]);
        this.sound.playMatch();
        this.updateScore(this.score + 100);

        setTimeout(() => {
          first.element.style.display = 'none';
          tile.element.style.display = 'none';
          this.updateFreeStates();
          this.checkWinCondition();
        }, 320);
      } else {
        // Not a match: switch selection
        first.element.classList.remove('selected');
        this.selectedTile = tile;
        tile.element.classList.add('selected');
        this.sound.playClick();
      }
    }

    isMatch(t1, t2) {
      return t1.tileData.matchId === t2.tileData.matchId;
    }

    undo() {
      if (this.history.length === 0) return;
      const [t1, t2] = this.history.pop();
      t1.removed = false;
      t2.removed = false;

      t1.element.style.display = '';
      t2.element.style.display = '';
      t1.element.classList.remove('matched', 'selected');
      t2.element.classList.remove('matched', 'selected');

      this.selectedTile = null;
      this.updateScore(Math.max(0, this.score - 100));
      this.sound.playClick();
      this.updateFreeStates();
    }

    getAvailablePairs() {
      const freeTiles = this.tiles.filter((t) => this.isFree(t));
      const pairs = [];
      for (let i = 0; i < freeTiles.length; i++) {
        for (let j = i + 1; j < freeTiles.length; j++) {
          if (this.isMatch(freeTiles[i], freeTiles[j])) {
            pairs.push([freeTiles[i], freeTiles[j]]);
          }
        }
      }
      return pairs;
    }

    shuffleRemaining() {
      const remaining = this.tiles.filter((t) => !t.removed);
      if (remaining.length <= 1) return;

      const symbols = remaining.map((t) => t.tileData);
      // Fisher-Yates shuffle
      for (let i = symbols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
      }

      remaining.forEach((t, idx) => {
        t.tileData = symbols[idx];
        const symEl = t.element.querySelector('.tile-symbol');
        if (symEl) {
          symEl.className = `tile-symbol ${t.tileData.cssClass}`;
          symEl.textContent = t.tileData.symbol;
        }
        const badgeEl = t.element.querySelector('.tile-badge');
        if (badgeEl) {
          badgeEl.className = `tile-badge ${t.tileData.cssClass}`;
          badgeEl.textContent = t.tileData.badge;
        }
      });

      if (this.selectedTile) {
        this.selectedTile.element.classList.remove('selected');
        this.selectedTile = null;
      }

      this.sound.playClick();
      this.updateFreeStates();
      this.showToast('Tiles shuffled!');
    }

    clearHints() {
      this.tiles.forEach((t) => {
        if (t.element) t.element.classList.remove('hinted');
      });
    }

    openHintModal() {
      const adModal = document.getElementById('modal-ad');
      const progressFill = document.getElementById('ad-progress-fill');
      const claimBtn = document.getElementById('btn-claim-hint');
      const timerSpan = document.getElementById('ad-timer');

      adModal.classList.add('active');
      claimBtn.disabled = true;
      progressFill.style.width = '0%';

      let timeLeft = 5;
      timerSpan.textContent = `Reward unlocked in ${timeLeft}s...`;

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const pct = Math.min(100, (elapsed / 5) * 100);
        progressFill.style.width = `${pct}%`;

        const rem = Math.max(0, Math.ceil(5 - elapsed));
        if (rem > 0) {
          timerSpan.textContent = `Reward unlocked in ${rem}s...`;
        } else {
          clearInterval(interval);
          timerSpan.textContent = 'Reward ready to claim!';
          claimBtn.disabled = false;
        }
      }, 100);

      this.currentAdInterval = interval;
    }

    closeAdModal(claimReward) {
      clearInterval(this.currentAdInterval);
      document.getElementById('modal-ad').classList.remove('active');

      if (claimReward) {
        this.revealHint();
      }
    }

    revealHint() {
      const pairs = this.getAvailablePairs();
      if (pairs.length > 0) {
        const [t1, t2] = pairs[0];
        t1.element.classList.add('hinted');
        t2.element.classList.add('hinted');
        this.showToast('Hint highlighted!');
        this.sound.playClick();
      } else {
        this.showToast('No pairs available! Reshuffling...');
        this.shuffleRemaining();
      }
    }

    updateScore(val) {
      this.score = val;
      this.scoreEl.textContent = this.score;
    }

    showToast(msg) {
      this.toastEl.textContent = msg;
      this.toastEl.classList.add('show');
      setTimeout(() => this.toastEl.classList.remove('show'), 2200);
    }

    checkWinCondition() {
      if (!this.tiles || this.tiles.length === 0) return;
      const remaining = this.tiles.filter((t) => !t.removed).length;
      if (remaining === 0) {
        this.isGameOver = true;
        clearInterval(this.timerInterval);
        this.sound.playWin();

        const timeInSeconds = Math.max(1, this.elapsedSeconds);

        // Required official platform integration!
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'win', time: timeInSeconds }, '*');
        }

        // Show standalone win card
        const winTimeEl = document.getElementById('win-time');
        if (winTimeEl) winTimeEl.textContent = `${timeInSeconds}s`;
        const winScoreEl = document.getElementById('win-score');
        if (winScoreEl) winScoreEl.textContent = this.score;
        document.getElementById('modal-win').classList.add('active');
      }
    }
  }

  // Launch on DOM ready
  function initGame() {
    new MahjongGame();
  }
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }
})();
