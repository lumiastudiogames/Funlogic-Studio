// Shape Fit Relax - 10 Tangram Figures Engine (English, No Labels, Coherent Drag & Drop)
(() => {
  'use strict';

  let audioCtx = null;
  let soundEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) audioCtx = new AudioCtxClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playSnapSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (_) {}
  }

  function playRejectSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } catch (_) {}
  }

  function playWinSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.6);
      });
    } catch (_) {}
  }

  // 10 Curated Tangram Silhouette Figures (Coordinates inside 320x320 stage)
  const FIGURES = [
    {
      id: 1,
      name: 'Cozy Cottage',
      icon: '🏠',
      pieces: [
        { id: 'p1', shapeType: 'triangle-up', color: 'linear-gradient(180deg, #f97316, #ea580c)', width: '180px', height: '90px', clip: 'polygon(50% 0%, 0% 100%, 100% 100%)', round: '8px', top: '35px', left: '70px' },
        { id: 'p2', shapeType: 'rect-base', color: 'linear-gradient(180deg, #3b82f6, #1d4ed8)', width: '150px', height: '110px', clip: 'none', round: '12px', top: '125px', left: '85px' },
        { id: 'p3', shapeType: 'chimney', color: 'linear-gradient(180deg, #ef4444, #b91c1c)', width: '40px', height: '60px', clip: 'none', round: '6px', top: '30px', left: '210px' },
        { id: 'p4', shapeType: 'door', color: 'linear-gradient(180deg, #f59e0b, #d97706)', width: '45px', height: '65px', clip: 'none', round: '14px 14px 0 0', top: '170px', left: '137px' }
      ]
    },
    {
      id: 2,
      name: 'Calm Sailboat',
      icon: '⛵',
      pieces: [
        { id: 'p1', shapeType: 'sail-big', color: 'linear-gradient(180deg, #06b6d4, #0891b2)', width: '90px', height: '130px', clip: 'polygon(0% 100%, 100% 100%, 100% 0%)', round: '4px', top: '40px', left: '145px' },
        { id: 'p2', shapeType: 'sail-small', color: 'linear-gradient(180deg, #38bdf8, #0284c7)', width: '70px', height: '100px', clip: 'polygon(0% 0%, 0% 100%, 100% 100%)', round: '4px', top: '70px', left: '70px' },
        { id: 'p3', shapeType: 'boat-hull', color: 'linear-gradient(180deg, #b45309, #78350f)', width: '200px', height: '55px', clip: 'polygon(15% 100%, 85% 100%, 100% 0%, 0% 0%)', round: '6px', top: '175px', left: '60px' }
      ]
    },
    {
      id: 3,
      name: 'Space Rocket',
      icon: '🚀',
      pieces: [
        { id: 'p1', shapeType: 'rocket-nose', color: 'linear-gradient(180deg, #ef4444, #dc2626)', width: '90px', height: '65px', clip: 'polygon(50% 0%, 0% 100%, 100% 100%)', round: '6px', top: '25px', left: '115px' },
        { id: 'p2', shapeType: 'rocket-body', color: 'linear-gradient(180deg, #f1f5f9, #94a3b8)', width: '90px', height: '110px', clip: 'none', round: '10px', top: '90px', left: '115px' },
        { id: 'p3', shapeType: 'fin-left', color: 'linear-gradient(180deg, #f97316, #c2410c)', width: '50px', height: '70px', clip: 'polygon(100% 0%, 100% 100%, 0% 100%)', round: '4px', top: '130px', left: '65px' },
        { id: 'p4', shapeType: 'fin-right', color: 'linear-gradient(180deg, #f97316, #c2410c)', width: '50px', height: '70px', clip: 'polygon(0% 0%, 100% 100%, 0% 100%)', round: '4px', top: '130px', left: '205px' },
        { id: 'p5', shapeType: 'booster-flame', color: 'linear-gradient(180deg, #facc15, #ea580c)', width: '60px', height: '50px', clip: 'polygon(50% 100%, 0% 0%, 100% 0%)', round: '4px', top: '200px', left: '130px' }
      ]
    },
    {
      id: 4,
      name: 'Evergreen Tree',
      icon: '🌲',
      pieces: [
        { id: 'p1', shapeType: 'triangle-up', color: 'linear-gradient(180deg, #4ade80, #16a34a)', width: '110px', height: '70px', clip: 'polygon(50% 0%, 0% 100%, 100% 100%)', round: '6px', top: '30px', left: '105px' },
        { id: 'p2', shapeType: 'triangle-up', color: 'linear-gradient(180deg, #22c55e, #15803d)', width: '150px', height: '80px', clip: 'polygon(50% 0%, 0% 100%, 100% 100%)', round: '6px', top: '85px', left: '85px' },
        { id: 'p3', shapeType: 'triangle-up', color: 'linear-gradient(180deg, #16a34a, #14532d)', width: '190px', height: '90px', clip: 'polygon(50% 0%, 0% 100%, 100% 100%)', round: '6px', top: '145px', left: '65px' },
        { id: 'p4', shapeType: 'rect-base', color: 'linear-gradient(180deg, #92400e, #713f12)', width: '45px', height: '55px', clip: 'none', round: '6px', top: '235px', left: '137px' }
      ]
    },
    {
      id: 5,
      name: 'Golden Fish',
      icon: '🐟',
      pieces: [
        { id: 'p1', shapeType: 'fish-head', color: 'linear-gradient(180deg, #facc15, #ca8a04)', width: '85px', height: '95px', clip: 'polygon(0% 50%, 100% 0%, 100% 100%)', round: '6px', top: '110px', left: '50px' },
        { id: 'p2', shapeType: 'rect-base', color: 'linear-gradient(180deg, #fb923c, #ea580c)', width: '90px', height: '95px', clip: 'none', round: '12px', top: '110px', left: '135px' },
        { id: 'p3', shapeType: 'fish-tail', color: 'linear-gradient(180deg, #f43f5e, #be123c)', width: '70px', height: '105px', clip: 'polygon(100% 0%, 0% 50%, 100% 100%)', round: '6px', top: '105px', left: '225px' },
        { id: 'p4', shapeType: 'triangle-up', color: 'linear-gradient(180deg, #fbbf24, #f59e0b)', width: '60px', height: '40px', clip: 'polygon(50% 0%, 0% 100%, 100% 100%)', round: '4px', top: '70px', left: '150px' }
      ]
    },
    {
      id: 6,
      name: 'Royal Castle',
      icon: '🏰',
      pieces: [
        { id: 'p1', shapeType: 'tower-tall', color: 'linear-gradient(180deg, #a855f7, #7e22ce)', width: '65px', height: '140px', clip: 'none', round: '8px', top: '80px', left: '127px' },
        { id: 'p2', shapeType: 'spire', color: 'linear-gradient(180deg, #c084fc, #9333ea)', width: '65px', height: '45px', clip: 'polygon(50% 0%, 0% 100%, 100% 100%)', round: '4px', top: '35px', left: '127px' },
        { id: 'p3', shapeType: 'tower-side', color: 'linear-gradient(180deg, #818cf8, #4f46e5)', width: '55px', height: '110px', clip: 'none', round: '8px', top: '110px', left: '60px' },
        { id: 'p4', shapeType: 'tower-side', color: 'linear-gradient(180deg, #818cf8, #4f46e5)', width: '55px', height: '110px', clip: 'none', round: '8px', top: '110px', left: '205px' },
        { id: 'p5', shapeType: 'door', color: 'linear-gradient(180deg, #f59e0b, #d97706)', width: '45px', height: '50px', clip: 'none', round: '14px 14px 0 0', top: '170px', left: '137px' }
      ]
    },
    {
      id: 7,
      name: 'Flying Bird',
      icon: '🐦',
      pieces: [
        { id: 'p1', shapeType: 'beak', color: 'linear-gradient(180deg, #f59e0b, #d97706)', width: '35px', height: '30px', clip: 'polygon(0% 50%, 100% 0%, 100% 100%)', round: '4px', top: '85px', left: '45px' },
        { id: 'p2', shapeType: 'circle-head', color: 'linear-gradient(180deg, #38bdf8, #0284c7)', width: '60px', height: '60px', clip: 'none', round: '50%', top: '70px', left: '75px' },
        { id: 'p3', shapeType: 'bird-body', color: 'linear-gradient(180deg, #6366f1, #4338ca)', width: '105px', height: '70px', clip: 'none', round: '24px', top: '115px', left: '95px' },
        { id: 'p4', shapeType: 'wing', color: 'linear-gradient(180deg, #a855f7, #6b21a8)', width: '75px', height: '80px', clip: 'polygon(50% 0%, 0% 100%, 100% 100%)', round: '6px', top: '45px', left: '130px' },
        { id: 'p5', shapeType: 'tail-fan', color: 'linear-gradient(180deg, #ec4899, #be185d)', width: '55px', height: '55px', clip: 'polygon(100% 0%, 0% 50%, 100% 100%)', round: '4px', top: '125px', left: '200px' }
      ]
    },
    {
      id: 8,
      name: 'Sparkling Diamond',
      icon: '💎',
      pieces: [
        { id: 'p1', shapeType: 'gem-crown', color: 'linear-gradient(180deg, #67e8f9, #06b6d4)', width: '180px', height: '65px', clip: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', round: '4px', top: '55px', left: '70px' },
        { id: 'p2', shapeType: 'gem-base', color: 'linear-gradient(180deg, #0ea5e9, #0284c7)', width: '180px', height: '120px', clip: 'polygon(0% 0%, 100% 0%, 50% 100%)', round: '4px', top: '120px', left: '70px' },
        { id: 'p3', shapeType: 'gem-heart', color: 'linear-gradient(180deg, #f43f5e, #be123c)', width: '60px', height: '60px', clip: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)', round: '4px', top: '90px', left: '130px' }
      ]
    },
    {
      id: 9,
      name: 'Playful Kitten',
      icon: '🐱',
      pieces: [
        { id: 'p1', shapeType: 'cat-ear', color: 'linear-gradient(180deg, #fb923c, #ea580c)', width: '40px', height: '45px', clip: 'polygon(50% 0%, 0% 100%, 100% 100%)', round: '4px', top: '40px', left: '85px' },
        { id: 'p2', shapeType: 'cat-ear', color: 'linear-gradient(180deg, #fb923c, #ea580c)', width: '40px', height: '45px', clip: 'polygon(50% 0%, 0% 100%, 100% 100%)', round: '4px', top: '40px', left: '195px' },
        { id: 'p3', shapeType: 'cat-head', color: 'linear-gradient(180deg, #fdba74, #f97316)', width: '120px', height: '100px', clip: 'none', round: '22px', top: '75px', left: '100px' },
        { id: 'p4', shapeType: 'cat-body', color: 'linear-gradient(180deg, #f97316, #c2410c)', width: '140px', height: '90px', clip: 'none', round: '18px', top: '175px', left: '90px' }
      ]
    },
    {
      id: 10,
      name: 'Spinning Pinwheel',
      icon: '🪁',
      pieces: [
        { id: 'p1', shapeType: 'blade-n', color: 'linear-gradient(180deg, #ef4444, #dc2626)', width: '60px', height: '70px', clip: 'polygon(0% 0%, 100% 100%, 0% 100%)', round: '4px', top: '50px', left: '100px' },
        { id: 'p2', shapeType: 'blade-e', color: 'linear-gradient(180deg, #3b82f6, #1d4ed8)', width: '70px', height: '60px', clip: 'polygon(0% 0%, 100% 0%, 100% 100%)', round: '4px', top: '100px', left: '160px' },
        { id: 'p3', shapeType: 'blade-s', color: 'linear-gradient(180deg, #10b981, #047857)', width: '60px', height: '70px', clip: 'polygon(100% 100%, 0% 0%, 100% 0%)', round: '4px', top: '160px', left: '160px' },
        { id: 'p4', shapeType: 'blade-w', color: 'linear-gradient(180deg, #f59e0b, #d97706)', width: '70px', height: '60px', clip: 'polygon(100% 100%, 0% 100%, 0% 0%)', round: '4px', top: '110px', left: '90px' },
        { id: 'p5', shapeType: 'pin-center', color: 'linear-gradient(180deg, #fbbf24, #d97706)', width: '38px', height: '38px', clip: 'none', round: '50%', top: '141px', left: '141px' }
      ]
    }
  ];

  let currentFigureIdx = 0;
  let fittedMap = {}; // slotId -> boolean
  let selectedPieceId = null;
  let isWon = false;
  let startTime = Date.now();

  const trayEl = document.getElementById('shapes-tray');
  const boardEl = document.getElementById('silhouette-board');
  const levelNumEl = document.getElementById('level-num');
  const figureTitleEl = document.getElementById('figure-title');
  const shapesLeftEl = document.getElementById('shapes-left');
  const statusMsg = document.getElementById('status-msg');
  const modalLevels = document.getElementById('modal-levels');
  const modalWin = document.getElementById('modal-win');
  const levelsGrid = document.getElementById('levels-grid');

  function initFigure(idx = currentFigureIdx) {
    currentFigureIdx = Math.max(0, Math.min(FIGURES.length - 1, idx));
    const fig = FIGURES[currentFigureIdx];

    levelNumEl.textContent = fig.id;
    figureTitleEl.textContent = fig.name.toUpperCase();
    fittedMap = {};
    fig.pieces.forEach(p => (fittedMap[p.id] = false));
    selectedPieceId = null;
    isWon = false;
    startTime = Date.now();

    modalWin.style.display = 'none';
    modalLevels.style.display = 'none';

    renderTray(fig);
    renderBoard(fig);
    updateStatus();
    statusMsg.textContent = 'Drag matching shapes into the silhouette or tap to connect.';
  }

  function updateStatus() {
    const fig = FIGURES[currentFigureIdx];
    const total = fig.pieces.length;
    const fittedCount = Object.values(fittedMap).filter(Boolean).length;
    shapesLeftEl.textContent = `${fittedCount} / ${total}`;

    if (fittedCount === total && !isWon) {
      handleWin();
    }
  }

  function handleWin() {
    isWon = true;
    playWinSound();
    const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    try {
      if (typeof window.triggerPlatformWin === 'function') {
        window.triggerPlatformWin({ score: 100, level: FIGURES[currentFigureIdx].id, time: elapsed });
      }
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'win', level: FIGURES[currentFigureIdx].id, time: elapsed }, '*');
      }
    } catch (_) {}

    statusMsg.textContent = '🌟 Excellent! The figure is completely assembled!';
    setTimeout(() => {
      modalWin.style.display = 'flex';
    }, 450);
  }

  // Logical Verification: checks if piece fits into slot
  function isCoherentFit(pieceDef, slotDef) {
    if (!pieceDef || !slotDef) return false;
    // Exact ID match OR geometric shapeType match (allowing interchangeable symmetric pieces like ears/foliage)
    if (pieceDef.id === slotDef.id) return true;
    if (pieceDef.shapeType === slotDef.shapeType) return true;
    return false;
  }

  function snapPieceToSlot(pieceId, slotId) {
    const fig = FIGURES[currentFigureIdx];
    const pieceDef = fig.pieces.find(p => p.id === pieceId);
    const slotDef = fig.pieces.find(p => p.id === slotId);

    if (isCoherentFit(pieceDef, slotDef)) {
      fittedMap[slotDef.id] = true;
      selectedPieceId = null;
      playSnapSound();
      renderTray(fig);
      renderBoard(fig);
      updateStatus();
      statusMsg.textContent = '✨ Shape snapped into position!';
      return true;
    } else {
      playRejectSound();
      statusMsg.textContent = '⚠️ That shape does not fit this contour. Try another matching slot!';
      return false;
    }
  }

  // Drag and Drop State
  let draggingPiece = null;
  let dragGhost = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let hasMovedFar = false;

  function renderTray(fig) {
    trayEl.innerHTML = '';
    fig.pieces.forEach(p => {
      if (fittedMap[p.id]) return;

      const pieceEl = document.createElement('div');
      pieceEl.className = 'tangram-piece';
      pieceEl.dataset.id = p.id;
      pieceEl.dataset.shapeType = p.shapeType;
      pieceEl.style.width = p.width;
      pieceEl.style.height = p.height;
      pieceEl.style.background = p.color;
      pieceEl.style.clipPath = p.clip;
      pieceEl.style.borderRadius = p.round;

      if (selectedPieceId === p.id) {
        pieceEl.classList.add('selected');
      }

      // Pointer Drag & Drop Handlers
      pieceEl.addEventListener('pointerdown', (e) => {
        if (fittedMap[p.id]) return;
        getAudioContext();
        draggingPiece = p;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        hasMovedFar = false;

        pieceEl.setPointerCapture(e.pointerId);

        // Create Drag Ghost
        dragGhost = document.createElement('div');
        dragGhost.className = 'drag-ghost';
        dragGhost.style.width = p.width;
        dragGhost.style.height = p.height;
        dragGhost.style.background = p.color;
        dragGhost.style.clipPath = p.clip;
        dragGhost.style.borderRadius = p.round;
        dragGhost.style.left = `${e.clientX}px`;
        dragGhost.style.top = `${e.clientY}px`;
        document.body.appendChild(dragGhost);

        pieceEl.classList.add('dragging');
      });

      pieceEl.addEventListener('pointermove', (e) => {
        if (!draggingPiece || draggingPiece.id !== p.id || !dragGhost) return;
        if (Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY) > 6) {
          hasMovedFar = true;
        }
        dragGhost.style.left = `${e.clientX}px`;
        dragGhost.style.top = `${e.clientY}px`;

        // Highlight matching slot under cursor
        const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
        const slotEl = elemBelow ? elemBelow.closest('.tangram-slot') : null;
        document.querySelectorAll('.tangram-slot').forEach(s => s.classList.remove('highlight'));
        if (slotEl && !fittedMap[slotEl.dataset.id]) {
          slotEl.classList.add('highlight');
        }
      });

      const onPointerEnd = (e) => {
        if (!draggingPiece || draggingPiece.id !== p.id) return;
        pieceEl.classList.remove('dragging');

        if (dragGhost && dragGhost.parentNode) {
          dragGhost.parentNode.removeChild(dragGhost);
          dragGhost = null;
        }

        document.querySelectorAll('.tangram-slot').forEach(s => s.classList.remove('highlight'));

        if (hasMovedFar) {
          // Check drop destination
          const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
          const slotEl = elemBelow ? elemBelow.closest('.tangram-slot') : null;
          if (slotEl && !fittedMap[slotEl.dataset.id]) {
            snapPieceToSlot(p.id, slotEl.dataset.id);
          }
        } else {
          // It was a gentle tap / click
          if (selectedPieceId === p.id) {
            selectedPieceId = null;
            pieceEl.classList.remove('selected');
            statusMsg.textContent = 'Drag a shape or tap a piece to connect.';
          } else {
            selectedPieceId = p.id;
            document.querySelectorAll('.tangram-piece').forEach(el => el.classList.remove('selected'));
            pieceEl.classList.add('selected');
            statusMsg.textContent = 'Shape selected! Tap the matching silhouette slot to place it.';
          }
        }

        draggingPiece = null;
      };

      pieceEl.addEventListener('pointerup', onPointerEnd);
      pieceEl.addEventListener('pointercancel', onPointerEnd);

      trayEl.appendChild(pieceEl);
    });
  }

  function renderBoard(fig) {
    boardEl.innerHTML = '';
    fig.pieces.forEach(p => {
      const slotEl = document.createElement('div');
      slotEl.className = 'tangram-slot';
      slotEl.dataset.id = p.id;
      slotEl.dataset.shapeType = p.shapeType;
      slotEl.style.width = p.width;
      slotEl.style.height = p.height;
      slotEl.style.clipPath = p.clip;
      slotEl.style.borderRadius = p.round;
      slotEl.style.top = p.top;
      slotEl.style.left = p.left;

      if (fittedMap[p.id]) {
        slotEl.classList.add('fitted');
        slotEl.style.background = p.color;
      }

      // Tap-to-place fallback
      slotEl.addEventListener('click', () => {
        if (fittedMap[p.id]) return;
        if (selectedPieceId) {
          snapPieceToSlot(selectedPieceId, p.id);
        } else {
          statusMsg.textContent = 'Pick a shape from the tray first, or drag it here!';
        }
      });

      boardEl.appendChild(slotEl);
    });
  }

  function openLevelsModal() {
    levelsGrid.innerHTML = '';
    FIGURES.forEach((fig, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn-lvl-card';
      if (idx === currentFigureIdx) btn.classList.add('active');
      btn.innerHTML = `<span>${fig.icon}</span> <span>${fig.id}. ${fig.name}</span>`;
      btn.addEventListener('click', () => {
        initFigure(idx);
      });
      levelsGrid.appendChild(btn);
    });
    modalLevels.style.display = 'flex';
  }

  // Bind Universal Header & Footer Controls
  document.getElementById('btn-levels-modal').addEventListener('click', openLevelsModal);
  document.getElementById('btn-close-levels').addEventListener('click', () => {
    modalLevels.style.display = 'none';
  });
  document.getElementById('btn-reset').addEventListener('click', () => initFigure(currentFigureIdx));
  document.getElementById('btn-next-figure').addEventListener('click', () => {
    initFigure((currentFigureIdx + 1) % FIGURES.length);
  });

  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Mute';
  });

  initFigure(0);
})();
