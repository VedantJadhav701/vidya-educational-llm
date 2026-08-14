import { Client } from '@gradio/client';
import { ChatMessage, BackendStatus } from './types';

const HF_SPACE_ID = process.env.NEXT_PUBLIC_HF_SPACE_ID || 'vedantjadhav701/vidya-1.7b';

// Convert HF_SPACE_ID (e.g. "vedantjadhav701/vidya-1.7b") to valid HF subdomain ("vedantjadhav701-vidya-1-7b")
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
    if (errMsg.includes('BUILDING') || errMsg.includes('SLEEPING') || errMsg.includes('PAUSED') || errMsg.includes('503')) {
      return {
        isAvailable: false,
        isWakingUp: true,
        message: 'Vidya is waking up on ZeroGPU. Please try again in a moment.',
      };
    }
  }
  return {
    isAvailable: false,
    isWakingUp: false,
    message: 'Vidya ZeroGPU backend is initializing.',
  };
}

export async function sendMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  // Include recent conversation context in the message prompt for context continuity
  let enrichedPrompt = message;
  if (history && history.length > 0) {
    const recentHistory = history.slice(-4);
    const contextLines = recentHistory
      .filter((m) => m.content && (m.role === 'user' || m.role === 'assistant'))
      .map((m) => `${m.role === 'user' ? 'Student' : 'Vidya'}: ${m.content}`);
    if (contextLines.length > 0) {
      enrichedPrompt = `[Conversation Context]\n${contextLines.join('\n')}\n\nStudent: ${message}`;
    }
  }

  // 1. Primary: Use Gradio Client to predict
  try {
    const client = await getGradioClient();
    const gradioObj = client as unknown as { predict: (endpoint: number | string, data: unknown[]) => Promise<{ data: Array<unknown> }> };
    
    let result;
    try {
      result = await gradioObj.predict('/predict', [enrichedPrompt]);
    } catch {
      try {
        result = await gradioObj.predict(0, [enrichedPrompt]);
      } catch {
        result = await gradioObj.predict('/chat', [enrichedPrompt]);
      }
    }

    const text = extractTextFromGradioData(result?.data);
    if (text) return cleanResponse(text);
  } catch (error: unknown) {
    console.warn('Gradio Client predict failed, trying direct HF API endpoints:', error);
  }

  // 2. Direct HF Space HTTP endpoints fallback with /gradio_api prefix
  const endpoints = [
    `${HF_DIRECT_URL}/gradio_api/call/predict`,
    `${HF_DIRECT_URL}/gradio_api/run/predict`,
    `${HF_DIRECT_URL}/gradio_api/call/chat`,
    `${HF_DIRECT_URL}/gradio_api/run/chat`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [enrichedPrompt] }),
      });

      if (response.ok) {
        const json = await response.json();

        // Handle SSE event stream
        if (json?.event_id) {
          const streamUrl = `${endpoint}/${json.event_id}`;
          const eventRes = await fetch(streamUrl);
          const textData = await eventRes.text();

          const extractedText = extractTextFromGradioData(textData);
          if (extractedText) return cleanResponse(extractedText);

          const match = textData.match(/data:\s*\["(.*)"\]/);
          if (match && match[1]) {
            return cleanResponse(JSON.parse(`"${match[1]}"`));
          }
        }

        // Handle synchronous data payload
        if (json?.data) {
          const extractedText = extractTextFromGradioData(json.data);
          if (extractedText) return cleanResponse(extractedText);
        }
      }
    } catch (err) {
      console.warn(`Endpoint ${endpoint} failed:`, err);
    }
  }

  throw new Error('Vidya is waking up on Hugging Face ZeroGPU. Please wait a few seconds and try again!');
}

function extractTextFromGradioData(data: unknown): string {
  if (!data) return '';

  if (typeof data === 'string') {
    if (data.includes('data:')) {
      const lines = data.split('\n');
      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const raw = line.substring(5).trim();
            if (raw && raw !== 'null') {
              const parsed = JSON.parse(raw);
              const text = extractTextFromGradioData(parsed);
              if (text) return text;
            }
          } catch {
            // ignore JSON parse error on partial lines
          }
        }
      }
    }
    if (data.startsWith('event:') || data.startsWith('data: null')) {
      return '';
    }
    return data;
  }

  if (Array.isArray(data)) {
    if (data.length === 1 && typeof data[0] === 'string') {
      return data[0];
    }

    const firstItem = data[0];
    if (typeof firstItem === 'string') {
      return firstItem;
    }

    if (Array.isArray(firstItem) && firstItem.length > 0) {
      const last = firstItem[firstItem.length - 1];
      if (typeof last === 'string') return last;
      if (last && typeof last === 'object' && 'content' in last && typeof last.content === 'string') {
        return last.content;
      }
    }

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
