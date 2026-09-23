export interface Block {
  id: string;
  x: number;
  y: number;
  width: number; // width in grid cells
  height: number; // height in grid cells
  isKey?: boolean; // True for the red key block
  label?: string;
  color?: string;
}

export type ExitSide = 'right' | 'left' | 'top' | 'bottom';

export interface LevelData {
  id: number;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Master';
  cols: number;
  rows: number;
  exitRow: number;
  exitCol: number;
  exitSide: ExitSide;
  targetMoves: number;
  blocks: Block[];
}

export interface MoveStep {
  blockId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export interface PlayerProgress {
  unlockedLevel: number;
  scores: Record<number, { bestMoves: number; stars: number }>;
  hintsRemaining: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export type GameScreen = 'MENU' | 'PLAYING' | 'LEVEL_SELECT' | 'HOW_TO_PLAY' | 'SETTINGS';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  shape: 'square' | 'circle' | 'star' | 'sparkle';
}

export interface SolverMove {
  blockId: string;
  dx: number;
  dy: number;
  targetX: number;
  targetY: number;
  description?: string;
}
