/**
 * Mahjong Triple - Match 3 (7-Slot Tray)
 * Standalone Vanilla JS Game
 */

(function () {
  'use strict';

  const TRAY_CAPACITY = 7;
  const TOTAL_TRIOS = 12; // 12 trios = 36 tiles

  const SYMBOLS = [
    { type: 'w1', symbol: '🀇', badge: '1萬', css: 'suit-wan' },
    { type: 'w5', symbol: '🀋', badge: '5萬', css: 'suit-wan' },
    { type: 'w9', symbol: '🀏', badge: '9萬', css: 'suit-wan' },
    { type: 's1', symbol: '🀐', badge: '1索', css: 'suit-sou' },
    { type: 's4', symbol: '🀓', badge: '4索', css: 'suit-sou' },
    { type: 's8', symbol: '🀗', badge: '8索', css: 'suit-sou' },
    { type: 'p1', symbol: '🀙', badge: '1筒', css: 'suit-pin' },
    { type: 'p5', symbol: '🀝', badge: '5筒', css: 'suit-pin' },
    { type: 'p9', symbol: '🀡', badge: '9筒', css: 'suit-pin' },
    { type: 'red', symbol: '🀄', badge: '中', css: 'suit-dragon' },
    { type: 'east', symbol: '🀀', badge: '東', css: 'suit-wind' },
    { type: 'flower', symbol: '🀢', badge: '梅', css: 'suit-dragon' },
  ]; // 12 distinct types x 3 copies each = 36 tiles

  // Procedural Sound
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
    playCollect() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    }
    playTrio() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.04);
        osc.stop(this.ctx.currentTime + idx * 0.04 + 0.35);
      });
    }
    playLoss() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    }
    playWin() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      [440, 554.37, 659.25, 880, 1108.7].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.22, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.5);
      });
    }
  }

  class TripleGame {
    constructor() {
      this.tiles = [];
      this.tray = []; // Array of collected tiles currently in the 7-slot bar
      this.score = 0;
      this.elapsedSeconds = 0;
      this.timerInterval = null;
      this.isGameOver = false;

      this.sound = new SoundManager();

      this.boardEl = document.getElementById('triple-board');
      this.viewportEl = document.getElementById('board-viewport');
      this.traySlotsEl = document.getElementById('tray-slots');
      this.scoreEl = document.getElementById('score-counter');
      this.timerEl = document.getElementById('timer-counter');
      this.tilesLeftEl = document.getElementById('tiles-left-counter');
      this.undoBtn = document.getElementById('btn-undo');

      this.initDOM();
      this.startNewGame();
    }

    initDOM() {
      document.getElementById('btn-sound-toggle').addEventListener('click', () => {
        const muted = this.sound.toggle();
        document.getElementById('sound-icon').textContent = muted ? '🔇' : '🔊';
      });

      this.undoBtn.addEventListener('click', () => this.undoLastTile());
      document.getElementById('btn-hint').addEventListener('click', () => this.openHintModal());
      document.getElementById('btn-shuffle').addEventListener('click', () => this.shuffleBoard());

      document.getElementById('btn-how-to-play').addEventListener('click', () => {
        document.getElementById('modal-tutorial').classList.add('active');
      });
      document.getElementById('btn-close-tutorial').addEventListener('click', () => {
        document.getElementById('modal-tutorial').classList.remove('active');
      });

      document.getElementById('btn-skip-ad').addEventListener('click', () => this.closeAdModal(false));
      document.getElementById('btn-claim-hint').addEventListener('click', () => this.closeAdModal(true));

      document.getElementById('btn-replay').addEventListener('click', () => {
        document.getElementById('modal-win').classList.remove('active');
        this.startNewGame();
      });

      document.getElementById('btn-retry-loss').addEventListener('click', () => {
        document.getElementById('modal-loss').classList.remove('active');
        this.startNewGame();
      });

      const resizeObserver = new ResizeObserver(() => this.scaleBoard());
      resizeObserver.observe(this.viewportEl);
    }

    startNewGame() {
      clearInterval(this.timerInterval);
      this.isGameOver = false;
      this.tray = [];
      this.score = 0;
      this.elapsedSeconds = 0;

      this.updateScore(0);
      this.timerEl.textContent = '00:00';
      this.undoBtn.disabled = true;

      this.timerInterval = setInterval(() => {
        if (!this.isGameOver) {
          this.elapsedSeconds++;
          const m = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
          const s = String(this.elapsedSeconds % 60).padStart(2, '0');
          this.timerEl.textContent = `${m}:${s}`;
        }
      }, 1000);

      // 12 trios = 36 tiles
      const deck = [];
      SYMBOLS.forEach((sym) => {
        for (let i = 0; i < 3; i++) {
          deck.push({ ...sym });
        }
      });

      // Shuffle
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      // 36 positions across 3 layers
      const positions = [];
      // Layer 0: 20 tiles in 4x5 grid
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 5; c++) {
          positions.push({ x: 70 + c * 85, y: 30 + r * 95, z: 0 });
        }
      }
      // Layer 1: 12 tiles in 3x4 grid offset
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 4; c++) {
          positions.push({ x: 112 + c * 85, y: 77 + r * 95, z: 1 });
        }
      }
      // Layer 2: 4 tiles in 2x2 center pyramid top
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
          positions.push({ x: 197 + c * 85, y: 125 + r * 95, z: 2 });
        }
      }

      this.tiles = positions.map((p, idx) => ({
        id: idx,
        x: p.x,
        y: p.y,
        z: p.z,
        data: deck[idx],
        collected: false,
        element: null,
      }));

      this.renderBoard();
      this.renderTray();
      this.updateBoardState();
      this.scaleBoard();
    }

    scaleBoard() {
      const vRect = this.viewportEl.getBoundingClientRect();
      const scaleX = (vRect.width - 20) / 600;
      const scaleY = (vRect.height - 20) / 440;
      const scale = Math.min(scaleX, scaleY, 1.15);
      this.boardEl.style.transform = `scale(${scale})`;
    }

    renderBoard() {
      this.boardEl.innerHTML = '';
      this.tiles.forEach((t) => {
        const el = document.createElement('div');
        el.className = 'triple-tile';
        el.dataset.id = t.id;
        el.style.left = `${t.x}px`;
        el.style.top = `${t.y}px`;
        el.style.zIndex = `${t.z * 10}`;

        el.innerHTML = `
          <span class="tile-symbol ${t.data.css}">${t.data.symbol}</span>
          <span class="tile-badge ${t.data.css}">${t.data.badge}</span>
        `;

        el.addEventListener('click', () => this.handleTileClick(t));
        t.element = el;
        this.boardEl.appendChild(el);
      });
    }

    // A tile is blocked if any tile on a higher layer overlaps its bounding rectangle
    isBlocked(tile) {
      if (tile.collected) return true;
      const tw = 50;
      const th = 68;
      return this.tiles.some((other) => {
        if (other.collected || other.z <= tile.z) return false;
        // Bounding box intersection check
        return (
          Math.abs(tile.x - other.x) < tw - 6 &&
          Math.abs(tile.y - other.y) < th - 6
        );
      });
    }

    updateBoardState() {
      let remainingCount = 0;
      this.tiles.forEach((t) => {
        if (!t.collected) {
          remainingCount++;
          const blocked = this.isBlocked(t);
          t.element.classList.toggle('blocked', blocked);
          t.element.classList.toggle('free', !blocked);
        }
      });
      this.tilesLeftEl.textContent = remainingCount;
      this.undoBtn.disabled = this.tray.length === 0;
    }

    handleTileClick(tile) {
      if (tile.collected || this.isBlocked(tile) || this.isGameOver) return;
      if (this.tray.length >= TRAY_CAPACITY) {
        this.showToast('Tray is full!');
        return;
      }

      this.clearHints();

      // Collect tile into tray
      tile.collected = true;
      tile.element.style.display = 'none';
      this.sound.playCollect();

      // Insert into tray adjacent to identical types if available
      let insertIdx = this.tray.findIndex((item) => item.data.type === tile.data.type);
      if (insertIdx !== -1) {
        while (insertIdx < this.tray.length && this.tray[insertIdx].data.type === tile.data.type) {
          insertIdx++;
        }
        this.tray.splice(insertIdx, 0, tile);
      } else {
        this.tray.push(tile);
      }

      this.renderTray();
      this.updateBoardState();

      // Check for Trio Match
      setTimeout(() => this.checkTrayTrio(), 150);
    }

    renderTray() {
      this.traySlotsEl.innerHTML = '';
      for (let i = 0; i < TRAY_CAPACITY; i++) {
        const slot = document.createElement('div');
        slot.className = 'tray-slot';

        if (i < this.tray.length) {
          const item = this.tray[i];
          const tileEl = document.createElement('div');
          tileEl.className = 'tray-tile';
          tileEl.dataset.type = item.data.type;
          tileEl.innerHTML = `
            <span class="tile-symbol ${item.data.css}">${item.data.symbol}</span>
            <span class="tile-badge ${item.data.css}">${item.data.badge}</span>
          `;
          slot.appendChild(tileEl);
        }
        this.traySlotsEl.appendChild(slot);
      }
    }

    checkTrayTrio() {
      // Find any type with count == 3
      const counts = {};
      this.tray.forEach((t) => {
        counts[t.data.type] = (counts[t.data.type] || 0) + 1;
      });

      for (const [type, count] of Object.entries(counts)) {
        if (count >= 3) {
          // Animate pop
          const matchedEls = this.traySlotsEl.querySelectorAll(`[data-type="${type}"]`);
          matchedEls.forEach((el) => el.classList.add('trio-pop'));
          this.sound.playTrio();

          setTimeout(() => {
            // Remove the 3 items
            let removed = 0;
            this.tray = this.tray.filter((t) => {
              if (t.data.type === type && removed < 3) {
                removed++;
                return false;
              }
              return true;
            });

            this.updateScore(this.score + 300);
            this.renderTray();
            this.updateBoardState();
            this.checkWinCondition();
          }, 320);
          return;
        }
      }

      // Check overflow loss condition
      if (this.tray.length >= TRAY_CAPACITY) {
        this.isGameOver = true;
        clearInterval(this.timerInterval);
        this.sound.playLoss();
        document.getElementById('modal-loss').classList.add('active');
      }
    }

    undoLastTile() {
      if (this.tray.length === 0 || this.isGameOver) return;
      const lastTile = this.tray.pop();
      lastTile.collected = false;
      lastTile.element.style.display = '';

      this.sound.playCollect();
      this.renderTray();
      this.updateBoardState();
    }

    shuffleBoard() {
      const remaining = this.tiles.filter((t) => !t.collected);
      if (remaining.length <= 1) return;

      const symbols = remaining.map((t) => t.data);
      for (let i = symbols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
      }

      remaining.forEach((t, idx) => {
        t.data = symbols[idx];
        t.element.querySelector('.tile-symbol').className = `tile-symbol ${t.data.css}`;
        t.element.querySelector('.tile-symbol').textContent = t.data.symbol;
        t.element.querySelector('.tile-badge').className = `tile-badge ${t.data.css}`;
        t.element.querySelector('.tile-badge').textContent = t.data.badge;
      });

      this.sound.playCollect();
      this.updateBoardState();
      this.showToast('Board shuffled!');
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
      if (claimReward) this.revealHint();
    }

    revealHint() {
      // Find an unblocked tile whose type has other available tiles
      const unblocked = this.tiles.filter((t) => !t.collected && !this.isBlocked(t));
      if (unblocked.length > 0) {
        // Highlight matching tiles of the first unblocked tile
        const targetType = unblocked[0].data.type;
        this.tiles.forEach((t) => {
          if (!t.collected && t.data.type === targetType) {
            t.element.classList.add('hinted');
          }
        });
        this.sound.playCollect();
        this.showToast('Matching trio highlighted!');
      } else {
        this.shuffleBoard();
      }
    }

    clearHints() {
      this.tiles.forEach((t) => {
        if (t.element) t.element.classList.remove('hinted');
      });
    }

    updateScore(val) {
      this.score = val;
      this.scoreEl.textContent = this.score;
    }

    showToast(msg) {
      const toastEl = document.getElementById('toast');
      toastEl.textContent = msg;
      toastEl.classList.add('show');
      setTimeout(() => toastEl.classList.remove('show'), 2200);
    }

    checkWinCondition() {
      const remaining = this.tiles.filter((t) => !t.collected).length;
      if (remaining === 0 && this.tray.length === 0) {
        this.isGameOver = true;
        clearInterval(this.timerInterval);
        this.sound.playWin();

        const timeInSeconds = Math.max(1, this.elapsedSeconds);

        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'win', time: timeInSeconds }, '*');
        }

        document.getElementById('win-time').textContent = `${timeInSeconds}s`;
        document.getElementById('win-score').textContent = this.score;
        document.getElementById('modal-win').classList.add('active');
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    new TripleGame();
  });
})();
