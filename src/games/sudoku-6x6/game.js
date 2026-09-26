/**
 * Sudoku 6x6 Quick - Pure Vanilla JS
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('sudoku_6x6_muted') === 'true';
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }
  toggle() {
    this.muted = !this.muted;
    localStorage.setItem('sudoku_6x6_muted', this.muted);
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

    if (type === 'tap') {
      osc.frequency.setValueAtTime(520, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.start(t);
      osc.stop(t + 0.05);
    } else if (type === 'place') {
      osc.frequency.setValueAtTime(660, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.2);
    } else if (type === 'win') {
      [523, 659, 783, 1046].forEach((f, i) => {
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.connect(g);
        g.connect(this.ctx.destination);
        o.frequency.setValueAtTime(f, t + i * 0.1);
        g.gain.setValueAtTime(0.12, t + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.22);
        o.start(t + i * 0.1);
        o.stop(t + i * 0.1 + 0.22);
      });
    }
  }
}

class Sudoku6x6Generator {
  static solve(board) {
    const empty = this.findEmpty(board);
    if (!empty) return true;
    const [row, col] = empty;
    const digits = [1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);

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
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        if (board[r][c] === 0) return [r, c];
      }
    }
    return null;
  }

  static isValid(board, row, col, num) {
    for (let c = 0; c < 6; c++) {
      if (board[row][c] === num) return false;
    }
    for (let r = 0; r < 6; r++) {
      if (board[r][col] === num) return false;
    }
    // 2x3 box
    const boxRow = Math.floor(row / 2) * 2;
    const boxCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[boxRow + r][boxCol + c] === num) return false;
      }
    }
    return true;
  }

  static generate(givens = 18) {
    const board = Array.from({ length: 6 }, () => Array(6).fill(0));
    this.solve(board);
    const solution = board.map(r => [...r]);

    const puzzle = board.map(r => [...r]);
    const cells = [];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        cells.push([r, c]);
      }
    }
    cells.sort(() => Math.random() - 0.5);

    const removals = 36 - givens;
    for (let i = 0; i < removals && i < cells.length; i++) {
      const [r, c] = cells[i];
      puzzle[r][c] = 0;
    }

    return { puzzle, solution };
  }
}

class Sudoku6x6Game {
  constructor() {
    this.sound = new SoundEngine();
    this.difficulty = 'easy';
    this.difficultyGivens = { easy: 18, medium: 14, hard: 10 };
    this.puzzle = [];
    this.solution = [];
    this.userGrid = [];
    this.notes = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => new Set()));
    this.selectedCell = null;
    this.notesMode = false;
    this.errorsCount = 0;
    this.moveHistory = [];
    this.timerInterval = null;
    this.elapsedSeconds = 0;
    this.startTime = Date.now();
    this.gameWon = false;

    this.cacheDOM();
    this.bindEvents();
    this.newGame(this.difficulty);
  }

  cacheDOM() {
    this.gridEl = document.getElementById('sudoku-6x6-grid');
    this.timerEl = document.getElementById('timer-display');
    this.errorsEl = document.getElementById('errors-display');
    this.btnNotes = document.getElementById('btn-notes');
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
    this.initDragAndDrop();

    document.getElementById('btn-erase').addEventListener('click', () => this.erase());
    document.getElementById('btn-undo').addEventListener('click', () => this.undo());
    this.btnNotes.addEventListener('click', () => this.toggleNotes());
    document.getElementById('btn-hint').addEventListener('click', () => this.openHintAd());

    document.querySelectorAll('.diff-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.diff-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.newGame(pill.dataset.diff);
      });
    });

    document.getElementById('btn-sound-toggle').addEventListener('click', () => {
      const isMuted = this.sound.toggle();
      this.soundIcon.textContent = isMuted ? '🔇' : '🔊';
    });

    document.getElementById('btn-howto').addEventListener('click', () => this.modalHowTo.classList.add('open'));
    document.getElementById('btn-close-howto').addEventListener('click', () => this.modalHowTo.classList.remove('open'));
    document.getElementById('btn-skip-ad').addEventListener('click', () => this.closeHintAd());
    this.btnClaimHint.addEventListener('click', () => this.claimHint());
    document.getElementById('btn-play-again').addEventListener('click', () => {
      this.modalWin.classList.remove('open');
      this.newGame(this.difficulty);
    });

    window.addEventListener('keydown', (e) => {
      if (this.gameWon) return;
      if (e.key >= '1' && e.key <= '6') this.inputDigit(parseInt(e.key, 10));
      else if (e.key === 'Backspace' || e.key === 'Delete') this.erase();
      else if (e.key.toLowerCase() === 'n') this.toggleNotes();
      else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) this.moveSelection(e.key);
    });
  }

  initDragAndDrop() {
    let touchDraggingDigit = null;
    let touchClone = null;

    document.querySelectorAll('.digit-btn').forEach(btn => {
      btn.setAttribute('draggable', 'true');

      btn.addEventListener('click', () => {
        this.inputDigit(parseInt(btn.dataset.digit, 10));
      });

      // Desktop HTML5 drag
      btn.addEventListener('dragstart', (e) => {
        if (this.gameWon) return e.preventDefault();
        const digit = btn.dataset.digit;
        e.dataTransfer.setData('text/plain', digit);
        btn.classList.add('dragging');
      });

      btn.addEventListener('dragend', () => {
        btn.classList.remove('dragging');
      });

      // Mobile touch drag & drop
      btn.addEventListener('pointerdown', (e) => {
        if (this.gameWon || e.pointerType === 'mouse') return;
        touchDraggingDigit = parseInt(btn.dataset.digit, 10);

        touchClone = document.createElement('div');
        touchClone.className = 'tile-3d-num';
        touchClone.textContent = touchDraggingDigit;
        touchClone.style.position = 'fixed';
        touchClone.style.left = `${e.clientX - 24}px`;
        touchClone.style.top = `${e.clientY - 24}px`;
        touchClone.style.width = '48px';
        touchClone.style.height = '48px';
        touchClone.style.borderRadius = '12px';
        touchClone.style.zIndex = '9999';
        touchClone.style.pointerEvents = 'none';
        touchClone.style.transform = 'scale(1.15)';
        touchClone.style.background = getComputedStyle(btn).backgroundImage || getComputedStyle(btn).backgroundColor;
        touchClone.style.color = getComputedStyle(btn).color;
        touchClone.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
        document.body.appendChild(touchClone);

        const onPointerMove = (ev) => {
          if (!touchClone) return;
          touchClone.style.left = `${ev.clientX - 24}px`;
          touchClone.style.top = `${ev.clientY - 24}px`;

          const elem = document.elementFromPoint(ev.clientX, ev.clientY);
          const cell = elem ? elem.closest('.cell') : null;
          document.querySelectorAll('.cell.drag-over').forEach(c => c.classList.remove('drag-over'));
          if (cell) cell.classList.add('drag-over');
        };

        const onPointerUp = (ev) => {
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
          if (touchClone) {
            touchClone.remove();
            touchClone = null;
          }
          document.querySelectorAll('.cell.drag-over').forEach(c => c.classList.remove('drag-over'));

          const elem = document.elementFromPoint(ev.clientX, ev.clientY);
          const cell = elem ? elem.closest('.cell') : null;
          if (cell && touchDraggingDigit) {
            const r = parseInt(cell.dataset.row, 10);
            const c = parseInt(cell.dataset.col, 10);
            this.placeDigitAt(r, c, touchDraggingDigit);
          }
          touchDraggingDigit = null;
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
      });
    });
  }

  spawnSparkles(cellEl) {
    if (!cellEl) return;
    const rect = cellEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const sparkles = ['✨', '⭐', '🌟', '✦', '✨', '⭐'];
    sparkles.forEach((char, i) => {
      const sp = document.createElement('span');
      sp.className = 'sudoku-sparkle';
      sp.textContent = char;
      const angle = (i / sparkles.length) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
      const dist = 35 + Math.random() * 35;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const rot = (Math.random() - 0.5) * 180;

      sp.style.setProperty('--dx', `${dx}px`);
      sp.style.setProperty('--dy', `${dy}px`);
      sp.style.setProperty('--rot', `${rot}deg`);
      sp.style.left = `${cx}px`;
      sp.style.top = `${cy}px`;

      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 750);
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

  newGame(diff = 'easy') {
    this.difficulty = diff;
    const givens = this.difficultyGivens[diff] || 18;
    const gen = Sudoku6x6Generator.generate(givens);
    this.puzzle = gen.puzzle;
    this.solution = gen.solution;
    this.userGrid = this.puzzle.map(r => [...r]);
    this.notes = Array.from({ length: 6 }, () => Array.from({ length: 6 }, () => new Set()));
    this.moveHistory = [];
    this.errorsCount = 0;
    this.errorsEl.textContent = '0';
    this.selectedCell = null;
    this.gameWon = false;
    this.startTimer();
    this.render();
    this.updateDigitButtons();
  }

  render() {
    this.gridEl.innerHTML = '';
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = r;
        cell.dataset.col = c;

        // 2x3 Quadrant theme: 0..5
        const q = Math.floor(r / 2) * 2 + Math.floor(c / 3);
        cell.classList.add(`block-q${q}`);

        const val = this.userGrid[r][c];
        const isGiven = this.puzzle[r][c] !== 0;

        if (isGiven) {
          cell.classList.add('given');
          const tile = document.createElement('div');
          tile.className = 'tile-3d-num';
          tile.textContent = val;
          cell.appendChild(tile);
        } else if (val !== 0) {
          cell.classList.add('user-filled');
          const tile = document.createElement('div');
          tile.className = 'tile-3d-num';
          tile.textContent = val;
          cell.appendChild(tile);
          if (val !== this.solution[r][c]) cell.classList.add('error');
        } else {
          const cellNotes = this.notes[r][c];
          if (cellNotes && cellNotes.size > 0) {
            const ng = document.createElement('div');
            ng.className = 'notes-grid';
            for (let i = 1; i <= 6; i++) {
              const item = document.createElement('span');
              item.className = 'note-item';
              item.textContent = cellNotes.has(i) ? i : '';
              ng.appendChild(item);
            }
            cell.appendChild(ng);
          }
        }

        cell.addEventListener('click', () => this.selectCell(r, c));

        // Drag & Drop onto cell
        cell.addEventListener('dragover', (e) => {
          if (this.puzzle[r][c] !== 0 || this.gameWon) return;
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
          cell.classList.add('drag-over');
        });

        cell.addEventListener('dragleave', () => {
          cell.classList.remove('drag-over');
        });

        cell.addEventListener('drop', (e) => {
          if (this.puzzle[r][c] !== 0 || this.gameWon) return;
          e.preventDefault();
          cell.classList.remove('drag-over');
          const digit = parseInt(e.dataTransfer.getData('text/plain'), 10);
          if (digit >= 1 && digit <= 6) {
            this.placeDigitAt(r, c, digit);
          }
        });

        this.gridEl.appendChild(cell);
      }
    }
    this.highlightActive();
  }

  selectCell(r, c) {
    this.selectedCell = [r, c];
    this.sound.play('tap');
    this.highlightActive();
  }

  moveSelection(dir) {
    if (!this.selectedCell) return this.selectCell(0, 0);
    let [r, c] = this.selectedCell;
    if (dir === 'ArrowUp') r = Math.max(0, r - 1);
    if (dir === 'ArrowDown') r = Math.min(5, r + 1);
    if (dir === 'ArrowLeft') c = Math.max(0, c - 1);
    if (dir === 'ArrowRight') c = Math.min(5, c + 1);
    this.selectCell(r, c);
  }

  highlightActive() {
    const cells = this.gridEl.querySelectorAll('.cell');
    cells.forEach(c => c.classList.remove('selected', 'peer', 'same-digit'));
    if (!this.selectedCell) return;
    const [selR, selC] = this.selectedCell;
    const selVal = this.userGrid[selR][selC];

    cells.forEach(c => {
      const r = parseInt(c.dataset.row, 10);
      const col = parseInt(c.dataset.col, 10);
      const val = this.userGrid[r][col];

      const sameBox = Math.floor(r / 2) === Math.floor(selR / 2) && Math.floor(col / 3) === Math.floor(selC / 3);

      if (r === selR && col === selC) c.classList.add('selected');
      else if (r === selR || col === selC || sameBox) c.classList.add('peer');

      if (selVal !== 0 && val === selVal) c.classList.add('same-digit');
    });
  }

  inputDigit(d) {
    if (!this.selectedCell || this.gameWon) return;
    const [r, c] = this.selectedCell;
    this.placeDigitAt(r, c, d);
  }

  placeDigitAt(r, c, d) {
    if (this.puzzle[r][c] !== 0 || this.gameWon) return;

    if (this.notesMode) {
      if (this.notes[r][c].has(d)) this.notes[r][c].delete(d);
      else this.notes[r][c].add(d);
      this.sound.play('tap');
      this.render();
      return;
    }

    if (this.userGrid[r][c] === d) return;

    this.moveHistory.push({ r, c, prevVal: this.userGrid[r][c], prevNotes: new Set(this.notes[r][c]) });
    this.userGrid[r][c] = d;
    this.notes[r][c].clear();
    this.selectedCell = [r, c];

    const cellEl = this.gridEl.children[r * 6 + c];

    if (d !== this.solution[r][c]) {
      this.errorsCount++;
      this.errorsEl.textContent = this.errorsCount;
      this.sound.play('error');
    } else {
      this.sound.play('place');
      this.spawnSparkles(cellEl);
    }

    this.render();
    this.updateDigitButtons();
    this.checkWin();
  }

  erase() {
    if (!this.selectedCell || this.gameWon) return;
    const [r, c] = this.selectedCell;
    if (this.puzzle[r][c] !== 0) return;

    if (this.userGrid[r][c] !== 0 || this.notes[r][c].size > 0) {
      this.moveHistory.push({ r, c, prevVal: this.userGrid[r][c], prevNotes: new Set(this.notes[r][c]) });
      this.userGrid[r][c] = 0;
      this.notes[r][c].clear();
      this.sound.play('tap');
      this.render();
      this.updateDigitButtons();
    }
  }

  undo() {
    if (this.moveHistory.length === 0 || this.gameWon) return;
    const last = this.moveHistory.pop();
    this.userGrid[last.r][last.c] = last.prevVal;
    this.notes[last.r][last.c] = last.prevNotes;
    this.render();
    this.updateDigitButtons();
  }

  toggleNotes() {
    this.notesMode = !this.notesMode;
    this.btnNotes.classList.toggle('active-toggle', this.notesMode);
    this.sound.play('tap');
  }

  updateDigitButtons() {
    const counts = {};
    for (let i = 1; i <= 6; i++) counts[i] = 0;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        if (this.userGrid[r][c] === this.solution[r][c]) counts[this.userGrid[r][c]]++;
      }
    }
    document.querySelectorAll('.digit-btn').forEach(btn => {
      const d = parseInt(btn.dataset.digit, 10);
      if (counts[d] >= 6) btn.classList.add('exhausted');
      else btn.classList.remove('exhausted');
    });
  }

  openHintAd() {
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
      this.adProgressEl.style.width = `${((5 - timeLeft) / 5) * 100}%`;
      if (timeLeft <= 0) {
        clearInterval(this.adTimer);
        this.btnClaimHint.disabled = false;
        this.btnClaimHint.style.opacity = '1';
        this.btnClaimHint.textContent = 'Claim Hint! 💡';
      }
    }, 1000);
  }

  closeHintAd() {
    clearInterval(this.adTimer);
    this.modalAd.classList.remove('open');
  }

  claimHint() {
    this.closeHintAd();
    let target = this.selectedCell;
    if (!target || this.userGrid[target[0]][target[1]] === this.solution[target[0]][target[1]]) {
      const empties = [];
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
          if (this.userGrid[r][c] !== this.solution[r][c]) empties.push([r, c]);
        }
      }
      if (empties.length > 0) target = empties[Math.floor(Math.random() * empties.length)];
    }
    if (target) {
      const [r, c] = target;
      this.userGrid[r][c] = this.solution[r][c];
      this.notes[r][c].clear();
      this.selectedCell = [r, c];
      this.sound.play('place');
      this.render();
      this.updateDigitButtons();
      this.checkWin();
    }
  }

  checkWin() {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        if (this.userGrid[r][c] !== this.solution[r][c]) return false;
      }
    }

    this.gameWon = true;
    clearInterval(this.timerInterval);
    this.sound.play('win');

    const totalSecs = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
    try {
      window.parent.postMessage({ type: 'win', time: totalSecs }, '*');
    } catch (e) {}

    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    this.winTimeEl.textContent = `${m}m ${s}s`;
    this.winErrorsEl.textContent = this.errorsCount;
    this.modalWin.classList.add('open');
    return true;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Sudoku6x6Game();
});
