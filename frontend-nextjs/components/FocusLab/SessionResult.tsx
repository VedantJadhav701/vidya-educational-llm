'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw, Award, Zap, Target, Clock, Flame } from 'lucide-react';
import { SessionResultData } from '@/lib/focus/types';
import FocusOrb from './FocusOrb';

interface SessionResultProps {
  result: SessionResultData;
  onPlayAgain: () => void;
}

export default function SessionResult({ result, onPlayAgain }: SessionResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-[560px] mx-auto flex flex-col gap-6 select-none"
    >
      {/* Result Card */}
      <div className="p-8 rounded-3xl bg-[#111111] border border-white/15 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400" />

        {/* Ambient Focus Orb */}
        <div className="mb-4 mt-2">
          <FocusOrb status="correct" size="lg" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white mb-1">
          FOCUS SESSION COMPLETE
        </h2>
        <p className="text-xs text-neutral-400 font-medium mb-6">
          Great job resetting your cognitive focus.
        </p>

        {/* Primary Focus Score Badge */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 w-full mb-6 flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1 mb-1">
            <Award className="w-3.5 h-3.5" /> FOCUS SCORE
          </span>
          <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {result.score}
          </span>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full mb-8">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Target className="w-3 h-3 text-emerald-400" /> ACCURACY
            </span>
            <span className="text-lg font-bold text-white">{result.accuracy}%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Zap className="w-3 h-3 text-cyan-400" /> SOLVED
            </span>
            <span className="text-lg font-bold text-white">{result.correctAnswers} / {result.questionsSolved}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Clock className="w-3 h-3 text-purple-400" /> AVG SPEED
            </span>
            <span className="text-lg font-bold text-white">{result.avgResponseTimeSec}s</span>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Flame className="w-3 h-3 text-pink-400" /> BEST STREAK
            </span>
            <span className="text-lg font-bold text-white">{result.bestStreak}</span>
          </div>
        </div>

        {/* Return to Learning Prompt */}
        <div className="border-t border-white/10 pt-6 w-full flex flex-col items-center gap-4">
          <p className="text-sm font-semibold text-neutral-200">
            Ready to continue learning?
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <Link
              href="/playground"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Back to Playground</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={onPlayAgain}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
