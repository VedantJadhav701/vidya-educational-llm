'use client';

import { useState } from 'react';

interface FormulaSheetProps {
  onSelectFormula?: (query: string) => void;
}

export default function FormulaSheet({ onSelectFormula }: FormulaSheetProps) {
  const [activeTab, setActiveTab] = useState<'physics' | 'chemistry' | 'math'>('math');

  const formulas = {
    math: [
      { name: 'Area of Rectangle', latex: 'A = l \\times w', query: 'What is the formula and explanation for the area of a rectangle?' },
      { name: 'Quadratic Formula', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', query: 'Explain the quadratic formula with an example.' },
      { name: 'Pythagorean Theorem', latex: 'a^2 + b^2 = c^2', query: 'Explain the Pythagorean theorem.' },
      { name: 'Area of Circle', latex: 'A = \\pi r^2', query: 'How to calculate the area of a circle?' },
    ],
    physics: [
      { name: "Newton's Second Law", latex: 'F = m \\cdot a', query: "Explain Newton's second law of motion with units." },
      { name: 'Kinetic Energy', latex: 'E_k = \\frac{1}{2} m v^2', query: 'What is Kinetic Energy? Give formula and derivation.' },
      { name: "Ohm's Law", latex: 'V = I \\cdot R', query: "Explain Ohm's Law and resistance." },
      { name: 'Universal Gravitation', latex: 'F = G \\frac{m_1 m_2}{r^2}', query: "Explain Newton's law of universal gravitation." },
    ],
    chemistry: [
      { name: 'Photosynthesis', latex: '6CO_2 + 6H_2O \\xrightarrow{light} C_6H_{12}O_6 + 6O_2', query: 'What is photosynthesis? Give chemical equation.' },
      { name: 'Ideal Gas Law', latex: 'P V = n R T', query: 'Explain the Ideal Gas Law equation.' },
      { name: 'pH Formula', latex: 'pH = -\\log_{10}[H^+]', query: 'How is pH calculated in chemistry?' },
      { name: 'Molarity', latex: 'M = \\frac{\\text{moles of solute}}{\\text{liters of solution}}', query: 'What is molarity and how to calculate it?' },
    ],
  };

  return (
    <div className="media-card bg-[#0b0f19]/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl animate-fadeIn">
      <div className="p-3 px-4 bg-[#1e293b]/60 border-b border-white/10 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#38bdf8] flex items-center gap-1.5">
          <span>📑</span> NCERT Quick Formulas
        </span>
        <div className="flex gap-1 text-[10px]">
          {(['math', 'physics', 'chemistry'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-0.5 rounded capitalize transition-colors ${
                activeTab === tab
                  ? 'bg-[#38bdf8]/20 text-[#38bdf8] font-semibold border border-[#38bdf8]/30'
                  : 'bg-white/5 text-[#94a3b8]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2.5 max-h-[300px] overflow-y-auto custom-scrollbar">
        {formulas[activeTab].map((f, i) => (
          <div
            key={i}
            onClick={() => onSelectFormula?.(f.query)}
            className="p-2.5 bg-white/5 border border-white/5 rounded-xl hover:border-[#38bdf8]/40 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs font-medium text-[#f1f5f9]">
              <span>{f.name}</span>
              <span className="text-[10px] text-[#38bdf8] opacity-0 group-hover:opacity-100 transition-opacity">
                Ask Vidya ➔
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#cbd5e1] mt-1 bg-[#0b0f19] p-1.5 rounded border border-white/5 truncate">
              {f.latex}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
