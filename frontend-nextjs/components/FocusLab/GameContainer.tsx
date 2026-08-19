'use client';

import { useState, useEffect } from 'react';
import { Question, MemoryGridConfig, GameState } from '@/lib/focus/types';
import { motion, AnimatePresence } from 'framer-motion';
import FocusTimer from './FocusTimer';
import MemoryMatrix from './MemoryMatrix';
import FocusOrb from './FocusOrb';

interface GameContainerProps {
  gameState: GameState;
  currentQuestion?: Question;
  memoryConfig?: MemoryGridConfig;
  onAnswer: (userAnswer: string, isCorrect: boolean, responseTimeMs: number) => void;
  onMemoryComplete: (isCorrect: boolean, responseTimeMs: number) => void;
  onPause: () => void;
}

export default function GameContainer({
  gameState,
  currentQuestion,
  memoryConfig,
  onAnswer,
  onMemoryComplete,
  onPause,
}: GameContainerProps) {
  const [startTime, setStartTime] = useState<number>(Date.now());

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestion, memoryConfig]);

  // Keyboard navigation shortcuts (1-4 for options, Esc to pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.status !== 'playing') return;

      if (e.key === 'Escape') {
        onPause();
        return;
      }

      if (currentQuestion && currentQuestion.options) {
        const optionIndex = parseInt(e.key, 10) - 1;
        if (optionIndex >= 0 && optionIndex < currentQuestion.options.length) {
          const selectedOption = currentQuestion.options[optionIndex];
          const responseTime = Date.now() - startTime;
          const isCorrect = selectedOption === currentQuestion.correctAnswer;
          onAnswer(selectedOption, isCorrect, responseTime);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, currentQuestion, startTime, onAnswer, onPause]);

  const handleOptionClick = (option: string) => {
    if (!currentQuestion) return;
    const responseTime = Date.now() - startTime;
    const isCorrect = option === currentQuestion.correctAnswer;
    onAnswer(option, isCorrect, responseTime);
  };

  const handleMemoryFinish = (userSelections: number[]) => {
    if (!memoryConfig) return;
    const responseTime = Date.now() - startTime;
    const expected = [...memoryConfig.highlightedCells].sort((a, b) => a - b);
    const actual = [...userSelections].sort((a, b) => a - b);
    const isCorrect =
      expected.length === actual.length && expected.every((val, idx) => val === actual[idx]);

    onMemoryComplete(isCorrect, responseTime);
  };

  const orbStatus =
    gameState.lastAnswerResult === 'correct'
      ? 'correct'
      : gameState.lastAnswerResult === 'incorrect'
      ? 'incorrect'
      : 'idle';

  return (
    <div className="w-full max-w-[620px] mx-auto flex flex-col gap-6 select-none relative">
      {/* Top Header Bar inside Game: Mode Badge, Focus Orb, Pause Button */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#38bdf8] bg-[#38bdf8]/10 px-3 py-1 rounded-full border border-[#38bdf8]/20">
            {gameState.mode} • {gameState.difficulty}
          </span>
        </div>

        {/* Ambient Focus Orb */}
        <FocusOrb status={orbStatus} size="sm" />

        {/* Pause Button */}
        <button
          onClick={onPause}
          className="text-xs font-semibold px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 transition-colors cursor-pointer"
        >
          Pause (Esc)
        </button>
      </div>

      {/* Timer Bar */}
      <FocusTimer
        timeRemaining={gameState.timeRemaining}
        totalDuration={gameState.duration}
      />

      {/* Feedback Alert Toast */}
      <AnimatePresence mode="wait">
        {gameState.lastAnswerResult && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`py-1.5 px-4 rounded-xl text-center text-xs font-bold transition-all ${
              gameState.lastAnswerResult === 'correct'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
            }`}
          >
            {gameState.lastAnswerResult === 'correct' ? '✓ Correct' : 'Not quite.'}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Challenge Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#111111] border border-white/10 shadow-2xl flex flex-col items-center justify-center min-h-[260px]">
        {gameState.mode === 'memory' && memoryConfig ? (
          <MemoryMatrix config={memoryConfig} onComplete={handleMemoryFinish} />
        ) : currentQuestion ? (
          <div className="w-full flex flex-col items-center text-center gap-6">
            {/* Category / Sub-tag */}
            {currentQuestion.category && (
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 bg-white/5 px-2.5 py-0.5 rounded-md">
                {currentQuestion.category}
              </span>
            )}

            {/* Question Text */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
              {currentQuestion.question}
            </h2>

            {/* Options Grid */}
            {currentQuestion.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-2">
                {currentQuestion.options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionClick(opt)}
                    className="p-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 text-white font-semibold text-sm sm:text-base text-center transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span className="text-[10px] font-mono text-neutral-400 group-hover:text-white bg-white/5 px-2 py-0.5 rounded">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-center truncate">{opt}</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
