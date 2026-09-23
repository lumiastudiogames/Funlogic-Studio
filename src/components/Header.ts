import { GAMES } from '../data/games';
import { getStoredFontScale, setStoredFontScale } from '../utils/storage';
import { STICKERS } from './Stickers';

export function renderHeader(container: HTMLElement, onNavigate: (route: string) => void): void {
  const currentScale = getStoredFontScale();

  container.innerHTML = `
    <header class="w-full game-console-header shadow-xl">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-0">
        <div class="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-3 sm:h-16">
          
          <!-- Logo - Highlighted & Always Visible (Order 1 on mobile, left) -->
          <a href="#home" id="header-logo" class="order-1 flex items-center gap-2 sm:gap-2.5 text-decoration-none group shrink-0">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#58CC02] text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-md border-b-4 border-[#46A302] group-hover:scale-105 transition-transform shrink-0">
              F
            </div>
            <div class="flex flex-col">
              <span class="font-black text-base sm:text-xl tracking-tight text-white leading-none block drop-shadow-xs">
                FunLogic<span class="text-[#58CC02]">.games</span>
              </span>
              <span class="text-[9px] sm:text-[10px] font-black tracking-wider text-[#1CB0F6] uppercase leading-none block mt-0.5">
                Logic Game Portal
              </span>
            </div>
          </a>

          <!-- Right Controls: Daily Shortcut & Accessibility (Order 2 on mobile, right) -->
          <div class="order-2 flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            <!-- Font Size Controls (A- / A+) - Desktop Only -->
            <div class="hidden sm:flex items-center bg-slate-800 p-1 rounded-2xl border-2 border-slate-700">
              <button 
                id="btn-font-down" 
                title="Diminuir fonte"
                class="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 text-xs font-black text-white flex items-center justify-center transition cursor-pointer border-b-2 border-slate-900"
              >
                A−
              </button>
              <button 
                id="btn-font-up" 
                title="Aumentar fonte"
                class="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 active:scale-95 text-sm font-black text-white flex items-center justify-center transition cursor-pointer border-b-2 border-slate-900"
              >
                A+
              </button>
            </div>

            <!-- Daily Challenge Shortcut (Duolingo 3D Extruded Button) -->
            <a 
              href="#daily" 
              class="h-9 sm:h-10 px-3 sm:px-4 rounded-2xl btn-duo-green font-black text-xs sm:text-sm flex items-center gap-1.5 text-decoration-none shrink-0 whitespace-nowrap shadow-md"
            >
              <span>Daily</span>
              <span class="w-4 h-4 inline-block">${STICKERS.flame}</span>
            </a>

          </div>

          <!-- Search with Autocomplete (Order 3 on mobile: full width on bottom line; Order 2 on desktop: center) -->
          <div class="order-3 sm:order-2 w-full sm:w-auto sm:flex-1 sm:max-w-md mx-0 sm:mx-6 pt-1 sm:pt-0 relative">
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none select-none flex items-center justify-center">${STICKERS.hiddenitem}</span>
              <input 
                type="text" 
                id="search-input"
                placeholder="Buscar jogos de lógica..." 
                class="w-full h-10 pl-10 pr-8 bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-900 border-2 border-slate-700 focus:border-[#58CC02] rounded-2xl text-xs sm:text-sm font-bold text-white placeholder-slate-400 focus:outline-none transition cursor-text shadow-inner"
                autocomplete="off"
              />
              <button id="search-clear" class="hidden absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white font-bold text-xs p-1">
                ✕
              </button>
            </div>

            <!-- Autocomplete Dropdown -->
            <div id="search-results" class="hidden absolute left-0 right-0 top-12 bg-white rounded-2xl shadow-2xl border-2 border-slate-700 border-b-6 overflow-hidden z-50 max-h-80 overflow-y-auto">
            </div>
          </div>

        </div>
      </div>
    </header>
  `;

  // Attach Event Listeners
  const searchInput = container.querySelector('#search-input') as HTMLInputElement;
  const searchClear = container.querySelector('#search-clear') as HTMLButtonElement;
  const searchResults = container.querySelector('#search-results') as HTMLElement;

  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      searchClear.classList.add('hidden');
      searchResults.classList.add('hidden');
      searchResults.innerHTML = '';
      return;
    }

    searchClear.classList.remove('hidden');

    const matches = GAMES.filter(g => 
      g.title.toLowerCase().includes(query) ||
      g.categoryLabel.toLowerCase().includes(query) ||
      g.tags.some(t => t.toLowerCase().includes(query))
    );

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div class="p-4 text-center text-sm text-gray-500 font-medium">
          No logic games found for "<span class="text-gray-800 font-bold">${query}</span>". Try another search!
        </div>
      `;
    } else {
      searchResults.innerHTML = matches.slice(0, 6).map(g => `
        <a href="#game/${g.id}" class="search-item flex items-center gap-3 p-3 hover:bg-emerald-50 transition border-b border-black/5 last:border-none text-decoration-none">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style="background-color: ${g.coverBg};">
            ${g.iconSvg}
          </div>
          <div>
            <div class="text-sm font-bold text-gray-900">${g.title}</div>
            <div class="text-xs text-gray-500 font-medium">${g.categoryLabel}</div>
          </div>
        </a>
      `).join('');
    }

    searchResults.classList.remove('hidden');
  }

  searchInput?.addEventListener('input', handleSearch);

  searchClear?.addEventListener('click', () => {
    searchInput.value = '';
    handleSearch();
    searchInput.focus();
  });

  // Hide dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target as Node)) {
      searchResults?.classList.add('hidden');
    }
  });

  // Font Scaling Buttons
  const btnDown = container.querySelector('#btn-font-down');
  const btnUp = container.querySelector('#btn-font-up');

  btnDown?.addEventListener('click', () => {
    const cur = getStoredFontScale();
    setStoredFontScale(cur - 0.05);
  });

  btnUp?.addEventListener('click', () => {
    const cur = getStoredFontScale();
    setStoredFontScale(cur + 0.05);
  });
}
