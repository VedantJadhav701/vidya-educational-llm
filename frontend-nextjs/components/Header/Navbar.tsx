'use client';

import { LearningMode, BackendStatus, SessionStats } from '@/lib/types';

interface NavbarProps {
  currentMode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  status: BackendStatus;
  stats: SessionStats;
}

export default function Navbar({
  currentMode,
  onModeChange,
  status,
  stats,
}: NavbarProps) {
  const modes: { id: LearningMode; label: string; icon: string; desc: string }[] = [
    { id: 'explore', label: 'Explore', icon: '🌌', desc: 'Discover new concepts & topics' },
    { id: 'learn', label: 'Learn', icon: '📖', desc: 'In-depth NCERT textbook explanations' },
    { id: 'practice', label: 'Practice', icon: '✍️', desc: 'Step-by-step problem solving' },
    { id: 'revise', label: 'Revise', icon: '🧠', desc: 'Quick summary & key memory facts' },
  ];

  let statusBg = 'bg-[#10b981] shadow-[0_0_8px_#10b981]';
  if (status.isWakingUp) {
    statusBg = 'bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]';
  } else if (!status.isAvailable) {
    statusBg = 'bg-[#ef4444] shadow-[0_0_8px_#ef4444]';
  }

  return (
    <header className="w-full bg-neutral-950/80 backdrop-blur-md border-b border-neutral-850 px-[70px] py-4 flex flex-wrap items-center justify-between gap-4 z-40">
      {/* Brand Identity matching Landing Page */}
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded bg-blue-600/10 border border-blue-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white">
            auto-automation
          </span>
          <span className="text-[10px] text-neutral-500 font-bold">•</span>
          <span className="text-[11px] font-black uppercase tracking-[0.3em] text-neutral-400">
            Vidya Lab
          </span>
        </div>
      </div>

      {/* Learning Mode Switcher - Frosted & Minimal */}
      <div className="flex items-center bg-neutral-900/60 border border-neutral-800 p-1 rounded-2xl gap-1 backdrop-blur-md">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              title={m.desc}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white text-black shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Session Stats & Backend Status */}
      <div className="flex items-center gap-3">
        {/* Session Stats Counter */}
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 font-mono">
          <span>
            Questions: <strong className="text-white font-bold">{stats.questionsAsked}</strong>
          </span>
          <span className="text-neutral-700">•</span>
          <span>
            Topics: <strong className="text-white font-bold">{stats.topicsExplored}</strong>
          </span>
        </div>

        {/* Backend Status Dot */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
          <div className={`w-2 h-2 rounded-full animate-pulse ${statusBg}`} />
          <span className="text-[11px] text-neutral-300 font-medium hidden lg:inline">
            {status.isWakingUp ? 'ZeroGPU Waking Up' : 'ZeroGPU Online'}
          </span>
        </div>
      </div>
    </header>
  );
}
