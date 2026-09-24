/**
 * Interactive Hidden Items and Spot Differences Game Engine
 * Specially designed with high contrast, large touch targets, gentle hints,
 * and relaxed, untimed play ideal for Seniors 60+ and casual players.
 */

export function renderHiddenItemsGame(
  container: HTMLElement,
  onWin: (seconds: number) => void
): () => void {
  const startTime = Date.now();
  let timerInterval: number | null = null;
  let elapsedSeconds = 0;

  // Items to find in the cozy study scene
  const targetItems = [
    { id: 'key', name: 'Golden Key', icon: '🗝️', x: 22, y: 35, found: false },
    { id: 'book', name: 'Red Book', icon: '📕', x: 74, y: 28, found: false },
    { id: 'star', name: 'Bright Star', icon: '⭐', x: 48, y: 18, found: false },
    { id: 'clock', name: 'Pocket Clock', icon: '⏰', x: 15, y: 72, found: false },
    { id: 'coffee', name: 'Warm Mug', icon: '☕', x: 82, y: 76, found: false }
  ];

  // Distractor items scattered across the room
  const distractors = [
    { icon: '🪴', x: 10, y: 22, size: 'text-3xl' },
    { icon: '🛋️', x: 45, y: 65, size: 'text-5xl' },
    { icon: '🖼️', x: 30, y: 15, size: 'text-4xl' },
    { icon: '🪑', x: 78, y: 55, size: 'text-4xl' },
    { icon: '📚', x: 20, y: 52, size: 'text-3xl' },
    { icon: '🕯️', x: 62, y: 40, size: 'text-2xl' },
    { icon: '🧶', x: 35, y: 80, size: 'text-3xl' },
    { icon: '🐱', x: 55, y: 78, size: 'text-3xl' }
  ];

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full bg-white rounded-3xl border border-black/10 shadow-sm select-none">
      
      <!-- Header with Seniors friendly large print -->
      <div class="w-full flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-black text-xl text-gray-900">Find Hidden Items (60+ Relaxed)</h3>
            <span class="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-300">
              Large Tap
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 font-medium">
            Tap the items in the room matching the list below. No rush!
          </p>
        </div>
        <div id="hidden-counter" class="text-base sm:text-lg font-black bg-emerald-100 text-emerald-900 border border-emerald-300 px-3.5 py-1.5 rounded-2xl shrink-0">
          0 / 5 Found
        </div>
      </div>

      <!-- Illustrated Room Stage (SVG / Emoji Cozy Living Room) -->
      <div id="scene-stage" class="relative w-full aspect-4/3 max-w-[540px] bg-gradient-to-b from-[#FFFDF0] via-[#FFF9E6] to-[#FFEEC2] rounded-2xl border-2 border-amber-200 overflow-hidden shadow-inner cursor-crosshair">
        
        <!-- Background Room elements -->
        <div class="absolute inset-0 pointer-events-none opacity-40">
          <div class="absolute top-0 left-0 right-0 h-1/2 bg-amber-50/50 border-b-2 border-amber-200/60"></div>
          <div class="absolute top-4 right-10 w-20 h-24 border-4 border-amber-800/30 rounded-t-full bg-sky-100/60"></div>
        </div>

        <!-- Distractor Decor Elements -->
        ${distractors.map(d => `
          <div class="absolute ${d.size} select-none pointer-events-none transition-transform" style="left: ${d.x}%; top: ${d.y}%; transform: translate(-50%, -50%);">
            ${d.icon}
          </div>
        `).join('')}

        <!-- Interactive Target Items -->
        ${targetItems.map(item => `
          <button 
            id="target-${item.id}"
            data-id="${item.id}"
            title="${item.name}"
            class="target-item-btn absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center text-3xl transition-all duration-300 hover:scale-125 active:scale-95 cursor-pointer focus:outline-hidden"
            style="left: ${item.x}%; top: ${item.y}%;"
          >
            <span class="drop-shadow-md select-none">${item.icon}</span>
          </button>
        `).join('')}

        <!-- Toast Feedback overlay -->
        <div id="scene-toast" class="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full pointer-events-none opacity-0 transition-opacity">
          Found an item!
        </div>
      </div>

      <!-- Items Tray Checklist to Find -->
      <div class="w-full mt-4 p-3 bg-amber-50/80 rounded-2xl border border-amber-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-black uppercase tracking-wider text-amber-900">
            Items to Discover:
          </span>
          <button id="hint-btn" class="text-xs font-extrabold text-amber-800 bg-white hover:bg-amber-200 border border-amber-300 px-3 py-1 rounded-xl shadow-2xs cursor-pointer transition">
            💡 Show a Hint
          </button>
        </div>

        <div id="item-tray" class="grid grid-cols-5 gap-2 text-center">
          ${targetItems.map(item => `
            <div id="tray-${item.id}" class="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-black/5 shadow-2xs transition-all">
              <span class="text-2xl">${item.icon}</span>
              <span class="text-[11px] font-bold text-gray-700 leading-tight mt-1 truncate max-w-full">${item.name}</span>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  const stage = container.querySelector('#scene-stage') as HTMLElement;
  const counterEl = container.querySelector('#hidden-counter') as HTMLElement;
  const toastEl = container.querySelector('#scene-toast') as HTMLElement;
  const hintBtn = container.querySelector('#hint-btn') as HTMLButtonElement;

  function showToast(msg: string) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    setTimeout(() => {
      if (toastEl) toastEl.style.opacity = '0';
    }, 1500);
  }

  function updateStatus() {
    const foundCount = targetItems.filter(i => i.found).length;
    if (counterEl) {
      counterEl.textContent = `${foundCount} / ${targetItems.length} Found`;
    }

    if (foundCount === targetItems.length) {
      if (timerInterval) clearInterval(timerInterval);
      showToast('🎉 Wonderful! You found all hidden items!');
      setTimeout(() => {
        onWin(elapsedSeconds || 25);
      }, 900);
    }
  }

  // Handle clicking on target items
  const itemButtons = container.querySelectorAll('.target-item-btn');
  itemButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = (btn as HTMLElement).dataset.id;
      const target = targetItems.find(i => i.id === id);
      if (!target || target.found) return;

      target.found = true;
      (btn as HTMLElement).classList.add('ring-4', 'ring-emerald-500', 'bg-emerald-200/50', 'scale-110');
      
      const trayItem = container.querySelector(`#tray-${id}`) as HTMLElement;
      if (trayItem) {
        trayItem.classList.remove('bg-white');
        trayItem.classList.add('bg-emerald-100', 'border-emerald-300', 'text-emerald-800', 'line-through', 'opacity-70');
      }

      showToast(`✨ Found: ${target.name}!`);
      updateStatus();
    });
  });

  // Hint button for relaxed senior play
  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      const remaining = targetItems.filter(i => !i.found);
      if (remaining.length === 0) return;
      const itemToHint = remaining[0];
      const btn = container.querySelector(`#target-${itemToHint.id}`) as HTMLElement;
      if (btn) {
        btn.classList.add('animate-bounce', 'ring-4', 'ring-amber-400');
        showToast(`💡 Look near the ${itemToHint.name}!`);
        setTimeout(() => {
          btn.classList.remove('animate-bounce', 'ring-4', 'ring-amber-400');
        }, 2200);
      }
    });
  }

  timerInterval = window.setInterval(() => {
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  }, 1000);

  return () => {
    if (timerInterval) clearInterval(timerInterval);
  };
}

/**
 * Spot Differences Game Engine (Adapted for Seniors 60+)
 * Side-by-side scenes with 5 distinct, high-contrast differences.
 */
export function renderSpotDifferencesGame(
  container: HTMLElement,
  onWin: (seconds: number) => void
): () => void {
  const startTime = Date.now();
  let timerInterval: number | null = null;
  let elapsedSeconds = 0;

  // 5 Clear Differences between Left and Right pictures
  const differences = [
    { id: 'sun', label: 'Sun smile vs sun glasses', leftIcon: '☀️', rightIcon: '😎', x: 22, y: 20, found: false },
    { id: 'bird', label: 'Blue bird missing', leftIcon: '🐦', rightIcon: '🪶', x: 80, y: 25, found: false },
    { id: 'flower', label: 'Red flower vs yellow tulip', leftIcon: '🌺', rightIcon: '🌷', x: 30, y: 78, found: false },
    { id: 'butterfly', label: 'Extra colorful butterfly', leftIcon: '🦋', rightIcon: '🐝', x: 65, y: 60, found: false },
    { id: 'apple', label: 'Red apple on bench', leftIcon: '🍎', rightIcon: '🍃', x: 75, y: 82, found: false }
  ];

  container.innerHTML = `
    <div class="flex flex-col items-center justify-center p-4 max-w-3xl mx-auto w-full bg-white rounded-3xl border border-black/10 shadow-sm select-none">
      
      <!-- Seniors Header -->
      <div class="w-full flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-black text-xl text-gray-900">Spot the Differences (60+ Relaxed)</h3>
            <span class="bg-rose-100 text-rose-900 text-xs font-black px-2.5 py-0.5 rounded-full border border-rose-300">
              5 Clear Differences
            </span>
          </div>
          <p class="text-xs sm:text-sm text-gray-600 font-medium">
            Compare the left and right pictures. Tap on any difference you spot!
          </p>
        </div>
        <div id="diff-counter" class="text-base sm:text-lg font-black bg-rose-100 text-rose-900 border border-rose-300 px-3.5 py-1.5 rounded-2xl shrink-0">
          0 / 5 Found
        </div>
      </div>

      <!-- Side-by-side pictures -->
      <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <!-- Left Picture -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-gray-500 mb-1">Image A (Original)</span>
          <div id="left-panel" class="relative w-full aspect-square max-w-[320px] bg-gradient-to-b from-sky-100 via-emerald-50 to-green-100 rounded-2xl border-2 border-sky-300 overflow-hidden shadow-inner">
            <div class="absolute top-2 left-4 text-xs font-black text-sky-800/40">SCENE A</div>
            <!-- Scene Trees & Decor -->
            <div class="absolute text-5xl bottom-4 left-4 pointer-events-none">🏡</div>
            <div class="absolute text-4xl top-12 left-1/2 pointer-events-none">🌳</div>
            <div class="absolute text-3xl bottom-6 right-8 pointer-events-none">bench</div>

            <!-- Left Interactive targets -->
            ${differences.map(d => `
              <button 
                data-id="${d.id}"
                class="diff-btn absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center text-3xl transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-hidden"
                style="left: ${d.x}%; top: ${d.y}%;"
              >
                <span>${d.leftIcon}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Right Picture -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-gray-500 mb-1">Image B (Spot Here)</span>
          <div id="right-panel" class="relative w-full aspect-square max-w-[320px] bg-gradient-to-b from-sky-100 via-emerald-50 to-green-100 rounded-2xl border-2 border-rose-300 overflow-hidden shadow-inner">
            <div class="absolute top-2 left-4 text-xs font-black text-rose-800/40">SCENE B</div>
            <!-- Scene Trees & Decor -->
            <div class="absolute text-5xl bottom-4 left-4 pointer-events-none">🏡</div>
            <div class="absolute text-4xl top-12 left-1/2 pointer-events-none">🌳</div>
            <div class="absolute text-3xl bottom-6 right-8 pointer-events-none">bench</div>

            <!-- Right Interactive targets -->
            ${differences.map(d => `
              <button 
                data-id="${d.id}"
                class="diff-btn absolute w-14 h-14 -ml-7 -mt-7 rounded-full flex items-center justify-center text-3xl transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-hidden"
                style="left: ${d.x}%; top: ${d.y}%;"
              >
                <span>${d.rightIcon}</span>
              </button>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Footer Help & Hint -->
      <div class="w-full flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <span id="diff-msg" class="text-xs sm:text-sm font-bold text-gray-700">
          Tap any difference on either image.
        </span>
        <button id="diff-hint-btn" class="text-xs font-black text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-1.5 rounded-xl shadow-2xs cursor-pointer transition">
          💡 Give Me a Hint
        </button>
      </div>

    </div>
  `;

  const counterEl = container.querySelector('#diff-counter') as HTMLElement;
  const msgEl = container.querySelector('#diff-msg') as HTMLElement;
  const hintBtn = container.querySelector('#diff-hint-btn') as HTMLButtonElement;

  function updateStatus() {
    const foundCount = differences.filter(d => d.found).length;
    if (counterEl) {
      counterEl.textContent = `${foundCount} / ${differences.length} Found`;
    }

    if (foundCount === differences.length) {
      if (timerInterval) clearInterval(timerInterval);
      if (msgEl) msgEl.textContent = '🎉 Brilliant observation! All differences found!';
      setTimeout(() => {
        onWin(elapsedSeconds || 20);
      }, 900);
    }
  }

  const allDiffButtons = container.querySelectorAll('.diff-btn');
  allDiffButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = (btn as HTMLElement).dataset.id;
      const diff = differences.find(d => d.id === id);
      if (!diff || diff.found) return;

      diff.found = true;

      // Highlight on both panels with cheerful green rings
      const matchingButtons = container.querySelectorAll(`[data-id="${id}"]`);
      matchingButtons.forEach(b => {
        (b as HTMLElement).classList.add('ring-4', 'ring-emerald-500', 'bg-emerald-200/60', 'scale-110');
      });

      if (msgEl) {
        msgEl.textContent = `✨ Spot found: ${diff.label}!`;
      }
      updateStatus();
    });
  });

  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      const remaining = differences.filter(d => !d.found);
      if (remaining.length === 0) return;
      const diffToHint = remaining[0];
      const matchingButtons = container.querySelectorAll(`[data-id="${diffToHint.id}"]`);
      matchingButtons.forEach(b => {
        (b as HTMLElement).classList.add('animate-ping', 'ring-4', 'ring-amber-400');
        setTimeout(() => {
          (b as HTMLElement).classList.remove('animate-ping', 'ring-4', 'ring-amber-400');
        }, 1500);
      });
      if (msgEl) {
        msgEl.textContent = `💡 Hint: Look around the ${diffToHint.label.toLowerCase()}!`;
      }
    });
  }

  timerInterval = window.setInterval(() => {
    elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
  }, 1000);

  return () => {
    if (timerInterval) clearInterval(timerInterval);
  };
}
