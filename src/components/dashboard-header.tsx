import Link from 'next/link';

export default function DashboardHeader() {
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
        <div className="hidden sm:flex items-center gap-1 ml-8">
          {['Dashboard', 'Feedback', 'Workflows', 'Settings'].map((item, i) => (
            <button
              key={item}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                i === 0
                  ? 'bg-white/[0.08] text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href="/habitos"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors border border-white/[0.06]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          HabitOS
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-xs font-medium text-emerald-400">Live</span>
          <span className="text-xs text-zinc-500">Threads connected</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black">
          JD
        </div>
      </div>
    </header>
  );
}
