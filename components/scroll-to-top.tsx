'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Component that scrolls to top whenever the route changes
 * Add this to your layout to ensure all page navigations scroll to top
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

/**
 * Hook to scroll to top on mount
 * Use this in individual components that need to scroll to top
 */
export function useScrollToTop(dependency?: any) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [dependency]);
}
