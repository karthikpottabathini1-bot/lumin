'use client';

import { useState, useEffect } from 'react';
import { useLumin } from '@/lib/lumin-context';

interface FeatureReq {
  id: string;
  title: string;
  description: string;
  details: string;
  username: string;
  status: string;
  createdAt: string;
}

export default function FeatureRequestsPanel() {
  const [requests, setRequests] = useState<FeatureReq[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { approveRequest } = useLumin();

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/features');
      const data = await res.json();
      setRequests(data.requests || []);
    } catch {}
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (req: FeatureReq) => {
    try {
      await fetch('/api/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: req.id, status: 'approved' }),
      });
      // Trigger Lumin pipeline
      approveRequest(req.id);
      fetchRequests();
    } catch {}
  };

  const pending = requests.filter((r) => r.status === 'new');

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h2 className="text-sm font-semibold text-white">Feature Requests</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Awaiting your review</p>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
          {pending.length} new
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        {pending.length === 0 ? (
          <div className="text-center py-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-zinc-600">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <p className="text-sm text-zinc-500">No pending requests</p>
            <p className="text-xs text-zinc-600 mt-1">New feature requests from HabitOS will appear here</p>
          </div>
        ) : (
          pending.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-white">{req.title}</h3>
                <span className="text-[10px] text-zinc-500 flex-shrink-0">
                  {new Date(req.createdAt).toLocaleTimeString()}
                </span>
              </div>

              <button
                onClick={() => setExpanded(expanded === req.id ? null : req.id)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-2 cursor-pointer"
              >
                {expanded === req.id ? 'Hide details' : 'View details'}
              </button>

              {expanded === req.id && (
                <div className="text-xs text-zinc-400 bg-white/[0.03] rounded-lg p-3 mb-3 whitespace-pre-wrap leading-relaxed">
                  {req.details}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                <button
                  onClick={() => handleApprove(req)}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
                >
                  Approve
                </button>
                <span className="text-[10px] text-zinc-600">from {req.username}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.01]">
        <p className="text-xs text-zinc-500 text-center">
          {requests.length > 0
            ? `Total: ${requests.length} · Pending: ${pending.length} · Polling every 8s`
            : 'Waiting for requests from HabitOS feedback widget...'}
        </p>
      </div>
    </div>
  );
}
