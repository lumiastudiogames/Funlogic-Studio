/**
 * 15 Puzzle Classic - Smooth Sliding & Star Particle Collision System
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
      osc.frequency.exponentialRampToValueAtTime(540, t + 0.06);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc.start(t);
      osc.stop(t + 0.06);
    } else if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, t); // D5
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.09); // A5
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      osc.start(t);
      osc.stop(t + 0.09);
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
    this.tileElements = {}; // Map of tile value (1..15) -> DOM Element

    this.cacheDOM();
    this.bindEvents();
    this.initBoardDOM();
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

  initBoardDOM() {
    this.boardEl.innerHTML = '';
    for (let val = 1; val <= 15; val++) {
      const tileEl = document.createElement('div');
      tileEl.className = 'tile-15';
      tileEl.setAttribute('data-val', val);

      const inner = document.createElement('div');
      inner.className = 'tile-inner';
      inner.textContent = val;
      tileEl.appendChild(inner);

      tileEl.addEventListener('click', () => {
        const currentIdx = this.board.indexOf(val);
        this.slide(currentIdx);
      });

      this.tileElements[val] = tileEl;
      this.boardEl.appendChild(tileEl);
    }
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

    // Arrow keys & WASD
    window.addEventListener('keydown', (e) => {
      if (this.isWon) return;
      const row = Math.floor(this.emptyIdx / 4);
      const col = this.emptyIdx % 4;
      let targetIdx = -1;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (row < 3) targetIdx = (row + 1) * 4 + col; // Slide tile below UP into empty
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        if (row > 0) targetIdx = (row - 1) * 4 + col; // Slide tile above DOWN into empty
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        if (col < 3) targetIdx = row * 4 + (col + 1); // Slide tile to right LEFT into empty
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        if (col > 0) targetIdx = row * 4 + (col - 1); // Slide tile to left RIGHT into empty
      }

      if (targetIdx !== -1) {
        e.preventDefault();
        this.slide(targetIdx);
      }
    });

    // Touch swipe on board
    let touchStartX = 0;
    let touchStartY = 0;
    this.boardEl.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    this.boardEl.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.hypot(dx, dy) > 25) {
        const row = Math.floor(this.emptyIdx / 4);
        const col = this.emptyIdx % 4;
        let targetIdx = -1;
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0 && col > 0) targetIdx = row * 4 + (col - 1);
          else if (dx < 0 && col < 3) targetIdx = row * 4 + (col + 1);
        } else {
          if (dy > 0 && row > 0) targetIdx = (row - 1) * 4 + col;
          else if (dy < 0 && row < 3) targetIdx = (row + 1) * 4 + col;
        }
        if (targetIdx !== -1) {
          this.slide(targetIdx);
        }
      }
    }, { passive: true });
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

    this.render(false); // No animation during initial shuffle layout
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

    const val = this.board[idx];
    const destinationIdx = this.emptyIdx;

    this.history.push({ board: [...this.board], emptyIdx: this.emptyIdx });
    this.swap(idx, this.emptyIdx);
    this.emptyIdx = idx;
    this.moves++;
    this.movesEl.textContent = this.moves;

    const isNowCorrect = val === destinationIdx + 1;
    if (isNowCorrect) {
      this.sound.play('correct');
    } else {
      this.sound.play('slide');
    }

    this.render(true);

    // Trigger star sparkle collision effects at destination
    const destRow = Math.floor(destinationIdx / 4);
    const destCol = destinationIdx % 4;
    this.spawnSparkleAt(destCol, destRow, isNowCorrect);

    this.checkWin();
  }

  spawnSparkleAt(col, row, isGold = false) {
    const rect = this.boardEl.getBoundingClientRect();
    const cellW = rect.width / 4;
    const cellH = rect.height / 4;
    const x = col * cellW + cellW / 2;
    const y = row * cellH + cellH / 2;

    const stars = ['✨', '⭐', '🌟', '✦', '★'];
    const palette = isGold 
      ? ['#facc15', '#fef08a', '#10b981', '#34d399', '#ffffff'] 
      : ['#38bdf8', '#818cf8', '#f472b6', '#34d399', '#fbbf24', '#ffffff'];

    const count = isGold ? 10 : 6;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      star.className = 'star-particle';
      star.textContent = stars[Math.floor(Math.random() * stars.length)];

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const dist = (isGold ? 28 : 20) + Math.random() * 25;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const color = palette[Math.floor(Math.random() * palette.length)];
      const size = 12 + Math.random() * 10;

      star.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        font-size: ${size}px;
        color: ${color};
        text-shadow: 0 0 6px ${color};
        pointer-events: none;
        z-index: 99;
        transform: translate(-50%, -50%) scale(0.2);
        opacity: 1;
        transition: transform 0.4s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.4s ease-out;
      `;

      this.boardEl.appendChild(star);

      requestAnimationFrame(() => {
        star.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${0.7 + Math.random() * 0.6}) rotate(${(Math.random() - 0.5) * 120}deg)`;
        star.style.opacity = '0';
      });

      setTimeout(() => star.remove(), 420);
    }
  }

  undo() {
    if (this.history.length === 0 || this.isWon) return;
    const prev = this.history.pop();
    this.board = prev.board;
    this.emptyIdx = prev.emptyIdx;
    this.moves = Math.max(0, this.moves - 1);
    this.movesEl.textContent = this.moves;
    this.sound.play('slide');
    this.render(true);
  }

  checkWin() {
    for (let i = 0; i < 15; i++) {
      if (this.board[i] !== i + 1) return false;
    }
    if (this.board[15] !== 0) return false;

    this.isWon = true;
    clearInterval(this.timerInterval);
    this.sound.play('win');

    // Super win star shower across entire board
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        setTimeout(() => this.spawnSparkleAt(c, r, true), (r * 4 + c) * 40);
      }
    }

    const totalSecs = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
    try {
      window.parent.postMessage({ type: 'win', time: totalSecs }, '*');
    } catch (e) {}

    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    this.winMovesEl.textContent = this.moves;
    this.winTimeEl.textContent = `${m}m ${s}s`;
    setTimeout(() => {
      this.modalWin.classList.add('open');
    }, 450);
    return true;
  }

  render(animate = true) {
    for (let idx = 0; idx < 16; idx++) {
      const val = this.board[idx];
      if (val !== 0 && this.tileElements[val]) {
        const row = Math.floor(idx / 4);
        const col = idx % 4;
        const el = this.tileElements[val];

        if (!animate) {
          el.style.transition = 'none';
        } else {
          el.style.transition = 'transform 0.14s cubic-bezier(0.2, 0, 0, 1)';
        }

        el.style.transform = `translate(${col * 100}%, ${row * 100}%)`;

        if (val === idx + 1) {
          el.classList.add('tile-correct');
        } else {
          el.classList.remove('tile-correct');
        }
      }
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new SlidingPuzzle15();
});
