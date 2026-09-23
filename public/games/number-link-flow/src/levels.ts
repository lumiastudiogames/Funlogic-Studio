import { LevelData, NumberPair, Point } from './types';

export const COLOR_PALETTES = [
  { id: 1, color: '#2563eb', darkColor: '#1d4ed8', lightColor: '#60a5fa', glowColor: 'rgba(37, 99, 235, 0.4)' },
  { id: 2, color: '#dc2626', darkColor: '#b91c1c', lightColor: '#f87171', glowColor: 'rgba(220, 38, 38, 0.4)' },
  { id: 3, color: '#16a34a', darkColor: '#15803d', lightColor: '#4ade80', glowColor: 'rgba(22, 163, 74, 0.4)' },
  { id: 4, color: '#d97706', darkColor: '#b45309', lightColor: '#fbbf24', glowColor: 'rgba(217, 119, 6, 0.4)' },
  { id: 5, color: '#7c3aed', darkColor: '#6d28d9', lightColor: '#a78bfa', glowColor: 'rgba(124, 58, 237, 0.4)' },
  { id: 6, color: '#ea580c', darkColor: '#c2410c', lightColor: '#fb923c', glowColor: 'rgba(234, 88, 12, 0.4)' },
  { id: 7, color: '#854d0e', darkColor: '#713f12', lightColor: '#ca8a04', glowColor: 'rgba(133, 77, 14, 0.4)' },
  { id: 8, color: '#0891b2', darkColor: '#0e7490', lightColor: '#22d3ee', glowColor: 'rgba(8, 145, 178, 0.4)' },
  { id: 9, color: '#65a30d', darkColor: '#4d7c0f', lightColor: '#a3e635', glowColor: 'rgba(101, 163, 13, 0.4)' },
  { id: 10, color: '#78350f', darkColor: '#451a03', lightColor: '#b45309', glowColor: 'rgba(120, 53, 15, 0.4)' },
  { id: 11, color: '#0d9488', darkColor: '#0f766e', lightColor: '#2dd4bf', glowColor: 'rgba(13, 148, 136, 0.4)' },
  { id: 12, color: '#c026d3', darkColor: '#a21caf', lightColor: '#e879f9', glowColor: 'rgba(192, 38, 211, 0.4)' },
  { id: 13, color: '#e11d48', darkColor: '#be123c', lightColor: '#fb7185', glowColor: 'rgba(225, 29, 72, 0.4)' },
  { id: 14, color: '#4f46e5', darkColor: '#3730a3', lightColor: '#818cf8', glowColor: 'rgba(79, 70, 229, 0.4)' },
  { id: 15, color: '#059669', darkColor: '#047857', lightColor: '#34d399', glowColor: 'rgba(5, 150, 105, 0.4)' },
];

function makePair(id: number, number: number, startR: number, startC: number, endR: number, endC: number): NumberPair {
  const pal = COLOR_PALETTES[(id - 1) % COLOR_PALETTES.length];
  return {
    id,
    number,
    color: pal.color,
    darkColor: pal.darkColor,
    lightColor: pal.lightColor,
    glowColor: pal.glowColor,
    start: { r: startR, c: startC },
    end: { r: endR, c: endC }
  };
}

// Guaranteed 100% grid-coverage space-filling curve generator for any level
export function generateProceduralLevel(id: number): LevelData {
  let size = 5;
  let difficulty: 'Beginner' | 'Easy' | 'Medium' | 'Hard' | 'Master' = 'Beginner';
  let pairCount = 4;

  if (id <= 40) {
    size = 5;
    difficulty = 'Beginner';
    pairCount = 4;
  } else if (id <= 60) {
    size = 6;
    difficulty = 'Easy';
    pairCount = 5;
  } else if (id <= 80) {
    size = 7;
    difficulty = 'Medium';
    pairCount = 6;
  } else if (id <= 100) {
    size = 8;
    difficulty = 'Hard';
    pairCount = 8;
  } else {
    size = 9;
    difficulty = 'Master';
    pairCount = 10;
  }

  // 1. Generate a full Hamiltonian snake / space-filling tour visiting every single cell (size * size)
  const allCells: Point[] = [];
  for (let r = 0; r < size; r++) {
    const rowCells: Point[] = [];
    for (let c = 0; c < size; c++) {
      rowCells.push({ r, c });
    }
    // Snake serpentine order for better adjacency
    if (r % 2 === 1) {
      rowCells.reverse();
    }
    allCells.push(...rowCells);
  }

  // Shuffle slightly or randomize start to create variety while keeping full coverage
  // Split allCells into `pairCount` segments
  const solution: Record<number, Point[]> = {};
  const pairs: NumberPair[] = [];

  const totalCells = allCells.length;
  const baseSegmentSize = Math.floor(totalCells / pairCount);
  let currentIndex = 0;

  for (let i = 1; i <= pairCount; i++) {
    let segLen = baseSegmentSize;
    if (i === pairCount) {
      // Last segment takes remaining cells
      segLen = totalCells - currentIndex;
    } else {
      // Add slight variation
      if (currentIndex + segLen + 1 < totalCells && Math.random() > 0.5) {
        segLen++;
      }
    }

    const segment = allCells.slice(currentIndex, currentIndex + segLen);
    currentIndex += segLen;

    if (segment.length < 2) {
      // Ensure at least 2 cells
      if (segment.length === 1 && allCells[currentIndex]) {
        segment.push(allCells[currentIndex]);
        currentIndex++;
      }
    }

    if (segment.length >= 2) {
      const start = segment[0];
      const end = segment[segment.length - 1];

      solution[i] = segment;
      pairs.push(makePair(i, i, start.r, start.c, end.r, end.c));
    }
  }

  return {
    id,
    name: `Procedural #${id}`,
    difficulty,
    size,
    pairs,
    solution
  };
}

// Handcrafted Benchmark Level 1 with 100% guaranteed grid coverage
const STATIC_LEVELS: LevelData[] = [
  {
    id: 1,
    name: 'Level 1',
    difficulty: 'Beginner',
    size: 5,
    pairs: [
      makePair(1, 1, 0, 0, 4, 0),
      makePair(2, 2, 0, 1, 4, 3),
      makePair(3, 3, 0, 4, 4, 4),
      makePair(4, 4, 1, 3, 3, 2)
    ],
    solution: {
      1: [{r:0,c:0},{r:1,c:0},{r:2,c:0},{r:3,c:0},{r:4,c:0}],
      2: [{r:0,c:1},{r:1,c:1},{r:2,c:1},{r:3,c:1},{r:4,c:1},{r:4,c:2},{r:4,c:3}],
      3: [{r:0,c:4},{r:1,c:4},{r:2,c:4},{r:3,c:4},{r:4,c:4}],
      4: [{r:1,c:3},{r:0,c:3},{r:0,c:2},{r:1,c:2},{r:2,c:2},{r:2,c:3},{r:3,c:3},{r:3,c:2}]
    }
  }
];

// Fill static levels up to 30 using procedural generator
export const TOTAL_LEVELS = 1000;

export function getLevelData(index: number): LevelData {
  if (index < STATIC_LEVELS.length) {
    return STATIC_LEVELS[index];
  }
  const levelId = index + 1;
  return generateProceduralLevel(levelId);
}

export const LEVELS: LevelData[] = new Proxy([], {
  get(_, prop) {
    if (prop === 'length') return TOTAL_LEVELS;
    if (typeof prop === 'string' && !isNaN(Number(prop))) {
      return getLevelData(Number(prop));
    }
    return (Reflect as any).get(STATIC_LEVELS, prop);
  }
}) as unknown as LevelData[];
