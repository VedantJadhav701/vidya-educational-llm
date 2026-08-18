'use client';

import { motion } from 'framer-motion';
import { 
  Languages, 
  Calculator, 
  Atom, 
  FlaskConical, 
  Dna, 
  GitCommit, 
  Sigma, 
  Image as ImageIcon 
} from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      icon: <Languages className="w-6 h-6 text-[#a855f7]" />,
      title: 'Multilingual Learning',
      desc: 'Ask questions and receive explanations in 12 major Indian languages including Hindi, Marathi, Tamil, Bengali, and Hinglish.',
      border: 'hover:border-[#a855f7]/50',
      bg: 'hover:bg-[#a855f7]/5',
    },
    {
      icon: <Calculator className="w-6 h-6 text-[#38bdf8]" />,
      title: 'Mathematics Help',
      desc: 'Get direct calculations, algebraic proofs, and explanations for trigonometric, coordinate, and calculus topics.',
      border: 'hover:border-[#38bdf8]/50',
      bg: 'hover:bg-[#38bdf8]/5',
    },
    {
      icon: <Atom className="w-6 h-6 text-[#6366f1]" />,
      title: 'Physics Core',
      desc: 'Understand kinematics, electromagnetism, optics, and thermodynamics with equations mapped to real-life applications.',
      border: 'hover:border-[#6366f1]/50',
      bg: 'hover:bg-[#6366f1]/5',
    },
    {
      icon: <FlaskConical className="w-6 h-6 text-[#10b981]" />,
      title: 'Chemistry Lab',
      desc: 'Master organic reaction mechanisms, atomic structures, periodic trends, and balance stoichiometric equations.',
      border: 'hover:border-[#10b981]/50',
      bg: 'hover:bg-[#10b981]/5',
    },
    {
      icon: <Dna className="w-6 h-6 text-[#ec4899]" />,
      title: 'Biology Structures',
      desc: 'Explore genetic mutations, cellular respiration, human physiology, plant systems, and molecular genetics concepts.',
      border: 'hover:border-[#ec4899]/50',
      bg: 'hover:bg-[#ec4899]/5',
    },
    {
      icon: <GitCommit className="w-6 h-6 text-[#f59e0b]" />,
      title: 'Step-by-Step Explanations',
      desc: 'No vague summaries. Vidya breaks down answers into logical, consecutive steps perfect for study and revisions.',
      border: 'hover:border-[#f59e0b]/50',
      bg: 'hover:bg-[#f59e0b]/5',
    },
    {
      icon: <Sigma className="w-6 h-6 text-[#14b8a6]" />,
      title: 'Mathematical Rendering',
      desc: 'Renders formulas using LaTeX formatting and KaTeX support so that fractions, integrals, and equations look professional.',
      border: 'hover:border-[#14b8a6]/50',
      bg: 'hover:bg-[#14b8a6]/5',
    },
    {
      icon: <ImageIcon className="w-6 h-6 text-[#6366f1]" />,
      title: 'Visual Learning',
      desc: 'Outputs educational diagram markers and safe graph functions, rendering them live inside a side visuals dashboard.',
      border: 'hover:border-[#6366f1]/50',
      bg: 'hover:bg-[#6366f1]/5',
    },
  ];

  return (
    <section id="features" className="py-20 bg-[#070a14]/60 relative border-t border-white/5">
      <div className="absolute inset-0 bg-[#0b0f19]/30 pointer-events-none" />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Designed for Deep Academic Understanding
          </h2>
          <p className="text-base text-[#94a3b8]">
            Vidya combines natural language comprehension with rigid scientific principles, providing Indian students with an advanced workspace for exam prep and revision.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((feat, idx) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className={`p-6 rounded-2xl bg-[#0b0f19] border border-white/5 transition-all duration-300 ${feat.border} ${feat.bg} group cursor-default`}
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                {feat.icon}
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-white transition-colors">
                {feat.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
