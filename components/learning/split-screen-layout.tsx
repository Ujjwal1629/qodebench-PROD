'use client';

import { ReactNode } from 'react';

interface SplitScreenLayoutProps {
  leftPanel: ReactNode;
}

export function SplitScreenLayout({ leftPanel }: SplitScreenLayoutProps) {
  return (
    <div className="overflow-y-auto h-[calc(100vh-4rem)] bg-slate-50">
      {/* Full Width Content Layout */}
      <div className="bg-white min-h-full">
        <div className="px-6 md:px-8 lg:px-10 py-6 mx-auto">
          {leftPanel}
        </div>
      </div>
    </div>
  );
}
