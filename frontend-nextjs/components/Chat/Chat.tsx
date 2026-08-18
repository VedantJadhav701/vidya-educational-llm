'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ChatMessage, 
  MediaCardItem, 
  BackendStatus, 
  LearningMode, 
  SubjectType, 
  SessionStats 
} from '@/lib/types';
import { sendMessage, checkBackendHealth } from '@/lib/vidya';
import { detectImageQuery, fetchEducationalImage } from '@/lib/image';
import { detectGraphExpr } from '@/lib/graph';
import MessageList from './MessageList';
import MediaPanel from '../Media/MediaPanel';
import { ArrowRight, Plus, RotateCcw, Menu, Globe, Sun, Moon } from 'lucide-react';

export default function Chat() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaCardItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [learningMode, setLearningMode] = useState<LearningMode>('learn');
  const [activeSubject, setActiveSubject] = useState<SubjectType | null>(null);
  
  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Language selector state
  const [lang, setLang] = useState<string>('Auto');

  // Input states
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // New Chat Confirmation Dialog
  const [showConfirm, setShowConfirm] = useState(false);

  // Tools selector dropdown
  const [showTools, setShowTools] = useState(false);

  // Parameter adjustment drawer (student-oriented)
  const [showParams, setShowParams] = useState(false);
  const [expStyle, setExpStyle] = useState<'simple' | 'detailed' | 'exam'>('detailed');
  const [ansLevel, setAnsLevel] = useState<'school' | 'jee' | 'advanced'>('school');

  // Mobile menu drawer
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Failsafe stats
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

  // Suggested questions list
  const suggestedQuestions = [
    "Explain Newton's laws simply",
    "Solve x^2 + 5x + 6 = 0",
    "Explain photosynthesis",
    "What is matrix multiplication?",
    "Explain entropy intuitively",
    "Help me prepare for JEE"
  ];

  // Subject selector options
  const subjects: { id: SubjectType | null; label: string }[] = [
    { id: null, label: 'All Subjects' },
    { id: 'math', label: 'Mathematics' },
    { id: 'physics', label: 'Physics' },
    { id: 'chemistry', label: 'Chemistry' },
    { id: 'biology', label: 'Biology' },
    { id: 'cs', label: 'Computer Science' },
  ];

  // Language options
  const languages = [
    { code: 'Auto', name: 'Auto' },
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हनद' },
    { code: 'mr', name: 'मरठ' },
    { code: 'ta', name: 'தமழ' },
    { code: 'te', name: 'తలग' },
    { code: 'bn', name: 'বল' },
    { code: 'gu', name: 'ગજરત' },
    { code: 'kn', name: 'ಕನನಡ' },
    { code: 'ml', name: 'മലയള' },
    { code: 'pa', name: 'ਪਜਬ' },
    { code: 'mai', name: 'मथल' },
    { code: 'ur', name: 'اردو' }
  ];

  useEffect(() => {
    // Read subject query parameter if present
    const subjectParam = searchParams.get('subject');
    if (subjectParam) {
      const validSubjects: SubjectType[] = ['math', 'physics', 'chemistry', 'biology', 'cs', 'general'];
      if (validSubjects.includes(subjectParam as SubjectType)) {
        setActiveSubject(subjectParam as SubjectType);
      }
    }

    checkBackendHealth().then(setStatus).catch(() => {
      setStatus({ isAvailable: true, isWakingUp: false, message: 'Ready' });
    });
  }, [searchParams]);

  // Handle textarea auto height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

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

    // Check for images
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

    // Check for graphs
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
      // Prepend parameters/style preferences for context
      const styleInstruction = `[Style: ${expStyle}, Level: ${ansLevel}, Language Option: ${lang}]`;
      formattedPrompt = `${styleInstruction} ${formattedPrompt}`;

      if (learningMode === 'practice') {
        formattedPrompt = `[PRACTICE MODE] ${formattedPrompt}`;
      } else if (learningMode === 'revise') {
        formattedPrompt = `[REVISE MODE - Provide quick bullet key facts] ${formattedPrompt}`;
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

      const assistantId = `assistant-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        mode: learningMode,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      let currentLength = 0;
      const interval = setInterval(() => {
        currentLength += Math.floor(Math.random() * 4) + 4;
        if (currentLength >= responseText.length) {
          clearInterval(interval);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content: responseText } : msg
            )
          );
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content: responseText.slice(0, currentLength) }
                : msg
            )
          );
        }
      }, 12);
    } catch (error: unknown) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'system',
        content:
          (error as Error)?.message ||
          'Vidya connection failed. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setMediaItems([]);
    setActiveSubject(null);
    setInput('');
    setShowConfirm(false);
  };

  const handleNewChatRequest = () => {
    if (messages.length > 0) {
      setShowConfirm(true);
    }
  };

  const hasStarted = messages.length > 0;
  const showVisualPanel = mediaItems.length > 0;

  // Floating symbols for Knowledge Core visual
  const knowledgeSymbols = [
    { text: 'Σ', x: '12%', y: '18%', delay: '0s', size: 'text-2xl' },
    { text: 'π', x: '82%', y: '14%', delay: '1.2s', size: 'text-3xl' },
    { text: 'E = mc²', x: '18%', y: '68%', delay: '2.5s', size: 'text-sm' },
    { text: 'F = ma', x: '72%', y: '62%', delay: '3.1s', size: 'text-sm' },
    { text: 'DNA', x: '88%', y: '38%', delay: '1.7s', size: 'text-xs' },
    { text: 'H₂O', x: '8%', y: '42%', delay: '2.8s', size: 'text-sm' },
    { text: 'λ', x: '48%', y: '8%', delay: '0.4s', size: 'text-xl' },
    { text: 'वदय', x: '28%', y: '78%', delay: '3.6s', size: 'text-lg font-bold' },
    { text: 'தமழ', x: '52%', y: '82%', delay: '1.5s', size: 'text-sm font-bold' },
    { text: 'मरठ', x: '22%', y: '12%', delay: '2.1s', size: 'text-sm' },
    { text: 'हनद', x: '68%', y: '78%', delay: '0.9s', size: 'text-base' },
  ];

  return (
    <div className={`w-full min-h-screen flex flex-col transition-colors duration-300 ${theme} ${
      theme === 'dark' ? 'bg-[#0a0a0a] text-neutral-100' : 'bg-[#fbfbf9] text-neutral-900'
    }`}>
      {/* Universal stylesheet overrides for floating visual animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(2deg); }
          }
          .animate-float {
            animation: float 7s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-float {
              animation: none !important;
            }
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(128,128,128,0.2);
            border-radius: 4px;
          }
        `
      }} />

      {/* TOP NAVIGATION HEADER */}
      <nav className="w-full border-b border-neutral-200 dark:border-neutral-850 px-4 sm:px-[70px] h-[65px] flex items-center justify-between z-30 select-none">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-neutral-200 dark:bg-neutral-800 border border-neutral-350 dark:border-neutral-700 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-neutral-600 dark:bg-neutral-300 animate-pulse" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-neutral-800 dark:text-white">
            VIDYA
          </span>
        </div>

        {/* Center Links (Desktop only) */}
        <div className="hidden md:flex items-center gap-6 text-[12px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Build</a>
          <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800">Playground</a>
          <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Model Card</a>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 cursor-pointer">
              <Globe className="w-3.5 h-3.5" />
              <span>{lang}</span>
            </button>
            {/* Dropdown popup */}
            <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-1.5 shadow-xl min-w-[120px] max-h-[220px] overflow-y-auto custom-scrollbar z-50">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.name)}
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-600 dark:text-neutral-300"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* New Chat Reset Button (Visible if active chat) */}
          {hasStarted && (
            <button
              onClick={handleNewChatRequest}
              className="p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-neutral-600 dark:text-neutral-300"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Menu Drawer Trigger */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/60 z-50 md:hidden flex justify-end" onClick={() => setShowMobileMenu(false)}>
          <div className="w-[240px] h-full bg-white dark:bg-neutral-950 p-6 flex flex-col gap-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-850 pb-4">
              <span className="text-[12px] font-black uppercase tracking-widest text-neutral-800 dark:text-white">Menu</span>
              <button className="text-xs hover:underline cursor-pointer" onClick={() => setShowMobileMenu(false)}>Close</button>
            </div>
            <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white py-1">Build</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white py-1 text-neutral-900 dark:text-white">Playground</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white py-1">Model Card</a>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER WORKSPACE */}
      <div className="flex-1 w-full flex flex-col md:flex-row relative overflow-hidden">
        
        {/* Left Column: Chat Conversation */}
        <div className={`flex-1 flex flex-col h-full overflow-hidden relative z-10 transition-all ${
          showVisualPanel ? 'md:flex-[1.4] lg:flex-[1.6]' : 'w-full max-w-[850px] mx-auto'
        }`}>
          
          {/* Chat Mode header */}
          {hasStarted && (
            <div className="px-6 py-2 bg-neutral-50/50 dark:bg-neutral-900/10 border-b border-neutral-200 dark:border-neutral-850 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Mode:</span>
                <span className="font-bold uppercase tracking-wider text-neutral-800 dark:text-white bg-neutral-100 dark:bg-neutral-850 px-2 py-0.5 rounded border border-neutral-250 dark:border-neutral-800">
                  {learningMode}
                </span>
                {activeSubject && (
                  <span className="font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-850 px-2 py-0.5 rounded border border-neutral-250 dark:border-neutral-800">
                    {activeSubject}
                  </span>
                )}
              </div>
              <button
                onClick={handleNewChatRequest}
                className="text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                New Chat 🔄
              </button>
            </div>
          )}

          {/* Main workspace display body */}
          {!hasStarted ? (
            /* LANDING COMPOSER VIEW */
            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-center text-center relative max-w-[680px] mx-auto w-full custom-scrollbar">
              
              {/* Floating Symbols Background */}
              <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
                {knowledgeSymbols.map((sym, i) => (
                  <span
                    key={i}
                    className={`absolute text-neutral-300/40 dark:text-neutral-800/30 ${sym.size} font-mono animate-float`}
                    style={{
                      left: sym.x,
                      top: sym.y,
                      animationDelay: sym.delay,
                      animationDuration: '9s',
                    }}
                  >
                    {sym.text}
                  </span>
                ))}
              </div>

              {/* Title Section */}
              <div className="relative z-10 mb-8 mt-auto">
                <h1 className="text-4xl sm:text-5xl font-black tracking-[0.25em] text-neutral-800 dark:text-white uppercase mb-3">
                  VIDYA
                </h1>
                <p className="text-sm font-semibold uppercase tracking-[0.1em] text-neutral-500 dark:text-neutral-400 mb-1">
                  Welcome to Vidya
                </p>
                <p className="text-xs sm:text-sm text-neutral-400 dark:text-neutral-500 font-medium italic">
                  "Learn deeper. Understand better."
                </p>
              </div>

              {/* Suggestions Grid */}
              <div className="relative z-10 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 max-w-[500px]">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="p-3.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-2xl hover:border-neutral-300 dark:hover:border-neutral-700 text-left transition-all cursor-pointer shadow-sm active:scale-98"
                  >
                    <div className="font-bold text-xs text-neutral-800 dark:text-neutral-200">{q}</div>
                    <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Explore educational fact</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* CONVERSATION CHAT MODE */
            <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
              <div className="max-w-[760px] mx-auto w-full">
                <MessageList
                  messages={messages}
                  isTyping={isProcessing}
                  onQuickPrompt={handleSendMessage}
                />
              </div>
            </div>
          )}

          {/* COMPOSER PANEL */}
          <div className="w-full px-4 sm:px-6 pb-6 pt-2 bg-gradient-to-t from-[#fbfbf9] via-[#fbfbf9] to-transparent dark:from-[#0a0a0a] dark:via-[#0a0a0a] dark:to-transparent">
            <div className="max-w-[760px] mx-auto w-full flex flex-col gap-3">
              
              {/* Subject Context Selector */}
              {!hasStarted && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold uppercase tracking-wider custom-scrollbar select-none">
                  {subjects.map((sub) => (
                    <button
                      key={sub.id || 'all'}
                      onClick={() => setActiveSubject(sub.id)}
                      className={`flex-shrink-0 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        activeSubject === sub.id
                          ? 'bg-neutral-800 dark:bg-white text-white dark:text-black border-neutral-800 dark:border-white shadow-sm'
                          : 'bg-white dark:bg-neutral-900 text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-850 hover:text-neutral-800 dark:hover:text-neutral-300'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Large Premium Input Composer Container */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl p-3 flex flex-col gap-3 shadow-md focus-within:border-neutral-400 dark:focus-within:border-neutral-700 focus-within:ring-2 focus-within:ring-neutral-250 dark:focus-within:ring-neutral-800/20 transition-all">
                {/* Textarea Input */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(input);
                      setInput('');
                    }
                  }}
                  placeholder="Ask Vidya anything... (Enter to send, Shift+Enter for newline)"
                  rows={2}
                  disabled={isProcessing}
                  className="w-full bg-transparent text-sm resize-none outline-none leading-relaxed text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 disabled:opacity-50 min-h-[50px] max-h-[180px] custom-scrollbar"
                />

                {/* Composer Actions and controls bar */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-850/50">
                  {/* Left: Tools button (+) */}
                  <div className="relative">
                    <button
                      onClick={() => setShowTools(!showTools)}
                      className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-pointer border border-neutral-200 dark:border-neutral-800 transition-colors flex items-center justify-center"
                      title="Tools"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    {showTools && (
                      <div className="absolute left-0 bottom-full mb-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl py-1.5 shadow-xl min-w-[150px] z-50">
                        <button
                          onClick={() => {
                            setInput(prev => prev + " Show a graph of ");
                            setShowTools(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-neutral-800 dark:text-neutral-200"
                        >
                          📈 Graph Expression
                        </button>
                        <button
                          onClick={() => {
                            setInput(prev => prev + " Show an image of ");
                            setShowTools(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-neutral-800 dark:text-neutral-200"
                        >
                          🖼️ Educational Image
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Controls: Parameters Toggle & Send Button */}
                  <div className="flex items-center gap-2">
                    {/* Student Parameters toggle */}
                    <button
                      onClick={() => setShowParams(!showParams)}
                      className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-850 hover:bg-neutral-100 dark:hover:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-pointer"
                    >
                      Params
                    </button>

                    {/* Send Button */}
                    <button
                      onClick={() => {
                        handleSendMessage(input);
                        setInput('');
                      }}
                      disabled={isProcessing || !input.trim()}
                      className="bg-neutral-850 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 px-4 py-1.5 rounded-xl font-bold text-xs uppercase transition-all duration-300 disabled:opacity-50 disabled:bg-neutral-200 dark:disabled:bg-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-600 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      <span>Send</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expose parameters picker panel if active */}
                {showParams && (
                  <div className="mt-2 pt-3 border-t border-neutral-100 dark:border-neutral-850/50 flex flex-wrap gap-4 text-xs select-none">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">Explanation Style</span>
                      <div className="flex gap-1">
                        {['simple', 'detailed', 'exam'].map((style) => (
                          <button
                            key={style}
                            onClick={() => setExpStyle(style as 'simple' | 'detailed' | 'exam')}
                            className={`px-2 py-1 rounded border text-[10px] uppercase font-bold cursor-pointer transition-colors ${
                              expStyle === style 
                                ? 'bg-neutral-800 dark:bg-white text-white dark:text-black border-neutral-800 dark:border-white' 
                                : 'bg-neutral-100 dark:bg-neutral-850 text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase">Target Level</span>
                      <div className="flex gap-1">
                        {['school', 'jee', 'advanced'].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setAnsLevel(lvl as 'school' | 'jee' | 'advanced')}
                            className={`px-2 py-1 rounded border text-[10px] uppercase font-bold cursor-pointer transition-colors ${
                              ansLevel === lvl 
                                ? 'bg-neutral-800 dark:bg-white text-white dark:text-black border-neutral-800 dark:border-white' 
                                : 'bg-neutral-100 dark:bg-neutral-850 text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Visual Learning Panel (only renders if media is present) */}
        {showVisualPanel && (
          <div className="w-full md:w-auto md:flex-1 h-[calc(100vh-65px)] border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-850 bg-neutral-50/30 dark:bg-neutral-900/10 flex flex-col z-20 overflow-hidden">
            <MediaPanel items={mediaItems} onSelectFormula={handleSendMessage} />
          </div>
        )}

      </div>

      {/* CONFIRMATION DIALOG MODAL FOR RESETTING CHAT */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="w-full max-w-[360px] bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-2xl p-5 shadow-2xl animate-scaleIn">
            <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100 mb-2">
              Start a new conversation?
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mb-5">
              This will clear your current learning history, session stats, and formulas. You cannot undo this.
            </p>
            <div className="flex items-center justify-end gap-2 text-xs font-bold">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleClearChat}
                className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-850 dark:hover:bg-neutral-100 rounded-xl transition-all cursor-pointer"
              >
                New Chat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
