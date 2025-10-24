import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Code2, Users, Target, Sparkles, Award, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | QodeBench',
  description: 'Learn about QodeBench - A platform empowering developers with AI-powered coding challenges',
};

export default function AboutPage() {
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

      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            About QodeBench
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            QodeBench is an AI-powered platform designed to help developers improve their coding
            skills through hands-on challenges, mock interviews, and personalized learning experiences.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="container mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Who We Are
          </h2>
          <Card>
            <CardContent className="p-8">
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                We are a team of developers, educators, and AI enthusiasts passionate about making
                quality coding education accessible to everyone. QodeBench was built to bridge the
                gap between learning and real-world development skills.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our platform combines traditional coding challenges with cutting-edge AI technology
                to provide personalized feedback, hints, and learning paths tailored to each developer's
                needs and skill level.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What We Serve */}
      <section className="container mx-auto px-6 lg:px-8 py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            What We Serve
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-brand-100 flex items-center justify-center">
                    <Code2 className="h-6 w-6 text-brand-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Coding Challenges
                  </h3>
                </div>
                <p className="text-slate-600">
                  Practice with hundreds of real-world coding challenges across multiple categories
                  and difficulty levels, from beginner to advanced.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Mock Interviews
                  </h3>
                </div>
                <p className="text-slate-600">
                  Prepare for technical interviews with AI-powered mock interviews that simulate
                  real interview scenarios and provide detailed feedback.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    AI Learning Companion
                  </h3>
                </div>
                <p className="text-slate-600">
                  Get personalized hints, explanations, and feedback powered by advanced AI to help
                  you understand concepts and improve your problem-solving skills.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Progress Tracking
                  </h3>
                </div>
                <p className="text-slate-600">
                  Track your learning journey with detailed progress analytics, skill assessments,
                  achievements, and leaderboard rankings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Target className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Personalized Learning
                  </h3>
                </div>
                <p className="text-slate-600">
                  Experience adaptive learning paths that adjust to your skill level and learning
                  pace, ensuring you're always challenged but never overwhelmed.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Real-world Skills
                  </h3>
                </div>
                <p className="text-slate-600">
                  Focus on practical, industry-relevant skills that prepare you for real software
                  development roles and technical interviews.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Join QodeBench today and take your coding skills to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-brand-600 hover:bg-brand-700">
              <Link href="/signup">Get Started Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
