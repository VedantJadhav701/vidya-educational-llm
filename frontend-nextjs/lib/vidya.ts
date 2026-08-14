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
    
    const text = extractTextFromGradioData(result?.data);
    if (text) return cleanResponse(text);
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
        
        // Try parsing JSON Lines
        try {
          const lines = textData.split('\n');
          for (const line of lines) {
            if (line.startsWith('data:')) {
              const dataContent = JSON.parse(line.substring(5).trim());
              const text = extractTextFromGradioData(dataContent);
              if (text) return cleanResponse(text);
            }
          }
        } catch {
          // ignore stream parse error
        }
      }
    }
  } catch (fallbackErr) {
    console.error('Fallback HF Fetch Error:', fallbackErr);
  }

  throw new Error('Vidya is waking up on Hugging Face ZeroGPU. Please wait a few seconds and try again!');
}

function extractTextFromGradioData(data: unknown): string {
  if (!data) return '';

  if (typeof data === 'string') {
    return data;
  }

  if (Array.isArray(data)) {
    // Gradio 5 returns array of component values: [chatbot_value, textbox_update_dict]
    const chatbotVal = data[0];

    let chatArray = chatbotVal;
    if (chatbotVal && typeof chatbotVal === 'object' && chatbotVal !== null && 'value' in chatbotVal) {
      chatArray = (chatbotVal as Record<string, unknown>).value;
    }

    if (Array.isArray(chatArray) && chatArray.length > 0) {
      const lastItem = chatArray[chatArray.length - 1];

      // Format 1: Gradio 5 messages dict [{role: "assistant", content: "..."}]
      if (lastItem && typeof lastItem === 'object' && 'content' in lastItem && typeof lastItem.content === 'string') {
        return lastItem.content;
      }

      // Format 2: Tuple [user_msg, assistant_msg]
      if (Array.isArray(lastItem) && lastItem.length >= 2) {
        return String(lastItem[1] || lastItem[0]);
      }

      // Format 3: Tuple in string
      if (typeof lastItem === 'string') {
        return lastItem;
      }
    }

    // Failsafe scan backwards for any message content or tuple
    for (let i = data.length - 1; i >= 0; i--) {
      const item = data[i];
      if (item && typeof item === 'object' && item !== null) {
        if ('content' in item && typeof item.content === 'string') {
          return item.content;
        }
        if ('value' in item && Array.isArray(item.value)) {
          const innerArr = item.value;
          const last = innerArr[innerArr.length - 1];
          if (last && typeof last === 'object' && 'content' in last && typeof last.content === 'string') {
            return last.content;
          }
          if (Array.isArray(last) && last.length >= 2) {
            return String(last[1]);
          }
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
