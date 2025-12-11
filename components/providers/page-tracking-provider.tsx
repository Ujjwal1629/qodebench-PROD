'use client'

import { usePageTracking } from '@/hooks/use-page-tracking'

export function PageTrackingProvider({ children }: { children: React.ReactNode }) {
  usePageTracking()
  return <>{children}</>
}
