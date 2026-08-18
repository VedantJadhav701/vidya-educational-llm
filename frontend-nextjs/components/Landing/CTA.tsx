'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 bg-[#070a14] border-t border-white/5 relative overflow-hidden text-center">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#ec4899]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#ec4899] animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
          Start learning with Vidya.
        </h2>
        
        <p className="text-sm sm:text-base text-[#94a3b8] mb-8 max-w-xl mx-auto leading-relaxed">
          Open the interactive playground workspace. Ask your questions, solve mathematical models, and visualize physical formulas in real-time.
        </p>

        <Link
          href="/playground"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white font-bold shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all hover:scale-[1.02] cursor-pointer"
        >
          <span>Open Playground Workspace</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
