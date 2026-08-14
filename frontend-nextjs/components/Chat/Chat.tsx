'use client';

import { useState, useEffect } from 'react';
import { ChatMessage, MediaCardItem, BackendStatus } from '@/lib/types';
import { sendMessage, checkBackendHealth } from '@/lib/vidya';
import { detectImageQuery, fetchEducationalImage } from '@/lib/image';
import { detectGraphExpr } from '@/lib/graph';
import ModelStatus from '../ModelStatus';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import MediaPanel from '../Media/MediaPanel';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        "Namaste! I am Vidya 1.7B, your multilingual NCERT educational AI companion.\n\nAsk me anything in Science, Mathematics, or school concepts across 11 Indian languages!",
      timestamp: 0,
    },
  ]);

  const [mediaItems, setMediaItems] = useState<MediaCardItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [typingText, setTypingText] = useState('Thinking...');
  const [status, setStatus] = useState<BackendStatus>({
    isAvailable: true,
    isWakingUp: false,
    message: 'Vidya is online',
  });

  useEffect(() => {
    checkBackendHealth().then(setStatus).catch(() => {
      setStatus({ isAvailable: true, isWakingUp: false, message: 'Ready' });
    });
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    const now = Date.now();
    const userMsg: ChatMessage = {
      id: `user-${now}`,
      role: 'user',
      content: text,
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setTypingText('Thinking...');

    // Failsafe image request check
    const imgQuery = detectImageQuery(text);
    if (imgQuery) {
      fetchEducationalImage(imgQuery).then((imgRes) => {
        if (imgRes.url) {
          setMediaItems((prev) => [
            {
              id: `img-${Date.now()}`,
              type: 'image',
              title: imgRes.title || `Image: ${imgQuery}`,
              url: imgRes.url,
              isWikiImage: true,
              timestamp: Date.now(),
            },
            ...prev,
          ]);
        }
      });
    }

    // Failsafe graph request check
    const graphExpr = detectGraphExpr(text);
    if (graphExpr) {
      setMediaItems((prev) => [
        {
          id: `graph-${Date.now()}`,
          type: 'graph',
          title: `Graph of: ${graphExpr}`,
          expr: graphExpr,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    }

    // Simulated thinking -> analyzing progression
    const timer = setTimeout(() => {
      setTypingText('Analyzing...');
    }, 1000);

    try {
      const responseText = await sendMessage(text, messages);
      clearTimeout(timer);

      // Check if AI response contains an image or graph tag
      const aiImgQuery = detectImageQuery(text, responseText);
      if (aiImgQuery && aiImgQuery !== imgQuery) {
        fetchEducationalImage(aiImgQuery).then((imgRes) => {
          if (imgRes.url) {
            setMediaItems((prev) => [
              {
                id: `img-${Date.now()}`,
                type: 'image',
                title: imgRes.title || `Image: ${aiImgQuery}`,
                url: imgRes.url,
                isWikiImage: true,
                timestamp: Date.now(),
              },
              ...prev,
            ]);
          }
        });
      }

      const aiGraphExpr = detectGraphExpr(text, responseText);
      if (aiGraphExpr && aiGraphExpr !== graphExpr) {
        setMediaItems((prev) => [
          {
            id: `graph-${Date.now()}`,
            type: 'graph',
            title: `Graph of: ${aiGraphExpr}`,
            expr: aiGraphExpr,
            timestamp: Date.now(),
          },
          ...prev,
        ]);
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: responseText || 'I am ready to help you.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: unknown) {
      clearTimeout(timer);
      console.error('Chat error:', error);

      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'system',
        content:
          (error as Error)?.message ||
          'Vidya encountered a temporary issue. Please verify backend connection and try again.',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        content:
          "Namaste! I am Vidya 1.7B, your multilingual NCERT educational AI companion.\n\nAsk me anything in Science, Mathematics, or school concepts across 11 Indian languages!",
        timestamp: 0,
      },
    ]);
    setMediaItems([]);
  };

  return (
    <div className="app-container w-full max-w-[1440px] h-[95vh] flex gap-5 m-auto p-4">
      <div className="chat-container flex-[2] h-full bg-[#1e293b]/70 backdrop-blur-md border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <ModelStatus status={status} />
          </div>
          {messages.length > 1 && (
            <button
              onClick={handleClearChat}
              className="mr-5 px-3 py-1.5 text-xs text-[#94a3b8] hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all cursor-pointer font-medium"
            >
              Clear Chat
            </button>
          )}
        </div>

        <MessageList
          messages={messages}
          isTyping={isProcessing}
          typingText={typingText}
          onQuickPrompt={handleSendMessage}
        />

        <ChatInput onSend={handleSendMessage} disabled={isProcessing} />
      </div>

      <MediaPanel items={mediaItems} onSelectFormula={handleSendMessage} />
    </div>
  );
}
