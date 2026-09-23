export type MasterCategoryId = 
  | 'all-brain'
  | 'all-puzzle';

export type SpecificCategoryId =
  | 'logic'
  | 'escape'
  | 'physics'
  | 'sudoku'
  | 'three-d'
  | 'chess'
  | 'water-sort'
  | 'mahjong'
  | 'sokoban'
  | 'pipe'
  | 'logicgrid'
  | 'numbers'
  | 'kids'
  | 'seniors'
  | 'mazes'
  | 'problemsolving'
  | 'puzzle'
  | 'memory'
  | 'block';

export type CategoryId = MasterCategoryId | SpecificCategoryId | string;

export interface GameFaq {
  q?: string;
  question?: string;
  a?: string;
  answer?: string;
}

export interface Game {
  id: string;
  title: string;
  shortDesc: string;
  description?: string;
  instructions: string;
  categoryId: CategoryId;
  categoryLabel: string;
  coverBg: string; // Pastel background color hex/CSS
  coverImage?: string; // Full thumbnail cover art image URL
  iconSvg: string; // Icon SVG string or emoji
  isTrending?: boolean;
  isKids?: boolean;
  isSeniors?: boolean;
  isBoardClassics?: boolean;
  is3D?: boolean;
  isHtmlGame?: boolean;
  htmlUrl?: string;
  playsCount?: string;
  ratingValue?: number;
  ratingCount?: string | number;
  tags: string[];
  keywords?: string | string[];
  faqs?: GameFaq[];
}

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  shortName: string;
  icon: string;
  bgPastel: string;
  description: string;
  badge?: string;
  isMaster?: boolean;
  subcategories?: string[];
  keywords?: string[];
  faqs?: GameFaq[];
}

export interface DailyChallengeState {
  completed: boolean;
  lastCompletedUtcDate: string; // YYYY-MM-DD
  streak: number;
  solvedTimeSeconds?: number;
}

export interface FilterState {
  showCount: number | 'all'; // 10, 20, 'all'
  sortBy: 'az' | 'popular' | 'new';
  viewMode?: 'carousel' | 'grid';
}

export interface RouterState {
  view: 'home' | 'category' | 'game' | 'daily' | 'sitemap';
  categoryId?: CategoryId;
  gameId?: string;
  page: number;
}

