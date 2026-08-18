'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Calculator, Atom, FlaskConical, Dna, Terminal, Globe } from 'lucide-react';

export default function Subjects() {
  const router = useRouter();

  const subjects = [
    {
      id: 'math',
      title: 'Mathematics',
      icon: <Calculator className="w-8 h-8 text-[#a855f7]" />,
      tagline: 'Explore equations & geometric proofs',
      desc: 'Understand calculus, matrices, trigonometry, and coordinate geometry with clear derivations.',
      gradient: 'from-[#a855f7]/10 to-[#6366f1]/5',
      border: 'hover:border-[#a855f7]/30',
    },
    {
      id: 'physics',
      title: 'Physics',
      icon: <Atom className="w-8 h-8 text-[#38bdf8]" />,
      tagline: 'Understand forces & universal laws',
      desc: "Delve into Newton's laws, thermodynamics, optics, and electrostatics with formulas and applications.",
      gradient: 'from-[#38bdf8]/10 to-[#6366f1]/5',
      border: 'hover:border-[#38bdf8]/30',
    },
    {
      id: 'chemistry',
      title: 'Chemistry',
      icon: <FlaskConical className="w-8 h-8 text-[#10b981]" />,
      tagline: 'Master reactions & chemical bonding',
      desc: 'Master stoichiometry, organic mechanism pathways, periodic classification, and gaseous states.',
      gradient: 'from-[#10b981]/10 to-[#38bdf8]/5',
      border: 'hover:border-[#10b981]/30',
    },
    {
      id: 'biology',
      title: 'Biology',
      icon: <Dna className="w-8 h-8 text-[#ec4899]" />,
      tagline: 'Discover life processes & cell structure',
      desc: 'Learn genetics, cell cycle structures, human circulatory loops, and photosynthesis chains.',
      gradient: 'from-[#ec4899]/10 to-[#a855f7]/5',
      border: 'hover:border-[#ec4899]/30',
    },
    {
      id: 'cs',
      title: 'Computer Science',
      icon: <Terminal className="w-8 h-8 text-[#f59e0b]" />,
      tagline: 'Algorithms, logic & programming',
      desc: 'Analyze sorting and search algorithms, programming syntax, data structures, and dry runs.',
      gradient: 'from-[#f59e0b]/10 to-[#ec4899]/5',
      border: 'hover:border-[#f59e0b]/30',
    },
    {
      id: 'general',
      title: 'General Science',
      icon: <Globe className="w-8 h-8 text-[#6366f1]" />,
      tagline: 'NCERT Social Science & Geography',
      desc: 'Explore maps, historical timelines, constitutional features, and basic geography concepts.',
      gradient: 'from-[#6366f1]/10 to-[#38bdf8]/5',
      border: 'hover:border-[#6366f1]/30',
    },
  ];

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/playground?subject=${subjectId}`);
  };

  return (
    <section id="subjects" className="py-20 bg-[#070a14] border-t border-white/5 relative">
      <div className="absolute inset-0 bg-[#0b0f19]/10 pointer-events-none" />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Interactive Learning Channels
          </h2>
          <p className="text-base text-[#94a3b8]">
            Click any core domain below to launch the Vidya Playground pre-loaded with focused revision guidelines.
          </p>
        </div>

        {/* Subject Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subj, idx) => (
            <motion.div
              key={subj.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              onClick={() => handleSubjectClick(subj.id)}
              className={`p-6 rounded-2xl bg-[#0b0f19] border border-white/5 bg-gradient-to-br ${subj.gradient} cursor-pointer group transition-all duration-300 ${subj.border} hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-300">
                  {subj.icon}
                </div>
                <span className="text-xs font-bold text-[#94a3b8] group-hover:text-[#38bdf8] transition-colors flex items-center gap-1">
                  <span>Enter Room</span>
                  <span className="group-hover:translate-x-1 transition-transform">➔</span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#38bdf8] transition-colors">
                {subj.title}
              </h3>
              
              <span className="text-[10px] text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 px-2 py-0.5 rounded uppercase tracking-wider font-semibold font-mono inline-block mb-3">
                {subj.tagline}
              </span>

              <p className="text-xs text-[#94a3b8] leading-relaxed">
                {subj.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
