import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, MessageSquare } from 'lucide-react';

export function LessonContentSkeleton() {
  return (
    <div>
      {/* Mobile View: Stacked Layout */}
      <div className="md:hidden overflow-y-auto h-[calc(100vh-4rem)] bg-slate-50">
        {/* Theory Section */}
        <div className="bg-white border-b-4 border-purple-200 mb-4">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3 shadow-md">
            <div className="flex items-center gap-2 text-white">
              <BookOpen className="h-5 w-5" />
              <h2 className="font-semibold text-base">Learning Content</h2>
            </div>
          </div>
          <div className="p-4 space-y-6">
            {/* Back link skeleton */}
            <Skeleton className="h-4 w-32" />

            {/* Header skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            {/* Content skeletons */}
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-32 w-full" /> {/* Code block */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 shadow-md">
            <div className="flex items-center gap-2 text-white">
              <MessageSquare className="h-5 w-5" />
              <h2 className="font-semibold text-base">AI Development Mentor</h2>
            </div>
          </div>
          <div className="p-4">
            <Card className="h-full">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="pt-4 space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Desktop View: Side-by-Side Layout */}
      <div className="hidden md:flex h-[calc(100vh-4rem)]">
        {/* Left Panel - Theory */}
        <div className="w-1/2 overflow-y-auto border-r border-slate-200 bg-white">
          <div className="max-w-4xl mx-auto p-8 space-y-6">
            {/* Back link skeleton */}
            <Skeleton className="h-4 w-32" />

            {/* Header skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-10 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-28" />
              </div>
            </div>

            {/* Content skeletons */}
            <div className="space-y-4 pt-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />

              <div className="py-4">
                <Skeleton className="h-40 w-full" /> {/* Code block */}
              </div>

              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-10/12" />

              {/* Another paragraph */}
              <div className="pt-4 space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-9/12" />
              </div>

              {/* Quiz section skeleton */}
              <div className="pt-8 mt-8 border-t border-slate-200 space-y-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full max-w-md" />
                  </div>
                </div>
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="w-1/2 bg-gradient-to-b from-white to-purple-50/10 overflow-hidden flex flex-col">
          <div className="border-b bg-gradient-to-r from-purple-100 to-indigo-100 p-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-56" />
                <Skeleton className="h-3 w-72" />
              </div>
            </div>

            {/* Mode pills skeleton */}
            <div className="flex gap-2 pt-4">
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-28 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
          </div>

          <div className="flex-1 p-6 space-y-4 overflow-hidden">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-4">
                <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                <Skeleton className="h-6 w-64 mx-auto" />
                <Skeleton className="h-4 w-96 mx-auto" />
                <div className="pt-6 space-y-2">
                  <Skeleton className="h-14 w-full max-w-lg mx-auto" />
                  <Skeleton className="h-14 w-full max-w-lg mx-auto" />
                  <Skeleton className="h-14 w-full max-w-lg mx-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Chat input skeleton */}
          <div className="border-t border-purple-100 p-5 bg-white">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-3 w-64 mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
