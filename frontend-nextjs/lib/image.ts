export interface ImageResult {
  url?: string;
  title?: string;
  error?: string;
}

export function detectImageQuery(userMessage: string, aiResponse?: string): string | null {
  // Check [IMAGE: ...] tag in AI response
  if (aiResponse) {
    const match = aiResponse.match(/\[IMAGE:\s*(.+?)\]/i);
    if (match && match[1]?.trim()) {
      return match[1].trim();
    }
  }

  // Failsafe: check user intent in prompt
  const imgMatch = userMessage.match(/(?:picture|image|photo|pic) of (?:the |a )?([a-zA-Z0-9\s]+)/i);
  if (imgMatch && imgMatch[1]?.trim()) {
    return imgMatch[1].trim();
  }

  if (userMessage.toLowerCase().includes('generate an image of')) {
    const query = userMessage.toLowerCase().split('generate an image of')[1]?.trim();
    if (query) return query;
  }

  return null;
}

export async function fetchEducationalImage(query: string): Promise<ImageResult> {
  try {
    const res = await fetch(`/api/image?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.url) {
        return { url: data.url, title: data.title || query };
      }
    }
    return { error: 'No image found' };
  } catch (error: unknown) {
    console.error('Image search error:', error);
    return { error: (error as Error)?.message || 'Failed to search image' };
  }
}
