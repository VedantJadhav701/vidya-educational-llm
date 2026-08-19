'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Cpu, BookOpen, Layers, Award, ShieldCheck, Sparkles, Globe, BarChart3, Zap, GraduationCap } from 'lucide-react';

export default function Home() {
  const [onlineCount, setOnlineCount] = useState<number>(8);
  const [totalLessons, setTotalLessons] = useState<number>(1420);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          if (typeof data.onlineUsers === 'number') setOnlineCount(data.onlineUsers);
          if (typeof data.totalQuestions === 'number') setTotalLessons(data.totalQuestions);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Supported languages from README.md
  const supportedLanguages = [
    { lang: 'English', script: 'Latin', flag: '🇬🇧' },
    { lang: 'Hindi', script: 'Devanagari', flag: '🇮🇳' },
    { lang: 'Marathi', script: 'Devanagari', flag: '🇮🇳' },
    { lang: 'Maithili', script: 'Devanagari', flag: '🇮🇳' },
    { lang: 'Tamil', script: 'Tamil', flag: '🇮🇳' },
    { lang: 'Telugu', script: 'Telugu', flag: '🇮🇳' },
    { lang: 'Bengali', script: 'Bengali', flag: '🇮🇳' },
    { lang: 'Gujarati', script: 'Gujarati', flag: '🇮🇳' },
    { lang: 'Kannada', script: 'Kannada', flag: '🇮🇳' },
    { lang: 'Malayalam', script: 'Malayalam', flag: '🇮🇳' },
    { lang: 'Punjabi', script: 'Gurmukhi', flag: '🇮🇳' },
  ];

  // Benchmark stats from README.md
  const benchmarkStats = [
    { domain: 'Chemistry 🧪', score: '99.4%', status: 'Near Perfect' },
    { domain: 'Physics ⚛️', score: '95.6%', status: 'Exceptional' },
    { domain: 'Biology 🧬', score: '95.6%', status: 'Exceptional' },
    { domain: 'Mathematics 📐', score: '82.5%', status: 'Good Reasoning' },
  ];

  return (
    <main className="w-full min-h-screen bg-black text-white relative font-sans select-none selection:bg-white/10 selection:text-white overflow-x-hidden">
      
      {/* ────────────────────────────────────────────────────────
          SECTION 1: ANIMATED HERO (AUTHENTIC VIDYA CONTENT)
          ──────────────────────────────────────────────────────── */}
      <section className="relative w-full h-screen min-h-[680px] max-h-[1080px] flex flex-col justify-between z-10 overflow-hidden bg-black p-4 sm:p-6 lg:p-8 select-none">
        {/* EXACT BACKGROUND VIDEO LAYER */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-80"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
              type="video/mp4"
            />
          </video>
          {/* Subtle vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>

        {/* 1) HEADER NAVIGATION */}
        <header className="relative z-20 w-full max-w-[760px] mx-auto flex items-center justify-between gap-3 animate-headline" style={{ animationDelay: '0.05s' }}>
          {/* Logo Circle */}
          <Link href="/" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.16)] hover:scale-105 transition-transform flex-shrink-0">
            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-black">
              V
            </div>
          </Link>

          {/* White Nav Pill */}
          <nav className="flex-1 max-w-[500px] h-11 sm:h-12 bg-white rounded-full px-3 py-1 flex items-center justify-around shadow-[0_4px_14px_rgba(0,0,0,0.16)] text-[#2e2e2e] text-xs sm:text-sm font-medium">
            <a href="#" className="font-semibold text-black relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-black after:rounded-full">Home</a>
            <a href="#benchmark" className="opacity-60 hover:opacity-100 transition-opacity hidden sm:inline">Benchmark</a>
            <a href="#features" className="opacity-60 hover:opacity-100 transition-opacity hidden md:inline">Features</a>
            <a href="#creator" className="opacity-60 hover:opacity-100 transition-opacity hidden sm:inline">Creator</a>
            <Link href="/focus" className="opacity-80 hover:opacity-100 font-bold transition-opacity text-purple-700">Focus Lab</Link>
            <Link href="/playground" className="opacity-80 hover:opacity-100 transition-opacity font-bold">Playground</Link>
          </nav>

          {/* Model Card Pill */}
          <a
            href="https://huggingface.co/vedantjadhav701/edu-qwen-1.7b-merged"
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 sm:h-12 px-4 rounded-full bg-[#28282a] hover:bg-[#323234] text-[#c8c8c8] hover:text-white text-xs sm:text-sm font-medium flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.16)] transition-all hover:-translate-y-0.5 flex-shrink-0 hidden sm:flex"
          >
            Model Card
          </a>
        </header>

        {/* 2) HERO COPY & CTA */}
        <div className="relative z-20 w-full max-w-[920px] mx-auto text-center flex flex-col items-center justify-center my-auto py-4">
          
          {/* Trust Row / Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#28282a] border border-white/30 text-xs font-medium text-amber-300 mb-5 animate-headline" style={{ animationDelay: '0.1s' }}>
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Vidya 1.7B Educational Benchmark: 93.3% Accuracy</span>
          </div>

          {/* Headline (BubbledotICG-FinePos Retro Dot-Matrix Display Font) */}
          <h1 className="font-display font-normal text-white text-3xl sm:text-6xl lg:text-7xl tracking-[-0.04em] leading-[1.1] uppercase mb-4 max-w-[900px] animate-headline" style={{ animationDelay: '0.2s' }}>
            <span className="block">VIDYA EDUCATIONAL LLM</span>
            <span className="block text-[#38bdf8]">11 INDIAN LANGUAGES</span>
          </h1>

          {/* Subhead */}
          <p className="text-xs sm:text-base text-[#d0d0d0]/90 max-w-[600px] leading-relaxed mb-6 font-normal animate-headline" style={{ animationDelay: '0.3s' }}>
            An open-source NCERT-focused educational AI companion powered by a fine-tuned 1.7B model (<code className="text-amber-300">vedantjadhav701/edu-qwen-1.7b-merged</code>).
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 animate-headline" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:scale-[1.03] hover:-translate-y-0.5 transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_0_22px_rgba(255,255,255,0.32),0_0_44px_rgba(255,255,255,0.12)] active:scale-98"
            >
              <span>Launch Vidya Playground</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>

            <Link
              href="/focus"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#28282a] hover:bg-[#323234] text-white font-medium text-xs sm:text-sm border border-white/20 transition-all hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Try Focus Lab</span>
            </Link>
          </div>
        </div>

        {/* 3) STATS FOOTER (REAL README METRICS) */}
        <div className="relative z-20 w-full max-w-[920px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-white/10 pt-4 animate-headline" style={{ animationDelay: '0.5s' }}>
          {/* Stat 1 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="font-display text-white text-lg sm:text-2xl text-emerald-400">%</span>
              <span className="text-white text-base sm:text-xl font-bold tracking-tight font-mono">93.3</span>
              <span className="text-white text-xs font-mono">%</span>
            </div>
            <span className="text-[#8e8e8e] text-[10px] sm:text-xs uppercase font-medium tracking-wider mt-0.5">Benchmark Accuracy</span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-white text-lg sm:text-2xl text-[#38bdf8]">#</span>
              <span className="text-white text-base sm:text-xl font-bold tracking-tight font-mono">1.7</span>
              <span className="text-white text-xs font-mono">B</span>
            </div>
            <span className="text-[#8e8e8e] text-[10px] sm:text-xs uppercase font-medium tracking-wider mt-0.5">Parameters Fine-Tuned</span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="font-display text-white text-lg sm:text-2xl text-purple-400">*</span>
              <span className="text-white text-base sm:text-xl font-bold tracking-tight font-mono">11</span>
            </div>
            <span className="text-[#8e8e8e] text-[10px] sm:text-xs uppercase font-medium tracking-wider mt-0.5">Indian Languages</span>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="font-display text-white text-lg sm:text-2xl text-pink-400">#</span>
              <span className="text-white text-base sm:text-xl font-bold tracking-tight font-mono">{totalLessons}</span>
            </div>
            <span className="text-[#8e8e8e] text-[10px] sm:text-xs uppercase font-medium tracking-wider mt-0.5">Lessons Served</span>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 2: MULTILINGUAL BENCHMARK REPORT (v1.0)
          ──────────────────────────────────────────────────────── */}
      <section id="benchmark" className="relative w-full py-24 px-4 sm:px-[70px] bg-black border-t border-neutral-900">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6">
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mb-3">
              01 / EVALUATION SUITE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              Multilingual Educational Benchmark (v1.0)
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-6">
              Vidya 1.7B was benchmarked using the <strong className="text-white">Vidya Multilingual Educational Evaluation Suite</strong> across 64 evaluation questions, 8 writing systems, and 4 STEM domains (Mathematics, Physics, Chemistry, Biology).
            </p>
            
            <div className="space-y-3 mb-6">
              {benchmarkStats.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{item.domain}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-emerald-400">{item.score}</span>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 p-8 bg-neutral-900/40 border border-neutral-800 rounded-3xl backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-black uppercase tracking-wider text-white">BENCHMARK PERFORMANCE SUMMARY</h3>
            </div>
            
            <blockquote className="border-l-2 border-amber-400 pl-4 py-2 italic text-neutral-300 text-sm mb-6">
              "Vidya achieves an overall accuracy of 93.3% (9.33 / 10) across NCERT STEM evaluation datasets, with near-perfect chemical equation solving (99.4%)."
            </blockquote>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
                <span className="block text-3xl font-black text-emerald-400">93.3%</span>
                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block mt-1">Overall Accuracy</span>
              </div>
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl">
                <span className="block text-3xl font-black text-blue-400">97.5%</span>
                <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider block mt-1">English Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 3: AUTHENTIC KEY FEATURES FROM README.MD
          ──────────────────────────────────────────────────────── */}
      <section id="features" className="relative w-full py-24 px-4 sm:px-[70px] bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mb-3">
              02 / SYSTEM FEATURES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Vidya Core Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-[550px] mx-auto leading-relaxed">
              Every feature is built specifically for Indian curriculum requirements, zero translation fallbacks, and mathematical precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-8 bg-neutral-900/30 border border-neutral-800 hover:border-neutral-700 rounded-3xl backdrop-blur-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider text-white mb-3">11 Supported Indian Languages</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Native fluency in English, Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Punjabi, and Maithili.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-neutral-900/30 border border-neutral-800 hover:border-neutral-700 rounded-3xl backdrop-blur-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider text-white mb-3">Language Purity & Zero Fallback</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Answers strictly in the user's selected language and native writing script without defaulting back to English or Hindi.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-neutral-900/30 border border-neutral-800 hover:border-neutral-700 rounded-3xl backdrop-blur-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider text-white mb-3">Interactive Canvas Graphing</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Safe client-side mathematical graph plotting (e.g. y = x², sin(x)) rendered dynamically without server-side compute overhead.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 bg-neutral-900/30 border border-neutral-800 hover:border-neutral-700 rounded-3xl backdrop-blur-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider text-white mb-3">Visual Reference Panel</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Auto-fetches educational diagrams and science images directly from the Wikipedia API based on the lesson context.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 bg-neutral-900/30 border border-neutral-800 hover:border-neutral-700 rounded-3xl backdrop-blur-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/25 flex items-center justify-center text-pink-400 mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider text-white mb-3">ZeroGPU Cloud Backend</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Deployed on Hugging Face Spaces with dynamic GPU allocation for rapid response streaming and zero idle costs.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 bg-neutral-900/30 border border-neutral-800 hover:border-neutral-700 rounded-3xl backdrop-blur-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/25 flex items-center justify-center text-[#38bdf8] mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider text-white mb-3">Clean Output (No CoT Leakage)</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Internal reasoning tokens (&lt;think&gt;) are filtered out, leaving clean, structured answers for the student.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 4: SUPPORTED LANGUAGES GRID (FROM README.MD)
          ──────────────────────────────────────────────────────── */}
      <section className="relative w-full py-24 px-4 sm:px-[70px] bg-black border-t border-neutral-900">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mb-3">
              03 / MULTILINGUAL COVERAGE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Supported Languages &amp; Writing Systems
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-[500px] mx-auto leading-relaxed">
              Vidya directly understands and writes in 8 major Indian writing systems across 11 languages.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {supportedLanguages.map((item, idx) => (
              <div key={idx} className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="block font-bold text-sm text-white">{item.lang}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">{item.script} Script</span>
                </div>
                <span className="text-xl">{item.flag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 4: CREATOR / DEVELOPER PROFILE (VEDANT JADHAV)
          ──────────────────────────────────────────────────────── */}
      <section id="creator" className="relative w-full py-24 px-4 sm:px-[70px] bg-neutral-950 border-t border-neutral-900 overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mb-8">
            04 / CREATOR &amp; ARCHITECTURE
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* LEFT COLUMN: CREATOR PROFILE */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Header with Typographic Identity Badge */}
              <div className="flex items-center gap-4">
                {/* Typographic Badge VJ */}
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/15 flex items-center justify-center shadow-xl group flex-shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-50 blur-sm group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 font-display text-2xl font-bold tracking-wider text-white">
                    VJ
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Vedant Jadhav
                  </h2>
                  <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mt-0.5">
                    Machine Learning Engineer • AI / LLM Researcher • Co-Founder
                  </p>
                </div>
              </div>

              {/* Education Subtext */}
              <div className="flex items-center gap-2 text-xs text-neutral-300 bg-neutral-900/80 px-3.5 py-2 rounded-xl border border-neutral-800 self-start">
                <GraduationCap className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span>B.Tech in Artificial Intelligence &amp; Machine Learning — Pimpri Chinchwad University, Pune</span>
              </div>

              {/* Profile Copy */}
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-normal">
                "Vedant Jadhav is a Machine Learning Engineer and AI/LLM researcher focused on building practical intelligent systems across language, education, and machine learning."
              </p>
              
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                His work spans language models, multilingual AI, domain-specific LLMs, LLM evaluation, RAG, agentic AI, and machine learning systems.
              </p>

              {/* Currently Building: VIDYA */}
              <div className="p-5 rounded-2xl bg-neutral-900/50 border border-neutral-800 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    CURRENTLY BUILDING
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white tracking-wider">VIDYA</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  "An educational AI designed to make AI-assisted learning more accessible to Indian students through multilingual education, mathematical reasoning, science, and NCERT-oriented learning."
                </p>
              </div>

              {/* Areas of Work Compact Tags */}
              <div className="flex flex-wrap gap-2 pt-1">
                {['LLMs', 'SLMs', 'Multilingual AI', 'RAG', 'Agentic AI', 'Machine Learning', 'Deep Learning', 'LLM Evaluation'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-300 hover:text-white hover:border-white/25 transition-all select-none"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Social Links (Exact URLs provided) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="https://github.com/VedantJadhav701/vidya-educational-llm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all cursor-pointer shadow-md"
                >
                  <i className="fa-brands fa-github text-sm" />
                  <span>GitHub Profile</span>
                </a>

                <a
                  href="https://in.linkedin.com/in/vedantjadhav-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold border border-blue-500/30 transition-all cursor-pointer shadow-md"
                >
                  <i className="fa-brands fa-linkedin text-sm text-blue-400" />
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: ARCHITECTURE VISUALIZATION */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[440px] p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800 flex flex-col gap-4 relative overflow-hidden backdrop-blur-md">
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-3 flex items-center justify-between">
                  <span>VIDYA ARCHITECTURE FLOW</span>
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                </div>

                {/* Vertical Interactive Node Flow */}
                <div className="flex flex-col gap-3 relative">
                  {[
                    { title: 'Research', desc: 'Pedagogical LLM alignment & benchmarks', color: 'from-blue-500 to-cyan-500' },
                    { title: 'Language Models', desc: '1.7B Parameter fine-tuning & SLMs', color: 'from-purple-500 to-indigo-500' },
                    { title: 'Multilingual Intelligence', desc: '11 Indian languages & zero-fallback', color: 'from-pink-500 to-rose-500' },
                    { title: 'Educational AI', desc: 'LaTeX math, canvas plots & NCERT core', color: 'from-amber-500 to-yellow-500' },
                    { title: 'VIDYA', desc: 'Production AI Ecosystem for Students', color: 'from-emerald-400 to-teal-500', isHighlight: true },
                  ].map((node, index) => (
                    <div
                      key={index}
                      className={`p-3.5 rounded-2xl border transition-all hover:scale-[1.02] flex items-center justify-between ${
                        node.isHighlight
                          ? 'bg-gradient-to-r from-emerald-500/20 via-neutral-900 to-teal-500/20 border-emerald-500/40 shadow-lg'
                          : 'bg-neutral-950 border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${node.color} animate-pulse flex-shrink-0`} />
                        <div>
                          <h4 className={`text-xs font-extrabold uppercase tracking-wider ${node.isHighlight ? 'text-emerald-400' : 'text-white'}`}>
                            {node.title}
                          </h4>
                          <p className="text-[10px] text-neutral-400 leading-snug">{node.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">0{index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 5: CTA (BOTTOM FOLD)
          ──────────────────────────────────────────────────────── */}
      <section className="relative w-full py-24 px-4 sm:px-[70px] bg-black border-t border-neutral-900 text-center">
        <div className="max-w-[700px] mx-auto">
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mb-3">
            05 / INITIALIZE INTERACTION
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Ready to Learn Deeper?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mb-8 max-w-[480px] mx-auto leading-relaxed">
            Enter the minimalist Vidya AI Playground or take a 60-second mental reset in Focus Lab.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/playground"
              className="px-8 py-4 rounded-full bg-white text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-xl"
            >
              <span>Enter Playground</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/focus"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider border border-white/15 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Launch Focus Lab</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          FOOTER
          ──────────────────────────────────────────────────────── */}
      <footer className="w-full py-8 border-t border-neutral-900 px-4 sm:px-[70px] flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 bg-black z-20 relative select-none gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <div className="w-4 h-4 rounded bg-neutral-800 flex items-center justify-center text-[8px] font-black text-white">V</div>
            <span>Vidya © 2026. Made with ❤️ for Students &amp; Educators across India 🇮🇳.</span>
          </div>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Developed by Vedant Jadhav</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          <a href="https://vidya-edu.vercel.app/" className="hover:text-white transition-colors font-bold">Try Live →</a>
          <a href="https://huggingface.co/vedantjadhav701/edu-qwen-1.7b-merged" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Model Card</a>
          <a href="https://github.com/VedantJadhav701/vidya-educational-llm" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </footer>

    </main>
  );
}

