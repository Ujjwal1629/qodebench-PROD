'use client';

import { useState } from 'react';
import { ToolLayout } from '../tool-layout';

interface LinkItem {
  id: number;
  text: string;
  url: string;
  status: number;
  working: boolean;
}

const links: LinkItem[] = [
  { id: 1, text: 'QodeBench Home', url: '/', status: 200, working: true },
  { id: 2, text: 'Learning Modules', url: '/dashboard/learning', status: 200, working: true },
  { id: 3, text: 'Broken Page Alpha', url: '/broken-page-alpha', status: 404, working: false },
  { id: 4, text: 'Practice Challenges', url: '/dashboard/practice', status: 200, working: true },
  { id: 5, text: 'Missing Resource', url: '/api/missing-resource', status: 404, working: false },
  { id: 6, text: 'Interview Prep', url: '/dashboard/interview-prep', status: 200, working: true },
  { id: 7, text: 'Deleted Blog Post', url: '/blog/deleted-post-123', status: 404, working: false },
  { id: 8, text: 'Pricing Page', url: '/pricing', status: 200, working: true },
  { id: 9, text: 'Old API Endpoint', url: '/api/v1/deprecated', status: 404, working: false },
  { id: 10, text: 'Sign Up', url: '/signup', status: 200, working: true },
  { id: 11, text: 'Server Error Page', url: '/api/server-error', status: 500, working: false },
  { id: 12, text: 'Documentation', url: '/documentation', status: 200, working: true },
];

export default function BrokenLinksTool() {
  const [checkedLinks, setCheckedLinks] = useState<Map<number, { status: number; checked: boolean }>>(new Map());
  const [checking, setChecking] = useState(false);
  const [currentlyChecking, setCurrentlyChecking] = useState<number | null>(null);

  const checkSingleLink = async (link: LinkItem) => {
    setCurrentlyChecking(link.id);
    // Simulate network check delay
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));
    setCheckedLinks((prev) => {
      const next = new Map(prev);
      next.set(link.id, { status: link.status, checked: true });
      return next;
    });
    setCurrentlyChecking(null);
  };

  const checkAllLinks = async () => {
    setChecking(true);
    setCheckedLinks(new Map());
    for (const link of links) {
      await checkSingleLink(link);
    }
    setChecking(false);
  };

  const handleReset = () => {
    setCheckedLinks(new Map());
    setChecking(false);
    setCurrentlyChecking(null);
  };

  const workingCount = links.filter((l) => l.working).length;
  const brokenCount = links.filter((l) => !l.working).length;
  const checkedCount = checkedLinks.size;

  return (
    <ToolLayout
      title="Broken Links Checker"
      description="A page with a mix of working and broken links. Practice link validation, status code checking, and network interception."
      difficulty="Intermediate"
      scenarios={[
        'Click "Check All Links" and wait for all links to be validated.',
        'Verify the correct count of working vs broken links.',
        'Check a single link by clicking its "Check" button and verify the status badge.',
        'Verify that broken links show red status (404/500) and working links show green (200).',
        'Count total links on the page and verify it matches 12.',
        'Use network interception to mock a broken link as working.',
        'Verify the progress counter updates during the check.',
        'Click "Reset" and verify all status badges are cleared.',
      ]}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <span data-testid="total-count">{links.length} links</span>
            {' | '}
            <span className="text-green-600" data-testid="working-count">{workingCount} working</span>
            {' | '}
            <span className="text-red-600" data-testid="broken-count">{brokenCount} broken</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={checkAllLinks}
              disabled={checking}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 disabled:opacity-50"
              data-testid="check-all"
            >
              {checking ? `Checking... (${checkedCount}/${links.length})` : 'Check All Links'}
            </button>
            <button onClick={handleReset} className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50" data-testid="reset-button">
              Reset
            </button>
          </div>
        </div>

        {/* Links List */}
        <div className="space-y-2" data-testid="links-list">
          {links.map((link) => {
            const checked = checkedLinks.get(link.id);
            const isChecking = currentlyChecking === link.id;
            return (
              <div
                key={link.id}
                className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3"
                data-testid={`link-${link.id}`}
              >
                {/* Status */}
                <div className="flex-shrink-0 w-16">
                  {isChecking ? (
                    <span className="text-xs text-slate-400 flex items-center gap-1" data-testid={`checking-${link.id}`}>
                      <div className="w-3 h-3 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
                    </span>
                  ) : checked ? (
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-bold ${
                        checked.status === 200 ? 'bg-green-100 text-green-700' :
                        checked.status === 404 ? 'bg-red-100 text-red-700' :
                        'bg-orange-100 text-orange-700'
                      }`}
                      data-testid={`status-${link.id}`}
                    >
                      {checked.status}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400" data-testid={`unchecked-${link.id}`}>---</span>
                  )}
                </div>

                {/* Link Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900" data-testid={`text-${link.id}`}>{link.text}</p>
                  <p className="text-xs text-slate-500 truncate font-mono" data-testid={`url-${link.id}`}>{link.url}</p>
                </div>

                {/* Check Button */}
                <button
                  onClick={() => checkSingleLink(link)}
                  disabled={checking || isChecking}
                  className="px-3 py-1 text-xs border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                  data-testid={`check-${link.id}`}
                >
                  Check
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {checkedCount === links.length && !checking && (
          <div className={`rounded-lg p-4 text-sm ${brokenCount > 0 ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`} data-testid="check-summary">
            <p className="font-semibold mb-1">
              {brokenCount > 0 ? `Found ${brokenCount} broken link(s)!` : 'All links are working!'}
            </p>
            {brokenCount > 0 && (
              <ul className="text-xs text-red-700 space-y-1">
                {links.filter((l) => !l.working).map((l) => (
                  <li key={l.id}>- {l.text} ({l.url}) — {l.status}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
