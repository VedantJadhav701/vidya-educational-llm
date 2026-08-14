'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ChatMessage } from '@/lib/types';
import { normalizeMarkdown } from '@/lib/markdown';

interface MessageProps {
  message: ChatMessage;
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const normalizedContent = normalizeMarkdown(message.content);

  return (
    <div
      className={`message max-w-[85%] flex animate-fadeIn ${
        isUser ? 'self-end' : 'self-start'
      }`}
    >
      <div
        className={`message-content p-4 px-5 rounded-2xl leading-relaxed text-sm break-words shadow-md ${
          isUser
            ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white rounded-br-xs'
            : isSystem
            ? 'bg-[#334155]/70 border border-white/5 text-[#f1f5f9] rounded-bl-xs'
            : 'bg-[#334155]/70 border border-white/5 text-[#f1f5f9] rounded-bl-xs'
        }`}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              h1: ({ children }) => <h1 className="text-lg font-bold my-3 text-[#f1f5f9]">{children}</h1>,
              h2: ({ children }) => <h2 className="text-base font-bold my-2 text-[#f1f5f9]">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold my-2 text-[#f1f5f9]">{children}</h3>,
              code: ({ children, className }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-[#0f172a]/50 text-[#ec4899] px-1.5 py-0.5 rounded text-xs font-mono">
                    {children}
                  </code>
                ) : (
                  <code className="block bg-[#0f172a] text-[#e2e8f0] p-3 rounded-lg overflow-x-auto my-3 text-xs font-mono border border-white/5">
                    {children}
                  </code>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[#a855f7] pl-3 italic my-3 text-[#cbd5e1]">
                  {children}
                </blockquote>
              ),
            }}
          >
            {normalizedContent}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
