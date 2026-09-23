/**
 * Screen Controller and DOM UI Builder
 * Completely localized in English and optimized for Mobile Portrait and Desktop display.
 */
import { gameState } from './game-state.js';
import { soundManager } from './audio.js';
import { GameRenderer } from './renderer.js';
import { LEVELS } from './game-data.js';
import { ICONS, ASSETS, getAssetSvg } from './assets.js';

export class ScreenManager {
  constructor(container) {
    this.currentScreen = 'MAIN_MENU';
    this.activeMobileTab = 'grid';
    this.container = container;
    this.renderer = null;
    this.adTimerInterval = null;
    this.adCountdown = 5;
    this.tickerMessage = 'Select a cell in the grid or tap a clue to investigate.';

    this.renderBaseLayout();
    this.setupStateListeners();
    this.setScreen('MAIN_MENU');
  }

  setRenderer(renderer) {
    this.renderer = renderer;
  }

  setupStateListeners() {
    gameState.onStateChange = () => {
      this.updateHUDMetrics();
      this.updateLogicGridDOM();
      this.updateCluesDOM();
      this.updateSummaryDOM();
      this.updateTickerDOM();
    };

    gameState.onWinCallback = (timeInSeconds) => {
      if (this.renderer) {
        this.renderer.triggerCelebration();
      }
      this.showWinModal(timeInSeconds);
    };
  }

  setScreen(screen) {
    this.currentScreen = screen;
    this.updateVisibility();
  }

  updateVisibility() {
    const screens = ['screen-main-menu', 'screen-level-select', 'screen-playing', 'screen-tutorial'];
    screens.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });

    if (this.currentScreen === 'MAIN_MENU') {
      document.getElementById('screen-main-menu')?.classList.remove('hidden');
    } else if (this.currentScreen === 'LEVEL_SELECT') {
      this.renderLevelSelectGrid();
      document.getElementById('screen-level-select')?.classList.remove('hidden');
    } else if (this.currentScreen === 'PLAYING') {
      document.getElementById('screen-playing')?.classList.remove('hidden');
      this.renderPlayingScreen();
      if (window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }
    } else if (this.currentScreen === 'TUTORIAL') {
      document.getElementById('screen-tutorial')?.classList.remove('hidden');
    }
  }

  setMobileTab(tab) {
    this.activeMobileTab = tab;
    soundManager.playClick();
    this.updateMobileTabVisibility();

    if (tab === 'summary' && window.dispatchEvent) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
    }
  }

  updateMobileTabVisibility() {
    const tabGrid = document.getElementById('tab-pane-grid');
    const tabClues = document.getElementById('tab-pane-clues');
    const tabSummary = document.getElementById('tab-pane-summary');

    const btnGrid = document.getElementById('btn-tab-grid');
    const btnClues = document.getElementById('btn-tab-clues');
    const btnSummary = document.getElementById('btn-tab-summary');

    if (tabGrid) tabGrid.classList.toggle('hidden', this.activeMobileTab !== 'grid');
    if (tabClues) tabClues.classList.toggle('hidden', this.activeMobileTab !== 'clues');
    if (tabSummary) tabSummary.classList.toggle('hidden', this.activeMobileTab !== 'summary');

    const activeStyle = 'bg-gradient-to-r from-amber-600 to-yellow-600 text-stone-950 font-black border-amber-400 shadow';
    const inactiveStyle = 'bg-stone-900 text-amber-200/80 border-stone-800 hover:bg-stone-800';

    if (btnGrid) {
      btnGrid.className = `btn-tactile flex-1 py-1.5 px-1.5 rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 border ${
        this.activeMobileTab === 'grid' ? activeStyle : inactiveStyle
      }`;
    }
    if (btnClues) {
      btnClues.className = `btn-tactile flex-1 py-1.5 px-1.5 rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 border ${
        this.activeMobileTab === 'clues' ? activeStyle : inactiveStyle
      }`;
    }
    if (btnSummary) {
      btnSummary.className = `btn-tactile flex-1 py-1.5 px-1.5 rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 border ${
        this.activeMobileTab === 'summary' ? activeStyle : inactiveStyle
      }`;
    }
  }

  renderBaseLayout() {
    this.container.innerHTML = `
      <div id="game-stage" class="fixed inset-0 w-full h-full overflow-hidden flex flex-col bg-stone-950 select-none touch-manipulation">
        
        <!-- 1. SCREEN: MAIN MENU -->
        <div id="screen-main-menu" class="w-full h-full flex flex-col items-center justify-center p-3 sm:p-8 relative overflow-y-auto custom-scroll z-10 bg-gradient-to-b from-stone-950 via-stone-900 to-[#1c120c]">
          <div class="flex flex-col items-center text-center my-auto py-2 max-w-sm sm:max-w-md w-full">
            <div class="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 mb-2 flex items-center gap-1.5">
              ${ICONS.ankh_emblem} <span>Pharaoh's Enigma</span> ${ICONS.ankh_emblem}
            </div>
            <h1 class="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 drop-shadow-md tracking-tight">
              Ancient Egypt Explorers
            </h1>
            <p class="text-amber-200/80 text-xs sm:text-sm max-w-xs sm:max-w-sm mt-1.5 font-medium leading-normal">
              Archaeologist • Tomb • Sacred Relic
            </p>
            <p class="text-stone-400 text-[11px] sm:text-xs max-w-xs mt-1">
              Decipher hieroglyphic clues and use the logic grid to solve ancient discoveries!
            </p>

            <!-- Decorative Artifact Visual Frame -->
            <div class="my-3 sm:my-4 relative flex items-center justify-center">
              <div class="w-20 h-20 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-amber-600/30 via-stone-900 to-amber-950/80 border-2 border-amber-500/50 flex flex-col items-center justify-center shadow-xl torch-glow relative">
                <div class="scale-110 sm:scale-150 transform mb-0.5">
                  ${ASSETS.relic_scarab}
                </div>
                <span class="text-[9px] sm:text-[10px] font-bold text-amber-400 mt-1 uppercase tracking-wider">Giza • 1922</span>
              </div>
            </div>

            <!-- Menu Buttons -->
            <div class="w-full max-w-xs flex flex-col gap-2 mb-2">
              <button id="btn-play-game" class="btn-tactile w-full py-2.5 sm:py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer">
                ${ICONS.play} <span>START EXPEDITION</span>
              </button>
              <button id="btn-level-select" class="btn-tactile w-full py-2 sm:py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700/80 text-amber-200 border border-amber-700/40 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer">
                ${ICONS.scroll} <span>SELECT MYSTERY</span>
              </button>
              <button id="btn-tutorial" class="btn-tactile w-full py-2 px-4 rounded-xl bg-stone-800/60 hover:bg-stone-700/60 text-stone-300 border border-stone-700/40 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer">
                ${ICONS.hint} <span>HOW TO PLAY</span>
              </button>
              <button id="btn-sound-menu" class="btn-tactile py-1.5 px-3 rounded-xl bg-stone-900 text-amber-400/80 border border-stone-800 text-[11px] font-semibold flex items-center justify-center gap-2 cursor-pointer">
                <span id="sound-menu-icon" class="flex items-center gap-1.5">
                  ${soundManager.isMuted ? ICONS.soundOff : ICONS.soundOn}
                  <span>${soundManager.isMuted ? 'Sound: Off' : 'Sound: On'}</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- 2. SCREEN: LEVEL SELECT -->
        <div id="screen-level-select" class="w-full h-full flex flex-col p-3 sm:p-6 relative overflow-y-auto custom-scroll z-10 bg-gradient-to-b from-stone-950 via-stone-900 to-[#1a110a] hidden">
          <div class="flex items-center justify-between mb-4">
            <button id="btn-back-from-levels" class="btn-tactile px-3 py-1.5 rounded-lg bg-stone-800 text-amber-300 border border-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
              ← MENU
            </button>
            <h2 class="text-lg sm:text-2xl font-black text-amber-300">Egyptian Expeditions</h2>
            <div class="w-12 sm:w-16"></div>
          </div>
          <div id="level-cards-container" class="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 pb-4">
            <!-- Dynamic Level Cards -->
          </div>
        </div>

        <!-- 3. SCREEN: TUTORIAL -->
        <div id="screen-tutorial" class="w-full h-full flex flex-col p-3 sm:p-6 relative overflow-y-auto custom-scroll z-10 bg-gradient-to-b from-stone-950 via-stone-900 to-[#1a110a] hidden">
          <div class="flex items-center justify-between mb-4">
            <button id="btn-back-from-tutorial" class="btn-tactile px-3 py-1.5 rounded-lg bg-stone-800 text-amber-300 border border-stone-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer">
              ← MENU
            </button>
            <h2 class="text-lg sm:text-2xl font-black text-amber-300">How to Play</h2>
            <div class="w-12 sm:w-16"></div>
          </div>

          <!-- 3 Visual Step Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div class="bg-stone-800/80 border border-amber-700/30 rounded-2xl p-3 flex flex-col items-center text-center">
              <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 text-xl flex items-center justify-center font-black mb-2 border border-amber-500/30">
                1
              </div>
              <h3 class="font-bold text-amber-200 text-sm mb-1">Tap the Grid</h3>
              <p class="text-[11px] text-stone-300 leading-relaxed">
                Tap a cell to cycle between <span class="text-stone-400">Empty</span>, <span class="text-rose-400 font-bold inline-flex items-center gap-0.5">${ICONS.cross} (Eliminated)</span> and <span class="text-emerald-400 font-bold inline-flex items-center gap-0.5">${ICONS.check} (Confirmed)</span>.
              </p>
            </div>

            <div class="bg-stone-800/80 border border-amber-700/30 rounded-2xl p-3 flex flex-col items-center text-center">
              <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 text-xl flex items-center justify-center font-black mb-2 border border-amber-500/30">
                2
              </div>
              <h3 class="font-bold text-amber-200 text-sm mb-1">Decipher Clues</h3>
              <p class="text-[11px] text-stone-300 leading-relaxed">
                Each clue reveals relationships between archaeologists, tombs, and relics. Tap a clue to strike it out once solved.
              </p>
            </div>

            <div class="bg-stone-800/80 border border-amber-700/30 rounded-2xl p-3 flex flex-col items-center text-center">
              <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 text-xl flex items-center justify-center font-black mb-2 border border-amber-500/30">
                3
              </div>
              <h3 class="font-bold text-amber-200 text-sm mb-1">Uncover Treasures</h3>
              <p class="text-[11px] text-stone-300 leading-relaxed">
                When you confirm a match, auto-deductions reveal surrounding cells. Connect all triples to complete the expedition!
              </p>
            </div>
          </div>

          <div class="mt-auto pb-2 flex justify-center">
            <button id="btn-play-from-tutorial" class="btn-tactile py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 font-black text-stone-950 text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer">
              ${ICONS.play} <span>START PLAYING!</span>
            </button>
          </div>
        </div>

        <!-- 4. SCREEN: PLAYING -->
        <div id="screen-playing" class="w-full h-full flex flex-col relative overflow-hidden bg-stone-950 hidden">
          
          <!-- Universal Header (HUD) -->
          <header class="w-full h-11 sm:h-14 bg-stone-900/95 px-2 sm:px-4 border-b border-amber-900/40 flex items-center justify-between gap-1 shrink-0 z-30">
            <!-- Left Block: Menu / Level Badge -->
            <div class="flex items-center gap-1 sm:gap-2 shrink-0 min-w-0">
              <button id="btn-pause-menu" class="btn-tactile w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-stone-800 border border-stone-700 text-amber-300 flex items-center justify-center shrink-0 cursor-pointer" title="Menu">
                ${ICONS.menu}
              </button>
              <div id="hud-level-badge" class="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-amber-950/80 text-amber-400 border border-amber-600/40 shrink-0 truncate max-w-[95px] sm:max-w-none">
                STAGE 1
              </div>
            </div>

            <!-- Central/Right Block: Timer, Undo, Hint, Sound -->
            <div class="flex items-center gap-1 sm:gap-2 shrink-0">
              <!-- Timer -->
              <div class="bg-stone-800/80 border border-stone-700 rounded-lg px-1.5 sm:px-3 py-0.5 text-center min-w-[46px] sm:min-w-[50px] shrink-0">
                <span class="block text-[7px] sm:text-[9px] font-bold text-amber-500/70 uppercase">TIME</span>
                <span id="timer-counter" class="font-mono font-bold text-[11px] sm:text-sm text-amber-200 leading-none">00:00</span>
              </div>

              <!-- Undo Button -->
              <button id="btn-undo" class="btn-tactile px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer" title="Undo">
                ${ICONS.undo}
                <span class="hidden sm:inline">UNDO</span>
              </button>

              <!-- Hint Button -->
              <button id="btn-hint" class="btn-tactile px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs flex items-center gap-1 shrink-0 cursor-pointer" title="Hieroglyphic Hint">
                ${ICONS.hint}
                <span class="hidden sm:inline">HINT (AD)</span>
              </button>

              <!-- Sound Toggle -->
              <button id="btn-sound-toggle" class="btn-tactile w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-stone-800 border border-stone-700 text-amber-300 flex items-center justify-center shrink-0 cursor-pointer" title="Sound">
                <span id="sound-hud-icon">${soundManager.isMuted ? ICONS.soundOff : ICONS.soundOn}</span>
              </button>
            </div>
          </header>

          <!-- Mobile Tab Navigation Bar -->
          <nav class="lg:hidden w-full bg-stone-900 border-b border-stone-800 px-1.5 py-1 flex items-center gap-1 shrink-0 z-20">
            <button id="btn-tab-grid" class="btn-tactile flex-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 border bg-amber-500 text-stone-950 font-black border-amber-400">
              ${ICONS.ankh_emblem} <span>GRID</span>
            </button>
            <button id="btn-tab-clues" class="btn-tactile flex-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 border bg-stone-900 text-amber-200/80 border-stone-800">
              ${ICONS.scroll} <span id="mobile-tab-clues-label">CLUES</span>
            </button>
            <button id="btn-tab-summary" class="btn-tactile flex-1 py-1.5 px-1 rounded-xl text-[11px] sm:text-xs flex items-center justify-center gap-1 border bg-stone-900 text-amber-200/80 border-stone-800">
              ${ICONS.eye} <span id="mobile-tab-summary-label">SUMMARY</span>
            </button>
          </nav>

          <!-- Main Gameplay Container -->
          <div class="flex-1 w-full overflow-hidden p-1.5 sm:p-3 bg-gradient-to-b from-stone-950 to-[#160f0a]">
            
            <!-- DESKTOP LAYOUT (min-width: 1024px) -->
            <div class="hidden lg:flex lg:flex-row w-full h-full gap-3 overflow-hidden">
              
              <!-- Left Column: Canvas + Deduction Notebook -->
              <div class="w-5/12 h-full flex flex-col gap-3 shrink-0 overflow-hidden">
                <!-- Diorama Canvas Box -->
                <div class="h-44 shrink-0 rounded-2xl bg-black border border-amber-800/40 relative overflow-hidden shadow-lg">
                  <canvas id="game-canvas" class="w-full h-full block"></canvas>
                </div>

                <!-- Deduction Notebook -->
                <div class="flex-1 bg-stone-900/90 border border-amber-700/30 rounded-2xl p-3 shadow-xl flex flex-col overflow-hidden egypt-border">
                  <div class="flex items-center gap-2 mb-2 pb-1.5 border-b border-amber-800/40 shrink-0">
                    ${ICONS.eye}
                    <h3 class="text-xs font-black text-amber-300 uppercase tracking-wider">Deduction Notebook</h3>
                  </div>
                  <div id="desktop-summary-container" class="flex-1 overflow-y-auto custom-scroll flex flex-col gap-2">
                    <!-- Dynamic Summary Cards -->
                  </div>
                </div>
              </div>

              <!-- Right Column: Logic Grid Matrix + Clues List -->
              <div class="w-7/12 h-full flex flex-col gap-3 overflow-y-auto custom-scroll pr-1">
                <!-- Logic Matrix -->
                <div class="bg-stone-900/90 border border-amber-700/30 rounded-2xl p-3 shadow-xl overflow-x-auto custom-scroll">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-2">
                      ${ICONS.ankh_emblem}
                      <h3 class="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider">Deduction Logic Grid</h3>
                    </div>
                    <div class="text-[10px] text-stone-400 flex items-center gap-1.5">
                      <span>Tap:</span>
                      <span class="text-stone-500">Empty</span>
                      <span>→</span>
                      <span class="text-rose-400 inline-flex items-center gap-0.5">${ICONS.cross}</span>
                      <span>→</span>
                      <span class="text-emerald-400 inline-flex items-center gap-0.5">${ICONS.check}</span>
                    </div>
                  </div>
                  <div id="desktop-matrix-table-container" class="flex justify-center my-1">
                    <!-- Table rendered here -->
                  </div>
                </div>

                <!-- Clues List -->
                <div class="bg-[#241a12] border border-amber-600/40 rounded-2xl p-3 shadow-xl egypt-border">
                  <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-amber-700/30">
                    <div class="flex items-center gap-2">
                      ${ICONS.scroll}
                      <h3 class="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wider">Archaeological Clues</h3>
                    </div>
                    <span class="text-[10px] text-amber-400/70 font-medium">Tap to strike out</span>
                  </div>
                  <div id="desktop-clues-container" class="flex flex-col gap-2">
                    <!-- Clues rendered here -->
                  </div>
                </div>
              </div>

            </div>

            <!-- MOBILE LAYOUT (< 1024px) -->
            <div class="lg:hidden w-full h-full flex flex-col overflow-hidden">
              
              <!-- Tab Pane 1: Logic Grid -->
              <div id="tab-pane-grid" class="w-full h-full flex flex-col overflow-y-auto custom-scroll">
                <div class="bg-stone-900/90 border border-amber-700/30 rounded-2xl p-2 shadow-xl overflow-x-auto custom-scroll mb-2">
                  <div class="flex items-center justify-between mb-1.5 px-1">
                    <div class="flex items-center gap-1">
                      ${ICONS.ankh_emblem}
                      <h3 class="text-[11px] font-black text-amber-300 uppercase tracking-wider">Logic Grid</h3>
                    </div>
                    <div class="text-[9px] text-stone-400 flex items-center gap-1">
                      <span class="text-rose-400 font-bold">${ICONS.cross} No</span>
                      <span>•</span>
                      <span class="text-emerald-400 font-bold">${ICONS.check} Yes</span>
                    </div>
                  </div>
                  <div id="mobile-matrix-table-container" class="w-full overflow-x-auto custom-scroll flex justify-start sm:justify-center py-1">
                    <!-- Table rendered here -->
                  </div>
                </div>
              </div>

              <!-- Tab Pane 2: Clues -->
              <div id="tab-pane-clues" class="hidden w-full h-full flex flex-col overflow-y-auto custom-scroll">
                <div class="bg-[#241a12] border border-amber-600/40 rounded-2xl p-2.5 shadow-xl egypt-border">
                  <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-amber-700/30">
                    <div class="flex items-center gap-1.5">
                      ${ICONS.scroll}
                      <h3 class="text-xs font-black text-amber-300 uppercase tracking-wider">Pharaoh's Clues</h3>
                    </div>
                    <span class="text-[10px] text-amber-400/70 font-medium">Tap to strike out</span>
                  </div>
                  <div id="mobile-clues-container" class="flex flex-col gap-2">
                    <!-- Clues rendered here -->
                  </div>
                </div>
              </div>

              <!-- Tab Pane 3: Summary & Canvas -->
              <div id="tab-pane-summary" class="hidden w-full h-full flex flex-col gap-2 overflow-y-auto custom-scroll">
                <!-- Mobile Canvas Box -->
                <div class="h-32 shrink-0 rounded-2xl bg-black border border-amber-800/40 relative overflow-hidden shadow-lg">
                  <canvas id="mobile-game-canvas" class="w-full h-full block"></canvas>
                </div>

                <!-- Mobile Deduction Summary Notebook -->
                <div class="bg-stone-900/90 border border-amber-700/30 rounded-2xl p-2.5 shadow-xl flex flex-col egypt-border">
                  <div class="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-amber-800/40">
                    ${ICONS.eye}
                    <h3 class="text-xs font-black text-amber-300 uppercase tracking-wider">Deduction Notebook</h3>
                  </div>
                  <div id="mobile-summary-container" class="flex flex-col gap-2">
                    <!-- Summary rendered here -->
                  </div>
                </div>
              </div>

            </div>

          </div>

          <!-- Bottom Footer / Ticker Bar -->
          <footer class="w-full bg-stone-900 border-t border-amber-900/40 p-1.5 sm:px-4 flex flex-col gap-1 shrink-0 z-20">
            <div id="ticker-bar" class="w-full bg-stone-950/80 border border-amber-900/40 rounded-lg px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-amber-200/90 truncate flex items-center gap-1.5">
              <span class="text-amber-500 shrink-0">${ICONS.ankh_emblem}</span>
              <span id="ticker-text" class="truncate">${this.tickerMessage}</span>
            </div>

            <div class="flex items-center justify-between gap-2">
              <button id="btn-clear-grid" class="btn-tactile px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-stone-800 text-stone-300 border border-stone-700 text-[10px] sm:text-xs font-bold flex items-center gap-1 cursor-pointer">
                ${ICONS.trash} <span>Clear</span>
              </button>
              <div id="match-counter-badge" class="text-[10px] sm:text-xs text-amber-400 font-bold">
                Discoveries: 0 / 3
              </div>
            </div>
          </footer>

        </div>

        <!-- 5. MODAL: REWARDED AD -->
        <div id="modal-rewarded-ad" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 hidden">
          <div class="w-full max-w-xs sm:max-w-sm max-h-[90vh] overflow-y-auto custom-scroll bg-stone-900 border-2 border-amber-500/60 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col items-center text-center">
            <div class="mb-1 scale-110">
              ${ICONS.scroll}
            </div>
            <h3 class="text-base sm:text-lg font-black text-amber-300">Deciphering Sacred Papyrus</h3>
            <p class="text-[11px] text-stone-300 mt-1 mb-3">
              Consulting temple hieroglyphs to reveal a true deduction...
            </p>

            <!-- Video Simulation Canvas / Box -->
            <div class="w-full h-24 sm:h-28 bg-black rounded-xl border border-amber-700/40 relative overflow-hidden flex flex-col items-center justify-center mb-3">
              <div class="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-amber-400/20 to-amber-600/10 shimmer-gold opacity-30"></div>
              <div class="scale-110 torch-glow mb-1">
                ${ICONS.eye}
              </div>
              <span class="text-[10px] font-mono text-amber-300 mt-1">Sponsor: Royal Museum of Cairo</span>
              <div class="w-full bg-stone-800 h-1.5 absolute bottom-0 left-0">
                <div id="ad-progress-bar" class="h-full bg-amber-500 transition-all duration-1000 ease-linear w-0"></div>
              </div>
            </div>

            <!-- Countdown text -->
            <div id="ad-countdown-text" class="text-xs sm:text-sm font-bold text-amber-400 mb-3">
              Please wait 5 seconds...
            </div>

            <div class="w-full flex gap-2">
              <button id="btn-skip-ad" class="btn-tactile flex-1 py-1.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold cursor-pointer">
                Cancel
              </button>
              <button id="btn-claim-ad" class="btn-tactile flex-1 py-1.5 rounded-xl bg-amber-500 text-stone-950 text-xs font-black flex items-center justify-center gap-1 cursor-pointer opacity-50" disabled>
                ${ICONS.hint} <span>Claim Hint!</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 6. MODAL: WIN BANNER / VICTORY MODAL -->
        <div id="modal-win" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 hidden">
          <div class="w-full max-w-xs sm:max-w-md max-h-[90vh] overflow-y-auto custom-scroll bg-stone-900 border-2 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
            <div class="mb-1">
              ${ICONS.crown}
            </div>
            <div class="text-[10px] sm:text-xs uppercase tracking-widest text-amber-500 font-bold px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-500/30 mb-2">
              Archaeological Mystery Solved!
            </div>
            <h3 id="win-level-title" class="text-xl sm:text-2xl font-black text-amber-300">
              The Secret of Giza
            </h3>
            <p class="text-[11px] sm:text-xs text-stone-300 mt-1.5 max-w-xs leading-relaxed">
              You deciphered all clues and matched every archaeologist to their tomb and sacred relic!
            </p>

            <div class="w-full bg-stone-800/80 border border-amber-700/40 rounded-xl p-2.5 my-3 flex items-center justify-around">
              <div>
                <span class="block text-[9px] text-amber-500 font-bold uppercase">Final Time</span>
                <span id="win-time-val" class="font-mono text-base sm:text-lg font-black text-amber-200">00:45</span>
              </div>
              <div class="h-7 w-[1px] bg-stone-700"></div>
              <div>
                <span class="block text-[9px] text-amber-500 font-bold uppercase">Pharaonic Honor</span>
                <div class="flex items-center gap-1 justify-center mt-0.5">
                  ${ICONS.star} ${ICONS.star} ${ICONS.star}
                </div>
              </div>
            </div>

            <div class="w-full flex flex-col gap-2">
              <button id="btn-next-level" class="btn-tactile w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer">
                <span>NEXT EXPEDITION</span> ${ICONS.play}
              </button>
              <button id="btn-win-menu" class="btn-tactile w-full py-2 rounded-xl bg-stone-800 text-amber-200 border border-stone-700 font-bold text-xs uppercase tracking-wider cursor-pointer">
                RETURN TO MENU
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

    this.bindGlobalEvents();
  }

  bindGlobalEvents() {
    // Menu Buttons
    document.getElementById('btn-play-game')?.addEventListener('click', () => {
      soundManager.playClick();
      gameState.startLevel(gameState.getUnlockedLevel());
      this.setScreen('PLAYING');
    });

    document.getElementById('btn-level-select')?.addEventListener('click', () => {
      soundManager.playClick();
      this.setScreen('LEVEL_SELECT');
    });

    document.getElementById('btn-tutorial')?.addEventListener('click', () => {
      soundManager.playClick();
      this.setScreen('TUTORIAL');
    });

    document.getElementById('btn-sound-menu')?.addEventListener('click', () => {
      const isMuted = soundManager.toggleMute();
      const el = document.getElementById('sound-menu-icon');
      if (el) {
        el.innerHTML = `${isMuted ? ICONS.soundOff : ICONS.soundOn} <span>${isMuted ? 'Sound: Off' : 'Sound: On'}</span>`;
      }
      this.updateHUDMetrics();
    });

    // Back from Screens
    document.getElementById('btn-back-from-levels')?.addEventListener('click', () => {
      soundManager.playClick();
      this.setScreen('MAIN_MENU');
    });

    document.getElementById('btn-back-from-tutorial')?.addEventListener('click', () => {
      soundManager.playClick();
      this.setScreen('MAIN_MENU');
    });

    document.getElementById('btn-play-from-tutorial')?.addEventListener('click', () => {
      soundManager.playClick();
      gameState.startLevel(gameState.getUnlockedLevel());
      this.setScreen('PLAYING');
    });

    // Mobile Tabs
    document.getElementById('btn-tab-grid')?.addEventListener('click', () => this.setMobileTab('grid'));
    document.getElementById('btn-tab-clues')?.addEventListener('click', () => this.setMobileTab('clues'));
    document.getElementById('btn-tab-summary')?.addEventListener('click', () => this.setMobileTab('summary'));

    // Playing HUD Buttons
    document.getElementById('btn-pause-menu')?.addEventListener('click', () => {
      soundManager.playClick();
      this.setScreen('MAIN_MENU');
    });

    document.getElementById('btn-undo')?.addEventListener('click', () => {
      gameState.undo();
      this.tickerMessage = 'Move undone successfully.';
      this.updateTickerDOM();
    });

    document.getElementById('btn-sound-toggle')?.addEventListener('click', () => {
      const isMuted = soundManager.toggleMute();
      const icon = document.getElementById('sound-hud-icon');
      if (icon) icon.innerHTML = isMuted ? ICONS.soundOff : ICONS.soundOn;
      const menuIcon = document.getElementById('sound-menu-icon');
      if (menuIcon) {
        menuIcon.innerHTML = `${isMuted ? ICONS.soundOff : ICONS.soundOn} <span>${isMuted ? 'Sound: Off' : 'Sound: On'}</span>`;
      }
    });

    document.getElementById('btn-clear-grid')?.addEventListener('click', () => {
      if (confirm('Clear all grid marks?')) {
        gameState.clearGrid();
        this.tickerMessage = 'Grid marks cleared.';
        this.updateTickerDOM();
      }
    });

    // Hint / Rewarded Ad Flow
    document.getElementById('btn-hint')?.addEventListener('click', () => {
      soundManager.playClick();
      this.openRewardedAdModal();
    });

    document.getElementById('btn-skip-ad')?.addEventListener('click', () => {
      soundManager.playClick();
      this.closeRewardedAdModal();
    });

    document.getElementById('btn-claim-ad')?.addEventListener('click', () => {
      this.closeRewardedAdModal();
      const hint = gameState.grantHint();
      if (hint) {
        if (this.renderer) this.renderer.triggerCelebration();
        this.tickerMessage = hint.text;
        this.updateTickerDOM();
      }
    });

    // Win Modal buttons
    document.getElementById('btn-next-level')?.addEventListener('click', () => {
      soundManager.playClick();
      document.getElementById('modal-win')?.classList.add('hidden');
      const nextId = gameState.currentLevel.id + 1;
      const nextLevel = LEVELS.find((l) => l.id === nextId);
      if (nextLevel) {
        gameState.startLevel(nextId);
        this.setScreen('PLAYING');
      } else {
        this.setScreen('LEVEL_SELECT');
      }
    });

    document.getElementById('btn-win-menu')?.addEventListener('click', () => {
      soundManager.playClick();
      document.getElementById('modal-win')?.classList.add('hidden');
      this.setScreen('MAIN_MENU');
    });
  }

  // Render Level Select Cards
  renderLevelSelectGrid() {
    const container = document.getElementById('level-cards-container');
    if (!container) return;

    const unlocked = gameState.getUnlockedLevel();

    container.innerHTML = LEVELS.map((level) => {
      const isUnlocked = level.id <= unlocked;
      const isCompleted = isUnlocked && level.id < unlocked;
      const bestTime = gameState.getBestTime(level.id);

      return `
        <div class="p-3.5 rounded-2xl border ${
          isUnlocked
            ? 'bg-stone-900 border-amber-600/50 hover:border-amber-400 cursor-pointer shadow-lg hover:shadow-amber-500/10'
            : 'bg-stone-950/60 border-stone-800 opacity-60 cursor-not-allowed'
        } transition flex flex-col justify-between" data-level-id="${level.id}">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                level.difficulty === 'Easy'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                  : level.difficulty === 'Medium'
                  ? 'bg-amber-950 text-amber-400 border border-amber-700/50'
                  : 'bg-rose-950 text-rose-400 border border-rose-700/50'
              }">${level.difficulty} • ${level.size}x${level.size}</span>
              <span>${isUnlocked ? (isCompleted ? ICONS.star : ICONS.unlock) : ICONS.lock}</span>
            </div>
            <h3 class="font-bold text-sm sm:text-base text-amber-200">${level.title}</h3>
            <p class="text-xs text-stone-400 mt-1 line-clamp-2">${level.description}</p>
          </div>

          <div class="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-xs">
            <span class="text-stone-400 text-[11px]">
              ${bestTime ? `Best: <strong class="text-amber-300 font-mono">${Math.floor(bestTime / 60)}m ${bestTime % 60}s</strong>` : 'Not completed'}
            </span>
            <button class="btn-tactile px-2.5 py-1 rounded-lg text-xs ${
              isUnlocked ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-500'
            }" ${!isUnlocked ? 'disabled' : ''}>
              ${isUnlocked ? 'EXPLORE' : 'LOCKED'}
            </button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('[data-level-id]').forEach((el) => {
      el.addEventListener('click', () => {
        const id = Number(el.getAttribute('data-level-id'));
        if (id <= gameState.getUnlockedLevel()) {
          soundManager.playClick();
          gameState.startLevel(id);
          this.setScreen('PLAYING');
        } else {
          soundManager.playError();
        }
      });
    });
  }

  // Render Playing screen elements
  renderPlayingScreen() {
    this.updateHUDMetrics();
    this.updateLogicGridDOM();
    this.updateCluesDOM();
    this.updateSummaryDOM();
    this.updateTickerDOM();
  }

  updateHUDMetrics() {
    const levelBadge = document.getElementById('hud-level-badge');
    if (levelBadge) {
      levelBadge.textContent = `STAGE ${gameState.currentLevel.id}`;
      levelBadge.title = gameState.currentLevel.title;
    }

    const timer = document.getElementById('timer-counter');
    if (timer) {
      const min = Math.floor(gameState.elapsedTime / 60).toString().padStart(2, '0');
      const sec = (gameState.elapsedTime % 60).toString().padStart(2, '0');
      timer.textContent = `${min}:${sec}`;
    }

    const matchCounter = document.getElementById('match-counter-badge');
    if (matchCounter) {
      const confirmed = gameState.getConfirmedTriples().filter((t) => t.pyramid && t.relic).length;
      matchCounter.textContent = `Discoveries: ${confirmed} / ${gameState.currentLevel.size}`;
    }

    const cluesLabel = document.getElementById('mobile-tab-clues-label');
    if (cluesLabel) {
      const total = gameState.currentLevel.clues.length;
      const done = gameState.crossedClues.size;
      cluesLabel.textContent = `CLUES (${done}/${total})`;
    }

    const summaryLabel = document.getElementById('mobile-tab-summary-label');
    if (summaryLabel) {
      const confirmed = gameState.getConfirmedTriples().filter((t) => t.pyramid && t.relic).length;
      summaryLabel.textContent = `SUMMARY (${confirmed}/${gameState.currentLevel.size})`;
    }
  }

  updateTickerDOM() {
    const ticker = document.getElementById('ticker-text');
    if (ticker) {
      ticker.textContent = this.tickerMessage;
    }
  }

  // Render Logic Grid Table into both Desktop and Mobile containers
  updateLogicGridDOM() {
    const desktopContainer = document.getElementById('desktop-matrix-table-container');
    const mobileContainer = document.getElementById('mobile-matrix-table-container');

    const html = this.buildLogicGridHTML();

    if (desktopContainer) desktopContainer.innerHTML = html;
    if (mobileContainer) mobileContainer.innerHTML = html;

    // Attach click listeners
    const attachCellEvents = (root) => {
      if (!root) return;
      root.querySelectorAll('[data-matrix]').forEach((cell) => {
        cell.addEventListener('click', (e) => {
          e.preventDefault();
          const matrix = cell.getAttribute('data-matrix');
          const row = Number(cell.getAttribute('data-row'));
          const col = Number(cell.getAttribute('data-col'));
          
          gameState.cycleCell(matrix, row, col);

          const level = gameState.currentLevel;
          if (matrix === 'AB') {
            this.tickerMessage = `Analyzing: ${level.archeologists[row].name} vs ${level.pyramids[col].name}`;
          } else if (matrix === 'AC') {
            this.tickerMessage = `Analyzing: ${level.archeologists[row].name} vs ${level.relics[col].name}`;
          } else {
            this.tickerMessage = `Analyzing: ${level.pyramids[row].name} vs ${level.relics[col].name}`;
          }
          this.updateTickerDOM();
        });
      });
    };

    attachCellEvents(desktopContainer);
    attachCellEvents(mobileContainer);
  }

  buildLogicGridHTML() {
    const level = gameState.currentLevel;
    const size = level.size;
    const grid = gameState.grid;

    let html = `<div class="inline-block border border-amber-700/50 rounded-xl overflow-hidden bg-stone-950 select-none shadow-md">`;
    html += `<table class="border-collapse text-center">`;

    // Row 1: Super Headers
    html += `<thead>`;
    html += `<tr class="bg-stone-900 border-b border-amber-800/60">`;
    html += `<th colspan="2" rowspan="2" class="p-1 border-r border-b border-amber-800/60 bg-stone-950/80 text-[9px] sm:text-[10px] font-bold text-amber-500/80">LOGIC GRID</th>`;
    html += `<th colspan="${size}" class="p-1 border-r border-amber-800/60 text-[9px] sm:text-[11px] font-black text-amber-300 bg-amber-950/50 uppercase tracking-wide">Pyramids / Tombs</th>`;
    html += `<th colspan="${size}" class="p-1 text-[9px] sm:text-[11px] font-black text-amber-300 bg-amber-950/70 uppercase tracking-wide">Sacred Relics</th>`;
    html += `</tr>`;

    // Row 2: Sub-item Headers
    html += `<tr class="bg-stone-900/90 border-b border-amber-800/60">`;
    level.pyramids.forEach((p, idx) => {
      const isLast = idx === size - 1;
      const cleanName = p.name.replace('Pyramid of ', '').replace('Tomb of ', '').replace('Temple of ', '').replace('Shrine of ', '');
      html += `<th class="p-0.5 sm:p-1.5 min-w-[38px] sm:min-w-[65px] text-[8px] sm:text-[10px] font-bold text-amber-200/90 ${isLast ? 'border-r-2 border-amber-600' : 'border-r border-stone-800'}">
        <div class="flex justify-center mb-0.5 scale-75 sm:scale-100 origin-center">${getAssetSvg(p.icon)}</div>
        <div class="truncate max-w-[40px] sm:max-w-[60px] mx-auto text-[8px] sm:text-[9px]">${cleanName}</div>
      </th>`;
    });
    level.relics.forEach((r, idx) => {
      const isLast = idx === size - 1;
      html += `<th class="p-0.5 sm:p-1.5 min-w-[38px] sm:min-w-[65px] text-[8px] sm:text-[10px] font-bold text-amber-200/90 ${isLast ? '' : 'border-r border-stone-800'}">
        <div class="flex justify-center mb-0.5 scale-75 sm:scale-100 origin-center">${getAssetSvg(r.icon)}</div>
        <div class="truncate max-w-[40px] sm:max-w-[60px] mx-auto text-[8px] sm:text-[9px]">${r.name}</div>
      </th>`;
    });
    html += `</tr>`;
    html += `</thead>`;

    html += `<tbody>`;

    // Section 1: Archeologist rows
    level.archeologists.forEach((arch, aIdx) => {
      const isFirst = aIdx === 0;
      const isLastArch = aIdx === size - 1;

      html += `<tr class="border-b ${isLastArch ? 'border-b-2 border-amber-600' : 'border-stone-800/80'} hover:bg-amber-950/20">`;

      if (isFirst) {
        html += `<th rowspan="${size}" class="p-0.5 border-r border-b-2 border-amber-800/60 bg-amber-950/50 text-[8px] sm:text-[10px] font-black text-amber-300 uppercase [writing-mode:vertical-lr] rotate-180">
          Archaeologists
        </th>`;
      }

      html += `<th class="p-1 sm:p-1.5 border-r border-amber-800/60 bg-stone-900/60 text-left min-w-[52px] sm:min-w-[95px]">
        <div class="flex items-center gap-1 text-[8px] sm:text-xs font-bold text-amber-100">
          <span class="shrink-0 scale-75 sm:scale-100 origin-center">${getAssetSvg(arch.icon)}</span>
          <span class="truncate max-w-[45px] sm:max-w-none">${arch.name.split(' ')[0]}</span>
        </div>
      </th>`;

      // Matrix AB
      for (let pIdx = 0; pIdx < size; pIdx++) {
        const val = grid.AB[aIdx][pIdx];
        const isLastCol = pIdx === size - 1;
        html += this.renderCellHTML('AB', aIdx, pIdx, val, isLastCol);
      }

      // Matrix AC
      for (let rIdx = 0; rIdx < size; rIdx++) {
        const val = grid.AC[aIdx][rIdx];
        const isLastCol = rIdx === size - 1;
        html += this.renderCellHTML('AC', aIdx, rIdx, val, isLastCol);
      }

      html += `</tr>`;
    });

    // Section 2: Pyramid rows
    level.pyramids.forEach((pyr, pIdx) => {
      const isFirst = pIdx === 0;
      const isLast = pIdx === size - 1;
      const cleanName = pyr.name.replace('Pyramid of ', '').replace('Tomb of ', '').replace('Temple of ', '').replace('Shrine of ', '');

      html += `<tr class="border-b ${isLast ? 'border-amber-800/60' : 'border-stone-800/80'} hover:bg-amber-950/20">`;

      if (isFirst) {
        html += `<th rowspan="${size}" class="p-0.5 border-r border-amber-800/60 bg-amber-950/40 text-[8px] sm:text-[10px] font-black text-amber-300 uppercase [writing-mode:vertical-lr] rotate-180">
          Tombs
        </th>`;
      }

      html += `<th class="p-1 sm:p-1.5 border-r border-amber-800/60 bg-stone-900/60 text-left min-w-[52px] sm:min-w-[95px]">
        <div class="flex items-center gap-1 text-[8px] sm:text-xs font-bold text-amber-100">
          <span class="shrink-0 scale-75 sm:scale-100 origin-center">${getAssetSvg(pyr.icon)}</span>
          <span class="truncate max-w-[45px] sm:max-w-none">${cleanName}</span>
        </div>
      </th>`;

      // Blank space
      html += `<td colspan="${size}" class="bg-stone-950/90 border-r-2 border-amber-600 border-stone-900 pointer-events-none">
        <div class="text-[9px] text-stone-800 font-mono select-none">𓊃 𓈖 𓏏</div>
      </td>`;

      // Matrix BC
      for (let rIdx = 0; rIdx < size; rIdx++) {
        const val = grid.BC[pIdx][rIdx];
        const isLastCol = rIdx === size - 1;
        html += this.renderCellHTML('BC', pIdx, rIdx, val, isLastCol);
      }

      html += `</tr>`;
    });

    html += `</tbody>`;
    html += `</table></div>`;

    return html;
  }

  renderCellHTML(matrix, row, col, val, isLastCol) {
    const borderClasses = isLastCol ? 'border-r-2 border-amber-600' : 'border-r border-stone-800';

    let content = '';
    let bgStyle = 'bg-stone-950/40 hover:bg-amber-900/30';

    if (val === 1) {
      content = `<span class="text-rose-400 font-black flex items-center justify-center leading-none scale-90 sm:scale-100">${ICONS.cross}</span>`;
      bgStyle = 'bg-rose-950/40 hover:bg-rose-900/50';
    } else if (val === 2) {
      content = `<span class="text-emerald-400 font-black flex items-center justify-center leading-none scale-90 sm:scale-100">${ICONS.check}</span>`;
      bgStyle = 'bg-emerald-950/60 hover:bg-emerald-900/70 shadow-inner';
    }

    return `
      <td data-matrix="${matrix}" data-row="${row}" data-col="${col}" 
          class="w-7 h-7 sm:w-11 sm:h-11 p-0 ${borderClasses} ${bgStyle} cursor-pointer transition-colors active:scale-95 duration-75">
        <div class="w-full h-full flex items-center justify-center">
          ${content}
        </div>
      </td>
    `;
  }

  // Render Clues
  updateCluesDOM() {
    const desktopContainer = document.getElementById('desktop-clues-container');
    const mobileContainer = document.getElementById('mobile-clues-container');

    const html = this.buildCluesHTML();

    if (desktopContainer) desktopContainer.innerHTML = html;
    if (mobileContainer) mobileContainer.innerHTML = html;

    const attachClueEvents = (root) => {
      if (!root) return;
      root.querySelectorAll('[data-clue-id]').forEach((el) => {
        el.addEventListener('click', () => {
          const id = Number(el.getAttribute('data-clue-id'));
          gameState.toggleClue(id);
          const clue = gameState.currentLevel.clues.find((c) => c.id === id);
          if (clue) {
            this.tickerMessage = `Clue ${id}: ${clue.text}`;
            this.updateTickerDOM();
          }
        });
      });
    };

    attachClueEvents(desktopContainer);
    attachClueEvents(mobileContainer);
  }

  buildCluesHTML() {
    const clues = gameState.currentLevel.clues;
    const crossed = gameState.crossedClues;

    return clues.map((clue) => {
      const isCrossed = crossed.has(clue.id);

      return `
        <div data-clue-id="${clue.id}" class="p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2 ${
          isCrossed
            ? 'bg-stone-950/40 border-stone-800/60 opacity-50'
            : 'bg-stone-900/80 border-amber-700/40 hover:border-amber-500 shadow-sm'
        }">
          <div class="w-4 h-4 sm:w-5 sm:h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 text-xs ${
            isCrossed
              ? 'bg-amber-900/50 border-amber-600/50 text-amber-400'
              : 'border-amber-600/60 text-transparent'
          }">
            ${ICONS.check}
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between gap-1 mb-0.5">
              <span class="text-[10px] sm:text-xs font-black uppercase text-amber-400">CLUE #${clue.id}</span>
              ${clue.hieroglyph ? `<span class="font-mono text-[10px] text-amber-600">${clue.hieroglyph}</span>` : ''}
            </div>
            <p class="text-xs sm:text-xs text-amber-100/90 leading-snug ${isCrossed ? 'line-through text-stone-500' : ''}">
              ${clue.text}
            </p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Render Deduction Summary Notebook
  updateSummaryDOM() {
    const desktopContainer = document.getElementById('desktop-summary-container');
    const mobileContainer = document.getElementById('mobile-summary-container');

    const html = this.buildSummaryHTML();

    if (desktopContainer) desktopContainer.innerHTML = html;
    if (mobileContainer) mobileContainer.innerHTML = html;
  }

  buildSummaryHTML() {
    const confirmed = gameState.getConfirmedTriples();
    const level = gameState.currentLevel;

    return confirmed.map((item, idx) => {
      const archItem = level.archeologists[idx];
      const hasPyr = Boolean(item.pyramid);
      const hasRel = Boolean(item.relic);

      return `
        <div class="p-2 sm:p-2.5 rounded-xl bg-stone-950/80 border ${
          hasPyr && hasRel
            ? 'border-emerald-500/50 bg-emerald-950/20'
            : 'border-amber-800/30'
        } flex items-center gap-2">
          <div class="shrink-0 p-1 bg-amber-950/60 border border-amber-600/40 rounded-lg">
            ${getAssetSvg(archItem.icon)}
          </div>
          <div class="flex-1 min-w-0 text-xs">
            <div class="font-bold text-amber-200 truncate">${item.archeologist}</div>
            <div class="flex items-center gap-2 text-[10px] mt-0.5">
              <span class="${hasPyr ? 'text-amber-300 font-semibold' : 'text-stone-500'} truncate">
                🏛️ ${item.pyramid || 'Tomb unknown'}
              </span>
              <span class="${hasRel ? 'text-emerald-400 font-bold' : 'text-stone-500'} truncate">
                🏺 ${item.relic || 'Relic unknown'}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  openRewardedAdModal() {
    const modal = document.getElementById('modal-rewarded-ad');
    const bar = document.getElementById('ad-progress-bar');
    const text = document.getElementById('ad-countdown-text');
    const claimBtn = document.getElementById('btn-claim-ad');

    if (!modal) return;
    modal.classList.remove('hidden');

    this.adCountdown = 5;
    if (bar) bar.style.width = '0%';
    if (text) text.textContent = 'Please wait 5 seconds...';
    if (claimBtn) {
      claimBtn.setAttribute('disabled', 'true');
      claimBtn.classList.add('opacity-50');
    }

    if (this.adTimerInterval) clearInterval(this.adTimerInterval);

    let progress = 0;
    this.adTimerInterval = window.setInterval(() => {
      progress += 20;
      this.adCountdown -= 1;

      if (bar) bar.style.width = `${progress}%`;
      if (text) text.textContent = `Please wait ${Math.max(0, this.adCountdown)} seconds...`;

      if (this.adCountdown <= 0) {
        clearInterval(this.adTimerInterval);
        this.adTimerInterval = null;
        if (text) text.textContent = 'Deciphered! Claim your hint.';
        if (claimBtn) {
          claimBtn.removeAttribute('disabled');
          claimBtn.classList.remove('opacity-50');
        }
      }
    }, 1000);
  }

  closeRewardedAdModal() {
    if (this.adTimerInterval) {
      clearInterval(this.adTimerInterval);
      this.adTimerInterval = null;
    }
    document.getElementById('modal-rewarded-ad')?.classList.add('hidden');
  }

  showWinModal(timeInSeconds) {
    const winModal = document.getElementById('modal-win');
    if (!winModal) return;

    const titleEl = document.getElementById('win-level-title');
    const timeEl = document.getElementById('win-time-val');

    if (titleEl) titleEl.textContent = gameState.currentLevel.title;
    if (timeEl) {
      const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
      const s = (timeInSeconds % 60).toString().padStart(2, '0');
      timeEl.textContent = `${m}:${s}`;
    }

    winModal.classList.remove('hidden');
  }
}
