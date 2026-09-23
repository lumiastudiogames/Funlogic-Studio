// Large Tube Sort 60+ - Standalone Vanilla JS Game
(() => {
  const CAPACITY = 4;
  const startTime = Date.now();
  let moveCount = 0;
  let selectedTubeIndex = null;
  let history = [];
  let isWon = false;
  let soundEnabled = true;

  // 4 distinct vibrant colors with emoji icons for maximum visibility
  const COLORS = [
    { id: 'blue', name: 'Blue', class: 'color-blue', symbol: '💧' },
    { id: 'green', name: 'Green', class: 'color-green', symbol: '🍀' },
    { id: 'orange', name: 'Orange', class: 'color-orange', symbol: '🍊' },
    { id: 'purple', name: 'Purple', class: 'color-purple', symbol: '🍇' }
  ];

  // Guaranteed solvable procedural 1-level configuration (4 tubes with colors, 2 empty tubes = 6 total)
  let tubes = [
    [COLORS[0], COLORS[1], COLORS[2], COLORS[0]],
    [COLORS[1], COLORS[3], COLORS[2], COLORS[3]],
    [COLORS[3], COLORS[0], COLORS[1], COLORS[2]],
    [COLORS[2], COLORS[3], COLORS[0], COLORS[1]],
    [],
    []
  ];

  // Sound Synth via Web Audio API
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playPourSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.18);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch (_) {}
  }

  function playWinSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.6);
      });
    } catch (_) {}
  }

  const tubesContainer = document.getElementById('tubes-container');
  const movesEl = document.getElementById('moves-counter');
  const undoBtn = document.getElementById('btn-undo');
  const resetBtn = document.getElementById('btn-reset');
  const soundBtn = document.getElementById('btn-sound');
  const statusMsg = document.getElementById('status-msg');

  function renderTubes() {
    tubesContainer.innerHTML = '';
    tubes.forEach((tube, idx) => {
      const tubeEl = document.createElement('div');
      tubeEl.className = 'tube';
      if (selectedTubeIndex === idx) {
        tubeEl.classList.add('selected');
      }
      
      const isComplete = tube.length === CAPACITY && tube.every(c => c.id === tube[0].id);
      if (isComplete) {
        tubeEl.classList.add('completed');
      }

      const lip = document.createElement('div');
      lip.className = 'tube-lip';
      tubeEl.appendChild(lip);

      tube.forEach(colorItem => {
        const layer = document.createElement('div');
        layer.className = `water-layer ${colorItem.class}`;
        layer.textContent = colorItem.symbol;
        tubeEl.appendChild(layer);
      });

      tubeEl.addEventListener('click', () => handleTubeClick(idx));
      tubesContainer.appendChild(tubeEl);
    });

    movesEl.textContent = moveCount;
    undoBtn.disabled = history.length === 0 || isWon;
    undoBtn.style.opacity = history.length === 0 || isWon ? '0.5' : '1';
  }

  function handleTubeClick(index) {
    if (isWon) return;

    if (selectedTubeIndex === null) {
      // Pick up source tube if it has liquid
      if (tubes[index].length > 0) {
        selectedTubeIndex = index;
        renderTubes();
      }
    } else {
      if (selectedTubeIndex === index) {
        // Deselect
        selectedTubeIndex = null;
        renderTubes();
      } else {
        // Try to pour from selectedTubeIndex to index
        attemptPour(selectedTubeIndex, index);
      }
    }
  }

  function attemptPour(fromIdx, toIdx) {
    const fromTube = tubes[fromIdx];
    const toTube = tubes[toIdx];

    if (fromTube.length === 0) {
      selectedTubeIndex = null;
      renderTubes();
      return;
    }

    if (toTube.length >= CAPACITY) {
      // Target tube is full, switch selection
      selectedTubeIndex = toIdx;
      renderTubes();
      return;
    }

    const topFrom = fromTube[fromTube.length - 1];
    const topTo = toTube.length > 0 ? toTube[toTube.length - 1] : null;

    if (topTo === null || topTo.id === topFrom.id) {
      // Save state for undo
      history.push({
        tubes: tubes.map(t => [...t]),
        moveCount: moveCount
      });

      // Move units of matching top color as long as there is space
      while (
        fromTube.length > 0 &&
        toTube.length < CAPACITY &&
        fromTube[fromTube.length - 1].id === topFrom.id
      ) {
        toTube.push(fromTube.pop());
      }

      moveCount++;
      playPourSound();
      selectedTubeIndex = null;
      renderTubes();
      checkWinCondition();
    } else {
      // Different color, change selection to this tube
      selectedTubeIndex = toIdx;
      renderTubes();
    }
  }

  function checkWinCondition() {
    let completedCount = 0;
    let emptyCount = 0;

    for (const tube of tubes) {
      if (tube.length === 0) {
        emptyCount++;
      } else if (tube.length === CAPACITY && tube.every(c => c.id === tube[0].id)) {
        completedCount++;
      }
    }

    if (completedCount === 4 && emptyCount === 2) {
      isWon = true;
      playWinSound();
      const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      statusMsg.textContent = '🎉 Splendid! You solved the puzzle!';
      statusMsg.style.color = '#15803d';

      // Official Platform Notification
      try {
        window.parent.postMessage({ type: 'win', time: elapsed }, '*');
      } catch (_) {}
    }
  }

  undoBtn.addEventListener('click', () => {
    if (history.length > 0 && !isWon) {
      const prev = history.pop();
      tubes = prev.tubes.map(t => [...t]);
      moveCount = prev.moveCount;
      selectedTubeIndex = null;
      renderTubes();
    }
  });

  resetBtn.addEventListener('click', () => {
    if (confirm('Start this puzzle over?')) {
      tubes = [
        [COLORS[0], COLORS[1], COLORS[2], COLORS[0]],
        [COLORS[1], COLORS[3], COLORS[2], COLORS[3]],
        [COLORS[3], COLORS[0], COLORS[1], COLORS[2]],
        [COLORS[2], COLORS[3], COLORS[0], COLORS[1]],
        [],
        []
      ];
      moveCount = 0;
      history = [];
      selectedTubeIndex = null;
      isWon = false;
      statusMsg.textContent = 'Tap a tube to pick up water, then tap another to pour.';
      statusMsg.style.color = '#475569';
      renderTubes();
    }
  });

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
  });

  // Initial render
  renderTubes();
})();
