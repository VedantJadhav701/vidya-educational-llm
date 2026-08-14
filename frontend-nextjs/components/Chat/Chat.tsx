'use client';

import { useState, useEffect } from 'react';
import { ChatMessage, MediaCardItem, BackendStatus, LearningMode, SubjectType, SessionStats } from '@/lib/types';
import { sendMessage, checkBackendHealth } from '@/lib/vidya';
import { detectImageQuery, fetchEducationalImage } from '@/lib/image';
import { detectGraphExpr } from '@/lib/graph';
import Navbar from '../Header/Navbar';
import KnowledgeOrbit from '../Landing/KnowledgeOrbit';
import SubjectCards from '../Landing/SubjectCards';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import MediaPanel from '../Media/MediaPanel';

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaCardItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [learningMode, setLearningMode] = useState<LearningMode>('learn');
  const [activeSubject, setActiveSubject] = useState<SubjectType | null>(null);

  const [stats, setStats] = useState<SessionStats>({
    questionsAsked: 0,
    topicsExplored: 0,
    activeMode: 'learn',
  });

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
      mode: learningMode,
      subject: activeSubject || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);
    setStats((prev) => ({
      ...prev,
      questionsAsked: prev.questionsAsked + 1,
      topicsExplored: prev.topicsExplored + (activeSubject ? 1 : 0),
    }));

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

    try {
      // Prepend learning mode context if set
      let formattedPrompt = text;
      if (learningMode === 'practice') {
        formattedPrompt = `[PRACTICE MODE] ${text}`;
      } else if (learningMode === 'revise') {
        formattedPrompt = `[REVISE MODE - Provide quick bullet key facts] ${text}`;
      }

      const responseText = await sendMessage(formattedPrompt, messages);

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
        mode: learningMode,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error: unknown) {
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

  const handleSelectSubject = (subject: SubjectType, prompt: string) => {
    setActiveSubject(subject);
    handleSendMessage(prompt);
  };

  const handleClearChat = () => {
    setMessages([]);
    setMediaItems([]);
    setActiveSubject(null);
  };

  const hasStarted = messages.length > 0;

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#070a14] text-[#f1f5f9] font-sans antialiased overflow-x-hidden">
      {/* Header Navbar */}
      <Navbar
        currentMode={learningMode}
        onModeChange={setLearningMode}
        status={status}
        stats={stats}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 w-full max-w-[1536px] mx-auto p-4 flex flex-col lg:flex-row gap-5 h-[calc(100vh-65px)]">
        {/* Left / Center Chat & Hero Column */}
        <div className="flex-[2] h-full bg-[#0b0f19]/80 backdrop-blur-md border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
          {/* Header Action Bar */}
          {hasStarted && (
            <div className="px-5 py-3 border-b border-white/10 bg-[#1e293b]/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#94a3b8] font-medium">Active Mode:</span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#a855f7] bg-[#a855f7]/10 px-2 py-0.5 rounded border border-[#a855f7]/20">
                  {learningMode}
                </span>
                {activeSubject && (
                  <span className="text-xs font-bold uppercase tracking-wider text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded border border-[#38bdf8]/20">
                    {activeSubject}
                  </span>
                )}
              </div>
              <button
                onClick={handleClearChat}
                className="px-3 py-1 text-xs text-[#94a3b8] hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all cursor-pointer"
              >
                Reset Lab 🔄
              </button>
            </div>
          )}

          {/* Hero Landing State OR Message List */}
          {!hasStarted ? (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center custom-scrollbar animate-fadeIn">
              {/* Heading Banner */}
              <div className="mb-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  VIDYA
                </h1>
                <p className="text-sm font-semibold bg-gradient-to-r from-[#38bdf8] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                  Your Intelligent Interactive Learning Companion
                </p>
              </div>

              {/* Interactive Knowledge Orbit */}
              <KnowledgeOrbit onSelectPrompt={handleSendMessage} />

              {/* Subject Selector Cards */}
              <SubjectCards onSelectSubject={handleSelectSubject} />
            </div>
          ) : (
            <MessageList
              messages={messages}
              isTyping={isProcessing}
              onQuickPrompt={handleSendMessage}
            />
          )}

          {/* Chat Input Area */}
          <ChatInput onSend={handleSendMessage} disabled={isProcessing} />
        </div>

        {/* Right Visual Learning Side Panel */}
        <MediaPanel items={mediaItems} onSelectFormula={handleSendMessage} />
      </div>
    </div>
  );
}
