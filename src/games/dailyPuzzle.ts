/**
 * Daily Brain Challenge Engine
 * Seeded by the current UTC date so every player globally gets the exact same daily puzzle.
 * Supports both TOUCH finger and MOUSE pointer dragging and tapping!
 */
import { recordDailyCompletion, getDailyState, getTodayUtcDateString } from '../utils/storage';
import { setupPointerDragAndDrop } from '../utils/dragInteraction';

export function renderDailyGame(
  container: HTMLElement,
  onComplete: (timeSeconds: number, streak: number) => void
): () => void {
  const todayStr = getTodayUtcDateString();
  
  // Seed pseudo-random generator from YYYYMMDD
  const seedNum = parseInt(todayStr.replace(/-/g, ''), 10);
  
  // Create a 4x4 Latin Square logic puzzle
  // Base solution pattern
  const baseSolution = [
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [4, 3, 2, 1],
    [2, 1, 4, 3]
  ];

  // Shift rows/columns based on seed
  const shift = seedNum % 4;
  const solution = baseSolution.map((row) => 
    row.map((val) => ((val - 1 + shift) % 4) + 1)
  );

  // Mask some cells to create the puzzle (6 fixed numbers, 10 empty)
  const initialGrid = solution.map((row, rIdx) =>
    row.map((val, cIdx) => {
      const showCell = (rIdx * 4 + cIdx + seedNum) % 3 === 0;
      return showCell ? val : 0;
    })
  );

  const userGrid = initialGrid.map(row => [...row]);
  let selectedCell: [number, number] | null = null;
  const startTime = Date.now();
  let timerInterval: number | null = null;
  let elapsedSeconds = 0;

  // Render DOM
  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full bg-white rounded-2xl border border-black/5 shadow-sm">
      <div class="w-full flex items-center justify-between mb-4 pb-3 border-b border-black/5">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            Daily Logic Puzzle • ${todayStr}
          </span>
          <p class="text-xs text-gray-500 mt-1">Fill each row & column with digits 1 to 4.</p>
        </div>
      </div>

      <!-- 4x4 Grid -->
      <div id="daily-grid" class="grid grid-cols-4 gap-2 w-full aspect-square max-w-[320px] mb-4 bg-gray-100 p-2 rounded-xl">
      </div>

      <!-- Number Input Pad -->
      <div class="w-full max-w-[320px]">
        <div class="text-xs font-semibold text-gray-500 mb-2 text-center">Drag or tap a number:</div>
        <div class="grid grid-cols-5 gap-2">
          ${[1, 2, 3, 4].map(n => `
            <button class="num-btn h-12 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-lg rounded-xl transition shadow-sm cursor-grab touch-none" data-num="${n}" data-drag-data="${n}">
              ${n}
            </button>
          `).join('')}
          <button class="num-btn h-12 bg-gray-200 hover:bg-gray-300 active:scale-95 text-gray-700 font-bold text-lg rounded-xl transition" data-num="0">
            ✕
          </button>
        </div>
      </div>

      <div id="daily-status" class="mt-4 text-xs font-medium text-center text-gray-500 min-h-[20px]">
        Drag numbers with mouse arrow or touch finger! 🖐️🖱️
      </div>
    </div>
  `;

  const gridEl = container.querySelector('#daily-grid') as HTMLElement;
  const timerEl = container.querySelector('#daily-timer') as HTMLElement;
  const statusEl = container.querySelector('#daily-status') as HTMLElement;

  function updateTimer() {
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const s = (elapsedSeconds % 60).toString().padStart(2, '0');
    if (timerEl) timerEl.textContent = `${m}:${s}`;
  }

  timerInterval = window.setInterval(updateTimer, 1000);

  function setGridVal(r: number, c: number, num: number) {
    if (initialGrid[r][c] !== 0) return; // Fixed cell

    userGrid[r][c] = num;
    statusEl.textContent = '';
    renderGrid();

    if (checkWinCondition()) {
      if (timerInterval) clearInterval(timerInterval);
      const dailyState = recordDailyCompletion(elapsedSeconds);
      onComplete(elapsedSeconds, dailyState.streak);
    }
  }

  function renderGrid() {
    gridEl.innerHTML = '';
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = userGrid[r][c];
        const isFixed = initialGrid[r][c] !== 0;
        const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c;

        const cell = document.createElement('button');
        cell.className = `
          daily-cell w-full h-full rounded-lg font-bold text-xl flex items-center justify-center transition touch-none
          ${isFixed ? 'bg-gray-200 text-gray-800 cursor-not-allowed' : 'bg-white hover:bg-emerald-50 text-emerald-900 cursor-pointer'}
          ${isSelected ? 'ring-4 ring-emerald-500 bg-emerald-100' : 'border border-black/5'}
        `;
        cell.textContent = val !== 0 ? val.toString() : '';
        cell.dataset.r = r.toString();
        cell.dataset.c = c.toString();

        if (!isFixed) {
          cell.addEventListener('click', () => {
            selectedCell = [r, c];
            renderGrid();
          });
        }
        gridEl.appendChild(cell);
      }
    }
  }

  function checkWinCondition() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (userGrid[r][c] !== solution[r][c]) {
          return false;
        }
      }
    }
    return true;
  }

  // Number Pad Listeners
  container.querySelectorAll('.num-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const num = parseInt((e.currentTarget as HTMLElement).dataset.num || '0', 10);
      if (!selectedCell) {
        statusEl.textContent = 'Please tap a cell in the grid first.';
        return;
      }
      const [r, c] = selectedCell;
      setGridVal(r, c, num);
    });
  });

  // Touch Finger & Mouse Pointer Drag-and-Drop!
  const cleanupDrag = setupPointerDragAndDrop({
    container,
    draggableSelector: '.num-btn[data-drag-data]',
    dropTargetSelector: '.daily-cell',
    onDrop: (draggedData: any, targetElement: HTMLElement) => {
      const r = parseInt(targetElement.dataset.r || '-1', 10);
      const c = parseInt(targetElement.dataset.c || '-1', 10);
      const num = typeof draggedData === 'number' ? draggedData : parseInt(draggedData, 10);

      if (r >= 0 && c >= 0 && !isNaN(num)) {
        setGridVal(r, c, num);
      }
    }
  });

  renderGrid();

  // Cleanup function
  return () => {
    if (timerInterval) clearInterval(timerInterval);
    cleanupDrag();
  };
}
