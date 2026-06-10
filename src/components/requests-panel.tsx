'use client';

import { ClusteredRequest } from '@/lib/types';
import { useLumin } from '@/lib/lumin-context';

function DemandScore({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-white/[0.06]"
        />
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-all duration-1000 ease-out ${
            score >= 80
              ? 'text-amber-400'
              : score >= 50
                ? 'text-amber-500/70'
                : 'text-zinc-500'
          }`}
          style={{ filter: score >= 80 ? 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.4))' : 'none' }}
        />
      </svg>
      <span className="absolute text-xs font-bold text-white">{score}</span>
    </div>
  );
}

function RequestCard({ request, index }: { request: ClusteredRequest; index: number }) {
  const { approveRequest } = useLumin();

  return (
    <div
      className="group flex gap-4 p-4 rounded-xl transition-all duration-300 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <DemandScore score={request.demandScore} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-white">{request.title}</h3>
          {request.status === 'approved' && (
            <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Approved
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed mb-2 line-clamp-2">
          {request.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {request.feedbackSamples.slice(0, 2).map((sample, i) => (
            <span
              key={i}
              className="inline-block px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.04] text-[11px] text-zinc-500 leading-relaxed max-w-[280px] truncate"
            >
              &ldquo;{sample}&rdquo;
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4-4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="text-xs text-zinc-500">{request.feedbackCount} requests</span>
          </div>
          {request.status === 'approved' ? (
            <span className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Pipeline running...
            </span>
          ) : (
            <button
              onClick={() => approveRequest(request.id)}
              className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/30 transition-all duration-200 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] cursor-pointer"
            >
              Approve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RequestsPanel({ requests }: { requests: ClusteredRequest[] }) {
  const sorted = [...requests].sort((a, b) => b.demandScore - a.demandScore);

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h2 className="text-sm font-semibold text-white">Prioritized Requests</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Ranked by Community Demand Score</p>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
          {requests.length} clusters
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-thin">
        {sorted.map((request, i) => (
          <RequestCard key={request.id} request={request} index={i} />
        ))}
      </div>
      <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.01]">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          Updated 30s ago via pgvector clustering
        </div>
      </div>
    </div>
  );
}
