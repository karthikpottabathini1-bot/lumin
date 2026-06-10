'use client';

import Link from 'next/link';
import { useLumin } from '@/lib/lumin-context';
import { useState, useEffect } from 'react';

export default function DashboardHeader() {
  const { connectedSite, setConnectedSite, redditPostUrl, setRedditPostUrl } = useLumin();
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(connectedSite);
  const [showRedditInput, setShowRedditInput] = useState(false);
  const [redditInput, setRedditInput] = useState(redditPostUrl);

  const saveSite = () => {
    if (input.trim()) setConnectedSite(input.trim());
    setEditing(false);
  };

  const saveRedditUrl = () => {
    if (redditInput.trim()) setRedditPostUrl(redditInput.trim());
    setShowRedditInput(false);
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
              <button onClick={saveSite} className="text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer">
                save
              </button>
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
        {showRedditInput ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={redditInput}
              onChange={(e) => setRedditInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') saveRedditUrl(); if (e.key === 'Escape') setShowRedditInput(false); }}
              placeholder="https://reddit.com/r/.../comments/..."
              className="px-2 py-1.5 rounded bg-white/[0.06] border border-white/[0.1] text-xs text-white outline-none w-72"
              autoFocus
            />
            <button onClick={saveRedditUrl} className="text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer">
              save
            </button>
            <button onClick={() => setShowRedditInput(false)} className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer">
              cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => { setRedditInput(redditPostUrl); setShowRedditInput(true); }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              redditPostUrl
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                : 'bg-white/[0.04] text-zinc-400 border border-white/[0.06] hover:bg-white/[0.08]'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.74c.69 0 1.25.56 1.25 1.25a1.25 1.25 0 0 1-2.5 0c0-.69.56-1.25 1.25-1.25zm-5.01.77a6.01 6.01 0 0 1 6.01 6.01c0 3.32-2.69 6.01-6.01 6.01A6.01 6.01 0 0 1 6 11.52a6.01 6.01 0 0 1 6.01-6.01zM12 8.03c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm-3.5 3.5c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5-3.5-1.57-3.5-3.5z"/>
            </svg>
            {redditPostUrl ? 'Reddit connected' : 'Connect Reddit'}
          </button>
        )}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black">
          JD
        </div>
      </div>
    </header>
  );
}
