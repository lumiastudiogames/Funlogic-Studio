import { audio } from './audio';
import { GameState } from './game-state';
import { LEVELS } from './levels';
import { LevelData, ScreenType } from './types';

export class ScreenManager {
  private state: GameState;
  public currentScreen: ScreenType = 'MAIN_MENU';
  
  // Hint ad countdown state
  private hintCountdown: number = 5;
  private hintInterval: number | null = null;
  public onResizeNeeded?: () => void;

  constructor(state: GameState) {
    this.state = state;
    this.initDOM();
    this.bindEvents();
  }

  public setScreen(screen: ScreenType) {
    this.currentScreen = screen;
    this.updateScreenVisibility();
    if (screen === 'PLAYING') {
      this.state.resumeTimer();
      if (this.onResizeNeeded) {
        setTimeout(() => this.onResizeNeeded?.(), 50);
      }
    } else {
      this.state.pauseTimer();
    }
  }

  private initDOM() {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
      <div id="game-stage" class="w-full max-w-4xl h-[100dvh] sm:h-[94vh] sm:max-h-[860px] mx-auto flex flex-col relative overflow-hidden bg-slate-900 text-slate-100 sm:rounded-3xl shadow-2xl border border-slate-800">
        
        <!-- ================= MAIN MENU SCREEN ================= -->
        <div id="screen-main-menu" class="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950">
          <!-- Top Bar in Menu -->
          <div class="w-full flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 text-xs font-black tracking-wider uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                PUZZLE LOGIC
              </span>
            </div>
            <button id="menu-btn-sound" class="btn-tactile w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white" title="Toggle Sound">
              <svg id="menu-icon-sound" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            </button>
          </div>

          <!-- Logo & Hero graphic -->
          <div class="flex flex-col items-center text-center my-auto">
            <div class="relative mb-6">
              <!-- Decorative Flow Circuit Graphic -->
              <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 p-1 shadow-xl shadow-blue-500/20 flex items-center justify-center relative">
                <div class="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center p-3 relative overflow-hidden">
                  <div class="absolute inset-0 bg-blue-500/10 backdrop-blur-sm"></div>
                  <!-- Circuit nodes simulation -->
                  <div class="relative w-full h-full flex items-center justify-center">
                    <div class="w-10 h-10 rounded-full bg-blue-500 text-white font-black text-lg flex items-center justify-center shadow-lg border-2 border-white/40 animate-pulse">1</div>
                    <div class="w-8 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    <div class="w-10 h-10 rounded-full bg-purple-600 text-white font-black text-lg flex items-center justify-center shadow-lg border-2 border-white/40 animate-pulse">2</div>
                  </div>
                </div>
              </div>
            </div>

            <h1 class="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 mb-2">
              NUMBER LINK FLOW
            </h1>
            <p class="text-xs sm:text-sm text-slate-400 max-w-xs sm:max-w-md">
              Connect matching colored numbers. Fill 100% of the grid without crossing pipes.
            </p>
          </div>

          <!-- Menu Buttons Action Stack -->
          <div class="w-full max-w-xs flex flex-col gap-3">
            <button id="btn-menu-play" class="btn-tactile w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              <span id="menu-play-text">PLAY LEVEL 1</span>
            </button>

            <button id="btn-menu-levels" class="btn-tactile w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2">
              <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>LEVEL SELECT</span>
            </button>

            <button id="btn-menu-rules" class="btn-tactile w-full py-3 px-6 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 font-bold text-sm flex items-center justify-center gap-2">
              <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>HOW TO PLAY</span>
            </button>
          </div>

          <!-- Footer version tag -->
          <div class="text-[11px] text-slate-500 mt-4">
            Number Link Flow • Logic Puzzle Game
          </div>
        </div>


        <!-- ================= GAMEPLAY SCREEN ================= -->
        <div id="screen-gameplay" class="absolute inset-0 z-20 flex flex-col hidden bg-slate-900">
          
          <!-- TOP HEADER HUD (Universal Responsive Bar) -->
          <header class="w-full h-14 bg-slate-900/95 px-2.5 sm:px-5 border-b border-slate-800 flex items-center justify-between gap-1.5 shrink-0 z-10 backdrop-blur-md">
            
            <!-- Left Block: Back / Level Badge -->
            <div class="flex items-center gap-1.5 shrink-0">
              <button id="btn-hud-back" class="btn-tactile w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 active:scale-95 text-slate-300 hover:text-white" title="Main Menu">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              
              <div id="hud-level-badge" class="px-2.5 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0 uppercase tracking-wide">
                LEVEL 1
              </div>
            </div>

            <!-- Right Block: Metrics & Quick Controls -->
            <div class="flex items-center gap-1 sm:gap-2 shrink-0">
              
              <!-- Pairs Counter -->
              <div class="bg-slate-800 border border-slate-700 rounded-lg px-2 sm:px-3 py-0.5 text-center min-w-[54px] shrink-0">
                <span class="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">PAIRS</span>
                <span id="hud-pairs-counter" class="font-black text-xs sm:text-sm text-cyan-400 leading-none">0/4</span>
              </div>

              <!-- Stars Counter -->
              <div class="bg-slate-800 border border-slate-700 rounded-lg px-2 sm:px-3 py-0.5 text-center min-w-[50px] shrink-0">
                <span class="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">STARS</span>
                <span id="hud-stars-counter" class="font-black text-xs sm:text-sm text-amber-400 leading-none">★★★</span>
              </div>

              <!-- Timer Counter -->
              <div class="bg-slate-800 border border-slate-700 rounded-lg px-2 sm:px-3 py-0.5 text-center min-w-[50px] shrink-0">
                <span class="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">TIME</span>
                <span id="hud-timer-counter" class="font-black text-xs sm:text-sm text-slate-200 leading-none font-mono">00:00</span>
              </div>

              <!-- Sound Toggle Button -->
              <button id="btn-hud-sound" class="btn-tactile w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300 hover:text-white" title="Toggle Sound">
                <svg id="hud-icon-sound" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>

              <!-- Pause / Settings Button -->
              <button id="btn-hud-pause" class="btn-tactile w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300 hover:text-white" title="Pause Menu">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
          </header>

          <!-- SUB-BAR: FLOW COVERAGE METER -->
          <div class="w-full px-4 py-1.5 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-xs shrink-0">
            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-semibold text-[11px]">Grid Flow:</span>
              <span id="hud-coverage-text" class="font-extrabold text-blue-400 font-mono">0%</span>
            </div>
            <div class="w-36 sm:w-48 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div id="hud-coverage-bar" class="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-300 w-0"></div>
            </div>
            <div id="hud-difficulty-tag" class="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              5x5
            </div>
          </div>

          <!-- CANVAS PLAYING STAGE (Flex-1 central area) -->
          <div id="canvas-container" class="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center p-2 sm:p-4 bg-slate-900/50">
            <canvas id="game-canvas" class="touch-none cursor-pointer block"></canvas>
          </div>

          <!-- FOOTER HUD: CONTROLS & STATUS -->
          <footer class="w-full h-16 bg-slate-900/95 px-3 sm:px-6 border-t border-slate-800 flex items-center justify-between gap-2 shrink-0 z-10">
            <!-- Hint Button with Rewarded Ad Indicator -->
            <button id="btn-hud-hint" class="btn-tactile px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600/30 to-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 shrink-0 hover:bg-amber-500/30">
              <svg class="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>HINT</span>
              <span class="text-[9px] font-black bg-amber-400 text-slate-950 px-1 rounded uppercase">AD</span>
            </button>

            <!-- Center Status / Solved Pill -->
            <div id="hud-status-pill" class="px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5 shrink-0">
              <span id="hud-status-text">CONNECT ALL PAIRS</span>
            </div>

            <div class="flex items-center gap-1.5 shrink-0">
              <!-- Undo Button -->
              <button id="btn-hud-undo" class="btn-tactile px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 shrink-0 hover:bg-slate-700" title="Undo Move">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span class="hidden sm:inline">UNDO</span>
              </button>

              <!-- Reset Button -->
              <button id="btn-hud-reset" class="btn-tactile px-2.5 sm:px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 shrink-0 hover:bg-slate-700" title="Reset Level">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span class="hidden sm:inline">RESET</span>
              </button>
            </div>
          </footer>
        </div>


        <!-- ================= LEVEL SELECT SCREEN ================= -->
        <div id="screen-level-select" class="absolute inset-0 z-30 flex flex-col hidden bg-slate-900 p-4 sm:p-6 overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4 shrink-0">
            <button id="btn-levels-back" class="btn-tactile w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 class="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              SELECT LEVEL
            </h2>
            <div class="w-10"></div>
          </div>

          <!-- Difficulty Filters -->
          <div id="level-filter-bar" class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4 shrink-0">
            <button data-filter="ALL" class="level-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shrink-0">ALL</button>
            <button data-filter="Beginner" class="level-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white shrink-0">5x5 Beginner</button>
            <button data-filter="Easy" class="level-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white shrink-0">6x6 Easy</button>
            <button data-filter="Medium" class="level-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white shrink-0">7x7 Medium</button>
            <button data-filter="Hard" class="level-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white shrink-0">8x8 Hard</button>
            <button data-filter="Master" class="level-filter-btn px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-400 hover:text-white shrink-0">9x9 Master</button>
          </div>

          <!-- Level Grid Container -->
          <div id="levels-grid-container" class="flex-1 overflow-y-auto pr-1 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5 sm:gap-3.5 pb-6">
            <!-- Populated dynamically -->
          </div>
        </div>


        <!-- ================= HOW TO PLAY SCREEN ================= -->
        <div id="screen-how-to-play" class="absolute inset-0 z-30 flex flex-col hidden bg-slate-900 p-4 sm:p-6 overflow-y-auto">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4 shrink-0">
            <button id="btn-rules-back" class="btn-tactile w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h2 class="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              HOW TO PLAY
            </h2>
            <div class="w-10"></div>
          </div>

          <!-- 3 Visual Step Cards (Universal Manual Requirement) -->
          <div class="flex-1 flex flex-col gap-4 max-w-lg mx-auto w-full justify-center">
            
            <!-- Card 1 -->
            <div class="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-black text-lg shrink-0">
                1
              </div>
              <div>
                <h3 class="font-black text-sm sm:text-base text-slate-100 mb-1">CONNECT MATCHING PAIRS</h3>
                <p class="text-xs sm:text-sm text-slate-400">
                  Touch and drag from any numbered circle to connect it with its matching colored number.
                </p>
              </div>
            </div>

            <!-- Card 2 -->
            <div class="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-black text-lg shrink-0">
                2
              </div>
              <div>
                <h3 class="font-black text-sm sm:text-base text-slate-100 mb-1">AVOID CROSSING PIPES</h3>
                <p class="text-xs sm:text-sm text-slate-400">
                  Paths cannot intersect or cross over each other. Crossing another line will cut or disconnect it.
                </p>
              </div>
            </div>

            <!-- Card 3 -->
            <div class="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-lg shrink-0">
                3
              </div>
              <div>
                <h3 class="font-black text-sm sm:text-base text-slate-100 mb-1">FILL 100% OF THE GRID</h3>
                <p class="text-xs sm:text-sm text-slate-400">
                  To win the level, all pairs must be connected AND every single square on the board must be filled with flow!
                </p>
              </div>
            </div>

            <button id="btn-rules-start" class="btn-tactile w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm mt-2">
              GOT IT! LET'S PLAY
            </button>
          </div>
        </div>


        <!-- ================= REWARDED AD HINT MODAL ================= -->
        <div id="modal-hint-ad" class="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 hidden">
          <div class="w-full max-w-sm rounded-3xl bg-slate-800 border border-slate-700 p-6 flex flex-col items-center text-center shadow-2xl relative">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-3">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>

            <h3 class="text-lg font-black text-slate-100 mb-1">SPONSORED HINT</h3>
            <p class="text-xs text-slate-400 mb-4">
              Watch this 5-second simulated sponsor ad to reveal a free solution link.
            </p>

            <!-- Video Simulation Box -->
            <div class="w-full h-24 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center p-3 mb-4 relative overflow-hidden">
              <div class="text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>SPONSOR VIDEO PLAYING</span>
              </div>
              <div id="ad-countdown-text" class="text-lg font-black text-amber-400 font-mono">5s remaining</div>
              
              <!-- Ad Progress Bar -->
              <div class="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                <div id="ad-progress-bar" class="h-full bg-amber-400 w-0 transition-all duration-1000"></div>
              </div>
            </div>

            <!-- Action Buttons -->
            <button id="btn-ad-claim" disabled class="btn-tactile w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-sm disabled:opacity-40 disabled:cursor-not-allowed mb-2 flex items-center justify-center gap-1.5">
              <span>CLAIM FREE HINT</span>
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </button>

            <button id="btn-ad-close" class="text-xs text-slate-400 hover:text-slate-200 py-1">
              Skip / Cancel
            </button>
          </div>
        </div>


        <!-- ================= PAUSE / SETTINGS MODAL ================= -->
        <div id="modal-pause" class="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 hidden">
          <div class="w-full max-w-xs rounded-3xl bg-slate-800 border border-slate-700 p-6 flex flex-col items-center text-center shadow-2xl">
            <h3 class="text-xl font-black text-slate-100 mb-4">GAME PAUSED</h3>
            
            <div class="w-full flex flex-col gap-2.5">
              <button id="btn-pause-resume" class="btn-tactile w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm">
                RESUME
              </button>
              <button id="btn-pause-restart" class="btn-tactile w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm">
                RESTART LEVEL
              </button>
              <button id="btn-pause-sound" class="btn-tactile w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm flex items-center justify-center gap-2">
                <span>SOUND FX:</span>
                <span id="pause-sound-status" class="text-cyan-400 font-black">ON</span>
              </button>
              <button id="btn-pause-levels" class="btn-tactile w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm">
                LEVEL SELECT
              </button>
              <button id="btn-pause-menu" class="btn-tactile w-full py-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold text-xs">
                MAIN MENU
              </button>
            </div>
          </div>
        </div>


        <!-- ================= VICTORY MODAL BANNER ================= -->
        <div id="modal-victory" class="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 hidden">
          <div class="w-full max-w-sm rounded-3xl bg-slate-800 border border-slate-700 p-6 flex flex-col items-center text-center shadow-2xl">
            <div class="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3 animate-bounce">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 mb-1">
              LEVEL COMPLETED!
            </h3>
            
            <div id="victory-stars" class="text-3xl text-amber-400 tracking-widest my-2">
              ★★★
            </div>

            <div class="w-full bg-slate-900/80 rounded-2xl p-3 border border-slate-700/60 my-3 flex justify-around text-xs">
              <div>
                <span class="block text-slate-400 font-semibold">TIME</span>
                <span id="victory-time-text" class="font-black text-sm text-slate-100 font-mono">00:24</span>
              </div>
              <div class="w-[1px] bg-slate-700"></div>
              <div>
                <span class="block text-slate-400 font-semibold">GRID FLOW</span>
                <span class="font-black text-sm text-emerald-400 font-mono">100%</span>
              </div>
            </div>

            <div class="w-full flex flex-col gap-2.5 mt-2">
              <button id="btn-victory-next" class="btn-tactile w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/30">
                NEXT LEVEL
              </button>
              <button id="btn-victory-replay" class="btn-tactile w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs">
                REPLAY
              </button>
              <button id="btn-victory-levels" class="btn-tactile w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold text-xs">
                LEVEL SELECT
              </button>
            </div>
          </div>
        </div>

      </div>
    `;

    this.renderLevelGrid('ALL');
  }

  private bindEvents() {
    // Menu buttons
    document.getElementById('btn-menu-play')?.addEventListener('click', () => {
      audio.playTap();
      const currentUnlocked = this.state.progress.unlockedLevel;
      const targetIdx = Math.min(currentUnlocked - 1, LEVELS.length - 1);
      this.state.setLevel(targetIdx);
      this.setScreen('PLAYING');
    });

    document.getElementById('btn-menu-levels')?.addEventListener('click', () => {
      audio.playTap();
      this.renderLevelGrid('ALL');
      this.setScreen('LEVEL_SELECT');
    });

    document.getElementById('btn-menu-rules')?.addEventListener('click', () => {
      audio.playTap();
      this.setScreen('HOW_TO_PLAY');
    });

    const toggleSoundFn = () => {
      const isMuted = audio.toggleMute();
      this.updateSoundIcons(isMuted);
    };

    document.getElementById('menu-btn-sound')?.addEventListener('click', toggleSoundFn);
    document.getElementById('btn-hud-sound')?.addEventListener('click', toggleSoundFn);

    // Gameplay Header buttons
    document.getElementById('btn-hud-back')?.addEventListener('click', () => {
      audio.playTap();
      this.setScreen('MAIN_MENU');
    });

    document.getElementById('btn-hud-pause')?.addEventListener('click', () => {
      audio.playTap();
      this.openPauseModal();
    });

    // Gameplay Footer buttons
    document.getElementById('btn-hud-undo')?.addEventListener('click', () => {
      this.state.undo();
    });

    document.getElementById('btn-hud-reset')?.addEventListener('click', () => {
      audio.playTap();
      this.state.restartLevel();
    });

    document.getElementById('btn-hud-hint')?.addEventListener('click', () => {
      audio.playTap();
      this.openHintModal();
    });

    // Level Select screen
    document.getElementById('btn-levels-back')?.addEventListener('click', () => {
      audio.playTap();
      this.setScreen('MAIN_MENU');
    });

    const filterBtns = document.querySelectorAll('.level-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = (e.currentTarget as HTMLElement).dataset.filter || 'ALL';
        filterBtns.forEach(b => {
          b.classList.remove('bg-blue-600', 'text-white');
          b.classList.add('bg-slate-800', 'text-slate-400');
        });
        (e.currentTarget as HTMLElement).classList.remove('bg-slate-800', 'text-slate-400');
        (e.currentTarget as HTMLElement).classList.add('bg-blue-600', 'text-white');
        this.renderLevelGrid(filter);
        audio.playTap();
      });
    });

    // How to Play screen
    document.getElementById('btn-rules-back')?.addEventListener('click', () => {
      audio.playTap();
      this.setScreen('MAIN_MENU');
    });
    document.getElementById('btn-rules-start')?.addEventListener('click', () => {
      audio.playTap();
      this.setScreen('PLAYING');
    });

    // Hint Ad Modal
    document.getElementById('btn-ad-claim')?.addEventListener('click', () => {
      this.closeHintModal();
      this.state.applyHint();
    });
    document.getElementById('btn-ad-close')?.addEventListener('click', () => {
      audio.playTap();
      this.closeHintModal();
    });

    // Pause Modal
    document.getElementById('btn-pause-resume')?.addEventListener('click', () => {
      audio.playTap();
      this.closePauseModal();
    });
    document.getElementById('btn-pause-restart')?.addEventListener('click', () => {
      audio.playTap();
      this.closePauseModal();
      this.state.restartLevel();
    });
    document.getElementById('btn-pause-sound')?.addEventListener('click', () => {
      toggleSoundFn();
      const statusEl = document.getElementById('pause-sound-status');
      if (statusEl) statusEl.textContent = audio.isMuted ? 'OFF' : 'ON';
    });
    document.getElementById('btn-pause-levels')?.addEventListener('click', () => {
      audio.playTap();
      this.closePauseModal();
      this.renderLevelGrid('ALL');
      this.setScreen('LEVEL_SELECT');
    });
    document.getElementById('btn-pause-menu')?.addEventListener('click', () => {
      audio.playTap();
      this.closePauseModal();
      this.setScreen('MAIN_MENU');
    });

    // Victory Modal
    document.getElementById('btn-victory-next')?.addEventListener('click', () => {
      audio.playTap();
      this.closeVictoryModal();
      const hasNext = this.state.nextLevel();
      if (!hasNext) {
        this.renderLevelGrid('ALL');
        this.setScreen('LEVEL_SELECT');
      }
    });
    document.getElementById('btn-victory-replay')?.addEventListener('click', () => {
      audio.playTap();
      this.closeVictoryModal();
      this.state.restartLevel();
    });
    document.getElementById('btn-victory-levels')?.addEventListener('click', () => {
      audio.playTap();
      this.closeVictoryModal();
      this.renderLevelGrid('ALL');
      this.setScreen('LEVEL_SELECT');
    });
  }

  private updateScreenVisibility() {
    const screens = {
      'MAIN_MENU': document.getElementById('screen-main-menu'),
      'PLAYING': document.getElementById('screen-gameplay'),
      'LEVEL_SELECT': document.getElementById('screen-level-select'),
      'HOW_TO_PLAY': document.getElementById('screen-how-to-play')
    };

    for (const [key, el] of Object.entries(screens)) {
      if (el) {
        if (key === this.currentScreen) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    }

    if (this.currentScreen === 'MAIN_MENU') {
      const playText = document.getElementById('menu-play-text');
      if (playText) {
        playText.textContent = `PLAY LEVEL ${this.state.progress.unlockedLevel}`;
      }
    }
  }

  public updateHUD() {
    // Level Badge
    const levelBadge = document.getElementById('hud-level-badge');
    if (levelBadge) {
      levelBadge.textContent = `LEVEL ${this.state.level.id}`;
    }

    // Pairs
    const connected = this.state.getConnectedPairsCount();
    const totalPairs = this.state.level.pairs.length;
    const pairsCounter = document.getElementById('hud-pairs-counter');
    if (pairsCounter) {
      pairsCounter.textContent = `${connected}/${totalPairs}`;
    }

    // Stars
    const starsCounter = document.getElementById('hud-stars-counter');
    if (starsCounter) {
      const stars = this.state.progress.stars[this.state.level.id] || 0;
      starsCounter.textContent = stars === 3 ? '★★★' : stars === 2 ? '★★☆' : stars === 1 ? '★☆☆' : '☆☆☆';
    }

    // Timer
    const timerCounter = document.getElementById('hud-timer-counter');
    if (timerCounter) {
      const mins = Math.floor(this.state.timeElapsed / 60);
      const secs = this.state.timeElapsed % 60;
      timerCounter.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Coverage Flow
    const coverage = this.state.getFlowCoveragePercentage();
    const covText = document.getElementById('hud-coverage-text');
    const covBar = document.getElementById('hud-coverage-bar');
    if (covText) covText.textContent = `${coverage}%`;
    if (covBar) covBar.style.width = `${coverage}%`;

    // Difficulty tag
    const diffTag = document.getElementById('hud-difficulty-tag');
    if (diffTag) {
      diffTag.textContent = `${this.state.level.size}x${this.state.level.size} ${this.state.level.difficulty}`;
    }

    // Status Pill
    const statusText = document.getElementById('hud-status-text');
    const statusPill = document.getElementById('hud-status-pill');
    if (statusText && statusPill) {
      if (this.state.isLevelWon) {
        statusText.textContent = 'SOLVED! 🎉';
        statusPill.className = 'px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center gap-1.5 shrink-0 animate-pulse';
      } else if (connected === totalPairs && coverage < 100) {
        statusText.textContent = 'FILL REMAINING CELLS';
        statusPill.className = 'px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1.5 shrink-0';
      } else {
        statusText.textContent = `FLOW: ${coverage}%`;
        statusPill.className = 'px-3 sm:px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5 shrink-0';
      }
    }
  }

  public renderLevelGrid(filter: string = 'ALL') {
    const container = document.getElementById('levels-grid-container');
    if (!container) return;

    container.innerHTML = '';
    const unlocked = this.state.progress.unlockedLevel;

    LEVELS.forEach((lvl: LevelData, idx: number) => {
      if (filter !== 'ALL' && lvl.difficulty !== filter) return;

      const isUnlocked = lvl.id <= unlocked;
      const stars = this.state.progress.stars[lvl.id] || 0;
      const isCurrent = this.state.currentLevelIndex === idx;

      const card = document.createElement('button');
      card.className = `btn-tactile p-3 rounded-2xl flex flex-col items-center justify-between border transition-all ${
        isUnlocked
          ? isCurrent
            ? 'bg-blue-600/30 border-blue-500 text-white shadow-md shadow-blue-500/20'
            : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750'
          : 'bg-slate-900/60 border-slate-800/80 text-slate-600 opacity-60 cursor-not-allowed'
      }`;

      card.innerHTML = `
        <div class="flex items-center justify-between w-full text-[10px] font-bold text-slate-400">
          <span>${lvl.size}x${lvl.size}</span>
          <span>${isUnlocked ? (stars > 0 ? '★'.repeat(stars) : '•') : '🔒'}</span>
        </div>
        <div class="font-black text-lg my-1 ${isUnlocked ? 'text-white' : 'text-slate-600'}">
          ${lvl.id}
        </div>
        <div class="text-[9px] font-semibold tracking-wide uppercase ${isUnlocked ? 'text-blue-400' : 'text-slate-600'}">
          ${lvl.difficulty}
        </div>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          audio.playTap();
          this.state.setLevel(idx);
          this.setScreen('PLAYING');
        });
      }

      container.appendChild(card);
    });
  }

  private openPauseModal() {
    this.state.pauseTimer();
    const modal = document.getElementById('modal-pause');
    const statusEl = document.getElementById('pause-sound-status');
    if (statusEl) statusEl.textContent = audio.isMuted ? 'OFF' : 'ON';
    modal?.classList.remove('hidden');
  }

  private closePauseModal() {
    document.getElementById('modal-pause')?.classList.add('hidden');
    this.state.resumeTimer();
  }

  private openHintModal() {
    this.state.pauseTimer();
    const modal = document.getElementById('modal-hint-ad');
    const claimBtn = document.getElementById('btn-ad-claim') as HTMLButtonElement | null;
    const countText = document.getElementById('ad-countdown-text');
    const progBar = document.getElementById('ad-progress-bar');

    if (!modal) return;
    modal.classList.remove('hidden');

    this.hintCountdown = 5;
    if (claimBtn) claimBtn.disabled = true;
    if (countText) countText.textContent = '5s remaining';
    if (progBar) progBar.style.width = '0%';

    if (this.hintInterval) clearInterval(this.hintInterval);

    this.hintInterval = window.setInterval(() => {
      this.hintCountdown--;
      const percent = Math.round(((5 - this.hintCountdown) / 5) * 100);

      if (progBar) progBar.style.width = `${percent}%`;
      if (countText) countText.textContent = this.hintCountdown > 0 ? `${this.hintCountdown}s remaining` : 'Hint Ready!';

      if (this.hintCountdown <= 0) {
        if (this.hintInterval) clearInterval(this.hintInterval);
        if (claimBtn) claimBtn.disabled = false;
        audio.playTap();
      }
    }, 1000);
  }

  private closeHintModal() {
    if (this.hintInterval) {
      clearInterval(this.hintInterval);
      this.hintInterval = null;
    }
    document.getElementById('modal-hint-ad')?.classList.add('hidden');
    this.state.resumeTimer();
  }

  public showVictoryModal(timeInSeconds: number, stars: number) {
    const modal = document.getElementById('modal-victory');
    const starsEl = document.getElementById('victory-stars');
    const timeEl = document.getElementById('victory-time-text');

    if (starsEl) {
      starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    }
    if (timeEl) {
      const mins = Math.floor(timeInSeconds / 60);
      const secs = timeInSeconds % 60;
      timeEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    modal?.classList.remove('hidden');
  }

  public closeVictoryModal() {
    document.getElementById('modal-victory')?.classList.add('hidden');
  }

  private updateSoundIcons(isMuted: boolean) {
    const iconPathMuted = 'M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2';
    const iconPathActive = 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z';

    const path = isMuted ? iconPathMuted : iconPathActive;
    
    const menuIcon = document.querySelector('#menu-icon-sound path');
    if (menuIcon) menuIcon.setAttribute('d', path);

    const hudIcon = document.querySelector('#hud-icon-sound path');
    if (hudIcon) hudIcon.setAttribute('d', path);
  }
}
