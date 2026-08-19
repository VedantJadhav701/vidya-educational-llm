'use client';

import { GameMode, Difficulty, SessionDuration } from '@/lib/focus/types';
import { Calculator, GitBranch, Grid, Atom, Brain, Play } from 'lucide-react';

interface ModeSelectorProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  duration: SessionDuration;
  onSelectDuration: (dur: SessionDuration) => void;
  difficulty: Difficulty;
  onSelectDifficulty: (diff: Difficulty) => void;
  onStart: () => void;
}

export default function ModeSelector({
  selectedMode,
  onSelectMode,
  duration,
  onSelectDuration,
  difficulty,
  onSelectDifficulty,
  onStart,
}: ModeSelectorProps) {
  const modes: { id: GameMode; title: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'math',
      title: 'Quick Math',
      desc: 'Rapid arithmetic & calculation speed',
      icon: <Calculator className="w-5 h-5 text-cyan-400" />,
    },
    {
      id: 'pattern',
      title: 'Pattern Lab',
      desc: 'Numerical sequence & pattern recognition',
      icon: <GitBranch className="w-5 h-5 text-purple-400" />,
    },
    {
      id: 'memory',
      title: 'Memory Matrix',
      desc: 'Spatial grid recall & memory capacity',
      icon: <Grid className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'science',
      title: 'Science Sprint',
      desc: 'Fast NCERT Physics, Chem & Biology facts',
      icon: <Atom className="w-5 h-5 text-pink-400" />,
    },
    {
      id: 'logic',
      title: 'Logic Challenge',
      desc: 'Deductive reasoning & logical problem solving',
      icon: <Brain className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <div className="w-full max-w-[780px] mx-auto flex flex-col gap-6 select-none">
      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {modes.map((m) => {
          const isSelected = selectedMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-white/10 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-[1.02]'
                  : 'bg-[#111111] border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">{m.icon}</div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white mb-0.5">{m.title}</h3>
                <p className="text-[11px] text-neutral-400 leading-normal">{m.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Session Controls: Duration & Difficulty Bar */}
      <div className="p-4 rounded-2xl bg-[#111111] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Duration Selector */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-medium">Session Duration:</span>
          <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
            {([30, 60, 90] as SessionDuration[]).map((d) => (
              <button
                key={d}
                onClick={() => onSelectDuration(d)}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  duration === d
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-medium">Difficulty:</span>
          <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(diff)}
                className={`px-3 py-1 rounded-lg font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer ${
                  difficulty === diff
                    ? 'bg-white text-black shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prominent Start Focus Session Button */}
      <div className="flex justify-center mt-2">
        <button
          onClick={onStart}
          className="group relative px-8 py-4 rounded-full bg-white text-black font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.25)] hover:scale-105 transition-all cursor-pointer active:scale-98"
        >
          <span>Start Focus Session</span>
          <Play className="w-4 h-4 fill-black transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
