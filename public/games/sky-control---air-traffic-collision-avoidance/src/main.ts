import { DisplayManager } from './display';
import { GameState } from './game-state';
import { GameRenderer } from './renderer';
import { ScreenManager } from './screen-manager';
import { Waypoint } from './types';
import { sound } from './audio';

class SkyControlApp {
  private canvas: HTMLCanvasElement;
  private displayManager: DisplayManager;
  private state: GameState;
  private renderer: GameRenderer;
  private screenManager: ScreenManager;

  private lastTime: number = 0;
  private isPointerDown: boolean = false;
  private currentDrawingPlaneId: string | null = null;
  private minWaypointDist: number = 14;

  constructor() {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.displayManager = new DisplayManager(this.canvas);
    this.state = new GameState();
    this.renderer = new GameRenderer(this.displayManager.getContext());

    this.screenManager = new ScreenManager(
      this.state,
      (levelId) => this.handleStartLevel(levelId),
      () => this.displayManager.resize(),
      () => this.handleEmergencyScan()
    );

    this.displayManager.onResize((w, h) => {
      // Nothing needed on basic resize
    });

    this.bindPointerEvents();
    this.startLoop();
  }

  private handleStartLevel(levelId: number) {
    this.state.startLevel(levelId);
    this.screenManager.updateHUD();
    this.displayManager.resize();
  }

  private handleEmergencyScan() {
    this.state.activateEmergencyClearance(this.displayManager.width, this.displayManager.height);
  }

  private bindPointerEvents() {
    const canvas = this.canvas;

    const onPointerDown = (clientX: number, clientY: number) => {
      if (this.screenManager.currentScreen !== 'PLAYING') return;
      if (this.state.isGameOver || this.state.isPaused) return;

      const coords = this.displayManager.getGameCoordinates(clientX, clientY);
      this.isPointerDown = true;

      // Check if user clicked/touched an airplane
      let clickedPlane = null;
      for (const plane of this.state.planes) {
        const dist = Math.hypot(plane.x - coords.x, plane.y - coords.y);
        if (dist < 32) {
          clickedPlane = plane;
          break;
        }
      }

      if (clickedPlane) {
        this.state.selectPlane(clickedPlane.id);
        this.currentDrawingPlaneId = clickedPlane.id;
        this.state.isDrawingPath = true;
        this.state.activeDrawingPath = [{ x: clickedPlane.x, y: clickedPlane.y }];
        this.screenManager.updateHUD();
        sound.playRadioBlip();
      } else {
        // Clicked outside or on runway/beacon
        if (this.state.selectedPlaneId) {
          // Check if clicked near a runway
          const level = this.state.getCurrentLevel();
          let clickedRunway = null;
          for (const rw of level.runways) {
            const rx = rw.x * this.displayManager.width;
            const ry = rw.y * this.displayManager.height;
            if (Math.hypot(rx - coords.x, ry - coords.y) < 45) {
              clickedRunway = rw;
              break;
            }
          }

          if (clickedRunway) {
            this.state.directPlaneToRunway(
              this.state.selectedPlaneId,
              clickedRunway.id,
              this.displayManager.width,
              this.displayManager.height
            );
          } else {
            // Unselect plane if tapping open airspace
            this.state.selectPlane(null);
            this.screenManager.updateHUD();
          }
        }
      }
    };

    const onPointerMove = (clientX: number, clientY: number) => {
      if (!this.isPointerDown || !this.state.isDrawingPath) return;

      const coords = this.displayManager.getGameCoordinates(clientX, clientY);
      const path = this.state.activeDrawingPath;

      if (path.length > 0) {
        const lastWp = path[path.length - 1];
        const dist = Math.hypot(coords.x - lastWp.x, coords.y - lastWp.y);
        if (dist >= this.minWaypointDist) {
          path.push({ x: coords.x, y: coords.y });
          sound.playWaypointTick();
        }
      }
    };

    const onPointerUp = () => {
      if (this.isPointerDown && this.state.isDrawingPath && this.currentDrawingPlaneId) {
        const plane = this.state.planes.find((p) => p.id === this.currentDrawingPlaneId);
        if (plane && this.state.activeDrawingPath.length > 1) {
          // Remove first duplicate anchor point
          const cleanPath = [...this.state.activeDrawingPath];
          cleanPath.shift();
          plane.path = cleanPath;
          sound.playRadioBlip();
        }
      }

      this.isPointerDown = false;
      this.state.isDrawingPath = false;
      this.state.activeDrawingPath = [];
      this.currentDrawingPlaneId = null;
    };

    // Mouse listeners
    canvas.addEventListener('mousedown', (e) => {
      onPointerDown(e.clientX, e.clientY);
    });
    window.addEventListener('mousemove', (e) => {
      onPointerMove(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', () => {
      onPointerUp();
    });

    // Touch listeners
    canvas.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length > 0) {
          onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );
    window.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length > 0) {
          onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );
    window.addEventListener('touchend', () => {
      onPointerUp();
    });
    window.addEventListener('touchcancel', () => {
      onPointerUp();
    });
  }

  private startLoop() {
    const loop = (timestamp: number) => {
      if (!this.lastTime) this.lastTime = timestamp;
      const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
      this.lastTime = timestamp;

      if (this.screenManager.currentScreen === 'PLAYING') {
        const result = this.state.update(
          dt,
          this.displayManager.width,
          this.displayManager.height
        );

        if (result.showGameOverModal) {
          this.screenManager.showGameOverModal();
        } else if (result.hasWon) {
          setTimeout(() => {
            this.screenManager.showLevelWinModal();
          }, 800);
        }

        this.screenManager.updateHUD();

        this.renderer.render(
          this.state,
          this.displayManager.width,
          this.displayManager.height,
          dt
        );
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new SkyControlApp();
});
