'use client';

import SplashScreen from '@/components/SplashScreen';
import Chat from '@/components/Chat/Chat';

export default function Home() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e1b4b]">
      <SplashScreen />
      <Chat />
    </main>
  );
}
