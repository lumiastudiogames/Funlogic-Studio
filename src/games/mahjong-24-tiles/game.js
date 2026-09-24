/**
 * Mahjong 24 Tiles - Quick Play
 * Standalone Vanilla JS Game
 */

(function () {
  'use strict';

  const TOTAL_PAIRS = 12; // 24 tiles total
  const RUSH_TIME = 40; // 40 seconds rush mode

  const TILE_CATALOG = [
    { type: 'red', name: 'Red Dragon', symbol: '🀄', badge: '中', css: 'suit-dragon' },
    { type: 'green', name: 'Green Dragon', symbol: '🀅', badge: '發', css: 'suit-sou' },
    { type: 'east', name: 'East Wind', symbol: '🀀', badge: '東', css: 'suit-wind' },
    { type: 'south', name: 'South Wind', symbol: '🀁', badge: '南', css: 'suit-wind' },
    { type: 'w1', name: '1 Wan', symbol: '🀇', badge: '1萬', css: 'suit-wan' },
    { type: 'w8', name: '8 Wan', symbol: '🀎', badge: '8萬', css: 'suit-wan' },
    { type: 's1', name: '1 Sou', symbol: '🀐', badge: '1索', css: 'suit-sou' },
    { type: 's9', name: '9 Sou', symbol: '🀘', badge: '9索', css: 'suit-sou' },
    { type: 'p1', name: '1 Pin', symbol: '🀙', badge: '1筒', css: 'suit-pin' },
    { type: 'p5', name: '5 Pin', symbol: '🀝', badge: '5筒', css: 'suit-pin' },
    { type: 'p9', name: '9 Pin', symbol: '🀡', badge: '9筒', css: 'suit-pin' },
    { type: 'plum', name: 'Plum Flower', symbol: '🀢', badge: '梅', css: 'suit-dragon' },
  ]; // Exactly 12 distinct high-contrast types, each appears 2 times = 24 tiles!

  // Procedural Sound Engine
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
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
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
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
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
      [587.33, 739.99, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.05);
        osc.stop(this.ctx.currentTime + idx * 0.05 + 0.35);
      });
    }
    playWin() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.22, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.5);
      });
    }
  }

  class QuickMahjongGame {
    constructor() {
      this.tiles = [];
      this.selectedTile = null;
      this.history = [];
      this.score = 0;
      this.elapsedSeconds = 0;
      this.timeRemaining = RUSH_TIME;
      this.timerInterval = null;
      this.isGameOver = false;

      this.sound = new SoundManager();

      this.boardEl = document.getElementById('quick-board');
      this.viewportEl = document.getElementById('board-viewport');
      this.scoreEl = document.getElementById('score-counter');
      this.timerEl = document.getElementById('timer-counter');
      this.pairsLeftEl = document.getElementById('pairs-left-counter');
      this.bestTimeEl = document.getElementById('best-time-counter');
      this.rushBarFill = document.getElementById('rush-bar-fill');
      this.undoBtn = document.getElementById('btn-undo');

      this.initStorage();
      this.initDOM();
      this.startNewGame();
    }

    initStorage() {
      const best = localStorage.getItem('mahjong24_best_time');
      if (this.bestTimeEl) {
        this.bestTimeEl.textContent = best ? `${best}s` : '--';
      }
    }

    initDOM() {
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

      const soundBtn = document.getElementById('btn-sound-toggle');
      if (soundBtn) {
        soundBtn.addEventListener('click', () => {
          const muted = this.sound.toggle();
          const soundIcon = document.getElementById('sound-icon');
          if (soundIcon) soundIcon.textContent = muted ? '🔇' : '🔊';
        });
      }

      // Instant Replay Button in Header
      const replayBtn = document.getElementById('btn-replay-now');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          this.sound.playClick();
          this.startNewGame();
          this.showToast('Game restarted!');
        });
      }

      if (this.undoBtn) {
        this.undoBtn.addEventListener('click', () => this.undo());
      }

      const hintBtn = document.getElementById('btn-hint');
      if (hintBtn) {
        hintBtn.addEventListener('click', () => this.revealHint());
      }

      const howToPlayBtn = document.getElementById('btn-how-to-play');
      if (howToPlayBtn) {
        howToPlayBtn.addEventListener('click', () => {
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

      const replayWinBtn = document.getElementById('btn-replay-win');
      if (replayWinBtn) {
        replayWinBtn.addEventListener('click', () => {
          const winModal = document.getElementById('modal-win');
          if (winModal) winModal.classList.remove('active');
          this.startNewGame();
        });
      }

      if (this.viewportEl) {
        const resizeObserver = new ResizeObserver(() => this.scaleBoard());
        resizeObserver.observe(this.viewportEl);
      }
      window.addEventListener('resize', () => this.scaleBoard());
    }

    startNewGame() {
      clearInterval(this.timerInterval);
      this.isGameOver = false;
      this.selectedTile = null;
      this.history = [];
      this.score = 0;
      this.elapsedSeconds = 0;
      this.timeRemaining = RUSH_TIME;

      this.updateScore(0);
      this.pairsLeftEl.textContent = TOTAL_PAIRS;
      this.timerEl.textContent = '00s';
      this.rushBarFill.style.width = '100%';
      this.undoBtn.disabled = true;

      this.timerInterval = setInterval(() => {
        if (!this.isGameOver) {
          this.elapsedSeconds++;
          this.timeRemaining = Math.max(0, RUSH_TIME - this.elapsedSeconds);
          this.timerEl.textContent = `${this.elapsedSeconds}s`;

          const pct = Math.max(0, (this.timeRemaining / RUSH_TIME) * 100);
          this.rushBarFill.style.width = `${pct}%`;

          if (this.elapsedSeconds === RUSH_TIME) {
            this.showToast('Rush time finished! Keep playing casually.');
          }
        }
      }, 1000);

      // Create 12 pairs = 24 tiles
      const deck = [];
      TILE_CATALOG.forEach((t) => {
        deck.push({ ...t }, { ...t });
      });

      // Fisher-Yates shuffle
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      // 24 tile positions:
      // Layer 0: 3 rows of 6 tiles = 18 tiles
      // Layer 1: 2 rows of 3 tiles = 6 tiles placed in center
      const positions = [];
      const tileW = 90;
      const tileH = 120;

      // Base layer: 3 rows of 6
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 6; c++) {
          positions.push({
            x: 20 + c * tileW,
            y: 30 + r * (tileH * 0.95),
            z: 0,
            gridX: c,
            gridY: r,
          });
        }
      }

      // Top layer: 2 rows of 3 tiles placed on columns 1.5, 2.5, 3.5
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 3; c++) {
          positions.push({
            x: 20 + (c + 1.5) * tileW,
            y: 30 + (r + 0.5) * (tileH * 0.95),
            z: 1,
            gridX: c + 1.5,
            gridY: r + 0.5,
          });
        }
      }

      this.tiles = positions.map((pos, id) => ({
        id,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        data: deck[id],
        removed: false,
        element: null,
      }));

      this.renderBoard();
      this.updateFreeStates();
      this.scaleBoard();
    }

    scaleBoard() {
      if (!this.viewportEl || !this.boardEl) return;
      const vRect = this.viewportEl.getBoundingClientRect();
      if (vRect.width <= 0 || vRect.height <= 0) {
        this.boardEl.style.transform = 'scale(0.85)';
        return;
      }
      const scaleX = (vRect.width - 16) / 600;
      const scaleY = (vRect.height - 16) / 440;
      const scale = Math.min(scaleX, scaleY, 1.25);
      this.boardEl.style.transform = `scale(${Math.max(0.25, scale).toFixed(3)})`;
    }

    renderBoard() {
      this.boardEl.innerHTML = '';
      this.tiles.forEach((t) => {
        const el = document.createElement('div');
        el.className = 'big-tile';
        el.dataset.id = t.id;
        el.style.left = `${t.x}px`;
        el.style.top = `${t.y}px`;
        el.style.zIndex = `${t.z * 20 + Math.floor(t.y / 20)}`;

        el.innerHTML = `
          <span class="tile-symbol ${t.data.css}">${t.data.symbol}</span>
          <span class="tile-badge ${t.data.css}">${t.data.badge}</span>
        `;

        el.addEventListener('click', () => this.handleTileClick(t));
        t.element = el;
        this.boardEl.appendChild(el);
      });
    }

    isFree(tile) {
      if (tile.removed) return false;

      // 1. Top check
      const blockedAbove = this.tiles.some(
        (other) =>
          !other.removed &&
          other.z > tile.z &&
          Math.abs(other.x - tile.x) < 80 &&
          Math.abs(other.y - tile.y) < 100
      );
      if (blockedAbove) return false;

      // 2. Lateral check on same tier
      const blockedLeft = this.tiles.some(
        (other) =>
          !other.removed &&
          other.z === tile.z &&
          other.x < tile.x &&
          tile.x - other.x <= 95 &&
          Math.abs(other.y - tile.y) < 60
      );

      const blockedRight = this.tiles.some(
        (other) =>
          !other.removed &&
          other.z === tile.z &&
          other.x > tile.x &&
          other.x - tile.x <= 95 &&
          Math.abs(other.y - tile.y) < 60
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
      this.pairsLeftEl.textContent = activeCount / 2;
      this.undoBtn.disabled = this.history.length === 0;

      if (activeCount > 0 && this.getAvailablePairs().length === 0) {
        this.showToast('No open moves! Auto-shuffling...');
        setTimeout(() => this.shuffleRemaining(), 1000);
      }
    }

    handleTileClick(tile) {
      if (tile.removed || !this.isFree(tile) || this.isGameOver) return;

      this.clearHints();

      if (this.selectedTile === tile) {
        tile.element.classList.remove('selected');
        this.selectedTile = null;
        this.sound.playClick();
        return;
      }

      if (!this.selectedTile) {
        this.selectedTile = tile;
        tile.element.classList.add('selected');
        this.sound.playClick();
        return;
      }

      const first = this.selectedTile;
      if (first.data.type === tile.data.type) {
        // MATCH!
        first.element.classList.remove('selected');
        this.selectedTile = null;

        first.removed = true;
        tile.removed = true;

        first.element.classList.add('matched');
        tile.element.classList.add('matched');

        this.history.push([first, tile]);
        this.sound.playMatch();

        const speedBonus = this.timeRemaining > 0 ? 50 : 0;
        this.updateScore(this.score + 100 + speedBonus);

        setTimeout(() => {
          first.element.style.display = 'none';
          tile.element.style.display = 'none';
          this.updateFreeStates();
          this.checkWinCondition();
        }, 300);
      } else {
        first.element.classList.remove('selected');
        this.selectedTile = tile;
        tile.element.classList.add('selected');
        this.sound.playClick();
      }
    }

    undo() {
      if (this.history.length === 0 || this.isGameOver) return;
      const [t1, t2] = this.history.pop();
      t1.removed = false;
      t2.removed = false;

      t1.element.style.display = '';
      t2.element.style.display = '';
      t1.element.classList.remove('matched', 'selected');
      t2.element.classList.remove('matched', 'selected');

      this.selectedTile = null;
      this.sound.playClick();
      this.updateFreeStates();
    }

    getAvailablePairs() {
      const free = this.tiles.filter((t) => this.isFree(t));
      const pairs = [];
      for (let i = 0; i < free.length; i++) {
        for (let j = i + 1; j < free.length; j++) {
          if (free[i].data.type === free[j].data.type) {
            pairs.push([free[i], free[j]]);
          }
        }
      }
      return pairs;
    }

    shuffleRemaining() {
      const active = this.tiles.filter((t) => !t.removed);
      if (active.length <= 1) return;

      const symbols = active.map((t) => t.data);
      for (let i = symbols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
      }

      active.forEach((t, idx) => {
        t.data = symbols[idx];
        const symEl = t.element.querySelector('.tile-symbol');
        if (symEl) {
          symEl.className = `tile-symbol ${t.data.css}`;
          symEl.textContent = t.data.symbol;
        }
        const badgeEl = t.element.querySelector('.tile-badge');
        if (badgeEl) {
          badgeEl.className = `tile-badge ${t.data.css}`;
          badgeEl.textContent = t.data.badge;
        }
      });

      if (this.selectedTile) {
        this.selectedTile.element.classList.remove('selected');
        this.selectedTile = null;
      }

      this.sound.playClick();
      this.updateFreeStates();
      this.showToast('Tiles reshuffled!');
    }

    revealHint() {
      const pairs = this.getAvailablePairs();
      if (pairs.length > 0) {
        const [t1, t2] = pairs[0];
        if (t1.element) t1.element.classList.add('hinted');
        if (t2.element) t2.element.classList.add('hinted');
        this.sound.playClick();
        this.showToast('Par destacado!');
      } else {
        this.shuffleRemaining();
      }
    }

    clearHints() {
      this.tiles.forEach((t) => {
        if (t.element) t.element.classList.remove('hinted');
      });
    }

    updateScore(val) {
      this.score = val;
      if (this.scoreEl) {
        this.scoreEl.textContent = this.score;
      }
    }

    showToast(msg) {
      const toastEl = document.getElementById('toast');
      if (toastEl) {
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        setTimeout(() => toastEl.classList.remove('show'), 2200);
      }
    }

    checkWinCondition() {
      if (!this.tiles || this.tiles.length === 0) return;
      const remaining = this.tiles.filter((t) => !t.removed).length;
      if (remaining === 0) {
        this.isGameOver = true;
        clearInterval(this.timerInterval);
        this.sound.playWin();

        const timeInSeconds = Math.max(1, this.elapsedSeconds);

        // Update local records
        const curBest = localStorage.getItem('mahjong24_best_time');
        let isNewRecord = false;
        if (!curBest || timeInSeconds < parseInt(curBest, 10)) {
          localStorage.setItem('mahjong24_best_time', String(timeInSeconds));
          if (this.bestTimeEl) {
            this.bestTimeEl.textContent = `${timeInSeconds}s`;
          }
          isNewRecord = true;
        }

        // Platform integration postMessage
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'win', time: timeInSeconds }, '*');
        }

        const winTimeEl = document.getElementById('win-time');
        if (winTimeEl) winTimeEl.textContent = `${timeInSeconds}s`;
        const winScoreEl = document.getElementById('win-score');
        if (winScoreEl) winScoreEl.textContent = this.score;
        const winNoticeEl = document.getElementById('win-record-notice');
        if (winNoticeEl) {
          winNoticeEl.textContent = isNewRecord
            ? '🎉 NEW PERSONAL BEST! 🎉'
            : `Best Time: ${localStorage.getItem('mahjong24_best_time')}s`;
        }

        const winModal = document.getElementById('modal-win');
        if (winModal) winModal.classList.add('active');
      }
    }
  }

  function initGame() {
    new QuickMahjongGame();
  }
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }
})();
