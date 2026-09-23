import './index.css';
import { GameState } from './game-state';
import { DisplayManager } from './display';
import { GameRenderer } from './renderer';
import { ScreenManager } from './screen-manager';

export function initGame(onWinCallback?: (timeInSeconds: number) => void) {
  const state = new GameState();
  const screenManager = new ScreenManager(state);

  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  const display = new DisplayManager(canvas);
  display.setGridSize(state.level.size);

  const renderer = new GameRenderer(display, state);
  renderer.start();

  // Handle pointer/touch interaction
  const handleDown = (e: PointerEvent) => {
    canvas.setPointerCapture?.(e.pointerId);
    const grid = display.screenToGrid(e.clientX, e.clientY);
    if (grid) {
      state.handlePointerDown(grid.r, grid.c);
    }
  };

  const handleMove = (e: PointerEvent) => {
    if (!state.isDrawing) return;
    const grid = display.screenToGrid(e.clientX, e.clientY);
    if (grid) {
      state.handlePointerMove(grid.r, grid.c);
    }
  };

  const handleUp = (e: PointerEvent) => {
    try {
      if (canvas.hasPointerCapture?.(e.pointerId)) {
        canvas.releasePointerCapture?.(e.pointerId);
      }
    } catch {
      // Safe fallback
    }
    state.handlePointerUp();
  };

  canvas.addEventListener('pointerdown', handleDown, { passive: false });
  canvas.addEventListener('pointermove', handleMove, { passive: false });
  canvas.addEventListener('pointerup', handleUp, { passive: false });
  canvas.addEventListener('pointercancel', handleUp, { passive: false });
  canvas.addEventListener('pointerleave', handleUp, { passive: false });

  // Wiring callbacks
  state.onStateChange = () => {
    display.setGridSize(state.level.size);
    screenManager.updateHUD();
  };

  state.onPairConnected = (pair, pt) => {
    const screenPt = display.gridToScreenCenter(pt.r, pt.c);
    renderer.spawnSparkles(screenPt.x, screenPt.y, pair.color, 24);
  };

  state.onWin = (timeInSeconds: number, stars: number) => {
    renderer.spawnWinCelebration();
    screenManager.showVictoryModal(timeInSeconds, stars);
    if (onWinCallback) {
      onWinCallback(timeInSeconds);
    }
  };

  screenManager.onResizeNeeded = () => {
    display.resize();
  };

  // Initial HUD and size calibration
  display.resize();
  screenManager.updateHUD();
}

// Auto-boot application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initGame());
} else {
  initGame();
}

// Official Platform JS Modular API support
export function render(container: HTMLElement, onWin: (timeInSeconds: number) => void) {
  if (container && container.id !== 'root') {
    container.innerHTML = '<div id="root" class="w-full h-full flex items-center justify-center"></div>';
  }
  initGame(onWin);
}
