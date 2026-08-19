'use client';

import { useState, useEffect } from 'react';
import { MemoryGridConfig } from '@/lib/focus/types';
import { motion } from 'framer-motion';

interface MemoryMatrixProps {
  config: MemoryGridConfig;
  onComplete: (userSelections: number[]) => void;
}

export default function MemoryMatrix({ config, onComplete }: MemoryMatrixProps) {
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const [selectedCells, setSelectedCells] = useState<number[]>([]);

  useEffect(() => {
    setPhase('memorize');
    setSelectedCells([]);

    const timer = setTimeout(() => {
      setPhase('recall');
    }, config.displayDurationMs);

    return () => clearTimeout(timer);
  }, [config]);

  const handleCellClick = (index: number) => {
    if (phase !== 'recall') return;
    if (selectedCells.includes(index)) return;

    const updated = [...selectedCells, index];
    setSelectedCells(updated);

    if (updated.length === config.highlightedCells.length) {
      onComplete(updated);
    }
  };

  const gridColsClass =
    config.size === 3 ? 'grid-cols-3' : config.size === 4 ? 'grid-cols-4' : 'grid-cols-5';

  return (
    <div className="flex flex-col items-center gap-4 w-full select-none">
      <div className="text-center mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          {phase === 'memorize' ? '🧠 Memorize the highlighted tiles' : '👇 Tap the remembered positions'}
        </span>
      </div>

      {/* Grid Container */}
      <div
        className={`grid ${gridColsClass} gap-2.5 p-4 rounded-2xl bg-[#111111] border border-white/10 max-w-[320px] sm:max-w-[380px] w-full aspect-square`}
      >
        {Array.from({ length: config.size * config.size }).map((_, idx) => {
          const isHighlighted = config.highlightedCells.includes(idx);
          const isSelected = selectedCells.includes(idx);

          let cellStyle = 'bg-white/5 border-white/10';
          if (phase === 'memorize' && isHighlighted) {
            cellStyle = 'bg-gradient-to-br from-cyan-400 to-purple-500 border-white shadow-[0_0_15px_rgba(56,189,248,0.5)]';
          } else if (phase === 'recall' && isSelected) {
            cellStyle = 'bg-white text-black border-white font-black shadow-md';
          }

          return (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCellClick(idx)}
              disabled={phase !== 'recall'}
              className={`rounded-xl border transition-all flex items-center justify-center cursor-pointer ${cellStyle}`}
            />
          );
        })}
      </div>
    </div>
  );
}
