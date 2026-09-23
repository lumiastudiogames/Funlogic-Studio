// Jogo da Velha - Tic Tac Toe Engine with Minimax AI (Vanilla JS)
(function () {
  'use strict';

  // --- Audio Synthesis ---
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
    playX() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    },
    playO() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    },
    playWin() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      [440, 554, 659, 880].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.09);
        gain.gain.setValueAtTime(0.2, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.25);
      });
    },
    playTie() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    }
  };

  const WIN_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  let board = Array(9).fill(null);
  let currentTurn = 'X';
  let gameMode = 'ai'; // 'ai' | 'pvp'
  let gameOver = false;
  let startTime = Date.now();

  let scoreX = 0;
  let scoreO = 0;
  let scoreTie = 0;

  const cells = document.querySelectorAll('.cell');
  const turnMsg = document.getElementById('turn-msg');
  const scoreXEl = document.getElementById('score-x');
  const scoreOEl = document.getElementById('score-o');
  const scoreTieEl = document.getElementById('score-tie');

  function initGame() {
    board = Array(9).fill(null);
    currentTurn = 'X';
    gameOver = false;
    startTime = Date.now();
    turnMsg.textContent = 'Vez do PLAYER (X)';

    cells.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'cell';
    });
  }

  function checkWinner(b) {
    for (const combo of WIN_COMBOS) {
      const [i1, i2, i3] = combo;
      if (b[i1] && b[i1] === b[i2] && b[i1] === b[i3]) {
        return { winner: b[i1], combo };
      }
    }
    if (b.every((c) => c !== null)) {
      return { winner: 'tie', combo: null };
    }
    return null;
  }

  // Minimax algorithm for unbeatable AI
  function minimax(b, depth, isMaximizing) {
    const result = checkWinner(b);
    if (result) {
      if (result.winner === 'O') return 10 - depth;
      if (result.winner === 'X') return depth - 10;
      if (result.winner === 'tie') return 0;
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = 'O';
          const ev = minimax(b, depth + 1, false);
          b[i] = null;
          maxEval = Math.max(maxEval, ev);
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!b[i]) {
          b[i] = 'X';
          const ev = minimax(b, depth + 1, true);
          b[i] = null;
          minEval = Math.min(minEval, ev);
        }
      }
      return minEval;
    }
  }

  function getBestAiMove() {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  function makeMove(index, symbol) {
    board[index] = symbol;
    const cell = cells[index];
    cell.textContent = symbol;
    cell.classList.add(symbol.toLowerCase());

    if (symbol === 'X') {
      AudioEngine.playX();
    } else {
      AudioEngine.playO();
    }

    const state = checkWinner(board);
    if (state) {
      handleGameOver(state);
      return;
    }

    currentTurn = symbol === 'X' ? 'O' : 'X';
    turnMsg.textContent = `Vez do PLAYER ${currentTurn}`;

    if (gameMode === 'ai' && currentTurn === 'O' && !gameOver) {
      turnMsg.textContent = 'Robô calculando...';
      setTimeout(() => {
        const aiIndex = getBestAiMove();
        if (aiIndex !== -1 && !gameOver) {
          makeMove(aiIndex, 'O');
        }
      }, 350);
    }
  }

  function handleGameOver(state) {
    gameOver = true;
    if (state.winner === 'tie') {
      turnMsg.textContent = 'Empate! Deu Velha!';
      scoreTie++;
      scoreTieEl.textContent = scoreTie;
      AudioEngine.playTie();
    } else {
      turnMsg.textContent = `🎉 PLAYER ${state.winner} venceu!`;
      state.combo.forEach((idx) => cells[idx].classList.add('winning'));

      if (state.winner === 'X') {
        scoreX++;
        scoreXEl.textContent = scoreX;
        AudioEngine.playWin();

        const TIME = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        // Golden rule platform win notification
        window.parent.postMessage({ type: 'win', time: TIME }, '*');
      } else {
        scoreO++;
        scoreOEl.textContent = scoreO;
      }
    }
  }

  cells.forEach((cell) => {
    cell.addEventListener('click', () => {
      if (gameOver) return;
      if (gameMode === 'ai' && currentTurn === 'O') return;
      const idx = parseInt(cell.getAttribute('data-index'), 10);
      if (!board[idx]) {
        makeMove(idx, currentTurn);
      }
    });
  });

  // Mode buttons
  document.getElementById('mode-ai').addEventListener('click', function () {
    gameMode = 'ai';
    this.classList.add('active');
    document.getElementById('mode-pvp').classList.remove('active');
    initGame();
  });

  document.getElementById('mode-pvp').addEventListener('click', function () {
    gameMode = 'pvp';
    this.classList.add('active');
    document.getElementById('mode-ai').classList.remove('active');
    initGame();
  });

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-sound').addEventListener('click', function () {
    AudioEngine.muted = !AudioEngine.muted;
    this.innerHTML = AudioEngine.muted ? '🔇' : '🔊';
  });

  initGame();
})();
