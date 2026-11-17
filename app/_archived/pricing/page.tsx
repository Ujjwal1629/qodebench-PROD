import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Check,
  ClipboardCheck,
  Clock,
  MessageCircle,
  PlayCircle,
  Users,
} from "lucide-react";
import { COURSES, type Course } from "@/lib/course-catalog";
import { getSubscription } from "@/lib/get-subscription";
import { WHATSAPP_CHANNEL_URL } from "@/lib/constants/contact";
import { Footer } from "@/components/landing/v2/footer";

export const metadata: Metadata = {
  title: "Pricing – QodeBench",
  description:
    "Course fees for QodeBench's Playwright and AI & ML Testing courses will be announced soon.",
};

// Pricing is being finalised, so this page shows the course the learner chose
// (via ?course=slug from "Enroll Now") with a "pricing announced soon" state
// instead of a checkout. Without a course param it lists every course.

// What the course includes, derived from the catalog so the practice/assignment
// counts stay accurate as lessons are added.
function courseHighlights(course: Course) {
  let practice = 0;
  let assignments = 0;
  let liveQa = false;
  let mockInterview = false;

  for (const phase of course.phases) {
    for (const mod of phase.modules) {
      if (mod.kind === "live-qa") liveQa = true;
      if (mod.kind === "mock-interview") mockInterview = true;
      if (mod.kind) continue;
      for (const lesson of mod.lessons) {
        if (/^Practice:/i.test(lesson)) practice += 1;
        else if (/^Assignment:/i.test(lesson)) assignments += 1;
      }
    }
  }

  const items: { icon: typeof Check; text: string }[] = [];
  items.push({ icon: PlayCircle, text: "Session recordings you can rewatch anytime" });
  items.push({ icon: BookOpen, text: "Revision notes for every session" });
  if (practice) items.push({ icon: ClipboardCheck, text: `${practice} hands-on practice sets, auto-graded` });
  if (assignments) items.push({ icon: Check, text: `${assignments} module assignments` });
  if (liveQa) items.push({ icon: Users, text: "Live Q&A and career counselling sessions" });
  if (mockInterview) items.push({ icon: CalendarClock, text: "Final mock interview with evaluation" });
  return items;
}

function PricingSoonCard({ course, isEnrolled }: { course: Course; isEnrolled: boolean }) {
  if (isEnrolled && !course.comingSoon) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[0.75rem] font-medium text-emerald-700">
          <Check className="h-3.5 w-3.5" />
          You&apos;re enrolled
        </span>
        <p className="mt-4 text-[0.9375rem] text-slate-600 leading-relaxed">
          Your account already has access to this course. Pick up where you left off.
        </p>
        <Link
          href={`/dashboard/courses/${course.slug}`}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand-600 text-[0.9375rem] font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          Continue course
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50">
        <Clock className="h-5 w-5 text-brand-600" />
      </div>
      <p className="mt-5 text-[0.75rem] font-semibold tracking-wider uppercase text-slate-500">
        Course fee
      </p>
      <p className="mt-1 font-serif text-2xl sm:text-[1.75rem] text-slate-950 leading-tight">
        Pricing announced soon
      </p>
      <p className="mt-3 text-[0.9375rem] text-slate-600 leading-relaxed">
        {course.comingSoon
          ? "This course is still being prepared. We’ll share the launch date and fees together."
          : "We’re finalising fees for the first batch. Join our WhatsApp channel to hear the moment enrolment opens."}
      </p>

      <a
        href={WHATSAPP_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 text-[0.9375rem] font-semibold text-white hover:bg-slate-800 transition-colors"
      >
        <MessageCircle className="h-4 w-4" />
        Get notified on WhatsApp
      </a>
      <Link
        href={`/courses?syllabus=1#${course.slug}`}
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white text-[0.9375rem] font-semibold text-slate-800 hover:border-slate-400 transition-colors"
      >
        View full curriculum
      </Link>
    </div>
  );
}

function CourseDetail({ course, isEnrolled }: { course: Course; isEnrolled: boolean }) {
  // A coming-soon course's catalog is still a topic outline, so don't list
  // inclusions for it yet.
  const highlights = course.comingSoon ? [] : courseHighlights(course);

  return (
    // Three grid children so the fee card lands right after the intro on
    // mobile, while on desktop it sits in its own column spanning both rows.
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-14 lg:gap-y-0 items-start">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-[0.75rem] font-semibold tracking-wider uppercase text-slate-500">
            {course.tag}
          </span>
          <span
            className={`text-[0.75rem] font-medium px-2.5 py-1 rounded-full border ${course.statusColor}`}
          >
            {course.status}
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-slate-950 leading-tight mb-4">
          {course.title}
        </h1>
        <p className="text-[1rem] text-slate-600 leading-relaxed max-w-2xl">
          {course.description}
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-slate-200 py-5">
          {course.meta.map((m) => (
            <div key={m.label}>
              <dt className="text-[0.75rem] text-slate-500 mb-0.5">{m.label}</dt>
              <dd className="text-[0.9375rem] font-semibold text-slate-900">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start lg:sticky lg:top-48">
        <PricingSoonCard course={course} isEnrolled={isEnrolled} />
      </aside>

      <div className="min-w-0">
        {highlights.length > 0 && (
          <>
            <h2 className="lg:mt-10 text-[0.75rem] font-semibold tracking-wider uppercase text-slate-500">
              What&apos;s included
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-[0.9375rem] text-slate-800">
                  <Icon className="h-5 w-5 shrink-0 text-brand-600 mt-px" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <h2 className="mt-10 text-[0.75rem] font-semibold tracking-wider uppercase text-slate-500">
          Curriculum
        </h2>
        <div className="mt-3">
          {course.phases.map((phase) => (
            <div key={phase.name} className="mb-4">
              {course.phases.length > 1 && (
                <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 pt-2 pb-1.5">
                  <span className="text-[0.8125rem] font-semibold text-brand-700">{phase.name}</span>
                  <span className="text-[0.75rem] text-slate-400">{phase.detail}</span>
                </p>
              )}
              <ol>
                {phase.modules.map((mod, i) => (
                  <li
                    key={mod.title}
                    className="flex items-baseline gap-4 py-2.5 border-b border-slate-100 last:border-0"
                  >
                    <span className="font-mono text-[0.75rem] text-slate-400 w-5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[0.875rem] font-medium text-slate-800">
                      {mod.title}
                    </span>
                    <span className="text-[0.75rem] text-slate-500 shrink-0 hidden sm:block">
                      {mod.detail}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AllCourses() {
  return (
    <>
      <div className="text-center max-w-2xl mx-auto mb-12">
        <p className="text-[0.75rem] font-semibold tracking-wider uppercase text-brand-700 mb-3">
          Pricing
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-slate-950 leading-tight">
          Course fees are coming soon
        </h1>
        <p className="mt-4 text-[1rem] text-slate-600 leading-relaxed">
          We&apos;re finalising pricing for each course. Explore the curriculum now and we&apos;ll
          let you know as soon as enrolment opens.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {COURSES.map((course) => (
          <article
            key={course.slug}
            className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 sm:p-7"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-[0.75rem] font-semibold tracking-wider uppercase text-slate-500">
                {course.tag}
              </span>
              <span
                className={`text-[0.75rem] font-medium px-2.5 py-1 rounded-full border ${course.statusColor}`}
              >
                {course.status}
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl text-slate-950 leading-snug">
              {course.title}
            </h2>
            <p className="mt-4 flex items-center gap-2 text-[0.875rem] font-medium text-slate-700">
              <Clock className="h-4 w-4 text-brand-600" />
              Pricing announced soon
            </p>
            <Link
              href={`/pricing?course=${course.slug}`}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-slate-300 text-[0.9375rem] font-semibold text-slate-800 hover:border-slate-400 transition-colors md:mt-auto"
            >
              View course details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; expired?: string }>;
}) {
  const { course: slug, expired } = await searchParams;
  const course = COURSES.find((c) => c.slug === slug);
  const { isEnrolled } = await getSubscription();

  return (
    <>
      <main className="min-h-screen bg-slate-50 px-4 pt-40 lg:pt-44 pb-20 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {expired === "true" && (
            <div className="mb-8 max-w-2xl mx-auto rounded-lg border border-red-200 bg-red-50 p-4 text-center text-[0.9375rem] font-medium text-red-800">
              Your subscription has expired. Renewal options will be available once pricing is
              announced.
            </div>
          )}

          {course ? <CourseDetail course={course} isEnrolled={isEnrolled} /> : <AllCourses />}

          <p className="mt-16 text-center text-[0.875rem] text-slate-500">
            Questions about the course?{" "}
            <a
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-700 hover:text-brand-800"
            >
              Message us on WhatsApp
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
