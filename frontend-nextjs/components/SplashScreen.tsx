'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 400 : 1800;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#070a14] overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-[#38bdf8]/15 via-[#a855f7]/20 to-[#ec4899]/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

          <div className="relative flex flex-col items-center text-center z-10 p-6">
            {/* Knowledge Nucleus Animation */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative w-24 h-24 mb-6 flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full border-2 border-[#38bdf8]/30 animate-[spin_8s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-[#a855f7]/40 animate-[spin_6s_linear_infinite_reverse]" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                <span className="text-2xl">🎓</span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight text-white mb-2"
            >
              VIDYA
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-sm font-medium bg-gradient-to-r from-[#38bdf8] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent"
            >
              AI Learning Laboratory • Learn. Explore. Understand.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
