import { GameState, LEVELS } from './game-state';
import { AltitudeLevel } from './types';
import { sound } from './audio';

export type GameScreen = 'MAIN_MENU' | 'LEVEL_SELECT' | 'PLAYING' | 'HOW_TO_PLAY';

export class ScreenManager {
  public currentScreen: GameScreen = 'MAIN_MENU';
  private state: GameState;
  private onStartLevelCb: (levelId: number) => void;
  private onResizeCb: () => void;
  private onEmergencyScanCb: () => void;

  private adTimerInterval: number | null = null;
  private adTimeRemaining: number = 5;

  constructor(
    state: GameState,
    onStartLevel: (levelId: number) => void,
    onResize: () => void,
    onEmergencyScan: () => void
  ) {
    this.state = state;
    this.onStartLevelCb = onStartLevel;
    this.onResizeCb = onResize;
    this.onEmergencyScanCb = onEmergencyScan;

    this.bindEvents();
    this.updateScreen();
  }

  public setScreen(screen: GameScreen) {
    this.currentScreen = screen;
    this.updateScreen();
  }

  private updateScreen() {
    const elMainMenu = document.getElementById('screen-main-menu');
    const elLevelSelect = document.getElementById('screen-level-select');
    const elHowToPlay = document.getElementById('screen-how-to-play');
    const elGameHud = document.getElementById('game-hud');
    const elFlightControls = document.getElementById('flight-controls-overlay');

    if (elMainMenu) elMainMenu.classList.toggle('hidden', this.currentScreen !== 'MAIN_MENU');
    if (elLevelSelect) elLevelSelect.classList.toggle('hidden', this.currentScreen !== 'LEVEL_SELECT');
    if (elHowToPlay) elHowToPlay.classList.toggle('hidden', this.currentScreen !== 'HOW_TO_PLAY');
    if (elGameHud) elGameHud.classList.toggle('hidden', this.currentScreen !== 'PLAYING');
    if (elFlightControls) elFlightControls.classList.toggle('hidden', this.currentScreen !== 'PLAYING');

    if (this.currentScreen === 'LEVEL_SELECT') {
      this.renderLevelGrid();
    } else if (this.currentScreen === 'PLAYING') {
      this.onResizeCb();
    }
  }

  public updateHUD() {
    if (this.currentScreen !== 'PLAYING') return;

    const level = this.state.getCurrentLevel();

    // Score Counter
    const scoreEl = document.getElementById('hud-score-counter');
    if (scoreEl) scoreEl.textContent = this.state.score.toString();

    // Planes Managed Counter
    const planesEl = document.getElementById('hud-planes-counter');
    if (planesEl) planesEl.textContent = `${this.state.planesSafelyManaged}/${level.targetSafelyManaged}`;

    // Level Badge
    const lvlBadge = document.getElementById('hud-level-badge');
    if (lvlBadge) lvlBadge.textContent = `SECTOR ${level.id}`;

    // Active Flight Controls Bar
    const plane = this.state.planes.find((p) => p.id === this.state.selectedPlaneId);
    const flightBar = document.getElementById('flight-controls-bar');
    if (flightBar) {
      if (plane) {
        flightBar.classList.remove('opacity-0', 'pointer-events-none');
        flightBar.classList.add('opacity-100', 'pointer-events-auto');

        const callsignEl = document.getElementById('ctl-callsign');
        if (callsignEl) callsignEl.textContent = plane.callsign;

        const altValEl = document.getElementById('ctl-alt-val');
        if (altValEl) altValEl.textContent = `FL${plane.altitude}00`;

        // Highlight selected altitude button
        for (const alt of [1, 2, 3] as AltitudeLevel[]) {
          const btn = document.getElementById(`btn-alt-${alt}`);
          if (btn) {
            if (plane.altitude === alt) {
              btn.className =
                'px-2.5 py-1 text-xs font-black rounded-lg bg-sky-500 text-white shadow-sm ring-2 ring-sky-300 shrink-0';
            } else {
              btn.className =
                'px-2 py-1 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 border border-slate-700 active:scale-95 shrink-0';
            }
          }
        }
      } else {
        flightBar.classList.add('opacity-0', 'pointer-events-none');
        flightBar.classList.remove('opacity-100', 'pointer-events-auto');
      }
    }
  }

  public renderLevelGrid() {
    const gridEl = document.getElementById('level-grid-container');
    if (!gridEl) return;

    gridEl.innerHTML = '';
    const unlocked = this.state.save.unlockedLevel;

    LEVELS.forEach((level) => {
      const isUnlocked = level.id <= unlocked;
      const stars = this.state.save.stars[level.id] || 0;
      const high = this.state.save.highScores[level.id] || 0;

      const card = document.createElement('button');
      card.className = isUnlocked
        ? 'btn-tactile p-3 sm:p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-left flex flex-col justify-between transition-all hover:border-sky-500/50 hover:bg-slate-800 cursor-pointer shrink-0'
        : 'p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left flex flex-col justify-between opacity-50 cursor-not-allowed shrink-0';

      const starsHtml = isUnlocked
        ? `<div class="flex gap-0.5 text-amber-400 text-xs">
            ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}
           </div>`
        : `<span class="text-xs text-slate-500">🔒 LOCKED</span>`;

      card.innerHTML = `
        <div class="flex items-start justify-between w-full mb-2">
          <div class="w-8 h-8 rounded-xl ${isUnlocked ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-slate-800 text-slate-500'} flex items-center justify-center font-black text-sm shrink-0">
            ${level.id}
          </div>
          ${starsHtml}
        </div>
        <div class="w-full">
          <h3 class="font-bold text-sm text-slate-100 truncate">${level.title}</h3>
          <p class="text-[11px] text-slate-400 truncate mb-1">${level.subtitle}</p>
          <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-700/50">
            <span class="px-1.5 py-0.5 rounded bg-slate-700/50 text-sky-300 font-semibold">${level.difficulty}</span>
            <span>Target: ${level.targetSafelyManaged} ✈️</span>
          </div>
        </div>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          sound.playClick();
          this.onStartLevelCb(level.id);
          this.setScreen('PLAYING');
        });
      }

      gridEl.appendChild(card);
    });
  }

  public showGameOverModal() {
    const modal = document.getElementById('modal-game-over');
    if (!modal) return;

    const scoreVal = document.getElementById('modal-gameover-score');
    if (scoreVal) scoreVal.textContent = this.state.score.toString();

    const planesVal = document.getElementById('modal-gameover-planes');
    if (planesVal) planesVal.textContent = this.state.planesSafelyManaged.toString();

    const incidentDetail = document.getElementById('modal-gameover-incident');
    if (incidentDetail && this.state.lastIncidentDetails) {
      incidentDetail.textContent = `Mid-Air Loss of Separation between ${this.state.lastIncidentDetails.p1} & ${this.state.lastIncidentDetails.p2} at FL100.`;
    }

    modal.classList.remove('hidden');
  }

  public hideGameOverModal() {
    const modal = document.getElementById('modal-game-over');
    if (modal) modal.classList.add('hidden');
  }

  public showLevelWinModal() {
    const modal = document.getElementById('modal-level-win');
    if (!modal) return;

    const timeInSeconds = Math.floor((Date.now() - this.state.levelStartTime) / 1000);

    // Official Platform Integration postMessage
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'win', time: timeInSeconds }, '*');
    }

    const scoreVal = document.getElementById('modal-win-score');
    if (scoreVal) scoreVal.textContent = this.state.score.toString();

    const timeVal = document.getElementById('modal-win-time');
    if (timeVal) timeVal.textContent = `${timeInSeconds}s`;

    modal.classList.remove('hidden');
  }

  public hideLevelWinModal() {
    const modal = document.getElementById('modal-level-win');
    if (modal) modal.classList.add('hidden');
  }

  public showPauseModal() {
    this.state.isPaused = true;
    const modal = document.getElementById('modal-pause');
    if (modal) modal.classList.remove('hidden');
  }

  public hidePauseModal() {
    this.state.isPaused = false;
    const modal = document.getElementById('modal-pause');
    if (modal) modal.classList.add('hidden');
  }

  // Rewarded Ad Modal (Emergency Radar Clearance Hint)
  public showRewardedAdModal() {
    this.state.isPaused = true;
    const modal = document.getElementById('modal-rewarded-ad');
    if (!modal) return;

    modal.classList.remove('hidden');

    this.adTimeRemaining = 5;
    const countEl = document.getElementById('ad-countdown-text');
    const barEl = document.getElementById('ad-progress-bar');
    const claimBtn = document.getElementById('btn-claim-reward') as HTMLButtonElement;

    if (claimBtn) {
      claimBtn.disabled = true;
      claimBtn.className =
        'w-full py-3 rounded-xl font-black text-sm bg-slate-700 text-slate-400 opacity-60 cursor-not-allowed transition-all';
      claimBtn.textContent = 'Scanning Airspace... (5s)';
    }

    if (this.adTimerInterval) clearInterval(this.adTimerInterval);

    this.adTimerInterval = window.setInterval(() => {
      this.adTimeRemaining--;
      if (countEl) countEl.textContent = `${this.adTimeRemaining}s`;
      if (barEl) barEl.style.width = `${((5 - this.adTimeRemaining) / 5) * 100}%`;

      if (this.adTimeRemaining <= 0) {
        if (this.adTimerInterval) clearInterval(this.adTimerInterval);
        if (claimBtn) {
          claimBtn.disabled = false;
          claimBtn.className =
            'btn-tactile w-full py-3 rounded-xl font-black text-sm bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg cursor-pointer transition-all active:scale-95';
          claimBtn.textContent = '🚀 Deploy Emergency Clearance!';
          sound.playRadarPing();
        }
      }
    }, 1000);
  }

  public hideRewardedAdModal() {
    if (this.adTimerInterval) clearInterval(this.adTimerInterval);
    const modal = document.getElementById('modal-rewarded-ad');
    if (modal) modal.classList.add('hidden');
    this.state.isPaused = false;
  }

  private bindEvents() {
    // Sound Toggle
    const soundBtns = [document.getElementById('btn-sound-toggle'), document.getElementById('btn-sound-menu')];
    soundBtns.forEach((btn) => {
      btn?.addEventListener('click', () => {
        const isEnabled = sound.toggle();
        this.state.save.soundEnabled = isEnabled;
        this.state.writeSave();
        this.updateSoundIcons(isEnabled);
      });
    });

    // Main Menu Buttons
    document.getElementById('btn-menu-play')?.addEventListener('click', () => {
      sound.playClick();
      this.onStartLevelCb(this.state.save.unlockedLevel || 1);
      this.setScreen('PLAYING');
    });

    document.getElementById('btn-menu-levels')?.addEventListener('click', () => {
      sound.playClick();
      this.setScreen('LEVEL_SELECT');
    });

    document.getElementById('btn-menu-how')?.addEventListener('click', () => {
      sound.playClick();
      this.setScreen('HOW_TO_PLAY');
    });

    // Level Select Back
    document.getElementById('btn-levels-back')?.addEventListener('click', () => {
      sound.playClick();
      this.setScreen('MAIN_MENU');
    });

    // How to Play Back
    document.getElementById('btn-how-back')?.addEventListener('click', () => {
      sound.playClick();
      this.setScreen('MAIN_MENU');
    });

    // HUD Buttons
    document.getElementById('btn-pause-menu')?.addEventListener('click', () => {
      sound.playClick();
      this.showPauseModal();
    });

    document.getElementById('btn-hud-hint')?.addEventListener('click', () => {
      sound.playClick();
      this.showRewardedAdModal();
    });

    // Pause Modal Buttons
    document.getElementById('btn-pause-resume')?.addEventListener('click', () => {
      sound.playClick();
      this.hidePauseModal();
    });

    document.getElementById('btn-pause-restart')?.addEventListener('click', () => {
      sound.playClick();
      this.hidePauseModal();
      this.onStartLevelCb(this.state.currentLevelId);
    });

    document.getElementById('btn-pause-menu-quit')?.addEventListener('click', () => {
      sound.playClick();
      this.hidePauseModal();
      this.setScreen('MAIN_MENU');
    });

    // Game Over Buttons
    document.getElementById('btn-gameover-retry')?.addEventListener('click', () => {
      sound.playClick();
      this.hideGameOverModal();
      this.onStartLevelCb(this.state.currentLevelId);
    });

    document.getElementById('btn-gameover-menu')?.addEventListener('click', () => {
      sound.playClick();
      this.hideGameOverModal();
      this.setScreen('LEVEL_SELECT');
    });

    // Level Win Buttons
    document.getElementById('btn-win-next')?.addEventListener('click', () => {
      sound.playClick();
      this.hideLevelWinModal();
      const nextId = Math.min(12, this.state.currentLevelId + 1);
      this.onStartLevelCb(nextId);
    });

    document.getElementById('btn-win-menu')?.addEventListener('click', () => {
      sound.playClick();
      this.hideLevelWinModal();
      this.setScreen('LEVEL_SELECT');
    });

    // Rewarded Ad Modal Buttons
    document.getElementById('btn-claim-reward')?.addEventListener('click', () => {
      sound.playClick();
      this.hideRewardedAdModal();
      this.onEmergencyScanCb();
    });

    document.getElementById('btn-skip-reward')?.addEventListener('click', () => {
      sound.playClick();
      this.hideRewardedAdModal();
    });

    // Flight Controls Buttons
    for (const alt of [1, 2, 3] as AltitudeLevel[]) {
      document.getElementById(`btn-alt-${alt}`)?.addEventListener('click', () => {
        if (this.state.selectedPlaneId) {
          this.state.setPlaneAltitude(this.state.selectedPlaneId, alt);
          this.updateHUD();
        }
      });
    }

    document.getElementById('btn-turn-left')?.addEventListener('click', () => {
      if (this.state.selectedPlaneId) {
        this.state.turnPlaneRelative(this.state.selectedPlaneId, -Math.PI / 4); // -45 deg
      }
    });

    document.getElementById('btn-turn-right')?.addEventListener('click', () => {
      if (this.state.selectedPlaneId) {
        this.state.turnPlaneRelative(this.state.selectedPlaneId, Math.PI / 4); // +45 deg
      }
    });

    document.getElementById('btn-land-direct')?.addEventListener('click', () => {
      if (this.state.selectedPlaneId) {
        const level = this.state.getCurrentLevel();
        if (level.runways.length > 0) {
          const rw = level.runways[0];
          // Trigger direct landing approach
          const parentRect = document.getElementById('canvas-container')?.getBoundingClientRect();
          const w = parentRect?.width || 800;
          const h = parentRect?.height || 600;
          this.state.directPlaneToRunway(this.state.selectedPlaneId, rw.id, w, h);
        }
      }
    });
  }

  private updateSoundIcons(enabled: boolean) {
    const icons = document.querySelectorAll('.sound-icon-svg');
    icons.forEach((icon) => {
      if (enabled) {
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />`;
      } else {
        icon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />`;
      }
    });
  }
}
