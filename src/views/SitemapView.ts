import { CATEGORIES, GAMES } from '../data/games';

export function renderSitemapView(container: HTMLElement): void {
  const sortedCategories = [...CATEGORIES].sort((a, b) => a.label.localeCompare(b.label));
  const sortedGames = [...GAMES].sort((a, b) => a.title.localeCompare(b.title));

  container.innerHTML = `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      <!-- Back Navigation Button -->
      <div>
        <a href="#home" class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-emerald-50 text-gray-800 hover:text-emerald-800 text-xs font-bold border border-black/10 shadow-2xs transition group text-decoration-none">
          <span class="text-emerald-700 font-extrabold group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Back to Main Menu</span>
        </a>
      </div>

      <!-- Sitemap H1 -->
      <div class="border-b border-black/10 pb-4">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          FunLogic.games Human Sitemap
        </h1>
        <p class="text-xs sm:text-sm text-gray-600 font-medium mt-1">
          Complete index of categories and published logic games by Lumia Studio.
        </p>
      </div>

      <!-- Categories Index -->
      <section>
        <h2 class="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-block mb-4">
          Game Categories (${sortedCategories.length})
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          ${sortedCategories.map(cat => `
            <a 
              href="#category/${cat.id}" 
              class="p-4 rounded-2xl border border-black/5 hover:border-emerald-500 shadow-2xs transition flex items-center justify-between group text-decoration-none"
              style="background-color: ${cat.bgPastel};"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center p-1 bg-white/70 shadow-2xs">
                  ${cat.icon}
                </div>
                <span class="text-sm font-bold text-gray-900 group-hover:text-emerald-800">${cat.label}</span>
              </div>
              <span class="text-xs font-bold text-gray-400 group-hover:text-emerald-700">→</span>
            </a>
          `).join('')}
        </div>
      </section>

      <!-- Published Games Index -->
      <section>
        <h2 class="text-xs font-bold uppercase tracking-widest text-blue-800 bg-blue-100 px-3 py-1 rounded-full inline-block mb-4">
          All Published Logic Games (${sortedGames.length})
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          ${sortedGames.map(game => `
            <a 
              href="#game/${game.id}" 
              class="p-3.5 rounded-2xl bg-white border border-black/5 hover:border-emerald-500 hover:shadow-sm transition flex items-center gap-3 group text-decoration-none"
            >
              <div class="w-9 h-9 rounded-xl flex items-center justify-center p-1.5 shrink-0 shadow-2xs" style="background-color: ${game.coverBg};">
                ${game.iconSvg}
              </div>
              <div>
                <div class="text-xs font-bold text-gray-900 group-hover:text-emerald-700 leading-snug">
                  ${game.title}
                </div>
                <div class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
                  ${game.categoryLabel}
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      </section>

    </div>
  `;
}
