import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Newspaper } from 'lucide-react';
import { Footer } from '@/components/landing/v2/footer';
import { getAllPosts, formatPostDate } from '@/lib/blog';

const title = 'Blog | QodeBench';
const description = 'Practical writing on QA, test automation and AI testing from the QodeBench team.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/blog' },
  openGraph: { title, description, type: 'website', url: '/blog' },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white pb-14 pt-40 lg:pt-44">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <p className="mb-5 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-brand-600">Blog</p>
          <h1 className="mb-5 font-serif text-4xl leading-[1.15] tracking-tight text-slate-950 sm:text-5xl">
            Notes on testing, the AI era included
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">{description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-14 lg:px-8">
        {posts.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-14 text-center">
            <Newspaper className="mx-auto mb-5 h-14 w-14 text-slate-300" />
            <h2 className="mb-2 text-xl font-bold text-slate-900">First posts are on the way</h2>
            <p className="mx-auto mb-6 max-w-md text-slate-600">
              Meanwhile, try our free AI testing tools. They are the hands-on side of what we write about.
            </p>
            <Link
              href="/testing-tools"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Explore free tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-brand-300 hover:shadow-lg sm:flex-row"
              >
                {post.cover && (
                  <div className="relative aspect-[1200/630] shrink-0 bg-slate-100 sm:w-72">
                    <Image src={post.cover} alt="" fill className="object-cover" sizes="(min-width: 640px) 288px, 100vw" />
                  </div>
                )}
                <div className="flex-1 p-6">
                  <p className="mb-2 text-xs text-slate-500">
                    {formatPostDate(post.date)} · {post.readingMinutes} min read
                  </p>
                  <h2 className="text-xl font-bold leading-snug text-slate-900 group-hover:text-brand-700">{post.title}</h2>
                  <p className="mt-2 line-clamp-3 text-slate-600">{post.description}</p>
                  {post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
