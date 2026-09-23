import { GAMES } from '../data/games';
import { Game } from '../types';
import { showVictoryModal } from '../components/VictoryModal';
import { getDiscoveredEngine } from '../games/autoLoader';
import { showGamePrerollAd } from '../components/PrerollAd';
import { updateHeadSeo } from '../utils/seo';
import { recordGamePlay } from '../utils/gameStats';

export function renderGameView(container: HTMLElement, gameId: string): void {
  const game = GAMES.find(g => g.id === gameId) || GAMES[0];

  // Increment real play counter
  recordGamePlay(game.id);

  // Dynamic SEO Injection for Game View
  updateHeadSeo({
    title: game.title,
    description: game.shortDesc || game.description || `Play ${game.title} online free with no download.`,
    keywords: game.keywords || game.tags,
    imageUrl: game.coverImage,
    type: 'game',
    faqs: game.faqs
  });

  container.innerHTML = `
    <div id="fullscreen-game-root" class="w-full h-screen flex flex-col bg-[#0b0f19] text-white overflow-hidden select-none border-0 p-0 m-0">
      
      <!-- Top Game Bar (Compact Console Header - Borderless & Responsive) -->
      <header class="h-12 sm:h-14 bg-[#0F172A] px-3 sm:px-5 flex items-center justify-between gap-2 sm:gap-3 shrink-0 z-30 shadow-md border-0">
        
        <!-- Left: Back Navigation & Game Identity -->
        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
          <a 
            href="#game/${game.id}" 
            id="btn-back-portal" 
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-black transition cursor-pointer text-decoration-none shrink-0 shadow-xs border-0"
            title="Back to Game Details"
          >
            <span class="text-sm">←</span>
            <span class="hidden sm:inline">Details</span>
          </a>
          
          <div class="h-5 w-px bg-slate-800 hidden sm:block"></div>

          <div class="flex items-center gap-2 min-w-0">
            <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center p-1 shrink-0 filter drop-shadow-xs" style="background-color: ${game.coverBg};">
              ${game.iconSvg}
            </span>
            <div class="min-w-0">
              <h1 class="text-xs sm:text-sm font-black text-white truncate leading-tight">${game.title}</h1>
              <p class="text-[10px] text-slate-400 font-bold hidden sm:block truncate">${game.categoryLabel}</p>
            </div>
          </div>
        </div>

        <!-- Right: Actions (Info/FAQ, New Tab, Reload, Fullscreen) -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          <button 
            id="btn-game-info" 
            title="Game Info & FAQs" 
            class="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 border-0 transition cursor-pointer active:scale-95 shadow-xs"
          >
            <span>ℹ️</span>
            <span class="hidden md:inline">Info & FAQ</span>
          </button>

          ${game.htmlUrl ? `
            <a 
              href="${game.htmlUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Open in new tab" 
              class="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 border-0 transition text-decoration-none shadow-xs"
            >
              <span>↗</span>
              <span class="hidden md:inline">New Tab</span>
            </a>
          ` : ''}

          <button 
            id="btn-game-reload" 
            title="Restart Game" 
            class="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 border-0 transition cursor-pointer active:scale-95 shadow-xs"
          >
            <span>🔄</span>
            <span class="hidden md:inline">Restart</span>
          </button>

          <button 
            id="btn-fullscreen-toggle" 
            class="h-8 sm:h-9 px-3 sm:px-4 rounded-xl bg-[#58CC02] hover:bg-[#4EBA02] active:scale-95 text-white font-black text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer border-0"
            title="Toggle Fullscreen"
          >
            <span id="fullscreen-icon">⛶</span>
            <span id="fullscreen-text" class="hidden xs:inline">Fullscreen</span>
          </button>

        </div>
      </header>

      <!-- Main Game Display Stage: 100% Full Screen Viewport - Completely Borderless & Responsive -->
      <main id="game-stage-screen" class="flex-1 w-full h-[calc(100vh-48px)] sm:h-[calc(100vh-56px)] bg-black relative flex items-center justify-center overflow-hidden border-0 p-0 m-0">
        <div id="game-canvas-area" class="w-full h-full flex items-center justify-center relative overflow-hidden border-0 p-0 m-0">
          <!-- Game Engine or Iframe mounts here with 100% full screen dimensions -->
        </div>

        <!-- Info & FAQs Slide-in Modal Overlay -->
        <div id="game-info-overlay" class="absolute inset-0 bg-black/80 backdrop-blur-sm z-40 hidden flex items-center justify-center p-4">
          <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl text-slate-200">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-xl flex items-center justify-center p-1.5 shrink-0" style="background-color: ${game.coverBg};">
                  ${game.iconSvg}
                </span>
                <div>
                  <h3 class="text-base font-black text-white">${game.title}</h3>
                  <span class="text-[11px] font-bold text-emerald-400">${game.categoryLabel}</span>
                </div>
              </div>
              <button id="btn-close-info" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm transition">
                ✕
              </button>
            </div>

            <div>
              <h4 class="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">About the Game</h4>
              <p class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                ${game.description || game.shortDesc || game.instructions}
              </p>
            </div>

            <div>
              <h4 class="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">How to Play</h4>
              <p class="text-xs sm:text-sm text-emerald-300 font-semibold leading-relaxed bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40">
                ${game.instructions}
              </p>
            </div>

            ${game.faqs && game.faqs.length > 0 ? `
              <div>
                <h4 class="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Frequently Asked Questions</h4>
                <div class="space-y-2">
                  ${game.faqs.map(faq => `
                    <div class="bg-slate-800/70 p-3 rounded-xl border border-slate-700/50">
                      <div class="text-xs font-extrabold text-white mb-0.5">Q: ${faq.q}</div>
                      <div class="text-xs text-slate-300 font-medium">A: ${faq.a}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${game.keywords ? `
              <div class="pt-2 border-t border-slate-800">
                <span class="text-[10px] font-black uppercase text-slate-500 block mb-1">Search Keywords</span>
                <span class="text-[11px] text-slate-400 font-medium">${Array.isArray(game.keywords) ? game.keywords.join(', ') : game.keywords}</span>
              </div>
            ` : ''}
          </div>
        </div>

      </main>

    </div>
  `;

  const canvasArea = container.querySelector('#game-canvas-area') as HTMLElement;
  const fullscreenBtn = container.querySelector('#btn-fullscreen-toggle') as HTMLButtonElement;
  const fullscreenIcon = container.querySelector('#fullscreen-icon') as HTMLElement;
  const fullscreenText = container.querySelector('#fullscreen-text') as HTMLElement;
  const reloadBtn = container.querySelector('#btn-game-reload') as HTMLButtonElement;
  const infoBtn = container.querySelector('#btn-game-info') as HTMLButtonElement;
  const closeInfoBtn = container.querySelector('#btn-close-info') as HTMLButtonElement;
  const infoOverlay = container.querySelector('#game-info-overlay') as HTMLElement;

  infoBtn?.addEventListener('click', () => {
    infoOverlay?.classList.remove('hidden');
  });

  closeInfoBtn?.addEventListener('click', () => {
    infoOverlay?.classList.add('hidden');
  });

  infoOverlay?.addEventListener('click', (e) => {
    if (e.target === infoOverlay) {
      infoOverlay.classList.add('hidden');
    }
  });

  // Track Fullscreen state
  const updateFullscreenUI = () => {
    const isFull = !!document.fullscreenElement;
    if (fullscreenIcon) fullscreenIcon.textContent = isFull ? '🗗' : '⛶';
    if (fullscreenText) fullscreenText.textContent = isFull ? 'Exit' : 'Fullscreen';
  };

  fullscreenBtn?.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request could not be completed:', err);
    }
    updateFullscreenUI();
  });

  document.addEventListener('fullscreenchange', updateFullscreenUI);

  // Victory callback
  const handleWin = (timeSeconds: number, streak?: number) => {
    showVictoryModal({
      title: game.title,
      timeSeconds,
      streak,
      gameId: game.id,
      onClose: () => {
        mountEngine();
      }
    });
  };

  let cleanupEngine: (() => void) | null = null;

  // Mount logic: prioritize index.html if the game has its own HTML file!
  const mountEngine = () => {
    // Cleanup previous instance
    if (cleanupEngine) {
      cleanupEngine();
      cleanupEngine = null;
    }
    canvasArea.innerHTML = '';

    // 1. If the game has its own standalone index.html (or game.html), open it full screen!
    if (game.htmlUrl) {
      canvasArea.innerHTML = `
        <iframe 
          id="game-active-frame"
          src="${game.htmlUrl}" 
          class="w-full h-full border-0 outline-none block bg-black m-0 p-0" 
          style="border: 0; outline: none; margin: 0; padding: 0; width: 100%; height: 100%; display: block;"
          allow="autoplay; fullscreen; gamepad; focus-without-user-activation; clipboard-write; xr-spatial-tracking; encrypted-media; screen-wake-lock"
          allowfullscreen>
        </iframe>
      `;

      let timerSeconds = 0;
      const interval = setInterval(() => timerSeconds++, 1000);

      const onMessage = (event: MessageEvent) => {
        if (event.data === 'win' || event.data?.type === 'win' || event.data?.action === 'win') {
          clearInterval(interval);
          handleWin(event.data.time || timerSeconds, event.data.streak);
        } else if (event.data?.type === 'reward_request') {
          // Handle Rewarded Ad trigger from game
          const frame = container.querySelector('#game-active-frame') as HTMLIFrameElement;
          setTimeout(() => {
            frame?.contentWindow?.postMessage({ type: 'reward_granted', reward: event.data.reward || 'hint' }, '*');
          }, 1000);
        }
      };

      window.addEventListener('message', onMessage);

      cleanupEngine = () => {
        clearInterval(interval);
        window.removeEventListener('message', onMessage);
      };
      return;
    }

    // 2. Otherwise check for discovered JS/TS engine in game folder
    const dynamicEngine = getDiscoveredEngine(game.id);
    if (dynamicEngine) {
      const res = dynamicEngine(canvasArea, (timeSeconds, streak) => handleWin(timeSeconds, streak));
      cleanupEngine = typeof res === 'function' ? res : null;
      return;
    }

    // 3. Fallback canvas placeholder when game files are being loaded
    canvasArea.innerHTML = `
      <div class="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-900/80">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-slate-700" style="background-color: ${game.coverBg};">
          ${game.iconSvg}
        </div>
        <h3 class="text-xl font-black text-white">${game.title}</h3>
        <p class="text-xs text-slate-400 max-w-sm">${game.shortDesc || game.description || 'Carregando jogo...'}</p>
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700">
          <span>🎮 Pronto para receber os arquivos em /src/games/</span>
        </div>
      </div>
    `;
  };

  let prerollController: { cancel: () => void } | null = null;

  // Show Interstitial Preroll Ad (3-4s with countdown and Skip button) before launching game
  const stageScreen = container.querySelector('#game-stage-screen') as HTMLElement;
  if (stageScreen) {
    prerollController = showGamePrerollAd({
      gameTitle: game.title,
      gameIconSvg: game.iconSvg,
      categoryLabel: game.categoryLabel,
      coverBg: game.coverBg,
      durationSeconds: 4,
      onComplete: () => {
        mountEngine();
      }
    });
    (prerollController as any).mount(stageScreen);
  } else {
    mountEngine();
  }

  // Reload button resets the game
  reloadBtn?.addEventListener('click', () => {
    mountEngine();
  });

  // Attach cleanup to container
  (container as any)._cleanup = () => {
    document.removeEventListener('fullscreenchange', updateFullscreenUI);
    if (prerollController) prerollController.cancel();
    if (cleanupEngine) cleanupEngine();
  };
}
