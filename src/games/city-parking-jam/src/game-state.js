import { ALL_LEVELS, SKINS_DATA, TRAILS_DATA } from './levels.js';
import { sound } from './audio.js';

const STORAGE_KEY = 'city_parking_jam_save_v1';

export class GameManager {
  constructor() {
    this.currentLevelIndex = 0;
    this.cars = [];
    this.obstacles = [];
    this.particles = [];
    this.movesCount = 0;
    this.isWon = false;
    this.moveHistory = [];
    this.listeners = [];

    // Screen coordinate caching
    this.cellSize = 48;
    this.gridPixelWidth = 0;
    this.gridPixelHeight = 0;
    this.gridOffsetX = 0;
    this.gridOffsetY = 0;

    // Load saved progress
    this.progress = this.loadProgress();

    // Load initial level
    this.loadLevel(this.progress.unlockedLevel || 1);
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          unlockedLevel: parsed.unlockedLevel || 1,
          totalStars: parsed.totalStars || 0,
          coins: parsed.coins || 0,
          levelStars: parsed.levelStars || {},
          levelBestMoves: parsed.levelBestMoves || {},
          activeSkin: parsed.activeSkin || 'default',
          activeTrail: parsed.activeTrail || 'smoke',
          unlockedSkins: parsed.unlockedSkins || ['default'],
          unlockedTrails: parsed.unlockedTrails || ['smoke'],
          soundEnabled: parsed.soundEnabled !== undefined ? parsed.soundEnabled : true,
          musicEnabled: parsed.musicEnabled !== undefined ? parsed.musicEnabled : true,
        };
      }
    } catch {
      // Fallback
    }

    return {
      unlockedLevel: 1,
      totalStars: 0,
      coins: 0,
      levelStars: {},
      levelBestMoves: {},
      activeSkin: 'default',
      activeTrail: 'smoke',
      unlockedSkins: ['default'],
      unlockedTrails: ['smoke'],
      soundEnabled: true,
      musicEnabled: true,
    };
  }

  saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch {
      // Fallback
    }
    this.notifyStateChange();
  }

  onStateChange(cb) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  notifyStateChange() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  loadLevel(levelNumber) {
    const targetIdx = Math.max(0, Math.min(ALL_LEVELS.length - 1, levelNumber - 1));
    this.currentLevelIndex = targetIdx;
    const def = ALL_LEVELS[targetIdx];

    this.isWon = false;
    this.movesCount = 0;
    this.moveHistory = [];
    this.particles = [];

    // Deep clone cars and set visual starting states
    this.cars = def.cars.map((c) => {
      let angle = 0;
      if (c.direction === 'DOWN') angle = Math.PI / 2;
      if (c.direction === 'LEFT') angle = Math.PI;
      if (c.direction === 'UP') angle = -Math.PI / 2;

      return {
        ...c,
        gridX: c.x,
        gridY: c.y,
        visualX: c.x,
        visualY: c.y,
        visualAngle: angle,
        state: 'parked',
        recoilTimer: 0,
        isHinted: false,
      };
    });

    this.obstacles = def.obstacles ? def.obstacles.map((o) => ({ ...o })) : [];
    this.notifyStateChange();
  }

  getCurrentLevelDef() {
    return ALL_LEVELS[this.currentLevelIndex];
  }

  getProgress() {
    return this.progress;
  }

  getCars() {
    return this.cars;
  }

  getObstacles() {
    return this.obstacles;
  }

  getParticles() {
    return this.particles;
  }

  getMovesCount() {
    return this.movesCount;
  }

  getIsWon() {
    return this.isWon;
  }

  setSound(enabled) {
    this.progress.soundEnabled = enabled;
    sound.setSoundEnabled(enabled);
    this.saveProgress();
  }

  setMusic(enabled) {
    this.progress.musicEnabled = enabled;
    sound.setMusicEnabled(enabled);
    this.saveProgress();
  }

  setSkin(skinId) {
    this.progress.activeSkin = skinId;
    this.saveProgress();
  }

  setTrail(trailId) {
    this.progress.activeTrail = trailId;
    this.saveProgress();
  }

  restartCurrentLevel() {
    this.loadLevel(this.currentLevelIndex + 1);
  }

  undoLastMove() {
    if (this.isWon || this.moveHistory.length === 0) return;
    const lastSnap = this.moveHistory.pop();
    if (!lastSnap) return;

    this.movesCount = Math.max(0, this.movesCount - 1);
    this.cars = lastSnap.cars.map((c) => ({ ...c }));
    sound.playClick();
    this.notifyStateChange();
  }

  tryMoveCar(carId) {
    if (this.isWon) return;
    const car = this.cars.find((c) => c.id === carId);
    if (!car || car.state !== 'parked') return;

    // Check if path is blocked
    const blockage = this.checkPathBlockage(car);

    if (blockage.isBlocked) {
      // Car bumps into obstacle / vehicle
      car.state = 'bumping';
      car.recoilTimer = 0.22;
      sound.playBump();
      this.spawnBumpSparks(car, blockage.blockerX, blockage.blockerY);
      return;
    }

    // Path is CLEAR! Record snapshot for Undo
    this.recordMoveSnapshot();
    this.movesCount++;

    // Launch car forward out of parking lot
    car.state = 'moving_exit';
    car.isHinted = false;
    sound.playVehicleMove(car.type, this.progress.activeSkin);

    this.notifyStateChange();
  }

  checkPathBlockage(targetCar) {
    const level = this.getCurrentLevelDef();
    const isHorizontal = targetCar.direction === 'LEFT' || targetCar.direction === 'RIGHT';
    const isForward = targetCar.direction === 'RIGHT' || targetCar.direction === 'DOWN';

    // Current car cells
    const occupiedCells = new Set();
    for (let i = 0; i < targetCar.length; i++) {
      const cx = isHorizontal ? targetCar.gridX + i : targetCar.gridX;
      const cy = !isHorizontal ? targetCar.gridY + i : targetCar.gridY;
      occupiedCells.add(`${cx},${cy}`);
    }

    let checkX = targetCar.gridX;
    let checkY = targetCar.gridY;

    if (targetCar.direction === 'RIGHT') {
      checkX = targetCar.gridX + targetCar.length;
      checkY = targetCar.gridY;
      while (checkX < level.gridWidth) {
        if (this.isCellBlocked(checkX, checkY, targetCar.id)) {
          return { isBlocked: true, blockerX: checkX, blockerY: checkY };
        }
        checkX++;
      }
    } else if (targetCar.direction === 'LEFT') {
      checkX = targetCar.gridX - 1;
      checkY = targetCar.gridY;
      while (checkX >= 0) {
        if (this.isCellBlocked(checkX, checkY, targetCar.id)) {
          return { isBlocked: true, blockerX: checkX, blockerY: checkY };
        }
        checkX--;
      }
    } else if (targetCar.direction === 'DOWN') {
      checkX = targetCar.gridX;
      checkY = targetCar.gridY + targetCar.length;
      while (checkY < level.gridHeight) {
        if (this.isCellBlocked(checkX, checkY, targetCar.id)) {
          return { isBlocked: true, blockerX: checkX, blockerY: checkY };
        }
        checkY++;
      }
    } else if (targetCar.direction === 'UP') {
      checkX = targetCar.gridX;
      checkY = targetCar.gridY - 1;
      while (checkY >= 0) {
        if (this.isCellBlocked(checkX, checkY, targetCar.id)) {
          return { isBlocked: true, blockerX: checkX, blockerY: checkY };
        }
        checkY--;
      }
    }

    return { isBlocked: false };
  }

  isCellBlocked(x, y, excludeCarId) {
    // 1. Check other parked cars
    for (const car of this.cars) {
      if (car.id === excludeCarId || car.state === 'exited') continue;
      const isHorizontal = car.direction === 'LEFT' || car.direction === 'RIGHT';
      for (let i = 0; i < car.length; i++) {
        const cx = isHorizontal ? car.gridX + i : car.gridX;
        const cy = !isHorizontal ? car.gridY + i : car.gridY;
        if (cx === x && cy === y) {
          return true;
        }
      }
    }

    // 2. Check obstacles
    for (const obs of this.obstacles) {
      if (x >= obs.x && x < obs.x + obs.width && y >= obs.y && y < obs.y + obs.height) {
        return true;
      }
    }

    return false;
  }

  recordMoveSnapshot() {
    this.moveHistory.push({
      cars: this.cars.map((c) => ({ ...c })),
    });
    if (this.moveHistory.length > 30) {
      this.moveHistory.shift();
    }
  }

  update(dt) {
    // 1. Update vehicle physics & animations
    for (const car of this.cars) {
      if (car.state === 'bumping') {
        car.recoilTimer -= dt;
        if (car.recoilTimer <= 0) {
          car.state = 'parked';
          car.visualX = car.gridX;
          car.visualY = car.gridY;
        } else {
          // Subtle recoil spring shake
          const shakeMag = Math.sin(car.recoilTimer * 40) * 0.12;
          if (car.direction === 'RIGHT') car.visualX = car.gridX + shakeMag;
          if (car.direction === 'LEFT') car.visualX = car.gridX - shakeMag;
          if (car.direction === 'DOWN') car.visualY = car.gridY + shakeMag;
          if (car.direction === 'UP') car.visualY = car.gridY - shakeMag;
        }
      } else if (car.state === 'moving_exit') {
        const speed = (car.type === 'van' ? 9.5 : car.type === 'suv' ? 12.5 : 15.0) * dt;

        if (car.direction === 'RIGHT') car.visualX += speed;
        if (car.direction === 'LEFT') car.visualX -= speed;
        if (car.direction === 'DOWN') car.visualY += speed;
        if (car.direction === 'UP') car.visualY -= speed;

        // Spawn exhaust particles
        this.spawnTrailParticle(car);

        // Check if car is far off screen bounds
        if (
          car.visualX < -6 ||
          car.visualX > 16 ||
          car.visualY < -6 ||
          car.visualY > 16
        ) {
          car.state = 'exited';
          this.checkWinCondition();
        }
      }
    }

    // 2. Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.gravity || 0) * dt;
      p.rotation += p.rotSpeed * dt;
      p.alpha -= (1 / p.life) * dt;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  checkWinCondition() {
    if (this.isWon) return;
    const remaining = this.cars.filter((c) => c.state !== 'exited');
    if (remaining.length === 0) {
      this.isWon = true;
      this.handleLevelCompleted();
    }
  }

  handleLevelCompleted() {
    const levelDef = this.getCurrentLevelDef();
    const lvlNum = levelDef.levelNumber;
    const par = levelDef.parMoves;

    let starsEarned = 1;
    if (this.movesCount <= par) {
      starsEarned = 3;
    } else if (this.movesCount <= par + 2) {
      starsEarned = 2;
    }

    const prevStars = this.progress.levelStars[lvlNum] || 0;
    if (starsEarned > prevStars) {
      this.progress.levelStars[lvlNum] = starsEarned;
    }

    // Recalculate total stars
    let total = 0;
    for (let l = 1; l <= 30; l++) {
      total += this.progress.levelStars[l] || 0;
    }
    this.progress.totalStars = total;

    // Coins reward
    const coinsWon = starsEarned * 10 + 15;
    this.progress.coins += coinsWon;

    // Check unlocks
    this.checkUnlockables();

    // Unlock next level
    if (lvlNum < 30) {
      this.progress.unlockedLevel = Math.max(this.progress.unlockedLevel, lvlNum + 1);
    }

    this.saveProgress();

    // Play Victory Audio & Confetti
    sound.playLevelWin();
    setTimeout(() => sound.playStarChime(0), 400);
    if (starsEarned >= 2) setTimeout(() => sound.playStarChime(1), 700);
    if (starsEarned >= 3) setTimeout(() => sound.playStarChime(2), 1000);

    this.spawnConfettiExplosion();
    this.notifyStateChange();
  }

  checkUnlockables() {
    const stars = this.progress.totalStars;

    // Skins
    for (const skin of SKINS_DATA) {
      if (stars >= skin.starsRequired && !this.progress.unlockedSkins.includes(skin.id)) {
        this.progress.unlockedSkins.push(skin.id);
      }
    }

    // Trails
    for (const trail of TRAILS_DATA) {
      if (stars >= trail.starsRequired && !this.progress.unlockedTrails.includes(trail.id)) {
        this.progress.unlockedTrails.push(trail.id);
      }
    }
  }

  revealHint() {
    // Find unblocked cars
    const unblockedCars = this.cars.filter((c) => c.state === 'parked' && !this.checkPathBlockage(c).isBlocked);

    if (unblockedCars.length > 0) {
      // Pick first optimal car
      const target = unblockedCars[0];
      target.isHinted = true;
      this.notifyStateChange();
    }
  }

  spawnBumpSparks(car, bx, by) {
    const px = this.gridOffsetX + (bx !== undefined ? bx : car.gridX) * this.cellSize + this.cellSize / 2;
    const py = this.gridOffsetY + (by !== undefined ? by : car.gridY) * this.cellSize + this.cellSize / 2;

    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 100;
      this.particles.push({
        id: Math.random().toString(),
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#facc15',
        size: 3 + Math.random() * 3,
        alpha: 1,
        life: 0.35,
        rotation: 0,
        rotSpeed: 5,
        shape: 'spark',
      });
    }
  }

  spawnTrailParticle(car) {
    const trail = this.progress.activeTrail;
    const isHorizontal = car.direction === 'LEFT' || car.direction === 'RIGHT';
    const carW = (isHorizontal ? car.length : 1) * this.cellSize;
    const carH = (!isHorizontal ? car.length : 1) * this.cellSize;

    const px = this.gridOffsetX + car.visualX * this.cellSize + carW / 2;
    const py = this.gridOffsetY + car.visualY * this.cellSize + carH / 2;

    let col = '#e2e8f0';
    let shp = 'smoke';

    if (trail === 'nitro') {
      col = '#38bdf8';
      shp = 'smoke';
    } else if (trail === 'spark') {
      col = '#f59e0b';
      shp = 'spark';
    } else if (trail === 'rainbow') {
      const colors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#c084fc'];
      col = colors[Math.floor(Math.random() * colors.length)];
      shp = 'circle';
    }

    this.particles.push({
      id: Math.random().toString(),
      x: px + (Math.random() * 8 - 4),
      y: py + (Math.random() * 8 - 4),
      vx: (Math.random() * 20 - 10),
      vy: (Math.random() * 20 - 10),
      color: col,
      size: 4 + Math.random() * 6,
      alpha: 0.8,
      life: 0.45,
      rotation: Math.random() * Math.PI,
      rotSpeed: 2,
      shape: shp,
    });
  }

  spawnConfettiExplosion() {
    const cx = this.gridOffsetX + this.gridPixelWidth / 2;
    const cy = this.gridOffsetY + this.gridPixelHeight / 2;
    const colors = ['#38bdf8', '#facc15', '#f43f5e', '#4ade80', '#c084fc', '#fb923c'];

    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 120 + Math.random() * 260;
      this.particles.push({
        id: Math.random().toString(),
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 100,
        gravity: 280,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 6,
        alpha: 1,
        life: 1.6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: Math.random() * 10 - 5,
        shape: Math.random() > 0.5 ? 'star' : 'square',
      });
    }
  }

  getCarAtScreenCoord(screenX, screenY) {
    for (const car of this.cars) {
      if (car.state !== 'parked') continue;
      const isHorizontal = car.direction === 'LEFT' || car.direction === 'RIGHT';
      const w = (isHorizontal ? car.length : 1) * this.cellSize;
      const h = (!isHorizontal ? car.length : 1) * this.cellSize;
      const px = this.gridOffsetX + car.visualX * this.cellSize;
      const py = this.gridOffsetY + car.visualY * this.cellSize;

      if (screenX >= px && screenX <= px + w && screenY >= py && screenY <= py + h) {
        return car;
      }
    }
    return null;
  }
}
