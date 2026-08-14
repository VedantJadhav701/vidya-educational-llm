'use client';

import SplashScreen from '@/components/SplashScreen';
import Chat from '@/components/Chat/Chat';

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[#070a14] flex flex-col relative overflow-hidden">
      <SplashScreen />
      <Chat />
    </main>
  );
}
