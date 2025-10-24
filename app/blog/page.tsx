import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | QodeBench',
  description: 'Latest news, updates, and insights from QodeBench',
};

export default function BlogPage() {
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
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            QodeBench Blog
          </h1>
          <p className="text-xl text-slate-600 mb-12">
            News, updates, and insights from the QodeBench team
          </p>

          <Card>
            <CardContent className="p-16 text-center">
              <Newspaper className="h-20 w-20 text-slate-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Coming Soon
              </h2>
              <p className="text-slate-600 max-w-md mx-auto">
                We're working on bringing you insightful articles, tutorials, and updates.
                Stay tuned for our latest content!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
