/**
 * 3D Spatial Block Counting Logic Game
 * Supports both TOUCH finger and MOUSE pointer dragging to rotate in 3D!
 */

export function renderThreeDBlockGame(
  container: HTMLElement,
  onWin: (seconds: number) => void
): () => void {
  // Preset puzzle block count
  const targetBlockCount = 7;
  let userGuess: number | null = null;

  const startTime = Date.now();
  let timerInterval: number | null = null;
  let elapsedSeconds = 0;

  let rotateY = 0;
  let rotateX = 0;

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full bg-white rounded-2xl border border-black/5 shadow-sm">
      <div class="w-full flex items-center justify-between mb-3 pb-2 border-b border-black/5">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
            3D Spatial Logic
          </span>
          <p class="text-xs text-gray-500 mt-1">Drag with mouse arrow or touch finger to rotate perspective!</p>
        </div>
        <div id="threed-timer" class="text-sm font-mono font-bold bg-gray-100 px-3 py-1.5 rounded-lg">00:00</div>
      </div>

      <!-- Isometric 3D Canvas Box (Interactive Rotation via Mouse Pointer or Touch) -->
      <div id="threed-canvas-box" class="w-full aspect-square max-w-[320px] bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center mb-4 shadow-inner cursor-grab touch-none select-none">
        <div id="threed-3d-model" class="text-center p-4 transition-transform duration-75">
          <!-- Isometric SVG cube illustration -->
          <svg class="w-48 h-48 mx-auto drop-shadow-lg" viewBox="0 0 200 200">
            <!-- Base row -->
            <polygon points="100,100 130,85 160,100 130,115" fill="#60A5FA" />
            <polygon points="100,100 130,115 130,140 100,125" fill="#2563EB" />
            <polygon points="130,115 160,100 160,125 130,140" fill="#1D4ED8" />

            <polygon points="70,115 100,100 130,115 100,130" fill="#60A5FA" />
            <polygon points="70,115 100,130 100,155 70,140" fill="#2563EB" />
            <polygon points="100,130 130,115 130,140 100,155" fill="#1D4ED8" />

            <polygon points="40,130 70,115 100,130 70,145" fill="#60A5FA" />
            <polygon points="40,130 70,145 70,170 40,155" fill="#2563EB" />
            <polygon points="70,145 100,130 100,155 70,170" fill="#1D4ED8" />

            <!-- Second level -->
            <polygon points="100,70 130,55 160,70 130,85" fill="#93C5FD" />
            <polygon points="100,70 130,85 130,110 100,95" fill="#3B82F6" />
            <polygon points="130,85 160,70 160,95 130,110" fill="#1E40AF" />

            <polygon points="70,85 100,70 130,85 100,100" fill="#93C5FD" />
            <polygon points="70,85 100,100 100,125 70,110" fill="#3B82F6" />

            <!-- Top level -->
            <polygon points="100,40 130,25 160,40 130,55" fill="#BFDBFE" />
            <polygon points="100,40 130,55 130,80 100,65" fill="#60A5FA" />
            <polygon points="130,55 160,40 160,65 130,80" fill="#2563EB" />
          </svg>
          <p class="text-xs text-slate-400 mt-2 pointer-events-none">Drag around to rotate perspective! 🖐️🖱️</p>
        </div>
      </div>

      <!-- Multiple Choice Options -->
      <div class="w-full max-w-[320px]">
        <div class="text-xs font-semibold text-gray-500 mb-2 text-center">How many total cubes are in this structure?</div>
        <div class="grid grid-cols-4 gap-2">
          ${[5, 6, 7, 8].map(count => `
            <button class="threed-btn h-12 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold text-lg rounded-xl transition cursor-pointer" data-count="${count}">
              ${count}
            </button>
          `).join('')}
        </div>
      </div>

      <div id="threed-msg" class="mt-3 text-xs font-medium text-center text-gray-600 min-h-[18px]"></div>
    </div>
  `;

  const canvasBox = container.querySelector('#threed-canvas-box') as HTMLElement;
  const model3d = container.querySelector('#threed-3d-model') as HTMLElement;
  const timerEl = container.querySelector('#threed-timer') as HTMLElement;
  const msgEl = container.querySelector('#threed-msg') as HTMLElement;

  function updateTimer() {
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const s = (elapsedSeconds % 60).toString().padStart(2, '0');
    if (timerEl) timerEl.textContent = `${m}:${s}`;
  }
  timerInterval = window.setInterval(updateTimer, 1000);

  // Mouse Pointer & Touch Drag Rotation Handler
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function handleStart(clientX: number, clientY: number) {
    isDragging = true;
    startX = clientX;
    startY = clientY;
    if (canvasBox) canvasBox.style.cursor = 'grabbing';
  }

  function handleMove(clientX: number, clientY: number) {
    if (!isDragging) return;
    const dx = clientX - startX;
    const dy = clientY - startY;

    rotateY += dx * 0.5;
    rotateX -= dy * 0.5;

    startX = clientX;
    startY = clientY;

    if (model3d) {
      model3d.style.transform = `perspective(600px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    }
  }

  function handleEnd() {
    isDragging = false;
    if (canvasBox) canvasBox.style.cursor = 'grab';
  }

  canvasBox?.addEventListener('pointerdown', (e: PointerEvent) => {
    handleStart(e.clientX, e.clientY);
    canvasBox.setPointerCapture(e.pointerId);
  });

  canvasBox?.addEventListener('pointermove', (e: PointerEvent) => {
    handleMove(e.clientX, e.clientY);
  });

  canvasBox?.addEventListener('pointerup', (e: PointerEvent) => {
    handleEnd();
    try { canvasBox.releasePointerCapture(e.pointerId); } catch {}
  });

  canvasBox?.addEventListener('pointercancel', () => {
    handleEnd();
  });

  container.querySelectorAll('.threed-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      userGuess = parseInt((e.currentTarget as HTMLElement).dataset.count || '0', 10);
      if (userGuess === targetBlockCount) {
        if (timerInterval) clearInterval(timerInterval);
        msgEl.className = 'text-xs font-bold text-emerald-600 text-center mt-3';
        msgEl.textContent = ' Correct! 7 total cubes (3 base + 2 mid + 1 top + 1 support).';
        onWin(elapsedSeconds);
      } else {
        msgEl.textContent = 'Not quite! Remember to include hidden supporting cubes.';
      }
    });
  });

  return () => {
    if (timerInterval) clearInterval(timerInterval);
  };
}
