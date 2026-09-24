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
  categoryName?: string;
  categoryUrl?: string;
  faqs?: Array<{ q?: string; question?: string; a?: string; answer?: string }>;
  ratingValue?: number;
  ratingCount?: number;
}

export function updateHeadSeo(options: SeoOptions): void {
  const {
    title,
    description,
    keywords,
    canonicalUrl,
    imageUrl = 'https://funlogic.games/icon.svg',
    type = 'website',
    categoryName,
    categoryUrl,
    faqs,
    ratingValue = 4.8,
    ratingCount = 1250
  } = options;

  // 1. Calculate strictly clean Canonical URL without any hashtag fragments
  let cleanCanonical = canonicalUrl;
  if (!cleanCanonical) {
    const raw = window.location.href.split('#')[0];
    cleanCanonical = raw.endsWith('/') ? raw : `${raw}/`;
  } else {
    cleanCanonical = cleanCanonical.split('#')[0];
    if (!cleanCanonical.endsWith('/')) cleanCanonical += '/';
  }

  // 2. Update Document Title
  document.title = title.includes('FunLogic') ? title : `${title} — FunLogic.games`;

  // 3. Helper to set or update <meta> tag
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

  // 4. Helper to set or update <link rel="...">
  const setLink = (rel: string, href: string) => {
    let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement('link');
      el.rel = rel;
      document.head.appendChild(el);
    }
    el.href = href;
  };

  // 5. Format keywords: limit to top 8 to avoid keyword stuffing
  let keywordsList: string[] = [];
  if (Array.isArray(keywords)) {
    keywordsList = keywords.slice(0, 8);
  } else if (typeof keywords === 'string') {
    keywordsList = keywords.split(',').map(s => s.trim()).filter(Boolean).slice(0, 8);
  } else {
    keywordsList = ['logic puzzle', 'brain game', 'online puzzle', 'free web game', 'casual game'];
  }
  const keywordsStr = keywordsList.join(', ');

  // Standard Meta Tags
  setMeta('description', description);
  setMeta('keywords', keywordsStr);
  setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  setLink('canonical', cleanCanonical);

  // Open Graph
  setMeta('og:title', `${title} — FunLogic.games`, true);
  setMeta('og:description', description, true);
  setMeta('og:url', cleanCanonical, true);
  setMeta('og:type', type === 'game' ? 'game' : 'website', true);
  setMeta('og:image', imageUrl, true);
  setMeta('og:site_name', 'FunLogic.games', true);

  // Twitter Cards
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', `${title} — FunLogic.games`);
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
      'url': cleanCanonical,
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

    // Schema: BreadcrumbList for Game
    const breadcrumbList: any = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': 'https://funlogic.games/'
        }
      ]
    };

    if (categoryName && categoryUrl) {
      breadcrumbList.itemListElement.push({
        '@type': 'ListItem',
        'position': 2,
        'name': categoryName,
        'item': categoryUrl.endsWith('/') ? categoryUrl : `${categoryUrl}/`
      });
      breadcrumbList.itemListElement.push({
        '@type': 'ListItem',
        'position': 3,
        'name': title,
        'item': cleanCanonical
      });
    } else {
      breadcrumbList.itemListElement.push({
        '@type': 'ListItem',
        'position': 2,
        'name': title,
        'item': cleanCanonical
      });
    }
    structuredSchemas.push(breadcrumbList);

  } else {
    structuredSchemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'FunLogic.games',
      'url': cleanCanonical,
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

  jsonLdEl.textContent = JSON.stringify(structuredSchemas, null, 2);
}
