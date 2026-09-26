import { Game } from '../types';

/**
 * Returns an instant, zero-network, Base64-encoded SVG data URI placeholder.
 * Base64 encoding guarantees no quotes, angle brackets, or spaces that could corrupt HTML attributes.
 */
export function getGameCoverPlaceholder(game: { id?: string; title?: string; coverBg?: string }): string {
  const bg = game.coverBg || '#E0F2FE';
  const rawTitle = (game.title || 'Game').slice(0, 30);
  // XML-escape title
  const safeTitle = rawTitle
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="45%" font-family="sans-serif" font-size="36" text-anchor="middle">🎮</text><text x="50%" y="65%" font-family="sans-serif" font-size="14" font-weight="bold" fill="#334155" text-anchor="middle">${safeTitle}</text></svg>`;

  try {
    if (typeof btoa !== 'undefined') {
      return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    }
    return 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
  } catch {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTBGMkZFIi8+PC9zdmc+';
  }
}

/**
 * Returns the effective cover image URL for a game, falling back to a lightweight SVG placeholder.
 */
export function getGameCoverUrl(game: Game | { id?: string; title?: string; coverImage?: string; coverBg?: string }): string {
  if (game.coverImage && typeof game.coverImage === 'string' && game.coverImage.trim() !== '') {
    return game.coverImage;
  }
  return getGameCoverPlaceholder(game);
}
