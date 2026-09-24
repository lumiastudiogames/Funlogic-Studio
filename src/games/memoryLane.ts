/**
 * Memory Lane Engine
 */

export function renderMemoryLaneGame(
  container: HTMLElement,
  onWin: (seconds: number) => void
): () => void {
  const icons = ['🌟', '🍎', '🧩', '🎈', '🦉', '⛵'];
  // Double and shuffle
  const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);

  const flipped: number[] = [];
  const matched: number[] = [];
  const startTime = Date.now();
  let timerInterval: number | null = null;
  let elapsedSeconds = 0;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full bg-white rounded-2xl border border-black/5 shadow-sm">
      <div class="w-full flex items-center justify-between mb-4 pb-2 border-b border-black/5">
        <div>
          <h3 class="font-bold text-lg text-gray-800">Memory Lane</h3>
          <p class="text-xs text-gray-500">Flip cards to match identical symbols.</p>
        </div>
        <div id="mem-timer" class="text-sm font-mono font-bold bg-gray-100 px-3 py-1.5 rounded-lg">00:00</div>
      </div>

      <!-- Memory Grid -->
      <div id="mem-grid" class="grid grid-cols-4 gap-3 w-full aspect-square max-w-[340px] mb-3">
      </div>

      <div id="mem-msg" class="text-xs font-medium text-center text-gray-500 min-h-[20px]">
        Tap two cards to flip.
      </div>
    </div>
  `;

  const gridEl = container.querySelector('#mem-grid') as HTMLElement;
  const timerEl = container.querySelector('#mem-timer') as HTMLElement;
  const msgEl = container.querySelector('#mem-msg') as HTMLElement;

  function updateTimer() {
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const s = (elapsedSeconds % 60).toString().padStart(2, '0');
    if (timerEl) timerEl.textContent = `${m}:${s}`;
  }
  timerInterval = window.setInterval(updateTimer, 1000);

  function renderGrid() {
    gridEl.innerHTML = '';
    deck.forEach((icon, idx) => {
      const isFlipped = flipped.includes(idx) || matched.includes(idx);
      const isMatched = matched.includes(idx);

      const card = document.createElement('button');
      card.className = `
        w-full h-full rounded-xl text-3xl font-bold flex items-center justify-center transition-all duration-300 shadow-sm select-none
        ${isMatched ? 'bg-emerald-100 text-emerald-800 cursor-default opacity-80' : ''}
        ${isFlipped && !isMatched ? 'bg-indigo-50 border-2 border-indigo-400' : ''}
        ${!isFlipped ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:opacity-90 active:scale-95' : ''}
      `;
      card.textContent = isFlipped ? icon : '❓';

      if (!isFlipped && flipped.length < 2) {
        card.addEventListener('click', () => {
          flipped.push(idx);
          renderGrid();

          if (flipped.length === 2) {
            const [first, second] = flipped;
            if (deck[first] === deck[second]) {
              matched.push(first, second);
              flipped.length = 0;
              msgEl.textContent = 'Match found!';
              renderGrid();

              if (matched.length === deck.length) {
                if (timerInterval) clearInterval(timerInterval);
                msgEl.className = 'text-xs font-bold text-emerald-600 text-center';
                msgEl.textContent = ' Memory complete! Outstanding focus.';
                onWin(elapsedSeconds);
              }
            } else {
              msgEl.textContent = 'Try another pair...';
              setTimeout(() => {
                flipped.length = 0;
                renderGrid();
              }, 900);
            }
          }
        });
      }

      gridEl.appendChild(card);
    });
  }

  renderGrid();

  return () => {
    if (timerInterval) clearInterval(timerInterval);
  };
}
