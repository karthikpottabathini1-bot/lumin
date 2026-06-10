import { PullRequest } from '@/lib/types';

const stepLabels: Record<PullRequest['currentStep'] | PullRequest['completedSteps'][number], string> = {
  repo_analysis: 'Repo Analysis',
  implementation_plan: 'Implementation Plan',
  code_generation: 'Code Generation',
  test_creation: 'Test Creation',
  test_execution: 'Test Execution',
  pr_creation: 'PR Creation',
};

const allSteps: PullRequest['currentStep'][] = [
  'repo_analysis',
  'implementation_plan',
  'code_generation',
  'test_creation',
  'test_execution',
  'pr_creation',
];

const statusConfig: Record<PullRequest['status'], { label: string; className: string }> = {
  planning: { label: 'Planning', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  implementing: { label: 'Implementing', className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  testing: { label: 'Testing', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  ready: { label: 'Ready', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  merged: { label: 'Merged', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
};

function PRCard({ pr }: { pr: PullRequest }) {
  const config = statusConfig[pr.status];

  return (
    <div className="group p-4 rounded-xl transition-all duration-300 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.className}`}>
              {config.label}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white truncate">{pr.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-zinc-500">{pr.repo}</span>
            <span className="text-zinc-600">/</span>
            <code className="text-[11px] text-zinc-500 font-mono bg-white/[0.03] px-1.5 py-0.5 rounded">
              {pr.branch}
            </code>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        {allSteps.map((step) => {
          const isCompleted = pr.completedSteps.includes(step);
          const isCurrent = pr.currentStep === step;
          return (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : isCurrent
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-white/[0.04] text-zinc-700'
                }`}
              >
                {isCompleted ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : isCurrent ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                ) : (
                  <div className="w-1 h-1 rounded-full bg-current" />
                )}
              </div>
              <span
                className={`text-[11px] ${
                  isCompleted
                    ? 'text-zinc-500'
                    : isCurrent
                      ? 'text-amber-400 font-medium'
                      : 'text-zinc-600'
                }`}
              >
                {stepLabels[step]}
              </span>
            </div>
          );
        })}
      </div>

      {pr.diffStats.filesChanged > 0 && (
        <div className="flex items-center gap-3 mb-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            +{pr.diffStats.additions}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            -{pr.diffStats.deletions}
          </span>
          <span>{pr.diffStats.filesChanged} files</span>
        </div>
      )}

      {pr.testResults.total > 0 && (
        <div className="flex items-center gap-2 text-xs">
          <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                pr.testResults.failed === 0 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{
                width: `${(pr.testResults.passed / pr.testResults.total) * 100}%`,
              }}
            />
          </div>
          <span className="text-zinc-500 tabular-nums">
            {pr.testResults.passed}/{pr.testResults.total}
          </span>
          {pr.testResults.failed > 0 && (
            <span className="text-red-400">{pr.testResults.failed} fail</span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.04]">
        {pr.issueUrl && (
          <a
            href={pr.issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Issue #{pr.issueUrl.split('/').pop()}
          </a>
        )}
        {pr.prUrl && (
          <a
            href={pr.prUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto px-3 py-1 rounded-lg text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
          >
            View PR
          </a>
        )}
      </div>
    </div>
  );
}

export default function PRPanel({ pullRequests }: { pullRequests: PullRequest[] }) {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div>
          <h2 className="text-sm font-semibold text-white">Generated Pull Requests</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Automated implementation pipeline</p>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
          {pullRequests.length} active
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-thin">
        {pullRequests.map((pr) => (
          <PRCard key={pr.id} pr={pr} />
        ))}
      </div>
      <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.01]">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          Powered by OpenCode
        </div>
      </div>
    </div>
  );
}
