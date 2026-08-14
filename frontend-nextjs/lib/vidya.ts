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
  const formattedHistory: [string, string][] = [];
  
  for (let i = 0; i < history.length; i += 2) {
    const userMsg = history[i]?.role === 'user' ? history[i].content : '';
    const assistantMsg = history[i + 1]?.role === 'assistant' ? history[i + 1].content : '';
    if (userMsg || assistantMsg) {
      formattedHistory.push([userMsg, assistantMsg]);
    }
  }

  // Try Gradio Client first
  try {
    const client = await getGradioClient();
    const result = await (client as unknown as { predict: (endpoint: number | string, data: unknown[]) => Promise<{ data: Array<unknown> }> }).predict(0, [message, formattedHistory]);
    
    let rawText = '';
    if (typeof result?.data?.[0] === 'string') {
      rawText = result.data[0];
    } else if (Array.isArray(result?.data) && typeof result.data[0] === 'object' && result.data[0] !== null) {
      const lastMsg = result.data[result.data.length - 1] as Record<string, unknown>;
      rawText = typeof lastMsg?.content === 'string' ? lastMsg.content : typeof lastMsg?.text === 'string' ? lastMsg.text : JSON.stringify(result.data);
    } else if (result?.data) {
      rawText = String(result.data);
    }

    if (rawText) return cleanResponse(rawText);
  } catch (error: unknown) {
    console.warn('Gradio Client predict failed, trying direct HF API call:', error);
  }

  // Fallback direct HF Space call API
  try {
    const response = await fetch(`${HF_DIRECT_URL}/call/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [message, formattedHistory] }),
    });

    if (response.ok) {
      const json = await response.json();
      if (json?.event_id) {
        const eventRes = await fetch(`${HF_DIRECT_URL}/call/respond/${json.event_id}`);
        const textData = await eventRes.text();
        const match = textData.match(/data:\s*\["(.*)"\]/);
        if (match && match[1]) {
          return cleanResponse(JSON.parse(`"${match[1]}"`));
        }
      }
    }
  } catch (fallbackErr) {
    console.error('Fallback HF Fetch Error:', fallbackErr);
  }

  throw new Error('Vidya is waking up on Hugging Face ZeroGPU. Please wait a few seconds and try again!');
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
