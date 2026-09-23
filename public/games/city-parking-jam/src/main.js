import { GameManager } from './game-state.js';
import { GameRenderer } from './renderer.js';
import { sound } from './audio.js';
import { ALL_LEVELS, SKINS_DATA, TRAILS_DATA } from './levels.js';

// Initialize Game & Renderer
const canvas = document.getElementById('game-canvas');
const game = new GameManager();
const renderer = new GameRenderer(canvas);

// Active Tab in Garage Modal
let activeGarageTab = 'skins';
let hintAdInterval = null;

// DOM Elements
const hudLevelText = document.getElementById('hud-level-text');
const hudDiffPill = document.getElementById('hud-diff-pill');
const hudMovesCount = document.getElementById('hud-moves-count');
const hudParCount = document.getElementById('hud-par-count');
const iconSoundOn = document.getElementById('icon-sound-on');
const iconSoundOff = document.getElementById('icon-sound-off');

// Modals
const modalMainMenu = document.getElementById('modal-main-menu');
const modalLevelSelect = document.getElementById('modal-level-select');
const modalGarage = document.getElementById('modal-garage');
const modalHowToPlay = document.getElementById('modal-how-to-play');
const modalSettings = document.getElementById('modal-settings');
const modalHintAd = document.getElementById('modal-hint-ad');
const modalLevelWin = document.getElementById('modal-level-win');

// Menu Stats
const menuStarsCount = document.getElementById('menu-stars-count');
const menuCoinsCount = document.getElementById('menu-coins-count');
const btnMenuPlayText = document.getElementById('btn-menu-play-text');

// Settings Toggles
const toggleSfx = document.getElementById('toggle-sfx');
const toggleAmbient = document.getElementById('toggle-ambient');

function updateUI() {
  const currentLvl = game.getCurrentLevelDef();
  const progress = game.getProgress();
  const moves = game.getMovesCount();
  const isWon = game.getIsWon();

  // 1. HUD Updates
  hudLevelText.textContent = `LVL ${currentLvl.levelNumber}`;
  hudDiffPill.textContent = currentLvl.difficulty.toUpperCase();
  hudMovesCount.textContent = moves;
  hudParCount.textContent = `/ ${currentLvl.parMoves}`;

  if (progress.soundEnabled) {
    iconSoundOn.classList.remove('hidden');
    iconSoundOff.classList.add('hidden');
  } else {
    iconSoundOn.classList.add('hidden');
    iconSoundOff.classList.remove('hidden');
  }

  // 2. Menu Updates
  menuStarsCount.textContent = `${progress.totalStars} / 90`;
  menuCoinsCount.textContent = `${progress.coins}`;
  btnMenuPlayText.textContent = `PLAY LEVEL ${progress.unlockedLevel}`;

  // 3. Settings Toggles
  toggleSfx.checked = progress.soundEnabled;
  toggleAmbient.checked = progress.musicEnabled;

  // 4. Level Win Modal
  if (isWon) {
    const lvlNum = currentLvl.levelNumber;
    const par = currentLvl.parMoves;
    let stars = 1;
    if (moves <= par) stars = 3;
    else if (moves <= par + 2) stars = 2;

    document.getElementById('win-level-badge').textContent = `LEVEL ${lvlNum} CLEARED!`;
    document.getElementById('win-moves-stat').textContent = `${moves} / ${par}`;
    document.getElementById('win-coins-stat').textContent = `+${stars * 10 + 15}`;

    for (let s = 1; s <= 3; s++) {
      const starElem = document.getElementById(`win-star-${s}`);
      if (s <= stars) {
        starElem.classList.remove('opacity-25');
        starElem.classList.add('scale-110');
      } else {
        starElem.classList.add('opacity-25');
        starElem.classList.remove('scale-110');
      }
    }

    modalLevelWin.classList.remove('hidden');
  } else {
    modalLevelWin.classList.add('hidden');
  }
}

// Render Level Grid in Level Select Modal
function populateLevelGrid() {
  const gridContainer = document.getElementById('levels-grid');
  gridContainer.innerHTML = '';

  const progress = game.getProgress();
  const unlocked = progress.unlockedLevel;

  for (let i = 1; i <= 30; i++) {
    const isUnlocked = i <= unlocked;
    const stars = progress.levelStars[i] || 0;
    const isCurrent = game.getCurrentLevelDef().levelNumber === i;

    const btn = document.createElement('button');
    btn.className = `btn-tactile aspect-square rounded-2xl flex flex-col items-center justify-center relative p-1 transition-all ${
      isUnlocked
        ? isCurrent
          ? 'bg-blue-600 border-2 border-blue-400 text-white shadow-lg shadow-blue-500/30'
          : 'bg-slate-800 border border-slate-700 text-slate-100 hover:bg-slate-750'
        : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed opacity-60'
    }`;

    if (isUnlocked) {
      btn.innerHTML = `
        <span class="text-sm sm:text-base font-black">${i}</span>
        <div class="flex items-center gap-0.5 mt-0.5">
          ${[1, 2, 3]
            .map(
              (s) =>
                `<svg class="w-2.5 h-2.5 ${
                  s <= stars ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-700'
                }" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
            )
            .join('')}
        </div>
      `;

      btn.onclick = () => {
        sound.playClick();
        game.loadLevel(i);
        modalLevelSelect.classList.add('hidden');
        modalMainMenu.classList.add('hidden');
      };
    } else {
      btn.innerHTML = `
        <svg class="w-4 h-4 text-slate-600 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke-width="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke-width="2"></path></svg>
        <span class="text-[10px] font-bold text-slate-600">${i}</span>
      `;
    }

    gridContainer.appendChild(btn);
  }
}

// Render Garage Items (Skins & Trails)
function populateGarage() {
  const container = document.getElementById('garage-items-list');
  container.innerHTML = '';

  const progress = game.getProgress();
  const totalStars = progress.totalStars;

  if (activeGarageTab === 'skins') {
    for (const skin of SKINS_DATA) {
      const isUnlocked = progress.unlockedSkins.includes(skin.id);
      const isEquipped = progress.activeSkin === skin.id;

      const card = document.createElement('div');
      card.className = `p-3 rounded-2xl border flex items-center justify-between transition-all ${
        isEquipped
          ? 'bg-blue-600/10 border-blue-500/40'
          : isUnlocked
          ? 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800'
          : 'bg-slate-900/60 border-slate-800/60 opacity-60'
      }`;

      card.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="text-2xl">${skin.icon}</span>
          <div>
            <div class="flex items-center gap-1.5">
              <h3 class="text-xs font-black text-white">${skin.name}</h3>
              ${isEquipped ? '<span class="px-1.5 py-0.5 rounded bg-blue-500 text-white text-[8px] font-extrabold">EQUIPPED</span>' : ''}
            </div>
            <p class="text-[10px] text-slate-400">${skin.description}</p>
          </div>
        </div>

        <div>
          ${
            isEquipped
              ? '<span class="text-xs text-blue-400 font-bold">Active</span>'
              : isUnlocked
              ? `<button data-skin="${skin.id}" class="btn-tactile px-3 py-1.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs">EQUIP</button>`
              : `<div class="flex items-center gap-1 text-xs text-slate-500 font-bold"><svg class="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><span>${skin.starsRequired}</span></div>`
          }
        </div>
      `;

      const equipBtn = card.querySelector('button');
      if (equipBtn) {
        equipBtn.onclick = () => {
          sound.playClick();
          game.setSkin(skin.id);
          populateGarage();
        };
      }

      container.appendChild(card);
    }
  } else {
    for (const trail of TRAILS_DATA) {
      const isUnlocked = progress.unlockedTrails.includes(trail.id);
      const isEquipped = progress.activeTrail === trail.id;

      const card = document.createElement('div');
      card.className = `p-3 rounded-2xl border flex items-center justify-between transition-all ${
        isEquipped
          ? 'bg-blue-600/10 border-blue-500/40'
          : isUnlocked
          ? 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800'
          : 'bg-slate-900/60 border-slate-800/60 opacity-60'
      }`;

      card.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="text-2xl">${trail.icon}</span>
          <div>
            <div class="flex items-center gap-1.5">
              <h3 class="text-xs font-black text-white">${trail.name}</h3>
              ${isEquipped ? '<span class="px-1.5 py-0.5 rounded bg-blue-500 text-white text-[8px] font-extrabold">EQUIPPED</span>' : ''}
            </div>
            <p class="text-[10px] text-slate-400">${trail.description}</p>
          </div>
        </div>

        <div>
          ${
            isEquipped
              ? '<span class="text-xs text-blue-400 font-bold">Active</span>'
              : isUnlocked
              ? `<button data-trail="${trail.id}" class="btn-tactile px-3 py-1.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs">EQUIP</button>`
              : `<div class="flex items-center gap-1 text-xs text-slate-500 font-bold"><svg class="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg><span>${trail.starsRequired}</span></div>`
          }
        </div>
      `;

      const equipBtn = card.querySelector('button');
      if (equipBtn) {
        equipBtn.onclick = () => {
          sound.playClick();
          game.setTrail(trail.id);
          populateGarage();
        };
      }

      container.appendChild(card);
    }
  }
}

// Bind Touch / Click interactions on Canvas to unpark cars
function setupCanvasInteractions() {
  function handleTap(clientX, clientY) {
    sound.initContext();
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const car = game.getCarAtScreenCoord(x, y);
    if (car) {
      game.tryMoveCar(car.id);
    }
  }

  canvas.addEventListener('click', (e) => {
    handleTap(e.clientX, e.clientY);
  });

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      handleTap(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
}

// Bind DOM UI buttons
function setupUIEvents() {
  // HUD Buttons
  document.getElementById('btn-hud-menu').onclick = () => {
    sound.playClick();
    modalMainMenu.classList.remove('hidden');
  };

  document.getElementById('btn-hud-undo').onclick = () => {
    game.undoLastMove();
  };

  document.getElementById('btn-hud-restart').onclick = () => {
    sound.playClick();
    game.restartCurrentLevel();
  };

  document.getElementById('btn-hud-sound').onclick = () => {
    const isSfx = game.getProgress().soundEnabled;
    game.setSound(!isSfx);
  };

  // Hint Button (triggers rewarded simulated ad)
  document.getElementById('btn-hud-hint').onclick = () => {
    sound.playClick();
    modalHintAd.classList.remove('hidden');
    const progBar = document.getElementById('hint-ad-progress');
    progBar.style.width = '0%';

    let progress = 0;
    if (hintAdInterval) clearInterval(hintAdInterval);

    hintAdInterval = setInterval(() => {
      progress += 20;
      progBar.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(hintAdInterval);
        hintAdInterval = null;
        setTimeout(() => {
          modalHintAd.classList.add('hidden');
          game.revealHint();
          sound.playCoin();
        }, 300);
      }
    }, 1000);
  };

  document.getElementById('btn-cancel-ad').onclick = () => {
    if (hintAdInterval) clearInterval(hintAdInterval);
    hintAdInterval = null;
    modalHintAd.classList.add('hidden');
  };

  // Main Menu Buttons
  document.getElementById('btn-menu-play').onclick = () => {
    sound.playClick();
    sound.initContext();
    modalMainMenu.classList.add('hidden');
    const unlocked = game.getProgress().unlockedLevel;
    game.loadLevel(unlocked);
  };

  document.getElementById('btn-menu-levels').onclick = () => {
    sound.playClick();
    populateLevelGrid();
    modalLevelSelect.classList.remove('hidden');
  };

  document.getElementById('btn-close-levels').onclick = () => {
    sound.playClick();
    modalLevelSelect.classList.add('hidden');
  };

  document.getElementById('btn-menu-garage').onclick = () => {
    sound.playClick();
    populateGarage();
    modalGarage.classList.remove('hidden');
  };

  document.getElementById('btn-close-garage').onclick = () => {
    sound.playClick();
    modalGarage.classList.add('hidden');
  };

  // Garage Tabs
  document.getElementById('tab-garage-skins').onclick = () => {
    sound.playClick();
    activeGarageTab = 'skins';
    document.getElementById('tab-garage-skins').className = 'flex-1 py-1.5 rounded-lg font-extrabold text-xs bg-blue-600 text-white';
    document.getElementById('tab-garage-trails').className = 'flex-1 py-1.5 rounded-lg font-extrabold text-xs text-slate-400 hover:text-white';
    populateGarage();
  };

  document.getElementById('tab-garage-trails').onclick = () => {
    sound.playClick();
    activeGarageTab = 'trails';
    document.getElementById('tab-garage-trails').className = 'flex-1 py-1.5 rounded-lg font-extrabold text-xs bg-blue-600 text-white';
    document.getElementById('tab-garage-skins').className = 'flex-1 py-1.5 rounded-lg font-extrabold text-xs text-slate-400 hover:text-white';
    populateGarage();
  };

  // How to Play
  document.getElementById('btn-menu-how').onclick = () => {
    sound.playClick();
    modalHowToPlay.classList.remove('hidden');
  };

  document.getElementById('btn-close-how').onclick = () => {
    sound.playClick();
    modalHowToPlay.classList.add('hidden');
  };

  document.getElementById('btn-how-got-it').onclick = () => {
    sound.playClick();
    modalHowToPlay.classList.add('hidden');
  };

  // Settings
  document.getElementById('btn-menu-settings').onclick = () => {
    sound.playClick();
    modalSettings.classList.remove('hidden');
  };

  document.getElementById('btn-close-settings').onclick = () => {
    sound.playClick();
    modalSettings.classList.add('hidden');
  };

  toggleSfx.onchange = (e) => {
    game.setSound(e.target.checked);
  };

  toggleAmbient.onchange = (e) => {
    game.setMusic(e.target.checked);
  };

  document.getElementById('btn-reset-data').onclick = () => {
    if (confirm('Are you sure you want to reset all game progress?')) {
      localStorage.removeItem('city_parking_jam_save_v1');
      location.reload();
    }
  };

  // Level Win Buttons
  document.getElementById('btn-win-next').onclick = () => {
    sound.playClick();
    const current = game.getCurrentLevelDef().levelNumber;
    if (current < 30) {
      game.loadLevel(current + 1);
    } else {
      modalMainMenu.classList.remove('hidden');
    }
  };

  document.getElementById('btn-win-replay').onclick = () => {
    sound.playClick();
    game.restartCurrentLevel();
  };

  document.getElementById('btn-win-levels').onclick = () => {
    sound.playClick();
    populateLevelGrid();
    modalLevelWin.classList.add('hidden');
    modalLevelSelect.classList.remove('hidden');
  };
}

// Window & Canvas resize handler
function handleResize() {
  const container = document.getElementById('game-container');
  if (container) {
    const w = container.clientWidth;
    const h = container.clientHeight;
    renderer.resize(w, h);
  }
}

// Game Animation Loop (60 FPS)
let lastTimestamp = performance.now();
function gameLoop(timestamp) {
  const dt = Math.min(0.1, (timestamp - lastTimestamp) / 1000);
  lastTimestamp = timestamp;

  game.update(dt);
  renderer.render(game, dt);

  requestAnimationFrame(gameLoop);
}

// Initialize Everything
window.addEventListener('DOMContentLoaded', () => {
  handleResize();
  window.addEventListener('resize', handleResize);

  // Auto initialize ambient audio on first user touch/click anywhere
  const initAudioOnInteraction = () => {
    sound.initContext();
    window.removeEventListener('pointerdown', initAudioOnInteraction);
    window.removeEventListener('keydown', initAudioOnInteraction);
  };
  window.addEventListener('pointerdown', initAudioOnInteraction, { once: true });
  window.addEventListener('keydown', initAudioOnInteraction, { once: true });

  game.onStateChange(updateUI);
  setupCanvasInteractions();
  setupUIEvents();

  updateUI();
  requestAnimationFrame(gameLoop);
});
