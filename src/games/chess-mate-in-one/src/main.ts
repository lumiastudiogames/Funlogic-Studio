import './index.css';
import { ChessEngine } from './chess-engine';
import { DisplayManager } from './display';
import { GameStateManager } from './game-state';
import { ChessRenderer } from './renderer';
import { ScreenController } from './screen-manager';
import { GameScreen, Piece } from './types';

class ChessGameApp {
  private gameState: GameStateManager;
  private screenController: ScreenController;
  private displayManager: DisplayManager | null = null;
  private renderer: ChessRenderer | null = null;

  // Pointer drag state
  private isDragging: boolean = false;
  private dragOrigin: { file: number; rank: number } | null = null;
  private draggedPiece: Piece | null = null;

  constructor() {
    const rootEl = document.getElementById('app-root')!;
    this.gameState = new GameStateManager();
    this.screenController = new ScreenController(rootEl, this.gameState, (screen) => {
      this.handleScreenChange(screen);
    });

    this.setupGameStateCallbacks();
    this.screenController.render();
    this.handleScreenChange(this.screenController.getCurrentScreen());
  }

  private setupGameStateCallbacks() {
    this.gameState.setCallbacks({
      onStateChange: () => {
        this.syncRendererState();
        this.screenController.updatePlayingHud();
        this.updateHudMetrics();
      },
      onCheckmateWin: (_puzzle, _seconds, _score) => {
        const checkmateCoords = this.gameState.getCheckmateCoords();
        if (this.renderer && checkmateCoords) {
          this.renderer.spawnCheckmateCelebration(checkmateCoords.file, checkmateCoords.rank);
        }
        this.syncRendererState();
        this.screenController.showVictoryModal();
        this.updateHudMetrics();
      },
      onWrongMove: (msg: string) => {
        this.screenController.showWrongMoveToast(msg);
      },
    });
  }

  private handleScreenChange(screen: GameScreen) {
    if (screen === 'PLAYING') {
      // Initialize Canvas, DisplayManager, and Renderer
      setTimeout(() => {
        this.initCanvasAndRenderer();
      }, 20);
    } else {
      if (this.renderer) {
        this.renderer.stopLoop();
        this.renderer = null;
      }
      if (this.displayManager) {
        this.displayManager.destroy();
        this.displayManager = null;
      }
    }
  }

  private initCanvasAndRenderer() {
    const canvas = document.getElementById('chess-canvas') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.displayManager) {
      this.displayManager.destroy();
    }
    if (this.renderer) {
      this.renderer.stopLoop();
    }

    const ctx = canvas.getContext('2d')!;
    this.renderer = new ChessRenderer(ctx, {
      board: this.gameState.getBoard(),
      selectedCoord: this.gameState.getSelectedCoord(),
      validDestinations: this.gameState.getValidDestinations(),
      lastMove: this.gameState.getLastMove(),
      hintPiece: this.gameState.getHintPieceSquare(),
      hintTarget: this.gameState.getHintTargetSquare(),
      draggingPiece: null,
      checkmateCoords: this.gameState.getCheckmateCoords(),
    });

    this.displayManager = new DisplayManager(canvas, (w, h) => {
      if (this.renderer) {
        this.renderer.updateDimensions(w, h);
      }
    });

    this.setupCanvasPointerEvents(canvas);
    this.renderer.startLoop();
    this.syncRendererState();
  }

  private syncRendererState() {
    if (!this.renderer) return;

    this.renderer.setState({
      board: this.gameState.getBoard(),
      selectedCoord: this.gameState.getSelectedCoord(),
      validDestinations: this.gameState.getValidDestinations(),
      lastMove: this.gameState.getLastMove(),
      hintPiece: this.gameState.getHintPieceSquare(),
      hintTarget: this.gameState.getHintTargetSquare(),
      draggingPiece: this.isDragging && this.draggedPiece && this.dragOrigin ? {
        piece: this.draggedPiece,
        originFile: this.dragOrigin.file,
        originRank: this.dragOrigin.rank,
        currentX: 0,
        currentY: 0,
      } : null,
      checkmateCoords: this.gameState.getCheckmateCoords(),
    });
  }

  private updateHudMetrics() {
    const scoreEl = document.getElementById('score-counter');
    if (scoreEl) {
      scoreEl.innerText = String(this.gameState.getTotalScore());
    }
  }

  private setupCanvasPointerEvents(canvas: HTMLCanvasElement) {
    canvas.style.touchAction = 'none';

    const handlePointerDown = (clientX: number, clientY: number, e?: Event) => {
      if (!this.displayManager || !this.renderer || this.gameState.isCompleted()) return;

      const coords = this.displayManager.getGameCoordinates(clientX, clientY);
      const square = this.renderer.getSquareAt(coords.x, coords.y);
      if (!square) return;

      const board = this.gameState.getBoard();
      const piece = ChessEngine.getPiece(board, square.file, square.rank);

      // Check if user clicked on a valid destination for already selected piece
      const currentSelected = this.gameState.getSelectedCoord();
      const validDests = this.gameState.getValidDestinations();
      if (currentSelected && validDests.some(d => d.file === square.file && d.rank === square.rank)) {
        if (e && e.cancelable) e.preventDefault();
        this.gameState.executeMove(currentSelected.file, currentSelected.rank, square.file, square.rank);
        return;
      }

      // Check if clicking on an interactive White piece
      if (piece && piece.color === 'w') {
        if (e && e.cancelable) e.preventDefault();
        this.isDragging = true;
        this.dragOrigin = square;
        this.draggedPiece = piece;

        this.gameState.selectSquare(square.file, square.rank);

        this.renderer.setState({
          draggingPiece: {
            piece,
            originFile: square.file,
            originRank: square.rank,
            currentX: coords.x,
            currentY: coords.y,
          },
        });
      } else {
        this.gameState.selectSquare(square.file, square.rank);
      }
    };

    const handlePointerMove = (clientX: number, clientY: number, e?: Event) => {
      if (!this.isDragging || !this.displayManager || !this.renderer || !this.draggedPiece || !this.dragOrigin) return;
      if (e && e.cancelable) e.preventDefault();

      const coords = this.displayManager.getGameCoordinates(clientX, clientY);
      this.renderer.setState({
        draggingPiece: {
          piece: this.draggedPiece,
          originFile: this.dragOrigin.file,
          originRank: this.dragOrigin.rank,
          currentX: coords.x,
          currentY: coords.y,
        },
      });
    };

    const handlePointerUp = (clientX: number, clientY: number, e?: Event) => {
      if (!this.isDragging || !this.displayManager || !this.renderer || !this.dragOrigin) return;
      if (e && e.cancelable) e.preventDefault();

      const coords = this.displayManager.getGameCoordinates(clientX, clientY);
      const targetSquare = this.renderer.getSquareAt(coords.x, coords.y);

      const origin = this.dragOrigin;
      this.isDragging = false;
      this.dragOrigin = null;
      this.draggedPiece = null;

      this.renderer.setState({ draggingPiece: null });

      if (targetSquare && (targetSquare.file !== origin.file || targetSquare.rank !== origin.rank)) {
        this.gameState.executeMove(origin.file, origin.rank, targetSquare.file, targetSquare.rank);
      }
    };

    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
      handlePointerDown(e.clientX, e.clientY, e);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        handlePointerMove(e.clientX, e.clientY, e);
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (this.isDragging) {
        handlePointerUp(e.clientX, e.clientY, e);
      }
    });

    // Touch events for mobile
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        handlePointerDown(t.clientX, t.clientY, e);
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length > 0) {
        const t = e.touches[0];
        handlePointerMove(t.clientX, t.clientY, e);
      }
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      if (this.isDragging && e.changedTouches.length > 0) {
        const t = e.changedTouches[0];
        handlePointerUp(t.clientX, t.clientY, e);
      }
    }, { passive: false });
  }
}

// Boot application
window.addEventListener('DOMContentLoaded', () => {
  new ChessGameApp();
});
