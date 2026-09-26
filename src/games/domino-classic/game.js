// Dominó Classic Engine (Vanilla JS)
(function () {
  'use strict';

  // --- Web Audio Engine ---
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
    playClack() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    },
    playWin() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      [440, 554, 659, 880].forEach((f, i) => {
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

  // 28 Domino stones generator
  function createDeck() {
    const deck = [];
    for (let i = 0; i <= 6; i++) {
      for (let j = i; j <= 6; j++) {
        deck.push([i, j]);
      }
    }
    return deck.sort(() => Math.random() - 0.5);
  }

  let deck = [];
  let playerHand = [];
  let aiHand = [];
  let table = []; // array of { a, b }
  let leftEnd = null;
  let rightEnd = null;
  let currentTurn = 'PLAYER'; // 'PLAYER' | 'AI'
  let consecutivePasses = 0;
  let startTime = Date.now();
  let gameOver = false;

  const boardEl = document.getElementById('domino-train');
  const playerHandEl = document.getElementById('player-hand');
  const aiCardsEl = document.getElementById('ai-cards');
  const boneyardCountEl = document.getElementById('boneyard-count');
  const statusEl = document.getElementById('turn-status');
  const btnAction = document.getElementById('btn-action');
  const sideModal = document.getElementById('side-modal');

  let pendingTile = null;

  function initGame() {
    deck = createDeck();
    playerHand = deck.splice(0, 7);
    aiHand = deck.splice(0, 7);
    table = [];
    leftEnd = null;
    rightEnd = null;
    consecutivePasses = 0;
    gameOver = false;
    startTime = Date.now();

    // Start with highest double in hand or deck
    let startTile = deck.pop();
    table.push({ a: startTile[0], b: startTile[1] });
    leftEnd = startTile[0];
    rightEnd = startTile[1];

    currentTurn = 'PLAYER';
    statusEl.textContent = 'Sua vez de jogar';
    renderAll();
  }

  function renderPipPattern(num) {
    const patterns = {
      0: [],
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };
    const active = patterns[num] || [];
    let html = '<div class="pips-grid">';
    for (let i = 0; i < 9; i++) {
      html += active.includes(i) ? '<span class="pip"></span>' : '<span></span>';
    }
    html += '</div>';
    return html;
  }

  function createDominoElement(a, b, orientation = 'vertical', isPlayable = false) {
    const div = document.createElement('div');
    div.className = `domino ${orientation}` + (isPlayable ? ' playable' : '');
    div.innerHTML = `
      <div class="domino-half">${renderPipPattern(a)}</div>
      <div class="domino-divider-${orientation === 'vertical' ? 'v' : 'h'}"></div>
      <div class="domino-half">${renderPipPattern(b)}</div>
    `;
    return div;
  }

  function renderAll() {
    // Render Board
    boardEl.innerHTML = '';
    table.forEach((t) => {
      const tileEl = createDominoElement(t.a, t.b, 'horizontal');
      boardEl.appendChild(tileEl);
    });

    // Render AI Hand (faces down)
    aiCardsEl.innerHTML = '';
    for (let i = 0; i < aiHand.length; i++) {
      const card = document.createElement('div');
      card.className = 'ai-card-back';
      aiCardsEl.appendChild(card);
    }

    // Render Boneyard Count
    boneyardCountEl.textContent = `BONEYARD: ${deck.length}`;

    // Render Player Hand
    playerHandEl.innerHTML = '';
    let canPlayAny = false;

    playerHand.forEach((tile) => {
      const canFitLeft = tile[0] === leftEnd || tile[1] === leftEnd;
      const canFitRight = tile[0] === rightEnd || tile[1] === rightEnd;
      const playable = currentTurn === 'PLAYER' && !gameOver && (canFitLeft || canFitRight);

      if (playable) canPlayAny = true;

      const tileEl = createDominoElement(tile[0], tile[1], 'vertical', playable);
      if (playable) {
        tileEl.addEventListener('click', () => onPlayerTileClick(tile));
      }
      playerHandEl.appendChild(tileEl);
    });

    // Action button state (Draw / Pass)
    if (currentTurn === 'PLAYER' && !gameOver) {
      if (!canPlayAny) {
        if (deck.length > 0) {
          btnAction.disabled = false;
          btnAction.textContent = 'DRAW';
        } else {
          btnAction.disabled = false;
          btnAction.textContent = 'PASS';
        }
      } else {
        btnAction.disabled = true;
        btnAction.textContent = 'YOUR TURN';
      }
    } else {
      btnAction.disabled = true;
    }
  }

  function onPlayerTileClick(tile) {
    if (currentTurn !== 'PLAYER' || gameOver) return;
    AudioEngine.init();

    const canFitLeft = tile[0] === leftEnd || tile[1] === leftEnd;
    const canFitRight = tile[0] === rightEnd || tile[1] === rightEnd;

    if (canFitLeft && canFitRight && leftEnd !== rightEnd) {
      // Must choose side
      pendingTile = tile;
      sideModal.classList.add('active');
    } else if (canFitLeft) {
      playTile(tile, 'left', 'PLAYER');
    } else {
      playTile(tile, 'right', 'PLAYER');
    }
  }

  function playTile(tile, side, byWhom) {
    AudioEngine.playClack();
    consecutivePasses = 0;

    // Remove from hand
    if (byWhom === 'PLAYER') {
      const idx = playerHand.findIndex((t) => (t[0] === tile[0] && t[1] === tile[1]) || (t[0] === tile[1] && t[1] === tile[0]));
      if (idx !== -1) playerHand.splice(idx, 1);
    } else {
      const idx = aiHand.findIndex((t) => (t[0] === tile[0] && t[1] === tile[1]) || (t[0] === tile[1] && t[1] === tile[0]));
      if (idx !== -1) aiHand.splice(idx, 1);
    }

    // Orient tile
    let [a, b] = tile;
    if (side === 'left') {
      if (b !== leftEnd) [a, b] = [b, a];
      table.unshift({ a, b });
      leftEnd = a;
    } else {
      if (a !== rightEnd) [a, b] = [b, a];
      table.push({ a, b });
      rightEnd = b;
    }

    currentTurn = byWhom === 'PLAYER' ? 'AI' : 'PLAYER';
    statusEl.textContent = currentTurn === 'PLAYER' ? 'Your turn to play' : 'Bot thinking...';
    renderAll();
    checkGameOver();

    if (!gameOver && currentTurn === 'AI') {
      setTimeout(playAiTurn, 800);
    }
  }

  function playAiTurn() {
    if (gameOver) return;

    // AI looks for first matching tile
    let match = null;
    let chosenSide = 'left';

    for (const tile of aiHand) {
      if (tile[0] === leftEnd || tile[1] === leftEnd) {
        match = tile;
        chosenSide = 'left';
        break;
      }
      if (tile[0] === rightEnd || tile[1] === rightEnd) {
        match = tile;
        chosenSide = 'right';
        break;
      }
    }

    if (match) {
      playTile(match, chosenSide, 'AI');
    } else {
      // AI needs to draw or pass
      if (deck.length > 0) {
        aiHand.push(deck.pop());
        renderAll();
        setTimeout(playAiTurn, 500);
      } else {
        // AI passes
        consecutivePasses++;
        currentTurn = 'PLAYER';
        statusEl.textContent = 'Bot passed! Your turn.';
        renderAll();
        checkGameOver();
      }
    }
  }

  function checkGameOver() {
    let playerWon = false;
    let aiWon = false;

    if (playerHand.length === 0) {
      playerWon = true;
    } else if (aiHand.length === 0) {
      aiWon = true;
    } else if (consecutivePasses >= 2) {
      // Game locked
      const playerSum = playerHand.reduce((s, t) => s + t[0] + t[1], 0);
      const aiSum = aiHand.reduce((s, t) => s + t[0] + t[1], 0);
      if (playerSum <= aiSum) playerWon = true;
      else aiWon = true;
    }

    if (playerWon) {
      gameOver = true;
      statusEl.textContent = '🎉 You Won! VICTORY!';
      AudioEngine.playWin();
      const TIME = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      // Golden rule platform win notification
      window.parent.postMessage({ type: 'win', time: TIME }, '*');
    } else if (aiWon) {
      gameOver = true;
      statusEl.textContent = 'Bot won this round.';
    }
  }

  // Side Chooser Modal Handlers
  document.getElementById('btn-choose-left').addEventListener('click', () => {
    sideModal.classList.remove('active');
    if (pendingTile) {
      playTile(pendingTile, 'left', 'PLAYER');
      pendingTile = null;
    }
  });

  document.getElementById('btn-choose-right').addEventListener('click', () => {
    sideModal.classList.remove('active');
    if (pendingTile) {
      playTile(pendingTile, 'right', 'PLAYER');
      pendingTile = null;
    }
  });

  // Action button (Draw / Pass)
  btnAction.addEventListener('click', () => {
    if (currentTurn !== 'PLAYER' || gameOver) return;
    if (deck.length > 0) {
      playerHand.push(deck.pop());
      renderAll();
    } else {
      // Pass
      consecutivePasses++;
      currentTurn = 'AI';
      statusEl.textContent = 'You passed. Bot thinking...';
      renderAll();
      checkGameOver();
      if (!gameOver) {
        setTimeout(playAiTurn, 800);
      }
    }
  });

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-sound').addEventListener('click', function () {
    AudioEngine.muted = !AudioEngine.muted;
    this.innerHTML = AudioEngine.muted ? '🔇' : '🔊';
  });

  initGame();
})();
