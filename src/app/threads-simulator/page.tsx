'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLumin } from '@/lib/lumin-context';

interface Comment {
  id: string;
  username: string;
  avatar: string;
  content: string;
  likes: number;
  liked: boolean;
  time: string;
  fedToLumin: boolean;
}

const INITIAL_COMMENTS: Comment[] = [
  { id: 'c1', username: 'sarah.dev', avatar: 'SD', content: 'Would love dark mode support in HabitOS! My eyes are begging you 🙏', likes: 3, liked: false, time: '2m ago', fedToLumin: true },
  { id: 'c2', username: 'mike.codes', avatar: 'MC', content: 'Dark mode would be a game changer for late night coding sessions', likes: 1, liked: false, time: '5m ago', fedToLumin: true },
  { id: 'c3', username: 'julia.fyi', avatar: 'JF', content: '+1 for dark mode. Every modern app needs it.', likes: 2, liked: false, time: '8m ago', fedToLumin: true },
];

export default function ThreadsSimulator() {
  const { addFeedback } = useLumin();
  const [threadComments, setThreadComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [showAlert, setShowAlert] = useState<string | null>(null);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `comment_${Date.now()}`,
      username: 'you',
      avatar: 'YO',
      content: newComment.trim(),
      likes: 0,
      liked: false,
      time: 'Just now',
      fedToLumin: false,
    };
    setThreadComments((prev) => [comment, ...prev]);
    setNewComment('');
  };

  const handleLike = (commentId: string) => {
    setThreadComments((prev) =>
      prev.map((c) => {
        if (c.id !== commentId) return c;
        const newLiked = !c.liked;
        const newLikes = newLiked ? c.likes + 1 : c.likes - 1;

        // When a comment goes from 0 to 1 likes, feed it to Lumin
        if (newLikes >= 1 && !c.fedToLumin && !c.liked) {
          addFeedback(c.username, c.avatar, c.content);
          setShowAlert(`"${c.content.slice(0, 40)}..." → Lumin`);
          setTimeout(() => setShowAlert(null), 3000);
          return { ...c, likes: newLikes, liked: newLiked, fedToLumin: true };
        }

        return { ...c, likes: newLikes, liked: newLiked };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#101011] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#101011]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
            Lumin
          </Link>
          <span className="text-sm font-semibold">Threads Simulator</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Thread Post */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-sm font-bold text-white">
              HK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">habitkit.app</span>
                <span className="text-xs text-zinc-500">@habitos · 10m ago</span>
              </div>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed mb-1">
            We&apos;re building HabitOS to help you build better routines. What features would you love to see? Drop your suggestions below! 🚀
          </p>
          <p className="text-xs text-zinc-600 mb-4">
            Your feedback goes directly to our team — and we ship fast.
          </p>
          <div className="flex items-center gap-6 text-zinc-500 text-sm">
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-red-400">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              12
            </span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {threadComments.length}
            </span>
          </div>
        </div>

        {/* Alert */}
        {showAlert && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm animate-slide-up">
            {showAlert}
          </div>
        )}

        {/* Comment Input */}
        <div className="flex gap-3 mb-6">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
            YO
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Add a comment as a test user..."
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-white/[0.15]"
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white hover:bg-white/[0.1] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Post
            </button>
          </div>
        </div>

        {/* Comments */}
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Comments</h3>
        <div className="space-y-3">
          {threadComments.map((comment) => (
            <div
              key={comment.id}
              className="group bg-white/[0.02] border border-white/[0.05] rounded-xl p-4 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300 flex-shrink-0 ring-1 ring-white/10">
                  {comment.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{comment.username}</span>
                    <span className="text-xs text-zinc-500">{comment.time}</span>
                    {comment.fedToLumin && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        in Lumin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{comment.content}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-3 pl-11">
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                    comment.liked ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={comment.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {comment.likes > 0 && comment.likes}
                </button>
                {!comment.fedToLumin && (
                  <span className="text-[10px] text-zinc-600">
                    +1 like needed to feed to Lumin
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <p className="text-xs text-zinc-500 leading-relaxed">
            <span className="text-amber-400 font-medium">How it works:</span> Add a comment → Like it (heart) → It appears in the Lumin Dashboard as feedback → Feedback gets clustered → Click Approve → Lumin builds the feature and opens a PR.
          </p>
        </div>
      </main>
    </div>
  );
}
