import { CategoryInfo, Game } from '../types';
import { STICKERS } from '../components/Stickers';
import { getDiscoveredGames } from '../games/autoLoader';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'water-sort',
    label: 'Water Sort & Color Tubes',
    shortName: '🧪 Water Sort',
    icon: STICKERS.waterSort,
    bgPastel: '#E0F2FE',
    subcategories: ['water-sort', 'liquid-sort', 'tube-sort', 'color-sort', 'ball-sort'],
    keywords: [
      'water sort', 'water sort puzzle', 'water sort game', 'color sort', 'ball sort',
      'tube sort', 'water sort lab', 'water sorting', 'water sort online free',
      'water sort no download', 'water sort unblocked', 'liquid sort puzzle', 'color tubes'
    ],
    description: 'Sort colored liquid and balls between glass test tubes until each container holds only one pure color. Clean, relaxing, untimed, and highly addictive logic gameplay.',
    faqs: [
      {
        q: 'What is a water sort puzzle and how does it work?',
        a: 'Water sort is a viral color deduction puzzle where players pour mixed layers of colored liquids between test tubes until every tube contains only a single uniform color. You can only pour liquid if the destination tube has free space and its topmost color matches the liquid being poured.'
      },
      {
        q: 'How to play water sort game online with no download?',
        a: 'You can play directly in your web browser on desktop, Chromebook, iPhone, or Android with zero installation. Simply tap or click the source test tube to select it, then tap the target tube to pour the matching color.'
      },
      {
        q: 'Is Water Sort free and unblocked at school and work?',
        a: 'Yes, all water sort games on our portal are 100% free, unblocked, and playable without plugins or downloads, making them perfect for study breaks or relaxing moments.'
      },
      {
        q: 'What cognitive skills and brain benefits does water sort develop?',
        a: 'Water sorting exercises working memory, multistep forward planning, spatial reasoning, and impulse control. It trains you to visualize several moves ahead before committing to a pour.'
      },
      {
        q: 'What should I do if I get stuck on a water sort level?',
        a: 'You can use the unlimited Undo button to step back, restart the level instantly, or strategically keep one empty tube as an auxiliary buffer to swap colors safely.'
      }
    ]
  },
  {
    id: 'mahjong',
    label: 'Mahjong Solitaire & Tiles',
    shortName: '🀄 Mahjong',
    icon: STICKERS.mahjong,
    bgPastel: '#E5F9D3',
    subcategories: ['mahjong', 'solitaire', 'tiles', 'connect', 'matching'],
    keywords: [
      'mahjong', 'mahjong solitaire', 'mahjong online', 'mahjong free', 'mahjong classic',
      'mahjong connect', 'mahjong tiles', 'mahjong matching', 'free online mahjong',
      'shanghai mahjong', 'play mahjong no download', 'mahjong unblocked'
    ],
    description: 'Relaxing tile matching puzzles. Match unblocked twin tiles with identical symbols to dismantle traditional Shanghai pyramids and intricate board layouts.',
    faqs: [
      {
        q: 'What is Mahjong Solitaire?',
        a: 'Mahjong Solitaire is a single-player matching board game played with 144 traditional tiles (bamboo, characters, circles, winds, and dragons) arranged in tiered 3D layouts.'
      },
      {
        q: 'How do you play Mahjong online with no download?',
        a: 'Find and tap two identical tiles that are "free" (not covered by other tiles and open on either the left or right side). Matching them removes the pair from the board until all tiles are cleared.'
      },
      {
        q: 'Is Mahjong Solitaire good for memory and cognitive focus?',
        a: 'Yes, studies show that Mahjong enhances pattern recognition, visual search speed, spatial awareness, and sustained attention for players of all ages, including seniors.'
      },
      {
        q: 'What happens when no more matching pairs are available in Mahjong?',
        a: 'When no free matching pairs remain, you can use the Shuffle button to rearrange the remaining tiles or restart the board to attempt a fresh strategic sequence.'
      }
    ]
  },
  {
    id: 'sokoban',
    label: 'Sokoban Box Pusher',
    shortName: '📦 Sokoban',
    icon: STICKERS.sokoban,
    bgPastel: '#FEF3C7',
    subcategories: ['sokoban', 'box-pusher', 'warehouse', 'crate-push', 'cargo'],
    keywords: [
      'sokoban', 'box pusher', 'warehouse puzzle', 'push box game', 'sokoban online',
      'sokoban puzzle', 'cargo puzzle', 'sokoban free', 'push crates online', 'unblocked sokoban'
    ],
    description: 'Navigate logistics warehouses and push cargo crates onto designated target storage pads without getting boxes trapped against dead-end walls.',
    faqs: [
      {
        q: 'What is Sokoban and what are the basic rules?',
        a: 'Sokoban is a classic Japanese transport puzzle created in 1981. The player controls a warehouse keeper who must push crates onto marked goal tiles. Only one box can be pushed at a time, and boxes cannot be pulled.'
      },
      {
        q: 'How do you avoid getting boxes stuck in corners in Sokoban?',
        a: 'Never push a crate directly into a corner unless that corner is an official goal location, because once a box touches two adjacent perpendicular walls, it cannot be pushed out.'
      },
      {
        q: 'Is Sokoban playable on mobile with touch controls?',
        a: 'Yes, our Sokoban games include on-screen virtual D-Pad buttons for smooth mobile play, as well as full keyboard arrow and WASD support on desktop.'
      }
    ]
  },
  {
    id: 'pipe',
    label: 'Pipe Connect & Flow Logic',
    shortName: '🔧 Pipe Logic',
    icon: STICKERS.pipe,
    bgPastel: '#CCFBF1',
    subcategories: ['pipe', 'pipeline', 'plumber', 'water-flow', 'connect-pipes'],
    keywords: [
      'pipe puzzle', 'plumber game', 'pipe connect', 'water pipe puzzle', 'plumber puzzle',
      'pipe flow', 'connect pipes', 'water line game', 'pipeline logic', 'water connect online'
    ],
    description: 'Rotate elbow and straight pipe joints to construct unbroken plumbing conduits that allow fresh water to flow from source valves to destination outlets.',
    faqs: [
      {
        q: 'What is a pipe connect logic puzzle?',
        a: 'Pipe connect is a grid-based spatial puzzle where players rotate disoriented pipe segments to establish a continuous, leak-free pipeline connecting the water intake to the output drain.'
      },
      {
        q: 'How do you rotate pipes in the game?',
        a: 'Simply tap or click on any individual pipe piece to rotate it 90 degrees clockwise until an unbroken conduit is formed across the board.'
      },
      {
        q: 'What cognitive skills are exercised in plumber pipe games?',
        a: 'Plumber puzzles test spatial rotation, graph connectivity intuition, sequential logic, and global layout visualization.'
      }
    ]
  },
  {
    id: 'logicgrid',
    label: 'Logic Grid & Deduction',
    shortName: '💡 Logic Grid',
    icon: STICKERS.logicgrid,
    bgPastel: '#DCFCE7',
    subcategories: ['logicgrid', 'liarlogic', 'secretcode', 'einstein', 'deduction', 'fish', 'matrix'],
    keywords: [
      'zebra puzzle', 'einstein riddle', 'logic grid', 'who owns the fish', 'liar puzzle',
      'knights and knaves', 'vault breaker', 'detective logic', 'deduction puzzle', 'logic matrix'
    ],
    description: 'Deductive matrix puzzles, Einstein riddles, liar logic courtrooms, and detective deduction challenges with single deterministic solutions.',
    faqs: [
      {
        q: 'What is a logic grid puzzle (Zebra / Einstein Riddle)?',
        a: 'A logic grid puzzle presents a set of entities (e.g. names, houses, pets, professions) and a list of relational clues. By cross-referencing clues and eliminating contradictions in a matrix, you deduce the unique solution.'
      },
      {
        q: 'How do you solve Liar Logic (Knights and Knaves)?',
        a: 'In Liar Logic, certain characters always speak the truth (Knights) while others always lie (Knaves). Test hypotheses by assuming a speaker is honest: if their statement creates a logical paradox, they must be a liar.'
      },
      {
        q: 'Why are logic grid puzzles popular for competitive brain training?',
        a: 'They develop rigorous analytical reasoning, Boolean logic comprehension, deductive inference, and eliminate guesswork through structured proof.'
      }
    ]
  },
  {
    id: 'numbers',
    label: 'Numbers, 2048 & Sudoku',
    shortName: '🔢 Numbers & Math',
    icon: STICKERS.numbers,
    bgPastel: '#FFF8D6',
    subcategories: ['numbers', 'sudoku', '2048', 'math', 'calc', 'sequences', 'arithmetic'],
    keywords: [
      'sudoku', '2048', 'number puzzle', 'math puzzle', 'sudoku online', '2048 online',
      'number sequence', 'math bridge', 'arithmetic puzzle', 'daily sudoku', 'number match'
    ],
    description: 'Engaging number logic puzzles, classic Sudoku 9x9 grids, 2048 tile merging, math bridges, and arithmetic sequence challenges.',
    faqs: [
      {
        q: 'How does the 2048 number game work?',
        a: 'Swipe or use arrow keys to slide tiles across a 4x4 grid. When two tiles with the same number collide, they merge into one tile with their sum (2+2=4, 4+4=8... up to 2048).'
      },
      {
        q: 'How to solve Classic Sudoku 9x9 without guessing?',
        a: 'Each row, column, and 3x3 box must contain digits 1 through 9 exactly once. Use pencil notes to eliminate impossible numbers from candidate cells systematically.'
      },
      {
        q: 'Are these math and number games suitable for mental arithmetic training?',
        a: 'Yes, regular practice strengthens calculation speed, quantitative intuition, number sense, and working memory.'
      }
    ]
  },
  {
    id: 'kids',
    label: 'Kids Logic & Puzzle Games (5-12)',
    shortName: '🧸 Kids Puzzles',
    icon: STICKERS.kids,
    bgPastel: '#FEF3C7',
    subcategories: ['kids', 'easy', 'educational', 'junior', 'preschool', 'animals', 'children'],
    keywords: [
      'kids puzzle', 'puzzle games for kids', 'kids logic game', 'games for kids 5-8',
      'games for kids 8-12', 'kids brain game', 'educational games for kids', 'kids mahjong',
      'kids maze', 'kids water sort', 'kids memory game', 'kids pipe puzzle', 'kids sokoban',
      'easy puzzle for kids', 'puzzle for toddlers', 'preschool logic game',
      'kids games no download', 'kids games unblocked', 'free games for kids online', 'kids puzzle online free'
    ],
    description: 'Colorful, friendly, and educational puzzle games designed specifically for children ages 5 to 12. Fun brain games with zero ads, gentle difficulty curves, and positive rewards.',
    faqs: [
      {
        q: 'What are the best free online logic games for kids?',
        a: 'Top kid-friendly logic games include simplified Water Sort color matching, Animal Memory Pairs, Kids Maze Escapes, Easy Pipe Connect, and Junior Sokoban box pushing.'
      },
      {
        q: 'Are the games safe, unblocked, and ad-free for children?',
        a: 'Yes, our portal is 100% safe, requires no account or download, runs directly in web browsers, and works seamlessly on school Chromebooks and family tablets.'
      },
      {
        q: 'How do logic puzzles help children’s cognitive development?',
        a: 'Early engagement with logic and spatial puzzles enhances spatial awareness, hand-eye coordination, pattern recognition, patience, and problem-solving resilience.'
      },
      {
        q: 'What age groups are these kids puzzle games suited for?',
        a: 'We offer games categorized for early learners (ages 5-8) with vibrant visual feedback, and intermediate challenges (ages 8-12) introducing multi-step deduction.'
      }
    ]
  },
  {
    id: 'seniors',
    label: 'Seniors 60+ Memory & Brain Care',
    shortName: '👵 Seniors 60+',
    icon: STICKERS.seniors,
    bgPastel: '#FCE7F3',
    subcategories: ['seniors', 'elderly', 'relaxing', 'large-text', 'memory-care', 'gentle'],
    keywords: [
      'memory games for seniors', 'puzzle games for seniors', 'brain games for seniors',
      'games for seniors over 60', 'logic games for seniors', 'free games for seniors',
      'mahjong for seniors', 'water sort for seniors', 'easy puzzle for seniors',
      'large text puzzle seniors', 'seniors brain training', 'memory training seniors',
      'relaxing puzzle seniors', 'seniors games no download', 'seniors games unblocked',
      'easy mahjong for seniors', 'senior friendly puzzle', 'puzzle for 60 year old',
      'games to prevent alzheimer', 'dementia puzzle games', 'seniors logic grid', 'seniors maze game'
    ],
    description: 'Relaxing, large-text, untimed brain training puzzles designed for seniors over 60. Exercises visual memory, focus, and cognitive agility without stress or timers.',
    faqs: [
      {
        q: 'Which brain games are most beneficial for seniors over 60?',
        a: 'Gentle Mahjong Solitaire, relaxing Water Sort color matching, Large-Text Sudoku, Visual Memory Pairs, and Word Logic are proven favorites that stimulate memory and cognitive pathways.'
      },
      {
        q: 'How do daily logic and memory puzzles support healthy cognitive aging?',
        a: 'Research in neuroplasticity indicates that engaging daily in novel problem-solving and memory recall exercises helps maintain synaptic connections, sharpen focus, and delay cognitive decline.'
      },
      {
        q: 'Are these games designed with high contrast and large text for easy reading?',
        a: 'Yes, our senior-tailored puzzles feature clear typography, high-contrast pieces, untimed modes, and simple one-tap controls that are effortless on iPads, tablets, and desktop computers.'
      },
      {
        q: 'Do seniors need to create an account or download an app to play?',
        a: 'No, every game plays instantly with zero downloads, logins, or hidden subscriptions. Simply open the page and begin enjoying relaxing brain exercises.'
      }
    ]
  },
  {
    id: 'mazes',
    label: 'Mazes & Labyrinths',
    shortName: '🌀 Mazes',
    icon: STICKERS.mazes,
    bgPastel: '#E0F2FE',
    subcategories: ['mazes', 'labyrinth', 'escape', 'pathfinding'],
    keywords: [
      'maze game', 'labyrinth escape', 'factory escape', 'maze puzzle online',
      'maze for kids', 'maze for seniors', 'pathfinding puzzle', 'classic maze', 'escape maze'
    ],
    description: 'Navigate winding labyrinth corridors, discover optimal shortest paths, avoid traps, and escape intricate geometric mazes.',
    faqs: [
      {
        q: 'What is the objective of maze and labyrinth games?',
        a: 'Guide your character or token from the starting entrance through dead ends and turning corridors to reach the exit portal in the fewest moves possible.'
      },
      {
        q: 'What is the "Right-Hand Rule" in maze solving?',
        a: 'The right-hand rule is a classic algorithm: keep your right hand in continuous contact with the right-side wall while walking. In standard simply-connected mazes, this guarantees reaching an exit.'
      }
    ]
  },
  {
    id: 'problemsolving',
    label: 'Problem Solving & Balance Logic',
    shortName: '⚖️ Balance Logic',
    icon: STICKERS.problemsolving,
    bgPastel: '#F1F5F9',
    subcategories: ['problemsolving', 'balance', 'bridge', 'rivercrossing', 'hanoi', 'physics'],
    keywords: [
      'balance puzzle', 'scale puzzle', 'weight puzzle', 'balance game',
      'problem solving games', 'river crossing puzzle', 'tower of hanoi', 'physics logic'
    ],
    description: 'Multi-step analytical challenges, weight balance beam scales, river crossing logic, and physics problem-solving riddles.',
    faqs: [
      {
        q: 'What is a balance scale puzzle?',
        a: 'A deduction challenge where you place unknown weighted objects on balance scale pans to identify which item is heavier, lighter, or find equilibrium using the fewest weighings.'
      },
      {
        q: 'How does River Crossing logic work?',
        a: 'You must transport a group (e.g., wolf, goat, and cabbage) across a river in a boat with limited capacity, ensuring incompatible items are never left together unattended.'
      }
    ]
  },
  {
    id: 'puzzle',
    label: 'Puzzles, Cut & Tangram Shapes',
    shortName: '📐 Spatial & Cut',
    icon: STICKERS.puzzle,
    bgPastel: '#FFE4E6',
    subcategories: ['puzzle', 'tangram', 'cut', 'geometric', 'spatial', 'shadow', 'shapes', 'slice'],
    keywords: [
      'cut puzzle', 'slice puzzle', 'shadow logic', 'cut game', 'spatial puzzle',
      'tangram puzzle', 'geometric puzzle', 'shape puzzle', 'polyomino'
    ],
    description: 'Tangram silhouette assemblies, geometric slice cuts, shadow matching, and spatial polygon fitting puzzles.',
    faqs: [
      {
        q: 'What is a Tangram dissection puzzle?',
        a: 'A classic Chinese dissection puzzle consisting of seven flat geometric polygons (tans) that must be assembled to form specific outline silhouettes without overlapping.'
      },
      {
        q: 'What are spatial cut and slice puzzles?',
        a: 'Puzzles where you draw straight lines across a 2D shape to divide it into identical target sub-regions or equal area fractions.'
      }
    ]
  },
  {
    id: 'memory',
    label: 'Memory Training & Visual Recall',
    shortName: '✨ Memory',
    icon: STICKERS.memory,
    bgPastel: '#FCE7F3',
    subcategories: ['memory', 'pairs', 'match2', 'recall', 'flipcard', 'hiddenitem', 'differences', 'sequence'],
    keywords: [
      'memory game', 'memory palace', 'mansion memory', 'memory training',
      'visual memory', 'pairs matching', 'flip card memory', 'simon says online'
    ],
    description: 'Flip cards, memorize flash symbol locations, match pairs, and repeat tonal light sequences to strengthen working memory capacity.',
    faqs: [
      {
        q: 'How do memory card games train your brain?',
        a: 'By forcing your visual cortex and hippocampus to temporarily encode spatial coordinates and visual symbols, repeated matching games boost short-term working memory capacity.'
      },
      {
        q: 'What is the best technique for memorizing card pairs?',
        a: 'Chunking information into thematic pairs and mapping them to familiar spatial anchors (the Method of Loci / Memory Palace) significantly accelerates recall.'
      }
    ]
  },
  {
    id: 'all-brain',
    label: 'Brain & IQ Logic Teasers',
    shortName: '🧠 Brain & IQ',
    icon: STICKERS.brain,
    bgPastel: '#E5F9D3',
    isMaster: true,
    subcategories: ['all-brain', 'brain', 'iq', 'teaser', 'mind', 'reasoning'],
    keywords: [
      'brain teaser', 'iq test', 'brain puzzle', 'brain training',
      'mind games', 'cognitive exercises', 'logic reasoning', 'daily brain challenge'
    ],
    description: 'Comprehensive brain teasers, IQ test logic patterns, cognitive speed tests, and daily analytical puzzles to challenge your mental processing power.',
    faqs: [
      {
        q: 'What is Brain & IQ training?',
        a: 'A curated collection of multi-disciplinary logic, deduction, and pattern riddles designed to test and sharpen your analytical IQ and creative problem-solving agility.'
      },
      {
        q: 'How often should you practice brain teasers for best results?',
        a: 'Solving 1 to 2 challenging logic teasers daily (approx. 10–15 minutes) provides optimal cognitive stimulation without mental fatigue.'
      }
    ]
  },
  {
    id: 'block',
    label: 'Block Puzzle & Polyomino Fit',
    shortName: '🧱 Block Puzzle',
    icon: STICKERS.cube || STICKERS.puzzle,
    bgPastel: '#FFEED6',
    subcategories: ['block', 'tetris', 'block-fit', 'polyomino', 'brick', 'grid-fit'],
    keywords: [
      'block puzzle', 'tetris', 'block fit', 'block game', 'polyomino blocks',
      'grid fit puzzle', 'wooden blocks online', 'falling blocks', 'sliding blocks'
    ],
    description: 'Fit multi-block polyomino shapes into tight rectangular grids, clear rows and columns, and solve geometric block-packing challenges.',
    faqs: [
      {
        q: 'How do you play Block Puzzle games online?',
        a: 'Drag and place geometric block shapes onto a grid to form complete horizontal or vertical lines. When a line is filled, it clears and creates room for subsequent pieces.'
      },
      {
        q: 'What is the difference between Block Puzzle and classic Tetris?',
        a: 'Classic Tetris has falling blocks under time pressure, whereas Block Puzzle lets you strategically place pieces from a tray at your own calm pace without gravity.'
      }
    ]
  }
];

const BASE_GAMES: Game[] = [];
const UNUSED_MOCK_GAMES: Game[] = [
  {
    id: 'daily-brain-challenge',
    title: 'Daily Brain Puzzle',
    shortDesc: 'A unique logic puzzle generated daily at 00:00 UTC for everyone.',
    instructions: 'Fill the grid so each row and column contains unique numbers without repeating. Tap a cell and select a number.',
    categoryId: 'brain',
    categoryLabel: 'Brain',
    coverBg: '#E6F4E6',
    coverImage: '/src/assets/images/game_cover_brain_1789835984798.jpg',
    iconSvg: STICKERS.flame,
    isTrending: true,
    playsCount: '12.4k',
    tags: ['daily', 'logic', 'grid', 'utc']
  },
  {
    id: 'sudoku-classic',
    title: 'Classic Sudoku',
    shortDesc: 'The quintessential 9x9 logic grid puzzle with notes and hint tools.',
    instructions: 'Place numbers 1 through 9 in every row, column, and 3x3 block. Tap any cell to enter digits.',
    categoryId: 'numbers',
    categoryLabel: 'Numbers',
    coverBg: '#E9E6FF',
    coverImage: '/src/assets/images/game_cover_sudoku_1789835995542.jpg',
    iconSvg: STICKERS.numbers,
    isTrending: true,
    playsCount: '18.9k',
    tags: ['sudoku', 'numbers', 'logic', 'classic']
  },
  {
    id: 'number-quest',
    title: 'Number Quest',
    shortDesc: 'Find hidden number sequences and arithmetic patterns.',
    instructions: 'Examine the number pattern and tap the missing number that logically completes the sequence.',
    categoryId: 'numbers',
    categoryLabel: 'Numbers',
    coverBg: '#E9E6FF',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.mathPlus,
    isTrending: true,
    playsCount: '9.2k',
    tags: ['math', 'numbers', 'sequence']
  },
  {
    id: 'word-logic',
    title: 'Word Logic',
    shortDesc: 'Deduce words using logical letter clues.',
    instructions: 'Guess the hidden 5-letter word. Green letters are in the correct spot; yellow letters belong in the word.',
    categoryId: 'words',
    categoryLabel: 'Words',
    coverBg: '#FFE6E6',
    coverImage: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.words,
    isTrending: true,
    playsCount: '14.1k',
    tags: ['words', 'deduction', 'vocab']
  },
  {
    id: 'teddy-sort',
    title: 'Teddy Sort',
    shortDesc: 'Sort cute toys and teddy bears by color into matching baskets.',
    instructions: 'Tap or drag a toy into the basket with the matching color. No reading needed!',
    categoryId: 'kids',
    categoryLabel: 'Kids',
    coverBg: '#DCEEFF',
    coverImage: '/src/assets/images/game_cover_kids_1789836006162.jpg',
    iconSvg: STICKERS.kids,
    isKids: true,
    playsCount: '8.5k',
    tags: ['kids', 'sorting', 'colors', 'no-reading']
  },
  {
    id: 'color-pop',
    title: 'Color Pop',
    shortDesc: 'Match same-colored bubbles to pop them smoothly.',
    instructions: 'Tap clusters of matching colored bubbles to pop them. Clear the board to win!',
    categoryId: 'kids',
    categoryLabel: 'Kids',
    coverBg: '#FFE0F0',
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.palette,
    isKids: true,
    playsCount: '11.0k',
    tags: ['kids', 'matching', 'colors']
  },
  {
    id: 'shape-match',
    title: 'Shape Match',
    shortDesc: 'Fit simple geometric shapes into matching shadow slots.',
    instructions: 'Tap a shape and then tap its matching silhouette frame.',
    categoryId: 'kids',
    categoryLabel: 'Kids',
    coverBg: '#E0FFE0',
    coverImage: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.shapes,
    isKids: true,
    playsCount: '7.3k',
    tags: ['kids', 'shapes', 'visual']
  },
  {
    id: 'animal-link',
    title: 'Animal Link',
    shortDesc: 'Connect pairs of matching animal cards with a clear path.',
    instructions: 'Tap two identical animal tiles that can be joined by a line with at most 2 turns.',
    categoryId: 'kids',
    categoryLabel: 'Kids',
    coverBg: '#FFF0D6',
    coverImage: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.lion,
    isKids: true,
    playsCount: '9.8k',
    tags: ['kids', 'matching', 'animals']
  },
  {
    id: 'classic-sudoku-60',
    title: 'Sudoku 60+',
    shortDesc: 'Relaxed Sudoku with large print numbers and extra visual clarity.',
    instructions: 'Fill the grid at your own pace. No timers, no pressure. Big easy-to-tap number buttons.',
    categoryId: 'seniors',
    categoryLabel: 'Seniors',
    coverBg: '#FFEFD6',
    coverImage: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.seniors,
    isSeniors: true,
    playsCount: '15.3k',
    tags: ['seniors', 'sudoku', 'large-print', 'untimed']
  },
  {
    id: 'word-search-senior',
    title: 'Word Search 60+',
    shortDesc: 'Find calm words in a clear, high-contrast letter grid.',
    instructions: 'Tap or drag across adjacent letters to highlight words listed at the bottom.',
    categoryId: 'seniors',
    categoryLabel: 'Seniors',
    coverBg: '#E6E8FF',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.wordsearch,
    isSeniors: true,
    playsCount: '16.7k',
    tags: ['seniors', 'words', 'large-print']
  },
  {
    id: 'memory-lane',
    title: 'Memory Lane',
    shortDesc: 'Train your visual memory by pairing matching cards.',
    instructions: 'Flip two cards at a time to find matching pairs. Take all the time you need.',
    categoryId: 'seniors',
    categoryLabel: 'Seniors',
    coverBg: '#E6F4E6',
    coverImage: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.memory,
    isSeniors: true,
    playsCount: '12.1k',
    tags: ['seniors', 'memory', 'brain']
  },
  {
    id: 'domino-classic-senior',
    title: 'Domino Classic 60+',
    shortDesc: 'Relaxing tile matching with domino numbers.',
    instructions: 'Connect domino tiles by matching pips on open ends.',
    categoryId: 'seniors',
    categoryLabel: 'Seniors',
    coverBg: '#FFE6CC',
    coverImage: 'https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.dice,
    isSeniors: true,
    playsCount: '10.4k',
    tags: ['seniors', 'dominoes', 'board']
  },
  {
    id: 'logic-puzzles',
    title: 'Logic Puzzles',
    shortDesc: 'Grid deduction puzzles to solve step by step.',
    instructions: 'Use the clues provided to mark checkmarks and Xs in the grid until every match is solved.',
    categoryId: 'brain',
    categoryLabel: 'Brain',
    coverBg: '#E8F4FF',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.logicgrid,
    playsCount: '8.9k',
    tags: ['logic', 'brain', 'deduction']
  },
  {
    id: 'maze-master',
    title: 'Mazes & Paths',
    shortDesc: 'Navigate through maze corridors to reach the goal.',
    instructions: 'Use arrow buttons, swipe gestures, or tap destination paths to navigate out of the maze.',
    categoryId: 'puzzle',
    categoryLabel: 'Puzzle',
    coverBg: '#FFF2CC',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.mazes,
    playsCount: '11.2k',
    tags: ['maze', 'puzzle', 'path']
  },
  {
    id: 'pattern-match',
    title: 'Pattern Match',
    shortDesc: 'Identify visual symmetry and missing grid shapes.',
    instructions: 'Observe the grid matrix and select the tile that completes the logical visual pattern.',
    categoryId: 'puzzle',
    categoryLabel: 'Puzzle',
    coverBg: '#E6F4E6',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.puzzle,
    playsCount: '7.8k',
    tags: ['pattern', 'spatial', 'puzzle']
  },
  {
    id: 'chess-puzzle',
    title: 'Chess Puzzle',
    shortDesc: 'Find the winning mate-in-1 or mate-in-2 move on a classic chessboard.',
    instructions: 'Tap a piece then tap its target square to make a chess move and deliver checkmate.',
    categoryId: 'board',
    categoryLabel: 'Board',
    coverBg: '#E9E6FF',
    coverImage: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.board,
    isBoardClassics: true,
    playsCount: '19.4k',
    tags: ['chess', 'board', 'strategy', 'classic']
  },
  {
    id: 'brazilian-dominoes',
    title: 'Brazilian Dominoes',
    shortDesc: 'Traditional 28-tile domino game with classic point scoring rules.',
    instructions: 'Play matching domino tiles from your hand onto the table chain.',
    categoryId: 'board',
    categoryLabel: 'Board',
    coverBg: '#FFF2CC',
    coverImage: 'https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.mahjong,
    isBoardClassics: true,
    playsCount: '14.8k',
    tags: ['dominoes', 'board', 'brazilian', 'classic']
  },
  {
    id: 'knight-moves',
    title: 'Knight Moves',
    shortDesc: 'Guide the knight across every square on the board.',
    instructions: 'Move the knight using standard L-shaped chess jumps to visit all target tiles.',
    categoryId: 'board',
    categoryLabel: 'Board',
    coverBg: '#FFE6E6',
    coverImage: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.board,
    playsCount: '6.5k',
    tags: ['chess', 'knight', 'logic']
  },
  {
    id: 'math-riddle',
    title: 'Math Riddle',
    shortDesc: 'Balance equations and weights on a visual scale.',
    instructions: 'Drag weight values to balance both sides of the scale arithmetic equation.',
    categoryId: 'numbers',
    categoryLabel: 'Numbers',
    coverBg: '#E6F4E6',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.mathPlus,
    playsCount: '8.1k',
    tags: ['math', 'riddle', 'balance']
  },
  {
    id: 'pipeline-link',
    title: 'Link Logic',
    shortDesc: 'Connect matching color nodes without crossing paths.',
    instructions: 'Drag lines between same-colored dots until the entire grid is covered without overlapping lines.',
    categoryId: 'puzzle',
    categoryLabel: 'Puzzle',
    coverBg: '#F0E6FF',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.link,
    playsCount: '13.5k',
    tags: ['link', 'pipeline', 'grid']
  },
  {
    id: '3d-block-logic',
    title: '3D Cube Spatial',
    shortDesc: 'Rotate 3D block structures to count hidden blocks.',
    instructions: 'Drag to rotate the 3D cube model in space and count the total number of blocks.',
    categoryId: 'puzzle',
    categoryLabel: 'Puzzle',
    coverBg: '#E8F4FF',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.cube,
    is3D: true,
    playsCount: '5.2k',
    tags: ['3d', 'spatial', 'cube']
  },
  {
    id: 'drag-sort-master',
    title: 'Drag & Drop Sort',
    shortDesc: 'Drag items into their correct target slots.',
    instructions: 'Drag objects with touch or mouse arrow and drop them into designated target bins.',
    categoryId: 'dragdrop',
    categoryLabel: 'Drag & Drop',
    coverBg: '#E6F4F1',
    coverImage: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.dragdrop,
    isTrending: true,
    playsCount: '15.8k',
    tags: ['drag', 'drop', 'sorting', 'touch']
  },
  {
    id: 'find-hidden-object',
    title: 'Find Hidden Items (60+ Relaxed)',
    shortDesc: 'Search and spot hidden objects in rich visual scenes with gentle clues.',
    instructions: 'Examine the picture carefully and tap or click on all requested hidden items.',
    categoryId: 'hiddenitem',
    categoryLabel: 'Find Hidden Items',
    coverBg: '#FFF5E6',
    coverImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.hiddenitem,
    isTrending: true,
    isSeniors: true,
    playsCount: '17.2k',
    tags: ['hidden', 'find', 'item', 'observation', 'seniors']
  },
  {
    id: 'spot-seven-differences',
    title: 'Spot Differences (60+ Relaxed)',
    shortDesc: 'Compare two side-by-side images and find all 5 clear differences at your own pace.',
    instructions: 'Look closely at both illustrations and tap where you spot a difference.',
    categoryId: 'differences',
    categoryLabel: 'Spot 7 Differences',
    coverBg: '#FFEBF0',
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.differences,
    isTrending: true,
    isSeniors: true,
    playsCount: '21.0k',
    tags: ['differences', 'spot', 'visual', 'seniors']
  },
  {
    id: 'hangman-classic',
    title: 'Classic Hangman',
    shortDesc: 'Guess letters to deduce the secret word before attempts run out.',
    instructions: 'Tap or click letters on the keyboard to reveal the hidden logic word.',
    categoryId: 'hangman',
    categoryLabel: 'Hangman',
    coverBg: '#F3E8FF',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.hangman,
    isTrending: true,
    isSeniors: true,
    playsCount: '19.5k',
    tags: ['hangman', 'words', 'deduction', 'seniors']
  },
  {
    id: 'labyrinth-escape',
    title: 'Labyrinth Escape',
    shortDesc: 'Guide the ball through calm labyrinths to the exit.',
    instructions: 'Use touch drag or mouse arrow to trace the path through the maze corridors.',
    categoryId: 'mazes',
    categoryLabel: 'Mazes & Labyrinths',
    coverBg: '#E8F5E9',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.mazes,
    isSeniors: true,
    playsCount: '13.9k',
    tags: ['labyrinth', 'maze', 'path', 'routing', 'seniors']
  },
  {
    id: 'logic-grid-detective',
    title: 'Logic Grid Detective',
    shortDesc: 'Cross-reference clues on a logic grid to solve mystery puzzles.',
    instructions: 'Fill the logic matrix using clues to eliminate options and identify exact matches.',
    categoryId: 'logicgrid',
    categoryLabel: 'Logic Grid',
    coverBg: '#E0F2FE',
    coverImage: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.logicgrid,
    playsCount: '11.8k',
    tags: ['logic', 'grid', 'deduction', 'clues']
  },
  {
    id: 'problem-solver-scale',
    title: 'Problem Solving Scale',
    shortDesc: 'Solve multi-step logical balance riddles and sequence challenges.',
    instructions: 'Analyze the balance scales and deduce the missing weight value logically.',
    categoryId: 'problemsolving',
    categoryLabel: 'Problem Solving',
    coverBg: '#FFFBEB',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.problemsolving,
    playsCount: '14.2k',
    tags: ['problemsolving', 'riddle', 'reasoning']
  },
  {
    id: 'code-algo-quest',
    title: 'Programming Algo Quest',
    shortDesc: 'Use algorithms, loops, and logic blocks to guide the robot.',
    instructions: 'Arrange command blocks (Forward, Turn, Loop) to execute the correct program.',
    categoryId: 'programming',
    categoryLabel: 'Programming',
    coverBg: '#ECFDF5',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.programming,
    isTrending: true,
    playsCount: '18.1k',
    tags: ['programming', 'algorithms', 'code', 'logic']
  },
  {
    id: 'tangram-shapes',
    title: 'Tangram Master',
    shortDesc: 'Fit 7 geometric flat pieces together to form target shapes.',
    instructions: 'Drag and rotate colorful tangram tiles to fill the outline silhouette.',
    categoryId: 'tangram',
    categoryLabel: 'Tangram',
    coverBg: '#FEF2F2',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.tangram,
    isTrending: true,
    playsCount: '16.4k',
    tags: ['tangram', 'shapes', 'geometry', 'puzzle']
  },
  {
    id: 'tetris-block-fit',
    title: 'Tetris Block Puzzle',
    shortDesc: 'Fit polyomino block shapes into the grid to clear horizontal lines.',
    instructions: 'Drag polyomino blocks into the grid board. Complete lines to score points!',
    categoryId: 'tetris',
    categoryLabel: 'Tetris',
    coverBg: '#F0F9FF',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.tetris,
    isTrending: true,
    playsCount: '22.8k',
    tags: ['tetris', 'blocks', 'spatial', 'fit']
  },
  {
    id: 'solitaire-klondike',
    title: 'Classic Solitaire',
    shortDesc: 'The quintessential Klondike card game. Stack alternating suits to build foundations.',
    instructions: 'Move cards between columns in descending order alternating red and black. Move Aces to top foundations.',
    categoryId: 'solitaire',
    categoryLabel: 'Solitaire & Cards',
    coverBg: '#FFF2D6',
    coverImage: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.solitaire,
    isTrending: true,
    isSeniors: true,
    playsCount: '28.4k',
    tags: ['solitaire', 'cards', 'klondike', 'classic', 'seniors']
  },
  {
    id: 'spider-solitaire',
    title: 'Spider Solitaire',
    shortDesc: 'Arrange 8 columns of cards into complete descending suit sequences.',
    instructions: 'Build descending sequences from King down to Ace in the tableau. Clear all cards to win.',
    categoryId: 'solitaire',
    categoryLabel: 'Solitaire & Cards',
    coverBg: '#FFEAD0',
    coverImage: 'https://images.unsplash.com/photo-1563941402622-4e7a488bcc57?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.solitaire,
    playsCount: '19.1k',
    tags: ['solitaire', 'cards', 'spider', 'puzzle']
  },
  {
    id: 'word-search-quest',
    title: 'Word Search Classic',
    shortDesc: 'Find all hidden theme and logic words in the high-contrast letter grid.',
    instructions: 'Tap or drag across adjacent letters to highlight words listed in the puzzle tray.',
    categoryId: 'wordsearch',
    categoryLabel: 'Word Search & Crosswords',
    coverBg: '#F5E8FF',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.wordsearch,
    isTrending: true,
    playsCount: '24.6k',
    tags: ['wordsearch', 'words', 'grid', 'letters']
  },
  {
    id: 'crossword-mini',
    title: 'Daily Mini Crossword',
    shortDesc: 'Bite-sized daily 5x5 crossword puzzle with clever, fun clues.',
    instructions: 'Read across and down clues to fill the 5x5 crossword grid.',
    categoryId: 'wordsearch',
    categoryLabel: 'Word Search & Crosswords',
    coverBg: '#EDE9FE',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.pencil,
    isSeniors: true,
    playsCount: '17.3k',
    tags: ['crossword', 'words', 'daily', 'clues', 'seniors']
  },
  {
    id: 'trivia-brain-quiz',
    title: 'Daily Brain IQ Quiz',
    shortDesc: 'Daily series of clever deductive questions, sequence riddles, and brain teasers.',
    instructions: 'Read each logic riddle and select the mathematically or logically correct answer.',
    categoryId: 'trivia',
    categoryLabel: 'Trivia & Brain Quizzes',
    coverBg: '#FFF8D6',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.trivia,
    isTrending: true,
    isSeniors: true,
    playsCount: '26.8k',
    tags: ['trivia', 'quiz', 'iq', 'riddles', 'seniors']
  },
  {
    id: 'riddle-master',
    title: 'Mystery Logic Riddles',
    shortDesc: 'Deduce mystery scenarios using lateral thinking and strict logic clues.',
    instructions: 'Examine the detective clues and tap the only person or item that fits all criteria.',
    categoryId: 'trivia',
    categoryLabel: 'Trivia & Brain Quizzes',
    coverBg: '#FEF08A',
    coverImage: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.logicgrid,
    playsCount: '15.7k',
    tags: ['riddle', 'detective', 'trivia', 'logic']
  },
  {
    id: 'mahjong-classic',
    title: 'Mahjong Solitaire',
    shortDesc: 'Pair matching unblocked ancient tiles to disassemble the traditional pyramid.',
    instructions: 'Tap two identical tiles that have at least one free edge (left or right) and no tile on top.',
    categoryId: 'mahjong',
    categoryLabel: 'Mahjong Solitaire',
    coverBg: '#E5F9D3',
    coverImage: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.mahjong,
    isTrending: true,
    isSeniors: true,
    playsCount: '31.2k',
    tags: ['mahjong', 'tiles', 'matching', 'classic', 'seniors']
  },
  {
    id: 'mahjong-connect',
    title: 'Mahjong Link & Connect',
    shortDesc: 'Link matching tile pairs with paths that turn no more than twice.',
    instructions: 'Find matching tiles that can be joined with a straight line or a path with up to 2 bends.',
    categoryId: 'mahjong',
    categoryLabel: 'Mahjong Solitaire',
    coverBg: '#DCFCE7',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.link,
    playsCount: '18.5k',
    tags: ['mahjong', 'connect', 'link', 'matching']
  },
  {
    id: 'memory-pro-challenge',
    title: 'Memory Master 4x4',
    shortDesc: 'Test and enhance visual recall speed with high-contrast symbol cards.',
    instructions: 'Flip two cards to discover matching icons. Clear the entire board with maximum accuracy.',
    categoryId: 'memory',
    categoryLabel: 'Memory Training',
    coverBg: '#DDF4FE',
    coverImage: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.memory,
    isTrending: true,
    playsCount: '23.4k',
    tags: ['memory', 'recall', 'brain', 'cards']
  },
  {
    id: 'memory-numbers-sequence',
    title: 'Digit Sequence Memory',
    shortDesc: 'Memorize flashed numbers and repeat the sequence in exact order.',
    instructions: 'Watch the sequence of highlighted numbers and tap them back in order.',
    categoryId: 'memory',
    categoryLabel: 'Memory Training',
    coverBg: '#E0F2FE',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.numbers,
    playsCount: '16.9k',
    tags: ['memory', 'numbers', 'sequence', 'recall']
  },
  {
    id: 'water-sort-lab',
    title: 'Water Sort Lab',
    shortDesc: 'Sort colored water into test tubes until every tube holds a single pure color.',
    instructions: 'Tap a test tube to select it, then tap another tube to pour. You can only pour water if the destination has room and matches the top liquid color.',
    categoryId: 'water-sort',
    categoryLabel: 'Water Sort & Color Tubes',
    coverBg: '#E0F2FE',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.waterSort,
    isTrending: true,
    playsCount: '48.6k',
    tags: ['water-sort', 'tubes', 'color-sort', 'puzzle', 'relaxing'],
    keywords: 'water sort, water sort puzzle, color sort, tube sort, ball sort, water sort online free',
    faqs: [
      { q: 'How to play Water Sort Lab?', a: 'Tap any tube to pour liquid into another tube with the same top color.' },
      { q: 'Is there a move limit?', a: 'No, you can undo moves and think ahead at your own relaxing pace.' }
    ]
  },
  {
    id: 'sokoban-warehouse-pro',
    title: 'Sokoban Warehouse Pro',
    shortDesc: 'Push storage crates into designated target zones inside complex maze depots.',
    instructions: 'Use arrow keys, on-screen controls, or tap to move the warehouse keeper. Push crates onto yellow target markers without trapping them in corners.',
    categoryId: 'sokoban',
    categoryLabel: 'Sokoban Box Pusher',
    coverBg: '#FEF3C7',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.sokoban,
    isTrending: true,
    playsCount: '27.4k',
    tags: ['sokoban', 'box-pusher', 'warehouse', 'logic', 'puzzle'],
    keywords: 'sokoban, sokoban online, box pusher, warehouse puzzle, push box game free',
    faqs: [
      { q: 'Can you pull crates backwards?', a: 'No, in classic Sokoban rules crates can only be pushed forward.' }
    ]
  },
  {
    id: 'pipe-connect-flow',
    title: 'Pipe Connect Flow',
    shortDesc: 'Rotate pipe segments to build an unbroken aqueduct line from valve to drain.',
    instructions: 'Tap on pipe joints to rotate them 90 degrees. Complete the pipeline to let clean water flow.',
    categoryId: 'pipe',
    categoryLabel: 'Pipe Connect & Flow',
    coverBg: '#CCFBF1',
    coverImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.pipe,
    isTrending: true,
    playsCount: '22.8k',
    tags: ['pipe', 'flow', 'plumber', 'water', 'connect'],
    keywords: 'pipe connect, pipe puzzle, plumber game, water flow puzzle, connect pipes online',
    faqs: [
      { q: 'How do I rotate pipes?', a: 'Click or tap on any pipe piece to turn it clockwise 90 degrees.' }
    ]
  },
  {
    id: 'liar-logic-court',
    title: 'Liar Logic Detective',
    shortDesc: 'Evaluate testimony and deduce who is telling the truth and who is lying.',
    instructions: 'Read witness statements and identify contradictions to discover the single honest character.',
    categoryId: 'logicgrid',
    categoryLabel: 'Logic Grid & Deduction',
    coverBg: '#DCFCE7',
    coverImage: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?w=600&auto=format&fit=crop&q=80',
    iconSvg: STICKERS.logicgrid,
    isTrending: true,
    playsCount: '19.2k',
    tags: ['logicgrid', 'liarlogic', 'detective', 'riddle', 'einstein'],
    keywords: 'liar logic, logic grid, einstein riddle, truth teller puzzle, detective riddle',
    faqs: [
      { q: 'What is Liar Logic?', a: 'A deduction puzzle where knights tell only truths and knaves tell only lies.' }
    ]
  }
];

function buildGamesList(): Game[] {
  return getDiscoveredGames();
}

export const GAMES: Game[] = buildGamesList();

export function getGamesForCategory(categoryId: string): Game[] {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  const targetId = categoryId.toLowerCase();
  
  // Set of subcategories/tags to match
  const subcategories = new Set<string>(cat?.subcategories?.map(s => s.toLowerCase()) || []);
  subcategories.add(targetId);

  // Group mappings for the 14 primary categories
  if (targetId === 'all-brain' || targetId === 'brain') {
    ['all-brain', 'brain', 'logicgrid', 'problemsolving', 'numbers', 'mazes', 'programming', 'logic', 'raciocinio', 'deduction', 'liarlogic', 'secretcode', 'einstein', 'iq', 'teaser', 'mind'].forEach(s => subcategories.add(s));
  } else if (targetId === 'all-puzzle') {
    ['all-puzzle', 'puzzle', 'water-sort', 'sokoban', 'pipe', 'mahjong', 'mazes', 'tetris', 'tangram', 'dragdrop', 'blocks', 'grid', 'polyomino', 'block'].forEach(s => subcategories.add(s));
  } else if (targetId === 'mahjong') {
    ['mahjong', 'mah-jong', 'solitaire', 'tiles', 'shanghai', 'connect', 'link', 'matching'].forEach(s => subcategories.add(s));
  } else if (targetId === 'water-sort') {
    ['water-sort', 'watersort', 'liquid-sort', 'tube-sort', 'color-sort', 'ball-sort', 'tubes', 'color', 'liquid'].forEach(s => subcategories.add(s));
  } else if (targetId === 'numbers') {
    ['numbers', 'sudoku', '2048', 'math', 'digit', 'arithmetic', 'numeros', 'sequence', 'calc', 'bridge'].forEach(s => subcategories.add(s));
  } else if (targetId === 'logicgrid') {
    ['logicgrid', 'logic-grid', 'liarlogic', 'secretcode', 'einstein', 'deduction', 'fish', 'matrix', 'riddle', 'detective', 'programming', 'zebra', 'knights'].forEach(s => subcategories.add(s));
  } else if (targetId === 'sokoban') {
    ['sokoban', 'box-pusher', 'warehouse', 'crate-push', 'box', 'push', 'cargo'].forEach(s => subcategories.add(s));
  } else if (targetId === 'pipe') {
    ['pipe', 'pipes', 'pipeline', 'plumber', 'water-flow', 'connect-pipes', 'flow', 'water'].forEach(s => subcategories.add(s));
  } else if (targetId === 'kids') {
    ['kids', 'children', 'preschool', 'junior', 'easy', 'toddler', 'child', 'educational', 'criança'].forEach(s => subcategories.add(s));
  } else if (targetId === 'seniors') {
    ['seniors', 'senior', 'elderly', 'relaxing', 'large-text', 'memory-care', 'gentle', '60+', 'idoso', 'alzheimer'].forEach(s => subcategories.add(s));
  } else if (targetId === 'mazes') {
    ['mazes', 'maze', 'labyrinth', 'escape', 'pathfinding', 'labirinto'].forEach(s => subcategories.add(s));
  } else if (targetId === 'memory') {
    ['memory', 'pairs', 'match2', 'recall', 'flipcard', 'hiddenitem', 'differences', 'visual', 'memoria', 'sequence'].forEach(s => subcategories.add(s));
  } else if (targetId === 'problemsolving') {
    ['problemsolving', 'problem-solving', 'balance', 'bridge', 'rivercrossing', 'hanoi', 'physics', 'analytical', 'scale'].forEach(s => subcategories.add(s));
  } else if (targetId === 'puzzle') {
    ['puzzle', 'puzzles', 'tangram', 'cut', 'geometric', 'spatial', 'shadow', 'shapes', 'slice'].forEach(s => subcategories.add(s));
  } else if (targetId === 'block') {
    ['block', 'blocks', 'tetris', 'block-fit', 'polyomino', 'brick', 'grid-fit', 'falling-blocks'].forEach(s => subcategories.add(s));
  }

  return GAMES.filter(game => {
    // Flag matches
    if (targetId === 'kids' && game.isKids) return true;
    if (targetId === 'seniors' && game.isSeniors) return true;

    // 1. Direct Category Match
    if (game.categoryId.toLowerCase() === targetId) return true;

    // 2. Belongs to one of the target's subcategories
    if (subcategories.has(game.categoryId.toLowerCase())) return true;

    // 3. Any tag matches any target subcategory/tag
    if (game.tags && game.tags.some(tag => subcategories.has(tag.toLowerCase()) || tag.toLowerCase().includes(targetId))) return true;

    // 4. Match in keywords if provided
    if (game.keywords) {
      const kw = (Array.isArray(game.keywords) ? game.keywords.join(' ') : game.keywords).toLowerCase();
      if (kw.includes(targetId)) return true;
      for (const sub of subcategories) {
        if (kw.includes(sub)) return true;
      }
    }

    return false;
  });
}
