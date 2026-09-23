/**
 * 15 Puzzle Classic - Pure Vanilla JS
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('puzzle15_muted') === 'true';
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  toggle() {
    this.muted = !this.muted;
    localStorage.setItem('puzzle15_muted', this.muted);
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
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(540, t + 0.05);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.start(t);
      osc.stop(t + 0.05);
    } else if (type === 'win') {
      [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
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

class SlidingPuzzle15 {
  constructor() {
    this.sound = new SoundEngine();
    this.board = [];
    this.emptyIdx = 15;
    this.moves = 0;
    this.bestMoves = parseInt(localStorage.getItem('puzzle15_best_moves') || '9999', 10);
    this.elapsedSeconds = 0;
    this.timerInterval = null;
    this.startTime = Date.now();
    this.isWon = false;
    this.history = [];

    this.cacheDOM();
    this.bindEvents();
    this.shuffleAndStart();
  }

  cacheDOM() {
    this.boardEl = document.getElementById('board-container');
    this.movesEl = document.getElementById('moves-val');
    this.timerEl = document.getElementById('timer-val');
    this.soundIcon = document.getElementById('sound-icon');
    this.modalWin = document.getElementById('modal-win');
    this.modalHowTo = document.getElementById('modal-howto');
    this.winMovesEl = document.getElementById('win-moves');
    this.winTimeEl = document.getElementById('win-time');
  }

  bindEvents() {
    document.getElementById('btn-shuffle').addEventListener('click', () => this.shuffleAndStart());
    document.getElementById('btn-undo').addEventListener('click', () => this.undo());
    document.getElementById('btn-sound').addEventListener('click', () => {
      const muted = this.sound.toggle();
      this.soundIcon.textContent = muted ? '🔇' : '🔊';
    });
    document.getElementById('btn-howto').addEventListener('click', () => this.modalHowTo.classList.add('open'));
    document.getElementById('btn-close-howto').addEventListener('click', () => this.modalHowTo.classList.remove('open'));
    document.getElementById('btn-play-again').addEventListener('click', () => {
      this.modalWin.classList.remove('open');
      this.shuffleAndStart();
    });

    window.addEventListener('keydown', (e) => {
      if (this.isWon) return;
      const emptyRow = Math.floor(this.emptyIdx / 4);
      const emptyCol = this.emptyIdx % 4;
      let targetIdx = -1;

      if (e.key === 'ArrowUp' || e.key === 'w') {
        // Tile BELOW moves UP into empty
        if (emptyRow < 3) targetIdx = (emptyRow + 1) * 4 + emptyCol;
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        // Tile ABOVE moves DOWN into empty
        if (emptyRow > 0) targetIdx = (emptyRow - 1) * 4 + emptyCol;
      } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        // Tile RIGHT moves LEFT into empty
        if (emptyCol < 3) targetIdx = emptyRow * 4 + (emptyCol + 1);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        // Tile LEFT moves RIGHT into empty
        if (emptyCol > 0) targetIdx = emptyRow * 4 + (emptyCol - 1);
      }

      if (targetIdx !== -1) {
        e.preventDefault();
        this.slide(targetIdx);
      }
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

  shuffleAndStart() {
    this.board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
    this.emptyIdx = 15;
    this.moves = 0;
    this.movesEl.textContent = '0';
    this.isWon = false;
    this.history = [];
    this.modalWin.classList.remove('open');

    // Make 220 authentic valid slides to ensure solvable board
    let lastMove = -1;
    for (let step = 0; step < 220; step++) {
      const neighbors = this.getNeighbors(this.emptyIdx).filter(idx => idx !== lastMove);
      const chosen = neighbors[Math.floor(Math.random() * neighbors.length)];
      lastMove = this.emptyIdx;
      this.swap(chosen, this.emptyIdx);
      this.emptyIdx = chosen;
    }

    this.render();
    this.startTimer();
  }

  getNeighbors(idx) {
    const row = Math.floor(idx / 4);
    const col = idx % 4;
    const res = [];
    if (row > 0) res.push((row - 1) * 4 + col);
    if (row < 3) res.push((row + 1) * 4 + col);
    if (col > 0) res.push(row * 4 + (col - 1));
    if (col < 3) res.push(row * 4 + (col + 1));
    return res;
  }

  swap(i, j) {
    const tmp = this.board[i];
    this.board[i] = this.board[j];
    this.board[j] = tmp;
  }

  slide(idx) {
    if (this.isWon) return;
    const neighbors = this.getNeighbors(this.emptyIdx);
    if (!neighbors.includes(idx)) return;

    this.history.push({ board: [...this.board], emptyIdx: this.emptyIdx });
    this.swap(idx, this.emptyIdx);
    this.emptyIdx = idx;
    this.moves++;
    this.movesEl.textContent = this.moves;
    this.sound.play('slide');
    this.render();
    this.checkWin();
  }

  undo() {
    if (this.history.length === 0 || this.isWon) return;
    const prev = this.history.pop();
    this.board = prev.board;
    this.emptyIdx = prev.emptyIdx;
    this.moves = Math.max(0, this.moves - 1);
    this.movesEl.textContent = this.moves;
    this.sound.play('slide');
    this.render();
  }

  checkWin() {
    for (let i = 0; i < 15; i++) {
      if (this.board[i] !== i + 1) return false;
    }
    if (this.board[15] !== 0) return false;

    this.isWon = true;
    clearInterval(this.timerInterval);
    this.sound.play('win');

    const totalSecs = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
    try {
      window.parent.postMessage({ type: 'win', time: totalSecs }, '*');
    } catch (e) {}

    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    this.winMovesEl.textContent = this.moves;
    this.winTimeEl.textContent = `${m}m ${s}s`;
    this.modalWin.classList.add('open');
    return true;
  }

  render() {
    this.boardEl.innerHTML = '';
    for (let idx = 0; idx < 16; idx++) {
      const val = this.board[idx];
      if (val !== 0) {
        const row = Math.floor(idx / 4);
        const col = idx % 4;

        const tileEl = document.createElement('div');
        tileEl.className = 'tile-15';
        if (val === idx + 1) tileEl.classList.add('tile-correct');

        tileEl.style.transform = `translate(${col * 100}%, ${row * 100}%)`;

        const inner = document.createElement('div');
        inner.className = 'tile-inner';
        inner.textContent = val;
        tileEl.appendChild(inner);

        tileEl.addEventListener('click', () => {
          // Find current index of this tile
          const currentIdx = this.board.indexOf(val);
          this.slide(currentIdx);
        });

        this.boardEl.appendChild(tileEl);
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new SlidingPuzzle15();
});
