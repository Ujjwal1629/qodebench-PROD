import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Code2, Database, Layout, Rocket, ArrowRight, Construction } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Learning Module - QodeBench',
  description: 'Master full-stack development with our structured learning paths',
};

export default function LearningPage() {
  const upcomingTopics = [
    {
      icon: Layout,
      title: 'HTML & CSS Fundamentals',
      description: 'Master the building blocks of web development',
      lessons: 12,
    },
    {
      icon: Code2,
      title: 'JavaScript Essentials',
      description: 'Learn modern JavaScript from basics to advanced',
      lessons: 18,
    },
    {
      icon: Rocket,
      title: 'React & Next.js',
      description: 'Build modern web applications with React',
      lessons: 15,
    },
    {
      icon: Database,
      title: 'Backend & APIs',
      description: 'Create robust server-side applications',
      lessons: 14,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Coming Soon Banner */}
      <Card className="overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center text-white sm:flex-row sm:justify-between sm:text-left">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-white/20 p-3">
                <Construction className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-white text-orange-600 hover:bg-white">
                    Coming Soon
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold">Learning Module Under Construction</h3>
                <p className="mt-1 text-orange-50">
                  We're building an amazing learning experience to help you master full-stack development
                </p>
              </div>
            </div>
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

      {/* What's Coming */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">What You'll Learn</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {upcomingTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <Card key={topic.title} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{topic.lessons} lessons</Badge>
                  </div>
                  <CardTitle className="mt-4">{topic.title}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                      In Development
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle>What to Expect</CardTitle>
          <CardDescription>
            Our learning module will include everything you need to succeed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Interactive Tutorials</h4>
                <p className="text-sm text-slate-600">Learn by doing with hands-on exercises</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Code2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Code Examples</h4>
                <p className="text-sm text-slate-600">Real-world code you can use</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Rocket className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Instant Feedback</h4>
                <p className="text-sm text-slate-600">Get immediate help when stuck</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Ready to Start Coding?
              </h3>
              <p className="mt-1 text-slate-600">
                While the learning module is being built, you can start with our challenges
              </p>
            </div>
            <Button asChild size="lg" className="gap-2">
              <Link href="/dashboard/challenges">
                Browse Challenges
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
