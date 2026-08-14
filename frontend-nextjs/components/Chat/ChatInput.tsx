'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <footer className="chat-input-area p-5 px-6 bg-[#0f172a]/80 border-t border-white/10">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Vidya a question..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-[#1e293b]/50 border border-white/10 text-white rounded-xl p-3.5 text-sm resize-none outline-none focus:border-[#a855f7] focus:bg-[#1e293b]/80 focus:ring-2 focus:ring-[#a855f7]/20 placeholder-[#64748b] transition-all max-h-[150px] leading-relaxed disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          aria-label="Send message"
          className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white rounded-xl w-[50px] h-[50px] flex items-center justify-center cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0.5 shadow-md shadow-[#a855f7]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex-shrink-0"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </footer>
  );
}
