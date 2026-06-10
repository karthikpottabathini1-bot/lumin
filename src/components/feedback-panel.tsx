import { Feedback } from '@/lib/types';

function FeedbackCard({ feedback }: { feedback: Feedback }) {
  return (
    <div className="group flex gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300 ring-1 ring-white/10">
        {feedback.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-white">{feedback.username}</span>
          <span className="text-xs text-zinc-500">{feedback.timestamp}</span>
          {feedback.status === 'new' && (
            <span className="ml-auto flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
              New
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">{feedback.content}</p>
      </div>
    </div>
  );
}

export default function FeedbackPanel({ feedback }: { feedback: Feedback[] }) {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h2 className="text-sm font-semibold text-white">Incoming Feedback</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Real-time from Threads</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <span className="text-xs text-zinc-500">{feedback.length} new</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5 scrollbar-thin">
        {feedback.map((item) => (
          <FeedbackCard key={item.id} feedback={item} />
        ))}
      </div>
      <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.01]">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Monitoring 3 Threads posts
        </div>
      </div>
    </div>
  );
}
