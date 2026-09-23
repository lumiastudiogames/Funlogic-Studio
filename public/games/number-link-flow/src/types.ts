export interface Point {
  r: number;
  c: number;
}

export interface NumberPair {
  id: number;
  number: number;
  color: string;
  darkColor: string;
  lightColor: string;
  glowColor: string;
  start: Point;
  end: Point;
}

export interface LevelData {
  id: number;
  name: string;
  difficulty: 'Beginner' | 'Easy' | 'Medium' | 'Hard' | 'Master';
  size: number; // e.g. 5 for 5x5, 6 for 6x6
  pairs: NumberPair[];
  solution?: Record<number, Point[]>; // Optional solution paths for hints
}

export interface PlayerProgress {
  unlockedLevel: number;
  stars: Record<number, number>; // levelId -> stars (1-3)
  bestTimes: Record<number, number>; // levelId -> seconds
  soundEnabled: boolean;
  musicEnabled: boolean;
}

export type ScreenType = 'MAIN_MENU' | 'PLAYING' | 'LEVEL_SELECT' | 'HOW_TO_PLAY';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'star' | 'square';
}
