import { sound } from './audio';
import { BoardArray, ChessEngine, coordsToSquare, MoveCoord } from './chess-engine';
import { ProceduralChessGenerator } from './procedural-puzzles';
import { CHESS_PUZZLES } from './puzzles';
import { GameSaveData, Piece, Puzzle } from './types';

const SAVE_KEY = 'chess_mate_in_one_save';

export class GameStateManager {
  private currentLevelIndex: number = 0;
  private puzzleCache: Map<number, Puzzle> = new Map();
  private board: BoardArray = [];
  private selectedCoord: { file: number; rank: number } | null = null;
  private validDestinations: { file: number; rank: number }[] = [];
  private lastMove: { fromFile: number; fromRank: number; toFile: number; toRank: number } | null = null;
  private checkmateCoords: { file: number; rank: number } | null = null;

  // Level status
  private isLevelCompleted: boolean = false;
  private hintActive: boolean = false;
  private hintStep: number = 0; // 0 = none, 1 = piece highlight, 2 = full solution

  // Timers and metrics
  private levelStartTime: number = Date.now();
  private timerInterval: number | null = null;
  private elapsedSeconds: number = 0;

  // Persistent save
  private saveData: GameSaveData = {
    unlockedLevel: 1,
    completedLevels: [],
    stars: {},
    scores: {},
    soundEnabled: true,
    totalSolved: 0,
    bestStreak: 0,
    currentStreak: 0,
  };

  // Event callbacks
  private onStateChangeCb?: () => void;
  private onCheckmateWinCb?: (puzzle: Puzzle, seconds: number, score: number) => void;
  private onWrongMoveCb?: (msg: string) => void;

  constructor() {
    this.loadSave();
    this.initLevel(0);
  }

  public setCallbacks(cbs: {
    onStateChange?: () => void;
    onCheckmateWin?: (puzzle: Puzzle, seconds: number, score: number) => void;
    onWrongMove?: (msg: string) => void;
  }) {
    this.onStateChangeCb = cbs.onStateChange;
    this.onCheckmateWinCb = cbs.onCheckmateWin;
    this.onWrongMoveCb = cbs.onWrongMove;
  }

  private loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.saveData = {
          unlockedLevel: parsed.unlockedLevel || 1,
          completedLevels: parsed.completedLevels || [],
          stars: parsed.stars || {},
          scores: parsed.scores || {},
          soundEnabled: parsed.soundEnabled ?? true,
          totalSolved: parsed.totalSolved || 0,
          bestStreak: parsed.bestStreak || 0,
          currentStreak: parsed.currentStreak || 0,
        };
      }
    } catch {
      // Default initial state
    }
  }

  public save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.saveData));
    } catch {
      // Ignore
    }
  }

  public initLevel(index: number) {
    if (index < 0) index = 0;
    // Strict requirement: A player can ONLY access a level if the previous level was won
    const targetLevelNum = index + 1;
    if (targetLevelNum > this.saveData.unlockedLevel) {
      index = Math.max(0, this.saveData.unlockedLevel - 1);
    }

    this.currentLevelIndex = index;
    const puzzle = this.getCurrentPuzzle();
    this.board = ChessEngine.parseFen(puzzle.fen);
    this.selectedCoord = null;
    this.validDestinations = [];
    this.lastMove = null;
    this.checkmateCoords = null;
    this.isLevelCompleted = false;
    this.hintActive = false;
    this.hintStep = 0;

    this.levelStartTime = Date.now();
    this.elapsedSeconds = 0;
    this.startTimer();

    this.notify();
  }

  private startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = window.setInterval(() => {
      if (!this.isLevelCompleted) {
        this.elapsedSeconds = Math.floor((Date.now() - this.levelStartTime) / 1000);
        this.notify();
      }
    }, 1000);
  }

  public getCurrentPuzzle(): Puzzle {
    return this.getPuzzleAtIndex(this.currentLevelIndex);
  }

  public getPuzzleAtIndex(index: number): Puzzle {
    if (this.puzzleCache.has(index)) {
      return this.puzzleCache.get(index)!;
    }

    let puzzle: Puzzle;
    if (index < CHESS_PUZZLES.length) {
      puzzle = CHESS_PUZZLES[index];
    } else {
      puzzle = ProceduralChessGenerator.generatePuzzle(index);
    }

    this.puzzleCache.set(index, puzzle);
    return puzzle;
  }

  public getCurrentLevelIndex(): number {
    return this.currentLevelIndex;
  }

  public getBoard(): BoardArray {
    return this.board;
  }

  public getSelectedCoord() {
    return this.selectedCoord;
  }

  public getValidDestinations() {
    return this.validDestinations;
  }

  public getLastMove() {
    return this.lastMove;
  }

  public getCheckmateCoords() {
    return this.checkmateCoords;
  }

  public isCompleted(): boolean {
    return this.isLevelCompleted;
  }

  public getElapsedSeconds(): number {
    return this.elapsedSeconds;
  }

  public isHintActive(): boolean {
    return this.hintActive;
  }

  public getHintStep(): number {
    return this.hintStep;
  }

  public getSaveData(): GameSaveData {
    return this.saveData;
  }

  public getTotalScore(): number {
    return Object.values(this.saveData.scores).reduce((acc, s) => acc + s, 0);
  }

  public getHintPieceSquare(): { file: number; rank: number } | null {
    if (!this.hintActive || this.hintStep < 1) return null;
    const sol = this.getCurrentPuzzle().solution;
    const f = sol.from.charCodeAt(0) - 'a'.charCodeAt(0);
    const r = parseInt(sol.from[1], 10) - 1;
    return { file: f, rank: r };
  }

  public getHintTargetSquare(): { file: number; rank: number } | null {
    if (!this.hintActive || this.hintStep < 2) return null;
    const sol = this.getCurrentPuzzle().solution;
    const f = sol.to.charCodeAt(0) - 'a'.charCodeAt(0);
    const r = parseInt(sol.to[1], 10) - 1;
    return { file: f, rank: r };
  }

  public unlockHint() {
    sound.playHint();
    this.hintActive = true;
    this.hintStep = Math.min(this.hintStep + 1, 2);

    // Auto-select the hint piece if on step 1
    const hp = this.getHintPieceSquare();
    if (hp) {
      this.selectSquare(hp.file, hp.rank);
    }

    this.notify();
  }

  public selectSquare(file: number, rank: number) {
    if (this.isLevelCompleted) return;

    const piece = ChessEngine.getPiece(this.board, file, rank);

    // If clicking on an already selected piece, deselect
    if (this.selectedCoord && this.selectedCoord.file === file && this.selectedCoord.rank === rank) {
      this.selectedCoord = null;
      this.validDestinations = [];
      this.notify();
      return;
    }

    // If currently having a selected White piece, and clicking a valid destination
    if (this.selectedCoord) {
      const isDestination = this.validDestinations.some(d => d.file === file && d.rank === rank);
      if (isDestination) {
        this.executeMove(this.selectedCoord.file, this.selectedCoord.rank, file, rank);
        return;
      }
    }

    // Selecting a White piece
    if (piece && piece.color === 'w') {
      sound.playClick();
      this.selectedCoord = { file, rank };

      // Calculate all legal moves for this piece
      const allLegalMoves = ChessEngine.getLegalMoves(this.board, 'w');
      this.validDestinations = allLegalMoves
        .filter(m => m.fromFile === file && m.fromRank === rank)
        .map(m => ({ file: m.toFile, rank: m.toRank }));

      this.notify();
    } else {
      // Clicked on empty square or black piece without move
      this.selectedCoord = null;
      this.validDestinations = [];
      this.notify();
    }
  }

  public executeMove(fromFile: number, fromRank: number, toFile: number, toRank: number) {
    if (this.isLevelCompleted) return;

    const puzzle = this.getCurrentPuzzle();
    const targetPiece = ChessEngine.getPiece(this.board, toFile, toRank);
    const moveCoord: MoveCoord = {
      fromFile,
      fromRank,
      toFile,
      toRank,
      promotion: puzzle.solution.promotion || (toRank === 7 ? 'q' : undefined),
    };

    // Check if move is legal
    const legalMoves = ChessEngine.getLegalMoves(this.board, 'w');
    const isLegal = legalMoves.some(
      m => m.fromFile === fromFile && m.fromRank === fromRank && m.toFile === toFile && m.toRank === toRank
    );

    if (!isLegal) {
      sound.playError();
      this.notifyWrongMove('Illegal chess move.');
      return;
    }

    // Play move or capture audio
    if (targetPiece) {
      sound.playCapture();
    } else {
      sound.playMove();
    }

    // Make move on board
    this.board = ChessEngine.makeMove(this.board, moveCoord);
    this.lastMove = { fromFile, fromRank, toFile, toRank };
    this.selectedCoord = null;
    this.validDestinations = [];

    // Verify Checkmate against Black
    const isWinningMate = ChessEngine.isWinningCheckmate(
      ChessEngine.parseFen(puzzle.fen),
      moveCoord
    );

    if (isWinningMate) {
      // Find Black King position
      const blackKing = ChessEngine.findKing(this.board, 'b');
      this.checkmateCoords = blackKing ? { file: blackKing.file, rank: blackKing.rank } : { file: toFile, rank: toRank };

      this.handleVictory();
    } else {
      // Valid chess move, but does NOT result in immediate checkmate!
      sound.playError();
      const inCheck = ChessEngine.isKingInCheck(this.board, 'b');
      const msg = inCheck
        ? 'Good check! But Black can still escape or block. Find the single mate in 1!'
        : 'Not checkmate! White must deliver immediate checkmate in one move.';

      this.notifyWrongMove(msg);

      // Auto-revert board back after brief delay so player can try again
      setTimeout(() => {
        if (!this.isLevelCompleted) {
          this.board = ChessEngine.parseFen(puzzle.fen);
          this.lastMove = null;
          this.notify();
        }
      }, 1200);
    }

    this.notify();
  }

  private handleVictory() {
    this.isLevelCompleted = true;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    sound.playCheckmate();

    const puzzle = this.getCurrentPuzzle();
    const levelNum = puzzle.id;
    const timeSpent = Math.max(1, this.elapsedSeconds);

    // Calculate score: Base 1000 + Time Bonus - Hint Penalty
    let baseScore = 1000;
    const timeBonus = Math.max(0, 500 - timeSpent * 15);
    const hintPenalty = this.hintActive ? 300 : 0;
    const roundScore = Math.max(250, baseScore + timeBonus - hintPenalty);

    // Calculate stars (1-3)
    let stars = 3;
    if (this.hintActive) stars = 2;
    if (this.hintStep >= 2 || timeSpent > 45) stars = 1;

    // Update save progress
    if (!this.saveData.completedLevels.includes(levelNum)) {
      this.saveData.completedLevels.push(levelNum);
      this.saveData.totalSolved += 1;
      this.saveData.currentStreak += 1;
      if (this.saveData.currentStreak > this.saveData.bestStreak) {
        this.saveData.bestStreak = this.saveData.currentStreak;
      }
    }

    this.saveData.stars[levelNum] = Math.max(this.saveData.stars[levelNum] || 0, stars);
    this.saveData.scores[levelNum] = Math.max(this.saveData.scores[levelNum] || 0, roundScore);

    // Progressive unlocking: unlock next level strictly
    if (levelNum + 1 > this.saveData.unlockedLevel) {
      this.saveData.unlockedLevel = levelNum + 1;
    }

    this.save();

    // 1. Mandatory Platform Integration Rule (Section 9 of user instructions):
    // "window.parent.postMessage({ type: 'win', time: tempo }, '*')"
    try {
      window.parent.postMessage({ type: 'win', time: timeSpent }, '*');
    } catch {
      // Ignore if outside iframe
    }

    // 2. Trigger in-game callback
    if (this.onCheckmateWinCb) {
      this.onCheckmateWinCb(puzzle, timeSpent, roundScore);
    }
  }

  public nextLevel(): boolean {
    const nextIndex = this.currentLevelIndex + 1;
    const nextLevelNum = nextIndex + 1;
    // Strict requirement: A player can only pass to the next level after winning the previous one
    if (nextLevelNum <= this.saveData.unlockedLevel) {
      this.initLevel(nextIndex);
      return true;
    }
    return false;
  }

  public restartLevel() {
    this.initLevel(this.currentLevelIndex);
  }

  private notifyWrongMove(msg: string) {
    if (this.onWrongMoveCb) {
      this.onWrongMoveCb(msg);
    }
  }

  private notify() {
    if (this.onStateChangeCb) {
      this.onStateChangeCb();
    }
  }
}
