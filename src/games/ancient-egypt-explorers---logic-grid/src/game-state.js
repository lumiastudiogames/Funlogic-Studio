/**
 * Game State and Logic Grid Deduction Engine
 */
import { LEVELS } from './game-data.js';
import { soundManager } from './audio.js';

export class GameStateManager {
  constructor() {
    this.history = []; // snapshots for undo
    this.crossedClues = new Set();
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.timerInterval = null;
    this.isWon = false;
    this.hintsUsed = 0;
    this.onStateChange = null;
    this.onWinCallback = null;

    this.save = {
      unlockedLevel: 1,
      bestTimes: {},
      completedLevels: {},
    };

    this.loadSave();
    this.currentLevel = LEVELS[0];
    this.grid = this.createEmptyGrid(this.currentLevel.size);
  }

  loadSave() {
    try {
      const saved = localStorage.getItem('egypt_logic_grid_save');
      if (saved) {
        this.save = JSON.parse(saved);
        if (!this.save.unlockedLevel || this.save.unlockedLevel < 1) {
          this.save.unlockedLevel = 1;
        }
      }
    } catch {
      this.save = { unlockedLevel: 1, bestTimes: {}, completedLevels: {} };
    }
  }

  writeSave() {
    try {
      localStorage.setItem('egypt_logic_grid_save', JSON.stringify(this.save));
    } catch {
      // ignore
    }
  }

  getUnlockedLevel() {
    return this.save.unlockedLevel;
  }

  getBestTime(levelId) {
    return this.save.bestTimes[levelId];
  }

  createEmptyGrid(size) {
    const make = () => Array.from({ length: size }, () => Array(size).fill(0));
    return {
      AB: make(),
      AC: make(),
      BC: make(),
    };
  }

  startLevel(levelId) {
    const level = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
    this.currentLevel = level;
    this.grid = this.createEmptyGrid(level.size);
    this.history = [];
    this.crossedClues.clear();
    this.isWon = false;
    this.hintsUsed = 0;
    this.startTime = Date.now();
    this.elapsedTime = 0;

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    this.timerInterval = window.setInterval(() => {
      if (!this.isWon) {
        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
        if (this.onStateChange) this.onStateChange();
      }
    }, 1000);

    this.saveSnapshot();
    if (this.onStateChange) this.onStateChange();
  }

  saveSnapshot() {
    const snap = JSON.stringify(this.grid);
    if (this.history.length === 0 || this.history[this.history.length - 1] !== snap) {
      this.history.push(snap);
      if (this.history.length > 30) this.history.shift();
    }
  }

  undo() {
    if (this.history.length <= 1) return false;
    this.history.pop(); // discard current
    const prev = this.history[this.history.length - 1];
    if (prev) {
      this.grid = JSON.parse(prev);
      soundManager.playClick();
      if (this.onStateChange) this.onStateChange();
      return true;
    }
    return false;
  }

  clearGrid() {
    this.grid = this.createEmptyGrid(this.currentLevel.size);
    this.saveSnapshot();
    soundManager.playClear();
    if (this.onStateChange) this.onStateChange();
  }

  toggleClue(clueId) {
    if (this.crossedClues.has(clueId)) {
      this.crossedClues.delete(clueId);
    } else {
      this.crossedClues.add(clueId);
      soundManager.playClueCross();
    }
    if (this.onStateChange) this.onStateChange();
  }

  // Cycle cell: 0 (Empty) -> 1 (NO ❌) -> 2 (YES ✔️) -> 0 (Empty)
  cycleCell(matrix, row, col, targetVal) {
    if (this.isWon) return;
    const current = this.grid[matrix][row][col];
    let next;

    if (targetVal !== undefined) {
      next = targetVal;
    } else {
      if (current === 0) next = 1;
      else if (current === 1) next = 2;
      else next = 0;
    }

    if (next === 1) soundManager.playMarkNo();
    else if (next === 2) soundManager.playMarkYes();
    else soundManager.playClear();

    this.grid[matrix][row][col] = next;

    // Apply auto-deduction when marked YES (2)
    if (next === 2) {
      this.applyCrossDeductions(matrix, row, col);
    }

    this.saveSnapshot();
    this.checkWinCondition();

    if (this.onStateChange) this.onStateChange();
  }

  applyCrossDeductions(matrix, r, c) {
    const size = this.currentLevel.size;

    for (let i = 0; i < size; i++) {
      if (i !== c && this.grid[matrix][r][i] === 0) {
        this.grid[matrix][r][i] = 1;
      }
      if (i !== r && this.grid[matrix][i][c] === 0) {
        this.grid[matrix][i][c] = 1;
      }
    }

    this.propagateTransitivity();
  }

  propagateTransitivity() {
    const size = this.currentLevel.size;
    let changed = true;
    let iterations = 0;

    while (changed && iterations < 10) {
      changed = false;
      iterations++;

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          for (let k = 0; k < size; k++) {
            if (this.grid.AB[i][j] === 2 && this.grid.AC[i][k] === 2) {
              if (this.grid.BC[j][k] !== 2) {
                this.grid.BC[j][k] = 2;
                changed = true;
                for (let x = 0; x < size; x++) {
                  if (x !== k && this.grid.BC[j][x] === 0) this.grid.BC[j][x] = 1;
                  if (x !== j && this.grid.BC[x][k] === 0) this.grid.BC[x][k] = 1;
                }
              }
            }
            if (this.grid.AB[i][j] === 2 && this.grid.BC[j][k] === 2) {
              if (this.grid.AC[i][k] !== 2) {
                this.grid.AC[i][k] = 2;
                changed = true;
                for (let x = 0; x < size; x++) {
                  if (x !== k && this.grid.AC[i][x] === 0) this.grid.AC[i][x] = 1;
                  if (x !== i && this.grid.AC[x][k] === 0) this.grid.AC[x][k] = 1;
                }
              }
            }
            if (this.grid.AC[i][k] === 2 && this.grid.BC[j][k] === 2) {
              if (this.grid.AB[i][j] !== 2) {
                this.grid.AB[i][j] = 2;
                changed = true;
                for (let x = 0; x < size; x++) {
                  if (x !== j && this.grid.AB[i][x] === 0) this.grid.AB[i][x] = 1;
                  if (x !== i && this.grid.AB[x][j] === 0) this.grid.AB[x][j] = 1;
                }
              }
            }

            if (this.grid.AB[i][j] === 2 && this.grid.AC[i][k] === 1 && this.grid.BC[j][k] === 0) {
              this.grid.BC[j][k] = 1;
              changed = true;
            }
            if (this.grid.AB[i][j] === 2 && this.grid.BC[j][k] === 1 && this.grid.AC[i][k] === 0) {
              this.grid.AC[i][k] = 1;
              changed = true;
            }
            if (this.grid.AC[i][k] === 2 && this.grid.BC[j][k] === 1 && this.grid.AB[i][j] === 0) {
              this.grid.AB[i][j] = 1;
              changed = true;
            }
          }
        }
      }
    }
  }

  checkWinCondition() {
    if (this.isWon) return true;

    const sol = this.currentLevel.solution;

    const solAB = [];
    const solAC = [];
    const solBC = [];

    sol.forEach((triple) => {
      const archIdx = this.currentLevel.archeologists.findIndex((a) => a.id === triple.archeologist);
      const pyrIdx = this.currentLevel.pyramids.findIndex((p) => p.id === triple.pyramid);
      const relIdx = this.currentLevel.relics.findIndex((r) => r.id === triple.relic);

      if (archIdx >= 0 && pyrIdx >= 0) solAB.push({ r: archIdx, c: pyrIdx });
      if (archIdx >= 0 && relIdx >= 0) solAC.push({ r: archIdx, c: relIdx });
      if (pyrIdx >= 0 && relIdx >= 0) solBC.push({ r: pyrIdx, c: relIdx });
    });

    const allABYes = solAB.every((pair) => this.grid.AB[pair.r][pair.c] === 2);
    const allACYes = solAC.every((pair) => this.grid.AC[pair.r][pair.c] === 2);
    const allBCYes = solBC.every((pair) => this.grid.BC[pair.r][pair.c] === 2);

    const noConflicts =
      solAB.every((p) => this.grid.AB[p.r][p.c] !== 1) &&
      solAC.every((p) => this.grid.AC[p.r][p.c] !== 1) &&
      solBC.every((p) => this.grid.BC[p.r][p.c] !== 1);

    if (allABYes && allACYes && allBCYes && noConflicts) {
      this.isWon = true;
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      const timeInSec = Math.max(1, this.elapsedTime);

      this.save.unlockedLevel = Math.max(this.save.unlockedLevel, this.currentLevel.id + 1);
      this.save.completedLevels[this.currentLevel.id] = true;
      const prevBest = this.save.bestTimes[this.currentLevel.id];
      if (!prevBest || timeInSec < prevBest) {
        this.save.bestTimes[this.currentLevel.id] = timeInSec;
      }
      this.writeSave();

      soundManager.playWin();

      try {
        window.parent.postMessage({ type: 'win', time: timeInSec }, '*');
      } catch {
        // ignore iframe restrictions
      }

      if (this.onWinCallback) {
        this.onWinCallback(timeInSec);
      }

      return true;
    }
    return false;
  }

  grantHint() {
    this.hintsUsed++;
    soundManager.playHint();

    const sol = this.currentLevel.solution;

    for (const triple of sol) {
      const aIdx = this.currentLevel.archeologists.findIndex((a) => a.id === triple.archeologist);
      const pIdx = this.currentLevel.pyramids.findIndex((p) => p.id === triple.pyramid);
      const rIdx = this.currentLevel.relics.findIndex((r) => r.id === triple.relic);

      if (this.grid.AB[aIdx][pIdx] !== 2) {
        this.cycleCell('AB', aIdx, pIdx, 2);
        return {
          matrix: 'AB',
          r: aIdx,
          c: pIdx,
          val: 2,
          text: `Deciphered hieroglyph: ${this.currentLevel.archeologists[aIdx].name} explored the ${this.currentLevel.pyramids[pIdx].name}!`,
        };
      }
      if (this.grid.AC[aIdx][rIdx] !== 2) {
        this.cycleCell('AC', aIdx, rIdx, 2);
        return {
          matrix: 'AC',
          r: aIdx,
          c: rIdx,
          val: 2,
          text: `Deciphered hieroglyph: ${this.currentLevel.archeologists[aIdx].name} found the ${this.currentLevel.relics[rIdx].name}!`,
        };
      }
      if (this.grid.BC[pIdx][rIdx] !== 2) {
        this.cycleCell('BC', pIdx, rIdx, 2);
        return {
          matrix: 'BC',
          r: pIdx,
          c: rIdx,
          val: 2,
          text: `Deciphered hieroglyph: The ${this.currentLevel.pyramids[pIdx].name} contained the ${this.currentLevel.relics[rIdx].name}!`,
        };
      }
    }

    return null;
  }

  getConfirmedTriples() {
    const list = [];
    const size = this.currentLevel.size;

    for (let i = 0; i < size; i++) {
      const arch = this.currentLevel.archeologists[i];
      let pyrName;
      let relName;

      for (let j = 0; j < size; j++) {
        if (this.grid.AB[i][j] === 2) {
          pyrName = this.currentLevel.pyramids[j].name;
          break;
        }
      }
      for (let k = 0; k < size; k++) {
        if (this.grid.AC[i][k] === 2) {
          relName = this.currentLevel.relics[k].name;
          break;
        }
      }

      list.push({
        archeologist: arch.name,
        pyramid: pyrName,
        relic: relName,
      });
    }

    return list;
  }
}

export const gameState = new GameStateManager();
