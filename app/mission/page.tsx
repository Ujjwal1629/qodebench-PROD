import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Users, Sparkles, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Mission | QodeBench',
  description: 'Learn about QodeBench mission and vision for developer education',
};

export default function MissionPage() {
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
            Our Mission
          </h1>
          <p className="text-2xl text-slate-600 leading-relaxed font-medium">
            Empowering developers worldwide through accessible, high-quality coding education
            and AI-powered learning experiences
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="container mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-brand-200">
            <CardContent className="p-12">
              <Target className="h-16 w-16 text-brand-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">
                What Drives Us
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed text-center">
                At QodeBench, we believe that quality coding education should be accessible
                to everyone, regardless of their background, location, or financial situation.
                We're committed to breaking down barriers and providing developers with the
                tools, practice, and guidance they need to succeed in their careers.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Pillars */}
      <section className="container mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Our Key Pillars
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-brand-100 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Accessibility</h3>
              <p className="text-slate-600">
                Making world-class coding education accessible to developers everywhere,
                removing financial and geographical barriers to learning.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Innovation</h3>
              <p className="text-slate-600">
                Leveraging cutting-edge AI technology to create personalized, effective
                learning experiences that adapt to each developer's needs.
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Community</h3>
              <p className="text-slate-600">
                Building a supportive, inclusive community where developers can learn,
                share knowledge, and grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Goals */}
      <section className="container mx-auto px-6 lg:px-8 py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Our Impact Goals
          </h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-2">
                  🎯 Help 1 million developers improve their skills by 2026
                </h3>
                <p className="text-slate-600 text-sm">
                  We're committed to reaching and positively impacting the careers of at least
                  one million developers worldwide in the next few years.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-2">
                  🌍 Provide free access to underserved communities
                </h3>
                <p className="text-slate-600 text-sm">
                  We offer free access programs for developers in underserved communities and
                  developing countries to ensure everyone has an opportunity to learn.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-slate-900 mb-2">
                  💡 Continuously innovate learning methods
                </h3>
                <p className="text-slate-600 text-sm">
                  We invest heavily in research and development to create the most effective,
                  engaging, and personalized learning experiences possible.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Join Us on Our Mission
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Be part of a community that's shaping the future of developer education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-brand-600 hover:bg-brand-700">
              <Link href="/signup">Start Learning Today</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
