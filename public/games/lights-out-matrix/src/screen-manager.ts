/**
 * ScreenController handles modal states, screen transitions, and rewarded ad flow.
 */

export type GameModal = 'NONE' | 'START_MENU' | 'LEVEL_SELECT' | 'HOW_TO_PLAY' | 'REWARDED_AD' | 'VICTORY';

export class ScreenController {
  private currentModal: GameModal = 'NONE';
  private adTimer: number | null = null;
  private adSecondsLeft: number = 5;
  private onAdCompleted?: () => void;

  constructor() {
    this.bindGlobalKeys();
  }

  private bindGlobalKeys() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.currentModal !== 'NONE' && this.currentModal !== 'REWARDED_AD') {
          this.closeModal();
        }
      }
    });
  }

  public openModal(modal: GameModal, onAdReward?: () => void) {
    this.currentModal = modal;
    this.onAdCompleted = onAdReward;

    if (modal === 'REWARDED_AD') {
      this.startRewardedAdFlow();
    }

    this.render();
  }

  public closeModal() {
    if (this.adTimer) {
      clearInterval(this.adTimer);
      this.adTimer = null;
    }
    this.currentModal = 'NONE';
    this.render();
  }

  public getCurrentModal(): GameModal {
    return this.currentModal;
  }

  private startRewardedAdFlow() {
    this.adSecondsLeft = 5;
    const claimBtn = document.getElementById('ad-claim-btn') as HTMLButtonElement | null;
    const progressEl = document.getElementById('ad-progress-bar') as HTMLElement | null;
    const timerText = document.getElementById('ad-countdown-text') as HTMLElement | null;

    if (claimBtn) {
      claimBtn.disabled = true;
      claimBtn.classList.add('opacity-50', 'cursor-not-allowed');
      claimBtn.classList.remove('opacity-100', 'cursor-pointer');
      claimBtn.innerText = `Please wait (${this.adSecondsLeft}s)`;
    }
    if (progressEl) {
      progressEl.style.width = '0%';
    }
    if (timerText) {
      timerText.innerText = `${this.adSecondsLeft}s`;
    }

    if (this.adTimer) clearInterval(this.adTimer);

    const startTime = Date.now();
    const duration = 5000;

    this.adTimer = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((duration - elapsed) / 1000));
      const percent = Math.min(100, (elapsed / duration) * 100);

      if (progressEl) {
        progressEl.style.width = `${percent}%`;
      }
      if (timerText) {
        timerText.innerText = remaining > 0 ? `${remaining}s` : 'Ready!';
      }
      if (claimBtn && remaining > 0) {
        claimBtn.innerText = `Please wait (${remaining}s)`;
      }

      if (elapsed >= duration) {
        if (this.adTimer) clearInterval(this.adTimer);
        this.adTimer = null;
        if (claimBtn) {
          claimBtn.disabled = false;
          claimBtn.classList.remove('opacity-50', 'cursor-not-allowed');
          claimBtn.classList.add('opacity-100', 'cursor-pointer', 'bg-amber-500', 'hover:bg-amber-400');
          claimBtn.innerHTML = `💡 Claim Exact Hint!`;
        }
      }
    }, 100);
  }

  public claimReward() {
    if (this.onAdCompleted) {
      this.onAdCompleted();
    }
    this.closeModal();
  }

  private render() {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalStartMenu = document.getElementById('modal-start-menu');
    const modalLevelSelect = document.getElementById('modal-level-select');
    const modalHowToPlay = document.getElementById('modal-how-to-play');
    const modalRewardedAd = document.getElementById('modal-rewarded-ad');
    const modalVictory = document.getElementById('modal-victory');

    if (!modalOverlay) return;

    if (this.currentModal === 'NONE') {
      modalOverlay.classList.add('hidden');
      modalStartMenu?.classList.add('hidden');
      modalLevelSelect?.classList.add('hidden');
      modalHowToPlay?.classList.add('hidden');
      modalRewardedAd?.classList.add('hidden');
      modalVictory?.classList.add('hidden');
      return;
    }

    modalOverlay.classList.remove('hidden');

    modalStartMenu?.classList.toggle('hidden', this.currentModal !== 'START_MENU');
    modalLevelSelect?.classList.toggle('hidden', this.currentModal !== 'LEVEL_SELECT');
    modalHowToPlay?.classList.toggle('hidden', this.currentModal !== 'HOW_TO_PLAY');
    modalRewardedAd?.classList.toggle('hidden', this.currentModal !== 'REWARDED_AD');
    modalVictory?.classList.toggle('hidden', this.currentModal !== 'VICTORY');
  }
}
