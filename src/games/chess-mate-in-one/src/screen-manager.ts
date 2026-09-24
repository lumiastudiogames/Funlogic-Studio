import { sound } from './audio';
import { GameStateManager } from './game-state';
import { CHESS_PUZZLES } from './puzzles';
import { GameScreen } from './types';

export class ScreenController {
  private currentScreen: GameScreen = 'MAIN_MENU';
  private rootEl: HTMLElement;
  private gameState: GameStateManager;

  // Ad simulation modal state
  private adTimer: number = 5;
  private adInterval: number | null = null;
  private adModalEl: HTMLElement | null = null;

  // Callbacks
  private onScreenChangeCb?: (screen: GameScreen) => void;

  constructor(rootEl: HTMLElement, gameState: GameStateManager, onScreenChange?: (screen: GameScreen) => void) {
    this.rootEl = rootEl;
    this.gameState = gameState;
    this.onScreenChangeCb = onScreenChange;
  }

  public setScreen(screen: GameScreen) {
    sound.playClick();
    this.currentScreen = screen;
    this.render();
    if (this.onScreenChangeCb) {
      this.onScreenChangeCb(screen);
    }
  }

  public getCurrentScreen(): GameScreen {
    return this.currentScreen;
  }

  public render() {
    this.rootEl.innerHTML = '';

    if (this.currentScreen === 'MAIN_MENU') {
      this.renderMainMenu();
    } else if (this.currentScreen === 'PLAYING') {
      this.renderPlayingScreen();
    } else if (this.currentScreen === 'LEVEL_SELECT') {
      this.renderLevelSelect();
    } else if (this.currentScreen === 'HOW_TO_PLAY') {
      this.renderHowToPlay();
    } else if (this.currentScreen === 'PROGRESS') {
      this.renderProgressScreen();
    }
  }

  /**
   * Main Menu Screen
   */
  private renderMainMenu() {
    const save = this.gameState.getSaveData();
    const currentPuzzle = this.gameState.getCurrentPuzzle();

    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-white relative overflow-y-auto';

    container.innerHTML = `
      <!-- Top Bar: Sound toggle -->
      <div class="w-full flex items-center justify-between z-10 shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-extrabold text-sm">
            ♞
          </div>
          <span class="text-xs font-bold tracking-wider text-slate-400 uppercase">CHESS TACTICS</span>
        </div>
        <button id="btn-menu-sound" class="btn-tactile w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-200 active:scale-95" title="Toggle Sound">
          ${sound.isEnabled() ? '🔊' : '🔇'}
        </button>
      </div>

      <!-- Center Hero: Knight Emblem & Title -->
      <div class="flex flex-col items-center text-center my-auto z-10 max-w-sm">
        <div class="relative mb-5">
          <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 shadow-xl shadow-blue-500/25 border-2 border-blue-400/40 flex items-center justify-center text-5xl sm:text-6xl text-white select-none">
            ♞
          </div>
          <div class="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
            MATE IN 1
          </div>
        </div>

        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-['Outfit']">
          Chess Mate in One
        </h1>
        <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-medium">
          Spot the single winning move by White to deliver immediate, unstoppable checkmate.
        </p>

        <!-- Stats Chips -->
        <div class="grid grid-cols-2 gap-3 w-full mb-8">
          <div class="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-3 flex flex-col items-center">
            <span class="text-[10px] uppercase font-bold text-slate-400">Solved Puzzles</span>
            <span class="text-xl font-extrabold text-blue-400">${save.completedLevels.length} / ${CHESS_PUZZLES.length}</span>
          </div>
          <div class="bg-slate-800/80 border border-slate-700/70 rounded-2xl p-3 flex flex-col items-center">
            <span class="text-[10px] uppercase font-bold text-slate-400">Total Score</span>
            <span class="text-xl font-extrabold text-amber-400">${this.gameState.getTotalScore()}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col gap-3 w-full">
          <button id="btn-menu-play" class="btn-tactile-primary w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 active:scale-[0.98]">
            <span>PLAY PUZZLE ${currentPuzzle.id}</span>
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>

          <button id="btn-menu-levels" class="btn-tactile w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm tracking-wide flex items-center justify-center gap-2 active:scale-[0.98]">
            <span>LEVEL SELECT</span>
            <span class="text-xs bg-slate-700 px-2 py-0.5 rounded-md text-blue-300 font-bold">${save.unlockedLevel} Unlocked</span>
          </button>

          <button id="btn-menu-rules" class="btn-tactile w-full py-3 rounded-2xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700/60 font-medium text-xs tracking-wide flex items-center justify-center gap-1.5 active:scale-[0.98]">
            <span>💡 How to Play</span>
          </button>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="text-[11px] text-slate-400 font-medium text-center z-10 shrink-0 mt-4">
        25 Handcrafted Tactical Puzzles • Pure Vanilla Engine
      </div>
    `;

    this.rootEl.appendChild(container);

    // Event listeners
    container.querySelector('#btn-menu-sound')?.addEventListener('click', () => {
      sound.toggle();
      this.render();
    });

    container.querySelector('#btn-menu-play')?.addEventListener('click', () => {
      this.setScreen('PLAYING');
    });

    container.querySelector('#btn-menu-levels')?.addEventListener('click', () => {
      this.setScreen('LEVEL_SELECT');
    });

    container.querySelector('#btn-menu-rules')?.addEventListener('click', () => {
      this.setScreen('HOW_TO_PLAY');
    });
  }

  /**
   * Playing Screen (Header + Canvas + Subheader + Tactical Card + Bottom Navigation)
   */
  private renderPlayingScreen() {
    const puzzle = this.gameState.getCurrentPuzzle();
    const save = this.gameState.getSaveData();
    const isCompleted = this.gameState.isCompleted();
    const hintActive = this.gameState.isHintActive();

    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-100 relative overflow-hidden select-none';

    container.innerHTML = `
      <!-- 1. Header (Superior HUD matching manual with shrink-0) -->
      <header class="w-full h-14 bg-white/95 px-3 sm:px-4 border-b border-slate-200 flex items-center justify-between gap-1.5 shrink-0 z-20 shadow-xs">
        <!-- Left: Pause/Home + Level Pill -->
        <div class="flex items-center gap-2 shrink-0">
          <button id="btn-game-menu" class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0 active:scale-95 transition-transform" title="Menu">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <div id="level-badge" class="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 shrink-0 uppercase tracking-wide">
            LEVEL ${puzzle.id}
          </div>
        </div>

        <!-- Right: Metrics (Score, Hint, Restart, Sound) -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-0.5 text-center min-w-[58px] shrink-0">
            <span class="block text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase leading-none mt-0.5">SCORE</span>
            <span id="score-counter" class="font-extrabold text-xs sm:text-sm text-slate-800 leading-tight">${this.gameState.getTotalScore()}</span>
          </div>

          <!-- Hint button -->
          <button id="btn-game-hint" class="btn-tactile px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all ${hintActive ? 'bg-amber-400 text-slate-900 border-amber-500 font-black shadow-xs' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold'}" title="Get Tactical Hint">
            <span>💡</span>
            <span class="text-xs font-bold">${hintActive ? 'HINT ON' : 'HINT'}</span>
          </button>

          <!-- Restart button -->
          <button id="btn-game-restart" class="btn-tactile px-2.5 sm:px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 shrink-0 active:scale-95 hover:bg-slate-50" title="Restart Puzzle">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span class="hidden sm:inline">RESET</span>
          </button>

          <!-- Sound button -->
          <button id="btn-game-sound" class="w-9 h-9 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 active:scale-95 transition-transform" title="Toggle Sound">
            <span class="text-sm">${sound.isEnabled() ? '🔊' : '🔇'}</span>
          </button>
        </div>
      </header>

      <!-- 2. Subheader -->
      <div class="w-full bg-slate-50/90 border-b border-slate-200/80 px-3 py-1.5 flex items-center justify-between text-xs shrink-0 z-10">
        <span id="puzzle-code-badge" class="font-bold text-slate-500 tracking-tight">${puzzle.code}</span>
        <div class="flex items-center gap-1.5 font-bold text-blue-700 truncate max-w-[280px] sm:max-w-md">
          <span>🧩</span>
          <span id="tactical-hint-text">${hintActive ? puzzle.hint : "Mate in 1 • White to move"}</span>
        </div>
        <div class="flex items-center gap-1 text-slate-400 text-xs shrink-0">
          <span>⭐</span>
        </div>
      </div>

      <!-- 3. Canvas Container (Flex-1 central area taking all available space) -->
      <div id="canvas-container" class="flex-1 w-full relative flex items-center justify-center overflow-hidden p-1 min-h-[260px]">
        <canvas id="chess-canvas" class="block touch-none"></canvas>

        <!-- Wrong move warning toast overlay -->
        <div id="wrong-move-toast" class="absolute top-3 left-4 right-4 bg-rose-600 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transform -translate-y-16 transition-transform duration-300 opacity-0 pointer-events-none z-30">
          <span>⚠️</span>
          <span id="wrong-move-text">Not checkmate! White must deliver mate in one.</span>
        </div>

        <!-- Victory celebration banner overlay -->
        <div id="victory-banner" class="${isCompleted ? 'flex' : 'hidden'} absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex-col items-center justify-center p-4 z-40 animate-fade-in" onclick="event.stopPropagation()">
          <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-xs w-full shadow-2xl border border-slate-100 text-center flex flex-col items-center relative" onclick="event.stopPropagation()">
            <button id="btn-victory-close" aria-label="Close" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center text-sm active:scale-90 transition-all cursor-pointer">✕</button>
            <div class="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 text-3xl flex items-center justify-center mb-3 shadow-inner">
              👑
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-1 font-['Outfit']">CHECKMATE!</h3>
            <p id="victory-explanation" class="text-slate-500 text-xs mb-4 font-medium">${puzzle.explanation}</p>
            <div id="victory-stars" class="flex items-center justify-center gap-1 text-amber-400 text-xl mb-5">
              ${'⭐'.repeat(save.stars[puzzle.id] || 3)}
            </div>
            <div class="flex gap-2 w-full">
              <button id="btn-victory-replay" class="btn-tactile flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs active:scale-95 cursor-pointer">
                RESTART
              </button>
              <button id="btn-victory-next" class="btn-tactile-primary flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs active:scale-95 shadow-md shadow-blue-500/30 cursor-pointer">
                NEXT PUZZLE
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation Bar matching screenshot (Home, Puzzles, Progress) -->
      <footer class="w-full h-14 bg-white border-t border-slate-200 px-4 flex items-center justify-around shrink-0 z-20">
        <button id="btn-tab-home" class="flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition-colors gap-0.5 py-1">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span class="text-[10px] font-bold">Home</span>
        </button>

        <button id="btn-tab-puzzles" class="flex flex-col items-center justify-center text-blue-600 font-extrabold active:scale-95 gap-0.5 py-1">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5a2.5 2.5 0 0 0-5 0V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5a2.5 2.5 0 0 0 0-5z"/></svg>
          <span class="text-[10px]">Puzzles</span>
        </button>

        <button id="btn-tab-progress" class="flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition-colors gap-0.5 py-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          <span class="text-[10px] font-bold">Progress</span>
        </button>
      </footer>
    `;

    this.rootEl.appendChild(container);

    // Event handlers
    container.querySelector('#btn-game-menu')?.addEventListener('click', () => {
      this.setScreen('MAIN_MENU');
    });

    container.querySelector('#btn-game-restart')?.addEventListener('click', () => {
      sound.playClick();
      this.gameState.restartLevel();
    });

    container.querySelector('#btn-game-sound')?.addEventListener('click', () => {
      sound.toggle();
      const soundBtn = container.querySelector('#btn-game-sound');
      if (soundBtn) {
        soundBtn.innerHTML = `<span class="text-sm">${sound.isEnabled() ? '🔊' : '🔇'}</span>`;
      }
    });

    container.querySelector('#btn-game-hint')?.addEventListener('click', () => {
      this.openRewardedAdModal();
    });

    // Victory banner buttons
    container.querySelector('#btn-victory-close')?.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playClick();
      this.hideVictoryModal();
    });

    container.querySelector('#btn-victory-replay')?.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playClick();
      this.hideVictoryModal();
      this.gameState.restartLevel();
      this.updatePlayingHud();
    });

    container.querySelector('#btn-victory-next')?.addEventListener('click', (e) => {
      e.stopPropagation();
      sound.playClick();
      this.hideVictoryModal();
      this.gameState.nextLevel();
      this.updatePlayingHud();
    });

    // Tabs
    container.querySelector('#btn-tab-home')?.addEventListener('click', () => {
      this.setScreen('MAIN_MENU');
    });

    container.querySelector('#btn-tab-puzzles')?.addEventListener('click', () => {
      this.setScreen('LEVEL_SELECT');
    });

    container.querySelector('#btn-tab-progress')?.addEventListener('click', () => {
      this.setScreen('PROGRESS');
    });
  }

  /**
   * Rewarded Ad Simulated Modal (Section 6.B of manual)
   */
  public openRewardedAdModal() {
    sound.playClick();
    if (this.adModalEl) {
      this.adModalEl.remove();
    }

    this.adTimer = 5;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none';
    this.adModalEl = modal;

    modal.innerHTML = `
      <div class="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col text-slate-800">
        <!-- Video Header -->
        <div class="w-full h-36 bg-gradient-to-tr from-indigo-900 to-blue-700 p-4 flex flex-col justify-between text-white relative">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-extrabold uppercase bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">
              SPONSORED REWARD
            </span>
            <span id="ad-counter-badge" class="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-md">
              0:05
            </span>
          </div>

          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl">
              💡
            </div>
            <div>
              <h4 class="font-black text-sm text-white">Grandmaster Hint</h4>
              <p class="text-[11px] text-blue-100">Unlocks the winning tactical move</p>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
            <div id="ad-progress-bar" class="h-full bg-amber-400 transition-all duration-1000 ease-linear w-0"></div>
          </div>
        </div>

        <!-- Body -->
        <div class="p-5 flex flex-col items-center text-center">
          <p class="text-xs text-slate-500 font-medium mb-5">
            Support the game to reveal the secret piece and mating square for this puzzle.
          </p>

          <button id="btn-claim-hint" disabled class="btn-tactile w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-2 bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed">
            <span>WAITING (5s)</span>
          </button>

          <button id="btn-skip-ad" class="mt-3 text-xs font-bold text-slate-400 hover:text-slate-600 py-1 px-3">
            Skip / Close
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target === modal) {
        this.closeAdModal();
      }
    });

    const progressBar = modal.querySelector('#ad-progress-bar') as HTMLElement;
    const badge = modal.querySelector('#ad-counter-badge') as HTMLElement;
    const claimBtn = modal.querySelector('#btn-claim-hint') as HTMLButtonElement;
    const skipBtn = modal.querySelector('#btn-skip-ad') as HTMLButtonElement;

    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeAdModal();
    });

    if (this.adInterval) {
      clearInterval(this.adInterval);
    }

    this.adInterval = window.setInterval(() => {
      this.adTimer--;
      const progressPercent = Math.min(100, Math.floor(((5 - this.adTimer) / 5) * 100));

      if (progressBar) progressBar.style.width = `${progressPercent}%`;
      if (badge) badge.innerText = `0:0${Math.max(0, this.adTimer)}`;

      if (this.adTimer <= 0) {
        clearInterval(this.adInterval!);
        this.adInterval = null;

        claimBtn.disabled = false;
        claimBtn.className = 'btn-tactile-primary w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 border border-amber-300 shadow-lg shadow-amber-400/30 cursor-pointer active:scale-95';
        claimBtn.innerHTML = '<span>CLAIM HINT! 💡</span>';

        claimBtn.addEventListener('click', () => {
          this.closeAdModal();
          this.gameState.unlockHint();
        });
      } else {
        claimBtn.innerHTML = `<span>WAITING (${this.adTimer}s)</span>`;
      }
    }, 1000);
  }

  private closeAdModal() {
    if (this.adInterval) {
      clearInterval(this.adInterval);
      this.adInterval = null;
    }
    if (this.adModalEl) {
      this.adModalEl.remove();
      this.adModalEl = null;
    }
  }

  /**
   * Level Select Screen (Section 6.A of manual)
   */
  private renderLevelSelect() {
    const save = this.gameState.getSaveData();

    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-900 text-white relative overflow-hidden';

    let gridHtml = '';
    const totalDisplayLevels = Math.max(30, save.unlockedLevel + 5);

    for (let idx = 0; idx < totalDisplayLevels; idx++) {
      const p = this.gameState.getPuzzleAtIndex(idx);
      const levelNum = p.id;
      const isUnlocked = levelNum <= save.unlockedLevel;
      const isCompleted = save.completedLevels.includes(levelNum);
      const starsCount = save.stars[levelNum] || (isCompleted ? 3 : 0);

      if (isUnlocked) {
        gridHtml += `
          <button data-level="${idx}" class="btn-tactile p-3 rounded-2xl ${isCompleted ? 'bg-slate-800 border-blue-500/50' : 'bg-slate-800/80 border-slate-700'} border flex flex-col items-center justify-between text-center relative group active:scale-95 transition-all">
            <div class="w-full flex items-center justify-between text-[10px] text-slate-400">
              <span class="font-extrabold text-blue-400">LV ${levelNum}</span>
              <span>${p.difficulty === 'Beginner' ? '🟢' : p.difficulty === 'Intermediate' ? '🟡' : '🔴'}</span>
            </div>
            <div class="my-1.5 text-2xl font-black text-white font-['Outfit']">
              ${levelNum}
            </div>
            <div class="text-[9px] font-bold text-slate-300 truncate w-full mb-1">
              ${p.theme}
            </div>
            <div class="text-xs text-amber-400">
              ${isCompleted ? '⭐'.repeat(starsCount) : '<span class="text-slate-500">Unplayed</span>'}
            </div>
          </button>
        `;
      } else {
        gridHtml += `
          <div class="p-3 rounded-2xl bg-slate-800/30 border border-slate-800/50 flex flex-col items-center justify-center text-center opacity-40 select-none">
            <span class="text-xl mb-1">🔒</span>
            <span class="text-xs font-bold text-slate-500">Level ${levelNum}</span>
          </div>
        `;
      }
    }

    container.innerHTML = `
      <!-- Header -->
      <div class="w-full h-14 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <button id="btn-levels-back" class="btn-tactile w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 active:scale-95">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 class="text-base font-extrabold text-white font-['Outfit']">SELECT LEVEL</h2>
        <div class="w-9 h-9"></div>
      </div>

      <!-- Level Grid -->
      <div class="flex-1 w-full overflow-y-auto p-4 sm:p-5">
        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          ${gridHtml}
        </div>
      </div>
    `;

    this.rootEl.appendChild(container);

    container.querySelector('#btn-levels-back')?.addEventListener('click', () => {
      this.setScreen('PLAYING');
    });

    container.querySelectorAll('button[data-level]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const levelIdx = parseInt(target.getAttribute('data-level') || '0', 10);
        this.gameState.initLevel(levelIdx);
        this.setScreen('PLAYING');
      });
    });
  }

  /**
   * How to Play Screen (Section 6.C of manual - 3 didactic cards)
   */
  private renderHowToPlay() {
    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-900 text-white relative overflow-hidden';

    container.innerHTML = `
      <!-- Header -->
      <div class="w-full h-14 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <button id="btn-how-back" class="btn-tactile w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 active:scale-95">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 class="text-base font-extrabold text-white font-['Outfit']">HOW TO PLAY</h2>
        <div class="w-9 h-9"></div>
      </div>

      <!-- 3 Horizontal Tutorial Cards -->
      <div class="flex-1 w-full overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
        <!-- Card 1 -->
        <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl shrink-0">
            1️⃣
          </div>
          <div>
            <h3 class="text-base font-extrabold text-blue-400 mb-1">Spot the Black King</h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every puzzle starts with White to move. Locate the Black King and check its surrounding squares: which flight squares are blocked by its own pieces or covered by White?
            </p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
            2️⃣
          </div>
          <div>
            <h3 class="text-base font-extrabold text-amber-400 mb-1">Find the Single Mating Move</h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tap or drag any White piece. Dots indicate legal target squares. Your goal is to find the single move that puts the King in check with ZERO legal replies!
            </p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0">
            3️⃣
          </div>
          <div>
            <h3 class="text-base font-extrabold text-emerald-400 mb-1">Immediate Checkmate!</h3>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              If Black can escape, capture, or block, it is not mate in 1. When you deliver true checkmate, you unlock the next puzzle, score stars, and celebrate victory!
            </p>
          </div>
        </div>
      </div>

      <!-- Play Now Button -->
      <div class="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        <button id="btn-how-play" class="btn-tactile-primary w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm active:scale-95 shadow-lg shadow-blue-500/20">
          START SOLVING NOW
        </button>
      </div>
    `;

    this.rootEl.appendChild(container);

    container.querySelector('#btn-how-back')?.addEventListener('click', () => {
      this.setScreen('PLAYING');
    });

    container.querySelector('#btn-how-play')?.addEventListener('click', () => {
      this.setScreen('PLAYING');
    });
  }

  /**
   * Progress / Stats Screen
   */
  private renderProgressScreen() {
    const save = this.gameState.getSaveData();
    const totalPuzzles = CHESS_PUZZLES.length;
    const solvedCount = save.completedLevels.length;
    const progressPercent = Math.floor((solvedCount / totalPuzzles) * 100);

    const container = document.createElement('div');
    container.className = 'w-full h-full flex flex-col bg-slate-900 text-white relative overflow-hidden';

    container.innerHTML = `
      <!-- Header -->
      <div class="w-full h-14 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
        <button id="btn-prog-back" class="btn-tactile w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 active:scale-95">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <h2 class="text-base font-extrabold text-white font-['Outfit']">PLAYER STATS</h2>
        <div class="w-9 h-9"></div>
      </div>

      <!-- Stats Content -->
      <div class="flex-1 w-full overflow-y-auto p-4 sm:p-6 flex flex-col gap-4">
        <!-- Progress Bar Card -->
        <div class="bg-slate-800/80 border border-slate-700 rounded-3xl p-5">
          <div class="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
            <span>Overall Completion</span>
            <span class="text-blue-400 font-extrabold text-sm">${progressPercent}%</span>
          </div>
          <div class="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
            <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style="width: ${progressPercent}%"></div>
          </div>
          <span class="text-[11px] text-slate-400 font-medium">${solvedCount} of ${totalPuzzles} tactical puzzles solved</span>
        </div>

        <!-- 2x2 Grid -->
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col items-center text-center">
            <span class="text-2xl mb-1">🏆</span>
            <span class="text-[10px] uppercase font-bold text-slate-400">Total Score</span>
            <span class="text-xl font-black text-amber-400">${this.gameState.getTotalScore()}</span>
          </div>

          <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col items-center text-center">
            <span class="text-2xl mb-1">🔥</span>
            <span class="text-[10px] uppercase font-bold text-slate-400">Best Streak</span>
            <span class="text-xl font-black text-orange-400">${save.bestStreak} Puzzles</span>
          </div>

          <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col items-center text-center">
            <span class="text-2xl mb-1">⭐</span>
            <span class="text-[10px] uppercase font-bold text-slate-400">Total Stars</span>
            <span class="text-xl font-black text-amber-400">
              ${Object.values(save.stars).reduce((a, b) => a + b, 0)}
            </span>
          </div>

          <div class="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col items-center text-center">
            <span class="text-2xl mb-1">🔓</span>
            <span class="text-[10px] uppercase font-bold text-slate-400">Current Level</span>
            <span class="text-xl font-black text-blue-400">Level ${save.unlockedLevel}</span>
          </div>
        </div>
      </div>

      <!-- Bottom Play Button -->
      <div class="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
        <button id="btn-prog-play" class="btn-tactile-primary w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm active:scale-95 shadow-lg shadow-blue-500/20">
          CONTINUE PLAYING
        </button>
      </div>
    `;

    this.rootEl.appendChild(container);

    container.querySelector('#btn-prog-back')?.addEventListener('click', () => {
      this.setScreen('PLAYING');
    });

    container.querySelector('#btn-prog-play')?.addEventListener('click', () => {
      this.setScreen('PLAYING');
    });
  }

  public showWrongMoveToast(msg: string) {
    const toast = document.getElementById('wrong-move-toast');
    const toastText = document.getElementById('wrong-move-text');
    if (toast && toastText) {
      toastText.innerText = msg;
      toast.classList.remove('-translate-y-16', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100', 'animate-shake');

      setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100', 'animate-shake');
        toast.classList.add('-translate-y-16', 'opacity-0');
      }, 2500);
    }
  }

  public showVictoryModal() {
    const puzzle = this.gameState.getCurrentPuzzle();
    const save = this.gameState.getSaveData();

    const banner = document.getElementById('victory-banner');
    const exp = document.getElementById('victory-explanation');
    const stars = document.getElementById('victory-stars');

    if (exp) exp.innerText = puzzle.explanation;
    if (stars) stars.innerText = '⭐'.repeat(save.stars[puzzle.id] || 3);

    if (banner) {
      banner.classList.remove('hidden');
      banner.classList.add('flex');
    }
  }

  public hideVictoryModal() {
    const banner = document.getElementById('victory-banner');
    if (banner) {
      banner.classList.remove('flex');
      banner.classList.add('hidden');
    }
  }

  public updatePlayingHud() {
    const puzzle = this.gameState.getCurrentPuzzle();
    const hintActive = this.gameState.isHintActive();

    const levelBadge = document.getElementById('level-badge');
    if (levelBadge) {
      levelBadge.innerText = `LEVEL ${puzzle.id}`;
    }

    const codeBadge = document.getElementById('puzzle-code-badge');
    if (codeBadge) {
      codeBadge.innerText = puzzle.code;
    }

    const hintText = document.getElementById('tactical-hint-text');
    if (hintText) {
      hintText.innerText = hintActive ? puzzle.hint : "Mate in 1 • White to move";
    }

    const hintBtn = document.getElementById('btn-game-hint');
    if (hintBtn) {
      if (hintActive) {
        hintBtn.innerHTML = `<span>💡</span><span class="text-xs font-black">HINT ON</span>`;
        hintBtn.className = 'btn-tactile px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all bg-amber-400 text-slate-900 border-amber-500 font-black shadow-xs';
      } else {
        hintBtn.innerHTML = `<span>💡</span><span class="text-xs font-bold">HINT</span>`;
        hintBtn.className = 'btn-tactile px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold';
      }
    }

    const scoreCounter = document.getElementById('score-counter');
    if (scoreCounter) {
      scoreCounter.innerText = String(this.gameState.getTotalScore());
    }

    if (!this.gameState.isCompleted()) {
      this.hideVictoryModal();
    }
  }
}
