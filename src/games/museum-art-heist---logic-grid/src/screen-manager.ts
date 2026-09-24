/**
 * Screen State Controller and UI Event Handlers
 */

import { game, LEVELS } from './game-state';
import { sound } from './audio';
import { BoardRenderer } from './renderer';
import { DisplayManager } from './display';

export type GameScreen = 'MAIN_MENU' | 'LEVEL_SELECT' | 'HOW_TO_PLAY' | 'PLAYING';

export class ScreenController {
  private currentScreen: GameScreen = 'MAIN_MENU';
  private displayManager: DisplayManager | null = null;
  private renderer: BoardRenderer | null = null;
  private timerInterval: number | null = null;
  private hintCountdownInterval: number | null = null;

  public init() {
    this.setupDOM();
    this.setupEventListeners();
    this.updateScreenVisibility();
    this.updateSoundIcons();
  }

  public setScreen(screen: GameScreen) {
    this.currentScreen = screen;
    this.updateScreenVisibility();
    sound.playClick();

    if (screen === 'PLAYING') {
      this.startLevelTimer();
      sound.startAmbient();
      if (this.displayManager) {
        setTimeout(() => this.displayManager?.resize(), 50);
      }
      if (this.renderer) {
        this.renderer.start();
      }
    } else {
      this.stopLevelTimer();
      if (this.renderer) {
        this.renderer.stop();
      }
    }

    if (screen === 'LEVEL_SELECT') {
      this.renderLevelSelectGrid();
    }
  }

  private setupDOM() {
    const canvas = document.getElementById('board-canvas') as HTMLCanvasElement;
    if (canvas) {
      this.renderer = new BoardRenderer(canvas);
      this.displayManager = new DisplayManager(canvas, (w, h) => {
        this.renderer?.setSize(w, h);
      });
    }
  }

  private setupEventListeners() {
    // Menu navigation
    document.getElementById('btn-play-now')?.addEventListener('click', () => {
      game.startLevel(Math.min(game.unlockedLevel - 1, LEVELS.length - 1));
      this.setScreen('PLAYING');
      this.renderPlayScreen();
    });

    document.getElementById('btn-level-select')?.addEventListener('click', () => {
      this.setScreen('LEVEL_SELECT');
    });

    document.getElementById('btn-how-to-play')?.addEventListener('click', () => {
      this.setScreen('HOW_TO_PLAY');
    });

    document.getElementById('btn-back-menu-from-levels')?.addEventListener('click', () => {
      this.setScreen('MAIN_MENU');
    });

    document.getElementById('btn-back-menu-from-tutorial')?.addEventListener('click', () => {
      this.setScreen('MAIN_MENU');
    });

    document.getElementById('btn-pause-menu')?.addEventListener('click', () => {
      this.setScreen('MAIN_MENU');
    });

    // Sound toggle buttons
    const soundButtons = ['btn-sound-toggle-menu', 'btn-sound-toggle-hud'];
    soundButtons.forEach(id => {
      document.getElementById(id)?.addEventListener('click', () => {
        sound.toggleMute();
        this.updateSoundIcons();
      });
    });

    // Gameplay controls
    document.getElementById('btn-undo')?.addEventListener('click', () => {
      if (game.undo()) {
        sound.playClick();
        this.renderPlayScreen();
      }
    });

    document.getElementById('btn-reset-grid')?.addEventListener('click', () => {
      game.resetGrid();
      sound.playPencil();
      this.renderPlayScreen();
    });

    document.getElementById('btn-hint')?.addEventListener('click', () => {
      this.openHintModal();
    });

    // View tab switchers (Grade | Pistas | Resumo)
    const tabs: ('grid' | 'clues' | 'summary')[] = ['grid', 'clues', 'summary'];
    tabs.forEach(tab => {
      document.getElementById(`tab-btn-${tab}`)?.addEventListener('click', () => {
        game.activeTab = tab;
        sound.playClick();
        this.updateTabView();
      });
    });

    const openCluesTab = () => {
      game.activeTab = 'clues';
      sound.playClick();
      this.updateTabView();
    };

    document.getElementById('btn-ticker-see-clues')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openCluesTab();
    });

    document.getElementById('hud-ticker-banner')?.addEventListener('click', () => {
      openCluesTab();
    });

    // Hint rewarded ad buttons
    document.getElementById('btn-close-hint')?.addEventListener('click', () => {
      this.closeHintModal();
    });

    document.getElementById('btn-claim-hint')?.addEventListener('click', () => {
      const result = game.applyStepHint();
      sound.playHint();
      this.closeHintModal();
      this.showToast(result.message);
      this.renderPlayScreen();
    });

    // Next Level button
    document.getElementById('btn-next-level')?.addEventListener('click', () => {
      const nextLvl = game.currentLevelIndex + 1;
      if (nextLvl < LEVELS.length) {
        game.startLevel(nextLvl);
        this.setScreen('PLAYING');
        this.renderPlayScreen();
      } else {
        this.setScreen('LEVEL_SELECT');
      }
    });

    // Restart Level button
    document.getElementById('btn-restart-level')?.addEventListener('click', () => {
      sound.playClick();
      game.startLevel(game.currentLevelIndex);
      this.setScreen('PLAYING');
      this.renderPlayScreen();
    });

    // Window Resize Handler for Responsive Split-View
    window.addEventListener('resize', () => {
      if (this.currentScreen === 'PLAYING') {
        this.updateTabView();
      }
    });
  }

  private updateSoundIcons() {
    const isMuted = sound.isMuted();
    const soundIcons = document.querySelectorAll('.sound-icon');
    soundIcons.forEach(el => {
      el.textContent = isMuted ? '🔇' : '🔊';
    });
  }

  private updateScreenVisibility() {
    const screens = {
      'MAIN_MENU': document.getElementById('screen-main-menu'),
      'LEVEL_SELECT': document.getElementById('screen-level-select'),
      'HOW_TO_PLAY': document.getElementById('screen-how-to-play'),
      'PLAYING': document.getElementById('screen-playing')
    };

    Object.entries(screens).forEach(([key, el]) => {
      if (el) {
        if (key === this.currentScreen) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });
  }

  private updateTabView() {
    const tabGrid = document.getElementById('view-grid');
    const tabClues = document.getElementById('view-clues');
    const tabSummary = document.getElementById('view-summary');
    const tabBoard = document.getElementById('view-board');

    const btnGrid = document.getElementById('tab-btn-grid');
    const btnClues = document.getElementById('tab-btn-clues');
    const btnSummary = document.getElementById('tab-btn-summary');

    const activeClasses = ['bg-indigo-600', 'text-white', 'font-bold', 'shadow-md', 'shadow-indigo-600/30'];
    const inactiveClasses = ['bg-slate-800', 'text-slate-300', 'hover:bg-slate-700'];

    const setTabStyle = (btn: HTMLElement | null, isActive: boolean) => {
      if (!btn) return;
      if (isActive) {
        btn.classList.add(...activeClasses);
        btn.classList.remove(...inactiveClasses);
      } else {
        btn.classList.remove(...activeClasses);
        btn.classList.add(...inactiveClasses);
      }
    };

    setTabStyle(btnGrid, game.activeTab === 'grid');
    setTabStyle(btnClues, game.activeTab === 'clues');
    setTabStyle(btnSummary, game.activeTab === 'summary');

    // Update Clues Badge counter (e.g. 0/4)
    const cluesBadge = document.getElementById('hud-clues-badge');
    const readCount = game.cluesRead.size;
    const totalClues = game.currentLevel.cluesList.length;
    if (cluesBadge) {
      cluesBadge.textContent = `${readCount}/${totalClues}`;
    }

    const cluesProgressBadge = document.getElementById('clues-progress-badge');
    if (cluesProgressBadge) {
      cluesProgressBadge.textContent = `${readCount}/${totalClues} Read`;
    }

    // Update Ticker Text
    const tickerText = document.getElementById('hud-ticker-clue-text');
    if (tickerText && game.currentLevel.cluesList.length > 0) {
      // Find first unread clue or default to first clue
      let activeClueIdx = 0;
      for (let i = 0; i < totalClues; i++) {
        if (!game.cluesRead.has(i)) {
          activeClueIdx = i;
          break;
        }
      }
      tickerText.textContent = game.currentLevel.cluesList[activeClueIdx] || game.currentLevel.cluesList[0];
    }

    const isDesktop = window.innerWidth >= 1024;

    if (tabBoard) {
      if (isDesktop) {
        tabBoard.classList.remove('hidden');
        tabBoard.classList.add('block');
      } else {
        tabBoard.classList.add('hidden');
      }
    }

    if (tabGrid) {
      tabGrid.classList.toggle('hidden', game.activeTab !== 'grid');
    }

    if (tabClues) {
      tabClues.classList.toggle('hidden', game.activeTab !== 'clues');
    }

    if (tabSummary) {
      tabSummary.classList.toggle('hidden', game.activeTab !== 'summary');
    }

    if (this.displayManager) {
      setTimeout(() => this.displayManager?.resize(), 30);
    }

    if (game.activeTab === 'clues') {
      this.renderCluesTab();
    } else if (game.activeTab === 'summary') {
      this.renderSummaryTab();
    }
  }

  public renderPlayScreen() {
    const lvl = game.currentLevel;

    // Header updates
    const lvlBadge = document.getElementById('hud-level-badge');
    if (lvlBadge) lvlBadge.textContent = `LEVEL ${lvl.id}`;

    const titleEl = document.getElementById('play-level-title');
    if (titleEl) titleEl.textContent = lvl.title;

    const subtitleEl = document.getElementById('play-level-subtitle');
    if (subtitleEl) subtitleEl.textContent = lvl.subtitle;

    // Render Grid Matrix
    this.renderLogicGridMatrix();

    // Render Clues List
    this.renderCluesList();

    // Update Tab View
    this.updateTabView();

    // Update Win Banner if won
    const winBanner = document.getElementById('win-banner');
    if (winBanner) {
      if (game.isCompleted) {
        winBanner.classList.remove('hidden');
        sound.playWin();
      } else {
        winBanner.classList.add('hidden');
      }
    }

    if (this.renderer) {
      this.renderer.rebuildCards();
    }
  }

  private renderLogicGridMatrix() {
    const container = document.getElementById('logic-grid-container');
    if (!container) return;

    const lvl = game.currentLevel;
    const n = lvl.detectives.length;
    const isModular = game.gridDisplayMode === 'modular';

    let html = `
      <div class="w-full flex flex-col items-center gap-2">
        <!-- Layout mode toolbar -->
        <div class="w-full max-w-4xl flex items-center justify-between px-1 py-1 text-xs">
          <span class="text-[11px] text-slate-400 font-medium hidden sm:inline flex items-center gap-1">
            <span>⚡</span>
            <span>Dynamic auto-fit grid layout (Flex-Wrap)</span>
          </span>
          <button id="btn-toggle-grid-mode" class="btn-tactile ml-auto px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer">
            <span>${isModular ? '📱 Adaptive Mode (No Scroll)' : '📐 Unified Matrix Mode'}</span>
            <span class="text-slate-400 text-[10px]">(Toggle)</span>
          </button>
        </div>
    `;

    if (isModular) {
      // DYNAMIC RESPONSIVE MODULAR SUBGRIDS (Uses flex-wrap for zero-scroll on mobile)
      html += `
        <div class="w-full max-w-4xl flex flex-wrap gap-3 justify-center items-start">
          
          <!-- SUBGRID 1: Detectives x Paintings (AB) -->
          <div class="subgrid-card flex-1 min-w-[280px] max-w-md bg-slate-900/90 rounded-2xl border border-slate-800 p-2.5 sm:p-3 shadow-lg flex flex-col">
            <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
              <div class="flex items-center gap-1.5">
                <span class="text-sm">🕵️</span>
                <span class="font-bold text-xs text-sky-300">Detectives</span>
                <span class="text-slate-500 font-bold text-xs">×</span>
                <span class="text-sm">🎨</span>
                <span class="font-bold text-xs text-amber-300">Artworks</span>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800 font-mono">1/3</span>
            </div>
            
            <div class="w-full flex justify-center overflow-x-auto custom-scroll">
              <table class="border-collapse select-none text-xs">
                <thead>
                  <tr>
                    <th class="p-1 border border-transparent"></th>
                    ${lvl.paintings.map(p => `
                      <th class="p-1 border border-slate-700 bg-slate-800 text-center w-8 sm:w-10 max-w-[42px] truncate" title="${p.name}">
                        <div class="text-sm leading-none">${p.icon}</div>
                        <div class="text-[9px] text-slate-300 truncate w-full font-normal">${p.name.split(' ')[0]}</div>
                      </th>
                    `).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${lvl.detectives.map((d, r) => `
                    <tr>
                      <th class="p-1.5 border border-slate-700 bg-slate-800 text-left font-semibold text-sky-300 flex items-center gap-1 min-w-[90px] sm:min-w-[110px]" title="${d.name}">
                        <span class="text-sm">${d.icon}</span>
                        <span class="truncate text-[11px] sm:text-xs">${d.name.split(' ')[1] || d.name}</span>
                      </th>
                      ${lvl.paintings.map((_, c) => this.renderCellHTML('AB', r, c, game.gridState.AB[r][c])).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- SUBGRID 2: Detectives x Clues (AC) -->
          <div class="subgrid-card flex-1 min-w-[280px] max-w-md bg-slate-900/90 rounded-2xl border border-slate-800 p-2.5 sm:p-3 shadow-lg flex flex-col">
            <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
              <div class="flex items-center gap-1.5">
                <span class="text-sm">🕵️</span>
                <span class="font-bold text-xs text-sky-300">Detectives</span>
                <span class="text-slate-500 font-bold text-xs">×</span>
                <span class="text-sm">🔬</span>
                <span class="font-bold text-xs text-rose-300">Clues</span>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800 font-mono">2/3</span>
            </div>
            
            <div class="w-full flex justify-center overflow-x-auto custom-scroll">
              <table class="border-collapse select-none text-xs">
                <thead>
                  <tr>
                    <th class="p-1 border border-transparent"></th>
                    ${lvl.clues.map(c => `
                      <th class="p-1 border border-slate-700 bg-slate-800 text-center w-8 sm:w-10 max-w-[42px] truncate" title="${c.name}">
                        <div class="text-sm leading-none">${c.icon}</div>
                        <div class="text-[9px] text-slate-300 truncate w-full font-normal">${c.name.split(' ')[0]}</div>
                      </th>
                    `).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${lvl.detectives.map((d, r) => `
                    <tr>
                      <th class="p-1.5 border border-slate-700 bg-slate-800 text-left font-semibold text-sky-300 flex items-center gap-1 min-w-[90px] sm:min-w-[110px]" title="${d.name}">
                        <span class="text-sm">${d.icon}</span>
                        <span class="truncate text-[11px] sm:text-xs">${d.name.split(' ')[1] || d.name}</span>
                      </th>
                      ${lvl.clues.map((_, c) => this.renderCellHTML('AC', r, c, game.gridState.AC[r][c])).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- SUBGRID 3: Paintings x Clues (BC) -->
          <div class="subgrid-card flex-1 min-w-[280px] max-w-md bg-slate-900/90 rounded-2xl border border-slate-800 p-2.5 sm:p-3 shadow-lg flex flex-col">
            <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
              <div class="flex items-center gap-1.5">
                <span class="text-sm">🎨</span>
                <span class="font-bold text-xs text-amber-300">Artworks</span>
                <span class="text-slate-500 font-bold text-xs">×</span>
                <span class="text-sm">🔬</span>
                <span class="font-bold text-xs text-rose-300">Clues</span>
              </div>
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-mono">3/3</span>
            </div>
            
            <div class="w-full flex justify-center overflow-x-auto custom-scroll">
              <table class="border-collapse select-none text-xs">
                <thead>
                  <tr>
                    <th class="p-1 border border-transparent"></th>
                    ${lvl.clues.map(c => `
                      <th class="p-1 border border-slate-700 bg-slate-800 text-center w-8 sm:w-10 max-w-[42px] truncate" title="${c.name}">
                        <div class="text-sm leading-none">${c.icon}</div>
                        <div class="text-[9px] text-slate-300 truncate w-full font-normal">${c.name.split(' ')[0]}</div>
                      </th>
                    `).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${lvl.paintings.map((p, r) => `
                    <tr>
                      <th class="p-1.5 border border-slate-700 bg-slate-800 text-left font-semibold text-amber-300 flex items-center gap-1 min-w-[90px] sm:min-w-[110px]" title="${p.name}">
                        <span class="text-sm">${p.icon}</span>
                        <span class="truncate text-[11px] sm:text-xs">${p.name.split(' ')[0]}</span>
                      </th>
                      ${lvl.clues.map((_, c) => this.renderCellHTML('BC', r, c, game.gridState.BC[r][c])).join('')}
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      `;
    } else {
      // CLASSIC UNIFIED FULL MATRIX
      html += `
        <div class="inline-block min-w-full overflow-x-auto custom-scroll pb-2">
          <table class="border-collapse select-none text-xs sm:text-sm mx-auto">
            <thead>
              <tr>
                <th class="p-1 border border-transparent"></th>
                <th colspan="${n}" class="p-1.5 text-center font-bold text-amber-400 bg-slate-800/90 border border-slate-700 rounded-tl-lg">
                  🎨 ARTWORKS
                </th>
                <th colspan="${n}" class="p-1.5 text-center font-bold text-rose-400 bg-slate-800/90 border border-slate-700 rounded-tr-lg">
                  🔬 FORENSIC CLUES
                </th>
              </tr>
              <tr>
                <th class="p-1 border border-transparent"></th>
                ${lvl.paintings.map(p => `
                  <th class="p-1 border border-slate-700 bg-slate-800 text-center w-8 sm:w-11 max-w-[44px] truncate" title="${p.name} (${p.artist || ''})">
                    <div class="text-sm sm:text-base leading-none">${p.icon}</div>
                    <div class="text-[9px] sm:text-[10px] text-slate-300 truncate w-full font-normal">${p.name.split(' ')[0]}</div>
                  </th>
                `).join('')}
                ${lvl.clues.map(c => `
                  <th class="p-1 border border-slate-700 bg-slate-800 text-center w-8 sm:w-11 max-w-[44px] truncate" title="${c.name}">
                    <div class="text-sm sm:text-base leading-none">${c.icon}</div>
                    <div class="text-[9px] sm:text-[10px] text-slate-300 truncate w-full font-normal">${c.name.split(' ')[0]}</div>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${lvl.detectives.map((d, r) => `
                <tr>
                  <th class="p-1.5 border border-slate-700 bg-slate-800 text-left font-semibold text-sky-300 flex items-center gap-1 min-w-[100px] sm:min-w-[130px]" title="${d.name}">
                    <span class="text-sm">${d.icon}</span>
                    <span class="truncate">${d.name}</span>
                  </th>
                  ${lvl.paintings.map((_, c) => this.renderCellHTML('AB', r, c, game.gridState.AB[r][c])).join('')}
                  ${lvl.clues.map((_, c) => this.renderCellHTML('AC', r, c, game.gridState.AC[r][c])).join('')}
                </tr>
              `).join('')}
              <tr>
                <th colspan="${1 + n * 2}" class="p-1 bg-slate-900 border-x border-slate-700 text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
                  Cross-Reference: Artworks ➔ Forensic Clues
                </th>
              </tr>
              ${lvl.paintings.map((p, r) => `
                <tr>
                  <th class="p-1.5 border border-slate-700 bg-slate-800 text-left font-semibold text-amber-300 flex items-center gap-1 min-w-[100px] sm:min-w-[130px]" title="${p.name}">
                    <span class="text-sm">${p.icon}</span>
                    <span class="truncate">${p.name}</span>
                  </th>
                  <td colspan="${n}" class="border border-slate-800 bg-slate-950/70"></td>
                  ${lvl.clues.map((_, c) => this.renderCellHTML('BC', r, c, game.gridState.BC[r][c])).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    html += `</div>`;
    container.innerHTML = html;

    // Attach click events to grid cells
    container.querySelectorAll('.logic-cell').forEach(cellEl => {
      cellEl.addEventListener('click', () => {
        const target = (cellEl as HTMLElement).dataset.target as 'AB' | 'AC' | 'BC';
        const row = parseInt((cellEl as HTMLElement).dataset.row || '0', 10);
        const col = parseInt((cellEl as HTMLElement).dataset.col || '0', 10);

        game.toggleCell(target, row, col);
        const nextVal = game.gridState[target][row][col];
        if (nextVal === 2) sound.playPencil();
        else if (nextVal === 1) sound.playCross();
        else sound.playClick();

        this.renderPlayScreen();
      });
    });

    // Attach layout mode toggle listener
    document.getElementById('btn-toggle-grid-mode')?.addEventListener('click', () => {
      game.toggleGridDisplayMode();
      sound.playClick();
      this.renderPlayScreen();
    });
  }

  private renderCellHTML(target: 'AB' | 'AC' | 'BC', r: number, c: number, val: number): string {
    let content = '';
    let bgClass = 'bg-slate-900/90 hover:bg-slate-700/80';

    if (val === 1) {
      content = '<span class="text-rose-400 font-extrabold text-sm sm:text-base">✕</span>';
      bgClass = 'bg-rose-950/40 hover:bg-rose-900/50';
    } else if (val === 2) {
      content = '<span class="text-emerald-400 font-extrabold text-base sm:text-lg">✓</span>';
      bgClass = 'bg-emerald-950/60 ring-1 ring-emerald-500/50 hover:bg-emerald-900/60';
    }

    return `
      <td 
        data-target="${target}" 
        data-row="${r}" 
        data-col="${c}" 
        class="logic-cell grid-cell p-0 text-center w-8 sm:w-11 h-8 sm:h-11 border border-slate-700/80 cursor-pointer ${bgClass}"
      >
        <div class="w-full h-full flex items-center justify-center">${content}</div>
      </td>
    `;
  }

  private renderCluesList() {
    const lvl = game.currentLevel;
    const containers = [
      document.getElementById('clues-list-container'),
      document.getElementById('tab-clues-list-container')
    ];

    containers.forEach(container => {
      if (!container) return;
      container.innerHTML = lvl.cluesList.map((clue, idx) => {
        const isStruck = game.cluesRead.has(idx);
        return `
          <div 
            data-clue-idx="${idx}"
            class="clue-item p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
              isStruck 
                ? 'bg-slate-900/60 border-slate-800 text-slate-500 line-through opacity-70' 
                : 'bg-slate-800/90 border-slate-700/80 text-slate-100 hover:border-indigo-500/60 shadow-sm'
            }"
          >
            <div class="flex items-start gap-3 flex-1 min-w-0">
              <span class="w-6 h-6 rounded-lg ${isStruck ? 'bg-slate-800 text-slate-500' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'} font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                ${idx + 1}
              </span>
              <p class="text-xs sm:text-sm sm:text-base leading-relaxed text-slate-100 font-medium whitespace-normal break-words flex-1">${clue}</p>
            </div>
            <div class="px-2.5 py-1 rounded-lg text-xs font-bold ${isStruck ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 text-white shadow-sm'} shrink-0 flex items-center gap-1 mt-0.5">
              <span>${isStruck ? '✓ Read' : 'Mark as Read'}</span>
            </div>
          </div>
        `;
      }).join('');

      container.querySelectorAll('.clue-item').forEach(itemEl => {
        itemEl.addEventListener('click', () => {
          const idx = parseInt((itemEl as HTMLElement).dataset.clueIdx || '0', 10);
          game.toggleClueRead(idx);
          sound.playClick();
          this.renderCluesList();
          this.updateTabView();
        });
      });
    });
  }

  private renderCluesTab() {
    this.renderCluesList();
  }

  private renderSummaryTab() {
    const summaryContainer = document.getElementById('summary-cards-container');
    if (!summaryContainer) return;

    const deductions = game.getSummaryDeductions();
    summaryContainer.innerHTML = deductions.map(d => `
      <div class="p-3 rounded-xl border ${d.isComplete ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-slate-800/80 border-slate-700'} flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2.5 w-full sm:w-auto">
          <div class="w-10 h-10 rounded-lg bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-xl shrink-0">
            ${d.detective.icon}
          </div>
          <div>
            <h4 class="font-bold text-sm text-sky-200">${d.detective.name}</h4>
            <p class="text-xs text-slate-400">${d.detective.desc}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div class="px-3 py-1.5 rounded-lg ${d.painting ? 'bg-amber-950/60 border border-amber-500/40 text-amber-200' : 'bg-slate-900 border border-dashed border-slate-700 text-slate-500'} text-xs font-semibold flex items-center gap-1.5">
            <span>${d.painting ? d.painting.icon : '❓'}</span>
            <span>${d.painting ? d.painting.name : 'Pending Artwork'}</span>
          </div>

          <span class="text-slate-500 font-bold">➔</span>

          <div class="px-3 py-1.5 rounded-lg ${d.clue ? 'bg-rose-950/60 border border-rose-500/40 text-rose-200' : 'bg-slate-900 border border-dashed border-slate-700 text-slate-500'} text-xs font-semibold flex items-center gap-1.5">
            <span>${d.clue ? d.clue.icon : '❓'}</span>
            <span>${d.clue ? d.clue.name : 'Pending Clue'}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  private renderLevelSelectGrid() {
    const gridEl = document.getElementById('level-select-grid');
    if (!gridEl) return;

    gridEl.innerHTML = LEVELS.map((lvl, index) => {
      const isUnlocked = lvl.id <= game.unlockedLevel;
      return `
        <button 
          data-lvl-idx="${index}"
          ${!isUnlocked ? 'disabled' : ''}
          class="btn-tactile p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
            isUnlocked 
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-amber-500/40 text-slate-100 hover:border-amber-400 cursor-pointer' 
              : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
          }"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full ${isUnlocked ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-500'}">
              LEVEL ${lvl.id}
            </span>
            <span class="text-lg">${isUnlocked ? '🔓' : '🔒'}</span>
          </div>
          <h3 class="font-bold text-sm sm:text-base text-slate-100 mb-1">${lvl.title.split(': ')[1] || lvl.title}</h3>
          <p class="text-xs text-slate-400 line-clamp-2">${lvl.subtitle}</p>
        </button>
      `;
    }).join('');

    gridEl.querySelectorAll('button[data-lvl-idx]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt((btn as HTMLElement).dataset.lvlIdx || '0', 10);
        game.startLevel(idx);
        this.setScreen('PLAYING');
        this.renderPlayScreen();
      });
    });
  }

  private startLevelTimer() {
    this.stopLevelTimer();
    const timerEl = document.getElementById('score-counter');
    const updateTimer = () => {
      if (game.isCompleted) return;
      const elapsed = Math.floor((Date.now() - game.startTime) / 1000);
      const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
      const secs = (elapsed % 60).toString().padStart(2, '0');
      if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    };
    updateTimer();
    this.timerInterval = window.setInterval(updateTimer, 1000);
  }

  private stopLevelTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private openHintModal() {
    const modal = document.getElementById('hint-reward-modal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const claimBtn = document.getElementById('btn-claim-hint') as HTMLButtonElement;
    const progressEl = document.getElementById('hint-countdown-bar') as HTMLElement;
    const countdownText = document.getElementById('hint-countdown-text') as HTMLElement;

    if (claimBtn) claimBtn.disabled = true;
    if (progressEl) progressEl.style.width = '0%';

    let secondsLeft = 5;
    if (countdownText) countdownText.textContent = `Awaiting forensic analysis (${secondsLeft}s)...`;

    if (this.hintCountdownInterval) clearInterval(this.hintCountdownInterval);

    this.hintCountdownInterval = window.setInterval(() => {
      secondsLeft--;
      const pct = ((5 - secondsLeft) / 5) * 100;
      if (progressEl) progressEl.style.width = `${pct}%`;

      if (secondsLeft > 0) {
        if (countdownText) countdownText.textContent = `Awaiting forensic analysis (${secondsLeft}s)...`;
      } else {
        if (countdownText) countdownText.textContent = `Analysis complete! Evidence revealed.`;
        if (claimBtn) {
          claimBtn.disabled = false;
          claimBtn.classList.remove('opacity-50', 'cursor-not-allowed');
          claimBtn.classList.add('animate-pulse');
        }
        if (this.hintCountdownInterval) {
          clearInterval(this.hintCountdownInterval);
          this.hintCountdownInterval = null;
        }
      }
    }, 1000);
  }

  private closeHintModal() {
    const modal = document.getElementById('hint-reward-modal');
    if (modal) modal.classList.add('hidden');
    if (this.hintCountdownInterval) {
      clearInterval(this.hintCountdownInterval);
      this.hintCountdownInterval = null;
    }
  }

  private showToast(msg: string) {
    const toast = document.getElementById('game-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden', 'opacity-0');
    toast.classList.add('opacity-100');
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3500);
  }
}

export const screenCtrl = new ScreenController();
