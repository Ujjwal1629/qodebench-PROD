'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

interface VisitorsHeaderProps {
  totalCount: number
}

export function VisitorsHeader({ totalCount }: VisitorsHeaderProps) {
  const router = useRouter()

  const handleRefresh = () => {
    router.refresh()
  }

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Visitor Tracking</h1>
        <p className="text-muted-foreground">
          Track all visitors and leads • Total: {totalCount} visitors
        </p>
      </div>
      <Button onClick={handleRefresh} variant="outline">
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh
      </Button>
    </div>
  )
}
