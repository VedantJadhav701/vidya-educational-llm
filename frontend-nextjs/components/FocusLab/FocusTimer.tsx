'use client';

interface FocusTimerProps {
  timeRemaining: number;
  totalDuration: number;
}

export default function FocusTimer({ timeRemaining, totalDuration }: FocusTimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = Math.max(0, Math.min(100, (timeRemaining / totalDuration) * 100));

  return (
    <div className="w-full flex flex-col gap-2 select-none">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-neutral-400 font-sans text-[11px] uppercase tracking-wider font-semibold">
          Session Countdown
        </span>
        <span className="text-white font-bold text-sm tracking-wider">{formattedTime}</span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 transition-all duration-1000 ease-linear rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
