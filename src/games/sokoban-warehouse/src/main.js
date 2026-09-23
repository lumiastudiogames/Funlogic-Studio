import './index.css';
import { SokobanGame, loadSaveData, writeSaveData } from './game/gameState.js';
import { Renderer2D } from './game/renderer2d.js';
import { LEVELS } from './game/levels.js';
import { generateProceduralLevel, solveSokobanLevel } from './game/proceduralGenerator.js';
import { sound } from './audio/sound.js';
import { getIconSvg } from './ui/icons.js';

let game = null;
let renderer = null;
let currentLevelIndex = 0;
let isProceduralMode = false;
let currentProceduralData = null;
let activeModal = null;
let activeHint = null;
let autoSolveInterval = null;
let isAutoSolving = false;
let autoSolveStepIndex = 0;
let autoSolveSteps = [];
let autoSolveSpeed = 300;

let saveData = loadSaveData();
sound.setEnabled(saveData.soundEnabled);

const root = document.getElementById('root');

function initApp() {
  root.innerHTML = `
    <div class="relative w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      <header id="header-bar" class="shrink-0 glass-panel z-20 px-3 py-2.5 flex items-center justify-between gap-2 shadow-xl border-b border-slate-800">
        <div class="flex items-center gap-2.5 min-w-0">
          <button id="btn-home" class="btn-tactile p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 flex items-center justify-center shrink-0" title="Home Menu">
            ${getIconSvg('home', 'w-4 h-4')}
          </button>
          <div class="flex flex-col min-w-0">
            <span id="level-title" class="font-extrabold text-xs sm:text-sm tracking-wide text-amber-400 truncate">Warehouse Bay 1</span>
            <div id="level-subtitle" class="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <span>Moves: <strong id="move-counter" class="text-white">0</strong></span>
              <span>·</span>
              <span>Par: <strong id="par-target" class="text-slate-300">14</strong></span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button id="btn-solution" class="btn-tactile px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-700/60 text-xs font-bold flex items-center gap-1.5" title="View Solution">
            ${getIconSvg('eye', 'w-3.5 h-3.5 text-indigo-400')}
            <span class="hidden md:inline">Solution</span>
          </button>
          <button id="btn-hint" class="btn-tactile px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 btn-glow-amber" title="Get Hint">
            ${getIconSvg('lightbulb', 'w-3.5 h-3.5 text-amber-400')}
            <span class="hidden sm:inline">Hint</span>
          </button>
          <button id="btn-undo" class="btn-tactile p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center" title="Undo Move">
            ${getIconSvg('undo', 'w-4 h-4')}
          </button>
          <button id="btn-reset" class="btn-tactile p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center" title="Reset Bay">
            ${getIconSvg('rotateCcw', 'w-4 h-4')}
          </button>
        </div>

        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button id="btn-levels-modal" class="btn-tactile px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5" title="Select Level">
            ${getIconSvg('grid', 'w-3.5 h-3.5 text-blue-400')}
            <span class="hidden lg:inline">Bays</span>
          </button>
          <button id="btn-sound-toggle" class="btn-tactile p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center" title="Toggle Sound">
            ${getIconSvg(saveData.soundEnabled ? 'volume2' : 'volumeX', 'w-4 h-4')}
          </button>
          <button id="btn-rules-modal" class="btn-tactile p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center" title="How to Play">
            ${getIconSvg('help', 'w-4 h-4')}
          </button>
        </div>
      </header>

      <main class="relative flex-1 w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center p-2 sm:p-4">
        <canvas id="game-canvas" class="block w-full h-full touch-none cursor-grab active:cursor-grabbing rounded-2xl shadow-2xl border border-slate-800/60"></canvas>

        <div id="deadlock-banner" class="hidden absolute top-6 left-1/2 -translate-x-1/2 bg-rose-950/95 border border-rose-500/80 text-rose-200 px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-bounce z-10">
          ${getIconSvg('alertTriangle', 'w-4 h-4 text-rose-400 shrink-0')}
          <span>Box Trapped in Corner! Press Reset or Undo</span>
        </div>

        <div id="hint-banner" class="hidden absolute top-6 left-1/2 -translate-x-1/2 bg-amber-500/95 text-slate-950 font-black px-5 py-2.5 rounded-full text-xs shadow-2xl flex items-center gap-2.5 animate-pulse z-10">
          ${getIconSvg('lightbulb', 'w-4 h-4 text-slate-950 shrink-0')}
          <span id="hint-banner-text">PUSH HIGHLIGHTED CARGO IN ARROW DIRECTION</span>
        </div>

        <div id="autosolve-banner" class="hidden absolute top-6 left-1/2 -translate-x-1/2 bg-indigo-600/95 text-white font-extrabold px-5 py-2.5 rounded-full text-xs shadow-2xl flex items-center gap-2.5 animate-pulse z-10">
          <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>EXECUTING AUTO-SOLVE...</span>
        </div>
      </main>

      <footer class="shrink-0 glass-panel z-20 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
        <div class="flex items-center gap-2">
          ${getIconSvg('navigation', 'w-3.5 h-3.5 text-blue-400')}
          <span class="hidden sm:inline font-medium">Swipe on screen or use WASD / Arrow Keys to move worker</span>
          <span class="sm:hidden font-medium">Swipe screen to move worker</span>
        </div>
        <div id="total-stars-pill" class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-extrabold text-[11px]">
          ${getIconSvg('star', 'w-3.5 h-3.5 text-amber-400')}
          <span id="total-stars-count">0 / 36 Stars</span>
        </div>
      </footer>

      <div id="modal-container" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div id="modal-content" class="w-full max-w-lg glass-modal rounded-2xl p-6 shadow-2xl relative text-slate-100 my-auto">
        </div>
      </div>
    </div>
  `;

  const canvas = document.getElementById('game-canvas');
  renderer = new Renderer2D(canvas);
  renderer.resize();

  window.addEventListener('resize', () => {
    renderer.resize();
  });

  loadLevel(currentLevelIndex);
  setupEventListeners();
  showModal('menu');

  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  if (game && renderer) {
    game.updateAnimation(0.016);

    const deadlockBanner = document.getElementById('deadlock-banner');
    if (game.checkDeadlock() && !game.isCompleted) {
      deadlockBanner.classList.remove('hidden');
    } else {
      deadlockBanner.classList.add('hidden');
    }

    renderer.render({
      grid: game.grid,
      cols: game.cols,
      rows: game.rows,
      player: game.player,
      playerVisual: game.playerVisual,
      playerFacing: game.playerFacing,
      isPushing: game.isPushing,
      crates: game.crates,
      targets: game.targets,
      decorations: game.decorations,
      hintCrate: activeHint ? activeHint.crate : undefined,
      hintDirection: activeHint ? activeHint.direction : undefined,
      isCompleted: game.isCompleted,
    }, timestamp);
  }

  requestAnimationFrame(gameLoop);
}

function loadLevel(idx) {
  stopAutoSolve();
  activeHint = null;
  updateHintBanner();

  if (isProceduralMode) {
    const proc = generateProceduralLevel({ difficulty: 'medium' });
    currentProceduralData = proc;
    game = new SokobanGame(proc.level);
  } else {
    currentLevelIndex = Math.max(0, Math.min(idx, LEVELS.length - 1));
    const levelDef = LEVELS[currentLevelIndex];
    game = new SokobanGame(levelDef);
  }

  game.onWinCallback = handleLevelWin;
  game.onStateChange = updateHeaderUI;

  updateHeaderUI();
}

function updateHeaderUI() {
  if (!game) return;

  const levelTitle = document.getElementById('level-title');
  const moveCounter = document.getElementById('move-counter');
  const parTarget = document.getElementById('par-target');
  const totalStarsCount = document.getElementById('total-stars-count');

  if (levelTitle) levelTitle.textContent = isProceduralMode ? game.level.name : `Bay ${game.level.id}: ${game.level.name}`;
  if (moveCounter) moveCounter.textContent = game.moves;
  if (parTarget) parTarget.textContent = game.level.parMoves;

  let starsSum = 0;
  for (const id in saveData.stars) {
    starsSum += saveData.stars[id] || 0;
  }
  if (totalStarsCount) totalStarsCount.textContent = `${starsSum} / 36 Stars`;
}

function updateHintBanner() {
  const hintBanner = document.getElementById('hint-banner');
  if (activeHint) {
    hintBanner.classList.remove('hidden');
  } else {
    hintBanner.classList.add('hidden');
  }
}

function setupEventListeners() {
  document.getElementById('btn-home').addEventListener('click', () => {
    sound.playClick();
    showModal('menu');
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    game.reset();
    activeHint = null;
    updateHintBanner();
  });

  document.getElementById('btn-undo').addEventListener('click', () => {
    game.undo();
    activeHint = null;
    updateHintBanner();
  });

  document.getElementById('btn-hint').addEventListener('click', () => {
    sound.playClick();
    showModal('hint');
  });

  document.getElementById('btn-solution').addEventListener('click', () => {
    sound.playClick();
    showModal('solution');
  });

  document.getElementById('btn-levels-modal').addEventListener('click', () => {
    sound.playClick();
    showModal('levels');
  });

  document.getElementById('btn-rules-modal').addEventListener('click', () => {
    sound.playClick();
    showModal('rules');
  });

  document.getElementById('btn-sound-toggle').addEventListener('click', () => {
    const newEnabled = !saveData.soundEnabled;
    saveData.soundEnabled = newEnabled;
    sound.setEnabled(newEnabled);
    writeSaveData(saveData);

    const btn = document.getElementById('btn-sound-toggle');
    btn.innerHTML = getIconSvg(newEnabled ? 'volume2' : 'volumeX', 'w-4 h-4');
    if (newEnabled) sound.playClick();
  });

  window.addEventListener('keydown', (e) => {
    if (activeModal) return;

    let dir = null;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') dir = 'up';
    else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dir = 'down';
    else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') dir = 'left';
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') dir = 'right';

    if (dir) {
      e.preventDefault();
      game.move(dir);
    } else if (e.key === 'z' || e.key === 'Z') {
      game.undo();
    } else if (e.key === 'r' || e.key === 'R') {
      game.reset();
    }
  });

  const canvas = document.getElementById('game-canvas');
  let touchStartX = 0;
  let touchStartY = 0;
  let touchTime = 0;

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchTime = Date.now();
    }
  }, { passive: true });

  canvas.addEventListener('touchend', (e) => {
    if (activeModal || !game) return;
    if (e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const dt = Date.now() - touchTime;

      if (Math.hypot(dx, dy) > 25 && dt < 450) {
        let dir = null;
        if (Math.abs(dx) > Math.abs(dy)) {
          dir = dx > 0 ? 'right' : 'left';
        } else {
          dir = dy > 0 ? 'down' : 'up';
        }
        if (dir) {
          game.move(dir);
        }
      }
    }
  }, { passive: true });
}

function showModal(type) {
  activeModal = type;
  const container = document.getElementById('modal-container');
  const content = document.getElementById('modal-content');

  container.classList.remove('hidden');

  switch (type) {
    case 'menu':
      renderStartMenu(content);
      break;
    case 'levels':
      renderLevelSelectModal(content);
      break;
    case 'rules':
      renderRulesModal(content);
      break;
    case 'hint':
      renderHintModal(content);
      break;
    case 'solution':
      renderSolutionModal(content);
      break;
    case 'win':
      renderWinModal(content);
      break;
    default:
      closeModal();
      break;
  }
}

function closeModal() {
  activeModal = null;
  const container = document.getElementById('modal-container');
  container.classList.add('hidden');
}

function renderStartMenu(content) {
  content.innerHTML = `
    <div class="text-center space-y-6">
      <div class="space-y-2">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
          Sokoban <span class="text-amber-400">Warehouse</span>
        </h1>
        <p class="text-slate-400 text-xs sm:text-sm">
          Push cargo crates onto designated target storage zones without trapping them against walls.
        </p>
      </div>

      <div class="space-y-3 pt-2">
        <button id="menu-btn-campaign" class="w-full btn-tactile py-3.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-lg flex items-center justify-between group btn-glow-amber">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-slate-950/20">
              ${getIconSvg('play', 'w-5 h-5 text-slate-950')}
            </div>
            <div class="text-left">
              <div>CAMPAIGN MODE</div>
              <div class="text-[11px] font-semibold text-slate-900/80">12 Precision Industrial Bays</div>
            </div>
          </div>
          ${getIconSvg('arrowRight', 'w-5 h-5 transform group-hover:translate-x-1 transition-transform')}
        </button>

        <button id="menu-btn-procedural" class="w-full btn-tactile py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-sm sm:text-base shadow-lg flex items-center justify-between group btn-glow-blue">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg bg-slate-950/30">
              ${getIconSvg('shuffle', 'w-5 h-5 text-indigo-200')}
            </div>
            <div class="text-left">
              <div>PROCEDURAL MODE</div>
              <div class="text-[11px] font-semibold text-indigo-200/80">Endless Solvably-Generated Bays</div>
            </div>
          </div>
          ${getIconSvg('arrowRight', 'w-5 h-5 transform group-hover:translate-x-1 transition-transform')}
        </button>

        <div class="grid grid-cols-2 gap-3 pt-1">
          <button id="menu-btn-levels" class="btn-tactile py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2">
            ${getIconSvg('grid', 'w-4 h-4 text-blue-400')}
            <span>Select Bay</span>
          </button>
          <button id="menu-btn-rules" class="btn-tactile py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2">
            ${getIconSvg('help', 'w-4 h-4 text-emerald-400')}
            <span>How to Play</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('menu-btn-campaign').addEventListener('click', () => {
    sound.playClick();
    isProceduralMode = false;
    loadLevel(currentLevelIndex);
    closeModal();
  });

  document.getElementById('menu-btn-procedural').addEventListener('click', () => {
    sound.playClick();
    isProceduralMode = true;
    loadLevel(0);
    closeModal();
  });

  document.getElementById('menu-btn-levels').addEventListener('click', () => {
    sound.playClick();
    renderLevelSelectModal(content);
  });

  document.getElementById('menu-btn-rules').addEventListener('click', () => {
    sound.playClick();
    renderRulesModal(content);
  });
}

function renderLevelSelectModal(content) {
  let gridHtml = '';

  LEVELS.forEach((lvl, idx) => {
    const isUnlocked = idx === 0 || idx < saveData.unlockedLevels;
    const stars = saveData.stars[lvl.id] || 0;
    const best = saveData.bestMoves[lvl.id];

    gridHtml += `
      <button data-level-index="${idx}" ${!isUnlocked ? 'disabled' : ''} class="btn-tactile relative p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
        isUnlocked
          ? idx === currentLevelIndex && !isProceduralMode
            ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
            : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200'
          : 'bg-slate-900/60 border-slate-800/80 text-slate-600 cursor-not-allowed opacity-60'
      }">
        <div class="flex items-center justify-between w-full text-[10px] text-slate-400 font-semibold mb-1">
          <span>Bay #${lvl.id}</span>
          ${!isUnlocked ? getIconSvg('lock', 'w-3 h-3 text-slate-600') : ''}
        </div>

        <div class="font-extrabold text-xs sm:text-sm text-slate-100 truncate w-full mb-1">
          ${lvl.name}
        </div>

        <div class="flex items-center justify-center gap-0.5 my-1">
          ${[1, 2, 3].map(s => `
            ${getIconSvg('star', `w-3.5 h-3.5 ${s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`)}
          `).join('')}
        </div>

        <div class="text-[10px] text-slate-400 font-medium">
          ${best ? `Best: <span class="text-amber-300 font-bold">${best}</span>` : `Par: <span class="text-slate-300">${lvl.parMoves}</span>`}
        </div>
      </button>
    `;
  });

  content.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
          ${getIconSvg('grid', 'w-5 h-5 text-amber-400')}
          <span>Select Warehouse Bay</span>
        </h2>
        <button id="modal-close-btn" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
          ${getIconSvg('x', 'w-5 h-5')}
        </button>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
        ${gridHtml}
      </div>
    </div>
  `;

  document.getElementById('modal-close-btn').addEventListener('click', closeModal);

  content.querySelectorAll('[data-level-index]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.currentTarget.getAttribute('data-level-index'), 10);
      sound.playClick();
      isProceduralMode = false;
      currentLevelIndex = idx;
      loadLevel(idx);
      closeModal();
    });
  });
}

function renderRulesModal(content) {
  content.innerHTML = `
    <div class="space-y-5">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
          ${getIconSvg('help', 'w-5 h-5 text-emerald-400')}
          <span>Warehouse Operations Manual</span>
        </h2>
        <button id="modal-close-btn" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
          ${getIconSvg('x', 'w-5 h-5')}
        </button>
      </div>

      <div class="space-y-3.5 text-xs sm:text-sm text-slate-300">
        <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
          <div class="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            ${getIconSvg('package', 'w-5 h-5')}
          </div>
          <div>
            <div class="font-extrabold text-white mb-0.5">Primary Objective</div>
            <div>Push every wooden cargo crate onto a glowing green storage target pad.</div>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
          <div class="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
            ${getIconSvg('navigation', 'w-5 h-5')}
          </div>
          <div>
            <div class="font-extrabold text-white mb-0.5">Worker Movement</div>
            <div>Use keyboard WASD / Arrow Keys or swipe directly on touch screens to navigate the warehouse floor.</div>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start gap-3">
          <div class="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
            ${getIconSvg('alertTriangle', 'w-5 h-5')}
          </div>
          <div>
            <div class="font-extrabold text-white mb-0.5">Push Rules & Corner Hazards</div>
            <div>You can only push one crate at a time. You cannot pull crates. Avoid pushing crates into wall corners without target pads!</div>
          </div>
        </div>
      </div>

      <button id="rules-btn-gotit" class="w-full btn-tactile py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm">
        GOT IT, LET'S PLAY
      </button>
    </div>
  `;

  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('rules-btn-gotit').addEventListener('click', () => {
    sound.playClick();
    closeModal();
  });
}

function renderHintModal(content) {
  const hint = game.getHint();

  if (!hint) {
    content.innerHTML = `
      <div class="text-center space-y-4">
        <div class="p-3 rounded-full bg-slate-800 w-12 h-12 mx-auto flex items-center justify-center text-amber-400">
          ${getIconSvg('lightbulb', 'w-6 h-6')}
        </div>
        <h3 class="text-lg font-extrabold text-white">No Direct Hint Available</h3>
        <p class="text-xs text-slate-400">All cargo crates are already placed or locked in place. Try resetting or using Undo!</p>
        <button id="modal-close-btn" class="w-full btn-tactile py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-white">
          CLOSE
        </button>
      </div>
    `;
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    return;
  }

  content.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
          ${getIconSvg('lightbulb', 'w-5 h-5 text-amber-400')}
          <span>Smart Operational Hint</span>
        </h2>
        <button id="modal-close-btn" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
          ${getIconSvg('x', 'w-5 h-5')}
        </button>
      </div>

      <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm space-y-2">
        <div class="font-extrabold text-amber-300 flex items-center gap-1.5">
          ${getIconSvg('navigation', 'w-4 h-4 text-amber-400')}
          <span>Recommended Next Move:</span>
        </div>
        <p class="text-slate-300">${hint.explanation}</p>
      </div>

      <div class="flex items-center gap-3">
        <button id="btn-activate-hint" class="flex-1 btn-tactile py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 btn-glow-amber">
          ${getIconSvg('lightbulb', 'w-4 h-4')}
          <span>HIGHLIGHT ON BOARD</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('btn-activate-hint').addEventListener('click', () => {
    sound.playClick();
    activeHint = hint;
    updateHintBanner();
    closeModal();
  });
}

function renderSolutionModal(content) {
  const solution = isProceduralMode && currentProceduralData ? currentProceduralData.solution : solveSokobanLevel(game.level);

  if (!solution.solvable) {
    content.innerHTML = `
      <div class="text-center space-y-4">
        <h3 class="text-lg font-extrabold text-white">Solution Unreachable</h3>
        <p class="text-xs text-slate-400">The current board state cannot be solved. Please reset the level.</p>
        <button id="modal-close-btn" class="w-full btn-tactile py-2.5 rounded-xl bg-slate-800 font-bold text-xs text-white">
          CLOSE
        </button>
      </div>
    `;
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    return;
  }

  content.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-extrabold text-white flex items-center gap-2">
          ${getIconSvg('eye', 'w-5 h-5 text-indigo-400')}
          <span>Optimal Solution Sequence</span>
        </h2>
        <button id="modal-close-btn" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white">
          ${getIconSvg('x', 'w-5 h-5')}
        </button>
      </div>

      <div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
        <span class="text-slate-400">Minimum Moves Needed:</span>
        <span class="font-extrabold text-amber-400 text-sm">${solution.moves.length} Steps (${solution.pushes} Pushes)</span>
      </div>

      <div class="flex items-center gap-3">
        <button id="btn-exec-autosolve" class="flex-1 btn-tactile py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 btn-glow-blue">
          ${getIconSvg('playCircle', 'w-5 h-5')}
          <span>EXECUTE AUTO-SOLVE</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('btn-exec-autosolve').addEventListener('click', () => {
    sound.playClick();
    closeModal();
    startAutoSolve(solution.steps);
  });
}

function startAutoSolve(steps) {
  stopAutoSolve();
  game.reset();

  isAutoSolving = true;
  autoSolveStepIndex = 0;
  autoSolveSteps = steps;

  const banner = document.getElementById('autosolve-banner');
  banner.classList.remove('hidden');

  autoSolveInterval = setInterval(() => {
    if (autoSolveStepIndex < autoSolveSteps.length && !game.isCompleted) {
      const step = autoSolveSteps[autoSolveStepIndex];
      game.move(step.direction);
      autoSolveStepIndex++;
    } else {
      stopAutoSolve();
    }
  }, autoSolveSpeed);
}

function stopAutoSolve() {
  if (autoSolveInterval) {
    clearInterval(autoSolveInterval);
    autoSolveInterval = null;
  }
  isAutoSolving = false;
  const banner = document.getElementById('autosolve-banner');
  if (banner) banner.classList.add('hidden');
}

function renderWinModal(content) {
  renderer.addConfetti();

  let stars = 1;
  if (game.moves <= game.level.parMoves) stars = 3;
  else if (game.moves <= Math.floor(game.level.parMoves * 1.5)) stars = 2;

  content.innerHTML = `
    <div class="text-center space-y-5">
      <div class="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
        ${getIconSvg('award', 'w-8 h-8')}
      </div>

      <div class="space-y-1">
        <h2 class="text-2xl sm:text-3xl font-black text-white">BAY COMPLETED!</h2>
        <p class="text-xs text-slate-400">${game.level.name} Successfully Cleared</p>
      </div>

      <div class="flex items-center justify-center gap-2 py-2">
        ${[1, 2, 3].map(s => `
          <div class="transform ${s <= stars ? 'scale-110 text-amber-400' : 'scale-90 text-slate-700'} transition-all">
            ${getIconSvg('star', 'w-10 h-10 fill-current')}
          </div>
        `).join('')}
      </div>

      <div class="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
        <div>
          <div class="text-slate-400 font-medium">Your Moves</div>
          <div class="text-lg font-black text-amber-400">${game.moves}</div>
        </div>
        <div>
          <div class="text-slate-400 font-medium">Par Target</div>
          <div class="text-lg font-black text-slate-200">${game.level.parMoves}</div>
        </div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button id="win-btn-replay" class="flex-1 btn-tactile py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
          ${getIconSvg('rotateCcw', 'w-4 h-4')}
          <span>REPLAY</span>
        </button>

        <button id="win-btn-next" class="flex-1 btn-tactile py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 btn-glow-green">
          <span>NEXT BAY</span>
          ${getIconSvg('arrowRight', 'w-4 h-4')}
        </button>
      </div>
    </div>
  `;

  document.getElementById('win-btn-replay').addEventListener('click', () => {
    sound.playClick();
    game.reset();
    closeModal();
  });

  document.getElementById('win-btn-next').addEventListener('click', () => {
    sound.playClick();
    if (isProceduralMode) {
      loadLevel(0);
    } else {
      const nextIdx = currentLevelIndex + 1;
      if (nextIdx < LEVELS.length) {
        currentLevelIndex = nextIdx;
        loadLevel(nextIdx);
      } else {
        showModal('levels');
        return;
      }
    }
    closeModal();
  });
}

function handleLevelWin() {
  showModal('win');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
