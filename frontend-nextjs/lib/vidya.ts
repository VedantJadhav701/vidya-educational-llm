import { Client } from '@gradio/client';
import { ChatMessage, BackendStatus } from './types';

const HF_SPACE_ID = process.env.NEXT_PUBLIC_HF_SPACE_ID || 'vedantjadhav701/vidya-1.7b';

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
    if (errMsg.includes('BUILDING') || errMsg.includes('SLEEPING') || errMsg.includes('PAUSED')) {
      return {
        isAvailable: false,
        isWakingUp: true,
        message: 'Vidya is waking up. Please try again in a moment.',
      };
    }
  }
  return {
    isAvailable: false,
    isWakingUp: false,
    message: 'Backend is currently offline or unreachable.',
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

  try {
    const client = await getGradioClient();
    
    // Call Gradio ChatInterface endpoint
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

    return cleanResponse(rawText);
  } catch (error: unknown) {
    const errObj = error as Error;
    console.error('Gradio Client Error:', errObj);
    
    // Fallback to direct HTTP fetch to HF Space if client.predict fails
    try {
      const response = await fetch(`https://${HF_SPACE_ID.replace('/', '-')}.hf.space/call/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [message, formattedHistory] }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json?.event_id) {
          const eventRes = await fetch(`https://${HF_SPACE_ID.replace('/', '-')}.hf.space/call/respond/${json.event_id}`);
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

    if (errObj?.message?.includes('503') || errObj?.message?.includes('building')) {
      throw new Error('Vidya is waking up on Hugging Face. Please try again in 1-2 minutes.');
    }
    
    throw new Error('Could not connect to Vidya backend. Please check network connection.');
  }
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
