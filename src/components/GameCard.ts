import { Game } from '../types';
import { STICKERS } from './Stickers';
import { getGameLiveStats } from '../utils/gameStats';
import { getGameCoverUrl, getGameCoverPlaceholder } from '../utils/imageUtils';

export function createGameCardHTML(game: Game, options?: { isPriority?: boolean } | boolean | number): string {
  const coverImgSrc = getGameCoverUrl(game);
  const fallbackSvg = getGameCoverPlaceholder(game);
  const isPriority = typeof options === 'boolean' 
    ? options 
    : (options && typeof options === 'object' && 'isPriority' in options) 
    ? Boolean(options.isPriority) 
    : false;
  const stats = getGameLiveStats(game);

  const specialBadgeOverlay = game.isKids 
    ? '<span class="text-[10px] font-black bg-sky-500 text-white shadow-xs px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">Kids</span>' 
    : game.isSeniors 
    ? '<span class="text-[10px] font-black bg-amber-500 text-white shadow-xs px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">60+</span>' 
    : game.isTrending 
    ? `<span class="text-[10px] font-black bg-amber-500 text-white shadow-xs px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 whitespace-nowrap"><span class="w-3 h-3 inline-block filter brightness-200">${STICKERS.flame}</span>Popular</span>` 
    : game.is3D 
    ? '<span class="text-[10px] font-black bg-indigo-600 text-white shadow-xs px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">3D</span>' 
    : '';

  return `
    <div class="game-card-touch duo-card-3d group flex flex-col justify-between h-full p-3 sm:p-3.5 rounded-3xl text-current select-none bg-white hover:border-[#58CC02] border-2 border-slate-200 shadow-sm transition-all overflow-hidden" data-game-id="${game.id}">
      
      <!-- Clickable Photo/Cover: Leads to Individual Info Page (#game/:id) -->
      <a 
        href="#game/${game.id}" 
        class="block aspect-[4/3] w-full rounded-2xl relative overflow-hidden bg-slate-100 flex items-center justify-center shadow-xs shrink-0 text-decoration-none group/img cursor-pointer"
        style="background-color: ${game.coverBg};"
        title="View info & details for ${game.title}"
      >
        <img 
          src="${coverImgSrc}" 
          alt="${game.title}"
          class="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-300 ease-out"
          referrerpolicy="no-referrer"
          loading="${isPriority ? 'eager' : 'lazy'}"
          decoding="async"
          fetchpriority="${isPriority ? 'high' : 'low'}"
          width="400"
          height="300"
          onerror="this.onerror=null;this.src='${fallbackSvg}';"
        />
        
        ${specialBadgeOverlay ? `
          <div class="absolute top-2.5 left-2.5 z-10 pointer-events-none drop-shadow-sm">
            ${specialBadgeOverlay}
          </div>
        ` : ''}

        <div class="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
          <span class="opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/75 text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-xs">
            ℹ️ Info
          </span>
        </div>
      </a>

      <!-- Game Title & Category Badges -->
      <div class="mt-2.5 px-0.5 flex flex-col justify-between flex-1 space-y-2 min-w-0">
        <a 
          href="#game/${game.id}" 
          class="flex items-center gap-2 text-decoration-none group/title cursor-pointer min-w-0"
          title="View info for ${game.title}"
        >
          <span class="w-6 h-6 sm:w-7 sm:h-7 shrink-0 flex items-center justify-center filter drop-shadow-2xs leading-none">${game.iconSvg}</span>
          <div class="text-xs sm:text-sm font-black text-gray-900 truncate leading-snug group-hover/title:text-[#58CC02] transition-colors min-w-0 flex-1">
            ${game.title}
          </div>
        </a>

        <div class="flex items-center justify-between text-[11px] text-gray-500 font-bold gap-1.5 pt-2 border-t border-gray-100 min-w-0">
          <div class="flex items-center gap-1 min-w-0 overflow-hidden">
            <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black uppercase tracking-wider truncate max-w-[95px] sm:max-w-none">${game.categoryLabel}</span>
          </div>
          <div class="flex items-center gap-1 sm:gap-1.5 text-[10px] text-gray-500 font-extrabold shrink-0 ml-auto whitespace-nowrap">
            ${stats.isNew 
              ? '<span class="bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black whitespace-nowrap">✨ New</span>' 
              : `<span class="text-amber-500 font-black whitespace-nowrap">★ ${stats.ratingValue.toFixed(1)}</span>`
            }
            ${stats.playsCount > 0 ? `<span class="text-gray-400 whitespace-nowrap hidden min-[360px]:inline">▶ ${stats.formattedPlaysCount}</span>` : ''}
          </div>
        </div>
      </div>

      <!-- BIG GREEN PLAY BUTTON (1-Click Instant Play to #play/:id) -->
      <a 
        href="#play/${game.id}" 
        class="w-full mt-3 py-2.5 px-3 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] active:scale-[0.98] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_3px_0_0_#46A302] active:shadow-none active:translate-y-0.5 transition-all text-decoration-none cursor-pointer tracking-wide uppercase group/play"
        title="Play ${game.title} Now"
      >
        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current group-hover/play:scale-110 transition-transform" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span>PLAY</span>
      </a>

    </div>
  `;
}




