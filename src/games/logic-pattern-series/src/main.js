import { audio } from './audio.js';
import { PUZZLES, getDailyPuzzle, renderPatternSvg } from './puzzles.js';

// LOCAL STORAGE PERSISTENCE KEY
const STORAGE_KEY = 'logic_pattern_series_vanilla_save_v1';

const defaultStats = {
  unlockedLevel: 1,
  levelScores: {},
  coins: 150,
  hintsRemaining: 2,
  currentStreak: 0,
  bestStreak: 0,
  dailyCompletedDates: [],
  soundEnabled: true,
  totalPuzzlesSolved: 0,
};

class GameApp {
  constructor() {
    this.stats = this.loadStats();
    this.currentScreen = 'MAIN_MENU'; // 'MAIN_MENU' | 'PLAYING'
    this.currentPuzzleIndex = 0;
    this.isDailyMode = false;
    this.selectedOptionId = null;
    this.isSubmitted = false;
    this.isAnswerCorrect = null;
    this.revealedHint = false;
    this.disabledOptionIds = [];
    this.levelStartTime = Date.now();

    // Ad Timer State
    this.adTimerInterval = null;
    this.adSecondsLeft = 5;

    // Cache DOM Elements
    this.dom = {
      canvas: document.getElementById('fx-canvas'),
      headerBadge: document.getElementById('header-badge'),
      headerSubtitle: document.getElementById('header-subtitle'),
      headerActionIcon: document.getElementById('header-action-icon'),
      btnHeaderAction: document.getElementById('btn-header-action'),
      scoreCounter: document.getElementById('score-counter'),
      btnHudHint: document.getElementById('btn-hud-hint'),
      btnSoundToggle: document.getElementById('btn-sound-toggle'),
      soundIcon: document.getElementById('sound-icon'),
      progressBarContainer: document.getElementById('game-progress-bar-container'),
      progressBar: document.getElementById('game-progress-bar'),

      // Views
      viewMainMenu: document.getElementById('view-main-menu'),
      viewGameplay: document.getElementById('view-gameplay'),

      // Menu Elements
      menuUnlockedLevel: document.getElementById('menu-unlocked-level'),
      menuTotalStars: document.getElementById('menu-total-stars'),
      menuCoins: document.getElementById('menu-coins'),
      menuDailyBadge: document.getElementById('menu-daily-badge'),
      menuStreak: document.getElementById('menu-streak'),
      btnMenuPlay: document.getElementById('btn-menu-play'),
      btnMenuPlayText: document.getElementById('btn-menu-play-text'),
      btnMenuDaily: document.getElementById('btn-menu-daily'),
      btnMenuLevelSelect: document.getElementById('btn-menu-levelselect'),
      btnMenuHowToPlay: document.getElementById('btn-menu-howtoplay'),
      btnMenuSettings: document.getElementById('btn-menu-settings'),

      // Gameplay Elements
      puzzlePrompt: document.getElementById('puzzle-prompt'),
      puzzleHintContainer: document.getElementById('puzzle-hint-container'),
      patternSequenceStrip: document.getElementById('pattern-sequence-strip'),
      optionsGrid: document.getElementById('options-grid'),
      btnSubmitAnswer: document.getElementById('btn-submit-answer'),
      btnSubmitText: document.getElementById('btn-submit-text'),
      feedbackAlert: document.getElementById('feedback-alert'),

      // Footer
      footerStreak: document.getElementById('footer-streak'),
      footerHints: document.getElementById('footer-hints'),

      // Modals
      modalHint: document.getElementById('modal-hint'),
      btnHintModalClose: document.getElementById('btn-hint-modal-close'),
      btnHintClaim: document.getElementById('btn-hint-claim'),
      hintAdSeconds: document.getElementById('hint-ad-seconds'),
      hintAdStatus: document.getElementById('hint-ad-status'),
      hintAdTimerCircle: document.getElementById('hint-ad-timer-circle'),

      modalHowToPlay: document.getElementById('modal-howtoplay'),
      btnHowToPlayClose: document.getElementById('btn-howtoplay-close'),
      btnHowToPlayGotIt: document.getElementById('btn-howtoplay-gotit'),

      modalLevelSelect: document.getElementById('modal-levelselect'),
      btnLevelSelectClose: document.getElementById('btn-levelselect-close'),
      levelSelectGrid: document.getElementById('level-select-grid'),

      modalPause: document.getElementById('modal-pause'),
      btnPauseResume: document.getElementById('btn-pause-resume'),
      btnPauseRestart: document.getElementById('btn-pause-restart'),
      btnPauseLevelSelect: document.getElementById('btn-pause-levelselect'),
      btnPauseMainMenu: document.getElementById('btn-pause-mainmenu'),

      modalExplanation: document.getElementById('modal-explanation'),
      explanationBadgeIcon: document.getElementById('explanation-badge-icon'),
      explanationTitle: document.getElementById('explanation-title'),
      explanationCategory: document.getElementById('explanation-category'),
      explanationRuleText: document.getElementById('explanation-rule-text'),
      btnExplanationNext: document.getElementById('btn-explanation-next'),

      modalSettings: document.getElementById('modal-settings'),
      btnSettingsClose: document.getElementById('btn-settings-close'),
      btnSettingsSoundToggle: document.getElementById('btn-settings-sound-toggle'),
      settingsSoundSymbol: document.getElementById('settings-sound-symbol'),
      settingsSoundKnob: document.getElementById('settings-sound-knob'),
      btnSettingsReset: document.getElementById('btn-settings-reset'),
    };

    // Canvas Particles
    this.particles = [];
    this.ctx = this.dom.canvas ? this.dom.canvas.getContext('2d') : null;

    this.initCanvas();
    this.bindEvents();
    this.updateSoundState();
    this.render();
  }

  loadStats() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultStats, ...JSON.parse(saved) };
      }
    } catch (_) {}
    return { ...defaultStats };
  }

  saveStats() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.stats));
    } catch (_) {}
  }

  getCurrentPuzzle() {
    if (this.isDailyMode) {
      return getDailyPuzzle();
    }
    return PUZZLES[this.currentPuzzleIndex] || PUZZLES[0];
  }

  initCanvas() {
    if (!this.dom.canvas || !this.ctx) return;

    const resize = () => {
      const rect = this.dom.canvas.parentElement.getBoundingClientRect();
      this.dom.canvas.width = rect.width;
      this.dom.canvas.height = rect.height;
    };

    window.addEventListener('resize', resize);
    resize();

    // 60 FPS Animation loop
    const animate = () => {
      this.ctx.clearRect(0, 0, this.dom.canvas.width, this.dom.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.life -= 0.018;
        p.rotation += p.vRot;

        if (p.life <= 0) {
          this.particles.splice(i, 1);
          continue;
        }

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.globalAlpha = Math.max(0, p.life);
        this.ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        this.ctx.restore();
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  triggerConfetti() {
    if (!this.dom.canvas) return;
    const w = this.dom.canvas.width;
    const h = this.dom.canvas.height;
    const colors = ['#2563eb', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f97316'];

    for (let i = 0; i < 70; i++) {
      const angle = (Math.PI * 2 * i) / 70 + (Math.random() - 0.5);
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x: w / 2,
        y: h / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        gravity: 0.18,
        life: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 5 + Math.random() * 6,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.2,
        shape: Math.random() > 0.5 ? 'circle' : 'rect',
      });
    }
  }

  bindEvents() {
    // Header Action
    this.dom.btnHeaderAction.addEventListener('click', () => {
      audio.playTap();
      if (this.currentScreen === 'PLAYING') {
        this.openModal(this.dom.modalPause);
      } else {
        this.openModal(this.dom.modalSettings);
      }
    });

    // Sound Toggle
    this.dom.btnSoundToggle.addEventListener('click', () => {
      this.toggleSound();
    });

    // Hint Button
    this.dom.btnHudHint.addEventListener('click', () => {
      audio.playTap();
      this.startRewardedAdFlow();
    });

    // Menu: Play Series
    this.dom.btnMenuPlay.addEventListener('click', () => {
      audio.playSelect();
      const currentLevel = Math.min(this.stats.unlockedLevel, PUZZLES.length);
      this.startLevel(currentLevel);
    });

    // Menu: Daily Challenge
    this.dom.btnMenuDaily.addEventListener('click', () => {
      audio.playSelect();
      this.startDaily();
    });

    // Menu: Level Select
    this.dom.btnMenuLevelSelect.addEventListener('click', () => {
      audio.playTap();
      this.renderLevelSelectGrid();
      this.openModal(this.dom.modalLevelSelect);
    });

    // Menu: How to Play
    this.dom.btnMenuHowToPlay.addEventListener('click', () => {
      audio.playTap();
      this.openModal(this.dom.modalHowToPlay);
    });

    // Menu: Settings
    this.dom.btnMenuSettings.addEventListener('click', () => {
      audio.playTap();
      this.openModal(this.dom.modalSettings);
    });

    // Submit Answer
    this.dom.btnSubmitAnswer.addEventListener('click', () => {
      this.submitAnswer();
    });

    // Modals Closures
    this.dom.btnHintModalClose.addEventListener('click', () => {
      this.stopRewardedAdTimer();
      this.closeModal(this.dom.modalHint);
    });

    this.dom.btnHintClaim.addEventListener('click', () => {
      this.claimHintReward();
    });

    this.dom.btnHowToPlayClose.addEventListener('click', () => {
      this.closeModal(this.dom.modalHowToPlay);
    });
    this.dom.btnHowToPlayGotIt.addEventListener('click', () => {
      audio.playTap();
      this.closeModal(this.dom.modalHowToPlay);
    });

    this.dom.btnLevelSelectClose.addEventListener('click', () => {
      this.closeModal(this.dom.modalLevelSelect);
    });

    this.dom.btnPauseResume.addEventListener('click', () => {
      audio.playTap();
      this.closeModal(this.dom.modalPause);
    });
    this.dom.btnPauseRestart.addEventListener('click', () => {
      audio.playTap();
      this.closeModal(this.dom.modalPause);
      const puzzle = this.getCurrentPuzzle();
      this.startLevel(puzzle.id);
    });
    this.dom.btnPauseLevelSelect.addEventListener('click', () => {
      audio.playTap();
      this.closeModal(this.dom.modalPause);
      this.renderLevelSelectGrid();
      this.openModal(this.dom.modalLevelSelect);
    });
    this.dom.btnPauseMainMenu.addEventListener('click', () => {
      audio.playTap();
      this.closeModal(this.dom.modalPause);
      this.showScreen('MAIN_MENU');
    });

    this.dom.btnExplanationNext.addEventListener('click', () => {
      audio.playTap();
      this.closeModal(this.dom.modalExplanation);
      this.nextPuzzle();
    });

    this.dom.btnSettingsClose.addEventListener('click', () => {
      this.closeModal(this.dom.modalSettings);
    });
    this.dom.btnSettingsSoundToggle.addEventListener('click', () => {
      this.toggleSound();
    });
    this.dom.btnSettingsReset.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all game progress and unlocked levels?')) {
        audio.playTap();
        this.stats = { ...defaultStats };
        this.saveStats();
        this.closeModal(this.dom.modalSettings);
        this.showScreen('MAIN_MENU');
      }
    });
  }

  openModal(el) {
    if (!el) return;
    el.classList.remove('hidden');
  }

  closeModal(el) {
    if (!el) return;
    el.classList.add('hidden');
  }

  toggleSound() {
    this.stats.soundEnabled = !this.stats.soundEnabled;
    this.saveStats();
    this.updateSoundState();
    if (this.stats.soundEnabled) {
      audio.playTap();
    }
  }

  updateSoundState() {
    audio.setSoundEnabled(this.stats.soundEnabled);
    if (this.dom.soundIcon) {
      this.dom.soundIcon.textContent = this.stats.soundEnabled ? '🔊' : '🔇';
    }
    if (this.dom.settingsSoundSymbol) {
      this.dom.settingsSoundSymbol.textContent = this.stats.soundEnabled ? '🔊' : '🔇';
    }
    if (this.dom.settingsSoundKnob) {
      if (this.stats.soundEnabled) {
        this.dom.settingsSoundKnob.className = 'w-5 h-5 rounded-full bg-white shadow-md transform transition-transform translate-x-6';
        this.dom.btnSettingsSoundToggle.className = 'w-12 h-6 rounded-full transition-colors relative p-0.5 bg-blue-600';
      } else {
        this.dom.settingsSoundKnob.className = 'w-5 h-5 rounded-full bg-white shadow-md transform transition-transform translate-x-0';
        this.dom.btnSettingsSoundToggle.className = 'w-12 h-6 rounded-full transition-colors relative p-0.5 bg-slate-300';
      }
    }
  }

  showScreen(screen) {
    this.currentScreen = screen;
    if (screen === 'MAIN_MENU') {
      this.dom.viewMainMenu.classList.remove('hidden');
      this.dom.viewGameplay.classList.add('hidden');
      this.dom.btnHudHint.classList.add('hidden');
      this.dom.progressBarContainer.classList.add('hidden');
      this.dom.headerBadge.textContent = 'Pattern Series';
      this.dom.headerSubtitle.textContent = 'Spatial Puzzle Game';
      this.dom.headerActionIcon.textContent = '⚙️';
    } else {
      this.dom.viewMainMenu.classList.add('hidden');
      this.dom.viewGameplay.classList.remove('hidden');
      this.dom.btnHudHint.classList.remove('hidden');
      this.dom.headerActionIcon.textContent = '‹';
    }
    this.render();
  }

  startLevel(levelId) {
    const idx = Math.max(0, Math.min(PUZZLES.length - 1, levelId - 1));
    this.currentPuzzleIndex = idx;
    this.isDailyMode = false;
    this.resetGameplayState();
    this.showScreen('PLAYING');
  }

  startDaily() {
    this.isDailyMode = true;
    this.resetGameplayState();
    this.showScreen('PLAYING');
  }

  resetGameplayState() {
    this.selectedOptionId = null;
    this.isSubmitted = false;
    this.isAnswerCorrect = null;
    this.revealedHint = false;
    this.disabledOptionIds = [];
    this.levelStartTime = Date.now();
    this.dom.feedbackAlert.classList.add('hidden');
  }

  startRewardedAdFlow() {
    this.adSecondsLeft = 5;
    this.dom.btnHintClaim.disabled = true;
    this.dom.btnHintClaim.className = 'btn-tactile w-full py-3 rounded-xl font-black text-xs sm:text-sm bg-slate-200 text-slate-400 cursor-not-allowed';
    this.dom.btnHintClaim.innerHTML = `<span>CLAIM REWARD (${this.adSecondsLeft}s)</span>`;
    this.dom.hintAdSeconds.textContent = this.adSecondsLeft;
    this.dom.hintAdStatus.textContent = 'Simulating sponsor message...';
    this.dom.hintAdTimerCircle.classList.add('animate-spin');

    this.openModal(this.dom.modalHint);

    clearInterval(this.adTimerInterval);
    this.adTimerInterval = setInterval(() => {
      this.adSecondsLeft--;
      this.dom.hintAdSeconds.textContent = Math.max(0, this.adSecondsLeft);
      this.dom.btnHintClaim.innerHTML = `<span>CLAIM REWARD (${this.adSecondsLeft}s)</span>`;

      if (this.adSecondsLeft <= 0) {
        clearInterval(this.adTimerInterval);
        this.dom.hintAdStatus.textContent = 'Reward Ready! Click Claim below.';
        this.dom.hintAdTimerCircle.classList.remove('animate-spin');
        this.dom.hintAdSeconds.textContent = '✓';
        this.dom.btnHintClaim.disabled = false;
        this.dom.btnHintClaim.className = 'btn-tactile-primary w-full py-3 rounded-xl font-black text-xs sm:text-sm shadow-lg cursor-pointer';
        this.dom.btnHintClaim.innerHTML = '<span>CLAIM HINT & REWARD</span>';
      }
    }, 1000);
  }

  stopRewardedAdTimer() {
    clearInterval(this.adTimerInterval);
  }

  claimHintReward() {
    audio.playHint();
    this.stopRewardedAdTimer();
    this.closeModal(this.dom.modalHint);

    this.revealedHint = true;
    this.stats.hintsRemaining++;
    this.stats.coins += 10;
    this.saveStats();

    // Eliminate one wrong option
    const puzzle = this.getCurrentPuzzle();
    const incorrect = puzzle.options
      .filter((opt) => opt.id !== puzzle.correctOptionId && !this.disabledOptionIds.includes(opt.id))
      .map((opt) => opt.id);

    if (incorrect.length > 0) {
      const eliminated = incorrect[Math.floor(Math.random() * incorrect.length)];
      this.disabledOptionIds.push(eliminated);
    }

    this.render();
  }

  submitAnswer() {
    if (!this.selectedOptionId || this.isSubmitted) return;

    this.isSubmitted = true;
    const puzzle = this.getCurrentPuzzle();
    const correct = this.selectedOptionId === puzzle.correctOptionId;
    this.isAnswerCorrect = correct;

    const timeSpent = Math.max(1, Math.floor((Date.now() - this.levelStartTime) / 1000));

    if (correct) {
      audio.playCorrect();
      this.triggerConfetti();

      this.dom.feedbackAlert.textContent = 'Correct! Excellent deduction.';
      this.dom.feedbackAlert.className = 'text-center text-xs font-bold py-1 px-3 rounded-lg max-w-md mx-auto mt-1 text-emerald-700 bg-emerald-50 block';

      this.stats.currentStreak++;
      this.stats.bestStreak = Math.max(this.stats.bestStreak, this.stats.currentStreak);
      const earnedCoins = this.isDailyMode ? 50 : 25;
      this.stats.coins += earnedCoins;
      this.stats.totalPuzzlesSolved++;

      if (this.isDailyMode) {
        const todayStr = new Date().toISOString().split('T')[0];
        if (!this.stats.dailyCompletedDates.includes(todayStr)) {
          this.stats.dailyCompletedDates.push(todayStr);
        }
      } else {
        this.stats.unlockedLevel = Math.max(this.stats.unlockedLevel, puzzle.id + 1);
        const stars = this.revealedHint ? 2 : timeSpent < 25 ? 3 : 2;
        this.stats.levelScores[puzzle.id] = {
          stars: Math.max(stars, this.stats.levelScores[puzzle.id]?.stars || 0),
          timeSec: timeSpent,
          score: (this.stats.levelScores[puzzle.id]?.score || 0) + 100,
        };
      }

      this.saveStats();

      // Platform event integration
      try {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'win', time: timeSpent }, '*');
        }
      } catch (_) {}

      setTimeout(() => {
        this.openExplanationModal(true, puzzle);
      }, 900);
    } else {
      audio.playWrong();
      this.stats.currentStreak = 0;
      this.saveStats();

      this.dom.feedbackAlert.textContent = 'Incorrect. Check the rule explanation.';
      this.dom.feedbackAlert.className = 'text-center text-xs font-bold py-1 px-3 rounded-lg max-w-md mx-auto mt-1 text-rose-700 bg-rose-50 block';

      setTimeout(() => {
        this.openExplanationModal(false, puzzle);
      }, 1000);
    }

    this.render();
  }

  openExplanationModal(isCorrect, puzzle) {
    if (isCorrect) {
      this.dom.explanationBadgeIcon.textContent = '✓';
      this.dom.explanationBadgeIcon.className = 'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-emerald-100 text-emerald-600';
      this.dom.explanationTitle.textContent = 'Correct Deduction!';
    } else {
      this.dom.explanationBadgeIcon.textContent = '✕';
      this.dom.explanationBadgeIcon.className = 'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 bg-rose-100 text-rose-600';
      this.dom.explanationTitle.textContent = 'Sequence Breakdown';
    }

    this.dom.explanationCategory.textContent = puzzle.seriesName;
    this.dom.explanationRuleText.textContent = puzzle.ruleDescription;
    this.openModal(this.dom.modalExplanation);
  }

  nextPuzzle() {
    if (this.isDailyMode) {
      this.showScreen('MAIN_MENU');
      return;
    }

    if (this.currentPuzzleIndex + 1 < PUZZLES.length) {
      this.startLevel(this.currentPuzzleIndex + 2);
    } else {
      audio.playWin();
      this.showScreen('MAIN_MENU');
    }
  }

  renderLevelSelectGrid() {
    this.dom.levelSelectGrid.innerHTML = '';
    PUZZLES.forEach((p) => {
      const isUnlocked = p.id <= this.stats.unlockedLevel;
      const isCurrent = p.id === this.currentPuzzleIndex + 1 && this.currentScreen === 'PLAYING';
      const score = this.stats.levelScores[p.id];
      const stars = score ? score.stars : 0;

      const card = document.createElement('button');
      card.disabled = !isUnlocked;
      card.className = `p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all ${
        isCurrent
          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-300'
          : isUnlocked
          ? 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
          : 'bg-slate-100/70 border-slate-200 opacity-50 cursor-not-allowed'
      }`;

      card.innerHTML = `
        <div class="flex items-center justify-between w-full mb-1">
          <span class="text-[10px] font-extrabold ${isUnlocked ? 'text-blue-600' : 'text-slate-400'}">LVL ${p.id}</span>
          <span>${isUnlocked ? '🔓' : '🔒'}</span>
        </div>
        <div class="w-10 h-10 my-1 flex items-center justify-center">
          ${renderPatternSvg(p.sequence[0], 'scale-90')}
        </div>
        <div class="flex items-center gap-0.5 text-xs text-amber-500 font-bold mt-1">
          ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}
        </div>
      `;

      card.addEventListener('click', () => {
        audio.playSelect();
        this.closeModal(this.dom.modalLevelSelect);
        this.startLevel(p.id);
      });

      this.dom.levelSelectGrid.appendChild(card);
    });
  }

  render() {
    // Sync HUD Metrics
    this.dom.scoreCounter.textContent = this.stats.coins;
    this.dom.footerStreak.textContent = this.stats.currentStreak;
    this.dom.footerHints.textContent = this.stats.hintsRemaining;

    if (this.currentScreen === 'MAIN_MENU') {
      const totalStars = Object.values(this.stats.levelScores).reduce((acc, curr) => acc + curr.stars, 0);
      const todayStr = new Date().toISOString().split('T')[0];
      const isDailyCompleted = this.stats.dailyCompletedDates.includes(todayStr);

      this.dom.menuUnlockedLevel.textContent = `${this.stats.unlockedLevel} / ${PUZZLES.length}`;
      this.dom.menuTotalStars.textContent = totalStars;
      this.dom.menuCoins.textContent = this.stats.coins;
      this.dom.menuStreak.textContent = this.stats.currentStreak;
      this.dom.menuDailyBadge.textContent = isDailyCompleted ? '✓ Done' : '+50 Coins';
      this.dom.btnMenuPlayText.textContent = this.stats.unlockedLevel > 1 ? `Resume Level ${Math.min(this.stats.unlockedLevel, PUZZLES.length)}` : 'Play Series';
    } else {
      // Gameplay Rendering
      const puzzle = this.getCurrentPuzzle();
      const totalPuzzles = PUZZLES.length;

      // Header info
      this.dom.headerBadge.textContent = this.isDailyMode ? 'Daily Challenge' : 'Pattern Series';
      this.dom.headerSubtitle.textContent = this.isDailyMode
        ? new Date().toISOString().split('T')[0]
        : `${puzzle.seriesName} • Puzzle ${puzzle.id}/${totalPuzzles}`;

      // Progress bar
      if (!this.isDailyMode) {
        this.dom.progressBarContainer.classList.remove('hidden');
        this.dom.progressBar.style.width = `${(puzzle.id / totalPuzzles) * 100}%`;
      } else {
        this.dom.progressBarContainer.classList.add('hidden');
      }

      // Prompt & Hint
      this.dom.puzzlePrompt.textContent = puzzle.prompt;
      if (this.revealedHint) {
        this.dom.puzzleHintContainer.innerHTML = `
          <p class="text-xs sm:text-sm text-amber-700 font-bold bg-amber-50 inline-block px-3 py-0.5 rounded-full border border-amber-200 animate-pulse">
            💡 Hint: ${puzzle.clue}
          </p>
        `;
      } else {
        this.dom.puzzleHintContainer.innerHTML = `
          <p class="text-[11px] sm:text-xs text-slate-400">
            Analyze the sequence progression from left to right.
          </p>
        `;
      }

      // Render Sequence Strip
      this.dom.patternSequenceStrip.innerHTML = '';
      puzzle.sequence.forEach((item, idx) => {
        const card = document.createElement('div');
        card.className = 'w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 bg-white border border-slate-200/90 rounded-2xl shadow-sm flex flex-col items-center justify-between p-1.5 sm:p-2 pattern-card shrink-0 relative';
        card.innerHTML = `
          <span class="text-[10px] sm:text-xs font-black text-slate-400 self-start leading-none">${idx + 1}</span>
          <div class="w-full h-full flex items-center justify-center p-0.5">
            ${renderPatternSvg(item)}
          </div>
        `;
        this.dom.patternSequenceStrip.appendChild(card);
      });

      // Render Question Mark Target Card
      const questionCard = document.createElement('div');
      questionCard.className = 'w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 bg-blue-50/70 border-2 border-dashed border-blue-500 rounded-2xl shadow-sm flex flex-col items-center justify-between p-1.5 sm:p-2 pattern-card shrink-0 relative';
      questionCard.innerHTML = `
        <span class="text-[10px] sm:text-xs font-black text-blue-600 self-start leading-none">${puzzle.sequence.length + 1}</span>
        <div class="w-full h-full flex items-center justify-center">
          <span class="font-black text-2xl sm:text-3xl text-blue-600 font-heading">?</span>
        </div>
      `;
      this.dom.patternSequenceStrip.appendChild(questionCard);

      // Render Options Grid
      this.dom.optionsGrid.innerHTML = '';
      puzzle.options.forEach((opt) => {
        const isSelected = this.selectedOptionId === opt.id;
        const isDisabled = this.disabledOptionIds.includes(opt.id);
        const isCorrect = this.isSubmitted && opt.id === puzzle.correctOptionId;
        const isWrong = this.isSubmitted && isSelected && !this.isAnswerCorrect;

        const optBtn = document.createElement('button');
        optBtn.disabled = this.isSubmitted || isDisabled;
        optBtn.className = `btn-tactile rounded-xl p-2 sm:p-2.5 flex items-center justify-between text-left transition-all relative ${
          isCorrect
            ? 'bg-emerald-50 border-2 border-emerald-500 shadow-md ring-2 ring-emerald-200'
            : isWrong
            ? 'bg-rose-50 border-2 border-rose-500 shadow-md ring-2 ring-rose-200'
            : isSelected
            ? 'bg-blue-50/80 border-2 border-blue-600 shadow-md ring-2 ring-blue-200'
            : isDisabled
            ? 'bg-slate-100 opacity-40 cursor-not-allowed border border-slate-200'
            : 'bg-white border border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
        }`;

        optBtn.innerHTML = `
          <div class="flex items-center gap-2.5">
            <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
              isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
            }">
              ${opt.id}
            </div>
            <div class="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
              ${renderPatternSvg(opt.item, 'scale-80')}
            </div>
            <div class="flex flex-col">
              <span class="font-extrabold text-xs sm:text-sm text-slate-800 leading-tight">${opt.label}</span>
              <span class="text-[10px] sm:text-xs text-slate-400 mt-0.5 leading-tight line-clamp-1">${opt.explanation}</span>
            </div>
          </div>
          <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${
            isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
          }">
            ${isSelected ? '<div class="w-1.5 h-1.5 rounded-full bg-white"></div>' : ''}
          </div>
        `;

        optBtn.addEventListener('click', () => {
          if (this.isSubmitted || isDisabled) return;
          audio.playSelect();
          this.selectedOptionId = opt.id;
          this.render();
        });

        this.dom.optionsGrid.appendChild(optBtn);
      });

      // Submit button state
      if (this.selectedOptionId && !this.isSubmitted) {
        this.dom.btnSubmitAnswer.disabled = false;
        this.dom.btnSubmitAnswer.className = 'btn-tactile-primary w-full py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg';
        this.dom.btnSubmitText.textContent = 'SUBMIT ANSWER';
      } else if (this.isSubmitted) {
        this.dom.btnSubmitAnswer.disabled = true;
        this.dom.btnSubmitAnswer.className = 'w-full py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300';
        this.dom.btnSubmitText.textContent = this.isAnswerCorrect ? '✓ CORRECT' : '✕ REVIEW';
      } else {
        this.dom.btnSubmitAnswer.disabled = true;
        this.dom.btnSubmitAnswer.className = 'w-full py-3 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300';
        this.dom.btnSubmitText.textContent = 'SUBMIT ANSWER';
      }
    }
  }
}

// Instantiate Game on DOM Content Loaded
window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
