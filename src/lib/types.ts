export type FeedbackStatus = 'new' | 'clustered' | 'archived';

export type RequestStatus = 'pending' | 'approved' | 'in_progress' | 'completed';

export type PRStatus = 'planning' | 'implementing' | 'testing' | 'ready' | 'merged';

export type PRStep =
  | 'repo_analysis'
  | 'implementation_plan'
  | 'code_generation'
  | 'test_creation'
  | 'test_execution'
  | 'pr_creation';

export interface Feedback {
  id: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: string;
  status: FeedbackStatus;
  threadId: string;
  likes: number;
}

export interface ClusteredRequest {
  id: string;
  title: string;
  description: string;
  feedbackCount: number;
  demandScore: number;
  status: RequestStatus;
  feedbackSamples: string[];
  clusterId: string;
  createdAt: string;
}

export interface PullRequest {
  id: string;
  requestId: string;
  title: string;
  branch: string;
  repo: string;
  status: PRStatus;
  currentStep: PRStep;
  completedSteps: PRStep[];
  issueUrl: string;
  prUrl: string | null;
  diffStats: {
    additions: number;
    deletions: number;
    filesChanged: number;
  };
  testResults: {
    passed: number;
    failed: number;
    total: number;
  };
  createdAt: string;
}

export interface DashboardData {
  feedback: Feedback[];
  requests: ClusteredRequest[];
  pullRequests: PullRequest[];
}
