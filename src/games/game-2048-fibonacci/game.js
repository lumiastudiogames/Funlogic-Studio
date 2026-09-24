/**
 * 2048 Fibonacci Edition - Smooth Sliding & Star Particle Merge Engine
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('2048_fibo_muted') === 'true';
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  toggle() {
    this.muted = !this.muted;
    localStorage.setItem('2048_fibo_muted', this.muted);
    return this.muted;
  }
  play(type) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (type === 'slide') {
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.05);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.start(t);
      osc.stop(t + 0.05);
    } else if (type === 'merge') {
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(660, t + 0.09);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      osc.start(t);
      osc.stop(t + 0.09);
    } else if (type === 'win') {
      [330, 440, 554, 660, 880].forEach((f, i) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.connect(g);
        g.connect(this.ctx.destination);
        o.frequency.setValueAtTime(f, t + i * 0.09);
        g.gain.setValueAtTime(0.12, t + i * 0.09);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.2);
        o.start(t + i * 0.09);
        o.stop(t + i * 0.09 + 0.2);
      });
    }
  }
}

class Game2048Fibonacci {
  constructor() {
    this.size = 4;
    this.FIBO = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181];
    this.sound = new SoundEngine();
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('fibo2048_best') || '0', 10);
    this.tiles = [];
    this.tileIdCounter = 1;
    this.previousState = null;
    this.hasWon = false;
    this.keepPlaying = false;
    this.startTime = Date.now();
    this.timerInterval = null;
    this.elapsedSeconds = 0;

    this.cacheDOM();
    this.bindEvents();
    this.restart();
  }

  cacheDOM() {
    this.boardEl = document.getElementById('board-container');
    this.tileLayerEl = document.getElementById('tile-layer');
    this.scoreEl = document.getElementById('current-score');
    this.bestScoreEl = document.getElementById('best-score');
    this.timerEl = document.getElementById('timer-val');
    this.soundIcon = document.getElementById('sound-icon');
    this.modalWin = document.getElementById('modal-win');
    this.modalOver = document.getElementById('modal-over');
    this.modalHowTo = document.getElementById('modal-howto');
    this.bestScoreEl.textContent = this.bestScore;
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      let dir = null;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') dir = 0;
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') dir = 1;
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dir = 2;
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') dir = 3;

      if (dir !== null) {
        e.preventDefault();
        this.move(dir);
      }
    });

    let isPointerDown = false;
    let startX = 0;
    let startY = 0;
    const MIN_DRAG = 20;

    this.boardEl.addEventListener('pointerdown', (e) => {
      isPointerDown = true;
      startX = e.clientX;
      startY = e.clientY;
      this.boardEl.setPointerCapture?.(e.pointerId);
    }, { passive: true });

    this.boardEl.addEventListener('pointerup', (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (Math.hypot(dx, dy) >= MIN_DRAG) {
        if (Math.abs(dx) > Math.abs(dy)) {
          this.move(dx > 0 ? 1 : 3);
        } else {
          this.move(dy > 0 ? 2 : 0);
        }
      }
    }, { passive: true });

    this.boardEl.addEventListener('pointercancel', () => {
      isPointerDown = false;
    }, { passive: true });

    document.getElementById('btn-restart').addEventListener('click', () => this.restart());
    document.getElementById('btn-undo').addEventListener('click', () => this.undo());
    document.getElementById('btn-sound').addEventListener('click', () => {
      const isMuted = this.sound.toggle();
      this.soundIcon.textContent = isMuted ? '🔇' : '🔊';
    });

    document.getElementById('btn-howto').addEventListener('click', () => this.modalHowTo.classList.add('open'));
    document.getElementById('btn-close-howto').addEventListener('click', () => this.modalHowTo.classList.remove('open'));
    document.getElementById('btn-continue-win').addEventListener('click', () => {
      this.modalWin.classList.remove('open');
      this.keepPlaying = true;
    });
    document.getElementById('btn-restart-win').addEventListener('click', () => {
      this.modalWin.classList.remove('open');
      this.restart();
    });
    document.getElementById('btn-restart-over').addEventListener('click', () => {
      this.modalOver.classList.remove('open');
      this.restart();
    });

    window.addEventListener('resize', () => this.render());
  }

  canMerge(a, b) {
    if (a === 1 && b === 1) return 2;
    const idxA = this.FIBO.indexOf(a);
    const idxB = this.FIBO.indexOf(b);
    if (idxA > 0 && idxB > 0 && Math.abs(idxA - idxB) === 1) {
      return this.FIBO[Math.max(idxA, idxB) + 1];
    }
    return false;
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.elapsedSeconds = 0;
    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
      const m = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
      const s = String(this.elapsedSeconds % 60).padStart(2, '0');
      this.timerEl.textContent = `${m}:${s}`;
    }, 1000);
  }

  restart() {
    this.tiles = [];
    this.tileIdCounter = 1;
    this.score = 0;
    this.scoreEl.textContent = '0';
    this.hasWon = false;
    this.keepPlaying = false;
    this.previousState = null;
    document.getElementById('btn-undo').disabled = true;
    this.modalWin.classList.remove('open');
    this.modalOver.classList.remove('open');
    this.spawnTile();
    this.spawnTile();
    this.render();
    this.startTimer();
  }

  saveState() {
    this.previousState = {
      tiles: this.tiles.map(t => ({ ...t })),
      score: this.score
    };
    document.getElementById('btn-undo').disabled = false;
  }

  undo() {
    if (!this.previousState) return;
    this.tiles = this.previousState.tiles.map(t => ({ ...t }));
    this.score = this.previousState.score;
    this.scoreEl.textContent = this.score;
    this.previousState = null;
    document.getElementById('btn-undo').disabled = true;
    this.sound.play('slide');
    this.render();
  }

  getTileAt(r, c) {
    return this.tiles.find(t => t.r === r && t.c === c);
  }

  spawnTile() {
    const emptyCells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.getTileAt(r, c)) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return null;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const val = Math.random() < 0.85 ? 1 : 2;
    const newTile = {
      id: this.tileIdCounter++,
      r,
      c,
      val,
      prevR: r,
      prevC: c,
      isNew: true
    };
    this.tiles.push(newTile);
    return newTile;
  }

  spawnStarParticles(r, c, val) {
    const containerRect = this.tileLayerEl.getBoundingClientRect();
    const cellW = (containerRect.width - (this.size - 1) * 10) / this.size;
    const cellH = (containerRect.height - (this.size - 1) * 10) / this.size;
    const x = c * (cellW + 10) + cellW / 2;
    const y = r * (cellH + 10) + cellH / 2;

    const count = 8;
    const stars = ['✨', '⭐', '🌟', '✦', '★'];
    const palette = ['#ffd700', '#ff9f43', '#10b981', '#38bdf8', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      star.className = 'star-sparkle';
      star.textContent = stars[Math.floor(Math.random() * stars.length)];

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const distance = 20 + Math.random() * 32;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const color = palette[Math.floor(Math.random() * palette.length)];

      star.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        font-size: ${12 + Math.random() * 8}px;
        color: ${color};
        text-shadow: 0 0 8px ${color};
        pointer-events: none;
        z-index: 100;
        transform: translate(-50%, -50%) scale(0.2);
        opacity: 1;
        transition: transform 0.4s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.4s ease-out;
      `;

      this.tileLayerEl.appendChild(star);

      requestAnimationFrame(() => {
        star.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${0.7 + Math.random() * 0.6}) rotate(${(Math.random() - 0.5) * 140}deg)`;
        star.style.opacity = '0';
      });

      setTimeout(() => star.remove(), 420);
    }
  }

  move(direction) {
    this.saveState();

    let moved = false;
    let totalScoreAdded = 0;
    const mergedPositions = [];

    const rows = [0, 1, 2, 3];
    const cols = [0, 1, 2, 3];
    if (direction === 2) rows.reverse();
    if (direction === 1) cols.reverse();

    const board = Array.from({ length: this.size }, () => Array(this.size).fill(null));
    this.tiles.forEach(t => {
      board[t.r][t.c] = t;
      t.prevR = t.r;
      t.prevC = t.c;
    });

    rows.forEach(r => {
      cols.forEach(c => {
        const tile = board[r][c];
        if (!tile) return;

        let nextR = r;
        let nextC = c;

        while (true) {
          const testR = nextR + (direction === 0 ? -1 : direction === 2 ? 1 : 0);
          const testC = nextC + (direction === 3 ? -1 : direction === 1 ? 1 : 0);

          if (testR < 0 || testR >= this.size || testC < 0 || testC >= this.size) break;

          const target = board[testR][testC];
          if (!target) {
            board[nextR][nextC] = null;
            board[testR][testC] = tile;
            nextR = testR;
            nextC = testC;
            moved = true;
          } else {
            const nextVal = (!target.hasMerged && !tile.hasMerged) ? this.canMerge(target.val, tile.val) : false;
            if (nextVal) {
              board[nextR][nextC] = null;
              board[testR][testC] = {
                id: this.tileIdCounter++,
                r: testR,
                c: testC,
                val: nextVal,
                prevR: r,
                prevC: c,
                isMerged: true,
                hasMerged: true
              };
              totalScoreAdded += nextVal;
              mergedPositions.push({ r: testR, c: testC, val: nextVal });
              moved = true;
              break;
            } else {
              break;
            }
          }
        }
      });
    });

    if (moved) {
      const finalTiles = [];
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (board[r][c]) {
            board[r][c].r = r;
            board[r][c].c = c;
            delete board[r][c].hasMerged;
            finalTiles.push(board[r][c]);
          }
        }
      }
      this.tiles = finalTiles;

      if (totalScoreAdded > 0) {
        this.sound.play('merge');
      } else {
        this.sound.play('slide');
      }

      this.score += totalScoreAdded;
      this.scoreEl.textContent = this.score;
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        this.bestScoreEl.textContent = this.bestScore;
        localStorage.setItem('fibo2048_best', this.bestScore.toString());
      }

      this.spawnTile();
      this.render();

      mergedPositions.forEach(p => {
        this.spawnStarParticles(p.r, p.c, p.val);
      });

      if (!this.hasWon && !this.keepPlaying && this.tiles.some(t => t.val >= 2584)) {
        this.hasWon = true;
        this.sound.play('win');
        const totalSecs = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
        try {
          window.parent.postMessage({ type: 'win', time: totalSecs }, '*');
        } catch (e) {}
        this.modalWin.classList.add('open');
      } else if (this.isGameOver()) {
        this.modalOver.classList.add('open');
      }
    } else {
      this.previousState = null;
      document.getElementById('btn-undo').disabled = true;
    }
  }

  isGameOver() {
    if (this.tiles.length < this.size * this.size) return false;
    const grid = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.tiles.forEach(t => grid[t.r][t.c] = t.val);

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (c + 1 < this.size && this.canMerge(grid[r][c], grid[r][c + 1])) return false;
        if (r + 1 < this.size && this.canMerge(grid[r][c], grid[r + 1][c])) return false;
      }
    }
    return true;
  }

  render() {
    this.tileLayerEl.innerHTML = '';
    const containerW = this.tileLayerEl.clientWidth;
    const gap = 10;
    const cellW = (containerW - (this.size - 1) * gap) / this.size;

    this.tiles.forEach(tile => {
      const el = document.createElement('div');
      const val = tile.val;
      const classKey = val <= 2584 ? `tile-${val}` : 'tile-super';
      el.className = `tile ${classKey}`;
      if (tile.isNew) el.classList.add('tile-new');
      if (tile.isMerged) el.classList.add('tile-merged');

      el.textContent = val;
      el.style.width = `${cellW}px`;
      el.style.height = `${cellW}px`;

      const x = tile.c * (cellW + gap);
      const y = tile.r * (cellW + gap);

      if (tile.prevR !== undefined && (tile.prevR !== tile.r || tile.prevC !== tile.c)) {
        const prevX = tile.prevC * (cellW + gap);
        const prevY = tile.prevR * (cellW + gap);
        el.style.transform = `translate(${prevX}px, ${prevY}px)`;
        requestAnimationFrame(() => {
          el.style.transform = `translate(${x}px, ${y}px)`;
        });
      } else {
        el.style.transform = `translate(${x}px, ${y}px)`;
      }

      this.tileLayerEl.appendChild(el);
    });

    this.tiles.forEach(t => {
      t.isNew = false;
      t.isMerged = false;
      t.prevR = t.r;
      t.prevC = t.c;
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game2048Fibonacci();
});
