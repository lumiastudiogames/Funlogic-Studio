// Game State and Local Storage Persistence
import { LevelSaveData } from './types';

const STORAGE_KEY = 'metro_subway_yard_save_v1';

export class GameStateManager {
  public saveData: LevelSaveData;
  public currentLevelId: number = 1;
  public hintsAvailable: number = 2; // initial free hints

  constructor() {
    this.saveData = this.loadSave();
  }

  private loadSave(): LevelSaveData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          unlockedLevel: parsed.unlockedLevel || 1,
          stars: parsed.stars || {},
          bestTimes: parsed.bestTimes || {}
        };
      }
    } catch {}

    return {
      unlockedLevel: 1,
      stars: {},
      bestTimes: {}
    };
  }

  public save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.saveData));
    } catch {}
  }

  public completeLevel(levelId: number, timeSec: number, targetTimeSec: number): { stars: number; isNewUnlock: boolean } {
    let stars = 1;
    if (timeSec <= targetTimeSec) stars = 3;
    else if (timeSec <= targetTimeSec * 1.4) stars = 2;

    const previousStars = this.saveData.stars[levelId] || 0;
    if (stars > previousStars) {
      this.saveData.stars[levelId] = stars;
    }

    const previousBest = this.saveData.bestTimes[levelId];
    if (!previousBest || timeSec < previousBest) {
      this.saveData.bestTimes[levelId] = timeSec;
    }

    const prevUnlocked = this.saveData.unlockedLevel;
    const nextLevel = Math.min(30, levelId + 1);
    this.saveData.unlockedLevel = Math.max(this.saveData.unlockedLevel, nextLevel);
    const isNewUnlock = this.saveData.unlockedLevel > prevUnlocked;

    this.save();
    return { stars, isNewUnlock };
  }

  public getTotalStars(): number {
    return Object.values(this.saveData.stars).reduce((acc, s) => acc + s, 0);
  }

  public getUnlockedLevel(): number {
    return this.saveData.unlockedLevel;
  }

  public unlockAllForTesting() {
    this.saveData.unlockedLevel = 30;
    this.save();
  }

  public resetProgress() {
    this.saveData = {
      unlockedLevel: 1,
      stars: {},
      bestTimes: {}
    };
    this.save();
  }
}

export const gameState = new GameStateManager();
