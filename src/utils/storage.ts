import { DailyChallengeState, FilterState } from '../types';

const FONT_KEY = 'loomlogic_font_scale';
const DAILY_KEY = 'loomlogic_daily_state';
const FILTER_KEY = 'loomlogic_filter_pref';

/**
 * Get current UTC date string formatted as YYYY-MM-DD
 */
export function getTodayUtcDateString(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get yesterday's UTC date string formatted as YYYY-MM-DD
 */
export function getYesterdayUtcDateString(): string {
  const now = new Date();
  now.setUTCDate(now.getUTCDate() - 1);
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get formatted countdown string (HH:MM:SS) until next 00:00 UTC
 */
export function getSecondsUntilNextUtcMidnight(): number {
  const now = new Date();
  const nextUtc = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  ));
  return Math.max(0, Math.floor((nextUtc.getTime() - now.getTime()) / 1000));
}

export function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

// Global Font Scaling (A- / A+)
export function getStoredFontScale(): number {
  try {
    const val = localStorage.getItem(FONT_KEY);
    return val ? parseFloat(val) : 1.0;
  } catch {
    return 1.0;
  }
}

export function setStoredFontScale(scale: number): void {
  try {
    const clamped = Math.max(0.85, Math.min(1.25, scale));
    localStorage.setItem(FONT_KEY, clamped.toString());
    document.documentElement.style.setProperty('--font-scale', clamped.toString());
  } catch {
    // localstorage disabled
  }
}

// Daily Challenge State & Streak Management
export function getDailyState(): DailyChallengeState {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    if (!raw) {
      return { completed: false, lastCompletedUtcDate: '', streak: 0 };
    }
    const parsed: DailyChallengeState = JSON.parse(raw);
    const today = getTodayUtcDateString();
    const isCompletedToday = parsed.lastCompletedUtcDate === today;
    return {
      ...parsed,
      completed: isCompletedToday
    };
  } catch {
    return { completed: false, lastCompletedUtcDate: '', streak: 0 };
  }
}

export function recordDailyCompletion(solvedSeconds: number): DailyChallengeState {
  const today = getTodayUtcDateString();
  const yesterday = getYesterdayUtcDateString();
  const current = getDailyState();

  if (current.lastCompletedUtcDate === today) {
    // Already completed today
    return current;
  }

  let newStreak = 1;
  if (current.lastCompletedUtcDate === yesterday) {
    newStreak = current.streak + 1;
  }

  const newState: DailyChallengeState = {
    completed: true,
    lastCompletedUtcDate: today,
    streak: newStreak,
    solvedTimeSeconds: solvedSeconds
  };

  try {
    localStorage.setItem(DAILY_KEY, JSON.stringify(newState));
  } catch {
    // ignore
  }

  return newState;
}

// Category Filter Preferences
export function getFilterPreferences(): FilterState {
  try {
    const raw = localStorage.getItem(FILTER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        showCount: parsed.showCount ?? 10,
        sortBy: parsed.sortBy ?? 'az',
        viewMode: parsed.viewMode ?? 'carousel'
      };
    }
  } catch {
    // ignore
  }
  return { showCount: 10, sortBy: 'az', viewMode: 'carousel' };
}

export function setFilterPreferences(pref: Partial<FilterState>): FilterState {
  const current = getFilterPreferences();
  const updated = { ...current, ...pref };
  try {
    localStorage.setItem(FILTER_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}
