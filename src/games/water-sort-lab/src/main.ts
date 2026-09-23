import './index.css';
import { GameState } from './game-state';
import { CanvasRenderer } from './canvas-renderer';
import { sound } from './audio';
import { PRESET_LEVELS } from './levels';

class WaterSortApp {
  private state: GameState;
  private renderer!: CanvasRenderer;
  private appContainer: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private currentView: 'menu' | 'game' = 'menu';

  // In-Game UI DOM elements
  private movesEl!: HTMLElement;
  private levelBadgeEl!: HTMLElement;
  private topMessageEl!: HTMLElement;
  private bottomMessageEl!: HTMLElement;
  private timeEl!: HTMLElement;
  private bestMovesEl!: HTMLElement;
  private undoBtn!: HTMLButtonElement;
  private resetBtn!: HTMLButtonElement;
  private soundBtn!: HTMLButtonElement;
  private addTubeBtn!: HTMLButtonElement;
  private modalContainer!: HTMLElement;

  constructor() {
    this.appContainer = document.getElementById('app')!;
    this.state = new GameState();
    
    this.renderCurrentView();

    this.state.setOnChange(() => {
      if (this.currentView === 'game') {
        this.updateInGameUI();
      }
    });
  }

  private renderCurrentView() {
    if (this.currentView === 'menu') {
      this.renderMainMenu();
    } else {
      this.renderGameView();
    }
  }

  // ==========================================
  // MAIN MENU VIEW
  // ==========================================
  private renderMainMenu() {
    const save = this.state.loadSave();
    const currentLvlNum = this.state.currentLevelIndex + 1;
    const isSoundOn = sound.isEnabled();

    this.appContainer.innerHTML = `
      <div class="lab-card w-full max-w-md mx-auto p-6 sm:p-8 flex flex-col items-center text-center relative border border-slate-200 overflow-hidden shadow-2xl">
        <!-- Floating bubbles background effect -->
        <div class="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
          <div class="absolute w-24 h-24 rounded-full bg-cyan-200/50 -top-8 -left-8 blur-xl"></div>
          <div class="absolute w-32 h-32 rounded-full bg-purple-200/50 -bottom-10 -right-10 blur-xl"></div>
          <div class="absolute w-16 h-16 rounded-full bg-amber-200/40 top-1/2 -left-6 blur-lg"></div>
        </div>

        <!-- Animated Chemical Flask Mascot -->
        <div class="relative w-28 h-28 sm:w-32 sm:h-32 mb-4 flex items-center justify-center">
          <div class="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 opacity-90 shadow-xl shadow-blue-500/25 animate-soft-pulse"></div>
          <svg class="w-16 h-16 sm:w-20 sm:h-20 text-white relative z-10 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 2v7.31L4.14 20.3A2 2 0 0 0 6 23h12a2 2 0 0 0 1.86-2.7L14 9.31V2" />
            <path d="M8.5 2h7" />
            <path d="M14 9.3a6.5 6.5 0 0 0-4 0" />
            <circle cx="9" cy="17" r="1.5" fill="currentColor" opacity="0.8"/>
            <circle cx="14" cy="18" r="1" fill="currentColor" opacity="0.8"/>
            <circle cx="12" cy="14" r="1.8" fill="currentColor" opacity="0.9"/>
          </svg>
        </div>

        <!-- Game Title & Subtitle in English -->
        <h1 class="font-outfit font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mb-1">
          Water Sort Lab
        </h1>
        <p class="text-sm font-medium text-slate-500 mb-6">
          Liquid Sorting Puzzle
        </p>

        <!-- Player Progress Pill -->
        <div class="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-3 mb-6 flex items-center justify-around text-xs text-slate-600">
          <div>
            <span class="block text-[10px] font-bold uppercase text-slate-400">Current</span>
            <span class="font-outfit font-extrabold text-base text-slate-800">Level ${currentLvlNum}</span>
          </div>
          <div class="w-px h-6 bg-slate-200"></div>
          <div>
            <span class="block text-[10px] font-bold uppercase text-slate-400">Unlocked</span>
            <span class="font-outfit font-extrabold text-base text-blue-600">${save.unlockedLevels} / ${PRESET_LEVELS.length}</span>
          </div>
        </div>

        <!-- Menu Action Buttons -->
        <div class="w-full flex flex-col gap-3">
          <!-- Play / Resume Button -->
          <button id="menu-btn-play" class="btn-tactile w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold text-base shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <span>${this.state.moves > 0 ? 'RESUME GAME' : `PLAY LEVEL ${currentLvlNum}`}</span>
          </button>

          <!-- Level Select Button -->
          <button id="menu-btn-levels" class="btn-tactile w-full py-3 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs">
            <svg class="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>SELECT LEVEL</span>
          </button>

          <!-- How to Play Button -->
          <button id="menu-btn-tutorial" class="btn-tactile w-full py-3 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs">
            <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>HOW TO PLAY</span>
          </button>

          <!-- Sound Toggle Button -->
          <button id="menu-btn-sound" class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span>Sound: <strong class="${isSoundOn ? 'text-blue-600' : 'text-slate-400'}">${isSoundOn ? 'ON' : 'MUTED'}</strong></span>
          </button>
        </div>
      </div>

      <!-- Shared Modal Container -->
      <div id="modal-container" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"></div>
    `;

    this.modalContainer = document.getElementById('modal-container')!;

    // Attach menu events
    document.getElementById('menu-btn-play')!.addEventListener('click', () => {
      sound.playGlassTap(1);
      this.currentView = 'game';
      this.renderGameView();
    });

    document.getElementById('menu-btn-levels')!.addEventListener('click', () => {
      sound.playGlassTap(0);
      this.showLevelSelector();
    });

    document.getElementById('menu-btn-tutorial')!.addEventListener('click', () => {
      sound.playGlassTap(0);
      this.showHowToPlayModal();
    });

    const soundBtn = document.getElementById('menu-btn-sound')!;
    soundBtn.addEventListener('click', () => {
      sound.toggle();
      this.renderMainMenu();
    });
  }

  // ==========================================
  // IN-GAME VIEW
  // ==========================================
  private renderGameView() {
    this.appContainer.innerHTML = `
      <div id="game-card" class="lab-card w-full max-w-4xl mx-auto flex flex-col overflow-hidden relative border border-slate-200">
        
        <!-- Header Bar: Designed strictly to prevent overflow and never hide the sound button on mobile! -->
        <header class="w-full bg-white/95 px-2.5 sm:px-6 py-2.5 sm:py-3.5 border-b border-slate-100 flex items-center justify-between gap-1.5 sm:gap-3 shadow-xs">
          
          <!-- Left Controls: Menu button, App Title (hidden on tiny screens), Level Badge -->
          <div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <!-- Back to Menu Button -->
            <button id="btn-back-menu" class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0" title="Main Menu">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </button>

            <!-- Flask Mascot Icon -->
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 hidden xs:flex items-center justify-center text-white shadow-xs shrink-0">
              <svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 2v7.31L4.14 20.3A2 2 0 0 0 6 23h12a2 2 0 0 0 1.86-2.7L14 9.31V2" />
                <path d="M8.5 2h7" />
              </svg>
            </div>

            <!-- Level Selector Pill -->
            <button id="btn-level-badge" class="lab-pill-blue px-2 sm:px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-blue-100 transition-colors cursor-pointer shrink-0" title="Select level">
              LEVEL ${this.state.levelConfig.id}
            </button>
          </div>

          <!-- Right Controls: Moves, Undo, Reset, Sound (ALL shrink-0 to prevent hidden sound button) -->
          <div class="flex items-center gap-1 sm:gap-2.5 shrink-0">
            <!-- Moves counter box -->
            <div class="bg-slate-50 border border-slate-200/80 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 text-center min-w-[50px] sm:min-w-[76px] shadow-xs shrink-0">
              <span class="block text-[8px] sm:text-[10px] uppercase font-bold text-slate-500 tracking-wider">MOVES</span>
              <span id="moves-counter" class="font-outfit font-extrabold text-sm sm:text-lg text-slate-900 leading-none">0</span>
            </div>

            <!-- UNDO Button -->
            <button id="btn-undo" class="btn-tactile btn-undo px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1 font-bold text-xs sm:text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0" title="Undo Move">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
              </svg>
              <span class="hidden sm:inline">UNDO</span>
            </button>

            <!-- RESET Button -->
            <button id="btn-reset" class="btn-tactile btn-reset px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-1 font-bold text-xs sm:text-sm cursor-pointer shrink-0" title="Restart Level">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
              <span class="hidden sm:inline">RESET</span>
            </button>

            <!-- Sound Toggle Button: Always visible on mobile! -->
            <button id="btn-sound" class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0" title="Toggle Sound">
              <svg id="sound-icon" class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            </button>
          </div>
        </header>

        <!-- Top Guide Pill -->
        <div class="w-full flex justify-center px-3 pt-3 pb-1">
          <div id="top-message-pill" class="lab-pill px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-700 max-w-xl text-center shadow-xs transition-all">
            Pour liquids to sort each tube by color • Level ${this.state.levelConfig.id}
          </div>
        </div>

        <!-- HTML5 Canvas Lab Stage Area -->
        <main class="w-full relative flex items-center justify-center px-2 sm:px-4 py-1 min-h-[350px] sm:min-h-[440px]">
          <canvas id="game-canvas" class="block w-full touch-none select-none cursor-pointer"></canvas>
        </main>

        <!-- Bottom Guide Pill -->
        <div class="w-full flex justify-center px-3 py-1.5">
          <div id="bottom-message-pill" class="lab-pill px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-slate-700 max-w-lg text-center shadow-xs transition-all">
            Tap a test tube to select the top liquid layer
          </div>
        </div>

        <!-- Footer Stats & Actions Bar -->
        <footer class="w-full bg-slate-50/90 px-3 sm:px-6 py-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-600">
          <div class="flex items-center gap-3 sm:gap-6 font-medium">
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Time: <strong id="time-display" class="text-slate-800 font-semibold font-mono">00:00</strong></span>
            </div>

            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Best: <strong id="best-moves-display" class="text-slate-800 font-semibold">-</strong></span>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-1.5 sm:gap-2">
            <!-- Hint Button (Opens Rewarded Ad) -->
            <button id="btn-hint" class="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-bold hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer" title="Watch short ad to get a hint">
              <span>💡 Hint (Ad)</span>
            </button>

            <!-- Extra Tube Button -->
            <button id="btn-add-tube" class="btn-tactile btn-add-tube px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer" title="Add an extra reservoir tube">
              <span>+1 Tube</span>
            </button>

            <!-- Levels Button -->
            <button id="btn-levels-modal" class="px-2.5 py-1 rounded-lg bg-slate-200/80 text-slate-700 font-semibold hover:bg-slate-300 transition-colors flex items-center gap-1 cursor-pointer">
              <span>Levels</span>
            </button>

            <!-- How to Play Button -->
            <button id="btn-how-to-play" class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-200/80 text-slate-700 font-bold hover:bg-slate-300 transition-colors flex items-center justify-center cursor-pointer" title="How to Play Tutorial">
              <span>?</span>
            </button>
          </div>
        </footer>

      </div>

      <!-- Shared Modal Container -->
      <div id="modal-container" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"></div>
    `;

    // Cache elements
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.movesEl = document.getElementById('moves-counter')!;
    this.levelBadgeEl = document.getElementById('btn-level-badge')!;
    this.topMessageEl = document.getElementById('top-message-pill')!;
    this.bottomMessageEl = document.getElementById('bottom-message-pill')!;
    this.timeEl = document.getElementById('time-display')!;
    this.bestMovesEl = document.getElementById('best-moves-display')!;
    this.undoBtn = document.getElementById('btn-undo') as HTMLButtonElement;
    this.resetBtn = document.getElementById('btn-reset') as HTMLButtonElement;
    this.soundBtn = document.getElementById('btn-sound') as HTMLButtonElement;
    this.addTubeBtn = document.getElementById('btn-add-tube') as HTMLButtonElement;
    this.modalContainer = document.getElementById('modal-container')!;

    this.initCanvas();
    this.attachInGameEvents();
    this.updateInGameUI();
  }

  private initCanvas() {
    this.renderer = new CanvasRenderer(this.canvas, this.state);
    this.renderer.resize();

    const ro = new ResizeObserver(() => {
      this.renderer.resize();
    });
    ro.observe(this.canvas.parentElement || document.body);

    window.addEventListener('resize', () => {
      this.renderer.resize();
    });
  }

  private attachInGameEvents() {
    // Touch & Click handling for Canvas
    const handlePointerAction = (clientX: number, clientY: number) => {
      if (this.state.isAnimating || this.state.isWon) return;

      const rect = this.canvas.getBoundingClientRect();
      const canvasX = clientX - rect.left;
      const canvasY = clientY - rect.top;

      const tubeIndex = this.renderer.getTubeAt(canvasX, canvasY);

      if (tubeIndex === null) {
        if (this.state.selectedTubeIndex !== null) {
          this.state.selectedTubeIndex = null;
          sound.playGlassTap(-1);
          this.state.statusMessage = 'Tube deselected';
          this.updateInGameUI();
        }
        return;
      }

      this.handleTubeClick(tubeIndex);
    };

    this.canvas.addEventListener('touchstart', (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        handlePointerAction(touch.clientX, touch.clientY);
      }
    }, { passive: false });

    this.canvas.addEventListener('mousedown', (e: MouseEvent) => {
      handlePointerAction(e.clientX, e.clientY);
    });

    // Back to Menu
    document.getElementById('btn-back-menu')!.addEventListener('click', () => {
      sound.stopPouring();
      sound.playGlassTap(0);
      this.currentView = 'menu';
      this.renderMainMenu();
    });

    // Top buttons
    this.undoBtn.addEventListener('click', () => {
      sound.stopPouring();
      if (this.state.undo()) {
        sound.playUndo();
      } else {
        sound.playError();
      }
    });

    this.resetBtn.addEventListener('click', () => {
      sound.stopPouring();
      sound.playGlassTap(2);
      this.state.restartCurrentLevel();
    });

    this.soundBtn.addEventListener('click', () => {
      const isEnabled = sound.toggle();
      this.updateSoundButton(isEnabled);
    });

    this.addTubeBtn.addEventListener('click', () => {
      if (this.state.addExtraTube()) {
        sound.playGlassTap(1);
        this.renderer.resize();
      } else {
        sound.playError();
      }
    });

    // Hint button opens Rewarded Ad
    document.getElementById('btn-hint')!.addEventListener('click', () => {
      this.showRewardedAdForHint();
    });

    // Open Levels selector
    document.getElementById('btn-levels-modal')!.addEventListener('click', () => {
      this.showLevelSelector();
    });

    this.levelBadgeEl.addEventListener('click', () => {
      this.showLevelSelector();
    });

    // How to Play button
    document.getElementById('btn-how-to-play')!.addEventListener('click', () => {
      this.showHowToPlayModal();
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (this.currentView !== 'game') return;
      if (e.key === 'u' || e.key === 'U') {
        this.undoBtn.click();
      } else if (e.key === 'r' || e.key === 'R') {
        this.resetBtn.click();
      } else if (e.key === 'm' || e.key === 'M') {
        this.soundBtn.click();
      }
    });
  }

  private handleTubeClick(index: number) {
    if (this.state.selectedTubeIndex === null) {
      // First tap: Select tube if it has liquid
      const tube = this.state.tubes[index];
      if (!tube || tube.length === 0) {
        sound.playError();
        this.state.statusMessage = 'This test tube is empty. Select a tube with liquid!';
        this.updateInGameUI();
        return;
      }
      this.state.selectedTubeIndex = index;
      sound.playGlassTap(1);
      this.state.statusMessage = `Tube ${index + 1} selected. Now tap a destination tube to pour!`;
      this.updateInGameUI();
    } else {
      // Second tap: If tapped the same tube, deselect
      if (this.state.selectedTubeIndex === index) {
        this.state.selectedTubeIndex = null;
        sound.playGlassTap(0);
        this.state.statusMessage = 'Tube deselected';
        this.updateInGameUI();
        return;
      }

      // Check valid move
      const check = this.state.canPour(this.state.selectedTubeIndex, index);
      if (!check.valid) {
        sound.playError();
        this.state.statusMessage = `Invalid move: ${check.reason || 'Colors do not match or tube is full'}`;
        
        const targetTube = this.state.tubes[index];
        if (targetTube && targetTube.length > 0) {
          this.state.selectedTubeIndex = index;
          sound.playGlassTap(1);
          this.state.statusMessage = `Switched to Tube ${index + 1}. Tap destination tube to pour`;
        } else {
          this.state.selectedTubeIndex = null;
        }
        this.updateInGameUI();
        return;
      }

      // Valid move! Execute animated pour
      const fromIndex = this.state.selectedTubeIndex;
      const toIndex = index;

      const moveResult = this.state.executeMove(fromIndex, toIndex, () => {
        sound.stopPouring();
        sound.playBubble();

        if (this.state.isWon) {
          sound.playWin();
          this.renderer.triggerConfetti();
          setTimeout(() => {
            this.showWinModal();
          }, 800);
        }
      });

      if (moveResult) {
        sound.startPouring(moveResult.duration);
      }
    }
  }

  private updateInGameUI() {
    if (this.movesEl) this.movesEl.textContent = String(this.state.moves);
    if (this.levelBadgeEl) this.levelBadgeEl.textContent = `LEVEL ${this.state.levelConfig.id}`;
    if (this.topMessageEl) this.topMessageEl.textContent = `Pour liquids to sort each tube by color • Level ${this.state.levelConfig.id}`;
    if (this.bottomMessageEl) this.bottomMessageEl.textContent = this.state.statusMessage;
    if (this.timeEl) this.timeEl.textContent = this.state.getFormattedTime();

    const best = this.state.getBestMovesForCurrentLevel();
    if (this.bestMovesEl) this.bestMovesEl.textContent = best !== null ? `${best} moves` : '-';

    if (this.undoBtn) this.undoBtn.disabled = this.state.history.length === 0 || this.state.isAnimating;
    if (this.addTubeBtn) this.addTubeBtn.disabled = this.state.extraTubesAdded >= 2 || this.state.isAnimating;

    this.updateSoundButton(sound.isEnabled());
  }

  private updateSoundButton(enabled: boolean) {
    if (!this.soundBtn) return;
    if (enabled) {
      this.soundBtn.innerHTML = `
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      `;
    } else {
      this.soundBtn.innerHTML = `
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      `;
    }
  }

  // ==========================================
  // REWARDED AD MODAL FOR HINT
  // ==========================================
  private showRewardedAdForHint() {
    let secondsLeft = 5;
    let timerId: number | null = null;

    this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-5 sm:p-7 max-w-sm w-full mx-auto shadow-2xl border border-slate-100 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
        <!-- Ad Header Badge -->
        <div class="w-full flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
            Sponsored Ad
          </span>
          <span id="ad-timer-badge" class="text-xs font-mono font-bold text-slate-500">
            Reward in ${secondsLeft}s
          </span>
        </div>

        <!-- Simulated Video Ad Screen -->
        <div class="w-full h-44 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-4 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-inner mb-4">
          <!-- Animated glowing beaker inside ad -->
          <div class="w-14 h-14 rounded-2xl bg-blue-500/20 border border-cyan-400/40 flex items-center justify-center mb-2 animate-pulse">
            <svg class="w-8 h-8 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 2v7.31L4.14 20.3A2 2 0 0 0 6 23h12a2 2 0 0 0 1.86-2.7L14 9.31V2" />
              <path d="M8.5 2h7" />
            </svg>
          </div>
          <span class="font-outfit font-extrabold text-base tracking-wide text-cyan-200">CHEM-TECH PRO</span>
          <span class="text-xs text-slate-300 mt-0.5">High Purity Reagents & Smart Laboratory Glassware</span>
          
          <!-- Progress bar -->
          <div class="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
            <div id="ad-progress-bar" class="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-0 transition-all duration-1000 ease-linear"></div>
          </div>
        </div>

        <!-- Ad Status / Claim Button -->
        <div class="w-full flex flex-col gap-2">
          <button id="ad-claim-btn" disabled class="w-full py-3 bg-slate-200 text-slate-400 font-extrabold text-sm rounded-xl transition-all cursor-not-allowed">
            Watching sponsor ad (${secondsLeft}s)...
          </button>
          <button id="ad-skip-btn" class="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            Skip Ad (No Hint)
          </button>
        </div>
      </div>
    `;

    this.modalContainer.classList.remove('hidden');

    const timerBadge = document.getElementById('ad-timer-badge')!;
    const progressBar = document.getElementById('ad-progress-bar')!;
    const claimBtn = document.getElementById('ad-claim-btn') as HTMLButtonElement;
    const skipBtn = document.getElementById('ad-skip-btn')!;

    // Initial progress trigger
    setTimeout(() => {
      progressBar.style.width = '20%';
    }, 50);

    timerId = window.setInterval(() => {
      secondsLeft--;
      const progressPercent = ((5 - secondsLeft) / 5) * 100;
      progressBar.style.width = `${progressPercent}%`;

      if (secondsLeft > 0) {
        timerBadge.textContent = `Reward in ${secondsLeft}s`;
        claimBtn.textContent = `Watching sponsor ad (${secondsLeft}s)...`;
      } else {
        if (timerId !== null) clearInterval(timerId);
        timerBadge.textContent = `Ready! ✅`;
        claimBtn.disabled = false;
        claimBtn.className = 'w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-500/25 transition-all cursor-pointer';
        claimBtn.textContent = 'Claim Your Free Hint! 💡';
        skipBtn.classList.add('hidden');
      }
    }, 1000);

    claimBtn.addEventListener('click', () => {
      if (claimBtn.disabled) return;
      this.modalContainer.classList.add('hidden');
      sound.playWin();
      this.executeHintReward();
    });

    skipBtn.addEventListener('click', () => {
      if (timerId !== null) clearInterval(timerId);
      this.modalContainer.classList.add('hidden');
      this.state.statusMessage = 'Ad skipped: Hint not unlocked';
      this.updateInGameUI();
    });
  }

  private executeHintReward() {
    const hint = this.state.getHint();
    if (hint) {
      this.state.selectedTubeIndex = hint.from;
      this.state.statusMessage = `💡 Hint: Pour from Tube ${hint.from + 1} into Tube ${hint.to + 1}!`;
      this.updateInGameUI();
    } else {
      sound.playError();
      this.state.statusMessage = 'No obvious single move. Try Undo or adding an extra tube (+1 Tube)!';
      this.updateInGameUI();
    }
  }

  // ==========================================
  // HOW TO PLAY MODAL
  // ==========================================
  private showHowToPlayModal() {
    this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full mx-auto shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div class="flex items-center gap-2">
            <span class="text-xl">🧪</span>
            <h3 class="font-outfit font-extrabold text-xl text-slate-900">How to Play</h3>
          </div>
          <button id="modal-close" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <!-- 3 Illustrated Steps -->
        <div class="flex flex-col gap-3.5 mb-6 text-left">
          <!-- Step 1 -->
          <div class="flex items-start gap-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 font-outfit font-extrabold flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-900 mb-0.5">Select a Tube</h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                Tap any test tube with liquid. The tube will rise to show it is selected.
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex items-start gap-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div class="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 font-outfit font-extrabold flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-900 mb-0.5">Pour Matching Colors</h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                Tap another tube to pour. You can only pour if the target has room and its top color matches (or the target tube is empty).
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex items-start gap-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-outfit font-extrabold flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-900 mb-0.5">Sort Each Solution</h4>
              <p class="text-xs text-slate-500 leading-relaxed">
                Continue transferring layers until each test tube holds only one uniform color. Sort all colors to clear the level!
              </p>
            </div>
          </div>
        </div>

        <!-- Confirm Button -->
        <button id="modal-got-it" class="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer">
          Got it, Let's Play!
        </button>
      </div>
    `;

    this.modalContainer.classList.remove('hidden');

    const closeModal = () => {
      this.modalContainer.classList.add('hidden');
    };

    document.getElementById('modal-close')!.addEventListener('click', closeModal);
    document.getElementById('modal-got-it')!.addEventListener('click', closeModal);
  }

  // ==========================================
  // LEVEL SELECTOR MODAL (PROGRESSIVE UNLOCK)
  // ==========================================
  private showLevelSelector() {
    const save = this.state.loadSave();
    const unlocked = save.unlockedLevels; // Starts at 1, unlocked progressively

    let levelButtonsHtml = '';
    const totalPresets = PRESET_LEVELS.length;

    for (let i = 0; i < totalPresets; i++) {
      const lvlId = i + 1;
      const isCurrent = i === this.state.currentLevelIndex;
      const isUnlocked = lvlId <= unlocked; // STRICT PROGRESSIVE UNLOCK!
      const best = save.bestMoves[i];

      levelButtonsHtml += `
        <button data-level="${i}" ${!isUnlocked ? 'disabled' : ''} class="p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center relative ${
          isCurrent 
            ? 'bg-blue-50 border-blue-400 text-blue-700 font-bold shadow-xs cursor-pointer' 
            : isUnlocked 
              ? 'bg-white border-slate-200 hover:border-blue-300 text-slate-800 cursor-pointer hover:shadow-xs' 
              : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
        }">
          <span class="text-[10px] uppercase tracking-wider ${isCurrent ? 'text-blue-600' : 'text-slate-400'} font-bold">Level</span>
          <span class="font-outfit font-extrabold text-lg sm:text-xl my-0.5">${lvlId}</span>
          <span class="text-[9px] sm:text-[10px] font-medium text-slate-500">
            ${best !== undefined ? `🏆 ${best}` : isUnlocked ? 'Unlocked' : '🔒 Locked'}
          </span>
        </button>
      `;
    }

    this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-5 sm:p-7 max-w-md w-full mx-auto shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div class="flex items-center gap-2">
            <span class="text-xl">🧪</span>
            <h3 class="font-outfit font-extrabold text-xl text-slate-900">Select Level</h3>
          </div>
          <button id="modal-close" class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-4 sm:grid-cols-5 gap-2 overflow-y-auto p-1 mb-4 flex-1">
          ${levelButtonsHtml}
        </div>

        <p class="text-xs text-center text-slate-500">
          Complete each level to progressively unlock the next laboratory challenge!
        </p>
      </div>
    `;

    this.modalContainer.classList.remove('hidden');

    document.getElementById('modal-close')!.addEventListener('click', () => {
      this.modalContainer.classList.add('hidden');
    });

    const btns = this.modalContainer.querySelectorAll('button[data-level]');
    btns.forEach(b => {
      b.addEventListener('click', (e) => {
        const target = (e.currentTarget as HTMLElement).getAttribute('data-level');
        if (target !== null) {
          const lvlIdx = parseInt(target, 10);
          sound.playGlassTap(1);
          this.state.loadLevel(lvlIdx);
          this.modalContainer.classList.add('hidden');

          if (this.currentView === 'menu') {
            this.currentView = 'game';
            this.renderGameView();
          } else {
            this.renderer.resize();
            this.updateInGameUI();
          }
        }
      });
    });
  }

  // ==========================================
  // LEVEL COMPLETE WIN MODAL
  // ==========================================
  private showWinModal() {
    const moves = this.state.moves;
    const par = this.state.levelConfig.parMoves;
    const stars = moves <= par ? 3 : moves <= par + 4 ? 2 : 1;

    let starIcons = '';
    for (let i = 1; i <= 3; i++) {
      if (i <= stars) {
        starIcons += `
          <svg class="w-8 h-8 text-amber-400 fill-amber-400 drop-shadow-sm" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        `;
      } else {
        starIcons += `
          <svg class="w-8 h-8 text-slate-200 fill-slate-200" viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        `;
      }
    }

    this.modalContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full mx-auto text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <svg class="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h2 class="font-outfit font-extrabold text-2xl text-slate-900 mb-1">Level Complete!</h2>
        <p class="text-sm text-slate-500 mb-4">You sorted all chemical solutions perfectly!</p>

        <div class="flex justify-center gap-2 mb-6">
          ${starIcons}
        </div>

        <div class="grid grid-cols-2 gap-3 mb-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div class="text-center">
            <span class="block text-xs uppercase text-slate-400 font-bold">Moves</span>
            <span class="font-outfit font-extrabold text-xl text-slate-800">${moves}</span>
          </div>
          <div class="text-center">
            <span class="block text-xs uppercase text-slate-400 font-bold">Time</span>
            <span class="font-outfit font-extrabold text-xl text-slate-800">${this.state.getFormattedTime()}</span>
          </div>
        </div>

        <div class="flex flex-col gap-2.5">
          <button id="modal-btn-next" class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer">
            Next Level
          </button>
          <button id="modal-btn-replay" class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all cursor-pointer">
            Play Again
          </button>
          <button id="modal-btn-menu" class="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            Back to Main Menu
          </button>
        </div>
      </div>
    `;

    this.modalContainer.classList.remove('hidden');

    document.getElementById('modal-btn-next')!.addEventListener('click', () => {
      this.modalContainer.classList.add('hidden');
      sound.playGlassTap(1);
      this.state.nextLevel();
      this.renderer.resize();
    });

    document.getElementById('modal-btn-replay')!.addEventListener('click', () => {
      this.modalContainer.classList.add('hidden');
      sound.playGlassTap(0);
      this.state.restartCurrentLevel();
    });

    document.getElementById('modal-btn-menu')!.addEventListener('click', () => {
      this.modalContainer.classList.add('hidden');
      sound.playGlassTap(0);
      this.currentView = 'menu';
      this.renderMainMenu();
    });
  }
}

// Start app once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new WaterSortApp();
});
