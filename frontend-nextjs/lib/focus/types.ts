export type GameMode = 'math' | 'pattern' | 'memory' | 'science' | 'logic';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type SessionDuration = 30 | 60 | 90;

export interface Question {
  id: string;
  type: GameMode;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: Difficulty;
  category?: string;
}

export interface MemoryGridConfig {
  size: number; // 3 for 3x3, 4 for 4x4, 5 for 5x5
  highlightedCells: number[]; // Flat array index
  displayDurationMs: number;
}

export interface GameState {
  mode: GameMode;
  difficulty: Difficulty;
  duration: SessionDuration;
  status: 'idle' | 'playing' | 'paused' | 'completed';
  timeRemaining: number;
  currentQuestionIndex: number;
  questionsSolved: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  totalResponseTimeMs: number;
  score: number;
  lastAnswerResult: 'correct' | 'incorrect' | null;
}

export interface SessionResultData {
  mode: GameMode;
  difficulty: Difficulty;
  score: number;
  accuracy: number;
  questionsSolved: number;
  correctAnswers: number;
  avgResponseTimeSec: number;
  bestStreak: number;
  date: string;
}

export interface UserFocusStats {
  todayFocusScore: number;
  bestScore: number;
  sessionsCompleted: number;
  lastSessionDate: string;
}
