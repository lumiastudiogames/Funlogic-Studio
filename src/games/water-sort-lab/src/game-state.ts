import { ColorId, LevelConfig, MoveStep } from './types';
import { getLevelConfig, PRESET_LEVELS } from './levels';
import { sound } from './audio';

export interface GameSaveData {
  currentLevel: number;
  unlockedLevels: number;
  bestMoves: Record<number, number>;
}

export class GameState {
  public currentLevelIndex: number = 6; // Defaults to level 7 (0-indexed 6) as in the screenshot!
  public levelConfig!: LevelConfig;
  public tubes: ColorId[][] = [];
  public selectedTubeIndex: number | null = null;
  public moves: number = 0;
  public history: { tubes: ColorId[][]; moves: number }[] = [];
  public isWon: boolean = false;
  public isAnimating: boolean = false;
  public startTime: number = Date.now();
  public elapsedSeconds: number = 0;
  public timerInterval: number | null = null;
  public statusMessage: string = 'Tap a test tube to select the top liquid layer';
  public extraTubesAdded: number = 0;

  // Animation pouring details
  public pourAnimation: {
    fromIndex: number;
    toIndex: number;
    color: ColorId;
    amount: number;
    progress: number;
    durationMs: number;
    startTime: number;
  } | null = null;

  private onStateChangeCallback: (() => void) | null = null;

  constructor() {
    const save = this.loadSave();
    this.currentLevelIndex = save.currentLevel;
    this.loadLevel(this.currentLevelIndex);
  }

  public setOnChange(cb: () => void) {
    this.onStateChangeCallback = cb;
  }

  private notify() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback();
    }
  }

  public loadSave(): GameSaveData {
    const raw = localStorage.getItem('water_sort_lab_save_v2');
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (typeof data.currentLevel === 'number') {
          this.currentLevelIndex = data.currentLevel;
        }
        return {
          currentLevel: typeof data.currentLevel === 'number' ? data.currentLevel : 0,
          unlockedLevels: typeof data.unlockedLevels === 'number' ? Math.max(1, data.unlockedLevels) : 1,
          bestMoves: data.bestMoves || {},
        };
      } catch {}
    }
    return {
      currentLevel: 0, // Level 1 in UI
      unlockedLevels: 1, // Only Level 1 unlocked initially
      bestMoves: {},
    };
  }

  public saveProgress() {
    const currentSave = this.loadSave();
    const save: GameSaveData = {
      currentLevel: this.currentLevelIndex,
      unlockedLevels: Math.max(currentSave.unlockedLevels, this.currentLevelIndex + 2),
      bestMoves: {
        ...currentSave.bestMoves,
      },
    };
    if (this.isWon) {
      const prevBest = save.bestMoves[this.currentLevelIndex];
      if (prevBest === undefined || this.moves < prevBest) {
        save.bestMoves[this.currentLevelIndex] = this.moves;
      }
    }
    localStorage.setItem('water_sort_lab_save_v2', JSON.stringify(save));
  }

  public getBestMovesForCurrentLevel(): number | null {
    const save = this.loadSave();
    return save.bestMoves[this.currentLevelIndex] ?? null;
  }

  public loadLevel(levelIndex: number) {
    sound.stopPouring();
    this.currentLevelIndex = levelIndex;
    this.levelConfig = getLevelConfig(levelIndex);
    this.tubes = this.levelConfig.tubes.map(t => [...t]);
    this.selectedTubeIndex = null;
    this.moves = 0;
    this.history = [];
    this.isWon = false;
    this.isAnimating = false;
    this.pourAnimation = null;
    this.extraTubesAdded = 0;
    this.startTime = Date.now();
    this.elapsedSeconds = 0;
    this.statusMessage = `Pour liquids to sort each tube by color • Level ${this.levelConfig.id}`;
    
    this.startTimer();
    this.notify();
  }

  public restartCurrentLevel() {
    this.loadLevel(this.currentLevelIndex);
  }

  public nextLevel() {
    this.loadLevel(this.currentLevelIndex + 1);
  }

  public prevLevel() {
    if (this.currentLevelIndex > 0) {
      this.loadLevel(this.currentLevelIndex - 1);
    }
  }

  public addExtraTube(): boolean {
    if (this.extraTubesAdded >= 2) return false;
    this.extraTubesAdded++;
    this.tubes.push([]);
    this.statusMessage = 'Extra test tube added to the lab!';
    this.notify();
    return true;
  }

  private startTimer() {
    if (this.timerInterval) {
      window.clearInterval(this.timerInterval);
    }
    this.timerInterval = window.setInterval(() => {
      if (!this.isWon) {
        this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        this.notify();
      }
    }, 1000);
  }

  public getFormattedTime(): string {
    const mins = Math.floor(this.elapsedSeconds / 60);
    const secs = this.elapsedSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  public canPour(fromIndex: number, toIndex: number): { valid: boolean; amount: number; color?: ColorId; reason?: string } {
    if (fromIndex === toIndex) return { valid: false, amount: 0, reason: 'Same tube' };
    const from = this.tubes[fromIndex];
    const to = this.tubes[toIndex];

    if (!from || from.length === 0) {
      return { valid: false, amount: 0, reason: 'Source tube is empty' };
    }
    if (!to || to.length >= 4) {
      return { valid: false, amount: 0, reason: 'Target tube is full (capacity 4)' };
    }

    const topColor = from[from.length - 1];

    if (to.length > 0) {
      const destTopColor = to[to.length - 1];
      if (topColor !== destTopColor) {
        return { valid: false, amount: 0, reason: 'Colors do not match' };
      }
    }

    // Calculate how many consecutive top segments of same color in source
    let consecutiveCount = 0;
    for (let i = from.length - 1; i >= 0; i--) {
      if (from[i] === topColor) {
        consecutiveCount++;
      } else {
        break;
      }
    }

    const availableSpace = 4 - to.length;
    const amountToTransfer = Math.min(consecutiveCount, availableSpace);

    return {
      valid: amountToTransfer > 0,
      amount: amountToTransfer,
      color: topColor,
    };
  }

  public checkWin(): boolean {
    for (const tube of this.tubes) {
      if (tube.length === 0) continue;
      if (tube.length !== 4) return false;
      const firstColor = tube[0];
      for (let i = 1; i < tube.length; i++) {
        if (tube[i] !== firstColor) return false;
      }
    }
    return true;
  }

  public isTubeComplete(tubeIndex: number): boolean {
    const tube = this.tubes[tubeIndex];
    if (!tube || tube.length !== 4) return false;
    const c = tube[0];
    return tube.every(seg => seg === c);
  }

  public executeMove(fromIndex: number, toIndex: number, onComplete?: () => void) {
    const check = this.canPour(fromIndex, toIndex);
    if (!check.valid || !check.color) return false;

    // Save history for undo before modifying
    this.history.push({
      tubes: this.tubes.map(t => [...t]),
      moves: this.moves,
    });

    this.isAnimating = true;
    const amount = check.amount;
    const color = check.color;

    this.pourAnimation = {
      fromIndex,
      toIndex,
      color,
      amount,
      progress: 0,
      durationMs: 400 + amount * 180,
      startTime: performance.now(),
    };

    this.selectedTubeIndex = null;
    this.moves++;
    this.statusMessage = `Transferring liquid layers...`;
    this.notify();

    // Actual state change completes after animation
    let isCompleted = false;
    const completeMove = () => {
      if (isCompleted) return;
      isCompleted = true;

      // Transfer segments
      for (let i = 0; i < amount; i++) {
        this.tubes[fromIndex].pop();
        this.tubes[toIndex].push(color);
      }
      this.isAnimating = false;
      this.pourAnimation = null;

      if (this.checkWin()) {
        this.isWon = true;
        this.statusMessage = 'Solved! All colors separated! 🎉';
        this.saveProgress();
      } else {
        const remainingMoves = this.calculateRemainingEstimate();
        this.statusMessage = `Tap another tube to pour • ~${remainingMoves} moves remaining`;
      }

      this.notify();
      if (onComplete) onComplete();
    };

    // Automatically trigger completion when animation finishes
    window.setTimeout(completeMove, this.pourAnimation.durationMs);

    return { duration: this.pourAnimation.durationMs, complete: completeMove };
  }

  public undo(): boolean {
    if (this.isAnimating || this.history.length === 0) return false;
    const previous = this.history.pop()!;
    this.tubes = previous.tubes.map(t => [...t]);
    this.moves = previous.moves;
    this.selectedTubeIndex = null;
    this.isWon = false;
    this.statusMessage = 'Move undone successfully';
    this.notify();
    return true;
  }

  public getHint(): { from: number; to: number; color: ColorId } | null {
    // Look for moves that either complete a tube or group larger blocks
    const possibleMoves: { from: number; to: number; score: number; color: ColorId }[] = [];

    for (let f = 0; f < this.tubes.length; f++) {
      if (this.isTubeComplete(f)) continue; // don't ruin finished tubes
      for (let t = 0; t < this.tubes.length; t++) {
        if (f === t) continue;
        const check = this.canPour(f, t);
        if (check.valid && check.color) {
          let score = 0;
          const target = this.tubes[t];
          // Prefer pouring into non-empty tubes
          if (target.length > 0) score += 5;
          // Prefer pouring if it will fill the tube to 4
          if (target.length + check.amount === 4) score += 10;
          // Avoid emptying a single-color stack into an empty tube uselessly
          const isSourceAllOneColor = this.tubes[f].every(c => c === check.color);
          if (target.length === 0 && isSourceAllOneColor) {
            score -= 20; // moving a pure tube into empty tube is useless loop
          }
          possibleMoves.push({ from: f, to: t, score, color: check.color });
        }
      }
    }

    if (possibleMoves.length === 0) return null;
    possibleMoves.sort((a, b) => b.score - a.score);
    return possibleMoves[0];
  }

  private calculateRemainingEstimate(): number {
    let unseparatedSegments = 0;
    for (const tube of this.tubes) {
      if (tube.length === 0) continue;
      for (let i = 0; i < tube.length - 1; i++) {
        if (tube[i] !== tube[i + 1]) {
          unseparatedSegments++;
        }
      }
    }
    return Math.max(1, unseparatedSegments + 2);
  }
}
