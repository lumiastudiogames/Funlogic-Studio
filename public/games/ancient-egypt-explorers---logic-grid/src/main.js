/**
 * Main Application Entry Point
 * Pure Vanilla JavaScript Game Initialization
 */
import './index.css';
import { ScreenManager } from './screen-manager.js';
import { DisplayManager } from './display.js';
import { GameRenderer } from './renderer.js';
import { gameState } from './game-state.js';

export function render(container, onWin) {
  if (onWin) {
    gameState.onWinCallback = onWin;
  }

  const screenManager = new ScreenManager(container);

  // Initialize Desktop Canvas & Display Manager
  const canvas = document.getElementById('game-canvas');
  if (canvas) {
    const renderer = new GameRenderer(canvas);
    screenManager.setRenderer(renderer);

    new DisplayManager(canvas, (w, h) => {
      renderer.setDimensions(w, h);
    });
  }

  // Initialize Mobile Canvas if present
  const mobileCanvas = document.getElementById('mobile-game-canvas');
  if (mobileCanvas) {
    const mobileRenderer = new GameRenderer(mobileCanvas);
    new DisplayManager(mobileCanvas, (w, h) => {
      mobileRenderer.setDimensions(w, h);
    });
  }

  return {
    gameState,
    screenManager,
  };
}

// Auto bootstrap on root container
const appContainer = document.getElementById('app') || document.getElementById('root');
if (appContainer) {
  render(appContainer);
}
