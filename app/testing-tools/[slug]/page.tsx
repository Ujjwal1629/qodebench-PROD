import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronRight, Newspaper } from 'lucide-react';
import { Footer } from '@/components/landing/v2/footer';
import { CourseNotes } from '@/components/courses/course-notes';
import { InlineMd } from '@/components/courses/inline-md';
import { IntroVideo } from '@/components/testing-tools/intro-video';
import { ToolEmbed } from '@/components/public-site/tool-embed';
import { CourseCta } from '@/components/public-site/course-cta';
import { PUBLIC_TOOLS, getPublicTool } from '@/lib/public-tools';
import { getPostsForTool, formatPostDate } from '@/lib/blog';

// Public, no-login tool page (/testing-tools is in publicRoutes in
// lib/supabase/middleware.ts). Content lives in lib/public-tools.ts.

const difficultyColor: Record<string, string> = {
  Beginner: 'bg-green-50 text-green-700 border-green-200',
  Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  Advanced: 'bg-red-50 text-red-700 border-red-200',
};

export function generateStaticParams() {
  return PUBLIC_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tool = getPublicTool((await params).slug);
  if (!tool) return {};
  const title = `${tool.title}: free AI testing tool | QodeBench`;
  return {
    title,
    description: tool.seoDescription,
    alternates: { canonical: `/testing-tools/${tool.slug}` },
    openGraph: { title, description: tool.seoDescription, type: 'website', url: `/testing-tools/${tool.slug}` },
    twitter: { card: 'summary_large_image', title, description: tool.seoDescription },
  };
}

export default async function PublicToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const tool = getPublicTool((await params).slug);
  if (!tool) notFound();

  const posts = getPostsForTool(tool.slug);
  const otherTools = PUBLIC_TOOLS.filter((t) => t.slug !== tool.slug);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white pb-12 pt-36 lg:pt-40">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
            <Link href="/testing-tools" className="hover:text-brand-600">Free Testing Tools</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-slate-700">{tool.title}</span>
          </nav>
          <h1 className="font-serif text-4xl leading-[1.15] tracking-tight text-slate-950 sm:text-5xl">{tool.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">{tool.tagline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
              Free · No login needed
            </span>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficultyColor[tool.difficulty]}`}>
              {tool.difficulty}
            </span>
            {tool.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-6 py-12 lg:px-8">
        {/* Intro video (hidden until a public playback ID is set in lib/public-tools.ts) */}
        {tool.introVideo && (
          <section>
            <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">Watch: what this tool does</h2>
            <IntroVideo playbackId={tool.introVideo} title={tool.title} />
          </section>
        )}

        {/* How to use + the tool */}
        <section className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-bold tracking-tight text-slate-900">How to use it</h2>
            <ol className="space-y-3">
              {tool.howToUse.map((step, i) => (
                <li key={i} className="flex gap-3 text-[0.9375rem] leading-relaxed text-slate-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <InlineMd>{step}</InlineMd>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" data-testid="tool-container">
            <ToolEmbed slug={tool.slug} />
          </div>
          {tool.guestNote && (
            <p className="text-center text-xs text-slate-500">
              {tool.guestNote}{' '}
              <Link href="/signup" className="font-medium text-brand-600 hover:text-brand-700">Create a free account</Link>
            </p>
          )}
        </section>

        {/* Theory */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-10">
          <p className="mb-2 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-brand-600">The theory</p>
          <CourseNotes content={tool.theory} className="max-w-none" />
        </section>

        {/* Course */}
        <CourseCta sessions={tool.courseSessions} />

        {/* Related blog posts */}
        {posts.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">Related reading</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-md"
                >
                  <p className="mb-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <Newspaper className="h-3.5 w-3.5" /> {formatPostDate(post.date)} · {post.readingMinutes} min read
                  </p>
                  <p className="font-semibold text-slate-900 group-hover:text-brand-700">{post.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Other tools */}
        <section>
          <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">More free tools</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {otherTools.map((t) => (
              <Link
                key={t.slug}
                href={`/testing-tools/${t.slug}`}
                className="group flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-300 hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-brand-700">{t.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{t.tagline}</p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 group-hover:text-brand-600" />
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
