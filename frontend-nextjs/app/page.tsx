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
          SECTION 1: HERO (FIRST FOLD - FULL VIEWPORT)
          ──────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-screen flex flex-col justify-between z-10">
        {/* BACKGROUND VIDEO LAYER */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 right-0 h-full w-full object-cover"
            style={{
              objectPosition: 'right center',
              transformOrigin: 'right center',
              transform: 'scale(1.3)',
              filter: 'brightness(1.1) contrast(1.1)',
              opacity: 1.0,
            }}
          >
            <source
              src="https://cdn.sceneai.art/Hero%20Section%20Video/9ad5cc99-2fa4-4154-bcc2-5c9ec152778e.mp4"
              type="video/mp4"
            />
          </video>
          {/* Deep text protection overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0) 85%)',
            }}
          />
        </div>

        {/* TOP NAVIGATION LAYER */}
        <header className="relative z-20 w-full px-4 sm:px-[70px] h-[85px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-blue-600/10 border border-blue-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white">
                VIDYA
              </span>
            </div>
            {/* Global Live Stats Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[9px] font-bold tracking-wider text-white/50 select-none">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span>{onlineCount} ONLINE</span>
              <span className="text-white/20">•</span>
              <span>{totalLessons} HELPED</span>
            </div>
          </div>

          {/* Links */}
          <div className="ml-auto mr-12 hidden md:flex items-center gap-8 text-[0.85rem] font-medium text-white/60">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a>
            <a href="https://huggingface.co/vedantjadhav701/edu-qwen-1.7b-merged" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Model Card</a>
            <Link href="/playground" className="hover:text-white transition-colors">Playground</Link>
          </div>

          {/* Play Button */}
          <button className="w-[52px] h-[52px] rounded-full bg-white/5 hover:bg-white/10 border border-white/25 backdrop-blur-[12px] flex items-center justify-center transition-all cursor-pointer">
            <Play className="w-4 h-4 fill-white text-white translate-x-[1px]" />
          </button>
        </header>

        {/* MIDDLE HERO TITLE */}
        <div className="relative z-20 w-full px-4 sm:px-[70px] flex-1 flex flex-col justify-center translate-y-[-6%]">
          <div className="max-w-[650px] text-left">
            {/* Tag */}
            <div className="inline-block text-[9px] font-extrabold uppercase tracking-[0.4em] text-blue-400 mb-3 bg-blue-500/10 px-2.5 py-1 rounded">
              INITIALIZE VISION
            </div>

            {/* Heading */}
            <h1 className="text-[55px] sm:text-[80px] font-bold tracking-tight text-white leading-[1.0] mb-4">
              Intelligence<br />Unbound
            </h1>

            {/* Subheading */}
            <p className="text-[14px] sm:text-[16px] text-white/60 leading-relaxed mb-[30px] max-w-[430px]">
              Vidya is an intelligent educational AI ecosystem. Launch the playground to explore complex math systems, physical models, and science facts in a clean local environment.
            </p>

            {/* Conic Gradient rotating CTA button */}
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
                    Enter Playground
                  </span>
                  <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-[5px]" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM TICKER LOGOS */}
        <div className="relative z-20 w-full px-4 sm:px-[70px] pb-10 mt-auto flex flex-col items-center">
          <div className="text-[9px] font-black uppercase tracking-[0.6em] text-white/25 mb-6 text-center w-full">
            VIDYA KNOWLEDGE CORE SYSTEM
          </div>
          <div className="w-full overflow-hidden relative">
            <div className="flex items-center justify-center gap-10 sm:gap-24 opacity-55 saturate-0">
              {brands.map((brand) => (
                <div key={brand.name} className="flex items-center gap-2">
                  <div className="w-[15px] h-[15px] rounded bg-white/20 flex items-center justify-center text-[10px] font-black">
                    {brand.icon}
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-white">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
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
          <a href="https://vidya-educational-llm.vercel.app/" className="hover:text-white transition-colors font-bold">Try Live →</a>
          <a href="https://huggingface.co/vedantjadhav701/edu-qwen-1.7b-merged" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Model Card</a>
          <a href="https://github.com/VedantJadhav701/vidya-educational-llm" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </footer>

    </main>
  );
}
