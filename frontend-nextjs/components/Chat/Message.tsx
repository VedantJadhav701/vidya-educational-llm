'use client';

import { useState, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import EducationalBlock from './EducationalBlock';
import GraphCard from '../Media/GraphCard';
import ImageCard from '../Media/ImageCard';
import { fetchEducationalImage } from '@/lib/image';

interface MessageProps {
  message: ChatMessage;
  onQuickPrompt?: (prompt: string) => void;
  theme?: 'dark' | 'light';
}

function InlineImages({ queries }: { queries: string[] }) {
  const [images, setImages] = useState<{ url: string; title: string }[]>([]);

  useEffect(() => {
    if (queries.length === 0) return;
    
    // Clear old images
    setImages([]);

    queries.forEach((q) => {
      fetchEducationalImage(q).then((res) => {
        if (res.url) {
          setImages((prev) => {
            // Avoid duplicate rendering
            if (prev.some((img) => img.url === res.url)) return prev;
            return [...prev, { url: res.url!, title: res.title || q }];
          });
        }
      });
    });
  }, [queries]);

  if (images.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 mt-4 w-full">
      {images.map((img, i) => (
        <ImageCard key={i} url={img.url} title={img.title} />
      ))}
    </div>
  );
}

function InlineGraphs({ expressions, theme }: { expressions: string[]; theme?: 'dark' | 'light' }) {
  if (expressions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 mt-4 w-full">
      {expressions.map((expr, i) => (
        <GraphCard key={i} expr={expr} title={`Graph: ${expr}`} theme={theme} />
      ))}
    </div>
  );
}

export default function Message({ message, onQuickPrompt, theme = 'dark' }: MessageProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Parse inline media tags inside the message content
  const graphExpressions: string[] = [];
  const imageQueries: string[] = [];

  const graphRegex = /\[GRAPH:\s*([^\]]+)\s*\]/gi;
  let match;
  while ((match = graphRegex.exec(message.content)) !== null) {
    if (match[1]?.trim()) {
      graphExpressions.push(match[1].trim());
    }
  }

  const imageRegex = /\[IMAGE:\s*([^\]]+)\s*\]/gi;
  while ((match = imageRegex.exec(message.content)) !== null) {
    if (match[1]?.trim()) {
      imageQueries.push(match[1].trim());
    }
  }

  if (!isUser && !isSystem) {
    return (
      <div className="message ai-message flex flex-col animate-fadeIn self-start my-1 w-full max-w-full">
        <EducationalBlock content={message.content} />
        
        {/* Render inline graphs & images inside the chat block */}
        <InlineGraphs expressions={graphExpressions} theme={theme} />
        <InlineImages queries={imageQueries} />

        {/* Action Controls Footer */}
        <div className="flex items-center gap-3 mt-4 ml-2 text-[11px] text-neutral-450 dark:text-neutral-500">
          <button
            onClick={handleCopy}
            className="hover:text-neutral-800 dark:hover:text-white bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-white/5 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copied ? '✓ Copied' : '📋 Copy Lesson'}
          </button>

          <button
            onClick={handleSpeak}
            className={`px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-white/5 transition-colors flex items-center gap-1 cursor-pointer ${
              isSpeaking
                ? 'bg-neutral-200 dark:bg-neutral-700 text-black dark:text-white border-neutral-350 dark:border-neutral-600 font-semibold animate-pulse'
                : 'hover:text-neutral-800 dark:hover:text-white bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10'
            }`}
          >
            {isSpeaking ? '⏸️ Stop Audio' : '🔊 Listen Aloud'}
          </button>

          <button
            onClick={() => onQuickPrompt?.(`Explain step-by-step with examples: ${message.content.substring(0, 100)}`)}
            className="hover:text-neutral-800 dark:hover:text-white bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-white/5 transition-colors flex items-center gap-1 cursor-pointer"
          >
            🎓 Step-by-Step
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`message max-w-[85%] flex flex-col animate-fadeIn ${
        isUser ? 'self-end' : 'self-start'
      }`}
    >
      <div
        className={`message-content p-4 px-5 rounded-2xl leading-relaxed text-sm break-words shadow-sm border ${
          isUser
            ? 'bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-white rounded-br-xs'
            : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-250 rounded-bl-xs'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
