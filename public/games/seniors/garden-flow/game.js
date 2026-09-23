// Garden Flow 60+ - Standalone Vanilla JS
(() => {
  const startTime = Date.now();
  let rotationsCount = 0;
  let isWon = false;
  let soundEnabled = true;

  // Directions: [top, right, bottom, left]
  // Pipe Types:
  // 'line': connects top and bottom (rot 0: vertical, rot 1: horizontal)
  // 'curve': connects top and right (rot 0: top-right, rot 1: right-bottom, rot 2: bottom-left, rot 3: left-top)
  // 'tee': connects top, right, bottom

  // 4x4 Layout:
  // (0,0) Water source enters from Top.
  // Winning path: (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2) -> (2,3) -> (3,3) -> Flowers!
  const INITIAL_GRID = [
    // Row 0
    [
      { type: 'curve', targetRot: 1 }, // rot 1: right, bottom (connects from top/source into right!) Or rot 1: top connects to right?
      // Let's specify explicitly:
      // rot 0: [1, 1, 0, 0] (top, right)
      // rot 1: [0, 1, 1, 0] (right, bottom)
      // rot 2: [0, 0, 1, 1] (bottom, left)
      // rot 3: [1, 0, 0, 1] (left, top)
      { type: 'line',  targetRot: 1 }, // rot 1: [0, 1, 0, 1] (left, right)
      { type: 'curve', targetRot: 1 }, // rot 1: [0, 1, 1, 0] (right, bottom) -> wait, left into bottom is rot 2: [0, 0, 1, 1]
      { type: 'curve', targetRot: 0 }  // decorative
    ],
    // Row 1
    [
      { type: 'line',  targetRot: 0 },
      { type: 'curve', targetRot: 3 },
      { type: 'line',  targetRot: 0 }, // rot 0: [1, 0, 1, 0] (top, bottom)
      { type: 'line',  targetRot: 0 }
    ],
    // Row 2
    [
      { type: 'curve', targetRot: 1 },
      { type: 'line',  targetRot: 1 },
      { type: 'curve', targetRot: 0 }, // rot 0: [1, 1, 0, 0] (top, right)
      { type: 'curve', targetRot: 1 }  // rot 1: [0, 1, 1, 0] (right, bottom) -> wait from left into bottom is rot 2!
    ],
    // Row 3
    [
      { type: 'line',  targetRot: 1 },
      { type: 'curve', targetRot: 2 },
      { type: 'line',  targetRot: 1 },
      { type: 'line',  targetRot: 0 }  // rot 0: [1, 0, 1, 0] (top, bottom exits to flowers!)
    ]
  ];

  // Fix exact target rotations for path:
  // (0,0): Water Tap is at top of (0,0). So pipe needs TOP connection and RIGHT connection -> rot 0 is [1, 1, 0, 0]!
  INITIAL_GRID[0][0].targetRot = 0;
  // (0,1): Needs LEFT and RIGHT -> line rot 1 [0, 1, 0, 1]
  INITIAL_GRID[0][1].targetRot = 1;
  // (0,2): Needs LEFT and BOTTOM -> curve rot 2 [0, 0, 1, 1]
  INITIAL_GRID[0][2].targetRot = 2;
  // (1,2): Needs TOP and BOTTOM -> line rot 0 [1, 0, 1, 0]
  INITIAL_GRID[1][2].targetRot = 0;
  // (2,2): Needs TOP and RIGHT -> curve rot 0 [1, 1, 0, 0]
  INITIAL_GRID[2][2].targetRot = 0;
  // (2,3): Needs LEFT and BOTTOM -> curve rot 2 [0, 0, 1, 1]
  INITIAL_GRID[2][3].targetRot = 2;
  // (3,3): Needs TOP and BOTTOM -> line rot 0 [1, 0, 1, 0]
  INITIAL_GRID[3][3].targetRot = 0;

  // Clone into live grid with friendly scrambles (each tile is only 1-2 clicks away from victory!)
  const grid = INITIAL_GRID.map((row, r) =>
    row.map((cell, c) => {
      // Scramble by 1, 2, or 3 turns
      const scramble = (r + c) % 3 === 0 ? 1 : (r * c) % 2 === 0 ? 3 : 2;
      return {
        type: cell.type,
        currentRot: (cell.targetRot + scramble) % 4,
        targetRot: cell.targetRot,
        isFlowing: false
      };
    })
  );

  // Audio Synth
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) audioCtx = new AudioCtxClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playTurnSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  }

  function playFlowSound() {
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

  // Get active openings for a tile given rotation: [top, right, bottom, left]
  function getOpenings(type, rot) {
    if (type === 'line') {
      return rot % 2 === 0 ? [1, 0, 1, 0] : [0, 1, 0, 1];
    } else if (type === 'curve') {
      // 0: top, right; 1: right, bottom; 2: bottom, left; 3: left, top
      if (rot === 0) return [1, 1, 0, 0];
      if (rot === 1) return [0, 1, 1, 0];
      if (rot === 2) return [0, 0, 1, 1];
      if (rot === 3) return [1, 0, 0, 1];
    }
    return [0, 0, 0, 0];
  }

  const gridEl = document.getElementById('pipe-grid');
  const turnsCountEl = document.getElementById('turns-count');
  const statusMsg = document.getElementById('status-msg');
  const soundBtn = document.getElementById('btn-sound');
  const resetBtn = document.getElementById('btn-reset');

  function updateFlow() {
    // Reset flowing flags
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        grid[r][c].isFlowing = false;
      }
    }

    // Source enters (0,0) from TOP
    const queue = [];
    const visited = new Set();

    const startOpenings = getOpenings(grid[0][0].type, grid[0][0].currentRot);
    if (startOpenings[0] === 1) { // Open to top source
      grid[0][0].isFlowing = true;
      queue.push({ r: 0, c: 0 });
      visited.add('0,0');
    }

    while (queue.length > 0) {
      const cur = queue.shift();
      const curOpen = getOpenings(grid[cur.r][cur.c].type, grid[cur.r][cur.c].currentRot);

      // Check Top neighbor
      if (curOpen[0] && cur.r > 0 && !visited.has(`${cur.r - 1},${cur.c}`)) {
        const nOpen = getOpenings(grid[cur.r - 1][cur.c].type, grid[cur.r - 1][cur.c].currentRot);
        if (nOpen[2]) { // neighbor has bottom open
          grid[cur.r - 1][cur.c].isFlowing = true;
          visited.add(`${cur.r - 1},${cur.c}`);
          queue.push({ r: cur.r - 1, c: cur.c });
        }
      }

      // Check Right neighbor
      if (curOpen[1] && cur.c < 3 && !visited.has(`${cur.r},${cur.c + 1}`)) {
        const nOpen = getOpenings(grid[cur.r][cur.c + 1].type, grid[cur.r][cur.c + 1].currentRot);
        if (nOpen[3]) { // neighbor has left open
          grid[cur.r][cur.c + 1].isFlowing = true;
          visited.add(`${cur.r},${cur.c + 1}`);
          queue.push({ r: cur.r, c: cur.c + 1 });
        }
      }

      // Check Bottom neighbor
      if (curOpen[2] && cur.r < 3 && !visited.has(`${cur.r + 1},${cur.c}`)) {
        const nOpen = getOpenings(grid[cur.r + 1][cur.c].type, grid[cur.r + 1][cur.c].currentRot);
        if (nOpen[0]) { // neighbor has top open
          grid[cur.r + 1][cur.c].isFlowing = true;
          visited.add(`${cur.r + 1},${cur.c}`);
          queue.push({ r: cur.r + 1, c: cur.c });
        }
      }

      // Check Left neighbor
      if (curOpen[3] && cur.c > 0 && !visited.has(`${cur.r},${cur.c - 1}`)) {
        const nOpen = getOpenings(grid[cur.r][cur.c - 1].type, grid[cur.r][cur.c - 1].currentRot);
        if (nOpen[1]) { // neighbor has right open
          grid[cur.r][cur.c - 1].isFlowing = true;
          visited.add(`${cur.r},${cur.c - 1}`);
          queue.push({ r: cur.r, c: cur.c - 1 });
        }
      }
    }

    // Check if water reached (3,3) and exits through Bottom
    const endOpen = getOpenings(grid[3][3].type, grid[3][3].currentRot);
    if (grid[3][3].isFlowing && endOpen[2] === 1 && !isWon) {
      handleWin();
    }
  }

  function renderGrid() {
    gridEl.innerHTML = '';
    updateFlow();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cell = grid[r][c];
        const tileEl = document.createElement('div');
        tileEl.className = 'pipe-tile';
        if (cell.isFlowing) tileEl.classList.add('flowing');

        const angle = cell.currentRot * 90;
        tileEl.style.transform = `rotate(${angle}deg)`;

        // SVG pipe visualization
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('class', 'pipe-svg');

        let d = '';
        if (cell.type === 'line') {
          d = 'M 50 0 L 50 100';
        } else if (cell.type === 'curve') {
          d = 'M 50 0 Q 50 50 100 50';
        }

        const pathBg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathBg.setAttribute('d', d);
        pathBg.setAttribute('class', 'pipe-path-bg');

        const pathWater = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathWater.setAttribute('d', d);
        pathWater.setAttribute('class', 'pipe-path-water');

        svg.appendChild(pathBg);
        svg.appendChild(pathWater);
        tileEl.appendChild(svg);

        tileEl.addEventListener('click', () => {
          if (isWon) return;
          cell.currentRot = (cell.currentRot + 1) % 4;
          rotationsCount++;
          playTurnSound();
          renderGrid();
        });

        gridEl.appendChild(tileEl);
      }
    }

    turnsCountEl.textContent = rotationsCount;
  }

  function handleWin() {
    isWon = true;
    playFlowSound();
    const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    statusMsg.textContent = '🎉 Splendid! Fresh water is flowing to the garden!';
    statusMsg.style.color = '#15803d';

    try {
      window.parent.postMessage({ type: 'win', time: elapsed }, '*');
    } catch (_) {}
  }

  resetBtn.addEventListener('click', () => {
    if (confirm('Restart pipe rotation?')) {
      grid.forEach(row => row.forEach(cell => {
        cell.currentRot = (cell.targetRot + 2) % 4;
      }));
      rotationsCount = 0;
      isWon = false;
      statusMsg.textContent = 'Tap tiles to rotate pipes and flow water to flowers 🌸.';
      statusMsg.style.color = '#9d174d';
      renderGrid();
    }
  });

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
  });

  renderGrid();
})();
