import { NextResponse } from 'next/server';

export async function GET() {
  // Initialize if not present
  if (!(global as any).statsStore) {
    (global as any).statsStore = {
      totalQuestions: 1420,
      activeSessions: new Map<string, number>(),
    };
  }

  const statsStore = (global as any).statsStore;
  const now = Date.now();

  // Prune sessions older than 5 minutes (300,000 ms)
  for (const [sid, timestamp] of statsStore.activeSessions.entries()) {
    if (now - timestamp > 300000) {
      statsStore.activeSessions.delete(sid);
    }
  }

  // Provide a minor dynamic fluctuation baseline for simulation, but reflect real sessions
  const realActiveCount = statsStore.activeSessions.size;
  const baseFluctuation = 7 + (Math.floor(now / 15000) % 5); // Fluctuate between 7 and 11
  const onlineUsers = Math.max(baseFluctuation, realActiveCount);

  return NextResponse.json({
    totalQuestions: statsStore.totalQuestions,
    onlineUsers,
  });
}
