import { GameStateManager } from './game-state.js';
import { MatchstickRenderer } from './renderer.js';
import { DisplayManager } from './display.js';
import { ScreenManager } from './screen-manager.js';
import { audio } from './audio.js';

// Initialize Game Engine
const gameState = new GameStateManager();
const screenManager = new ScreenManager(gameState);

// Canvas and Display Setup
const canvas = document.getElementById('game-canvas');
const renderer = new MatchstickRenderer(canvas, gameState);
const displayManager = new DisplayManager(canvas, (w, h) => {
  renderer.setDimensions(w, h);
});
screenManager.setDisplayManager(displayManager);

// Set Callbacks
gameState.setCallbacks(
  (elapsedTime) => {
    // On Win
    renderer.triggerWinCelebration();
    showVictoryToast(elapsedTime);
  },
  () => {
    // On State Change
    updateHUD();
    renderer.updateSegmentLayout();
  }
);

// Start rendering loop immediately
renderer.startRenderLoop();

// Start immediately on PLAYING screen so game is ready and visible
screenManager.setScreen('PLAYING');

// Initial Display Resize
function forceResize() {
  displayManager.resize();
  renderer.updateSegmentLayout();
  updateHUD();
}

setTimeout(forceResize, 30);
setTimeout(forceResize, 150);
window.addEventListener('resize', forceResize);

// ==================== HUD & UI SYNC ====================
function updateHUD() {
  const currentLvl = gameState.getCurrentLevel();
  const moves = gameState.getMovesCount();
  const held = gameState.getHeldMatch();
  const isWon = gameState.isLevelWon();

  // Header badges
  const levelBadge = document.getElementById('header-level-badge');
  const difficultyBadge = document.getElementById('header-difficulty-badge');
  if (levelBadge) levelBadge.textContent = `LEVEL ${currentLvl.id}`;
  if (difficultyBadge) difficultyBadge.textContent = currentLvl.difficulty.toUpperCase();

  // Moves Counter
  const movesCounter = document.getElementById('moves-counter');
  if (movesCounter) {
    movesCounter.textContent = `${moves} / 1`;
    if (moves > 0 && !isWon) {
      movesCounter.classList.add('text-amber-600');
    } else {
      movesCounter.classList.remove('text-amber-600');
    }
  }

  // Undo button state
  const btnUndo = document.getElementById('btn-undo');
  if (btnUndo) {
    const canUndo = moves > 0 || held !== null;
    btnUndo.disabled = !canUndo || isWon;
    btnUndo.style.opacity = (canUndo && !isWon) ? '1' : '0.5';
  }

  // Equation display & status banner
  const eqDisplay = document.getElementById('current-equation-display');
  const eqStatusText = document.getElementById('equation-status-text');
  const eqStatusPill = document.getElementById('equation-status-pill');
  const touchInstruction = document.getElementById('touch-instruction');

  const { equationString, isTrue } = gameState.parseCurrentEquation();

  if (eqDisplay) {
    eqDisplay.textContent = equationString || currentLvl.initialEquation;
  }

  if (eqStatusPill && eqStatusText) {
    if (isWon || isTrue) {
      eqStatusPill.className = 'flex items-center gap-1.5 text-xs font-bold text-emerald-600';
      eqStatusText.textContent = 'Correct!';
    } else if (moves >= 1) {
      eqStatusPill.className = 'flex items-center gap-1.5 text-xs font-bold text-amber-600';
      eqStatusText.textContent = 'Incorrect';
    } else if (held) {
      eqStatusPill.className = 'flex items-center gap-1.5 text-xs font-bold text-blue-600';
      eqStatusText.textContent = 'Placing...';
    } else {
      eqStatusPill.className = 'flex items-center gap-1.5 text-xs font-bold text-rose-600';
      eqStatusText.textContent = 'Incorrect';
    }
  }

  if (touchInstruction) {
    if (held) {
      touchInstruction.textContent = '📍 Drag or drop into an open dashed slot';
      touchInstruction.classList.add('animate-pulse-subtle');
    } else if (moves >= 1) {
      touchInstruction.textContent = '🔄 Use "UNDO" or "RESET" to try another move';
      touchInstruction.classList.remove('animate-pulse-subtle');
    } else {
      touchInstruction.textContent = '🖐️ Drag & Drop 1 matchstick to fix the equation';
      touchInstruction.classList.remove('animate-pulse-subtle');
    }
  }

  // Hint Counter Badge
  const hintCounter = document.getElementById('hint-counter-badge');
  if (hintCounter) {
    hintCounter.textContent = String(gameState.getSave().hintsAvailable);
  }

  // Sound Icon Sync
  updateSoundIcon();
}

function updateSoundIcon() {
  const onIcon = document.getElementById('sound-icon-on');
  const offIcon = document.getElementById('sound-icon-off');
  if (onIcon && offIcon) {
    if (audio.isEnabled()) {
      onIcon.classList.remove('hidden');
      offIcon.classList.add('hidden');
    } else {
      onIcon.classList.add('hidden');
      offIcon.classList.remove('hidden');
    }
  }
}

function showVictoryToast(elapsedTime) {
  const toast = document.getElementById('victory-toast');
  const eqText = document.getElementById('victory-equation-text');
  const { equationString } = gameState.parseCurrentEquation();

  if (eqText) eqText.textContent = `${equationString} (em ${elapsedTime}s)`;
  if (toast) toast.classList.remove('hidden');
}

function hideVictoryToast() {
  const toast = document.getElementById('victory-toast');
  if (toast) toast.classList.add('hidden');
}

// ==================== DRAG & DROP & TOUCH INTERACTION ====================
let isPointerDown = false;
let dragStartPos = { x: 0, y: 0 };
let hasMovedBeyondThreshold = false;

function getCoordinates(e) {
  const clientX = 'touches' in e && e.touches.length > 0 
    ? e.touches[0].clientX 
    : 'changedTouches' in e && e.changedTouches.length > 0 
      ? e.changedTouches[0].clientX 
      : e.clientX;

  const clientY = 'touches' in e && e.touches.length > 0 
    ? e.touches[0].clientY 
    : 'changedTouches' in e && e.changedTouches.length > 0 
      ? e.changedTouches[0].clientY 
      : e.clientY;

  return displayManager.getGameCoordinates(clientX, clientY);
}

function handlePointerDown(e) {
  if (gameState.isLevelWon()) return;

  isPointerDown = true;
  hasMovedBeyondThreshold = false;
  const { x, y } = getCoordinates(e);
  dragStartPos = { x, y };

  const held = gameState.getHeldMatch();

  if (!held) {
    const targetSeg = renderer.getSegmentAt(x, y, 28);
    if (targetSeg && targetSeg.hasMatch) {
      gameState.pickUpMatch(targetSeg);
      renderer.setHoveredSegment(null, { x, y });
    }
  } else {
    const emptySeg = renderer.getClosestEmptySegment(x, y, 36);
    if (emptySeg) {
      gameState.placeHeldMatch(emptySeg);
      renderer.setHoveredSegment(null, { x, y });
    } else {
      renderer.setHoveredSegment(null, { x, y });
    }
  }
}

function handlePointerMove(e) {
  const { x, y } = getCoordinates(e);

  if (isPointerDown) {
    const distMoved = Math.hypot(x - dragStartPos.x, y - dragStartPos.y);
    if (distMoved > 8) {
      hasMovedBeyondThreshold = true;
    }
  }

  const held = gameState.getHeldMatch();

  if (held) {
    const candidateEmpty = renderer.getClosestEmptySegment(x, y, 48);
    renderer.setHoveredSegment(candidateEmpty, { x, y });
  } else {
    const candidateMatch = renderer.getSegmentAt(x, y, 24);
    renderer.setHoveredSegment(candidateMatch, { x, y });
  }
}

function handlePointerUp(e) {
  if (!isPointerDown) return;
  isPointerDown = false;

  const { x, y } = getCoordinates(e);
  const held = gameState.getHeldMatch();

  if (held) {
    const targetEmpty = renderer.getClosestEmptySegment(x, y, 46);

    if (targetEmpty) {
      gameState.placeHeldMatch(targetEmpty);
    } else if (hasMovedBeyondThreshold) {
      gameState.cancelHeldMatch();
    }
  }

  renderer.setHoveredSegment(null, { x, y });
}

// Attach Pointer Events
canvas.addEventListener('mousedown', handlePointerDown);
window.addEventListener('mousemove', handlePointerMove);
window.addEventListener('mouseup', handlePointerUp);

canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  handlePointerDown(e);
}, { passive: false });

window.addEventListener('touchmove', (e) => {
  if (isPointerDown) {
    e.preventDefault();
  }
  handlePointerMove(e);
}, { passive: false });

window.addEventListener('touchend', (e) => {
  handlePointerUp(e);
});

// ==================== BUTTON EVENT LISTENERS ====================
// Header Navigation
document.getElementById('btn-header-menu')?.addEventListener('click', () => {
  screenManager.setScreen('MAIN_MENU');
});

document.getElementById('btn-header-levels')?.addEventListener('click', () => {
  screenManager.setScreen('LEVEL_SELECT');
});

document.getElementById('btn-sound-toggle')?.addEventListener('click', () => {
  audio.toggleSound();
  updateSoundIcon();
});

document.getElementById('btn-undo')?.addEventListener('click', () => {
  gameState.undoMove();
});

// Gameplay Actions
document.getElementById('btn-reset')?.addEventListener('click', () => {
  hideVictoryToast();
  gameState.resetLevel();
});

document.getElementById('btn-hint')?.addEventListener('click', () => {
  screenManager.openHintModal();
});

document.getElementById('btn-next-level')?.addEventListener('click', () => {
  hideVictoryToast();
  const hasNext = gameState.nextLevel();
  if (!hasNext) {
    screenManager.setScreen('LEVEL_SELECT');
  }
});

// Main Menu Actions
document.getElementById('btn-menu-play')?.addEventListener('click', () => {
  screenManager.setScreen('PLAYING');
  forceResize();
});

document.getElementById('btn-menu-levels')?.addEventListener('click', () => {
  screenManager.setScreen('LEVEL_SELECT');
});

document.getElementById('btn-menu-how-to-play')?.addEventListener('click', () => {
  screenManager.setScreen('HOW_TO_PLAY');
});

// Level Select & Tutorial Back
document.getElementById('btn-levels-back')?.addEventListener('click', () => {
  screenManager.setScreen('MAIN_MENU');
});

document.getElementById('btn-tutorial-back')?.addEventListener('click', () => {
  screenManager.setScreen('MAIN_MENU');
});

document.getElementById('btn-tutorial-play')?.addEventListener('click', () => {
  screenManager.setScreen('PLAYING');
  forceResize();
});

// Hint Modal Actions
document.getElementById('btn-skip-hint')?.addEventListener('click', () => {
  screenManager.closeHintModal();
});

document.getElementById('btn-claim-hint')?.addEventListener('click', () => {
  screenManager.claimRewardedHint();
});

document.getElementById('btn-close-hint')?.addEventListener('click', () => {
  screenManager.closeHintModal();
});

// Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  if (screenManager.getCurrentScreen() !== 'PLAYING') return;

  if (e.key === 'z' || e.key === 'Z') {
    gameState.undoMove();
  } else if (e.key === 'r' || e.key === 'R') {
    hideVictoryToast();
    gameState.resetLevel();
  } else if (e.key === 'h' || e.key === 'H') {
    screenManager.openHintModal();
  } else if (e.key === 'Escape') {
    screenManager.setScreen('MAIN_MENU');
  }
});

// Export modular renderer interface for platform integration
export function render(container, onWin) {
  gameState.setCallbacks(onWin, () => {
    updateHUD();
    renderer.updateSegmentLayout();
  });
  displayManager.resize();
}
