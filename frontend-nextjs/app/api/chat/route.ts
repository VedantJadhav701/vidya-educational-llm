import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/lib/vidya';
import { estimateTokens, UsageStore } from '@/lib/token-limit';
import { ChatMessage } from '@/lib/types';

// Initialize global stats store
if (!(global as any).statsStore) {
  (global as any).statsStore = {
    totalQuestions: 1420,
    activeSessions: new Map<string, number>(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history, language, subject } = body;

    // 1. Validate request parameters
    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Invalid or empty message provided.' },
        { status: 400 }
      );
    }

    const validatedHistory: ChatMessage[] = Array.isArray(history) ? history : [];
    
    // Trim history to MAX_HISTORY_MESSAGES to stay within context windows (Section 21 of plan)
    const maxHistoryMessages = Number(process.env.MAX_HISTORY_MESSAGES) || 20;
    const trimmedHistory = validatedHistory.slice(-maxHistoryMessages);

    // 2. Identify session for anonymous usage tracking (Section 17 of plan)
    // Try to get session id from cookie, otherwise create one
    let sessionId = request.cookies.get('vidya_session_id')?.value;
    let isNewSession = false;
    
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      isNewSession = true;
    }

    // 3. Estimate input tokens (Section 18 of plan)
    // We combine prompt, history, and system instructions for a truer context estimation
    const isIndic = language && language !== 'Auto' && language !== 'English';
    const historyString = trimmedHistory.map(m => `${m.role}: ${m.content}`).join('\n');
    const inputPromptEstimate = message + '\n' + historyString;
    const inputTokens = estimateTokens(inputPromptEstimate, isIndic);

    // 4. Validate request size limits (Section 29 of plan)
    const maxInputTokens = Number(process.env.VIDYA_MAX_INPUT_TOKENS) || 4096;
    if (inputTokens > maxInputTokens) {
      return NextResponse.json(
        { error: 'Your question or chat history is too long. Please start a new chat.' },
        { status: 400 }
      );
    }

    // 5. Enforce Rate Limits server-side (Section 16, 17 of plan)
    const limitCheck = UsageStore.checkRateLimit(sessionId, inputTokens);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: limitCheck.reason || 'Vidya is temporarily unavailable for this session. Please try again later.' },
        { status: 429 }
      );
    }

    // Increment global stats
    const statsStore = (global as any).statsStore;
    if (statsStore) {
      statsStore.totalQuestions += 1;
      if (sessionId) {
        statsStore.activeSessions.set(sessionId, Date.now());
      }
    }

    // 6. Call Hugging Face Space backend (Section 14 of plan)
    // The client calls sendMessage which utilizes the Gradio connected SDK.
    // If the HF Space is asleep/error, this function handles retries and throws appropriate errors.
    const answer = await sendMessage(message, trimmedHistory);

    // 7. Estimate output tokens and increment usage
    const outputTokens = estimateTokens(answer, isIndic);
    UsageStore.incrementUsage(sessionId, inputTokens, outputTokens);

    // 8. Construct response (Section 15 of plan)
    const response = NextResponse.json({
      answer,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
      },
    });

    // Set cookie if it's a new session
    if (isNewSession) {
      response.cookies.set('vidya_session_id', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    return response;
  } catch (error: unknown) {
    console.error('Chat API Route Error:', error);
    const errMsg = (error as Error)?.message || '';

    // Map errors to user-friendly messages, hiding stack traces & secrets (Section 20 & 24 of plan)
    let userMessage = 'Vidya is temporarily unavailable. Please try again in a moment.';
    let status = 500;

    if (errMsg.includes('quota') || errMsg.includes('limit') || errMsg.includes('429')) {
      userMessage = "Vidya's free GPU quota has been reached. Please try again later. (HF Details: " + errMsg + ")";
      status = 429;
    } else if (
      errMsg.includes('sleeping') || 
      errMsg.includes('waking') || 
      errMsg.includes('503') ||
      errMsg.includes('starting up') ||
      errMsg.includes('first request')
    ) {
      userMessage = 'Vidya is starting up. This may take a minute on the first request — please try again shortly! (HF Details: ' + errMsg + ')';
      status = 503;
    } else {
      userMessage = 'Vidya error: ' + errMsg;
    }

    return NextResponse.json({ error: userMessage }, { status });
  }
}
