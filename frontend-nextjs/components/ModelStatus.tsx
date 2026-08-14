'use client';

import { BackendStatus } from '@/lib/types';

interface ModelStatusProps {
  status: BackendStatus;
}

export default function ModelStatus({ status }: ModelStatusProps) {
  let indicatorBg = 'bg-[#10b981] shadow-[0_0_10px_#10b981]';
  if (status.isWakingUp) {
    indicatorBg = 'bg-[#f59e0b] shadow-[0_0_10px_#f59e0b]';
  } else if (!status.isAvailable) {
    indicatorBg = 'bg-[#ef4444] shadow-[0_0_10px_#ef4444]';
  }

  return (
    <header className="chat-header p-5 border-b border-white/10 bg-[#0f172a]/60">
      <div className="model-info flex items-center gap-3">
        <div className={`status-indicator w-2.5 h-2.5 rounded-full animate-pulse ${indicatorBg}`} />
        <h1 className="text-xl font-semibold bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent tracking-tight">
          Vidya 1.7B
        </h1>
      </div>
      <p className="subtitle text-xs text-[#94a3b8] mt-1 ml-[22px]">
        {status.isWakingUp
          ? 'Vidya is waking up on ZeroGPU...'
          : 'Multilingual NCERT Educational Companion • Hugging Face ZeroGPU'}
      </p>
    </header>
  );
}
