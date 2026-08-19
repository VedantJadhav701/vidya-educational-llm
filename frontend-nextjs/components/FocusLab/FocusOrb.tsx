'use client';

import { motion } from 'framer-motion';

interface FocusOrbProps {
  status?: 'idle' | 'correct' | 'incorrect';
  size?: 'sm' | 'md' | 'lg';
}

export default function FocusOrb({ status = 'idle', size = 'md' }: FocusOrbProps) {
  const dimensionClass =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-20 h-20' : 'w-12 h-12';

  const glowColor =
    status === 'correct'
      ? 'from-emerald-400 via-teal-500 to-cyan-400 shadow-[0_0_25px_rgba(52,211,153,0.8)]'
      : status === 'incorrect'
      ? 'from-amber-500/60 via-[#28282a] to-neutral-700 shadow-[0_0_12px_rgba(163,163,163,0.3)]'
      : 'from-blue-400 via-purple-500 to-cyan-400 shadow-[0_0_18px_rgba(168,85,247,0.4)]';

  return (
    <div className={`relative flex items-center justify-center ${dimensionClass}`}>
      {/* Outer Pulse Ring */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: 'easeInOut',
        }}
        className={`absolute inset-0 rounded-full bg-gradient-to-r ${glowColor} blur-md pointer-events-none`}
      />

      {/* Core Orb Nucleus */}
      <motion.div
        animate={
          status === 'correct'
            ? { scale: [1, 1.3, 1], rotate: 180 }
            : { scale: [1, 1.05, 1] }
        }
        transition={{ duration: 0.4 }}
        className={`w-full h-full rounded-full bg-gradient-to-br ${glowColor} flex items-center justify-center z-10 border border-white/30`}
      >
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
      </motion.div>
    </div>
  );
}
