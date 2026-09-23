import { Game, CategoryId } from '../types';
import { STICKERS } from '../components/Stickers';

export interface DiscoveredGameModule {
  title?: string;
  name?: string;
  instructions?: string;
  shortDesc?: string;
  description?: string;
  playsCount?: string;
  isTrending?: boolean;
  isKids?: boolean;
  isSeniors?: boolean;
  is3D?: boolean;
  tags?: string[];
  iconSvg?: string;
  coverBg?: string;
  render?: (container: HTMLElement, onWin: (timeSeconds: number, streak?: number) => void) => (() => void) | void;
  init?: (container: HTMLElement, onWin: (timeSeconds: number, streak?: number) => void) => (() => void) | void;
  renderGame?: (container: HTMLElement, onWin: (timeSeconds: number, streak?: number) => void) => (() => void) | void;
  start?: (container: HTMLElement, onWin: (timeSeconds: number, streak?: number) => void) => (() => void) | void;
  default?: ((container: HTMLElement, onWin: (timeSeconds: number, streak?: number) => void) => (() => void) | void) | any;
}

// 1. Scan dynamically all game JS/TS files inside category folders or game sub-folders
const gameModules = import.meta.glob<DiscoveredGameModule>(
  ['/src/games/*/*.{ts,js}', '/src/games/*/*/**/*.{ts,js}'],
  { eager: true }
);

// 2. Scan dynamically all images inside game folders
const gameFolderImages = import.meta.glob<{ default: string }>(
  ['/src/games/*/*/**/*.{png,jpg,jpeg,webp,svg,gif,PNG,JPG,JPEG,WEBP,SVG}', '/src/games/*/*.{png,jpg,jpeg,webp,svg,gif,PNG,JPG,JPEG,WEBP,SVG}'],
  { eager: true }
);

// 3. Scan fallback images in /src/assets/images
const assetImages = import.meta.glob<{ default: string }>(
  '/src/assets/images/*.{jpg,jpeg,png,webp,svg,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true }
);

// 4. Scan optional meta.json / game.json / info.json / metadata.json metadata in game folders
const gameJsonMetadata = import.meta.glob<Record<string, any>>(
  [
    '/src/games/*/meta.json',
    '/src/games/*/*/meta.json',
    '/src/games/*/*/*/meta.json',
    '/src/games/*/game.json',
    '/src/games/*/info.json',
    '/src/games/*/metadata.json',
    '/src/games/*/*/game.json',
    '/src/games/*/*/info.json',
    '/src/games/*/*/metadata.json',
    '/src/games/*/*/*/game.json',
    '/src/games/*/*/*/info.json',
    '/src/games/*/*/*/metadata.json'
  ],
  { eager: true }
);

// 5. Scan HTML5 standalone games (index.html or game.html)
const htmlGameUrls = import.meta.glob<{ default: string }>(
  [
    '/src/games/*/*/index.html', 
    '/src/games/*/*/game.html',
    '/src/games/*/*/*/index.html',
    '/src/games/*/*.html',
    '/src/games/*/index.html'
  ],
  { query: '?url', eager: true }
);

// 6. Scan raw HTML content to automatically read <meta name="game-category">, <title>, <meta name="game-tags">, etc.
const htmlGameRawSources = import.meta.glob<string>(
  [
    '/src/games/*/*/index.html', 
    '/src/games/*/*/game.html',
    '/src/games/*/*/*/index.html',
    '/src/games/*/*.html',
    '/src/games/*/index.html'
  ],
  { query: '?raw', import: 'default', eager: true }
);

// Helper function to extract metadata directly from raw HTML <head>
function extractMetadataFromHtml(rawHtml: string): Partial<GameFolderEntry['metadata']> {
  const result: Record<string, any> = {};

  // Extract <title>
  const titleMatch = rawHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    result.title = titleMatch[1].trim();
  }

  // Extract <meta name="game-category" content="..."> or <meta name="category" content="...">
  const catMatch = rawHtml.match(/<meta\s+[^>]*name=["'](?:game-category|category)["'][^>]*content=["']([^"']+)["']/i) ||
                   rawHtml.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["'](?:game-category|category)["']/i);
  if (catMatch && catMatch[1]) {
    result.category = catMatch[1].trim().toLowerCase();
  }

  // Extract <meta name="game-tags" content="Tag1, Tag2"> or <meta name="keywords" content="...">
  const tagsMatch = rawHtml.match(/<meta\s+[^>]*name=["'](?:game-tags|tags|keywords)["'][^>]*content=["']([^"']+)["']/i) ||
                    rawHtml.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["'](?:game-tags|tags|keywords)["']/i);
  if (tagsMatch && tagsMatch[1]) {
    result.tags = tagsMatch[1].split(',').map(t => t.trim()).filter(Boolean);
  }

  // Extract <meta name="description" content="...">
  const descMatch = rawHtml.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                    rawHtml.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
  if (descMatch && descMatch[1]) {
    result.shortDesc = descMatch[1].trim();
    result.instructions = descMatch[1].trim();
  }

  // Extract <meta name="instructions" content="...">
  const instMatch = rawHtml.match(/<meta\s+[^>]*name=["']instructions["'][^>]*content=["']([^"']+)["']/i) ||
                    rawHtml.match(/<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']instructions["']/i);
  if (instMatch && instMatch[1]) {
    result.instructions = instMatch[1].trim();
  }

  return result;
}

// Keyword-based intelligent classifier for game title/slug
function detectCategoryFromKeywords(text: string): CategoryId | null {
  const t = text.toLowerCase();

  // Exact 12 Main Categories Recognition
  if (/\b(water\s*sort|liquid\s*sort|tube\s*sort|color\s*sort|ball\s*sort|bottle\s*sort|pour\s*water)\b/.test(t)) return 'water-sort';
  if (/\b(sokoban|box\s*push|warehouse|crate\s*push|empurrar\s*caixa)\b/.test(t)) return 'sokoban';
  if (/\b(pipe|plumber|pipeline|flow\s*connect|water\s*flow|cano|tubo)\b/.test(t)) return 'pipe';
  if (/\b(mahjong|tile|connect|link|shanghai)\b/.test(t)) return 'mahjong';
  if (/\b(sudoku|2048|math|calc|arithmetic|number|sum|digit|contas|algebra)\b/.test(t)) return 'numbers';
  if (/\b(logic\s*grid|liar\s*logic|einstein|riddle|secret\s*code|detective|charada|deduction|nonogram|picross)\b/.test(t)) return 'logicgrid';
  if (/\b(maze|labyrinth|escape|labirinto|pathfinding)\b/.test(t)) return 'mazes';
  if (/\b(memory|pairs|match\s*2|memorize|flip|recall|memoria)\b/.test(t)) return 'memory';
  if (/\b(balance|scale|problem\s*solving|bridge|river\s*crossing|tower\s*of\s*hanoi|hanoi|physics)\b/.test(t)) return 'problemsolving';
  if (/\b(tangram|geometric|polygon|polyomino|cut|slice|spatial|blocks|tetris|jigsaw|slider|sliding|puzzle)\b/.test(t)) return 'puzzle';
  if (/\b(brain|mind|iq|logic|think|focus|teaser|raciocinio)\b/.test(t)) return 'all-brain';

  return null;
}

// Normalize any alias or subcategory into one of the 12 main categories
function normalizeCategoryId(rawCat?: string): CategoryId {
  if (!rawCat) return 'all-brain';
  const c = rawCat.toLowerCase().trim().replace(/_/g, '-');

  if (c === 'water-sort' || c === 'watersort' || c === 'color-sort' || c === 'tube-sort') return 'water-sort';
  if (c === 'sokoban' || c === 'box-pusher' || c === 'warehouse') return 'sokoban';
  if (c === 'pipe' || c === 'pipes' || c === 'plumber' || c === 'flow') return 'pipe';
  if (c === 'mahjong' || c === 'mah-jong') return 'mahjong';
  if (c === 'numbers' || c === 'sudoku' || c === '2048' || c === 'math' || c === 'all-numbers') return 'numbers';
  if (c === 'logicgrid' || c === 'logic-grid' || c === 'liar-logic' || c === 'secret-code' || c === 'einstein') return 'logicgrid';
  if (c === 'mazes' || c === 'maze' || c === 'labyrinth') return 'mazes';
  if (c === 'memory' || c === 'all-memory' || c === 'memoria') return 'memory';
  if (c === 'problemsolving' || c === 'problem-solving' || c === 'balance' || c === 'bridge') return 'problemsolving';
  if (c === 'puzzle' || c === 'puzzles' || c === 'tangram' || c === 'tetris' || c === 'all-puzzle') return 'puzzle';
  if (c === 'all-brain' || c === 'brain') return 'all-brain';
  if (c === 'all-puzzle') return 'all-puzzle';

  // Fallbacks for legacy tags into nearest 12 categories
  if (c === 'solitaire' || c === 'board' || c === 'all-cards') return 'mahjong';
  if (c === 'words' || c === 'wordsearch' || c === 'hangman' || c === 'trivia' || c === 'all-words') return 'all-brain';
  if (c === 'kids' || c === 'dragdrop') return 'puzzle';
  if (c === 'seniors') return 'mahjong';
  if (c === 'hiddenitem' || c === 'differences') return 'memory';
  if (c === 'programming') return 'logicgrid';

  return c as CategoryId;
}

// Helper to convert folder or file name like "quiz-das-capitais" into "Quiz Das Capitais"
function formatTitleFromSlug(slug: string): string {
  return slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

// Mapping of category ID to default friendly label, pastel color, and vector sticker
const CATEGORY_DEFAULTS: Record<string, { label: string; icon: string; bg: string }> = {
  'all-brain': { label: 'Brain & Logic (All)', icon: STICKERS.brain, bg: '#E5F9D3' },
  'all-puzzle': { label: 'Puzzles & Blocks (All)', icon: STICKERS.puzzle, bg: '#FFEED6' },
  'mahjong': { label: 'Mahjong Solitaire', icon: STICKERS.mahjong, bg: '#E5F9D3' },
  'water-sort': { label: 'Water Sort', icon: STICKERS.waterSort, bg: '#E0F2FE' },
  'numbers': { label: 'Numbers & Math', icon: STICKERS.numbers, bg: '#FFF8D6' },
  'logicgrid': { label: 'Logic Grid', icon: STICKERS.logicgrid, bg: '#DCFCE7' },
  'sokoban': { label: 'Sokoban Box Pusher', icon: STICKERS.sokoban, bg: '#FEF3C7' },
  'pipe': { label: 'Pipe Connect', icon: STICKERS.pipe, bg: '#CCFBF1' },
  'mazes': { label: 'Mazes & Labyrinths', icon: STICKERS.mazes, bg: '#E0F2FE' },
  'memory': { label: 'Memory Training', icon: STICKERS.memory, bg: '#DDF4FE' },
  'problemsolving': { label: 'Problem Solving', icon: STICKERS.problemsolving, bg: '#F1F5F9' },
  'puzzle': { label: 'Puzzles & Geometric', icon: STICKERS.puzzle, bg: '#FFE4E6' }
};

// Map of discovered game engines: gameId -> engine function
const discoveredEnginesMap = new Map<string, (container: HTMLElement, onWin: (time: number, streak?: number) => void) => (() => void) | void>();

// Map of discovered games: gameId -> Game object
const discoveredGamesMap = new Map<string, Game>();

interface GameFolderEntry {
  rawCategory: string;
  gameId: string;
  jsModules: Array<{ path: string; mod: DiscoveredGameModule }>;
  images: Array<{ path: string; filename: string; src: string }>;
  htmlUrl?: string;
  metadata?: Record<string, any>;
}

const folderMap = new Map<string, GameFolderEntry>();

function getOrCreateEntry(rawCategory: string, gameId: string): GameFolderEntry {
  const key = `${rawCategory}:::${gameId}`;
  if (!folderMap.has(key)) {
    folderMap.set(key, {
      rawCategory,
      gameId,
      jsModules: [],
      images: []
    });
  }
  return folderMap.get(key)!;
}

// 1. Process all JS/TS files
for (const [filePath, moduleExport] of Object.entries(gameModules)) {
  // Pattern A: /src/games/<category>/<gameFolder>/<subpath>.(ts|js)
  const folderMatch = filePath.match(/\/src\/games\/([^/]+)\/([^/]+)\/(.+)\.(?:ts|js)$/);
  if (folderMatch) {
    const rawCat = folderMatch[1].toLowerCase();
    const gameId = folderMatch[2].toLowerCase();
    if (gameId.startsWith('readme') || gameId.includes('template')) continue;
    const entry = getOrCreateEntry(rawCat, gameId);
    entry.jsModules.push({ path: filePath, mod: moduleExport });
    continue;
  }

  // Pattern B: /src/games/<category>/<filename>.(ts|js) or /src/games/<gameFolder>/index.(ts|js)
  const singleMatch = filePath.match(/\/src\/games\/([^/]+)\/([^/]+)\.(?:ts|js)$/);
  if (singleMatch) {
    const folderOrCat = singleMatch[1].toLowerCase();
    const rawFileName = singleMatch[2].toLowerCase();
    if (folderOrCat.startsWith('readme') || folderOrCat.includes('template')) continue;
    if (rawFileName.startsWith('readme') || rawFileName.includes('template')) continue;

    // If file is index.js or game.js inside a game folder, gameId is the folder name
    const gameId = (rawFileName === 'index' || rawFileName === 'game' || rawFileName === 'main') 
      ? folderOrCat 
      : rawFileName;

    const entry = getOrCreateEntry('brain', gameId);
    entry.jsModules.push({ path: filePath, mod: moduleExport });
  }
}

// 2. Process all images inside game folders
for (const [imgPath, imgMod] of Object.entries(gameFolderImages)) {
  const src = imgMod.default || imgPath;
  const folderMatch = imgPath.match(/\/src\/games\/([^/]+)\/([^/]+)\/(.+)$/);
  if (folderMatch) {
    const rawCat = folderMatch[1].toLowerCase();
    const gameId = folderMatch[2].toLowerCase();
    const subpath = folderMatch[3];
    const filename = subpath.split('/').pop() || subpath;
    const entry = getOrCreateEntry(rawCat, gameId);
    entry.images.push({ path: imgPath, filename, src });
    continue;
  }

  const directMatch = imgPath.match(/\/src\/games\/([^/]+)\/([^/]+)\.[^.]+$/);
  if (directMatch) {
    const gameId = directMatch[1].toLowerCase();
    const filename = directMatch[2];
    const entry = getOrCreateEntry('brain', gameId);
    entry.images.push({ path: imgPath, filename, src });
    continue;
  }
}

// 3. Process optional JSON metadata files (game.json / info.json)
for (const [jsonPath, jsonMod] of Object.entries(gameJsonMetadata)) {
  const folderMatch = jsonPath.match(/\/src\/games\/([^/]+)\/([^/]+)\/[^/]+\.json$/);
  if (folderMatch) {
    const rawCat = folderMatch[1].toLowerCase();
    const gameId = folderMatch[2].toLowerCase();
    const entry = getOrCreateEntry(rawCat, gameId);
    entry.metadata = jsonMod;
  } else {
    const directMatch = jsonPath.match(/\/src\/games\/([^/]+)\/[^/]+\.json$/);
    if (directMatch) {
      const gameId = directMatch[1].toLowerCase();
      const entry = getOrCreateEntry('brain', gameId);
      entry.metadata = jsonMod;
    }
  }
}

// 4. Process HTML5 standalone games (index.html, game.html or [gameId].html)
for (const [htmlPath, htmlMod] of Object.entries(htmlGameUrls)) {
  let rawCat = 'brain';
  let gameId = '';

  const folderMatch = htmlPath.match(/\/src\/games\/([^/]+)\/([^/]+)\/[^/]+\.html$/);
  if (folderMatch) {
    rawCat = folderMatch[1].toLowerCase();
    gameId = folderMatch[2].toLowerCase();
  } else {
    const singleMatch = htmlPath.match(/\/src\/games\/([^/]+)\/([^/]+)\.html$/);
    if (singleMatch) {
      rawCat = singleMatch[1].toLowerCase();
      gameId = singleMatch[2].toLowerCase();
    } else {
      const flatMatch = htmlPath.match(/\/src\/games\/([^/]+)\/index\.html$/);
      if (flatMatch) {
        gameId = flatMatch[1].toLowerCase();
        rawCat = 'brain';
      }
    }
  }

  if (!gameId) continue;

  const entry = getOrCreateEntry(rawCat, gameId);
  entry.htmlUrl = htmlMod.default || htmlPath;

  // Check if we have raw HTML content to extract meta tags
  const rawHtml = (htmlGameRawSources as Record<string, string>)[htmlPath];
  if (rawHtml && typeof rawHtml === 'string') {
    const extracted = extractMetadataFromHtml(rawHtml);
    entry.metadata = {
      ...(entry.metadata || {}),
      ...extracted
    };
  }
}

// 5. Assemble all detected games
for (const entry of folderMap.values()) {
  const { rawCategory, gameId, jsModules, images, htmlUrl, metadata } = entry;

  // Check if meta.json or HTML explicitly specified category, or if detected from title/slug
  const explicitCat = (metadata?.categoryId || metadata?.category || metadata?.gameCategory)?.toString().toLowerCase();
  const detectedCat = detectCategoryFromKeywords(metadata?.title || gameId);

  let finalCatKey = normalizeCategoryId(explicitCat || (rawCategory in CATEGORY_DEFAULTS ? rawCategory : detectedCat || 'all-brain'));
  const catDef = CATEGORY_DEFAULTS[finalCatKey] || CATEGORY_DEFAULTS['all-brain'];
  const categoryId = finalCatKey;

  // Pick the best entry point module (index.js > game.js > main.js > [gameId].js > first module)
  let chosenMod: DiscoveredGameModule | undefined = undefined;
  if (jsModules.length > 0) {
    const indexMod = jsModules.find(m => m.path.endsWith('/index.js') || m.path.endsWith('/index.ts'));
    const gameMod = jsModules.find(m => m.path.endsWith('/game.js') || m.path.endsWith('/game.ts'));
    const mainMod = jsModules.find(m => m.path.endsWith('/main.js') || m.path.endsWith('/main.ts'));
    const namedMod = jsModules.find(m => m.path.includes(`/${gameId}.`));
    chosenMod = (indexMod || gameMod || mainMod || namedMod || jsModules[0])?.mod;
  }

  // Determine cover image (coverImage in meta.json > cover.* > thumb.* > icon.* > [gameId].* > first image in folder)
  let coverImageSrc: string | undefined = metadata?.coverImage || undefined;
  if (!coverImageSrc && images.length > 0) {
    const coverImg = images.find(i => /^cover\./i.test(i.filename));
    const thumbImg = images.find(i => /^thumb/i.test(i.filename));
    const iconImg = images.find(i => /^icon\./i.test(i.filename));
    const namedImg = images.find(i => i.filename.toLowerCase().startsWith(gameId));
    coverImageSrc = (coverImg || thumbImg || iconImg || namedImg || images[0])?.src;
  }

  // Fallback to /src/assets/images/<gameId>.*
  if (!coverImageSrc) {
    for (const [imgPath, imgMod] of Object.entries(assetImages)) {
      const imgMatch = imgPath.match(/\/src\/assets\/images\/([^/]+)\.[^.]+$/);
      if (imgMatch && imgMatch[1].toLowerCase() === gameId) {
        coverImageSrc = imgMod.default || imgPath;
        break;
      }
    }
  }

  // Build the game engine function
  let engineFn: ((container: HTMLElement, onWin: (time: number, streak?: number) => void) => (() => void) | void) | undefined = undefined;

  if (chosenMod) {
    const modExportFn = chosenMod.render || chosenMod.init || chosenMod.renderGame || chosenMod.start ||
      (typeof chosenMod.default === 'function' ? chosenMod.default : undefined);
    if (modExportFn) {
      engineFn = modExportFn;
    }
  }

  // If there's an HTML5 index.html and no direct JS engine function, run inside an iframe
  if (!engineFn && htmlUrl) {
    engineFn = (container: HTMLElement, onWin: (time: number, streak?: number) => void) => {
      let timerSeconds = 0;
      const interval = setInterval(() => timerSeconds++, 1000);

      container.innerHTML = `
        <div class="relative w-full h-[620px] max-h-[82vh] rounded-2xl overflow-hidden bg-black shadow-xl flex flex-col">
          <iframe 
            src="${htmlUrl}" 
            class="w-full flex-1 border-0" 
            allow="autoplay; fullscreen; gamepad; clipboard-write" 
            allowfullscreen>
          </iframe>
          <div class="h-10 bg-gray-900/90 backdrop-blur px-4 flex items-center justify-between text-xs text-gray-300">
            <span class="font-bold flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Jogo Carregado
            </span>
            <button id="btn-iframe-finish" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition">
              Concluir / Vencer 🏆
            </button>
          </div>
        </div>
      `;

      const onMessage = (event: MessageEvent) => {
        if (event.data === 'win' || event.data?.type === 'win' || event.data?.action === 'win') {
          clearInterval(interval);
          onWin(event.data.time || timerSeconds, event.data.streak);
        }
      };

      window.addEventListener('message', onMessage);

      const finishBtn = container.querySelector('#btn-iframe-finish');
      finishBtn?.addEventListener('click', () => {
        clearInterval(interval);
        onWin(timerSeconds);
      });

      return () => {
        clearInterval(interval);
        window.removeEventListener('message', onMessage);
      };
    };
  }

  if (engineFn) {
    discoveredEnginesMap.set(gameId, engineFn);
  }

  const finalId = metadata?.id || gameId;
  const title = metadata?.title || chosenMod?.title || chosenMod?.name || formatTitleFromSlug(gameId);
  const instructions = metadata?.instructions || chosenMod?.instructions || chosenMod?.description || `Resolva o desafio lógico para vencer.`;
  const shortDesc = metadata?.shortDesc || chosenMod?.shortDesc || instructions;
  const description = metadata?.description || instructions;
  const playsCount = metadata?.playsCount || chosenMod?.playsCount || undefined;
  const ratingValue = metadata?.ratingValue || metadata?.rating || undefined;
  const ratingCount = metadata?.ratingCount || metadata?.reviewsCount || metadata?.reviews || undefined;

  // Extract tags & keywords
  let tags: string[] = metadata?.tags || chosenMod?.tags || [catDef.label, 'Logic', 'Puzzle'];
  if (typeof tags === 'string') {
    tags = (tags as string).split(',').map(t => t.trim()).filter(Boolean);
  }

  const keywords = metadata?.keywords || metadata?.seoKeywords || undefined;
  const faqs = metadata?.faqs || metadata?.faq || undefined;

  const discoveredGame: Game = {
    id: finalId,
    title,
    shortDesc,
    description,
    instructions,
    categoryId,
    categoryLabel: catDef.label,
    coverBg: metadata?.coverBg || chosenMod?.coverBg || catDef.bg,
    coverImage: coverImageSrc,
    iconSvg: metadata?.iconSvg || chosenMod?.iconSvg || catDef.icon,
    isTrending: metadata?.isTrending ?? chosenMod?.isTrending ?? false,
    isKids: metadata?.isKids ?? chosenMod?.isKids ?? (categoryId === 'puzzle' && finalId.includes('kid')),
    isSeniors: metadata?.isSeniors ?? chosenMod?.isSeniors ?? false,
    is3D: metadata?.is3D ?? chosenMod?.is3D ?? false,
    isHtmlGame: !!htmlUrl,
    htmlUrl: htmlUrl,
    playsCount,
    ratingValue,
    ratingCount,
    tags,
    keywords,
    faqs
  };

  discoveredGamesMap.set(finalId, discoveredGame);
}

/**
 * Retorna todos os jogos descobertos automaticamente nas pastas de jogos e meta.json.
 */
export function getDiscoveredGames(): Game[] {
  return Array.from(discoveredGamesMap.values());
}

/**
 * Retorna o motor de execução do jogo caso tenha sido adicionado em uma pasta de categoria.
 */
export function getDiscoveredEngine(gameId: string) {
  return discoveredEnginesMap.get(gameId) || null;
}
