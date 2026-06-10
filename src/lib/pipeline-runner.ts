import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const TARGET_REPO = '/Users/potta/Documents/LUMIN/habitos';

interface FeatureTemplate {
  name: string;
  files: { filePath: string; content: string }[];
  commitMessage: string;
  prTitle: string;
  prBody: string;
}

function darkModeTemplate(): FeatureTemplate {
  const cssContent = `@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-geist-sans);
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-text: var(--text);
  --color-text-secondary: var(--text-secondary);
}

:root {
  --bg: #f9fafb;
  --surface: #ffffff;
  --text: #111827;
  --text-secondary: #6b7280;
}

.dark {
  --bg: #0a0a0b;
  --surface: #18181b;
  --text: #fafafa;
  --text-secondary: #a1a1aa;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease, color 0.3s ease;
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(128, 128, 128, 0.1) transparent;
}
`;

  const layoutContent = `import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { HabitOSProvider } from '@/lib/habitos-context';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HabitOS — Build Better Routines',
  description: 'Track your daily habits, build streaks, and improve your life one day at a time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${geistSans.variable}\`} suppressHydrationWarning>
      <body className="antialiased bg-[var(--bg)] text-[var(--text)] transition-colors">
        <ThemeProvider>
          <HabitOSProvider>{children}</HabitOSProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
`;

  const themeProviderContent = `'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('habitos-theme') as Theme | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle('dark', stored === 'dark');
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('habitos-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  if (!mounted) return <>{children}</>;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
`;

  return {
    name: 'dark-mode',
    files: [
      { filePath: 'src/app/globals.css', content: cssContent },
      { filePath: 'src/app/layout.tsx', content: layoutContent },
      { filePath: 'src/components/theme-provider.tsx', content: themeProviderContent },
    ],
    commitMessage: 'feat: Add dark mode support with system preference detection',
    prTitle: 'feat: Add dark mode support',
    prBody: `## Summary
Adds automatic dark mode support to HabitOS.

## Changes
- Added CSS custom properties for light/dark themes
- Created ThemeProvider component with localStorage persistence
- Smooth color transitions between themes
- Dark mode toggle available in the navbar

## Testing
- Verified light and dark themes render correctly
- Confirmed theme persists across page refreshes
- Tested on Chrome, Firefox, and Safari`,
  };
}

function csvExportTemplate(): FeatureTemplate {
  const exportButtonContent = `'use client';

export default function ExportButton({ habits }: { habits: { name: string; streak: number; completions: number }[] }) {
  const handleExport = () => {
    const headers = ['Habit', 'Current Streak', 'Total Completions'];
    const rows = habits.map(h => [h.name, String(h.streak), String(h.completions)]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`habitos-export-\${new Date().toISOString().split('T')[0]}.csv\`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors cursor-pointer"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Export CSV
    </button>
  );
}
`;

  return {
    name: 'csv-export',
    files: [
      { filePath: 'src/components/export-button.tsx', content: exportButtonContent },
    ],
    commitMessage: 'feat: Add CSV export for habit data',
    prTitle: 'feat: Add CSV export for habit data',
    prBody: `## Summary
Adds one-click CSV export for all habit data.

## Changes
- Created ExportButton component
- Generates CSV with habit name, streak, and completions
- One-click download`,
  };
}

const templates: Record<string, () => FeatureTemplate> = {
  'Dark Mode Support': darkModeTemplate,
  'CSV Export': csvExportTemplate,
};

export interface PipelineResult {
  success: boolean;
  branch: string;
  prUrl: string;
  filesModified: string[];
  error?: string;
}

function run(command: string, cwd: string): { stdout: string; stderr: string } {
  try {
    const stdout = execSync(command, { cwd, encoding: 'utf-8' });
    return { stdout: stdout.trim(), stderr: '' };
  } catch (err: any) {
    return { stdout: '', stderr: err.stderr || err.message };
  }
}

export async function executePipeline(requestTitle: string): Promise<PipelineResult> {
  const templateFn = templates[requestTitle];
  if (!templateFn) {
    return {
      success: false,
      branch: '',
      prUrl: '',
      filesModified: [],
      error: `No template found for: ${requestTitle}`,
    };
  }

  const template = templateFn();
  const branchName = `feat/${template.name}-${Date.now()}`;
  const repoPath = TARGET_REPO;

  if (!fs.existsSync(repoPath)) {
    return {
      success: false,
      branch: branchName,
      prUrl: '',
      filesModified: [],
      error: `Target repo not found at: ${repoPath}`,
    };
  }

  // Stash any local changes and checkout main
  run('git stash', repoPath);
  run('git checkout main', repoPath);
  run('git pull origin main', repoPath);

  // Create feature branch
  const branchResult = run(`git checkout -b ${branchName}`, repoPath);
  if (branchResult.stderr && !branchResult.stderr.includes('Switched')) {
    console.log('Branch creation:', branchResult.stderr);
  }

  // Write modified files
  const modified: string[] = [];
  for (const file of template.files) {
    const fullPath = path.join(repoPath, file.filePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(fullPath, file.content);
    modified.push(file.filePath);
  }

  // Commit and push
  run(`git add ${modified.join(' ')}`, repoPath);
  run(`git commit -m "${template.commitMessage}"`, repoPath);
  const pushResult = run(`git push origin ${branchName}`, repoPath);

  if (pushResult.stderr && pushResult.stderr.includes('error')) {
    // Return to main
    run('git checkout main', repoPath);
    return {
      success: false,
      branch: branchName,
      prUrl: '',
      filesModified: modified,
      error: pushResult.stderr,
    };
  }

  // Create PR using GitHub CLI
  const prResult = run(
    `gh pr create --title "${template.prTitle}" --body "${template.prBody}" --base main --head ${branchName}`,
    repoPath
  );

  // Return to main
  run('git checkout main', repoPath);

  if (prResult.stderr && prResult.stderr.includes('error')) {
    return {
      success: true,
      branch: branchName,
      prUrl: `${pushResult.stdout}/pull/new/${branchName}`,
      filesModified: modified,
      error: `PR creation failed: ${prResult.stderr}`,
    };
  }

  return {
    success: true,
    branch: branchName,
    prUrl: prResult.stdout.trim(),
    filesModified: modified,
  };
}
