/**
 * Mahjong Connect (Link Puzzle / Onet Connect)
 * Clean HUD, 6x6 Easy Default Mode, Start Menu & Responsive Layout
 */

(function () {
  'use strict';

  // Complete Mahjong symbols catalogue
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
  ]; // 24 distinct types

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
      [440, 554.37, 659.25, 880, 1108.7].forEach((freq, idx) => {
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
      // Configuration mode: '36' (6x6 Easy Default), '48' (6x8 Medium), '96' (8x12 Classic)
      this.mode = localStorage.getItem('mahjong_connect_mode') || '36';
      this.currentOrientation = this.detectOrientation();

      this.cols = 6;
      this.rows = 6;
      this.totalTiles = 36;

      this.grid = []; // (cols + 2) x (rows + 2)
      this.selected = null;
      this.score = 0;
      this.pairsLeft = 0;
      this.totalTime = 180;
      this.timeRemaining = 180;
      this.timerInterval = null;
      this.isGameOver = false;
      this.elapsedTime = 0;
      this.hintsLeft = 3;
      this.shufflesLeft = 3;

      this.sound = new SoundManager();

      this.gridContainer = document.getElementById('grid-container');
      this.gridWrapper = document.getElementById('grid-wrapper');
      this.viewportEl = document.getElementById('board-viewport');
      this.canvas = document.getElementById('line-canvas');
      this.ctx = this.canvas.getContext('2d');

      this.scoreEl = document.getElementById('score-counter');
      this.timeProgressFill = document.getElementById('time-progress-fill');
      this.timeCounterEl = document.getElementById('timer-counter');
      this.toastEl = document.getElementById('toast');
      this.hintBadgeEl = document.getElementById('hint-badge');
      this.shuffleBadgeEl = document.getElementById('shuffle-badge');

      this.initEvents();
      this.updateMenuSelectedMode();
    }

    detectOrientation() {
      return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    updateDimensions() {
      const isPortrait = this.detectOrientation() === 'portrait';

      if (this.mode === '36') {
        // 6x6 Easy (36 Extra Large Cards)
        this.cols = 6;
        this.rows = 6;
        this.totalTime = 180;
      } else if (this.mode === '48') {
        // 48 Cards
        this.cols = isPortrait ? 6 : 8;
        this.rows = isPortrait ? 8 : 6;
        this.totalTime = 240;
      } else {
        // 96 Cards Classic
        this.cols = isPortrait ? 8 : 12;
        this.rows = isPortrait ? 12 : 8;
        this.totalTime = 300;
      }
      this.totalTiles = this.cols * this.rows;
    }

    updateMenuSelectedMode() {
      const modeCards = document.querySelectorAll('.mode-card');
      modeCards.forEach((card) => {
        const cardMode = card.getAttribute('data-mode');
        if (cardMode === this.mode) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    }

    initEvents() {
      // Menu Button (Opens start options)
      const menuBtn = document.getElementById('btn-menu');
      if (menuBtn) {
        menuBtn.addEventListener('click', () => {
          this.sound.playClick();
          document.getElementById('modal-menu').classList.add('active');
        });
      }

      // Mode Selector Cards in Start Menu
      const modeCards = document.querySelectorAll('.mode-card');
      modeCards.forEach((card) => {
        card.addEventListener('click', () => {
          this.sound.playClick();
          const targetMode = card.getAttribute('data-mode') || '36';
          this.mode = targetMode;
          localStorage.setItem('mahjong_connect_mode', this.mode);
          this.updateMenuSelectedMode();
        });
      });

      // Play Button in Start Menu
      const playBtn = document.getElementById('btn-play-game');
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          this.sound.playClick();
          document.getElementById('modal-menu').classList.remove('active');
          this.startNewGame();
        });
      }

      // Single Restart Button in HUD
      const restartBtn = document.getElementById('btn-restart');
      if (restartBtn) {
        restartBtn.addEventListener('click', () => {
          this.sound.playClick();
          this.startNewGame();
          this.showToast('Jogo reiniciado!');
        });
      }

      // Fullscreen Button
      const fsBtn = document.getElementById('btn-fullscreen');
      if (fsBtn) {
        fsBtn.addEventListener('click', async () => {
          this.sound.playClick();
          try {
            if (!document.fullscreenElement) {
              if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
              }
            } else {
              if (document.exitFullscreen) {
                await document.exitFullscreen();
              }
            }
          } catch (e) {
            console.log('Fullscreen error:', e);
          }
        });
      }

      // Track Fullscreen state
      document.addEventListener('fullscreenchange', () => {
        const fsIcon = document.getElementById('fs-icon');
        if (fsIcon) {
          fsIcon.textContent = document.fullscreenElement ? '🗗' : '⛶';
        }
      });

      // Sound toggle (in menu)
      const soundMenuBtn = document.getElementById('btn-menu-sound');
      if (soundMenuBtn) {
        soundMenuBtn.addEventListener('click', () => {
          const muted = this.sound.toggle();
          const soundIcon = document.getElementById('menu-sound-icon');
          if (soundIcon) soundIcon.textContent = muted ? '🔇' : '🔊';
          soundMenuBtn.innerHTML = `<span id="menu-sound-icon">${muted ? '🔇' : '🔊'}</span> Sound: ${muted ? 'OFF' : 'ON'}`;
        });
      }

      // Hint & Shuffle
      const hintBtn = document.getElementById('btn-hint');
      if (hintBtn) hintBtn.addEventListener('click', () => this.revealHint());

      const shuffleBtn = document.getElementById('btn-shuffle');
      if (shuffleBtn) shuffleBtn.addEventListener('click', () => this.shuffleGrid());

      // Tutorial Modal
      const menuTutBtn = document.getElementById('btn-menu-tutorial');
      if (menuTutBtn) {
        menuTutBtn.addEventListener('click', () => {
          this.sound.playClick();
          document.getElementById('modal-tutorial').classList.add('active');
        });
      }
      const closeTutBtn = document.getElementById('btn-close-tutorial');
      if (closeTutBtn) {
        closeTutBtn.addEventListener('click', () => {
          this.sound.playClick();
          document.getElementById('modal-tutorial').classList.remove('active');
        });
      }

      // Replay and Return to Menu from Win
      const replayBtn = document.getElementById('btn-replay');
      if (replayBtn) {
        replayBtn.addEventListener('click', () => {
          document.getElementById('modal-win').classList.remove('active');
          this.startNewGame();
        });
      }
      const winMenuBtn = document.getElementById('btn-win-menu');
      if (winMenuBtn) {
        winMenuBtn.addEventListener('click', () => {
          document.getElementById('modal-win').classList.remove('active');
          document.getElementById('modal-menu').classList.add('active');
        });
      }

      // Resize & Orientation listeners
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          this.handleScreenResize();
        }, 80);
      });

      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          this.handleScreenResize();
        }, 180);
      });
    }

    handleScreenResize() {
      const newOrientation = this.detectOrientation();
      if (newOrientation !== this.currentOrientation && this.mode !== '36') {
        this.currentOrientation = newOrientation;
        const oldCols = this.cols;
        const oldRows = this.rows;
        this.updateDimensions();

        if (!this.isGameOver && this.grid && this.pairsLeft > 0) {
          this.rearrangeToNewDimensions(oldCols, oldRows);
        } else {
          this.startNewGame();
        }
      }
      this.resizeCanvas();
    }

    rearrangeToNewDimensions(oldCols, oldRows) {
      const remainingData = [];
      for (let y = 1; y <= oldRows; y++) {
        for (let x = 1; x <= oldCols; x++) {
          if (this.grid[x] && this.grid[x][y] && this.grid[x][y].data) {
            remainingData.push(this.grid[x][y].data);
          }
        }
      }

      this.grid = Array.from({ length: this.cols + 2 }, () =>
        Array.from({ length: this.rows + 2 }, () => null)
      );

      let tileIdx = 0;
      for (let y = 1; y <= this.rows; y++) {
        for (let x = 1; x <= this.cols; x++) {
          const data = tileIdx < remainingData.length ? remainingData[tileIdx++] : null;
          this.grid[x][y] = {
            x,
            y,
            data,
            element: null,
          };
        }
      }

      this.selected = null;
      this.applyGridContainerClasses();
      this.renderBoard();
      this.resizeCanvas();
      this.ensurePlayableBoard();
    }

    applyGridContainerClasses() {
      this.gridContainer.className = '';
      this.gridContainer.classList.add(`grid-${this.cols}x${this.rows}`);
    }

    startNewGame() {
      clearInterval(this.timerInterval);
      this.isGameOver = false;
      this.selected = null;
      this.score = 0;
      this.elapsedTime = 0;
      this.hintsLeft = 3;
      this.shufflesLeft = 3;

      this.currentOrientation = this.detectOrientation();
      this.updateDimensions();
      this.applyGridContainerClasses();

      this.pairsLeft = this.totalTiles / 2;
      this.timeRemaining = this.totalTime;

      this.updateScore(0);
      this.timeProgressFill.style.width = '100%';
      if (this.hintBadgeEl) this.hintBadgeEl.textContent = this.hintsLeft;
      if (this.shuffleBadgeEl) this.shuffleBadgeEl.textContent = this.shufflesLeft;

      const m = String(Math.floor(this.timeRemaining / 60)).padStart(2, '0');
      const s = String(this.timeRemaining % 60).padStart(2, '0');
      this.timeCounterEl.textContent = `${m}:${s}`;

      this.timerInterval = setInterval(() => {
        if (!this.isGameOver) {
          this.timeRemaining--;
          this.elapsedTime++;
          const pct = Math.max(0, (this.timeRemaining / this.totalTime) * 100);
          this.timeProgressFill.style.width = `${pct}%`;

          const minStr = String(Math.floor(this.timeRemaining / 60)).padStart(2, '0');
          const secStr = String(this.timeRemaining % 60).padStart(2, '0');
          this.timeCounterEl.textContent = `${minStr}:${secStr}`;

          if (this.timeRemaining <= 0) {
            this.handleTimeOut();
          }
        }
      }, 1000);

      // Create deck:
      // For 36 tiles (6x6): 9 symbols x 4 copies = 36 tiles
      // For 48 tiles (6x8): 12 symbols x 4 copies = 48 tiles
      // For 96 tiles (8x12): 24 symbols x 4 copies = 96 tiles
      const symbolCount = this.totalTiles / 4;
      const symbolsToUse = TILE_SYMBOLS.slice(0, symbolCount);

      const deck = [];
      symbolsToUse.forEach((sym) => {
        for (let i = 0; i < 4; i++) {
          deck.push({ ...sym });
        }
      });

      // Fisher-Yates shuffle
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      // Initialize grid with padded borders (cols + 2) x (rows + 2)
      this.grid = Array.from({ length: this.cols + 2 }, () =>
        Array.from({ length: this.rows + 2 }, () => null)
      );

      let deckIdx = 0;
      for (let y = 1; y <= this.rows; y++) {
        for (let x = 1; x <= this.cols; x++) {
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
      for (let y = 1; y <= this.rows; y++) {
        for (let x = 1; x <= this.cols; x++) {
          const cell = this.grid[x][y];
          const el = document.createElement('div');
          el.className = 'connect-tile';
          el.dataset.x = x;
          el.dataset.y = y;

          if (cell && cell.data) {
            el.innerHTML = `
              <span class="tile-symbol ${cell.data.css}">${cell.data.symbol}</span>
              <span class="tile-badge ${cell.data.css}">${cell.data.badge}</span>
            `;
          } else {
            el.classList.add('empty');
          }

          el.addEventListener('click', () => this.handleTileClick(x, y));
          if (cell) cell.element = el;
          this.gridContainer.appendChild(el);
        }
      }
    }

    resizeCanvas() {
      if (!this.gridWrapper || !this.canvas || !this.viewportEl) return;

      this.gridWrapper.style.transform = 'none';

      const naturalW = this.gridWrapper.offsetWidth;
      const naturalH = this.gridWrapper.offsetHeight;

      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = naturalW * dpr;
      this.canvas.height = naturalH * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const vRect = this.viewportEl.getBoundingClientRect();
      const availW = Math.max(100, vRect.width - 12);
      const availH = Math.max(100, vRect.height - 12);

      const scaleX = availW / (naturalW || 1);
      const scaleY = availH / (naturalH || 1);

      const scale = Math.min(scaleX, scaleY, 1.35);
      const finalScale = Math.max(0.35, scale);

      this.gridWrapper.style.transform = `scale(${finalScale.toFixed(3)})`;
    }

    handleTileClick(x, y) {
      if (this.isGameOver) return;
      const cell = this.grid[x][y];
      if (!cell || !cell.data) return;

      this.sound.playClick();
      this.clearHints();

      if (!this.selected) {
        this.selected = cell;
        cell.element.classList.add('selected');
        return;
      }

      if (this.selected.x === x && this.selected.y === y) {
        this.selected.element.classList.remove('selected');
        this.selected = null;
        return;
      }

      const first = this.selected;

      // Check if both tiles have identical symbol types
      if (first.data.type === cell.data.type) {
        const path = this.findConnectPath(first.x, first.y, cell.x, cell.y);
        if (path) {
          // Success link found!
          this.sound.playConnect();
          this.drawConnectingLine(path);

          first.element.classList.remove('selected');
          first.element.classList.add('matched');
          cell.element.classList.add('matched');
          this.selected = null;

          setTimeout(() => {
            first.element.className = 'connect-tile empty';
            cell.element.className = 'connect-tile empty';
            first.element.innerHTML = '';
            cell.element.innerHTML = '';
            first.data = null;
            cell.data = null;

            this.pairsLeft--;
            this.updateScore(this.score + 150);

            // Add 4s bonus time
            this.timeRemaining = Math.min(this.totalTime, this.timeRemaining + 4);

            this.checkWinCondition();
            this.ensurePlayableBoard();
          }, 240);
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
      if (x < 0 || x >= this.cols + 2 || y < 0 || y >= this.rows + 2) return true;
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
      if (this.isCellEmpty(x1, y2)) {
        if (this.isLineClear(x1, y1, x1, y2) && this.isLineClear(x1, y2, x2, y2)) {
          return [{ x: x1, y: y1 }, { x: x1, y: y2 }, { x: x2, y: y2 }];
        }
      }
      if (this.isCellEmpty(x2, y1)) {
        if (this.isLineClear(x1, y1, x2, y1) && this.isLineClear(x2, y1, x2, y2)) {
          return [{ x: x1, y: y1 }, { x: x2, y: y1 }, { x: x2, y: y2 }];
        }
      }

      // 3. Two Bends (Z or U-turn through outer border or empty interior, 2 bends)
      // Horizontal Scan: vary X from 0 to cols + 1
      for (let x = 0; x < this.cols + 2; x++) {
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

      // Vertical Scan: vary Y from 0 to rows + 1
      for (let y = 0; y < this.rows + 2; y++) {
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

    getCenterPixels(gx, gy) {
      const cLeft = this.gridContainer.offsetLeft;
      const cTop = this.gridContainer.offsetTop;
      const cWidth = this.gridContainer.offsetWidth;
      const cHeight = this.gridContainer.offsetHeight;

      if (gx >= 1 && gx <= this.cols && gy >= 1 && gy <= this.rows) {
        const cell = this.grid[gx] && this.grid[gx][gy];
        if (cell && cell.element) {
          return {
            x: cLeft + cell.element.offsetLeft + cell.element.offsetWidth / 2,
            y: cTop + cell.element.offsetTop + cell.element.offsetHeight / 2,
          };
        }
      }

      let px, py;

      if (gx <= 0) {
        px = cLeft - 8;
      } else if (gx >= this.cols + 1) {
        px = cLeft + cWidth + 8;
      } else {
        const sample = this.grid[gx] && (this.grid[gx][1] || this.grid[gx][this.rows]);
        if (sample && sample.element) {
          px = cLeft + sample.element.offsetLeft + sample.element.offsetWidth / 2;
        } else {
          px = cLeft + ((gx - 0.5) / this.cols) * cWidth;
        }
      }

      if (gy <= 0) {
        py = cTop - 8;
      } else if (gy >= this.rows + 1) {
        py = cTop + cHeight + 8;
      } else {
        const sample = this.grid[1] && this.grid[1][gy];
        if (sample && sample.element) {
          py = cTop + sample.element.offsetTop + sample.element.offsetHeight / 2;
        } else {
          py = cTop + ((gy - 0.5) / this.rows) * cHeight;
        }
      }

      return { x: px, y: py };
    }

    drawConnectingLine(path) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (!path || path.length < 2) return;

      const pts = path.map((p) => this.getCenterPixels(p.x, p.y));

      this.ctx.save();
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      // Outer glow
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

      // Inner white core
      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 3;
      this.ctx.shadowBlur = 0;
      this.ctx.beginPath();
      this.ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        this.ctx.lineTo(pts[i].x, pts[i].y);
      }
      this.ctx.stroke();

      // Nodes
      pts.forEach((pt) => {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
        this.ctx.fill();
      });

      this.ctx.restore();

      setTimeout(() => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }, 250);
    }

    getAvailablePairs() {
      const activeTiles = [];
      for (let y = 1; y <= this.rows; y++) {
        for (let x = 1; x <= this.cols; x++) {
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
        this.showToast('No possible pairs! Reshuffling...');
        setTimeout(() => this.shuffleGrid(), 800);
      }
    }

    shuffleGrid() {
      const activeCells = [];
      const symbols = [];

      for (let y = 1; y <= this.rows; y++) {
        for (let x = 1; x <= this.cols; x++) {
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
      this.showToast('Board reshuffled!');

      if (this.getAvailablePairs().length === 0) {
        setTimeout(() => this.shuffleGrid(), 300);
      }
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
        this.showToast('No pairs available! Reshuffling...');
        this.shuffleGrid();
      }
    }

    clearHints() {
      const hinted = this.gridContainer.querySelectorAll('.hinted');
      hinted.forEach((el) => el.classList.remove('hinted'));
    }

    updateScore(val) {
      this.score = val;
      this.scoreEl.textContent = this.score;
    }

    showToast(msg) {
      this.toastEl.textContent = msg;
      this.toastEl.classList.add('show');
      setTimeout(() => this.toastEl.classList.remove('show'), 2000);
    }

    handleTimeOut() {
      this.isGameOver = true;
      clearInterval(this.timerInterval);
      this.sound.playError();
      this.showToast('Time expired! Game over.');
    }

    checkWinCondition() {
      if (this.pairsLeft === 0) {
        this.isGameOver = true;
        clearInterval(this.timerInterval);
        this.sound.playWin();

        const timeInSeconds = Math.max(1, this.elapsedTime);

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
    new ConnectGame();
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initGame);
  } else {
    initGame();
  }
})();
