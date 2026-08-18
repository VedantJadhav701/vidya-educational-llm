import { ChatMessage, SessionStats } from './types';

// Fallback token estimation for Qwen/educational models
// Isolate token estimation as per Section 18 of frontend_plan.md
export function estimateTokens(text: string, isIndic: boolean = false): number {
  if (!text) return 0;
  
  // Clean whitespace
  const cleanText = text.trim();
  if (!cleanText) return 0;

  // Basic estimation:
  // English words average ~1.3 tokens.
  // Indic languages average ~3.5 tokens per word (or 1.2 tokens per character due to byte-level BPE)
  if (isIndic || containsIndicCharacters(cleanText)) {
    // Each non-ASCII character represents an Indic character which is heavily split in BPE
    const nonAsciiCount = (cleanText.match(/[^\x00-\x7F]/g) || []).length;
    const asciiText = cleanText.replace(/[^\x00-\x7F]/g, '');
    const asciiWordCount = asciiText.split(/\s+/).filter(Boolean).length;
    
    return Math.ceil(asciiWordCount * 1.3 + nonAsciiCount * 1.5);
  } else {
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    const charCount = cleanText.length;
    // Weighted average between word count and character count to handle punctuation/special symbols
    return Math.max(Math.ceil(wordCount * 1.35), Math.ceil(charCount / 3.8));
  }
}

function containsIndicCharacters(text: string): boolean {
  // Regex range for Devanagari, Bengali, Gurmukhi, Gujarati, Oriya, Tamil, Telugu, Kannada, Malayalam, Sinhala scripts
  return /[\u0900-\u0DFF]/.test(text);
}

// In-Memory Usage Store for Local Development (Section 19 of frontend_plan.md)
// In production (e.g. Vercel), this would use Redis/Upstash.
interface UserUsage {
  sessionId: string;
  requestCount: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  windowStart: number;
  windowEnd: number;
}

const memoryStore = new Map<string, UserUsage>();

// Environment variables configuration with defaults
const WINDOW_DURATION_MS = 60 * 60 * 1000; // 1 hour window
const MAX_REQUESTS_PER_WINDOW = Number(process.env.VIDYA_MAX_REQUESTS_PER_WINDOW) || 20;
const MAX_TOTAL_TOKENS_PER_WINDOW = Number(process.env.VIDYA_MAX_TOTAL_TOKENS_PER_WINDOW) || 10000;

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  remainingRequests?: number;
  resetTime?: number;
}

export class UsageStore {
  static getUsage(sessionId: string): UserUsage {
    const now = Date.now();
    let usage = memoryStore.get(sessionId);

    if (!usage || now > usage.windowEnd) {
      usage = {
        sessionId,
        requestCount: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        windowStart: now,
        windowEnd: now + WINDOW_DURATION_MS,
      };
      memoryStore.set(sessionId, usage);
    }

    return usage;
  }

  static checkRateLimit(sessionId: string, currentInputTokens: number): RateLimitResult {
    const usage = this.getUsage(sessionId);
    const now = Date.now();

    // Check request count
    if (usage.requestCount >= MAX_REQUESTS_PER_WINDOW) {
      return {
        allowed: false,
        reason: 'Vidya is temporarily unavailable for this session. Please try again later.',
        resetTime: usage.windowEnd,
      };
    }

    // Check token limits
    if (usage.totalTokens + currentInputTokens > MAX_TOTAL_TOKENS_PER_WINDOW) {
      return {
        allowed: false,
        reason: 'Vidya is temporarily unavailable for this session. Please try again later.',
        resetTime: usage.windowEnd,
      };
    }

    return {
      allowed: true,
      remainingRequests: MAX_REQUESTS_PER_WINDOW - usage.requestCount,
      resetTime: usage.windowEnd,
    };
  }

  static incrementUsage(
    sessionId: string,
    inputTokens: number,
    outputTokens: number
  ): UserUsage {
    const usage = this.getUsage(sessionId);
    usage.requestCount += 1;
    usage.inputTokens += inputTokens;
    usage.outputTokens += outputTokens;
    usage.totalTokens += (inputTokens + outputTokens);
    
    memoryStore.set(sessionId, usage);
    return usage;
  }
}
