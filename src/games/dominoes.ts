/**
 * Brazilian Dominoes Game Engine
 * Supports both TOUCH finger and MOUSE pointer dragging and tapping!
 */
import { setupPointerDragAndDrop } from '../utils/dragInteraction';

export function renderDominoesGame(
  container: HTMLElement,
  onWin: (seconds: number) => void
): () => void {
  type Tile = [number, number];

  // Player hand
  const playerHand: Tile[] = [
    [6, 6], [6, 5], [5, 4], [4, 4], [3, 2], [1, 0]
  ];

  // Table chain tiles placed
  const tableChain: Tile[] = [
    [6, 4]
  ];

  const startTime = Date.now();
  let timerInterval: number | null = null;
  let elapsedSeconds = 0;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-4 max-w-lg mx-auto w-full bg-white rounded-2xl border border-black/5 shadow-sm">
      <div class="w-full flex items-center justify-between mb-3 pb-2 border-b border-black/5">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
            Brazilian Dominoes • Classic
          </span>
          <p class="text-xs text-gray-500 mt-1">Match domino pips on open table ends.</p>
        </div>
        <div id="dom-timer" class="text-sm font-mono font-bold bg-gray-100 px-3 py-1.5 rounded-lg">00:00</div>
      </div>

      <!-- Table Chain Display (Drop Target) -->
      <div id="dom-drop-zone" class="dom-drop-zone w-full min-h-[120px] bg-emerald-800 rounded-xl p-3 flex items-center justify-center gap-2 overflow-x-auto mb-4 border border-black/10 transition-transform">
        <div id="dom-table" class="flex items-center gap-2 pointer-events-none"></div>
      </div>

      <!-- Player Hand -->
      <div class="w-full">
        <div class="text-xs font-bold text-gray-600 mb-2">Your Hand (Drag or tap a playable tile):</div>
        <div id="dom-hand" class="flex items-center justify-center gap-2 flex-wrap min-h-[60px]"></div>
      </div>

      <div id="dom-msg" class="mt-3 text-xs font-medium text-center text-gray-500 min-h-[20px]">
        Drag or tap [6|6] or [6|5] onto the table! 🖐️🖱️
      </div>
    </div>
  `;

  const tableEl = container.querySelector('#dom-table') as HTMLElement;
  const handEl = container.querySelector('#dom-hand') as HTMLElement;
  const timerEl = container.querySelector('#dom-timer') as HTMLElement;
  const msgEl = container.querySelector('#dom-msg') as HTMLElement;

  function updateTimer() {
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const s = (elapsedSeconds % 60).toString().padStart(2, '0');
    if (timerEl) timerEl.textContent = `${m}:${s}`;
  }
  timerInterval = window.setInterval(updateTimer, 1000);

  function getOpenEnds(): [number, number] {
    if (tableChain.length === 0) return [0, 0];
    const leftEnd = tableChain[0][0];
    const rightEnd = tableChain[tableChain.length - 1][1];
    return [leftEnd, rightEnd];
  }

  function playTileByIndex(idx: number) {
    if (idx < 0 || idx >= playerHand.length) return;
    const tile = playerHand[idx];
    const [left, right] = getOpenEnds();

    const canPlayLeft = tile[0] === left || tile[1] === left;
    const canPlayRight = tile[0] === right || tile[1] === right;

    if (!canPlayLeft && !canPlayRight) {
      msgEl.textContent = `Cannot connect [${tile[0]}|${tile[1]}] to open ends [${left}] or [${right}].`;
      return;
    }

    playerHand.splice(idx, 1);
    if (tile[0] === right) {
      tableChain.push(tile);
    } else if (tile[1] === right) {
      tableChain.push([tile[1], tile[0]]);
    } else if (tile[1] === left) {
      tableChain.unshift(tile);
    } else {
      tableChain.unshift([tile[1], tile[0]]);
    }

    msgEl.textContent = `Played [${tile[0]}|${tile[1]}]!`;
    renderGame();

    if (playerHand.length === 0) {
      if (timerInterval) clearInterval(timerInterval);
      msgEl.className = 'text-xs font-bold text-emerald-600 text-center mt-3';
      msgEl.textContent = ' Domino! You cleared your hand and won the round.';
      onWin(elapsedSeconds);
    }
  }

  function renderGame() {
    // Render table
    tableEl.innerHTML = tableChain.map(tile => `
      <div class="bg-amber-100 border-2 border-amber-900 rounded px-2 py-1 font-bold text-base text-amber-950 shadow flex items-center gap-1 select-none">
        <span>${tile[0]}</span>
        <span class="text-amber-400">|</span>
        <span>${tile[1]}</span>
      </div>
    `).join('');

    // Render hand
    const [left, right] = getOpenEnds();
    handEl.innerHTML = '';

    playerHand.forEach((tile, idx) => {
      const canPlayLeft = tile[0] === left || tile[1] === left;
      const canPlayRight = tile[0] === right || tile[1] === right;
      const isPlayable = canPlayLeft || canPlayRight;

      const btn = document.createElement('button');
      btn.className = `
        dom-tile bg-amber-50 border-2 border-amber-800 rounded-lg px-3 py-2 font-bold text-lg text-amber-950 flex items-center gap-1.5 shadow transition touch-none
        ${isPlayable ? 'hover:bg-amber-200 ring-2 ring-emerald-500 cursor-grab active:scale-95' : 'opacity-60 cursor-not-allowed'}
      `;
      btn.innerHTML = `<span class="pointer-events-none">${tile[0]}</span><span class="text-amber-500 pointer-events-none">|</span><span class="pointer-events-none">${tile[1]}</span>`;
      btn.dataset.dragData = JSON.stringify({ idx, tile });

      if (isPlayable) {
        btn.addEventListener('click', () => {
          playTileByIndex(idx);
        });
      }

      handEl.appendChild(btn);
    });
  }

  // Touch Finger & Mouse Pointer Drag-and-Drop!
  const cleanupDrag = setupPointerDragAndDrop({
    container,
    draggableSelector: '.dom-tile',
    dropTargetSelector: '.dom-drop-zone',
    onDrop: (draggedData: any) => {
      if (draggedData && typeof draggedData.idx === 'number') {
        playTileByIndex(draggedData.idx);
      }
    }
  });

  renderGame();

  return () => {
    if (timerInterval) clearInterval(timerInterval);
    cleanupDrag();
  };
}
