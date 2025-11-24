'use client';

import { CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChallengeSidebarProps {
  description: string;
  requirements?: string[];
  objectives?: string[];
}

export function ChallengeSidebar({
  description,
  requirements,
  objectives,
}: ChallengeSidebarProps) {
  return (
    <aside className="w-full h-full overflow-y-auto bg-white border-r border-gray-200">
      {/* Description Section */}
      <section className="p-6 border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-900 mb-3">Description</h2>
        <div className="prose prose-sm prose-slate max-w-none text-gray-700">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h3 className="text-base font-semibold text-gray-900 mt-3 mb-2">{children}</h3>
              ),
              h2: ({ children }) => (
                <h4 className="text-sm font-semibold text-gray-900 mt-2 mb-1">{children}</h4>
              ),
              h3: ({ children }) => (
                <h5 className="text-sm font-semibold text-gray-900 mt-2 mb-1">{children}</h5>
              ),
              p: ({ children }) => (
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-outside ml-4 space-y-1 mb-2 text-sm text-gray-700">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside ml-4 space-y-1 mb-2 text-sm text-gray-700">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-sm text-gray-700 leading-relaxed">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-medium text-gray-900">{children}</strong>
              ),
              code: ({ children }) => (
                <code className="text-gray-800 font-mono text-xs bg-gray-100 border border-gray-200 px-1 py-0.5 rounded">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto mb-2 font-mono text-xs">
                  {children}
                </pre>
              ),
            }}
          >
            {description}
          </ReactMarkdown>
        </div>
      </section>

      {/* Requirements Section */}
      {requirements && requirements.length > 0 && (
        <section className="p-6 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Requirements</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Objectives Section */}
      {objectives && objectives.length > 0 && (
        <section className="p-6 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Learning Objectives</h2>
          <ul className="space-y-2">
            {objectives.map((obj, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

    </aside>
  );
}
