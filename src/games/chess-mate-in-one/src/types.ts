export type GameScreen = 'MAIN_MENU' | 'PLAYING' | 'LEVEL_SELECT' | 'HOW_TO_PLAY' | 'PROGRESS';

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export interface SquareCoord {
  file: number; // 0..7 (a..h)
  rank: number; // 0..7 (1..8, 0 is rank 1, 7 is rank 8)
}

export interface ChessMove {
  fromFile: number;
  fromRank: number;
  toFile: number;
  toRank: number;
  promotion?: PieceType;
  san?: string;
}

export interface Puzzle {
  id: number;
  code: string;
  title: string;
  theme: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Master';
  fen: string;
  solution: {
    from: string; // e.g., 'e1'
    to: string;   // e.g., 'e8'
    promotion?: PieceType;
    san: string;  // e.g., 'Re8#'
  };
  hint: string;
  explanation: string;
}

export interface GameSaveData {
  unlockedLevel: number;
  completedLevels: number[];
  stars: Record<number, number>;
  scores: Record<number, number>;
  soundEnabled: boolean;
  totalSolved: number;
  bestStreak: number;
  currentStreak: number;
}
