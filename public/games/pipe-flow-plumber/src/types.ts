export type PipeType = 'straight' | 'elbow' | 'tee' | 'cross' | 'start' | 'end' | 'empty';

export type Direction = 0 | 1 | 2 | 3; // 0: Top, 1: Right, 2: Bottom, 3: Left

export interface PipeTile {
  row: number;
  col: number;
  type: PipeType;
  rotation: number; // 0, 90, 180, 270
  displayRotation: number; // for smooth rotation animation
  targetRotation: number;
  isRotating: boolean;
  hasWater: boolean;
  waterFlowProgress: number; // 0 to 1 for water fill animation
  locked: boolean; // START, END, or blocked tiles cannot be rotated
  correctRotation?: number; // target rotation for hints
}

export interface PipeTileConfig {
  type: PipeType;
  rotation: number;
  locked?: boolean;
  correctRotation?: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  rows: number;
  cols: number;
  start: { row: number; col: number; dir: Direction };
  end: { row: number; col: number; dir: Direction };
  grid: PipeTileConfig[][];
  parMoves: number;
}

export interface GameSave {
  unlockedLevels: number;
  bestMoves: Record<number, number>;
  soundEnabled: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface Bubble {
  x: number;
  y: number;
  offset: number;
  speed: number;
  size: number;
  alpha: number;
}
