import {
  LEVELS,
  DIGIT_SEGMENTS,
  OPERATOR_SEGMENTS,
  segmentsToDigit,
  segmentsToOperator,
  isEquationMathematicallyTrue,
} from './levels.js';
import { audio } from './audio.js';

const STORAGE_KEY = 'matchstick_logic_save_v1';

export class GameStateManager {
  constructor() {
    this.currentLevelIndex = 0;
    this.segments = [];
    this.heldMatch = null;
    this.moveHistory = [];
    this.levelStartTime = Date.now();
    this.initialMatchCount = 0;
    this.isWon = false;
    this.onWinCallback = null;
    this.onStateChangeCallback = null;

    this.save = this.loadSave();
    this.initLevel();
  }

  loadSave() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return {
      unlockedLevel: 1,
      completedLevels: [],
      bestTimes: {},
      soundEnabled: true,
      hintsAvailable: 3,
    };
  }

  persistSave() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.save));
    } catch {
      // Ignore
    }
  }

  getSave() {
    return this.save;
  }

  getCurrentLevel() {
    return LEVELS[this.currentLevelIndex] || LEVELS[0];
  }

  getCurrentLevelIndex() {
    return this.currentLevelIndex;
  }

  setLevel(levelIndex) {
    if (levelIndex < 0 || levelIndex >= LEVELS.length) return;
    this.currentLevelIndex = levelIndex;
    this.initLevel();
  }

  nextLevel() {
    if (this.currentLevelIndex < LEVELS.length - 1) {
      this.currentLevelIndex++;
      this.initLevel();
      return true;
    }
    return false;
  }

  setCallbacks(onWin, onStateChange) {
    this.onWinCallback = onWin;
    this.onStateChangeCallback = onStateChange;
  }

  initLevel() {
    this.isWon = false;
    this.heldMatch = null;
    this.moveHistory = [];
    this.levelStartTime = Date.now();
    this.buildSegmentsForCurrentLevel();
    this.notifyStateChange();
  }

  resetLevel() {
    audio.playClick();
    this.initLevel();
  }

  buildSegmentsForCurrentLevel() {
    const level = this.getCurrentLevel();
    const chars = level.initialEquation.split('');
    this.segments = [];
    let matchCount = 0;

    chars.forEach((char, charIdx) => {
      if (char >= '0' && char <= '9') {
        const activeSegs = DIGIT_SEGMENTS[char] || [];
        for (let segIdx = 0; segIdx < 7; segIdx++) {
          const hasMatch = activeSegs.includes(segIdx);
          if (hasMatch) matchCount++;
          this.segments.push({
            id: `char-${charIdx}-seg-${segIdx}`,
            charIndex: charIdx,
            segIndex: segIdx,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            hasMatch,
            isInitial: hasMatch,
          });
        }
      } else if (char === '+' || char === '-') {
        const activeSegs = OPERATOR_SEGMENTS[char] || [];
        for (let segIdx = 0; segIdx < 2; segIdx++) {
          const hasMatch = activeSegs.includes(segIdx);
          if (hasMatch) matchCount++;
          this.segments.push({
            id: `char-${charIdx}-seg-${segIdx}`,
            charIndex: charIdx,
            segIndex: segIdx,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            hasMatch,
            isInitial: hasMatch,
          });
        }
      } else if (char === '=') {
        for (let segIdx = 0; segIdx < 2; segIdx++) {
          matchCount++;
          this.segments.push({
            id: `char-${charIdx}-seg-${segIdx}`,
            charIndex: charIdx,
            segIndex: segIdx,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            hasMatch: true,
            isInitial: true,
          });
        }
      }
    });

    this.initialMatchCount = matchCount;
  }

  getSegments() {
    return this.segments;
  }

  getHeldMatch() {
    return this.heldMatch;
  }

  getMovesCount() {
    return this.moveHistory.length;
  }

  getInitialMatchCount() {
    return this.initialMatchCount;
  }

  getCurrentMatchCount() {
    return this.segments.filter(s => s.hasMatch).length + (this.heldMatch ? 1 : 0);
  }

  isLevelWon() {
    return this.isWon;
  }

  getElapsedTime() {
    return Math.floor((Date.now() - this.levelStartTime) / 1000);
  }

  pickUpMatch(seg) {
    if (this.isWon || !seg.hasMatch) return false;
    if (this.moveHistory.length >= 1) {
      audio.playError();
      return false;
    }

    seg.hasMatch = false;
    this.heldMatch = {
      charIndex: seg.charIndex,
      segIndex: seg.segIndex,
      initialSegment: seg,
    };
    audio.playPickup();
    this.notifyStateChange();
    return true;
  }

  placeHeldMatch(targetSeg) {
    if (this.isWon || !this.heldMatch) return false;

    if (this.heldMatch.charIndex === targetSeg.charIndex && this.heldMatch.segIndex === targetSeg.segIndex) {
      targetSeg.hasMatch = true;
      this.heldMatch = null;
      audio.playPlace();
      this.notifyStateChange();
      return true;
    }

    if (!targetSeg.hasMatch) {
      targetSeg.hasMatch = true;
      const move = {
        from: { charIndex: this.heldMatch.charIndex, segIndex: this.heldMatch.segIndex },
        to: { charIndex: targetSeg.charIndex, segIndex: targetSeg.segIndex },
      };
      this.moveHistory.push(move);
      this.heldMatch = null;
      audio.playPlace();

      this.checkWinCondition();
      this.notifyStateChange();
      return true;
    }

    return false;
  }

  cancelHeldMatch() {
    if (!this.heldMatch) return false;
    const origSeg = this.segments.find(
      s => s.charIndex === this.heldMatch.charIndex && s.segIndex === this.heldMatch.segIndex
    );
    if (origSeg) {
      origSeg.hasMatch = true;
    }
    this.heldMatch = null;
    audio.playPlace();
    this.notifyStateChange();
    return true;
  }

  handleSegmentClick(seg) {
    if (this.isWon) return false;

    if (!this.heldMatch) {
      return this.pickUpMatch(seg);
    }

    return this.placeHeldMatch(seg);
  }

  undoMove() {
    if (this.isWon) return false;

    if (this.heldMatch) {
      const origSeg = this.segments.find(
        s => s.charIndex === this.heldMatch.charIndex && s.segIndex === this.heldMatch.segIndex
      );
      if (origSeg) {
        origSeg.hasMatch = true;
      }
      this.heldMatch = null;
      audio.playPlace();
      this.notifyStateChange();
      return true;
    }

    if (this.moveHistory.length === 0) return false;

    const lastMove = this.moveHistory.pop();
    const toSeg = this.segments.find(
      s => s.charIndex === lastMove.to.charIndex && s.segIndex === lastMove.to.segIndex
    );
    const fromSeg = this.segments.find(
      s => s.charIndex === lastMove.from.charIndex && s.segIndex === lastMove.from.segIndex
    );

    if (toSeg) toSeg.hasMatch = false;
    if (fromSeg) fromSeg.hasMatch = true;

    audio.playPickup();
    this.notifyStateChange();
    return true;
  }

  parseCurrentEquation() {
    const level = this.getCurrentLevel();
    const chars = level.initialEquation.split('');
    const parsedChars = [];
    let isValidLayout = true;

    for (let charIdx = 0; charIdx < chars.length; charIdx++) {
      const origChar = chars[charIdx];
      if (origChar >= '0' && origChar <= '9') {
        const charSegs = this.segments
          .filter(s => s.charIndex === charIdx && s.hasMatch)
          .map(s => s.segIndex);
        const digit = segmentsToDigit(charSegs);
        if (digit !== null) {
          parsedChars.push(digit);
        } else {
          parsedChars.push('?');
          isValidLayout = false;
        }
      } else if (origChar === '+' || origChar === '-') {
        const charSegs = this.segments
          .filter(s => s.charIndex === charIdx && s.hasMatch)
          .map(s => s.segIndex);
        const op = segmentsToOperator(charSegs);
        if (op !== null) {
          parsedChars.push(op);
        } else {
          parsedChars.push('?');
          isValidLayout = false;
        }
      } else if (origChar === '=') {
        parsedChars.push('=');
      }
    }

    const eqStr = parsedChars.join('');
    const isTrue = isValidLayout && !this.heldMatch && isEquationMathematicallyTrue(eqStr);

    return {
      equationString: eqStr,
      isValidEquation: isValidLayout,
      isTrue,
    };
  }

  checkWinCondition() {
    const { isTrue } = this.parseCurrentEquation();
    if (isTrue && !this.heldMatch && this.moveHistory.length === 1) {
      this.isWon = true;
      audio.playVictory();

      const elapsed = this.getElapsedTime();
      const levelId = this.getCurrentLevel().id;

      if (!this.save.completedLevels.includes(levelId)) {
        this.save.completedLevels.push(levelId);
      }
      this.save.unlockedLevel = Math.max(this.save.unlockedLevel, levelId + 1);
      if (!this.save.bestTimes[levelId] || elapsed < this.save.bestTimes[levelId]) {
        this.save.bestTimes[levelId] = elapsed;
      }
      this.persistSave();

      if (this.onWinCallback) {
        this.onWinCallback(elapsed);
      }
      try {
        window.parent.postMessage({ type: 'win', time: elapsed }, '*');
      } catch {
        // Standalone
      }
    }
  }

  addHints(amount) {
    this.save.hintsAvailable += amount;
    this.persistSave();
    this.notifyStateChange();
  }

  useHint() {
    if (this.save.hintsAvailable > 0) {
      this.save.hintsAvailable--;
      this.persistSave();
      audio.playHintUnlock();
      this.notifyStateChange();
      return true;
    }
    return false;
  }

  notifyStateChange() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback();
    }
  }
}
