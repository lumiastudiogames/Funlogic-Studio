
// ==========================================================================
// UNIFIED EINSTEIN / ZEBRA LOGIC GRID ENGINE WITH PROGRESSIVE LOCKING
// ==========================================================================

const THEMES = {
  "01-murder-orient-express": {
    "primary": "#991b1b",
    "primaryDark": "#7f1d1d",
    "accent": "#d97706",
    "accentLight": "#fef3c7",
    "bgPage": "#fdfbf7",
    "badge": "1930s Train Mystery",
    "icon": "🚂",
    "columnIcon": "🚪"
  },
  "02-baker-street-hound": {
    "primary": "#1e293b",
    "primaryDark": "#0f172a",
    "accent": "#059669",
    "accentLight": "#d1fae5",
    "bgPage": "#f8fafc",
    "badge": "Sherlockian Deduction",
    "icon": "🔍",
    "columnIcon": "📍"
  },
  "03-cyberpunk-neon-syndicate": {
    "primary": "#0891b2",
    "primaryDark": "#0e7490",
    "accent": "#c026d3",
    "accentLight": "#fae8ff",
    "bgPage": "#f8fafc",
    "badge": "Cyberpunk Netrunner",
    "icon": "⚡",
    "columnIcon": "🏢"
  },
  "04-death-on-the-nile": {
    "primary": "#1e3a8a",
    "primaryDark": "#172554",
    "accent": "#d97706",
    "accentLight": "#fef3c7",
    "bgPage": "#fefce8",
    "badge": "Agatha Riverboat Mystery",
    "icon": "🚢",
    "columnIcon": "🛳️"
  },
  "05-deep-space-chimera": {
    "primary": "#0f172a",
    "primaryDark": "#020617",
    "accent": "#10b981",
    "accentLight": "#d1fae5",
    "bgPage": "#f1f5f9",
    "badge": "Deep Space Protocol",
    "icon": "🚀",
    "columnIcon": "🛸"
  },
  "06-blackwood-manor": {
    "primary": "#7f1d1d",
    "primaryDark": "#450a0a",
    "accent": "#b45309",
    "accentLight": "#fef3c7",
    "bgPage": "#faf5f0",
    "badge": "Victorian Manor Mystery",
    "icon": "🏰",
    "columnIcon": "🗝️"
  },
  "07-time-paradox-chronos": {
    "primary": "#4338ca",
    "primaryDark": "#312e81",
    "accent": "#0284c7",
    "accentLight": "#e0f2fe",
    "bgPage": "#f8faff",
    "badge": "Temporal Paradox Case",
    "icon": "⏳",
    "columnIcon": "🌀"
  },
  "08-noir-shadows-chicago": {
    "primary": "#292524",
    "primaryDark": "#1c1917",
    "accent": "#b45309",
    "accentLight": "#fef3c7",
    "bgPage": "#fbf9f4",
    "badge": "Chicago 1932 Noir",
    "icon": "🕵️",
    "columnIcon": "🍸"
  },
  "09-station-alpha-sabotage": {
    "primary": "#1e293b",
    "primaryDark": "#0f172a",
    "accent": "#d97706",
    "accentLight": "#fef3c7",
    "bgPage": "#f8fafc",
    "badge": "Orbital Station Sabotage",
    "icon": "🛰️",
    "columnIcon": "📡"
  },
  "10-curse-blackwood-abbey": {
    "primary": "#581c87",
    "primaryDark": "#3b0764",
    "accent": "#ca8a04",
    "accentLight": "#fef9c3",
    "bgPage": "#faf5ff",
    "badge": "Gothic Abbey Mystery",
    "icon": "⛪",
    "columnIcon": "🕯️"
  },
  "11-nexus-protocol-rogue-ai": {
    "primary": "#0369a1",
    "primaryDark": "#075985",
    "accent": "#15803d",
    "accentLight": "#dcfce7",
    "bgPage": "#f0fdfa",
    "badge": "AI Core Forensics",
    "icon": "🤖",
    "columnIcon": "🖥️"
  },
  "12-venice-carnival-conspiracy": {
    "primary": "#0f766e",
    "primaryDark": "#115e59",
    "accent": "#eab308",
    "accentLight": "#fef9c3",
    "bgPage": "#f0fdfa",
    "badge": "Venetian Masquerade",
    "icon": "🎭",
    "columnIcon": "🛶"
  },
  "13-sub-zero-outpost-31": {
    "primary": "#0369a1",
    "primaryDark": "#075985",
    "accent": "#0284c7",
    "accentLight": "#e0f2fe",
    "bgPage": "#f0f9ff",
    "badge": "Antarctic Enigma",
    "icon": "❄️",
    "columnIcon": "🧊"
  },
  "14-arsenic-tea-morrington": {
    "primary": "#78350f",
    "primaryDark": "#451a03",
    "accent": "#15803d",
    "accentLight": "#dcfce7",
    "bgPage": "#fdfbf7",
    "badge": "Poisoner's Tea Party",
    "icon": "🫖",
    "columnIcon": "☕"
  },
  "15-mars-colony-breach": {
    "primary": "#9a3412",
    "primaryDark": "#7c2d12",
    "accent": "#ea580c",
    "accentLight": "#ffedd5",
    "bgPage": "#fff7ed",
    "badge": "Mars Colony Breach",
    "icon": "🔴",
    "columnIcon": "🪐"
  },
  "16-phantom-opera-vaults": {
    "primary": "#881337",
    "primaryDark": "#4c0519",
    "accent": "#ca8a04",
    "accentLight": "#fef9c3",
    "bgPage": "#fff1f2",
    "badge": "Paris Opera Mystery",
    "icon": "🎭",
    "columnIcon": "🎟️"
  },
  "17-quantum-lab-theft": {
    "primary": "#6b21a8",
    "primaryDark": "#581c87",
    "accent": "#0284c7",
    "accentLight": "#e0f2fe",
    "bgPage": "#faf5ff",
    "badge": "Quantum Formula Theft",
    "icon": "⚛️",
    "columnIcon": "🔬"
  },
  "18-fog-over-whitechapel": {
    "primary": "#262626",
    "primaryDark": "#171717",
    "accent": "#b45309",
    "accentLight": "#fef3c7",
    "bgPage": "#fafaf9",
    "badge": "Whitechapel 1888 Case",
    "icon": "🌫️",
    "columnIcon": "🏮"
  },
  "19-cyber-dystopia-memories": {
    "primary": "#581c87",
    "primaryDark": "#3b0764",
    "accent": "#2563eb",
    "accentLight": "#dbeafe",
    "bgPage": "#faf5ff",
    "badge": "Memory Theft Case",
    "icon": "💾",
    "columnIcon": "🔌"
  },
  "20-lighthouse-enigma": {
    "primary": "#334155",
    "primaryDark": "#1e293b",
    "accent": "#d97706",
    "accentLight": "#fef3c7",
    "bgPage": "#f8fafc",
    "badge": "Flannan Isle Mystery",
    "icon": "🏮",
    "columnIcon": "🌊"
  }
};
window.LOGIC_GRID_THEMES = THEMES;


class ZebraAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('fl_zebra_muted') === 'true';
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
    localStorage.setItem('fl_zebra_muted', this.isMuted);
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

class LogicGridEngine {
  constructor(config) {
    this.config = config || {};
    this.rawLevel = config.level || window.CURRENT_LEVEL || {};
    this.gameKey = config.gameKey || 'logic_case';
    this.onBack = config.onBack || null;
    this.sound = new ZebraAudioEngine();

    // Progression: level unlock state from localStorage
    this.unlockedLevel = parseInt(localStorage.getItem('fl_unlocked_' + this.gameKey) || '0', 10);
    this.currentLevelIndex = 0;

    // Detect theme metadata
    this.theme = this.detectTheme();

    // Build the stages (Stage 1: 3x3 Warmup, Stage 2: 4x4 Standard Case, Stage 3: 4x4 Master Challenge)
    this.stages = this.buildStages();

    this.tableState = {};
    this.crossedClues = new Set();
    this.history = [];
    this.startTime = Date.now();
    this.movesCount = 0;

    this.initDOM();
    this.initLevel(this.currentLevelIndex);
  }

  detectTheme() {
    const raw = this.rawLevel;
    const folder = (window.location.pathname.match(/\/games\/([^/]+)/) || [])[1] || '';
    const themeKey = Object.keys(window.LOGIC_GRID_THEMES || {}).find(k => folder.includes(k) || this.gameKey.includes(k.replace(/^[0-9]+-/, ''))) || '';
    const t = (window.LOGIC_GRID_THEMES && window.LOGIC_GRID_THEMES[themeKey]) || {
      primary: '#1e3a8a',
      primaryDark: '#172554',
      accent: '#d97706',
      accentLight: '#fef3c7',
      bgPage: '#fbf9f4',
      badge: 'Logic Grid Mystery',
      icon: '🔍',
      columnIcon: '📍'
    };
    return t;
  }

  buildStages() {
    const raw = this.rawLevel;
    const catA = raw.categories ? raw.categories.categoryA : { name: 'Suspects', items: [] };
    const catB = raw.categories ? raw.categories.categoryB : { name: 'Locations', items: [] };
    const catC = raw.categories ? raw.categories.categoryC : { name: 'Evidence', items: [] };
    const sol = raw.solution || {};
    const clues = (raw.clues || []).map(c => typeof c === 'string' ? c : c.text);

    // Stage 1: 3x3 Focused Case
    const s1Cols = catB.items.slice(0, 3);
    const s1Sol = {};
    s1Cols.forEach(col => {
      Object.entries(sol).forEach(([aId, map]) => {
        if (map.categoryB === col.id) {
          s1Sol[col.id] = { categoryA: aId, categoryC: map.categoryC };
        }
      });
    });
    const s1CatAIds = new Set(Object.values(s1Sol).map(v => v.categoryA));
    const s1CatCIds = new Set(Object.values(s1Sol).map(v => v.categoryC));

    const s1ItemsA = catA.items.filter(i => s1CatAIds.has(i.id));
    const s1ItemsC = catC.items.filter(i => s1CatCIds.has(i.id));

    // Filter or create clear clues for Stage 1
    const s1Clues = [];
    clues.forEach(clueText => {
      // Check if clue mentions any of the 4th item names
      const fourthA = catA.items[3] ? catA.items[3].name : '';
      const fourthB = catB.items[3] ? catB.items[3].name : '';
      const fourthC = catC.items[3] ? catC.items[3].name : '';
      const mentionsExcluded = (fourthA && clueText.includes(fourthA)) ||
                               (fourthB && clueText.includes(fourthB)) ||
                               (fourthC && clueText.includes(fourthC));
      if (!mentionsExcluded && s1Clues.length < 5) {
        s1Clues.push(clueText);
      }
    });

    // Ensure Stage 1 has at least 3 solvable clues
    if (s1Clues.length < 3) {
      s1Cols.forEach((col, idx) => {
        const itemSol = s1Sol[col.id];
        if (itemSol) {
          const aObj = s1ItemsA.find(x => x.id === itemSol.categoryA);
          const cObj = s1ItemsC.find(x => x.id === itemSol.categoryC);
          if (aObj && cObj && s1Clues.length < 4) {
            s1Clues.push(`At ${col.name}, ${aObj.name} was linked with the ${cObj.name}.`);
          }
        }
      });
    }

    // Stage 2: Canonical 4x4 Case
    const s2Cols = catB.items.slice(0, 4);
    const s2Sol = {};
    s2Cols.forEach(col => {
      Object.entries(sol).forEach(([aId, map]) => {
        if (map.categoryB === col.id) {
          s2Sol[col.id] = { categoryA: aId, categoryC: map.categoryC };
        }
      });
    });

    // Stage 3: Master Challenge (4x4)
    const s3Clues = [
      ...clues,
      `Examine every elimination carefully: no two ${catB.name.toLowerCase()} share the same ${catA.name.toLowerCase()}.`
    ];

    return [
      {
        id: 1,
        title: `Stage 1: Preliminary Inquiry`,
        difficulty: 'Easy (3x3)',
        description: `Start your investigation by matching 3 ${catB.name.toLowerCase()} with the confirmed suspects and evidence.`,
        columnCategory: catB.name,
        columns: s1Cols,
        categoryA: { name: catA.name, icon: '👤', items: s1ItemsA },
        categoryC: { name: catC.name, icon: '🔍', items: s1ItemsC },
        solution: s1Sol,
        clues: s1Clues
      },
      {
        id: 2,
        title: raw.title || 'Stage 2: Full Investigation',
        difficulty: 'Standard (4x4)',
        description: raw.synopsis || raw.description || `Deduce all 4 ${catB.name.toLowerCase()} cross-referencing all clues.`,
        columnCategory: catB.name,
        columns: s2Cols,
        categoryA: { name: catA.name, icon: '👤', items: catA.items },
        categoryC: { name: catC.name, icon: '🔍', items: catC.items },
        solution: s2Sol,
        clues: clues
      },
      {
        id: 3,
        title: `Stage 3: Master Dossier`,
        difficulty: 'Master (4x4)',
        description: `The final deductive conclusion to completely close the dossier and unlock master status.`,
        columnCategory: catB.name,
        columns: s2Cols,
        categoryA: { name: catA.name, icon: '👤', items: catA.items },
        categoryC: { name: catC.name, icon: '🔍', items: catC.items },
        solution: s2Sol,
        clues: s3Clues
      }
    ];
  }

  get stage() {
    return this.stages[this.currentLevelIndex];
  }

  initLevel(index) {
    if (index > this.unlockedLevel) {
      this.sound.playError();
      this.showToast(`🔒 Complete Stage ${this.unlockedLevel + 1} first to unlock this case!`);
      return;
    }
    this.currentLevelIndex = index;
    this.tableState = {};
    this.stage.columns.forEach((col, cIdx) => {
      this.tableState[cIdx] = { categoryA: '', categoryC: '' };
    });
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
    this.sound.playUndo();
    this.renderTableOnly();
  }

  reset() {
    this.sound.playClick();
    this.stage.columns.forEach((col, cIdx) => {
      this.tableState[cIdx] = { categoryA: '', categoryC: '' };
    });
    this.crossedClues.clear();
    this.history = [];
    this.movesCount = 0;
    this.render();
  }

  giveHint() {
    this.sound.playHint();
    const stg = this.stage;
    for (let cIdx = 0; cIdx < stg.columns.length; cIdx++) {
      const col = stg.columns[cIdx];
      const correct = stg.solution[col.id];
      if (!correct) continue;

      if (this.tableState[cIdx].categoryA !== correct.categoryA) {
        this.saveHistory();
        this.tableState[cIdx].categoryA = correct.categoryA;
        this.movesCount++;
        this.renderTableOnly();
        const sel = document.querySelector(`select[data-col="${cIdx}"][data-cat="categoryA"]`);
        if (sel) {
          sel.classList.add('hint-flash');
          setTimeout(() => sel.classList.remove('hint-flash'), 1200);
        }
        const itm = stg.categoryA.items.find(x => x.id === correct.categoryA);
        this.showToast(`Hint: Set ${itm ? itm.name : ''} in ${col.name}`);
        return;
      }

      if (this.tableState[cIdx].categoryC !== correct.categoryC) {
        this.saveHistory();
        this.tableState[cIdx].categoryC = correct.categoryC;
        this.movesCount++;
        this.renderTableOnly();
        const sel = document.querySelector(`select[data-col="${cIdx}"][data-cat="categoryC"]`);
        if (sel) {
          sel.classList.add('hint-flash');
          setTimeout(() => sel.classList.remove('hint-flash'), 1200);
        }
        const itm = stg.categoryC.items.find(x => x.id === correct.categoryC);
        this.showToast(`Hint: Set ${itm ? itm.name : ''} in ${col.name}`);
        return;
      }
    }

    this.showToast('All fields already match the solution!');
  }

  checkSolution() {
    const stg = this.stage;
    let unfilled = 0;

    for (let cIdx = 0; cIdx < stg.columns.length; cIdx++) {
      if (!this.tableState[cIdx].categoryA) unfilled++;
      if (!this.tableState[cIdx].categoryC) unfilled++;
    }

    if (unfilled > 0) {
      this.sound.playError();
      this.showToast(`Please fill all dropdowns (${unfilled} remaining)`);
      return;
    }

    let isAllCorrect = true;
    for (let cIdx = 0; cIdx < stg.columns.length; cIdx++) {
      const col = stg.columns[cIdx];
      const correct = stg.solution[col.id];
      if (!correct ||
          this.tableState[cIdx].categoryA !== correct.categoryA ||
          this.tableState[cIdx].categoryC !== correct.categoryC) {
        isAllCorrect = false;
        break;
      }
    }

    if (isAllCorrect) {
      if (this.currentLevelIndex + 1 > this.unlockedLevel) {
        this.unlockedLevel = Math.min(this.stages.length - 1, this.currentLevelIndex + 1);
        localStorage.setItem('fl_unlocked_' + this.gameKey, this.unlockedLevel);
      }
      this.sound.playVictory();
      const elapsedSec = Math.round((Date.now() - this.startTime) / 1000);
      if (typeof window.triggerPlatformWin === 'function') {
        window.triggerPlatformWin(elapsedSec);
      }
      this.showVictoryModal(elapsedSec);
    } else {
      this.sound.playError();
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
    this.toastTimeout = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  showVictoryModal(elapsedSec) {
    const isLast = this.currentLevelIndex >= this.stages.length - 1;
    const modal = document.createElement('div');
    modal.className = 'victory-overlay';
    modal.innerHTML = `
      <div class="victory-card">
        <div class="victory-icon">${this.theme.icon}✨</div>
        <h2 class="victory-title">Case Solved!</h2>
        <p class="victory-sub">You deciphered <strong>${this.stage.title}</strong>!</p>
        
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
            <span class="stat-val">${this.stage.difficulty}</span>
          </div>
        </div>

        <div class="victory-actions">
          ${isLast ? `
            <button id="btn-replay-all" class="btn-primary-action">🏆 Play from Stage 1</button>
          ` : `
            <button id="btn-next-stage" class="btn-primary-action">Next Case →</button>
          `}
          <button id="btn-close-victory" class="btn-secondary-action">Review Solution</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const btnNext = modal.querySelector('#btn-next-stage');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        modal.remove();
        this.initLevel(this.currentLevelIndex + 1);
      });
    }

    const btnReplay = modal.querySelector('#btn-replay-all');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        modal.remove();
        this.initLevel(0);
      });
    }

    const btnClose = modal.querySelector('#btn-close-victory');
    if (btnClose) {
      btnClose.addEventListener('click', () => modal.remove());
    }
  }

  renderTableOnly() {
    const container = this.root.querySelector('#zebra-table-container');
    if (container) {
      container.innerHTML = this.buildTableHtml();
      this.bindTableEvents();
    }
  }

  buildTableHtml() {
    const stg = this.stage;
    let html = `
      <div class="table-responsive-wrapper">
        <table class="zebra-grid-table">
          <thead>
            <tr>
              <th class="category-header-cell">${stg.columnCategory}</th>
    `;

    for (let c = 0; c < stg.columns.length; c++) {
      html += `<th class="column-header-cell">${stg.columns[c].name}</th>`;
    }

    html += `</tr></thead><tbody>`;

    const categories = [
      { id: 'categoryA', name: stg.categoryA.name, icon: stg.categoryA.icon || '👤', items: stg.categoryA.items },
      { id: 'categoryC', name: stg.categoryC.name, icon: stg.categoryC.icon || '🔍', items: stg.categoryC.items }
    ];

    categories.forEach(cat => {
      html += `
        <tr>
          <td class="category-label-cell">
            <span class="cat-icon">${cat.icon}</span>
            <span class="cat-name">${cat.name}</span>
          </td>
      `;

      for (let c = 0; c < stg.columns.length; c++) {
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
    const selects = this.root.querySelectorAll('.zebra-select');
    selects.forEach(sel => {
      sel.addEventListener('change', (e) => {
        const col = parseInt(e.target.getAttribute('data-col'), 10);
        const cat = e.target.getAttribute('data-cat');
        const val = e.target.value;

        this.saveHistory();
        if (!this.tableState[col]) this.tableState[col] = { categoryA: '', categoryC: '' };
        this.tableState[col][cat] = val;
        this.movesCount++;

        if (val) {
          this.sound.playSelect();
          e.target.classList.add('selected');
        } else {
          this.sound.playClick();
          e.target.classList.remove('selected');
        }
      });
    });
  }

  initDOM() {
    this.root = document.getElementById('app-root') || document.getElementById('app');
    if (!this.root) {
      this.root = document.createElement('div');
      this.root.id = 'app-root';
      document.body.appendChild(this.root);
    }

    this.injectStyles();
  }

  injectStyles() {
    if (document.getElementById('zebra-engine-styles')) return;

    const t = this.theme;
    const style = document.createElement('style');
    style.id = 'zebra-engine-styles';
    style.textContent = `
      :root {
        --bg-page: ${t.bgPage || '#fbf9f4'};
        --bg-card: #ffffff;
        --bg-card-alt: #f4f0e6;
        --border-subtle: #e2dcd0;
        --border-strong: #c8bfb0;
        --text-main: #2d261e;
        --text-muted: #73695d;
        --accent-theme: ${t.primary || '#991b1b'};
        --accent-theme-dark: ${t.primaryDark || '#7f1d1d'};
        --accent-gold: ${t.accent || '#d97706'};
        --accent-gold-light: ${t.accentLight || '#fef3c7'};
        --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        --radius-sm: 6px;
        --radius-md: 10px;
      }

      * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

      html, body {
        width: 100%;
        max-width: 100vw;
        height: 100%;
        height: 100dvh;
        overflow: hidden;
        background-color: var(--bg-page);
        color: var(--text-main);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      #app-root, #app {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .zebra-app-root {
        width: 100%;
        max-width: 100vw;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: var(--bg-page);
        position: relative;
        overflow: hidden;
      }

      .zebra-header {
        flex: 0 0 auto;
        padding: 6px 8px;
        display: flex;
        flex-direction: column;
        background: #ffffff;
        border-bottom: 1px solid var(--border-subtle);
        box-shadow: var(--shadow-sm);
        z-index: 30;
        gap: 5px;
        width: 100%;
        box-sizing: border-box;
      }

      .header-top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        gap: 6px;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        flex: 1 1 auto;
      }

      .btn-icon-text {
        display: flex;
        align-items: center;
        gap: 3px;
        padding: 4px 7px;
        height: 30px;
        background: #f1ede4;
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        color: var(--text-main);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        flex-shrink: 0;
        transition: all 0.15s ease;
      }
      .btn-icon-text:hover { background: #e6e0d3; }
      .btn-icon-text:active { transform: scale(0.96); }

      .header-title-box {
        display: flex;
        flex-direction: column;
        min-width: 0;
        overflow: hidden;
      }

      .header-title {
        font-size: 13px;
        font-weight: 800;
        color: var(--text-main);
        letter-spacing: -0.2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
      }

      .header-badge {
        font-size: 9px;
        font-weight: 700;
        color: var(--accent-theme);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        line-height: 1;
      }

      .stage-nav-pills {
        display: flex;
        align-items: center;
        gap: 5px;
        overflow-x: auto;
        padding: 1px 0 3px 0;
        width: 100%;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }
      .stage-nav-pills::-webkit-scrollbar { display: none; }

      .stage-pill {
        padding: 3px 9px;
        border-radius: 999px;
        font-size: 10.5px;
        font-weight: 700;
        border: 1px solid var(--border-subtle);
        background: #f8f6f0;
        color: var(--text-muted);
        cursor: pointer;
        white-space: nowrap;
        flex-shrink: 0;
        transition: all 0.15s ease;
      }
      .stage-pill:hover { background: #ede7d9; color: var(--text-main); }
      .stage-pill.active {
        background: var(--accent-theme);
        border-color: var(--accent-theme-dark);
        color: #ffffff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      .stage-pill.locked {
        opacity: 0.6;
        background: #f1ede4;
        color: var(--text-muted);
        border-style: dashed;
        cursor: pointer;
      }
      .stage-pill.locked:hover { background: #e7e2d6; }

      .header-right {
        display: flex;
        align-items: center;
        gap: 5px;
        flex-shrink: 0;
      }

      .btn-icon-only {
        width: 30px;
        height: 30px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-subtle);
        background: #f8f6f0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .btn-icon-only:hover { background: #ede7d9; }

      .zebra-main-content {
        flex: 1 1 auto;
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior-y: contain;
        -webkit-overflow-scrolling: touch;
        padding: 6px 8px 65px 8px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 1000px;
        margin: 0 auto;
        width: 100%;
        box-sizing: border-box;
      }
      .zebra-main-content > * {
        flex-shrink: 0;
      }

      .level-intro-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-left: 3px solid var(--accent-theme);
        border-radius: var(--radius-sm);
        padding: 6px 8px;
        box-shadow: var(--shadow-sm);
      }
      .intro-badge { font-size: 10.5px; font-weight: 800; color: var(--accent-theme-dark); margin-bottom: 2px; }
      .intro-desc { font-size: 10.5px; color: var(--text-muted); line-height: 1.3; }

      .table-card-wrapper {
        background: #ffffff;
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-md);
        padding: 4px;
        overflow: visible;
        position: relative;
        width: 100%;
        box-sizing: border-box;
      }

      .table-scroll-hint {
        font-size: 10px;
        font-weight: 700;
        color: var(--accent-theme-dark);
        text-align: center;
        padding: 3px 6px;
        background: var(--accent-gold-light);
        border-radius: var(--radius-sm);
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }

      .table-responsive-wrapper {
        width: 100%;
        overflow-x: auto;
        overflow-y: visible;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 2px;
      }

      .zebra-grid-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 3px;
      }

      .category-header-cell {
        position: sticky;
        left: 0;
        z-index: 20;
        background: #ffffff;
        padding: 5px 6px;
        font-size: 10.5px;
        font-weight: 800;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        text-align: left;
        width: 115px;
        min-width: 115px;
        max-width: 115px;
        box-shadow: 2px 0 6px -2px rgba(0, 0, 0, 0.12);
        box-sizing: border-box;
      }

      .category-label-cell {
        position: sticky;
        left: 0;
        z-index: 15;
        background: var(--bg-card-alt);
        padding: 5px 6px;
        font-size: 11px;
        font-weight: 700;
        line-height: 1.25;
        color: var(--text-main);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        gap: 5px;
        width: 115px;
        min-width: 115px;
        max-width: 115px;
        box-shadow: 2px 0 6px -2px rgba(0, 0, 0, 0.12);
        box-sizing: border-box;
      }

      .column-header-cell {
        padding: 5px 6px;
        font-size: 11.5px;
        font-weight: 800;
        color: var(--accent-theme-dark);
        background: var(--accent-gold-light);
        border: 1px solid #fde68a;
        border-radius: var(--radius-sm);
        text-align: center;
        min-width: 125px;
        width: 125px;
        box-sizing: border-box;
      }

      .cat-icon { font-size: 13px; flex-shrink: 0; }
      .cat-name { white-space: normal; line-height: 1.15; word-break: break-word; }

      .grid-select-cell { text-align: center; min-width: 125px; width: 125px; box-sizing: border-box; }

      .zebra-select {
        width: 100%;
        height: 35px;
        min-height: 35px;
        padding: 3px 4px;
        font-size: 11px;
        font-weight: 600;
        color: var(--text-main);
        background-color: #ffffff;
        border: 1.5px solid var(--border-strong);
        border-radius: var(--radius-sm);
        outline: none;
        cursor: pointer;
        transition: all 0.15s ease;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.04);
      }
      .zebra-select:focus { border-color: var(--accent-theme); box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15); }
      .zebra-select.selected {
        background-color: #fefce8;
        border-color: #eab308;
        font-weight: 700;
        color: #854d0e;
      }
      .zebra-select.hint-flash { animation: hintPulse 1s ease; }

      @keyframes hintPulse {
        0%, 100% { background-color: #ffffff; }
        50% { background-color: #bbf7d0; border-color: #16a34a; transform: scale(1.03); }
      }

      .clues-card-section {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        padding: 8px 10px;
        box-shadow: var(--shadow-sm);
      }
      .clues-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6px;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--border-subtle);
      }
      .clues-title { display: flex; align-items: center; gap: 4px; }
      .clues-icon { font-size: 14px; }
      .clues-title h2 { font-size: 12.5px; font-weight: 800; color: var(--text-main); }
      .clues-hint-note { font-size: 9.5px; font-weight: 600; color: var(--text-muted); }

      .clues-two-col-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 5px;
      }
      @media (min-width: 680px) {
        .clues-two-col-grid { grid-template-columns: 1fr 1fr; }
      }

      .clue-card {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        padding: 6px 8px;
        background: #fdfcf9;
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .clue-card:hover { background: #f7f3ea; border-color: var(--border-strong); }
      .clue-num {
        flex: 0 0 auto;
        width: 17px;
        height: 17px;
        border-radius: 50%;
        background: #ede7d9;
        color: var(--text-muted);
        font-size: 9.5px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 1px;
      }
      .clue-text { flex: 1 1 auto; font-size: 11px; color: var(--text-main); line-height: 1.35; margin: 0; }
      .clue-card.crossed { background: #f1ede4; opacity: 0.55; }
      .clue-card.crossed .clue-text { text-decoration: line-through; color: var(--text-muted); }
      .clue-card.crossed .clue-num { background: #cbd5e1; color: #64748b; }

      .zebra-footer-toolbar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 48px;
        background: #ffffff;
        border-top: 1px solid var(--border-subtle);
        box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.06);
        padding: 0 6px;
        padding-bottom: max(2px, env(safe-area-inset-bottom));
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 40;
        gap: 4px;
        box-sizing: border-box;
      }
      .toolbar-left { display: flex; align-items: center; gap: 4px; flex: 1 1 auto; }
      .tool-btn {
        height: 34px;
        padding: 0 6px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-subtle);
        background: #f8f6f0;
        color: var(--text-main);
        font-size: 11px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 2px;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.15s ease;
      }
      .tool-btn:hover { background: #ede7d9; }
      .tool-btn:active { transform: scale(0.96); }
      .tool-btn.highlight {
        background: var(--accent-gold-light);
        border-color: #fde68a;
        color: var(--accent-theme-dark);
      }

      .btn-solve-action {
        height: 34px;
        padding: 0 10px;
        border-radius: var(--radius-sm);
        border: none;
        background: linear-gradient(135deg, var(--accent-theme), var(--accent-theme-dark));
        color: #ffffff;
        font-size: 11.5px;
        font-weight: 800;
        display: flex;
        align-items: center;
        gap: 3px;
        cursor: pointer;
        white-space: nowrap;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.25);
        transition: all 0.15s ease;
        flex-shrink: 0;
      }
      .btn-solve-action:active { transform: scale(0.96); }

      .game-toast {
        position: fixed;
        top: 60px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: rgba(30, 25, 20, 0.95);
        color: #ffffff;
        padding: 8px 14px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        box-shadow: var(--shadow-lg);
        pointer-events: none;
        opacity: 0;
        transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 99999;
        text-align: center;
        max-width: 90vw;
      }
      .game-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }

      .victory-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 14px;
        animation: fadeIn 0.25s ease;
      }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

      .victory-card {
        background: #ffffff;
        border-radius: var(--radius-md);
        padding: 20px;
        max-width: 380px;
        width: 100%;
        text-align: center;
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.25);
        animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      @keyframes scaleUp { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      .victory-icon { font-size: 34px; margin-bottom: 4px; }
      .victory-title { font-size: 18px; font-weight: 900; color: var(--accent-theme-dark); margin-bottom: 4px; }
      .victory-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 14px; }
      .victory-stats { display: flex; gap: 6px; margin-bottom: 16px; }
      .stat-box {
        flex: 1;
        background: #f8f6f0;
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        padding: 6px 2px;
        display: flex;
        flex-direction: column;
        gap: 1px;
      }
      .stat-label { font-size: 9px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
      .stat-val { font-size: 13px; font-weight: 800; color: var(--text-main); }
      .victory-actions { display: flex; flex-direction: column; gap: 6px; }
      .btn-primary-action {
        width: 100%;
        height: 40px;
        border-radius: var(--radius-sm);
        border: none;
        background: linear-gradient(135deg, var(--accent-theme), var(--accent-theme-dark));
        color: #ffffff;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.15s ease;
      }
      .btn-secondary-action {
        width: 100%;
        height: 36px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-subtle);
        background: #f8f6f0;
        color: var(--text-muted);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .btn-secondary-action:hover { background: #ede7d9; color: var(--text-main); }

      @media (min-width: 900px) {
        .zebra-header {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          height: 56px;
          padding: 0 20px;
          gap: 16px;
        }
        .header-top-row { width: auto; flex: 0 0 auto; }
        .stage-nav-pills { width: auto; flex: 1 1 auto; justify-content: center; }
        .table-scroll-hint { display: none; }
        .category-header-cell, .category-label-cell { width: 120px; min-width: 120px; font-size: 12px; padding: 6px 10px; }
        .column-header-cell, .grid-select-cell { min-width: 140px; font-size: 12px; }
        .zebra-select { height: 38px; min-height: 38px; font-size: 12px; }
      }
    `;

    document.head.appendChild(style);
  }

  render() {
    const isMuted = this.sound.isMuted;
    const stg = this.stage;

    this.root.innerHTML = `
      <div class="zebra-app-root">
        <!-- HEADER -->
        <header class="zebra-header">
          <div class="header-top-row">
            <div class="header-left">
              <button id="btn-back" class="btn-icon-text" title="Go back">
                <span class="btn-icon">←</span>
                <span class="btn-text">Back</span>
              </button>
              <div class="header-title-box">
                <h1 class="header-title">${this.rawLevel.title || 'Logic Grid Mystery'}</h1>
                <span class="header-badge">${this.theme.badge || 'Einstein Logic Grid'}</span>
              </div>
            </div>

            <div class="header-right">
              <button id="btn-sound-toggle" class="btn-icon-only" title="Toggle Sound">
                ${isMuted ? '🔇' : '🔔'}
              </button>
            </div>
          </div>

          <div class="stage-nav-pills">
            ${this.stages.map((s, idx) => {
              const isLocked = idx > this.unlockedLevel;
              const isActive = idx === this.currentLevelIndex;
              return `
                <button class="stage-pill ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''}" data-stage="${idx}" title="${isLocked ? 'Locked Case' : `Stage ${idx + 1}`}">
                  ${isLocked ? '🔒 ' : ''}Stage ${idx + 1}
                </button>
              `;
            }).join('')}
          </div>
        </header>

        <!-- MAIN SCROLLABLE CONTENT -->
        <main class="zebra-main-content">
          <div class="level-intro-card">
            <div class="intro-badge">${stg.title} • ${stg.difficulty}</div>
            <p class="intro-desc">${stg.description}</p>
          </div>

          <!-- TABLE -->
          <div class="table-card-wrapper">
            <div class="table-scroll-hint">↔ Swipe horizontally to view all ${stg.columnCategory.toLowerCase()}</div>
            <div id="zebra-table-container">
              ${this.buildTableHtml()}
            </div>
          </div>

          <!-- CLUES -->
          <section class="clues-card-section">
            <div class="clues-header">
              <div class="clues-title">
                <span class="clues-icon">📜</span>
                <h2>Investigation Clues & Evidence</h2>
              </div>
              <span class="clues-hint-note">Click any clue to cross it out</span>
            </div>

            <div class="clues-two-col-grid">
              ${stg.clues.map((clueText, idx) => {
                const isCrossed = this.crossedClues.has(idx);
                return `
                  <div class="clue-card ${isCrossed ? 'crossed' : ''}" data-clue-idx="${idx}">
                    <span class="clue-num">${idx + 1}</span>
                    <p class="clue-text">${clueText}</p>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
        </main>

        <!-- FOOTER TOOLBAR -->
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
    this.root.querySelectorAll('.stage-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-stage'), 10);
        this.sound.playClick();
        this.initLevel(idx);
      });
    });

    const btnBack = this.root.querySelector('#btn-back');
    if (btnBack) {
      btnBack.addEventListener('click', () => {
        this.sound.playClick();
        if (typeof this.onBack === 'function') {
          this.onBack();
        } else if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = '../../index.html';
        }
      });
    }

    const btnSound = this.root.querySelector('#btn-sound-toggle');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const isMuted = this.sound.toggleMute();
        btnSound.textContent = isMuted ? '🔇' : '🔔';
        if (!isMuted) this.sound.playClick();
      });
    }

    this.root.querySelectorAll('.clue-card').forEach(card => {
      card.addEventListener('click', () => {
        this.sound.playClue();
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

    const btnUndo = this.root.querySelector('#btn-undo');
    if (btnUndo) btnUndo.addEventListener('click', () => this.undo());

    const btnReset = this.root.querySelector('#btn-reset');
    if (btnReset) btnReset.addEventListener('click', () => this.reset());

    const btnHint = this.root.querySelector('#btn-hint');
    if (btnHint) btnHint.addEventListener('click', () => this.giveHint());

    const btnCheck = this.root.querySelector('#btn-check-solution');
    if (btnCheck) btnCheck.addEventListener('click', () => this.checkSolution());
  }
}

// Export for browser
window.LogicGridEngine = LogicGridEngine;
window.LOGIC_GRID_THEMES = THEMES;
