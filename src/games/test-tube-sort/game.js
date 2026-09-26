// Test Tube Sort (Chemistry Lab & Color Mixing Edition) - Standalone Vanilla JS
(function () {
  'use strict';

  const COLORS = {
    blue: { id: 'blue', name: 'Cobalt Blue', gradient: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)', isPrimary: true, emoji: '🔵' },
    yellow: { id: 'yellow', name: 'Sulfur Yellow', gradient: 'linear-gradient(180deg, #facc15 0%, #ca8a04 100%)', isPrimary: true, emoji: '🟡' },
    red: { id: 'red', name: 'Crimson Red', gradient: 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)', isPrimary: true, emoji: '🔴' },
    green: { id: 'green', name: 'Emerald Green', gradient: 'linear-gradient(180deg, #10b981 0%, #047857 100%)', isPrimary: false, emoji: '🟢' },
    orange: { id: 'orange', name: 'Amber Orange', gradient: 'linear-gradient(180deg, #f97316 0%, #c2410c 100%)', isPrimary: false, emoji: '🟠' },
    purple: { id: 'purple', name: 'Amethyst Purple', gradient: 'linear-gradient(180deg, #8b5cf6 0%, #5b21b6 100%)', isPrimary: false, emoji: '🟣' },
    cyan: { id: 'cyan', name: 'Copper Cyan', gradient: 'linear-gradient(180deg, #06b6d4 0%, #0e7490 100%)', isPrimary: false, emoji: '🩵' },
    pink: { id: 'pink', name: 'Rose Pink', gradient: 'linear-gradient(180deg, #ec4899 0%, #be185d 100%)', isPrimary: false, emoji: '🩷' },
    lime: { id: 'lime', name: 'Neon Lime', gradient: 'linear-gradient(180deg, #84cc16 0%, #4d7c0f 100%)', isPrimary: false, emoji: '🟩' },
    white: { id: 'white', name: 'Pure Solvent', gradient: 'linear-gradient(180deg, #f8fafc 0%, #cbd5e1 100%)', isPrimary: true, emoji: '⚪' }
  };

  // 10 Color Mixing Synthesis Reactions
  const REACTIONS = {
    'blue+yellow': 'green',
    'yellow+blue': 'green',
    'red+yellow': 'orange',
    'yellow+red': 'orange',
    'red+blue': 'purple',
    'blue+red': 'purple',
    'blue+green': 'cyan',
    'green+blue': 'cyan',
    'red+white': 'pink',
    'white+red': 'pink',
    'yellow+green': 'lime',
    'green+yellow': 'lime',
    'blue+purple': 'cyan',
    'purple+blue': 'cyan',
    'red+orange': 'pink',
    'orange+red': 'pink',
    'yellow+orange': 'lime',
    'orange+yellow': 'lime',
    'white+blue': 'cyan',
    'blue+white': 'cyan'
  };

  function getReactionResult(c1, c2) {
    if (!c1 || !c2) return null;
    return REACTIONS[`${c1}+${c2}`] || null;
  }

  const TUBE_CAPACITY = 4;
  const TOTAL_LEVELS = 20;

  // Curated Levels in English demonstrating progression from color mixing to full lab separation
  const CURATED_LEVELS = [
    // Level 1: Intro to Green Synthesis (Blue + Yellow)
    {
      name: 'Green Synthesis I',
      tubes: [
        ['blue', 'blue'],
        ['yellow', 'yellow'],
        []
      ]
    },
    // Level 2: Intro to Orange Synthesis (Red + Yellow)
    {
      name: 'Orange Synthesis I',
      tubes: [
        ['red', 'red'],
        ['yellow', 'yellow'],
        []
      ]
    },
    // Level 3: Intro to Purple Synthesis (Red + Blue)
    {
      name: 'Purple Synthesis I',
      tubes: [
        ['red', 'red'],
        ['blue', 'blue'],
        []
      ]
    },
    // Level 4: Full Green Batch
    {
      name: 'Chlorophyll Batch',
      tubes: [
        ['blue', 'yellow', 'blue'],
        ['yellow', 'blue', 'yellow'],
        [],
        []
      ]
    },
    // Level 5: Green & Orange Synthesis
    {
      name: 'Dual Reaction: Green & Orange',
      tubes: [
        ['yellow', 'yellow', 'yellow', 'yellow'],
        ['blue', 'blue', 'red', 'red'],
        [],
        []
      ]
    },
    // Level 6: Complete Tri-Synthesis
    {
      name: 'Reagent Triad',
      tubes: [
        ['blue', 'blue'],
        ['yellow', 'yellow'],
        ['red', 'red'],
        ['yellow', 'yellow'],
        [],
        []
      ]
    },
    // Level 7: Purification Lab
    {
      name: 'Separation & Synthesis',
      tubes: [
        ['blue', 'red', 'yellow'],
        ['yellow', 'blue', 'red'],
        ['red', 'yellow', 'blue'],
        [],
        []
      ]
    },
    // Level 8: Emerald & Amber
    {
      name: 'Emerald & Amber',
      tubes: [
        ['blue', 'yellow', 'red', 'yellow'],
        ['yellow', 'blue', 'yellow', 'red'],
        ['blue', 'blue'],
        [],
        []
      ]
    },
    // Level 9: Violet Chemistry
    {
      name: 'Amethyst Solution',
      tubes: [
        ['red', 'blue', 'red', 'blue'],
        ['blue', 'red', 'blue', 'red'],
        ['green', 'green', 'green', 'green'],
        [],
        []
      ]
    },
    // Level 10: Multi-Compound Bench
    {
      name: 'Advanced Alchemy',
      tubes: [
        ['blue', 'yellow', 'cyan', 'cyan'],
        ['yellow', 'blue', 'cyan', 'cyan'],
        ['red', 'yellow', 'red', 'yellow'],
        ['yellow', 'red', 'yellow', 'red'],
        [],
        []
      ]
    },
    // Level 11 to 20: Procedural escalating challenges
    ...Array.from({ length: 10 }, (_, i) => ({
      name: `Experimental Challenge ${i + 11}`,
      isGenerated: true,
      difficulty: i + 11
    }))
  ];

  let currentLevel = 1;
  let isRandomMode = false;
  let tubes = [];
  let selectedTubeIdx = null;
  let history = [];
  let moves = 0;
  let hintsUsed = 0;
  let hintTimeout = null;
  let startTime = Date.now();
  let timerInterval = null;
  let soundEnabled = true;
  let isWon = false;

  // Local storage for progress
  const STORAGE_KEY = 'funlogic_test_tube_sort_progress_v2';
  function loadProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : { maxLevel: 1, stars: {} };
    } catch (e) {
      return { maxLevel: 1, stars: {} };
    }
  }

  function saveProgress(lvl, stars) {
    try {
      const p = loadProgress();
      if (lvl >= p.maxLevel) {
        p.maxLevel = Math.min(TOTAL_LEVELS, lvl + 1);
      }
      p.stars[lvl] = Math.max(p.stars[lvl] || 0, stars);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    } catch (e) {}
  }

  // Audio synthesis
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      if (AudioClass) audioCtx = new AudioClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'glass_clink') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2400, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.12);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'pour') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(560, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.22);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'react') {
        // Chemical Reaction: effervescent bubbling FM + celebratory synthesis chord
        const osc = ctx.createOscillator();
        const mod = ctx.createOscillator();
        const modGain = ctx.createGain();
        const gain = ctx.createGain();

        mod.frequency.setValueAtTime(14, now); // 14Hz bubbling
        modGain.gain.setValueAtTime(60, now);
        mod.connect(modGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.35);
        modGain.connect(osc.frequency);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        mod.start(now);
        osc.start(now);
        mod.stop(now + 0.35);
        osc.stop(now + 0.35);

        // Synthesis high harmonic ping
        const ping = ctx.createOscillator();
        const pingGain = ctx.createGain();
        ping.type = 'sine';
        ping.frequency.setValueAtTime(1046.5, now + 0.08); // High C6
        pingGain.gain.setValueAtTime(0.18, now + 0.08);
        pingGain.gain.exponentialRampToValueAtTime(0.005, now + 0.3);
        ping.connect(pingGain);
        pingGain.connect(ctx.destination);
        ping.start(now + 0.08);
        ping.stop(now + 0.3);
      } else if (type === 'hint') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.1);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'win') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);
          gain.gain.setValueAtTime(0.2, now + i * 0.12);
          gain.gain.linearRampToValueAtTime(0.01, now + i * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.35);
        });
      }
    } catch (e) {}
  }

  // BFS Solvability Verifier - Checks if puzzle is 100% winnable before serving
  function isLevelSolvable(initialTubes) {
    const queue = [initialTubes];
    const visited = new Set();
    const serialize = (st) => st.map(t => t.join(',')).sort().join('|');
    visited.add(serialize(initialTubes));

    let iterations = 0;
    while (queue.length > 0 && iterations < 1800) {
      iterations++;
      const current = queue.shift();

      const isWin = current.every(tube => tube.length === 0 || (tube.length === TUBE_CAPACITY && tube.every(c => c === tube[0])));
      if (isWin) return true;

      for (let i = 0; i < current.length; i++) {
        const src = current[i];
        if (src.length === 0) continue;
        if (src.length === TUBE_CAPACITY && src.every(c => c === src[0])) continue;

        for (let j = 0; j < current.length; j++) {
          if (i === j) continue;
          const dst = current[j];
          if (dst.length >= TUBE_CAPACITY) continue;

          const srcTop = src[src.length - 1];
          const dstTop = dst.length > 0 ? dst[dst.length - 1] : null;
          const rx = getReactionResult(srcTop, dstTop);

          if (rx) {
            const emptySlots = TUBE_CAPACITY - dst.length;
            const srcCount = countContiguousTop(src);
            const dstCount = countContiguousTop(dst);
            const mixUnits = Math.min(srcCount, dstCount, emptySlots);
            if (mixUnits > 0) {
              const nextState = current.map(t => [...t]);
              for (let k = 0; k < mixUnits; k++) {
                nextState[i].pop();
                nextState[j].pop();
                nextState[j].push(rx);
                nextState[j].push(rx);
              }
              const key = serialize(nextState);
              if (!visited.has(key)) {
                visited.add(key);
                queue.push(nextState);
              }
            }
          } else if (dst.length === 0 || dstTop === srcTop) {
            const nextState = current.map(t => [...t]);
            while (nextState[i].length > 0 && nextState[i][nextState[i].length - 1] === srcTop && nextState[j].length < TUBE_CAPACITY) {
              nextState[j].push(nextState[i].pop());
            }
            const key = serialize(nextState);
            if (!visited.has(key)) {
              visited.add(key);
              queue.push(nextState);
            }
          }
        }
      }
    }
    return false;
  }

  // Generate procedural or randomized lab puzzles with guaranteed solvability
  function generateCandidatePuzzle(levelNum) {
    const numFilled = Math.min(8, 4 + Math.floor((levelNum - 1) / 3));
    const totalTubes = numFilled + 2;
    const availableColorKeys = ['blue', 'yellow', 'red', 'green', 'orange', 'purple', 'cyan', 'pink'];
    const chosenColors = availableColorKeys.slice(0, numFilled);

    let items = [];
    chosenColors.forEach(c => {
      for (let k = 0; k < TUBE_CAPACITY; k++) {
        items.push(c);
      }
    });

    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    let state = [];
    for (let i = 0; i < numFilled; i++) {
      state.push(items.slice(i * 4, (i + 1) * 4));
    }
    for (let i = numFilled; i < totalTubes; i++) {
      state.push([]);
    }
    return state;
  }

  function generateProceduralPuzzle(levelNum) {
    let attempts = 0;
    while (attempts < 25) {
      attempts++;
      const candidate = generateCandidatePuzzle(levelNum);
      if (isLevelSolvable(candidate)) {
        return candidate;
      }
    }
    // Verified solvable fallback
    return [
      ['blue', 'blue', 'yellow', 'yellow'],
      ['yellow', 'yellow', 'blue', 'blue'],
      [],
      []
    ];
  }

  function loadLevel(lvlNum, random = false) {
    currentLevel = Math.max(1, Math.min(TOTAL_LEVELS, lvlNum));
    isRandomMode = random;

    if (isRandomMode) {
      tubes = generateProceduralPuzzle(10);
    } else {
      const levelData = CURATED_LEVELS[currentLevel - 1];
      if (levelData && !levelData.isGenerated) {
        tubes = JSON.parse(JSON.stringify(levelData.tubes));
      } else {
        tubes = generateProceduralPuzzle(currentLevel);
      }
    }

    selectedTubeIdx = null;
    history = [];
    moves = 0;
    hintsUsed = 0;
    clearHintHighlights();
    isWon = false;
    startTime = Date.now();

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    updateHUD();
    renderTubes();
    hideVictoryModal();
  }

  function updateHUD() {
    const moveEl = document.getElementById('move-counter');
    if (moveEl) moveEl.textContent = moves;
    const undoEl = document.getElementById('undo-counter');
    if (undoEl) undoEl.textContent = history.length;
    const lvlBtnTxt = document.getElementById('level-btn-txt');
    if (lvlBtnTxt) {
      lvlBtnTxt.textContent = isRandomMode ? 'RANDOM' : `LEVEL ${currentLevel}`;
    }
  }

  function updateTimer() {
    if (isWon) return;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsed / 60);
    const secs = elapsed % 60;
    const el = document.getElementById('timer-counter');
    if (el) {
      el.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }

  function isTubeComplete(tube) {
    if (!tube || tube.length !== TUBE_CAPACITY) return false;
    return tube.every(c => c === tube[0]);
  }

  function renderTubes() {
    const row1 = document.getElementById('row-1');
    const row2 = document.getElementById('row-2');
    if (!row1 || !row2) return;

    row1.innerHTML = '';
    row2.innerHTML = '';

    const splitIdx = Math.ceil(tubes.length / 2);

    tubes.forEach((tube, idx) => {
      const targetRow = idx < splitIdx ? row1 : row2;
      const tubeEl = document.createElement('div');
      tubeEl.className = 'tube';
      tubeEl.dataset.idx = idx;

      if (selectedTubeIdx === idx) {
        tubeEl.classList.add('selected');
      }
      if (isTubeComplete(tube)) {
        tubeEl.classList.add('locked');
      }

      tube.forEach((colorKey, layerIdx) => {
        const colorDef = COLORS[colorKey] || { gradient: '#64748b' };
        const layerEl = document.createElement('div');
        layerEl.className = 'liquid-layer';
        layerEl.style.background = colorDef.gradient;

        if (layerIdx === tube.length - 1) {
          const surf = document.createElement('div');
          surf.className = 'liquid-surface';
          layerEl.appendChild(surf);
        }

        tubeEl.appendChild(layerEl);
      });

      tubeEl.addEventListener('click', () => handleTubeClick(idx));
      targetRow.appendChild(tubeEl);
    });
  }

  function handleTubeClick(idx) {
    if (isWon) return;
    clearHintHighlights();
    const tube = tubes[idx];

    if (selectedTubeIdx === null) {
      if (tube.length === 0 || isTubeComplete(tube)) return;
      selectedTubeIdx = idx;
      playSound('glass_clink');
      renderTubes();
    } else if (selectedTubeIdx === idx) {
      selectedTubeIdx = null;
      playSound('glass_clink');
      renderTubes();
    } else {
      const srcIdx = selectedTubeIdx;
      const dstIdx = idx;

      if (canPour(srcIdx, dstIdx)) {
        executePour(srcIdx, dstIdx);
      } else {
        selectedTubeIdx = null;
        renderTubes();
      }
    }
  }

  function canPour(srcIdx, dstIdx) {
    if (srcIdx === dstIdx) return false;
    const src = tubes[srcIdx];
    const dst = tubes[dstIdx];
    if (!src || !dst || src.length === 0) return false;
    if (dst.length >= TUBE_CAPACITY) return false;
    if (dst.length === 0) return true;

    const srcTop = src[src.length - 1];
    const dstTop = dst[dst.length - 1];

    // Standard matching pour
    if (srcTop === dstTop) return true;

    // Chemical reaction / Color mixing pour
    const reactionResult = getReactionResult(srcTop, dstTop);
    if (reactionResult !== null) return true;

    return false;
  }

  function countContiguousTop(tube) {
    if (tube.length === 0) return 0;
    const top = tube[tube.length - 1];
    let count = 0;
    for (let i = tube.length - 1; i >= 0; i--) {
      if (tube[i] === top) count++;
      else break;
    }
    return count;
  }

  function executePour(srcIdx, dstIdx) {
    history.push(JSON.parse(JSON.stringify(tubes)));

    const src = tubes[srcIdx];
    const dst = tubes[dstIdx];
    const srcTop = src[src.length - 1];
    const dstTop = dst.length > 0 ? dst[dst.length - 1] : null;

    const srcEl = document.querySelector(`.tube[data-idx="${srcIdx}"]`);
    const dstEl = document.querySelector(`.tube[data-idx="${dstIdx}"]`);
    if (srcEl && dstEl) {
      const srcRect = srcEl.getBoundingClientRect();
      const dstRect = dstEl.getBoundingClientRect();
      const isPouringRight = dstRect.left >= srcRect.left;
      srcEl.classList.add(isPouringRight ? 'pouring-right' : 'pouring-left');
    }

    setTimeout(() => {
      if (srcEl) {
        srcEl.classList.remove('pouring-right', 'pouring-left');
      }

      const reactionResult = getReactionResult(srcTop, dstTop);

      if (reactionResult) {
        // Chemical Reaction Mixing Pour: 1 unit src + 1 unit dst -> 2 units reactionResult
        const srcCount = countContiguousTop(src);
        const dstCount = countContiguousTop(dst);
        const emptySlots = TUBE_CAPACITY - dst.length;

        const mixUnits = Math.min(srcCount, dstCount, emptySlots);

        for (let k = 0; k < mixUnits; k++) {
          src.pop();
          dst.pop();
          dst.push(reactionResult);
          dst.push(reactionResult);
        }

        playSound('react');
        triggerReactionFX(dstIdx, srcTop, dstTop, reactionResult);
      } else {
        // Standard Water Sort Pour
        const color = srcTop;
        while (src.length > 0 && src[src.length - 1] === color && dst.length < TUBE_CAPACITY) {
          dst.push(src.pop());
        }
        playSound('pour');
      }

      moves++;
      selectedTubeIdx = null;

      updateHUD();
      renderTubes();
      checkWinCondition();
    }, 200);
  }

  function triggerReactionFX(tubeIdx, c1, c2, resultColor) {
    const tubeEl = document.querySelector(`.tube[data-idx="${tubeIdx}"]`);
    if (!tubeEl) return;

    tubeEl.classList.add('reacting');

    // Generate effervescent bubble particles
    for (let i = 0; i < 6; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'reaction-bubble';
      bubble.style.left = `${10 + Math.random() * 24}px`;
      bubble.style.animationDelay = `${Math.random() * 0.25}s`;
      tubeEl.appendChild(bubble);
      setTimeout(() => bubble.remove(), 900);
    }

    // Reaction toast pill notification
    const c1Def = COLORS[c1] || { emoji: '🧪' };
    const c2Def = COLORS[c2] || { emoji: '🧪' };
    const resDef = COLORS[resultColor] || { name: resultColor, emoji: '✨' };

    const toast = document.createElement('div');
    toast.className = 'reaction-toast';
    toast.textContent = `⚗️ ${c1Def.emoji}+${c2Def.emoji} ➔ ${resDef.emoji} ${resDef.name.toUpperCase()}`;
    tubeEl.appendChild(toast);
    setTimeout(() => toast.remove(), 1200);

    setTimeout(() => {
      tubeEl.classList.remove('reacting');
    }, 850);
  }

  function undoMove() {
    if (history.length === 0 || isWon) return;
    clearHintHighlights();
    tubes = history.pop();
    selectedTubeIdx = null;
    moves = Math.max(0, moves - 1);
    playSound('glass_clink');
    updateHUD();
    renderTubes();
  }

  // Hint button with smart reaction detection
  function giveHint() {
    if (isWon) return;
    clearHintHighlights();

    // Priority 0: Available Chemical Reaction Pour
    for (let i = 0; i < tubes.length; i++) {
      if (tubes[i].length === 0 || isTubeComplete(tubes[i])) continue;
      const srcTop = tubes[i][tubes[i].length - 1];

      for (let j = 0; j < tubes.length; j++) {
        if (i === j || tubes[j].length === 0 || tubes[j].length >= TUBE_CAPACITY) continue;
        const dstTop = tubes[j][tubes[j].length - 1];
        if (getReactionResult(srcTop, dstTop) !== null) {
          flashHint(i, j);
          return;
        }
      }
    }

    // Priority 1: Match onto matching non-empty tube
    for (let i = 0; i < tubes.length; i++) {
      if (tubes[i].length === 0 || isTubeComplete(tubes[i])) continue;
      const topCol = tubes[i][tubes[i].length - 1];

      for (let j = 0; j < tubes.length; j++) {
        if (i === j) continue;
        if (tubes[j].length > 0 && tubes[j].length < TUBE_CAPACITY && tubes[j][tubes[j].length - 1] === topCol) {
          flashHint(i, j);
          return;
        }
      }
    }

    // Priority 2: Move into empty tube to uncover reagents
    for (let i = 0; i < tubes.length; i++) {
      if (tubes[i].length === 0 || isTubeComplete(tubes[i])) continue;
      const isPure = tubes[i].every(c => c === tubes[i][0]);
      if (isPure) continue;

      for (let j = 0; j < tubes.length; j++) {
        if (tubes[j].length === 0) {
          flashHint(i, j);
          return;
        }
      }
    }

    // Fallback: any valid move
    for (let i = 0; i < tubes.length; i++) {
      for (let j = 0; j < tubes.length; j++) {
        if (i !== j && canPour(i, j)) {
          flashHint(i, j);
          return;
        }
      }
    }
  }

  function flashHint(srcIdx, dstIdx) {
    playSound('hint');
    hintsUsed++;

    const srcEl = document.querySelector(`.tube[data-idx="${srcIdx}"]`);
    const dstEl = document.querySelector(`.tube[data-idx="${dstIdx}"]`);

    if (srcEl) srcEl.classList.add('hint-pulse-src');
    if (dstEl) dstEl.classList.add('hint-pulse-dst');

    if (hintTimeout) clearTimeout(hintTimeout);
    hintTimeout = setTimeout(() => {
      clearHintHighlights();
    }, 3000);
  }

  function clearHintHighlights() {
    if (hintTimeout) clearTimeout(hintTimeout);
    document.querySelectorAll('.tube').forEach(el => {
      el.classList.remove('hint-pulse-src', 'hint-pulse-dst');
    });
  }

  function checkWinCondition() {
    // Win if all liquid belongs to fully completed tubes, and no mixed tubes remain
    let totalLiquids = 0;
    let completedTubes = 0;
    let incompleteOccupiedTubes = 0;

    for (let i = 0; i < tubes.length; i++) {
      const len = tubes[i].length;
      if (len > 0) {
        totalLiquids += len;
        if (isTubeComplete(tubes[i])) {
          completedTubes++;
        } else {
          incompleteOccupiedTubes++;
        }
      }
    }

    if (completedTubes > 0 && incompleteOccupiedTubes === 0) {
      isWon = true;
      clearInterval(timerInterval);
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      playSound('win');

      // Calculate star rating
      const stars = moves <= tubes.length * 3 ? 3 : (moves <= tubes.length * 5 ? 2 : 1);
      if (!isRandomMode) {
        saveProgress(currentLevel, stars);
      }

      try {
        if (typeof window.triggerPlatformWin === 'function') {
          window.triggerPlatformWin(elapsedSeconds);
        } else if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'win', time: elapsedSeconds, level: currentLevel }, '*');
        }
      } catch (e) {}

      showVictoryModal(elapsedSeconds);
    }
  }

  function showVictoryModal(timeSecs) {
    const modal = document.getElementById('modal-victory');
    const timeEl = document.getElementById('win-time');
    const movesEl = document.getElementById('win-moves');
    const descEl = document.getElementById('win-desc');

    if (timeEl) timeEl.textContent = `${timeSecs}s`;
    if (movesEl) movesEl.textContent = moves;
    if (descEl) {
      descEl.textContent = isRandomMode
        ? 'Random experiment successfully isolated!'
        : `Experiment #${currentLevel} completed with all reactions purified!`;
    }
    if (modal) modal.classList.add('active');
  }

  function hideVictoryModal() {
    const modal = document.getElementById('modal-victory');
    if (modal) modal.classList.remove('active');
  }

  function renderLevelGrid() {
    const container = document.getElementById('levels-container');
    if (!container) return;
    container.innerHTML = '';

    const progress = loadProgress();

    for (let i = 1; i <= TOTAL_LEVELS; i++) {
      const btn = document.createElement('button');
      btn.className = 'level-btn';
      if (i === currentLevel && !isRandomMode) btn.classList.add('active');
      if (i < progress.maxLevel || progress.stars[i]) btn.classList.add('completed');

      const starCount = progress.stars[i] || 0;
      const starsDisplay = starCount > 0 ? '★'.repeat(starCount) : '•••';

      btn.innerHTML = `
        <span>#${i}</span>
        <span class="level-stars">${starsDisplay}</span>
      `;

      btn.addEventListener('click', () => {
        document.getElementById('modal-levels')?.classList.remove('active');
        loadLevel(i, false);
      });

      container.appendChild(btn);
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadLevel(1, false);

    document.getElementById('btn-hint')?.addEventListener('click', giveHint);
    document.getElementById('btn-undo')?.addEventListener('click', undoMove);
    document.getElementById('btn-restart')?.addEventListener('click', () => loadLevel(currentLevel, isRandomMode));
    document.getElementById('btn-win-restart')?.addEventListener('click', () => loadLevel(currentLevel, isRandomMode));

    document.getElementById('btn-win-next')?.addEventListener('click', () => {
      hideVictoryModal();
      if (isRandomMode) {
        loadLevel(currentLevel, true);
      } else {
        const nextLvl = currentLevel < TOTAL_LEVELS ? currentLevel + 1 : 1;
        loadLevel(nextLvl, false);
      }
    });

    const soundBtn = document.getElementById('btn-sound');
    soundBtn?.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.innerHTML = soundEnabled ? '🔊' : '🔇';
    });

    // Modals
    const infoBtn = document.getElementById('btn-info');
    const rulesModal = document.getElementById('modal-rules');
    const closeRulesBtn = document.getElementById('btn-close-rules');
    infoBtn?.addEventListener('click', () => rulesModal?.classList.add('active'));
    closeRulesBtn?.addEventListener('click', () => rulesModal?.classList.remove('active'));

    const recipesBtn = document.getElementById('btn-recipes');
    const recipeBar = document.getElementById('recipe-quick-bar');
    const recipesModal = document.getElementById('modal-recipes');
    const closeRecipesBtn = document.getElementById('btn-close-recipes');
    recipesBtn?.addEventListener('click', () => recipesModal?.classList.add('active'));
    recipeBar?.addEventListener('click', () => recipesModal?.classList.add('active'));
    closeRecipesBtn?.addEventListener('click', () => recipesModal?.classList.remove('active'));

    const levelsBtn = document.getElementById('btn-levels');
    const levelsModal = document.getElementById('modal-levels');
    const closeLevelsBtn = document.getElementById('btn-close-levels');
    const randomModeBtn = document.getElementById('btn-random-mode');

    levelsBtn?.addEventListener('click', () => {
      renderLevelGrid();
      levelsModal?.classList.add('active');
    });
    closeLevelsBtn?.addEventListener('click', () => levelsModal?.classList.remove('active'));
    randomModeBtn?.addEventListener('click', () => {
      levelsModal?.classList.remove('active');
      loadLevel(1, true);
    });
  });
})();
