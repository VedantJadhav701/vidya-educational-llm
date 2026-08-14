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
    <header className="w-full bg-[#0b0f19]/80 backdrop-blur-md border-b border-white/10 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 z-40">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#a855f7] via-[#6366f1] to-[#ec4899] flex items-center justify-center text-lg text-white font-bold shadow-lg shadow-[#a855f7]/20">
          🎓
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-tight text-white">VIDYA</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/20">
              Learning Lab
            </span>
          </div>
          <span className="text-[11px] text-[#94a3b8] font-medium hidden sm:inline">
            Learn. Explore. Understand.
          </span>
        </div>
      </div>

      {/* Learning Mode Switcher */}
      <div className="flex items-center bg-[#1e293b]/70 border border-white/10 p-1 rounded-2xl gap-1">
        {modes.map((m) => {
          const isActive = currentMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              title={m.desc}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white shadow-md'
                  : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
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
        <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#94a3b8]">
          <span>
            Questions: <strong className="text-white">{stats.questionsAsked}</strong>
          </span>
          <span className="text-white/20">•</span>
          <span>
            Topics: <strong className="text-white">{stats.topicsExplored}</strong>
          </span>
        </div>

        {/* Backend Status Dot */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0b0f19] border border-white/10 text-xs">
          <div className={`w-2 h-2 rounded-full animate-pulse ${statusBg}`} />
          <span className="text-[11px] text-[#cbd5e1] font-medium hidden lg:inline">
            {status.isWakingUp ? 'ZeroGPU Waking Up' : 'ZeroGPU Online'}
          </span>
        </div>
      </div>
    </header>
  );
}
