/**
 * Sudoku Classic 9x9 - Pure Vanilla JS
 */

// Procedural Audio Engine
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('sudoku_classic_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('sudoku_classic_muted', this.muted);
    return this.muted;
  }

  play(type) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    if (type === 'tap') {
      osc.frequency.setValueAtTime(440, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc.start(t);
      osc.stop(t + 0.06);
    } else if (type === 'place') {
      osc.frequency.setValueAtTime(587.33, t); // D5
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === 'erase') {
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.linearRampToValueAtTime(220, t + 0.08);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.start(t);
      osc.stop(t + 0.08);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.2);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.connect(g);
        g.connect(this.ctx.destination);
        o.frequency.setValueAtTime(freq, t + idx * 0.1);
        g.gain.setValueAtTime(0.12, t + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.25);
        o.start(t + idx * 0.1);
        o.stop(t + idx * 0.1 + 0.25);
      });
    }
  }
}

// Sudoku Logic Generator & Solver
class SudokuGenerator {
  static solve(board) {
    const empty = this.findEmpty(board);
    if (!empty) return true;
    const [row, col] = empty;
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

    for (const num of digits) {
      if (this.isValid(board, row, col, num)) {
        board[row][col] = num;
        if (this.solve(board)) return true;
        board[row][col] = 0;
      }
    }
    return false;
  }

  static findEmpty(board) {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) return [r, c];
      }
    }
    return null;
  }

  static isValid(board, row, col, num) {
    for (let c = 0; c < 9; c++) {
      if (board[row][c] === num) return false;
    }
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[boxRow + r][boxCol + c] === num) return false;
      }
    }
    return true;
  }

  static generatePuzzle(givensCount = 35) {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.solve(board);
    const solution = board.map(r => [...r]);

    const puzzle = board.map(r => [...r]);
    const cells = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        cells.push([r, c]);
      }
    }
    cells.sort(() => Math.random() - 0.5);

    const removals = 81 - givensCount;
    for (let i = 0; i < removals && i < cells.length; i++) {
      const [r, c] = cells[i];
      puzzle[r][c] = 0;
    }

    return { puzzle, solution };
  }
}

// Main Game Controller
class SudokuGame {
  constructor() {
    this.sound = new SoundEngine();
    this.difficulty = 'easy'; // easy: 35, medium: 30, hard: 25
    this.difficultyGivens = { easy: 35, medium: 30, hard: 25 };
    this.puzzle = [];
    this.solution = [];
    this.userGrid = [];
    this.notes = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));
    this.selectedCell = null;
    this.notesMode = false;
    this.errorsCount = 0;
    this.moveHistory = [];
    this.timerInterval = null;
    this.elapsedSeconds = 0;
    this.gameWon = false;
    this.startTime = Date.now();

    this.cacheDOM();
    this.bindEvents();
    this.newGame(this.difficulty);
  }

  cacheDOM() {
    this.gridEl = document.getElementById('sudoku-grid');
    this.timerEl = document.getElementById('timer-display');
    this.errorsEl = document.getElementById('errors-display');
    this.btnNotes = document.getElementById('btn-notes');
    this.btnSound = document.getElementById('btn-sound-toggle');
    this.soundIcon = document.getElementById('sound-icon');
    this.modalAd = document.getElementById('modal-ad');
    this.modalHowTo = document.getElementById('modal-howto');
    this.modalWin = document.getElementById('modal-win');
    this.adCountdownEl = document.getElementById('ad-countdown');
    this.adProgressEl = document.getElementById('ad-progress');
    this.btnClaimHint = document.getElementById('btn-claim-hint');
    this.winTimeEl = document.getElementById('win-time');
    this.winErrorsEl = document.getElementById('win-errors');
  }

  bindEvents() {
    // Digit pad clicks
    document.querySelectorAll('.digit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const digit = parseInt(btn.dataset.digit, 10);
        this.inputDigit(digit);
      });
    });

    // Action buttons
    document.getElementById('btn-erase').addEventListener('click', () => this.eraseCell());
    document.getElementById('btn-undo').addEventListener('click', () => this.undoMove());
    this.btnNotes.addEventListener('click', () => this.toggleNotes());
    document.getElementById('btn-hint').addEventListener('click', () => this.openHintAdModal());

    // Difficulties
    document.querySelectorAll('.diff-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.diff-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.difficulty = pill.dataset.diff;
        this.newGame(this.difficulty);
      });
    });

    // Sound toggle
    this.btnSound.addEventListener('click', () => {
      const isMuted = this.sound.toggleMute();
      this.soundIcon.textContent = isMuted ? '🔇' : '🔊';
    });

    // Modals
    document.getElementById('btn-howto').addEventListener('click', () => {
      this.modalHowTo.classList.add('open');
    });
    document.getElementById('btn-close-howto').addEventListener('click', () => {
      this.modalHowTo.classList.remove('open');
    });
    document.getElementById('btn-skip-ad').addEventListener('click', () => {
      this.closeHintAdModal();
    });
    this.btnClaimHint.addEventListener('click', () => {
      this.claimHint();
    });
    document.getElementById('btn-play-again').addEventListener('click', () => {
      this.modalWin.classList.remove('open');
      this.newGame(this.difficulty);
    });

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      if (this.gameWon) return;
      if (e.key >= '1' && e.key <= '9') {
        this.inputDigit(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        this.eraseCell();
      } else if (e.key.toLowerCase() === 'n') {
        this.toggleNotes();
      } else if (e.key.toLowerCase() === 'z' && (e.ctrlKey || e.metaKey)) {
        this.undoMove();
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.moveSelection(e.key);
      }
    });
  }

  startTimer() {
    clearInterval(this.timerInterval);
    this.elapsedSeconds = 0;
    this.startTime = Date.now();
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
      this.updateTimerDisplay();
    }, 1000);
  }

  updateTimerDisplay() {
    const mins = String(Math.floor(this.elapsedSeconds / 60)).padStart(2, '0');
    const secs = String(this.elapsedSeconds % 60).padStart(2, '0');
    this.timerEl.textContent = `${mins}:${secs}`;
  }

  newGame(diff = 'easy') {
    this.difficulty = diff;
    const givens = this.difficultyGivens[diff] || 35;
    const generated = SudokuGenerator.generatePuzzle(givens);
    this.puzzle = generated.puzzle;
    this.solution = generated.solution;
    this.userGrid = this.puzzle.map(row => [...row]);
    this.notes = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()));
    this.moveHistory = [];
    this.errorsCount = 0;
    this.errorsEl.textContent = '0';
    this.selectedCell = null;
    this.gameWon = false;
    this.startTimer();
    this.renderBoard();
    this.updateDigitButtons();
  }

  renderBoard() {
    this.gridEl.innerHTML = '';
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = r;
        cell.dataset.col = c;

        const val = this.userGrid[r][c];
        const isGiven = this.puzzle[r][c] !== 0;

        if (isGiven) {
          cell.classList.add('given');
          cell.innerHTML = `<span class="cell-digit">${val}</span>`;
        } else if (val !== 0) {
          cell.classList.add('user-filled');
          const isSlide = this.lastPlaced && this.lastPlaced.r === r && this.lastPlaced.c === c;
          cell.innerHTML = `<span class="cell-digit ${isSlide ? 'digit-slide' : ''}">${val}</span>`;
          if (val !== this.solution[r][c]) {
            cell.classList.add('error');
          }
        } else {
          // Render pencil notes if any
          const cellNotes = this.notes[r][c];
          if (cellNotes && cellNotes.size > 0) {
            const notesGrid = document.createElement('div');
            notesGrid.className = 'notes-grid';
            for (let i = 1; i <= 9; i++) {
              const note = document.createElement('span');
              note.className = 'note-item';
              note.textContent = cellNotes.has(i) ? i : '';
              notesGrid.appendChild(note);
            }
            cell.appendChild(notesGrid);
          }
        }

        cell.addEventListener('click', () => this.selectCell(r, c));
        this.gridEl.appendChild(cell);
      }
    }
    this.highlightActiveCells();
  }

  selectCell(row, col) {
    this.selectedCell = [row, col];
    this.sound.play('tap');
    this.highlightActiveCells();
  }

  moveSelection(direction) {
    if (!this.selectedCell) {
      this.selectCell(0, 0);
      return;
    }
    let [r, c] = this.selectedCell;
    if (direction === 'ArrowUp') r = Math.max(0, r - 1);
    if (direction === 'ArrowDown') r = Math.min(8, r + 1);
    if (direction === 'ArrowLeft') c = Math.max(0, c - 1);
    if (direction === 'ArrowRight') c = Math.min(8, c + 1);
    this.selectCell(r, c);
  }

  highlightActiveCells() {
    const cells = this.gridEl.querySelectorAll('.cell');
    cells.forEach(c => {
      c.classList.remove('selected', 'peer', 'same-digit');
    });

    if (!this.selectedCell) return;
    const [selR, selC] = this.selectedCell;
    const selectedVal = this.userGrid[selR][selC];

    cells.forEach(cell => {
      const r = parseInt(cell.dataset.row, 10);
      const c = parseInt(cell.dataset.col, 10);
      const val = this.userGrid[r][c];

      const sameBox = Math.floor(r / 3) === Math.floor(selR / 3) && Math.floor(c / 3) === Math.floor(selC / 3);

      if (r === selR && c === selC) {
        cell.classList.add('selected');
      } else if (r === selR || c === selC || sameBox) {
        cell.classList.add('peer');
      }

      if (selectedVal !== 0 && val === selectedVal) {
        cell.classList.add('same-digit');
      }
    });
  }

  inputDigit(digit) {
    if (!this.selectedCell || this.gameWon) return;
    const [r, c] = this.selectedCell;
    if (this.puzzle[r][c] !== 0) return; // cannot overwrite given

    if (this.notesMode) {
      const cellNotes = this.notes[r][c];
      if (cellNotes.has(digit)) {
        cellNotes.delete(digit);
      } else {
        cellNotes.add(digit);
      }
      this.sound.play('tap');
      this.renderBoard();
      return;
    }

    const previousVal = this.userGrid[r][c];
    if (previousVal === digit) return;

    this.moveHistory.push({
      r, c,
      prevVal: previousVal,
      prevNotes: new Set(this.notes[r][c])
    });

    this.userGrid[r][c] = digit;
    this.notes[r][c].clear();

    if (digit !== this.solution[r][c]) {
      this.errorsCount++;
      this.errorsEl.textContent = this.errorsCount;
      this.sound.play('error');
    } else {
      this.sound.play('place');
    }

    this.lastPlaced = { r, c };
    this.renderBoard();
    if (digit === this.solution[r][c]) {
      this.spawnCellStars(r, c);
    }
    this.lastPlaced = null;
    this.updateDigitButtons();
    this.checkWin();
  }

  spawnCellStars(r, c) {
    const cell = this.gridEl.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    if (!cell) return;
    const colors = ['#f59e0b', '#fbbf24', '#facc15', '#3b82f6', '#10b981', '#ec4899'];
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      p.className = 'star-particle';
      p.textContent = i % 2 === 0 ? '✦' : '★';
      p.style.color = colors[Math.floor(Math.random() * colors.length)];
      const angle = (Math.PI * 2 / 14) * i + (Math.random() - 0.5) * 0.4;
      const dist = Math.random() * 26 + 16;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      p.style.setProperty('--dx', `${dx}px`);
      p.style.setProperty('--dy', `${dy}px`);
      p.style.setProperty('--rot', `${(Math.random() - 0.5) * 260}deg`);
      cell.appendChild(p);
      setTimeout(() => p.remove(), 600);
    }
  }

  eraseCell() {
    if (!this.selectedCell || this.gameWon) return;
    const [r, c] = this.selectedCell;
    if (this.puzzle[r][c] !== 0) return;

    if (this.userGrid[r][c] !== 0 || this.notes[r][c].size > 0) {
      this.moveHistory.push({
        r, c,
        prevVal: this.userGrid[r][c],
        prevNotes: new Set(this.notes[r][c])
      });
      this.userGrid[r][c] = 0;
      this.notes[r][c].clear();
      this.sound.play('erase');
      this.renderBoard();
      this.updateDigitButtons();
    }
  }

  undoMove() {
    if (this.moveHistory.length === 0 || this.gameWon) return;
    const last = this.moveHistory.pop();
    this.userGrid[last.r][last.c] = last.prevVal;
    this.notes[last.r][last.c] = last.prevNotes;
    this.sound.play('erase');
    this.renderBoard();
    this.updateDigitButtons();
  }

  toggleNotes() {
    this.notesMode = !this.notesMode;
    this.btnNotes.classList.toggle('active-toggle', this.notesMode);
    this.sound.play('tap');
  }

  updateDigitButtons() {
    const counts = {};
    for (let i = 1; i <= 9; i++) counts[i] = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.userGrid[r][c] === this.solution[r][c]) {
          counts[this.userGrid[r][c]]++;
        }
      }
    }
    document.querySelectorAll('.digit-btn').forEach(btn => {
      const d = parseInt(btn.dataset.digit, 10);
      if (counts[d] >= 9) {
        btn.classList.add('exhausted');
      } else {
        btn.classList.remove('exhausted');
      }
    });
  }

  openHintAdModal() {
    if (this.gameWon) return;
    this.modalAd.classList.add('open');
    this.btnClaimHint.disabled = true;
    this.btnClaimHint.style.opacity = '0.5';
    let timeLeft = 5;
    this.adCountdownEl.textContent = timeLeft;
    this.adProgressEl.style.width = '0%';

    clearInterval(this.adTimer);
    this.adTimer = setInterval(() => {
      timeLeft--;
      this.adCountdownEl.textContent = timeLeft;
      const pct = ((5 - timeLeft) / 5) * 100;
      this.adProgressEl.style.width = `${pct}%`;

      if (timeLeft <= 0) {
        clearInterval(this.adTimer);
        this.btnClaimHint.disabled = false;
        this.btnClaimHint.style.opacity = '1';
        this.btnClaimHint.textContent = 'Claim Free Hint! 💡';
      }
    }, 1000);
  }

  closeHintAdModal() {
    clearInterval(this.adTimer);
    this.modalAd.classList.remove('open');
  }

  claimHint() {
    this.closeHintAdModal();
    // Fill in the currently selected cell or any unsolved empty cell
    let target = this.selectedCell;
    if (!target || this.userGrid[target[0]][target[1]] === this.solution[target[0]][target[1]]) {
      const empties = [];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (this.userGrid[r][c] !== this.solution[r][c]) {
            empties.push([r, c]);
          }
        }
      }
      if (empties.length > 0) {
        target = empties[Math.floor(Math.random() * empties.length)];
      }
    }

    if (target) {
      const [r, c] = target;
      this.userGrid[r][c] = this.solution[r][c];
      this.notes[r][c].clear();
      this.selectedCell = [r, c];
      this.sound.play('place');
      this.renderBoard();
      this.updateDigitButtons();
      this.checkWin();
    }
  }

  checkWin() {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (this.userGrid[r][c] !== this.solution[r][c]) {
          return false;
        }
      }
    }

    // Victory!
    this.gameWon = true;
    clearInterval(this.timerInterval);
    this.sound.play('win');

    const totalSeconds = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));

    // Mandatory platform postMessage
    try {
      window.parent.postMessage({ type: 'win', time: totalSeconds }, '*');
    } catch (err) {
      console.warn('postMessage failed', err);
    }

    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    this.winTimeEl.textContent = `${mins}m ${secs}s`;
    this.winErrorsEl.textContent = this.errorsCount;
    this.modalWin.classList.add('open');
    return true;
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new SudokuGame();
});
