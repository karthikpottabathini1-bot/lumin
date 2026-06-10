'use client';

import Link from 'next/link';
import { useLumin } from '@/lib/lumin-context';
import { useState } from 'react';

export default function DashboardHeader() {
  const { connectedSite, setConnectedSite } = useLumin();
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(connectedSite);

  const saveSite = () => {
    if (input.trim()) setConnectedSite(input.trim());
    setEditing(false);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-black/40 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-300 via-amber-500 to-orange-500 opacity-80 blur-[1px]" />
            <div className="absolute inset-[2px] rounded-[6px] bg-black flex items-center justify-center">
              <span className="text-sm font-bold text-amber-300">L</span>
            </div>
          </Link>
          <span className="text-lg font-semibold tracking-tight text-white">Lumin</span>
        </div>
        <div className="hidden sm:flex items-center gap-1 ml-4">
          <span className="text-xs text-zinc-600 mr-1">monitoring</span>
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveSite(); if (e.key === 'Escape') setEditing(false); }}
                className="px-2 py-1 rounded bg-white/[0.06] border border-white/[0.1] text-xs text-white outline-none w-32"
                autoFocus
              />
              <button onClick={saveSite} className="text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer">save</button>
            </div>
          ) : (
            <button
              onClick={() => { setInput(connectedSite); setEditing(true); }}
              className="px-2 py-1 rounded text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              {connectedSite}
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-xs font-medium text-emerald-400">Live</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black">
          JD
        </div>
      </div>
    </header>
  );
}
