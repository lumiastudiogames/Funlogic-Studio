// Metro Subway Train Yard - Main Controller and Entry Point
import './index.css';
import { LEVELS } from './levels';
import { gameState } from './state';
import { YardEngine } from './engine';
import { YardRenderer } from './renderer';
import { DisplayManager } from './display';
import { UIController } from './ui';
import { audio } from './audio';

export class MetroSubwayGame {
  private root: HTMLElement;
  private ui: UIController;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private displayManager: DisplayManager;
  private engine: YardEngine | null = null;
  private renderer: YardRenderer | null = null;
  private animationFrameId: number | null = null;
  private lastTime: number = 0;
  private currentLevelIndex: number = 0;
  private onWinCallback?: (timeSec: number) => void;

  constructor(root: HTMLElement, onWin?: (timeSec: number) => void) {
    this.root = root;
    this.onWinCallback = onWin;
    this.ui = new UIController(this.root);

    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;

    this.displayManager = new DisplayManager(this.canvas, (w, h) => {
      if (this.engine) {
        this.engine.resize(w, h);
      }
    });

    this.setupUIHandlers();
    this.setupCanvasPointerInput();
    this.startRenderLoop();
  }

  private setupUIHandlers() {
    this.ui.onStartLevel = (levelId: number) => {
      this.loadLevel(levelId);
    };

    this.ui.onRetryLevel = () => {
      this.loadLevel(this.currentLevelIndex + 1);
    };

    this.ui.onNextLevel = () => {
      const nextId = Math.min(30, this.currentLevelIndex + 2);
      this.loadLevel(nextId);
    };

    this.ui.onTogglePause = () => {
      if (!this.engine) return;
      const willPause = !this.engine.isPaused;
      this.engine.setPaused(willPause);
      if (willPause) {
        this.ui.showPauseModal();
      } else {
        this.ui.closeAllModals();
      }
    };

    this.ui.onToggleSpeed = () => {
      if (!this.engine) return;
      const newMult = this.engine.speedMultiplier === 1 ? 2 : 1;
      this.engine.setSpeedMultiplier(newMult);
      this.ui.updateHUD(
        this.engine.level,
        this.engine.trains.filter(t => t.state === 'ENTERED_TUNNEL').length,
        this.engine.trains.length,
        Math.floor(this.engine.gameTime),
        newMult
      );
    };

    this.ui.onActivateHint = () => {
      if (!this.renderer) return;
      this.renderer.showHintRoutes = true;
      setTimeout(() => {
        if (this.renderer) this.renderer.showHintRoutes = false;
      }, 7000);
    };
  }

  private setupCanvasPointerInput() {
    const handleTap = (clientX: number, clientY: number) => {
      if (!this.engine || this.engine.isGameOver || this.engine.isCompleted || this.engine.isPaused) {
        return;
      }

      const { x, y } = this.displayManager.getGameCoordinates(clientX, clientY);

      // Check if clicked a switch
      const sw = this.engine.getSwitchAt(x, y);
      if (sw) {
        this.engine.toggleSwitch(sw.id);
        return;
      }

      // Check if clicked a train
      const train = this.engine.getTrainAt(x, y);
      if (train) {
        this.engine.toggleTrainMovement(train.id);
        return;
      }
    };

    this.canvas.addEventListener('pointerdown', (e: PointerEvent) => {
      e.preventDefault();
      handleTap(e.clientX, e.clientY);
    });
  }

  public loadLevel(levelId: number) {
    const targetId = Math.max(1, Math.min(30, levelId));
    this.currentLevelIndex = targetId - 1;
    const levelConfig = LEVELS[this.currentLevelIndex] || LEVELS[0];

    const rect = this.canvas.parentElement?.getBoundingClientRect() || { width: 800, height: 500 };
    const width = Math.max(320, Math.floor(rect.width));
    const height = Math.max(240, Math.floor(rect.height));

    this.engine = new YardEngine(levelConfig, width, height);

    if (!this.renderer) {
      this.renderer = new YardRenderer(this.ctx, this.engine);
    } else {
      this.renderer.setEngine(this.engine);
      this.renderer.showHintRoutes = false;
    }

    // Callbacks from Engine
    this.engine.onWinCallback = (timeSec: number) => {
      const { stars } = gameState.completeLevel(levelConfig.id, timeSec, levelConfig.targetTimeSec);
      this.ui.showWinModal(levelConfig, timeSec, stars);

      // Official Platform Win notification
      if (this.onWinCallback) {
        this.onWinCallback(timeSec);
      }
      try {
        window.parent?.postMessage({ type: 'win', time: timeSec }, '*');
      } catch {}
    };

    this.engine.onCrashCallback = (reason: string) => {
      this.ui.showCrashModal(reason);
    };

    this.ui.setScreen('PLAYING');
    this.ui.updateHUD(
      levelConfig,
      0,
      this.engine.trains.length,
      0,
      this.engine.speedMultiplier
    );

    // Initial resize sync
    this.displayManager.resize();
  }

  private startRenderLoop() {
    this.lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
      this.lastTime = currentTime;

      if (this.engine) {
        this.engine.update(dt);
        if (this.renderer) {
          this.renderer.render();
        }

        // Periodic HUD update
        const cleared = this.engine.trains.filter(t => t.state === 'ENTERED_TUNNEL').length;
        this.ui.updateHUD(
          this.engine.level,
          cleared,
          this.engine.trains.length,
          Math.floor(this.engine.gameTime),
          this.engine.speedMultiplier
        );
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  public destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    audio.stopTrainHum();
  }
}

// Global initialization function for pure vanilla JS / platform mounting
export function render(container: HTMLElement, onWin?: (timeInSeconds: number) => void) {
  return new MetroSubwayGame(container, onWin);
}

// Bootstrap automatically on DOM load
const rootElement = document.getElementById('root');
if (rootElement) {
  render(rootElement);
}
