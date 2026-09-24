import { Game, CategoryId } from '../types';
import { STICKERS } from '../components/Stickers';
import { CANONICAL_103_GAMES, CANONICAL_SLUG_SET } from '../data/canonicalGames';

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

// 1. Scan dynamically all images inside game folders
const gameFolderImages = import.meta.glob<{ default: string }>(
  ['/src/games/**/*.{png,jpg,jpeg,webp,svg,gif,PNG,JPG,JPEG,WEBP,SVG}'],
  { eager: true }
);

// 2. Scan fallback images in /src/assets/images
const assetImages = import.meta.glob<{ default: string }>(
  '/src/assets/images/*.{jpg,jpeg,png,webp,svg,gif,JPG,JPEG,PNG,WEBP}',
  { eager: true }
);

// 3. Scan JSON metadata files (meta.json)
const gameJsonMetadata = import.meta.glob<Record<string, any>>(
  ['/src/games/**/meta.json'],
  { eager: true }
);



// Mapping of category ID to default friendly label, pastel color, and vector sticker
export const CATEGORY_DEFAULTS: Record<string, { label: string; icon: string; bg: string }> = {
  'logic': { label: 'Logic Challenges', icon: STICKERS.brain, bg: '#DCFCE7' },
  'water-sort': { label: 'Water Sort', icon: STICKERS.waterSort, bg: '#E0F2FE' },
  'kids': { label: 'Kids', icon: STICKERS.kids, bg: '#FEF3C7' },
  'physics': { label: 'Physics & Mechanics', icon: STICKERS.problemsolving, bg: '#F1F5F9' },
  'mahjong': { label: 'Mahjong Classic', icon: STICKERS.mahjong, bg: '#E5F9D3' },
  'chess': { label: 'Chess & Tactics', icon: STICKERS.board || STICKERS.puzzle, bg: '#E5F9D3' },
  'memory': { label: 'Memory & Pairs', icon: STICKERS.memory, bg: '#FCE7F3' },
  'sudoku': { label: 'Sudoku & Numbers', icon: STICKERS.numbers, bg: '#FFF8D6' },
  'escape': { label: 'Escape Room', icon: STICKERS.mazes, bg: '#FEF3C7' },
  'seniors': { label: 'Seniors', icon: STICKERS.seniors, bg: '#FCE7F3' },
  // legacy/fallback categories
  'all-brain': { label: 'Brain & Logic (All)', icon: STICKERS.brain, bg: '#E5F9D3' },
  'all-puzzle': { label: 'Puzzles & Blocks (All)', icon: STICKERS.puzzle, bg: '#FFEED6' },
  'numbers': { label: 'Numbers & Math', icon: STICKERS.numbers, bg: '#FFF8D6' },
  'sokoban': { label: 'Sokoban Box Pusher', icon: STICKERS.sokoban, bg: '#FEF3C7' },
  'pipe': { label: 'Pipe Connect & Flow Logic', icon: STICKERS.pipe, bg: '#CCFBF1' },
  'mazes': { label: 'Mazes & Labyrinths', icon: STICKERS.mazes, bg: '#E0F2FE' },
  'problemsolving': { label: 'Problem Solving & Balance Logic', icon: STICKERS.problemsolving, bg: '#F1F5F9' },
  'puzzle': { label: 'Puzzles, Cut & Tangram Shapes', icon: STICKERS.puzzle, bg: '#FFE4E6' }
};

// Helper function to extract canonical slug from any file path
function extractSlug(filePath: string): string | null {
  const norm = filePath.replace(/\\/g, '/');
  // Check seniors folder first: /src/games/seniors/<slug>/...
  const seniorsMatch = norm.match(/\/seniors\/([^/]+)/);
  if (seniorsMatch && CANONICAL_SLUG_SET.has(seniorsMatch[1])) {
    return seniorsMatch[1];
  }
  // Check kids folder: /src/games/kids/<slug>/...
  const kidsMatch = norm.match(/\/kids\/([^/]+)/);
  if (kidsMatch && CANONICAL_SLUG_SET.has(kidsMatch[1])) {
    return kidsMatch[1];
  }
  // Check root games folder: /src/games/<slug>/...
  const rootMatch = norm.match(/\/src\/games\/([^/]+)/) || norm.match(/\/games\/([^/]+)/);
  if (rootMatch && CANONICAL_SLUG_SET.has(rootMatch[1])) {
    return rootMatch[1];
  }
  return null;
}

// Map of discovered game engines: gameId -> engine function
const discoveredEnginesMap = new Map<string, (container: HTMLElement, onWin: (time: number, streak?: number) => void) => (() => void) | void>();

// Map of discovered games: gameId -> Game object (strictly 103 items)
const discoveredGamesMap = new Map<string, Game>();

interface GameAssetRecord {
  slug: string;
  metadata?: Record<string, any>;
  htmlUrl?: string;
  coverImage?: string;
  rawHtml?: string;
}

const gameAssetMap = new Map<string, GameAssetRecord>();

// Pre-populate asset map with all 103 canonical games
for (const canonical of CANONICAL_103_GAMES) {
  gameAssetMap.set(canonical.slug, { slug: canonical.slug });
}


// 2. Process all meta.json files
for (const [jsonPath, jsonMod] of Object.entries(gameJsonMetadata)) {
  const slug = extractSlug(jsonPath);
  if (!slug) continue;
  const record = gameAssetMap.get(slug);
  if (!record) continue;

  // Prefer direct root meta.json (/games/<slug>/meta.json) over nested
  if (!record.metadata || jsonPath.endsWith(`/${slug}/meta.json`)) {
    record.metadata = jsonMod;
  }
}

// 3. Process all cover images
for (const [imgPath, imgMod] of Object.entries(gameFolderImages)) {
  const slug = extractSlug(imgPath);
  if (!slug) continue;
  const record = gameAssetMap.get(slug);
  if (!record) continue;

  const src = imgMod.default || imgPath;
  const filename = imgPath.split('/').pop() || '';

  // Priorities: cover.(webp|png|jpg|jpeg) > thumb.* > cover.svg > any image
  if (/^cover\.(webp|png|jpg|jpeg)$/i.test(filename)) {
    record.coverImage = src;
  } else if (/^thumb/i.test(filename) && (!record.coverImage || record.coverImage.endsWith('.svg'))) {
    record.coverImage = src;
  } else if (/^cover\.svg$/i.test(filename) && !record.coverImage) {
    record.coverImage = src;
  } else if (!record.coverImage) {
    record.coverImage = src;
  }
}

// Fallback to /src/assets/images/<slug>.*
for (const [imgPath, imgMod] of Object.entries(assetImages)) {
  const imgMatch = imgPath.match(/\/src\/assets\/images\/([^/]+)\.[^.]+$/);
  if (imgMatch) {
    const slug = imgMatch[1].toLowerCase();
    const record = gameAssetMap.get(slug);
    if (record && !record.coverImage) {
      record.coverImage = imgMod.default || imgPath;
    }
  }
}

// 4. Build all 104 canonical games
const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

for (const canonical of CANONICAL_103_GAMES) {
  const slug = canonical.slug;
  const record = gameAssetMap.get(slug);
  const metadata = record?.metadata;
  const htmlUrl = `${base}/games/${slug}/index.html`;
  const coverImage = record?.coverImage;

  const catId = canonical.categoryId as CategoryId;
  const catDef = CATEGORY_DEFAULTS[canonical.categoryId] || CATEGORY_DEFAULTS['logic'];

  // Engine registration for standalone HTML games in isolated iframe
  if (htmlUrl) {
    const engineFn = (container: HTMLElement, onWin: (time: number, streak?: number) => void) => {
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

    discoveredEnginesMap.set(slug, engineFn);
  }

  // Tags & keywords
  let tags: string[] = metadata?.tags || [canonical.categoryLabel, 'Logic', 'Puzzle'];
  if (typeof tags === 'string') {
    tags = (tags as string).split(',').map(t => t.trim()).filter(Boolean);
  }

  const isKids = canonical.categoryId === 'kids' || metadata?.isKids === true;
  const isSeniors = canonical.categoryId === 'seniors' || metadata?.isSeniors === true;
  const is3D = false;

  const game: Game = {
    id: slug,
    title: canonical.title,
    shortDesc: canonical.description,
    description: canonical.description,
    instructions: metadata?.instructions || canonical.description,
    categoryId: catId,
    categoryLabel: canonical.categoryLabel,
    coverBg: metadata?.coverBg || catDef.bg,
    coverImage: coverImage,
    iconSvg: metadata?.iconSvg || catDef.icon,
    isTrending: metadata?.isTrending ?? (canonical.num <= 4),
    isKids,
    isSeniors,
    is3D,
    isHtmlGame: !!htmlUrl,
    htmlUrl: htmlUrl,
    playsCount: metadata?.playsCount,
    ratingValue: metadata?.ratingValue,
    ratingCount: metadata?.ratingCount,
    tags,
    keywords: metadata?.keywords,
    faqs: metadata?.faqs
  };

  discoveredGamesMap.set(slug, game);
}

/**
 * Retorna exatamente os 103 jogos oficiais descobertos e cadastrados.
 */
export function getDiscoveredGames(): Game[] {
  return Array.from(discoveredGamesMap.values());
}

/**
 * Retorna o motor de execução do jogo.
 */
export function getDiscoveredEngine(gameId: string) {
  return discoveredEnginesMap.get(gameId) || null;
}
