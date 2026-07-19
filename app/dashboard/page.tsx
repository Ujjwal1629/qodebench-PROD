import Link from 'next/link';
import {
  ArrowRight,
  FlaskConical,
  TestTube,
  GraduationCap,
  Trophy,
  Flame,
  CheckCircle2,
  Star,
  Radio,
  PlayCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserStats, getUserProfile } from '@/app/actions/dashboard';
import { getSubscription } from '@/lib/get-subscription';
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

export default async function DashboardHomePage() {
  const [stats, profile, subscription] = await Promise.all([
    getUserStats(),
    getUserProfile(),
    getSubscription(),
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

  const performanceRows = [
    {
      label: 'Total points',
      value: stats ? stats.totalPoints.toLocaleString('en-IN') : '0',
      icon: Star,
    },
    {
      label: 'Current streak',
      value: stats ? `${stats.currentStreak} day${stats.currentStreak === 1 ? '' : 's'}` : '0 days',
      icon: Flame,
    },
    {
      label: 'Challenges completed',
      value: stats ? String(stats.challengesCompleted) : '0',
      icon: CheckCircle2,
    },
    {
      label: 'Global rank',
      value: stats?.globalRank ? `#${stats.globalRank}` : '—',
      icon: Trophy,
    },
  ];

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

        {/* Courses */}
        <section className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
            <h2 className="text-[15px] font-semibold text-slate-950">
              {isEnrolled ? 'Your courses' : 'Courses available'}
            </h2>
            <Link
              href="/courses"
              className="text-[13px] font-medium text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {COURSES.map((course) => (
              <div
                key={course.slug}
                className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h3 className="text-[15px] font-semibold text-slate-950">
                      {course.title}
                    </h3>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${course.statusColor}`}
                    >
                      {course.status}
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2 mb-2">
                    {course.description}
                  </p>
                  <p className="text-[12px] text-slate-500">
                    {course.meta.map((m) => m.value).join(' · ')}
                  </p>
                </div>

                <div className="flex gap-2.5 shrink-0">
                  {isEnrolled ? (
                    <Button
                      asChild
                      size="sm"
                      className="bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-md"
                    >
                      <Link href={`/dashboard/courses/${course.slug}`}>
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
                        <Link href={`/courses#${course.slug}`}>View Curriculum</Link>
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
            ))}
          </div>
        </section>

        {/* Explore QodeBench */}
        <section>
          <h2 className="text-[15px] font-semibold text-slate-950 mb-3">
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
                  <h3 className="text-[14px] font-semibold text-slate-950 mb-1 group-hover:text-brand-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[12.5px] text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* Right column — performance */}
      <aside className="space-y-6">
        <section className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 pt-5 pb-4 border-b border-slate-100">
            <h2 className="text-[15px] font-semibold text-slate-950">Performance</h2>
          </div>
          <div className="px-5 py-2">
            {performanceRows.map((row, i) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.label}
                  className={`flex items-center justify-between py-3.5 ${
                    i < performanceRows.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span className="text-[13px] text-slate-600">{row.label}</span>
                  </div>
                  <span className="text-[14px] font-semibold text-slate-950">
                    {row.value}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="px-5 pb-5">
            <Link
              href="/dashboard/leaderboard"
              className="text-[13px] font-medium text-brand-700 hover:text-brand-800 inline-flex items-center gap-1"
            >
              View leaderboard <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        {/* Live Q&A reminder */}
        <section className="bg-slate-950 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2.5">
            <Radio className="h-4 w-4 text-red-400" />
            <span className="text-[13px] font-semibold text-white">
              Live Q&A — Every Saturday
            </span>
          </div>
          <p className="text-[12.5px] text-slate-400 leading-relaxed mb-3">
            11:00 AM IST. Doubts from the week&apos;s lessons, answered live by the
            instructor.
          </p>
          <p className="text-[12px] text-slate-500">
            {isEnrolled
              ? 'Your seat is included in your plan.'
              : 'Included with every paid plan.'}
          </p>
        </section>
      </aside>
    </div>
  );
}
