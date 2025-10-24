import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageCircle, BookOpen, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Help & Support | QodeBench',
  description: 'Get help and support for QodeBench',
};

export default function HelpPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>
        <p className="mt-2 text-slate-600">
          We're here to help you get the most out of QodeBench
        </p>
      </div>

      {/* Contact Support Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100">
              <Mail className="h-6 w-6 text-brand-600" />
            </div>
            <div>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get in touch with our support team
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600 mb-2">
              Email us at:
            </p>
            <a
              href="mailto:support@qodebench.com"
              className="text-lg font-semibold text-brand-600 hover:text-brand-700 transition-colors"
            >
              support@qodebench.com
            </a>
          </div>
          <p className="text-sm text-slate-600">
            We typically respond within 24 hours during business days.
          </p>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <HelpCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                How do I start a challenge?
              </h3>
              <p className="text-sm text-slate-600">
                Navigate to the Challenges page, browse available challenges, and click "Start Challenge" on any challenge card to begin coding.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                How are points calculated?
              </h3>
              <p className="text-sm text-slate-600">
                Points are awarded based on challenge difficulty (Easy: 50-100, Medium: 100-200, Hard: 200-300). You earn points when you successfully complete a challenge.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Can I retake a challenge?
              </h3>
              <p className="text-sm text-slate-600">
                Yes! You can view and retry completed challenges anytime to improve your solution or refresh your skills.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                How do I update my profile?
              </h3>
              <p className="text-sm text-slate-600">
                Go to Settings from the user menu in the top right corner to update your profile information, username, and preferences.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Learning Resources</CardTitle>
              <CardDescription>
                Additional resources to help you learn
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link
              href="/dashboard/challenges"
              className="block rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
            >
              <h4 className="font-semibold text-slate-900 mb-1">
                Browse Challenges
              </h4>
              <p className="text-sm text-slate-600">
                Explore our library of coding challenges across different categories
              </p>
            </Link>

            <Link
              href="/dashboard/ai-tools"
              className="block rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
            >
              <h4 className="font-semibold text-slate-900 mb-1">
                AI Tools
              </h4>
              <p className="text-sm text-slate-600">
                Use our AI-powered tools to enhance your learning experience
              </p>
            </Link>

            <Link
              href="/dashboard/leaderboard"
              className="block rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
            >
              <h4 className="font-semibold text-slate-900 mb-1">
                Leaderboard
              </h4>
              <p className="text-sm text-slate-600">
                See how you rank against other developers
              </p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle>Send Feedback</CardTitle>
              <CardDescription>
                Help us improve QodeBench
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">
            We'd love to hear your suggestions, feature requests, or bug reports. Your feedback helps us make QodeBench better for everyone.
          </p>
          <a
            href="mailto:support@qodebench.com?subject=Feedback"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            <Mail className="h-4 w-4" />
            Send Feedback
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
