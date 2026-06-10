'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard-header';
import FeedbackPanel from '@/components/feedback-panel';
import RequestsPanel from '@/components/requests-panel';
import PRPanel from '@/components/pr-panel';
import { useLumin } from '@/lib/lumin-context';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { feedback, requests, pullRequests, connectedSite, setConnectedSite } = useLumin();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-orange-500 opacity-80 blur-[2px] animate-pulse" />
            <div className="absolute inset-[3px] rounded-[8px] bg-black flex items-center justify-center">
              <span className="text-lg font-bold text-amber-300">L</span>
            </div>
          </div>
          <span className="text-sm text-zinc-500 animate-pulse">Loading Lumin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-amber-500/[0.03] rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-amber-400/[0.02] rounded-full blur-[100px] translate-y-1/2" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.03)_0%,_transparent_70%)]" />
      </div>

      <DashboardHeader />

      <main className="flex-1 relative z-10 p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-5rem)]">
          <div
            className="animate-slide-up opacity-0"
            style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}
          >
            <FeedbackPanel feedback={feedback} />
          </div>
          <div
            className="animate-slide-up opacity-0"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <RequestsPanel requests={requests} />
          </div>
          <div
            className="animate-slide-up opacity-0"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            <PRPanel pullRequests={pullRequests} />
          </div>
        </div>
      </main>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-xs text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Supabase pgvector
          </span>
          <span className="text-zinc-700">|</span>
          <span>{connectedSite} connected</span>
          <span className="text-zinc-700">|</span>
          <span>TrueFoundry</span>
          <span className="text-zinc-700">|</span>
          <span>OpenCode</span>
        </div>
      </div>
    </div>
  );
}
