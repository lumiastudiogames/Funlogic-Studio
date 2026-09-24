// Animal Mix Kids - Pure Vanilla JavaScript Water Sort for Kids
(function() {
  'use strict';

  const ANIMALS = {
    dog: { emoji: '🐶', name: 'Puppy', class: 'dog' },
    cat: { emoji: '🐱', name: 'Kitten', class: 'cat' },
    bunny: { emoji: '🐰', name: 'Bunny', class: 'bunny' }
  };
  const CAPACITY = 3;

  let tubes = [];
  let selectedTubeIdx = null;
  let history = [];
  let startTime = Date.now();
  let isWon = false;
  let soundEnabled = true;

  // Web Audio Synthesizer
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'select') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'pour') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(140, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, High C
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.3);
      });
    }
  }

  // Solvable level generator by shuffling backwards from completed state
  function generateLevel() {
    let state = [
      ['dog', 'dog', 'dog'],
      ['cat', 'cat', 'cat'],
      ['bunny', 'bunny', 'bunny'],
      []
    ];

    // Scramble with valid reverse moves
    let moves = 0;
    let maxAttempts = 16;
    while (moves < maxAttempts) {
      const from = Math.floor(Math.random() * 4);
      const to = Math.floor(Math.random() * 4);
      if (from !== to && state[from].length > 0 && state[to].length < CAPACITY) {
        state[to].push(state[from].pop());
        moves++;
      }
    }
    // Ensure it's not accidentally solved already
    return state;
  }

  function initGame() {
    tubes = generateLevel();
    selectedTubeIdx = null;
    history = [];
    isWon = false;
    startTime = Date.now();
    document.getElementById('win-modal').classList.remove('active');
    updateHint('Tap a tube to pick an animal!');
    render();
  }

  function updateHint(text) {
    const el = document.getElementById('hint-text');
    if (el) el.textContent = text;
  }

  function spawnStarParticles(targetTubeIdx) {
    const container = document.getElementById('tubes-container');
    const tubeWrappers = container.getElementsByClassName('tube-wrapper');
    if (!tubeWrappers || !tubeWrappers[targetTubeIdx]) return;
    const rect = tubeWrappers[targetTubeIdx].getBoundingClientRect();
    const stageRect = document.getElementById('game-stage').getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - stageRect.left;
    const cy = rect.top + rect.height / 3 - stageRect.top;

    const stars = ['✨', '⭐', '🌟', '💫', '🎉', '💖'];
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('span');
      p.textContent = stars[i % stars.length];
      p.style.position = 'absolute';
      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;
      p.style.fontSize = `${18 + Math.floor(Math.random() * 12)}px`;
      p.style.transform = 'translate(-50%, -50%) scale(0.4)';
      p.style.pointerEvents = 'none';
      p.style.zIndex = '100';
      p.style.transition = 'transform 0.65s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.65s ease-out';
      p.style.opacity = '1';
      document.getElementById('game-stage').appendChild(p);

      const angle = (i / 14) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const dist = 45 + Math.random() * 55;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist;

      requestAnimationFrame(() => {
        p.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1.4)`;
        p.style.opacity = '0';
      });

      setTimeout(() => {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 700);
    }
  }

  function render() {
    const container = document.getElementById('tubes-container');
    container.innerHTML = '';

    tubes.forEach((tube, idx) => {
      const wrapperEl = document.createElement('div');
      wrapperEl.className = 'tube-wrapper';
      if (selectedTubeIdx === idx) wrapperEl.classList.add('selected');
      if (isTubeComplete(tube)) wrapperEl.classList.add('completed');

      const lipEl = document.createElement('div');
      lipEl.className = 'tube-lip';
      wrapperEl.appendChild(lipEl);

      const tubeEl = document.createElement('div');
      tubeEl.className = 'tube';

      tube.forEach(animalKey => {
        const slotEl = document.createElement('div');
        const animal = ANIMALS[animalKey];
        slotEl.className = `animal-slot ${animal.class}`;
        slotEl.textContent = animal.emoji;
        tubeEl.appendChild(slotEl);
      });

      wrapperEl.appendChild(tubeEl);
      wrapperEl.addEventListener('click', () => handleTubeClick(idx));
      container.appendChild(wrapperEl);
    });
  }

  function isTubeComplete(tube) {
    if (tube.length !== CAPACITY) return false;
    return tube.every(a => a === tube[0]);
  }

  function checkWin() {
    let completedCount = 0;
    for (let tube of tubes) {
      if (tube.length === 0) continue;
      if (isTubeComplete(tube)) {
        completedCount++;
      } else {
        return false;
      }
    }
    return completedCount === 3;
  }

  function handleTubeClick(idx) {
    if (isWon) return;

    if (selectedTubeIdx === null) {
      // Trying to select source tube
      if (tubes[idx].length === 0) {
        playSound('error');
        return;
      }
      selectedTubeIdx = idx;
      playSound('select');
      const topAnimal = ANIMALS[tubes[idx][tubes[idx].length - 1]];
      updateHint(`Moving ${topAnimal.name} ${topAnimal.emoji}. Tap destination!`);
      render();
    } else {
      if (selectedTubeIdx === idx) {
        // Deselect
        selectedTubeIdx = null;
        updateHint('Tap a tube to pick an animal!');
        render();
        return;
      }

      const sourceTube = tubes[selectedTubeIdx];
      const targetTube = tubes[idx];
      const movingAnimal = sourceTube[sourceTube.length - 1];

      // Check if valid destination:
      // Valid if target is not full AND (target is empty OR top of target matches)
      const canPour = targetTube.length < CAPACITY &&
        (targetTube.length === 0 || targetTube[targetTube.length - 1] === movingAnimal);

      if (canPour) {
        // Save history for undo
        history.push(JSON.parse(JSON.stringify(tubes)));
        targetTube.push(sourceTube.pop());
        const destIdx = idx;
        selectedTubeIdx = null;
        playSound('pour');
        updateHint('Great jump! 🌟');
        render();
        spawnStarParticles(destIdx);

        if (checkWin()) {
          handleWin();
        }
      } else {
        playSound('error');
        updateHint("Oops, can't jump there! Needs same animal or empty tube.");
      }
    }
  }

  function handleWin() {
    isWon = true;
    playSound('win');
    const elapsedSeconds = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
    updateHint('🎉 All animals sorted! You won!');

    // Official platform win notification
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'win', time: elapsedSeconds }, '*');
      }
    } catch (e) {}

    // Show local win modal
    setTimeout(() => {
      const wtEl = document.getElementById('win-time');
      if (wtEl) wtEl.textContent = `${elapsedSeconds}s`;
      document.getElementById('win-modal').classList.add('active');
    }, 400);
  }

  function undoMove() {
    if (history.length === 0 || isWon) return;
    tubes = history.pop();
    selectedTubeIdx = null;
    playSound('select');
    updateHint('Move undone!');
    render();
  }

  // Setup Event Listeners
  document.getElementById('btn-undo').addEventListener('click', undoMove);
  document.getElementById('btn-restart').addEventListener('click', initGame);
  document.getElementById('btn-play-again').addEventListener('click', initGame);

  const soundBtn = document.getElementById('btn-sound');
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
    if (soundEnabled) playSound('select');
  });

  const howBtn = document.getElementById('btn-how');
  const howModal = document.getElementById('how-modal');
  const closeHowBtn = document.getElementById('btn-close-how');

  howBtn.addEventListener('click', () => {
    howModal.classList.add('active');
    playSound('select');
  });
  closeHowBtn.addEventListener('click', () => {
    howModal.classList.remove('active');
  });

  // Start initial game
  initGame();
})();
