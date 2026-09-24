/**
 * Kids (3–8) Teddy Sort Game
 * Supports both TOUCH finger and MOUSE pointer dragging and tapping!
 */
import { setupPointerDragAndDrop } from '../utils/dragInteraction';

export function renderTeddySortGame(
  container: HTMLElement,
  onWin: (seconds: number) => void
): () => void {
  type Item = { id: number; icon: string; color: 'blue' | 'pink' | 'yellow' };

  const initialItems: Item[] = [
    { id: 1, icon: '🧸', color: 'blue' },
    { id: 2, icon: '🎨', color: 'pink' },
    { id: 3, icon: '🦆', color: 'yellow' },
    { id: 4, icon: '🤖', color: 'blue' },
    { id: 5, icon: '🦄', color: 'pink' },
    { id: 6, icon: '🐥', color: 'yellow' }
  ];

  const items = [...initialItems];
  let selectedItem: Item | null = null;
  let score = 0;
  const total = initialItems.length;

  const startTime = Date.now();
  let timerInterval: number | null = null;
  let elapsedSeconds = 0;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full bg-[#DCEEFF] rounded-3xl border-2 border-blue-200 shadow-md">
      <!-- Big Header Icon for Kids -->
      <div class="flex items-center gap-2 mb-3 bg-white px-4 py-1.5 rounded-full border border-blue-100 shadow-sm">
        <span class="text-2xl">🧸</span>
        <span class="font-extrabold text-blue-900 text-lg">Teddy Sort</span>
        <span class="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">Ages 3–8</span>
      </div>

      <!-- Toy Storage Area -->
      <div id="toy-shelf" class="w-full bg-white rounded-2xl p-4 flex items-center justify-center gap-3 flex-wrap min-h-[90px] shadow-inner mb-4 border border-blue-100">
      </div>

      <!-- Baskets -->
      <div class="grid grid-cols-3 gap-3 w-full">
        <button class="basket-btn bg-blue-100 hover:bg-blue-200 active:scale-95 border-2 border-blue-400 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm transition" data-color="blue">
          <span class="text-3xl pointer-events-none">🧺</span>
          <span class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white inline-block shadow pointer-events-none"></span>
        </button>

        <button class="basket-btn bg-pink-100 hover:bg-pink-200 active:scale-95 border-2 border-pink-400 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm transition" data-color="pink">
          <span class="text-3xl pointer-events-none">🧺</span>
          <span class="w-6 h-6 rounded-full bg-pink-500 border-2 border-white inline-block shadow pointer-events-none"></span>
        </button>

        <button class="basket-btn bg-amber-100 hover:bg-amber-200 active:scale-95 border-2 border-amber-400 rounded-2xl p-3 flex flex-col items-center gap-1 shadow-sm transition" data-color="yellow">
          <span class="text-3xl pointer-events-none">🧺</span>
          <span class="w-6 h-6 rounded-full bg-amber-400 border-2 border-white inline-block shadow pointer-events-none"></span>
        </button>
      </div>

      <div id="kids-status" class="mt-4 text-center font-bold text-blue-950 text-sm">
        Drag or tap a toy, then place it in its matching color basket! 🖐️🖱️
      </div>
    </div>
  `;

  const shelfEl = container.querySelector('#toy-shelf') as HTMLElement;
  const statusEl = container.querySelector('#kids-status') as HTMLElement;

  function updateTimer() {
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  }
  timerInterval = window.setInterval(updateTimer, 1000);

  function trySortToy(toyId: number, basketColor: string) {
    const itemIdx = items.findIndex(i => i.id === toyId);
    if (itemIdx === -1) return;
    const item = items[itemIdx];

    if (item.color === basketColor) {
      items.splice(itemIdx, 1);
      selectedItem = null;
      score++;
      statusEl.textContent = 'Great job! Stars ⭐';
      renderShelf();

      if (score === total) {
        if (timerInterval) clearInterval(timerInterval);
        statusEl.innerHTML = '🎉 You sorted all toys! Amazing job!';
        onWin(elapsedSeconds);
      }
    } else {
      statusEl.textContent = 'Try the other color basket!';
    }
  }

  function renderShelf() {
    shelfEl.innerHTML = '';
    items.forEach((item) => {
      const isSelected = selectedItem && selectedItem.id === item.id;
      const btn = document.createElement('button');
      btn.className = `
        toy-item w-16 h-16 rounded-2xl text-3xl flex items-center justify-center transition shadow active:scale-90 cursor-grab touch-none
        ${item.color === 'blue' ? 'bg-blue-50 border-2 border-blue-300' : ''}
        ${item.color === 'pink' ? 'bg-pink-50 border-2 border-pink-300' : ''}
        ${item.color === 'yellow' ? 'bg-amber-50 border-2 border-amber-300' : ''}
        ${isSelected ? 'ring-4 ring-blue-600 scale-110' : ''}
      `;
      btn.textContent = item.icon;
      btn.dataset.dragData = JSON.stringify(item);

      btn.addEventListener('click', () => {
        selectedItem = item;
        renderShelf();
      });

      shelfEl.appendChild(btn);
    });
  }

  // Click on basket logic
  container.querySelectorAll('.basket-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const basketColor = (e.currentTarget as HTMLElement).dataset.color;
      if (!selectedItem) {
        statusEl.textContent = 'Drag or tap a toy above first!';
        return;
      }
      if (basketColor) {
        trySortToy(selectedItem.id, basketColor);
      }
    });
  });

  // Enable Touch & Mouse Pointer Drag and Drop!
  const cleanupDrag = setupPointerDragAndDrop({
    container,
    draggableSelector: '.toy-item',
    dropTargetSelector: '.basket-btn',
    onDrop: (draggedData: any, targetElement: HTMLElement) => {
      const basketColor = targetElement.dataset.color;
      if (draggedData && draggedData.id && basketColor) {
        trySortToy(draggedData.id, basketColor);
      }
    }
  });

  renderShelf();

  return () => {
    if (timerInterval) clearInterval(timerInterval);
    cleanupDrag();
  };
}
