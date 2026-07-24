import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Braces, Rocket, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Learning Module - QodeBench',
  description: 'Master QA testing and automation with our structured learning paths',
};

const PATH_IDS = {
  javascript: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  typescript: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
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
      title: 'JavaScript Essentials',
      description: 'Variables, data types, functions, arrays, objects, loops, OOP, and async patterns',
      lessons: countByPath(PATH_IDS.javascript),
      available: true,
      href: '/dashboard/learning/javascript',
      color: 'sky',
    },
    {
      icon: Braces,
      title: 'TypeScript Essentials',
      description: 'Type system, interfaces, enums, generics, classes, and advanced TypeScript patterns',
      lessons: countByPath(PATH_IDS.typescript),
      available: true,
      href: '/dashboard/learning/typescript',
      color: 'blue',
    },
    {
      icon: Rocket,
      title: 'Playwright Testing',
      description: 'End-to-end testing with Playwright — selectors, assertions, page objects, and CI/CD',
      lessons: countByPath(PATH_IDS.playwright),
      available: true,
      href: '/dashboard/learning/playwright',
      color: 'purple',
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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {learningPaths.map((path) => {
          const Icon = path.icon;

          const cardContent = (
            <Card className={`relative overflow-hidden h-full ${
              path.available
                ? 'border-2 border-brand-200 bg-brand-50/30 hover:border-brand-400 cursor-pointer'
                : ''
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`rounded-lg p-3 ${
                    path.available ? 'bg-brand-100' : 'bg-primary/10'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      path.available ? 'text-brand-600' : 'text-primary'
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
                    <div className="flex items-center gap-2 text-sm font-medium text-brand-700">
                      <CheckCircle className="h-4 w-4" />
                      Available Now
                    </div>
                    <ArrowRight className="h-5 w-5 text-brand-600" />
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
  );
}
