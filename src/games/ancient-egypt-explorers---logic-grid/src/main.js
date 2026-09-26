import { LEVELS } from './game-data.js';

class EgyptSoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('egypt_logic_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('egypt_logic_muted', this.isMuted);
    return this.isMuted;
  }

  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playSelect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playClue() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  playUndo() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playHint() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.12, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.26);
    });
  }

  playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, t: 0 },
      { f: 659.25, t: 0.12 },
      { f: 783.99, t: 0.24 },
      { f: 1046.50, t: 0.38 },
      { f: 1318.51, t: 0.52 }
    ];
    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.16, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + n.t);
      osc.stop(now + n.t + 0.5);
    });
  }

  playError() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [320, 260].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.16);
    });
  }
}

const audio = new EgyptSoundEngine();

class EgyptZebraGame {
  constructor(container) {
    this.container = container;
    this.gameKey = 'ancient_egypt_logic';
    this.unlockedLevel = parseInt(localStorage.getItem('fl_unlocked_' + this.gameKey) || '0', 10);
    this.currentLevelIndex = 0;
    this.tableState = {}; // { colIndex: { archeologist: '', pyramid: '', relic: '' } }
    this.crossedClues = new Set();
    this.history = [];
    this.startTime = Date.now();
    this.movesCount = 0;

    this.render();
  }

  get level() {
    return LEVELS[this.currentLevelIndex];
  }

  loadLevel(index) {
    if (index > this.unlockedLevel) {
      audio.playError();
      this.showToast(`🔒 Complete Stage ${this.unlockedLevel + 1} first to unlock this case!`);
      return;
    }
    this.currentLevelIndex = index;
    this.tableState = {};
    for (let c = 0; c < this.level.size; c++) {
      this.tableState[c] = { archeologist: '', pyramid: '', relic: '' };
    }
    this.crossedClues.clear();
    this.history = [];
    this.startTime = Date.now();
    this.movesCount = 0;
    this.render();
  }

  saveHistory() {
    this.history.push(JSON.stringify(this.tableState));
    if (this.history.length > 30) this.history.shift();
  }

  undo() {
    if (this.history.length === 0) return;
    const prev = this.history.pop();
    this.tableState = JSON.parse(prev);
    audio.playUndo();
    this.renderTableOnly();
  }

  reset() {
    audio.playClick();
    this.tableState = {};
    for (let c = 0; c < this.level.size; c++) {
      this.tableState[c] = { archeologist: '', pyramid: '', relic: '' };
    }
    this.crossedClues.clear();
    this.history = [];
    this.movesCount = 0;
    this.render();
  }

  giveHint() {
    audio.playHint();
    const size = this.level.size;
    const sol = this.level.solution;
    const categories = ['archeologist', 'pyramid', 'relic'];

    // Find any unfilled or incorrect slot
    for (let c = 0; c < size; c++) {
      const correctCol = sol[c];
      for (const cat of categories) {
        if (this.tableState[c][cat] !== correctCol[cat]) {
          this.saveHistory();
          this.tableState[c][cat] = correctCol[cat];
          this.movesCount++;
          this.renderTableOnly();
          
          // Flash animation on the filled select
          const sel = document.querySelector(`select[data-col="${c}"][data-cat="${cat}"]`);
          if (sel) {
            sel.classList.add('hint-flash');
            setTimeout(() => sel.classList.remove('hint-flash'), 1200);
          }
          this.showToast(`Hint: Set ${this.getCategoryItemName(cat, correctCol[cat])} in Column ${c + 1}`);
          return;
        }
      }
    }

    this.showToast('All fields already match the solution!');
  }

  getCategoryItemName(cat, id) {
    if (!id) return '';
    if (cat === 'archeologist') {
      const itm = this.level.archeologists.find(x => x.id === id);
      return itm ? itm.name : id;
    }
    if (cat === 'pyramid') {
      const itm = this.level.pyramids.find(x => x.id === id);
      return itm ? itm.name : id;
    }
    if (cat === 'relic') {
      const itm = this.level.relics.find(x => x.id === id);
      return itm ? itm.name : id;
    }
    return id;
  }

  checkSolution() {
    const size = this.level.size;
    const sol = this.level.solution;
    const categories = ['archeologist', 'pyramid', 'relic'];

    // First check if all fields are selected
    let unfilled = 0;
    for (let c = 0; c < size; c++) {
      for (const cat of categories) {
        if (!this.tableState[c][cat]) unfilled++;
      }
    }

    if (unfilled > 0) {
      audio.playError();
      this.showToast(`Please fill all dropdowns (${unfilled} remaining)`);
      return;
    }

    // Check if each column matches a solution item set
    // A permutation match: each column in tableState must uniquely match one item in sol
    const matchedSolIndices = new Set();
    let isAllCorrect = true;

    for (let c = 0; c < size; c++) {
      const currentCol = this.tableState[c];
      const matchIdx = sol.findIndex((item, idx) => {
        if (matchedSolIndices.has(idx)) return false;
        return (
          item.archeologist === currentCol.archeologist &&
          item.pyramid === currentCol.pyramid &&
          item.relic === currentCol.relic
        );
      });

      if (matchIdx !== -1) {
        matchedSolIndices.add(matchIdx);
      } else {
        isAllCorrect = false;
      }
    }

    if (isAllCorrect) {
      if (this.currentLevelIndex + 1 > this.unlockedLevel) {
        this.unlockedLevel = Math.min(LEVELS.length - 1, this.currentLevelIndex + 1);
        localStorage.setItem('fl_unlocked_' + this.gameKey, this.unlockedLevel);
      }
      audio.playVictory();
      const elapsedSec = Math.round((Date.now() - this.startTime) / 1000);
      if (typeof window.triggerPlatformWin === 'function') {
        window.triggerPlatformWin(elapsedSec);
      }
      this.showVictoryModal(elapsedSec);
    } else {
      audio.playError();
      this.showToast('Some pairings do not match the clues. Keep investigating!');
    }
  }

  showToast(msg) {
    let toast = document.getElementById('game-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'game-toast';
      toast.className = 'game-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  showVictoryModal(elapsedSec) {
    const isLastLevel = this.currentLevelIndex >= LEVELS.length - 1;
    const modal = document.createElement('div');
    modal.className = 'victory-overlay';
    modal.innerHTML = `
      <div class="victory-card">
        <div class="victory-icon">🏺✨</div>
        <h2 class="victory-title">Expedition Solved!</h2>
        <p class="victory-sub">You deciphered the secret logic of <strong>${this.level.title}</strong>!</p>
        
        <div class="victory-stats">
          <div class="stat-box">
            <span class="stat-label">Time</span>
            <span class="stat-val">${Math.floor(elapsedSec / 60)}m ${elapsedSec % 60}s</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Moves</span>
            <span class="stat-val">${this.movesCount}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Difficulty</span>
            <span class="stat-val">${this.level.difficulty}</span>
          </div>
        </div>

        <div class="victory-actions">
          ${isLastLevel ? `
            <button id="btn-replay-all" class="btn-primary-action">🏆 Play from Level 1</button>
          ` : `
            <button id="btn-next-stage" class="btn-primary-action">Next Level →</button>
          `}
          <button id="btn-close-victory" class="btn-secondary-action">Review Grid</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const btnNext = modal.querySelector('#btn-next-stage');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        modal.remove();
        this.loadLevel(this.currentLevelIndex + 1);
      });
    }

    const btnReplay = modal.querySelector('#btn-replay-all');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        modal.remove();
        this.loadLevel(0);
      });
    }

    const btnClose = modal.querySelector('#btn-close-victory');
    if (btnClose) {
      btnClose.addEventListener('click', () => modal.remove());
    }
  }

  renderTableOnly() {
    const tableContainer = this.container.querySelector('#zebra-table-container');
    if (tableContainer) {
      tableContainer.innerHTML = this.buildTableHtml();
      this.bindTableEvents();
    }
  }

  buildTableHtml() {
    const lvl = this.level;
    const size = lvl.size;

    const categories = [
      { id: 'archeologist', label: 'Archaeologist', icon: '🤠', items: lvl.archeologists },
      { id: 'pyramid', label: 'Tomb / Pyramid', icon: '🏛️', items: lvl.pyramids },
      { id: 'relic', label: 'Sacred Relic', icon: '𓆣', items: lvl.relics }
    ];

    let html = `
      <div class="table-responsive-wrapper">
        <table class="zebra-grid-table">
          <thead>
            <tr>
              <th class="category-header-cell">Expedition</th>
    `;

    for (let c = 0; c < size; c++) {
      html += `<th class="column-header-cell">Site ${c + 1}</th>`;
    }

    html += `</tr></thead><tbody>`;

    categories.forEach(cat => {
      html += `
        <tr>
          <td class="category-label-cell">
            <span class="cat-icon">${cat.icon}</span>
            <span class="cat-name">${cat.label}</span>
          </td>
      `;

      for (let c = 0; c < size; c++) {
        const currentVal = this.tableState[c] ? this.tableState[c][cat.id] : '';
        html += `
          <td class="grid-select-cell">
            <select class="zebra-select ${currentVal ? 'selected' : ''}" data-col="${c}" data-cat="${cat.id}">
              <option value="">— Select —</option>
              ${cat.items.map(itm => `
                <option value="${itm.id}" ${currentVal === itm.id ? 'selected' : ''}>${itm.name}</option>
              `).join('')}
            </select>
          </td>
        `;
      }

      html += `</tr>`;
    });

    html += `</tbody></table></div>`;
    return html;
  }

  bindTableEvents() {
    const selects = this.container.querySelectorAll('.zebra-select');
    selects.forEach(sel => {
      sel.addEventListener('change', (e) => {
        const col = parseInt(e.target.getAttribute('data-col'), 10);
        const cat = e.target.getAttribute('data-cat');
        const val = e.target.value;

        this.saveHistory();
        if (!this.tableState[col]) {
          this.tableState[col] = { archeologist: '', pyramid: '', relic: '' };
        }
        this.tableState[col][cat] = val;
        this.movesCount++;

        if (val) {
          audio.playSelect();
          e.target.classList.add('selected');
        } else {
          audio.playClick();
          e.target.classList.remove('selected');
        }
      });
    });
  }

  render() {
    if (!this.tableState[0]) {
      for (let c = 0; c < this.level.size; c++) {
        this.tableState[c] = { archeologist: '', pyramid: '', relic: '' };
      }
    }

    const isMuted = audio.isMuted;

    this.container.innerHTML = `
      <div class="zebra-app-root">
        <!-- TOP HEADER -->
        <header class="zebra-header">
          <div class="header-top-row">
            <div class="header-left">
              <button id="btn-back" class="btn-icon-text" title="Go back">
                <span class="btn-icon">←</span>
                <span class="btn-text">Back</span>
              </button>
              <div class="header-title-box">
                <h1 class="header-title">Ancient Egypt Explorers</h1>
                <span class="header-badge">Einstein Logic Grid</span>
              </div>
            </div>

            <div class="header-right">
              <button id="btn-sound-toggle" class="btn-icon-only" title="Toggle Sound">
                ${isMuted ? '🔇' : '🔔'}
              </button>
            </div>
          </div>

          <div class="stage-nav-pills">
            ${LEVELS.map((lvl, idx) => {
              const isLocked = idx > this.unlockedLevel;
              const isActive = idx === this.currentLevelIndex;
              return `
                <button class="stage-pill ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}" data-stage="${idx}" title="${isLocked ? 'Locked stage' : `Stage ${idx + 1}`}">
                  ${isLocked ? '🔒 ' : ''}Stage ${idx + 1}
                </button>
              `;
            }).join('')}
          </div>
        </header>

        <!-- MAIN SCROLLABLE CONTENT -->
        <main class="zebra-main-content">
          <!-- STORY / GOAL CARD -->
          <div class="level-intro-card">
            <div class="intro-badge">${this.level.title} • ${this.level.difficulty}</div>
            <p class="intro-desc">${this.level.description}</p>
          </div>

          <!-- THE LOGIC GRID TABLE -->
          <div class="table-card-wrapper">
            <div class="table-scroll-hint">↔ Swipe horizontally to view all expedition sites</div>
            <div id="zebra-table-container">
              ${this.buildTableHtml()}
            </div>
          </div>

          <!-- DEDUCTION CLUES -->
          <section class="clues-card-section">
            <div class="clues-header">
              <div class="clues-title">
                <span class="clues-icon">📜</span>
                <h2>Expedition Clues & Notes</h2>
              </div>
              <span class="clues-hint-note">Click any clue to cross it out</span>
            </div>

            <div class="clues-two-col-grid">
              ${this.level.clues.map((clue, idx) => {
                const isCrossed = this.crossedClues.has(idx);
                return `
                  <div class="clue-card ${isCrossed ? 'crossed' : ''}" data-clue-idx="${idx}">
                    <span class="clue-num">${idx + 1}</span>
                    <p class="clue-text">${clue.text}</p>
                    ${clue.hieroglyph ? `<span class="clue-hieroglyph">${clue.hieroglyph}</span>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        </main>

        <!-- BOTTOM CONTROLS TOOLBAR -->
        <footer class="zebra-footer-toolbar">
          <div class="toolbar-left">
            <button id="btn-undo" class="tool-btn" title="Undo last change">
              <span class="tool-icon">↶</span>
              <span>Undo</span>
            </button>
            <button id="btn-reset" class="tool-btn" title="Reset table">
              <span class="tool-icon">🔄</span>
              <span>Reset</span>
            </button>
            <button id="btn-hint" class="tool-btn highlight" title="Get a hint">
              <span class="tool-icon">💡</span>
              <span>Hint</span>
            </button>
          </div>

          <button id="btn-check-solution" class="btn-solve-action">
            <span class="solve-icon">🔍</span>
            <span>Check Solution</span>
          </button>
        </footer>
      </div>
    `;

    this.bindEvents();
    this.bindTableEvents();
  }

  bindEvents() {
    // Stage navigation
    this.container.querySelectorAll('.stage-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-stage'), 10);
        audio.playClick();
        this.loadLevel(idx);
      });
    });

    // Back button
    const btnBack = this.container.querySelector('#btn-back');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        audio.playClick();
        if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '../../index.html';
        }
      });
    }

    // Sound toggle
    const btnSound = this.container.querySelector('#btn-sound-toggle');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const isMuted = audio.toggleMute();
        btnSound.textContent = isMuted ? '🔇' : '🔔';
        if (!isMuted) audio.playClick();
      });
    }

    // Clue crossing
    this.container.querySelectorAll('.clue-card').forEach(card => {
      card.addEventListener('click', () => {
        audio.playClue();
        const idx = parseInt(card.getAttribute('data-clue-idx'), 10);
        if (this.crossedClues.has(idx)) {
          this.crossedClues.delete(idx);
          card.classList.remove('crossed');
        } else {
          this.crossedClues.add(idx);
          card.classList.add('crossed');
        }
      });
    });

    // Action buttons
    const btnUndo = this.container.querySelector('#btn-undo');
    if (btnUndo) btnUndo.addEventListener('click', () => this.undo());

    const btnReset = this.container.querySelector('#btn-reset');
    if (btnReset) btnReset.addEventListener('click', () => this.reset());

    const btnHint = this.container.querySelector('#btn-hint');
    if (btnHint) btnHint.addEventListener('click', () => this.giveHint());

    const btnCheck = this.container.querySelector('#btn-check-solution');
    if (btnCheck) btnCheck.addEventListener('click', () => this.checkSolution());
  }
}

// Bootstrap
const appContainer = document.getElementById('app') || document.body;
if (appContainer) {
  new EgyptZebraGame(appContainer);
}
