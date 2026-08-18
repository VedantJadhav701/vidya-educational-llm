'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface SubjectNode {
  id: string;
  name: string;
  icon: string;
  desc: string;
  prompt: string;
  angle: number; // Angle around center nucleus
  color: string;
}

interface KnowledgeOrbitProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function KnowledgeOrbit({ onSelectPrompt }: KnowledgeOrbitProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes: SubjectNode[] = [
    {
      id: 'math',
      name: 'Mathematics',
      icon: '📐',
      desc: 'Algebra, Geometry, Calculus & Formulas',
      prompt: 'Help me understand quadratic equations with examples.',
      angle: 0,
      color: '#a855f7',
    },
    {
      id: 'physics',
      name: 'Physics',
      icon: '🍎',
      desc: 'Motion, Forces, Energy & Electromagnetism',
      prompt: "Explain Newton's three laws of motion with real-life examples.",
      angle: 60,
      color: '#38bdf8',
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      icon: '🧪',
      desc: 'Reactions, Periodic Table & Bonding',
      prompt: 'Explain chemical bonding and covalent vs ionic bonds.',
      angle: 120,
      color: '#10b981',
    },
    {
      id: 'biology',
      name: 'Biology',
      icon: '🧬',
      desc: 'Cellular Biology, Ecosystems & Life Processes',
      prompt: 'Explain photosynthesis step-by-step with chemical equation.',
      angle: 180,
      color: '#ec4899',
    },
    {
      id: 'cs',
      name: 'Computer Science',
      icon: '</>',
      desc: 'Algorithms, Data Structures & Logic',
      prompt: 'Explain binary search algorithm with step-by-step trace.',
      angle: 240,
      color: '#f59e0b',
    },
    {
      id: 'general',
      name: 'General Knowledge',
      icon: '🌐',
      desc: 'NCERT Social Sciences, History & Geography',
      prompt: 'Explain the Solar System and planetary orbits in simple terms.',
      angle: 300,
      color: '#6366f1',
    },
  ];

  return (
    <div className="relative w-full max-w-4xl h-[420px] mx-auto flex items-center justify-center overflow-hidden my-4 select-none">
      {/* Background SVG Orbit Rays & Rings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 420">
        <circle cx="400" cy="210" r="160" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1.5" strokeDasharray="6 6" fill="none" />
        <circle cx="400" cy="210" r="110" stroke="rgba(168, 85, 247, 0.12)" strokeWidth="1" fill="none" />

        {/* Connecting Rays */}
        {nodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const x2 = Number((400 + 160 * Math.cos(rad)).toFixed(3));
          const y2 = Number((210 + 140 * Math.sin(rad)).toFixed(3));
          const isHovered = hoveredNode === node.id;

          return (
            <line
              key={node.id}
              x1="400"
              y1="210"
              x2={x2}
              y2={y2}
              stroke={isHovered ? node.color : 'rgba(255, 255, 255, 0.1)'}
              strokeWidth={isHovered ? '2' : '1'}
              strokeDasharray={isHovered ? 'none' : '4 4'}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>

      {/* Central Knowledge Nucleus */}
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-20 w-36 h-36 rounded-full bg-gradient-to-br from-[#0b0f19] via-[#1e1b4b] to-[#0b0f19] border-2 border-[#a855f7]/50 shadow-[0_0_50px_rgba(168,85,247,0.3)] flex flex-col items-center justify-center p-3 text-center cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center text-xl shadow-md mb-1">
          🎓
        </div>
        <h2 className="text-base font-extrabold tracking-tight text-white group-hover:text-[#38bdf8] transition-colors">
          VIDYA
        </h2>
        <span className="text-[10px] text-[#94a3b8] font-medium leading-tight">
          Learning Lab
        </span>
      </motion.div>

      {/* Orbiting Subject Nodes */}
      {nodes.map((node) => {
        const rad = (node.angle * Math.PI) / 180;
        // Position relative to center (400, 210)
        const radiusX = 240;
        const radiusY = 140;
        const posX = Number((radiusX * Math.cos(rad)).toFixed(3));
        const posY = Number((radiusY * Math.sin(rad)).toFixed(3));

        const isHovered = hoveredNode === node.id;

        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: isHovered ? 1.12 : 1 }}
            transition={{ duration: 0.3 }}
            style={{
              transform: `translate(${posX}px, ${posY}px)`,
            }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => onSelectPrompt(node.prompt)}
            className={`absolute z-30 px-3.5 py-2 rounded-2xl border backdrop-blur-md cursor-pointer transition-all duration-300 flex items-center gap-2.5 shadow-lg ${
              isHovered
                ? 'bg-[#1e293b]/95 border-[#a855f7] shadow-[0_0_25px_rgba(168,85,247,0.4)]'
                : 'bg-[#0b0f19]/80 border-white/10 hover:border-white/20'
            }`}
          >
            <span className="text-lg">{node.icon}</span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white group-hover:text-[#38bdf8]">
                {node.name}
              </span>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-[10px] text-[#94a3b8] max-w-[140px] truncate"
                >
                  {node.desc}
                </motion.span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
