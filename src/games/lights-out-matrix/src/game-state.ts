/**
 * GameState handles the Lights Out Matrix logic, move history, level progression and persistence.
 */
import { LightsOutSolver, Point } from './solver';

export interface LevelConfig {
  id: number;
  name: string;
  rows: number;
  cols: number;
  scrambleMoves: number;
  parMoves: number;
}

export const LEVELS: LevelConfig[] = [
  { id: 1, name: "Tutorial: 3x3 Prime", rows: 3, cols: 3, scrambleMoves: 3, parMoves: 3 },
  { id: 2, name: "3x3 Corner Cross", rows: 3, cols: 3, scrambleMoves: 4, parMoves: 4 },
  { id: 3, name: "3x3 Center Glow", rows: 3, cols: 3, scrambleMoves: 5, parMoves: 4 },
  { id: 4, name: "4x4 Grid Genesis", rows: 4, cols: 4, scrambleMoves: 5, parMoves: 5 },
  { id: 5, name: "4x4 Alternator", rows: 4, cols: 4, scrambleMoves: 6, parMoves: 6 },
  { id: 6, name: "5x5 Classic Matrix", rows: 5, cols: 5, scrambleMoves: 6, parMoves: 6 },
  { id: 7, name: "5x5 Quantum Mesh", rows: 5, cols: 5, scrambleMoves: 8, parMoves: 7 },
  { id: 8, name: "5x5 Diamond Wire", rows: 5, cols: 5, scrambleMoves: 9, parMoves: 8 },
  { id: 9, name: "5x5 Binary Eclipse", rows: 5, cols: 5, scrambleMoves: 10, parMoves: 9 },
  { id: 10, name: "5x5 Neon Circuit", rows: 5, cols: 5, scrambleMoves: 11, parMoves: 9 },
  { id: 11, name: "5x5 Master Void", rows: 5, cols: 5, scrambleMoves: 12, parMoves: 10 },
  { id: 12, name: "5x5 Apex Dark", rows: 5, cols: 5, scrambleMoves: 14, parMoves: 11 },
];

export interface SaveData {
  unlockedLevel: number;
  bestMoves: Record<number, number>;
  stars: Record<number, number>;
}

export class GameState {
  public rows: number = 5;
  public cols: number = 5;
  public board: boolean[][] = [];
  public initialBoard: boolean[][] = [];
  public currentLevel: number = 6; // Default to the 5x5 Classic Matrix from image
  public moves: number = 0;
  public history: { r: number; c: number }[] = [];
  public startTime: number = 0;
  public elapsedSeconds: number = 0;
  public timerInterval: number | null = null;
  public isWon: boolean = false;
  public activeHint: Point | null = null;
  public save: SaveData = {
    unlockedLevel: 1,
    bestMoves: {},
    stars: {},
  };

  constructor() {
    this.loadSave();
    // Start at highest unlocked level up to 6
    this.currentLevel = Math.min(Math.max(this.save.unlockedLevel, 1), 6);
    this.initLevel(this.currentLevel);
  }

  public loadSave() {
    try {
      const stored = localStorage.getItem('lights_out_save');
      if (stored) {
        this.save = JSON.parse(stored);
      }
    } catch {
      // fallback
    }
  }

  public persistSave() {
    try {
      localStorage.setItem('lights_out_save', JSON.stringify(this.save));
    } catch {
      // ignore
    }
  }

  public initLevel(levelId: number) {
    this.currentLevel = levelId;
    const config = LEVELS.find(l => l.id === levelId) || LEVELS[5]; // default 5x5
    this.rows = config.rows;
    this.cols = config.cols;
    this.resetGame(config.scrambleMoves);
  }

  /**
   * Generates a guaranteed solvable puzzle by toggling from all-off state.
   */
  public resetGame(scrambleCount?: number) {
    this.moves = 0;
    this.history = [];
    this.isWon = false;
    this.activeHint = null;
    this.elapsedSeconds = 0;
    this.startTimer();

    const count = scrambleCount ?? (LEVELS.find(l => l.id === this.currentLevel)?.scrambleMoves || 7);

    // 1. Start all ON (target winning state)
    this.board = Array.from({ length: this.rows }, () => new Array(this.cols).fill(true));

    // 2. Toggling random coordinates guaranteed to result in a solvable board
    const picked = new Set<string>();
    for (let i = 0; i < count; i++) {
      let r: number, c: number, key: string;
      let attempts = 0;
      do {
        r = Math.floor(Math.random() * this.rows);
        c = Math.floor(Math.random() * this.cols);
        key = `${r},${c}`;
        attempts++;
      } while (picked.has(key) && attempts < 20);

      picked.add(key);
      this.toggleInternal(r, c);
    }

    // Ensure at least 3 bulbs are OFF (so player must turn them ON)
    let offCount = this.getTotalBulbs() - this.getOnCount();
    if (offCount < 3) {
      const r = Math.floor(this.rows / 2);
      const c = Math.floor(this.cols / 2);
      this.toggleInternal(r, c);
    }

    // Clone initial board for the Reset button
    this.initialBoard = this.board.map(row => [...row]);
  }

  /**
   * Resets the board back to its exact initial configuration
   */
  public restartCurrentBoard() {
    this.board = this.initialBoard.map(row => [...row]);
    this.moves = 0;
    this.history = [];
    this.isWon = false;
    this.activeHint = null;
    this.elapsedSeconds = 0;
    this.startTimer();
  }

  public startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.startTime = Date.now() - this.elapsedSeconds * 1000;
    this.timerInterval = window.setInterval(() => {
      if (!this.isWon) {
        this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
      }
    }, 1000);
  }

  public stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Internal toggle without counting player moves
   */
  private toggleInternal(r: number, c: number) {
    const deltas = [
      [0, 0],   // Self
      [-1, 0],  // Up
      [1, 0],   // Down
      [0, -1],  // Left
      [0, 1],   // Right
    ];

    for (const [dr, dc] of deltas) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
        this.board[nr][nc] = !this.board[nr][nc];
      }
    }
  }

  /**
   * Player action: click bulb (r, c)
   */
  public playerClickBulb(r: number, c: number): { affected: Point[]; wasTurningOn: boolean; won: boolean } {
    if (this.isWon) {
      return { affected: [], wasTurningOn: false, won: true };
    }

    // Clear active hint if player moves
    this.activeHint = null;

    const wasOn = this.board[r][c];
    this.toggleInternal(r, c);
    this.moves++;
    this.history.push({ r, c });

    const affected: Point[] = [
      { r, c },
      ...(r > 0 ? [{ r: r - 1, c }] : []),
      ...(r < this.rows - 1 ? [{ r: r + 1, c }] : []),
      ...(c > 0 ? [{ r, c: c - 1 }] : []),
      ...(c < this.cols - 1 ? [{ r, c: c + 1 }] : []),
    ];

    // Check victory: all lights are ON
    this.isWon = this.checkVictory();
    if (this.isWon) {
      this.stopTimer();
      this.handleVictory();
    }

    return {
      affected,
      wasTurningOn: !wasOn,
      won: this.isWon,
    };
  }

  /**
   * Undo last move
   */
  public undo(): Point | null {
    if (this.history.length === 0 || this.isWon) return null;
    const last = this.history.pop()!;
    this.toggleInternal(last.r, last.c);
    this.moves = Math.max(0, this.moves - 1);
    this.activeHint = null;
    return last;
  }

  public checkVictory(): boolean {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (!this.board[r][c]) {
          return false;
        }
      }
    }
    return true;
  }

  private handleVictory() {
    const lvl = this.currentLevel;
    const config = LEVELS.find(l => l.id === lvl);
    const par = config ? config.parMoves : 8;

    // Stars calculation: 3 stars for <= par, 2 stars for <= par * 1.5, 1 star otherwise
    let stars = 1;
    if (this.moves <= par) stars = 3;
    else if (this.moves <= Math.ceil(par * 1.5)) stars = 2;

    const prevBest = this.save.bestMoves[lvl] || Infinity;
    if (this.moves < prevBest) {
      this.save.bestMoves[lvl] = this.moves;
    }

    const prevStars = this.save.stars[lvl] || 0;
    if (stars > prevStars) {
      this.save.stars[lvl] = stars;
    }

    // Unlock next level
    if (lvl + 1 <= LEVELS.length) {
      this.save.unlockedLevel = Math.max(this.save.unlockedLevel, lvl + 1);
    }

    this.persistSave();
  }

  public getOnCount(): number {
    let count = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c]) count++;
      }
    }
    return count;
  }

  public getTotalBulbs(): number {
    return this.rows * this.cols;
  }

  public getBestMovesForCurrent(): number | null {
    return this.save.bestMoves[this.currentLevel] ?? null;
  }

  public requestHint(): Point | null {
    const hint = LightsOutSolver.getNextHint(this.board);
    this.activeHint = hint;
    return hint;
  }
}
