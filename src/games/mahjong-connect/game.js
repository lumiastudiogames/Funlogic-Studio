/**
 * Mahjong Connect (Link Puzzle / Onet Connect)
 * Standalone Vanilla JS Game
 */

(function () {
  'use strict';

  const COLS = 12;
  const ROWS = 8;
  const TOTAL_TILES = COLS * ROWS; // 96 tiles = 48 pairs

  // Mahjong tiles catalogue
  const TILE_SYMBOLS = [
    { type: 'wan1', symbol: '🀇', badge: '1萬', css: 'suit-wan' },
    { type: 'wan2', symbol: '🀈', badge: '2萬', css: 'suit-wan' },
    { type: 'wan3', symbol: '🀉', badge: '3萬', css: 'suit-wan' },
    { type: 'wan4', symbol: '🀊', badge: '4萬', css: 'suit-wan' },
    { type: 'wan5', symbol: '🀋', badge: '5萬', css: 'suit-wan' },
    { type: 'wan6', symbol: '🀌', badge: '6萬', css: 'suit-wan' },
    { type: 'wan7', symbol: '🀍', badge: '7萬', css: 'suit-wan' },
    { type: 'wan8', symbol: '🀎', badge: '8萬', css: 'suit-wan' },
    { type: 'wan9', symbol: '🀏', badge: '9萬', css: 'suit-wan' },

    { type: 'sou1', symbol: '🀐', badge: '1索', css: 'suit-sou' },
    { type: 'sou2', symbol: '🀑', badge: '2索', css: 'suit-sou' },
    { type: 'sou3', symbol: '🀒', badge: '3索', css: 'suit-sou' },
    { type: 'sou4', symbol: '🀓', badge: '4索', css: 'suit-sou' },
    { type: 'sou5', symbol: '🀔', badge: '5索', css: 'suit-sou' },

    { type: 'pin1', symbol: '🀙', badge: '1筒', css: 'suit-pin' },
    { type: 'pin2', symbol: '🀚', badge: '2筒', css: 'suit-pin' },
    { type: 'pin3', symbol: '🀛', badge: '3筒', css: 'suit-pin' },
    { type: 'pin4', symbol: '🀜', badge: '4筒', css: 'suit-pin' },
    { type: 'pin5', symbol: '🀝', badge: '5筒', css: 'suit-pin' },

    { type: 'red_dragon', symbol: '🀄', badge: '中', css: 'suit-dragon-red' },
    { type: 'green_dragon', symbol: '🀅', badge: '發', css: 'suit-dragon-green' },
    { type: 'east_wind', symbol: '🀀', badge: '東', css: 'suit-wind' },
    { type: 'south_wind', symbol: '🀁', badge: '南', css: 'suit-wind' },
    { type: 'west_wind', symbol: '🀂', badge: '西', css: 'suit-wind' },
  ]; // 24 distinct types. Each will appear in 2 pairs (4 copies) = 96 tiles!

  // --- Sound Effects ---
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
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }
    playConnect() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      // Laser chord connect
      [659.25, 880, 1318.5].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.04);
        osc.stop(this.ctx.currentTime + idx * 0.04 + 0.3);
      });
    }
    playError() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    }
    playWin() {
      if (this.muted) return;
      this.init();
      if (!this.ctx) return;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.1);
        osc.stop(this.ctx.currentTime + idx * 0.1 + 0.5);
      });
    }
  }

  class ConnectGame {
    constructor() {
      this.grid = []; // (COLS + 2) x (ROWS + 2)
      this.selected = null;
      this.score = 0;
      this.pairsLeft = TOTAL_TILES / 2;
      this.timeRemaining = 180; // 3 minutes
      this.totalTime = 180;
      this.timerInterval = null;
      this.isGameOver = false;
      this.elapsedTime = 0;

      this.sound = new SoundManager();

      this.gridContainer = document.getElementById('grid-container');
      this.gridWrapper = document.getElementById('grid-wrapper');
      this.viewportEl = document.getElementById('board-viewport');
      this.canvas = document.getElementById('line-canvas');
      this.ctx = this.canvas.getContext('2d');

      this.scoreEl = document.getElementById('score-counter');
      this.pairsEl = document.getElementById('pairs-counter');
      this.timeProgressFill = document.getElementById('time-progress-fill');
      this.timeCounterEl = document.getElementById('timer-counter');

      this.initEvents();
      this.startNewGame();
    }

    initEvents() {
      document.getElementById('btn-sound-toggle').addEventListener('click', () => {
        const muted = this.sound.toggle();
        const soundIcon = document.getElementById('sound-icon');
        if (soundIcon) soundIcon.textContent = muted ? '🔇' : '🔊';
      });

      document.getElementById('btn-hint').addEventListener('click', () => this.openHintModal());
      document.getElementById('btn-shuffle').addEventListener('click', () => this.shuffleGrid());

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

      const resizeObserver = new ResizeObserver(() => this.resizeCanvas());
      resizeObserver.observe(this.gridWrapper);
    }

    startNewGame() {
      clearInterval(this.timerInterval);
      this.isGameOver = false;
      this.selected = null;
      this.score = 0;
      this.pairsLeft = TOTAL_TILES / 2;
      this.timeRemaining = 180;
      this.elapsedTime = 0;
      this.updateScore(0);
      this.pairsEl.textContent = this.pairsLeft;

      this.timerInterval = setInterval(() => {
        if (!this.isGameOver) {
          this.timeRemaining--;
          this.elapsedTime++;
          const pct = Math.max(0, (this.timeRemaining / this.totalTime) * 100);
          this.timeProgressFill.style.width = `${pct}%`;

          const m = String(Math.floor(this.timeRemaining / 60)).padStart(2, '0');
          const s = String(this.timeRemaining % 60).padStart(2, '0');
          this.timeCounterEl.textContent = `${m}:${s}`;

          if (this.timeRemaining <= 0) {
            this.handleTimeOut();
          }
        }
      }, 1000);

      // Create 96 tiles (24 types x 4 each)
      const deck = [];
      TILE_SYMBOLS.forEach((sym) => {
        for (let i = 0; i < 4; i++) {
          deck.push({ ...sym });
        }
      });

      // Shuffle deck
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      // Initialize grid with padded borders (14 cols x 10 rows)
      this.grid = Array.from({ length: COLS + 2 }, () =>
        Array.from({ length: ROWS + 2 }, () => null)
      );

      let deckIdx = 0;
      for (let y = 1; y <= ROWS; y++) {
        for (let x = 1; x <= COLS; x++) {
          this.grid[x][y] = {
            x,
            y,
            data: deck[deckIdx++],
            element: null,
          };
        }
      }

      this.renderBoard();
      this.resizeCanvas();
      this.ensurePlayableBoard();
    }

    renderBoard() {
      this.gridContainer.innerHTML = '';
      for (let y = 1; y <= ROWS; y++) {
        for (let x = 1; x <= COLS; x++) {
          const cell = this.grid[x][y];
          const el = document.createElement('div');
          el.className = 'connect-tile';
          el.dataset.x = x;
          el.dataset.y = y;

          el.innerHTML = `
            <span class="tile-symbol ${cell.data.css}">${cell.data.symbol}</span>
            <span class="tile-badge ${cell.data.css}">${cell.data.badge}</span>
          `;

          el.addEventListener('click', () => this.handleTileClick(x, y));
          cell.element = el;
          this.gridContainer.appendChild(el);
        }
      }
    }

    resizeCanvas() {
      const rect = this.gridWrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.canvas.style.width = `${rect.width}px`;
      this.canvas.style.height = `${rect.height}px`;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Auto-fit grid inside viewport
      const vRect = this.viewportEl.getBoundingClientRect();
      const scaleX = (vRect.width - 24) / (rect.width || 600);
      const scaleY = (vRect.height - 24) / (rect.height || 400);
      const scale = Math.min(scaleX, scaleY, 1.1);
      this.gridWrapper.style.transform = `scale(${scale})`;
    }

    handleTileClick(x, y) {
      const cell = this.grid[x][y];
      if (!cell || !cell.data) return;

      this.clearHints();

      if (this.selected && this.selected.x === x && this.selected.y === y) {
        cell.element.classList.remove('selected');
        this.selected = null;
        this.sound.playClick();
        return;
      }

      if (!this.selected) {
        this.selected = cell;
        cell.element.classList.add('selected');
        this.sound.playClick();
        return;
      }

      // Check match with previously selected
      const first = this.selected;
      if (first.data.type === cell.data.type) {
        const path = this.findConnectPath(first.x, first.y, cell.x, cell.y);
        if (path) {
          // Valid Connection!
          first.element.classList.remove('selected');
          this.selected = null;

          this.drawConnectingLine(path);
          this.sound.playConnect();

          first.element.classList.add('matched');
          cell.element.classList.add('matched');

          setTimeout(() => {
            first.element.classList.add('empty');
            cell.element.classList.add('empty');
            first.data = null;
            cell.data = null;

            this.pairsLeft--;
            this.pairsEl.textContent = this.pairsLeft;
            this.updateScore(this.score + 150);

            // Add 3s time bonus
            this.timeRemaining = Math.min(this.totalTime, this.timeRemaining + 3);

            this.checkWinCondition();
            this.ensurePlayableBoard();
          }, 250);
          return;
        }
      }

      // Not connectable or not matching
      this.sound.playError();
      first.element.classList.remove('selected');
      this.selected = cell;
      cell.element.classList.add('selected');
    }

    // --- 2-Bend Pathfinding Algorithm ---
    // Checks if straight line is clear between (x1,y1) and (x2,y2) exclusively
    isLineClear(x1, y1, x2, y2) {
      if (x1 === x2) {
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        for (let y = minY + 1; y < maxY; y++) {
          if (this.grid[x1][y] && this.grid[x1][y].data) return false;
        }
        return true;
      } else if (y1 === y2) {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        for (let x = minX + 1; x < maxX; x++) {
          if (this.grid[x][y1] && this.grid[x][y1].data) return false;
        }
        return true;
      }
      return false;
    }

    isCellEmpty(x, y) {
      if (x < 0 || x >= COLS + 2 || y < 0 || y >= ROWS + 2) return true;
      const cell = this.grid[x][y];
      return !cell || !cell.data;
    }

    findConnectPath(x1, y1, x2, y2) {
      // 1. Direct Straight Line (0 bends)
      if (x1 === x2 || y1 === y2) {
        if (this.isLineClear(x1, y1, x2, y2)) {
          return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
        }
      }

      // 2. One Bend (L-shape, 1 bend)
      // Check corner (x1, y2)
      if (this.isCellEmpty(x1, y2)) {
        if (this.isLineClear(x1, y1, x1, y2) && this.isLineClear(x1, y2, x2, y2)) {
          return [{ x: x1, y: y1 }, { x: x1, y: y2 }, { x: x2, y: y2 }];
        }
      }
      // Check corner (x2, y1)
      if (this.isCellEmpty(x2, y1)) {
        if (this.isLineClear(x1, y1, x2, y1) && this.isLineClear(x2, y1, x2, y2)) {
          return [{ x: x1, y: y1 }, { x: x2, y: y1 }, { x: x2, y: y2 }];
        }
      }

      // 3. Two Bends (Z-shape or U-shape through outer border or empty interior, 2 bends)
      // Horizontal Scan: vary X from 0 to COLS + 1
      for (let x = 0; x < COLS + 2; x++) {
        if (this.isCellEmpty(x, y1) && this.isCellEmpty(x, y2)) {
          if (
            this.isLineClear(x1, y1, x, y1) &&
            this.isLineClear(x, y1, x, y2) &&
            this.isLineClear(x, y2, x2, y2)
          ) {
            return [
              { x: x1, y: y1 },
              { x: x, y: y1 },
              { x: x, y: y2 },
              { x: x2, y: y2 },
            ];
          }
        }
      }

      // Vertical Scan: vary Y from 0 to ROWS + 1
      for (let y = 0; y < ROWS + 2; y++) {
        if (this.isCellEmpty(x1, y) && this.isCellEmpty(x2, y)) {
          if (
            this.isLineClear(x1, y1, x1, y) &&
            this.isLineClear(x1, y, x2, y) &&
            this.isLineClear(x2, y, x2, y2)
          ) {
            return [
              { x: x1, y: y1 },
              { x: x1, y: y },
              { x: x2, y: y },
              { x: x2, y: y2 },
            ];
          }
        }
      }

      return null;
    }

    // Convert grid coordinate to pixel position on canvas
    getCenterPixels(gx, gy) {
      const containerRect = this.gridContainer.getBoundingClientRect();
      const wrapperRect = this.gridWrapper.getBoundingClientRect();

      // Find an existing cell to get cell width & height
      const anyTile = this.gridContainer.querySelector('.connect-tile');
      const cellW = anyTile ? anyTile.offsetWidth : 44;
      const cellH = anyTile ? anyTile.offsetHeight : 60;
      const gap = 3;

      const offsetX = containerRect.left - wrapperRect.left + 8;
      const offsetY = containerRect.top - wrapperRect.top + 8;

      const px = offsetX + (gx - 1) * (cellW + gap) + cellW / 2;
      const py = offsetY + (gy - 1) * (cellH + gap) + cellH / 2;

      return { x: px, y: py };
    }

    drawConnectingLine(path) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (!path || path.length < 2) return;

      const pts = path.map((p) => this.getCenterPixels(p.x, p.y));

      this.ctx.save();
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      // Neon outer glow
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.lineWidth = 6;
      this.ctx.shadowColor = '#38bdf8';
      this.ctx.shadowBlur = 12;

      this.ctx.beginPath();
      this.ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        this.ctx.lineTo(pts[i].x, pts[i].y);
      }
      this.ctx.stroke();

      // Inner intense core
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 3;
      this.ctx.shadowBlur = 0;
      this.ctx.beginPath();
      this.ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        this.ctx.lineTo(pts[i].x, pts[i].y);
      }
      this.ctx.stroke();

      // Junction nodes
      pts.forEach((pt) => {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        this.ctx.fill();
      });

      this.ctx.restore();

      setTimeout(() => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }, 260);
    }

    getAvailablePairs() {
      const activeTiles = [];
      for (let y = 1; y <= ROWS; y++) {
        for (let x = 1; x <= COLS; x++) {
          if (this.grid[x][y] && this.grid[x][y].data) {
            activeTiles.push(this.grid[x][y]);
          }
        }
      }

      const validPairs = [];
      for (let i = 0; i < activeTiles.length; i++) {
        for (let j = i + 1; j < activeTiles.length; j++) {
          const t1 = activeTiles[i];
          const t2 = activeTiles[j];
          if (t1.data.type === t2.data.type) {
            const path = this.findConnectPath(t1.x, t1.y, t2.x, t2.y);
            if (path) {
              validPairs.push({ t1, t2, path });
            }
          }
        }
      }
      return validPairs;
    }

    ensurePlayableBoard() {
      if (this.pairsLeft === 0) return;
      const pairs = this.getAvailablePairs();
      if (pairs.length === 0) {
        this.showToast('No possible matches! Auto-shuffling...');
        setTimeout(() => this.shuffleGrid(), 1000);
      }
    }

    shuffleGrid() {
      const activeCells = [];
      const symbols = [];

      for (let y = 1; y <= ROWS; y++) {
        for (let x = 1; x <= COLS; x++) {
          if (this.grid[x][y] && this.grid[x][y].data) {
            activeCells.push(this.grid[x][y]);
            symbols.push(this.grid[x][y].data);
          }
        }
      }

      if (activeCells.length <= 1) return;

      for (let i = symbols.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
      }

      activeCells.forEach((cell, idx) => {
        cell.data = symbols[idx];
        const symEl = cell.element.querySelector('.tile-symbol');
        if (symEl) {
          symEl.className = `tile-symbol ${cell.data.css}`;
          symEl.textContent = cell.data.symbol;
        }
        const badgeEl = cell.element.querySelector('.tile-badge');
        if (badgeEl) {
          badgeEl.className = `tile-badge ${cell.data.css}`;
          badgeEl.textContent = cell.data.badge;
        }
      });

      if (this.selected) {
        this.selected.element.classList.remove('selected');
        this.selected = null;
      }

      this.sound.playClick();
      this.showToast('Board shuffled!');

      // Check again to guarantee playable board
      if (this.getAvailablePairs().length === 0) {
        setTimeout(() => this.shuffleGrid(), 300);
      }
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
        const { t1, t2 } = pairs[0];
        t1.element.classList.add('hinted');
        t2.element.classList.add('hinted');
        this.sound.playClick();
        this.showToast('Pair highlighted!');
      } else {
        this.showToast('No pairs available! Shuffling...');
        this.shuffleGrid();
      }
    }

    clearHints() {
      for (let y = 1; y <= ROWS; y++) {
        for (let x = 1; x <= COLS; x++) {
          if (this.grid[x][y] && this.grid[x][y].element) {
            this.grid[x][y].element.classList.remove('hinted');
          }
        }
      }
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

    handleTimeOut() {
      this.isGameOver = true;
      clearInterval(this.timerInterval);
      this.showToast('Time expired! Game Over!');
      this.sound.playError();
    }

    checkWinCondition() {
      if (this.pairsLeft === 0) {
        this.isGameOver = true;
        clearInterval(this.timerInterval);
        this.sound.playWin();

        const timeInSeconds = Math.max(1, this.elapsedTime);

        // Required official platform integration!
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

  window.addEventListener('DOMContentLoaded', () => {
    new ConnectGame();
  });
})();
