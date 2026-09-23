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

/**
 * 20 Progressive Handcrafted Levels with exact 1-matchstick moves
 */
export const LEVELS = [
  {
    id: 1,
    title: 'Level 1: The Beginning',
    initialEquation: '6+4=4',
    difficulty: 'Easy',
    hintText: 'Move the middle matchstick from 6 to make it 0 (0 + 4 = 4) or from + to 6 (8 - 4 = 4).',
  },
  {
    id: 2,
    title: 'Level 2: Balance',
    initialEquation: '6+3=5',
    difficulty: 'Easy',
    hintText: 'Move the bottom-left matchstick from 6 to 5 to make 5 + 3 = 8 or 6 - 3 = 3.',
  },
  {
    id: 3,
    title: 'Level 3: Subtraction',
    initialEquation: '8-3=3',
    difficulty: 'Easy',
    hintText: 'Move 1 matchstick from 8 to the right 3 to form 9 - 3 = 6 or 6 - 3 = 3.',
  },
  {
    id: 4,
    title: 'Level 4: Transformation',
    initialEquation: '5+7=2',
    difficulty: 'Easy',
    hintText: 'Move the vertical matchstick from + to the 5 to form 9 - 7 = 2.',
  },
  {
    id: 5,
    title: 'Level 5: Plus or Minus',
    initialEquation: '9+3=5',
    difficulty: 'Easy',
    hintText: 'Move the vertical bar from + to the 5 to get 9 - 3 = 6.',
  },
  {
    id: 6,
    title: 'Level 6: Eight to Nine',
    initialEquation: '8+3=5',
    difficulty: 'Medium',
    hintText: 'Move 1 matchstick from 8 to 5 to result in 6 + 3 = 9.',
  },
  {
    id: 7,
    title: 'Level 7: Magic Seven',
    initialEquation: '7+1=0',
    difficulty: 'Medium',
    hintText: 'Move the vertical matchstick from the + sign to the 0 to create 7 - 1 = 6.',
  },
  {
    id: 8,
    title: 'Level 8: Inversion',
    initialEquation: '3+5=2',
    difficulty: 'Medium',
    hintText: 'Move the vertical matchstick from + to the 3 to turn it into 8 - 5 = 3.',
  },
  {
    id: 9,
    title: 'Level 9: The Mysterious Nine',
    initialEquation: '9-5=9',
    difficulty: 'Medium',
    hintText: 'Move the top-left matchstick from the first 9 to the 5 to form 3 + 5 = 8.',
  },
  {
    id: 10,
    title: 'Level 10: Pure Logic',
    initialEquation: '6+1=8',
    difficulty: 'Medium',
    hintText: 'Move 1 matchstick from 6 to 1 to transform it into 5 + 3 = 8.',
  },
  {
    id: 11,
    title: 'Level 11: Internal Shift',
    initialEquation: '0+3=9',
    difficulty: 'Medium',
    hintText: 'Move 1 matchstick from 0 to its center to turn it into 6 (6 + 3 = 9).',
  },
  {
    id: 12,
    title: 'Level 12: Perfect Zero',
    initialEquation: '5+5=0',
    difficulty: 'Hard',
    hintText: 'Move the vertical bar from + to the left 5 to make 6 - 6 = 0.',
  },
  {
    id: 13,
    title: 'Level 13: Numeric Leap',
    initialEquation: '2+7=5',
    difficulty: 'Hard',
    hintText: 'Move 1 matchstick from 7 to turn it into 3, resulting in 2 + 3 = 5.',
  },
  {
    id: 14,
    title: 'Level 14: Subtraction Shift',
    initialEquation: '9-3=8',
    difficulty: 'Hard',
    hintText: 'Move 1 matchstick from 8 to 9 to create 5 + 3 = 8 or 9 - 3 = 6.',
  },
  {
    id: 15,
    title: 'Level 15: Symmetry',
    initialEquation: '7-8=1',
    difficulty: 'Hard',
    hintText: 'Move 1 matchstick from 8 to 7 to transform into 9 - 8 = 1.',
  },
  {
    id: 16,
    title: 'Level 16: Eight and Six',
    initialEquation: '8-9=2',
    difficulty: 'Hard',
    hintText: 'Move the top-right matchstick from 9 to the bottom-left to make 8 - 6 = 2.',
  },
  {
    id: 17,
    title: 'Level 17: Multi-Branch',
    initialEquation: '3+9=2',
    difficulty: 'Hard',
    hintText: 'Move 1 matchstick from 9 to turn it into 6 and the 3 into 8: 8 - 6 = 2.',
  },
  {
    id: 18,
    title: 'Level 18: Double Six',
    initialEquation: '9+6=6',
    difficulty: 'Master',
    hintText: 'Move the center matchstick from 9 to close the 0: 0 + 6 = 6.',
  },
  {
    id: 19,
    title: 'Level 19: The Grand Puzzle',
    initialEquation: '5+6=3',
    difficulty: 'Master',
    hintText: 'Move 1 matchstick from 6 to the right 3 to form 5 + 3 = 8.',
  },
  {
    id: 20,
    title: 'Level 20: Matchstick Master',
    initialEquation: '8-2=7',
    difficulty: 'Master',
    hintText: 'Move 1 matchstick from 8 to the right 7 to transform into 9 - 2 = 7.',
  },
];
