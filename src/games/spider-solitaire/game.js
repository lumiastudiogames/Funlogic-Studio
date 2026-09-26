// Spider Solitaire 1-Suit (Spades) Engine (Vanilla JS)
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
    playCard() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    },
    playDeal() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      for (let i = 0; i < 5; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300 + i * 50, now + i * 0.03);
        gain.gain.setValueAtTime(0.1, now + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.03 + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 0.04);
      }
    },
    playSequenceCleared() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      [400, 500, 600, 800].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.06);
        gain.gain.setValueAtTime(0.2, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.15);
      });
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
        gain.gain.setValueAtTime(0.25, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.3);
      });
    }
  };

  const RANKS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  let tableau = []; // 10 columns of cards: { rank: 1..13, faceUp: boolean }
  let stock = [];
  let completedSets = 0;
  let moves = 0;
  let startTime = Date.now();
  let history = [];
  let selected = null; // { colIdx, cardIdx }
  let gameOver = false;

  const tableauEl = document.getElementById('tableau');
  const stockEl = document.getElementById('stock-deck');
  const stockCountEl = document.getElementById('stock-count');
  const movesBadge = document.getElementById('moves-badge');
  const setsBadge = document.getElementById('sets-badge');
  const foundationsEl = document.getElementById('foundations');
  const btnUndo = document.getElementById('btn-undo');

  function initGame() {
    // 8 decks of Spades 1..13
    const fullDeck = [];
    for (let d = 0; d < 8; d++) {
      for (let r = 1; r <= 13; r++) {
        fullDeck.push({ rank: r, faceUp: false });
      }
    }
    // Shuffle
    fullDeck.sort(() => Math.random() - 0.5);

    tableau = Array.from({ length: 10 }, () => []);
    // Deal 54 cards: first 4 cols get 6, other 6 get 5
    for (let c = 0; c < 10; c++) {
      const count = c < 4 ? 6 : 5;
      for (let i = 0; i < count; i++) {
        const card = fullDeck.pop();
        if (i === count - 1) card.faceUp = true;
        tableau[c].push(card);
      }
    }

    stock = fullDeck; // 50 cards remaining
    completedSets = 0;
    moves = 0;
    history = [];
    selected = null;
    gameOver = false;
    startTime = Date.now();

    btnUndo.disabled = true;
    updateHUD();
    renderBoard();
  }

  function saveState() {
    history.push({
      tableau: tableau.map((col) => col.map((c) => ({ ...c }))),
      stock: stock.map((c) => ({ ...c })),
      completedSets,
      moves
    });
    btnUndo.disabled = false;
  }

  function spawnStarParticles(colIdx) {
    const colEl = tableauEl.children[colIdx];
    if (!colEl) return;
    const rect = colEl.getBoundingClientRect();
    const stageRect = document.getElementById('game-stage').getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - stageRect.left;
    const cy = rect.top + rect.height / 2 - stageRect.top;

    const stars = ['✨', '⭐', '💫', '👑', '✦'];
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('span');
      particle.textContent = stars[i % stars.length];
      particle.style.position = 'absolute';
      particle.style.left = `${cx}px`;
      particle.style.top = `${cy}px`;
      particle.style.transform = 'translate(-50%, -50%) scale(0.5)';
      particle.style.pointerEvents = 'none';
      particle.style.fontSize = '20px';
      particle.style.zIndex = '1000';
      particle.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease-out';
      particle.style.opacity = '1';
      document.getElementById('game-stage').appendChild(particle);

      const angle = (i / 12) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const distance = 40 + Math.random() * 40;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      requestAnimationFrame(() => {
        particle.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.3)`;
        particle.style.opacity = '0';
      });

      setTimeout(() => {
        if (particle.parentNode) particle.parentNode.removeChild(particle);
      }, 650);
    }
  }

  function updateHUD() {
    movesBadge.textContent = `${moves} MOVES`;
    setsBadge.textContent = `${completedSets}/8 SETS`;
    stockCountEl.textContent = stock.length / 10;

    if (stock.length === 0) {
      stockEl.classList.add('empty');
    } else {
      stockEl.classList.remove('empty');
    }

    // Render Foundation slots
    foundationsEl.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const slot = document.createElement('div');
      slot.className = 'foundation-slot' + (i < completedSets ? ' filled' : '');
      slot.textContent = i < completedSets ? '♠' : '';
      foundationsEl.appendChild(slot);
    }
  }

  function isDescendingSequence(col, startIdx) {
    for (let i = startIdx; i < col.length - 1; i++) {
      if (!col[i].faceUp || !col[i + 1].faceUp) return false;
      if (col[i].rank !== col[i + 1].rank + 1) return false;
    }
    return true;
  }

  function renderBoard() {
    tableauEl.innerHTML = '';

    for (let c = 0; c < 10; c++) {
      const colEl = document.createElement('div');
      colEl.className = 'column';
      colEl.setAttribute('data-col', c);

      // Empty column placeholder for clicking
      const ph = document.createElement('div');
      ph.className = 'column-placeholder';
      ph.addEventListener('click', () => onColumnClick(c));
      colEl.appendChild(ph);

      const col = tableau[c];
      col.forEach((card, idx) => {
        const cardEl = document.createElement('div');
        cardEl.className = `card ${card.faceUp ? 'face-up' : 'face-down'}`;

        if (selected && selected.colIdx === c && idx >= selected.cardIdx) {
          cardEl.classList.add('selected');
        }

        if (card.faceUp) {
          cardEl.innerHTML = `
            <div class="card-top">
              <span class="card-rank">${RANKS[card.rank]}</span>
              <span class="card-suit">♠</span>
            </div>
            <div class="card-center-suit">♠</div>
          `;
          cardEl.addEventListener('click', (e) => {
            e.stopPropagation();
            onCardClick(c, idx);
          });
        } else {
          cardEl.addEventListener('click', (e) => {
            e.stopPropagation();
            onColumnClick(c);
          });
        }

        colEl.appendChild(cardEl);
      });

      tableauEl.appendChild(colEl);
    }
  }

  function onCardClick(colIdx, cardIdx) {
    if (gameOver) return;
    AudioEngine.init();

    const col = tableau[colIdx];
    const card = col[cardIdx];
    if (!card.faceUp) return;

    if (selected) {
      if (selected.colIdx === colIdx) {
        // Deselect or select deeper
        if (selected.cardIdx === cardIdx) {
          selected = null;
        } else if (isDescendingSequence(col, cardIdx)) {
          selected = { colIdx, cardIdx };
        }
      } else {
        // Attempt move onto this card if it's the top card of target column
        if (cardIdx === col.length - 1) {
          tryMove(selected.colIdx, selected.cardIdx, colIdx);
        }
      }
    } else {
      // Pick card if it starts a valid descending sequence
      if (isDescendingSequence(col, cardIdx)) {
        selected = { colIdx, cardIdx };
        AudioEngine.playCard();
      }
    }
    renderBoard();
  }

  function onColumnClick(colIdx) {
    if (!selected || gameOver) return;
    tryMove(selected.colIdx, selected.cardIdx, colIdx);
    renderBoard();
  }

  function tryMove(fromColIdx, fromCardIdx, toColIdx) {
    if (fromColIdx === toColIdx) {
      selected = null;
      return;
    }

    const fromCol = tableau[fromColIdx];
    const toCol = tableau[toColIdx];
    const movingCards = fromCol.slice(fromCardIdx);
    const baseCard = movingCards[0];

    let canMove = false;
    if (toCol.length === 0) {
      canMove = true;
    } else {
      const topTarget = toCol[toCol.length - 1];
      if (topTarget.faceUp && topTarget.rank === baseCard.rank + 1) {
        canMove = true;
      }
    }

    if (canMove) {
      saveState();
      // Execute move
      tableau[fromColIdx] = fromCol.slice(0, fromCardIdx);
      tableau[toColIdx] = toCol.concat(movingCards);

      // Flip new top card in source column
      if (tableau[fromColIdx].length > 0) {
        tableau[fromColIdx][tableau[fromColIdx].length - 1].faceUp = true;
      }

      moves++;
      AudioEngine.playCard();
      selected = null;

      // Check for complete King-to-Ace sequence in both source and target columns
      checkCompleteSequences(toColIdx);
      checkCompleteSequences(fromColIdx);

      updateHUD();
      checkWin();
    } else {
      selected = null;
    }
  }

  function checkCompleteSequences(colIdx) {
    const col = tableau[colIdx];
    if (!col || col.length < 13) return;

    // Check if bottom 13 cards are K down to A
    const last13 = col.slice(col.length - 13);
    const isComplete = last13.every((card, i) => card.faceUp && card.rank === 13 - i);

    if (isComplete) {
      // Remove the complete sequence
      tableau[colIdx] = col.slice(0, col.length - 13);
      if (tableau[colIdx].length > 0) {
        tableau[colIdx][tableau[colIdx].length - 1].faceUp = true;
      }
      completedSets++;
      AudioEngine.playSequenceCleared();
      spawnStarParticles(colIdx);
      updateHUD();
      checkCompleteSequences(colIdx);
    }
  }

  function dealStock() {
    if (stock.length === 0 || gameOver) return;
    saveState();
    AudioEngine.playDeal();

    for (let c = 0; c < 10; c++) {
      if (stock.length > 0) {
        const card = stock.pop();
        card.faceUp = true;
        tableau[c].push(card);
        checkCompleteSequences(c);
      }
    }

    selected = null;
    moves++;
    updateHUD();
    renderBoard();
    checkWin();
  }

  function undo() {
    if (history.length === 0 || gameOver) return;
    const prev = history.pop();
    tableau = prev.tableau;
    stock = prev.stock;
    completedSets = prev.completedSets;
    moves = prev.moves;
    selected = null;
    if (history.length === 0) btnUndo.disabled = true;
    updateHUD();
    renderBoard();
  }

  function checkWin() {
    if (completedSets === 8) {
      gameOver = true;
      AudioEngine.playWin();
      const TIME = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      // Golden rule platform win notification
      window.parent.postMessage({ type: 'win', time: TIME }, '*');
    }
  }

  stockEl.addEventListener('click', dealStock);
  btnUndo.addEventListener('click', undo);
  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-sound').addEventListener('click', function () {
    AudioEngine.muted = !AudioEngine.muted;
    this.innerHTML = AudioEngine.muted ? '🔇' : '🔊';
  });

  initGame();
})();
