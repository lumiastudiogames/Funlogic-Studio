

class LogicGridEngine {
  constructor(config) {
    this.level = config.level;
    this.allLevels = config.allLevels || [config.level];
    this.theme = config.theme || 'mystery'; // 'mystery', 'scifi', 'noir', 'victorian'
    this.onBack = config.onBack || null;
    this.gameKey = config.gameKey || 'logic_game';

    // State
    this.currentScreen = 'main-menu';
    this.gridState = {}; // key: `${cat1}_${id1}__${cat2}_${id2}` -> 'EMPTY' | 'CROSS' | 'CHECK'
    this.historyStack = [];
    this.autoCross = true;
    this.timerSeconds = 0;
    this.timerInterval = null;
    this.isTimerRunning = false;
    this.activeMobileTab = 'grid'; // 'grid' | 'clues' | 'notebook'
    this.highlightedRow = null;
    this.highlightedCol = null;
    this.clueStates = {}; // clueId -> boolean (strikethrough)

    // Canvas Background
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animFrameId = null;

    this.initDOM();
    this.initCanvas();
    this.initAudio();
  }

  initAudio() {
    this.sound = window.soundEngine || {
      playClick() {}, playCross() {}, playCheck() {},
      playUndo() {}, playHint() {}, playVictory() {},
      toggleMute() { return false; }
    };
  }

  initDOM() {
    this.root = document.getElementById('app-root');
    if (!this.root) {
      this.root = document.createElement('div');
      this.root.id = 'app-root';
      document.body.appendChild(this.root);
    }
    this.root.className = 'fixed inset-0 w-full h-full overflow-hidden flex flex-col bg-slate-950 select-none';

    this.renderContainer();
    this.bindEvents();
    this.showScreen('screen-main-menu');
  }

  renderContainer() {
    const assets = window.GameAssets;
    this.root.innerHTML = `
      <!-- CAMADA 1: HTML5 Canvas -->
      <canvas id="bg-canvas"></canvas>

      <!-- CAMADA 2: DOM Screens -->
      <!-- 1. Screen Main Menu -->
      <div id="screen-main-menu" class="screen-layer justify-between p-6 overflow-y-auto">
        <div class="w-full max-w-4xl mx-auto flex items-center justify-between py-2 border-b border-white/10">
          <div class="flex items-center gap-3">
            <span class="text-2xl">${this.level.icon || '🔍'}</span>
            <div>
              <div class="text-xs uppercase tracking-widest text-amber-400 font-mono">Case Dossier File</div>
              <h1 class="text-xl md:text-2xl font-bold font-display text-white">${this.level.title}</h1>
            </div>
          </div>
          <div class="flex items-center gap-2">
            ${this.onBack ? `<button id="btn-menu-back" class="btn text-xs">${assets.get('back')} Back to Hub</button>` : ''}
            <button id="btn-sound-toggle-menu" class="btn btn-icon text-slate-400" title="Toggle Sound">
              ${assets.get(window.soundEngine?.isMuted ? 'volumeOff' : 'volumeOn')}
            </button>
          </div>
        </div>

        <div class="w-full max-w-4xl mx-auto flex-1 flex flex-col justify-center items-center text-center py-8">
          <div class="max-w-2xl bg-slate-900/80 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
            <div class="inline-block px-3 py-1 rounded-full text-xs font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 mb-4">
              Difficulty: ${this.level.difficulty || 'Standard 4x4'}
            </div>
            <h2 class="text-2xl md:text-3xl font-bold font-display text-white mb-3">${this.level.subtitle || 'Unravel the Mystery'}</h2>
            <p class="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
              ${this.level.synopsis || this.level.description || 'Analyze the suspects, locations, and evidence using classic logical grid deduction.'}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left mb-6 text-xs text-slate-400 font-mono">
              <div class="p-3 bg-slate-950/60 rounded-lg border border-white/5">
                <span class="text-amber-400 block mb-1">A: ${this.level.categories.categoryA.name || 'Category A'}</span>
                ${this.level.categories.categoryA.items.map(i => i.name).join(' · ')}
              </div>
              <div class="p-3 bg-slate-950/60 rounded-lg border border-white/5">
                <span class="text-emerald-400 block mb-1">B: ${this.level.categories.categoryB.name || 'Category B'}</span>
                ${this.level.categories.categoryB.items.map(i => i.name).join(' · ')}
              </div>
              <div class="p-3 bg-slate-950/60 rounded-lg border border-white/5">
                <span class="text-rose-400 block mb-1">C: ${this.level.categories.categoryC.name || 'Category C'}</span>
                ${this.level.categories.categoryC.items.map(i => i.name).join(' · ')}
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-3">
              <button id="btn-start-game" class="btn btn-primary px-6 py-2.5 text-sm md:text-base">
                ${assets.get('search')} Open Case File & Solve
              </button>
              <button id="btn-show-tutorial" class="btn px-4 py-2.5 text-xs text-slate-300">
                ${assets.get('info')} How to Deduce
              </button>
            </div>
          </div>
        </div>

        <div class="w-full max-w-4xl mx-auto flex items-center justify-between text-xs text-slate-500 font-mono py-2 border-t border-white/10">
          <span>Best Record: <strong id="menu-best-time" class="text-amber-400">--:--</strong></span>
          <span>Status: <strong id="menu-solved-badge" class="text-slate-400">UNSOLVED</strong></span>
        </div>
      </div>

      <!-- 2. Screen Tutorial -->
      <div id="screen-tutorial" class="hidden screen-layer justify-between p-6 overflow-y-auto">
        <div class="w-full max-w-3xl mx-auto bg-slate-900/95 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 my-auto shadow-2xl">
          <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <h2 class="text-xl font-bold font-display text-white flex items-center gap-2">
              ${assets.get('info')} Detective Deduction Manual
            </h2>
            <button id="btn-close-tutorial" class="btn btn-icon text-xs">${assets.get('cross')}</button>
          </div>
          <div class="space-y-4 text-sm text-slate-300 leading-relaxed">
            <p><strong class="text-amber-400">1. The Logic Grid Matrix:</strong> Each cell represents a potential relationship between two items. Every suspect belongs to exactly one location and one object.</p>
            <p><strong class="text-rose-400">2. Marking Crosses (❌):</strong> Tap a cell once to rule out an impossibility when a clue proves two items cannot match.</p>
            <p><strong class="text-emerald-400">3. Marking Checks (✔️):</strong> Tap a second time to confirm a verified match. When Auto-Eliminate is active, the rest of that subgrid's row and column are crossed automatically.</p>
            <p><strong class="text-amber-400">4. Deduction Notebook:</strong> Track established connections live on the left panel. Use the Clues checklist to cross off analyzed evidence.</p>
            <p><strong class="text-slate-300">5. Single-Click Undo:</strong> Experiment boldly—you can undo any step anytime without penalty.</p>
          </div>
          <div class="mt-6 text-right">
            <button id="btn-tutorial-ok" class="btn btn-primary px-6 py-2">Got It, Let's Investigate</button>
          </div>
        </div>
      </div>

      <!-- 3. Screen Gameplay -->
      <div id="screen-gameplay" class="hidden screen-layer">
        <!-- HEADER -->
        <header class="app-header">
          <div class="flex items-center gap-2 md:gap-3">
            <button id="btn-back-to-menu" class="btn text-xs py-1.5 px-2.5 text-slate-300" title="Return to Case Menu">
              ${assets.get('back')} <span class="hidden sm:inline">Case File</span>
            </button>
            <div class="h-4 w-px bg-white/15 hidden sm:block"></div>
            <div>
              <span class="text-xs font-mono text-amber-400 block sm:inline mr-2">${this.level.difficulty}</span>
              <strong class="text-xs md:text-sm font-display text-white truncate max-w-[140px] sm:max-w-xs inline-block align-bottom">${this.level.title}</strong>
            </div>
          </div>

          <div class="flex items-center gap-1.5 md:gap-2">
            <!-- Timer & Solved Counter -->
            <div class="flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-md border border-white/10 text-xs font-mono text-slate-200">
              ${assets.get('clock')} <span id="game-timer">00:00</span>
            </div>
            <div class="hidden md:flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-md border border-white/10 text-xs font-mono text-emerald-400" title="Confirmed Matches">
              ${assets.get('check')} <span id="game-pairs-counter">0 / 12</span>
            </div>

            <!-- Controls -->
            <button id="btn-undo" class="btn btn-icon text-slate-300" title="Undo Move (Z)">
              ${assets.get('undo')}
            </button>
            <button id="btn-auto-cross" class="btn text-xs py-1.5 px-2 font-mono text-emerald-400 bg-emerald-500/10 border-emerald-500/30" title="Toggle Auto Cross">
              ${assets.get('zap')} <span class="hidden lg:inline">Auto-X</span>
            </button>
            <button id="btn-hint" class="btn btn-icon text-amber-400" title="Deduction Clue Hint">
              ${assets.get('hint')}
            </button>
            <button id="btn-sound-toggle-game" class="btn btn-icon text-slate-400" title="Toggle Audio">
              ${assets.get(window.soundEngine?.isMuted ? 'volumeOff' : 'volumeOn')}
            </button>
          </div>
        </header>

        <!-- MOBILE TAB BAR -->
        <div class="mobile-tabs lg:hidden">
          <button class="mobile-tab-btn active" data-tab="grid">
            ${assets.get('grid')} Logic Grid
          </button>
          <button class="mobile-tab-btn" data-tab="clues">
            ${assets.get('list')} Clues (<span id="tab-clues-count">${this.level.clues.length}</span>)
          </button>
          <button class="mobile-tab-btn" data-tab="notebook">
            ${assets.get('notebook')} Notebook
          </button>
        </div>

        <!-- MAIN SPLIT VIEW -->
        <div class="gameplay-body">
          <!-- LEFT PANEL: Case Briefing & Real-time Deduction Notebook (Desktop Split) -->
          <div id="panel-left" class="left-panel p-4 space-y-4">
            <!-- Case Synopsis Card -->
            <div class="bg-slate-900/80 p-3.5 rounded-xl border border-white/10">
              <div class="text-xs font-mono uppercase text-amber-400 mb-1 flex items-center justify-between">
                <span>The Case Dossier</span>
                <span class="text-slate-500">${this.level.icon}</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">${this.level.synopsis || this.level.description}</p>
            </div>

            <!-- Solved Matches Live Notebook -->
            <div class="bg-slate-900/80 p-3.5 rounded-xl border border-white/10 flex-1 flex flex-col min-h-[220px]">
              <div class="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <h3 class="text-xs font-bold uppercase tracking-wider font-mono text-emerald-400 flex items-center gap-1.5">
                  ${assets.get('notebook')} Deduction Notebook
                </h3>
                <span id="notebook-status" class="text-xs font-mono text-slate-400">0 of 12 proven</span>
              </div>
              <div id="notebook-list" class="space-y-1.5 overflow-y-auto max-h-[300px] flex-1 text-xs">
                <!-- Dynamically populated -->
              </div>
            </div>

            <!-- Legend -->
            <div class="p-2.5 rounded-lg bg-slate-950/60 border border-white/5 text-[11px] text-slate-400 flex items-center justify-around font-mono">
              <span class="flex items-center gap-1"><span class="w-3.5 h-3.5 border border-white/20 rounded bg-slate-800 inline-block"></span> Tap: Empty</span>
              <span class="flex items-center gap-1"><span class="text-rose-400 font-bold">❌</span> 1st: Impossible</span>
              <span class="flex items-center gap-1"><span class="text-emerald-400 font-bold">✔️</span> 2nd: Match</span>
            </div>
          </div>

          <!-- RIGHT PANEL: Logic Grid & Clues Checklist -->
          <div id="panel-right" class="right-panel space-y-6">
            <!-- Grid Container -->
            <div id="tab-content-grid" class="flex flex-col items-center justify-center overflow-x-auto w-full py-2">
              <div id="matrix-wrapper" class="grid-container max-w-full overflow-x-auto">
                <!-- Dynamically populated matrix table -->
              </div>
            </div>

            <!-- Clues Section -->
            <div id="tab-content-clues" class="w-full max-w-3xl mx-auto">
              <div class="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <h3 class="text-xs font-bold uppercase tracking-wider font-mono text-amber-400 flex items-center gap-1.5">
                  ${assets.get('list')} Evidence & Clues Checklist
                </h3>
                <span class="text-xs text-slate-400">Tap clue to cross off</span>
              </div>
              <div id="clues-list" class="space-y-2">
                <!-- Dynamically populated clues -->
              </div>
            </div>
          </div>
        </div>

        <!-- FOOTER TICKER -->
        <footer class="ticker-bar">
          <span class="text-amber-400 font-mono mr-2 shrink-0">LOGIC TICKER:</span>
          <span id="ticker-text" class="truncate">Select any clue or tap cells to deduce the mystery.</span>
        </footer>
      </div>

      <!-- MODAL VICTORY -->
      <div id="modal-victory" class="hidden modal-overlay">
        <div class="modal-content text-center">
          <div class="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 shadow-lg">
            ${assets.get('trophy')}
          </div>
          <div class="text-xs uppercase font-mono tracking-widest text-amber-400 mb-1">Case Solved With Absolute Logic</div>
          <h2 class="text-2xl font-bold font-display text-white mb-2">Brilliant Investigation!</h2>
          <p id="victory-summary" class="text-xs text-slate-300 mb-6 leading-relaxed">
            All 12 logical correlations across suspects, locations, and artifacts have been verified beyond any doubt.
          </p>

          <div class="grid grid-cols-2 gap-3 mb-6 font-mono text-xs">
            <div class="p-3 bg-slate-950/80 rounded-lg border border-white/10">
              <span class="text-slate-400 block mb-0.5">Investigation Time</span>
              <strong id="victory-time" class="text-lg text-amber-400">00:00</strong>
            </div>
            <div class="p-3 bg-slate-950/80 rounded-lg border border-white/10">
              <span class="text-slate-400 block mb-0.5">Total Deductive Moves</span>
              <strong id="victory-moves" class="text-lg text-emerald-400">0</strong>
            </div>
          </div>

          <div class="flex items-center justify-center gap-3">
            <button id="btn-victory-replay" class="btn px-4 py-2 text-xs">Play Again</button>
            <button id="btn-victory-menu" class="btn btn-primary px-6 py-2 text-xs">Case File Closed</button>
          </div>
        </div>
      </div>

      <!-- MODAL HINT -->
      <div id="modal-hint" class="hidden modal-overlay">
        <div class="modal-content">
          <div class="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <h3 class="text-sm font-bold font-display text-amber-400 flex items-center gap-2">
              ${assets.get('hint')} Logic Deduction Assistant
            </h3>
            <button id="btn-close-hint" class="btn btn-icon text-xs">${assets.get('cross')}</button>
          </div>
          <div id="hint-content" class="text-xs text-slate-200 leading-relaxed space-y-3 mb-5">
            <!-- Dynamically generated -->
          </div>
          <div class="text-right">
            <button id="btn-apply-hint" class="btn btn-primary text-xs px-4 py-1.5">Highlight In Grid</button>
          </div>
        </div>
      </div>
    `;

    this.updateRecordDisplay();
  }

  bindEvents() {
    // Menu buttons
    document.getElementById('btn-start-game')?.addEventListener('click', () => {
      this.sound.playClick();
      this.startGame();
    });

    document.getElementById('btn-show-tutorial')?.addEventListener('click', () => {
      this.sound.playClick();
      this.showScreen('screen-tutorial');
    });

    document.getElementById('btn-close-tutorial')?.addEventListener('click', () => {
      this.sound.playClick();
      this.showScreen('screen-main-menu');
    });

    document.getElementById('btn-tutorial-ok')?.addEventListener('click', () => {
      this.sound.playClick();
      this.startGame();
    });

    document.getElementById('btn-menu-back')?.addEventListener('click', () => {
      this.sound.playClick();
      if (this.onBack) this.onBack();
    });

    // Sound Toggles
    const toggleSound = () => {
      const isMuted = this.sound.toggleMute();
      const icon = window.GameAssets.get(isMuted ? 'volumeOff' : 'volumeOn');
      const b1 = document.getElementById('btn-sound-toggle-menu');
      const b2 = document.getElementById('btn-sound-toggle-game');
      if (b1) b1.innerHTML = icon;
      if (b2) b2.innerHTML = icon;
      if (!isMuted) this.sound.playClick();
    };
    document.getElementById('btn-sound-toggle-menu')?.addEventListener('click', toggleSound);
    document.getElementById('btn-sound-toggle-game')?.addEventListener('click', toggleSound);

    // Gameplay Header
    document.getElementById('btn-back-to-menu')?.addEventListener('click', () => {
      this.sound.playClick();
      this.stopTimer();
      this.showScreen('screen-main-menu');
    });

    document.getElementById('btn-undo')?.addEventListener('click', () => {
      this.undo();
    });

    document.getElementById('btn-auto-cross')?.addEventListener('click', () => {
      this.autoCross = !this.autoCross;
      const btn = document.getElementById('btn-auto-cross');
      if (btn) {
        btn.className = `btn text-xs py-1.5 px-2 font-mono ${this.autoCross ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-slate-400 bg-slate-800'}`;
      }
      this.sound.playClick();
    });

    document.getElementById('btn-hint')?.addEventListener('click', () => {
      this.provideHint();
    });

    // Mobile tabs
    document.querySelectorAll('.mobile-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.switchMobileTab(tab);
      });
    });

    // Victory buttons
    document.getElementById('btn-victory-replay')?.addEventListener('click', () => {
      document.getElementById('modal-victory').classList.add('hidden');
      this.startGame();
    });

    document.getElementById('btn-victory-menu')?.addEventListener('click', () => {
      document.getElementById('modal-victory').classList.add('hidden');
      if (this.onBack) {
        this.onBack();
      } else {
        this.showScreen('screen-main-menu');
      }
    });

    // Hint modal close
    document.getElementById('btn-close-hint')?.addEventListener('click', () => {
      document.getElementById('modal-hint').classList.add('hidden');
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        this.undo();
      }
    });
  }

  showScreen(screenId) {
    ['screen-main-menu', 'screen-tutorial', 'screen-gameplay'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('hidden', id !== screenId);
    });
    this.currentScreen = screenId;
    if (screenId === 'screen-main-menu') {
      this.updateRecordDisplay();
    }
  }

  switchMobileTab(tab) {
    this.activeMobileTab = tab;
    document.querySelectorAll('.mobile-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tab);
    });

    const leftPanel = document.getElementById('panel-left');
    const rightPanel = document.getElementById('panel-right');
    const tabGrid = document.getElementById('tab-content-grid');
    const tabClues = document.getElementById('tab-content-clues');

    if (window.innerWidth < 1024) {
      if (tab === 'notebook') {
        leftPanel?.classList.remove('hidden');
        rightPanel?.classList.add('hidden');
      } else {
        leftPanel?.classList.add('hidden');
        rightPanel?.classList.remove('hidden');
        if (tab === 'grid') {
          tabGrid?.classList.remove('hidden');
          tabClues?.classList.add('hidden');
        } else {
          tabGrid?.classList.add('hidden');
          tabClues?.classList.remove('hidden');
        }
      }
    } else {
      leftPanel?.classList.remove('hidden');
      rightPanel?.classList.remove('hidden');
      tabGrid?.classList.remove('hidden');
      tabClues?.classList.remove('hidden');
    }
    this.sound.playClick();
  }

  startGame() {
    this.gridState = {};
    this.historyStack = [];
    this.clueStates = {};
    this.timerSeconds = 0;
    this.startTimer();
    this.buildMatrixDOM();
    this.renderClues();
    this.updateNotebook();
    this.showScreen('screen-gameplay');
    this.switchMobileTab('grid');
    this.setTicker(`Case opened: ${this.level.title}. Analyze clues and mark grid cells.`);
  }

  startTimer() {
    this.stopTimer();
    this.isTimerRunning = true;
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      const m = String(Math.floor(this.timerSeconds / 60)).padStart(2, '0');
      const s = String(this.timerSeconds % 60).padStart(2, '0');
      const el = document.getElementById('game-timer');
      if (el) el.textContent = `${m}:${s}`;
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isTimerRunning = false;
  }

  buildMatrixDOM() {
    const wrapper = document.getElementById('matrix-wrapper');
    if (!wrapper) return;

    const catA = this.level.categories.categoryA; // Rows top-level
    const catB = this.level.categories.categoryB; // Cols first block
    const catC = this.level.categories.categoryC; // Cols second block & Rows second block

    // Structure of 3 subgrids:
    // Subgrid 1: Cat A (rows) vs Cat B (cols)
    // Subgrid 2: Cat A (rows) vs Cat C (cols)
    // Subgrid 3: Cat C (rows) vs Cat B (cols)

    let html = `<table class="logic-table">`;

    // 1. Column Category Headers Row
    html += `<tr>`;
    html += `<th colspan="2" rowspan="2" class="bg-slate-950/80 border-r-2 border-b-2 border-white/30"></th>`;
    html += `<th colspan="${catB.items.length}" class="cat-header-top text-emerald-400 border-r-2 border-white/30">${catB.name}</th>`;
    html += `<th colspan="${catC.items.length}" class="cat-header-top text-rose-400 border-r-2 border-white/30">${catC.name}</th>`;
    html += `</tr>`;

    // 2. Column Item Labels Row
    html += `<tr>`;
    catB.items.forEach((item, idx) => {
      const isDivider = idx === catB.items.length - 1;
      html += `<th class="item-label-top ${isDivider ? 'divider-col' : ''}" title="${item.name}">
        <div class="rotated-text">${item.name}</div>
      </th>`;
    });
    catC.items.forEach((item, idx) => {
      const isDivider = idx === catC.items.length - 1;
      html += `<th class="item-label-top ${isDivider ? 'divider-col' : ''}" title="${item.name}">
        <div class="rotated-text">${item.name}</div>
      </th>`;
    });
    html += `</tr>`;

    // 3. Category A Rows (vs Cat B & vs Cat C)
    catA.items.forEach((itemA, rowIdx) => {
      const isDividerRow = rowIdx === catA.items.length - 1;
      html += `<tr class="${isDividerRow ? 'divider-row' : ''}">`;
      if (rowIdx === 0) {
        html += `<th rowspan="${catA.items.length}" class="cat-header-side text-amber-400">${catA.name}</th>`;
      }
      html += `<th class="item-label-side" title="${itemA.name}">${itemA.name}</th>`;

      // Subgrid 1 cells: Cat A vs Cat B
      catB.items.forEach((itemB, colIdx) => {
        const isDividerCol = colIdx === catB.items.length - 1;
        const cellKey = this.makeKey('categoryA', itemA.id, 'categoryB', itemB.id);
        html += `<td class="grid-cell ${isDividerCol ? 'divider-col' : ''}" data-key="${cellKey}" data-row="catA_${itemA.id}" data-col="catB_${itemB.id}"></td>`;
      });

      // Subgrid 2 cells: Cat A vs Cat C
      catC.items.forEach((itemC, colIdx) => {
        const isDividerCol = colIdx === catC.items.length - 1;
        const cellKey = this.makeKey('categoryA', itemA.id, 'categoryC', itemC.id);
        html += `<td class="grid-cell ${isDividerCol ? 'divider-col' : ''}" data-key="${cellKey}" data-row="catA_${itemA.id}" data-col="catC_${itemC.id}"></td>`;
      });

      html += `</tr>`;
    });

    // 4. Category C Rows (vs Cat B only - standard logic grid lower quadrant)
    catC.items.forEach((itemC, rowIdx) => {
      const isDividerRow = rowIdx === catC.items.length - 1;
      html += `<tr class="${isDividerRow ? 'divider-row' : ''}">`;
      if (rowIdx === 0) {
        html += `<th rowspan="${catC.items.length}" class="cat-header-side text-rose-400">${catC.name}</th>`;
      }
      html += `<th class="item-label-side" title="${itemC.name}">${itemC.name}</th>`;

      // Subgrid 3 cells: Cat C vs Cat B
      catB.items.forEach((itemB, colIdx) => {
        const isDividerCol = colIdx === catB.items.length - 1;
        const cellKey = this.makeKey('categoryC', itemC.id, 'categoryB', itemB.id);
        html += `<td class="grid-cell ${isDividerCol ? 'divider-col' : ''}" data-key="${cellKey}" data-row="catC_${itemC.id}" data-col="catB_${itemB.id}"></td>`;
      });

      // Blank filler for lower right quadrant
      html += `<td colspan="${catC.items.length}" class="bg-slate-950/60 border-r-2 border-white/20"></td>`;
      html += `</tr>`;
    });

    html += `</table>`;
    wrapper.innerHTML = html;

    // Attach cell click events
    wrapper.querySelectorAll('.grid-cell').forEach(cell => {
      cell.addEventListener('click', (e) => {
        const key = e.currentTarget.getAttribute('data-key');
        if (key) this.cycleCellState(key);
      });

      // Cell Hover Highlights
      cell.addEventListener('mouseenter', (e) => {
        const row = e.currentTarget.getAttribute('data-row');
        const col = e.currentTarget.getAttribute('data-col');
        this.highlightRowCol(row, col);
      });
      cell.addEventListener('mouseleave', () => {
        this.clearRowColHighlight();
      });
    });
  }

  highlightRowCol(row, col) {
    document.querySelectorAll(`.grid-cell[data-row="${row}"]`).forEach(c => c.classList.add('highlight-row'));
    document.querySelectorAll(`.grid-cell[data-col="${col}"]`).forEach(c => c.classList.add('highlight-col'));
  }

  clearRowColHighlight() {
    document.querySelectorAll('.grid-cell.highlight-row').forEach(c => c.classList.remove('highlight-row'));
    document.querySelectorAll('.grid-cell.highlight-col').forEach(c => c.classList.remove('highlight-col'));
  }

  makeKey(cat1, id1, cat2, id2) {
    // Alphabetically sort category keys so key is canonical
    if (cat1 > cat2) {
      return `${cat2}:${id2}__${cat1}:${id1}`;
    }
    return `${cat1}:${id1}__${cat2}:${id2}`;
  }

  parseKey(key) {
    const [p1, p2] = key.split('__');
    const [c1, i1] = p1.split(':');
    const [c2, i2] = p2.split(':');
    return { cat1: c1, id1: i1, cat2: c2, id2: i2 };
  }

  cycleCellState(key) {
    const current = this.gridState[key] || 'EMPTY';
    let nextState = 'EMPTY';
    if (current === 'EMPTY') {
      nextState = 'CROSS';
      this.sound.playCross();
    } else if (current === 'CROSS') {
      nextState = 'CHECK';
      this.sound.playCheck();
    } else {
      nextState = 'EMPTY';
      this.sound.playClick();
    }

    const moveRecord = {
      key,
      prevState: current,
      newState: nextState,
      autoEliminated: []
    };

    this.gridState[key] = nextState;

    // Handle Auto-Eliminate of Row & Column on CHECK
    if (nextState === 'CHECK' && this.autoCross) {
      const parsed = this.parseKey(key);
      const cat1Items = this.level.categories[parsed.cat1].items;
      const cat2Items = this.level.categories[parsed.cat2].items;

      // Auto-cross other items in row (same cat1, other cat2)
      cat2Items.forEach(item => {
        if (item.id !== parsed.id2) {
          const sisterKey = this.makeKey(parsed.cat1, parsed.id1, parsed.cat2, item.id);
          if (!this.gridState[sisterKey] || this.gridState[sisterKey] === 'EMPTY') {
            this.gridState[sisterKey] = 'CROSS';
            moveRecord.autoEliminated.push({ key: sisterKey, prev: 'EMPTY' });
          }
        }
      });

      // Auto-cross other items in col (other cat1, same cat2)
      cat1Items.forEach(item => {
        if (item.id !== parsed.id1) {
          const sisterKey = this.makeKey(parsed.cat1, item.id, parsed.cat2, parsed.id2);
          if (!this.gridState[sisterKey] || this.gridState[sisterKey] === 'EMPTY') {
            this.gridState[sisterKey] = 'CROSS';
            moveRecord.autoEliminated.push({ key: sisterKey, prev: 'EMPTY' });
          }
        }
      });
    }

    this.historyStack.push(moveRecord);
    this.updateMatrixCellDOM(key);
    moveRecord.autoEliminated.forEach(rec => this.updateMatrixCellDOM(rec.key));

    this.updateNotebook();
    this.checkVictoryCondition();
  }

  updateMatrixCellDOM(key) {
    const cell = document.querySelector(`.grid-cell[data-key="${key}"]`);
    if (!cell) return;
    const state = this.gridState[key] || 'EMPTY';
    const assets = window.GameAssets;

    if (state === 'CROSS') {
      cell.innerHTML = `<div class="cell-icon cell-cross">${assets.get('cross')}</div>`;
    } else if (state === 'CHECK') {
      cell.innerHTML = `<div class="cell-icon cell-check">${assets.get('check')}</div>`;
    } else {
      cell.innerHTML = '';
    }
  }

  undo() {
    if (this.historyStack.length === 0) return;
    const lastMove = this.historyStack.pop();

    this.gridState[lastMove.key] = lastMove.prevState;
    this.updateMatrixCellDOM(lastMove.key);

    lastMove.autoEliminated.forEach(rec => {
      this.gridState[rec.key] = rec.prev;
      this.updateMatrixCellDOM(rec.key);
    });

    this.sound.playUndo();
    this.updateNotebook();
    this.setTicker('Reverted last deductive move.');
  }

  renderClues() {
    const list = document.getElementById('clues-list');
    if (!list) return;
    const assets = window.GameAssets;

    let html = '';
    this.level.clues.forEach((clue, idx) => {
      const isStruck = !!this.clueStates[clue.id];
      html += `
        <div class="clue-card ${isStruck ? 'strikethrough' : ''}" data-clue-id="${clue.id}">
          <span class="clue-badge">#${idx + 1}</span>
          <div class="flex-1 text-xs md:text-sm text-slate-200 leading-relaxed">${clue.text}</div>
          <button class="btn-inspect-clue text-xs p-1 text-amber-400 hover:text-amber-300 rounded" title="Highlight target in grid" data-clue-idx="${idx}">
            ${assets.get('search')}
          </button>
        </div>
      `;
    });
    list.innerHTML = html;

    list.querySelectorAll('.clue-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-inspect-clue')) return;
        const clueId = card.getAttribute('data-clue-id');
        this.clueStates[clueId] = !this.clueStates[clueId];
        card.classList.toggle('strikethrough', this.clueStates[clueId]);
        this.sound.playClick();
      });
    });

    list.querySelectorAll('.btn-inspect-clue').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-clue-idx'), 10);
        const clue = this.level.clues[idx];
        if (clue && clue.hintTarget) {
          this.highlightClueTarget(clue);
        }
        this.setTicker(`Inspecting Clue #${idx + 1}: ${clue.text}`);
        this.sound.playClick();
      });
    });
  }

  highlightClueTarget(clue) {
    if (!clue.hintTarget) return;
    const { cat1, item1, cat2, item2 } = clue.hintTarget;
    const key = this.makeKey(cat1, item1, cat2, item2);
    const cell = document.querySelector(`.grid-cell[data-key="${key}"]`);
    if (cell) {
      cell.scrollIntoView({ behavior: 'smooth', block: 'center' });
      cell.classList.add('highlight-row');
      setTimeout(() => cell.classList.remove('highlight-row'), 1800);
    }
  }

  updateNotebook() {
    const list = document.getElementById('notebook-list');
    const counter = document.getElementById('game-pairs-counter');
    const status = document.getElementById('notebook-status');
    const assets = window.GameAssets;

    const checkedPairs = [];
    Object.keys(this.gridState).forEach(key => {
      if (this.gridState[key] === 'CHECK') {
        const parsed = this.parseKey(key);
        const item1 = this.level.categories[parsed.cat1]?.items.find(i => i.id === parsed.id1);
        const item2 = this.level.categories[parsed.cat2]?.items.find(i => i.id === parsed.id2);
        if (item1 && item2) {
          checkedPairs.push({
            name1: item1.name,
            name2: item2.name,
            cat1: parsed.cat1,
            cat2: parsed.cat2
          });
        }
      }
    });

    const totalPairsNeeded = 12; // 4 in catA vs catB + 4 in catA vs catC + 4 in catB vs catC
    if (counter) counter.textContent = `${checkedPairs.length} / ${totalPairsNeeded}`;
    if (status) status.textContent = `${checkedPairs.length} of ${totalPairsNeeded} proven`;

    if (!list) return;
    if (checkedPairs.length === 0) {
      list.innerHTML = `<div class="p-4 text-center text-slate-500 italic">No connections verified yet. Mark ✔️ on the grid to record deductions here.</div>`;
      return;
    }

    list.innerHTML = checkedPairs.map(p => `
      <div class="fact-card">
        <span class="text-emerald-400 font-bold">✔️</span>
        <strong class="text-slate-100">${p.name1}</strong>
        <span class="text-slate-400">matches</span>
        <strong class="text-amber-300">${p.name2}</strong>
      </div>
    `).join('');
  }

  checkVictoryCondition() {
    const sol = this.level.solution;
    if (!sol) return;

    let isComplete = true;
    let checkedCount = 0;

    // Check each suspect in solution
    const catA = this.level.categories.categoryA.items;
    for (const itemA of catA) {
      const expected = sol[itemA.id];
      if (!expected) continue;

      const keyAB = this.makeKey('categoryA', itemA.id, 'categoryB', expected.categoryB);
      const keyAC = this.makeKey('categoryA', itemA.id, 'categoryC', expected.categoryC);
      const keyBC = this.makeKey('categoryB', expected.categoryB, 'categoryC', expected.categoryC);

      if (this.gridState[keyAB] !== 'CHECK' || this.gridState[keyAC] !== 'CHECK' || this.gridState[keyBC] !== 'CHECK') {
        isComplete = false;
        break;
      }
    }

    if (isComplete) {
      this.triggerVictory();
    }
  }

  triggerVictory() {
    this.stopTimer();
    this.sound.playVictory();

    // Persist Record
    const storageKey = `case_${this.gameKey}_${this.level.id || 1}`;
    const bestTime = localStorage.getItem(`${storageKey}_best_time`);
    if (!bestTime || this.timerSeconds < parseInt(bestTime, 10)) {
      localStorage.setItem(`${storageKey}_best_time`, this.timerSeconds);
    }
    localStorage.setItem(`${storageKey}_solved`, 'true');

    const m = String(Math.floor(this.timerSeconds / 60)).padStart(2, '0');
    const s = String(this.timerSeconds % 60).padStart(2, '0');

    const modal = document.getElementById('modal-victory');
    const timeEl = document.getElementById('victory-time');
    const movesEl = document.getElementById('victory-moves');

    if (timeEl) timeEl.textContent = `${m}:${s}`;
    if (movesEl) movesEl.textContent = `${this.historyStack.length}`;
    if (modal) modal.classList.remove('hidden');

    this.setTicker(`🏆 VICTORY: Case solved in ${m}:${s} with ${this.historyStack.length} moves!`);
  }

  provideHint() {
    const modal = document.getElementById('modal-hint');
    const content = document.getElementById('hint-content');
    const applyBtn = document.getElementById('btn-apply-hint');
    if (!modal || !content) return;

    // Find first unsolved clue with a hintTarget
    let targetClue = null;
    for (const clue of this.level.clues) {
      if (clue.hintTarget) {
        const key = this.makeKey(clue.hintTarget.cat1, clue.hintTarget.item1, clue.hintTarget.cat2, clue.hintTarget.item2);
        const expected = clue.hintTarget.state; // 'CHECK' or 'CROSS'
        if (this.gridState[key] !== expected) {
          targetClue = clue;
          break;
        }
      }
    }

    if (!targetClue) {
      content.innerHTML = `
        <p class="text-emerald-400 font-semibold">You have addressed all direct clue inferences!</p>
        <p class="text-slate-300">Look at the rows and columns that only have one empty cell remaining, or cross-reference the confirmed pairs in your deduction notebook.</p>
      `;
      if (applyBtn) applyBtn.classList.add('hidden');
    } else {
      const t = targetClue.hintTarget;
      const i1 = this.level.categories[t.cat1].items.find(i => i.id === t.item1)?.name;
      const i2 = this.level.categories[t.cat2].items.find(i => i.id === t.item2)?.name;

      content.innerHTML = `
        <div class="p-3 bg-slate-950/80 rounded-lg border border-amber-500/30">
          <div class="text-xs font-mono text-amber-400 mb-1">Clue Reference: "${targetClue.text}"</div>
          <p class="text-sm font-semibold text-white">Deduction: <strong class="text-amber-300">${i1}</strong> and <strong class="text-amber-300">${i2}</strong> should be marked as <span class="${t.state === 'CHECK' ? 'text-emerald-400' : 'text-rose-400'} font-mono font-bold">${t.state === 'CHECK' ? '✔️ (Match)' : '❌ (Impossible)'}</span>.</p>
          <p class="text-xs text-slate-300 mt-2">${t.reason || 'Careful reading of the clue rules this connection out.'}</p>
        </div>
      `;

      if (applyBtn) {
        applyBtn.classList.remove('hidden');
        applyBtn.onclick = () => {
          modal.classList.add('hidden');
          this.highlightClueTarget(targetClue);
          this.sound.playClick();
        };
      }
    }

    modal.classList.remove('hidden');
    this.sound.playHint();
  }

  setTicker(text) {
    const el = document.getElementById('ticker-text');
    if (el) el.textContent = text;
  }

  updateRecordDisplay() {
    const storageKey = `case_${this.gameKey}_${this.level.id || 1}`;
    const bestTime = localStorage.getItem(`${storageKey}_best_time`);
    const isSolved = localStorage.getItem(`${storageKey}_solved`) === 'true';

    const timeEl = document.getElementById('menu-best-time');
    const badgeEl = document.getElementById('menu-solved-badge');

    if (timeEl) {
      if (bestTime) {
        const m = String(Math.floor(parseInt(bestTime, 10) / 60)).padStart(2, '0');
        const s = String(parseInt(bestTime, 10) % 60).padStart(2, '0');
        timeEl.textContent = `${m}:${s}`;
      } else {
        timeEl.textContent = '--:--';
      }
    }

    if (badgeEl) {
      if (isSolved) {
        badgeEl.textContent = 'SOLVED ⭐';
        badgeEl.className = 'text-amber-400 font-bold';
      } else {
        badgeEl.textContent = 'UNSOLVED';
        badgeEl.className = 'text-slate-500';
      }
    }
  }

  initCanvas() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.initParticles();
    };
    window.addEventListener('resize', resize);
    resize();

    this.animateCanvas();
  }

  initParticles() {
    this.particles = [];
    const count = Math.floor((this.canvas.width * this.canvas.height) / 18000);
    const particleColor = this.theme === 'scifi' ? 'rgba(56, 189, 248, ' : 'rgba(245, 158, 11, ';

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        baseAlpha: Math.random() * 0.25 + 0.05,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulsePhase: Math.random() * Math.PI * 2,
        colorPrefix: particleColor
      });
    }
  }

  animateCanvas() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Subtle atmospheric gradient
    const grad = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 50,
      this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) * 0.7
    );
    if (this.theme === 'scifi') {
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.4)');
      grad.addColorStop(1, 'rgba(2, 6, 23, 0.85)');
    } else {
      grad.addColorStop(0, 'rgba(30, 20, 10, 0.25)');
      grad.addColorStop(1, 'rgba(9, 13, 22, 0.85)');
    }
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render floating dust / stars
    for (const p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulsePhase += p.pulseSpeed;

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      const alpha = p.baseAlpha + Math.sin(p.pulsePhase) * 0.1;
      this.ctx.fillStyle = `${p.colorPrefix}${Math.max(0, alpha)})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.animFrameId = requestAnimationFrame(() => this.animateCanvas());
  }

  destroy() {
    this.stopTimer();
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
  }
}

window.LogicGridEngine = LogicGridEngine;
