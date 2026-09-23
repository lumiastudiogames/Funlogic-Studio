import { sound } from './audio.js';
import { LEVELS, THEMES } from './levels.js';

// Local storage key for persistent progress
const STORAGE_KEY = 'ball_bounce_target_save_v1';

class BallBounceGame {
  constructor(rootContainer) {
    this.root = rootContainer || document.getElementById('game-stage') || document.body;
    
    // Save state
    this.save = this.loadSave();

    // Game state
    this.currentLevelIndex = Math.min(this.save.unlockedLevel - 1, LEVELS.length - 1);
    this.currentThemeKey = 'blueprint';
    this.currentScreen = 'MAIN_MENU'; // 'MAIN_MENU' | 'PLAYING' | 'LEVEL_SELECT' | 'HOW_TO_PLAY'
    
    // Physics & Stage state
    this.logicalWidth = 1000;
    this.logicalHeight = 1320;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dpr = 1;

    // Simulation entities
    this.ball = null;
    this.deflectors = [];
    this.obstacles = [];
    this.basket = null;
    this.particles = [];
    this.trailParticles = [];
    this.shockwaves = [];
    this.trajectoryPoints = [];
    this.previewAnimTime = 0;

    // Interaction state
    this.selectedDeflector = null;
    this.draggingDeflector = null;
    this.rotatingDeflector = null;
    this.dragOffset = { x: 0, y: 0 };
    this.isSimulating = false;
    this.simStartTime = 0;
    this.activeHint = false;
    this.showVictoryBanner = false;
    this.adCountdownTimer = null;

    this.initDOM();
    this.initDisplay();
    this.initEvents();
    this.loadLevel(this.currentLevelIndex);

    // Start render/update loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  loadSave() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          unlockedLevel: Math.max(1, parsed.unlockedLevel || 1),
          scores: parsed.scores || {},
          soundEnabled: parsed.soundEnabled !== false
        };
      }
    } catch (e) {
      console.warn("Storage access error:", e);
    }
    return { unlockedLevel: 1, scores: {}, soundEnabled: true };
  }

  writeSave() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.save));
    } catch (e) {
      console.warn("Save error:", e);
    }
  }

  initDOM() {
    this.root.innerHTML = `
      <!-- TOP HUD -->
      <header id="game-hud" class="w-full h-11 sm:h-12 bg-slate-900/95 backdrop-blur-md px-2 sm:px-3 border-b border-slate-800 flex items-center justify-between gap-1 shrink-0 z-20 transition-opacity duration-200">
        <!-- Left: Menu, Level Badge, Theme -->
        <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button id="btn-menu" class="btn-tactile w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center shrink-0 active:scale-95" title="Main Menu">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          
          <div class="px-2 py-0.5 rounded-full text-[11px] sm:text-xs font-black bg-sky-500/20 text-sky-400 border border-sky-400/30 shrink-0 flex items-center">
            <span id="hud-level-label">LVL 1</span>
          </div>

          <button id="btn-theme-toggle" class="btn-tactile w-8 h-8 sm:w-auto sm:px-2 sm:py-1 rounded-lg text-xs font-bold bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center justify-center gap-1 shrink-0" title="Switch Theme">
            <span id="hud-theme-icon" class="text-xs">🎨</span>
            <span id="hud-theme-name" class="hidden md:inline text-[11px]">Theme</span>
          </button>
        </div>

        <!-- Center: Status / Goal -->
        <div class="hidden md:flex items-center gap-1 text-[11px] text-slate-400 font-medium truncate max-w-[200px]">
          <span class="text-emerald-400 font-bold">🎯</span>
          <span id="hud-goal-text" class="truncate text-slate-300">Target</span>
        </div>

        <!-- Right: Actions & Sound -->
        <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button id="btn-rotate-ccw" class="btn-tactile w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center shrink-0 active:scale-95" title="Rotate Deflector -15°">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a5 5 0 0 1 5 5v2m0 0l-3-3m3 3l3-3M3 10l3-3m-3 3l3 3" /></svg>
          </button>

          <button id="btn-rotate-cw" class="btn-tactile w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center shrink-0 active:scale-95" title="Rotate Deflector +15°">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 10H11a5 5 0 0 0-5 5v2m0 0l3-3m-3 3l-3-3m17-4l-3-3m3 3l-3 3" /></svg>
          </button>

          <button id="btn-sound-toggle" class="btn-tactile w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center shrink-0 active:scale-95" title="Toggle Sound">
            <span id="hud-sound-icon" class="text-xs">🔊</span>
          </button>
        </div>
      </header>

      <!-- CANVAS STAGE CONTAINER -->
      <div id="canvas-container" class="w-full flex-1 relative overflow-hidden bg-slate-950 flex items-center justify-center cursor-crosshair select-none">
        <canvas id="game-canvas" class="block w-full h-full"></canvas>

        <!-- Dynamic Victory Overlay Banner -->
        <div id="victory-banner" class="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 hidden animate-fade-in">
          <div class="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-4 text-emerald-400 text-3xl shadow-lg shadow-emerald-500/30 animate-bounce">
            ✓
          </div>
          <h2 class="text-3xl font-black text-white tracking-wide mb-1">TARGET CLEARED!</h2>
          <p id="victory-caption" class="text-sm text-slate-300 mb-6">Perfect bounce ricochet into the basket!</p>
          <div class="flex items-center gap-3">
            <button id="btn-victory-replay" class="btn-tactile px-4 py-2 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 flex items-center gap-1.5 shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span>REPLAY</span>
            </button>
            <button id="btn-victory-next" class="btn-tactile px-6 py-2 rounded-xl font-extrabold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/40 flex items-center gap-1.5 shrink-0">
              <span>NEXT LEVEL</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- BOTTOM CONTROL BAR -->
      <footer id="game-controls" class="w-full h-11 sm:h-12 bg-slate-900/95 backdrop-blur-md px-2.5 sm:px-4 border-t border-slate-800 flex items-center justify-between gap-1.5 sm:gap-2 shrink-0 z-20">
        <!-- Left: Reset Planks -->
        <button id="btn-reset-planks" class="btn-tactile px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-bold text-xs bg-slate-800/90 text-slate-300 border border-slate-700/80 hover:bg-slate-700 flex items-center gap-1 shrink-0 active:scale-95" title="Reset Deflector Positions">
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          <span class="text-[11px] sm:text-xs">RESET</span>
        </button>

        <!-- Center: Hint Rewarded Button -->
        <button id="btn-hint" class="btn-tactile px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg font-bold text-xs bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 flex items-center gap-1 shrink-0 active:scale-95" title="Unlock Ghost Solution Hint">
          <span class="text-xs">💡</span>
          <span class="text-[11px] sm:text-xs">HINT</span>
        </button>

        <!-- Right: Primary LAUNCH Button -->
        <button id="btn-launch" class="btn-tactile px-4 py-1.5 sm:px-6 sm:py-1.5 rounded-lg font-black text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25 flex items-center gap-1.5 shrink-0 active:scale-95 transition-all">
          <span id="btn-launch-icon" class="text-xs">▶</span>
          <span id="btn-launch-text">LAUNCH</span>
        </button>
      </footer>

      <!-- SCREENS & MODALS OVERLAYS -->
      <!-- 1. Main Menu Screen -->
      <div id="screen-main-menu" class="absolute inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-between p-6 z-40">
        <div class="w-full flex justify-end">
          <button id="btn-menu-sound" class="btn-tactile w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center text-lg">
            🔊
          </button>
        </div>

        <div class="flex flex-col items-center text-center max-w-md">
          <!-- Animated Bouncing Ball Graphic -->
          <div class="relative w-24 h-24 mb-4 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 border-2 border-white shadow-2xl flex items-center justify-center text-2xl font-black text-slate-900 animate-bounce">
              🎯
            </div>
          </div>

          <h1 class="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-emerald-400 tracking-tight mb-2">
            BALL BOUNCE TARGET
          </h1>
          <p class="text-sm text-slate-400 leading-relaxed mb-6">
            Position deflector planks, calculate ricochet angles, and sink the ball straight into the target basket.
          </p>

          <div class="w-full space-y-3">
            <button id="btn-menu-play" class="btn-tactile w-full py-3.5 rounded-2xl font-black text-base bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2">
              <span>PLAY / RESUME</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>

            <button id="btn-menu-levels" class="btn-tactile w-full py-3 rounded-2xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2">
              <span>LEVEL SELECT (75)</span>
            </button>

            <button id="btn-menu-how" class="btn-tactile w-full py-3 rounded-2xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2">
              <span>HOW TO PLAY</span>
            </button>
          </div>
        </div>

        <div class="text-center text-xs text-slate-500">
          <span>75 Precision Challenge Levels</span>
        </div>
      </div>

      <!-- 2. Level Select Screen -->
      <div id="screen-level-select" class="absolute inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 z-40 hidden">
        <div class="flex items-center justify-between mb-4 shrink-0">
          <button id="btn-level-back" class="btn-tactile px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-bold flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
            <span>BACK</span>
          </button>
          <h2 class="text-lg sm:text-xl font-black text-white">SELECT LEVEL</h2>
          <div class="w-14"></div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar pr-1">
          <div id="level-grid" class="grid grid-cols-5 gap-2 sm:gap-3.5 max-w-lg mx-auto py-2">
            <!-- Dynamically populated buttons -->
          </div>
        </div>
      </div>

      <!-- 3. How to Play Screen (3 Didactic Cards) -->
      <div id="screen-how-to-play" class="absolute inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 z-40 hidden">
        <div class="flex items-center justify-between mb-4 shrink-0">
          <button id="btn-how-back" class="btn-tactile px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-bold flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
            <span>BACK</span>
          </button>
          <h2 class="text-lg sm:text-xl font-black text-white">HOW TO PLAY</h2>
          <div class="w-14"></div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3.5 max-w-md mx-auto py-2">
          <!-- Card 1 -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-3.5 shadow-lg">
            <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 font-black text-lg flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h3 class="font-extrabold text-white text-sm mb-1">Drag & Rotate Deflectors</h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                Tap and drag planks anywhere on the blueprint grid. Drag the round handle or use the top rotation buttons to angle deflector surfaces.
              </p>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-3.5 shadow-lg">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black text-lg flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h3 class="font-extrabold text-white text-sm mb-1">Calculate Ricochet Angles</h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                The ball obeys true gravity and elastic reflection ($v' = -e \cdot v$). Follow the initial dashed trajectory arc to predict where bounces will land.
              </p>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-3.5 shadow-lg">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-lg flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h3 class="font-extrabold text-white text-sm mb-1">Hit LAUNCH & Score</h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                Press LAUNCH to release the bouncy ball. Land cleanly through the orange basket rim to clear the level and unlock the next challenge!
              </p>
            </div>
          </div>

          <button id="btn-how-start" class="btn-tactile w-full mt-2 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30">
            GOT IT, LET'S PLAY!
          </button>
        </div>
      </div>

      <!-- 4. Rewarded Hint Ad Modal (5s Timer) -->
      <div id="modal-hint-ad" class="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 hidden">
        <div class="bg-slate-900 border border-slate-700/80 rounded-3xl p-5 max-w-sm w-full shadow-2xl text-center">
          <div class="text-3xl mb-2">📺</div>
          <h3 class="text-lg font-black text-white mb-1">SPONSORED HINT</h3>
          <p class="text-xs text-slate-400 mb-4">Watch this quick 5-second simulated sponsor highlight to reveal optimal deflector positions!</p>
          
          <!-- Countdown & Progress Bar -->
          <div class="w-full bg-slate-800 rounded-full h-3 mb-2 overflow-hidden border border-slate-700">
            <div id="ad-progress-bar" class="bg-gradient-to-r from-amber-500 to-yellow-400 h-full w-0 transition-all duration-100 ease-linear"></div>
          </div>
          <div id="ad-countdown" class="text-xs font-bold text-amber-400 mb-5">Unlocking in 5s...</div>

          <div class="flex items-center gap-2">
            <button id="btn-ad-skip" class="btn-tactile flex-1 py-2.5 rounded-xl font-bold text-xs bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700">
              SKIP
            </button>
            <button id="btn-ad-claim" disabled class="btn-tactile flex-1 py-2.5 rounded-xl font-extrabold text-xs bg-amber-500 text-slate-950 opacity-40 cursor-not-allowed">
              CLAIM HINT 💡
            </button>
          </div>
        </div>
      </div>
    `;

    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  initDisplay() {
    this.resize();
    const observer = new ResizeObserver(() => this.resize());
    observer.observe(this.canvas.parentElement);
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    
    // Ceiling of 2x for DPR per manual
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    const cssWidth = Math.floor(rect.width);
    const cssHeight = Math.floor(rect.height);

    if (cssWidth <= 0 || cssHeight <= 0) return;

    this.canvas.width = Math.floor(cssWidth * this.dpr);
    this.canvas.height = Math.floor(cssHeight * this.dpr);

    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;

    // Scale logic: maintain crisp aspect ratio of 1000 x 1320 board
    const scaleX = cssWidth / this.logicalWidth;
    const scaleY = cssHeight / this.logicalHeight;
    this.scale = Math.min(scaleX, scaleY);

    this.offsetX = (cssWidth - this.logicalWidth * this.scale) / 2;
    this.offsetY = (cssHeight - this.logicalHeight * this.scale) / 2;
  }

  getGameCoordinates(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const cssX = clientX - rect.left;
    const cssY = clientY - rect.top;

    const gameX = (cssX - this.offsetX) / this.scale;
    const gameY = (cssY - this.offsetY) / this.scale;

    return { x: gameX, y: gameY };
  }

  initEvents() {
    sound.enabled = this.save.soundEnabled;
    this.updateSoundIcons();

    // Menu Buttons
    document.getElementById('btn-menu').addEventListener('click', () => {
      sound.playClick();
      this.setScreen('MAIN_MENU');
    });

    document.getElementById('btn-menu-play').addEventListener('click', () => {
      sound.playClick();
      this.setScreen('PLAYING');
    });

    document.getElementById('btn-menu-levels').addEventListener('click', () => {
      sound.playClick();
      this.renderLevelGrid();
      this.setScreen('LEVEL_SELECT');
    });

    document.getElementById('btn-menu-how').addEventListener('click', () => {
      sound.playClick();
      this.setScreen('HOW_TO_PLAY');
    });

    document.getElementById('btn-level-back').addEventListener('click', () => {
      sound.playClick();
      this.setScreen('MAIN_MENU');
    });

    document.getElementById('btn-how-back').addEventListener('click', () => {
      sound.playClick();
      this.setScreen('MAIN_MENU');
    });

    document.getElementById('btn-how-start').addEventListener('click', () => {
      sound.playClick();
      this.setScreen('PLAYING');
    });

    // Sound toggle
    const toggleSound = () => {
      this.save.soundEnabled = !this.save.soundEnabled;
      sound.enabled = this.save.soundEnabled;
      this.writeSave();
      this.updateSoundIcons();
      if (sound.enabled) sound.playClick();
    };

    document.getElementById('btn-sound-toggle').addEventListener('click', toggleSound);
    document.getElementById('btn-menu-sound').addEventListener('click', toggleSound);

    // Theme toggle
    document.getElementById('btn-theme-toggle').addEventListener('click', () => {
      sound.playClick();
      const themeKeys = Object.keys(THEMES);
      const nextIndex = (themeKeys.indexOf(this.currentThemeKey) + 1) % themeKeys.length;
      this.setTheme(themeKeys[nextIndex]);
    });

    // Deflector Quick Rotate buttons (+15, -15)
    document.getElementById('btn-rotate-cw').addEventListener('click', () => {
      sound.playClick();
      const target = this.selectedDeflector || this.deflectors[0];
      if (target) {
        target.angle = (target.angle + 15) % 360;
        this.calculatePreviewTrajectory();
      }
    });

    document.getElementById('btn-rotate-ccw').addEventListener('click', () => {
      sound.playClick();
      const target = this.selectedDeflector || this.deflectors[0];
      if (target) {
        target.angle = (target.angle - 15 + 360) % 360;
        this.calculatePreviewTrajectory();
      }
    });

    // Reset Planks
    document.getElementById('btn-reset-planks').addEventListener('click', () => {
      sound.playClick();
      this.resetLevelEntities();
    });

    // Launch button
    const launchBtn = document.getElementById('btn-launch');
    launchBtn.addEventListener('click', () => {
      if (this.isSimulating) {
        sound.playClick();
        this.stopSimulation();
      } else {
        this.startSimulation();
      }
    });

    // Hint Ad Button
    document.getElementById('btn-hint').addEventListener('click', () => {
      sound.playClick();
      this.openHintModal();
    });

    // Victory Banner Buttons
    document.getElementById('btn-victory-replay').addEventListener('click', () => {
      sound.playClick();
      this.hideVictory();
      this.resetLevelEntities();
    });

    document.getElementById('btn-victory-next').addEventListener('click', () => {
      sound.playClick();
      this.hideVictory();
      this.nextLevel();
    });

    // Canvas Pointer Events (Touch + Mouse)
    const onPointerDown = (e) => {
      if (this.isSimulating) return;
      const coords = this.getGameCoordinates(e.clientX, e.clientY);
      
      // 1. Check if clicking on rotation handle of selected deflector
      if (this.selectedDeflector) {
        const rad = (this.selectedDeflector.angle * Math.PI) / 180;
        const handleDist = this.selectedDeflector.length / 2 + 35;
        const hx = this.selectedDeflector.x + Math.cos(rad) * handleDist;
        const hy = this.selectedDeflector.y + Math.sin(rad) * handleDist;
        const distToHandle = Math.hypot(coords.x - hx, coords.y - hy);
        if (distToHandle <= 35) {
          this.rotatingDeflector = this.selectedDeflector;
          sound.playClick();
          e.preventDefault();
          return;
        }
      }

      // 2. Check if clicking on any deflector body
      for (let i = this.deflectors.length - 1; i >= 0; i--) {
        const def = this.deflectors[i];
        if (this.isPointNearDeflector(coords.x, coords.y, def)) {
          this.selectedDeflector = def;
          this.draggingDeflector = def;
          this.dragOffset = {
            x: coords.x - def.x,
            y: coords.y - def.y
          };
          sound.playClick();
          e.preventDefault();
          return;
        }
      }

      // Deselect if clicked empty space
      this.selectedDeflector = null;
    };

    const onPointerMove = (e) => {
      if (this.isSimulating) return;
      const coords = this.getGameCoordinates(e.clientX, e.clientY);

      if (this.rotatingDeflector) {
        const dx = coords.x - this.rotatingDeflector.x;
        const dy = coords.y - this.rotatingDeflector.y;
        let deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
        // Snap to nearest 5 degrees
        deg = Math.round(deg / 5) * 5;
        this.rotatingDeflector.angle = deg;
        this.calculatePreviewTrajectory();
        e.preventDefault();
      } else if (this.draggingDeflector) {
        let newX = coords.x - this.dragOffset.x;
        let newY = coords.y - this.dragOffset.y;

        // Clamp to logical bounds
        newX = Math.max(80, Math.min(this.logicalWidth - 80, newX));
        newY = Math.max(140, Math.min(this.logicalHeight - 120, newY));

        this.draggingDeflector.x = newX;
        this.draggingDeflector.y = newY;
        this.calculatePreviewTrajectory();
        e.preventDefault();
      }
    };

    const onPointerUp = () => {
      this.draggingDeflector = null;
      this.rotatingDeflector = null;
    };

    this.canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  isPointNearDeflector(px, py, def) {
    const rad = (def.angle * Math.PI) / 180;
    const halfLen = def.length / 2;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Transform point to local coords relative to deflector center
    const dx = px - def.x;
    const dy = py - def.y;
    const localX = dx * cos + dy * sin;
    const localY = -dx * sin + dy * cos;

    return Math.abs(localX) <= halfLen + 20 && Math.abs(localY) <= 30;
  }

  updateSoundIcons() {
    const icon = this.save.soundEnabled ? '🔊' : '🔇';
    const hudIcon = document.getElementById('hud-sound-icon');
    const menuIcon = document.getElementById('btn-menu-sound');
    if (hudIcon) hudIcon.textContent = icon;
    if (menuIcon) menuIcon.textContent = icon;
  }

  setScreen(screen) {
    this.currentScreen = screen;
    const mainMenu = document.getElementById('screen-main-menu');
    const levelSelect = document.getElementById('screen-level-select');
    const howToPlay = document.getElementById('screen-how-to-play');

    mainMenu.classList.add('hidden');
    levelSelect.classList.add('hidden');
    howToPlay.classList.add('hidden');

    if (screen === 'MAIN_MENU') {
      mainMenu.classList.remove('hidden');
    } else if (screen === 'LEVEL_SELECT') {
      levelSelect.classList.remove('hidden');
    } else if (screen === 'HOW_TO_PLAY') {
      howToPlay.classList.remove('hidden');
    } else if (screen === 'PLAYING') {
      this.resize();
    }
  }

  setTheme(themeKey) {
    if (!THEMES[themeKey]) return;
    this.currentThemeKey = themeKey;
    const theme = THEMES[themeKey];
    const themeName = document.getElementById('hud-theme-name');
    if (themeName) themeName.textContent = theme.name;
    const themeIcon = document.getElementById('hud-theme-icon');
    if (themeIcon) {
      const icons = { blueprint: '📐', wood: '🪵', neon: '⚡', arcade: '🕹️' };
      themeIcon.textContent = icons[themeKey] || '🎨';
    }
  }

  loadLevel(index) {
    if (index < 0 || index >= LEVELS.length) return;
    this.currentLevelIndex = index;
    const level = LEVELS[index];

    this.setTheme(level.theme || 'blueprint');
    this.activeHint = false;
    this.hideVictory();

    // Setup HUD elements
    const lvlEl = document.getElementById('hud-level-label');
    if (lvlEl) lvlEl.textContent = `LEVEL ${level.id}`;
    const goalEl = document.getElementById('hud-goal-text');
    if (goalEl) goalEl.textContent = level.title;

    // Reset simulation entities from level template
    this.resetLevelEntities();
  }

  resetLevelEntities() {
    this.stopSimulation();
    const level = LEVELS[this.currentLevelIndex];

    // Clone ball - Enhanced size (radius 28) with rich trail & physics properties
    this.ball = {
      x: level.ball.x,
      y: level.ball.y,
      vx: level.ball.vx,
      vy: level.ball.vy,
      radius: 28,
      startX: level.ball.x,
      startY: level.ball.y,
      initialVx: level.ball.vx,
      initialVy: level.ball.vy,
      trail: [],
      squash: 1.0,
      squashAngle: 0,
      inBasket: false
    };

    // Clone deflectors
    this.deflectors = level.deflectors.map(d => ({
      id: d.id,
      x: d.x,
      y: d.y,
      length: d.length,
      angle: d.angle,
      thickness: 30,
      restitution: 0.92,
      hitRecoil: 0
    }));

    // Clone obstacles
    this.obstacles = level.obstacles.map(o => ({ ...o }));

    // Setup basket
    this.basket = {
      x: level.basket.x,
      y: level.basket.y,
      width: Math.max(160, Math.round((level.basket.width || 140) * 1.15)),
      rimY: level.basket.y,
      netStretch: 0,
      wobble: 0
    };

    this.selectedDeflector = this.deflectors[0] || null;
    this.particles = [];
    this.trailParticles = [];
    this.shockwaves = [];
    this.calculatePreviewTrajectory();
  }

  startSimulation() {
    if (this.isSimulating) return;
    this.isSimulating = true;
    this.simStartTime = performance.now();
    sound.playLaunch();

    const launchBtn = document.getElementById('btn-launch');
    const launchIcon = document.getElementById('btn-launch-icon');
    const launchText = document.getElementById('btn-launch-text');

    launchBtn.classList.remove('bg-blue-600', 'hover:bg-blue-500');
    launchBtn.classList.add('bg-rose-600', 'hover:bg-rose-500');
    launchIcon.textContent = '⏹';
    launchText.textContent = 'STOP';

    // Particle burst on launch
    this.spawnShockwave(this.ball.x, this.ball.y, '#38bdf8', 45);
    this.spawnSparks(this.ball.x, this.ball.y, '#38bdf8', 16);
  }

  stopSimulation() {
    this.isSimulating = false;
    const launchBtn = document.getElementById('btn-launch');
    const launchIcon = document.getElementById('btn-launch-icon');
    const launchText = document.getElementById('btn-launch-text');

    launchBtn.classList.remove('bg-rose-600', 'hover:bg-rose-500');
    launchBtn.classList.add('bg-blue-600', 'hover:bg-blue-500');
    launchIcon.textContent = '▶';
    launchText.textContent = 'LAUNCH';

    if (this.ball) {
      this.ball.x = this.ball.startX;
      this.ball.y = this.ball.startY;
      this.ball.vx = this.ball.initialVx;
      this.ball.vy = this.ball.initialVy;
      this.ball.trail = [];
      this.ball.squash = 1.0;
      this.ball.squashAngle = 0;
      this.ball.inBasket = false;
    }
    this.trailParticles = [];
    this.shockwaves = [];
    this.calculatePreviewTrajectory();
  }

  openHintModal() {
    const modal = document.getElementById('modal-hint-ad');
    const progressBar = document.getElementById('ad-progress-bar');
    const countdown = document.getElementById('ad-countdown');
    const claimBtn = document.getElementById('btn-ad-claim');
    const skipBtn = document.getElementById('btn-ad-skip');

    modal.classList.remove('hidden');
    progressBar.style.width = '0%';
    claimBtn.disabled = true;
    claimBtn.classList.add('opacity-40', 'cursor-not-allowed');

    let timeLeft = 5;
    countdown.textContent = `Unlocking in ${timeLeft}s...`;

    clearInterval(this.adCountdownTimer);
    const startTime = performance.now();

    this.adCountdownTimer = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      const progress = Math.min(100, (elapsed / 5) * 100);
      progressBar.style.width = `${progress}%`;

      const remaining = Math.max(0, Math.ceil(5 - elapsed));
      if (remaining > 0) {
        countdown.textContent = `Unlocking in ${remaining}s...`;
      } else {
        clearInterval(this.adCountdownTimer);
        countdown.textContent = 'Reward Ready! 💡';
        claimBtn.disabled = false;
        claimBtn.classList.remove('opacity-40', 'cursor-not-allowed');
        claimBtn.classList.add('hover:bg-amber-400', 'shadow-lg', 'shadow-amber-500/40');
      }
    }, 100);

    const closeModal = () => {
      clearInterval(this.adCountdownTimer);
      modal.classList.add('hidden');
    };

    skipBtn.onclick = () => {
      sound.playClick();
      closeModal();
    };

    claimBtn.onclick = () => {
      sound.playClick();
      this.activeHint = true;
      closeModal();
      this.calculatePreviewTrajectory();
    };
  }

  showVictory() {
    this.showVictoryBanner = true;
    sound.playBasket();

    const banner = document.getElementById('victory-banner');
    banner.classList.remove('hidden');

    this.spawnShockwave(this.basket.x, this.basket.rimY, '#10b981', 120);
    this.spawnShockwave(this.basket.x, this.basket.rimY, '#facc15', 90);

    // Confetti and starburst particles
    for (let i = 0; i < 60; i++) {
      const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#fde047', '#a855f7'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push({
        x: this.basket.x,
        y: this.basket.rimY,
        vx: (Math.random() - 0.5) * 650,
        vy: -Math.random() * 550 - 120,
        radius: Math.random() * 7 + 3.5,
        color: color,
        life: 1.0,
        decay: Math.random() * 0.45 + 0.35
      });
    }

    // Save unlock
    const nextLevelNum = this.currentLevelIndex + 2;
    this.save.unlockedLevel = Math.max(this.save.unlockedLevel, nextLevelNum);
    this.writeSave();

    // Universal Platform Victory Integration (Manual Rule 9)
    const timeInSeconds = Math.max(1, Math.floor((performance.now() - this.simStartTime) / 1000));
    try {
      window.parent.postMessage({ type: 'win', time: timeInSeconds }, '*');
    } catch (e) {
      console.warn("Victory postMessage error:", e);
    }
    if (typeof window.onWin === 'function') {
      window.onWin(timeInSeconds);
    }
  }

  hideVictory() {
    this.showVictoryBanner = false;
    const banner = document.getElementById('victory-banner');
    if (banner) banner.classList.add('hidden');
  }

  nextLevel() {
    const nextIdx = this.currentLevelIndex + 1;
    if (nextIdx < LEVELS.length) {
      this.loadLevel(nextIdx);
    } else {
      this.loadLevel(0);
    }
  }

  renderLevelGrid() {
    const grid = document.getElementById('level-grid');
    if (!grid) return;
    grid.innerHTML = '';

    LEVELS.forEach((level, idx) => {
      const isUnlocked = idx + 1 <= this.save.unlockedLevel;
      const isCurrent = idx === this.currentLevelIndex;

      const btn = document.createElement('button');
      btn.className = `btn-tactile h-14 sm:h-16 rounded-2xl font-black text-sm sm:text-base flex flex-col items-center justify-center transition-all ${
        isCurrent
          ? 'bg-blue-600 text-white ring-2 ring-blue-400'
          : isUnlocked
          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          : 'bg-slate-900/60 text-slate-600 border border-slate-800/40 opacity-50 cursor-not-allowed'
      }`;

      if (isUnlocked) {
        btn.innerHTML = `<span>${level.id}</span><span class="text-[10px] text-amber-400 font-normal">★★★</span>`;
        btn.addEventListener('click', () => {
          sound.playClick();
          this.loadLevel(idx);
          this.setScreen('PLAYING');
        });
      } else {
        btn.innerHTML = `<span class="text-xs">🔒</span><span class="text-[10px] text-slate-600">${level.id}</span>`;
      }

      grid.appendChild(btn);
    });
  }

  // Calculate guide line for initial bounce
  calculatePreviewTrajectory() {
    this.trajectoryPoints = [];
    if (!this.ball) return;

    let simX = this.ball.startX;
    let simY = this.ball.startY;
    let simVx = this.ball.initialVx;
    let simVy = this.ball.initialVy;
    const gravity = 420;
    const dt = 0.035;

    this.trajectoryPoints.push({ x: simX, y: simY });

    for (let step = 0; step < 70; step++) {
      simVy += gravity * dt;
      simX += simVx * dt;
      simY += simVy * dt;

      // Deflector bounce check
      for (const def of this.deflectors) {
        const rad = (def.angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        // Vector from center to point
        const dx = simX - def.x;
        const dy = simY - def.y;
        const localX = dx * cos + dy * sin;
        const localY = -dx * sin + dy * cos;

        if (Math.abs(localX) <= def.length / 2 && Math.abs(localY) <= def.thickness / 2 + 10) {
          const normalX = -sin * Math.sign(localY);
          const normalY = cos * Math.sign(localY);
          const dot = simVx * normalX + simVy * normalY;
          if (dot < 0) {
            simVx -= 1.9 * dot * normalX;
            simVy -= 1.9 * dot * normalY;
          }
        }
      }

      this.trajectoryPoints.push({ x: simX, y: simY });
      if (simY > this.logicalHeight + 100) break;
    }
  }

  spawnShockwave(x, y, color = '#38bdf8', maxRadius = 65) {
    this.shockwaves.push({
      x,
      y,
      radius: 6,
      maxRadius: maxRadius,
      color: color,
      alpha: 0.9,
      decay: 2.2,
      lineWidth: 3.5
    });
  }

  spawnSparks(x, y, color, count = 16, burstSpeed = 320) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * burstSpeed + 80;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 5 + 2.5,
        color: color,
        life: 1.0,
        decay: Math.random() * 1.6 + 1.2
      });
    }
  }

  // Update Physics & Particles
  update(dt) {
    const theme = THEMES[this.currentThemeKey] || THEMES.blueprint;

    // 1. Update expanding shockwave rings
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * Math.min(1, dt * 12);
      sw.alpha -= sw.decay * dt;
      if (sw.alpha <= 0) {
        this.shockwaves.splice(i, 1);
      }
    }

    // 2. Update burst particles (sparks, confetti)
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 360 * dt; // Gravity on particles
      p.life -= p.decay * dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // 3. Update faint, fading trajectory vapor / stardust particles
    for (let i = this.trailParticles.length - 1; i >= 0; i--) {
      const tp = this.trailParticles[i];
      tp.x += tp.vx * dt;
      tp.y += tp.vy * dt;
      tp.life -= dt;
      tp.twinkle += dt * 8;
      tp.vx *= 0.96;
      tp.vy *= 0.96;
      if (tp.life <= 0) {
        this.trailParticles.splice(i, 1);
      }
    }

    // Decay deflector hit recoils
    for (const def of this.deflectors) {
      if (def.hitRecoil > 0) {
        def.hitRecoil = Math.max(0, def.hitRecoil - dt * 3.5);
      }
    }

    if (!this.isSimulating || !this.ball || this.ball.inBasket) return;

    // 4. Emit continuous faint fading trail particles behind the moving ball
    const currentSpeed = Math.hypot(this.ball.vx, this.ball.vy);
    const emitCount = Math.min(6, Math.max(2, Math.floor(currentSpeed / 120)));
    for (let i = 0; i < emitCount; i++) {
      const t = Math.random();
      const px = this.ball.x - this.ball.vx * dt * t + (Math.random() - 0.5) * 12;
      const py = this.ball.y - this.ball.vy * dt * t + (Math.random() - 0.5) * 12;
      const pAngle = Math.random() * Math.PI * 2;
      const pSpeed = Math.random() * 24 + 6;
      this.trailParticles.push({
        x: px,
        y: py,
        vx: Math.cos(pAngle) * pSpeed - this.ball.vx * 0.05,
        vy: Math.sin(pAngle) * pSpeed - this.ball.vy * 0.05,
        radius: Math.random() * 8 + 4,
        maxRadius: Math.random() * 8 + 4,
        color: theme.ballColor,
        alpha: 0.65,
        life: 0.75,
        maxLife: 0.75,
        twinkle: Math.random() * Math.PI * 2
      });
    }

    // Sub-stepping to prevent tunneling
    const subSteps = 6;
    const subDt = dt / subSteps;
    const gravity = 420;

    for (let step = 0; step < subSteps; step++) {
      this.ball.vy += gravity * subDt;
      this.ball.x += this.ball.vx * subDt;
      this.ball.y += this.ball.vy * subDt;

      // Trajectory ribbon record
      if (step === 0) {
        const curSpd = Math.hypot(this.ball.vx, this.ball.vy);
        this.ball.trail.push({
          x: this.ball.x,
          y: this.ball.y,
          alpha: 1.0,
          speed: curSpd
        });
        if (this.ball.trail.length > 36) {
          this.ball.trail.shift();
        }
      }

      // 1. Deflector collision (Capsule segment check)
      for (const def of this.deflectors) {
        const rad = (def.angle * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const dx = this.ball.x - def.x;
        const dy = this.ball.y - def.y;
        const localX = dx * cos + dy * sin;
        const localY = -dx * sin + dy * cos;

        const halfLen = def.length / 2;
        const halfThick = def.thickness / 2;

        if (Math.abs(localX) <= halfLen && Math.abs(localY) <= halfThick + this.ball.radius) {
          const signY = localY >= 0 ? 1 : -1;
          const normalX = -sin * signY;
          const normalY = cos * signY;

          const dot = this.ball.vx * normalX + this.ball.vy * normalY;
          if (dot < 0) {
            // Rebound reflection
            const restitution = def.restitution;
            this.ball.vx -= (1 + restitution) * dot * normalX;
            this.ball.vy -= (1 + restitution) * dot * normalY;

            // Push out of collision
            const overlap = halfThick + this.ball.radius - Math.abs(localY);
            this.ball.x += normalX * overlap;
            this.ball.y += normalY * overlap;

            // Tactile vibration & squash
            def.hitRecoil = 1.0;
            this.ball.squash = 0.52;
            this.ball.squashAngle = Math.atan2(normalY, normalX);

            const impactSpeed = Math.hypot(this.ball.vx, this.ball.vy) / 200;
            sound.playBounce(impactSpeed);

            this.spawnShockwave(this.ball.x, this.ball.y, theme.deflectorHighlight, 70);
            this.spawnSparks(this.ball.x, this.ball.y, theme.deflectorHighlight, 18, 380);
          }
        }
      }

      // 2. Obstacle collisions
      for (const obs of this.obstacles) {
        const halfW = obs.width / 2;
        const halfH = obs.height / 2;
        const dx = this.ball.x - obs.x;
        const dy = this.ball.y - obs.y;

        if (Math.abs(dx) <= halfW + this.ball.radius && Math.abs(dy) <= halfH + this.ball.radius) {
          const overlapX = halfW + this.ball.radius - Math.abs(dx);
          const overlapY = halfH + this.ball.radius - Math.abs(dy);

          if (overlapX < overlapY) {
            const signX = Math.sign(dx);
            this.ball.vx = -this.ball.vx * 0.8;
            this.ball.x = obs.x + signX * (halfW + this.ball.radius);
            this.ball.squashAngle = 0;
          } else {
            const signY = Math.sign(dy);
            this.ball.vy = -this.ball.vy * 0.8;
            this.ball.y = obs.y + signY * (halfH + this.ball.radius);
            this.ball.squashAngle = Math.PI / 2;
          }
          this.ball.squash = 0.6;
          sound.playBounce(1);
          this.spawnShockwave(this.ball.x, this.ball.y, '#94a3b8', 55);
          this.spawnSparks(this.ball.x, this.ball.y, '#94a3b8', 12, 280);
        }
      }

      // 3. Basket Goal Detection
      const bDistX = Math.abs(this.ball.x - this.basket.x);
      const bDistY = this.ball.y - this.basket.rimY;

      if (bDistX <= this.basket.width / 2 - 14 && bDistY >= -15 && bDistY <= 45 && this.ball.vy > 0) {
        this.ball.inBasket = true;
        this.ball.vx *= 0.1;
        this.ball.vy = 85; // Slow descent through net
        this.basket.netStretch = 1.0;
        this.basket.wobble = 1.0;
        this.spawnShockwave(this.basket.x, this.basket.rimY, '#10b981', 85);
        this.showVictory();
        return;
      }
    }

    // Smooth recovery of dynamic squash & stretch
    if (this.ball) {
      this.ball.squash += (1.0 - this.ball.squash) * Math.min(1, dt * 18);
    }
    if (this.basket) {
      this.basket.netStretch = Math.max(0, this.basket.netStretch - dt * 2.5);
      this.basket.wobble = Math.max(0, this.basket.wobble - dt * 3.5);
    }

    // Decay trail ribbon alphas
    for (const pt of this.ball.trail) {
      pt.alpha -= dt * 1.5;
    }
    this.ball.trail = this.ball.trail.filter(pt => pt.alpha > 0);

    // Off-screen fail check
    if (this.ball.y > this.logicalHeight + 120 || this.ball.x < -80 || this.ball.x > this.logicalWidth + 80) {
      sound.playFail();
      this.stopSimulation();
    }
  }

  // Main Render Routine
  render() {
    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // Clear background
    const theme = THEMES[this.currentThemeKey] || THEMES.blueprint;
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);

    // Board translation & scale
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    // 1. Draw Blueprint / Graph Paper Grid
    this.drawGrid(ctx, theme);

    // 2. Draw Start Cannon / Launch Gate
    this.drawStartLauncher(ctx, theme);

    // 3. Draw Target Basket
    this.drawBasket(ctx, theme);

    // 4. Draw Obstacles
    this.drawObstacles(ctx, theme);

    // 5. Draw Solution Hint (Ghost Planks if active)
    if (this.activeHint) {
      this.drawHints(ctx, theme);
    }

    // 6. Draw Preview Trajectory (when not simulating)
    if (!this.isSimulating) {
      this.drawTrajectory(ctx, theme);
    }

    // 7. Draw Deflector Planks
    this.drawDeflectors(ctx, theme);

    // 8. Draw Ball & Trail
    this.drawBall(ctx, theme);

    // 9. Draw Sparks & Particles
    this.drawParticles(ctx);

    ctx.restore();
  }

  drawGrid(ctx, theme) {
    const step = 40;
    ctx.strokeStyle = theme.gridColor;
    ctx.lineWidth = 1;

    // Extend grid across full visible canvas area (eliminates black gutters on wide screens)
    const minX = -this.offsetX / this.scale;
    const maxX = minX + (this.canvas.width / this.dpr) / this.scale;
    const minY = -this.offsetY / this.scale;
    const maxY = minY + (this.canvas.height / this.dpr) / this.scale;

    const startX = Math.floor(minX / step) * step;
    const endX = Math.ceil(maxX / step) * step;
    const startY = Math.floor(minY / step) * step;
    const endY = Math.ceil(maxY / step) * step;

    ctx.beginPath();
    for (let x = startX; x <= endX; x += step) {
      ctx.moveTo(x, minY);
      ctx.lineTo(x, maxY);
    }
    for (let y = startY; y <= endY; y += step) {
      ctx.moveTo(minX, y);
      ctx.lineTo(maxX, y);
    }
    ctx.stroke();

    // Subtle arena perimeter glow
    ctx.save();
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3.5;
    ctx.globalAlpha = 0.35;
    ctx.strokeRect(0, 0, this.logicalWidth, this.logicalHeight);

    // High-tech corner bracket accents
    const corner = 32;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.85;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(0, corner); ctx.lineTo(0, 0); ctx.lineTo(corner, 0);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(this.logicalWidth - corner, 0); ctx.lineTo(this.logicalWidth, 0); ctx.lineTo(this.logicalWidth, corner);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(0, this.logicalHeight - corner); ctx.lineTo(0, this.logicalHeight); ctx.lineTo(corner, this.logicalHeight);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(this.logicalWidth - corner, this.logicalHeight); ctx.lineTo(this.logicalWidth, this.logicalHeight); ctx.lineTo(this.logicalWidth, this.logicalHeight - corner);
    ctx.stroke();

    ctx.restore();
  }

  drawStartLauncher(ctx, theme) {
    if (!this.ball) return;
    const sx = this.ball.startX;
    const sy = this.ball.startY;

    // Contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + 44, 34, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pulsing radar ripple around launcher when ready
    if (!this.isSimulating) {
      const pulse = (Math.sin(this.previewAnimTime * 4) + 1) / 2;
      ctx.strokeStyle = theme.accent;
      ctx.globalAlpha = 0.2 + pulse * 0.35;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sx, sy, 35 + pulse * 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }

    // Launcher ring
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(sx, sy, 34, 0, Math.PI * 2);
    ctx.stroke();

    // Badge "START"
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.roundRect(sx - 30, sy + 32, 60, 20, 10);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('START', sx, sy + 42);
  }

  drawBasket(ctx, theme) {
    if (!this.basket) return;
    const bx = this.basket.x;
    const by = this.basket.rimY;
    const bw = this.basket.width;

    // Contact shadow under basket stand
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(bx, by + 75, bw * 0.4, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Support pole and stand
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(bx - 10, by + 25, 20, 50);
    ctx.fillStyle = '#334155';
    ctx.fillRect(bx - 36, by + 68, 72, 12);

    // Backboard Frame (2.5D with highlight)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(bx - bw * 0.4, by - 55, bw * 0.8, 65, 8);
    ctx.fill();
    ctx.stroke();

    // Backboard target inner square
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx - 22, by - 38, 44, 32);

    // Net (Woven Diamond Mesh)
    const netStretch = (this.basket.netStretch || 0) * 15;
    const netBottomY = by + 55 + netStretch;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.moveTo(bx - bw * 0.42, by + 6);
    ctx.lineTo(bx + bw * 0.42, by + 6);
    ctx.lineTo(bx + bw * 0.22, netBottomY);
    ctx.lineTo(bx - bw * 0.22, netBottomY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = theme.basketNet;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    // Net diagonal lines
    const segments = 6;
    for (let i = 0; i <= segments; i++) {
      const topX = (bx - bw * 0.4) + (i / segments) * (bw * 0.8);
      const botX = (bx - bw * 0.2) + (i / segments) * (bw * 0.4);
      ctx.moveTo(topX, by + 6);
      ctx.lineTo(botX, netBottomY);

      const crossBotX = (bx + bw * 0.2) - (i / segments) * (bw * 0.4);
      ctx.moveTo(topX, by + 6);
      ctx.lineTo(crossBotX, netBottomY);
    }
    ctx.stroke();

    // Orange Hoop Rim (3D Ring)
    const rimGrad = ctx.createLinearGradient(bx - bw / 2, by, bx + bw / 2, by);
    rimGrad.addColorStop(0, '#ea580c');
    rimGrad.addColorStop(0.5, '#f97316');
    rimGrad.addColorStop(1, '#c2410c');

    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(bx, by + 5, bw * 0.45, 9, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawObstacles(ctx, theme) {
    for (const obs of this.obstacles) {
      const halfW = obs.width / 2;
      const halfH = obs.height / 2;

      // Contact Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.roundRect(obs.x - halfW + 6, obs.y - halfH + 8, obs.width, obs.height, 6);
      ctx.fill();

      // Side Depth
      ctx.fillStyle = theme.obstacleSide;
      ctx.beginPath();
      ctx.roundRect(obs.x - halfW, obs.y - halfH + 4, obs.width, obs.height, 6);
      ctx.fill();

      // Top Face with Linear Gradient
      const grad = ctx.createLinearGradient(obs.x - halfW, obs.y - halfH, obs.x + halfW, obs.y + halfH);
      grad.addColorStop(0, theme.obstacleFace);
      grad.addColorStop(1, theme.obstacleSide);

      ctx.fillStyle = grad;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(obs.x - halfW, obs.y - halfH, obs.width, obs.height - 4, 6);
      ctx.fill();
      ctx.stroke();
    }
  }

  drawHints(ctx, theme) {
    const level = LEVELS[this.currentLevelIndex];
    if (!level.hints) return;

    ctx.save();
    for (const hint of level.hints) {
      ctx.save();
      ctx.translate(hint.x, hint.y);
      ctx.rotate((hint.angle * Math.PI) / 180);

      ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
      ctx.fillStyle = 'rgba(251, 191, 36, 0.12)';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 6]);

      ctx.beginPath();
      ctx.roundRect(-80, -12, 160, 24, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TARGET ANGLE', 0, 4);

      ctx.restore();
    }
    ctx.restore();
  }

  drawTrajectory(ctx, theme) {
    if (this.trajectoryPoints.length < 2) return;

    ctx.save();
    // Flowing animated dash pattern
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3.5;
    ctx.setLineDash([10, 8]);
    ctx.lineDashOffset = -this.previewAnimTime * 35;
    ctx.globalAlpha = 0.65;

    ctx.beginPath();
    ctx.moveTo(this.trajectoryPoints[0].x, this.trajectoryPoints[0].y);
    for (let i = 1; i < this.trajectoryPoints.length; i++) {
      ctx.lineTo(this.trajectoryPoints[i].x, this.trajectoryPoints[i].y);
    }
    ctx.stroke();

    // Traveling glowing photon beads along the predicted trajectory
    const totalPts = this.trajectoryPoints.length;
    const beadSpacing = 10;
    const beadOffset = Math.floor((this.previewAnimTime * 14) % beadSpacing);
    ctx.setLineDash([]);

    for (let i = beadOffset; i < totalPts; i += beadSpacing) {
      const pt = this.trajectoryPoints[i];
      const alpha = Math.max(0.1, 0.85 * (1 - i / totalPts));

      // Outer glow bead
      ctx.fillStyle = theme.accent;
      ctx.globalAlpha = alpha * 0.45;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Inner white core bead
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = alpha * 0.95;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  drawDeflectors(ctx, theme) {
    for (const def of this.deflectors) {
      const isSelected = def === this.selectedDeflector;
      const halfLen = def.length / 2;
      const halfThick = def.thickness / 2;

      ctx.save();
      ctx.translate(def.x, def.y);
      ctx.rotate((def.angle * Math.PI) / 180);

      // Contact shadow below plank
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.roundRect(-halfLen + 6, halfThick + 6, def.length, def.thickness, 6);
      ctx.fill();

      // 3D Side depth
      ctx.fillStyle = theme.deflectorSide;
      ctx.beginPath();
      ctx.roundRect(-halfLen, -halfThick + 5, def.length, def.thickness, 6);
      ctx.fill();

      // Top Face Linear Gradient (Directional Lighting)
      const grad = ctx.createLinearGradient(-halfLen, -halfThick, halfLen, halfThick);
      grad.addColorStop(0, theme.deflectorHighlight);
      grad.addColorStop(0.2, theme.deflectorFace);
      grad.addColorStop(1, theme.deflectorSide);

      ctx.fillStyle = grad;
      ctx.strokeStyle = isSelected ? '#ffffff' : theme.deflectorHighlight;
      ctx.lineWidth = isSelected ? 2.5 : 1.2;

      ctx.beginPath();
      ctx.roundRect(-halfLen, -halfThick, def.length, def.thickness, 6);
      ctx.fill();
      ctx.stroke();

      // Recoil flash on impact
      if (def.hitRecoil > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${def.hitRecoil * 0.45})`;
        ctx.fill();
      }

      // Center pivot screw / rivet
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = theme.deflectorHighlight;
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Angle readout chip
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.beginPath();
      ctx.roundRect(-18, -halfThick - 18, 36, 14, 4);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const normAngle = ((Math.round(def.angle) % 360) + 360) % 360;
      ctx.fillText(`${normAngle}°`, 0, -halfThick - 11);

      // Rotation Handle Ring (when selected)
      if (isSelected && !this.isSimulating) {
        const handleDist = halfLen + 35;
        // Connecting dashed line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(halfLen, 0);
        ctx.lineTo(handleDist, 0);
        ctx.stroke();
        ctx.setLineDash([]);

        // Handle knob
        ctx.fillStyle = '#3b82f6';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(handleDist, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Rotate icon inside handle
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillText('↻', handleDist, 1);
      }

      ctx.restore();
    }
  }

  drawBall(ctx, theme) {
    if (!this.ball) return;

    // 1. FAINT FADING TRAJECTORY RIBBON (Dual-Pass Luminous Comet Tail)
    if (this.ball.trail && this.ball.trail.length >= 2) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Pass 1: Broad soft luminous ambient glow
      for (let i = 0; i < this.ball.trail.length - 1; i++) {
        const p1 = this.ball.trail[i];
        const p2 = this.ball.trail[i + 1];
        const progress = i / this.ball.trail.length;
        const width = Math.max(2, progress * (this.ball.radius * 1.35));
        const alpha = Math.max(0, p2.alpha * progress * 0.28);

        ctx.strokeStyle = theme.ballColor;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Pass 2: Hot bright inner filament
      for (let i = 0; i < this.ball.trail.length - 1; i++) {
        const p1 = this.ball.trail[i];
        const p2 = this.ball.trail[i + 1];
        const progress = i / this.ball.trail.length;
        const width = Math.max(1, progress * (this.ball.radius * 0.45));
        const alpha = Math.max(0, p2.alpha * progress * 0.7);

        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. FAINT FADING TRAIL PARTICLES (Floating Stardust / Vapor Embers)
    ctx.save();
    for (const tp of this.trailParticles) {
      const lifeRatio = Math.max(0, tp.life / tp.maxLife);
      const currentRadius = tp.radius * (0.3 + 0.7 * lifeRatio);
      const currentAlpha = tp.alpha * Math.sin(lifeRatio * Math.PI);

      // Soft glowing circular radial gradient
      const grad = ctx.createRadialGradient(tp.x, tp.y, 0, tp.x, tp.y, currentRadius);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.35, tp.color);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.globalAlpha = currentAlpha * 0.65;
      ctx.beginPath();
      ctx.arc(tp.x, tp.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();

      // Occasional twinkling star glint
      if (Math.sin(tp.twinkle) > 0.45) {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = currentAlpha * 0.9;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, currentRadius * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // 3. SHOCKWAVE EXPANDING IMPACT RIPPLES
    ctx.save();
    for (const sw of this.shockwaves) {
      ctx.strokeStyle = sw.color;
      ctx.lineWidth = Math.max(1, sw.lineWidth * sw.alpha);
      ctx.globalAlpha = Math.max(0, sw.alpha);
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // 4. THE ENHANCED BALL ("MELHOR E MAIOR" - 26px Radius + Dynamic 2.5D Squash & Stretch)
    ctx.save();
    ctx.translate(this.ball.x, this.ball.y);

    let scaleX = 1;
    let scaleY = 1;
    let rotAngle = 0;

    if (this.ball.squash < 0.98) {
      // Dynamic collision impact squash
      rotAngle = this.ball.squashAngle;
      scaleX = 1 / Math.max(0.4, this.ball.squash);
      scaleY = Math.max(0.4, this.ball.squash);
    } else if (this.isSimulating && !this.ball.inBasket) {
      // Flight velocity stretch along velocity vector
      const spd = Math.hypot(this.ball.vx, this.ball.vy);
      if (spd > 120) {
        rotAngle = Math.atan2(this.ball.vy, this.ball.vx);
        scaleX = Math.min(1.35, 1 + spd * 0.00035);
        scaleY = 1 / scaleX;
      }
    }

    ctx.rotate(rotAngle);
    ctx.scale(scaleX, scaleY);

    // Outer subtle energy aura glow
    const auraGrad = ctx.createRadialGradient(0, 0, this.ball.radius * 0.75, 0, 0, this.ball.radius * 1.45);
    auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    auraGrad.addColorStop(0.5, theme.ballColor + '44');
    auraGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(0, 0, this.ball.radius * 1.45, 0, Math.PI * 2);
    ctx.fill();

    // Contact drop shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, this.ball.radius + 4, this.ball.radius * 0.92, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // 3D Spherical Radial Gradient with rich lighting & depth
    const r = this.ball.radius;
    const ballGrad = ctx.createRadialGradient(
      -r * 0.35,
      -r * 0.35,
      r * 0.08,
      0,
      0,
      r
    );
    ballGrad.addColorStop(0, '#ffffff');
    ballGrad.addColorStop(0.18, '#fef08a');
    ballGrad.addColorStop(0.42, theme.ballColor);
    ballGrad.addColorStop(0.82, '#d97706');
    ballGrad.addColorStop(1, '#78350f');

    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // Crisp glass curved specular crescent reflection
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.ellipse(-r * 0.32, -r * 0.35, r * 0.38, r * 0.18, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Subtle bottom-edge fresnel bounce light
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.ellipse(r * 0.2, r * 0.45, r * 0.35, r * 0.12, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawParticles(ctx) {
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  // Animation Frame Loop
  loop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.05);
    this.lastTime = timestamp;

    this.previewAnimTime += dt;
    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }
}

// Standalone initialization export
export function initGame(container) {
  return new BallBounceGame(container);
}

// Auto mount if in standard root
if (typeof document !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const stage = document.getElementById('game-stage');
    if (stage) {
      window.__ballBounceGame = new BallBounceGame(stage);
    }
  });
}
