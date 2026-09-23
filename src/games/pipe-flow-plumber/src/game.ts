import { PipeTile, LevelConfig, Direction } from './types';
import { LEVELS, getPipeOpenings } from './levels';
import { generateProceduralLevel } from './procedural';
import { soundManager } from './audio';

export interface MoveRecord {
  row: number;
  col: number;
  prevRotation: number;
  newRotation: number;
}

export class GameManager {
  public currentLevelId: number = 1;
  public moves: number = 0;
  public bestMoves: Record<number, number> = {};
  public levelStars: Record<number, number> = {};
  public unlockedLevels: number = 1;
  public isProcedural: boolean = true;

  public grid: PipeTile[][] = [];
  public currentLevelConfig!: LevelConfig;
  public undoStack: MoveRecord[] = [];
  public isCompleted: boolean = false;

  // Callbacks for UI updates
  public onStateChange?: () => void;
  public onLevelComplete?: (levelId: number, moves: number, isNewBest: boolean, stars: number) => void;

  constructor() {
    this.loadSave();
    // Default to level 1 or saved progression
    const defaultLevel = Math.min(this.unlockedLevels || 1, 10);
    this.loadLevel(defaultLevel, true);
  }

  private loadSave() {
    try {
      const data = localStorage.getItem('pipe_flow_save');
      if (data) {
        const parsed = JSON.parse(data);
        this.unlockedLevels = Math.max(1, parsed.unlockedLevels || 1);
        this.bestMoves = parsed.bestMoves || {};
        this.levelStars = parsed.levelStars || {};
      }
    } catch {
      this.unlockedLevels = 1;
      this.bestMoves = {};
      this.levelStars = {};
    }
  }

  private saveGame() {
    try {
      localStorage.setItem(
        'pipe_flow_save',
        JSON.stringify({
          unlockedLevels: this.unlockedLevels,
          bestMoves: this.bestMoves,
          levelStars: this.levelStars,
        })
      );
    } catch {
      // Storage quota or disabled
    }
  }

  public getTotalStars(): number {
    return Object.values(this.levelStars).reduce((acc, s) => acc + s, 0);
  }

  public calculateStars(moves: number, parMoves: number): number {
    const par = Math.max(2, parMoves || 3);
    // 3 Stars: Solved within par or par + 1 moves (high precision)
    if (moves <= par + 1) return 3;
    // 2 Stars: Solved with moderate efficiency (par + 4 moves)
    if (moves <= par + 4) return 2;
    // 1 Star: Solved with extra exploration
    return 1;
  }

  private finishLevel() {
    this.isCompleted = true;
    const isNewBest =
      !this.bestMoves[this.currentLevelId] ||
      this.moves < this.bestMoves[this.currentLevelId];

    if (isNewBest) {
      this.bestMoves[this.currentLevelId] = this.moves;
    }

    const par = this.currentLevelConfig?.parMoves || 4;
    const stars = this.calculateStars(this.moves, par);
    const prevStars = this.levelStars[this.currentLevelId] || 0;
    if (stars > prevStars) {
      this.levelStars[this.currentLevelId] = stars;
    }

    // Unlock next level
    const nextId = this.currentLevelId + 1;
    if (nextId <= 10 && nextId > this.unlockedLevels) {
      this.unlockedLevels = nextId;
    }
    this.saveGame();

    soundManager.playLevelComplete();
    this.onLevelComplete?.(this.currentLevelId, this.moves, isNewBest, stars);
  }

  public loadLevel(levelId: number, useProcedural: boolean = this.isProcedural) {
    let config: LevelConfig;
    if (useProcedural) {
      config = generateProceduralLevel({ levelNumber: levelId });
    } else {
      config = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    }

    this.currentLevelId = config.id;
    this.currentLevelConfig = config;
    this.moves = 0;
    this.undoStack = [];
    this.isCompleted = false;

    // Build grid state from level config
    this.grid = [];
    for (let r = 0; r < config.rows; r++) {
      const row: PipeTile[] = [];
      for (let c = 0; c < config.cols; c++) {
        const cell = config.grid[r][c];
        const rot = cell.rotation % 360;
        row.push({
          row: r,
          col: c,
          type: cell.type,
          rotation: rot,
          displayRotation: rot,
          targetRotation: rot,
          isRotating: false,
          hasWater: false,
          waterFlowProgress: 0,
          locked: !!cell.locked,
          correctRotation: cell.correctRotation,
        });
      }
      this.grid.push(row);
    }

    // Initial water flow calculation
    this.computeWaterFlow(false);
    this.onStateChange?.();
  }

  public rotateTile(row: number, col: number) {
    if (this.isCompleted) return;

    const tile = this.grid[row]?.[col];
    if (!tile || tile.locked || tile.type === 'empty') return;

    const prevRot = tile.targetRotation;
    const newRot = (prevRot + 90) % 360;

    tile.targetRotation = newRot;
    tile.rotation = newRot;
    tile.isRotating = true;

    this.undoStack.push({
      row,
      col,
      prevRotation: prevRot,
      newRotation: newRot,
    });

    this.moves++;
    soundManager.playRotate();

    const reachedEnd = this.computeWaterFlow(true);
    this.onStateChange?.();

    if (reachedEnd && !this.isCompleted) {
      this.finishLevel();
    }
  }

  public undo() {
    if (this.isCompleted || this.undoStack.length === 0) return;

    const lastMove = this.undoStack.pop();
    if (!lastMove) return;

    const tile = this.grid[lastMove.row]?.[lastMove.col];
    if (!tile) return;

    tile.targetRotation = lastMove.prevRotation;
    tile.rotation = lastMove.prevRotation;
    tile.isRotating = true;

    if (this.moves > 0) this.moves--;
    soundManager.playRotate();

    this.computeWaterFlow(true);
    this.onStateChange?.();
  }

  public resetLevel(generateNewProcedural: boolean = true) {
    if (this.isProcedural && generateNewProcedural) {
      this.loadLevel(this.currentLevelId, true);
    } else {
      this.loadLevel(this.currentLevelId, false);
    }
  }

  public nextLevel() {
    const nextId = this.currentLevelId + 1;
    this.loadLevel(nextId, this.isProcedural);
  }

  public computeWaterFlow(playSoundEffect: boolean = false): boolean {
    const config = this.currentLevelConfig;
    const rows = config.rows;
    const cols = config.cols;

    // Reset water state
    const prevWaterState = this.grid.map(row => row.map(t => t.hasWater));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.grid[r][c].hasWater = false;
      }
    }

    // BFS queue for water flow starting at start tile
    const queue: { r: number; c: number }[] = [];
    const visited = new Set<string>();

    const startTile = this.grid[config.start.row][config.start.col];
    if (startTile) {
      startTile.hasWater = true;
      queue.push({ r: config.start.row, c: config.start.col });
      visited.add(`${config.start.row},${config.start.col}`);
    }

    let endTileConnected = false;

    // Direction delta: 0: Up (-1, 0), 1: Right (0, 1), 2: Down (1, 0), 3: Left (0, -1)
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const tile = this.grid[current.r][current.c];

      const openings = getPipeOpenings(tile.type, tile.targetRotation);

      for (const dir of openings) {
        const nr = current.r + dr[dir];
        const nc = current.c + dc[dir];

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const neighbor = this.grid[nr][nc];
          if (neighbor.type === 'empty') continue;

          // Required opposite opening on neighbor
          const requiredDir = ((dir + 2) % 4) as Direction;
          const neighborOpenings = getPipeOpenings(neighbor.type, neighbor.targetRotation);

          if (neighborOpenings.includes(requiredDir)) {
            const key = `${nr},${nc}`;
            if (!visited.has(key)) {
              visited.add(key);
              neighbor.hasWater = true;
              queue.push({ r: nr, c: nc });

              if (neighbor.type === 'end') {
                endTileConnected = true;
              }
            }
          }
        }
      }
    }

    // Check if new tiles received water to play rushing water sound
    if (playSoundEffect) {
      let newlyFilled = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (this.grid[r][c].hasWater && !prevWaterState[r][c]) {
            newlyFilled++;
          }
        }
      }
      if (newlyFilled > 0 && !endTileConnected) {
        soundManager.playWaterBurst();
      }
    }

    return endTileConnected;
  }

  public getHint(): { row: number; col: number; targetRot: number } | null {
    // Find the first misaligned pipe that has a defined correctRotation
    for (let r = 0; r < this.grid.length; r++) {
      for (let c = 0; c < this.grid[r].length; c++) {
        const tile = this.grid[r][c];
        if (
          !tile.locked &&
          tile.type !== 'empty' &&
          tile.correctRotation !== undefined &&
          (tile.targetRotation % 360) !== (tile.correctRotation % 360)
        ) {
          return { row: r, col: c, targetRot: tile.correctRotation };
        }
      }
    }
    return null;
  }

  public applyHint(): boolean {
    const hint = this.getHint();
    if (!hint) return false;

    const tile = this.grid[hint.row]?.[hint.col];
    if (!tile) return false;

    this.undoStack.push({
      row: hint.row,
      col: hint.col,
      prevRotation: tile.targetRotation,
      newRotation: hint.targetRot,
    });

    tile.targetRotation = hint.targetRot;
    tile.rotation = hint.targetRot;
    tile.isRotating = true;

    this.moves++;
    soundManager.playHint();

    const reachedEnd = this.computeWaterFlow(true);
    this.onStateChange?.();

    if (reachedEnd && !this.isCompleted) {
      this.finishLevel();
    }

    return true;
  }
}
