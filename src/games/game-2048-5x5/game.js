/**
 * 2048 5x5 Expert - Pure Vanilla JS
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('2048_5x5_muted') === 'true';
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  toggle() {
    this.muted = !this.muted;
    localStorage.setItem('2048_5x5_muted', this.muted);
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
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(450, t + 0.05);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.start(t);
      osc.stop(t + 0.05);
    } else if (type === 'merge') {
      osc.frequency.setValueAtTime(520, t);
      osc.frequency.exponentialRampToValueAtTime(780, t + 0.08);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === 'over') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.linearRampToValueAtTime(80, t + 0.25);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.25);
    } else if (type === 'win') {
      [440, 554.37, 659.25, 880].forEach((f, i) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.connect(g);
        g.connect(this.ctx.destination);
        o.frequency.setValueAtTime(f, t + i * 0.1);
        g.gain.setValueAtTime(0.12, t + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.2);
        o.start(t + i * 0.1);
        o.stop(t + i * 0.1 + 0.2);
      });
    }
  }
}

class Game2048_5x5 {
  constructor() {
    this.size = 5;
    this.sound = new SoundEngine();
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('2048_5x5_best') || '0', 10);
    this.grid = this.createEmptyGrid();
    this.previousState = null;
    this.hasWon = false;
    this.keepPlaying = false;
    this.elapsedSeconds = 0;
    this.startTime = Date.now();

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
    window.addEventListener('keydown', (e) => {
      let moved = false;
      if (['ArrowUp', 'w', 'W'].includes(e.key)) { e.preventDefault(); moved = this.move('up'); }
      else if (['ArrowDown', 's', 'S'].includes(e.key)) { e.preventDefault(); moved = this.move('down'); }
      else if (['ArrowLeft', 'a', 'A'].includes(e.key)) { e.preventDefault(); moved = this.move('left'); }
      else if (['ArrowRight', 'd', 'D'].includes(e.key)) { e.preventDefault(); moved = this.move('right'); }
      if (moved) this.afterMove();
    });

    let touchStartX = 0, touchStartY = 0;
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
        if (Math.max(absX, absY) > 25) {
          const moved = absX > absY ? (dx > 0 ? this.move('right') : this.move('left')) : (dy > 0 ? this.move('down') : this.move('up'));
          if (moved) this.afterMove();
        }
      }
    }, { passive: true });

    document.querySelectorAll('.ctrl-btn').forEach(b => {
      b.addEventListener('click', () => {
        if (this.move(b.dataset.dir)) this.afterMove();
      });
    });

    document.getElementById('btn-restart').addEventListener('click', () => this.restart());
    document.getElementById('btn-undo').addEventListener('click', () => this.undo());
    document.getElementById('btn-sound').addEventListener('click', () => {
      const muted = this.sound.toggle();
      this.soundIcon.textContent = muted ? '🔇' : '🔊';
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
    this.keepPlaying = false;
    this.previousState = null;
    this.modalWin.classList.remove('open');
    this.modalOver.classList.remove('open');
    this.addRandomTile();
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
    this.grid[r][c] = Math.random() < 0.85 ? 2 : 4;
    return true;
  }

  move(dir) {
    this.saveState();
    let moved = false;
    let mergedAny = false;

    const rotate = (m) => m[0].map((_, i) => m.map(row => row[i]).reverse());
    let rotations = 0;
    if (dir === 'up') rotations = 3;
    else if (dir === 'right') rotations = 2;
    else if (dir === 'down') rotations = 1;

    let temp = this.grid.map(r => [...r]);
    for (let i = 0; i < rotations; i++) temp = rotate(temp);

    for (let r = 0; r < this.size; r++) {
      const row = temp[r].filter(v => v !== 0);
      const newRow = [];
      for (let c = 0; c < row.length; c++) {
        if (c + 1 < row.length && row[c] === row[c + 1]) {
          const mVal = row[c] * 2;
          newRow.push(mVal);
          this.score += mVal;
          mergedAny = true;
          c++;
        } else {
          newRow.push(row[c]);
        }
      }
      while (newRow.length < this.size) newRow.push(0);
      for (let c = 0; c < this.size; c++) {
        if (temp[r][c] !== newRow[c]) moved = true;
        temp[r][c] = newRow[c];
      }
    }

    const backRotations = (4 - rotations) % 4;
    for (let i = 0; i < backRotations; i++) temp = rotate(temp);

    if (moved) {
      this.grid = temp;
      if (mergedAny) this.sound.play('merge');
      else this.sound.play('slide');
    } else {
      this.previousState = null;
    }
    return moved;
  }

  afterMove() {
    this.addRandomTile();
    this.render();

    this.scoreEl.textContent = this.score;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.bestScoreEl.textContent = this.bestScore;
      localStorage.setItem('2048_5x5_best', this.bestScore);
    }

    if (!this.hasWon && !this.keepPlaying) {
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (this.grid[r][c] >= 4096) {
            this.hasWon = true;
            this.sound.play('win');
            const totalSecs = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
            try {
              window.parent.postMessage({ type: 'win', time: totalSecs }, '*');
            } catch (e) {}
            this.modalWin.classList.add('open');
            return;
          }
        }
      }
    }

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
        if (r + 1 < this.size && this.grid[r][c] === this.grid[r + 1][c]) return false;
      }
    }
    return true;
  }

  render() {
    this.tileLayerEl.innerHTML = '';
    const gap = 2;
    const cellSize = (100 - gap * (this.size - 1)) / this.size;

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.grid[r][c];
        if (val !== 0) {
          const tile = document.createElement('div');
          tile.className = `tile tile-${val > 4096 ? 'super' : val}`;
          tile.textContent = val;

          const left = c * (cellSize + gap);
          const top = r * (cellSize + gap);
          tile.style.width = `${cellSize}%`;
          tile.style.height = `${cellSize}%`;
          tile.style.left = `${left}%`;
          tile.style.top = `${top}%`;

          this.tileLayerEl.appendChild(tile);
        }
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game2048_5x5();
});
