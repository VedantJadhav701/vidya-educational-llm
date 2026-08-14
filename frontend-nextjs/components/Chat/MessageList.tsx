'use client';

import { useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import Message from './Message';

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  typingText?: string;
  onQuickPrompt?: (prompt: string) => void;
}

export default function MessageList({
  messages,
  isTyping,
  typingText = 'Thinking...',
  onQuickPrompt,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, typingText]);

  return (
    <main
      ref={scrollRef}
      className="chat-history flex-1 overflow-y-auto p-6 flex flex-col gap-5 scroll-smooth custom-scrollbar"
    >
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} onQuickPrompt={onQuickPrompt} />
      ))}

      {isTyping && (
        <div className="message ai-message max-w-[80%] flex animate-fadeIn self-start">
          <div className="message-content typing-indicator bg-[#1e293b]/90 border border-white/10 text-[#f1f5f9] rounded-2xl rounded-bl-xs p-3.5 px-5 flex items-center gap-2 shadow-lg">
            <span className="thinking-text text-xs font-medium text-[#a855f7] mr-1 flex items-center gap-1.5">
              <span className="animate-spin text-sm">🧠</span> {typingText}
            </span>
            <div className="typing-dot w-1.5 h-1.5 bg-[#a855f7] rounded-full animate-typingDot1" />
            <div className="typing-dot w-1.5 h-1.5 bg-[#ec4899] rounded-full animate-typingDot2" />
            <div className="typing-dot w-1.5 h-1.5 bg-[#38bdf8] rounded-full animate-typingDot3" />
          </div>
        </div>
      )}
    </main>
  );
}
