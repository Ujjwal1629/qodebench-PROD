import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Code2, Lightbulb, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation | QodeBench',
  description: 'Learn how to use QodeBench with our comprehensive documentation',
};

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 lg:px-8 py-4">
          <Link href="/" className="text-brand-600 hover:text-brand-700 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>

      <section className="container mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Documentation
          </h1>
          <p className="text-xl text-slate-600">
            Everything you need to know to get started with QodeBench and make the most
            of our platform for learning QA testing
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-8 text-center md:text-left">
              <Rocket className="h-12 w-12 text-brand-600 mb-4 mx-auto md:mx-0" />
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Getting Started</h2>
              <ul className="space-y-3 text-slate-600 flex flex-col items-center md:items-start">
                <li>• Create your account and set up your profile</li>
                <li>• Navigate the dashboard and explore features</li>
                <li>• Start your first coding challenge</li>
                <li>• Understand the point and leveling system</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 text-center md:text-left">
              <Code2 className="h-12 w-12 text-brand-600 mb-4 mx-auto md:mx-0" />
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Challenges</h2>
              <ul className="space-y-3 text-slate-600 flex flex-col items-center md:items-start">
                <li>• Browse challenges by category and difficulty</li>
                <li>• Use the built-in code editor</li>
                <li>• Submit and validate your solutions</li>
                <li>• Track your progress and attempts</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 text-center md:text-left">
              <Lightbulb className="h-12 w-12 text-brand-600 mb-4 mx-auto md:mx-0" />
              <h2 className="text-2xl font-bold text-slate-900 mb-3">AI Tools</h2>
              <ul className="space-y-3 text-slate-600 flex flex-col items-center md:items-start">
                <li>• Get AI-powered hints and explanations</li>
                <li>• Use the learning companion for guidance</li>
                <li>• Generate personalized learning paths</li>
                <li>• Access code review and feedback</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 text-center md:text-left">
              <BookOpen className="h-12 w-12 text-brand-600 mb-4 mx-auto md:mx-0" />
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Mock Interviews</h2>
              <ul className="space-y-3 text-slate-600 flex flex-col items-center md:items-start">
                <li>• Practice with AI-powered mock interviews</li>
                <li>• Receive detailed performance reports</li>
                <li>• Improve your interview skills</li>
                <li>• Prepare for real-world scenarios</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto text-center mt-16">
          <Card className="bg-brand-50 border-brand-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Need More Help?
              </h3>
              <p className="text-slate-600 mb-6">
                Check out our tutorials, AI Tools Guide, or contact our support team
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/tutorials">View Tutorials</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard/help">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
