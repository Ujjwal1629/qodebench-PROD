import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Code2, Database, Layout, Rocket, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Learning Module - QodeBench',
  description: 'Master full-stack development with our structured learning paths',
};

export default function LearningPage() {
  const learningPaths = [
    {
      icon: Layout,
      title: 'HTML & CSS Fundamentals',
      description: 'Master the building blocks of web development',
      lessons: 18,
      available: true,
      href: '/dashboard/learning/html-css',
    },
    {
      icon: Code2,
      title: 'JavaScript Essentials',
      description: 'Learn modern JavaScript from basics to advanced',
      lessons: 18,
      available: true,
      href: '/dashboard/learning/javascript',
    },
    {
      icon: Rocket,
      title: 'React & Next.js Mastery',
      description: 'Build modern web applications with React and Next.js',
      lessons: 28,
      available: true,
      href: '/dashboard/learning/react-nextjs',
    },
    {
      icon: Database,
      title: 'Backend & APIs',
      description: 'Create robust server-side applications with Node.js, Express, databases, and security',
      lessons: 14,
      available: true,
      href: '/dashboard/learning/backend-apis',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Featured Banner */}
      <Card className="overflow-hidden bg-gradient-to-r from-sky-500 to-purple-600">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center text-white sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-white/20 p-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-white text-sky-600 hover:bg-white">
                    Now Available
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold">Start Your Learning Journey</h3>
                <p className="mt-1 text-sky-50">
                  Interactive lessons with AI-powered assistance and hands-on quizzes
                </p>
              </div>
            </div>
            <Button asChild size="lg" className="bg-white text-sky-600 hover:bg-white/90">
              <Link href="/dashboard/learning/html-css">
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Message */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Start Your Learning Journey</h1>
        <p className="mt-2 text-slate-600">
          Based on your skill assessment, we've identified the perfect learning path for you.
          Our structured curriculum will help you build a strong foundation in full-stack web development.
        </p>
      </div>

      {/* Learning Paths */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Learning Paths</h2>
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

      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Features</CardTitle>
          <CardDescription>
            Everything you need to master web development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-sky-100 p-2">
                <BookOpen className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Interactive Lessons</h4>
                <p className="text-sm text-slate-600">Rich content with code examples and explanations</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">AI Assistant</h4>
                <p className="text-sm text-slate-600">Get instant help and code examples</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Quiz-Based Learning</h4>
                <p className="text-sm text-slate-600">Test your knowledge to unlock new lessons</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-sky-50 border-sky-200">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Begin Your Journey Today
              </h3>
              <p className="mt-1 text-slate-600">
                Start with HTML & CSS fundamentals and build your way up to advanced topics
              </p>
            </div>
            <Button asChild size="lg" className="gap-2 bg-sky-600 hover:bg-sky-700">
              <Link href="/dashboard/learning/html-css">
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
