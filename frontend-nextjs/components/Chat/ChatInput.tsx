'use client';

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const quickPrompts = [
    { label: '🌿 Photosynthesis', text: 'What is photosynthesis? Explain step-by-step with chemical equation.' },
    { label: "🍎 Newton's 3 Laws", text: "Explain Newton's three laws of motion with real-life examples." },
    { label: '📊 Graph y = x^2', text: 'Graph y = x^2' },
    { label: '📐 Rectangle Area', text: 'What is the area of a rectangle of length 20 m and width 10 m?' },
    { label: '🇮🇳 हिंदी', text: 'प्रकाश संश्लेषण क्या है?' },
    { label: '🇮🇳 मराठी', text: 'प्रकाश संश्लेषण म्हणजे काय?' },
  ];

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
    <footer className="chat-input-area p-4 px-6 bg-[#121212]/90 border-t border-neutral-850 flex flex-col gap-3">
      {/* Quick Topic Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar text-xs">
        <span className="text-[11px] text-neutral-500 font-medium flex-shrink-0">Quick Topics:</span>
        {quickPrompts.map((chip, i) => (
          <button
            key={i}
            onClick={() => onSend(chip.text)}
            disabled={disabled}
            className="flex-shrink-0 bg-neutral-900 hover:bg-neutral-850 hover:border-neutral-700 text-neutral-200 px-3 py-1 rounded-full border border-neutral-800 transition-all cursor-pointer disabled:opacity-50 text-[11px] font-medium active:scale-95"
          >
            {chip.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Vidya any question in English, Hindi, Marathi, Tamil..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-neutral-900 border border-neutral-800 text-white rounded-2xl p-3.5 px-4 text-sm resize-none outline-none focus:border-neutral-700 focus:bg-neutral-900 focus:ring-2 focus:ring-neutral-700/20 placeholder-neutral-500 transition-all max-h-[150px] leading-relaxed disabled:opacity-50 shadow-inner"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          aria-label="Send message"
          className="bg-white hover:bg-neutral-200 text-black rounded-2xl w-[50px] h-[50px] flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-md shadow-white/5 disabled:opacity-50 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed disabled:transform-none flex-shrink-0"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            stroke="currentColor"
            strokeWidth="2.5"
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
