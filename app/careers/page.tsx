import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Users, Zap, Globe, Heart, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers | QodeBench',
  description: 'Join our team and help shape the future of developer education',
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 lg:px-8 py-4">
          <Link href="/" className="text-brand-600 hover:text-brand-700 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="container mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Build Your Career at
            <span className="text-brand-600"> QodeBench</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            We're on a mission to empower millions of developers worldwide. Join our team
            and help us build the future of coding education.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="container mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Why Work With Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-brand-100 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Innovation First</h3>
                <p className="text-slate-600 text-sm">
                  Work on cutting-edge AI-powered educational technology that impacts millions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-purple-100 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Great Team</h3>
                <p className="text-slate-600 text-sm">
                  Collaborate with talented, passionate individuals from around the world
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-green-100 mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Growth Opportunities</h3>
                <p className="text-slate-600 text-sm">
                  Continuous learning, skill development, and career advancement opportunities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-6 lg:px-8 py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Benefits & Perks
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <Globe className="h-6 w-6 text-brand-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Remote-First Culture</h3>
                <p className="text-slate-600 text-sm">
                  Work from anywhere in the world with flexible hours
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Heart className="h-6 w-6 text-brand-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Health & Wellness</h3>
                <p className="text-slate-600 text-sm">
                  Comprehensive health insurance and wellness programs
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Briefcase className="h-6 w-6 text-brand-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Competitive Compensation</h3>
                <p className="text-slate-600 text-sm">
                  Market-leading salaries and equity options
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <TrendingUp className="h-6 w-6 text-brand-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Learning Budget</h3>
                <p className="text-slate-600 text-sm">
                  Annual budget for courses, books, and conferences
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="container mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Open Positions
          </h2>
          <Card>
            <CardContent className="p-12">
              <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No Open Positions Currently
              </h3>
              <p className="text-slate-600 mb-6">
                We don't have any open positions at the moment, but we're always looking for
                talented individuals to join our team.
              </p>
              <Button asChild variant="outline">
                <a href="mailto:support@qodebench.com">Send Us Your Resume</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Interested in Joining?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Send your resume and portfolio to our careers team.
          </p>
          <Button asChild size="lg" className="bg-brand-600 hover:bg-brand-700">
            <a href="mailto:support@qodebench.com">Email support@qodebench.com</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
