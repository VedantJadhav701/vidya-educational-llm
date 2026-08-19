'use client';

import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { UserFocusStats } from '@/lib/focus/types';

interface FocusHeaderProps {
  stats: UserFocusStats;
  isPlaying?: boolean;
  onExitPlay?: () => void;
}

export default function FocusHeader({ stats, isPlaying, onExitPlay }: FocusHeaderProps) {
  return (
    <header className="w-full border-b border-neutral-200 dark:border-white/10 px-4 sm:px-8 h-[65px] flex items-center justify-between z-30 select-none bg-black/40 backdrop-blur-md">
      {/* Left: Brand / Back */}
      <div className="flex items-center gap-3">
        {isPlaying ? (
          <button
            onClick={onExitPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Pause &amp; Exit</span>
          </button>
        ) : (
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black text-[10px] font-black group-hover:scale-105 transition-transform">
              V
            </div>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-white">
              VIDYA
            </span>
          </Link>
        )}
      </div>

      {/* Center Links (First-Class Navigation) */}
      {!isPlaying && (
        <nav className="hidden md:flex items-center gap-6 text-[12px] font-medium text-neutral-400">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/playground" className="hover:text-white transition-colors">
            Playground
          </Link>
          <Link
            href="/focus"
            className="text-white font-semibold bg-white/10 px-3 py-1 rounded-xl border border-white/15 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Focus Lab</span>
          </Link>
          <a
            href="https://huggingface.co/vedantjadhav701/edu-qwen-1.7b-merged"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Model Card
          </a>
        </nav>
      )}

      {/* Right Stats Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold tracking-wider text-neutral-300 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>TODAY SCORE: {stats.todayFocusScore}</span>
          <span className="text-white/20">•</span>
          <span>BEST: {stats.bestScore}</span>
        </div>

        {!isPlaying && (
          <Link
            href="/playground"
            className="px-3.5 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-all cursor-pointer hidden sm:block"
          >
            Playground →
          </Link>
        )}
      </div>
    </header>
  );
}
