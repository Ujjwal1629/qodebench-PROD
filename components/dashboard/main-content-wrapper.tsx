'use client';

import { ReactNode } from 'react';

interface MainContentWrapperProps {
  children: ReactNode;
}

export function MainContentWrapper({ children }: MainContentWrapperProps) {
  return (
    <main className="min-h-screen pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}
