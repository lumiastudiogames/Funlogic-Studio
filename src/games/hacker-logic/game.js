// Hacker Logic - Decode Secret Key Engine (Vanilla JS)
(function () {
  'use strict';

  const AudioEngine = {
    ctx: null,
    muted: false,
    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },
    playKey() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    },
    playSubmit() {
      if (this.muted) return;
      this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(660, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    },
    playWin() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      [523, 659, 783, 1046, 1318].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.25);
      });
    },
    playFail() {
      if (this.muted) return;
      this.init();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.3);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  };

  const MAX_ATTEMPTS = 8;
  let secretCode = [];
  let currentInput = [];
  let attempts = 0;
  let gameOver = false;
  let startTime = Date.now();

  const historyEl = document.getElementById('history-logs');
  const slots = [
    document.getElementById('slot-0'),
    document.getElementById('slot-1'),
    document.getElementById('slot-2'),
    document.getElementById('slot-3')
  ];
  const attemptBadge = document.getElementById('attempt-badge');

  function generateSecretCode() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    digits.sort(() => Math.random() - 0.5);
    return digits.slice(0, 4);
  }

  function initGame() {
    secretCode = generateSecretCode();
    currentInput = [];
    attempts = 0;
    gameOver = false;
    startTime = Date.now();

    historyEl.innerHTML = `
      <div class="log-entry" style="border-color: #22c55e;">
        <span style="color: #4ade80;">> SISTEMA DECODIFICADOR ONLINE // 4 DÍGITOS DISTINTOS</span>
      </div>
    `;

    updateSlots();
    updateHUD();
  }

  function updateHUD() {
    attemptBadge.textContent = `${MAX_ATTEMPTS - attempts} TENTATIVAS`;
  }

  function updateSlots() {
    slots.forEach((slot, i) => {
      slot.textContent = currentInput[i] !== undefined ? currentInput[i] : '';
      if (i === currentInput.length && !gameOver) {
        slot.classList.add('active');
      } else {
        slot.classList.remove('active');
      }
    });
  }

  function handleKey(digit) {
    if (gameOver || currentInput.length >= 4) return;
    AudioEngine.playKey();
    currentInput.push(digit);
    updateSlots();
  }

  function handleDelete() {
    if (gameOver || currentInput.length === 0) return;
    AudioEngine.playKey();
    currentInput.pop();
    updateSlots();
  }

  function handleSubmit() {
    if (gameOver || currentInput.length < 4) return;
    AudioEngine.playSubmit();

    attempts++;
    const guess = [...currentInput];
    currentInput = [];
    updateSlots();
    updateHUD();

    // Calculate exact & misplaced
    let exact = 0;
    let misplaced = 0;

    for (let i = 0; i < 4; i++) {
      if (guess[i] === secretCode[i]) {
        exact++;
      } else if (secretCode.includes(guess[i])) {
        misplaced++;
      }
    }

    // Add log
    const log = document.createElement('div');
    log.className = 'log-entry';
    log.innerHTML = `
      <span class="guess-digits">${guess.join(' ')}</span>
      <div class="clues">
        <span class="clue-exact">🟢 ${exact} Exato${exact !== 1 ? 's' : ''}</span>
        <span class="clue-misplaced">🟡 ${misplaced} Fora</span>
      </div>
    `;
    historyEl.appendChild(log);
    historyEl.scrollTop = historyEl.scrollHeight;

    // Check Win
    if (exact === 4) {
      gameOver = true;
      AudioEngine.playWin();
      const elapsed = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
      const winLog = document.createElement('div');
      winLog.className = 'log-entry';
      winLog.style.background = '#064e3b';
      winLog.style.borderColor = '#4ade80';
      winLog.innerHTML = `<span style="color: #86efac; font-weight: 900;">🏆 ACESSO CONCEDIDO! SENHA DECIFRADA EM ${attempts} TENTATIVAS!</span>`;
      historyEl.appendChild(winLog);
      historyEl.scrollTop = historyEl.scrollHeight;

      window.parent.postMessage({ type: 'win', time: elapsed }, '*');
    } else if (attempts >= MAX_ATTEMPTS) {
      gameOver = true;
      AudioEngine.playFail();
      const failLog = document.createElement('div');
      failLog.className = 'log-entry';
      failLog.style.background = '#450a0a';
      failLog.style.borderColor = '#ef4444';
      failLog.innerHTML = `<span style="color: #fca5a5; font-weight: 900;">🚨 BLOQUEADO! A SENHA ERA: ${secretCode.join(' ')}</span>`;
      historyEl.appendChild(failLog);
      historyEl.scrollTop = historyEl.scrollHeight;
    }
  }

  // Keypad click listeners
  document.querySelectorAll('[data-digit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const d = parseInt(btn.getAttribute('data-digit'), 10);
      handleKey(d);
    });
  });

  document.getElementById('btn-del').addEventListener('click', handleDelete);
  document.getElementById('btn-enter').addEventListener('click', handleSubmit);

  // Keyboard input
  window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
      handleKey(parseInt(e.key, 10));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      handleDelete();
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  });

  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-sound').addEventListener('click', function () {
    AudioEngine.muted = !AudioEngine.muted;
    this.innerHTML = AudioEngine.muted ? '🔇' : '🔊';
  });

  initGame();
})();
