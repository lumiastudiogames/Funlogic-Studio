// UI, Screens, Modals, and DOM Controller for Metro Subway Train Yard
import { gameState } from './state';
import { audio } from './audio';
import { LEVELS } from './levels';
import { LevelConfig } from './types';

export type GameScreen = 'MAIN_MENU' | 'LEVEL_SELECT' | 'HOW_TO_PLAY' | 'PLAYING';

export class UIController {
  private root: HTMLElement;
  private currentScreen: GameScreen = 'MAIN_MENU';
  private adTimerInterval: number | null = null;
  private adCountdownSec: number = 5;

  // Callbacks
  public onStartLevel?: (levelId: number) => void;
  public onRetryLevel?: () => void;
  public onNextLevel?: () => void;
  public onTogglePause?: () => void;
  public onToggleSpeed?: () => void;
  public onActivateHint?: () => void;

  constructor(root: HTMLElement) {
    this.root = root;
    this.renderBaseLayout();
    this.attachEventListeners();
    this.setScreen('MAIN_MENU');
  }

  private renderBaseLayout() {
    this.root.innerHTML = `
      <div id="game-stage" class="w-full max-w-5xl h-[100dvh] sm:h-[90vh] sm:max-h-[850px] mx-auto flex flex-col relative overflow-hidden bg-slate-950 sm:rounded-3xl shadow-2xl border-0 sm:border sm:border-slate-800">
        
        <!-- 1. Header HUD -->
        <header id="game-hud" class="hidden w-full h-12 sm:h-14 bg-slate-900/95 backdrop-blur px-1.5 sm:px-4 border-b border-slate-800 flex items-center justify-between gap-1 sm:gap-2 shrink-0 z-20">
          
          <!-- Left: Menu / Level Badge -->
          <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button id="btn-pause-menu" class="btn-tactile w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 active:scale-95 text-slate-200" title="Pause Menu">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div id="hud-level-badge" class="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-full text-[10px] sm:text-xs font-black bg-blue-950/80 text-blue-400 border border-blue-800 shrink-0 tracking-wide">
              LEVEL 1
            </div>
          </div>

          <!-- Center: Trains remaining & Timer -->
          <div class="flex items-center gap-1 sm:gap-2 shrink-0">
            <div class="bg-slate-950 border border-slate-800 rounded-lg px-1.5 sm:px-3 py-0.5 text-center min-w-[42px] sm:min-w-[55px] shrink-0">
              <span class="block text-[7px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">TRAINS</span>
              <span id="hud-trains-counter" class="font-black text-xs sm:text-base leading-none text-emerald-400">0/2</span>
            </div>
            <div class="bg-slate-950 border border-slate-800 rounded-lg px-1.5 sm:px-3 py-0.5 text-center min-w-[38px] sm:min-w-[50px] shrink-0">
              <span class="block text-[7px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">TIME</span>
              <span id="hud-time-counter" class="font-black text-xs sm:text-base leading-none text-slate-200">0s</span>
            </div>
          </div>

          <!-- Right: Controls & Tools -->
          <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <!-- Speed Multiplier (1x / 2x) -->
            <button id="btn-speed-toggle" class="btn-tactile w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-black text-amber-400 flex items-center justify-center gap-1 shrink-0" title="Speed Toggle">
              <span id="hud-speed-label">1x</span>
            </button>

            <!-- Hint Button (Rewarded Ad flow) -->
            <button id="btn-hint" class="btn-tactile w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1 shrink-0 hover:bg-amber-500/30" title="Get Hint">
              <span>💡</span>
              <span class="hidden sm:inline">HINT</span>
            </button>

            <!-- Quick Retry -->
            <button id="btn-retry" class="btn-tactile w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 hover:text-white" title="Restart Level">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <!-- Sound Toggle -->
            <button id="btn-sound-toggle" class="btn-tactile w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 hover:text-white" title="Sound Toggle">
              <span id="sound-icon" class="text-xs sm:text-sm">🔊</span>
            </button>
          </div>
        </header>

        <!-- 2. Canvas Container (Flex-1) -->
        <div id="canvas-container" class="flex-1 w-full h-full relative overflow-hidden bg-slate-950 cursor-pointer touch-none">
          <canvas id="game-canvas" class="block w-full h-full touch-none"></canvas>
          
          <!-- Bottom Quick Help Bar -->
          <div id="game-quick-hint" class="hidden absolute bottom-1.5 sm:bottom-2 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur border border-slate-700/80 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-medium text-slate-300 pointer-events-none shadow-lg text-center whitespace-nowrap max-w-[95%] truncate">
            🔀 Tap switches to route • 🚇 Tap train to brake
          </div>
        </div>

        <!-- 3. Absolute Overlays & Screens -->
        
        <!-- Screen: Main Menu -->
        <div id="screen-main-menu" class="absolute inset-0 bg-slate-950 flex flex-col items-center justify-between p-4 sm:p-6 z-30 overflow-y-auto">
          <div class="w-full flex justify-end">
            <button id="menu-btn-sound" class="btn-tactile px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 text-slate-300">
              <span id="menu-sound-icon">🔊</span>
              <span>Sound</span>
            </button>
          </div>

          <div class="flex flex-col items-center text-center my-auto py-2">
            <!-- Train Yard Logo Graphic -->
            <div class="relative mb-3 sm:mb-4">
              <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-2xl shadow-blue-500/20">
                <div class="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-3xl sm:text-4xl">
                  🚇
                </div>
              </div>
              <div class="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] rounded-full uppercase tracking-widest shadow">
                30 LEVELS
              </div>
            </div>

            <h1 class="text-2xl sm:text-4xl font-black text-white tracking-tight">
              METRO SUBWAY
            </h1>
            <p class="text-base sm:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-1 sm:mb-2">
              TRAIN YARD DISPATCHER
            </p>
            <p class="text-xs sm:text-sm text-slate-400 max-w-sm mb-4 sm:mb-6 leading-relaxed">
              Switch multi-car subway trains across parallel yard tracks to their matching colored tunnel portals. Avoid collisions!
            </p>

            <!-- Menu Navigation Buttons -->
            <div class="flex flex-col gap-2.5 sm:gap-3 w-60 sm:w-72">
              <button id="menu-btn-play" class="btn-tactile w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30">
                <span>▶</span>
                <span id="menu-play-label">PLAY LEVEL 1</span>
              </button>

              <button id="menu-btn-levels" class="btn-tactile w-full py-2.5 sm:py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2">
                <span>📑</span>
                <span>SELECT LEVEL</span>
              </button>

              <button id="menu-btn-how-to-play" class="btn-tactile w-full py-2.5 sm:py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2">
                <span>📖</span>
                <span>HOW TO PLAY</span>
              </button>
            </div>
          </div>

          <!-- Footer Stats -->
          <div class="flex items-center gap-6 text-[11px] sm:text-xs text-slate-400 pt-2">
            <div>⭐ Stars: <span id="menu-total-stars" class="font-bold text-amber-400">0/90</span></div>
            <div>🚇 Unlocked: <span id="menu-unlocked-level" class="font-bold text-blue-400">Level 1/30</span></div>
          </div>
        </div>

        <!-- Screen: Level Selector -->
        <div id="screen-level-select" class="hidden absolute inset-0 bg-slate-950 flex flex-col p-3 sm:p-6 z-30">
          <div class="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 shrink-0">
            <button id="btn-back-from-levels" class="btn-tactile px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1">
              <span>←</span>
              <span>Back</span>
            </button>
            <h2 class="text-sm sm:text-lg font-black text-white">SELECT LEVEL (1 - 30)</h2>
            <div class="text-xs font-extrabold text-amber-400">
              ⭐ <span id="levels-stars-count">0</span>/90
            </div>
          </div>

          <div id="levels-grid" class="flex-1 overflow-y-auto py-3 sm:py-4 grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-3 custom-scrollbar pr-1">
            <!-- Dynamically populated 30 level tiles -->
          </div>
        </div>

        <!-- Screen: How to Play -->
        <div id="screen-how-to-play" class="hidden absolute inset-0 bg-slate-950 flex flex-col p-3 sm:p-6 z-30 overflow-y-auto">
          <div class="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 shrink-0 mb-3 sm:mb-4">
            <button id="btn-back-from-tutorial" class="btn-tactile px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1">
              <span>←</span>
              <span>Back</span>
            </button>
            <h2 class="text-sm sm:text-lg font-black text-white">HOW TO PLAY</h2>
            <div class="w-10"></div>
          </div>

          <div class="flex flex-col gap-3 sm:gap-4 max-w-xl mx-auto my-auto w-full">
            <!-- Step 1 Card -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex items-start gap-3 sm:gap-4 shadow-md">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-950 border border-blue-700 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                🔀
              </div>
              <div>
                <h3 class="font-black text-xs sm:text-sm text-blue-400 mb-0.5 sm:mb-1">1. TOGGLE TRACK SWITCHES</h3>
                <p class="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  Tap on any track switch point to flip the routing between straight-through rail and diagonal turnout curves. An LED arrow confirms the active path.
                </p>
              </div>
            </div>

            <!-- Step 2 Card -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex items-start gap-3 sm:gap-4 shadow-md">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-950 border border-amber-700 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                🚇
              </div>
              <div>
                <h3 class="font-black text-xs sm:text-sm text-amber-400 mb-0.5 sm:mb-1">2. BRAKE & DISPATCH TRAINS</h3>
                <p class="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  Tap any train to trigger emergency brakes and pause its movement. Tap again to release! Longer 3-car and 4-car trains need extra track clearance.
                </p>
              </div>
            </div>

            <!-- Step 3 Card -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex items-start gap-3 sm:gap-4 shadow-md">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                🎯
              </div>
              <div>
                <h3 class="font-black text-xs sm:text-sm text-emerald-400 mb-0.5 sm:mb-1">3. REACH MATCHING TUNNELS</h3>
                <p class="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                  Guide every subway train to its corresponding colored tunnel portal (Red Line to Red Tunnel, Blue to Blue, etc.) without collisions.
                </p>
              </div>
            </div>

            <button id="btn-tutorial-play" class="btn-tactile w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-xs sm:text-sm uppercase tracking-wider mt-1 sm:mt-2 shadow-lg shadow-blue-600/20">
              Start Dispatching Now
            </button>
          </div>
        </div>

        <!-- Modal: Rewarded Ad Hint System -->
        <div id="modal-rewarded-hint" class="hidden absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-40">
          <div class="bg-slate-900 border border-slate-700 rounded-3xl p-4 sm:p-6 max-w-sm w-full max-h-[96dvh] overflow-y-auto shadow-2xl flex flex-col items-center text-center">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl sm:text-3xl mb-2 sm:mb-3">
              💡
            </div>
            <h3 class="text-base sm:text-lg font-black text-white mb-1">DISPATCHER HINT SPONSOR</h3>
            <p class="text-[11px] sm:text-xs text-slate-400 mb-3 sm:mb-4">
              Watch a quick 5-second simulated sponsor broadcast to reveal optimal track switch lines!
            </p>

            <!-- Video Ad simulation container -->
            <div class="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 flex flex-col items-center">
              <div class="text-xs font-bold text-amber-400 mb-0.5">METRO TRANSIT NETWORK</div>
              <div class="text-[10px] sm:text-[11px] text-slate-400 mb-2">Automated Dispatch Safety Bulletin</div>
              <!-- Countdown bar -->
              <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                <div id="ad-progress-bar" class="h-full bg-amber-500 transition-all duration-1000 w-0"></div>
              </div>
              <div id="ad-timer-text" class="text-xs font-black text-slate-300">5s remaining...</div>
            </div>

            <div class="flex gap-2 w-full">
              <button id="btn-close-ad" class="btn-tactile flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                Cancel
              </button>
              <button id="btn-claim-hint" disabled class="btn-tactile flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow">
                Unlock Hint 💡
              </button>
            </div>
          </div>
        </div>

        <!-- Modal: Level Victory -->
        <div id="modal-level-win" class="hidden absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-40">
          <div class="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 max-w-sm w-full max-h-[96dvh] overflow-y-auto shadow-2xl flex flex-col items-center text-center">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl sm:text-3xl mb-2 animate-bounce">
              🎉
            </div>
            <h3 class="text-lg sm:text-xl font-black text-white">YARD CLEARED!</h3>
            <p id="win-level-title" class="text-xs font-bold text-emerald-400 mb-2 sm:mb-3">Level 1 Complete</p>

            <!-- Stars Rating -->
            <div id="win-stars-display" class="text-xl sm:text-2xl mb-3 sm:mb-4 tracking-widest text-amber-400">
              ⭐⭐⭐
            </div>

            <div class="w-full bg-slate-950 border border-slate-800 rounded-2xl p-2.5 sm:p-3 mb-3 sm:mb-4 flex justify-around text-center">
              <div>
                <span class="block text-[8px] sm:text-[9px] uppercase font-bold text-slate-400">YOUR TIME</span>
                <span id="win-time-val" class="font-black text-xs sm:text-sm text-slate-200">12s</span>
              </div>
              <div class="border-l border-slate-800"></div>
              <div>
                <span class="block text-[8px] sm:text-[9px] uppercase font-bold text-slate-400">TARGET</span>
                <span id="win-target-val" class="font-black text-xs sm:text-sm text-amber-400">25s</span>
              </div>
            </div>

            <div class="flex flex-col gap-2 w-full">
              <button id="btn-win-next" class="btn-tactile w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-lg shadow-emerald-600/30">
                Next Level ➔
              </button>
              <div class="flex gap-2">
                <button id="btn-win-retry" class="btn-tactile flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                  Replay
                </button>
                <button id="btn-win-menu" class="btn-tactile flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                  Levels
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal: Crash / Level Failed -->
        <div id="modal-crash" class="hidden absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-40">
          <div class="bg-slate-900 border border-red-500/40 rounded-3xl p-5 sm:p-6 max-w-sm w-full max-h-[96dvh] overflow-y-auto shadow-2xl flex flex-col items-center text-center">
            <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-2xl sm:text-3xl mb-2">
              💥
            </div>
            <h3 class="text-lg sm:text-xl font-black text-red-400">TRAIN COLLISION!</h3>
            <p id="crash-reason-text" class="text-xs text-slate-300 my-2 leading-relaxed">
              Subway trains collided during shunting!
            </p>

            <div class="flex flex-col gap-2 w-full mt-2 sm:mt-3">
              <button id="btn-crash-retry" class="btn-tactile w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-xs sm:text-sm uppercase tracking-wide shadow-lg shadow-red-600/30">
                ↺ Try Again
              </button>
              <button id="btn-crash-menu" class="btn-tactile w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                Level Select
              </button>
            </div>
          </div>
        </div>

        <!-- Modal: Pause -->
        <div id="modal-pause" class="hidden absolute inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-40">
          <div class="bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 max-w-xs w-full max-h-[96dvh] overflow-y-auto shadow-2xl flex flex-col items-center text-center">
            <h3 class="text-lg sm:text-xl font-black text-white mb-3 sm:mb-4">GAME PAUSED</h3>
            
            <div class="flex flex-col gap-2 sm:gap-2.5 w-full">
              <button id="btn-pause-resume" class="btn-tactile w-full py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-wide">
                Resume
              </button>
              <button id="btn-pause-restart" class="btn-tactile w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                Restart Level
              </button>
              <button id="btn-pause-levels" class="btn-tactile w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                Level Select
              </button>
              <button id="btn-pause-menu-main" class="btn-tactile w-full py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300">
                Main Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  public setScreen(screen: GameScreen) {
    this.currentScreen = screen;
    const menuEl = document.getElementById('screen-main-menu')!;
    const levelSelectEl = document.getElementById('screen-level-select')!;
    const howToPlayEl = document.getElementById('screen-how-to-play')!;
    const gameHUDEl = document.getElementById('game-hud')!;
    const quickHintEl = document.getElementById('game-quick-hint')!;

    // Hide all
    menuEl.classList.add('hidden');
    levelSelectEl.classList.add('hidden');
    howToPlayEl.classList.add('hidden');
    gameHUDEl.classList.add('hidden');
    quickHintEl.classList.add('hidden');

    this.closeAllModals();

    if (screen === 'MAIN_MENU') {
      menuEl.classList.remove('hidden');
      this.updateMenuStats();
    } else if (screen === 'LEVEL_SELECT') {
      levelSelectEl.classList.remove('hidden');
      this.renderLevelsGrid();
    } else if (screen === 'HOW_TO_PLAY') {
      howToPlayEl.classList.remove('hidden');
    } else if (screen === 'PLAYING') {
      gameHUDEl.classList.remove('hidden');
      quickHintEl.classList.remove('hidden');
    }
  }

  public updateMenuStats() {
    const totalStars = gameState.getTotalStars();
    const unlocked = gameState.getUnlockedLevel();

    const starsEl = document.getElementById('menu-total-stars');
    const unlockedEl = document.getElementById('menu-unlocked-level');
    const playLabelEl = document.getElementById('menu-play-label');

    if (starsEl) starsEl.textContent = `${totalStars}/90`;
    if (unlockedEl) unlockedEl.textContent = `Level ${unlocked}/30`;
    if (playLabelEl) playLabelEl.textContent = `PLAY LEVEL ${unlocked}`;
  }

  public renderLevelsGrid() {
    const grid = document.getElementById('levels-grid');
    const starsCount = document.getElementById('levels-stars-count');
    if (!grid) return;

    if (starsCount) starsCount.textContent = String(gameState.getTotalStars());
    grid.innerHTML = '';

    const unlockedLevel = gameState.getUnlockedLevel();

    LEVELS.forEach(lvl => {
      const isUnlocked = lvl.id <= unlockedLevel;
      const stars = gameState.saveData.stars[lvl.id] || 0;
      const bestTime = gameState.saveData.bestTimes[lvl.id];

      const btn = document.createElement('button');
      btn.className = `btn-tactile p-1.5 sm:p-2 rounded-xl sm:rounded-2xl flex flex-col items-center justify-between border min-h-[54px] sm:min-h-[64px] ${
        isUnlocked
          ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 cursor-pointer'
          : 'bg-slate-950 border-slate-800/60 opacity-45 cursor-not-allowed'
      }`;

      if (isUnlocked) {
        let starsStr = '';
        if (stars === 3) starsStr = '⭐⭐⭐';
        else if (stars === 2) starsStr = '⭐⭐';
        else if (stars === 1) starsStr = '⭐';
        else starsStr = '☆☆☆';

        btn.innerHTML = `
          <span class="text-xs font-black text-blue-400">${lvl.id}</span>
          <span class="text-[9px] tracking-tighter text-amber-400">${starsStr}</span>
          <span class="text-[8px] text-slate-500 font-mono">${bestTime ? `${bestTime}s` : `${lvl.trains.length} tr`}</span>
        `;

        btn.addEventListener('click', () => {
          audio.playClick();
          if (this.onStartLevel) {
            this.onStartLevel(lvl.id);
          }
        });
      } else {
        btn.innerHTML = `
          <span class="text-xs font-bold text-slate-600">${lvl.id}</span>
          <span class="text-xs">🔒</span>
          <span class="text-[8px] text-slate-700">Locked</span>
        `;
      }

      grid.appendChild(btn);
    });
  }

  public updateHUD(level: LevelConfig, clearedTrains: number, totalTrains: number, timeSec: number, speedMult: number) {
    const badge = document.getElementById('hud-level-badge');
    const counter = document.getElementById('hud-trains-counter');
    const timer = document.getElementById('hud-time-counter');
    const speed = document.getElementById('hud-speed-label');

    if (badge) badge.textContent = `LEVEL ${level.id}`;
    if (counter) counter.textContent = `${clearedTrains}/${totalTrains}`;
    if (timer) timer.textContent = `${timeSec}s`;
    if (speed) speed.textContent = `${speedMult}x`;
  }

  public showWinModal(level: LevelConfig, timeSec: number, stars: number) {
    const modal = document.getElementById('modal-level-win');
    const title = document.getElementById('win-level-title');
    const starsEl = document.getElementById('win-stars-display');
    const timeVal = document.getElementById('win-time-val');
    const targetVal = document.getElementById('win-target-val');

    if (title) title.textContent = `Level ${level.id}: ${level.name}`;
    if (starsEl) {
      starsEl.textContent = stars === 3 ? '⭐⭐⭐' : (stars === 2 ? '⭐⭐' : '⭐');
    }
    if (timeVal) timeVal.textContent = `${timeSec}s`;
    if (targetVal) targetVal.textContent = `${level.targetTimeSec}s`;

    if (modal) modal.classList.remove('hidden');
  }

  public showCrashModal(reason: string) {
    const modal = document.getElementById('modal-crash');
    const text = document.getElementById('crash-reason-text');
    if (text) text.textContent = reason;
    if (modal) modal.classList.remove('hidden');
  }

  public showPauseModal() {
    const modal = document.getElementById('modal-pause');
    if (modal) modal.classList.remove('hidden');
  }

  public openRewardedAdModal() {
    const modal = document.getElementById('modal-rewarded-hint');
    const bar = document.getElementById('ad-progress-bar');
    const timerText = document.getElementById('ad-timer-text');
    const claimBtn = document.getElementById('btn-claim-hint') as HTMLButtonElement;

    if (!modal) return;
    modal.classList.remove('hidden');

    this.adCountdownSec = 5;
    if (claimBtn) claimBtn.disabled = true;
    if (bar) bar.style.width = '0%';
    if (timerText) timerText.textContent = `5s remaining...`;

    if (this.adTimerInterval) clearInterval(this.adTimerInterval);

    const startTime = Date.now();
    this.adTimerInterval = window.setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, Math.ceil(5 - elapsed));
      const pct = Math.min(100, (elapsed / 5) * 100);

      if (bar) bar.style.width = `${pct}%`;
      if (timerText) timerText.textContent = remaining > 0 ? `${remaining}s remaining...` : 'Sponsor Completed!';

      if (elapsed >= 5) {
        clearInterval(this.adTimerInterval!);
        this.adTimerInterval = null;
        if (claimBtn) {
          claimBtn.disabled = false;
          claimBtn.classList.add('animate-bounce');
        }
      }
    }, 100);
  }

  public closeAllModals() {
    ['modal-level-win', 'modal-crash', 'modal-pause', 'modal-rewarded-hint'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    if (this.adTimerInterval) {
      clearInterval(this.adTimerInterval);
      this.adTimerInterval = null;
    }
  }

  private attachEventListeners() {
    // Menu Buttons
    document.getElementById('menu-btn-play')?.addEventListener('click', () => {
      audio.playClick();
      if (this.onStartLevel) {
        this.onStartLevel(gameState.getUnlockedLevel());
      }
    });

    document.getElementById('menu-btn-levels')?.addEventListener('click', () => {
      audio.playClick();
      this.setScreen('LEVEL_SELECT');
    });

    document.getElementById('menu-btn-how-to-play')?.addEventListener('click', () => {
      audio.playClick();
      this.setScreen('HOW_TO_PLAY');
    });

    document.getElementById('btn-back-from-levels')?.addEventListener('click', () => {
      audio.playClick();
      this.setScreen('MAIN_MENU');
    });

    document.getElementById('btn-back-from-tutorial')?.addEventListener('click', () => {
      audio.playClick();
      this.setScreen('MAIN_MENU');
    });

    document.getElementById('btn-tutorial-play')?.addEventListener('click', () => {
      audio.playClick();
      if (this.onStartLevel) {
        this.onStartLevel(gameState.getUnlockedLevel());
      }
    });

    // Sound Toggles
    const updateSoundIcons = () => {
      const isMuted = audio.getIsMuted();
      const icon = isMuted ? '🔇' : '🔊';
      const hudIcon = document.getElementById('sound-icon');
      const menuIcon = document.getElementById('menu-sound-icon');
      if (hudIcon) hudIcon.textContent = icon;
      if (menuIcon) menuIcon.textContent = icon;
    };

    document.getElementById('btn-sound-toggle')?.addEventListener('click', () => {
      audio.toggleMute();
      updateSoundIcons();
    });

    document.getElementById('menu-btn-sound')?.addEventListener('click', () => {
      audio.toggleMute();
      updateSoundIcons();
    });

    // In-game HUD buttons
    document.getElementById('btn-pause-menu')?.addEventListener('click', () => {
      audio.playClick();
      if (this.onTogglePause) this.onTogglePause();
    });

    document.getElementById('btn-speed-toggle')?.addEventListener('click', () => {
      audio.playClick();
      if (this.onToggleSpeed) this.onToggleSpeed();
    });

    document.getElementById('btn-retry')?.addEventListener('click', () => {
      audio.playClick();
      if (this.onRetryLevel) this.onRetryLevel();
    });

    document.getElementById('btn-hint')?.addEventListener('click', () => {
      audio.playClick();
      this.openRewardedAdModal();
    });

    // Rewarded Ad Modal
    document.getElementById('btn-close-ad')?.addEventListener('click', () => {
      audio.playClick();
      this.closeAllModals();
    });

    document.getElementById('btn-claim-hint')?.addEventListener('click', () => {
      audio.playClick();
      this.closeAllModals();
      if (this.onActivateHint) this.onActivateHint();
    });

    // Win Modal
    document.getElementById('btn-win-next')?.addEventListener('click', () => {
      audio.playClick();
      this.closeAllModals();
      if (this.onNextLevel) this.onNextLevel();
    });

    document.getElementById('btn-win-retry')?.addEventListener('click', () => {
      audio.playClick();
      this.closeAllModals();
      if (this.onRetryLevel) this.onRetryLevel();
    });

    document.getElementById('btn-win-menu')?.addEventListener('click', () => {
      audio.playClick();
      this.setScreen('LEVEL_SELECT');
    });

    // Crash Modal
    document.getElementById('btn-crash-retry')?.addEventListener('click', () => {
      audio.playClick();
      this.closeAllModals();
      if (this.onRetryLevel) this.onRetryLevel();
    });

    document.getElementById('btn-crash-menu')?.addEventListener('click', () => {
      audio.playClick();
      this.setScreen('LEVEL_SELECT');
    });

    // Pause Modal
    document.getElementById('btn-pause-resume')?.addEventListener('click', () => {
      audio.playClick();
      if (this.onTogglePause) this.onTogglePause();
    });

    document.getElementById('btn-pause-restart')?.addEventListener('click', () => {
      audio.playClick();
      this.closeAllModals();
      if (this.onRetryLevel) this.onRetryLevel();
    });

    document.getElementById('btn-pause-levels')?.addEventListener('click', () => {
      audio.playClick();
      this.setScreen('LEVEL_SELECT');
    });

    document.getElementById('btn-pause-menu-main')?.addEventListener('click', () => {
      audio.playClick();
      this.setScreen('MAIN_MENU');
    });
  }
}
