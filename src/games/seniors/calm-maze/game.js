// Calm Maze 60+ - Standalone Vanilla JS
(() => {
  const startTime = Date.now();
  let player = { r: 0, c: 0 };
  let playerFacing = 'down';
  const goal = { r: 8, c: 8 };
  let visited = new Set();
  let moveCount = 0;
  let isWon = false;
  let soundEnabled = true;

  // 9x9 Maze Walls definition
  // Each cell has [top, right, bottom, left] (1 = wall, 0 = open)
  // Designed so there is a pleasant, clear winding corridor to the finish!
  const MAZE = [
    // Row 0
    [[1,0,0,1], [1,0,1,0], [1,0,0,0], [1,1,0,0], [1,0,1,1], [1,0,0,0], [1,1,1,0], [1,0,0,1], [1,1,1,0]],
    // Row 1
    [[0,1,1,1], [1,0,0,1], [0,1,1,0], [0,0,1,1], [1,0,0,0], [0,1,1,0], [1,0,0,1], [0,1,1,0], [1,1,0,1]],
    // Row 2
    [[1,0,0,1], [0,1,1,0], [1,0,0,1], [1,1,0,0], [0,1,1,1], [1,0,0,1], [0,1,0,0], [1,0,1,1], [0,1,0,0]],
    // Row 3
    [[0,1,0,1], [1,0,0,1], [0,1,1,0], [0,0,1,1], [1,0,0,0], [0,1,1,0], [0,0,1,1], [1,0,0,0], [0,1,1,0]],
    // Row 4
    [[0,0,1,1], [0,1,1,0], [1,0,0,1], [1,1,0,0], [0,0,1,1], [1,0,1,0], [1,1,0,0], [0,1,1,1], [1,1,0,1]],
    // Row 5
    [[1,0,0,1], [1,1,0,0], [0,1,1,1], [0,0,1,1], [1,0,0,0], [1,1,0,0], [0,0,1,1], [1,0,0,0], [0,1,1,0]],
    // Row 6
    [[0,1,1,1], [0,0,1,1], [1,0,0,0], [1,1,0,0], [0,1,1,1], [0,0,1,1], [1,0,0,0], [0,1,1,0], [1,1,0,1]],
    // Row 7
    [[1,0,0,1], [1,0,1,0], [0,1,1,0], [0,0,1,1], [1,0,0,0], [1,1,0,0], [0,1,1,1], [1,0,0,1], [0,1,0,0]],
    // Row 8
    [[0,0,1,1], [1,0,1,0], [1,0,1,0], [1,0,1,0], [0,1,1,0], [0,0,1,1], [1,0,1,0], [0,0,1,1], [0,1,1,0]]
  ];

  // Guarantee outer boundaries have walls
  for (let c = 0; c < 9; c++) {
    MAZE[0][c][0] = 1; // Top
    MAZE[8][c][2] = 1; // Bottom
  }
  for (let r = 0; r < 9; r++) {
    MAZE[r][0][3] = 1; // Left
    MAZE[r][8][1] = 1; // Right
  }

  // Ensure walls match between adjacent neighbors
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (r > 0 && MAZE[r][c][0] === 1) MAZE[r - 1][c][2] = 1;
      if (r < 8 && MAZE[r][c][2] === 1) MAZE[r + 1][c][0] = 1;
      if (c > 0 && MAZE[r][c][3] === 1) MAZE[r][c - 1][1] = 1;
      if (c < 8 && MAZE[r][c][1] === 1) MAZE[r][c + 1][3] = 1;
    }
  }

  // Verify and guarantee maze solvability from (0,0) to (8,8)
  function verifyAndGuaranteeSolution() {
    const queue = [[0, 0]];
    const seen = new Set(['0,0']);
    const dirs = [
      [-1, 0, 0, 2], // up
      [0, 1, 1, 3],  // right
      [1, 0, 2, 0],  // down
      [0, -1, 3, 1]  // left
    ];

    while (queue.length > 0) {
      const [cr, cc] = queue.shift();
      if (cr === goal.r && cc === goal.c) return true;

      for (const [dr, dc, wIdx, oppIdx] of dirs) {
        const nr = cr + dr;
        const nc = cc + dc;
        if (nr >= 0 && nr < 9 && nc >= 0 && nc < 9) {
          if (!MAZE[cr][cc][wIdx] && !MAZE[nr][nc][oppIdx]) {
            const key = `${nr},${nc}`;
            if (!seen.has(key)) {
              seen.add(key);
              queue.push([nr, nc]);
            }
          }
        }
      }
    }

    // Carve corridor if blocked
    let r = 0, c = 0;
    while (r < 8 || c < 8) {
      if (r < 8 && (c === 8 || Math.random() < 0.5)) {
        MAZE[r][c][2] = 0;
        MAZE[r + 1][c][0] = 0;
        r++;
      } else if (c < 8) {
        MAZE[r][c][1] = 0;
        MAZE[r][c + 1][3] = 0;
        c++;
      }
    }
    return true;
  }
  verifyAndGuaranteeSolution();

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

  function playStepSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  }

  function playBumpSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {}
  }

  function playWinSound() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
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

  const mazeEl = document.getElementById('maze-container');
  const stepsCountEl = document.getElementById('steps-count');
  const statusMsg = document.getElementById('status-msg');
  const soundBtn = document.getElementById('btn-sound');
  const resetBtn = document.getElementById('btn-reset');

  function renderMaze() {
    mazeEl.innerHTML = '';
    visited.add(`${player.r},${player.c}`);

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const cell = document.createElement('div');
        cell.className = 'maze-cell';
        const walls = MAZE[r][c];

        if (walls[0]) cell.classList.add('wall-top');
        if (walls[1]) cell.classList.add('wall-right');
        if (walls[2]) cell.classList.add('wall-bottom');
        if (walls[3]) cell.classList.add('wall-left');

        if (player.r === r && player.c === c) {
          const marker = document.createElement('div');
          marker.className = `player-marker facing-${playerFacing} walk-step-${moveCount % 2}`;
          
          if (playerFacing === 'down') {
            marker.innerHTML = `
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <!-- Head -->
                <circle cx="16" cy="7" r="4.5" fill="#fbcfe8" stroke="#be185d" stroke-width="1.2"/>
                <!-- Hair / Cap -->
                <path d="M12 5.5 C12 3 20 3 20 5.5" stroke="#0f766e" stroke-width="2" stroke-linecap="round"/>
                <!-- Smiling Face Eyes -->
                <circle cx="14.5" cy="7" r="0.7" fill="#0f172a"/>
                <circle cx="17.5" cy="7" r="0.7" fill="#0f172a"/>
                <path d="M15 9 Q16 10 17 9" stroke="#be185d" stroke-width="0.8" stroke-linecap="round"/>
                <!-- Body -->
                <rect x="12" y="12" width="8" height="9" rx="3" fill="#0d9488" stroke="#0f766e" stroke-width="1.2"/>
                <!-- Arms -->
                <path d="M11 14 L9 18" stroke="#0f766e" stroke-width="2" stroke-linecap="round"/>
                <path d="M21 14 L23 18" stroke="#0f766e" stroke-width="2" stroke-linecap="round"/>
                <!-- Legs (Walking) -->
                ${(moveCount % 2 === 0) 
                  ? '<path d="M14 21 L13 28 M18 21 L19 28" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>' 
                  : '<path d="M14 21 L12 27 M18 21 L20 27" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>'}
              </svg>
            `;
          } else if (playerFacing === 'up') {
            marker.innerHTML = `
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <!-- Back of Head / Cap -->
                <circle cx="16" cy="7" r="4.5" fill="#0f766e" stroke="#042f2e" stroke-width="1.2"/>
                <!-- Body Back -->
                <rect x="12" y="12" width="8" height="9" rx="3" fill="#0d9488" stroke="#0f766e" stroke-width="1.2"/>
                <!-- Arms Upward -->
                <path d="M11 15 L10 12" stroke="#0f766e" stroke-width="2" stroke-linecap="round"/>
                <path d="M21 15 L22 12" stroke="#0f766e" stroke-width="2" stroke-linecap="round"/>
                <!-- Legs -->
                ${(moveCount % 2 === 0)
                  ? '<path d="M14 21 L14 28 M18 21 L18 28" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>'
                  : '<path d="M14 21 L12 28 M18 21 L20 28" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>'}
              </svg>
            `;
          } else if (playerFacing === 'right') {
            marker.innerHTML = `
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <!-- Head Profile -->
                <circle cx="17" cy="7" r="4.5" fill="#fbcfe8" stroke="#be185d" stroke-width="1.2"/>
                <path d="M13 5 C15 3 20 4 21 6" stroke="#0f766e" stroke-width="2" stroke-linecap="round"/>
                <circle cx="19" cy="7" r="0.7" fill="#0f172a"/>
                <!-- Body -->
                <rect x="13" y="12" width="7" height="9" rx="3" fill="#0d9488" stroke="#0f766e" stroke-width="1.2"/>
                <!-- Arm Swing Right -->
                <path d="M16 14 L20 18" stroke="#0f766e" stroke-width="2" stroke-linecap="round"/>
                <!-- Legs Walking Right -->
                ${(moveCount % 2 === 0)
                  ? '<path d="M15 21 L12 28 M17 21 L22 28" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>'
                  : '<path d="M15 21 L20 28 M17 21 L13 28" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>'}
              </svg>
            `;
          } else { // left
            marker.innerHTML = `
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style="transform: scaleX(-1);">
                <!-- Head Profile -->
                <circle cx="17" cy="7" r="4.5" fill="#fbcfe8" stroke="#be185d" stroke-width="1.2"/>
                <path d="M13 5 C15 3 20 4 21 6" stroke="#0f766e" stroke-width="2" stroke-linecap="round"/>
                <circle cx="19" cy="7" r="0.7" fill="#0f172a"/>
                <!-- Body -->
                <rect x="13" y="12" width="7" height="9" rx="3" fill="#0d9488" stroke="#0f766e" stroke-width="1.2"/>
                <!-- Arm Swing -->
                <path d="M16 14 L20 18" stroke="#0f766e" stroke-width="2" stroke-linecap="round"/>
                <!-- Legs Walking -->
                ${(moveCount % 2 === 0)
                  ? '<path d="M15 21 L12 28 M17 21 L22 28" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>'
                  : '<path d="M15 21 L20 28 M17 21 L13 28" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>'}
              </svg>
            `;
          }

          cell.appendChild(marker);
        } else if (goal.r === r && goal.c === c) {
          const goalMarker = document.createElement('div');
          goalMarker.className = 'goal-marker';
          goalMarker.textContent = '🏁';
          cell.appendChild(goalMarker);
        } else if (visited.has(`${r},${c}`)) {
          const dot = document.createElement('div');
          dot.className = 'trail-dot';
          cell.appendChild(dot);
        }

        cell.addEventListener('click', () => {
          if (r === player.r - 1 && c === player.c) move('UP');
          else if (r === player.r + 1 && c === player.c) move('DOWN');
          else if (r === player.r && c === player.c - 1) move('LEFT');
          else if (r === player.r && c === player.c + 1) move('RIGHT');
        });

        mazeEl.appendChild(cell);
      }
    }

    stepsCountEl.textContent = moveCount;

    if (player.r === goal.r && player.c === goal.c && !isWon) {
      handleWin();
    }
  }

  function move(direction) {
    if (isWon) return;
    const { r, c } = player;
    const walls = MAZE[r][c];

    let targetR = r;
    let targetC = c;
    let isBlocked = false;

    if (direction === 'UP') {
      playerFacing = 'up';
      if (walls[0] || r === 0) isBlocked = true;
      else targetR--;
    } else if (direction === 'RIGHT') {
      playerFacing = 'right';
      if (walls[1] || c === 8) isBlocked = true;
      else targetC++;
    } else if (direction === 'DOWN') {
      playerFacing = 'down';
      if (walls[2] || r === 8) isBlocked = true;
      else targetR++;
    } else if (direction === 'LEFT') {
      playerFacing = 'left';
      if (walls[3] || c === 0) isBlocked = true;
      else targetC--;
    }

    if (isBlocked) {
      playBumpSound();
      return;
    }

    player.r = targetR;
    player.c = targetC;
    moveCount++;
    playStepSound();
    renderMaze();
  }

  function handleWin() {
    isWon = true;
    playWinSound();
    const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    statusMsg.textContent = '🎉 Splendid! You safely reached the finish line!';
    statusMsg.style.color = '#0f766e';

    try {
      window.parent.postMessage({ type: 'win', time: elapsed }, '*');
    } catch (_) {}
  }

  // D-Pad buttons
  document.querySelectorAll('.dpad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      move(btn.dataset.dir);
    });
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'KeyW'].includes(e.code)) {
      e.preventDefault();
      move('UP');
    } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
      e.preventDefault();
      move('DOWN');
    } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
      e.preventDefault();
      move('LEFT');
    } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
      e.preventDefault();
      move('RIGHT');
    }
  });

  // Swipe support
  let touchStartX = 0;
  let touchStartY = 0;
  mazeEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  mazeEl.addEventListener('touchend', (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 25) {
        move(diffX > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(diffY) > 25) {
        move(diffY > 0 ? 'DOWN' : 'UP');
      }
    }
  }, { passive: true });

  resetBtn.addEventListener('click', () => {
    if (confirm('Restart the maze from the beginning?')) {
      player = { r: 0, c: 0 };
      visited.clear();
      moveCount = 0;
      isWon = false;
      statusMsg.textContent = 'Guide the walker 🚶‍♂️ to the finish flag 🏁.';
      statusMsg.style.color = '#0f766e';
      renderMaze();
    }
  });

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
  });

  renderMaze();
})();
