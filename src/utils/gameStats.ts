import { Game } from '../types';

export interface GameLiveStats {
  ratingValue: number;
  ratingCount: number;
  formattedRatingCount: string;
  playsCount: number;
  formattedPlaysCount: string;
  userRating?: number;
  isNew: boolean;
}

const STATS_STORAGE_KEY_PREFIX = 'funlogic_game_stats_';

/**
 * Formata números de visualizações/plays em formato amigável (ex: 12, 140, 1.2k).
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
}

/**
 * Obtém as estatísticas 100% REAIS e ORGÂNICAS do jogo (100% compatível com Google Search Central).
 * Sem dados inventados ou sementes falsas.
 */
export function getGameLiveStats(game: Game): GameLiveStats {
  let realPlays = 0;
  let ratingsSum = 0;
  let ratingsCount = 0;
  let userRating: number | undefined = undefined;

  // Se o desenvolvedor definiu no meta.json (opcional)
  if (typeof game.ratingValue === 'number' && game.ratingValue > 0) {
    const declaredCount = typeof game.ratingCount === 'number' ? game.ratingCount : 1;
    ratingsSum += game.ratingValue * declaredCount;
    ratingsCount += declaredCount;
  }

  if (game.playsCount) {
    const raw = game.playsCount.toString().toLowerCase();
    if (raw.endsWith('k')) {
      realPlays += Math.round(parseFloat(raw) * 1000) || 0;
    } else if (raw.endsWith('m')) {
      realPlays += Math.round(parseFloat(raw) * 1000000) || 0;
    } else {
      realPlays += parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0;
    }
  }

  // Recupera contagens e avaliações 100% reais dos usuários no navegador/dispositivo
  try {
    const stored = localStorage.getItem(`${STATS_STORAGE_KEY_PREFIX}${game.id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed.plays === 'number') realPlays += parsed.plays;
      if (typeof parsed.ratingsSum === 'number') ratingsSum += parsed.ratingsSum;
      if (typeof parsed.ratingsCount === 'number') ratingsCount += parsed.ratingsCount;
      if (typeof parsed.userRating === 'number') userRating = parsed.userRating;
    }

    // Suporte a chaves diretas
    const directPlays = localStorage.getItem(`${game.id}_plays`);
    if (directPlays) {
      const parsedDirectPlays = parseInt(directPlays, 10);
      if (!isNaN(parsedDirectPlays)) realPlays += parsedDirectPlays;
    }

    const directRating = localStorage.getItem(`${game.id}_ratingValue`);
    if (directRating) {
      const parsedDirectRating = parseFloat(directRating);
      if (!isNaN(parsedDirectRating)) {
        userRating = parsedDirectRating;
        if (ratingsCount === 0) {
          ratingsSum += parsedDirectRating;
          ratingsCount += 1;
        }
      }
    }
  } catch (e) {
    // LocalStorage indisponível
  }

  const isNew = ratingsCount === 0;
  const finalRating = ratingsCount > 0 ? Math.min(5.0, Math.max(1.0, Math.round((ratingsSum / ratingsCount) * 10) / 10)) : 0;

  return {
    ratingValue: finalRating,
    ratingCount: ratingsCount,
    formattedRatingCount: formatCompactNumber(ratingsCount),
    playsCount: realPlays,
    formattedPlaysCount: formatCompactNumber(realPlays),
    userRating,
    isNew
  };
}

/**
 * Incrementa 1 jogada real para o jogo no localStorage.
 */
export function recordGamePlay(gameId: string): void {
  try {
    const key = `${STATS_STORAGE_KEY_PREFIX}${gameId}`;
    const stored = localStorage.getItem(key);
    const data = stored ? JSON.parse(stored) : { plays: 0, ratingsSum: 0, ratingsCount: 0 };
    data.plays = (data.plays || 0) + 1;
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(`${gameId}_plays`, data.plays.toString());
  } catch (e) {
    // Fail silently
  }
}

/**
 * Registra uma avaliação real (1 a 5 estrelas) dada pelo jogador humano.
 */
export function recordGameRating(gameId: string, stars: number): void {
  try {
    const clampedStars = Math.min(5, Math.max(1, Math.round(stars)));
    const key = `${STATS_STORAGE_KEY_PREFIX}${gameId}`;
    const stored = localStorage.getItem(key);
    const data = stored ? JSON.parse(stored) : { plays: 0, ratingsSum: 0, ratingsCount: 0 };
    
    // Se o usuário já votou antes, subtrai o anterior e adiciona o novo
    if (typeof data.userRating === 'number') {
      data.ratingsSum = (data.ratingsSum || 0) - data.userRating + clampedStars;
    } else {
      data.ratingsSum = (data.ratingsSum || 0) + clampedStars;
      data.ratingsCount = (data.ratingsCount || 0) + 1;
    }
    
    data.userRating = clampedStars;
    localStorage.setItem(key, JSON.stringify(data));
    
    const newAverage = data.ratingsCount > 0 ? (data.ratingsSum / data.ratingsCount).toFixed(1) : '5.0';
    localStorage.setItem(`${gameId}_ratingValue`, newAverage);
  } catch (e) {
    // Fail silently
  }
}
