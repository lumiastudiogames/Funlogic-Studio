import './index.css';
import { Block, LevelData, PlayerProgress, SolverMove } from './types';
import { LEVELS } from './levels';
import { solveLevel } from './solver';
import { soundManager } from './audio';
import { DisplayManager } from './display';
import { GameRenderer } from './renderer';
import { icons } from './icons';

const STORAGE_KEY = 'unblock_red_key_progress_v1';

interface DragState {
  blockId: string;
  startPointerX: number;
  startPointerY: number;
  originalBlockX: number;
  originalBlockY: number;
  currentX: number;
  currentY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  isHorizontal: boolean;
  isVertical: boolean;
}

class GameApp {
  private container: HTMLElement;
  private progress: PlayerProgress;
  private currentScreen: 'MENU' | 'PLAYING' = 'MENU';
  private currentLevelIndex: number = 0;

  // Active Gameplay State
  private blocks: Block[] = [];
  private moves: number = 0;
  private history: Block[][] = [];
  private activeHint: SolverMove | null = null;
  private isWon: boolean = false;

  // Canvas & Render Engine
  private canvasElement: HTMLCanvasElement | null = null;
  private displayManager: DisplayManager | null = null;
  private renderer: GameRenderer | null = null;
  private dragState: DragState | null = null;
  private animFrameId: number | null = null;
  private exitProgress: number = 0;
  private hasTriggeredWin: boolean = false;

  // Modal active states
  private activeModal: 'LEVEL_SELECT' | 'VICTORY' | 'REWARDED_AD' | 'HOW_TO_PLAY' | 'SETTINGS' | null = null;
  private levelSelectFilter: string = 'All';
  private victoryStarsAnimated: number = 0;
  private rewardedCountdown: number = 5;
  private rewardedTimerId: ReturnType<typeof setInterval> | null = null;
  private settingsConfirmReset: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
    this.progress = this.loadProgress();
    this.init();
  }

  private loadProgress(): PlayerProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          unlockedLevel: Math.max(1, parsed.unlockedLevel || 1),
          scores: parsed.scores || {},
          hintsRemaining: parsed.hintsRemaining !== undefined ? parsed.hintsRemaining : 3,
          soundEnabled: parsed.soundEnabled !== undefined ? parsed.soundEnabled : true,
          hapticsEnabled: true,
        };
      }
    } catch {
      // Storage fallback
    }
    return {
      unlockedLevel: 1,
      scores: {},
      hintsRemaining: 3,
      soundEnabled: true,
      hapticsEnabled: true,
    };
  }

  private saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch {
      // Storage fallback
    }
  }

  private getCurrentLevel(): LevelData {
    return LEVELS[this.currentLevelIndex] || LEVELS[0];
  }

  private getTotalStars(): number {
    let total = 0;
    Object.values(this.progress.scores).forEach(s => {
      total += s.stars;
    });
    return total;
  }

  private getCompletedCount(): number {
    let count = 0;
    Object.values(this.progress.scores).forEach(s => {
      if (s.stars > 0) count++;
    });
    return count;
  }

  private init() {
    this.renderMain();
  }

  // Root UI Renderer
  private renderMain() {
    this.cleanCanvasLoop();

    const stageHTML = `
      <div id="game-stage" class="w-full max-w-5xl h-[100dvh] sm:h-[92vh] sm:max-h-[880px] mx-auto flex flex-col relative overflow-hidden bg-white sm:rounded-3xl shadow-2xl border border-slate-700/30">
        ${this.currentScreen === 'MENU' ? this.renderMenuHTML() : this.renderGameHTML()}
        <div id="modal-container">
          ${this.renderModalHTML()}
        </div>
      </div>
    `;

    this.container.innerHTML = stageHTML;
    this.bindEvents();

    if (this.currentScreen === 'PLAYING') {
      this.initCanvasEngine();
    }
  }

  // --- HTML GENERATORS ---

  private renderMenuHTML(): string {
    const completedCount = this.getCompletedCount();
    const totalStars = this.getTotalStars();
    const nextLevel = Math.min(this.progress.unlockedLevel, LEVELS.length);

    return `
      <div class="w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-slate-900 via-slate-800 to-amber-950 text-white select-none overflow-y-auto scrollbar-none">
        <!-- Top Header Bar -->
        <div class="w-full flex items-center justify-between max-w-md shrink-0">
          <div class="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
            ${icons.trophy('w-4 h-4 text-amber-400')}
            <span class="text-xs font-bold text-amber-300">${completedCount} / ${LEVELS.length} Levels</span>
          </div>

          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-amber-400 font-black text-xs">
              ${icons.star('w-4 h-4', true)}
              <span>${totalStars}</span>
            </div>

            <button
              id="btn-toggle-sound"
              class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-200 transition-colors"
              title="Toggle Sound"
            >
              ${this.progress.soundEnabled ? icons.volume2('w-4 h-4 text-amber-400') : icons.volumeX('w-4 h-4 text-slate-400')}
            </button>
          </div>
        </div>

        <!-- Hero Visual Mascot & Title -->
        <div class="flex flex-col items-center text-center my-auto py-4">
          <div id="btn-hero-key" class="relative mb-4 group cursor-pointer">
            <div class="absolute -inset-4 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-500 animate-pulse"></div>
            <div class="relative w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-red-500 via-red-600 to-amber-900 rounded-3xl p-1 shadow-2xl border-2 border-amber-300/40 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <div class="w-full h-full bg-gradient-to-br from-red-600 to-red-900 rounded-[22px] flex items-center justify-center relative overflow-hidden shadow-inner">
                <div class="absolute top-0 left-0 w-full h-1/2 bg-white/15 rounded-t-[22px]"></div>
                ${icons.key('w-16 h-16 sm:w-20 sm:h-20 text-amber-300 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transform -rotate-12')}
                <div class="absolute top-3 right-3 animate-spin" style="animation-duration: 6s;">
                  ${icons.sparkles('w-6 h-6 text-yellow-200')}
                </div>
              </div>
            </div>
          </div>

          <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 filter drop-shadow-md">
            UNBLOCK RED KEY
          </h1>
          <p class="text-xs sm:text-sm text-amber-100/75 mt-1 font-medium max-w-xs sm:max-w-sm">
            Slide the wooden blocks and set the golden key free!
          </p>
        </div>

        <!-- Action Buttons Menu -->
        <div class="w-full max-w-xs flex flex-col gap-3 shrink-0 pb-2">
          <button
            id="btn-play-now"
            class="btn-tactile w-full py-3.5 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 border border-amber-300/80 shadow-xl active:scale-95 transition-all"
          >
            ${icons.play('w-5 h-5 fill-amber-950 shrink-0')}
            <span>${completedCount > 0 ? `CONTINUE (LEVEL ${nextLevel})` : 'PLAY NOW'}</span>
          </button>

          <button
            id="btn-open-level-select"
            class="btn-tactile w-full py-3 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 bg-white/15 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md active:scale-95 transition-all"
          >
            ${icons.grid('w-5 h-5 text-amber-400 shrink-0')}
            <span>SELECT LEVEL</span>
          </button>

          <button
            id="btn-open-how-to-play"
            class="btn-tactile w-full py-2.5 px-6 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10 backdrop-blur-md active:scale-95 transition-all"
          >
            ${icons.helpCircle('w-4 h-4 text-slate-300 shrink-0')}
            <span>HOW TO PLAY</span>
          </button>
        </div>
      </div>
    `;
  }

  private renderGameHTML(): string {
    const level = this.getCurrentLevel();
    const bestScore = this.progress.scores[level.id]?.bestMoves ?? null;

    return `
      <div class="w-full h-full flex flex-col justify-between overflow-hidden relative select-none">
        <!-- HUD Header -->
        <div class="w-full px-4 py-3 bg-gradient-to-b from-slate-900 to-slate-900/95 border-b border-white/10 text-white flex items-center justify-between shrink-0 shadow-lg backdrop-blur-md z-10">
          <div class="flex items-center gap-2">
            <button
              id="btn-hud-back"
              class="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-200 transition-all active:scale-95"
              title="Back to Menu"
            >
              ${icons.arrowLeft('w-5 h-5')}
            </button>

            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-black tracking-wider text-amber-400 uppercase">LEVEL ${level.id}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ${level.difficulty}
                </span>
              </div>
              <div class="text-[11px] text-slate-300 font-medium mt-0.5">
                Target: <span class="font-bold text-white">${level.targetMoves} moves</span>
              </div>
            </div>
          </div>

          <!-- Central Score Badge -->
          <div class="flex items-center gap-3 bg-white/10 px-3.5 py-1.5 rounded-2xl border border-white/15">
            <div class="text-center">
              <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">MOVES</span>
              <span id="hud-moves-val" class="text-base font-black text-amber-300 leading-tight">${this.moves}</span>
            </div>
            <div class="w-px h-6 bg-white/15"></div>
            <div class="text-center">
              <span class="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">BEST</span>
              <span class="text-base font-black text-emerald-400 leading-tight">${bestScore !== null ? bestScore : '-'}</span>
            </div>
          </div>

          <!-- Right Action Tools -->
          <div class="flex items-center gap-1.5">
            <button
              id="btn-hud-sound"
              class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-200 transition-colors"
              title="Sound"
            >
              ${this.progress.soundEnabled ? icons.volume2('w-4 h-4 text-amber-400') : icons.volumeX('w-4 h-4 text-slate-400')}
            </button>

            <button
              id="btn-hud-settings"
              class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-slate-200 transition-colors"
              title="Settings"
            >
              ${icons.settings('w-4 h-4 text-slate-200')}
            </button>
          </div>
        </div>

        <!-- Central 2.5D Canvas Board -->
        <div id="canvas-container" class="flex-1 w-full h-full min-h-0 relative flex items-center justify-center overflow-hidden touch-none">
          <canvas id="game-canvas" class="w-full h-full block cursor-grab active:cursor-grabbing select-none"></canvas>
        </div>

        <!-- Bottom Controls -->
        <div class="w-full px-4 py-3 bg-gradient-to-t from-slate-950 via-slate-900 to-transparent flex items-center justify-center gap-3 shrink-0 z-10">
          <button
            id="btn-control-undo"
            ${this.history.length === 0 || this.isWon ? 'disabled' : ''}
            class="btn-tactile flex-1 max-w-[130px] py-2.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              this.history.length > 0 && !this.isWon
                ? 'bg-white/15 hover:bg-white/20 text-white border border-white/20 active:scale-95 cursor-pointer shadow-md'
                : 'bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed opacity-50'
            }"
          >
            ${icons.undo('w-4 h-4 shrink-0')}
            <span>UNDO (${this.history.length})</span>
          </button>

          <button
            id="btn-control-hint"
            ${this.isWon ? 'disabled' : ''}
            class="btn-tactile flex-1 max-w-[140px] py-2.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 border border-amber-300/80 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            ${icons.lightbulb('w-4 h-4 fill-amber-950 shrink-0')}
            <span>HINT (${this.progress.hintsRemaining})</span>
          </button>

          <button
            id="btn-control-reset"
            ${this.isWon ? 'disabled' : ''}
            class="btn-tactile flex-1 max-w-[130px] py-2.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              !this.isWon
                ? 'bg-white/15 hover:bg-white/20 text-white border border-white/20 active:scale-95 cursor-pointer shadow-md'
                : 'bg-white/5 border border-white/5 text-slate-600 cursor-not-allowed opacity-50'
            }"
          >
            ${icons.rotateCcw('w-4 h-4 shrink-0')}
            <span>RESET</span>
          </button>
        </div>
      </div>
    `;
  }

  // Modals Generator
  private renderModalHTML(): string {
    if (!this.activeModal) return '';

    if (this.activeModal === 'LEVEL_SELECT') {
      const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Master'];
      const filteredLevels =
        this.levelSelectFilter === 'All'
          ? LEVELS
          : LEVELS.filter(l => l.difficulty === this.levelSelectFilter);

      return `
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn select-none">
          <div class="w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-900/40 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-white">
            <div class="px-5 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5">
              <div class="flex items-center gap-2">
                ${icons.trophy('w-5 h-5 text-amber-400')}
                <h2 class="text-lg sm:text-xl font-black text-amber-200">LEVEL SELECT</h2>
              </div>
              <button
                id="btn-close-modal"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                ${icons.x('w-5 h-5')}
              </button>
            </div>

            <div class="px-4 py-2.5 bg-black/20 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              ${difficulties
                .map(
                  diff => `
                <button
                  data-filter="${diff}"
                  class="btn-filter-tab px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                    this.levelSelectFilter === diff
                      ? 'bg-amber-400 text-amber-950 shadow-md'
                      : 'bg-white/10 text-slate-300 hover:bg-white/15'
                  }"
                >
                  ${diff}
                </button>
              `
                )
                .join('')}
            </div>

            <div class="p-4 sm:p-6 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 scrollbar-none">
              ${filteredLevels
                .map(lvl => {
                  const isUnlocked = lvl.id <= this.progress.unlockedLevel;
                  const scoreData = this.progress.scores[lvl.id];
                  const stars = scoreData?.stars || 0;
                  const bestMoves = scoreData?.bestMoves;

                  return `
                    <button
                      data-level-id="${lvl.id}"
                      ${!isUnlocked ? 'disabled' : ''}
                      class="btn-level-card btn-tactile relative flex flex-col items-center justify-between p-3 rounded-2xl border transition-all ${
                        isUnlocked
                          ? 'bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border-amber-500/30 text-white cursor-pointer active:scale-95 shadow-md'
                          : 'bg-slate-900/60 border-white/5 text-slate-500 cursor-not-allowed opacity-60'
                      }"
                    >
                      <div class="text-base sm:text-lg font-black tracking-tight">${lvl.id}</div>
                      <div class="my-1.5 flex items-center justify-center">
                        ${
                          !isUnlocked
                            ? icons.lock('w-5 h-5 text-slate-600')
                            : `
                          <div class="flex items-center gap-0.5 text-amber-400">
                            ${icons.star('w-3 h-3', stars >= 1)}
                            ${icons.star('w-3 h-3', stars >= 2)}
                            ${icons.star('w-3 h-3', stars >= 3)}
                          </div>
                        `
                        }
                      </div>
                      <div class="text-[10px] font-bold text-slate-400">
                        ${isUnlocked && bestMoves ? `${bestMoves} moves` : lvl.difficulty}
                      </div>
                    </button>
                  `;
                })
                .join('')}
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeModal === 'VICTORY') {
      const level = this.getCurrentLevel();
      const bestMoves = this.progress.scores[level.id]?.bestMoves ?? this.moves;

      let starsEarned = 3;
      if (this.moves > level.targetMoves + 4) {
        starsEarned = 1;
      } else if (this.moves > level.targetMoves) {
        starsEarned = 2;
      }

      const ratingTitles: Record<number, string> = {
        3: 'PERFECT!',
        2: 'EXCELLENT!',
        1: 'GREAT JOB!',
      };

      const hasNextLevel = this.currentLevelIndex < LEVELS.length - 1;

      return `
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
          <div class="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950 border-2 border-amber-400/40 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center relative overflow-hidden text-white">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-amber-950 shadow-lg mb-3 border border-amber-300">
              ${icons.trophy('w-9 h-9')}
            </div>

            <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300">
              LEVEL COMPLETED!
            </h2>
            <p class="text-xs text-amber-300/80 font-bold uppercase tracking-wider mt-0.5">
              ${ratingTitles[starsEarned] || 'GREAT JOB!'}
            </p>

            <div class="flex items-center justify-center gap-2 my-4">
              ${[1, 2, 3]
                .map(index => {
                  const isFilled = this.victoryStarsAnimated >= index;
                  return `
                  <div class="transform transition-all duration-300 ${isFilled ? 'scale-110' : 'scale-90 opacity-40'}">
                    ${icons.star('w-10 h-10 sm:w-12 sm:h-12', isFilled)}
                  </div>
                `;
                })
                .join('')}
            </div>

            <div class="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/15 my-2 flex items-center justify-around">
              <div class="text-center">
                <span class="block text-[10px] text-slate-400 font-bold uppercase">MOVES</span>
                <span class="text-lg font-black text-amber-300">${this.moves}</span>
              </div>
              <div class="w-px h-8 bg-white/15"></div>
              <div class="text-center">
                <span class="block text-[10px] text-slate-400 font-bold uppercase">TARGET (3⭐)</span>
                <span class="text-lg font-black text-slate-200">≤${level.targetMoves}</span>
              </div>
              <div class="w-px h-8 bg-white/15"></div>
              <div class="text-center">
                <span class="block text-[10px] text-slate-400 font-bold uppercase">BEST</span>
                <span class="text-lg font-black text-emerald-400">${bestMoves}</span>
              </div>
            </div>

            <div class="w-full flex flex-col gap-2.5 mt-4">
              ${
                hasNextLevel
                  ? `
                <button
                  id="btn-victory-next"
                  class="btn-tactile w-full py-3.5 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 border border-amber-300/80 shadow-lg active:scale-95 transition-all"
                >
                  <span>NEXT LEVEL</span>
                  ${icons.arrowRight('w-5 h-5 shrink-0')}
                </button>
              `
                  : `
                <button
                  id="btn-victory-select"
                  class="btn-tactile w-full py-3.5 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 border border-amber-300/80 shadow-lg active:scale-95 transition-all"
                >
                  <span>ALL LEVELS CLEARED! 🎉</span>
                </button>
              `
              }

              <div class="flex gap-2">
                <button
                  id="btn-victory-replay"
                  class="btn-tactile flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 active:scale-95 transition-all"
                >
                  ${icons.rotateCcw('w-4 h-4 shrink-0')}
                  <span>REPLAY</span>
                </button>

                <button
                  id="btn-victory-levels"
                  class="btn-tactile flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/20 text-white border border-white/20 active:scale-95 transition-all"
                >
                  ${icons.grid('w-4 h-4 shrink-0')}
                  <span>LEVELS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (this.activeModal === 'REWARDED_AD') {
      const isCompleted = this.rewardedCountdown <= 0;
      const progressPercent = ((5 - this.rewardedCountdown) / 5) * 100;

      return `
        <div class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
          <div class="w-full max-w-sm bg-gradient-to-b from-slate-900 to-amber-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-center flex flex-col items-center relative overflow-hidden text-white">
            <button
              id="btn-close-modal"
              class="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
              title="Close"
            >
              ${icons.x('w-4 h-4')}
            </button>

            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-3">
              ${icons.playCircle('w-3.5 h-3.5')}
              <span>HINT REWARD</span>
            </div>

            <h3 class="text-xl font-black text-amber-200">
              ${isCompleted ? 'Hint Unlocked!' : 'Watching Sponsor...'}
            </h3>
            <p class="text-xs text-slate-300 mt-1 max-w-xs">
              ${
                isCompleted
                  ? 'Click below to claim +3 free Hints for your game!'
                  : `Wait ${this.rewardedCountdown}s to unlock +3 free Hints.`
              }
            </p>

            <div class="w-full h-32 my-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden shadow-inner p-4">
              <div class="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-2">
                <div class="animate-pulse">${icons.lightbulb('w-7 h-7')}</div>
              </div>
              <span class="text-xs font-bold text-amber-100">
                2.5D Puzzle Master
              </span>
              <span class="text-[10px] text-slate-400">Game Sponsor</span>

              <div class="absolute bottom-0 left-0 w-full h-1.5 bg-black/40">
                <div
                  class="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-1000 ease-linear"
                  style="width: ${progressPercent}%; height: 100%; background: linear-gradient(to right, #facc15, #f59e0b);"
                ></div>
              </div>
            </div>

            <button
              id="btn-claim-reward"
              ${!isCompleted ? 'disabled' : ''}
              class="btn-tactile w-full py-3.5 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all ${
                isCompleted
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-amber-950 border border-amber-300/80 shadow-lg active:scale-95 cursor-pointer animate-bounce'
                  : 'bg-slate-800 border border-white/10 text-slate-500 cursor-not-allowed opacity-60'
              }"
            >
              ${
                isCompleted
                  ? `
                ${icons.sparkles('w-5 h-5 fill-amber-950')}
                <span>CLAIM +3 HINTS! 💡</span>
              `
                  : `
                <span>WAIT (${this.rewardedCountdown}s)...</span>
              `
              }
            </button>

            <button
              id="btn-skip-reward"
              class="mt-3 text-xs text-slate-400 hover:text-slate-200 underline font-medium"
            >
              Skip and keep playing
            </button>
          </div>
        </div>
      `;
    }

    if (this.activeModal === 'HOW_TO_PLAY') {
      return `
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
          <div class="w-full max-w-lg bg-gradient-to-b from-slate-900 to-amber-950 border border-amber-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl text-white flex flex-col max-h-[90vh] overflow-y-auto scrollbar-none">
            <div class="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <div class="flex items-center gap-2">
                <span class="text-2xl">📖</span>
                <h2 class="text-lg sm:text-xl font-black text-amber-200">HOW TO PLAY</h2>
              </div>
              <button
                id="btn-close-modal"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                ${icons.x('w-5 h-5')}
              </button>
            </div>

            <div class="flex flex-col gap-3.5 my-5">
              <div class="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0 font-black text-base">
                  1
                </div>
                <div>
                  <h4 class="font-extrabold text-sm text-amber-200">Touch and Slide</h4>
                  <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Touch wooden blocks and drag with your finger or mouse. Horizontal blocks only slide left and right; vertical blocks only slide up and down.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <div class="w-10 h-10 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-red-300 shrink-0 font-black text-base">
                  2
                </div>
                <div>
                  <h4 class="font-extrabold text-sm text-red-200">Clear the Way</h4>
                  <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Move surrounding wooden blocks out of the way to create an open horizontal exit path for the <strong>Red Key</strong> towards the <strong>Golden Gate</strong> on the right.
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 font-black text-base">
                  3
                </div>
                <div>
                  <h4 class="font-extrabold text-sm text-emerald-200">Earn 3 Stars</h4>
                  <p class="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    Slide the red key out through the gate. The fewer moves you use compared to the target, the higher your star score (up to 3 stars ⭐⭐⭐)!
                  </p>
                </div>
              </div>
            </div>

            <button
              id="btn-close-modal"
              class="btn-tactile w-full py-3.5 rounded-2xl font-black text-base bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 border border-amber-300/80 shadow-lg active:scale-95 transition-all"
            >
              GOT IT, LET'S PLAY! 🚀
            </button>
          </div>
        </div>
      `;
    }

    if (this.activeModal === 'SETTINGS') {
      return `
        <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn select-none">
          <div class="w-full max-w-sm bg-gradient-to-b from-slate-900 to-amber-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-white flex flex-col relative overflow-hidden">
            <div class="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
              <h3 class="text-lg font-black text-amber-200">SETTINGS</h3>
              <button
                id="btn-close-modal"
                class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition-colors"
              >
                ${icons.x('w-5 h-5')}
              </button>
            </div>

            <div class="flex flex-col gap-4 my-5">
              <div class="flex items-center justify-between p-3.5 rounded-2xl bg-white/10 border border-white/10">
                <div class="flex items-center gap-3">
                  ${this.progress.soundEnabled ? icons.volume2('w-5 h-5 text-amber-400') : icons.volumeX('w-5 h-5 text-slate-400')}
                  <div>
                    <div class="font-bold text-sm">Sound Effects</div>
                    <div class="text-[11px] text-slate-300">${this.progress.soundEnabled ? 'Enabled' : 'Disabled'}</div>
                  </div>
                </div>

                <button
                  id="btn-toggle-sound-settings"
                  class="w-12 h-7 rounded-full transition-colors relative p-1 ${
                    this.progress.soundEnabled ? 'bg-amber-400' : 'bg-slate-700'
                  }"
                >
                  <div
                    class="w-5 h-5 rounded-full bg-white transition-transform ${
                      this.progress.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }"
                  ></div>
                </button>
              </div>

              <div class="p-3.5 rounded-2xl bg-white/10 border border-white/10 flex flex-col gap-2">
                ${
                  !this.settingsConfirmReset
                    ? `
                  <button
                    id="btn-show-reset-confirm"
                    class="btn-tactile w-full py-2.5 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    ${icons.rotateCcw('w-4 h-4')}
                    <span>Reset All Progress</span>
                  </button>
                `
                    : `
                  <div class="flex flex-col gap-2 text-center p-1">
                    <div class="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-bold">
                      ${icons.alertTriangle('w-4 h-4 text-amber-400')}
                      <span>Are you sure? All levels and stars will be reset!</span>
                    </div>
                    <div class="flex gap-2 mt-1">
                      <button
                        id="btn-confirm-reset"
                        class="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs"
                      >
                        Yes, Reset
                      </button>
                      <button
                        id="btn-cancel-reset"
                        class="flex-1 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                `
                }
              </div>
            </div>

            <button
              id="btn-close-modal"
              class="btn-tactile w-full py-3 rounded-xl font-black text-sm bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 border border-amber-300/80 shadow-md active:scale-95"
            >
              DONE
            </button>
          </div>
        </div>
      `;
    }

    return '';
  }

  // --- EVENT BINDING ---

  private bindEvents() {
    // Menu Events
    const btnToggleSound = this.container.querySelector('#btn-toggle-sound');
    if (btnToggleSound) {
      btnToggleSound.addEventListener('click', () => this.toggleSound());
    }

    const btnPlayNow = this.container.querySelector('#btn-play-now');
    const btnHeroKey = this.container.querySelector('#btn-hero-key');
    const startPlay = () => {
      soundManager.playClick();
      const targetIdx = Math.min(this.progress.unlockedLevel - 1, LEVELS.length - 1);
      this.loadLevel(targetIdx);
      this.currentScreen = 'PLAYING';
      this.renderMain();
    };
    if (btnPlayNow) btnPlayNow.addEventListener('click', startPlay);
    if (btnHeroKey) btnHeroKey.addEventListener('click', startPlay);

    const btnOpenLevelSelect = this.container.querySelector('#btn-open-level-select');
    if (btnOpenLevelSelect) {
      btnOpenLevelSelect.addEventListener('click', () => {
        soundManager.playClick();
        this.activeModal = 'LEVEL_SELECT';
        this.renderMain();
      });
    }

    const btnOpenHowToPlay = this.container.querySelector('#btn-open-how-to-play');
    if (btnOpenHowToPlay) {
      btnOpenHowToPlay.addEventListener('click', () => {
        soundManager.playClick();
        this.activeModal = 'HOW_TO_PLAY';
        this.renderMain();
      });
    }

    // HUD Events
    const btnHudBack = this.container.querySelector('#btn-hud-back');
    if (btnHudBack) {
      btnHudBack.addEventListener('click', () => {
        soundManager.playClick();
        this.currentScreen = 'MENU';
        this.renderMain();
      });
    }

    const btnHudSound = this.container.querySelector('#btn-hud-sound');
    if (btnHudSound) {
      btnHudSound.addEventListener('click', () => this.toggleSound());
    }

    const btnHudSettings = this.container.querySelector('#btn-hud-settings');
    if (btnHudSettings) {
      btnHudSettings.addEventListener('click', () => {
        soundManager.playClick();
        this.settingsConfirmReset = false;
        this.activeModal = 'SETTINGS';
        this.renderMain();
      });
    }

    // Game Control Buttons
    const btnControlUndo = this.container.querySelector('#btn-control-undo');
    if (btnControlUndo) {
      btnControlUndo.addEventListener('click', () => this.handleUndo());
    }

    const btnControlHint = this.container.querySelector('#btn-control-hint');
    if (btnControlHint) {
      btnControlHint.addEventListener('click', () => this.handleHint());
    }

    const btnControlReset = this.container.querySelector('#btn-control-reset');
    if (btnControlReset) {
      btnControlReset.addEventListener('click', () => this.handleReset());
    }

    // Modal Events
    const btnCloseModals = this.container.querySelectorAll('#btn-close-modal');
    btnCloseModals.forEach(b => {
      b.addEventListener('click', () => {
        soundManager.playClick();
        this.closeModal();
      });
    });

    // Level Select Tabs & Cards
    const filterTabs = this.container.querySelectorAll('.btn-filter-tab');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', e => {
        soundManager.playClick();
        const diff = (e.currentTarget as HTMLElement).getAttribute('data-filter');
        if (diff) {
          this.levelSelectFilter = diff;
          this.renderMain();
        }
      });
    });

    const levelCards = this.container.querySelectorAll('.btn-level-card');
    levelCards.forEach(card => {
      card.addEventListener('click', e => {
        soundManager.playClick();
        const levelId = Number((e.currentTarget as HTMLElement).getAttribute('data-level-id'));
        if (levelId) {
          const idx = LEVELS.findIndex(l => l.id === levelId);
          if (idx !== -1) {
            this.loadLevel(idx);
            this.activeModal = null;
            this.currentScreen = 'PLAYING';
            this.renderMain();
          }
        }
      });
    });

    // Victory Actions
    const btnVictoryNext = this.container.querySelector('#btn-victory-next');
    if (btnVictoryNext) {
      btnVictoryNext.addEventListener('click', () => {
        soundManager.playClick();
        this.activeModal = null;
        if (this.currentLevelIndex < LEVELS.length - 1) {
          this.loadLevel(this.currentLevelIndex + 1);
          this.renderMain();
        } else {
          this.activeModal = 'LEVEL_SELECT';
          this.renderMain();
        }
      });
    }

    const btnVictorySelect = this.container.querySelector('#btn-victory-select');
    if (btnVictorySelect) {
      btnVictorySelect.addEventListener('click', () => {
        soundManager.playClick();
        this.activeModal = 'LEVEL_SELECT';
        this.renderMain();
      });
    }

    const btnVictoryReplay = this.container.querySelector('#btn-victory-replay');
    if (btnVictoryReplay) {
      btnVictoryReplay.addEventListener('click', () => {
        soundManager.playClick();
        this.activeModal = null;
        this.loadLevel(this.currentLevelIndex);
        this.renderMain();
      });
    }

    const btnVictoryLevels = this.container.querySelector('#btn-victory-levels');
    if (btnVictoryLevels) {
      btnVictoryLevels.addEventListener('click', () => {
        soundManager.playClick();
        this.activeModal = 'LEVEL_SELECT';
        this.renderMain();
      });
    }

    // Rewarded Ad Actions
    const btnClaimReward = this.container.querySelector('#btn-claim-reward');
    if (btnClaimReward) {
      btnClaimReward.addEventListener('click', () => {
        if (this.rewardedCountdown <= 0) {
          soundManager.playReward();
          this.progress.hintsRemaining += 3;
          this.saveProgress();
          this.closeModal();

          setTimeout(() => {
            const solution = solveLevel(this.getCurrentLevel(), this.blocks);
            if (solution && solution.length > 0) {
              this.activeHint = solution[0];
              soundManager.playHint();
            }
            this.renderMain();
          }, 200);
        }
      });
    }

    const btnSkipReward = this.container.querySelector('#btn-skip-reward');
    if (btnSkipReward) {
      btnSkipReward.addEventListener('click', () => {
        soundManager.playClick();
        this.closeModal();
      });
    }

    // Settings Actions
    const btnToggleSoundSettings = this.container.querySelector('#btn-toggle-sound-settings');
    if (btnToggleSoundSettings) {
      btnToggleSoundSettings.addEventListener('click', () => this.toggleSound());
    }

    const btnShowResetConfirm = this.container.querySelector('#btn-show-reset-confirm');
    if (btnShowResetConfirm) {
      btnShowResetConfirm.addEventListener('click', () => {
        soundManager.playClick();
        this.settingsConfirmReset = true;
        this.renderMain();
      });
    }

    const btnConfirmReset = this.container.querySelector('#btn-confirm-reset');
    if (btnConfirmReset) {
      btnConfirmReset.addEventListener('click', () => {
        soundManager.playClick();
        this.progress = {
          unlockedLevel: 1,
          scores: {},
          hintsRemaining: 3,
          soundEnabled: this.progress.soundEnabled,
          hapticsEnabled: true,
        };
        localStorage.removeItem(STORAGE_KEY);
        this.loadLevel(0);
        this.closeModal();
        this.currentScreen = 'MENU';
        this.renderMain();
      });
    }

    const btnCancelReset = this.container.querySelector('#btn-cancel-reset');
    if (btnCancelReset) {
      btnCancelReset.addEventListener('click', () => {
        soundManager.playClick();
        this.settingsConfirmReset = false;
        this.renderMain();
      });
    }
  }

  private closeModal() {
    if (this.rewardedTimerId) {
      clearInterval(this.rewardedTimerId);
      this.rewardedTimerId = null;
    }
    this.activeModal = null;
    this.renderMain();
  }

  private toggleSound() {
    const enabled = soundManager.toggleSound();
    this.progress.soundEnabled = enabled;
    this.saveProgress();
    this.renderMain();
  }

  // --- GAME LOGIC & CANVAS ENGINE ---

  private loadLevel(levelIndex: number) {
    const safeIndex = Math.max(0, Math.min(LEVELS.length - 1, levelIndex));
    this.currentLevelIndex = safeIndex;
    const targetLvl = LEVELS[safeIndex];

    this.blocks = targetLvl.blocks.map(b => ({ ...b }));
    this.moves = 0;
    this.history = [];
    this.activeHint = null;
    this.isWon = false;
    this.exitProgress = 0;
    this.hasTriggeredWin = false;
  }

  private handleUndo() {
    if (this.history.length === 0 || this.isWon) return;
    const lastState = this.history[this.history.length - 1];
    this.blocks = lastState;
    this.history = this.history.slice(0, -1);
    this.moves = Math.max(0, this.moves - 1);
    this.activeHint = null;
    soundManager.playWoodSnap();
    this.renderMain();
  }

  private handleReset() {
    if (this.isWon) return;
    soundManager.playClick();
    this.loadLevel(this.currentLevelIndex);
    this.renderMain();
  }

  private handleHint() {
    if (this.isWon) return;

    if (this.progress.hintsRemaining <= 0) {
      soundManager.playClick();
      this.startRewardedAdFlow();
      return;
    }

    const solution = solveLevel(this.getCurrentLevel(), this.blocks);
    if (solution && solution.length > 0) {
      this.activeHint = solution[0];
      soundManager.playHint();
      this.progress.hintsRemaining = Math.max(0, this.progress.hintsRemaining - 1);
      this.saveProgress();
      this.renderMain();
    } else {
      soundManager.playClick();
    }
  }

  private startRewardedAdFlow() {
    this.rewardedCountdown = 5;
    this.activeModal = 'REWARDED_AD';
    this.renderMain();

    if (this.rewardedTimerId) clearInterval(this.rewardedTimerId);

    this.rewardedTimerId = setInterval(() => {
      this.rewardedCountdown--;
      if (this.rewardedCountdown <= 0) {
        if (this.rewardedTimerId) clearInterval(this.rewardedTimerId);
        this.rewardedTimerId = null;
        soundManager.playReward();
      }
      this.renderMain();
    }, 1000);
  }

  private triggerWin() {
    this.isWon = true;

    const level = this.getCurrentLevel();
    let starsEarned = 3;
    if (this.moves > level.targetMoves + 4) {
      starsEarned = 1;
    } else if (this.moves > level.targetMoves) {
      starsEarned = 2;
    }

    const currentBest = this.progress.scores[level.id]?.bestMoves;
    const currentStars = this.progress.scores[level.id]?.stars || 0;

    const newBestMoves = currentBest ? Math.min(currentBest, this.moves) : this.moves;
    const newStars = Math.max(currentStars, starsEarned);
    const nextUnlocked = Math.max(this.progress.unlockedLevel, level.id + 1);

    this.progress.unlockedLevel = nextUnlocked;
    this.progress.scores[level.id] = {
      bestMoves: newBestMoves,
      stars: newStars,
    };
    this.saveProgress();

    // Trigger victory stars animation timer sequence
    this.victoryStarsAnimated = 0;
    for (let i = 1; i <= starsEarned; i++) {
      setTimeout(() => {
        this.victoryStarsAnimated = i;
        soundManager.playStar(i - 1);
        if (this.activeModal === 'VICTORY') {
          this.renderMain();
        }
      }, i * 280);
    }

    setTimeout(() => {
      this.activeModal = 'VICTORY';
      this.renderMain();
    }, 600);
  }

  // Canvas engine initialization and loop
  private initCanvasEngine() {
    this.canvasElement = this.container.querySelector('#game-canvas');
    if (!this.canvasElement) return;

    const ctx = this.canvasElement.getContext('2d');
    if (!ctx) return;

    this.renderer = new GameRenderer(ctx);
    this.displayManager = new DisplayManager(this.canvasElement);

    // Canvas Pointer Event Listeners
    this.canvasElement.addEventListener('pointerdown', this.handlePointerDown);
    this.canvasElement.addEventListener('pointermove', this.handlePointerMove);
    this.canvasElement.addEventListener('pointerup', this.handlePointerUp);
    this.canvasElement.addEventListener('pointercancel', this.handlePointerUp);

    this.startCanvasLoop();
  }

  private cleanCanvasLoop() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.canvasElement) {
      this.canvasElement.removeEventListener('pointerdown', this.handlePointerDown);
      this.canvasElement.removeEventListener('pointermove', this.handlePointerMove);
      this.canvasElement.removeEventListener('pointerup', this.handlePointerUp);
      this.canvasElement.removeEventListener('pointercancel', this.handlePointerUp);
      this.canvasElement = null;
    }
    if (this.displayManager) {
      this.displayManager.destroy();
      this.displayManager = null;
    }
  }

  private startCanvasLoop() {
    const loop = () => {
      if (this.currentScreen !== 'PLAYING' || !this.displayManager || !this.renderer) return;

      const { width, height } = this.displayManager.getDimensions();
      const level = this.getCurrentLevel();

      if (this.isWon) {
        if (this.exitProgress < 1) {
          this.exitProgress = Math.min(1, this.exitProgress + 0.025);
        }
      } else {
        this.exitProgress = 0;
      }

      this.renderer.render(
        width,
        height,
        level,
        this.blocks,
        this.dragState
          ? {
              blockId: this.dragState.blockId,
              currentX: this.dragState.currentX,
              currentY: this.dragState.currentY,
            }
          : null,
        this.activeHint,
        this.isWon,
        this.exitProgress
      );

      this.animFrameId = requestAnimationFrame(loop);
    };

    loop();
  }

  // --- CANVAS DRAG BOUNDS & POINTER HANDLERS ---

  private computeSlidingBounds(block: Block, currentBlocks: Block[], level: LevelData) {
    const isHorizontal = block.width > block.height;
    const isVertical = block.height > block.width;
    const isSingle = block.width === 1 && block.height === 1;

    const cols = level.cols;
    const rows = level.rows;

    const grid: (string | null)[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null)
    );

    for (const b of currentBlocks) {
      if (b.id !== block.id) {
        for (let r = 0; r < b.height; r++) {
          for (let c = 0; c < b.width; c++) {
            if (b.y + r < rows && b.x + c < cols) {
              grid[b.y + r][b.x + c] = b.id;
            }
          }
        }
      }
    }

    let minX = block.x;
    let maxX = block.x;
    let minY = block.y;
    let maxY = block.y;

    if (isHorizontal || isSingle) {
      while (minX > 0) {
        let canMove = true;
        for (let r = 0; r < block.height; r++) {
          if (grid[block.y + r][minX - 1] !== null) {
            canMove = false;
            break;
          }
        }
        if (canMove) minX--;
        else break;
      }

      while (maxX + block.width < cols) {
        let canMove = true;
        for (let r = 0; r < block.height; r++) {
          if (grid[block.y + r][maxX + block.width] !== null) {
            canMove = false;
            break;
          }
        }
        if (canMove) maxX++;
        else break;
      }
    }

    if (isVertical || isSingle) {
      while (minY > 0) {
        let canMove = true;
        for (let c = 0; c < block.width; c++) {
          if (grid[minY - 1][block.x + c] !== null) {
            canMove = false;
            break;
          }
        }
        if (canMove) minY--;
        else break;
      }

      while (maxY + block.height < rows) {
        let canMove = true;
        for (let c = 0; c < block.width; c++) {
          if (grid[maxY + block.height][block.x + c] !== null) {
            canMove = false;
            break;
          }
        }
        if (canMove) maxY++;
        else break;
      }
    }

    return {
      minX,
      maxX,
      minY,
      maxY,
      isHorizontal: isHorizontal || isSingle,
      isVertical: isVertical || isSingle,
    };
  }

  private handlePointerDown = (e: PointerEvent) => {
    if (this.isWon || !this.displayManager || !this.renderer || !this.canvasElement) return;

    this.canvasElement.setPointerCapture(e.pointerId);

    const { x, y } = this.displayManager.getGameCoordinates(e.clientX, e.clientY);
    const { width, height } = this.displayManager.getDimensions();
    const layout = this.renderer.computeBoardLayout(width, height, this.getCurrentLevel());

    for (const b of this.blocks) {
      const bx = layout.boardX + b.x * layout.cellSize;
      const by = layout.boardY + b.y * layout.cellSize;
      const bw = b.width * layout.cellSize;
      const bh = b.height * layout.cellSize;

      if (x >= bx && x <= bx + bw && y >= by && y <= by + bh) {
        const bounds = this.computeSlidingBounds(b, this.blocks, this.getCurrentLevel());

        this.dragState = {
          blockId: b.id,
          startPointerX: x,
          startPointerY: y,
          originalBlockX: b.x,
          originalBlockY: b.y,
          currentX: b.x,
          currentY: b.y,
          minX: bounds.minX,
          maxX: bounds.maxX,
          minY: bounds.minY,
          maxY: bounds.maxY,
          isHorizontal: bounds.isHorizontal,
          isVertical: bounds.isVertical,
        };

        soundManager.playWoodSlide();
        break;
      }
    }
  };

  private handlePointerMove = (e: PointerEvent) => {
    if (!this.dragState || !this.displayManager || !this.renderer) return;

    const { x, y } = this.displayManager.getGameCoordinates(e.clientX, e.clientY);
    const { width, height } = this.displayManager.getDimensions();
    const layout = this.renderer.computeBoardLayout(width, height, this.getCurrentLevel());

    const deltaX = (x - this.dragState.startPointerX) / layout.cellSize;
    const deltaY = (y - this.dragState.startPointerY) / layout.cellSize;

    if (this.dragState.isHorizontal) {
      let targetX = this.dragState.originalBlockX + deltaX;
      targetX = Math.max(this.dragState.minX, Math.min(this.dragState.maxX, targetX));
      this.dragState.currentX = targetX;
    }

    if (this.dragState.isVertical) {
      let targetY = this.dragState.originalBlockY + deltaY;
      targetY = Math.max(this.dragState.minY, Math.min(this.dragState.maxY, targetY));
      this.dragState.currentY = targetY;
    }
  };

  private handlePointerUp = (e: PointerEvent) => {
    if (this.canvasElement && this.canvasElement.hasPointerCapture(e.pointerId)) {
      this.canvasElement.releasePointerCapture(e.pointerId);
    }

    if (!this.dragState) return;

    const finalX = Math.round(this.dragState.currentX);
    const finalY = Math.round(this.dragState.currentY);

    const changed =
      finalX !== this.dragState.originalBlockX || finalY !== this.dragState.originalBlockY;

    if (changed) {
      // Push history before mutating blocks
      this.history.push(this.blocks.map(b => ({ ...b })));

      this.blocks = this.blocks.map(b =>
        b.id === this.dragState?.blockId ? { ...b, x: finalX, y: finalY } : b
      );

      this.moves++;
      this.activeHint = null;
      soundManager.playWoodSnap();

      // Update UI moves counter
      const movesElem = this.container.querySelector('#hud-moves-val');
      if (movesElem) movesElem.textContent = String(this.moves);

      // Check Win Condition: Key reaches exit
      const level = this.getCurrentLevel();
      const keyBlock = this.blocks.find(b => b.isKey);
      if (keyBlock && keyBlock.y === level.exitRow && keyBlock.x + keyBlock.width >= level.cols) {
        if (!this.hasTriggeredWin) {
          this.hasTriggeredWin = true;
          soundManager.playVictory();
          if (this.displayManager && this.renderer) {
            const { width, height } = this.displayManager.getDimensions();
            this.renderer.spawnVictoryParticles(width, height);
          }
          this.triggerWin();
        }
      } else {
        // Update Undo button state in UI
        this.renderMain();
      }
    }

    this.dragState = null;
  };
}

// Bootstrap Vanilla JS App on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (root) {
    new GameApp(root);
  }
});
