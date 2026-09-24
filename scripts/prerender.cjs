const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const templatePath = fs.existsSync(path.join(distDir, 'index.html'))
  ? path.join(distDir, 'index.html')
  : path.join(rootDir, 'index.html');

console.log('--- STARTING STATIC SITE PRERENDERING (SSG) ---');
console.log('Using template:', templatePath);

if (!fs.existsSync(templatePath)) {
  console.error('Template not found at:', templatePath);
  process.exit(1);
}

const baseTemplate = fs.readFileSync(templatePath, 'utf8');

// 1. Read canonical games
const canonicalCode = fs.readFileSync(path.join(rootDir, 'src/data/canonicalGames.ts'), 'utf8');
const regex = /num:\s*(\d+),\s*title:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*categoryLabel:\s*"([^"]+)",\s*categoryId:\s*"([^"]+)"/g;
let m;
const canonicalGames = [];
while ((m = regex.exec(canonicalCode)) !== null) {
  canonicalGames.push({
    num: parseInt(m[1]),
    title: m[2],
    slug: m[3],
    categoryLabel: m[4],
    categoryId: m[5]
  });
}
console.log(`Loaded ${canonicalGames.length} canonical games.`);

// 2. Read categories
const CATEGORIES_DATA = [
  { id: 'water-sort', label: 'Water Sort', desc: 'Sort colored liquids and balls between test tubes until each container holds only one pure color.' },
  { id: 'mahjong', label: 'Mahjong', desc: 'Relaxing tile matching puzzles. Match unblocked twin tiles with identical traditional symbols.' },
  { id: 'sokoban', label: 'Sokoban', desc: 'Classic warehouse box pushing puzzles. Navigate tight mazes and push crates to storage goals.' },
  { id: 'pipe', label: 'Pipe Logic', desc: 'Plumber pipe connection and fluid flow logic puzzles. Connect pipelines from tap to drain.' },
  { id: 'logicgrid', label: 'Logic Grid', desc: 'Deductive reasoning and Einstein riddle matrix puzzles using logical cross-referencing.' },
  { id: 'numbers', label: 'Numbers & Math', desc: 'Arithmetic sequences, 2048 tile merging, math operations, and Sudoku challenges.' },
  { id: 'kids', label: 'Kids Puzzles', desc: 'Colorful, friendly, and educational logic games designed specifically for children.' },
  { id: 'seniors', label: 'Seniors 60+', desc: 'Relaxing, large-text, untimed brain training puzzles designed for seniors over 60.' },
  { id: 'mazes', label: 'Mazes', desc: 'Labyrinths, parking car escapes, and spatial corridor pathfinding puzzles.' },
  { id: 'problemsolving', label: 'Balance Logic', desc: 'Physics mechanical equilibrium challenges, balancing scales, and structural puzzles.' },
  { id: 'puzzle', label: 'Spatial & Cut', desc: 'Dissection puzzles, tangram silhouettes, and spatial geometry assembly.' },
  { id: 'memory', label: 'Memory', desc: 'Flip cards, match identical pairs, test spatial recall, and strengthen working memory.' },
  { id: 'all-brain', label: 'Brain & IQ', desc: 'Chess checkmate tactics, lights out matrices, matchstick math, and smart brain teasers.' }
];

// Helper to find folder map
function getFolderMap() {
  const map = new Map();
  function scan(dir) {
    for (const item of fs.readdirSync(dir)) {
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) {
        if (fs.existsSync(path.join(full, 'meta.json'))) {
          map.set(item, full);
        }
        if (item === 'kids' || item === 'seniors') scan(full);
      }
    }
  }
  scan(path.join(rootDir, 'src/games'));
  return map;
}
const folderMap = getFolderMap();

// Ensure output directories exist in dist
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}
ensureDir(distDir);
ensureDir(path.join(distDir, 'game'));
ensureDir(path.join(distDir, 'category'));
ensureDir(path.join(distDir, 'sitemap'));

// Helper to escape HTML entities
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 3. Generate pages for each of the 104 games
console.log('Generating pre-rendered HTML for 104 games...');
let gamePagesCount = 0;

canonicalGames.forEach(game => {
  const folder = folderMap.get(game.slug);
  let meta = {};
  if (folder && fs.existsSync(path.join(folder, 'meta.json'))) {
    try {
      meta = JSON.parse(fs.readFileSync(path.join(folder, 'meta.json'), 'utf8'));
    } catch (e) {}
  }

  const title = meta.title || game.title;
  const canonicalUrl = `https://funlogic.games/game/${game.slug}/`;
  const baseDesc = meta.description || meta.shortDesc || game.description || '';
  const fullDesc = baseDesc.length > 120 
    ? baseDesc 
    : `Play ${title} online for free with no download required on mobile, tablet, and desktop browsers. ${title} is an engaging casual logic puzzle that challenges your spatial deduction, pattern recognition, and problem-solving agility. Master progressively difficult stages, explore intuitive one-touch mechanics, and exercise your brain with untimed, stress-free gameplay.`;

  const metaDesc = fullDesc.length > 160 ? fullDesc.substring(0, 157) + '...' : fullDesc;

  // Cover image
  let imageUrl = 'https://funlogic.games/icon.svg';
  if (folder) {
    const files = fs.readdirSync(folder);
    const coverFile = files.find(f => /^cover\.(webp|jpg|png|svg)$/i.test(f));
    if (coverFile) {
      imageUrl = `https://funlogic.games/src/games/${game.slug}/${coverFile}`;
    }
  }

  // FAQs
  const faqs = (meta.faqs && meta.faqs.length >= 3) ? meta.faqs : [
    {
      q: `How do I play ${title} online with no download?`,
      a: `You can play ${title} directly in any modern browser on mobile, tablet, Chromebook, or desktop PC with zero installation. Simply click the green "PLAY" button to start instantly.`
    },
    {
      q: `Is ${title} unblocked and safe for school and work?`,
      a: `Yes, ${title} is 100% web-based, family-friendly, ad-light, and unblocked on school networks, Chromebooks, and office browsers without plugins.`
    },
    {
      q: `What cognitive benefits and skills are developed in ${title}?`,
      a: `${title} stimulates working memory, spatial visualization, forward planning, and logical deduction. It offers untimed modes perfect for kids, adults, and seniors seeking relaxing brain training.`
    }
  ];

  // Keywords: top 8
  const rawKeywords = Array.isArray(meta.keywords) 
    ? meta.keywords 
    : (meta.tags || ['logic game', 'puzzle', 'brain training', 'free online game']);
  const topKeywords = rawKeywords.slice(0, 8).join(', ');

  // Structured Data Schema
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": ["VideoGame", "WebApplication"],
      "name": title,
      "description": fullDesc,
      "url": canonicalUrl,
      "image": imageUrl,
      "genre": ["Puzzle", "Logic", "Brain Training"],
      "applicationCategory": "Game",
      "operatingSystem": "Any",
      "inLanguage": "en",
      "playMode": "SinglePlayer",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://funlogic.games/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": game.categoryLabel,
          "item": `https://funlogic.games/category/${game.categoryId}/`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": title,
          "item": canonicalUrl
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q || f.question || '',
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a || f.answer || ''
        }
      }))
    }
  ];

  // Semantic Pre-rendered HTML inside <div id="app">
  const staticBodyHtml = `
    <div id="app-layout" class="min-h-screen bg-[#0F172A] flex flex-col justify-between selection:bg-[#58CC02] selection:text-white">
      <header class="w-full bg-[#0F172A]/90 border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" class="flex items-center gap-2 text-white font-black text-xl tracking-tight no-underline">
            <span class="w-8 h-8 rounded-xl bg-[#58CC02] flex items-center justify-center text-white text-lg">🧩</span>
            <span>FunLogic<span class="text-[#58CC02]">.games</span></span>
          </a>
          <nav class="flex items-center gap-4 text-xs font-bold text-slate-300">
            <a href="/" class="hover:text-white transition">Home</a>
            <a href="/category/${game.categoryId}/" class="hover:text-white transition">${escapeHtml(game.categoryLabel)}</a>
            <a href="/sitemap/" class="hover:text-white transition">All Games</a>
          </nav>
        </div>
      </header>

      <main class="flex-1 w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
        <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs font-bold text-slate-400">
          <a href="/" class="hover:text-white transition">Home</a>
          <span>/</span>
          <a href="/category/${game.categoryId}/" class="hover:text-white transition">${escapeHtml(game.categoryLabel)}</a>
          <span>/</span>
          <span class="text-slate-200">${escapeHtml(title)}</span>
        </nav>

        <section class="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-2">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#58CC02]/20 text-[#58CC02] border border-[#58CC02]/30">
                ${escapeHtml(game.categoryLabel)}
              </span>
              <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">${escapeHtml(title)}</h1>
              <p class="text-sm text-slate-300 max-w-2xl leading-relaxed">${escapeHtml(fullDesc)}</p>
            </div>
            <div>
              <a href="#play/${game.slug}" class="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] text-white font-black text-xl shadow-[0_6px_0_0_#3B8601] transition-all no-underline tracking-wider">
                ▶ PLAY NOW
              </a>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <h3 class="text-xs font-black text-[#58CC02] uppercase tracking-wider mb-1">🎮 Desktop Controls</h3>
              <p class="text-xs text-slate-300">Click with mouse or use Arrow / WASD keys depending on the puzzle engine.</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60">
              <h3 class="text-xs font-black text-[#1CB0F6] uppercase tracking-wider mb-1">📱 Mobile & Tablet</h3>
              <p class="text-xs text-slate-300">Intuitive responsive touch controls with large tap targets and virtual buttons.</p>
            </div>
          </div>
        </section>

        <!-- FAQs Section -->
        <section class="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
          <h2 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>❓</span>
            <span>Frequently Asked Questions</span>
          </h2>
          <div class="space-y-3">
            ${faqs.map((f, i) => `
              <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                <h3 class="text-sm font-black text-white flex items-center gap-2">
                  <span class="text-[#58CC02]">Q${i+1}:</span>
                  <span>${escapeHtml(f.q || f.question)}</span>
                </h3>
                <p class="text-xs text-slate-300 leading-relaxed pl-6">${escapeHtml(f.a || f.answer)}</p>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- Tags and Keywords -->
        <section class="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-3">
          <h2 class="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span>🏷️</span>
            <span>Game Keywords & Tags</span>
          </h2>
          <div class="flex flex-wrap gap-2">
            ${rawKeywords.map(k => `
              <span class="px-3 py-1 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                #${escapeHtml(k)}
              </span>
            `).join('')}
          </div>
        </section>
      </main>

      <footer class="w-full bg-[#0F172A] border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <div class="max-w-7xl mx-auto px-4">
          <p>© 2026 FunLogic.games by Lumia Studio. All rights reserved. Free casual logic puzzles with zero installation.</p>
        </div>
      </footer>
    </div>
  `;

  // Inject into base template
  let pageHtml = baseTemplate;

  // Replace title
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)} - Play Free Online (No Download) | FunLogic.games</title>`);

  // Replace / inject meta tags in <head>
  const metaTags = `
    <meta name="description" content="${escapeHtml(metaDesc)}" />
    <meta name="keywords" content="${escapeHtml(topKeywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(title)} — FunLogic.games" />
    <meta property="og:description" content="${escapeHtml(metaDesc)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="game" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:site_name" content="FunLogic.games" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)} — FunLogic.games" />
    <meta name="twitter:description" content="${escapeHtml(metaDesc)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
  `;

  // Remove existing title/meta description/canonical if any and place new ones
  pageHtml = pageHtml.replace('</head>', `${metaTags}\n  </head>`);

  // Replace <div id="app"></div> with pre-rendered body
  pageHtml = pageHtml.replace('<div id="app"></div>', `<div id="app">${staticBodyHtml}</div>`);

  // Save to dist/game/<slug>/index.html
  const gameDestDir = path.join(distDir, 'game', game.slug);
  ensureDir(gameDestDir);
  fs.writeFileSync(path.join(gameDestDir, 'index.html'), pageHtml, 'utf8');
  gamePagesCount++;
});
console.log(`Generated ${gamePagesCount} static game HTML landing pages!`);

// 4. Generate pages for each of the 13 categories
console.log('Generating pre-rendered HTML for 13 categories...');
CATEGORIES_DATA.forEach(cat => {
  const canonicalUrl = `https://funlogic.games/category/${cat.id}/`;
  const catTitle = `${cat.label} Logic Games — Free Online Puzzles | FunLogic.games`;
  const catDesc = `${cat.desc} Play the best free ${cat.label} logic games online with no download directly in your web browser.`;

  const catGames = canonicalGames.filter(g => g.categoryId === cat.id);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${cat.label} Games`,
      "description": catDesc,
      "url": canonicalUrl
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://funlogic.games/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": cat.label,
          "item": canonicalUrl
        }
      ]
    }
  ];

  const staticBodyHtml = `
    <div id="app-layout" class="min-h-screen bg-[#0F172A] flex flex-col justify-between">
      <header class="w-full bg-[#0F172A]/90 border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" class="flex items-center gap-2 text-white font-black text-xl tracking-tight no-underline">
            <span class="w-8 h-8 rounded-xl bg-[#58CC02] flex items-center justify-center text-white text-lg">🧩</span>
            <span>FunLogic<span class="text-[#58CC02]">.games</span></span>
          </a>
          <nav class="flex items-center gap-4 text-xs font-bold text-slate-300">
            <a href="/" class="hover:text-white transition">Home</a>
            <a href="/sitemap/" class="hover:text-white transition">All Games</a>
          </nav>
        </div>
      </header>

      <main class="flex-1 w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
        <section class="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-2">
          <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">${escapeHtml(cat.label)} Games</h1>
          <p class="text-sm text-slate-300 max-w-3xl leading-relaxed">${escapeHtml(catDesc)}</p>
        </section>

        <section class="space-y-4">
          <h2 class="text-lg font-black text-white">Games in this Category (${catGames.length})</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            ${catGames.map(g => `
              <a href="/game/${g.slug}/" class="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-[#58CC02] transition block no-underline group">
                <h3 class="text-sm font-black text-white group-hover:text-[#58CC02] transition mb-1">${escapeHtml(g.title)}</h3>
                <p class="text-xs text-slate-400 line-clamp-2">${escapeHtml(g.description)}</p>
              </a>
            `).join('')}
          </div>
        </section>
      </main>

      <footer class="w-full bg-[#0F172A] border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <p>© 2026 FunLogic.games. Free casual logic puzzles with zero installation.</p>
      </footer>
    </div>
  `;

  let pageHtml = baseTemplate;
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(catTitle)}</title>`);

  const metaTags = `
    <meta name="description" content="${escapeHtml(catDesc)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(catTitle)}" />
    <meta property="og:description" content="${escapeHtml(catDesc)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="FunLogic.games" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(catTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(catDesc)}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
  `;

  pageHtml = pageHtml.replace('</head>', `${metaTags}\n  </head>`);
  pageHtml = pageHtml.replace('<div id="app"></div>', `<div id="app">${staticBodyHtml}</div>`);

  const catDestDir = path.join(distDir, 'category', cat.id);
  ensureDir(catDestDir);
  fs.writeFileSync(path.join(catDestDir, 'index.html'), pageHtml, 'utf8');
});
console.log('Generated 13 static category HTML landing pages!');

// 5. Generate Human Sitemap Page (/sitemap/)
console.log('Generating pre-rendered Human Sitemap page...');
const sitemapUrl = 'https://funlogic.games/sitemap/';
const sitemapTitle = 'Human Sitemap & Directory — All 104 Logic Games | FunLogic.games';
const sitemapDesc = 'Browse the complete directory of 104 casual logic, reasoning, puzzle, and brain training games on FunLogic.games.';

const sitemapBodyHtml = `
  <div id="app-layout" class="min-h-screen bg-[#0F172A] flex flex-col justify-between">
    <header class="w-full bg-[#0F172A]/90 border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" class="flex items-center gap-2 text-white font-black text-xl tracking-tight no-underline">
          <span class="w-8 h-8 rounded-xl bg-[#58CC02] flex items-center justify-center text-white text-lg">🧩</span>
          <span>FunLogic<span class="text-[#58CC02]">.games</span></span>
        </a>
      </div>
    </header>

    <main class="flex-1 w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      <section class="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-2">
        <h1 class="text-3xl sm:text-4xl font-black text-white tracking-tight">Complete Game Directory</h1>
        <p class="text-sm text-slate-300">All 104 free casual logic puzzles and 13 category hubs.</p>
      </section>

      <section class="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4">
        <h2 class="text-lg font-black text-white">Categories (13 Hubs)</h2>
        <div class="flex flex-wrap gap-2">
          ${CATEGORIES_DATA.map(c => `
            <a href="/category/${c.id}/" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-[#58CC02] hover:text-white text-xs font-bold text-slate-200 transition no-underline">
              ${escapeHtml(c.label)}
            </a>
          `).join('')}
        </div>
      </section>

      <section class="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4">
        <h2 class="text-lg font-black text-white">All 104 Official Games</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          ${canonicalGames.map(g => `
            <a href="/game/${g.slug}/" class="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition flex items-center justify-between no-underline text-xs font-bold">
              <span>#${g.num} ${escapeHtml(g.title)}</span>
              <span class="text-[#58CC02]">→</span>
            </a>
          `).join('')}
        </div>
      </section>
    </main>

    <footer class="w-full bg-[#0F172A] border-t border-slate-800 py-6 text-center text-xs text-slate-400">
      <p>© 2026 FunLogic.games. All 104 logic puzzles cataloged.</p>
    </footer>
  </div>
`;

let sitemapHtml = baseTemplate;
sitemapHtml = sitemapHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(sitemapTitle)}</title>`);
const sitemapMeta = `
  <meta name="description" content="${escapeHtml(sitemapDesc)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${sitemapUrl}" />
`;
sitemapHtml = sitemapHtml.replace('</head>', `${sitemapMeta}\n  </head>`);
sitemapHtml = sitemapHtml.replace('<div id="app"></div>', `<div id="app">${sitemapBodyHtml}</div>`);
fs.writeFileSync(path.join(distDir, 'sitemap', 'index.html'), sitemapHtml, 'utf8');

// 6. Generate Legal & Compliance Pages (Privacy Policy, Terms of Service, About, Contact)
console.log('Generating pre-rendered Legal & Compliance pages...');
const legalPages = [
  {
    slug: 'privacy',
    title: 'Privacy Policy & Cookie Disclosure — FunLogic.games',
    desc: 'Privacy Policy and Cookie Disclosure for FunLogic.games by Lumia Studio. Learn how your data is protected and our compliance with Google AdSense, GDPR, and LGPD.',
    h1: 'Privacy Policy',
    badge: 'Legal Compliance',
    content: `
      <section class="space-y-3">
        <h2 class="text-base font-black text-white">1. Introduction & Overview</h2>
        <p class="text-sm text-slate-300">Welcome to FunLogic.games by Lumia Studio. We respect your privacy and are committed to protecting any data collected during gameplay. This policy outlines our compliance with Google AdSense publisher policies, GDPR (EU), LGPD (Brazil), and COPPA.</p>
      </section>
      <section class="space-y-3">
        <h2 class="text-base font-black text-white">2. Information Collection & Storage</h2>
        <p class="text-sm text-slate-300">FunLogic.games is 100% free to play without mandatory registration. Progress, streak records, and level unlocks are stored locally in your browser via HTML5 LocalStorage and never transmitted to our private servers.</p>
      </section>
      <section class="space-y-3">
        <h2 class="text-base font-black text-white">3. Third-Party Advertising & Google AdSense</h2>
        <p class="text-sm text-slate-300">We partner with Google AdSense to serve ads. Google uses cookies (including DART cookies) to serve ads to visitors based on their visit to this and other websites. Users may opt out of personalized advertising by visiting Google Ads Settings (<a href="https://www.google.com/settings/ads" class="text-[#1CB0F6] underline" target="_blank" rel="noopener">google.com/settings/ads</a>) or aboutads.info.</p>
      </section>
      <section class="space-y-3">
        <h2 class="text-base font-black text-white">4. Children's Privacy (COPPA)</h2>
        <p class="text-sm text-slate-300">Our Kids Puzzles section provides safe, non-violent, educational content. We do not knowingly collect personal information from children under 13.</p>
      </section>
      <section class="space-y-3">
        <h2 class="text-base font-black text-white">5. Contact Information</h2>
        <p class="text-sm text-slate-300">For privacy inquiries or data rights requests, email Lumia Studio at <a href="mailto:contact@funlogic.games" class="text-[#58CC02] font-bold underline">contact@funlogic.games</a>.</p>
      </section>
    `
  },
  {
    slug: 'terms',
    title: 'Terms of Service — FunLogic.games',
    desc: 'Terms of Service and End-User Usage Agreement for FunLogic.games casual logic and puzzle web games.',
    h1: 'Terms of Service',
    badge: 'Terms & Conditions',
    content: `
      <section class="space-y-3">
        <h2 class="text-base font-black text-white">1. Acceptance of Terms</h2>
        <p class="text-sm text-slate-300">By accessing and playing games on FunLogic.games, you agree to abide by these Terms of Service. If you disagree with any terms, please discontinue use of the site.</p>
      </section>
      <section class="space-y-3">
        <h2 class="text-base font-black text-white">2. License to Play</h2>
        <p class="text-sm text-slate-300">Lumia Studio grants you a personal, non-exclusive, revocable license to play web games for non-commercial personal entertainment directly inside your web browser.</p>
      </section>
      <section class="space-y-3">
        <h2 class="text-base font-black text-white">3. Intellectual Property</h2>
        <p class="text-sm text-slate-300">All game concepts, graphics, code, and brand marks belong to Lumia Studio or licensed game partners. Redistribution or unauthorized framing is prohibited.</p>
      </section>
    `
  },
  {
    slug: 'about',
    title: 'About Lumia Studio & FunLogic.games',
    desc: 'About FunLogic.games and Lumia Studio: independent creator of accessible, fast, and cognitive-friendly web puzzles for all generations.',
    h1: 'About Lumia Studio & FunLogic.games',
    badge: 'Our Mission',
    content: `
      <section class="space-y-3">
        <h2 class="text-base font-black text-white">Accessible Brain Training for Everyone</h2>
        <p class="text-sm text-slate-300">FunLogic.games by Lumia Studio is dedicated to creating accessible, high-performance logic, math, memory, and puzzle games that run smoothly on every device with zero downloads.</p>
      </section>
      <section class="space-y-3">
        <h2 class="text-base font-black text-white">Designed for All Generations</h2>
        <p class="text-sm text-slate-300">From preschool learning puzzles to untimed, large-contrast memory puzzles tailored for seniors (60+), our mission is fostering mental sharpness and casual relaxation without invasive paywalls.</p>
      </section>
    `
  },
  {
    slug: 'contact',
    title: 'Contact Lumia Studio — FunLogic.games',
    desc: 'Contact Lumia Studio and the FunLogic.games team for support, game suggestions, developer partnerships, and bug reports.',
    h1: 'Contact Us',
    badge: 'Support & Inquiries',
    content: `
      <section class="space-y-3">
        <h2 class="text-base font-black text-white">Get in Touch with Lumia Studio</h2>
        <p class="text-sm text-slate-300">Have feedback, a game idea, or found a bug? We welcome your questions and suggestions.</p>
        <div class="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
          <p class="text-xs font-black uppercase text-[#58CC02]">General Inquiries & Support:</p>
          <a href="mailto:contact@funlogic.games" class="text-base font-black text-white hover:text-[#58CC02] transition block">contact@funlogic.games</a>
          <p class="text-xs font-black uppercase text-[#1CB0F6] pt-2">Developer Submissions & Publishing:</p>
          <a href="mailto:partners@funlogic.games" class="text-base font-black text-white hover:text-[#1CB0F6] transition block">partners@funlogic.games</a>
        </div>
      </section>
    `
  }
];

legalPages.forEach(p => {
  const canonicalUrl = `https://funlogic.games/${p.slug}/`;
  const staticBodyHtml = `
    <div id="app-layout" class="min-h-screen bg-[#0F172A] flex flex-col justify-between">
      <header class="w-full bg-[#0F172A]/90 border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" class="flex items-center gap-2 text-white font-black text-xl tracking-tight no-underline">
            <span class="w-8 h-8 rounded-xl bg-[#58CC02] flex items-center justify-center text-white text-lg">🧩</span>
            <span>FunLogic<span class="text-[#58CC02]">.games</span></span>
          </a>
          <nav class="flex items-center gap-4 text-xs font-bold text-slate-300">
            <a href="/" class="hover:text-white transition">Home</a>
            <a href="/sitemap/" class="hover:text-white transition">All Games</a>
          </nav>
        </div>
      </header>

      <main class="flex-1 w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
        <article class="bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl text-slate-200 space-y-6">
          <header class="border-b border-slate-800 pb-4">
            <span class="text-xs font-black uppercase tracking-wider text-[#58CC02] bg-[#58CC02]/10 border border-[#58CC02]/20 px-3 py-1 rounded-full inline-block mb-2">${p.badge}</span>
            <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight">${escapeHtml(p.h1)}</h1>
          </header>
          ${p.content}
        </article>
      </main>

      <footer class="w-full bg-[#0F172A] border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <p>© 2026 FunLogic.games by Lumia Studio. All rights reserved.</p>
      </footer>
    </div>
  `;

  let pageHtml = baseTemplate;
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(p.title)}</title>`);
  const meta = `
    <meta name="description" content="${escapeHtml(p.desc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
  `;
  pageHtml = pageHtml.replace('</head>', `${meta}\n  </head>`);
  pageHtml = pageHtml.replace('<div id="app"></div>', `<div id="app">${staticBodyHtml}</div>`);

  const destDir = path.join(distDir, p.slug);
  ensureDir(destDir);
  fs.writeFileSync(path.join(destDir, 'index.html'), pageHtml, 'utf8');
});
console.log(`Generated ${legalPages.length} legal & compliance static pages!`);

// 7. Generate 404.html (for SPA fallback on GitHub Pages)
console.log('Generating 404.html for GitHub Pages...');
fs.writeFileSync(path.join(distDir, '404.html'), baseTemplate, 'utf8');

// 8. Copy sitemap.xml and robots.txt to dist/
console.log('Copying sitemap.xml and robots.txt to dist/...');
if (fs.existsSync(path.join(rootDir, 'public/sitemap.xml'))) {
  fs.copyFileSync(path.join(rootDir, 'public/sitemap.xml'), path.join(distDir, 'sitemap.xml'));
}
if (fs.existsSync(path.join(rootDir, 'public/robots.txt'))) {
  fs.copyFileSync(path.join(rootDir, 'public/robots.txt'), path.join(distDir, 'robots.txt'));
}

// 9. Copy all 104 game folders to dist/games/
console.log('Copying all 104 game folders to dist/games/...');
const distGamesDir = path.join(distDir, 'games');
ensureDir(distGamesDir);

function copyDirRecursive(src, dest) {
  ensureDir(dest);
  for (const item of fs.readdirSync(src)) {
    if (item === 'kids' || item === 'seniors' || item === 'node_modules' || item === '.git') continue;
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

let gamesCopied = 0;
for (const game of canonicalGames) {
  const slug = game.slug;
  const candidates = [
    path.join(rootDir, 'src/games', slug),
    path.join(rootDir, 'src/games/seniors', slug),
    path.join(rootDir, 'src/games/kids', slug)
  ];

  let srcDir = null;
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, 'index.html'))) {
      srcDir = c;
      break;
    }
  }
  if (!srcDir) {
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        srcDir = c;
        break;
      }
    }
  }

  if (srcDir) {
    copyDirRecursive(srcDir, path.join(distGamesDir, slug));
    gamesCopied++;
  }
}
console.log(`Copied ${gamesCopied} full game bundles to dist/games/!`);

console.log('--- PRE-RENDERING COMPLETED SUCCESSFULLY! ---');
console.log(`Total Pages Pre-rendered: ${gamePagesCount + CATEGORIES_DATA.length + legalPages.length + 2}`);
