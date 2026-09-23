import './index.css';
import { GameManager } from './game';
import { PipeRenderer } from './renderer';
import { soundManager } from './audio';
import { LEVELS } from './levels';

// Suppress benign browser ResizeObserver notification loops
window.addEventListener('error', (e) => {
  if (
    typeof e.message === 'string' &&
    (e.message.includes('ResizeObserver loop completed with undelivered notifications') ||
      e.message.includes('ResizeObserver loop limit exceeded'))
  ) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

class App {
  private appEl: HTMLElement;
  private game: GameManager;
  private renderer!: PipeRenderer;
  private canvas!: HTMLCanvasElement;
  private canvasContainer!: HTMLElement;
  private resizeRafId: number | null = null;
  private lastWidth = 0;
  private lastHeight = 0;

  // DOM Elements
  private levelBadgeEl!: HTMLElement;
  private movesCounterEl!: HTMLElement;
  private parCounterEl!: HTMLElement;
  private bestCounterEl!: HTMLElement;
  private btnMainMenu!: HTMLButtonElement;
  private btnUndo!: HTMLButtonElement;
  private btnReset!: HTMLButtonElement;
  private btnSound!: HTMLButtonElement;
  private btnLevels!: HTMLButtonElement;
  private btnHint!: HTMLButtonElement;
  private btnHelp!: HTMLButtonElement;

  // Modals
  private modalContainer!: HTMLElement;

  // Rewarded Ad timer
  private adTimerInterval: number | null = null;

  constructor() {
    const el = document.getElementById('app');
    if (!el) throw new Error('#app root element not found');
    this.appEl = el;

    this.game = new GameManager();

    this.renderLayout();
    this.initCanvasAndRenderer();
    this.bindEvents();
    this.updateHUD();

    // Hook game callbacks
    this.game.onStateChange = () => {
      this.updateHUD();
      this.renderer.isCompleted = this.game.isCompleted;
    };

    this.game.onLevelComplete = (levelId, moves, isNewBest, stars) => {
      this.showVictoryModal(levelId, moves, isNewBest, stars);
    };

    // Start 60 FPS animation loop
    this.startLoop();
  }

  private renderLayout() {
    this.appEl.innerHTML = `
      <div id="game-card" class="lab-card w-full max-w-5xl mx-auto flex flex-col overflow-hidden relative border border-slate-200 shadow-2xl">
        
        <!-- TIER 1: TOP NAVIGATION -->
        <header class="header-glass w-full px-2.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 shrink-0 border-b border-white/10">
          
          <!-- Left: Main Menu & Brand -->
          <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button id="btn-main-menu" class="btn-tactile-dark px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-white/15 flex items-center gap-1.5 text-cyan-300 font-bold text-xs cursor-pointer shadow-sm" title="Main Menu">
              <svg class="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span class="text-[11px] sm:text-xs">MENU</span>
            </button>

            <!-- Pipe Flow Icon & Title -->
            <div class="flex items-center gap-1.5">
              <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-sm shadow-cyan-500/30 shrink-0">
                <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-1">
                  <h1 class="text-xs sm:text-base font-extrabold text-white tracking-tight leading-none">
                    Pipe Flow Plumber
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Level Badge & Quick Utilities -->
          <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <!-- LEVEL Pill -->
            <button id="btn-levels-badge" class="bg-slate-800/90 hover:bg-slate-700/90 border border-white/15 rounded-xl px-2 sm:px-2.5 py-1 text-center shrink-0 transition-all cursor-pointer" title="Select Level">
              <span class="block text-[7px] sm:text-[8px] font-bold text-cyan-400 uppercase tracking-wider">LEVEL</span>
              <span id="level-badge" class="font-black text-xs sm:text-sm text-white leading-none">1</span>
            </button>

            <!-- HINT Button -->
            <button id="btn-hint" class="btn-tactile-dark bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 sm:px-2.5 py-1.5 rounded-xl flex items-center gap-1 shrink-0 font-bold text-xs border border-amber-500/30 cursor-pointer" title="Get Hint">
              <svg class="w-3.5 h-3.5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M9 18h6"/>
                <path d="M10 22h4"/>
                <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
              </svg>
              <span class="text-[10px] hidden sm:inline">HINT</span>
            </button>

            <!-- SOUND Toggle Button -->
            <button id="btn-sound" class="btn-tactile-dark w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-white/15 flex items-center justify-center shrink-0 cursor-pointer" title="Sound (M)">
              <svg id="sound-icon-on" class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
              <svg id="sound-icon-off" class="w-3.5 h-3.5 text-rose-400 hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            </button>

            <!-- HELP / TUTORIAL Button -->
            <button id="btn-help" class="btn-tactile-dark w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-white/15 flex items-center justify-center shrink-0 cursor-pointer" title="Instructions">
              <svg class="w-3.5 h-3.5 text-sky-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </button>
          </div>
        </header>

        <!-- TIER 2: STATS & ACTION CONTROLS -->
        <div class="w-full bg-slate-900/95 border-b border-white/10 px-2.5 sm:px-5 py-1.5 flex items-center justify-between gap-1 text-xs shrink-0 select-none">
          <!-- Left: Counters (Moves, Target 3⭐, Best) -->
          <div class="flex items-center gap-1 sm:gap-2">
            <!-- MOVES Counter -->
            <div class="bg-slate-800/90 border border-white/10 rounded-lg px-2 py-0.5 text-center min-w-[48px] sm:min-w-[56px]">
              <span class="block text-[7px] sm:text-[8px] font-bold text-slate-400 uppercase tracking-wider">MOVES</span>
              <span id="moves-counter" class="font-extrabold text-xs sm:text-sm text-white leading-none">0</span>
            </div>

            <!-- PAR / TARGET 3-STARS Counter -->
            <div class="bg-slate-800/90 border border-amber-400/30 rounded-lg px-2 py-0.5 text-center min-w-[52px] sm:min-w-[62px]" title="Maximum moves for 3 stars">
              <span class="block text-[7px] sm:text-[8px] font-bold text-amber-400 uppercase tracking-wider">TARGET 3⭐</span>
              <span id="par-counter" class="font-extrabold text-xs sm:text-sm text-amber-300 leading-none">≤ 4</span>
            </div>

            <!-- BEST Counter -->
            <div class="bg-slate-800/90 border border-white/10 rounded-lg px-2 py-0.5 text-center min-w-[48px] sm:min-w-[56px] hidden xs:block">
              <span class="block text-[7px] sm:text-[8px] font-bold text-emerald-400 uppercase tracking-wider">BEST</span>
              <span id="best-counter" class="font-extrabold text-xs sm:text-sm text-emerald-300 leading-none">-</span>
            </div>
          </div>

          <!-- Right: Undo and Reset buttons -->
          <div class="flex items-center gap-1 sm:gap-1.5">
            <!-- UNDO Button -->
            <button id="btn-undo" class="btn-tactile-dark bg-slate-800/90 hover:bg-slate-700 text-white px-2 sm:px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 font-bold text-[11px] border border-white/15 disabled:opacity-40 disabled:pointer-events-none cursor-pointer" title="Undo Move (Z)">
              <svg class="w-3 h-3 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M3 7v6h6"/>
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
              </svg>
              <span>UNDO</span>
            </button>

            <!-- RESET Button -->
            <button id="btn-reset" class="btn-tactile-dark bg-slate-800/90 hover:bg-slate-700 text-amber-300 hover:text-amber-200 px-2 sm:px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 font-bold text-[11px] border border-amber-500/30 cursor-pointer" title="Reset Level (R)">
              <svg class="w-3 h-3 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
              <span>RESET 🎲</span>
            </button>
          </div>
        </div>

        <!-- SUBTITLE BANNER -->
        <div class="w-full bg-slate-100/90 border-b border-slate-200 px-3 py-1.5 text-center text-xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 select-none">
          <span class="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          <span>Rotate pipes by 90° • Connect <strong>START</strong> to <strong>DRAIN</strong></span>
        </div>

        <!-- MAIN CANVAS PLAYGROUND -->
        <div id="canvas-container" class="relative w-full h-[420px] sm:h-[480px] md:h-[520px] flex items-center justify-center board-grid-pattern overflow-hidden touch-none select-none">
          <canvas id="game-canvas" class="block rounded-2xl cursor-pointer"></canvas>
        </div>

        <!-- FOOTER: Level Quick Navigation -->
        <footer class="w-full bg-white px-3 sm:px-6 py-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div class="flex items-center gap-1.5 font-medium">
            <button id="btn-prev-level" class="btn-tactile px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold flex items-center gap-1 disabled:opacity-40 cursor-pointer">
              ◀ <span class="hidden sm:inline">Prev</span>
            </button>
            <span id="level-name-display" class="px-2 py-0.5 font-bold text-slate-800 bg-slate-100 rounded-md">
              Level 1
            </span>
            <button id="btn-next-level" class="btn-tactile px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold flex items-center gap-1 disabled:opacity-40 cursor-pointer">
              <span class="hidden sm:inline">Next</span> ▶
            </button>
            <button id="btn-quick-new" class="btn-tactile ml-1 px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 rounded-lg font-bold flex items-center gap-1 cursor-pointer text-xs" title="Generate new puzzle">
              🎲 <span>New Board</span>
            </button>
          </div>

          <div class="text-[11px] text-slate-400 font-mono tracking-tight hidden sm:block">
            Vanilla JS • Canvas 2.5D • HTML5
          </div>
        </footer>
      </div>

      <!-- MODALS CONTAINER -->
      <div id="modal-container" class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-sm hidden">
      </div>
    `;

    // Cache elements
    this.levelBadgeEl = document.getElementById('level-badge')!;
    this.movesCounterEl = document.getElementById('moves-counter')!;
    this.parCounterEl = document.getElementById('par-counter')!;
    this.bestCounterEl = document.getElementById('best-counter')!;
    this.btnMainMenu = document.getElementById('btn-main-menu') as HTMLButtonElement;
    this.btnUndo = document.getElementById('btn-undo') as HTMLButtonElement;
    this.btnReset = document.getElementById('btn-reset') as HTMLButtonElement;
    this.btnSound = document.getElementById('btn-sound') as HTMLButtonElement;
    this.btnLevels = document.getElementById('btn-levels-badge') as HTMLButtonElement;
    this.btnHint = document.getElementById('btn-hint') as HTMLButtonElement;
    this.btnHelp = document.getElementById('btn-help') as HTMLButtonElement;
    this.canvasContainer = document.getElementById('canvas-container')!;
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.modalContainer = document.getElementById('modal-container')!;
  }

  private initCanvasAndRenderer() {
    this.renderer = new PipeRenderer(this.canvas);
    this.handleResize();

    const gameCard = document.getElementById('game-card') || this.canvasContainer;
    const ro = new ResizeObserver(() => {
      if (this.resizeRafId !== null) {
        cancelAnimationFrame(this.resizeRafId);
      }
      this.resizeRafId = requestAnimationFrame(() => {
        this.resizeRafId = null;
        this.handleResize();
      });
    });
    ro.observe(gameCard);
    window.addEventListener('resize', () => {
      if (this.resizeRafId !== null) cancelAnimationFrame(this.resizeRafId);
      this.resizeRafId = requestAnimationFrame(() => {
        this.resizeRafId = null;
        this.handleResize();
      });
    });
  }

  private handleResize() {
    const width = this.canvasContainer.clientWidth;
    const height = this.canvasContainer.clientHeight;
    if (width <= 0 || height <= 0) return;

    if (Math.abs(width - this.lastWidth) < 2 && Math.abs(height - this.lastHeight) < 2) {
      return;
    }

    this.lastWidth = width;
    this.lastHeight = height;
    const config = this.game.currentLevelConfig;
    this.renderer.resize(width, height, config.rows, config.cols);
  }

  private bindEvents() {
    // Header actions
    this.btnMainMenu.addEventListener('click', () => {
      soundManager.playClick();
      this.showMainMenuModal();
    });
    this.btnUndo.addEventListener('click', () => this.game.undo());
    this.btnReset.addEventListener('click', () => {
      soundManager.playClick();
      this.game.resetLevel(true);
      this.handleResize();
    });
    this.btnSound.addEventListener('click', () => {
      soundManager.playClick();
      const enabled = soundManager.toggleMute();
      this.updateSoundIcon(enabled);
    });
    this.btnLevels.addEventListener('click', () => {
      soundManager.playClick();
      this.showLevelsModal();
    });
    this.btnHelp.addEventListener('click', () => {
      soundManager.playClick();
      this.showHowToPlayModal();
    });
    this.btnHint.addEventListener('click', () => {
      soundManager.playClick();
      this.showRewardedAdModal();
    });

    // Level Quick Prev/Next & Quick New buttons
    const btnPrev = document.getElementById('btn-prev-level');
    const btnNext = document.getElementById('btn-next-level');
    const btnQuickNew = document.getElementById('btn-quick-new');

    btnQuickNew?.addEventListener('click', () => {
      soundManager.playClick();
      this.game.resetLevel(true);
      this.handleResize();
    });

    btnPrev?.addEventListener('click', () => {
      if (this.game.currentLevelId > 1) {
        soundManager.playClick();
        this.game.loadLevel(this.game.currentLevelId - 1, true);
        this.handleResize();
      }
    });

    btnNext?.addEventListener('click', () => {
      if (this.game.currentLevelId < this.game.unlockedLevels) {
        soundManager.playClick();
        this.game.loadLevel(this.game.currentLevelId + 1, true);
        this.handleResize();
      }
    });

    // Pointer clicks & touch on Canvas
    const handlePointer = (clientX: number, clientY: number) => {
      const rect = this.canvas.getBoundingClientRect();
      const canvasX = clientX - rect.left;
      const canvasY = clientY - rect.top;

      const tile = this.renderer.getTileAt(canvasX, canvasY);
      if (tile) {
        this.game.rotateTile(tile.row, tile.col);
      }
    };

    this.canvas.addEventListener('click', (e) => {
      handlePointer(e.clientX, e.clientY);
    });

    // Pointer hover for desktop
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const canvasX = e.clientX - rect.left;
      const canvasY = e.clientY - rect.top;
      this.renderer.hoveredTile = this.renderer.getTileAt(canvasX, canvasY);
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.renderer.hoveredTile = null;
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      if (e.key === 'z' || e.key === 'Z' || e.key === 'u' || e.key === 'U') {
        this.game.undo();
      } else if (e.key === 'r' || e.key === 'R') {
        this.game.resetLevel(true);
        this.handleResize();
      } else if (e.key === 'm' || e.key === 'M') {
        const enabled = soundManager.toggleMute();
        this.updateSoundIcon(enabled);
      } else if (e.key === 'h' || e.key === 'H') {
        this.showRewardedAdModal();
      } else if (e.key === 'Escape') {
        this.closeModal();
      }
    });
  }

  private updateHUD() {
    this.levelBadgeEl.textContent = String(this.game.currentLevelId);
    this.movesCounterEl.textContent = String(this.game.moves);

    const par = this.game.currentLevelConfig.parMoves;
    if (this.parCounterEl) {
      this.parCounterEl.textContent = `≤ ${par + 1}`;
    }

    const best = this.game.bestMoves[this.game.currentLevelId];
    this.bestCounterEl.textContent = best !== undefined ? String(best) : '-';

    this.btnUndo.disabled = this.game.undoStack.length === 0 || this.game.isCompleted;

    const levelNameEl = document.getElementById('level-name-display');
    if (levelNameEl) {
      levelNameEl.textContent = `${this.game.currentLevelConfig.name} (${this.game.currentLevelId}/${LEVELS.length})`;
    }

    const btnPrev = document.getElementById('btn-prev-level') as HTMLButtonElement | null;
    const btnNext = document.getElementById('btn-next-level') as HTMLButtonElement | null;
    if (btnPrev) btnPrev.disabled = this.game.currentLevelId <= 1;
    if (btnNext) btnNext.disabled = this.game.currentLevelId >= this.game.unlockedLevels;
  }

  private updateSoundIcon(enabled: boolean) {
    const onIcon = document.getElementById('sound-icon-on');
    const offIcon = document.getElementById('sound-icon-off');
    if (onIcon && offIcon) {
      if (enabled) {
        onIcon.classList.remove('hidden');
        offIcon.classList.add('hidden');
      } else {
        onIcon.classList.add('hidden');
        offIcon.classList.remove('hidden');
      }
    }
  }

  private startLoop() {
    const renderLoop = (time: number) => {
      this.renderer.render(this.game.grid, time);
      requestAnimationFrame(renderLoop);
    };
    requestAnimationFrame(renderLoop);
  }

  // --- MODALS ---

  private closeModal() {
    if (this.adTimerInterval) {
      clearInterval(this.adTimerInterval);
      this.adTimerInterval = null;
    }
    this.modalContainer.classList.add('hidden');
    this.modalContainer.innerHTML = '';
  }

  // 1. Main Menu
  private showMainMenuModal() {
    const unlocked = this.game.unlockedLevels;
    const totalStars = this.game.getTotalStars();
    const maxStars = LEVELS.length * 3;
    const isMuted = soundManager.muted;

    this.modalContainer.innerHTML = `
      <div class="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-white/15 animate-in zoom-in-95 duration-200 flex flex-col relative overflow-hidden">
        <!-- Close button top right -->
        <button id="menu-close-btn" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer border border-white/10 transition-colors">
          ✕
        </button>

        <!-- Brand Icon / Header -->
        <div class="flex flex-col items-center text-center mt-2 mb-5">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 mb-3 border border-cyan-400/30">
            <svg class="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <h2 class="text-2xl font-black text-white tracking-tight leading-none">
            PIPE FLOW PLUMBER
          </h2>
          <span class="text-xs font-semibold text-cyan-400 mt-1 uppercase tracking-wider">
            Hydraulic Engineering Puzzle
          </span>
        </div>

        <!-- Player Progress Cards -->
        <div class="grid grid-cols-2 gap-2.5 mb-5">
          <div class="bg-slate-800/80 border border-white/10 rounded-2xl p-3 text-center">
            <span class="block text-[10px] font-bold text-amber-400 uppercase tracking-wider">Stars</span>
            <div class="flex items-center justify-center gap-1 mt-0.5">
              <span class="text-base">⭐</span>
              <span class="text-lg font-black text-amber-300">${totalStars}</span>
              <span class="text-xs text-slate-400">/ ${maxStars}</span>
            </div>
          </div>
          <div class="bg-slate-800/80 border border-white/10 rounded-2xl p-3 text-center">
            <span class="block text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Unlocked Levels</span>
            <div class="flex items-center justify-center gap-1 mt-0.5">
              <span class="text-lg font-black text-white">${unlocked}</span>
              <span class="text-xs text-slate-400">/ ${LEVELS.length}</span>
            </div>
          </div>
        </div>

        <!-- Main Actions -->
        <div class="flex flex-col gap-2.5">
          <button id="menu-btn-play" class="btn-tactile w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/25 cursor-pointer flex items-center justify-center gap-2">
            <span>▶ CONTINUE LEVEL ${this.game.currentLevelId}</span>
          </button>

          <button id="menu-btn-levels" class="btn-tactile-dark w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-white/15 cursor-pointer flex items-center justify-center gap-2">
            <span>🗺️ SELECT LEVEL</span>
          </button>

          <button id="menu-btn-procedural" class="btn-tactile-dark w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/30 cursor-pointer flex items-center justify-center gap-2">
            <span>🎲 NEW PUZZLE</span>
          </button>

          <div class="grid grid-cols-2 gap-2 mt-1">
            <button id="menu-btn-help" class="btn-tactile-dark py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-white/10 cursor-pointer flex items-center justify-center gap-1.5">
              <span>❓ How to Play</span>
            </button>
            <button id="menu-btn-sound" class="btn-tactile-dark py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-white/10 cursor-pointer flex items-center justify-center gap-1.5">
              <span>${isMuted ? '🔇 Sound: Off' : '🔊 Sound: On'}</span>
            </button>
          </div>
        </div>

        <!-- Footer watermark -->
        <div class="mt-5 text-center text-[10px] text-slate-500 font-mono">
          Vanilla JS • HTML5 Canvas 2.5D • 60 FPS
        </div>
      </div>
    `;

    this.modalContainer.classList.remove('hidden');

    document.getElementById('menu-close-btn')?.addEventListener('click', () => this.closeModal());

    document.getElementById('menu-btn-play')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('menu-btn-levels')?.addEventListener('click', () => {
      this.closeModal();
      this.showLevelsModal();
    });

    document.getElementById('menu-btn-procedural')?.addEventListener('click', () => {
      soundManager.playClick();
      this.closeModal();
      this.game.resetLevel(true);
      this.handleResize();
    });

    document.getElementById('menu-btn-help')?.addEventListener('click', () => {
      this.closeModal();
      this.showHowToPlayModal();
    });

    document.getElementById('menu-btn-sound')?.addEventListener('click', () => {
      soundManager.playClick();
      const enabled = soundManager.toggleMute();
      this.updateSoundIcon(enabled);
      const btnSound = document.getElementById('menu-btn-sound');
      if (btnSound) {
        btnSound.textContent = enabled ? '🔊 Sound: On' : '🔇 Sound: Off';
      }
    });
  }

  // 2. Level Select Modal
  private showLevelsModal() {
    const unlocked = this.game.unlockedLevels;
    const current = this.game.currentLevelId;
    const totalStars = this.game.getTotalStars();
    const maxStars = LEVELS.length * 3;

    let gridHtml = '';
    LEVELS.forEach((level) => {
      const isLocked = level.id > unlocked;
      const isCurrent = level.id === current;
      const best = this.game.bestMoves[level.id];
      const stars = this.game.levelStars[level.id] || 0;

      // Stars display
      const starsDisplay = isLocked
        ? ''
        : stars === 3
        ? '⭐⭐⭐'
        : stars === 2
        ? '⭐⭐<span class="opacity-30">⭐</span>'
        : stars === 1
        ? '⭐<span class="opacity-30">⭐⭐</span>'
        : '<span class="opacity-30">⭐⭐⭐</span>';

      gridHtml += `
        <button 
          data-level="${level.id}"
          class="level-card-btn relative p-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
            isCurrent
              ? 'bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-cyan-400 ring-offset-2'
              : isLocked
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
              : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm cursor-pointer hover:border-blue-300'
          }"
          ${isLocked ? 'disabled' : ''}
        >
          <span class="text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-blue-100' : 'text-slate-400'}">
            Level
          </span>
          <span class="text-xl sm:text-2xl font-black leading-tight">
            ${isLocked ? '🔒' : level.id}
          </span>
          ${
            !isLocked
              ? `<span class="text-[10px] mt-0.5 tracking-tighter">${starsDisplay}</span>`
              : ''
          }
          <span class="text-[9px] mt-0.5 font-semibold ${isCurrent ? 'text-blue-100' : 'text-slate-500'}">
            ${isLocked ? 'Locked' : best !== undefined ? `Best: ${best}` : 'Available'}
          </span>
        </button>
      `;
    });

    this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in duration-200 flex flex-col max-h-[90vh]">
        <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h2 class="text-xl font-extrabold text-slate-900 leading-none">Select Level</h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-slate-500">${unlocked} of ${LEVELS.length} unlocked</span>
              <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                ⭐ ${totalStars} / ${maxStars}
              </span>
            </div>
          </div>
          <button id="modal-close-btn" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer">
            ✕
          </button>
        </div>

        <div class="grid grid-cols-4 sm:grid-cols-5 gap-2.5 overflow-y-auto py-2 pr-1">
          ${gridHtml}
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
          <button id="modal-menu-btn" class="btn-tactile px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
            Main Menu
          </button>
          <button id="modal-cancel-btn" class="btn-tactile px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer">
            Back to Game
          </button>
        </div>
      </div>
    `;

    this.modalContainer.classList.remove('hidden');

    document.getElementById('modal-close-btn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-cancel-btn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('modal-menu-btn')?.addEventListener('click', () => {
      this.closeModal();
      this.showMainMenuModal();
    });

    this.modalContainer.querySelectorAll('.level-card-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lvl = parseInt(btn.getAttribute('data-level') || '1', 10);
        soundManager.playClick();
        this.game.loadLevel(lvl, true);
        this.handleResize();
        this.closeModal();
      });
    });
  }

  // 3. Rewarded Ad Modal for Hints
  private showRewardedAdModal() {
    let timeLeft = 5;
    const totalTime = 5;

    this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200">
        <div class="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-500 flex items-center justify-center text-3xl mb-3 shadow-inner">
          💡
        </div>

        <h3 class="text-lg font-extrabold text-slate-900">Unlock Hint</h3>
        <p class="text-xs text-slate-500 mt-1 mb-4">
          Wait 5 seconds to align a pipe connection for you!
        </p>

        <!-- Progress bar -->
        <div class="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden border border-slate-200">
          <div id="ad-progress-bar" class="bg-gradient-to-r from-amber-400 to-amber-500 h-full w-0 transition-all duration-300"></div>
        </div>
        <span id="ad-timer-label" class="text-xs font-bold text-slate-400 block mb-5">
          Loading hint: 5s remaining...
        </span>

        <div class="flex items-center justify-center gap-2">
          <button id="btn-skip-ad" class="btn-tactile px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer">
            Cancel
          </button>
          <button id="btn-claim-hint" class="btn-tactile px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/30 disabled:opacity-40 disabled:pointer-events-none cursor-pointer" disabled>
            Use Hint! 💡
          </button>
        </div>
      </div>
    `;

    this.modalContainer.classList.remove('hidden');

    const progressBar = document.getElementById('ad-progress-bar')!;
    const timerLabel = document.getElementById('ad-timer-label')!;
    const btnClaim = document.getElementById('btn-claim-hint') as HTMLButtonElement;
    const btnSkip = document.getElementById('btn-skip-ad')!;

    btnSkip.addEventListener('click', () => this.closeModal());

    this.adTimerInterval = window.setInterval(() => {
      timeLeft--;
      const percent = Math.min(100, Math.floor(((totalTime - timeLeft) / totalTime) * 100));
      progressBar.style.width = `${percent}%`;

      if (timeLeft > 0) {
        timerLabel.textContent = `Loading hint: ${timeLeft}s remaining...`;
      } else {
        clearInterval(this.adTimerInterval!);
        this.adTimerInterval = null;
        timerLabel.textContent = 'Hint unlocked!';
        timerLabel.classList.add('text-emerald-500');
        btnClaim.disabled = false;
      }
    }, 1000);

    btnClaim.addEventListener('click', () => {
      this.closeModal();
      this.game.applyHint();
    });
  }

  // 4. How to Play Illustrated Tutorial
  private showHowToPlayModal() {
    this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-in fade-in duration-200">
        <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h2 class="text-xl font-extrabold text-slate-900 leading-none">How to Play</h2>
          <button id="help-close-btn" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm cursor-pointer">
            ✕
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <!-- Card 1 -->
          <div class="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center text-center">
            <div class="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center text-lg font-bold mb-2 shadow-sm">
              ⟳
            </div>
            <h4 class="text-xs font-bold text-blue-900 uppercase">1. Rotate Pipes</h4>
            <p class="text-[11px] text-blue-700/80 mt-1 leading-relaxed">
              Click or tap any pipe to rotate it 90° clockwise.
            </p>
          </div>

          <!-- Card 2 -->
          <div class="p-3.5 rounded-2xl bg-cyan-50 border border-cyan-100 flex flex-col items-center text-center">
            <div class="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center text-lg font-bold mb-2 shadow-sm">
              💧
            </div>
            <h4 class="text-xs font-bold text-cyan-900 uppercase">2. Fluid Flow</h4>
            <p class="text-[11px] text-cyan-700/80 mt-1 leading-relaxed">
              Water continuously flows from the blue <strong>START</strong> valve through connected pipes.
            </p>
          </div>

          <!-- Card 3 -->
          <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center text-center">
            <div class="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg font-bold mb-2 shadow-sm">
              🎯
            </div>
            <h4 class="text-xs font-bold text-emerald-900 uppercase">3. Reach Drain</h4>
            <p class="text-[11px] text-emerald-700/80 mt-1 leading-relaxed">
              Connect the pipeline to the green <strong>DRAIN</strong> valve to win!
            </p>
          </div>
        </div>

        <!-- Rating criteria notice -->
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 mb-5">
          <span class="font-bold block mb-1">⭐ Star Rating System:</span>
          • <strong>3 Stars:</strong> Complete within target moves (Par + 1 move)<br>
          • <strong>2 Stars:</strong> Complete within Par + 4 moves<br>
          • <strong>1 Star:</strong> Complete the pipeline
        </div>

        <button id="help-got-it-btn" class="btn-tactile w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 cursor-pointer">
          Got it, let's play!
        </button>
      </div>
    `;

    this.modalContainer.classList.remove('hidden');

    document.getElementById('help-close-btn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('help-got-it-btn')?.addEventListener('click', () => this.closeModal());
  }

  // 5. Level Victory Modal
  private showVictoryModal(levelId: number, moves: number, isNewBest: boolean, stars: number = 3) {
    const hasNext = levelId < LEVELS.length;
    const par = this.game.currentLevelConfig.parMoves;
    const threeStarTarget = par + 1;

    // Star icons display
    const starIcons = [
      stars >= 1 ? '⭐' : '<span class="opacity-25 grayscale">⭐</span>',
      stars >= 2 ? '⭐' : '<span class="opacity-25 grayscale">⭐</span>',
      stars >= 3 ? '⭐' : '<span class="opacity-25 grayscale">⭐</span>',
    ];

    const starMessage =
      stars === 3
        ? 'Perfect! Maximum efficiency achieved.'
        : stars === 2
        ? 'Great job! Close to optimal moves.'
        : 'Pipeline connected! Try fewer rotations for 3 ⭐.';

    this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-300">
        <div class="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center text-3xl mb-3 shadow-lg shadow-emerald-500/30">
          🌊
        </div>

        <h3 class="text-2xl font-black text-slate-900">Pipeline Connected!</h3>
        <p class="text-xs font-semibold text-slate-500 mt-0.5">
          Level ${levelId} Cleared Successfully
        </p>

        <!-- Dynamic Star Rating -->
        <div class="flex items-center justify-center gap-2 my-3.5">
          <span class="text-3xl ${stars >= 1 ? 'animate-bounce' : ''}">${starIcons[0]}</span>
          <span class="text-4xl ${stars >= 2 ? 'animate-bounce' : ''}" style="animation-delay: 0.1s">${starIcons[1]}</span>
          <span class="text-3xl ${stars >= 3 ? 'animate-bounce' : ''}" style="animation-delay: 0.2s">${starIcons[2]}</span>
        </div>

        <p class="text-xs font-medium text-slate-600 mb-4">
          ${starMessage}
        </p>

        <!-- Stats Breakdown -->
        <div class="bg-slate-50 rounded-2xl p-3 border border-slate-100 mb-5 flex items-center justify-around">
          <div>
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Your Moves</span>
            <span class="text-lg font-black text-slate-800">${moves}</span>
          </div>
          <div class="w-px h-8 bg-slate-200"></div>
          <div>
            <span class="block text-[10px] font-bold text-amber-500 uppercase">Target 3⭐</span>
            <span class="text-lg font-black text-amber-600">≤ ${threeStarTarget}</span>
          </div>
          <div class="w-px h-8 bg-slate-200"></div>
          <div>
            <span class="block text-[10px] font-bold text-slate-400 uppercase">Best Record</span>
            <span class="text-lg font-black text-emerald-600">
              ${this.game.bestMoves[levelId] || moves}
              ${isNewBest ? '<span class="text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded-full ml-0.5 font-bold">NEW!</span>' : ''}
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          ${
            hasNext
              ? `<button id="btn-victory-next" class="btn-tactile w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 cursor-pointer">
                  Next Level ▶
                </button>`
              : `<button id="btn-victory-levels" class="btn-tactile w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 cursor-pointer">
                  All Levels Cleared! 🎉
                </button>`
          }
          <button id="btn-victory-replay" class="btn-tactile w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
            Play Again 🎲
          </button>
          <button id="btn-victory-main-menu" class="btn-tactile w-full py-2 rounded-2xl bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-800 font-semibold text-xs cursor-pointer">
            Main Menu
          </button>
        </div>
      </div>
    `;

    this.modalContainer.classList.remove('hidden');

    document.getElementById('btn-victory-next')?.addEventListener('click', () => {
      this.closeModal();
      this.game.nextLevel();
      this.handleResize();
    });

    document.getElementById('btn-victory-replay')?.addEventListener('click', () => {
      this.closeModal();
      this.game.resetLevel(true);
      this.handleResize();
    });

    document.getElementById('btn-victory-levels')?.addEventListener('click', () => {
      this.closeModal();
      this.showLevelsModal();
    });

    document.getElementById('btn-victory-main-menu')?.addEventListener('click', () => {
      this.closeModal();
      this.showMainMenuModal();
    });
  }
}

// Start application when DOM is ready or immediately if already loaded
function startApp() {
  try {
    new App();
  } catch (err) {
    console.error('Error starting game:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
