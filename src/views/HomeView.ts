import { CATEGORIES, GAMES, getGamesForCategory } from '../data/games';
import { createGameCardHTML } from '../components/GameCard';
import { createInFeedAdHTML } from '../components/AdBanner';
import { getDailyState } from '../utils/storage';
import { enableDragScroll } from '../utils/dragInteraction';
import { STICKERS } from '../components/Stickers';
import { updateHeadSeo } from '../utils/seo';

export function renderHomeView(container: HTMLElement): void {
  const dailyState = getDailyState();

  // Dynamic SEO Injection for Home View
  updateHeadSeo({
    title: 'Casual Logic & Reasoning Games — FunLogic.games',
    description: 'Play the best free online logic puzzles, water sort, mahjong, sudoku, 2048, sokoban box push, pipe connect, and brain training games directly in your browser with no download.',
    keywords: [
      'brain games', 'logic puzzles', 'water sort online', 'mahjong solitaire',
      'sudoku free', '2048 game', 'sokoban online', 'pipe connect', 'unblocked games'
    ],
    canonicalUrl: 'https://funlogic.games/',
    type: 'website'
  });

  const trendingGames = GAMES.filter(g => g.isTrending).slice(0, 4);
  const kidsGames = GAMES.filter(g => g.isKids || g.categoryId === 'kids');
  const seniorsGames = GAMES.filter(g => g.isSeniors || g.categoryId === 'seniors');

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 sm:space-y-12">
      
      <section class="rounded-3xl border-2 border-[#58CC02] border-b-6 overflow-hidden p-5 sm:p-6 bg-[#E5F9D3] shadow-sm">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="sticker-2d5-badge sticker-2d5-lg shrink-0 hidden sm:flex items-center justify-center p-3.5">
              ${STICKERS.brain}
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-[10px] font-black uppercase tracking-widest text-[#46A302] bg-white border-2 border-[#58CC02] px-3 py-0.5 rounded-full">
                  Daily Challenge
                </span>
                <span class="text-xs font-black text-[#E58700] bg-[#FFEED6] border-2 border-[#FF9600] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span class="w-3.5 h-3.5 inline-block">${STICKERS.flame}</span>
                  <span>${dailyState.streak} Day Streak</span>
                </span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                Daily Brain Logic Puzzle
              </h2>
              <p class="text-xs sm:text-sm text-gray-700 font-bold mt-1">
                New logic puzzle available every day!
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
            <a 
              href="#game/daily-brain-challenge" 
              class="h-12 px-7 rounded-2xl btn-duo-green font-black text-base flex items-center justify-center gap-2 text-decoration-none shrink-0"
            >
              <span>Play Now</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <h2 class="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Trending Now
            </h2>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              Popular <span class="w-3.5 h-3.5 inline-block">${STICKERS.flame}</span>
            </span>
          </div>
          <a href="#sitemap" class="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            See all →
          </a>
        </div>

        <div id="trending-strip" class="no-scrollbar flex items-stretch gap-4 sm:gap-6 overflow-x-auto pt-3.5 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          ${trendingGames.map(game => `
            <div class="w-[260px] xs:w-[270px] sm:w-[280px] shrink-0 flex flex-col">
              ${createGameCardHTML(game)}
            </div>
          `).join('')}
        </div>
      </section>

      <section>
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <h3 class="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-500">
              Explore Categories
            </h3>
          </div>

          <!-- Carousel Scroll Buttons -->
          <div class="flex items-center gap-1.5">
            <button 
              id="cat-strip-prev" 
              title="Scroll categories left"
              class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-black border border-gray-200 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              ‹
            </button>
            <button 
              id="cat-strip-next" 
              title="Scroll categories right"
              class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white hover:bg-gray-100 text-gray-700 flex items-center justify-center text-sm font-black border border-gray-200 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>

        <!-- Single Horizontal Carousel Bar containing the 12 main category buttons -->
        <div id="category-strip" class="no-scrollbar flex items-center gap-2.5 overflow-x-auto pt-1 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
          ${CATEGORIES.map((cat, idx) => {
            const count = getGamesForCategory(cat.id).length;
            return `
              <a 
                href="#category/${cat.id}" 
                class="shrink-0 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border-2 border-gray-200 hover:border-[#58CC02] border-b-4 hover:border-b-4 transition group text-decoration-none shadow-xs hover:scale-102"
                style="background-color: ${cat.bgPastel};"
                title="${cat.label}"
              >
                <span class="sticker-2d5-badge sticker-2d5-sm flex items-center justify-center p-1">${cat.icon}</span>
                <div class="flex flex-col text-left leading-tight">
                  <span class="text-xs font-black text-gray-900 whitespace-nowrap">${cat.shortName}</span>
                  <span class="text-[10px] font-extrabold text-emerald-800">${count} games</span>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      </section>

      ${createInFeedAdHTML()}

      <section class="rounded-3xl border-2 border-[#1CB0F6] border-b-6 p-5 sm:p-6 bg-[#DDF4FE] shadow-xs">
        <div class="flex items-center justify-between mb-4 gap-2">
          <div>
            <div class="flex items-center gap-2.5">
              <h2 class="flex flex-col text-gray-900 tracking-tight">
                <span class="text-xl sm:text-2xl font-black leading-none">Kids</span>
                <span class="text-xs sm:text-sm font-extrabold text-[#1899D6] tracking-normal mt-0.5">Ages 3–8</span>
              </h2>
              <span class="text-xs font-black bg-white text-[#1899D6] px-3 py-1 rounded-full border-2 border-[#1CB0F6] shadow-2xs hidden sm:inline-block shrink-0">
                No Reading
              </span>
            </div>
            <p class="text-xs sm:text-sm text-gray-700 font-bold mt-1.5">
              Visual comprehension, large touch targets, and calm gentle colors.
            </p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <a href="#category/kids" class="text-xs font-black text-[#1899D6] hover:text-[#1CB0F6] bg-white px-3 py-1.5 rounded-xl border-2 border-[#1CB0F6] border-b-4 text-decoration-none">
              See all →
            </a>
            <button 
              id="kids-prev" 
              title="Previous" 
              class="w-8 h-8 rounded-full bg-white text-blue-900 hover:bg-blue-600 hover:text-white border border-blue-200 flex items-center justify-center text-xs font-bold transition active:scale-95 shadow-2xs cursor-pointer select-none"
            >
              ◀
            </button>
            <button 
              id="kids-next" 
              title="Next" 
              class="w-8 h-8 rounded-full bg-white text-blue-900 hover:bg-blue-600 hover:text-white border border-blue-200 flex items-center justify-center text-xs font-bold transition active:scale-95 shadow-2xs cursor-pointer select-none"
            >
              ▶
            </button>
          </div>
        </div>

        <div id="kids-strip" class="no-scrollbar flex items-stretch gap-4 sm:gap-6 overflow-x-auto scroll-smooth pt-3.5 pb-4 -mx-2 px-2 sm:mx-0 sm:px-0">
          ${kidsGames.map(game => `
            <div class="w-[260px] xs:w-[270px] sm:w-[280px] shrink-0 flex flex-col">
              ${createGameCardHTML(game)}
            </div>
          `).join('')}
        </div>
      </section>

      <section class="rounded-3xl border-2 border-[#FFC800] border-b-6 p-5 sm:p-6 bg-[#FFF8D6] shadow-xs">
        <div class="flex items-center justify-between mb-4 gap-2">
          <div>
            <div class="flex items-center gap-2.5">
              <h2 class="flex flex-col text-gray-900 tracking-tight">
                <span class="text-xl sm:text-2xl font-black leading-none">Seniors</span>
                <span class="text-xs sm:text-sm font-extrabold text-[#E5B200] tracking-normal mt-0.5">Ages 60+</span>
              </h2>
              <span class="text-xs font-black bg-white text-[#E5B200] px-3 py-1 rounded-full border-2 border-[#FFC800] shadow-2xs hidden sm:inline-block shrink-0">
                Large Print
              </span>
            </div>
            <p class="text-xs sm:text-sm text-gray-800 font-bold mt-1.5">
              No rush, no timer. Play at your own pace.
            </p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <a href="#category/seniors" class="text-xs font-black text-[#E5B200] hover:text-[#FFC800] bg-white px-3 py-1.5 rounded-xl border-2 border-[#FFC800] border-b-4 text-decoration-none">
              See all →
            </a>
            <button 
              id="seniors-prev" 
              title="Previous" 
              class="w-8 h-8 rounded-full bg-white text-amber-900 hover:bg-amber-600 hover:text-white border border-amber-200 flex items-center justify-center text-xs font-bold transition active:scale-95 shadow-2xs cursor-pointer select-none"
            >
              ◀
            </button>
            <button 
              id="seniors-next" 
              title="Next" 
              class="w-8 h-8 rounded-full bg-white text-amber-900 hover:bg-amber-600 hover:text-white border border-amber-200 flex items-center justify-center text-xs font-bold transition active:scale-95 shadow-2xs cursor-pointer select-none"
            >
              ▶
            </button>
          </div>
        </div>

        <div id="seniors-strip" class="no-scrollbar flex items-stretch gap-4 sm:gap-6 overflow-x-auto scroll-smooth pt-3.5 pb-4 -mx-2 px-2 sm:mx-0 sm:px-0">
          ${seniorsGames.map(game => `
            <div class="w-[260px] xs:w-[270px] sm:w-[280px] shrink-0 flex flex-col">
              ${createGameCardHTML(game)}
            </div>
          `).join('')}
        </div>
      </section>

      ${createInFeedAdHTML()}

      <section id="showcase-section" class="relative bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-md border border-slate-800">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-white/10 pb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span id="showcase-count-badge" class="text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                ${GAMES.length} Games
              </span>
            </div>
            <h2 class="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              All Games
            </h2>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-auto">
            <button 
              id="showcase-prev" 
              title="Scroll Left" 
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-[#58CC02] hover:text-white active:scale-95 text-white font-bold flex items-center justify-center transition border border-white/10 shadow-sm cursor-pointer select-none"
            >
              ◀
            </button>
            <button 
              id="showcase-next" 
              title="Scroll Right" 
              class="w-10 h-10 rounded-full bg-white/10 hover:bg-[#58CC02] hover:text-white active:scale-95 text-white font-bold flex items-center justify-center transition border border-white/10 shadow-sm cursor-pointer select-none"
            >
              ▶
            </button>
          </div>
        </div>

        <!-- All Games Horizontal Scrollable Track: Supports Mouse Drag & Touch Swipe -->
        <div 
          id="all-games-strip" 
          class="no-scrollbar flex items-stretch gap-4 sm:gap-6 overflow-x-auto scroll-smooth pt-2 pb-4 -mx-2 px-2 sm:mx-0 sm:px-0 cursor-grab active:cursor-grabbing select-none"
        >
          ${GAMES.map(game => `
            <div class="w-[260px] xs:w-[270px] sm:w-[280px] shrink-0 flex flex-col">
              ${createGameCardHTML(game)}
            </div>
          `).join('')}
        </div>

        <!-- Interactive Progress Footer -->
        <div class="flex items-center justify-end mt-3 pt-3 border-t border-white/10 text-xs text-slate-400 font-bold">
          <div class="w-28 sm:w-44 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div id="all-games-progress" class="h-full bg-[#58CC02] rounded-full transition-all duration-150" style="width: 12%;"></div>
          </div>
        </div>
      </section>

    </div>
  `;

  const trendingStrip = container.querySelector('#trending-strip') as HTMLElement;
  if (trendingStrip) {
    enableDragScroll(trendingStrip);
  }

  const categoryStrip = container.querySelector('#category-strip') as HTMLElement;
  if (categoryStrip) {
    enableDragScroll(categoryStrip);
    const catPrev = container.querySelector('#cat-strip-prev');
    const catNext = container.querySelector('#cat-strip-next');
    catPrev?.addEventListener('click', () => categoryStrip.scrollBy({ left: -280, behavior: 'smooth' }));
    catNext?.addEventListener('click', () => categoryStrip.scrollBy({ left: 280, behavior: 'smooth' }));
  }

  const kidsStrip = container.querySelector('#kids-strip') as HTMLElement;
  if (kidsStrip) {
    enableDragScroll(kidsStrip);
    const kidsPrev = container.querySelector('#kids-prev');
    const kidsNext = container.querySelector('#kids-next');
    kidsPrev?.addEventListener('click', () => kidsStrip.scrollBy({ left: -320, behavior: 'smooth' }));
    kidsNext?.addEventListener('click', () => kidsStrip.scrollBy({ left: 320, behavior: 'smooth' }));
  }

  const seniorsStrip = container.querySelector('#seniors-strip') as HTMLElement;
  if (seniorsStrip) {
    enableDragScroll(seniorsStrip);
    const seniorsPrev = container.querySelector('#seniors-prev');
    const seniorsNext = container.querySelector('#seniors-next');
    seniorsPrev?.addEventListener('click', () => seniorsStrip.scrollBy({ left: -320, behavior: 'smooth' }));
    seniorsNext?.addEventListener('click', () => seniorsStrip.scrollBy({ left: 320, behavior: 'smooth' }));
  }

  // All Games: Drag-to-Scroll & Touch Swipe Support
  const allGamesStrip = container.querySelector('#all-games-strip') as HTMLElement;
  const showcasePrev = container.querySelector('#showcase-prev') as HTMLElement;
  const showcaseNext = container.querySelector('#showcase-next') as HTMLElement;
  const allGamesProgress = container.querySelector('#all-games-progress') as HTMLElement;

  if (allGamesStrip) {
    enableDragScroll(allGamesStrip);

    showcasePrev?.addEventListener('click', () => {
      allGamesStrip.scrollBy({ left: -340, behavior: 'smooth' });
    });

    showcaseNext?.addEventListener('click', () => {
      allGamesStrip.scrollBy({ left: 340, behavior: 'smooth' });
    });

    // Update dynamic progress bar on scroll
    allGamesStrip.addEventListener('scroll', () => {
      const maxScroll = allGamesStrip.scrollWidth - allGamesStrip.clientWidth;
      if (maxScroll > 0 && allGamesProgress) {
        const pct = Math.min(100, Math.max(10, Math.round((allGamesStrip.scrollLeft / maxScroll) * 100)));
        allGamesProgress.style.width = `${pct}%`;
      }
    }, { passive: true });
  }
}
