import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Bot, Bug, MessageSquare } from 'lucide-react';
import { Footer } from '@/components/landing/v2/footer';
import { CourseCta } from '@/components/public-site/course-cta';
import { PUBLIC_TOOLS, type PublicToolSlug } from '@/lib/public-tools';

const title = 'Free AI Testing Tools | QodeBench';
const description =
  'Hands-on tools for QA engineers learning AI testing: catch hallucinations, test a RAG chatbot, and try prompt injection on a real chatbot. Free, no login needed.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/testing-tools' },
  openGraph: { title, description, type: 'website', url: '/testing-tools' },
  twitter: { card: 'summary_large_image', title, description },
};

const icons: Record<PublicToolSlug, typeof Bug> = {
  'hallucination-testing': Bug,
  'rag-chatbot': Bot,
  'qodebench-chatbot': MessageSquare,
};

const iconColors: Record<PublicToolSlug, string> = {
  'hallucination-testing': 'bg-rose-500',
  'rag-chatbot': 'bg-emerald-600',
  'qodebench-chatbot': 'bg-indigo-500',
};

export default function PublicTestingToolsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white pb-14 pt-40 lg:pt-44">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
          <p className="mb-5 text-[0.8125rem] font-semibold uppercase tracking-[0.16em] text-brand-600">
            Free Testing Tools
          </p>
          <h1 className="mb-5 font-serif text-4xl leading-[1.15] tracking-tight text-slate-950 sm:text-5xl">
            Learn AI testing by breaking real AI
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
            Each tool runs on a real language model. Use it, find its bugs, and read the theory behind what
            you just saw. No account needed to start.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-14 px-6 py-14 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {PUBLIC_TOOLS.map((tool) => {
            const Icon = icons[tool.slug];
            return (
              <Link
                key={tool.slug}
                href={`/testing-tools/${tool.slug}`}
                className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg"
              >
                <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-lg ${iconColors[tool.slug]}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-brand-700">{tool.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{tool.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                  Try it free <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>

        <CourseCta
          heading="Want to test AI like it's your job?"
          sessions={[
            'Hallucination Detection — Techniques & Automation',
            'RAG Testing Fundamentals',
            'OWASP Top 10 for LLMs',
            'Red Teaming with PromptFoo & Giskard',
          ]}
        />
      </div>

      <Footer />
    </div>
  );
}
