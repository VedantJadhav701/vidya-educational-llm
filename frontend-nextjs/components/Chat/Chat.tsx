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

  // Mobile View Tab: 'chat' | 'visuals'
  const [mobileTab, setMobileTab] = useState<'chat' | 'visuals'>('chat');

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
    // On mobile, switch to chat tab when sending
    setMobileTab('chat');

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
      let formattedPrompt = text;
      if (learningMode === 'practice') {
        formattedPrompt = `[PRACTICE MODE] ${text}`;
      } else if (learningMode === 'revise') {
        formattedPrompt = `[REVISE MODE - Provide quick bullet key facts] ${text}`;
      }

      const responseText = await sendMessage(formattedPrompt, messages);

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

      {/* Mobile Screen Composition Selector (< 1024px) */}
      <div className="lg:hidden px-4 pt-3 flex gap-2">
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mobileTab === 'chat'
              ? 'bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white shadow-lg'
              : 'bg-white/5 text-[#94a3b8] hover:text-white border border-white/10'
          }`}
        >
          💬 Learning Chat
        </button>

        <button
          onClick={() => setMobileTab('visuals')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            mobileTab === 'visuals'
              ? 'bg-gradient-to-r from-[#38bdf8] to-[#6366f1] text-white shadow-lg'
              : 'bg-white/5 text-[#94a3b8] hover:text-white border border-white/10'
          }`}
        >
          🔬 Visual Lab &amp; Formulas
          {mediaItems.length > 0 && (
            <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded-full font-mono">
              {mediaItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Responsive Workspace Layout */}
      <div className="flex-1 w-full max-w-[1536px] mx-auto p-3 sm:p-4 flex flex-col lg:flex-row gap-4 lg:gap-5 h-[calc(100vh-65px)] overflow-hidden">
        {/* Left / Main Chat & Landing Column */}
        <div
          className={`flex-[2] h-full bg-[#0b0f19]/80 backdrop-blur-md border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative ${
            mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Header Action Bar */}
          {hasStarted && (
            <div className="px-4 py-2.5 border-b border-white/10 bg-[#1e293b]/40 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
                <span className="text-xs text-[#94a3b8] font-medium hidden sm:inline">Active Mode:</span>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#a855f7] bg-[#a855f7]/10 px-2 py-0.5 rounded border border-[#a855f7]/20 flex-shrink-0">
                  {learningMode}
                </span>
                {activeSubject && (
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#38bdf8] bg-[#38bdf8]/10 px-2 py-0.5 rounded border border-[#38bdf8]/20 flex-shrink-0">
                    {activeSubject}
                  </span>
                )}
              </div>
              <button
                onClick={handleClearChat}
                className="px-2.5 py-1 text-xs text-[#94a3b8] hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all cursor-pointer font-medium flex-shrink-0"
              >
                Reset Lab 🔄
              </button>
            </div>
          )}

          {/* Hero Landing State OR Message List */}
          {!hasStarted ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col items-center justify-center text-center custom-scrollbar animate-fadeIn">
              {/* Heading Banner */}
              <div className="mb-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                  VIDYA
                </h1>
                <p className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#38bdf8] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent px-2">
                  Your Intelligent Interactive Learning Companion
                </p>
              </div>

              {/* Interactive Knowledge Orbit */}
              <div className="w-full overflow-hidden scale-90 sm:scale-100">
                <KnowledgeOrbit onSelectPrompt={handleSendMessage} />
              </div>

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

        {/* Right / Visual Learning Column */}
        <div
          className={`flex-1 h-full ${
            mobileTab === 'visuals' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <MediaPanel items={mediaItems} onSelectFormula={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
