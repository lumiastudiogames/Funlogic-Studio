import { Game } from '../types';
import { STICKERS } from './Stickers';
import { getGameLiveStats } from '../utils/gameStats';

export function createGameCardHTML(game: Game): string {
  const coverImgSrc = game.coverImage || `https://picsum.photos/seed/${game.id}/600/600`;
  const stats = getGameLiveStats(game);

  const specialBadge = game.isKids 
    ? '<span class="text-[10px] font-black bg-sky-100 text-sky-700 px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">Kids</span>' 
    : game.isSeniors 
    ? '<span class="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">60+</span>' 
    : game.isTrending 
    ? `<span class="text-[10px] font-black bg-amber-50 text-[#E58700] border border-amber-200/70 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0 whitespace-nowrap"><span class="w-3.5 h-3.5 inline-block">${STICKERS.flame}</span>Popular</span>` 
    : game.is3D 
    ? '<span class="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md shrink-0 whitespace-nowrap">3D</span>' 
    : '';

  return `
    <div class="game-card-touch duo-card-3d group flex flex-col justify-between h-full p-2.5 sm:p-3 rounded-3xl text-current select-none bg-white hover:border-[#58CC02] border-2 border-slate-200 shadow-sm transition-all" data-game-id="${game.id}">
      
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
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
          <span class="opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/75 text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-xs">
            ℹ️ Info
          </span>
        </div>
      </a>

      <!-- Game Title & Category Badges -->
      <div class="mt-2.5 px-0.5 flex flex-col justify-between flex-1 space-y-1.5">
        <a 
          href="#game/${game.id}" 
          class="flex items-center gap-2 text-decoration-none group/title cursor-pointer"
          title="View info for ${game.title}"
        >
          <span class="w-6 h-6 sm:w-7 sm:h-7 shrink-0 flex items-center justify-center filter drop-shadow-2xs leading-none">${game.iconSvg}</span>
          <div class="text-xs sm:text-sm font-black text-gray-900 line-clamp-1 truncate leading-snug group-hover/title:text-[#58CC02] transition-colors">
            ${game.title}
          </div>
        </a>

        <div class="flex items-center justify-between text-[11px] text-gray-500 font-bold gap-1.5 pt-2 border-t border-gray-100">
          <div class="flex items-center gap-1.5 shrink-0">
            <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider whitespace-nowrap">${game.categoryLabel}</span>
            ${specialBadge}
          </div>
          <div class="flex items-center gap-1.5 text-[10px] text-gray-500 font-extrabold shrink-0 ml-auto whitespace-nowrap">
            ${stats.isNew 
              ? '<span class="bg-emerald-50 text-emerald-700 border border-emerald-200/70 px-2 py-0.5 rounded text-[10px] font-black whitespace-nowrap">Novo</span>' 
              : `<span class="text-amber-500 font-black whitespace-nowrap">★ ${stats.ratingValue.toFixed(1)}</span>`
            }
            <span class="text-gray-400 whitespace-nowrap">▶ ${stats.formattedPlaysCount}</span>
          </div>
        </div>
      </div>

      <!-- BIG GREEN PLAY BUTTON (1-Click Instant Play to #play/:id) -->
      <a 
        href="#play/${game.id}" 
        class="w-full mt-2.5 py-2 sm:py-2.5 px-3 rounded-xl sm:rounded-2xl bg-[#58CC02] hover:bg-[#46A302] active:scale-[0.98] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-[0_3px_0_0_#46A302] active:shadow-none active:translate-y-0.5 transition-all text-decoration-none cursor-pointer tracking-wide uppercase group/play"
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




