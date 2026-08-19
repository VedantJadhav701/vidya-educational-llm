'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, CheckCircle, Cpu, BookOpen, Layers } from 'lucide-react';

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

  // Brand ticker logos
  const brands = [
    { name: 'Google', icon: 'G' },
    { name: 'Cust.io', icon: 'C' },
    { name: 'Hummel', icon: 'H' },
    { name: 'Copper', icon: 'Co' },
    { name: 'Tesla', icon: 'T' },
  ];

  return (
    <main className="w-full min-h-screen bg-black text-white relative font-sans select-none selection:bg-white/10 selection:text-white overflow-x-hidden">
      
      {/* ────────────────────────────────────────────────────────
          SECTION 1: ANIMATED HERO (LANDING_HERO.MD SPEC)
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

        {/* 1) HEADER (DESKTOP / MOBILE) */}
        <header className="relative z-20 w-full max-w-[720px] mx-auto flex items-center justify-between gap-3 animate-headline" style={{ animationDelay: '0.05s' }}>
          {/* Logo Circle */}
          <Link href="/" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.16)] hover:scale-105 transition-transform flex-shrink-0">
            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-black">
              V
            </div>
          </Link>

          {/* White Nav Pill */}
          <nav className="flex-1 max-w-[430px] h-11 sm:h-12 bg-white rounded-full px-3 py-1 flex items-center justify-around shadow-[0_4px_14px_rgba(0,0,0,0.16)] text-[#2e2e2e] text-xs sm:text-sm font-medium">
            <a href="#" className="font-semibold text-black relative after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-black after:rounded-full">Home</a>
            <a href="#about" className="opacity-60 hover:opacity-100 transition-opacity">About</a>
            <a href="#features" className="opacity-60 hover:opacity-100 transition-opacity">Features</a>
            <a href="#roadmap" className="opacity-60 hover:opacity-100 transition-opacity">Roadmap</a>
            <Link href="/playground" className="opacity-60 hover:opacity-100 transition-opacity font-bold">Playground</Link>
          </nav>

          {/* Sign In / Model Card Pill */}
          <a
            href="https://huggingface.co/vedantjadhav701/edu-qwen-1.7b-merged"
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 sm:h-12 px-4 rounded-full bg-[#28282a] hover:bg-[#323234] text-[#c8c8c8] hover:text-white text-xs sm:text-sm font-medium flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.16)] transition-all hover:-translate-y-0.5 flex-shrink-0 hidden sm:flex"
          >
            Model Card
          </a>
        </header>

        {/* 2) HERO (CENTERED COPY & CTA) */}
        <div className="relative z-20 w-full max-w-[900px] mx-auto text-center flex flex-col items-center justify-center my-auto py-4">
          
          {/* Trust Row ("Trusted by 2000+ Students & Educators") */}
          <div className="inline-flex items-center mb-5 animate-headline" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center -space-x-3 z-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#28282a] border border-white/40 p-1 flex items-center justify-center shadow-md hover:-translate-y-0.5 transition-transform">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-black text-xs">
                  <i className="fa-brands fa-microsoft text-[11px]" />
                </div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#28282a] border border-white/40 p-1 flex items-center justify-center shadow-md hover:-translate-y-1 transition-transform z-10">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-black text-xs">
                  <i className="fa-brands fa-amazon text-[11px]" />
                </div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#28282a] border border-white/40 p-1 flex items-center justify-center shadow-md hover:-translate-y-0.5 transition-transform z-20">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-black text-xs">
                  <i className="fa-brands fa-google text-[11px]" />
                </div>
              </div>
            </div>

            {/* Trust Pill */}
            <div className="h-9 sm:h-10 pl-5 pr-4 rounded-full bg-[#28282a] border border-white/40 text-[#c4c2c3] text-xs font-medium flex items-center justify-center -ml-3 z-0">
              <span>Trusted by 2000+ Students &amp; Educators</span>
            </div>
          </div>

          {/* Headline (BubbledotICG-FinePos Retro Dot-Matrix Display Font) */}
          <h1 className="font-display font-normal text-white text-3xl sm:text-6xl lg:text-7xl tracking-[-0.04em] leading-[1.1] uppercase mb-4 max-w-[850px] animate-headline" style={{ animationDelay: '0.2s' }}>
            <span className="block">Intelligence</span>
            <span className="block">Designed To Evolve</span>
          </h1>

          {/* Subhead */}
          <p className="text-xs sm:text-base text-[#d0d0d0]/80 max-w-[520px] leading-relaxed mb-6 font-normal animate-headline" style={{ animationDelay: '0.3s' }}>
            Build applications and educational tools that reason, adapt and collaborate using a modular AI platform designed for learning.
          </p>

          {/* CTA Button */}
          <div className="animate-headline" style={{ animationDelay: '0.4s' }}>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:scale-[1.03] hover:-translate-y-0.5 transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_0_22px_rgba(255,255,255,0.32),0_0_44px_rgba(255,255,255,0.12)] active:scale-98"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        </div>

        {/* 3) STATS FOOTER (EXACT 4 METRICS WITH ANIMATED NUMBERS) */}
        <div className="relative z-20 w-full max-w-[920px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-white/10 pt-4 animate-headline" style={{ animationDelay: '0.5s' }}>
          {/* Stat 1 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-white text-lg sm:text-2xl text-[#38bdf8]">&lt;</span>
              <span className="text-white text-base sm:text-xl font-bold tracking-tight font-mono">120</span>
              <span className="text-white text-xs font-mono">ms</span>
            </div>
            <span className="text-[#8e8e8e] text-[10px] sm:text-xs uppercase font-medium tracking-wider mt-0.5">Inference Time</span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="font-display text-white text-lg sm:text-2xl text-emerald-400">%</span>
              <span className="text-white text-base sm:text-xl font-bold tracking-tight font-mono">99.99</span>
              <span className="text-white text-xs font-mono">%</span>
            </div>
            <span className="text-[#8e8e8e] text-[10px] sm:text-xs uppercase font-medium tracking-wider mt-0.5">Platform Uptime</span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="font-display text-white text-lg sm:text-2xl text-purple-400">*</span>
              <span className="text-white text-base sm:text-xl font-bold tracking-tight font-mono">24</span>
              <span className="text-white text-xs font-mono">/7</span>
            </div>
            <span className="text-[#8e8e8e] text-[10px] sm:text-xs uppercase font-medium tracking-wider mt-0.5">Autonomous Runtime</span>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <span className="font-display text-white text-lg sm:text-2xl text-pink-400">#</span>
              <span className="text-white text-base sm:text-xl font-bold tracking-tight font-mono">2.4</span>
              <span className="text-white text-xs font-mono">M</span>
            </div>
            <span className="text-[#8e8e8e] text-[10px] sm:text-xs uppercase font-medium tracking-wider mt-0.5">Context Windows</span>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 2: ABOUT / MISSION
          ──────────────────────────────────────────────────────── */}
      <section id="about" className="relative w-full py-24 px-4 sm:px-[70px] bg-black border-t border-neutral-900">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mb-3">
              01 / INITIALIZE SYSTEM
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
              A Multilingual Educational Knowledge Core
            </h2>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-6">
              Vidya represents a specialized advancement in educational models. Fine-tuned on the NCERT curriculum and Indian classroom syllabi, it acts as an intelligent co-pilot for high-school, JEE, and NEET preparation.
            </p>
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-neutral-300">Detailed step-by-step math solver with visual graphs</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-neutral-300">Multilingual comprehension supporting 11+ Indian languages</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-neutral-300">Clean, local workspace optimized for student focus</span>
              </div>
            </div>
          </div>
          <div className="p-8 bg-neutral-900/40 border border-neutral-800 rounded-3xl backdrop-blur-md">
            <h3 className="text-lg font-black uppercase tracking-wider mb-4 text-white">SYSTEM OBJECTIVE</h3>
            <blockquote className="border-l-2 border-blue-500 pl-4 py-2 italic text-neutral-300 text-sm mb-6">
              "We build models that do not just state answers, but rather teach the foundational steps behind equations, scientific cycles, and language concepts."
            </blockquote>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-center">
                <span className="block text-xl sm:text-2xl font-black text-white">{totalLessons}</span>
                <span className="text-[8px] sm:text-[9px] text-neutral-500 font-bold uppercase tracking-wider block mt-1">Lessons Served</span>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-center">
                <span className="block text-xl sm:text-2xl font-black text-white">1.7B</span>
                <span className="text-[8px] sm:text-[9px] text-neutral-500 font-bold uppercase tracking-wider block mt-1">Parameters</span>
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-center">
                <span className="block text-xl sm:text-2xl font-black text-white">11+</span>
                <span className="text-[8px] sm:text-[9px] text-neutral-500 font-bold uppercase tracking-wider block mt-1">Dialects</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 3: FEATURES (MODULES)
          ──────────────────────────────────────────────────────── */}
      <section id="features" className="relative w-full py-24 px-4 sm:px-[70px] bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mb-3">
              02 / SYSTEM MODULES
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Interactive Laboratories
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-[500px] mx-auto leading-relaxed">
              Explore the educational modules mapped inside the Vidya Ecosystem. Every answer is structured for clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="p-8 bg-neutral-900/30 border border-neutral-800 hover:border-neutral-700 rounded-3xl backdrop-blur-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">Visual Lab Integration</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Dynamic LaTeX equations and algebraic graphing engines automatically render visuals side-by-side during your chat session.
              </p>
            </div>
            {/* Card 2 */}
            <div className="p-8 bg-neutral-900/30 border border-neutral-800 hover:border-neutral-700 rounded-3xl backdrop-blur-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">NCERT Curriculum</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Direct compatibility with CBSE/NCERT textbook terminology, exercises, and exams, including specialized math calculations.
              </p>
            </div>
            {/* Card 3 */}
            <div className="p-8 bg-neutral-900/30 border border-neutral-800 hover:border-neutral-700 rounded-3xl backdrop-blur-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3">Multilingual Pipeline</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Prompt and learn in Hindi, Tamil, Telugu, Marathi, Bengali, or Gujarati. Vidya automatically replies in your native script.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 4: ROADMAP
          ──────────────────────────────────────────────────────── */}
      <section id="roadmap" className="relative w-full py-24 px-4 sm:px-[70px] bg-black border-t border-neutral-900">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <div className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mb-3">
              03 / STEP PROCESS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Roadmap of Learning
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-[500px] mx-auto leading-relaxed">
              Our backend processes prompts to stream responses and contextual tools dynamically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="relative">
              <span className="text-[40px] font-black text-neutral-800 block mb-2">01</span>
              <h4 className="text-sm font-black uppercase tracking-wider text-white mb-2">Ask a Question</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Type your educational question in any supported script inside the large premium composer.
              </p>
            </div>
            <div className="relative">
              <span className="text-[40px] font-black text-neutral-800 block mb-2">02</span>
              <h4 className="text-sm font-black uppercase tracking-wider text-white mb-2">Visual Processing</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                The parser scans for graphs or biology elements to generate visual panel attachments.
              </p>
            </div>
            <div className="relative">
              <span className="text-[40px] font-black text-neutral-800 block mb-2">03</span>
              <h4 className="text-sm font-black uppercase tracking-wider text-white mb-2">Simulated Stream</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                The model generates tokens in the background, rendering an incremental typing stream.
              </p>
            </div>
            <div className="relative">
              <span className="text-[40px] font-black text-neutral-800 block mb-2">04</span>
              <h4 className="text-sm font-black uppercase tracking-wider text-white mb-2">Parameter Adjust</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Configure answer levels (School vs JEE/NEET) and explanation depth instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          SECTION 5: CTA (BOTTOM FOLD)
          ──────────────────────────────────────────────────────── */}
      <section className="relative w-full py-24 px-4 sm:px-[70px] bg-neutral-950 border-t border-neutral-900 text-center">
        <div className="max-w-[700px] mx-auto">
          <div className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500 mb-3">
            04 / INITIALIZE INTERACTION
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Ready to Initialize?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mb-8 max-w-[480px] mx-auto leading-relaxed">
            Enter the minimalist, clean AI lab playground. Try practicing quadratic formulas or explaining biology concepts.
          </p>

          <div className="inline-block">
            <Link href="/playground" className="group block relative p-[2.5px] rounded-full overflow-hidden">
              <div
                className="absolute inset-[-1000%] animate-[spin_6s_linear_infinite]"
                style={{
                  background:
                    'conic-gradient(#3b82f6, #a855f7, #ec4899, #f8a170, #eab308, #3b82f6)',
                }}
              />
              <div className="relative px-[26.5px] py-[14px] rounded-full bg-white/15 backdrop-blur-[40px] hover:bg-white/25 transition-all duration-300 flex items-center gap-2">
                <span className="text-[12px] font-bold uppercase tracking-wider text-white select-none">
                  Launch Vidya Playground
                </span>
                <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-[5px]" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────
          FOOTER
          ──────────────────────────────────────────────────────── */}
      <footer className="w-full h-[100px] border-t border-neutral-900 px-4 sm:px-[70px] flex items-center justify-between text-xs text-neutral-500 bg-black z-20 relative select-none">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-neutral-800 flex items-center justify-center text-[8px] font-black text-white">V</div>
            <span>Vidya © 2026. All Rights Reserved.</span>
          </div>
          <span className="hidden sm:inline text-neutral-600">•</span>
          <span className="text-[10px] text-neutral-450 dark:text-neutral-500 font-bold uppercase tracking-wider">Developed by Vedant Jadhav</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <a href="https://vidya-edu.vercel.app/" className="hover:text-white transition-colors font-bold">Try Live →</a>
          <a href="https://huggingface.co/vedantjadhav701/edu-qwen-1.7b-merged" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Model Card</a>
          <a href="https://github.com/VedantJadhav701/vidya-educational-llm" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </footer>

    </main>
  );
}
