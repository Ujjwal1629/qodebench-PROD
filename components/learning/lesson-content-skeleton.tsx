import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function LessonContentSkeleton() {
  return (
    <div className="overflow-y-auto h-[calc(100vh-4rem)] bg-slate-50">
      {/* Full Width Content Layout - matches SplitScreenLayout */}
      <div className="bg-white min-h-full">
        <div className="px-6 md:px-8 lg:px-12 xl:px-16 py-6 mx-auto">
          {/* Back link skeleton */}
          <Skeleton className="h-4 w-32 mb-6" />

          {/* Header skeleton */}
          <div className="space-y-3 mb-8">
            <Skeleton className="h-10 w-3/4 max-w-2xl" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>

          {/* Content skeletons */}
          <div className="space-y-4 max-w-4xl">
            {/* Paragraph 1 */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
            </div>

            {/* Code block */}
            <div className="py-4">
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>

            {/* Paragraph 2 */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-10/12" />
            </div>

            {/* Another code block */}
            <div className="py-4">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>

            {/* Paragraph 3 */}
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-9/12" />
            </div>

            {/* Quiz section skeleton */}
            <div className="pt-8 mt-8 border-t border-slate-200">
              <Card className="border-2 border-sky-100 bg-gradient-to-br from-sky-50 to-indigo-50">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-64" />
                      <Skeleton className="h-4 w-full max-w-md" />
                    </div>
                  </div>
                  <Skeleton className="h-32 w-full rounded-lg" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tutor Dock Floating Button Skeleton - bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <Skeleton className="h-14 w-14 rounded-full shadow-lg" />
      </div>
    </div>
  );
}
