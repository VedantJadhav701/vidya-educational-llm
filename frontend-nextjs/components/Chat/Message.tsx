'use client';

import { useState } from 'react';
import { ChatMessage } from '@/lib/types';
import EducationalBlock from './EducationalBlock';

interface MessageProps {
  message: ChatMessage;
  onQuickPrompt?: (prompt: string) => void;
}

export default function Message({ message, onQuickPrompt }: MessageProps) {
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

  if (!isUser && !isSystem) {
    return (
      <div className="message ai-message max-w-[92%] flex flex-col animate-fadeIn self-start my-1">
        <EducationalBlock content={message.content} />

        {/* Action Controls Footer */}
        <div className="flex items-center gap-3 mt-2 ml-2 text-[11px] text-[#94a3b8]">
          <button
            onClick={handleCopy}
            className="hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/5 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copied ? '✓ Copied' : '📋 Copy Lesson'}
          </button>

          <button
            onClick={handleSpeak}
            className={`px-2.5 py-1 rounded-lg border border-white/5 transition-colors flex items-center gap-1 cursor-pointer ${
              isSpeaking
                ? 'bg-[#ec4899]/20 text-[#ec4899] border-[#ec4899]/40 font-semibold animate-pulse'
                : 'hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            {isSpeaking ? '⏸️ Stop Audio' : '🔊 Listen Aloud'}
          </button>

          <button
            onClick={() => onQuickPrompt?.(`Explain step-by-step with examples: ${message.content.substring(0, 100)}`)}
            className="hover:text-[#a855f7] bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/5 transition-colors flex items-center gap-1 cursor-pointer"
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
        className={`message-content p-4 px-5 rounded-2xl leading-relaxed text-sm break-words shadow-lg border ${
          isUser
            ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] border-[#a855f7]/40 text-white rounded-br-xs'
            : 'bg-[#334155]/70 border-white/10 text-[#f1f5f9] rounded-bl-xs'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
