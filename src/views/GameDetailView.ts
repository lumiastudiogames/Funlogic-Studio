import { CATEGORIES, GAMES, getGamesForCategory } from '../data/games';
import { Game } from '../types';
import { createGameCardHTML } from '../components/GameCard';
import { updateHeadSeo } from '../utils/seo';
import { STICKERS } from '../components/Stickers';
import { getGameLiveStats, recordGameRating, recordGamePlay } from '../utils/gameStats';

export function renderGameDetailView(container: HTMLElement, gameId: string): void {
  const game: Game = GAMES.find(g => g.id === gameId) || GAMES[0];
  const category = CATEGORIES.find(c => c.id === game.categoryId) || CATEGORIES[0];
  const stats = getGameLiveStats(game);

  // Comprehensive ~200 words SEO Description
  const baseDesc = game.shortDesc || game.description || '';
  const fullDescription = baseDesc.length > 120 
    ? baseDesc 
    : `Play ${game.title} online for free with no download required on mobile, tablet, and desktop browsers. ${game.title} is an engaging casual logic puzzle that challenges your spatial deduction, pattern recognition, and problem-solving agility. Master progressively difficult stages, explore intuitive one-touch mechanics, and exercise your brain with untimed, stress-free gameplay. Whether you are looking for a quick mental break or deep strategic challenge, ${game.title} provides hours of unblocked entertainment with full undo support and instant restarts.`;

  // Ensure 3 Rich SEO FAQs
  const gameFaqs = (game.faqs && game.faqs.length >= 3) ? game.faqs : [
    {
      q: `How do I play ${game.title} online with no download?`,
      a: `You can play ${game.title} directly in any modern browser on mobile, tablet, Chromebook, or desktop PC with zero installation. Simply click the green "PLAY" button to start instantly.`
    },
    {
      q: `Is ${game.title} unblocked and safe for school and work?`,
      a: `Yes, ${game.title} is 100% web-based, family-friendly, ad-light, and unblocked on school networks, Chromebooks, and office browsers without plugins.`
    },
    {
      q: `What cognitive benefits and skills are developed in ${game.title}?`,
      a: `${game.title} stimulates working memory, spatial visualization, forward planning, and logical deduction. It offers untimed modes perfect for kids, adults, and seniors seeking relaxing brain training.`
    }
  ];

  // Dynamic Real SEO Schema Injection
  updateHeadSeo({
    title: `${game.title} - Play Free Online (No Download)`,
    description: fullDescription,
    keywords: game.keywords || game.tags,
    imageUrl: game.coverImage,
    type: 'game',
    faqs: gameFaqs,
    ratingValue: stats.ratingValue,
    ratingCount: stats.ratingCount
  });

  // Get Related Games in the same category (excluding current)
  const relatedGames = getGamesForCategory(game.categoryId)
    .filter(g => g.id !== game.id)
    .slice(0, 4);

  // Format Keywords List
  const keywordsList: string[] = Array.isArray(game.keywords) 
    ? game.keywords 
    : typeof game.keywords === 'string' 
    ? (game.keywords as string).split(',').map(k => k.trim()) 
    : (game.tags || []);

  const audienceBadge = game.isKids 
    ? '<span class="px-2.5 py-1 rounded-lg text-xs font-black bg-sky-500/20 text-sky-300 border border-sky-500/30">🧸 Kids (5-12)</span>' 
    : game.isSeniors 
    ? '<span class="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">👵 Seniors 60+</span>' 
    : '<span class="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">⚡ All Ages</span>';

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      <!-- Top Breadcrumb & Back Navigation -->
      <div class="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-400">
        <div class="flex items-center gap-2">
          <a href="#home" class="hover:text-white transition flex items-center gap-1 text-decoration-none text-slate-400">
            <span>🏠 Home</span>
          </a>
          <span>›</span>
          <a href="#category/${game.categoryId}" class="hover:text-[#58CC02] transition text-decoration-none text-slate-300">
            <span>${category.label}</span>
          </a>
          <span>›</span>
          <span class="text-white font-extrabold truncate max-w-[180px] sm:max-w-none">${game.title}</span>
        </div>

        <a href="#category/${game.categoryId}" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition text-decoration-none border border-slate-700 shadow-2xs">
          <span>← Back to ${category.shortName}</span>
        </a>
      </div>

      <!-- Hero Game Card Showcase (Poki & CrazyGames style) -->
      <section class="bg-slate-900/90 rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          <!-- Left: Big Cover Frame with badges -->
          <div class="lg:col-span-5 flex flex-col items-center">
            <div class="w-full aspect-[4/3] rounded-2xl sm:rounded-3xl relative overflow-hidden bg-slate-800 border-2 border-slate-700/80 shadow-lg group">
              <img 
                src="${game.coverImage || `https://picsum.photos/seed/${game.id}/800/600`}" 
                alt="${game.title} Cover" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />
              <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span class="bg-black/75 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border border-white/10">
                  100% Free
                </span>
                <span class="bg-[#58CC02] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-xs">
                  No Download
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Info, Rating, Keywords, and BIG GREEN PLAY BUTTON -->
          <div class="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <a href="#category/${game.categoryId}" class="px-3 py-1 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-decoration-none">
                  ${game.categoryLabel}
                </a>
                ${audienceBadge}
                ${game.isTrending ? '<span class="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">🔥 Trending</span>' : ''}
              </div>

              <h1 class="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                ${game.title}
              </h1>

              <!-- Live Organic Rating, Reviews and Plays Stats (Google Compliant) -->
              <div class="flex items-center gap-3 text-xs font-bold text-slate-400 mb-3 flex-wrap">
                <div class="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700" id="detail-rating-box">
                  ${stats.isNew 
                    ? '<span class="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-lg text-xs font-black">✨ Novo jogo</span><span class="text-slate-400 text-xs">Sem avaliações ainda</span>' 
                    : `<span class="text-amber-400 font-black text-sm">★ ${stats.ratingValue.toFixed(1)}</span><span class="text-slate-400 font-medium">(${stats.ratingCount} ${stats.ratingCount === 1 ? 'avaliação' : 'avaliações'})</span>`
                  }
                </div>
                <span>•</span>
                <div class="flex items-center gap-1.5 text-emerald-400 font-black bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-800/40">
                  <span>▶ ${stats.playsCount} ${stats.playsCount === 1 ? 'Jogada' : 'Jogadas'}</span>
                </div>
                <span>•</span>
                <span class="text-slate-300">
                  ⚡ Instant Web Play
                </span>
              </div>

              <p class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed line-clamp-3 sm:line-clamp-none">
                ${fullDescription}
              </p>
            </div>

            <!-- BIG PROMINENT GREEN PLAY BUTTON -->
            <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a 
                href="#play/${game.id}" 
                id="btn-play-hero"
                class="inline-flex items-center justify-center gap-3 px-8 py-4 sm:py-4.5 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] text-white font-black text-lg sm:text-xl shadow-[0_6px_0_0_#3B8601] hover:shadow-[0_4px_0_0_#3B8601] hover:translate-y-0.5 active:translate-y-1.5 active:shadow-none transition-all text-decoration-none uppercase tracking-wider group cursor-pointer"
                title="Play ${game.title} Now"
              >
                <span class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-4 h-4 fill-white translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </span>
                <span>PLAY NOW — JOGAR GRÁTIS</span>
              </a>

              <div class="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-400">
                <span>📱 Mobile Touch</span>
                <span>•</span>
                <span>💻 Keyboard Ready</span>
                <span>•</span>
                <span>🔒 Unblocked</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- Game Details, Instructions & Keywords -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left 2 Cols: Game Guide & Mechanics -->
        <div class="lg:col-span-2 space-y-6">
          <section class="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-md space-y-4">
            <h2 class="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>📖</span>
              <span>About & How to Play ${game.title}</span>
            </h2>
            
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ${fullDescription}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <div class="text-xs font-black text-[#58CC02] uppercase tracking-wider mb-1">🎮 Desktop Controls</div>
                <div class="text-xs text-slate-300">Click with mouse or use Arrow / WASD keys depending on the puzzle engine.</div>
              </div>
              <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <div class="text-xs font-black text-[#1CB0F6] uppercase tracking-wider mb-1">📱 Mobile & Tablet</div>
                <div class="text-xs text-slate-300">Intuitive responsive touch controls with large tap targets and virtual buttons.</div>
              </div>
            </div>
          </section>

          <!-- 3 FAQs Section with Schema FAQPage -->
          <section class="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-md space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>❓</span>
                <span>Frequently Asked Questions</span>
              </h2>
              <span class="text-[10px] uppercase font-black tracking-wider text-[#58CC02] bg-[#58CC02]/10 border border-[#58CC02]/20 px-2.5 py-1 rounded-full">
                FAQ Guide
              </span>
            </div>

            <div class="space-y-3">
              ${gameFaqs.map((faq, index) => `
                <div class="rounded-2xl bg-slate-800/90 border border-slate-700/70 p-4 transition-all">
                  <div class="text-sm font-black text-white mb-1.5 flex items-start gap-2">
                    <span class="text-[#58CC02] font-black shrink-0">Q${index + 1}:</span>
                    <span>${faq.q || faq.question}</span>
                  </div>
                  <div class="text-xs text-slate-300 leading-relaxed pl-6">
                    ${faq.a || faq.answer}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        </div>

        <!-- Right 1 Col: Keywords, Tags & Features Badge -->
        <div class="space-y-6">
          
          <!-- Keywords Cloud -->
          <section class="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-md space-y-3">
            <h3 class="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>🏷️</span>
              <span>Game Keywords & Tags</span>
            </h3>
            <div class="flex flex-wrap gap-1.5">
              ${keywordsList.map(kw => `
                <span class="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700/60 hover:text-white hover:border-[#58CC02] transition cursor-default">
                  #${kw}
                </span>
              `).join('')}
            </div>
          </section>

          <!-- Highlights -->
          <section class="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 shadow-md space-y-3">
            <h3 class="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>✨</span>
              <span>Key Features</span>
            </h3>
            <ul class="text-xs text-slate-300 space-y-2">
              <li class="flex items-center gap-2">
                <span class="text-[#58CC02] font-bold">✓</span>
                <span>Zero download, zero install</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-[#58CC02] font-bold">✓</span>
                <span>100% Unblocked at school & work</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-[#58CC02] font-bold">✓</span>
                <span>Unlimited Undo and instant restart</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="text-[#58CC02] font-bold">✓</span>
                <span>Works offline once loaded via PWA</span>
              </li>
            </ul>
          </section>

        </div>

      </div>

      <!-- Related Games in this Category -->
      ${relatedGames.length > 0 ? `
        <section class="space-y-4 pt-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">
                More in ${category.label}
              </h2>
              <p class="text-xs text-slate-400 font-bold">Similar logic and puzzle games you might enjoy</p>
            </div>
            <a href="#category/${game.categoryId}" class="text-xs font-black text-[#58CC02] hover:underline">
              View All (${getGamesForCategory(game.categoryId).length}) →
            </a>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            ${relatedGames.map(relGame => createGameCardHTML(relGame)).join('')}
          </div>
        </section>
      ` : ''}

    </div>
  `;
}
