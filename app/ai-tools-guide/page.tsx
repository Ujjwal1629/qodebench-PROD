import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, MessageSquare, Lightbulb, Code, Brain } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Tools Guide | QodeBench',
  description: 'Learn how to leverage AI-powered tools to accelerate your learning',
};

export default function AIToolsGuidePage() {
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
          <Sparkles className="h-16 w-16 text-brand-600 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            AI Tools Guide
          </h1>
          <p className="text-xl text-slate-600">
            Leverage the power of AI to accelerate your coding journey and master
            new concepts faster
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    AI Learning Companion
                  </h2>
                  <p className="text-slate-600 mb-4">
                    Get instant help while working on challenges. Our AI companion provides
                    contextual hints, explains concepts, and guides you through solutions
                    without giving away the answer.
                  </p>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Ask questions about specific parts of the challenge</li>
                    <li>• Get explanations for unfamiliar concepts</li>
                    <li>• Receive hints when you're stuck</li>
                    <li>• Learn best practices and patterns</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Code className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    Code Validation & Review
                  </h2>
                  <p className="text-slate-600 mb-4">
                    Our AI validates your solutions and provides detailed feedback on code
                    quality, efficiency, and best practices.
                  </p>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Instant code validation and testing</li>
                    <li>• Performance analysis and optimization suggestions</li>
                    <li>• Code style and readability feedback</li>
                    <li>• Edge case identification</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    Personalized Learning Paths
                  </h2>
                  <p className="text-slate-600 mb-4">
                    AI analyzes your progress and creates customized learning paths tailored
                    to your skill level and goals.
                  </p>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Adaptive difficulty based on your performance</li>
                    <li>• Recommended challenges and topics</li>
                    <li>• Skill gap identification</li>
                    <li>• Progress tracking and insights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">
                    Interview Preparation
                  </h2>
                  <p className="text-slate-600 mb-4">
                    Practice with AI-powered mock interviews that simulate real interview
                    scenarios and provide actionable feedback.
                  </p>
                  <ul className="space-y-2 text-slate-600">
                    <li>• Realistic interview simulations</li>
                    <li>• Performance analysis and scoring</li>
                    <li>• Communication and problem-solving feedback</li>
                    <li>• Industry-specific interview preparation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto text-center mt-16">
          <Card className="bg-brand-50 border-brand-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Ready to Experience AI-Powered Learning?
              </h3>
              <p className="text-slate-600 mb-6">
                Sign up now and start using our AI tools to accelerate your coding journey
              </p>
              <Button asChild size="lg" className="bg-brand-600 hover:bg-brand-700">
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
