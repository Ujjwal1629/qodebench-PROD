'use client';

import { ReactNode } from 'react';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';

interface MainContentWrapperProps {
  children: ReactNode;
}

export function MainContentWrapper({ children }: MainContentWrapperProps) {
  const { sidebarCollapsed } = useUIStore();

  return (
    <main
      className={cn(
        'min-h-screen pt-16 pb-20 lg:pb-8 transition-all duration-300',
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}
