// Resta 1 - Peg Solitaire Engine (Vanilla JS)
(function () {
  'use strict';

  // --- Web Audio Synthesis ---
  const AudioEngine = {
    ctx: null,
    muted: false,
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },
    playClick() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    },
    playJump() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    },
    playWin() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.1);
        gain.gain.setValueAtTime(0.2, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.3);
      });
    }
  };

  // Valid positions in 7x7 board
  function isValidPosition(r, c) {
    if (r < 0 || r > 6 || c < 0 || c > 6) return false;
    if ((r <= 1 || r >= 5) && (c <= 1 || c >= 5)) return false;
    return true;
  }

  let board = [];
  let selected = null; // { r, c }
  let validMoves = []; // array of { toR, toC, overR, overC }
  let history = [];
  let startTime = Date.now();
  let won = false;

  const boardEl = document.getElementById('peg-board');
  const countBadge = document.getElementById('peg-count');
  const statusMsg = document.getElementById('status-msg');
  const btnUndo = document.getElementById('btn-undo');

  function initGame() {
    board = Array.from({ length: 7 }, () => Array(7).fill(-1));
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (isValidPosition(r, c)) {
          // Center starts empty, others filled with peg (1)
          board[r][c] = (r === 3 && c === 3) ? 0 : 1;
        }
      }
    }
    selected = null;
    validMoves = [];
    history = [];
    won = false;
    startTime = Date.now();
    btnUndo.disabled = true;
    statusMsg.textContent = 'Tap a peg to see valid jumps.';

    updatePegCount();
    renderBoard();
  }

  function getPegCount() {
    let count = 0;
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c] === 1) count++;
      }
    }
    return count;
  }

  function updatePegCount() {
    const count = getPegCount();
    countBadge.textContent = `${count} PEGS`;
  }

  function getMovesForPeg(r, c) {
    const moves = [];
    if (board[r][c] !== 1) return moves;

    const directions = [
      { dr: -2, dc: 0, overR: r - 1, overC: c },
      { dr: 2, dc: 0, overR: r + 1, overC: c },
      { dr: 0, dc: -2, overR: r, overC: c - 1 },
      { dr: 0, dc: 2, overR: r, overC: c + 1 }
    ];

    directions.forEach(({ dr, dc, overR, overC }) => {
      const toR = r + dr;
      const toC = c + dc;
      if (isValidPosition(toR, toC) && board[toR][toC] === 0 && board[overR][overC] === 1) {
        moves.push({ toR, toC, overR, overC });
      }
    });

    return moves;
  }

  function hasAnyMoveLeft() {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c] === 1) {
          if (getMovesForPeg(r, c).length > 0) return true;
        }
      }
    }
    return false;
  }

  function spawnStarParticles(targetEl) {
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();
    const boardRect = boardEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - boardRect.left;
    const cy = rect.top + rect.height / 2 - boardRect.top;

    const stars = ['✨', '⭐', '💫', '✦'];
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('span');
      particle.textContent = stars[i % stars.length];
      particle.style.position = 'absolute';
      particle.style.left = `${cx}px`;
      particle.style.top = `${cy}px`;
      particle.style.transform = 'translate(-50%, -50%) scale(0.5)';
      particle.style.pointerEvents = 'none';
      particle.style.fontSize = '18px';
      particle.style.zIndex = '100';
      particle.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease-out';
      particle.style.opacity = '1';
      boardEl.style.position = 'relative';
      boardEl.appendChild(particle);

      const angle = (i / 8) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const distance = 35 + Math.random() * 25;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      requestAnimationFrame(() => {
        particle.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.2)`;
        particle.style.opacity = '0';
      });

      setTimeout(() => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
      }, 550);
    }
  }

  function renderBoard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';

        if (!isValidPosition(r, c)) {
          cell.classList.add('invalid');
          boardEl.appendChild(cell);
          continue;
        }

        const hole = document.createElement('div');
        hole.className = 'hole';
        hole.id = `hole-${r}-${c}`;

        const isTarget = validMoves.some((m) => m.toR === r && m.toC === c);
        if (isTarget) {
          hole.classList.add('target-move');
          hole.addEventListener('click', () => onTargetClick(r, c));
        }

        if (board[r][c] === 1) {
          const peg = document.createElement('div');
          peg.className = 'peg';
          if (selected && selected.r === r && selected.c === c) {
            peg.classList.add('selected');
          }
          peg.addEventListener('click', (e) => {
            e.stopPropagation();
            onPegClick(r, c);
          });
          hole.appendChild(peg);
        }

        cell.appendChild(hole);
        boardEl.appendChild(cell);
      }
    }
  }

  function onPegClick(r, c) {
    if (won) return;
    AudioEngine.init();

    if (selected && selected.r === r && selected.c === c) {
      // Deselect
      selected = null;
      validMoves = [];
    } else {
      selected = { r, c };
      validMoves = getMovesForPeg(r, c);
      AudioEngine.playClick();
    }
    renderBoard();
  }

  function onTargetClick(toR, toC) {
    if (!selected || won) return;
    const move = validMoves.find((m) => m.toR === toR && m.toC === toC);
    if (!move) return;

    // Save history
    history.push({
      board: board.map((row) => [...row])
    });
    btnUndo.disabled = false;

    // Execute jump
    board[selected.r][selected.c] = 0;
    board[move.overR][move.overC] = 0;
    board[toR][toC] = 1;

    AudioEngine.playJump();
    selected = null;
    validMoves = [];

    updatePegCount();
    renderBoard();

    // Trigger star particles on target cell
    const targetHole = document.getElementById(`hole-${toR}-${toC}`);
    if (targetHole) spawnStarParticles(targetHole);

    checkGameOver();
  }

  function undo() {
    if (history.length === 0 || won) return;
    const prev = history.pop();
    board = prev.board;
    selected = null;
    validMoves = [];
    if (history.length === 0) btnUndo.disabled = true;
    updatePegCount();
    statusMsg.textContent = 'Move undone.';
    renderBoard();
  }

  function checkGameOver() {
    const count = getPegCount();
    if (count === 1) {
      won = true;
      statusMsg.textContent = '🏆 FLAWLESS! Only 1 peg left! You won!';
      AudioEngine.playWin();
      const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      // Golden rule platform win notification
      window.parent.postMessage({ type: 'win', time: elapsed }, '*');
    } else if (!hasAnyMoveLeft()) {
      statusMsg.textContent = `No moves left! ${count} pegs remaining.`;
    } else {
      statusMsg.textContent = `${count} pegs left on the board.`;
    }
  }

  document.getElementById('btn-restart').addEventListener('click', initGame);
  btnUndo.addEventListener('click', undo);
  document.getElementById('btn-sound').addEventListener('click', function () {
    AudioEngine.muted = !AudioEngine.muted;
    this.innerHTML = AudioEngine.muted ? '🔇' : '🔊';
  });

  initGame();
})();
