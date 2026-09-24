/**
 * Interactive Sudoku Puzzle Engine
 * Supports 6x6 (easy/large print for Seniors) and 9x9 Classic Sudoku.
 * Supports both TOUCH finger and MOUSE pointer dragging and tapping!
 */
import { setupPointerDragAndDrop } from '../utils/dragInteraction';

export function renderSudokuGame(
  container: HTMLElement,
  size: 6 | 9 = 9,
  onWin: (seconds: number) => void
): () => void {
  // Preset valid Sudoku board (6x6 or 9x9)
  const solution6 = [
    [1, 2, 3, 4, 5, 6],
    [4, 5, 6, 1, 2, 3],
    [2, 3, 1, 5, 6, 4],
    [5, 6, 4, 2, 3, 1],
    [3, 1, 2, 6, 4, 5],
    [6, 4, 5, 3, 1, 2]
  ];

  const initial6 = [
    [1, 0, 3, 0, 5, 0],
    [0, 5, 0, 1, 0, 3],
    [2, 0, 0, 5, 0, 4],
    [5, 0, 4, 0, 0, 1],
    [3, 0, 2, 0, 4, 0],
    [0, 4, 0, 3, 0, 2]
  ];

  const solution9 = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
  ];

  const initial9 = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ];

  const solution = size === 6 ? solution6 : solution9;
  const initial = size === 6 ? initial6 : initial9;
  const board = initial.map(row => [...row]);

  let selected: [number, number] | null = null;
  const startTime = Date.now();
  let timerInterval: number | null = null;
  let elapsedSeconds = 0;

  const numCols = size;
  const numRows = size;
  const boxWidth = size === 6 ? 3 : 3;
  const boxHeight = size === 6 ? 2 : 3;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-4 max-w-lg mx-auto w-full bg-white rounded-2xl border border-black/5 shadow-sm">
      <div class="w-full flex items-center justify-between mb-4 pb-3 border-b border-black/5">
        <div>
          <h3 class="font-bold text-lg text-gray-800">${size === 6 ? 'Sudoku 60+ (Large Print)' : 'Classic Sudoku'}</h3>
          <p class="text-xs text-gray-500">Drag or tap a cell then pick a number.</p>
        </div>
        <div id="sdk-timer" class="text-sm font-mono font-bold bg-gray-100 px-3 py-1.5 rounded-lg">00:00</div>
      </div>

      <!-- Sudoku Board Grid -->
      <div id="sdk-grid" class="grid gap-1 bg-gray-300 p-1.5 rounded-xl w-full aspect-square max-w-[380px] mb-4" style="grid-template-columns: repeat(${size}, minmax(0, 1fr));">
      </div>

      <!-- Keypad -->
      <div class="w-full max-w-[380px]">
        <div class="grid grid-cols-${size === 6 ? '7' : '10'} gap-1.5">
          ${Array.from({ length: size }, (_, i) => i + 1).map(n => `
            <button class="sdk-num-btn h-12 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-lg rounded-xl transition shadow-sm cursor-grab touch-none" data-val="${n}" data-drag-data="${n}">
              ${n}
            </button>
          `).join('')}
          <button class="sdk-num-btn h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-lg rounded-xl transition" data-val="0">
            ✕
          </button>
        </div>
      </div>

      <div id="sdk-msg" class="mt-3 text-xs font-medium text-center text-gray-500 min-h-[18px]">
        Drag numbers with mouse arrow or touch finger! 🖐️🖱️
      </div>
    </div>
  `;

  const gridEl = container.querySelector('#sdk-grid') as HTMLElement;
  const timerEl = container.querySelector('#sdk-timer') as HTMLElement;
  const msgEl = container.querySelector('#sdk-msg') as HTMLElement;

  function updateTimer() {
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const s = (elapsedSeconds % 60).toString().padStart(2, '0');
    if (timerEl) timerEl.textContent = `${m}:${s}`;
  }
  timerInterval = window.setInterval(updateTimer, 1000);

  function placeNumber(r: number, c: number, val: number) {
    if (initial[r][c] !== 0) return;
    board[r][c] = val;
    msgEl.textContent = '';
    renderBoard();

    if (isSolved()) {
      if (timerInterval) clearInterval(timerInterval);
      onWin(elapsedSeconds);
    }
  }

  function renderBoard() {
    gridEl.innerHTML = '';
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const val = board[r][c];
        const isFixed = initial[r][c] !== 0;
        const isSelected = selected && selected[0] === r && selected[1] === c;

        // Border accents for boxes
        const isRightBoxBorder = (c + 1) % boxWidth === 0 && c < numCols - 1;
        const isBottomBoxBorder = (r + 1) % boxHeight === 0 && r < numRows - 1;

        const cell = document.createElement('button');
        cell.className = `
          sdk-cell w-full h-full font-bold flex items-center justify-center transition select-none touch-none
          ${size === 6 ? 'text-2xl rounded-lg' : 'text-lg rounded'}
          ${isFixed ? 'bg-gray-100 text-gray-900 cursor-not-allowed' : 'bg-white text-indigo-700 hover:bg-indigo-50 cursor-pointer'}
          ${isSelected ? 'ring-4 ring-indigo-500 bg-indigo-100 z-10' : ''}
          ${isRightBoxBorder ? 'mr-1' : ''}
          ${isBottomBoxBorder ? 'mb-1' : ''}
        `;
        cell.textContent = val !== 0 ? val.toString() : '';
        cell.dataset.r = r.toString();
        cell.dataset.c = c.toString();

        if (!isFixed) {
          cell.addEventListener('click', () => {
            selected = [r, c];
            renderBoard();
          });
        }
        gridEl.appendChild(cell);
      }
    }
  }

  function isSolved() {
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        if (board[r][c] !== solution[r][c]) return false;
      }
    }
    return true;
  }

  container.querySelectorAll('.sdk-num-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const val = parseInt((e.currentTarget as HTMLElement).dataset.val || '0', 10);
      if (!selected) {
        msgEl.textContent = 'Tap a cell on the board first.';
        return;
      }
      const [r, c] = selected;
      placeNumber(r, c, val);
    });
  });

  // Touch Finger & Mouse Pointer Drag-and-Drop!
  const cleanupDrag = setupPointerDragAndDrop({
    container,
    draggableSelector: '.sdk-num-btn[data-drag-data]',
    dropTargetSelector: '.sdk-cell',
    onDrop: (draggedData: any, targetElement: HTMLElement) => {
      const r = parseInt(targetElement.dataset.r || '-1', 10);
      const c = parseInt(targetElement.dataset.c || '-1', 10);
      const val = typeof draggedData === 'number' ? draggedData : parseInt(draggedData, 10);

      if (r >= 0 && c >= 0 && !isNaN(val)) {
        placeNumber(r, c, val);
      }
    }
  });

  renderBoard();

  return () => {
    if (timerInterval) clearInterval(timerInterval);
    cleanupDrag();
  };
}
