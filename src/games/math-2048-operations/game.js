/**
 * Math 2048 Operations Engine
 * 100% Correct Mathematical Calculations, Smooth Tactile Sliding,
 * Floating Arithmetic Equations & Star Particle Merges.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('math2048_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  toggle() {
    this.muted = !this.muted;
    localStorage.setItem('math2048_muted', this.muted);
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
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.09);
      gain.gain.setValueAtTime(0.15, t);
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

class Math2048 {
  constructor() {
    this.size = 4;
    this.sound = new SoundEngine();
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('math2048_best') || '0', 10);
    this.tiles = [];
    this.tileIdCounter = 1;
    this.previousState = null;
    this.hasWon = false;
    this.keepPlaying = false;
    this.startTime = Date.now();
    this.mode = 'add'; // 'add' (A + A = 2A) or 'mul' (A × 2 = 2A)

    this.cacheDOM();
    this.bindEvents();
    this.restart();
  }

  cacheDOM() {
    this.boardEl = document.getElementById('board-container');
    this.tileLayerEl = document.getElementById('tile-layer');
    this.scoreEl = document.getElementById('current-score');
    this.bestScoreEl = document.getElementById('best-score');
    this.soundIcon = document.getElementById('sound-icon');
    this.formulaText = document.getElementById('formula-text');
    this.modeAddBtn = document.getElementById('mode-add');
    this.modeMulBtn = document.getElementById('mode-mul');
    this.undoBtn = document.getElementById('btn-undo');
    this.modalWin = document.getElementById('modal-win');
    this.modalOver = document.getElementById('modal-over');
    this.modalHowTo = document.getElementById('modal-howto');

    if (this.bestScoreEl) {
      this.bestScoreEl.textContent = this.bestScore;
    }
    if (this.soundIcon) {
      this.soundIcon.textContent = this.sound.muted ? '🔇' : '🔊';
    }
  }

  setMode(mode) {
    this.mode = mode;
    if (this.modeAddBtn) this.modeAddBtn.classList.toggle('active', mode === 'add');
    if (this.modeMulBtn) this.modeMulBtn.classList.toggle('active', mode === 'mul');

    if (this.formulaText) {
      if (mode === 'add') {
        this.formulaText.innerHTML = '💡 <strong>Addition Mode:</strong> 2 + 2 = 4, 4 + 4 = 8, 8 + 8 = 16...';
      } else {
        this.formulaText.innerHTML = '💡 <strong>Multiply Mode:</strong> 2 × 2 = 4, 4 × 4 = 16, 8 × 8 = 64...';
      }
    }
  }

  bindEvents() {
    // Keyboard controls
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

    // Touch & Pointer Swiping on Board
    let startX = 0;
    let startY = 0;
    let isTouching = false;
    const MIN_SWIPE = 20;

    const onStart = (x, y) => {
      isTouching = true;
      startX = x;
      startY = y;
    };

    const onEnd = (x, y) => {
      if (!isTouching) return;
      isTouching = false;
      const dx = x - startX;
      const dy = y - startY;
      if (Math.hypot(dx, dy) >= MIN_SWIPE) {
        if (Math.abs(dx) > Math.abs(dy)) {
          this.move(dx > 0 ? 1 : 3); // 1 = Right, 3 = Left
        } else {
          this.move(dy > 0 ? 2 : 0); // 2 = Down, 0 = Up
        }
      }
    };

    // Touch events
    this.boardEl.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    this.boardEl.addEventListener('touchmove', (e) => {
      if (e.cancelable) e.preventDefault();
    }, { passive: false });

    this.boardEl.addEventListener('touchend', (e) => {
      if (e.changedTouches.length > 0) {
        onEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      }
    }, { passive: true });

    // Pointer events (Mouse / Trackpad)
    this.boardEl.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'touch') {
        onStart(e.clientX, e.clientY);
        this.boardEl.setPointerCapture?.(e.pointerId);
      }
    });

    this.boardEl.addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'touch') {
        onEnd(e.clientX, e.clientY);
      }
    });

    this.boardEl.addEventListener('pointercancel', () => {
      isTouching = false;
    });

    // On-screen Directional Buttons
    document.querySelectorAll('.ctrl-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const dir = parseInt(btn.dataset.dir || '0', 10);
        this.move(dir);
      });
    });

    // Mode Toggle Buttons
    this.modeAddBtn?.addEventListener('click', () => this.setMode('add'));
    this.modeMulBtn?.addEventListener('click', () => this.setMode('mul'));

    // Top action buttons
    document.getElementById('btn-restart')?.addEventListener('click', () => this.restart());
    this.undoBtn?.addEventListener('click', () => this.undo());
    document.getElementById('btn-sound')?.addEventListener('click', () => {
      const isMuted = this.sound.toggle();
      if (this.soundIcon) this.soundIcon.textContent = isMuted ? '🔇' : '🔊';
    });

    document.getElementById('btn-howto')?.addEventListener('click', () => this.modalHowTo?.classList.add('open'));
    document.getElementById('btn-close-howto')?.addEventListener('click', () => this.modalHowTo?.classList.remove('open'));

    // Win Modal actions
    document.getElementById('btn-continue-win')?.addEventListener('click', () => {
      this.modalWin?.classList.remove('open');
      this.keepPlaying = true;
    });
    document.getElementById('btn-restart-win')?.addEventListener('click', () => {
      this.modalWin?.classList.remove('open');
      this.restart();
    });

    // Game Over actions
    document.getElementById('btn-restart-over')?.addEventListener('click', () => {
      this.modalOver?.classList.remove('open');
      this.restart();
    });
    document.getElementById('btn-undo-over')?.addEventListener('click', () => {
      this.modalOver?.classList.remove('open');
      this.undo();
    });

    window.addEventListener('resize', () => this.render());
  }

  /**
   * Correct mathematical calculation when two matching tiles merge
   */
  computeMerge(a, b) {
    if (a !== b) return false;
    // In addition mode: a + b
    // 2 + 2 = 4, 4 + 4 = 8, 8 + 8 = 16, 16 + 16 = 32...
    if (this.mode === 'mul') {
      return a * b;
    }
    return a + b;
  }

  restart() {
    this.tiles = [];
    this.tileIdCounter = 1;
    this.score = 0;
    if (this.scoreEl) this.scoreEl.textContent = '0';
    this.hasWon = false;
    this.keepPlaying = false;
    this.previousState = null;
    if (this.undoBtn) this.undoBtn.disabled = true;

    this.modalWin?.classList.remove('open');
    this.modalOver?.classList.remove('open');
    this.setMode(this.mode || 'add');

    this.spawnTile();
    this.spawnTile();
    this.render();
    this.startTime = Date.now();
  }

  saveState() {
    this.previousState = {
      tiles: this.tiles.map(t => ({ ...t })),
      score: this.score,
      mode: this.mode
    };
    if (this.undoBtn) this.undoBtn.disabled = false;
  }

  undo() {
    if (!this.previousState) return;
    this.tiles = this.previousState.tiles.map(t => ({ ...t }));
    this.score = this.previousState.score;
    this.mode = this.previousState.mode;
    if (this.scoreEl) this.scoreEl.textContent = this.score;
    this.setMode(this.mode);
    this.previousState = null;
    if (this.undoBtn) this.undoBtn.disabled = true;
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
    // Standard 2048 probability: 90% 2, 10% 4
    const val = Math.random() < 0.9 ? 2 : 4;
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

  /**
   * Floating Arithmetic Equation Popup directly on the merged tile
   */
  spawnMathPopup(r, c, a, b, result) {
    const containerRect = this.tileLayerEl.getBoundingClientRect();
    const cellW = (containerRect.width - (this.size - 1) * 8) / this.size;
    const x = c * (cellW + 8) + cellW / 2;
    const y = r * (cellW + 8) + cellW / 2;

    const popup = document.createElement('div');
    popup.className = 'math-popup';
    const symbol = this.mode === 'mul' ? '× 2 =' : '+';
    if (this.mode === 'mul') {
      popup.textContent = `${a} × ${b} = ${result}`;
    } else {
      popup.textContent = `${a} + ${b} = ${result}`;
    }

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    this.tileLayerEl.appendChild(popup);

    requestAnimationFrame(() => {
      popup.style.transform = 'translate(-50%, -150%) scale(1.1)';
      popup.style.opacity = '0';
    });

    setTimeout(() => popup.remove(), 600);
  }

  spawnStarParticles(r, c) {
    const containerRect = this.tileLayerEl.getBoundingClientRect();
    const cellW = (containerRect.width - (this.size - 1) * 8) / this.size;
    const x = c * (cellW + 8) + cellW / 2;
    const y = r * (cellW + 8) + cellW / 2;

    const count = 7;
    const stars = ['✨', '⭐', '🌟', '✦', '★'];
    const palette = ['#facc15', '#4ade80', '#38bdf8', '#fb923c', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      star.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        font-size: ${12 + Math.random() * 8}px;
        color: ${palette[i % palette.length]};
        pointer-events: none;
        z-index: 100;
        transform: translate(-50%, -50%) scale(0.2);
        opacity: 1;
        transition: transform 0.45s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.45s ease-out;
      `;
      star.textContent = stars[Math.floor(Math.random() * stars.length)];

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 18 + Math.random() * 26;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      this.tileLayerEl.appendChild(star);

      requestAnimationFrame(() => {
        star.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${0.8 + Math.random() * 0.5}) rotate(${(Math.random() - 0.5) * 120}deg)`;
        star.style.opacity = '0';
      });

      setTimeout(() => star.remove(), 480);
    }
  }

  /**
   * Checks if any legal move remains on the board
   */
  checkGameOver() {
    // 1. Any empty cells?
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.getTileAt(r, c)) return false;
      }
    }

    // 2. Any horizontally or vertically adjacent matching tiles?
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.getTileAt(r, c).val;
        // Right neighbor
        if (c < this.size - 1) {
          const right = this.getTileAt(r, c + 1);
          if (right && right.val === val) return false;
        }
        // Down neighbor
        if (r < this.size - 1) {
          const down = this.getTileAt(r + 1, c);
          if (down && down.val === val) return false;
        }
      }
    }

    // Completely locked!
    return true;
  }

  /**
   * Main slide and merge execution
   */
  move(direction) {
    this.saveState();

    let moved = false;
    let totalScoreAdded = 0;
    const mergeEvents = [];

    const rows = [0, 1, 2, 3];
    const cols = [0, 1, 2, 3];
    if (direction === 2) rows.reverse(); // Down
    if (direction === 1) cols.reverse(); // Right

    // 4x4 matrix representation
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
            // Collision check: both must not have merged already in this turn
            const nextVal = (!target.hasMerged && !tile.hasMerged) ? this.computeMerge(target.val, tile.val) : false;
            if (nextVal !== false) {
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
              mergeEvents.push({
                r: testR,
                c: testC,
                a: target.val,
                b: tile.val,
                result: nextVal
              });
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
      if (this.scoreEl) this.scoreEl.textContent = this.score;
      if (this.score > this.bestScore) {
        this.bestScore = this.score;
        if (this.bestScoreEl) this.bestScoreEl.textContent = this.bestScore;
        localStorage.setItem('math2048_best', this.bestScore.toString());
      }

      this.spawnTile();
      this.render();

      mergeEvents.forEach(evt => {
        this.spawnMathPopup(evt.r, evt.c, evt.a, evt.b, evt.result);
        this.spawnStarParticles(evt.r, evt.c);
      });

      // Victory condition: reaching 2048 tile!
      if (!this.hasWon && !this.keepPlaying && this.tiles.some(t => t.val >= 2048)) {
        this.hasWon = true;
        this.sound.play('win');
        const totalSecs = Math.max(1, Math.floor((Date.now() - this.startTime) / 1000));
        try {
          window.parent.postMessage({ type: 'win', time: totalSecs }, '*');
        } catch (e) {}
        this.modalWin?.classList.add('open');
      }

      // Check Game Over
      if (this.checkGameOver()) {
        setTimeout(() => {
          this.modalOver?.classList.add('open');
        }, 350);
      }
    } else {
      this.previousState = null;
      if (this.undoBtn) this.undoBtn.disabled = true;
    }
  }

  render() {
    this.tileLayerEl.innerHTML = '';
    const containerW = this.tileLayerEl.clientWidth;
    if (containerW === 0) return;

    const gap = 8;
    const cellW = (containerW - (this.size - 1) * gap) / this.size;

    this.tiles.forEach(tile => {
      const el = document.createElement('div');
      const val = tile.val;
      const classKey = val <= 2048 ? `tile-${val}` : 'tile-super';
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
  new Math2048();
});
