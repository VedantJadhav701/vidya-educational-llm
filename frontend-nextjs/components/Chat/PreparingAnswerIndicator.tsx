'use client';

import { motion } from 'framer-motion';

export default function PreparingAnswerIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="message ai-message max-w-[85%] flex self-start my-2"
    >
      <div className="bg-[#0b0f19]/90 border border-[#a855f7]/30 rounded-2xl p-4 px-5 flex items-center gap-3.5 shadow-[0_0_20px_rgba(168,85,247,0.2)] backdrop-blur-md">
        {/* Animated Knowledge Nucleus Atom */}
        <div className="relative w-7 h-7 flex items-center justify-center flex-shrink-0">
          <div className="absolute inset-0 rounded-full border border-[#38bdf8] animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-1 rounded-full border border-[#a855f7] animate-[spin_2s_linear_infinite_reverse]" />
          <div className="w-2 h-2 rounded-full bg-[#ec4899] animate-ping" />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
            Vidya is preparing your answer...
          </span>
          <span className="text-[10px] text-[#94a3b8]">
            Verifying formulas &amp; language context
          </span>
        </div>
      </div>
    </motion.div>
  );
}
