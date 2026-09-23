import { CATEGORIES, GAMES } from '../data/games';

export function generateSitemapXml(): string {
  const baseUrl = window.location.origin;

  const categoryUrls = CATEGORIES.map(c => `
    <url>
      <loc>${baseUrl}/#category/${c.id}</loc>
      <changefreq>daily</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  const gameUrls = GAMES.map(g => `
    <url>
      <loc>${baseUrl}/#game/${g.id}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
    </url>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/#daily</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#sitemap</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  ${categoryUrls}
  ${gameUrls}
</urlset>`;
}
