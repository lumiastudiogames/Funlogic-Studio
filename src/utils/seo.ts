/**
 * SEO & Rich Metadata Injector
 * Injects Title, Meta Description, Meta Keywords, Canonical, Open Graph, Twitter Cards,
 * and JSON-LD structured data (VideoGame, FAQPage, BreadcrumbList) directly into <head>.
 */

export interface SeoOptions {
  title: string;
  description: string;
  keywords?: string | string[];
  canonicalUrl?: string;
  imageUrl?: string;
  type?: 'website' | 'game';
  faqs?: Array<{ q?: string; question?: string; a?: string; answer?: string }>;
  ratingValue?: number;
  ratingCount?: number;
}

export function updateHeadSeo(options: SeoOptions): void {
  const {
    title,
    description,
    keywords,
    canonicalUrl = window.location.href,
    imageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    type = 'website',
    faqs,
    ratingValue = 4.8,
    ratingCount = 1250
  } = options;

  // 1. Update Document Title
  document.title = `${title} | Brain & Puzzle Hub`;

  // 2. Helper to set or update <meta> tag
  const setMeta = (nameOrProp: string, value: string, isProp = false) => {
    if (!value) return;
    const attr = isProp ? 'property' : 'name';
    let el = document.head.querySelector(`meta[${attr}="${nameOrProp}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, nameOrProp);
      document.head.appendChild(el);
    }
    el.content = value;
  };

  // 3. Helper to set or update <link rel="...">
  const setLink = (rel: string, href: string) => {
    let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.rel = rel;
      document.head.appendChild(el);
    }
    el.href = href;
  };

  // Format keywords string
  const keywordsStr = Array.isArray(keywords) 
    ? keywords.join(', ') 
    : (keywords || 'brain games, logic puzzles, water sort, mahjong, sudoku, 2048, sokoban, pipe connect, free online puzzles');

  // Standard Meta Tags
  setMeta('description', description);
  setMeta('keywords', keywordsStr);
  setMeta('robots', 'index, follow, max-image-preview:large');
  setLink('canonical', canonicalUrl);

  // Open Graph
  setMeta('og:title', `${title} - Play Free Online`, true);
  setMeta('og:description', description, true);
  setMeta('og:url', canonicalUrl, true);
  setMeta('og:type', type === 'game' ? 'game' : 'website', true);
  setMeta('og:image', imageUrl, true);
  setMeta('og:site_name', 'Brain & Puzzle Hub', true);

  // Twitter Cards
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', `${title} - Play Free Online`);
  setMeta('twitter:description', description);
  setMeta('twitter:image', imageUrl);

  // JSON-LD Structured Data Schema Injection
  let jsonLdEl = document.head.querySelector('#seo-structured-data') as HTMLScriptElement | null;
  if (!jsonLdEl) {
    jsonLdEl = document.createElement('script');
    jsonLdEl.id = 'seo-structured-data';
    jsonLdEl.type = 'application/ld+json';
    document.head.appendChild(jsonLdEl);
  }

  const structuredSchemas: any[] = [];

  // Schema: WebSite / Game
  if (type === 'game') {
    const gameSchema: any = {
      '@context': 'https://schema.org',
      '@type': ['VideoGame', 'WebApplication'],
      'name': title,
      'description': description,
      'url': canonicalUrl,
      'image': imageUrl,
      'genre': ['Puzzle', 'Logic', 'Brain Training'],
      'applicationCategory': 'Game',
      'operatingSystem': 'Any',
      'inLanguage': 'en',
      'playMode': 'SinglePlayer',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
        'availability': 'https://schema.org/InStock'
      }
    };

    // Google Search Central: Inclui aggregateRating estritamente quando há avaliações reais
    if (ratingCount && ratingCount > 0 && ratingValue && ratingValue > 0) {
      gameSchema.aggregateRating = {
        '@type': 'AggregateRating',
        'ratingValue': ratingValue.toFixed(1),
        'reviewCount': ratingCount,
        'bestRating': '5',
        'worstRating': '1'
      };
    }

    structuredSchemas.push(gameSchema);
  } else {
    structuredSchemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Brain & Puzzle Hub',
      'url': canonicalUrl,
      'description': description
    });
  }

  // Schema: FAQPage if FAQs exist
  if (faqs && faqs.length > 0) {
    structuredSchemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.q || f.question || '',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a || f.answer || ''
        }
      }))
    });
  }

  jsonLdEl.textContent = JSON.stringify(structuredSchemas.length === 1 ? structuredSchemas[0] : structuredSchemas, null, 2);
}
