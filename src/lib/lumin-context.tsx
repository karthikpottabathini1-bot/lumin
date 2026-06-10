'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { Feedback, ClusteredRequest, PullRequest, PRStep, PRStatus } from './types';
import { mockData } from './mock-data';

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function todayStr() {
  return new Date().toISOString();
}

interface LuminContextType {
  feedback: Feedback[];
  requests: ClusteredRequest[];
  pullRequests: PullRequest[];
  connectedSite: string;
  setConnectedSite: (url: string) => void;
  approveRequest: (requestId: string) => PullRequest | null;
  getRequestById: (id: string) => ClusteredRequest | undefined;
  getPRById: (id: string) => PullRequest | undefined;
}

const LuminContext = createContext<LuminContextType | null>(null);

const PIPELINE_STEPS: { step: PRStep; label: string; delay: number }[] = [
  { step: 'repo_analysis', label: 'Repo Analysis', delay: 1500 },
  { step: 'implementation_plan', label: 'Implementation Plan', delay: 2000 },
  { step: 'code_generation', label: 'Code Generation', delay: 2800 },
  { step: 'test_creation', label: 'Test Creation', delay: 1800 },
  { step: 'test_execution', label: 'Test Execution', delay: 2200 },
  { step: 'pr_creation', label: 'PR Creation', delay: 1500 },
];

export function LuminProvider({ children }: { children: ReactNode }) {
  const [feedback] = useState<Feedback[]>(mockData.feedback);
  const [requests, setRequests] = useState<ClusteredRequest[]>(mockData.requests);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>(mockData.pullRequests);
  const [connectedSite, setConnectedSite] = useState<string>('HabitOS');

  const approveRequest = useCallback(
    (requestId: string): PullRequest | null => {
      const request = requests.find((r) => r.id === requestId);
      if (!request || request.status === 'approved') return null;

      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' as const } : r))
      );

      const pr: PullRequest = {
        id: generateId(),
        requestId,
        title: `feat: Add ${request.title}`,
        branch: `feat/${request.title.toLowerCase().replace(/\s+/g, '-')}`,
        repo: 'habitos',
        status: 'planning',
        currentStep: 'repo_analysis',
        completedSteps: [],
        issueUrl: `https://github.com/habitos/habitos/issues/${Math.floor(Math.random() * 200 + 50)}`,
        prUrl: null,
        diffStats: { additions: 0, deletions: 0, filesChanged: 0 },
        testResults: { passed: 0, failed: 0, total: 0 },
        createdAt: todayStr(),
      };

      setPullRequests((prev) => [pr, ...prev]);

      simulatePipeline(pr.id);

      // Call the real pipeline API in the background
      fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestTitle: request.title }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.prUrl) {
            setPullRequests((prev) =>
              prev.map((p) =>
                p.id === pr.id
                  ? { ...p, prUrl: data.prUrl, branch: data.branch, status: 'ready' as const }
                  : p
              )
            );
          }
        })
        .catch((err) => console.log('[Lumin] Pipeline API call failed:', err));

      return pr;
    },
    [requests]
  );

  const simulatePipeline = useCallback((prId: string) => {
    let i = 0;

    const advance = () => {
      if (i >= PIPELINE_STEPS.length) return;

      const stepDef = PIPELINE_STEPS[i];

      setTimeout(() => {
        setPullRequests((prev) => {
          const pr = prev.find((p) => p.id === prId);
          if (!pr) return prev;

          const completedSteps = [...pr.completedSteps, stepDef.step];
          const isLast = i === PIPELINE_STEPS.length - 1;
          const nextStep = isLast ? 'pr_creation' : PIPELINE_STEPS[i + 1]?.step || 'pr_creation';

          let status: PRStatus = pr.status;
          if (i >= 2) status = 'implementing';
          if (i >= 4) status = 'testing';
          if (isLast) status = 'ready';

          const updates: Partial<PullRequest> = {
            completedSteps,
            currentStep: isLast ? 'pr_creation' : nextStep,
            status,
          };

          if (stepDef.step === 'code_generation') {
            updates.diffStats = {
              additions: Math.floor(Math.random() * 600 + 100),
              deletions: Math.floor(Math.random() * 50 + 5),
              filesChanged: Math.floor(Math.random() * 10 + 3),
            };
          }

          if (stepDef.step === 'test_execution') {
            const total = Math.floor(Math.random() * 20 + 15);
            const failed = Math.random() > 0.3 ? 0 : Math.floor(Math.random() * 3 + 1);
            updates.testResults = {
              total,
              passed: total - failed,
              failed,
            };
          }

          if (isLast) {
            updates.prUrl = `https://github.com/habitos/habitos/pull/${Math.floor(Math.random() * 200 + 70)}`;
          }

          return prev.map((p) => (p.id === prId ? { ...p, ...updates } : p));
        });

        i++;
        advance();
      }, stepDef.delay);
    };

    advance();
  }, []);

  const getRequestById = useCallback(
    (id: string) => requests.find((r) => r.id === id),
    [requests]
  );

  const getPRById = useCallback(
    (id: string) => pullRequests.find((p) => p.id === id),
    [pullRequests]
  );

  return (
    <LuminContext.Provider
      value={{
        feedback,
        requests,
        pullRequests,
        connectedSite,
        setConnectedSite,
        approveRequest,
        getRequestById,
        getPRById,
      }}
    >
      {children}
    </LuminContext.Provider>
  );
}

export function useLumin() {
  const ctx = useContext(LuminContext);
  if (!ctx) throw new Error('useLumin must be used within LuminProvider');
  return ctx;
}
