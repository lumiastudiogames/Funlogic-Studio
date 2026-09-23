import { LEVELS } from './levels.js';
import { audio } from './audio.js';

export class ScreenManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.currentScreen = 'MAIN_MENU';
    this.displayManager = null;
    this.hintCountdownTimer = null;
    this.hintSecondsRemaining = 5;

    this.updateScreenVisibility();
  }

  setDisplayManager(displayManager) {
    this.displayManager = displayManager;
  }

  getCurrentScreen() {
    return this.currentScreen;
  }

  setScreen(screen) {
    audio.playClick();
    this.currentScreen = screen;
    this.updateScreenVisibility();

    if (screen === 'PLAYING' && this.displayManager) {
      setTimeout(() => {
        this.displayManager.resize();
      }, 50);
    }
  }

  updateScreenVisibility() {
    const screens = {
      MAIN_MENU: document.getElementById('screen-main-menu'),
      PLAYING: document.getElementById('screen-gameplay'),
      LEVEL_SELECT: document.getElementById('screen-level-select'),
      HOW_TO_PLAY: document.getElementById('screen-how-to-play'),
      HINT_MODAL: document.getElementById('modal-hint'),
    };

    Object.entries(screens).forEach(([key, el]) => {
      if (el) {
        if (this.currentScreen === key || (this.currentScreen === 'HINT_MODAL' && key === 'PLAYING') || (this.currentScreen === 'SETTINGS' && key === 'PLAYING')) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });

    if (this.currentScreen === 'LEVEL_SELECT') {
      this.renderLevelSelectGrid();
    }
  }

  openHintModal() {
    audio.playClick();
    const save = this.gameState.getSave();
    const currentLevel = this.gameState.getCurrentLevel();

    const adContainer = document.getElementById('hint-ad-container');
    const rewardContent = document.getElementById('hint-reward-content');
    const timerText = document.getElementById('hint-timer-countdown');
    const progressBar = document.getElementById('hint-progress-bar');
    const btnClaim = document.getElementById('btn-claim-hint');
    const hintRevealedText = document.getElementById('hint-revealed-text');

    if (!adContainer || !rewardContent || !timerText || !progressBar || !btnClaim || !hintRevealedText) {
      this.setScreen('HINT_MODAL');
      return;
    }

    if (save.hintsAvailable > 0) {
      adContainer.classList.add('hidden');
      rewardContent.classList.remove('hidden');
      hintRevealedText.textContent = currentLevel.hintText;
      this.gameState.useHint();
    } else {
      adContainer.classList.remove('hidden');
      rewardContent.classList.add('hidden');
      btnClaim.disabled = true;
      btnClaim.classList.add('opacity-50', 'cursor-not-allowed');

      this.hintSecondsRemaining = 5;
      timerText.textContent = '5';
      progressBar.style.width = '0%';

      if (this.hintCountdownTimer) {
        clearInterval(this.hintCountdownTimer);
      }

      const totalDuration = 5000;
      const startTime = Date.now();

      this.hintCountdownTimer = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / totalDuration) * 100);
        progressBar.style.width = `${progress}%`;

        const remaining = Math.max(0, Math.ceil((totalDuration - elapsed) / 1000));
        timerText.textContent = String(remaining);

        if (remaining <= 0) {
          clearInterval(this.hintCountdownTimer);
          this.hintCountdownTimer = null;
          btnClaim.disabled = false;
          btnClaim.classList.remove('opacity-50', 'cursor-not-allowed');
          btnClaim.textContent = '💡 Reveal Free Hint!';
        }
      }, 100);
    }

    this.currentScreen = 'HINT_MODAL';
    this.updateScreenVisibility();
  }

  claimRewardedHint() {
    if (this.hintCountdownTimer) {
      clearInterval(this.hintCountdownTimer);
      this.hintCountdownTimer = null;
    }

    const currentLevel = this.gameState.getCurrentLevel();
    const adContainer = document.getElementById('hint-ad-container');
    const rewardContent = document.getElementById('hint-reward-content');
    const hintRevealedText = document.getElementById('hint-revealed-text');

    if (adContainer && rewardContent && hintRevealedText) {
      adContainer.classList.add('hidden');
      rewardContent.classList.remove('hidden');
      hintRevealedText.textContent = currentLevel.hintText;
    }

    audio.playHintUnlock();
    this.gameState.addHints(1);
    this.gameState.useHint();
  }

  closeHintModal() {
    if (this.hintCountdownTimer) {
      clearInterval(this.hintCountdownTimer);
      this.hintCountdownTimer = null;
    }
    this.setScreen('PLAYING');
  }

  renderLevelSelectGrid() {
    const gridEl = document.getElementById('level-grid-container');
    if (!gridEl) return;

    gridEl.innerHTML = '';
    const save = this.gameState.getSave();

    LEVELS.forEach((lvl, idx) => {
      const isUnlocked = lvl.id <= save.unlockedLevel;
      const isCompleted = save.completedLevels.includes(lvl.id);
      const isCurrent = idx === this.gameState.getCurrentLevelIndex();
      const bestTime = save.bestTimes[lvl.id];

      const btn = document.createElement('button');
      btn.className = `btn-tactile relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
        isUnlocked
          ? isCurrent
            ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400'
            : isCompleted
            ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
            : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
          : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-not-allowed'
      }`;

      btn.disabled = !isUnlocked;

      if (isUnlocked) {
        btn.innerHTML = `
          <span class="text-xs font-bold uppercase tracking-wider opacity-80">${lvl.difficulty}</span>
          <span class="text-2xl font-black my-1">${lvl.id}</span>
          <span class="text-[10px] font-semibold flex items-center gap-1 ${isCompleted ? 'text-amber-600' : 'text-slate-400'}">
            ${isCompleted ? `★ ${bestTime ? `${bestTime}s` : 'Completed'}` : 'Available'}
          </span>
        `;
        btn.onclick = () => {
          this.gameState.setLevel(idx);
          this.setScreen('PLAYING');
        };
      } else {
        btn.innerHTML = `
          <span class="text-xs font-bold uppercase tracking-wider opacity-60">${lvl.difficulty}</span>
          <span class="text-xl font-bold my-1 text-slate-400">🔒</span>
          <span class="text-[10px] font-medium text-slate-400">Locked</span>
        `;
      }

      gridEl.appendChild(btn);
    });
  }
}
