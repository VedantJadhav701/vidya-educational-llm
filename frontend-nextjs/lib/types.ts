export type LearningMode = 'explore' | 'learn' | 'practice' | 'revise';

export type SubjectType = 'math' | 'physics' | 'chemistry' | 'biology' | 'cs' | 'general';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  mode?: LearningMode;
  subject?: SubjectType;
}

export interface MediaCardItem {
  id: string;
  type: 'image' | 'graph';
  title: string;
  url?: string;
  expr?: string;
  isWikiImage?: boolean;
  timestamp: number;
}

export interface BackendStatus {
  isAvailable: boolean;
  isWakingUp: boolean;
  message: string;
}

export interface SessionStats {
  questionsAsked: number;
  topicsExplored: number;
  activeMode: LearningMode;
}
