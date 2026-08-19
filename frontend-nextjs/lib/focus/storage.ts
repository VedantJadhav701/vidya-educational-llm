import { UserFocusStats, SessionResultData } from './types';

const STORAGE_KEY_STATS = 'vidya_focus_stats';
const STORAGE_KEY_SESSIONS = 'vidya_focus_sessions';

export function getStoredFocusStats(): UserFocusStats {
  if (typeof window === 'undefined') {
    return { todayFocusScore: 0, bestScore: 0, sessionsCompleted: 0, lastSessionDate: '' };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATS);
    if (!raw) return { todayFocusScore: 0, bestScore: 0, sessionsCompleted: 0, lastSessionDate: '' };
    const parsed = JSON.parse(raw);
    
    // Reset today score if date changed
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastSessionDate !== today) {
      return {
        todayFocusScore: 0,
        bestScore: parsed.bestScore || 0,
        sessionsCompleted: parsed.sessionsCompleted || 0,
        lastSessionDate: today,
      };
    }
    return parsed;
  } catch {
    return { todayFocusScore: 0, bestScore: 0, sessionsCompleted: 0, lastSessionDate: '' };
  }
}

export function saveSessionResult(result: SessionResultData): UserFocusStats {
  if (typeof window === 'undefined') {
    return { todayFocusScore: 0, bestScore: 0, sessionsCompleted: 0, lastSessionDate: '' };
  }

  const currentStats = getStoredFocusStats();
  const today = new Date().toISOString().split('T')[0];

  const updatedStats: UserFocusStats = {
    todayFocusScore: (currentStats.lastSessionDate === today ? currentStats.todayFocusScore : 0) + result.score,
    bestScore: Math.max(currentStats.bestScore, result.score),
    sessionsCompleted: currentStats.sessionsCompleted + 1,
    lastSessionDate: today,
  };

  try {
    localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(updatedStats));

    // Store history (keep last 10)
    const rawHistory = localStorage.getItem(STORAGE_KEY_SESSIONS);
    const history: SessionResultData[] = rawHistory ? JSON.parse(rawHistory) : [];
    history.unshift(result);
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(history.slice(0, 10)));
  } catch (err) {
    console.error('Failed to save focus stats to localStorage:', err);
  }

  return updatedStats;
}
