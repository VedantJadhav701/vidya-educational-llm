'use client';

import { Suspense } from 'react';
import Chat from '@/components/Chat/Chat';

export default function PlaygroundPage() {
  return (
    <main className="w-full min-h-screen bg-[#070a14] flex flex-col relative overflow-hidden">
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center bg-[#070a14] text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#a855f7] mx-auto mb-4"></div>
            <p className="text-sm font-semibold tracking-wide text-[#cbd5e1]">Loading Vidya Playground...</p>
          </div>
        </div>
      }>
        <Chat />
      </Suspense>
    </main>
  );
}
