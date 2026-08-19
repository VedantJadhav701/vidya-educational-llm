import { Difficulty } from './types';

export function calculateAnswerScore(
  responseTimeMs: number,
  currentStreak: number,
  difficulty: Difficulty
): number {
  const base = 10;
  
  // Speed bonus
  let speedBonus = 0;
  if (responseTimeMs < 2000) {
    speedBonus = 5;
  } else if (responseTimeMs < 4000) {
    speedBonus = 3;
  } else if (responseTimeMs < 6000) {
    speedBonus = 1;
  }

  // Streak bonus
  let streakBonus = 0;
  if (currentStreak >= 5) {
    streakBonus = 3;
  } else if (currentStreak >= 3) {
    streakBonus = 2;
  } else if (currentStreak >= 2) {
    streakBonus = 1;
  }

  // Difficulty multiplier
  const multiplier = difficulty === 'hard' ? 1.5 : difficulty === 'medium' ? 1.2 : 1.0;

  return Math.round((base + speedBonus + streakBonus) * multiplier);
}

export function calculateFinalFocusScore(
  rawScore: number,
  accuracy: number,
  bestStreak: number
): number {
  if (rawScore <= 0) return 0;
  const accuracyBonus = Math.round(accuracy * 2);
  const streakBonus = bestStreak * 5;
  return Math.round(rawScore + accuracyBonus + streakBonus);
}
