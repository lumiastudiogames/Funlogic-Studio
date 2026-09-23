import { LevelData, NumberPair, PlayerProgress, Point } from './types';
import { LEVELS } from './levels';
import { audio } from './audio';

const STORAGE_KEY = 'number_link_flow_save_v1';

export class GameState {
  public currentLevelIndex: number = 0;
  public level: LevelData = LEVELS[0];
  
  // Paths: pairId -> Array of Points from start towards end
  public paths: Map<number, Point[]> = new Map();
  // History for undo: snapshot of paths
  public history: Map<number, Point[]>[] = [];

  // Active drawing state
  public isDrawing: boolean = false;
  public activePairId: number | null = null;
  public currentDrawingPath: Point[] = [];
  
  // Gameplay metrics
  public movesCount: number = 0;
  public timeElapsed: number = 0;
  public isTimerRunning: boolean = false;
  public isLevelWon: boolean = false;
  public timerInterval: number | null = null;

  // Saved progress
  public progress: PlayerProgress = {
    unlockedLevel: 1,
    stars: {},
    bestTimes: {},
    soundEnabled: true,
    musicEnabled: true,
  };

  // Event callbacks
  public onStateChange?: () => void;
  public onWin?: (timeInSeconds: number, stars: number) => void;
  public onPairConnected?: (pair: NumberPair, point: Point) => void;

  constructor() {
    this.loadProgress();
  }

  public loadProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.progress = {
          unlockedLevel: parsed.unlockedLevel || 1,
          stars: parsed.stars || {},
          bestTimes: parsed.bestTimes || {},
          soundEnabled: parsed.soundEnabled !== false,
          musicEnabled: parsed.musicEnabled !== false,
        };
      }
    } catch {
      // Fallback
    }
  }

  public saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch {
      // Fallback
    }
  }

  public setLevel(levelIndex: number) {
    if (levelIndex < 0 || levelIndex >= LEVELS.length) return;
    this.currentLevelIndex = levelIndex;
    this.level = LEVELS[levelIndex];
    this.resetLevelState();
  }

  public nextLevel(): boolean {
    if (this.currentLevelIndex < LEVELS.length - 1) {
      this.setLevel(this.currentLevelIndex + 1);
      return true;
    }
    return false;
  }

  public restartLevel() {
    this.resetLevelState();
  }

  private resetLevelState() {
    this.paths.clear();
    this.history = [];
    this.isDrawing = false;
    this.activePairId = null;
    this.currentDrawingPath = [];
    this.movesCount = 0;
    this.timeElapsed = 0;
    this.isLevelWon = false;
    
    this.stopTimer();
    this.startTimer();
    this.notify();
  }

  public startTimer() {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
    }
    this.isTimerRunning = true;
    this.timerInterval = window.setInterval(() => {
      if (this.isTimerRunning && !this.isLevelWon) {
        this.timeElapsed++;
        this.notify();
      }
    }, 1000);
  }

  public stopTimer() {
    this.isTimerRunning = false;
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  public pauseTimer() {
    this.isTimerRunning = false;
  }

  public resumeTimer() {
    if (!this.isLevelWon) {
      this.isTimerRunning = true;
    }
  }

  public getPair(id: number): NumberPair | undefined {
    return this.level.pairs.find(p => p.id === id);
  }

  public getPairAt(r: number, c: number): { pair: NumberPair; isStart: boolean } | null {
    for (const pair of this.level.pairs) {
      if (pair.start.r === r && pair.start.c === c) return { pair, isStart: true };
      if (pair.end.r === r && pair.end.c === c) return { pair, isStart: false };
    }
    return null;
  }

  public isEndpoint(r: number, c: number): boolean {
    return this.getPairAt(r, c) !== null;
  }

  public isPointInBounds(r: number, c: number): boolean {
    return r >= 0 && r < this.level.size && c >= 0 && c < this.level.size;
  }

  public areNeighbors(p1: Point, p2: Point): boolean {
    return Math.abs(p1.r - p2.r) + Math.abs(p1.c - p2.c) === 1;
  }

  // Find which pair owns a path through cell (r, c)
  public getPathAt(r: number, c: number): { pairId: number; index: number } | null {
    for (const [pairId, path] of this.paths.entries()) {
      for (let i = 0; i < path.length; i++) {
        if (path[i].r === r && path[i].c === c) {
          return { pairId, index: i };
        }
      }
    }
    return null;
  }

  private saveHistorySnapshot() {
    const snapshot = new Map<number, Point[]>();
    for (const [id, pts] of this.paths.entries()) {
      snapshot.set(id, pts.map(p => ({ ...p })));
    }
    this.history.push(snapshot);
    if (this.history.length > 25) {
      this.history.shift();
    }
  }

  public undo(): boolean {
    if (this.history.length === 0 || this.isLevelWon) return false;
    const prev = this.history.pop()!;
    this.paths = prev;
    audio.playTap();
    this.notify();
    return true;
  }

  // Start dragging from (r, c)
  public handlePointerDown(r: number, c: number) {
    if (this.isLevelWon || !this.isPointInBounds(r, c)) return;

    this.saveHistorySnapshot();

    const endpointInfo = this.getPairAt(r, c);
    if (endpointInfo) {
      // Tapped an endpoint
      const pair = endpointInfo.pair;
      this.activePairId = pair.id;
      this.isDrawing = true;

      // Start from this endpoint
      const startPt = endpointInfo.isStart ? pair.start : pair.end;
      this.paths.set(pair.id, [startPt]);
      audio.playDrawStep(0);
      this.notify();
      return;
    }

    // Tapped an existing path
    const pathInfo = this.getPathAt(r, c);
    if (pathInfo) {
      const pair = this.getPair(pathInfo.pairId);
      if (!pair) return;

      this.activePairId = pair.id;
      this.isDrawing = true;

      const currentPath = this.paths.get(pair.id) || [];
      // Truncate path up to this point
      const truncated = currentPath.slice(0, pathInfo.index + 1);
      this.paths.set(pair.id, truncated);
      audio.playDrawStep(truncated.length);
      this.notify();
      return;
    }
  }

  // Moving across cells
  public handlePointerMove(r: number, c: number) {
    if (!this.isDrawing || this.activePairId === null || !this.isPointInBounds(r, c) || this.isLevelWon) {
      return;
    }

    const pair = this.getPair(this.activePairId);
    if (!pair) return;

    let path = this.paths.get(pair.id) || [];
    if (path.length === 0) return;

    const lastPt = path[path.length - 1];
    if (lastPt.r === r && lastPt.c === c) return; // Same cell

    // Must be orthogonally adjacent to last cell in path
    if (!this.areNeighbors(lastPt, { r, c })) {
      return;
    }

    // If cell is already the second to last, player is backtracking
    if (path.length >= 2) {
      const secondLast = path[path.length - 2];
      if (secondLast.r === r && secondLast.c === c) {
        path.pop();
        this.paths.set(pair.id, path);
        audio.playDrawStep(path.length);
        this.notify();
        return;
      }
    }

    // Check if cell is in current path earlier (looping on self)
    const selfIdx = path.findIndex(p => p.r === r && p.c === c);
    if (selfIdx !== -1) {
      path = path.slice(0, selfIdx + 1);
      this.paths.set(pair.id, path);
      audio.playDrawStep(path.length);
      this.notify();
      return;
    }

    // Check if cell is an endpoint of ANOTHER pair
    const endpointInfo = this.getPairAt(r, c);
    if (endpointInfo && endpointInfo.pair.id !== pair.id) {
      // Cannot pass through other numbers
      return;
    }

    // Check if cell collides with another pair's path: cut that other path!
    const conflict = this.getPathAt(r, c);
    if (conflict && conflict.pairId !== pair.id) {
      const otherPath = this.paths.get(conflict.pairId) || [];
      const shortened = otherPath.slice(0, conflict.index);
      if (shortened.length <= 1) {
        this.paths.delete(conflict.pairId);
      } else {
        this.paths.set(conflict.pairId, shortened);
      }
      audio.playDisconnect();
    }

    // Add cell to active path
    path.push({ r, c });
    this.paths.set(pair.id, path);
    audio.playDrawStep(path.length);

    // Check if we reached the matching endpoint!
    if (endpointInfo && endpointInfo.pair.id === pair.id) {
      const isConnected = this.isPairConnected(pair.id);
      if (isConnected) {
        audio.playConnect();
        if (this.onPairConnected) {
          this.onPairConnected(pair, { r, c });
        }
        this.isDrawing = false;
        this.activePairId = null;
        this.movesCount++;
        this.checkWinCondition();
      }
    }

    this.notify();
  }

  // Pointer released
  public handlePointerUp() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.activePairId = null;
      this.movesCount++;
      this.checkWinCondition();
      this.notify();
    }
  }

  public isPairConnected(pairId: number): boolean {
    const pair = this.getPair(pairId);
    if (!pair) return false;
    const path = this.paths.get(pairId);
    if (!path || path.length < 2) return false;

    const first = path[0];
    const last = path[path.length - 1];

    const startsAtStart = (first.r === pair.start.r && first.c === pair.start.c && last.r === pair.end.r && last.c === pair.end.c);
    const startsAtEnd = (first.r === pair.end.r && first.c === pair.end.c && last.r === pair.start.r && last.c === pair.start.c);

    return startsAtStart || startsAtEnd;
  }

  public getConnectedPairsCount(): number {
    let count = 0;
    for (const pair of this.level.pairs) {
      if (this.isPairConnected(pair.id)) {
        count++;
      }
    }
    return count;
  }

  public getFlowCoveragePercentage(): number {
    const totalCells = this.level.size * this.level.size;
    const filledCells = new Set<string>();

    for (const path of this.paths.values()) {
      for (const pt of path) {
        filledCells.add(`${pt.r},${pt.c}`);
      }
    }

    // Also include lone endpoints if not connected yet
    for (const pair of this.level.pairs) {
      filledCells.add(`${pair.start.r},${pair.start.c}`);
      filledCells.add(`${pair.end.r},${pair.end.c}`);
    }

    return Math.min(100, Math.round((filledCells.size / totalCells) * 100));
  }

  public checkWinCondition(): boolean {
    if (this.isLevelWon) return true;

    const allConnected = this.level.pairs.every(p => this.isPairConnected(p.id));
    const coverage = this.getFlowCoveragePercentage();

    if (allConnected && coverage === 100) {
      this.isLevelWon = true;
      this.stopTimer();

      // Calculate Stars (3 stars = fast time, 2 stars = moderate, 1 star = solved)
      const targetTime = this.level.size * 10;
      let stars = 3;
      if (this.timeElapsed > targetTime * 2) {
        stars = 1;
      } else if (this.timeElapsed > targetTime * 1.3) {
        stars = 2;
      }

      // Update progress
      const prevStars = this.progress.stars[this.level.id] || 0;
      this.progress.stars[this.level.id] = Math.max(prevStars, stars);
      
      const prevBest = this.progress.bestTimes[this.level.id];
      if (!prevBest || this.timeElapsed < prevBest) {
        this.progress.bestTimes[this.level.id] = this.timeElapsed;
      }

      this.progress.unlockedLevel = Math.max(this.progress.unlockedLevel, this.level.id + 1);
      this.saveProgress();

      audio.playWin();

      if (this.onWin) {
        this.onWin(this.timeElapsed, stars);
      }

      // Platform PostMessage compliance
      window.parent.postMessage({ type: 'win', time: this.timeElapsed }, '*');

      return true;
    }
    return false;
  }

  // Provide a hint for an unsolved pair
  public applyHint(): boolean {
    if (this.isLevelWon) return false;

    this.saveHistorySnapshot();
    let solvedAny = false;

    for (const pair of this.level.pairs) {
      if (this.isPairConnected(pair.id)) continue;

      let validPath: Point[] | null = null;

      if (this.level.solution && this.level.solution[pair.id]) {
        let solPath = [...this.level.solution[pair.id]];
        if (solPath.length >= 2) {
          const first = solPath[0];
          const last = solPath[solPath.length - 1];
          if (first.r === pair.end.r && first.c === pair.end.c && last.r === pair.start.r && last.c === pair.start.c) {
            solPath.reverse();
          } else if (!(first.r === pair.start.r && first.c === pair.start.c && last.r === pair.end.r && last.c === pair.end.c)) {
            solPath = this.findPathForPair(pair) || solPath;
          }
        }
        validPath = solPath;
      } else {
        validPath = this.findPathForPair(pair);
      }

      if (validPath && validPath.length >= 2) {
        for (const pt of validPath) {
          const conf = this.getPathAt(pt.r, pt.c);
          if (conf && conf.pairId !== pair.id) {
            this.paths.delete(conf.pairId);
          }
        }
        this.paths.set(pair.id, validPath);
        solvedAny = true;
      }
    }

    if (solvedAny) {
      audio.playHint();
      this.checkWinCondition();
      this.notify();
      return true;
    }

    return false;
  }

  private findPathForPair(pair: NumberPair): Point[] | null {
    // Simple BFS route from start to end avoiding other endpoints
    const start = pair.start;
    const target = pair.end;
    const queue: Point[][] = [[start]];
    const visited = new Set<string>();
    visited.add(`${start.r},${start.c}`);

    const directions = [
      { r: -1, c: 0 },
      { r: 1, c: 0 },
      { r: 0, c: -1 },
      { r: 0, c: 1 }
    ];

    while (queue.length > 0) {
      const path = queue.shift()!;
      const curr = path[path.length - 1];

      if (curr.r === target.r && curr.c === target.c) {
        return path;
      }

      for (const d of directions) {
        const nr = curr.r + d.r;
        const nc = curr.c + d.c;
        const key = `${nr},${nc}`;

        if (!this.isPointInBounds(nr, nc) || visited.has(key)) continue;

        // Check if it's another pair's endpoint
        const ep = this.getPairAt(nr, nc);
        if (ep && ep.pair.id !== pair.id) continue;

        visited.add(key);
        queue.push([...path, { r: nr, c: nc }]);
      }
    }

    return null;
  }

  private notify() {
    if (this.onStateChange) {
      this.onStateChange();
    }
  }
}
