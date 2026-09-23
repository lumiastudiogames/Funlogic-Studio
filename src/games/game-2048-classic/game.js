/**
 * 2048 Classic - Pure Vanilla JS
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('2048_classic_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  toggle() {
    this.muted = !this.muted;
    localStorage.setItem('2048_classic_muted', this.muted);
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
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(380, t + 0.05);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc.start(t);
      osc.stop(t + 0.06);
    } else if (type === 'merge') {
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(659.25, t + 0.08);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === 'over') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.linearRampToValueAtTime(100, t + 0.25);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.25);
    } else if (type === 'win') {
      const notes = [392, 523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.connect(g);
        g.connect(this.ctx.destination);
        o.frequency.setValueAtTime(freq, t + idx * 0.1);
        g.gain.setValueAtTime(0.12, t + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.2);
        o.start(t + idx * 0.1);
        o.stop(t + idx * 0.1 + 0.2);
      });
    }
  }
}

class Game2048 {
  constructor() {
    this.size = 4;
    this.sound = new SoundEngine();
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('2048_classic_best') || '0', 10);
    this.grid = this.createEmptyGrid();
    this.previousState = null;
    this.hasWon = false;
    this.keepPlayingAfterWin = false;
    this.startTime = Date.now();
    this.timerInterval = null;
    this.elapsedSeconds = 0;

    this.cacheDOM();
    this.bindEvents();
    this.restart();
  }

  createEmptyGrid() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
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
    // Keyboard
    window.addEventListener('keydown', (e) => {
      let moved = false;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        moved = this.move('up');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        moved = this.move('down');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        moved = this.move('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        moved = this.move('right');
      }
      if (moved) this.afterMove();
    });

    // Touch Swipe
    let touchStartX = 0;
    let touchStartY = 0;
    this.boardEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.boardEl.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        if (Math.max(absX, absY) > 30) {
          let moved = false;
          if (absX > absY) {
            moved = dx > 0 ? this.move('right') : this.move('left');
          } else {
            moved = dy > 0 ? this.move('down') : this.move('up');
          }
          if (moved) this.afterMove();
        }
      }
    }, { passive: true });

    // On-screen controls
    document.querySelectorAll('.ctrl-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.dir;
        if (this.move(dir)) this.afterMove();
      });
    });

    // Header buttons
    document.getElementById('btn-restart').addEventListener('click', () => this.restart());
    document.getElementById('btn-undo').addEventListener('click', () => this.undo());
    document.getElementById('btn-sound').addEventListener('click', () => {
      const isMuted = this.sound.toggle();
      this.soundIcon.textContent = isMuted ? '🔇' : '🔊';
    });

    // Modals
    document.getElementById('btn-howto').addEventListener('click', () => {
      this.modalHowTo.classList.add('open');
    });
    document.getElementById('btn-close-howto').addEventListener('click', () => {
      this.modalHowTo.classList.remove('open');
    });
    document.getElementById('btn-continue-win').addEventListener('click', () => {
      this.modalWin.classList.remove('open');
      this.keepPlayingAfterWin = true;
    });
    document.getElementById('btn-restart-win').addEventListener('click', () => {
      this.modalWin.classList.remove('open');
      this.restart();
    });
    document.getElementById('btn-restart-over').addEventListener('click', () => {
      this.modalOver.classList.remove('open');
      this.restart();
    });
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
    this.grid = this.createEmptyGrid();
    this.score = 0;
    this.scoreEl.textContent = '0';
    this.hasWon = false;
    this.keepPlayingAfterWin = false;
    this.previousState = null;
    this.modalWin.classList.remove('open');
    this.modalOver.classList.remove('open');
    this.addRandomTile();
    this.addRandomTile();
    this.render();
    this.startTimer();
  }

  saveState() {
    this.previousState = {
      grid: this.grid.map(row => [...row]),
      score: this.score
    };
  }

  undo() {
    if (!this.previousState) return;
    this.grid = this.previousState.grid.map(row => [...row]);
    this.score = this.previousState.score;
    this.scoreEl.textContent = this.score;
    this.previousState = null;
    this.sound.play('slide');
    this.render();
  }

  addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length === 0) return false;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return { r, c, val: this.grid[r][c] };
  }

  move(direction) {
    this.saveState();
    let moved = false;
    let mergedAny = false;

    const rotate = (m) => m[0].map((_, i) => m.map(row => row[i]).reverse());

    // Normalize to moving left
    let rotations = 0;
    if (direction === 'up') rotations = 3;
    else if (direction === 'right') rotations = 2;
    else if (direction === 'down') rotations = 1;

    let tempGrid = this.grid.map(row => [...row]);
    for (let i = 0; i < rotations; i++) {
      tempGrid = rotate(tempGrid);
    }

    // Slide and merge left
    for (let r = 0; r < this.size; r++) {
      const row = tempGrid[r].filter(val => val !== 0);
      const newRow = [];
      for (let c = 0; c < row.length; c++) {
        if (c + 1 < row.length && row[c] === row[c + 1]) {
          const mergedVal = row[c] * 2;
          newRow.push(mergedVal);
          this.score += mergedVal;
          mergedAny = true;
          c++; // skip merged
        } else {
          newRow.push(row[c]);
        }
      }
      while (newRow.length < this.size) newRow.push(0);

      for (let c = 0; c < this.size; c++) {
        if (tempGrid[r][c] !== newRow[c]) moved = true;
        tempGrid[r][c] = newRow[c];
      }
    }

    // Rotate back
    const backRotations = (4 - rotations) % 4;
    for (let i = 0; i < backRotations; i++) {
      tempGrid = rotate(tempGrid);
    }

    if (moved) {
      this.grid = tempGrid;
      if (mergedAny) this.sound.play('merge');
      else this.sound.play('slide');
    } else {
      this.previousState = null; // nothing changed
    }

    return moved;
  }

  afterMove() {
    this.addRandomTile();
    this.render();

    // Update score displays
    this.scoreEl.textContent = this.score;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.bestScoreEl.textContent = this.bestScore;
      localStorage.setItem('2048_classic_best', this.bestScore);
    }

    // Check 2048 victory
    if (!this.hasWon && !this.keepPlayingAfterWin) {
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (this.grid[r][c] >= 2048) {
            this.hasWon = true;
            this.sound.play('win');
            const totalSeconds = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
            try {
              window.parent.postMessage({ type: 'win', time: totalSeconds }, '*');
            } catch (e) {}
            this.modalWin.classList.add('open');
            return;
          }
        }
      }
    }

    // Check Game Over
    if (this.isGameOver()) {
      this.sound.play('over');
      this.modalOver.classList.add('open');
    }
  }

  isGameOver() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.grid[r][c] === 0) return false;
        if (c + 1 < this.size && this.grid[r][c] === this.grid[r][c + 1]) return false;
        if (r + 1 < this.size && this.grid[r][c] === this.grid + 1 ? false : this.grid[r][c] === this.grid[r + 1][c]) return false;
      }
    }
    return true;
  }

  render() {
    this.tileLayerEl.innerHTML = '';
    const cellWidthPercent = (100 - (this.size - 1) * 2.8) / this.size;
    const gapPercent = 2.8;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.grid[r][c];
        if (val !== 0) {
          const tile = document.createElement('div');
          tile.className = `tile tile-${val > 2048 ? 'super' : val}`;
          tile.textContent = val;

          // Position via CSS transform
          const leftPercent = c * (cellWidthPercent + gapPercent);
          const topPercent = r * (cellWidthPercent + gapPercent);
          tile.style.width = `${cellWidthPercent}%`;
          tile.style.height = `${cellWidthPercent}%`;
          tile.style.transform = `translate(${leftPercent * 3.4}px, ${topPercent * 3.4}px)`;
          tile.style.left = `${leftPercent}%`;
          tile.style.top = `${topPercent}%`;

          this.tileLayerEl.appendChild(tile);
        }
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game2048();
});
