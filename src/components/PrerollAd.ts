/**
 * Preroll Game Ad Component
 * Displays a clean, compliant interstitial loading screen with ad slot,
 * countdown timer, and 'Skip / Play Now' button before the game begins.
 * Zero setup required inside individual game HTML files!
 */

export function showGamePrerollAd(options: {
  gameTitle: string;
  gameIconSvg: string;
  categoryLabel: string;
  coverBg: string;
  durationSeconds?: number;
  onComplete: () => void;
}): { cancel: () => void } {
  const duration = options.durationSeconds ?? 4;
  let remaining = duration;
  let timerId: number | null = null;
  let isClosed = false;

  const overlay = document.createElement('div');
  overlay.id = 'game-preroll-ad-overlay';
  overlay.className = 'absolute inset-0 z-50 bg-[#0b0f19] text-white flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-fade-in';

  overlay.innerHTML = `
    <!-- Top Header -->
    <div class="w-full max-w-lg flex items-center justify-between gap-3 pt-2">
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="w-8 h-8 rounded-xl flex items-center justify-center p-1 shrink-0 filter drop-shadow-sm" style="background-color: ${options.coverBg};">
          ${options.gameIconSvg}
        </span>
        <div class="min-w-0">
          <h3 class="text-sm font-black text-white truncate leading-tight">${options.gameTitle}</h3>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">${options.categoryLabel}</p>
        </div>
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <span class="text-[10px] uppercase font-black tracking-widest text-emerald-400 bg-emerald-950/90 border border-emerald-800/80 px-2 py-0.5 rounded-full">
          Loading Game
        </span>
      </div>
    </div>

    <!-- Center: High-Performing Ad Unit Box -->
    <div class="w-full max-w-md my-auto flex flex-col items-center">
      
      <!-- Ad Container (Responsive 300x250 Medium Rectangle or In-Feed) -->
      <div class="w-full bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        
        <!-- Subtle Ad Label Required by Google / Ezoic Policy -->
        <div class="flex items-center justify-between w-full mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">
          <span>Sponsored</span>
          <span class="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">Ad • 300x250</span>
        </div>

        <!-- Ad Slot Reserved Area: Place Google AdSense / Ezoic script here anytime -->
        <div 
          id="preroll-ad-slot" 
          class="w-full min-h-[190px] sm:min-h-[220px] bg-slate-950/80 rounded-2xl border border-dashed border-slate-700/80 flex flex-col items-center justify-center p-4 relative group"
        >
          <!-- Placeholder Graphic & Notification -->
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-xl mb-2 text-emerald-400">
            🎯
          </div>
          <span class="text-xs font-black text-slate-200 mb-1">
            Interstitial Ad Placement (Preroll)
          </span>
          <p class="text-[11px] text-slate-400 max-w-xs leading-tight">
            Compatible with Google AdSense, Ezoic, and AdX. Ready for monetization upon game launch.
          </p>
        </div>

        <!-- Timer & Progress bar -->
        <div class="w-full mt-4 flex flex-col gap-1.5">
          <div class="flex items-center justify-between text-xs font-bold text-slate-400">
            <span id="preroll-status-text">Game will start in <strong id="preroll-seconds" class="text-emerald-400 font-black">${remaining}s</strong>...</span>
            <span id="preroll-percent" class="text-[11px] text-slate-500 font-mono">0%</span>
          </div>
          <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div id="preroll-progress-bar" class="h-full bg-gradient-to-r from-[#58CC02] to-emerald-400 rounded-full transition-all duration-300" style="width: 5%;"></div>
          </div>
        </div>

      </div>

    </div>

    <!-- Bottom Actions: Skip Button -->
    <div class="w-full max-w-lg flex items-center justify-between gap-3 pb-2">
      <span class="text-[11px] text-slate-400 font-medium hidden sm:inline">
        Tip: The game enters full screen right after loading.
      </span>

      <button 
        id="btn-skip-preroll" 
        class="ml-auto px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-[#58CC02] hover:text-white active:scale-95 text-slate-300 font-black text-xs sm:text-sm transition shadow-md border border-slate-700 hover:border-[#58CC02] cursor-pointer flex items-center gap-2 select-none"
      >
        <span id="skip-btn-label">Please wait 2s...</span>
        <span class="text-base leading-none">⏩</span>
      </button>
    </div>
  `;

  const secondsEl = overlay.querySelector('#preroll-seconds') as HTMLElement;
  const statusEl = overlay.querySelector('#preroll-status-text') as HTMLElement;
  const percentEl = overlay.querySelector('#preroll-percent') as HTMLElement;
  const progressBar = overlay.querySelector('#preroll-progress-bar') as HTMLElement;
  const skipBtn = overlay.querySelector('#btn-skip-preroll') as HTMLButtonElement;
  const skipLabel = overlay.querySelector('#skip-btn-label') as HTMLElement;

  const finishAndStartGame = () => {
    if (isClosed) return;
    isClosed = true;
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.25s ease-out';
    setTimeout(() => {
      overlay.remove();
      options.onComplete();
    }, 250);
  };

  // Skip button unlocks after 2 seconds or finishes immediately
  let canSkip = false;
  skipBtn?.addEventListener('click', () => {
    if (canSkip || remaining <= 1) {
      finishAndStartGame();
    }
  });

  const totalSteps = duration * 10;
  let currentStep = 0;

  timerId = window.setInterval(() => {
    currentStep++;
    const currentSeconds = Math.max(0, Math.ceil(duration - (currentStep / 10)));
    const pct = Math.min(100, Math.round((currentStep / totalSteps) * 100));

    if (progressBar) progressBar.style.width = `${pct}%`;
    if (percentEl) percentEl.textContent = `${pct}%`;
    if (secondsEl) secondsEl.textContent = `${currentSeconds}s`;

    // Unlock skip button after 2 seconds
    if (currentStep >= 20 && !canSkip) {
      canSkip = true;
      if (skipBtn && skipLabel) {
        skipBtn.classList.remove('bg-slate-800', 'text-slate-300');
        skipBtn.classList.add('bg-[#58CC02]', 'text-white', 'hover:bg-[#4EBA02]');
        skipLabel.textContent = 'Play Now';
      }
    }

    if (currentStep >= totalSteps) {
      if (statusEl) statusEl.innerHTML = '<strong class="text-emerald-400 font-black">Starting Game...</strong>';
      finishAndStartGame();
    }
  }, 100);

  return {
    cancel: () => {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
      overlay.remove();
    },
    // append directly to caller container
    mount: (parent: HTMLElement) => {
      parent.appendChild(overlay);
    }
  } as any;
}
