'use client';

import { motion } from 'framer-motion';
import { SubjectType } from '@/lib/types';

interface SubjectCardsProps {
  onSelectSubject: (subject: SubjectType, starterPrompt: string) => void;
}

export default function SubjectCards({ onSelectSubject }: SubjectCardsProps) {
  const cards = [
    {
      id: 'math' as SubjectType,
      title: 'Mathematics',
      icon: '📐',
      tagline: 'Explore equations & geometric proofs',
      prompt: 'Help me understand quadratic equations step-by-step.',
      gradient: 'from-[#a855f7]/20 to-[#6366f1]/10',
      border: 'border-[#a855f7]/30',
    },
    {
      id: 'physics' as SubjectType,
      title: 'Physics',
      icon: '🍎',
      tagline: 'Understand forces & universal laws',
      prompt: "Explain Newton's three laws of motion with real-world examples.",
      gradient: 'from-[#38bdf8]/20 to-[#6366f1]/10',
      border: 'border-[#38bdf8]/30',
    },
    {
      id: 'chemistry' as SubjectType,
      title: 'Chemistry',
      icon: '🧪',
      tagline: 'Master reactions & chemical bonding',
      prompt: 'Explain chemical bonding and the difference between ionic and covalent bonds.',
      gradient: 'from-[#10b981]/20 to-[#38bdf8]/10',
      border: 'border-[#10b981]/30',
    },
    {
      id: 'biology' as SubjectType,
      title: 'Biology',
      icon: '🧬',
      tagline: 'Discover life processes & cell structure',
      prompt: 'Explain photosynthesis step-by-step with chemical equation.',
      gradient: 'from-[#ec4899]/20 to-[#a855f7]/10',
      border: 'border-[#ec4899]/30',
    },
    {
      id: 'cs' as SubjectType,
      title: 'Computer Science',
      icon: '</>',
      tagline: 'Algorithms, logic & programming',
      prompt: 'Explain binary search algorithm with step-by-step trace.',
      gradient: 'from-[#f59e0b]/20 to-[#ec4899]/10',
      border: 'border-[#f59e0b]/30',
    },
    {
      id: 'general' as SubjectType,
      title: 'General Science',
      icon: '🌐',
      tagline: 'NCERT Social Science & Geography',
      prompt: 'Explain the structure of the Solar System and planetary orbits.',
      gradient: 'from-[#6366f1]/20 to-[#38bdf8]/10',
      border: 'border-[#6366f1]/30',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {cards.map((c, idx) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08, duration: 0.4 }}
          onClick={() => onSelectSubject(c.id, c.prompt)}
          className={`p-4 rounded-2xl bg-gradient-to-br ${c.gradient} border ${c.border} backdrop-blur-md cursor-pointer group hover:-translate-y-1.5 transition-all duration-300 shadow-xl flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl group-hover:scale-110 transition-transform">
              {c.icon}
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-[#94a3b8] uppercase group-hover:text-white transition-colors">
              Explore ➔
            </span>
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-white group-hover:text-[#38bdf8] transition-colors">
              {c.title}
            </h3>
            <p className="text-[11px] text-[#94a3b8] mt-1 leading-snug">
              {c.tagline}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
