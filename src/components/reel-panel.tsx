'use client';

import { useState } from 'react';
import { useLumin } from '@/lib/lumin-context';

export default function ReelPanel() {
  const { addFeedback } = useLumin();
  const [reelUrl, setReelUrl] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [testComments, setTestComments] = useState<{ id: string; text: string; likes: number; liked: boolean; fed: boolean }[]>([]);

  const loadReel = () => {
    const match = reelUrl.match(/\/p\/([^/?#]+)/) || reelUrl.match(/\/reel\/([^/?#]+)/);
    if (match) {
      setShortcode(match[1]);
    }
  };

  const addComment = () => {
    if (!commentInput.trim()) return;
    setTestComments((prev) => [
      { id: `c_${Date.now()}`, text: commentInput.trim(), likes: 0, liked: false, fed: false },
      ...prev,
    ]);
    setCommentInput('');
  };

  const heartComment = (id: string) => {
    setTestComments((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newLikes = c.liked ? c.likes - 1 : c.likes + 1;
        const newLiked = !c.liked;

        // Feed to Lumin on first like
        if (!c.fed && newLiked && newLikes >= 1) {
          addFeedback('instagram_user', 'IG', c.text);
        }

        return { ...c, likes: newLikes, liked: newLiked, fed: c.fed || (newLiked && newLikes >= 1) };
      })
    );
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h2 className="text-sm font-semibold text-white">Instagram Reel Monitor</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Paste a real reel URL to monitor</p>
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={reelUrl}
            onChange={(e) => setReelUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadReel()}
            placeholder="https://www.instagram.com/reel/..."
            className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.1] text-xs text-white placeholder-zinc-500 outline-none focus:border-white/[0.2]"
          />
          <button
            onClick={loadReel}
            disabled={!reelUrl.trim()}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-medium hover:bg-amber-500/20 disabled:opacity-30 transition-colors cursor-pointer"
          >
            Load
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {shortcode && (
          <div className="bg-black">
            <iframe
              src={`https://www.instagram.com/p/${shortcode}/embed/`}
              className="w-full aspect-[9/16] max-h-[460px]"
              allowFullScreen
            />
          </div>
        )}

        {!shortcode && (
          <div className="text-center py-10 px-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 text-zinc-600">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <p className="text-sm text-zinc-500">Paste an Instagram Reel URL above</p>
            <p className="text-xs text-zinc-600 mt-1">The reel will load here. Then test comments below.</p>
          </div>
        )}

        {/* Test comments */}
        <div className="px-4 py-3 border-t border-white/[0.06]">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addComment()}
              placeholder="Add a test comment..."
              className="flex-1 px-3 py-2 rounded-lg bg-white/[0.06] border border-white/[0.1] text-xs text-white placeholder-zinc-500 outline-none focus:border-white/[0.2]"
            />
            <button
              onClick={addComment}
              disabled={!commentInput.trim()}
              className="px-3 py-2 rounded-lg bg-white/[0.06] text-xs text-white font-medium hover:bg-white/[0.1] disabled:opacity-30 transition-colors cursor-pointer"
            >
              Post
            </button>
          </div>

          <div className="space-y-2">
            {testComments.map((c) => (
              <div key={c.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/[0.03]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-300 flex-shrink-0 ring-1 ring-white/10">
                  IG
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300">{c.text}</p>
                  <button
                    onClick={() => heartComment(c.id)}
                    className={`flex items-center gap-1 mt-1 text-[10px] transition-colors cursor-pointer ${
                      c.liked ? 'text-red-400' : 'text-zinc-600 hover:text-red-400'
                    }`}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill={c.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    {c.likes}
                  </button>
                </div>
                {c.fed && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                    in pipeline
                  </span>
                )}
              </div>
            ))}
            {testComments.length === 0 && shortcode && (
              <p className="text-xs text-zinc-600 text-center py-4">
                Add a test comment, then heart it to feed to Lumin
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
