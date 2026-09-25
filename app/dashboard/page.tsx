import Link from 'next/link';
import {
  ArrowRight,
  FlaskConical,
  TestTube,
  GraduationCap,
  Radio,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserProfile } from '@/app/actions/dashboard';
import { getSubscription } from '@/lib/get-subscription';
import { getCourseProgress } from '@/lib/course-progress';
import { COURSES } from '@/lib/course-catalog';

const exploreItems = [
  {
    title: 'Practice Challenges',
    description: 'JS & TypeScript coding challenges with AI feedback',
    href: '/dashboard/practice',
    icon: FlaskConical,
  },
  {
    title: 'Testing Tools',
    description: 'Practice automation on real, intentionally buggy web apps',
    href: '/dashboard/testing-tools',
    icon: TestTube,
  },
  {
    title: 'Interview Prep',
    description: 'JS, TS & Playwright interview questions and mock interviews',
    href: '/dashboard/interview-prep',
    icon: GraduationCap,
  },
];

// Deep-link a lesson key into the course player.
function lessonHref(slug: string, lessonKey: string | null) {
  return lessonKey
    ? `/dashboard/courses/${slug}?lesson=${lessonKey}`
    : `/dashboard/courses/${slug}`;
}

export default async function DashboardHomePage() {
  const [profile, subscription, progress] = await Promise.all([
    getUserProfile(),
    getSubscription(),
    getCourseProgress(),
  ]);

  if (!profile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-600">Loading your dashboard...</p>
      </div>
    );
  }

  const isEnrolled = subscription.isEnrolled;

  const firstName =
    profile.full_name?.split(' ')[0] || profile.username || 'there';

  // Slugs of courses that aren't open yet — never a resume target.
  const comingSoonSlugs = new Set(
    COURSES.filter((c) => c.comingSoon).map((c) => c.slug),
  );

  // The course to resume: the one the learner touched most recently, else the
  // one furthest along, else the first course. Only surfaced when enrolled, and
  // never a coming-soon course.
  const resumeCourse = isEnrolled
    ? [...progress]
        .filter((c) => !comingSoonSlugs.has(c.slug))
        .sort((a, b) => {
        if (a.lastActivityAt && b.lastActivityAt) {
          return b.lastActivityAt.localeCompare(a.lastActivityAt);
        }
        if (a.lastActivityAt) return -1;
        if (b.lastActivityAt) return 1;
        return b.percent - a.percent;
      })[0]
    : null;

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
      {/* Main column */}
      <div className="space-y-6 min-w-0">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-slate-950">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {isEnrolled
              ? 'Pick up where you left off, or bring your doubts to the weekend Q&A.'
              : 'Explore the courses below — your first lessons are an enrollment away.'}
          </p>
        </div>

        {/* Continue learning strip (enrolled only) */}
        {resumeCourse && resumeCourse.nextLessonTitle && (
          <Link
            href={lessonHref(resumeCourse.slug, resumeCourse.nextLessonKey)}
            className="group block bg-slate-950 rounded-xl p-5 hover:bg-slate-900 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <PlayCircle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-slate-400 mb-0.5">
                  {resumeCourse.lastActivityAt ? 'Continue where you left off' : 'Start learning'}
                </p>
                <h3 className="text-[0.9375rem] font-semibold text-white truncate">
                  {resumeCourse.nextLessonTitle}
                </h3>
                <p className="text-[0.7812rem] text-slate-400 truncate">
                  {resumeCourse.title}
                  {resumeCourse.nextModuleTitle
                    ? ` · ${resumeCourse.nextModuleTitle}`
                    : ''}
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-white bg-white/10 group-hover:bg-white/15 px-3.5 py-2 rounded-md shrink-0 transition-colors">
                Resume <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        )}

        {/* Courses */}
        <section className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
            <h2 className="text-[0.9375rem] font-semibold text-slate-950">
              {isEnrolled ? 'Your courses' : 'Courses available'}
            </h2>
            <Link
              href="/dashboard/courses"
              className="text-[0.8125rem] font-medium text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {COURSES.map((course) => {
              const p = progress.find((x) => x.slug === course.slug);
              return (
                <div
                  key={course.slug}
                  className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <h3 className="text-[0.9375rem] font-semibold text-slate-950">
                        {course.title}
                      </h3>
                      <span
                        className={`text-[0.6875rem] font-medium px-2 py-0.5 rounded-full border ${course.statusColor}`}
                      >
                        {course.status}
                      </span>
                    </div>
                    <p className="text-[0.8125rem] text-slate-600 leading-relaxed line-clamp-2 mb-2">
                      {course.description}
                    </p>
                    {isEnrolled && !course.comingSoon && p && p.totalPractice > 0 ? (
                      <div className="flex items-center gap-2.5 max-w-xs">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-brand-600 rounded-full"
                            style={{ width: `${p.percent}%` }}
                          />
                        </div>
                        <span className="text-[0.75rem] text-slate-500 shrink-0">
                          {p.passedPractice}/{p.totalPractice} practice
                        </span>
                      </div>
                    ) : (
                      <p className="text-[0.75rem] text-slate-500">
                        {course.meta.map((m) => m.value).join(' · ')}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2.5 shrink-0">
                    {course.comingSoon ? (
                      <Button
                        size="sm"
                        disabled
                        className="bg-slate-100 text-slate-400 font-medium rounded-md cursor-not-allowed"
                      >
                        Coming soon
                      </Button>
                    ) : isEnrolled ? (
                      <Button
                        asChild
                        size="sm"
                        className="bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-md"
                      >
                        <Link href={lessonHref(course.slug, p?.nextLessonKey ?? null)}>
                          <PlayCircle className="h-4 w-4 mr-1.5" />
                          Continue Learning
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-slate-300 text-slate-700 font-medium rounded-md"
                        >
                          <Link href={`/courses?syllabus=1#${course.slug}`}>View Curriculum</Link>
                        </Button>
                        <Button
                          asChild
                          size="sm"
                          className="bg-slate-950 hover:bg-slate-800 text-white font-medium rounded-md"
                        >
                          <Link href="/pricing">Enroll Now</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Explore QodeBench */}
        <section>
          <h2 className="text-[0.9375rem] font-semibold text-slate-950 mb-3">
            Explore QodeBench
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {exploreItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <Icon className="h-6 w-6 text-brand-600 mb-3" strokeWidth={1.75} />
                  <h3 className="text-[0.875rem] font-semibold text-slate-950 mb-1 group-hover:text-brand-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[0.7812rem] text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* Right column */}
      <aside className="space-y-6">
        {/* Your progress + next up */}
        <section className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 pt-5 pb-4 border-b border-slate-100">
            <h2 className="text-[0.9375rem] font-semibold text-slate-950">
              {isEnrolled ? 'Your progress' : 'What you get'}
            </h2>
          </div>

          {isEnrolled ? (
            <div className="px-5 py-4 space-y-4">
              {progress.map((p) => {
                const soon = comingSoonSlugs.has(p.slug);
                return (
                  <div key={p.slug}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[0.8125rem] font-medium text-slate-800 truncate pr-2">
                        {p.title}
                      </span>
                      <span className="text-[0.75rem] text-slate-500 shrink-0">
                        {soon ? 'Coming soon' : `${p.percent}%`}
                      </span>
                    </div>
                    {!soon && (
                      <>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-brand-600 rounded-full"
                            style={{ width: `${p.percent}%` }}
                          />
                        </div>
                        <p className="text-[0.7188rem] text-slate-500 mt-1">
                          {p.passedPractice} of {p.totalPractice} practice sets done
                        </p>
                      </>
                    )}
                  </div>
                );
              })}

              {resumeCourse && resumeCourse.nextLessonTitle && (
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-slate-400 mb-1">
                    Next up
                  </p>
                  <Link
                    href={lessonHref(resumeCourse.slug, resumeCourse.nextLessonKey)}
                    className="group flex items-center gap-2 text-[0.8125rem] font-medium text-brand-700 hover:text-brand-800"
                  >
                    <span className="truncate">{resumeCourse.nextLessonTitle}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <ul className="px-5 py-4 space-y-2.5">
              {[
                'Full course video library',
                'Hands-on practice & assignments',
                'Live weekend Q&A with the instructor',
                'Mock interviews & career support',
              ].map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
                  <span className="text-[0.8125rem] text-slate-700">{line}</span>
                </li>
              ))}
              <li className="pt-2">
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-slate-950 hover:bg-slate-800 text-white font-medium rounded-md"
                >
                  <Link href="/pricing">See plans</Link>
                </Button>
              </li>
            </ul>
          )}
        </section>

        {/* Live Q&A reminder */}
        <section className="bg-slate-950 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2.5">
            <Radio className="h-4 w-4 text-red-400" />
            <span className="text-[0.8125rem] font-semibold text-white">
              Live Q&A — Every Saturday
            </span>
          </div>
          <p className="text-[0.7812rem] text-slate-400 leading-relaxed mb-3">
            11:00 AM IST. Doubts from the week&apos;s lessons, answered live by the
            instructor.
          </p>
          <p className="text-[0.75rem] text-slate-500">
            {isEnrolled
              ? 'Your seat is included in your plan.'
              : 'Included with every paid plan.'}
          </p>
        </section>
      </aside>
    </div>
  );
}
