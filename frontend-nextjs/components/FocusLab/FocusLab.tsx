'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  GameMode,
  Difficulty,
  SessionDuration,
  GameState,
  Question,
  MemoryGridConfig,
  SessionResultData,
  UserFocusStats,
} from '@/lib/focus/types';
import { generateMathQuestion } from '@/lib/focus/math';
import { generatePatternQuestion } from '@/lib/focus/patterns';
import { generateMemoryConfig } from '@/lib/focus/memory';
import { getScienceQuestion } from '@/lib/focus/science';
import { getLogicQuestion } from '@/lib/focus/logic';
import { calculateAnswerScore, calculateFinalFocusScore } from '@/lib/focus/scoring';
import { getStoredFocusStats, saveSessionResult } from '@/lib/focus/storage';

import FocusHeader from './FocusHeader';
import ModeSelector from './ModeSelector';
import GameContainer from './GameContainer';
import SessionResult from './SessionResult';
import FocusOrb from './FocusOrb';

export default function FocusLab() {
  const [stats, setStats] = useState<UserFocusStats>({
    todayFocusScore: 0,
    bestScore: 0,
    sessionsCompleted: 0,
    lastSessionDate: '',
  });

  const [gameState, setGameState] = useState<GameState>({
    mode: 'math',
    difficulty: 'easy',
    duration: 60,
    status: 'idle',
    timeRemaining: 60,
    currentQuestionIndex: 0,
    questionsSolved: 0,
    correctAnswers: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalResponseTimeMs: 0,
    score: 0,
    lastAnswerResult: null,
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(undefined);
  const [memoryConfig, setMemoryConfig] = useState<MemoryGridConfig | undefined>(undefined);
  const [lastResultData, setLastResultData] = useState<SessionResultData | null>(null);

  // Load stored stats on mount
  useEffect(() => {
    setStats(getStoredFocusStats());
  }, []);

  // Helper to fetch/generate next question based on active mode
  const loadNextChallenge = useCallback(
    (mode: GameMode, diff: Difficulty) => {
      setGameState((prev) => ({ ...prev, lastAnswerResult: null }));

      if (mode === 'math') {
        setCurrentQuestion(generateMathQuestion(diff));
      } else if (mode === 'pattern') {
        setCurrentQuestion(generatePatternQuestion(diff));
      } else if (mode === 'science') {
        setCurrentQuestion(getScienceQuestion(diff));
      } else if (mode === 'logic') {
        setCurrentQuestion(getLogicQuestion(diff));
      } else if (mode === 'memory') {
        setMemoryConfig(generateMemoryConfig(diff));
      }
    },
    []
  );

  // Start Session
  const handleStartSession = () => {
    setGameState((prev) => ({
      ...prev,
      status: 'playing',
      timeRemaining: prev.duration,
      currentQuestionIndex: 0,
      questionsSolved: 0,
      correctAnswers: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalResponseTimeMs: 0,
      score: 0,
      lastAnswerResult: null,
    }));
    setLastResultData(null);
    loadNextChallenge(gameState.mode, gameState.difficulty);
  };

  // Timer Tick Loop
  useEffect(() => {
    if (gameState.status !== 'playing') return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timer);
          return { ...prev, timeRemaining: 0, status: 'completed' };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.status]);

  // Complete Session Logic
  useEffect(() => {
    if (gameState.status === 'completed') {
      const accuracy =
        gameState.questionsSolved > 0
          ? Math.round((gameState.correctAnswers / gameState.questionsSolved) * 100)
          : 0;

      const avgSpeedSec =
        gameState.questionsSolved > 0
          ? Number((gameState.totalResponseTimeMs / gameState.questionsSolved / 1000).toFixed(1))
          : 0;

      const finalScore = calculateFinalFocusScore(gameState.score, accuracy, gameState.bestStreak);

      const result: SessionResultData = {
        mode: gameState.mode,
        difficulty: gameState.difficulty,
        score: finalScore,
        accuracy,
        questionsSolved: gameState.questionsSolved,
        correctAnswers: gameState.correctAnswers,
        avgResponseTimeSec: avgSpeedSec,
        bestStreak: gameState.bestStreak,
        date: new Date().toISOString(),
      };

      setLastResultData(result);
      const updatedStats = saveSessionResult(result);
      setStats(updatedStats);
    }
  }, [gameState.status, gameState.score, gameState.questionsSolved, gameState.correctAnswers, gameState.totalResponseTimeMs, gameState.bestStreak, gameState.mode, gameState.difficulty]);

  // Process User Answer
  const handleUserAnswer = (userAns: string, isCorrect: boolean, responseTimeMs: number) => {
    const newStreak = isCorrect ? gameState.currentStreak + 1 : 0;
    const newBestStreak = Math.max(gameState.bestStreak, newStreak);
    const addedScore = isCorrect
      ? calculateAnswerScore(responseTimeMs, gameState.currentStreak, gameState.difficulty)
      : 0;

    setGameState((prev) => ({
      ...prev,
      questionsSolved: prev.questionsSolved + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      totalResponseTimeMs: prev.totalResponseTimeMs + responseTimeMs,
      score: prev.score + addedScore,
      lastAnswerResult: isCorrect ? 'correct' : 'incorrect',
    }));

    // Immediately load next question
    setTimeout(() => {
      loadNextChallenge(gameState.mode, gameState.difficulty);
    }, 300);
  };

  // Process Memory Matrix Complete
  const handleMemoryComplete = (isCorrect: boolean, responseTimeMs: number) => {
    handleUserAnswer(isCorrect ? 'correct' : 'incorrect', isCorrect, responseTimeMs);
  };

  return (
    <main className="w-full min-h-screen bg-[#0c0c0c] text-white flex flex-col justify-between select-none relative font-sans">
      {/* Header */}
      <FocusHeader
        stats={stats}
        isPlaying={gameState.status === 'playing' || gameState.status === 'paused'}
        onExitPlay={() => setGameState((prev) => ({ ...prev, status: 'paused' }))}
      />

      {/* Body Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto">
        {gameState.status === 'idle' && (
          <div className="w-full flex flex-col items-center text-center gap-6">
            {/* Ambient Focus Orb */}
            <FocusOrb status="idle" size="md" />

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase mb-2">
                VIDYA FOCUS LAB
              </h1>
              <p className="text-sm font-semibold text-neutral-300 mb-1">
                "Sharpen your mind. Reset your focus."
              </p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Take a short cognitive challenge before getting back to learning.
              </p>
            </div>

            {/* Mode & Config Selector */}
            <ModeSelector
              selectedMode={gameState.mode}
              onSelectMode={(m) => setGameState((prev) => ({ ...prev, mode: m }))}
              duration={gameState.duration}
              onSelectDuration={(d) => setGameState((prev) => ({ ...prev, duration: d, timeRemaining: d }))}
              difficulty={gameState.difficulty}
              onSelectDifficulty={(diff) => setGameState((prev) => ({ ...prev, difficulty: diff }))}
              onStart={handleStartSession}
            />
          </div>
        )}

        {gameState.status === 'playing' && (
          <GameContainer
            gameState={gameState}
            currentQuestion={currentQuestion}
            memoryConfig={memoryConfig}
            onAnswer={handleUserAnswer}
            onMemoryComplete={handleMemoryComplete}
            onPause={() => setGameState((prev) => ({ ...prev, status: 'paused' }))}
          />
        )}

        {gameState.status === 'completed' && lastResultData && (
          <SessionResult
            result={lastResultData}
            onPlayAgain={handleStartSession}
          />
        )}
      </div>

      {/* PAUSE MODAL */}
      {gameState.status === 'paused' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-[360px] bg-[#111111] border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
            <FocusOrb status="idle" size="sm" />
            <h3 className="text-lg font-bold text-white my-3">Session Paused</h3>
            <p className="text-xs text-neutral-400 mb-6">
              Take a breath. You can resume anytime without penalty.
            </p>
            <div className="flex flex-col gap-2.5 w-full">
              <button
                onClick={() => setGameState((prev) => ({ ...prev, status: 'playing' }))}
                className="w-full py-3 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all cursor-pointer"
              >
                Resume
              </button>
              <button
                onClick={() => setGameState((prev) => ({ ...prev, status: 'idle' }))}
                className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
