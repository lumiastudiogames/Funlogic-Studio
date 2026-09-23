import { CATEGORIES, GAMES, getGamesForCategory } from '../data/games';
import { CategoryId, FilterState, Game } from '../types';
import { createGameCardHTML } from '../components/GameCard';
import { getFilterPreferences, setFilterPreferences } from '../utils/storage';
import { enableDragScroll } from '../utils/dragInteraction';
import { updateHeadSeo } from '../utils/seo';

export function renderCategoryView(
  container: HTMLElement,
  categoryId: CategoryId,
  pageNumber: number = 1
): void {
  const category = CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[0];
  const filterPref = getFilterPreferences();
  const currentViewMode = filterPref.viewMode || 'carousel';

  // Dynamic SEO Injection for Category View
  updateHeadSeo({
    title: `${category.label} Games`,
    description: category.description || `Play the best ${category.label} games online free with no download.`,
    keywords: category.keywords,
    type: 'website',
    faqs: category.faqs
  });

  // Multi-tag & hierarchical subcategory matching
  let allCategoryGames = getGamesForCategory(categoryId);

  // Sorting logic
  let sortedGames = [...allCategoryGames];
  if (filterPref.sortBy === 'az') {
    sortedGames.sort((a, b) => a.title.localeCompare(b.title));
  } else if (filterPref.sortBy === 'popular') {
    sortedGames.sort((a, b) => (parseFloat(b.playsCount || '0') || 0) - (parseFloat(a.playsCount || '0') || 0));
  } else if (filterPref.sortBy === 'new') {
    sortedGames.reverse();
  }

  // Pagination logic (applied when in Grid mode or for chunks)
  const itemsPerPage = filterPref.showCount === 'all' ? sortedGames.length : Number(filterPref.showCount);
  const totalPages = Math.ceil(sortedGames.length / (itemsPerPage || 1)) || 1;
  const currentPage = Math.min(Math.max(1, pageNumber), totalPages);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGames = currentViewMode === 'carousel' 
    ? sortedGames 
    : sortedGames.slice(startIndex, startIndex + itemsPerPage);

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      <!-- Back Navigation Button -->
      <div>
        <a href="#home" class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 shadow-2xs transition group text-decoration-none">
          <span class="text-[#58CC02] font-extrabold group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Voltar à Página Inicial</span>
        </a>
      </div>

      <!-- Main Category Buttons Carousel Bar -->
      <section class="bg-slate-800/90 p-3.5 sm:p-4 rounded-3xl border border-slate-700/80 shadow-md">
        <div class="flex items-center justify-between gap-2 mb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xs font-black uppercase tracking-wider text-[#58CC02]">Todas as Categorias</span>
          </div>
          <div class="flex items-center gap-1.5">
            <button 
              id="cat-view-scroll-prev" 
              title="Scroll left" 
              class="w-7 h-7 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center text-xs font-black transition active:scale-95 cursor-pointer border border-slate-600"
            >
              ‹
            </button>
            <button 
              id="cat-view-scroll-next" 
              title="Scroll right" 
              class="w-7 h-7 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 flex items-center justify-center text-xs font-black transition active:scale-95 cursor-pointer border border-slate-600"
            >
              ›
            </button>
          </div>
        </div>

        <!-- Single Horizontal Carousel Bar containing all 12 categories -->
        <div id="category-view-strip" class="no-scrollbar flex items-center gap-2 overflow-x-auto py-1 scroll-smooth">
          ${CATEGORIES.map((c) => {
            const isSelected = c.id === categoryId;
            const count = getGamesForCategory(c.id).length;
            return `
              <a 
                href="#category/${c.id}"
                class="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black transition text-decoration-none shadow-xs border-2 ${isSelected ? 'bg-[#58CC02] text-white border-[#46A302] scale-102 shadow-md' : 'bg-slate-900/90 text-slate-200 border-slate-700 hover:border-[#58CC02] hover:text-white hover:bg-slate-900'}"
                title="${c.label}"
              >
                <span class="w-4 h-4 inline-flex items-center justify-center">${c.icon}</span>
                <span>${c.shortName}</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-300 font-bold'}">${count}</span>
              </a>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Category Header Title & Description -->
      <div class="p-5 sm:p-6 rounded-3xl border border-black/5 shadow-xs" style="background-color: ${category.bgPastel};">
        <div class="flex items-center gap-3.5 mb-2">
          <div class="sticker-2d5-badge sticker-2d5-lg shrink-0 flex items-center justify-center p-3">
            ${category.icon}
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                ${category.label}
              </h1>
              <span class="text-xs font-black bg-white text-gray-800 px-2.5 py-1 rounded-full border border-gray-300 shadow-2xs">
                ${sortedGames.length} ${sortedGames.length === 1 ? 'Jogo' : 'Jogos'}
              </span>
            </div>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-gray-700 font-medium max-w-2xl leading-relaxed">
          ${category.description}
        </p>
      </div>

      <!-- Controls & View Mode Switcher (Carrossel vs Grade) -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        <!-- View Mode Selector -->
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-gray-500">Visualização:</span>
          <div class="flex items-center bg-gray-100 p-1 rounded-xl">
            <button 
              id="btn-mode-carousel"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${currentViewMode === 'carousel' ? 'bg-[#58CC02] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}"
              title="Modo Carrossel (Horizontal / Não estica a tela no celular)"
            >
              <span>🎠</span>
              <span>Carrossel</span>
            </button>
            <button 
              id="btn-mode-grid"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${currentViewMode === 'grid' ? 'bg-[#58CC02] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'}"
              title="Modo Grade"
            >
              <span>⊞</span>
              <span>Grade</span>
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between sm:justify-end gap-3">
          <!-- Sort Selector -->
          <div class="flex items-center gap-2 text-xs font-bold text-gray-600">
            <span>Ordenar:</span>
            <select id="select-sort" class="bg-gray-100 border border-gray-200 hover:border-gray-300 focus:border-[#58CC02] rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 focus:outline-none cursor-pointer">
              <option value="az" ${filterPref.sortBy === 'az' ? 'selected' : ''}>A–Z (Ordem Alfabética)</option>
              <option value="popular" ${filterPref.sortBy === 'popular' ? 'selected' : ''}>Mais Populares</option>
              <option value="new" ${filterPref.sortBy === 'new' ? 'selected' : ''}>Mais Recentes</option>
            </select>
          </div>

          ${currentViewMode === 'carousel' ? `
            <!-- Carousel Quick Arrow Navigation -->
            <div class="flex items-center gap-1.5">
              <button 
                id="games-carousel-prev" 
                title="Voltar jogos"
                class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-[#58CC02] hover:text-white text-slate-700 flex items-center justify-center text-sm font-black border border-slate-200 shadow-2xs transition active:scale-95 cursor-pointer select-none"
              >
                ‹
              </button>
              <button 
                id="games-carousel-next" 
                title="Avançar jogos"
                class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-[#58CC02] hover:text-white text-slate-700 flex items-center justify-center text-sm font-black border border-slate-200 shadow-2xs transition active:scale-95 cursor-pointer select-none"
              >
                ›
              </button>
            </div>
          ` : `
            <!-- Show Selector for Grid Mode -->
            <div class="flex items-center gap-2 text-xs font-bold text-gray-600">
              <span>Mostrar:</span>
              <div class="flex items-center bg-gray-100 p-1 rounded-xl">
                ${[10, 20, 'all'].map(count => `
                  <button 
                    class="btn-show px-2.5 py-1 rounded-lg transition text-xs ${filterPref.showCount.toString() === count.toString() ? 'bg-white text-emerald-800 shadow-xs font-extrabold' : 'text-gray-600 hover:text-gray-900'}"
                    data-count="${count}"
                  >
                    ${count === 'all' ? 'Todos' : count}
                  </button>
                `).join('')}
              </div>
            </div>
          `}
        </div>

      </div>

      <!-- MAIN GAMES CONTAINER: CAROUSEL VS GRID -->
      ${currentViewMode === 'carousel' ? `
        <!-- CAROUSEL MODE (Mobile Optimized / Horizontal Touch Swipe) -->
        <section class="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-md space-y-3">
          
          <div class="flex items-center justify-between gap-2 px-1">
            <h3 class="text-sm sm:text-base font-extrabold text-white tracking-tight">
              Jogos da Categoria
            </h3>
            <span class="text-[11px] font-extrabold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700 shrink-0">
              ${sortedGames.length} ${sortedGames.length === 1 ? 'jogo' : 'jogos'}
            </span>
          </div>

          <!-- Horizontal Carousel Track with Snap Points -->
          <div 
            id="games-carousel-track" 
            class="flex items-stretch gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-2 -mx-2 px-2 sm:mx-0 sm:px-0"
          >
            ${sortedGames.map(game => `
              <div class="w-[80vw] max-w-[290px] xs:w-[260px] sm:w-[280px] shrink-0 snap-start flex flex-col">
                ${createGameCardHTML(game)}
              </div>
            `).join('')}
          </div>
        </section>
      ` : `
        <!-- GRID MODE (Classic Multi-Column) -->
        <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 p-1 pt-2 pb-2">
          ${paginatedGames.map(createGameCardHTML).join('')}
        </div>

        <!-- Numeric Pagination for Grid -->
        ${totalPages > 1 ? `
          <div class="flex items-center justify-center gap-2 pt-4">
            ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
              <a 
                href="#category/${categoryId}/page/${p}" 
                class="w-10 h-10 rounded-xl font-extrabold text-xs flex items-center justify-center transition text-decoration-none ${p === currentPage ? 'bg-[#58CC02] text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 border border-black/5'}"
              >
                ${p}
              </a>
            `).join('')}
          </div>
        ` : ''}
      `}

      <!-- Category SEO & FAQs Section -->
      <div class="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div class="flex items-center gap-3">
          <div class="sticker-2d5-badge sticker-2d5-sm flex items-center justify-center p-2">
            ${category.icon}
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-black text-gray-900">Sobre ${category.label}</h2>
            <p class="text-xs text-gray-500 font-bold">Guia de jogabilidade e dicas</p>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
          ${category.description}
        </p>

        ${category.keywords && category.keywords.length > 0 ? `
          <div>
            <span class="text-[11px] font-black uppercase text-gray-500 block mb-2">Termos e Palavras-chave</span>
            <div class="flex flex-wrap gap-1.5">
              ${category.keywords.map(kw => `
                <span class="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg border border-gray-200/80">
                  ${kw}
                </span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${category.faqs && category.faqs.length > 0 ? `
          <div class="pt-4 border-t border-gray-100 space-y-3">
            <h3 class="text-sm font-black text-gray-900 uppercase tracking-wide">Perguntas Frequentes (FAQ)</h3>
            <div class="space-y-2.5">
              ${category.faqs.map(faq => `
                <div class="bg-gray-50 rounded-2xl p-4 border border-gray-200/60">
                  <h4 class="text-xs sm:text-sm font-extrabold text-gray-900 mb-1 flex items-center gap-2">
                    <span class="text-[#58CC02] font-black">P:</span> ${faq.q || faq.question}
                  </h4>
                  <p class="text-xs text-gray-600 font-medium leading-relaxed pl-5">
                    ${faq.a || faq.answer}
                  </p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

    </div>
  `;

  // Attach top category bar carousel controls
  const catViewStrip = container.querySelector('#category-view-strip') as HTMLElement;
  if (catViewStrip) {
    enableDragScroll(catViewStrip);
    const catPrev = container.querySelector('#cat-view-scroll-prev');
    const catNext = container.querySelector('#cat-view-scroll-next');
    catPrev?.addEventListener('click', () => catViewStrip.scrollBy({ left: -260, behavior: 'smooth' }));
    catNext?.addEventListener('click', () => catViewStrip.scrollBy({ left: 260, behavior: 'smooth' }));
  }

  // Attach game carousel controls and drag-scrolling
  const gamesCarouselTrack = container.querySelector('#games-carousel-track') as HTMLElement;
  if (gamesCarouselTrack) {
    enableDragScroll(gamesCarouselTrack);
    const gamesPrev = container.querySelector('#games-carousel-prev');
    const gamesNext = container.querySelector('#games-carousel-next');
    gamesPrev?.addEventListener('click', () => gamesCarouselTrack.scrollBy({ left: -280, behavior: 'smooth' }));
    gamesNext?.addEventListener('click', () => gamesCarouselTrack.scrollBy({ left: 280, behavior: 'smooth' }));
  }

  // Attach View Mode Toggle Listeners
  const btnCarousel = container.querySelector('#btn-mode-carousel');
  const btnGrid = container.querySelector('#btn-mode-grid');

  btnCarousel?.addEventListener('click', () => {
    setFilterPreferences({ viewMode: 'carousel' });
    renderCategoryView(container, categoryId, 1);
  });

  btnGrid?.addEventListener('click', () => {
    setFilterPreferences({ viewMode: 'grid' });
    renderCategoryView(container, categoryId, 1);
  });

  // Attach show count listeners (for grid mode)
  container.querySelectorAll('.btn-show').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const countVal = (e.currentTarget as HTMLElement).dataset.count;
      const count = countVal === 'all' ? 'all' : parseInt(countVal || '10', 10);
      setFilterPreferences({ showCount: count });
      renderCategoryView(container, categoryId, 1);
    });
  });

  // Attach sort selector listener
  const sortSelect = container.querySelector('#select-sort') as HTMLSelectElement;
  sortSelect?.addEventListener('change', () => {
    setFilterPreferences({ sortBy: sortSelect.value as any });
    renderCategoryView(container, categoryId, 1);
  });
}

