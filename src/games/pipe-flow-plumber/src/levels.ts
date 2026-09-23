import { LevelConfig, Direction } from './types';

export function getPipeOpenings(type: string, rotationDeg: number): Direction[] {
  const rotSteps = Math.floor(((rotationDeg % 360) + 360) % 360 / 90) as Direction;

  let base: Direction[] = [];
  switch (type) {
    case 'straight':
      base = [1, 3]; // Left - Right
      break;
    case 'elbow':
      base = [1, 2]; // Right - Bottom
      break;
    case 'tee':
      base = [3, 1, 2]; // Left - Right - Bottom
      break;
    case 'cross':
      base = [0, 1, 2, 3]; // All 4
      break;
    case 'start':
      base = [1]; // Right
      break;
    case 'end':
      base = [3]; // Left (receives from left)
      break;
    default:
      return [];
  }

  // Rotate each opening clockwise
  return base.map(dir => ((dir + rotSteps) % 4) as Direction);
}

export const LEVELS: LevelConfig[] = [
  // Level 1: Tutorial / Easy 3x3
  {
    id: 1,
    name: 'First Steps',
    rows: 3,
    cols: 3,
    start: { row: 0, col: 0, dir: 1 },
    end: { row: 2, col: 2, dir: 2 },
    parMoves: 3,
    grid: [
      [
        { type: 'start', rotation: 0, locked: true },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'elbow', rotation: 90, correctRotation: 90 }, // needs to connect Left to Bottom -> rot 90 (Bottom, Left)
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 }, // needs vertical (Top, Bottom)
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'end', rotation: 90, locked: true }, // receives from Top
      ]
    ]
  },

  // Level 2: S-Bend
  {
    id: 2,
    name: 'Simple Curve',
    rows: 3,
    cols: 4,
    start: { row: 0, col: 0, dir: 1 },
    end: { row: 2, col: 3, dir: 1 },
    parMoves: 4,
    grid: [
      [
        { type: 'start', rotation: 0, locked: true },
        { type: 'elbow', rotation: 0, correctRotation: 0 }, // Right, Bottom
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 90, correctRotation: 270 }, // Top, Right
        { type: 'elbow', rotation: 180, correctRotation: 0 }, // Right, Bottom
        { type: 'empty', rotation: 0 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 0, correctRotation: 270 }, // Top, Right
        { type: 'end', rotation: 0, locked: true }, // receives from left
      ]
    ]
  },

  // Level 3: T-Junctions & Decoys
  {
    id: 3,
    name: 'T-Junction Split',
    rows: 4,
    cols: 4,
    start: { row: 0, col: 0, dir: 1 },
    end: { row: 3, col: 3, dir: 2 },
    parMoves: 5,
    grid: [
      [
        { type: 'start', rotation: 0, locked: true },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'tee', rotation: 90, correctRotation: 0 }, // Left, Right, Bottom
        { type: 'elbow', rotation: 180, correctRotation: 90 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'straight', rotation: 90, correctRotation: 90 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 90, correctRotation: 270 },
        { type: 'tee', rotation: 180, correctRotation: 180 }, // Right, Left, Top
        { type: 'elbow', rotation: 0, correctRotation: 90 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'end', rotation: 90, locked: true },
      ]
    ]
  },

  // Level 4: Pipeline Maze
  {
    id: 4,
    name: 'The Crossway',
    rows: 4,
    cols: 5,
    start: { row: 0, col: 0, dir: 1 },
    end: { row: 3, col: 4, dir: 1 },
    parMoves: 6,
    grid: [
      [
        { type: 'start', rotation: 0, locked: true },
        { type: 'cross', rotation: 0, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'elbow', rotation: 180, correctRotation: 0 },
        { type: 'empty', rotation: 0 },
      ],
      [
        { type: 'elbow', rotation: 0, correctRotation: 270 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'empty', rotation: 0 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'tee', rotation: 90, correctRotation: 270 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'cross', rotation: 0, correctRotation: 0 },
        { type: 'elbow', rotation: 0, correctRotation: 90 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'end', rotation: 0, locked: true },
      ]
    ]
  },

  // Level 5: Pressure Valley
  {
    id: 5,
    name: 'Pressure Valley',
    rows: 4,
    cols: 6,
    start: { row: 0, col: 0, dir: 1 },
    end: { row: 2, col: 5, dir: 1 },
    parMoves: 7,
    grid: [
      [
        { type: 'start', rotation: 0, locked: true },
        { type: 'elbow', rotation: 90, correctRotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 270, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'elbow', rotation: 180, correctRotation: 90 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'elbow', rotation: 90, correctRotation: 0 },
        { type: 'tee', rotation: 0, correctRotation: 180 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 180, correctRotation: 270 },
        { type: 'elbow', rotation: 0, correctRotation: 180 },
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 90, correctRotation: 270 },
        { type: 'end', rotation: 0, locked: true },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
      ]
    ]
  },

  // Level 6: Aqueduct Grid
  {
    id: 6,
    name: 'Aqueduct Grid',
    rows: 4,
    cols: 6,
    start: { row: 1, col: 0, dir: 1 },
    end: { row: 1, col: 5, dir: 1 },
    parMoves: 8,
    grid: [
      [
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 90, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'elbow', rotation: 0, correctRotation: 90 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
      ],
      [
        { type: 'start', rotation: 0, locked: true },
        { type: 'tee', rotation: 90, correctRotation: 0 },
        { type: 'cross', rotation: 0, correctRotation: 0 },
        { type: 'tee', rotation: 270, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'end', rotation: 0, locked: true },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 0, correctRotation: 270 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'elbow', rotation: 270, correctRotation: 180 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
      ]
    ]
  },

  // Level 7: Dual Branch
  {
    id: 7,
    name: 'Dual Branch',
    rows: 4,
    cols: 7,
    start: { row: 0, col: 0, dir: 1 },
    end: { row: 3, col: 6, dir: 1 },
    parMoves: 10,
    grid: [
      [
        { type: 'start', rotation: 0, locked: true },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'tee', rotation: 180, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'elbow', rotation: 0, correctRotation: 90 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 90, correctRotation: 270 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'elbow', rotation: 180, correctRotation: 90 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 90, correctRotation: 0 },
        { type: 'tee', rotation: 90, correctRotation: 180 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'cross', rotation: 0, correctRotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 0, correctRotation: 270 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'elbow', rotation: 270, correctRotation: 180 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'end', rotation: 0, locked: true },
      ]
    ]
  },

  // Level 8: THE SCREENSHOT REPLICA (8x4 Grid!)
  // Look at image_20260921_224454.webp:
  // 8 cols x 4 rows
  // Start at (0, 0)
  // End at (1, 7) or (2, 7)
  {
    id: 8,
    name: 'Pipe Flow Plumber',
    rows: 4,
    cols: 8,
    start: { row: 0, col: 0, dir: 1 },
    end: { row: 1, col: 7, dir: 2 },
    parMoves: 9,
    grid: [
      // Row 0
      [
        { type: 'start', rotation: 0, locked: true },
        { type: 'elbow', rotation: 0, correctRotation: 0 }, // Right, Bottom (connected to start)
        { type: 'elbow', rotation: 0, correctRotation: 0 }, // Bottom, Right
        { type: 'straight', rotation: 0, correctRotation: 0 }, // Left, Right
        { type: 'tee', rotation: 0, correctRotation: 0 }, // Left, Right, Bottom
        { type: 'elbow', rotation: 90, correctRotation: 90 }, // Left, Bottom
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
      ],
      // Row 1
      [
        { type: 'elbow', rotation: 90, correctRotation: 90 },
        { type: 'elbow', rotation: 270, correctRotation: 270 }, // Top, Right
        { type: 'elbow', rotation: 180, correctRotation: 180 }, // Left, Top
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 }, // Top, Bottom
        { type: 'elbow', rotation: 180, correctRotation: 0 }, // Right, Bottom
        { type: 'end', rotation: 90, locked: true }, // nozzle spraying down
      ],
      // Row 2
      [
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 270, correctRotation: 270 },
        { type: 'elbow', rotation: 180, correctRotation: 180 },
        { type: 'elbow', rotation: 90, correctRotation: 90 },
        { type: 'tee', rotation: 0, correctRotation: 180 }, // In screenshot: grey T-junction highlighted in cyan with ⟳
        { type: 'empty', rotation: 0 },
        { type: 'tee', rotation: 270, correctRotation: 90 }, // Grey T-junction at (2,6)
        { type: 'elbow', rotation: 270, correctRotation: 180 }, // Connects up to End
      ],
      // Row 3
      [
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 0, correctRotation: 270 },
        { type: 'empty', rotation: 0 },
      ]
    ]
  },

  // Level 9: Industrial Matrix
  {
    id: 9,
    name: 'Industrial Matrix',
    rows: 4,
    cols: 8,
    start: { row: 0, col: 0, dir: 1 },
    end: { row: 3, col: 7, dir: 1 },
    parMoves: 12,
    grid: [
      [
        { type: 'start', rotation: 0, locked: true },
        { type: 'cross', rotation: 0, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'tee', rotation: 90, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'elbow', rotation: 180, correctRotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'elbow', rotation: 0, correctRotation: 90 },
      ],
      [
        { type: 'elbow', rotation: 90, correctRotation: 270 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
      ],
      [
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'tee', rotation: 180, correctRotation: 180 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'cross', rotation: 0, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'tee', rotation: 0, correctRotation: 180 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'cross', rotation: 0, correctRotation: 0 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 90, correctRotation: 270 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'end', rotation: 0, locked: true },
      ]
    ]
  },

  // Level 10: Grand Reservoir
  {
    id: 10,
    name: 'Grand Reservoir',
    rows: 5,
    cols: 8,
    start: { row: 0, col: 0, dir: 1 },
    end: { row: 4, col: 7, dir: 1 },
    parMoves: 14,
    grid: [
      [
        { type: 'start', rotation: 0, locked: true },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'elbow', rotation: 270, correctRotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 90, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'elbow', rotation: 180, correctRotation: 90 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'elbow', rotation: 90, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'tee', rotation: 180, correctRotation: 180 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 90, correctRotation: 0 },
        { type: 'cross', rotation: 0, correctRotation: 0 },
        { type: 'cross', rotation: 0, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'cross', rotation: 0, correctRotation: 0 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'tee', rotation: 0, correctRotation: 180 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
        { type: 'empty', rotation: 0 },
        { type: 'straight', rotation: 0, correctRotation: 90 },
      ],
      [
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 0, correctRotation: 270 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'elbow', rotation: 270, correctRotation: 180 },
        { type: 'empty', rotation: 0 },
        { type: 'elbow', rotation: 0, correctRotation: 270 },
        { type: 'straight', rotation: 90, correctRotation: 0 },
        { type: 'end', rotation: 0, locked: true },
      ]
    ]
  }
];
