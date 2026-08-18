'use client';

import { useRef, useEffect } from 'react';
import { ChatMessage } from '@/lib/types';
import Message from './Message';
import PreparingAnswerIndicator from './PreparingAnswerIndicator';

interface MessageListProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onQuickPrompt?: (prompt: string) => void;
  theme?: 'dark' | 'light';
}

export default function MessageList({
  messages,
  isTyping,
  onQuickPrompt,
  theme = 'dark',
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <main
      ref={scrollRef}
      className="chat-history flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar h-full w-full"
    >
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} onQuickPrompt={onQuickPrompt} theme={theme} />
      ))}

      {isTyping && <PreparingAnswerIndicator />}
    </main>
  );
}
