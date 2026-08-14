import { Client } from '@gradio/client';
import { ChatMessage, BackendStatus } from './types';

const HF_SPACE_ID =
  process.env.NEXT_PUBLIC_HF_SPACE_ID || 'vedantjadhav701/vidya-1.7b';

// Convert HF_SPACE_ID (e.g. "vedantjadhav701/vidya-1.7b") to valid HF subdomain
const hfSubdomain = HF_SPACE_ID.toLowerCase().replace(/[^a-z0-9]/g, '-');
const HF_DIRECT_URL = `https://${hfSubdomain}.hf.space`;

let gradioClient: unknown = null;

async function getGradioClient() {
  if (!gradioClient) {
    gradioClient = await Client.connect(HF_SPACE_ID);
  }
  return gradioClient as Client;
}

export async function checkBackendHealth(): Promise<BackendStatus> {
  try {
    const client = await getGradioClient();
    if (client) {
      return {
        isAvailable: true,
        isWakingUp: false,
        message: 'Vidya is online',
      };
    }
  } catch (err: unknown) {
    const errMsg = (err as Error)?.message || '';
    if (
      errMsg.includes('BUILDING') ||
      errMsg.includes('SLEEPING') ||
      errMsg.includes('PAUSED') ||
      errMsg.includes('503')
    ) {
      return {
        isAvailable: false,
        isWakingUp: true,
        message:
          'Vidya is waking up. Please try again in a moment.',
      };
    }
  }
  return {
    isAvailable: false,
    isWakingUp: false,
    message: 'Vidya backend is initializing.',
  };
}

export async function sendMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  // Include recent conversation context in the message prompt
  let enrichedPrompt = message;
  if (history && history.length > 0) {
    const recentHistory = history.slice(-4);
    const contextLines = recentHistory
      .filter(
        (m) => m.content && (m.role === 'user' || m.role === 'assistant')
      )
      .map(
        (m) =>
          `${m.role === 'user' ? 'Student' : 'Vidya'}: ${m.content}`
      );
    if (contextLines.length > 0) {
      enrichedPrompt = `[Conversation Context]\n${contextLines.join('\n')}\n\nStudent: ${message}`;
    }
  }

  // ── Strategy 1: Gradio Client (most reliable) ──
  try {
    const client = await getGradioClient();
    const gradioObj = client as unknown as {
      predict: (
        endpoint: number | string,
        data: unknown[]
      ) => Promise<{ data: Array<unknown> }>;
    };

    // Try fn_index 0 first (always works with gr.Interface), then named endpoint
    let result;
    try {
      result = await gradioObj.predict(0, [enrichedPrompt]);
    } catch {
      result = await gradioObj.predict('/predict', [enrichedPrompt]);
    }

    const text = extractTextFromGradioData(result?.data);
    if (text) return cleanResponse(text);
  } catch (error: unknown) {
    const errMsg = (error as Error)?.message || '';

    // Quota exceeded — surface immediately, don't fall through
    if (
      errMsg.includes('exceeded') ||
      errMsg.includes('quota') ||
      errMsg.includes('429')
    ) {
      const waitMatch = errMsg.match(/Try again in (\S+)/);
      const waitTime = waitMatch ? waitMatch[1] : 'some time';
      throw new Error(
        `Vidya's free GPU quota has been reached. Please try again in ${waitTime}. Tip: Sign in on Hugging Face for more quota.`
      );
    }

    console.warn('Gradio Client failed, trying direct HTTP:', error);
    // Reset client so next call reconnects
    gradioClient = null;
  }

  // ── Strategy 2: Gradio 5 SSE endpoint /gradio_api/call/predict ──
  try {
    const callRes = await fetch(
      `${HF_DIRECT_URL}/gradio_api/call/predict`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [enrichedPrompt] }),
      }
    );

    if (callRes.ok) {
      const callJson = await callRes.json();

      if (callJson?.event_id) {
        // Poll the SSE stream for the result
        const sseUrl = `${HF_DIRECT_URL}/gradio_api/call/predict/${callJson.event_id}`;
        const sseRes = await fetch(sseUrl);
        const sseText = await sseRes.text();

        // Parse SSE: look for "data:" lines with JSON arrays
        const lines = sseText.split('\n');
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const raw = line.substring(5).trim();
            if (raw && raw !== 'null') {
              try {
                const parsed = JSON.parse(raw);
                const text = extractTextFromGradioData(parsed);
                if (text) return cleanResponse(text);
              } catch {
                // Not valid JSON, try as plain text
                if (raw.length > 5) return cleanResponse(raw);
              }
            }
          }
        }
      }

      // Direct data response (some Gradio versions)
      if (callJson?.data) {
        const text = extractTextFromGradioData(callJson.data);
        if (text) return cleanResponse(text);
      }
    }
  } catch (err) {
    console.warn('Direct SSE endpoint failed:', err);
  }

  // ── Strategy 3: Legacy /api/predict (older Gradio compat) ──
  try {
    const legacyRes = await fetch(`${HF_DIRECT_URL}/api/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [enrichedPrompt] }),
    });

    if (legacyRes.ok) {
      const json = await legacyRes.json();
      if (json?.data) {
        const text = extractTextFromGradioData(json.data);
        if (text) return cleanResponse(text);
      }
    }
  } catch (err) {
    console.warn('Legacy /api/predict failed:', err);
  }

  throw new Error(
    'Vidya is starting up. This may take a minute on the first request — please try again shortly!'
  );
}

function extractTextFromGradioData(data: unknown): string {
  if (!data) return '';

  if (typeof data === 'string') {
    if (
      data.startsWith('event:') ||
      data.startsWith('data: null') ||
      data === 'null'
    ) {
      return '';
    }
    return data;
  }

  if (Array.isArray(data)) {
    // Most common: ["response text"]
    if (data.length >= 1 && typeof data[0] === 'string') {
      return data[0];
    }

    // Nested array: [["response text"]]
    const firstItem = data[0];
    if (Array.isArray(firstItem) && firstItem.length > 0) {
      const last = firstItem[firstItem.length - 1];
      if (typeof last === 'string') return last;
      if (
        last &&
        typeof last === 'object' &&
        'content' in last &&
        typeof last.content === 'string'
      ) {
        return last.content;
      }
    }

    // Object with content field
    for (let i = data.length - 1; i >= 0; i--) {
      const item = data[i];
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && item !== null) {
        if ('content' in item && typeof item.content === 'string') {
          return item.content;
        }
      }
    }
  }

  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    if (typeof obj.content === 'string') return obj.content;
    if (typeof obj.text === 'string') return obj.text;
  }

  return '';
}

function cleanResponse(response: string): string {
  if (!response) return '';

  let cleaned = response;

  if (cleaned.includes('<think>')) {
    cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  }
  if (cleaned.includes('</think>')) {
    cleaned = cleaned.split('</think>').pop()?.trim() || '';
  }

  cleaned = cleaned.replace(/\[IMAGE:\s*.*?\]/gi, '').trim();
  cleaned = cleaned.replace(/\[GRAPH:\s*.*?\]/gi, '').trim();

  return cleaned;
}
