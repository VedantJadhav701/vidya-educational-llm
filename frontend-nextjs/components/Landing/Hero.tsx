'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles, Binary } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Premium Ambient Background Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#38bdf8]/10 via-[#a855f7]/15 to-[#ec4899]/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#38bdf8]/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#ec4899]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left: Text & CTA */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="self-center lg:self-start inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#38bdf8] mb-6 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Introducing Vidya 1.7B Educational AI</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight"
          >
            Learn deeper.<br />
            <span className="bg-gradient-to-r from-[#38bdf8] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
              Understand better.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-base sm:text-lg text-[#94a3b8] mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            Vidya is an educational AI companion designed for Indian students. Learn complex Mathematics, Physics, Chemistry, Biology, and Computer Science concepts in your own native language.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              href="/playground"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white font-semibold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all hover:scale-[1.02]"
            >
              <span>Enter Vidya Playground</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold transition-all"
            >
              <span>Explore Features</span>
              <BookOpen className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Right: Educational Visualizer */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center"
          >
            {/* Orbiting Ring 1 */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#38bdf8]/20 animate-[spin_30s_linear_infinite]" />
            {/* Orbiting Ring 2 */}
            <div className="absolute inset-10 rounded-full border border-dashed border-[#a855f7]/30 animate-[spin_20s_linear_infinite_reverse]" />
            {/* Orbiting Ring 3 */}
            <div className="absolute inset-20 rounded-full border border-dashed border-[#ec4899]/20 animate-[spin_15s_linear_infinite]" />

            {/* Floating Science/Math Symbols (using pure CSS & motion) */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-4 right-10 w-10 h-10 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8] text-sm font-bold shadow-lg shadow-[#38bdf8]/10"
            >
              e=mc²
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-8 left-6 w-12 h-12 rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center text-[#a855f7] text-lg font-bold shadow-lg shadow-[#a855f7]/10"
            >
              ∫dx
            </motion.div>

            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 -right-6 w-10 h-10 rounded-xl bg-[#ec4899]/10 border border-[#ec4899]/30 flex items-center justify-center text-[#ec4899] text-base font-bold shadow-lg shadow-[#ec4899]/10"
            >
              H₂O
            </motion.div>

            <motion.div
              animate={{ x: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute top-16 left-8 w-8 h-8 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] text-sm font-bold shadow-lg"
            >
              f(x)
            </motion.div>

            {/* Central Knowledge Nucleus */}
            <div className="relative w-36 h-36 rounded-3xl bg-gradient-to-br from-[#a855f7] via-[#ec4899] to-[#6366f1] flex flex-col items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)] z-20">
              <Binary className="w-12 h-12 text-white mb-1 animate-pulse" />
              <span className="text-white font-extrabold text-sm tracking-wider">VIDYA 1.7B</span>
              <span className="text-[10px] text-purple-100 font-medium">NEURAL HUB</span>
              
              {/* Outer Glowing Shell */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#a855f7] to-[#ec4899] opacity-30 blur-md -z-10 animate-ping [animation-duration:3s]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
