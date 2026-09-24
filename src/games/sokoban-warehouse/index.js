/**
 * Sokoban Warehouse Pro - Pure Vanilla JS Game Engine
 */
export function render(container, onWin) {
  let timerSeconds = 0;
  let moves = 0;
  let pushes = 0;
  const history = [];

  // Map representation:
  // # = Wall, . = Floor, G = Goal/Target, B = Box, X = Box on Goal, P = Player, @ = Player on Goal
  const INITIAL_LEVEL = [
    ['#','#','#','#','#','#','#'],
    ['#','.','.','G','#','.','#'],
    ['#','.','B','.','B','.','#'],
    ['#','G','.','P','.','G','#'],
    ['#','.','B','.','B','.','#'],
    ['#','.','.','G','#','.','#'],
    ['#','#','#','#','#','#','#']
  ];

  let grid = JSON.parse(JSON.stringify(INITIAL_LEVEL));
  let playerPos = { r: 3, c: 3 };

  const timerInterval = setInterval(() => timerSeconds++, 1000);

  container.innerHTML = `
    <div class="w-full h-full flex flex-col items-center justify-between bg-slate-950 text-white p-3 select-none">
      
      <!-- Header -->
      <div class="w-full max-w-md flex items-center justify-between px-4 py-2 bg-slate-800 rounded-2xl border border-slate-700 shadow-md">
        <div class="flex items-center gap-3">
          <span class="text-xs font-black text-amber-400">📦 Sokoban Pro</span>
          <span id="sk-stats" class="text-xs font-bold text-slate-300">Moves: 0 | Pushes: 0</span>
        </div>
        <div class="flex items-center gap-2">
          <button id="sk-undo" class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-bold text-slate-200 transition active:scale-95">
            ↩ Undo
          </button>
          <button id="sk-reset" class="px-2.5 py-1 bg-rose-900/80 hover:bg-rose-800 rounded-lg text-xs font-bold text-rose-200 transition active:scale-95">
            🔄 Reset
          </button>
        </div>
      </div>

      <!-- Grid Board -->
      <div id="sk-board" class="p-3 bg-slate-900 rounded-3xl border-2 border-slate-700 shadow-2xl flex flex-col gap-1 items-center justify-center">
        <!-- Rendered dynamically -->
      </div>

      <!-- Virtual D-Pad for Touch / Mobile -->
      <div class="flex flex-col items-center gap-1">
        <button id="sk-btn-up" class="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-90 flex items-center justify-center font-black text-lg border border-slate-600 shadow-md">
          ⬆️
        </button>
        <div class="flex items-center gap-3">
          <button id="sk-btn-left" class="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-90 flex items-center justify-center font-black text-lg border border-slate-600 shadow-md">
            ⬅️
          </button>
          <button id="sk-btn-down" class="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-90 flex items-center justify-center font-black text-lg border border-slate-600 shadow-md">
            ⬇️
          </button>
          <button id="sk-btn-right" class="w-12 h-12 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-90 flex items-center justify-center font-black text-lg border border-slate-600 shadow-md">
            ➡️
          </button>
        </div>
      </div>

    </div>
  `;

  const boardEl = container.querySelector('#sk-board');
  const statsEl = container.querySelector('#sk-stats');
  const undoBtn = container.querySelector('#sk-undo');
  const resetBtn = container.querySelector('#sk-reset');

  function renderBoard() {
    boardEl.innerHTML = '';

    grid.forEach((row, r) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'flex gap-1';

      row.forEach((cell, c) => {
        const cellEl = document.createElement('div');
        cellEl.className = 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-black transition-all';

        if (cell === '#') {
          cellEl.className += ' bg-slate-800 border border-slate-700 text-slate-600';
          cellEl.textContent = '🧱';
        } else if (cell === 'G') {
          cellEl.className += ' bg-emerald-950/60 border border-emerald-500/40 text-emerald-400';
          cellEl.textContent = '🎯';
        } else if (cell === 'B') {
          cellEl.className += ' bg-amber-700/80 border-2 border-amber-500 text-amber-200 shadow-md';
          cellEl.textContent = '📦';
        } else if (cell === 'X') {
          cellEl.className += ' bg-emerald-700 border-2 border-emerald-400 text-white shadow-md scale-105';
          cellEl.textContent = '✅';
        } else if (cell === 'P' || cell === '@') {
          cellEl.className += ' bg-sky-600 border-2 border-sky-300 text-white shadow-lg scale-105';
          cellEl.textContent = '👷';
        } else {
          cellEl.className += ' bg-slate-900/80 border border-slate-800';
        }

        rowEl.appendChild(cellEl);
      });

      boardEl.appendChild(rowEl);
    });

    statsEl.textContent = `Moves: ${moves} | Pushes: ${pushes}`;
  }

  function move(dr, dc) {
    const nr = playerPos.r + dr;
    const nc = playerPos.c + dc;

    if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) return;
    const nextCell = grid[nr][nc];

    if (nextCell === '#') return; // Hit wall

    // Box ahead
    if (nextCell === 'B' || nextCell === 'X') {
      const bnr = nr + dr;
      const bnc = nc + dc;

      if (bnr < 0 || bnr >= grid.length || bnc < 0 || bnc >= grid[0].length) return;
      const boxNextCell = grid[bnr][bnc];

      if (boxNextCell === '.' || boxNextCell === 'G') {
        // Record undo
        history.push({
          grid: JSON.parse(JSON.stringify(grid)),
          playerPos: { ...playerPos },
          moves,
          pushes
        });

        // Move box
        grid[bnr][bnc] = boxNextCell === 'G' ? 'X' : 'B';

        // Update box origin
        grid[nr][nc] = nextCell === 'X' ? '@' : 'P';

        // Update player origin
        const currentCell = grid[playerPos.r][playerPos.c];
        grid[playerPos.r][playerPos.c] = currentCell === '@' ? 'G' : '.';

        playerPos = { r: nr, c: nc };
        moves++;
        pushes++;
        renderBoard();
        checkWin();
      }
      return;
    }

    // Free space ahead
    if (nextCell === '.' || nextCell === 'G') {
      history.push({
        grid: JSON.parse(JSON.stringify(grid)),
        playerPos: { ...playerPos },
        moves,
        pushes
      });

      grid[nr][nc] = nextCell === 'G' ? '@' : 'P';
      const currentCell = grid[playerPos.r][playerPos.c];
      grid[playerPos.r][playerPos.c] = currentCell === '@' ? 'G' : '.';

      playerPos = { r: nr, c: nc };
      moves++;
      renderBoard();
    }
  }

  function checkWin() {
    let remainingTargets = 0;
    grid.forEach(row => {
      row.forEach(cell => {
        if (cell === 'G' || cell === '@') remainingTargets++;
      });
    });

    if (remainingTargets === 0) {
      clearInterval(timerInterval);
      setTimeout(() => {
        onWin(timerSeconds, 1);
      }, 500);
    }
  }

  function handleKeydown(e) {
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { e.preventDefault(); move(-1, 0); }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { e.preventDefault(); move(1, 0); }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { e.preventDefault(); move(0, -1); }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); move(0, 1); }
  }

  window.addEventListener('keydown', handleKeydown);

  container.querySelector('#sk-btn-up')?.addEventListener('click', () => move(-1, 0));
  container.querySelector('#sk-btn-down')?.addEventListener('click', () => move(1, 0));
  container.querySelector('#sk-btn-left')?.addEventListener('click', () => move(0, -1));
  container.querySelector('#sk-btn-right')?.addEventListener('click', () => move(0, 1));

  undoBtn.addEventListener('click', () => {
    if (history.length > 0) {
      const prev = history.pop();
      grid = prev.grid;
      playerPos = prev.playerPos;
      moves = prev.moves;
      pushes = prev.pushes;
      renderBoard();
    }
  });

  resetBtn.addEventListener('click', () => {
    grid = JSON.parse(JSON.stringify(INITIAL_LEVEL));
    playerPos = { r: 3, c: 3 };
    moves = 0;
    pushes = 0;
    history.length = 0;
    renderBoard();
  });

  renderBoard();

  return () => {
    clearInterval(timerInterval);
    window.removeEventListener('keydown', handleKeydown);
  };
}
