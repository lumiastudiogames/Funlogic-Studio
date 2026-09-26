const fs = require('fs');
const path = require('path');

const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <title>The Poisoned Coffee - Liar's Logic Grid</title>
  <meta name="description" content="Investigate the Café Noir murder: cross-reference suspects, café tables, and poisoned coffee cups using pure Einstein zebra logic deduction." />
  <meta property="og:title" content="The Poisoned Coffee - Liar's Logic Grid" />
  <meta property="og:description" content="A rich detective logic grid mystery game set in a 1930s espresso bar. Deduce who poisoned the coffee!" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />

  <style>
    :root {
      --bg-page: #fdfbf7;
      --bg-card: #ffffff;
      --bg-card-alt: #f7f2ea;
      --border-subtle: #e6ded2;
      --border-strong: #c4b5a0;
      --text-main: #2c1a11;
      --text-muted: #786558;
      --accent-primary: #78350f;
      --accent-dark: #451a03;
      --accent-gold: #d97706;
      --accent-gold-dark: #b45309;
      --accent-gold-light: #fef3c7;
      --accent-green: #059669;
      --accent-blue: #2563eb;
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
      --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 16px;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      -webkit-user-select: none;
    }

    html, body {
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
      background-color: var(--bg-page);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    #app {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .zebra-app-root {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-page);
      position: relative;
      overflow: hidden;
    }

    /* HEADER */
    .zebra-header {
      flex: 0 0 auto;
      padding: 10px 16px;
      display: flex;
      flex-direction: column;
      background: #ffffff;
      border-bottom: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-sm);
      z-index: 20;
      gap: 8px;
    }

    .header-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 8px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      flex: 1 1 auto;
    }

    .back-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background: var(--bg-card-alt);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .back-btn:active {
      transform: scale(0.95);
      background: var(--border-subtle);
    }

    .title-block {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .game-title {
      font-size: 16px;
      font-weight: 800;
      color: var(--text-main);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .game-badge {
      display: inline-flex;
      align-items: center;
      font-size: 10.5px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 12px;
      background: var(--accent-gold-light);
      color: var(--accent-gold-dark);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 1px;
      width: fit-content;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }

    .header-icon-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background: var(--bg-card-alt);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .header-icon-btn:active {
      transform: scale(0.95);
    }

    /* LEVEL SELECTOR TABS */
    .level-tabs-scroll {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 2px;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .level-tabs-scroll::-webkit-scrollbar {
      display: none;
    }

    .level-tab-pill {
      flex: 0 0 auto;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid var(--border-subtle);
      background: var(--bg-card-alt);
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s ease;
    }

    .level-tab-pill.active {
      background: var(--accent-primary);
      border-color: var(--accent-primary);
      color: #ffffff;
      box-shadow: 0 2px 4px rgba(120, 53, 15, 0.25);
    }

    .level-tab-pill.locked {
      opacity: 0.55;
      background: #eee8de;
      border-style: dashed;
      cursor: not-allowed;
    }

    /* MAIN SCROLLABLE CONTENT */
    .zebra-main-content {
      flex: 1 1 auto;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px 14px 80px 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      -webkit-overflow-scrolling: touch;
    }

    .zebra-main-content > * {
      flex-shrink: 0;
    }

    /* STORY PROMPT CARD */
    .story-card {
      background: #ffffff;
      border-radius: var(--radius-md);
      padding: 12px 14px;
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-sm);
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }

    .story-icon {
      font-size: 24px;
      line-height: 1;
      padding: 6px;
      border-radius: var(--radius-sm);
      background: var(--accent-gold-light);
      flex-shrink: 0;
    }

    .story-body {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .story-title {
      font-size: 13.5px;
      font-weight: 800;
      color: var(--accent-primary);
    }

    .story-text {
      font-size: 12px;
      line-height: 1.4;
      color: var(--text-muted);
    }

    /* TABLE CONTAINER - MOBILE FULL VISIBILITY */
    .table-card {
      background: #ffffff;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-sm);
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
    }

    .zebra-grid-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      min-width: 320px;
    }

    .zebra-grid-table th,
    .zebra-grid-table td {
      border: 1px solid var(--border-subtle);
      padding: 6px 8px;
      text-align: center;
      font-size: 12px;
    }

    .zebra-grid-table th {
      background: var(--bg-card-alt);
      font-weight: 800;
      color: var(--text-main);
      padding: 8px 6px;
    }

    .table-col-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }

    .table-col-num {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--accent-primary);
      font-weight: 900;
    }

    .table-col-name {
      font-size: 12px;
      font-weight: 800;
      white-space: nowrap;
    }

    .zebra-category-cell {
      background: var(--bg-card-alt);
      font-weight: 800;
      text-align: left !important;
      padding-left: 10px !important;
      width: 100px;
      white-space: nowrap;
      position: sticky;
      left: 0;
      z-index: 2;
      border-right: 2px solid var(--border-strong) !important;
    }

    .cat-cell-content {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--text-main);
    }

    .zebra-select {
      width: 100%;
      height: 38px;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      background: #ffffff;
      color: var(--text-main);
      font-size: 11.5px;
      font-weight: 600;
      padding: 0 4px;
      outline: none;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align-last: center;
    }

    .zebra-select:focus {
      border-color: var(--accent-primary);
      box-shadow: 0 0 0 2px var(--accent-gold-light);
    }

    .zebra-select.has-value {
      background: #fdfbf7;
      font-weight: 700;
      color: var(--accent-primary);
      border-color: var(--accent-gold);
    }

    /* CLUES SECTION */
    .clues-card {
      background: #ffffff;
      border-radius: var(--radius-md);
      padding: 12px 14px;
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-sm);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .clues-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .clues-title {
      font-size: 13px;
      font-weight: 800;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .clues-subtitle {
      font-size: 11px;
      color: var(--text-muted);
      font-style: italic;
    }

    .clues-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .clue-item {
      padding: 8px 10px;
      border-radius: var(--radius-sm);
      background: var(--bg-card-alt);
      border: 1px solid var(--border-subtle);
      font-size: 12px;
      line-height: 1.4;
      color: var(--text-main);
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      transition: all 0.15s ease;
    }

    .clue-item:active {
      transform: scale(0.98);
    }

    .clue-item.crossed {
      opacity: 0.45;
      background: #f1ede5;
      text-decoration: line-through;
      color: var(--text-muted);
    }

    .clue-checkbox {
      margin-top: 2px;
      font-size: 12px;
      line-height: 1;
      flex-shrink: 0;
    }

    /* FOOTER BAR */
    .zebra-footer-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: #ffffff;
      border-top: 1px solid var(--border-subtle);
      box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 30;
      gap: 8px;
    }

    .footer-btn-group {
      display: flex;
      gap: 6px;
    }

    .btn-secondary {
      height: 40px;
      padding: 0 10px;
      border-radius: var(--radius-sm);
      background: var(--bg-card-alt);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-secondary:active {
      transform: scale(0.95);
      background: var(--border-subtle);
    }

    .btn-primary-check {
      height: 42px;
      padding: 0 18px;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-dark));
      border: none;
      color: #ffffff;
      font-size: 13.5px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(120, 53, 15, 0.35);
      transition: all 0.15s ease;
      flex: 1 1 auto;
      justify-content: center;
      max-width: 220px;
    }

    .btn-primary-check:active {
      transform: scale(0.97);
    }

    /* VICTORY MODAL */
    .modal-overlay {
      position: absolute;
      inset: 0;
      background: rgba(44, 26, 17, 0.75);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease-out;
    }

    .modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .modal-dialog {
      width: 100%;
      max-width: 380px;
      background: #ffffff;
      border-radius: var(--radius-lg);
      padding: 24px;
      text-align: center;
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      animation: modalPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 2px solid var(--accent-gold);
    }

    @keyframes modalPop {
      0% { transform: scale(0.85); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }

    .modal-win-icon {
      font-size: 48px;
      line-height: 1;
    }

    .modal-win-title {
      font-size: 20px;
      font-weight: 900;
      color: var(--accent-primary);
    }

    .modal-win-desc {
      font-size: 13px;
      line-height: 1.45;
      color: var(--text-muted);
    }

    .modal-stats {
      width: 100%;
      background: var(--bg-card-alt);
      border-radius: var(--radius-md);
      padding: 10px;
      display: flex;
      justify-content: space-around;
      border: 1px solid var(--border-subtle);
    }

    .modal-stat-box {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .modal-stat-val {
      font-size: 16px;
      font-weight: 800;
      color: var(--accent-primary);
    }

    .modal-stat-lbl {
      font-size: 11px;
      color: var(--text-muted);
    }

    .btn-modal-next {
      width: 100%;
      height: 44px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dark));
      border: none;
      color: #ffffff;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 8px rgba(217, 119, 6, 0.3);
      transition: all 0.15s ease;
    }

    .btn-modal-next:active {
      transform: scale(0.97);
    }

    /* TOAST ALERTS */
    .toast-popup {
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      background: #2c1a11;
      color: #ffffff;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 12.5px;
      font-weight: 700;
      box-shadow: var(--shadow-md);
      z-index: 99;
      opacity: 0;
      pointer-events: none;
      transition: all 0.25s ease;
      white-space: nowrap;
      border: 1px solid var(--accent-gold);
    }

    .toast-popup.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  </style>
</head>
<body>
  <div id="app">
    <div class="zebra-app-root">
      <!-- HEADER -->
      <header class="zebra-header">
        <div class="header-top-row">
          <div class="header-left">
            <button class="back-btn" id="btn-back" title="Back to Games Portal" onclick="window.history.back()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div class="title-block">
              <span class="game-title">☕ The Poisoned Coffee</span>
              <span class="game-badge">Café Noir Liar's Logic</span>
            </div>
          </div>
          <div class="header-right">
            <button class="header-icon-btn" id="btn-sound" title="Toggle Sound">🔊</button>
          </div>
        </div>

        <!-- STAGE TABS -->
        <div class="level-tabs-scroll" id="level-tabs-container"></div>
      </header>

      <!-- MAIN SCROLLABLE CONTENT -->
      <main class="zebra-main-content" id="main-content">
        <!-- Story / Scenario -->
        <div class="story-card" id="story-card"></div>

        <!-- Table -->
        <div class="table-card" id="table-card"></div>

        <!-- Clues -->
        <div class="clues-card" id="clues-card"></div>
      </main>

      <!-- FOOTER -->
      <footer class="zebra-footer-bar">
        <div class="footer-btn-group">
          <button class="btn-secondary" id="btn-undo">↩️ Undo</button>
          <button class="btn-secondary" id="btn-reset">🔄 Reset</button>
          <button class="btn-secondary" id="btn-hint">💡 Hint</button>
        </div>
        <button class="btn-primary-check" id="btn-check">
          <span>🔍 Check Case</span>
        </button>
      </footer>

      <!-- WIN MODAL -->
      <div class="modal-overlay" id="win-modal">
        <div class="modal-dialog">
          <div class="modal-win-icon">🏆</div>
          <div class="modal-win-title" id="win-title">Case Solved!</div>
          <div class="modal-win-desc" id="win-desc">You deduced every customer, table, and coffee order flawlessly.</div>
          <div class="modal-stats">
            <div class="modal-stat-box">
              <span class="modal-stat-val" id="stat-time">00:45</span>
              <span class="modal-stat-lbl">Time</span>
            </div>
            <div class="modal-stat-box">
              <span class="modal-stat-val" id="stat-moves">12</span>
              <span class="modal-stat-lbl">Moves</span>
            </div>
          </div>
          <button class="btn-modal-next" id="btn-next-stage">
            <span>Next Stage ➡️</span>
          </button>
        </div>
      </div>

      <!-- TOAST POPUP -->
      <div class="toast-popup" id="toast-popup"></div>
    </div>
  </div>

  <script>
    // ==========================================
    // AUDIO ENGINE
    // ==========================================
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
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);
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

      playWin() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const chords = [523.25, 659.25, 783.99, 1046.50];
        chords.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.12, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.36);
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

    const sound = new ZebraAudioEngine();

    // ==========================================
    // COFFEE NOIR LOGIC GRID STAGES (PROGRESSIVE LOCKING)
    // ==========================================
    const COFFEE_STAGES = [
      {
        id: 1,
        title: "Stage 1: The Morning Rush",
        subtitle: "3 Tables • 3 Suspects • 3 Orders",
        difficulty: "Warmup",
        size: 3,
        story: "Lord Bean ordered espresso before his sudden collapse. Connect each patron to their table and morning drink.",
        columns: [
          { id: "tab1", name: "Table 1" },
          { id: "tab2", name: "Table 2" },
          { id: "tab3", name: "Table 3" }
        ],
        suspects: [
          { id: "bruno", name: "Bruno (Barista)" },
          { id: "wendy", name: "Wendy (Waitress)" },
          { id: "pierre", name: "Pierre (Chef)" }
        ],
        drinks: [
          { id: "hazelnut", name: "Hazelnut Espresso" },
          { id: "latte", name: "Vanilla Latte" },
          { id: "dark", name: "Dark Roast" }
        ],
        clues: [
          "1. Bruno is sitting at Table 1 drinking Dark Roast.",
          "2. The Vanilla Latte was served at Table 2.",
          "3. Wendy is seated to the immediate left of Pierre."
        ],
        solution: [
          { table: "tab1", suspect: "bruno", drink: "dark" },
          { table: "tab2", suspect: "wendy", drink: "latte" },
          { table: "tab3", suspect: "pierre", drink: "hazelnut" }
        ]
      },
      {
        id: 2,
        title: "Stage 2: The Bitter Almonds",
        subtitle: "4 Tables • 4 Suspects • 4 Drinks",
        difficulty: "Standard Case",
        size: 4,
        story: "Traces of bitter almond cyanide were detected in Lord Bean's cup. Deduce who ordered each beverage across the 4 café tables.",
        columns: [
          { id: "tab1", name: "Table 1" },
          { id: "tab2", name: "Table 2" },
          { id: "tab3", name: "Table 3" },
          { id: "tab4", name: "Table 4" }
        ],
        suspects: [
          { id: "bruno", name: "Bruno (Barista)" },
          { id: "wendy", name: "Wendy (Waitress)" },
          { id: "pierre", name: "Pierre (Chef)" },
          { id: "flora", name: "Flora (Regular)" }
        ],
        drinks: [
          { id: "almond", name: "Spiked Almond Espresso" },
          { id: "macchiato", name: "Caramel Macchiato" },
          { id: "mocha", name: "Mint Mocha" },
          { id: "crema", name: "Vienna Crema" }
        ],
        clues: [
          "1. Flora is seated at Table 4 enjoying a Caramel Macchiato.",
          "2. The patron at Table 1 ordered the Mint Mocha.",
          "3. Pierre is sitting at Table 2 and did NOT drink the Spiked Almond Espresso.",
          "4. Wendy is sitting next to Flora at Table 3.",
          "5. Bruno is at Table 1."
        ],
        solution: [
          { table: "tab1", suspect: "bruno", drink: "mocha" },
          { table: "tab2", suspect: "pierre", drink: "crema" },
          { table: "tab3", suspect: "wendy", drink: "almond" },
          { table: "tab4", suspect: "flora", drink: "macchiato" }
        ]
      },
      {
        id: 3,
        title: "Stage 3: Cyanide Crema",
        subtitle: "4 Booths • 4 Patrons • 4 Evidence Traces",
        difficulty: "Hard Case",
        size: 4,
        story: "A toxic glass vial was abandoned under one of the leather booths. Link the suspects, booths, and physical clues.",
        columns: [
          { id: "booth1", name: "Corner Booth" },
          { id: "booth2", name: "Window Booth" },
          { id: "booth3", name: "Counter Booth" },
          { id: "booth4", name: "Garden Booth" }
        ],
        suspects: [
          { id: "bruno", name: "Bruno (Barista)" },
          { id: "wendy", name: "Wendy (Waitress)" },
          { id: "pierre", name: "Pierre (Chef)" },
          { id: "charles", name: "Charles (Critic)" }
        ],
        drinks: [
          { id: "vial", name: "Empty Glass Vial" },
          { id: "powder", name: "Spilled White Powder" },
          { id: "froth", name: "Green Froth Cup" },
          { id: "spoon", name: "Tarnished Teaspoon" }
        ],
        clues: [
          "1. Critic Charles sits in the Window Booth where the Tarnished Teaspoon was recovered.",
          "2. The Empty Glass Vial was discovered in the Corner Booth.",
          "3. Chef Pierre is seated in the Garden Booth with the Spilled White Powder.",
          "4. Bruno is seated in the Corner Booth.",
          "5. Waitress Wendy is in the Counter Booth with the Green Froth Cup."
        ],
        solution: [
          { table: "booth1", suspect: "bruno", drink: "vial" },
          { table: "booth2", suspect: "charles", drink: "spoon" },
          { table: "booth3", suspect: "wendy", drink: "froth" },
          { table: "booth4", suspect: "pierre", drink: "powder" }
        ]
      },
      {
        id: 4,
        title: "Stage 4: Arsenic Arabica Master",
        subtitle: "4 Tables • 4 Suspects • 4 Secret Powders",
        difficulty: "Master Enigma",
        size: 4,
        story: "The ultimate deduction: identify the exact poisoner and the lethal ingredient hidden in the café roast.",
        columns: [
          { id: "tA", name: "Terrace A" },
          { id: "tB", name: "Terrace B" },
          { id: "tC", name: "Terrace C" },
          { id: "tD", name: "Terrace D" }
        ],
        suspects: [
          { id: "bruno", name: "Bruno" },
          { id: "wendy", name: "Wendy" },
          { id: "flora", name: "Flora" },
          { id: "charles", name: "Charles" }
        ],
        drinks: [
          { id: "arsenic", name: "Arsenic Arabica" },
          { id: "cyanide", name: "Potassium Cyanide" },
          { id: "strychnine", name: "Ground Strychnine" },
          { id: "belladonna", name: "Nightshade Extract" }
        ],
        clues: [
          "1. Charles is on Terrace A, and his table tested positive for Potassium Cyanide.",
          "2. Wendy sits directly between Charles and Flora.",
          "3. The lethal Arsenic Arabica was placed on Terrace C.",
          "4. Flora is at Terrace C.",
          "5. Bruno occupies Terrace D with the Nightshade Extract."
        ],
        solution: [
          { table: "tA", suspect: "charles", drink: "cyanide" },
          { table: "tB", suspect: "wendy", drink: "strychnine" },
          { table: "tC", suspect: "flora", drink: "arsenic" },
          { table: "tD", suspect: "bruno", drink: "belladonna" }
        ]
      }
    ];

    // ==========================================
    // GAME APP CONTROLLER
    // ==========================================
    class PoisonedCoffeeGame {
      constructor() {
        this.gameKey = 'poisoned_coffee';
        this.unlockedStage = parseInt(localStorage.getItem('fl_unlocked_' + this.gameKey) || '0', 10);
        this.currentStageIndex = 0;
        this.tableState = {};
        this.crossedClues = new Set();
        this.history = [];
        this.startTime = Date.now();
        this.movesCount = 0;

        this.initStage(this.currentStageIndex);
        this.bindEvents();
      }

      get stage() {
        return COFFEE_STAGES[this.currentStageIndex];
      }

      initStage(index) {
        if (index > this.unlockedStage) {
          sound.playError();
          this.showToast(\`🔒 Complete Stage \${this.unlockedStage + 1} first to unlock!\`);
          return;
        }
        this.currentStageIndex = index;
        this.tableState = {};
        for (let c = 0; c < this.stage.size; c++) {
          this.tableState[c] = { suspect: '', drink: '' };
        }
        this.crossedClues.clear();
        this.history = [];
        this.startTime = Date.now();
        this.movesCount = 0;
        this.render();
      }

      saveHistory() {
        this.history.push(JSON.stringify(this.tableState));
        if (this.history.length > 25) this.history.shift();
      }

      undo() {
        if (this.history.length === 0) return;
        this.tableState = JSON.parse(this.history.pop());
        sound.playUndo();
        this.renderTableOnly();
      }

      reset() {
        sound.playClick();
        for (let c = 0; c < this.stage.size; c++) {
          this.tableState[c] = { suspect: '', drink: '' };
        }
        this.crossedClues.clear();
        this.history = [];
        this.render();
      }

      giveHint() {
        sound.playClue();
        const stage = this.stage;
        let unassignedCol = -1;
        for (let c = 0; c < stage.size; c++) {
          const colId = stage.columns[c].id;
          const sol = stage.solution.find(s => s.table === colId);
          if (this.tableState[c].suspect !== sol.suspect || this.tableState[c].drink !== sol.drink) {
            unassignedCol = c;
            break;
          }
        }

        if (unassignedCol !== -1) {
          const colId = stage.columns[unassignedCol].id;
          const sol = stage.solution.find(s => s.table === colId);
          this.saveHistory();
          this.tableState[unassignedCol].suspect = sol.suspect;
          this.tableState[unassignedCol].drink = sol.drink;
          this.renderTableOnly();
          const suspName = stage.suspects.find(s => s.id === sol.suspect).name;
          const drinkName = stage.drinks.find(d => d.id === sol.drink).name;
          this.showToast(\`💡 Hint: \${stage.columns[unassignedCol].name} -> \${suspName} & \${drinkName}\`);
        } else {
          this.showToast("All items currently match the solution!");
        }
      }

      checkSolution() {
        const stage = this.stage;
        let allCorrect = true;
        let emptyCount = 0;

        for (let c = 0; c < stage.size; c++) {
          const colId = stage.columns[c].id;
          const sol = stage.solution.find(s => s.table === colId);
          const current = this.tableState[c];

          if (!current.suspect || !current.drink) {
            emptyCount++;
          }
          if (current.suspect !== sol.suspect || current.drink !== sol.drink) {
            allCorrect = false;
          }
        }

        if (emptyCount > 0) {
          sound.playError();
          this.showToast(\`⚠️ Please fill in all table selections (\${emptyCount} empty)\`);
          return;
        }

        if (allCorrect) {
          sound.playWin();
          const elapsedSec = Math.round((Date.now() - this.startTime) / 1000);
          
          // Unlock next stage
          if (this.currentStageIndex >= this.unlockedStage && this.unlockedStage < COFFEE_STAGES.length - 1) {
            this.unlockedStage = this.currentStageIndex + 1;
            localStorage.setItem('fl_unlocked_' + this.gameKey, this.unlockedStage);
          }

          // Trigger platform win
          if (typeof window.triggerPlatformWin === 'function') {
            window.triggerPlatformWin(elapsedSec);
          }

          this.showWinModal(elapsedSec);
        } else {
          sound.playError();
          this.showToast("❌ Some deduction entries do not match the clues. Keep investigating!");
        }
      }

      showWinModal(elapsedSec) {
        const modal = document.getElementById('win-modal');
        const title = document.getElementById('win-title');
        const desc = document.getElementById('win-desc');
        const statTime = document.getElementById('stat-time');
        const statMoves = document.getElementById('stat-moves');
        const nextBtn = document.getElementById('btn-next-stage');

        const m = Math.floor(elapsedSec / 60);
        const s = elapsedSec % 60;
        statTime.textContent = \`\${m < 10 ? '0' : ''}\${m}:\${s < 10 ? '0' : ''}\${s}\`;
        statMoves.textContent = this.movesCount;

        if (this.currentStageIndex < COFFEE_STAGES.length - 1) {
          title.textContent = \`Stage \${this.currentStageIndex + 1} Cleared!\`;
          desc.textContent = "Flawless deduction! Stage " + (this.currentStageIndex + 2) + " is now UNLOCKED!";
          nextBtn.textContent = \`Play Stage \${this.currentStageIndex + 2} ➡️\`;
          nextBtn.onclick = () => {
            modal.classList.remove('active');
            this.initStage(this.currentStageIndex + 1);
          };
        } else {
          title.textContent = "Grand Master Detective!";
          desc.textContent = "You cracked all 4 Poisoned Coffee cases. The café is safe once more!";
          nextBtn.textContent = "Replay All Cases 🔄";
          nextBtn.onclick = () => {
            modal.classList.remove('active');
            this.initStage(0);
          };
        }

        modal.classList.add('active');
      }

      showToast(msg) {
        const t = document.getElementById('toast-popup');
        t.textContent = msg;
        t.classList.add('show');
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
          t.classList.remove('show');
        }, 2600);
      }

      render() {
        this.renderTabs();
        this.renderStory();
        this.renderTableOnly();
        this.renderClues();
      }

      renderTabs() {
        const cont = document.getElementById('level-tabs-container');
        cont.innerHTML = '';
        COFFEE_STAGES.forEach((st, idx) => {
          const pill = document.createElement('div');
          const isLocked = idx > this.unlockedStage;
          pill.className = \`level-tab-pill \${idx === this.currentStageIndex ? 'active' : ''} \${isLocked ? 'locked' : ''}\`;
          pill.innerHTML = \`<span>\${isLocked ? '🔒' : '☕'} Stage \${idx + 1}</span>\`;
          pill.addEventListener('click', () => {
            sound.playClick();
            this.initStage(idx);
          });
          cont.appendChild(pill);
        });
      }

      renderStory() {
        const st = this.stage;
        const card = document.getElementById('story-card');
        card.innerHTML = \`
          <div class="story-icon">☕</div>
          <div class="story-body">
            <div class="story-title">\${st.title} (\${st.difficulty})</div>
            <div class="story-text">\${st.story}</div>
          </div>
        \`;
      }

      renderTableOnly() {
        const st = this.stage;
        const card = document.getElementById('table-card');

        let html = \`
          <table class="zebra-grid-table">
            <thead>
              <tr>
                <th class="zebra-category-cell">
                  <div class="cat-cell-content"><span>📍 Café Area</span></div>
                </th>
        \`;

        st.columns.forEach((col, idx) => {
          html += \`
            <th>
              <div class="table-col-header">
                <span class="table-col-num">#\${idx + 1}</span>
                <span class="table-col-name">\${col.name}</span>
              </div>
            </th>
          \`;
        });

        html += \`</tr></thead><tbody>\`;

        // Suspects Row
        html += \`
          <tr>
            <td class="zebra-category-cell">
              <div class="cat-cell-content"><span>👤 Suspect</span></div>
            </td>
        \`;
        st.columns.forEach((col, cIdx) => {
          const currentVal = this.tableState[cIdx].suspect;
          html += \`
            <td>
              <select class="zebra-select \${currentVal ? 'has-value' : ''}" data-col="\${cIdx}" data-cat="suspect">
                <option value="">-- Choose --</option>
          \`;
          st.suspects.forEach(s => {
            html += \`<option value="\${s.id}" \${currentVal === s.id ? 'selected' : ''}>\${s.name}</option>\`;
          });
          html += \`</select></td>\`;
        });
        html += \`</tr>\`;

        // Drinks / Clues Row
        html += \`
          <tr>
            <td class="zebra-category-cell">
              <div class="cat-cell-content"><span>🧪 Drink / Evidence</span></div>
            </td>
        \`;
        st.columns.forEach((col, cIdx) => {
          const currentVal = this.tableState[cIdx].drink;
          html += \`
            <td>
              <select class="zebra-select \${currentVal ? 'has-value' : ''}" data-col="\${cIdx}" data-cat="drink">
                <option value="">-- Choose --</option>
          \`;
          st.drinks.forEach(d => {
            html += \`<option value="\${d.id}" \${currentVal === d.id ? 'selected' : ''}>\${d.name}</option>\`;
          });
          html += \`</select></td>\`;
        });
        html += \`</tr></tbody></table>\`;

        card.innerHTML = html;

        card.querySelectorAll('.zebra-select').forEach(sel => {
          sel.addEventListener('change', (e) => {
            const cIdx = parseInt(e.target.getAttribute('data-col'), 10);
            const cat = e.target.getAttribute('data-cat');
            this.saveHistory();
            this.tableState[cIdx][cat] = e.target.value;
            this.movesCount++;
            sound.playSelect();
            if (e.target.value) {
              e.target.classList.add('has-value');
            } else {
              e.target.classList.remove('has-value');
            }
          });
        });
      }

      renderClues() {
        const st = this.stage;
        const card = document.getElementById('clues-card');

        let html = \`
          <div class="clues-header">
            <span class="clues-title">📋 Forensic Clues</span>
            <span class="clues-subtitle">Tap clue to cross out</span>
          </div>
          <div class="clues-list">
        \`;

        st.clues.forEach((clueText, idx) => {
          const isCrossed = this.crossedClues.has(idx);
          html += \`
            <div class="clue-item \${isCrossed ? 'crossed' : ''}" data-clue="\${idx}">
              <span class="clue-checkbox">\${isCrossed ? '✔️' : '◻️'}</span>
              <span>\${clueText}</span>
            </div>
          \`;
        });

        html += \`</div>\`;
        card.innerHTML = html;

        card.querySelectorAll('.clue-item').forEach(item => {
          item.addEventListener('click', () => {
            const idx = parseInt(item.getAttribute('data-clue'), 10);
            if (this.crossedClues.has(idx)) {
              this.crossedClues.delete(idx);
            } else {
              this.crossedClues.add(idx);
            }
            sound.playClue();
            this.renderClues();
          });
        });
      }

      bindEvents() {
        const btnSound = document.getElementById('btn-sound');
        btnSound.textContent = sound.isMuted ? '🔇' : '🔊';
        btnSound.addEventListener('click', () => {
          const muted = sound.toggleMute();
          btnSound.textContent = muted ? '🔇' : '🔊';
          if (!muted) sound.playClick();
        });

        document.getElementById('btn-undo').addEventListener('click', () => this.undo());
        document.getElementById('btn-reset').addEventListener('click', () => this.reset());
        document.getElementById('btn-hint').addEventListener('click', () => this.giveHint());
        document.getElementById('btn-check').addEventListener('click', () => this.checkSolution());
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      window.gameInstance = new PoisonedCoffeeGame();
    });
  </script>
</body>
</html>
`;

const dirName = "the-poisoned-coffee---liar's-logic";
const targetFile = path.resolve(__dirname, '../src/games', dirName, 'index.html');
fs.writeFileSync(targetFile, htmlContent, 'utf8');
console.log('Successfully wrote unified logic grid to', targetFile);
