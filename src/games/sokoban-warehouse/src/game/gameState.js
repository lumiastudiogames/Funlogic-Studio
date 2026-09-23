import { sound } from '../audio/sound.js';

const STORAGE_KEY = 'sokoban_warehouse_save_v1';

export function loadSaveData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        unlockedLevels: parsed.unlockedLevels || 1,
        bestMoves: parsed.bestMoves || {},
        stars: parsed.stars || {},
        soundEnabled: parsed.soundEnabled !== false,
      };
    }
  } catch {
  }
  return {
    unlockedLevels: 1,
    bestMoves: {},
    stars: {},
    soundEnabled: true,
  };
}

export function writeSaveData(save) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {
  }
}

export class SokobanGame {
  constructor(level) {
    this.level = level;
    this.grid = [];
    this.cols = 0;
    this.rows = 0;
    this.player = { x: 0, y: 0 };
    this.playerVisual = { x: 0, y: 0 };
    this.playerFacing = 'down';
    this.isPushing = false;
    this.targets = [];
    this.crates = [];
    this.decorations = [];
    this.validFloor = new Set();
    this.moves = 0;
    this.history = [];
    this.isCompleted = false;
    this.animProgress = 1.0;
    this.animDuration = 0.12;
    this.onWinCallback = null;
    this.onStateChange = null;

    this.initLevel(level);
  }

  initLevel(level) {
    this.level = level;
    this.moves = 0;
    this.history = [];
    this.isCompleted = false;
    this.targets = [];
    this.crates = [];
    this.isPushing = false;
    this.animProgress = 1.0;

    const lines = level.grid;
    this.rows = lines.length;
    this.cols = Math.max(...lines.map(l => l.length));
    this.grid = [];

    let crateId = 1;

    for (let y = 0; y < this.rows; y++) {
      const row = [];
      const line = lines[y] || '';
      for (let x = 0; x < this.cols; x++) {
        const char = line[x] || ' ';
        if (char === '#') {
          row.push('#');
        } else if (char === '.') {
          row.push(' ');
          this.targets.push({ x, y });
        } else if (char === '$') {
          row.push(' ');
          this.crates.push({
            id: crateId++,
            grid: { x, y },
            visual: { x, y },
            onTarget: false,
          });
        } else if (char === '*') {
          row.push(' ');
          this.targets.push({ x, y });
          this.crates.push({
            id: crateId++,
            grid: { x, y },
            visual: { x, y },
            onTarget: true,
          });
        } else if (char === '@') {
          row.push(' ');
          this.player = { x, y };
          this.playerVisual = { x, y };
        } else if (char === '+') {
          row.push(' ');
          this.targets.push({ x, y });
          this.player = { x, y };
          this.playerVisual = { x, y };
        } else {
          row.push(char);
        }
      }
      this.grid.push(row);
    }

    this.updateCrateTargets();

    this.decorations = level.decorations ? [...level.decorations] : [];

    const reachable = new Set();
    const queue = [{ x: this.player.x, y: this.player.y }];
    reachable.add(`${this.player.x},${this.player.y}`);
    while (queue.length > 0) {
      const cur = queue.shift();
      const neighbors = [
        { x: cur.x + 1, y: cur.y },
        { x: cur.x - 1, y: cur.y },
        { x: cur.x, y: cur.y + 1 },
        { x: cur.x, y: cur.y - 1 },
      ];
      for (const n of neighbors) {
        if (n.x >= 0 && n.x < this.cols && n.y >= 0 && n.y < this.rows) {
          const key = `${n.x},${n.y}`;
          if (!reachable.has(key) && this.grid[n.y][n.x] !== '#') {
            reachable.add(key);
            queue.push(n);
          }
        }
      }
    }
    this.validFloor = reachable;

    this.onStateChange?.();
  }

  updateCrateTargets() {
    for (const crate of this.crates) {
      crate.onTarget = this.targets.some(t => t.x === crate.grid.x && t.y === crate.grid.y);
    }
  }

  getCrateAt(x, y) {
    return this.crates.find(c => c.grid.x === x && c.grid.y === y);
  }

  hasDecoration(x, y) {
    return this.decorations.some(d => d.x === x && d.y === y);
  }

  isBlocked(x, y) {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return true;
    if (this.grid[y][x] === '#') return true;
    if (!this.validFloor.has(`${x},${y}`)) return true;
    if (this.hasDecoration(x, y)) return true;
    return false;
  }

  isWall(x, y) {
    return this.isBlocked(x, y);
  }

  move(dir) {
    if (this.isCompleted) return false;

    this.playerFacing = dir;

    const delta = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    }[dir];

    const nextP = { x: this.player.x + delta.x, y: this.player.y + delta.y };

    if (this.isBlocked(nextP.x, nextP.y)) {
      sound.playBump();
      return false;
    }

    const crate = this.getCrateAt(nextP.x, nextP.y);

    if (crate) {
      const nextCrateP = { x: crate.grid.x + delta.x, y: crate.grid.y + delta.y };

      if (this.isBlocked(nextCrateP.x, nextCrateP.y) || this.getCrateAt(nextCrateP.x, nextCrateP.y)) {
        sound.playBump();
        return false;
      }

      const wasOnTarget = crate.onTarget;
      const crateOld = { ...crate.grid };

      crate.grid = nextCrateP;
      this.updateCrateTargets();
      const nowOnTarget = crate.onTarget;

      const oldP = { ...this.player };
      this.player = nextP;
      this.isPushing = true;
      this.animProgress = 0;

      this.history.push({
        playerFrom: oldP,
        playerTo: nextP,
        playerDir: dir,
        crateMoved: {
          from: crateOld,
          to: nextCrateP,
          wasOnTarget,
          nowOnTarget,
        },
      });

      this.moves++;
      sound.playPushCrate();

      if (nowOnTarget && !wasOnTarget) {
        sound.playTargetChime();
      }

      this.checkCompletion();
      this.onStateChange?.();
      return true;
    } else {
      const oldP = { ...this.player };
      this.player = nextP;
      this.isPushing = false;
      this.animProgress = 0;

      this.history.push({
        playerFrom: oldP,
        playerTo: nextP,
        playerDir: dir,
      });

      this.moves++;
      sound.playFootstep();
      this.onStateChange?.();
      return true;
    }
  }

  undo() {
    if (this.history.length === 0 || this.isCompleted) return false;

    const last = this.history.pop();
    this.player = { ...last.playerFrom };
    this.playerFacing = last.playerDir;
    this.playerVisual = { ...this.player };
    this.isPushing = false;
    this.animProgress = 1.0;

    if (last.crateMoved) {
      const crate = this.getCrateAt(last.crateMoved.to.x, last.crateMoved.to.y);
      if (crate) {
        crate.grid = { ...last.crateMoved.from };
        crate.visual = { ...crate.grid };
        this.updateCrateTargets();
      }
    }

    if (this.moves > 0) this.moves--;
    sound.playUndo();
    this.onStateChange?.();
    return true;
  }

  reset() {
    this.initLevel(this.level);
    sound.playClick();
  }

  updateAnimation(dt) {
    if (this.animProgress < 1.0) {
      this.animProgress = Math.min(1.0, this.animProgress + dt / this.animDuration);
      const t = this.animProgress;
      const ease = 1 - Math.pow(1 - t, 2);

      const last = this.history[this.history.length - 1];
      if (last) {
        this.playerVisual.x = last.playerFrom.x + (last.playerTo.x - last.playerFrom.x) * ease;
        this.playerVisual.y = last.playerFrom.y + (last.playerTo.y - last.playerFrom.y) * ease;

        if (last.crateMoved) {
          const crate = this.getCrateAt(last.crateMoved.to.x, last.crateMoved.to.y);
          if (crate) {
            crate.visual.x = last.crateMoved.from.x + (last.crateMoved.to.x - last.crateMoved.from.x) * ease;
            crate.visual.y = last.crateMoved.from.y + (last.crateMoved.to.y - last.crateMoved.from.y) * ease;
          }
        }
      }
    } else {
      this.playerVisual.x = this.player.x;
      this.playerVisual.y = this.player.y;
      for (const crate of this.crates) {
        crate.visual.x = crate.grid.x;
        crate.visual.y = crate.grid.y;
      }
      this.isPushing = false;
    }
  }

  checkCompletion() {
    const allPlaced = this.targets.every(t => this.crates.some(c => c.grid.x === t.x && c.grid.y === t.y));
    if (allPlaced && !this.isCompleted) {
      this.isCompleted = true;
      sound.playWinFanfare();

      const save = loadSaveData();
      save.unlockedLevels = Math.max(save.unlockedLevels, this.level.id + 1);

      const currentBest = save.bestMoves[this.level.id];
      if (!currentBest || this.moves < currentBest) {
        save.bestMoves[this.level.id] = this.moves;
      }

      let stars = 1;
      if (this.moves <= this.level.parMoves) {
        stars = 3;
      } else if (this.moves <= Math.floor(this.level.parMoves * 1.5)) {
        stars = 2;
      }
      const existingStars = save.stars[this.level.id] || 0;
      save.stars[this.level.id] = Math.max(existingStars, stars);

      writeSaveData(save);

      setTimeout(() => {
        this.onWinCallback?.();
      }, 350);
    }
  }

  checkDeadlock() {
    for (const crate of this.crates) {
      if (crate.onTarget) continue;

      const x = crate.grid.x;
      const y = crate.grid.y;

      const wallUp = this.isWall(x, y - 1);
      const wallDown = this.isWall(x, y + 1);
      const wallLeft = this.isWall(x - 1, y);
      const wallRight = this.isWall(x + 1, y);

      if ((wallUp && wallLeft) || (wallUp && wallRight) || (wallDown && wallLeft) || (wallDown && wallRight)) {
        return true;
      }
    }
    return false;
  }

  getHint() {
    const unplacedCrates = this.crates.filter(c => !c.onTarget);
    if (unplacedCrates.length === 0) return null;

    const emptyTargets = this.targets.filter(t => !this.crates.some(c => c.grid.x === t.x && c.grid.y === t.y));
    if (emptyTargets.length === 0) return null;

    let bestCrate = unplacedCrates[0];
    let bestDist = 9999;
    let targetGoal = emptyTargets[0];

    for (const crate of unplacedCrates) {
      for (const tgt of emptyTargets) {
        const d = Math.abs(crate.grid.x - tgt.x) + Math.abs(crate.grid.y - tgt.y);
        if (d < bestDist) {
          bestDist = d;
          bestCrate = crate;
          targetGoal = tgt;
        }
      }
    }

    let dir = 'right';
    if (targetGoal.x > bestCrate.grid.x && !this.isWall(bestCrate.grid.x + 1, bestCrate.grid.y)) {
      dir = 'right';
    } else if (targetGoal.x < bestCrate.grid.x && !this.isWall(bestCrate.grid.x - 1, bestCrate.grid.y)) {
      dir = 'left';
    } else if (targetGoal.y > bestCrate.grid.y && !this.isWall(bestCrate.grid.x, bestCrate.grid.y + 1)) {
      dir = 'down';
    } else if (targetGoal.y < bestCrate.grid.y && !this.isWall(bestCrate.grid.x, bestCrate.grid.y - 1)) {
      dir = 'up';
    }

    return {
      crate: bestCrate.grid,
      direction: dir,
      explanation: `Push the highlighted cargo crate toward the open green storage target. Avoid trapping it into wall corners!`,
    };
  }
}
