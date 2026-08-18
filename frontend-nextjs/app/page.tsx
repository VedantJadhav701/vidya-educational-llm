'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import SplashScreen from '@/components/SplashScreen';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  // Brand ticker logos
  const brands = [
    { name: 'Google', icon: 'G' },
    { name: 'Cust.io', icon: 'C' },
    { name: 'Hummel', icon: 'H' },
    { name: 'Copper', icon: 'Co' },
    { name: 'Tesla', icon: 'T' },
  ];

  return (
    <main className="w-full min-h-screen bg-black text-white relative overflow-hidden font-sans select-none selection:bg-white/10 selection:text-white">
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between min-h-screen animate-fadeIn">
          {/* BACKGROUND VIDEO SECTION */}
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

          {/* LAYER 1: TOP NAVIGATION */}
          <header className="relative z-20 w-full px-[70px] h-[85px] flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-blue-600/10 border border-blue-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white">
                auto-automation
              </span>
            </div>

            {/* Links */}
            <div className="ml-auto mr-12 hidden md:flex items-center gap-8 text-[0.85rem] font-medium text-white/60">
              <a href="#" className="hover:text-white transition-colors">Home</a>
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Photos</a>
              <a href="#" className="hover:text-white transition-colors">Crew</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>

            {/* Play Button */}
            <button className="w-[52px] h-[52px] rounded-full bg-white/5 hover:bg-white/10 border border-white/25 backdrop-blur-[12px] flex items-center justify-center transition-all cursor-pointer">
              <Play className="w-4 h-4 fill-white text-white translate-x-[1px]" />
            </button>
          </header>

          {/* LAYER 2: MIDDLE HERO ELEMENTS */}
          <div className="relative z-20 w-full px-[70px] flex-1 flex flex-col justify-center translate-y-[-12%]">
            <div className="max-w-[650px] text-left">
              {/* Element 1 (Tag) */}
              <div className="inline-block text-[9px] font-extrabold uppercase tracking-[0.4em] text-blue-400 mb-3 bg-blue-500/10 px-2.5 py-1 rounded">
                INITIALIZE VISION
              </div>

              {/* Element 2 (Heading) */}
              <h1 className="text-[80px] font-bold tracking-tight text-white leading-[1.0] mb-4">
                Intelligence<br />Unbound
              </h1>

              {/* Element 3 (Subheading) */}
              <p className="text-[16px] text-white/60 leading-relaxed mb-[30px] max-w-[430px]">
                Vidya is an intelligent educational AI ecosystem. Launch the playground to explore complex math systems, physical models, and science facts in a clean local environment.
              </p>

              {/* Element 4 (Primary Button with Conic Gradient border animation) */}
              <div className="inline-block">
                <Link href="/playground" className="group block relative p-[2.5px] rounded-full overflow-hidden">
                  {/* Rotating Conic Gradient Background */}
                  <div
                    className="absolute inset-[-1000%] animate-[spin_6s_linear_infinite]"
                    style={{
                      background:
                        'conic-gradient(#3b82f6, #a855f7, #ec4899, #f8a170, #eab308, #3b82f6)',
                    }}
                  />
                  {/* Inner button surface */}
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

          {/* LAYER 3: BOTTOM ELEMENTS */}
          <footer className="relative z-20 w-full px-[70px] pb-10 mt-auto flex flex-col items-center">
            {/* Centered Ticker Label */}
            <div className="text-[9px] font-black uppercase tracking-[0.6em] text-white/25 mb-6 text-center w-full">
              AUTO-AUTOMATION ECOSYSTEM
            </div>

            {/* Infinite scrolling ticker row */}
            <div className="w-full overflow-hidden relative">
              <div className="flex items-center justify-center gap-16 md:gap-24 opacity-55 saturate-0">
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
          </footer>
        </div>
      )}
    </main>
  );
}
