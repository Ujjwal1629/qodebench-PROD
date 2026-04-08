import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Rocket, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Learning Module - QodeBench',
  description: 'Master QA testing and automation with our structured learning paths',
};

const PATH_IDS = {
  javascript_typescript: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
  playwright: 'f8a9b0c1-d2e3-4f5a-6b7c-8d9e0f1a2b3c',
};

export default async function LearningPage() {
  const supabase = await createClient();

  const { data: lessonCounts } = await supabase
    .from('ai_learning_lessons')
    .select('learning_path_id')
    .in('learning_path_id', Object.values(PATH_IDS));

  const countByPath = (pathId: string) =>
    lessonCounts?.filter((l) => l.learning_path_id === pathId).length ?? 0;

  const learningPaths = [
    {
      icon: Code2,
      title: 'JavaScript & TypeScript Essentials',
      description: 'Master JavaScript fundamentals and TypeScript for type-safe automation',
      lessons: countByPath(PATH_IDS.javascript_typescript),
      available: true,
      href: '/dashboard/learning/typescript',
    },
    {
      icon: Rocket,
      title: 'Playwright Testing',
      description: 'Master end-to-end testing with Playwright framework',
      lessons: countByPath(PATH_IDS.playwright),
      available: true,
      href: '/dashboard/learning/playwright',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Learning Paths</h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Pick a path and start building your QA automation skills.
        </p>
      </div>

      {/* Learning Paths */}
      <div>
        <div className="grid gap-6 md:grid-cols-2">
          {learningPaths.map((path) => {
            const Icon = path.icon;

            const cardContent = (
              <Card className={`relative overflow-hidden h-full ${
                path.available
                  ? 'border-2 border-sky-200 bg-sky-50/30 hover:border-sky-400 cursor-pointer'
                  : ''
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`rounded-lg p-3 ${
                      path.available ? 'bg-sky-100' : 'bg-primary/10'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        path.available ? 'text-sky-600' : 'text-primary'
                      }`} />
                    </div>
                    <Badge variant="secondary">{path.lessons} lessons</Badge>
                  </div>
                  <CardTitle className="mt-4">{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {path.available ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium text-sky-700">
                        <CheckCircle className="h-4 w-4" />
                        Available Now
                      </div>
                      <ArrowRight className="h-5 w-5 text-sky-600" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                        Coming Soon
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );

            return path.available && path.href ? (
              <Link
                key={path.title}
                href={path.href}
                className="block transition-transform hover:scale-105"
              >
                {cardContent}
              </Link>
            ) : (
              <div key={path.title}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
