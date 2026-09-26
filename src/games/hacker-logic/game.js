// Hacker Logic - Decode // ASCII Hex Word Decoder // 50 Levels
(function () {
  'use strict';

  // --- Audio ---
  const Audio = {
    ctx: null, muted: false,
    init() {
      if (!this.ctx) {
        const C = window.AudioContext || window.webkitAudioContext;
        if (C) this.ctx = new C();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    _tone(type, freq, endFreq, dur, vol = 0.12) {
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, now + dur);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now); osc.stop(now + dur);
    },
    key()     { this.init(); this._tone('square', 900, 400, 0.04, 0.08); },
    del()     { this.init(); this._tone('square', 300, 180, 0.05, 0.08); },
    submit()  { this.init(); this._tone('sawtooth', 440, 660, 0.07, 0.12); },
    wrong()   { this.init(); this._tone('sawtooth', 200, 90, 0.25, 0.18); },
    win()     {
      this.init();
      const now = this.ctx.currentTime;
      [523, 659, 783, 1046, 1318].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        g.gain.setValueAtTime(0.2, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
        osc.connect(g); g.connect(this.ctx.destination);
        osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.3);
      });
    },
    tick()    { this.init(); this._tone('sine', 220, 220, 0.05, 0.06); },
  };

  // --- 50 Level Word Database (4–8 letter words, progressive difficulty) ---
  // Word encoded as uppercase ASCII hex pairs
  function encode(word) {
    return word.toUpperCase().split('').map(c => c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')).join('');
  }

  const LEVELS = [
    // 4-letter words — no time pressure
    { id:  1, word: 'CODE',  time: 90,  hint: 'What programmers write' },
    { id:  2, word: 'BYTE',  time: 90,  hint: '8 bits of data' },
    { id:  3, word: 'DATA',  time: 90,  hint: 'Information stored digitally' },
    { id:  4, word: 'FILE',  time: 85,  hint: 'Document on a drive' },
    { id:  5, word: 'ROOT',  time: 85,  hint: 'Admin superuser access' },
    { id:  6, word: 'HASH',  time: 80,  hint: 'Cryptographic checksum function' },
    { id:  7, word: 'LINK',  time: 80,  hint: 'URL or network connection' },
    { id:  8, word: 'BITS',  time: 75,  hint: 'Smallest digital unit' },
    { id:  9, word: 'CORE',  time: 75,  hint: 'CPU processing unit' },
    { id: 10, word: 'FORK',  time: 70,  hint: 'Clone a repository' },
    // 5-letter words
    { id: 11, word: 'PROXY', time: 80,  hint: 'Intermediary server' },
    { id: 12, word: 'TOKEN', time: 80,  hint: 'Auth credential string' },
    { id: 13, word: 'STACK', time: 75,  hint: 'Data structure or tech set' },
    { id: 14, word: 'QUEUE', time: 75,  hint: 'FIFO data structure' },
    { id: 15, word: 'PATCH', time: 70,  hint: 'Software bug fix' },
    { id: 16, word: 'SHELL', time: 70,  hint: 'Command-line interface' },
    { id: 17, word: 'FLOOD', time: 65,  hint: 'DDoS attack type' },
    { id: 18, word: 'GRANT', time: 65,  hint: 'Access permission given' },
    { id: 19, word: 'LOGIC', time: 60,  hint: 'Reasoning in algorithms' },
    { id: 20, word: 'MUTEX', time: 60,  hint: 'Mutual exclusion lock' },
    // 6-letter words
    { id: 21, word: 'BUFFER', time: 75, hint: 'Temporary data storage' },
    { id: 22, word: 'CIPHER', time: 75, hint: 'Encryption algorithm' },
    { id: 23, word: 'DAEMON', time: 70, hint: 'Background system process' },
    { id: 24, word: 'PACKET', time: 70, hint: 'Network data chunk' },
    { id: 25, word: 'SOCKET', time: 65, hint: 'Network endpoint' },
    { id: 26, word: 'KERNEL', time: 65, hint: 'OS core module' },
    { id: 27, word: 'MIRROR', time: 60, hint: 'Server replica/backup' },
    { id: 28, word: 'SCRIPT', time: 60, hint: 'Automated command file' },
    { id: 29, word: 'TROJAN', time: 55, hint: 'Malware disguised as legit' },
    { id: 30, word: 'VECTOR', time: 55, hint: 'Attack path or direction' },
    // 7-letter words
    { id: 31, word: 'PAYLOAD', time: 70, hint: 'Malicious code segment' },
    { id: 32, word: 'GATEWAY', time: 70, hint: 'Network entry router' },
    { id: 33, word: 'SEGMENT', time: 65, hint: 'Network data division' },
    { id: 34, word: 'CLUSTER', time: 65, hint: 'Group of servers' },
    { id: 35, word: 'FIREWALL', time: 65, hint: 'Network traffic filter' }, // actually 8
    { id: 36, word: 'EXPLOIT', time: 60, hint: 'Vulnerability abuse code' },
    { id: 37, word: 'DECODER', time: 60, hint: 'Translates encoded data' },
    { id: 38, word: 'BACKDOOR', time: 60, hint: 'Hidden system access' }, // 8
    { id: 39, word: 'SESSION', time: 55, hint: 'Active connection period' },
    { id: 40, word: 'ENCRYPT', time: 55, hint: 'Secure data with cipher' },
    // 8-letter / hardest
    { id: 41, word: 'PROTOCOL', time: 60, hint: 'Communication rule set' },
    { id: 42, word: 'OVERFLOW', time: 60, hint: 'Buffer size exceeded' },
    { id: 43, word: 'MALWARE', time: 55,  hint: 'Malicious software' }, // 7
    { id: 44, word: 'SANDBOX', time: 55,  hint: 'Isolated test environment' }, // 7
    { id: 45, word: 'ROOTKIT', time: 50,  hint: 'Hidden system malware' }, // 7
    { id: 46, word: 'SPOOFING', time: 50, hint: 'Identity impersonation' },
    { id: 47, word: 'PHISHING', time: 50, hint: 'Fake login credential theft' },
    { id: 48, word: 'KEYCHAIN', time: 50, hint: 'Stored credentials vault' },
    { id: 49, word: 'DARKWEB', time: 45,  hint: 'Hidden internet layer' }, // 7
    { id: 50, word: 'SYSCALL', time: 45,  hint: 'OS kernel function call' }, // 7
  ].map(lvl => ({ ...lvl, encoded: encode(lvl.word) }));

  // --- Hex → Letter translation map (all printable ASCII 20-7E) ---
  const HEX_MAP = {};
  for (let code = 0x20; code <= 0x7E; code++) {
    HEX_MAP[code.toString(16).toUpperCase().padStart(2, '0')] = String.fromCharCode(code);
  }

  // --- State ---
  let currentLvlIdx = 0;
  let maxUnlocked = 1;
  try {
    const s = localStorage.getItem('hl2_progress');
    if (s) maxUnlocked = Math.max(1, Math.min(50, parseInt(s, 10) || 1));
  } catch (_) {}

  let currentInput = [];
  let gameOver = false;
  let timeLeft = 0;
  let timerInterval = null;
  let startTime = Date.now();

  // --- DOM Refs ---
  const stageEl          = document.getElementById('game-stage');
  const levelNumEl       = document.getElementById('level-num');
  const timerBadgeEl     = document.getElementById('timer-badge');
  const encodedDisplayEl = document.getElementById('encoded-display');
  const inputDisplayEl   = document.getElementById('input-display');
  const hintTextEl       = document.getElementById('hint-text');
  const logEl            = document.getElementById('history-logs');
  const modalLevels      = document.getElementById('modal-levels');
  const levelsGrid       = document.getElementById('levels-grid');
  const mapModal         = document.getElementById('map-modal');
  const mapContent       = document.getElementById('map-content');

  // --- Timer ---
  function startTimer(seconds) {
    clearInterval(timerInterval);
    timeLeft = seconds;
    renderTimer();
    timerInterval = setInterval(() => {
      if (gameOver) { clearInterval(timerInterval); return; }
      timeLeft--;
      renderTimer();
      if (timeLeft <= 10) Audio.tick();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        onTimeUp();
      }
    }, 1000);
  }

  function renderTimer() {
    if (!timerBadgeEl) return;
    timerBadgeEl.textContent = `⏱ ${timeLeft}s`;
    if (timeLeft <= 10) {
      timerBadgeEl.style.color = '#f87171';
      timerBadgeEl.style.borderColor = '#ef4444';
      timerBadgeEl.style.background = 'rgba(239,68,68,0.2)';
      timerBadgeEl.style.animation = 'pulseDanger 0.6s infinite alternate';
    } else if (timeLeft <= 20) {
      timerBadgeEl.style.color = '#fbbf24';
      timerBadgeEl.style.borderColor = '#f59e0b';
      timerBadgeEl.style.background = 'rgba(245,158,11,0.15)';
      timerBadgeEl.style.animation = 'none';
    } else {
      timerBadgeEl.style.color = '#86efac';
      timerBadgeEl.style.borderColor = '#16a34a';
      timerBadgeEl.style.background = 'rgba(34,197,94,0.15)';
      timerBadgeEl.style.animation = 'none';
    }
  }

  function onTimeUp() {
    if (gameOver) return;
    gameOver = true;
    Audio.wrong();
    const lvl = LEVELS[currentLvlIdx];
    appendLog(`🚨 TIME'S UP! The word was: <span style="color:#4ade80;font-weight:900;letter-spacing:2px">${lvl.word}</span>`, '#450a0a', '#ef4444');
    appendRetryBtn();
  }

  // --- Init Level ---
  function initGame(idx = currentLvlIdx) {
    currentLvlIdx = Math.max(0, Math.min(49, idx));
    const lvl = LEVELS[currentLvlIdx];

    clearInterval(timerInterval);
    currentInput = [];
    gameOver = false;

    levelNumEl.textContent = lvl.id;
    if (hintTextEl) hintTextEl.textContent = `💡 ${lvl.hint}`;

    // Render encoded hex string grouped in pairs
    renderEncodedDisplay(lvl);

    // Render letter input slots (one per letter)
    renderInputSlots(lvl.word.length);

    // Log welcome
    logEl.innerHTML = `
      <div class="log-entry" style="border-color:#22c55e">
        <span style="color:#4ade80">&gt; LEVEL ${lvl.id} — MISSION: DECODE THE WORD</span>
      </div>
      <div class="log-entry" style="border-color:#15803d;font-size:11px">
        <span style="color:#86efac">&gt; HEX PAYLOAD: <span style="letter-spacing:2px;color:#67e8f9">${lvl.encoded}</span></span>
      </div>
      <div class="log-entry" style="border-color:#15803d;font-size:11px">
        <span style="color:#86efac">&gt; DECODE ${lvl.word.length} LETTERS FROM THE PAYLOAD</span>
      </div>
    `;

    // Build keypad for A-Z
    buildKeypad(lvl.word.length);
    startTimer(lvl.time);
  }

  function renderEncodedDisplay(lvl) {
    if (!encodedDisplayEl) return;
    const pairs = [];
    for (let i = 0; i < lvl.encoded.length; i += 2) {
      pairs.push(lvl.encoded.slice(i, i + 2));
    }
    encodedDisplayEl.innerHTML = pairs
      .map((p, i) => `<span class="hex-pair" data-pair="${p}" title="→ Letter ${i + 1}">${p}</span>`)
      .join('<span class="hex-sep">·</span>');
  }

  function renderInputSlots(len) {
    if (!inputDisplayEl) return;
    inputDisplayEl.innerHTML = '';
    for (let i = 0; i < len; i++) {
      const slot = document.createElement('div');
      slot.id = `slot-${i}`;
      slot.className = 'slot';
      inputDisplayEl.appendChild(slot);
    }
    updateSlots();
  }

  function updateSlots() {
    const lvl = LEVELS[currentLvlIdx];
    for (let i = 0; i < lvl.word.length; i++) {
      const el = document.getElementById(`slot-${i}`);
      if (!el) continue;
      el.textContent = currentInput[i] || '';
      el.className = `slot${i === currentInput.length && !gameOver ? ' active' : ''}${currentInput[i] ? ' filled' : ''}`;
    }
  }

  function buildKeypad(wordLen) {
    const keypadEl = document.getElementById('alpha-keypad');
    if (!keypadEl) return;
    keypadEl.innerHTML = '';

    // A-Z buttons in 7-column grid
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'btn-key btn-alpha';
      btn.textContent = letter;
      btn.dataset.char = letter;
      btn.addEventListener('click', () => handleKey(letter));
      keypadEl.appendChild(btn);
    });
  }

  // --- Input Handlers ---
  function handleKey(char) {
    if (gameOver) return;
    const lvl = LEVELS[currentLvlIdx];
    if (currentInput.length >= lvl.word.length) return;
    Audio.key();
    currentInput.push(char.toUpperCase());
    updateSlots();
    // Highlight matching hex pair
    highlightHexPair(currentInput.length - 1, char);
  }

  function highlightHexPair(idx, letter) {
    const pairs = document.querySelectorAll('.hex-pair');
    if (!pairs[idx]) return;
    // Flash the hex pair that corresponds to this position
    pairs[idx].classList.add('hex-matched');
    setTimeout(() => pairs[idx].classList.remove('hex-matched'), 800);
  }

  function handleDelete() {
    if (gameOver || currentInput.length === 0) return;
    Audio.del();
    currentInput.pop();
    updateSlots();
  }

  function handleSubmit() {
    if (gameOver) return;
    const lvl = LEVELS[currentLvlIdx];
    if (currentInput.length < lvl.word.length) {
      appendLog(`⚠ Fill all ${lvl.word.length} letters before submitting!`, '#1c1917', '#78716c');
      return;
    }
    Audio.submit();

    const attempt = currentInput.join('');
    currentInput = [];
    updateSlots();

    if (attempt === lvl.word) {
      clearInterval(timerInterval);
      gameOver = true;
      Audio.win();
      const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      // score bonus: leftover time
      const bonus = timeLeft * 10;

      appendLog(
        `✅ ACCESS GRANTED! Word: <span style="color:#fbbf24;letter-spacing:2px">${lvl.word}</span> &nbsp;+${bonus} pts`,
        '#064e3b', '#4ade80'
      );

      // Unlock next level
      if (lvl.id >= maxUnlocked && maxUnlocked < 50) {
        maxUnlocked = lvl.id + 1;
        try { localStorage.setItem('hl2_progress', String(maxUnlocked)); } catch (_) {}
      }

      if (window.parent) {
        try {
          window.parent.postMessage({ type: 'win', level: lvl.id, time: elapsed, score: bonus }, '*');
        } catch (_) {}
      }
      try {
        if (typeof window.triggerPlatformWin === 'function') {
          window.triggerPlatformWin({ score: bonus, level: lvl.id, time: elapsed });
        }
      } catch (_) {}

      if (currentLvlIdx < 49) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn-next-lvl';
        nextBtn.textContent = `NEXT: LEVEL ${lvl.id + 1} ▶`;
        nextBtn.addEventListener('click', () => initGame(currentLvlIdx + 1));
        appendLogNode(nextBtn);
      } else {
        appendLog('🏆 ALL 50 LEVELS CLEARED — MASTER HACKER!', '#1a1a00', '#facc15');
      }
    } else {
      // Wrong — show per-letter correctness
      let feedback = '';
      for (let i = 0; i < lvl.word.length; i++) {
        const color = attempt[i] === lvl.word[i] ? '#4ade80' : '#f87171';
        feedback += `<span style="color:${color};letter-spacing:2px">${attempt[i]}</span> `;
      }
      appendLog(`❌ Wrong: ${feedback.trim()} — Try again!`, '#1e0000', '#ef4444');
      // Shake input display
      if (inputDisplayEl) {
        inputDisplayEl.classList.add('shake');
        setTimeout(() => inputDisplayEl.classList.remove('shake'), 500);
      }
    }
  }

  // --- Hex Map Modal ---
  function buildMapModal() {
    if (!mapContent) return;
    // Show only letters A-Z relevant table
    const rows = [];
    rows.push('<div class="map-header">HEX → ASCII TRANSLATION TABLE</div>');
    rows.push('<div class="map-grid">');
    for (let i = 65; i <= 90; i++) { // A-Z only for decoding words
      const hex = i.toString(16).toUpperCase().padStart(2, '0');
      const char = String.fromCharCode(i);
      rows.push(`<div class="map-row"><span class="map-hex">${hex}</span><span class="map-arrow">→</span><span class="map-letter">${char}</span></div>`);
    }
    rows.push('</div>');
    mapContent.innerHTML = rows.join('');
  }

  // --- Log Helpers ---
  function appendLog(html, bg = '#051009', borderColor = '#16a34a') {
    const el = document.createElement('div');
    el.className = 'log-entry';
    el.style.background = bg;
    el.style.borderColor = borderColor;
    el.innerHTML = html;
    logEl.appendChild(el);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function appendLogNode(node) {
    const wrap = document.createElement('div');
    wrap.className = 'log-entry';
    wrap.style.background = '#064e3b';
    wrap.style.borderColor = '#4ade80';
    wrap.appendChild(node);
    logEl.appendChild(wrap);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function appendRetryBtn() {
    const btn = document.createElement('button');
    btn.className = 'btn-next-lvl';
    btn.style.background = '#dc2626';
    btn.style.borderColor = '#ef4444';
    btn.textContent = 'TRY AGAIN ↺';
    btn.addEventListener('click', () => initGame(currentLvlIdx));
    appendLogNode(btn);
  }

  // --- Levels Modal ---
  function openLevelsModal() {
    levelsGrid.innerHTML = '';
    LEVELS.forEach((lvl, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn-lvl-node';
      btn.textContent = lvl.id;
      if (idx === currentLvlIdx) btn.classList.add('active');
      if (lvl.id > maxUnlocked) btn.classList.add('locked');
      btn.addEventListener('click', () => {
        if (lvl.id <= maxUnlocked) {
          modalLevels.style.display = 'none';
          initGame(idx);
        }
      });
      levelsGrid.appendChild(btn);
    });
    modalLevels.style.display = 'flex';
  }

  // --- Keyboard Support ---
  window.addEventListener('keydown', e => {
    const k = e.key.toUpperCase();
    if (k >= 'A' && k <= 'Z' && e.key.length === 1) {
      handleKey(k);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      handleDelete();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  });

  // --- Wiring Buttons ---
  document.getElementById('btn-levels-modal')?.addEventListener('click', openLevelsModal);
  document.getElementById('btn-close-levels')?.addEventListener('click', () => { modalLevels.style.display = 'none'; });
  document.getElementById('btn-restart')?.addEventListener('click', () => initGame(currentLvlIdx));
  document.getElementById('btn-sound')?.addEventListener('click', function () {
    Audio.muted = !Audio.muted;
    this.innerHTML = Audio.muted ? '🔇' : '🔊';
  });
  document.getElementById('btn-enter')?.addEventListener('click', handleSubmit);
  document.getElementById('btn-del')?.addEventListener('click', handleDelete);
  document.getElementById('btn-map')?.addEventListener('click', () => {
    if (mapModal) mapModal.style.display = 'flex';
  });
  document.getElementById('btn-close-map')?.addEventListener('click', () => {
    if (mapModal) mapModal.style.display = 'none';
  });

  // --- Start ---
  buildMapModal();
  initGame(Math.min(maxUnlocked - 1, 49));
})();
