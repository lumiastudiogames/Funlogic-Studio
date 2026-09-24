/**
 * Interactive Chess Tactical Puzzle Engine
 * Supports both TOUCH finger and MOUSE pointer dragging and tapping!
 */
import { setupPointerDragAndDrop } from '../utils/dragInteraction';

export function renderChessPuzzleGame(
  container: HTMLElement,
  onWin: (seconds: number) => void
): () => void {
  type Piece = { symbol: string; color: 'w' | 'b'; type: string } | null;

  const initialBoard: Piece[][] = [
    [
      { symbol: '♜', color: 'b', type: 'r' },
      null,
      { symbol: '♝', color: 'b', type: 'b' },
      { symbol: '♛', color: 'b', type: 'q' },
      { symbol: '♚', color: 'b', type: 'k' },
      null,
      null,
      { symbol: '♜', color: 'b', type: 'r' }
    ],
    [
      { symbol: '♟', color: 'b', type: 'p' },
      { symbol: '♟', color: 'b', type: 'p' },
      { symbol: '♟', color: 'b', type: 'p' },
      null,
      null,
      { symbol: '♟', color: 'b', type: 'p' },
      { symbol: '♟', color: 'b', type: 'p' },
      { symbol: '♟', color: 'b', type: 'p' }
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, { symbol: '♗', color: 'w', type: 'b' }, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, { symbol: '♘', color: 'w', type: 'n' }, null, null, null, null, null],
    [
      { symbol: '♙', color: 'w', type: 'p' },
      { symbol: '♙', color: 'w', type: 'p' },
      { symbol: '♙', color: 'w', type: 'p' },
      { symbol: '♙', color: 'w', type: 'p' },
      { symbol: '♕', color: 'w', type: 'q' }, // Queen on e2 (r6,c4)
      { symbol: '♙', color: 'w', type: 'p' },
      { symbol: '♙', color: 'w', type: 'p' },
      { symbol: '♙', color: 'w', type: 'p' }
    ],
    [
      { symbol: '♖', color: 'w', type: 'r' },
      null,
      null,
      null,
      { symbol: '♔', color: 'w', type: 'k' },
      null,
      null,
      { symbol: '♖', color: 'w', type: 'r' }
    ]
  ];

  // Winning move: Queen from (6,4) to (1,5) [f7 checkmate]
  const targetFrom: [number, number] = [6, 4];
  const targetTo: [number, number] = [1, 5];

  const board: Piece[][] = initialBoard.map(row => [...row]);
  let selectedSquare: [number, number] | null = null;
  const startTime = Date.now();
  let timerInterval: number | null = null;
  let elapsedSeconds = 0;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full bg-white rounded-2xl border border-black/5 shadow-sm">
      <div class="w-full flex items-center justify-between mb-3 pb-2 border-b border-black/5">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
            White to Move • Mate in 1
          </span>
          <p class="text-xs text-gray-500 mt-1">Drag or tap White Queen (♕) to f7 to deliver checkmate!</p>
        </div>
        <div id="chess-timer" class="text-sm font-mono font-bold bg-gray-100 px-3 py-1.5 rounded-lg">00:00</div>
      </div>

      <!-- Chessboard Grid -->
      <div id="chess-board" class="grid grid-cols-8 grid-rows-8 border-2 border-amber-900 rounded-lg overflow-hidden w-full aspect-square max-w-[360px] shadow-inner mb-3">
      </div>

      <div id="chess-msg" class="text-xs font-medium text-center text-gray-600 min-h-[20px]">
        Drag with mouse arrow / finger or tap White's Queen (♕) to begin. 🖐️🖱️
      </div>
    </div>
  `;

  const boardEl = container.querySelector('#chess-board') as HTMLElement;
  const timerEl = container.querySelector('#chess-timer') as HTMLElement;
  const msgEl = container.querySelector('#chess-msg') as HTMLElement;

  function updateTimer() {
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const s = (elapsedSeconds % 60).toString().padStart(2, '0');
    if (timerEl) timerEl.textContent = `${m}:${s}`;
  }
  timerInterval = window.setInterval(updateTimer, 1000);

  function executeMove(fromR: number, fromC: number, toR: number, toC: number) {
    if (fromR === targetFrom[0] && fromC === targetFrom[1] && toR === targetTo[0] && toC === targetTo[1]) {
      // Execute winning move
      board[toR][toC] = board[fromR][fromC];
      board[fromR][fromC] = null;
      selectedSquare = null;
      renderChessboard();
      if (timerInterval) clearInterval(timerInterval);
      msgEl.className = 'text-xs font-bold text-emerald-600 text-center';
      msgEl.textContent = ' Checkmate! Excellent chess vision.';
      onWin(elapsedSeconds);
    } else {
      msgEl.textContent = 'Not checkmate! Try White Queen to f7.';
      selectedSquare = null;
      renderChessboard();
    }
  }

  function renderChessboard() {
    boardEl.innerHTML = '';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        const isDarkSquare = (r + c) % 2 === 1;
        const isSelected = selectedSquare && selectedSquare[0] === r && selectedSquare[1] === c;

        const square = document.createElement('button');
        square.className = `
          chess-square w-full h-full flex items-center justify-center text-2xl sm:text-3xl transition select-none touch-none
          ${isDarkSquare ? 'bg-amber-800 text-amber-100' : 'bg-amber-100 text-amber-900'}
          ${isSelected ? 'ring-4 ring-purple-500 bg-purple-300' : ''}
          ${piece && piece.color === 'w' ? 'chess-piece cursor-grab' : ''}
        `;
        square.textContent = piece ? piece.symbol : '';
        square.dataset.r = r.toString();
        square.dataset.c = c.toString();

        if (piece && piece.color === 'w') {
          square.dataset.dragData = JSON.stringify({ r, c, piece });
        }

        square.addEventListener('click', () => {
          if (!selectedSquare) {
            if (piece && piece.color === 'w') {
              selectedSquare = [r, c];
              msgEl.textContent = `Selected ${piece.type.toUpperCase()} on square. Choose destination.`;
            } else {
              msgEl.textContent = 'Please tap a White piece.';
            }
          } else {
            const [fromR, fromC] = selectedSquare;
            executeMove(fromR, fromC, r, c);
          }
          renderChessboard();
        });

        boardEl.appendChild(square);
      }
    }
  }

  // Touch Finger & Mouse Pointer Drag-and-Drop!
  const cleanupDrag = setupPointerDragAndDrop({
    container,
    draggableSelector: '.chess-piece',
    dropTargetSelector: '.chess-square',
    onDrop: (draggedData: any, targetElement: HTMLElement) => {
      const toR = parseInt(targetElement.dataset.r || '-1', 10);
      const toC = parseInt(targetElement.dataset.c || '-1', 10);

      if (draggedData && typeof draggedData.r === 'number' && toR >= 0 && toC >= 0) {
        executeMove(draggedData.r, draggedData.c, toR, toC);
      }
    }
  });

  renderChessboard();

  return () => {
    if (timerInterval) clearInterval(timerInterval);
    cleanupDrag();
  };
}
