'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ChatMessage } from '@/lib/types';
import { normalizeMarkdown } from '@/lib/markdown';

interface MessageProps {
  message: ChatMessage;
  onQuickPrompt?: (prompt: string) => void;
}

export default function Message({ message, onQuickPrompt }: MessageProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const normalizedContent = normalizeMarkdown(message.content);

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

  return (
    <div
      className={`message max-w-[88%] flex flex-col animate-fadeIn ${
        isUser ? 'self-end' : 'self-start'
      }`}
    >
      {/* Role Badge Header */}
      {!isUser && (
        <div className="flex items-center gap-2 mb-1.5 ml-1">
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] flex items-center justify-center text-[10px] text-white font-bold shadow">
            🎓
          </div>
          <span className="text-[11px] font-semibold text-[#f1f5f9]">Vidya 1.7B</span>
          <span className="text-[10px] text-[#a855f7] bg-[#a855f7]/10 px-1.5 py-0.2 rounded border border-[#a855f7]/20">
            NCERT AI
          </span>
        </div>
      )}

      <div
        className={`message-content p-4 px-5 rounded-2xl leading-relaxed text-sm break-words shadow-lg border ${
          isUser
            ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] border-[#a855f7]/40 text-white rounded-br-xs'
            : isSystem
            ? 'bg-[#334155]/70 border-white/10 text-[#f1f5f9] rounded-bl-xs'
            : 'bg-[#1e293b]/90 border-white/10 text-[#f1f5f9] rounded-bl-xs'
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              h1: ({ children }) => <h1 className="text-lg font-bold my-3 text-[#f1f5f9] border-b border-white/10 pb-1">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold my-2 text-[#f1f5f9]">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold my-2 text-[#f1f5f9]">{children}</h3>,
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-[#0f172a] text-[#ec4899] px-1.5 py-0.5 rounded text-xs font-mono border border-white/5">
                    {children}
                  </code>
                ) : (
                  <code className="block bg-[#0b0f19] text-[#e2e8f0] p-3 rounded-xl overflow-x-auto my-3 text-xs font-mono border border-white/10 shadow-inner">
                    {children}
                  </code>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[#a855f7] pl-3 italic my-3 text-[#cbd5e1] bg-white/5 py-1 rounded-r">
                  {children}
                </blockquote>
              ),
            }}
          >
            {normalizedContent}
          </ReactMarkdown>
        )}
      </div>

      {/* Interactive Action Bar on Assistant Messages */}
      {!isUser && !isSystem && (
        <div className="flex items-center gap-2 mt-1.5 ml-1 text-[11px] text-[#94a3b8]">
          <button
            onClick={handleCopy}
            className="hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/5 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>

          <button
            onClick={handleSpeak}
            className={`px-2 py-0.5 rounded border border-white/5 transition-colors flex items-center gap-1 cursor-pointer ${
              isSpeaking
                ? 'bg-[#ec4899]/20 text-[#ec4899] border-[#ec4899]/40 font-medium animate-pulse'
                : 'hover:text-white bg-white/5 hover:bg-white/10'
            }`}
          >
            {isSpeaking ? '⏸️ Stop Audio' : '🔊 Listen'}
          </button>

          <button
            onClick={() => onQuickPrompt?.(`Explain step-by-step with examples: ${message.content.substring(0, 100)}`)}
            className="hover:text-[#a855f7] bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/5 transition-colors flex items-center gap-1 cursor-pointer"
          >
            🎓 Step-by-Step
          </button>
        </div>
      )}
    </div>
  );
}
