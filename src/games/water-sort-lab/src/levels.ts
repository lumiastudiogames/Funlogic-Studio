import { LevelConfig, ColorId } from './types';

export const PRESET_LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Level 1 - Lab Basics',
    hint: 'Tap a tube to select the top liquid layer, then tap the empty tube to pour.',
    parMoves: 4,
    tubes: [
      ['yellow', 'blue', 'yellow', 'blue'],
      ['blue', 'yellow', 'blue', 'yellow'],
      [],
    ],
  },
  {
    id: 2,
    name: 'Level 2 - Three Solutions',
    hint: 'Separate Pink, Yellow, and Blue. You can only stack matching colors together!',
    parMoves: 6,
    tubes: [
      ['pink', 'yellow', 'blue', 'pink'],
      ['yellow', 'blue', 'yellow', 'pink'],
      ['blue', 'pink', 'blue', 'yellow'],
      [],
    ],
  },
  {
    id: 3,
    name: 'Level 3 - Dual Reservoirs',
    hint: 'Two empty tubes give you plenty of room to maneuver the chemicals.',
    parMoves: 7,
    tubes: [
      ['green', 'orange', 'green', 'orange'],
      ['orange', 'teal', 'green', 'teal'],
      ['teal', 'green', 'orange', 'teal'],
      [],
      [],
    ],
  },
  {
    id: 4,
    name: 'Level 4 - Chemical Compound',
    hint: 'Focus on isolating one full color first to free up a test tube.',
    parMoves: 9,
    tubes: [
      ['purple', 'yellow', 'pink', 'teal'],
      ['teal', 'pink', 'yellow', 'purple'],
      ['pink', 'teal', 'purple', 'yellow'],
      ['yellow', 'purple', 'teal', 'pink'],
      [],
    ],
  },
  {
    id: 5,
    name: 'Level 5 - Vibrant Reactions',
    hint: 'Try to clear one tube completely in your first few moves.',
    parMoves: 10,
    tubes: [
      ['blue', 'orange', 'green', 'pink'],
      ['pink', 'green', 'blue', 'orange'],
      ['orange', 'pink', 'green', 'blue'],
      ['green', 'blue', 'orange', 'pink'],
      [],
      [],
    ],
  },
  {
    id: 6,
    name: 'Level 6 - Five Elements',
    hint: 'Plan two moves ahead before transferring the top layer.',
    parMoves: 12,
    tubes: [
      ['red', 'yellow', 'blue', 'green'],
      ['green', 'purple', 'red', 'yellow'],
      ['purple', 'blue', 'green', 'red'],
      ['yellow', 'red', 'purple', 'blue'],
      ['blue', 'green', 'yellow', 'purple'],
      [],
      [],
    ],
  },
  {
    id: 7,
    name: 'Level 7 - Lab Master Challenge',
    hint: 'The classic layout! Pour the blue and yellow layers to clear way for green and orange.',
    parMoves: 12,
    tubes: [
      ['teal', 'purple'], // 2 filled
      ['green', 'yellow', 'pink', 'blue'],
      ['orange', 'pink', 'yellow', 'yellow'],
      ['purple', 'orange', 'teal', 'teal'],
      ['pink', 'pink', 'green', 'blue'],
      ['orange', 'green', 'green', 'blue'],
      ['purple', 'purple', 'orange', 'teal'],
      [],
      [],
    ],
  },
  {
    id: 8,
    name: 'Level 8 - Prismatic Spectrum',
    hint: 'Grouping warm colors (Orange and Yellow) helps organize the rest.',
    parMoves: 14,
    tubes: [
      ['orange', 'teal', 'purple', 'pink'],
      ['yellow', 'green', 'orange', 'blue'],
      ['purple', 'blue', 'green', 'yellow'],
      ['pink', 'teal', 'blue', 'green'],
      ['green', 'yellow', 'pink', 'teal'],
      ['blue', 'orange', 'purple', 'teal'],
      [],
      [],
    ],
  },
  {
    id: 9,
    name: 'Level 9 - High Density',
    hint: 'Every completed tube makes the remaining moves much easier.',
    parMoves: 15,
    tubes: [
      ['red', 'blue', 'violet', 'yellow'],
      ['green', 'red', 'orange', 'blue'],
      ['yellow', 'violet', 'green', 'red'],
      ['orange', 'green', 'yellow', 'violet'],
      ['blue', 'orange', 'red', 'green'],
      ['violet', 'yellow', 'blue', 'orange'],
      [],
      [],
    ],
  },
  {
    id: 10,
    name: 'Level 10 - Master of Alchemy',
    hint: 'Be careful not to block the empty tube with just 1 unit of color.',
    parMoves: 18,
    tubes: [
      ['teal', 'purple', 'orange', 'lime'],
      ['lime', 'pink', 'teal', 'yellow'],
      ['yellow', 'orange', 'purple', 'lime'],
      ['pink', 'teal', 'yellow', 'orange'],
      ['purple', 'lime', 'pink', 'teal'],
      ['orange', 'yellow', 'lime', 'pink'],
      [],
      [],
    ],
  },
];

/**
 * Creates a procedurally generated solvable level for infinite replayability!
 */
export function generateRandomLevel(levelNum: number): LevelConfig {
  const colorPool: ColorId[] = ['teal', 'purple', 'blue', 'pink', 'yellow', 'green', 'orange', 'red', 'violet', 'lime'];
  const numColors = Math.min(8, Math.max(3, Math.floor(3 + levelNum * 0.4)));
  const selectedColors = colorPool.slice(0, numColors);
  
  // 4 segments per color
  const allSegments: ColorId[] = [];
  selectedColors.forEach(c => {
    allSegments.push(c, c, c, c);
  });

  // Fisher-Yates shuffle
  for (let i = allSegments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allSegments[i], allSegments[j]] = [allSegments[j], allSegments[i]];
  }

  const tubes: ColorId[][] = [];
  for (let i = 0; i < numColors; i++) {
    tubes.push(allSegments.slice(i * 4, (i + 1) * 4));
  }

  // Add 2 empty tubes
  tubes.push([]);
  tubes.push([]);

  return {
    id: levelNum,
    name: `Level ${levelNum} - Procedural`,
    hint: 'Transfer matching layers to organize the test tubes.',
    parMoves: numColors * 3 + 2,
    tubes,
  };
}

export function getLevelConfig(levelIndex: number): LevelConfig {
  if (levelIndex >= 0 && levelIndex < PRESET_LEVELS.length) {
    // Return deep copy
    const base = PRESET_LEVELS[levelIndex];
    return {
      ...base,
      tubes: base.tubes.map(t => [...t]),
    };
  }
  return generateRandomLevel(levelIndex + 1);
}
