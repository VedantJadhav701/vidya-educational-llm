export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
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
