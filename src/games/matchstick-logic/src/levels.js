export const DIGIT_SEGMENTS = {
  '0': [0, 1, 2, 4, 5, 6],       // 6 sticks
  '1': [2, 5],                   // 2 sticks (right side)
  '2': [0, 2, 3, 4, 6],          // 5 sticks
  '3': [0, 2, 3, 5, 6],          // 5 sticks
  '4': [1, 2, 3, 5],             // 4 sticks
  '5': [0, 1, 3, 5, 6],          // 5 sticks
  '6': [0, 1, 3, 4, 5, 6],       // 6 sticks
  '7': [0, 2, 5],                // 3 sticks
  '8': [0, 1, 2, 3, 4, 5, 6],    // 7 sticks
  '9': [0, 1, 2, 3, 5, 6],       // 6 sticks
};

export const OPERATOR_SEGMENTS = {
  '+': [0, 1], // 0: horiz, 1: vert
  '-': [0],    // 0: horiz, (1 is empty vert slot)
  '=': [0, 1], // 0: top horiz, 1: bot horiz
};

/**
 * Checks if a given segment array matches any digit 0-9
 */
export function segmentsToDigit(segIndices) {
  const sorted = [...segIndices].sort((a, b) => a - b).join(',');
  for (const [digit, segs] of Object.entries(DIGIT_SEGMENTS)) {
    if ([...segs].sort((a, b) => a - b).join(',') === sorted) {
      return digit;
    }
  }
  return null;
}

/**
 * Checks if a given segment array matches an operator (+ or -)
 */
export function segmentsToOperator(segIndices) {
  const sorted = [...segIndices].sort((a, b) => a - b).join(',');
  if (sorted === '0') return '-';
  if (sorted === '0,1') return '+';
  return null;
}

/**
 * Validates whether an equation string like "6+3=9" is mathematically correct
 */
export function isEquationMathematicallyTrue(eqStr) {
  const parts = eqStr.split('=');
  if (parts.length !== 2) return false;

  const left = parts[0].trim();
  const right = parts[1].trim();

  const rightVal = parseInt(right, 10);
  if (isNaN(rightVal)) return false;

  if (left.includes('+')) {
    const operands = left.split('+');
    if (operands.length !== 2) return false;
    const a = parseInt(operands[0], 10);
    const b = parseInt(operands[1], 10);
    if (isNaN(a) || isNaN(b)) return false;
    return a + b === rightVal;
  } else if (left.includes('-')) {
    const operands = left.split('-');
    if (operands.length !== 2) return false;
    const a = parseInt(operands[0], 10);
    const b = parseInt(operands[1], 10);
    if (isNaN(a) || isNaN(b)) return false;
    return a - b === rightVal;
  }

  return false;
}

import puzzleData from './puzzles-data.json';

export const PROCEDURAL_1_MOVE_PUZZLES = puzzleData.p1;
export const PROCEDURAL_2_MOVES_PUZZLES = puzzleData.p2;

/**
 * Builds 50 progressive procedural levels:
 * - Levels 1 to 25: 1 Matchstick Move (Easy -> Medium)
 * - Levels 26 to 50: 2 Matchstick Moves (Hard -> Master)
 */
export const LEVELS = [];

// Populate 25 1-move levels
const sample1 = [
  { eq: '6+4=4', sol: '0+4=4' },
  { eq: '6+3=5', sol: '5+3=8' },
  { eq: '8-3=3', sol: '6-3=3' },
  { eq: '5+7=2', sol: '9-7=2' },
  { eq: '9+3=5', sol: '9-3=6' },
  { eq: '8+3=5', sol: '6+3=9' },
  { eq: '7+1=0', sol: '7-1=6' },
  { eq: '3+5=2', sol: '8-5=3' },
  { eq: '9-5=9', sol: '3+5=8' },
  { eq: '6+1=8', sol: '5+3=8' },
  { eq: '0+3=9', sol: '6+3=9' },
  { eq: '5+5=0', sol: '6-6=0' },
  { eq: '2+7=5', sol: '2+3=5' },
  { eq: '9-3=8', sol: '5+3=8' },
  { eq: '7-8=1', sol: '9-8=1' },
  { eq: '8-9=2', sol: '8-6=2' },
  { eq: '3+9=2', sol: '8-6=2' },
  { eq: '9+6=6', sol: '0+6=6' },
  { eq: '5+6=3', sol: '5+3=8' },
  { eq: '8-2=7', sol: '9-2=7' },
  ...PROCEDURAL_1_MOVE_PUZZLES.slice(0, 5).map(p => ({ eq: p.initial, sol: p.solution }))
];

sample1.forEach((p, idx) => {
  LEVELS.push({
    id: idx + 1,
    title: `Level ${idx + 1}: Shift 1 Match`,
    initialEquation: p.eq,
    solution: p.sol,
    maxMoves: 1,
    difficulty: idx < 10 ? 'Easy' : (idx < 20 ? 'Medium' : 'Hard'),
    hintText: `Move 1 matchstick to form: ${p.sol}`,
  });
});

// Populate 25 2-moves levels
const sample2 = PROCEDURAL_2_MOVES_PUZZLES.slice(0, 25);
sample2.forEach((p, idx) => {
  const lvlId = 26 + idx;
  LEVELS.push({
    id: lvlId,
    title: `Level ${lvlId}: Double Move (2 Sticks)`,
    initialEquation: p.initial,
    solution: p.solution,
    maxMoves: 2,
    difficulty: idx < 10 ? 'Hard' : 'Master',
    hintText: `Move 2 matchsticks to form: ${p.solution}`,
  });
});

/**
 * Procedurally generates a random puzzle from hundreds of valid combinations
 */
export function generateProceduralLevel(id = 999, moves = 1) {
  const pool = moves === 2 ? PROCEDURAL_2_MOVES_PUZZLES : PROCEDURAL_1_MOVE_PUZZLES;
  const item = pool[Math.floor(Math.random() * pool.length)];
  return {
    id,
    title: `Procedural Lab #${id} (${moves} Move${moves > 1 ? 's' : ''})`,
    initialEquation: item.initial,
    solution: item.solution,
    maxMoves: moves,
    difficulty: moves === 1 ? 'Medium' : 'Master',
    hintText: `Move ${moves} stick${moves > 1 ? 's' : ''} to form: ${item.solution}`,
  };
}
