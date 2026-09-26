import { GAMES } from '../data/games';
import { Game } from '../types';
import { showVictoryModal } from '../components/VictoryModal';
import { getDiscoveredEngine } from '../games/autoLoader';
import { updateHeadSeo } from '../utils/seo';
import { recordGamePlay } from '../utils/gameStats';
import { showGamePrerollAd } from '../components/PrerollAd';

const GAME_ALIASES: Record<string, string> = {
  'mahjong': 'mahjong-solitaire',
  '2048': 'math-2048-operations',
  'sokoban': 'sokoban-warehouse',
  'sudoku': 'sudoku-classic',
  'water-sort': 'water-sort-lab',
  'chess': 'chess-mate-in-one'
};

export function renderGameView(container: HTMLElement, gameId: string): void {
  const resolvedId = GAME_ALIASES[gameId.toLowerCase()] || gameId;
  const game = GAMES.find(g => g.id === resolvedId) || GAMES.find(g => g.id === gameId) || GAMES[0];

  // Clean up any active, conflicting game-level sub-path service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (const reg of registrations) {
        const scopePath = new URL(reg.scope).pathname;
        if (scopePath !== '/' && scopePath !== '/funlogic.games/' && scopePath !== '/playfunlogic.com/') {
          reg.unregister().then(() => {
            console.log('Unregistered conflicting game-level service worker:', reg.scope);
          });
        }
      }
    }).catch(err => console.warn('Error clearing service workers:', err));
  }

  // Purge legacy/legacy game-level PWA cache that caused style sheet collisions
  if ('caches' in window) {
    caches.delete('game-pwa-v1').then(deleted => {
      if (deleted) console.log('Successfully purged legacy game PWA cache.');
    }).catch(err => console.warn('Error purging legacy cache:', err));
  }

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
    <div id="fullscreen-game-root" class="w-full h-[100dvh] flex flex-col bg-[#0b0f19] text-white overflow-hidden select-none border-0 p-0 m-0" style="height: 100dvh; min-height: 100vh; width: 100%; display: flex; flex-direction: column;">
      
      <!-- Top Game Bar (Compact Console Header - Borderless & Ultra-Responsive) -->
      <header class="h-12 sm:h-14 bg-[#0F172A] px-2 sm:px-4 flex items-center justify-between gap-1.5 sm:gap-3 shrink-0 z-30 shadow-md border-0 w-full overflow-hidden">
        
        <!-- Left: Back Navigation & Game Identity -->
        <div class="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1">
          <a 
            href="#game/${game.id}" 
            id="btn-back-portal" 
            class="h-8 w-8 sm:w-auto sm:h-9 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-black transition cursor-pointer text-decoration-none shrink-0 shadow-xs border-0 flex items-center justify-center gap-1"
            title="Back to Details"
          >
            <span class="text-sm font-bold">←</span>
            <span class="hidden md:inline">Details</span>
          </a>
          
          <div class="h-5 w-px bg-slate-800 hidden sm:block shrink-0"></div>

          <div class="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center p-1 shrink-0 filter drop-shadow-xs" style="background-color: ${game.coverBg};">
              ${game.iconSvg}
            </span>
            <div class="min-w-0 flex-1">
              <h1 class="text-xs sm:text-sm font-black text-white truncate leading-tight">${game.title}</h1>
              <p class="text-[10px] text-slate-400 font-bold hidden md:block truncate">${game.categoryLabel}</p>
            </div>
          </div>
        </div>

        <!-- Right: Actions (Info/FAQ, New Tab, Fullscreen) -->
        <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
          
          <button 
            id="btn-game-info" 
            title="Info & Help" 
            class="w-8 h-8 sm:w-auto sm:h-9 sm:px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1 border-0 transition cursor-pointer active:scale-95 shadow-xs"
          >
            <span>ℹ️</span>
            <span class="hidden lg:inline">Help</span>
          </button>

          ${game.htmlUrl ? `
            <a 
              href="${game.htmlUrl}" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Open in new tab" 
              class="w-8 h-8 sm:w-auto sm:h-9 sm:px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1 border-0 transition text-decoration-none shadow-xs"
            >
              <span>↗</span>
              <span class="hidden lg:inline">Tab</span>
            </a>
          ` : ''}

          <button 
            id="btn-fullscreen-toggle" 
            class="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl bg-[#58CC02] hover:bg-[#4EBA02] active:scale-95 text-white font-black text-xs flex items-center justify-center gap-1 shadow-sm transition cursor-pointer border-0"
            title="Toggle Fullscreen"
          >
            <span id="fullscreen-icon">⛶</span>
            <span id="fullscreen-text" class="hidden sm:inline">Fullscreen</span>
          </button>

        </div>
      </header>

      <!-- Main Game Display Stage: 100% Full Screen Viewport - Completely Borderless & Responsive -->
      <main id="game-stage-screen" class="flex-1 w-full h-[calc(100dvh-48px)] sm:h-[calc(100dvh-56px)] bg-black relative flex items-center justify-center overflow-hidden border-0 p-0 m-0" style="height: calc(100dvh - 48px); min-height: calc(100vh - 48px); width: 100%; flex: 1; display: flex;">
        <div id="game-canvas-area" class="w-full h-full flex items-center justify-center relative overflow-hidden border-0 p-0 m-0" style="width: 100%; height: 100%; flex: 1; display: flex;">
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
      onRestart: () => {
        mountEngine();
      },
      onClose: () => {
        // Modal closed
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
          class="w-full h-full border-0 outline-none block bg-slate-900 m-0 p-0" 
          style="border: 0; outline: none; margin: 0; padding: 0; width: 100%; height: 100%; min-height: 100%; display: block; background: #0f172a;"
          allow="autoplay; fullscreen; gamepad; clipboard-write; xr-spatial-tracking; encrypted-media; screen-wake-lock">
        </iframe>
      `;

      // Block iframe-level service worker registration to prevent cache collisions & unstyled reload bugs
      const frame = canvasArea.querySelector('#game-active-frame') as HTMLIFrameElement;
      if (frame) {
        const blockSWAndInjectCSS = () => {
          try {
            const win = frame.contentWindow;
            if (win && (win as any).ServiceWorkerContainer) {
              (win as any).ServiceWorkerContainer.prototype.register = function() {
                return Promise.resolve(new Object());
              };
            }
          } catch (e) {}

          try {
            const doc = frame.contentDocument || frame.contentWindow?.document;
            if (doc) {
              const style = doc.createElement('style');
              style.textContent = `
                #fl-fullscreen-btn, 
                .fl-fullscreen-btn,
                [id*="fullscreen-btn"],
                [class*="fullscreen-btn"] {
                  display: none !important;
                  visibility: hidden !important;
                  pointer-events: none !important;
                }
              `;
              doc.head.appendChild(style);
            }
          } catch (e) {}
        };
        frame.addEventListener('load', blockSWAndInjectCSS);
      }

      let timerSeconds = 0;
      const interval = setInterval(() => timerSeconds++, 1000);

      const onMessage = (event: MessageEvent) => {
        // Prevent spurious messages from extensions, other frames, or outside sources
        if (frame && frame.contentWindow && event.source !== frame.contentWindow) {
          return;
        }

        if (event.data === 'win' || event.data?.type === 'win' || event.data?.action === 'win') {
          clearInterval(interval);
          const winTime = typeof event.data?.time === 'number' && event.data.time > 0 
            ? event.data.time 
            : timerSeconds;
          handleWin(winTime, event.data?.streak);
        } else if (event.data?.type === 'reward_request') {
          // Handle Rewarded Ad trigger from game
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
        <p class="text-xs text-slate-400 max-w-sm">${game.shortDesc || game.description || 'Loading game...'}</p>
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700">
          <span>🎮 Loading game engine...</span>
        </div>
      </div>
    `;
  };

  const fullscreenRoot = container.querySelector('#fullscreen-game-root') as HTMLElement;
  let prerollController: { cancel: () => void; mount: (parent: HTMLElement) => void } | null = null;

  // Launch with Preroll Ad: shows interstitial ad loading screen before game starts
  prerollController = showGamePrerollAd({
    gameTitle: game.title,
    gameIconSvg: game.iconSvg,
    categoryLabel: game.categoryLabel,
    coverBg: game.coverBg,
    durationSeconds: 3,
    onComplete: () => {
      prerollController = null;
      mountEngine();
    }
  });

  if (fullscreenRoot && prerollController) {
    prerollController.mount(fullscreenRoot);
  } else {
    mountEngine();
  }

  // Attach cleanup to container
  (container as any)._cleanup = () => {
    document.removeEventListener('fullscreenchange', updateFullscreenUI);
    if (prerollController) {
      prerollController.cancel();
      prerollController = null;
    }
    if (cleanupEngine) cleanupEngine();
  };
}
