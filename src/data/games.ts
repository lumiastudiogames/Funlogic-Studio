import { CategoryInfo, Game } from '../types';
import { STICKERS } from '../components/Stickers';
import { getDiscoveredGames } from '../games/autoLoader';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'water-sort',
    label: 'Water Sort',
    shortName: '🧪 Water Sort',
    icon: STICKERS.waterSort,
    bgPastel: '#E0F2FE',
    subcategories: ['water-sort', 'liquid-sort', 'tube-sort', 'color-sort', 'ball-sort'],
    keywords: [
      'water sort', 'water sort puzzle', 'water sort game', 'color sort', 'ball sort',
      'tube sort', 'water sort lab', 'water sorting', 'water sort online free',
      'water sort unblocked', 'liquid sort puzzle', 'color tubes'
    ],
    description: 'Sort colored liquids and balls between glass test tubes until each container holds only one pure color.',
    faqs: [
      {
        q: 'What is a water sort puzzle?',
        a: 'Water sort is a viral color deduction puzzle where players pour mixed layers of colored liquids between test tubes until every tube contains only a single uniform color.'
      }
    ]
  },
  {
    id: 'mahjong',
    label: 'Mahjong',
    shortName: '🀄 Mahjong',
    icon: STICKERS.mahjong,
    bgPastel: '#E5F9D3',
    subcategories: ['mahjong', 'solitaire', 'tiles', 'connect', 'matching'],
    keywords: [
      'mahjong', 'mahjong solitaire', 'mahjong online', 'mahjong free', 'mahjong classic',
      'mahjong connect', 'mahjong triple', 'big tile match'
    ],
    description: 'Relaxing tile matching puzzles. Match unblocked twin tiles with identical symbols.',
    faqs: [
      {
        q: 'What is Mahjong Solitaire?',
        a: 'Mahjong Solitaire is a single-player matching board game played with 144 traditional tiles arranged in tiered 3D layouts.'
      }
    ]
  },
  {
    id: 'sokoban',
    label: 'Sokoban',
    shortName: '📦 Sokoban',
    icon: STICKERS.sokoban,
    bgPastel: '#FEF3C7',
    subcategories: ['sokoban', 'box-pusher', 'warehouse'],
    keywords: ['sokoban', 'box pusher'],
    description: 'Warehouse box pushing puzzles.',
    faqs: [
      {
        q: 'What is Sokoban?',
        a: 'Sokoban is a classic puzzle game where the player pushes boxes or crates around in a warehouse, trying to get them to labeled target storage locations.'
      }
    ]
  },
  {
    id: 'pipe',
    label: 'Pipe Logic',
    shortName: '🔧 Pipe Logic',
    icon: STICKERS.pipe,
    bgPastel: '#CCFBF1',
    subcategories: ['pipe', 'plumber', 'pipeline'],
    keywords: ['pipe puzzle', 'plumber game'],
    description: 'Plumber pipe connection and fluid flow logic.',
    faqs: [
      {
        q: 'What is Pipe Logic?',
        a: 'Connect scattered pipes to create a continuous water flow conduit from source tap to target drain.'
      }
    ]
  },
  {
    id: 'logicgrid',
    label: 'Logic Grid',
    shortName: '💡 Logic Grid',
    icon: STICKERS.logicgrid,
    bgPastel: '#DCFCE7',
    subcategories: ['logicgrid', 'liarlogic', 'einstein'],
    keywords: ['logic grid', 'einstein riddle'],
    description: 'Deductive reasoning and logic grid matrices.',
    faqs: [
      {
        q: 'How do you solve a logic grid puzzle?',
        a: 'Analyze clues to cross-reference and eliminate candidate parameters with X marks and identify matches with checkmarks.'
      }
    ]
  },
  {
    id: 'numbers',
    label: 'Numbers & Math',
    shortName: '🔢 Numbers & Math',
    icon: STICKERS.numbers,
    bgPastel: '#FFF8D6',
    subcategories: ['numbers', 'sudoku', '2048', 'math'],
    keywords: ['sudoku', '2048', 'number puzzle'],
    description: 'Numbers, arithmetic sequences, 2048 tile merging, and Sudoku puzzles.',
    faqs: [
      {
        q: 'What games are included in Numbers & Math?',
        a: 'Classic Sudoku, Diagonal Sudoku, 2048, 2048 Fibonacci, 2048 Expert, Number Merge, and math operations puzzles.'
      }
    ]
  },
  {
    id: 'kids',
    label: 'Kids Puzzles',
    shortName: '🧸 Kids Puzzles',
    icon: STICKERS.kids,
    bgPastel: '#FEF3C7',
    subcategories: ['kids', 'easy', 'educational', 'junior', 'preschool', 'animals', 'children'],
    keywords: [
      'kids puzzle', 'puzzle games for kids', 'kids logic game', 'games for kids 5-8',
      'educational games for kids', 'bunny trail kids', 'lego stack kids'
    ],
    description: 'Colorful, friendly, and educational puzzle games designed specifically for children.',
    faqs: [
      {
        q: 'Are these games safe for kids?',
        a: 'Yes, all Kids Puzzles feature positive feedback loops, colorful assets, zero ads, and gentle gameplay structures.'
      }
    ]
  },
  {
    id: 'seniors',
    label: 'Seniors 60+',
    shortName: '👵 Seniors 60+',
    icon: STICKERS.seniors,
    bgPastel: '#FCE7F3',
    subcategories: ['seniors', 'elderly', 'relaxing', 'large-text', 'memory-care', 'gentle', '60+'],
    keywords: [
      'memory games for seniors', 'puzzle games for seniors', 'brain games for seniors',
      'mahjong 24 tiles', 'shape fit relax', 'seniors brain training', 'relaxing puzzle seniors'
    ],
    description: 'Relaxing, large-text, untimed brain training puzzles designed for seniors over 60.',
    faqs: [
      {
        q: 'Why are these games ideal for seniors?',
        a: 'They feature larger visual targets, higher color contrasts, unlimited undos, and no timers to ensure a stress-free and highly accessible experience.'
      }
    ]
  },
  {
    id: 'mazes',
    label: 'Mazes',
    shortName: '🌀 Mazes',
    icon: STICKERS.mazes,
    bgPastel: '#E0F2FE',
    subcategories: ['mazes', 'labyrinth', 'escape'],
    keywords: ['maze game', 'labyrinth'],
    description: 'Labyrinths, pathfinding, and maze escapes.',
    faqs: [
      {
        q: 'What is the goal of a maze puzzle?',
        a: 'Find the optimal paths through complex corridors, escape car parks, or guide keys out of tight block obstacles.'
      }
    ]
  },
  {
    id: 'problemsolving',
    label: 'Balance Logic',
    shortName: '⚖️ Balance Logic',
    icon: STICKERS.problemsolving,
    bgPastel: '#F1F5F9',
    subcategories: ['problemsolving', 'balance', 'physics'],
    keywords: ['balance puzzle', 'scale puzzle'],
    description: 'Analytical balance beam, leverage mechanics, and problem-solving puzzles.',
    faqs: [
      {
        q: 'What is Balance Logic?',
        a: 'Solve physical mechanical equilibrium challenges using gravity, balancing scales, or structural bridge building.'
      }
    ]
  },
  {
    id: 'puzzle',
    label: 'Spatial & Cut',
    shortName: '📐 Spatial & Cut',
    icon: STICKERS.puzzle,
    bgPastel: '#FFE4E6',
    subcategories: ['puzzle', 'tangram', 'cut'],
    keywords: ['cut puzzle', 'tangram', 'spatial'],
    description: 'Dissection puzzles, tangram silhouettes, and spatial geometry.',
    faqs: [
      {
        q: 'What are spatial puzzles?',
        a: 'Puzzles where you rotate and slide geometric pieces or cut shapes to fit silhouette outlines.'
      }
    ]
  },
  {
    id: 'memory',
    label: 'Memory',
    shortName: '✨ Memory',
    icon: STICKERS.memory,
    bgPastel: '#FCE7F3',
    subcategories: ['memory', 'pairs', 'match2', 'recall', 'flipcard', 'solitaire'],
    keywords: [
      'memory game', 'pairs matching', 'visual memory', 'memory palace',
      'color parrot kids', 'teddy pair kids', 'memory care', 'spider solitaire'
    ],
    description: 'Flip cards, match identical pairs, test spatial recall, and strengthen short-term memory.',
    faqs: [
      {
        q: 'How do memory card games train your brain?',
        a: 'By forcing your visual cortex to temporarily encode spatial coordinates and visual symbols, matching games boost short-term working memory capacity.'
      }
    ]
  },
  {
    id: 'all-brain',
    label: 'Brain & IQ',
    shortName: '🧠 Brain & IQ',
    icon: STICKERS.brain,
    bgPastel: '#E5F9D3',
    subcategories: ['all-brain', 'brain', 'logic', 'logicgrid'],
    keywords: ['brain teaser', 'iq test', 'brain puzzle', 'daily brain challenge'],
    description: 'All logic puzzles, brain teasers, and cognitive challenges.',
    faqs: [
      {
        q: 'What is Brain & IQ?',
        a: 'A collection of chess checkmate puzzles, lights out matrices, matchstick logic, and general smart brain teasers.'
      }
    ]
  }
];

export const GAMES: Game[] = getDiscoveredGames();

export function getGamesForCategory(categoryId: string): Game[] {
  const targetId = categoryId.toLowerCase();

  // Special aliases for backward compatibility or routing
  if (targetId === 'logic') {
    return GAMES.filter(game => game.categoryId === 'all-brain' || game.categoryId === 'logicgrid');
  }
  if (targetId === 'escape') {
    return GAMES.filter(game => game.categoryId === 'mazes' || game.categoryId === 'logicgrid');
  }
  if (targetId === 'physics') {
    return GAMES.filter(game => game.categoryId === 'problemsolving');
  }
  if (targetId === 'sudoku') {
    return GAMES.filter(game => game.categoryId === 'numbers');
  }
  if (targetId === 'chess') {
    return GAMES.filter(game => game.categoryId === 'all-brain');
  }

  // Filter games exactly belonging to the target category
  return GAMES.filter(game => game.categoryId === targetId);
}
