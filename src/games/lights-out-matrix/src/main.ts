/**
 * Lights Out Matrix — Pure Vanilla JS / TypeScript & DOM implementation.
 * Zero frameworks, pure DOM, CSS3D & HTML5 Canvas particles.
 */

import { sound } from './audio';
import { DisplayManager } from './display';
import { GameState, LEVELS } from './game-state';
import { ParticleSystem } from './particles';
import { ScreenController } from './screen-manager';

class LightsOutApp {
  private state: GameState;
  private screens: ScreenController;
  private particles: ParticleSystem;
  private display: DisplayManager;
  private canvas: HTMLCanvasElement;
  private gridContainer: HTMLElement;
  private tooltipEl: HTMLElement | null = null;
  private hasInteracted: boolean = false;

  constructor() {
    this.state = new GameState();
    this.screens = new ScreenController();
    this.particles = new ParticleSystem();

    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.gridContainer = document.getElementById('lights-matrix-grid') as HTMLElement;
    this.tooltipEl = document.getElementById('matrix-tooltip');

    this.display = new DisplayManager(this.canvas, (w, h) => {
      this.particles.setDimensions(w, h);
    });

    this.bindEvents();
    this.updateHUD();
    this.updateStartMenuStats();
    this.renderBoard();
    this.renderLevelSelectModal();
    this.startRenderLoop();

    // Check if player hasn't seen the initial menu yet or if session is fresh
    this.screens.openModal('START_MENU');
  }

  /**
   * Generates the SVG lightbulb graphic matching the user's reference image
   */
  private generateBulbSVG(isOn: boolean): string {
    if (isOn) {
      return `
        <svg viewBox="0 0 56 68" class="w-full h-full max-h-[82%] drop-shadow-[0_0_12px_rgba(251,191,36,0.95)]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Glowing radial bulb gradient -->
            <radialGradient id="bulbGlowOn" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="25%" stop-color="#fef08a" />
              <stop offset="65%" stop-color="#fbbf24" />
              <stop offset="100%" stop-color="#f59e0b" />
            </radialGradient>
            <!-- Hot filament glow filter -->
            <filter id="filamentHotGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <!-- Outer luminous halo -->
          <circle cx="28" cy="27" r="26" fill="rgba(254, 240, 138, 0.2)" />
          
          <!-- Bulb Glass Dome -->
          <path d="M 28 6 C 16 6 8 15 8 26 C 8 34 13 40 18 46 C 20 49 21 52 21 55 L 35 55 C 35 52 36 49 38 46 C 43 40 48 34 48 26 C 48 15 40 6 28 6 Z"
                fill="url(#bulbGlowOn)" stroke="#fef08a" stroke-width="1" />

          <!-- Internal glowing hot tungsten filament -->
          <g filter="url(#filamentHotGlow)">
            <path d="M 23 55 L 24 33" stroke="#fef08a" stroke-width="1.8" stroke-linecap="round" />
            <path d="M 33 55 L 32 33" stroke="#fef08a" stroke-width="1.8" stroke-linecap="round" />
            <path d="M 24 33 C 24 22, 32 22, 32 33" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" />
            <circle cx="28" cy="24" r="3.5" fill="#ffffff" />
          </g>

          <!-- Glass Specular Reflection Highlight -->
          <path d="M 14 19 C 14 12 19 8 26 8" fill="none" stroke="rgba(255, 255, 255, 0.85)" stroke-width="2.5" stroke-linecap="round" />

          <!-- Screw Base Collar & Contact Base -->
          <rect x="21" y="55" width="14" height="3" rx="1.2" fill="#94a3b8" />
          <rect x="22" y="59" width="12" height="3" rx="1.2" fill="#64748b" />
          <path d="M 24 63 L 32 63 L 30 66 L 26 66 Z" fill="#334155" />
        </svg>
      `;
    } else {
      return `
        <svg viewBox="0 0 56 68" class="w-full h-full max-h-[82%]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bulbDarkGlass" cx="42%" cy="32%" r="60%">
              <stop offset="0%" stop-color="#475569" />
              <stop offset="50%" stop-color="#334155" />
              <stop offset="90%" stop-color="#1e293b" />
              <stop offset="100%" stop-color="#0f172a" />
            </radialGradient>
          </defs>
          
          <!-- Contact shadow inside recessed tile -->
          <ellipse cx="28" cy="58" rx="13" ry="4" fill="rgba(0,0,0,0.4)" />

          <!-- Dark Frosted Glass Dome -->
          <path d="M 28 6 C 16 6 8 15 8 26 C 8 34 13 40 18 46 C 20 49 21 52 21 55 L 35 55 C 35 52 36 49 38 46 C 43 40 48 34 48 26 C 48 15 40 6 28 6 Z"
                fill="url(#bulbDarkGlass)" stroke="rgba(148, 163, 184, 0.25)" stroke-width="1" />

          <!-- Dark Inactive Filament Structure -->
          <path d="M 23 55 L 24 33" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round" />
          <path d="M 33 55 L 32 33" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round" />
          <path d="M 24 33 C 24 24, 32 24, 32 33" fill="none" stroke="#0f172a" stroke-width="1.8" stroke-linecap="round" />

          <!-- Subtle Specular Glass Reflection -->
          <path d="M 14 18 C 14 12 19 8 25 8" fill="none" stroke="rgba(255, 255, 255, 0.22)" stroke-width="2" stroke-linecap="round" />

          <!-- Matte Metal Screw Base -->
          <rect x="21" y="55" width="14" height="3" rx="1.2" fill="#475569" />
          <rect x="22" y="59" width="12" height="3" rx="1.2" fill="#334155" />
          <path d="M 24 63 L 32 63 L 30 66 L 26 66 Z" fill="#1e293b" />
        </svg>
      `;
    }
  }

  /**
   * Renders the matrix grid of bulbs into the DOM
   */
  public renderBoard() {
    this.gridContainer.innerHTML = '';
    this.gridContainer.style.gridTemplateColumns = `repeat(${this.state.cols}, minmax(0, 1fr))`;
    this.gridContainer.style.gridTemplateRows = `repeat(${this.state.rows}, minmax(0, 1fr))`;

    for (let r = 0; r < this.state.rows; r++) {
      for (let c = 0; c < this.state.cols; c++) {
        const isOn = this.state.board[r][c];
        const isHinted = this.state.activeHint?.r === r && this.state.activeHint?.c === c;

        const tile = document.createElement('button');
        tile.id = `bulb-tile-${r}-${c}`;
        tile.className = `bulb-tile ${isOn ? 'bulb-on' : 'bulb-off'} ${isHinted ? 'hint-pulse' : ''}`;
        tile.setAttribute('aria-label', `Lâmpada linha ${r + 1}, coluna ${c + 1}, ${isOn ? 'ligada' : 'desligada'}`);
        tile.innerHTML = this.generateBulbSVG(isOn);

        // Click handler
        tile.addEventListener('click', (e) => {
          this.handleBulbClick(r, c, e);
        });

        // Hover tooltip display for first-time onboarding
        tile.addEventListener('mouseenter', () => {
          if (!this.hasInteracted && r === 2 && c === 2) {
            this.showTooltipAt(tile);
          }
        });

        this.gridContainer.appendChild(tile);
      }
    }

    // Position initial guide tooltip on center tile if not yet interacted
    if (!this.hasInteracted) {
      setTimeout(() => {
        const centerTile = document.getElementById(`bulb-tile-${Math.floor(this.state.rows / 2)}-${Math.floor(this.state.cols / 2)}`);
        if (centerTile) {
          this.showTooltipAt(centerTile);
        }
      }, 350);
    }
  }

  /**
   * Shows the contextual hint tooltip anchored near an element
   */
  private showTooltipAt(target: HTMLElement) {
    if (!this.tooltipEl) return;
    const stageRect = document.getElementById('matrix-stage-container')?.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    if (stageRect) {
      const top = targetRect.top - stageRect.top + targetRect.height + 6;
      const left = targetRect.left - stageRect.left + (targetRect.width / 2) - 100;
      this.tooltipEl.style.top = `${Math.max(10, top)}px`;
      this.tooltipEl.style.left = `${Math.max(10, Math.min(left, stageRect.width - 230))}px`;
      this.tooltipEl.classList.remove('hidden');
    }
  }

  private hideTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.classList.add('hidden');
    }
  }

  /**
   * Handles bulb press
   */
  private handleBulbClick(r: number, c: number, event?: MouseEvent) {
    this.hasInteracted = true;
    this.hideTooltip();

    const wasOn = this.state.board[r][c];
    const { affected, won } = this.state.playerClickBulb(r, c);

    // Audio feedback
    sound.playBulbToggle(!wasOn);

    // Spawn sparks at click origin on canvas
    if (event) {
      this.particles.spawnBulbSparks(event.clientX, event.clientY, !wasOn);
    } else {
      const tile = document.getElementById(`bulb-tile-${r}-${c}`);
      if (tile) {
        const rect = tile.getBoundingClientRect();
        this.particles.spawnBulbSparks(rect.left + rect.width / 2, rect.top + rect.height / 2, !wasOn);
      }
    }

    // Fast DOM update for affected tiles
    for (const pt of affected) {
      const tileEl = document.getElementById(`bulb-tile-${pt.r}-${pt.c}`) as HTMLButtonElement | null;
      if (tileEl) {
        const isNowOn = this.state.board[pt.r][pt.c];
        tileEl.className = `bulb-tile ${isNowOn ? 'bulb-on' : 'bulb-off'}`;
        tileEl.innerHTML = this.generateBulbSVG(isNowOn);
        
        // Add shockwave animation class
        tileEl.classList.add('just-toggled');
        setTimeout(() => tileEl.classList.remove('just-toggled'), 220);
      }
    }

    this.updateHUD();

    // Check Victory
    if (won) {
      this.handleVictorySequence();
    }
  }

  private handleVictorySequence() {
    sound.playVictory();

    // Spawn victory celebration explosions across canvas
    const rect = this.gridContainer.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    this.particles.spawnVictoryExplosion(cx, cy);
    setTimeout(() => this.particles.spawnVictoryExplosion(cx - 120, cy - 80), 200);
    setTimeout(() => this.particles.spawnVictoryExplosion(cx + 120, cy + 80), 400);

    // Update Victory Modal Data
    const movesEl = document.getElementById('victory-moves');
    const timeEl = document.getElementById('victory-time');
    const starsEl = document.getElementById('victory-stars');

    if (movesEl) movesEl.innerText = String(this.state.moves);
    if (timeEl) {
      const mins = Math.floor(this.state.elapsedSeconds / 60);
      const secs = this.state.elapsedSeconds % 60;
      timeEl.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    const currentStars = this.state.save.stars[this.state.currentLevel] || 3;
    if (starsEl) {
      starsEl.innerHTML = Array.from({ length: 3 }, (_, i) => 
        i < currentStars ? '<span>⭐</span>' : '<span class="opacity-25 grayscale">⭐</span>'
      ).join('');
    }

    this.renderLevelSelectModal();
    setTimeout(() => {
      this.screens.openModal('VICTORY');
    }, 600);
  }

  /**
   * Updates Header & Footer HUD counters
   */
  private updateHUD() {
    const movesEl = document.getElementById('hud-moves');
    const bestEl = document.getElementById('hud-best');
    const levelBadge = document.getElementById('header-level-badge');
    const footerState = document.getElementById('footer-state-counter');

    if (movesEl) {
      movesEl.innerText = String(this.state.moves);
    }
    if (bestEl) {
      const best = this.state.getBestMovesForCurrent();
      bestEl.innerText = best !== null ? String(best) : '--';
    }
    if (levelBadge) {
      levelBadge.innerText = `LEVEL ${this.state.currentLevel}`;
    }
    if (footerState) {
      const onCount = this.state.getOnCount();
      const total = this.state.getTotalBulbs();
      footerState.innerText = `state: ${onCount}/${total} ON • ${total - onCount}/${total} OFF`;
    }
  }

  /**
   * Updates stats displayed on the Start Menu modal
   */
  private updateStartMenuStats() {
    const unlockedEl = document.getElementById('menu-unlocked-level');
    const starsEl = document.getElementById('menu-total-stars');
    const playText = document.getElementById('menu-btn-play-text');

    if (unlockedEl) {
      unlockedEl.innerText = `Level ${this.state.save.unlockedLevel} / ${LEVELS.length}`;
    }
    if (starsEl) {
      const totalStars = Object.values(this.state.save.stars).reduce((a, b) => a + b, 0);
      starsEl.innerText = `⭐ ${totalStars}`;
    }
    if (playText) {
      playText.innerText = this.state.moves > 0 ? `Continue Level ${this.state.currentLevel}` : `Play Level ${this.state.currentLevel}`;
    }
  }

  /**
   * Renders the progressive Level Select modal grid
   */
  private renderLevelSelectModal() {
    const grid = document.getElementById('levels-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const unlocked = this.state.save.unlockedLevel;

    LEVELS.forEach((lvl) => {
      const isUnlocked = lvl.id <= unlocked;
      const isCurrent = lvl.id === this.state.currentLevel;
      const best = this.state.save.bestMoves[lvl.id];
      const stars = this.state.save.stars[lvl.id] || 0;

      const card = document.createElement('button');
      card.className = `btn-tactile p-3 rounded-2xl flex flex-col items-center justify-between gap-1 text-center border transition-all ${
        isCurrent
          ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/50'
          : isUnlocked
          ? 'bg-slate-800/90 hover:bg-slate-700/90 border-white/10 text-white cursor-pointer'
          : 'bg-slate-900/50 border-white/5 text-slate-500 opacity-60 cursor-not-allowed'
      }`;

      if (!isUnlocked) {
        card.disabled = true;
      }

      card.innerHTML = `
        <div class="flex items-center justify-between w-full text-[10px] text-slate-400">
          <span>${lvl.rows}x${lvl.cols}</span>
          ${isUnlocked ? `<span>${stars > 0 ? '⭐'.repeat(stars) : ''}</span>` : '<span>🔒</span>'}
        </div>
        <div class="text-base sm:text-lg font-black my-1 ${isUnlocked ? 'text-white' : 'text-slate-600'}">
          #${lvl.id}
        </div>
        <div class="text-[10px] text-slate-400 truncate w-full">
          ${isUnlocked ? (best ? `Best: ${best}` : 'New') : 'Locked'}
        </div>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          sound.playButtonClick();
          this.state.initLevel(lvl.id);
          this.updateHUD();
          this.renderBoard();
          this.renderLevelSelectModal();
          this.screens.closeModal();
        });
      }

      grid.appendChild(card);
    });
  }

  /**
   * Binds UI controls and listeners
   */
  private bindEvents() {
    // Menu Open / Close
    document.getElementById('btn-open-menu')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.updateStartMenuStats();
      this.screens.openModal('START_MENU');
    });

    // Start Menu Action Buttons
    document.getElementById('menu-btn-play')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.screens.closeModal();
    });
    document.getElementById('menu-btn-levels')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.renderLevelSelectModal();
      this.screens.openModal('LEVEL_SELECT');
    });
    document.getElementById('menu-btn-how-to-play')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.screens.openModal('HOW_TO_PLAY');
    });

    // Sound Toggle
    const soundBtn = document.getElementById('btn-sound');
    const soundIcon = document.getElementById('sound-icon');
    if (soundBtn && soundIcon) {
      soundIcon.innerText = sound.getIsMuted() ? '🔇' : '🔊';
      soundBtn.addEventListener('click', () => {
        const muted = sound.toggleMute();
        soundIcon.innerText = muted ? '🔇' : '🔊';
        if (!muted) sound.playButtonClick();
      });
    }

    // Level Select Open / Close
    document.getElementById('btn-open-levels')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.screens.openModal('LEVEL_SELECT');
    });
    document.getElementById('modal-close-levels')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.screens.closeModal();
    });

    // How to Play Open / Close
    document.getElementById('btn-how-to-play')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.screens.openModal('HOW_TO_PLAY');
    });
    document.getElementById('modal-close-help')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.screens.closeModal();
    });
    document.getElementById('modal-btn-got-it')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.screens.closeModal();
    });

    // Undo Button
    document.getElementById('btn-undo')?.addEventListener('click', () => {
      const last = this.state.undo();
      if (last) {
        sound.playButtonClick();
        this.updateHUD();
        this.renderBoard();
      }
    });

    // Reset Button
    document.getElementById('btn-reset')?.addEventListener('click', () => {
      sound.playRattle();
      this.state.restartCurrentBoard();
      this.updateHUD();
      this.renderBoard();
    });

    // New Puzzle Button
    document.getElementById('btn-new-puzzle')?.addEventListener('click', () => {
      sound.playRattle();
      this.state.resetGame();
      this.updateHUD();
      this.renderBoard();
    });

    // Hint Button (triggers Rewarded Ad flow as described in Section 6.B of universal manual)
    document.getElementById('btn-hint')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.screens.openModal('REWARDED_AD', () => {
        this.applyHint();
      });
    });

    // Rewarded Ad Claim & Skip
    document.getElementById('ad-claim-btn')?.addEventListener('click', () => {
      sound.playHint();
      this.screens.claimReward();
    });
    document.getElementById('ad-skip-btn')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.screens.closeModal();
    });

    // Victory Next Level & Replay
    document.getElementById('victory-next-btn')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.screens.closeModal();
      const nextId = Math.min(this.state.currentLevel + 1, LEVELS.length);
      this.state.initLevel(nextId);
      this.updateHUD();
      this.renderBoard();
      this.renderLevelSelectModal();
    });

    document.getElementById('victory-replay-btn')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.screens.closeModal();
      this.state.restartCurrentBoard();
      this.updateHUD();
      this.renderBoard();
    });
  }

  /**
   * Applies hint: calculates optimal move via GF(2) linear solver,
   * pulses target tile and anchors tooltip
   */
  private applyHint() {
    const hint = this.state.requestHint();
    if (!hint) return;

    sound.playHint();
    this.renderBoard();

    const targetTile = document.getElementById(`bulb-tile-${hint.r}-${hint.c}`);
    if (targetTile) {
      targetTile.classList.add('hint-pulse');
      if (this.tooltipEl) {
        this.tooltipEl.innerHTML = `<span>💡</span><span>Toque aqui para desarmar a matriz!</span>`;
        this.showTooltipAt(targetTile);
      }
    }
  }

  /**
   * 60FPS Canvas Animation Loop for continuous particle physics
   */
  private startRenderLoop() {
    const ctx = this.display.getContext();

    const loop = () => {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.render(ctx);
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new LightsOutApp();
});
