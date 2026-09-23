
function triggerPlatformWin(timeInSeconds) {
    const elapsed = Math.round(timeInSeconds || 45);
    try {
        if (typeof window.onWin === 'function') {
            window.onWin(elapsed);
        }
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ type: 'win', time: elapsed }, '*');
        }
    } catch(e) { console.error('Platform win notify error:', e); }
}
(() => {
  // lights-out-matrix/src/audio.ts
  var SoundManager = class {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      const saved = localStorage.getItem("lights_out_muted");
      this.isMuted = saved === "true";
    }
    initCtx() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }
    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem("lights_out_muted", String(this.isMuted));
      return this.isMuted;
    }
    getIsMuted() {
      return this.isMuted;
    }
    
    generateBulbSVG(isOn) {
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
    
    updateHUD() {
      const movesEl = document.getElementById("hud-moves");
      const bestEl = document.getElementById("hud-best");
      const levelBadge = document.getElementById("header-level-badge");
      const footerState = document.getElementById("footer-state-counter");
      if (movesEl) {
        movesEl.innerText = String(this.state.moves);
      }
      if (bestEl) {
        const best = this.state.getBestMovesForCurrent();
        bestEl.innerText = best !== null ? String(best) : "--";
      }
      if (levelBadge) {
        levelBadge.innerText = `LEVEL ${this.state.currentLevel}`;
      }
      if (footerState) {
        const onCount = this.state.getOnCount();
        const total = this.state.getTotalBulbs();
        footerState.innerText = `state: ${onCount}/${total} ON \u2022 ${total - onCount}/${total} OFF`;
      }
    }
    
    bindEvents() {
      document.getElementById("btn-open-menu")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.updateStartMenuStats();
        this.screens.openModal("START_MENU");
      });
      document.getElementById("menu-btn-play")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.closeModal();
      });
      document.getElementById("menu-btn-levels")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.renderLevelSelectModal();
        this.screens.openModal("LEVEL_SELECT");
      });
      document.getElementById("menu-btn-how-to-play")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.openModal("HOW_TO_PLAY");
      });
      const soundBtn = document.getElementById("btn-sound");
      const soundIcon = document.getElementById("sound-icon");
      if (soundBtn && soundIcon) {
        soundIcon.innerText = sound.getIsMuted() ? "\u{1F507}" : "\u{1F50A}";
        soundBtn.addEventListener("click", () => {
          const muted = sound.toggleMute();
          soundIcon.innerText = muted ? "\u{1F507}" : "\u{1F50A}";
          if (!muted) sound.playButtonClick();
        });
      }
      document.getElementById("btn-open-levels")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.openModal("LEVEL_SELECT");
      });
      document.getElementById("modal-close-levels")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.closeModal();
      });
      document.getElementById("btn-how-to-play")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.openModal("HOW_TO_PLAY");
      });
      document.getElementById("modal-close-help")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.closeModal();
      });
      document.getElementById("modal-btn-got-it")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.closeModal();
      });
      document.getElementById("btn-undo")?.addEventListener("click", () => {
        const last = this.state.undo();
        if (last) {
          sound.playButtonClick();
          this.updateHUD();
          this.renderBoard();
        }
      });
      document.getElementById("btn-reset")?.addEventListener("click", () => {
        sound.playRattle();
        this.state.restartCurrentBoard();
        this.updateHUD();
        this.renderBoard();
      });
      document.getElementById("btn-new-puzzle")?.addEventListener("click", () => {
        sound.playRattle();
        this.state.resetGame();
        this.updateHUD();
        this.renderBoard();
      });
      document.getElementById("btn-hint")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.openModal("REWARDED_AD", () => {
          this.applyHint();
        });
      });
      document.getElementById("ad-claim-btn")?.addEventListener("click", () => {
        sound.playHint();
        this.screens.claimReward();
      });
      document.getElementById("ad-skip-btn")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.closeModal();
      });
      document.getElementById("victory-next-btn")?.addEventListener("click", () => {
        sound.playButtonClick();
        this.screens.closeModal();
        const nextId = Math.min(this.state.currentLevel + 1, LEVELS.length);
        this.state.initLevel(nextId);
        this.updateHUD();
        this.renderBoard();
        this.renderLevelSelectModal();
      });
      document.getElementById("victory-replay-btn")?.addEventListener("click", () => {
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
    applyHint() {
      const hint = this.state.requestHint();
      if (!hint) return;
      sound.playHint();
      this.renderBoard();
      const targetTile = document.getElementById(`bulb-tile-${hint.r}-${hint.c}`);
      if (targetTile) {
        targetTile.classList.add("hint-pulse");
        if (this.tooltipEl) {
          this.tooltipEl.innerHTML = `<span>\u{1F4A1}</span><span>Toque aqui para desarmar a matriz!</span>`;
          this.showTooltipAt(targetTile);
        }
      }
    }
    /**
     * 60FPS Canvas Animation Loop for continuous particle physics
     */
    startRenderLoop() {
      const ctx = this.display.getContext();
      const loop = () => {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.render(ctx);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  };
  window.addEventListener("DOMContentLoaded", () => {
    new LightsOutApp();
  });
})();
