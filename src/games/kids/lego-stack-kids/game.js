// Lego Stack Kids - 6x6 2-Block Puzzle for Children
(function() {
  'use strict';

  const BOARD_SIZE = 6;
  const BLUEPRINT_TEMPLATES = [
    // House
    { name: 'Cozy House', cells: [[1,2],[1,3],[2,1],[2,2],[2,3],[2,4],[3,1],[3,2],[3,3],[3,4],[4,1],[4,2],[4,3],[4,4]] },
    // Robot
    { name: 'Toy Robot', cells: [[1,2],[1,3],[2,1],[2,2],[2,3],[2,4],[3,1],[3,2],[3,3],[3,4],[4,2],[4,3]] },
    // Castle
    { name: 'Castle Tower', cells: [[1,1],[1,4],[2,1],[2,2],[2,3],[2,4],[3,1],[3,2],[3,3],[3,4],[4,1],[4,2],[4,3],[4,4]] },
    // Boat
    { name: 'Sailboat', cells: [[1,3],[2,2],[2,3],[3,3],[4,1],[4,2],[4,3],[4,4]] },
    // Star / Cross
    { name: 'Star Cross', cells: [[1,2],[1,3],[2,1],[2,2],[2,3],[2,4],[3,1],[3,2],[3,3],[3,4],[4,2],[4,3]] }
  ];

  const TOY_COLORS = ['color-blue', 'color-red', 'color-yellow', 'color-green'];

  let board = [];
  let blueprintMap = {};
  let dockPieces = [];
  let selectedPieceIdx = null;
  let piecesPlaced = 0;
  let startTime = Date.now();
  let isWon = false;
  let soundEnabled = true;

  // Web Audio Synthesizer
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'select') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === 'snap') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'win') {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.3);
      });
    }
  }

  function spawnSparkles(cellEl) {
    if (!cellEl) return;
    const rect = cellEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const stars = ['✨', '⭐', '🌟', '✦', '🔷'];
    stars.forEach((s, i) => {
      const sp = document.createElement('span');
      sp.className = 'lego-sparkle';
      sp.textContent = s;
      const angle = (i / stars.length) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
      const dist = 30 + Math.random() * 25;
      sp.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      sp.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      sp.style.setProperty('--rot', `${(Math.random() - 0.5) * 120}deg`);
      sp.style.left = `${cx}px`;
      sp.style.top = `${cy}px`;
      document.body.appendChild(sp);
      setTimeout(() => sp.remove(), 700);
    });
  }

  function initGame() {
    board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null));
    selectedPieceIdx = null;
    piecesPlaced = 0;
    isWon = false;
    startTime = Date.now();
    document.getElementById('win-modal').classList.remove('active');

    // Pick a procedural blueprint template
    const tmpl = BLUEPRINT_TEMPLATES[Math.floor(Math.random() * BLUEPRINT_TEMPLATES.length)];
    blueprintMap = {};
    tmpl.cells.forEach(([r, c]) => {
      blueprintMap[`${r},${c}`] = true;
    });

    // Partition blueprint cells into verifiable pieces (Duo-H, Duo-V, Single)
    const unvisited = new Set(tmpl.cells.map(([r, c]) => `${r},${c}`));
    dockPieces = [];

    tmpl.cells.forEach(([r, c]) => {
      const key = `${r},${c}`;
      if (!unvisited.has(key)) return;

      // Try horizontal duo
      const rightKey = `${r},${c + 1}`;
      const downKey = `${r + 1},${c}`;

      if (unvisited.has(rightKey) && Math.random() < 0.6) {
        unvisited.delete(key);
        unvisited.delete(rightKey);
        dockPieces.push({
          name: '2-Brick',
          cells: [[0, 0], [0, 1]],
          color: TOY_COLORS[Math.floor(Math.random() * TOY_COLORS.length)]
        });
      } else if (unvisited.has(downKey) && Math.random() < 0.6) {
        unvisited.delete(key);
        unvisited.delete(downKey);
        dockPieces.push({
          name: '2-Brick',
          cells: [[0, 0], [1, 0]],
          color: TOY_COLORS[Math.floor(Math.random() * TOY_COLORS.length)]
        });
      } else {
        unvisited.delete(key);
        dockPieces.push({
          name: '1-Stud',
          cells: [[0, 0]],
          color: TOY_COLORS[Math.floor(Math.random() * TOY_COLORS.length)]
        });
      }
    });

    // Shuffle dock pieces so it is a fun puzzle
    dockPieces.sort(() => Math.random() - 0.5);

    updateHint(`Drag and snap bricks into the blue ${tmpl.name} shape!`);
    renderBoard();
    renderDock();
  }

  function updateHint(text) {
    const el = document.getElementById('hint-bar');
    if (el) el.textContent = text;
  }

  function renderBoard() {
    const boardEl = document.getElementById('board-6x6');
    boardEl.innerHTML = '';

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        const cell = document.createElement('div');
        cell.className = 'lego-cell';
        cell.dataset.r = r;
        cell.dataset.c = c;

        const isBlueprint = blueprintMap[`${r},${c}`];
        if (isBlueprint) {
          cell.classList.add('blueprint-target');
        }

        const color = board[r][c];
        if (color) {
          cell.classList.add('filled', color);
        }

        cell.addEventListener('click', () => handleCellClick(r, c));

        // Drag & Drop
        cell.addEventListener('dragover', (e) => {
          e.preventDefault();
          cell.classList.add('drop-hover');
        });
        cell.addEventListener('dragleave', () => {
          cell.classList.remove('drop-hover');
        });
        cell.addEventListener('drop', (e) => {
          e.preventDefault();
          cell.classList.remove('drop-hover');
          const pIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
          if (!isNaN(pIdx) && dockPieces[pIdx]) {
            tryPlacePiece(dockPieces[pIdx], r, c, pIdx);
          }
        });

        boardEl.appendChild(cell);
      }
    }
  }

  function renderDock() {
    const dockEl = document.getElementById('dock');
    dockEl.innerHTML = '';

    dockPieces.forEach((piece, idx) => {
      if (!piece) return;

      const item = document.createElement('div');
      item.className = 'dock-item';
      item.setAttribute('draggable', 'true');
      item.dataset.pieceIdx = idx;
      if (selectedPieceIdx === idx) item.classList.add('selected');

      const preview = document.createElement('div');
      preview.className = 'piece-preview';

      const maxR = Math.max(...piece.cells.map(c => c[0])) + 1;
      const maxC = Math.max(...piece.cells.map(c => c[1])) + 1;
      preview.style.gridTemplateRows = `repeat(${maxR}, 26px)`;
      preview.style.gridTemplateColumns = `repeat(${maxC}, 26px)`;

      piece.cells.forEach(([r, c]) => {
        const dot = document.createElement('div');
        dot.className = `piece-dot ${piece.color}`;
        dot.style.gridRow = r + 1;
        dot.style.gridColumn = c + 1;
        preview.appendChild(dot);
      });

      item.appendChild(preview);

      // Desktop HTML5 drag
      item.addEventListener('dragstart', (e) => {
        if (isWon) return e.preventDefault();
        e.dataTransfer.setData('text/plain', String(idx));
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
      });

      // Mobile Touch drag & drop
      item.addEventListener('pointerdown', (e) => {
        if (isWon || e.pointerType === 'mouse') return;
        selectedPieceIdx = idx;
        renderDock();

        const clone = item.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.left = `${e.clientX - 25}px`;
        clone.style.top = `${e.clientY - 25}px`;
        clone.style.zIndex = '9999';
        clone.style.pointerEvents = 'none';
        clone.style.transform = 'scale(1.15)';
        clone.style.opacity = '0.9';
        document.body.appendChild(clone);

        const onMove = (ev) => {
          clone.style.left = `${ev.clientX - 25}px`;
          clone.style.top = `${ev.clientY - 25}px`;
        };

        const onUp = (ev) => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          clone.remove();

          const elem = document.elementFromPoint(ev.clientX, ev.clientY);
          const cell = elem ? elem.closest('.lego-cell') : null;
          if (cell) {
            const r = parseInt(cell.dataset.r, 10);
            const c = parseInt(cell.dataset.c, 10);
            tryPlacePiece(piece, r, c, idx);
          }
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
      });

      // Click to select
      item.addEventListener('click', () => {
        if (isWon) return;
        selectedPieceIdx = idx;
        playSound('select');
        updateHint(`Selected ${piece.name}! Tap a blue spot to snap it.`);
        renderDock();
      });

      dockEl.appendChild(item);
    });
  }

  function canPlace(piece, startR, startC) {
    for (let [dr, dc] of piece.cells) {
      const r = startR + dr;
      const c = startC + dc;
      if (r < 0 || r >= BOARD_SIZE || c < 0 || c >= BOARD_SIZE) return false;
      // Must be on blue blueprint target
      if (!blueprintMap[`${r},${c}`]) return false;
      // Must not already be occupied
      if (board[r][c] !== null) return false;
    }
    return true;
  }

  function tryPlacePiece(piece, r, c, pieceIdx) {
    if (canPlace(piece, r, c)) {
      for (let [dr, dc] of piece.cells) {
        board[r + dr][c + dc] = piece.color;
      }
      dockPieces[pieceIdx] = null;
      selectedPieceIdx = null;
      piecesPlaced++;
      playSound('snap');

      const boardEl = document.getElementById('board-6x6');
      const targetCell = boardEl.children[r * BOARD_SIZE + c];
      spawnSparkles(targetCell);

      renderBoard();
      renderDock();
      checkWinCondition();
    } else {
      updateHint('Piece does not fit there! Match the blue blueprint.');
    }
  }

  function handleCellClick(r, c) {
    if (isWon || selectedPieceIdx === null) return;
    const piece = dockPieces[selectedPieceIdx];
    if (!piece) return;
    tryPlacePiece(piece, r, c, selectedPieceIdx);
  }

  function checkWinCondition() {
    // Player wins when all blueprint cells are filled!
    let allFilled = true;
    for (const key of Object.keys(blueprintMap)) {
      const [r, c] = key.split(',').map(Number);
      if (!board[r][c]) {
        allFilled = false;
        break;
      }
    }

    if (allFilled && !isWon) {
      isWon = true;
      playSound('win');
      const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      updateHint('🎉 Fantastic! All blocks are perfectly snapped into place!');

      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'win', time: elapsed }, '*');
        }
      } catch (e) {}

      setTimeout(() => {
        const wtEl = document.getElementById('win-time');
        if (wtEl) wtEl.textContent = `${elapsed}s`;
        document.getElementById('win-modal').classList.add('active');
      }, 500);
    }
  }

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-play-again').addEventListener('click', initGame);

  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playSound('select');
  });

  const howBtn = document.getElementById('btn-how');
  const howModal = document.getElementById('how-modal');
  const closeHowBtn = document.getElementById('btn-close-how');

  howBtn.addEventListener('click', () => {
    howModal.classList.add('active');
    playSound('select');
  });
  closeHowBtn.addEventListener('click', () => {
    howModal.classList.remove('active');
  });

  initGame();
})();
