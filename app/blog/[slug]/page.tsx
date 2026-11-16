import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, FlaskConical } from 'lucide-react';
import { Footer } from '@/components/landing/v2/footer';
import { CourseNotes } from '@/components/courses/course-notes';
import { CourseCta } from '@/components/public-site/course-cta';
import { getAllPosts, getPost, formatPostDate } from '@/lib/blog';
import { getPublicTool, type PublicTool } from '@/lib/public-tools';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: `${post.title} | QodeBench Blog`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      ...(post.cover ? { images: [{ url: post.cover, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      ...(post.cover ? { images: [post.cover] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const tools = post.tools.map(getPublicTool).filter((t): t is PublicTool => Boolean(t));
  const sessions = [...new Set(tools.flatMap((t) => t.courseSessions))].slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50">
      <article>
        <header className="border-b border-slate-200 bg-white pb-12 pt-36 lg:pt-40">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <Link href="/blog" className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600">
              <ArrowLeft className="h-3.5 w-3.5" /> All posts
            </Link>
            {post.tags.length > 0 && (
              <p className="mb-4 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-brand-600">
                {post.tags.join(' · ')}
              </p>
            )}
            <h1 className="font-serif text-4xl leading-[1.15] tracking-tight text-slate-950 sm:text-5xl">{post.title}</h1>
            {post.description && <p className="mt-5 text-lg leading-relaxed text-slate-600">{post.description}</p>}
            <p className="mt-6 text-sm text-slate-500">
              {post.author} · {formatPostDate(post.date)} · {post.readingMinutes} min read
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl space-y-10 px-6 py-12 lg:px-8">
          {post.cover && (
            <div className="relative aspect-[1200/630] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <Image src={post.cover} alt="" fill priority className="object-cover" sizes="(min-width: 768px) 768px, 100vw" />
            </div>
          )}

          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-10">
            <CourseNotes content={post.content} className="max-w-none [&_p]:text-base [&_li]:text-base" />
          </div>

          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/testing-tools/${tool.slug}`}
              className="group flex items-center gap-5 rounded-xl border border-brand-200 bg-brand-50 p-6 transition-colors hover:bg-brand-100/70"
            >
              <FlaskConical className="hidden h-8 w-8 shrink-0 text-brand-600 sm:block" />
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Try it yourself, free</p>
                <p className="mt-1 font-bold text-slate-900">{tool.title}</p>
                <p className="mt-0.5 text-sm text-slate-600">{tool.tagline}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-brand-600 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </article>

      <div className="mx-auto max-w-5xl px-6 pb-14 lg:px-8">
        <CourseCta sessions={sessions} />
      </div>

      <Footer />
    </div>
  );
}
