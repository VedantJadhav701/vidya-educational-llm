'use client';

import { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing Neural Pathways...');
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const loadingMessages = [
      'Initializing Neural Pathways...',
      'Loading Educational Modules...',
      'Calibrating Knowledge Base...',
      'Ready to Learn!',
    ];

    let currentProgress = 0;
    let messageIndex = 0;

    const interval = setInterval(() => {
      currentProgress += Math.random() * 18 + 5;
      if (currentProgress > 100) currentProgress = 100;

      setProgress(currentProgress);

      if (currentProgress > 25 && messageIndex === 0) {
        messageIndex++;
        setLoadingText(loadingMessages[messageIndex]);
      } else if (currentProgress > 60 && messageIndex === 1) {
        messageIndex++;
        setLoadingText(loadingMessages[messageIndex]);
      } else if (currentProgress >= 100 && messageIndex === 2) {
        messageIndex++;
        setLoadingText(loadingMessages[messageIndex]);
        clearInterval(interval);

        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            setIsVisible(false);
            onComplete?.();
          }, 800);
        }, 500);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      id="splash-screen"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] transition-opacity duration-800 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="splash-content text-center flex flex-col items-center animate-splashIn">
        <div className="edu-icon text-[#a855f7] mb-5 animate-float">
          <svg
            viewBox="0 0 24 24"
            width="64"
            height="64"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <h1 className="splash-title text-5xl font-semibold mb-2.5 bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
          Vidya
        </h1>
        <p className="splash-subtitle text-[#94a3b8] text-lg mb-10">
          Your Interactive Educational Companion
        </p>
        <div className="progress-container w-[300px] h-[6px] bg-white/10 rounded-full overflow-hidden mb-4">
          <div
            className="progress-bar h-full bg-gradient-to-r from-[#a855f7] to-[#ec4899] rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="loading-text text-[#cbd5e1] text-sm font-medium">{loadingText}</p>
      </div>
    </div>
  );
}
