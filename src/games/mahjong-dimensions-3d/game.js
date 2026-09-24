/**
 * Mahjong Dimensions 3D - Cube Puzzle
 * Standalone Vanilla JS Game
 */

(function () {
  'use strict';

  const GRID_X = 4;
  const GRID_Y = 4;
  const GRID_Z = 3;
  const TOTAL_TILES = GRID_X * GRID_Y * GRID_Z; // 48 tiles = 24 pairs

  const SYMBOLS = [
    { type: 'w1', symbol: '🀇', badge: '1萬', css: 'suit-wan' },
    { type: 'w2', symbol: '🀈', badge: '2萬', css: 'suit-wan' },
    { type: 'w3', symbol: '🀉', badge: '3萬', css: 'suit-wan' },
    { type: 'w4', symbol: '🀊', badge: '4萬', css: 'suit-wan' },
    { type: 'w5', symbol: '🀋', badge: '5萬', css: 'suit-wan' },
    { type: 's1', symbol: '🀐', badge: '1索', css: 'suit-sou' },
    { type: 's2', symbol: '🀑', badge: '2索', css: 'suit-sou' },
    { type: 's3', symbol: '🀒', badge: '3索', css: 'suit-sou' },
    { type: 'p1', symbol: '🀙', badge: '1筒', css: 'suit-pin' },
    { type: 'p2', symbol: '🀚', badge: '2筒', css: 'suit-pin' },
    { type: 'red', symbol: '🀄', badge: '中', css: 'suit-dragon' },
    { type: 'east', symbol: '🀀', badge: '東', css: 'suit-wind' },
  ]; // 12 types x 4 each = 48 tiles

  // Sound Engine
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
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }
    playRotate() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    }
    playMatch(combo = 1) {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const baseFreq = 523.25 * (1 + (combo - 1) * 0.15);
      [baseFreq, baseFreq * 1.25, baseFreq * 1.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.04);
        osc.stop(this.ctx.currentTime + idx * 0.04 + 0.35);
      });
    }
    playWin() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
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

  class DimensionsGame {
    constructor() {
      this.tiles = [];
      this.selectedTile = null;
      this.score = 0;
      this.tilesLeft = TOTAL_TILES;
      this.elapsedSeconds = 0;
      this.timerInterval = null;
      this.isGameOver = false;

      // 3D rotation state
      this.rotX = -20;
      this.rotY = 35;
      this.isDragging = false;
      this.lastMouseX = 0;
      this.lastMouseY = 0;

      // Combo state
      this.combo = 1;
      this.lastMatchTime = 0;

      this.sound = new SoundManager();

      this.viewportEl = document.getElementById('viewport-3d');
      this.cubeWorldEl = document.getElementById('cube-world');
      this.scoreEl = document.getElementById('score-counter');
      this.timerEl = document.getElementById('timer-counter');
      this.tilesLeftEl = document.getElementById('tiles-left-counter');
      this.comboBadge = document.getElementById('combo-badge');

      this.initControls();
      this.startNewGame();
    }

    initControls() {
      // Sound toggle
      document.getElementById('btn-sound-toggle').addEventListener('click', () => {
        const muted = this.sound.toggle();
        const soundIcon = document.getElementById('sound-icon');
        if (soundIcon) soundIcon.textContent = muted ? '🔇' : '🔊';
      });

      // Quick 90 deg rotation buttons
      document.getElementById('btn-rot-left').addEventListener('click', () => {
        this.rotY -= 90;
        this.updateCubeTransform();
        this.sound.playRotate();
      });
      document.getElementById('btn-rot-right').addEventListener('click', () => {
        this.rotY += 90;
        this.updateCubeTransform();
        this.sound.playRotate();
      });
      document.getElementById('btn-rot-reset').addEventListener('click', () => {
        this.rotX = -20;
        this.rotY = 35;
        this.updateCubeTransform();
        this.sound.playRotate();
      });

      // Mouse Drag & Touch Swipe
      const onStart = (clientX, clientY) => {
        this.isDragging = true;
        this.lastMouseX = clientX;
        this.lastMouseY = clientY;
      };

      const onMove = (clientX, clientY) => {
        if (!this.isDragging) return;
        const dx = clientX - this.lastMouseX;
        const dy = clientY - this.lastMouseY;
        this.lastMouseX = clientX;
        this.lastMouseY = clientY;

        this.rotY += dx * 0.5;
        this.rotX = Math.max(-75, Math.min(75, this.rotX - dy * 0.5));
        this.updateCubeTransform();
      };

      const onEnd = () => {
        this.isDragging = false;
      };

      this.viewportEl.addEventListener('mousedown', (e) => {
        if (e.target.closest('.btn-tactile') || e.target.closest('#controls-3d')) return;
        onStart(e.clientX, e.clientY);
      });
      window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
      window.addEventListener('mouseup', onEnd);

      this.viewportEl.addEventListener('touchstart', (e) => {
        if (e.target.closest('.btn-tactile') || e.target.closest('#controls-3d')) return;
        const touch = e.touches[0];
        onStart(touch.clientX, touch.clientY);
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (!this.isDragging) return;
        const touch = e.touches[0];
        onMove(touch.clientX, touch.clientY);
      }, { passive: true });

      window.addEventListener('touchend', onEnd);

      // Buttons
      const restartBtn = document.getElementById('btn-restart');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          this.sound.playClick();
          this.startNewGame();
          this.showToast('Cube restarted!');
        });
      }

      document.getElementById('btn-hint').addEventListener('click', () => this.highlightHintPair());
      document.getElementById('btn-shuffle').addEventListener('click', () => this.shuffleRemaining());

      document.getElementById('btn-how-to-play').addEventListener('click', () => {
        document.getElementById('modal-tutorial').classList.add('active');
      });
      document.getElementById('btn-close-tutorial').addEventListener('click', () => {
        document.getElementById('modal-tutorial').classList.remove('active');
      });

      const skipAd = document.getElementById('btn-skip-ad');
      if (skipAd) skipAd.addEventListener('click', () => this.closeAdModal(false));
      const claimHint = document.getElementById('btn-claim-hint');
      if (claimHint) claimHint.addEventListener('click', () => this.closeAdModal(true));

      document.getElementById('btn-replay').addEventListener('click', () => {
        document.getElementById('modal-win').classList.remove('active');
        this.startNewGame();
      });
    }

    updateCubeTransform() {
      this.cubeWorldEl.style.transform = `rotateX(${this.rotX}deg) rotateY(${this.rotY}deg)`;
    }

    startNewGame() {
      clearInterval(this.timerInterval);
      this.isGameOver = false;
      this.selectedTile = null;
      this.score = 0;
      this.combo = 1;
      this.elapsedSeconds = 0;
      this.tilesLeft = TOTAL_TILES;

      this.updateScore(0);
      this.tilesLeftEl.textContent = this.tilesLeft;
      this.timerEl.textContent = '00:00';
      this.comboBadge.style.display = 'none';

      this.timerInterval = setInterval(() => {
        if (!this.isGameOver) {
          this.elapsedSeconds++;
          const m = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
          const s = String(this.elapsedSeconds % 60).padStart(2, '0');
          this.timerEl.textContent = `${m}:${s}`;

          // Combo decay if > 4s
          if (this.combo > 1 && Date.now() - this.lastMatchTime > 4000) {
            this.combo = 1;
            this.comboBadge.style.display = 'none';
          }
        }
      }, 1000);

      // Create deck: 12 types x 4 = 48
      const deck = [];
      SYMBOLS.forEach((s) => {
        for (let i = 0; i < 4; i++) deck.push({ ...s });
      });

      // Shuffle
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      this.tiles = [];
      let deckIdx = 0;
      for (let z = 0; z < GRID_Z; z++) {
        for (let y = 0; y < GRID_Y; y++) {
          for (let x = 0; x < GRID_X; x++) {
            this.tiles.push({
              id: `${x}_${y}_${z}`,
              x,
              y,
              z,
              data: deck[deckIdx++],
              removed: false,
              element: null,
            });
          }
        }
      }

      this.renderCube();
      this.updateFreeStates();
      this.updateCubeTransform();
    }

    // A tile at (x,y,z) is free if at least one pair of opposing sides is clear, or outer sides are exposed
    isFree(tile) {
      if (tile.removed) return false;

      // Check adjacent neighbors along X, Y, Z
      const hasLeft = this.tiles.some((t) => !t.removed && t.z === tile.z && t.y === tile.y && t.x === tile.x - 1);
      const hasRight = this.tiles.some((t) => !t.removed && t.z === tile.z && t.y === tile.y && t.x === tile.x + 1);
      const hasTop = this.tiles.some((t) => !t.removed && t.z === tile.z && t.y === tile.y - 1 && t.x === tile.x);
      const hasBottom = this.tiles.some((t) => !t.removed && t.z === tile.z && t.y === tile.y + 1 && t.x === tile.x);
      const hasFront = this.tiles.some((t) => !t.removed && t.z === tile.z + 1 && t.y === tile.y && t.x === tile.x);
      const hasBack = this.tiles.some((t) => !t.removed && t.z === tile.z - 1 && t.y === tile.y && t.x === tile.x);

      // In Mahjong Dimensions, a tile is free if either its left face OR right face is open,
      // OR its front face OR back face is open!
      const lateralFree = !hasLeft || !hasRight;
      const depthFree = !hasFront || !hasBack;
      const verticalFree = !hasTop || !hasBottom;

      return lateralFree || depthFree || verticalFree;
    }

    renderCube() {
      this.cubeWorldEl.innerHTML = '';
      const stepX = 58;
      const stepY = 68;
      const stepZ = 58;

      const offsetX = (GRID_X - 1) * stepX * 0.5;
      const offsetY = (GRID_Y - 1) * stepY * 0.5;
      const offsetZ = (GRID_Z - 1) * stepZ * 0.5;

      this.tiles.forEach((t) => {
        const el = document.createElement('div');
        el.className = 'tile-3d';
        el.dataset.id = t.id;

        const posX = t.x * stepX - offsetX;
        const posY = t.y * stepY - offsetY;
        const posZ = t.z * stepZ - offsetZ;

        el.style.transform = `translate3d(${posX}px, ${posY}px, ${posZ}px)`;

        el.innerHTML = `
          <div class="tile-face face-front">
            <span class="tile-symbol ${t.data.css}">${t.data.symbol}</span>
            <span class="tile-badge ${t.data.css}">${t.data.badge}</span>
          </div>
          <div class="tile-face face-back"></div>
          <div class="tile-face face-left"></div>
          <div class="tile-face face-right"></div>
          <div class="tile-face face-top"></div>
          <div class="tile-face face-bottom"></div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          this.handleTileClick(t);
        });

        t.element = el;
        this.cubeWorldEl.appendChild(el);
      });
    }

    updateFreeStates() {
      let count = 0;
      this.tiles.forEach((t) => {
        if (!t.removed) {
          count++;
          const free = this.isFree(t);
          t.element.classList.toggle('free', free);
          t.element.classList.toggle('blocked', !free);
        }
      });
      this.tilesLeft = count;
      this.tilesLeftEl.textContent = this.tilesLeft;

      if (count > 0 && this.getAvailablePairs().length === 0) {
        this.showToast('No pairs available! Auto-shuffling...');
        setTimeout(() => this.shuffleRemaining(), 1000);
      }
    }

    handleTileClick(tile) {
      if (tile.removed || !this.isFree(tile)) {
        return;
      }

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

        // Combo check
        const now = Date.now();
        if (now - this.lastMatchTime < 4500) {
          this.combo = Math.min(5, this.combo + 1);
        } else {
          this.combo = 1;
        }
        this.lastMatchTime = now;

        if (this.combo > 1) {
          this.comboBadge.textContent = `${this.combo}X COMBO! 🔥`;
          this.comboBadge.style.display = 'block';
        }

        const pts = 100 * this.combo;
        this.updateScore(this.score + pts);
        this.sound.playMatch(this.combo);

        setTimeout(() => {
          first.element.style.display = 'none';
          tile.element.style.display = 'none';
          this.updateFreeStates();
          this.checkWinCondition();
        }, 350);
      } else {
        first.element.classList.remove('selected');
        this.selectedTile = tile;
        tile.element.classList.add('selected');
        this.sound.playClick();
      }
    }

    getAvailablePairs() {
      const freeTiles = this.tiles.filter((t) => this.isFree(t));
      const pairs = [];
      for (let i = 0; i < freeTiles.length; i++) {
        for (let j = i + 1; j < freeTiles.length; j++) {
          if (freeTiles[i].data.type === freeTiles[j].data.type) {
            pairs.push([freeTiles[i], freeTiles[j]]);
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
        const front = t.element.querySelector('.face-front');
        if (front) {
          const symEl = front.querySelector('.tile-symbol');
          if (symEl) {
            symEl.className = `tile-symbol ${t.data.css}`;
            symEl.textContent = t.data.symbol;
          }
          const badgeEl = front.querySelector('.tile-badge');
          if (badgeEl) {
            badgeEl.className = `tile-badge ${t.data.css}`;
            badgeEl.textContent = t.data.badge;
          }
        }
      });

      if (this.selectedTile) {
        this.selectedTile.element.classList.remove('selected');
        this.selectedTile = null;
      }

      this.sound.playRotate();
      this.updateFreeStates();
      this.showToast('Cube shuffled!');
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
      const pairs = this.getAvailablePairs();
      if (pairs.length > 0) {
        const [t1, t2] = pairs[0];
        t1.element.classList.add('hinted');
        t2.element.classList.add('hinted');
        this.sound.playClick();
        this.showToast('3D Pair illuminated!');
      } else {
        this.showToast('No pairs available! Shuffling...');
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
      this.scoreEl.textContent = this.score;
    }

    showToast(msg) {
      const toastEl = document.getElementById('toast');
      toastEl.textContent = msg;
      toastEl.classList.add('show');
      setTimeout(() => toastEl.classList.remove('show'), 2200);
    }

    checkWinCondition() {
      if (this.tiles && this.tiles.length > 0 && this.tilesLeft === 0) {
        this.isGameOver = true;
        clearInterval(this.timerInterval);
        this.sound.playWin();

        const timeInSeconds = Math.max(1, this.elapsedSeconds);

        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'win', time: timeInSeconds }, '*');
        }

        const winTimeEl = document.getElementById('win-time');
        if (winTimeEl) winTimeEl.textContent = `${timeInSeconds}s`;
        const winScoreEl = document.getElementById('win-score');
        if (winScoreEl) winScoreEl.textContent = this.score;
        document.getElementById('modal-win').classList.add('active');
      }
    }
  }

  function initGame() {
    new DimensionsGame();
  }
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }
})();
