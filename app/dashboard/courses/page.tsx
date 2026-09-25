import Link from 'next/link';
import { ArrowRight, CheckCircle2, PlayCircle, FileText, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSubscription } from '@/lib/get-subscription';
import { COURSES } from '@/lib/course-catalog';

const format = [
  { icon: PlayCircle, text: 'Recorded lectures' },
  { icon: FileText, text: 'Revision notes per session' },
  { icon: Radio, text: 'Live weekend Q&A' },
];

export default async function DashboardCoursesPage() {
  const { isEnrolled } = await getSubscription();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Courses & Curriculum</h1>
        <p className="text-sm text-slate-600 mt-1">
          {isEnrolled
            ? 'You have full access. Open a course to continue where you left off.'
            : 'Enroll once to unlock both courses, all sessions and the weekend live Q&A.'}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {COURSES.map((course) => {
          const totalModules = course.phases.reduce((n, p) => n + p.modules.length, 0);

          return (
            <article
              key={course.slug}
              className="flex flex-col bg-white rounded-xl border border-slate-200"
            >
              <div className="p-7 pb-0 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[0.75rem] font-semibold tracking-wider uppercase text-slate-500">
                    {course.tag}
                  </span>
                  {course.comingSoon ? (
                    <span className="text-[0.75rem] font-medium px-2.5 py-1 rounded-full border bg-slate-100 text-slate-600 border-slate-200">
                      Coming soon
                    </span>
                  ) : isEnrolled ? (
                    <span className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Enrolled
                    </span>
                  ) : (
                    <span
                      className={`text-[0.75rem] font-medium px-2.5 py-1 rounded-full border ${course.statusColor}`}
                    >
                      {course.status}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-950 mb-2">{course.title}</h2>
                <p className="text-[0.8438rem] text-slate-600 leading-relaxed mb-5">
                  {course.description}
                </p>

                <dl className="flex flex-wrap gap-x-8 gap-y-2 pb-5 border-b border-slate-100">
                  {course.meta.map((m) => (
                    <div key={m.label}>
                      <dt className="text-[0.7188rem] text-slate-500">{m.label}</dt>
                      <dd className="text-[0.8438rem] font-semibold text-slate-900">{m.value}</dd>
                    </div>
                  ))}
                </dl>

                {/* Syllabus preview */}
                <div className="pt-5 pb-5">
                  <p className="text-[0.7188rem] font-semibold tracking-wider uppercase text-slate-500 mb-3">
                    {totalModules} modules
                    {course.phases.length > 1 && ` across ${course.phases.length} phases`}
                  </p>
                  <ul className="space-y-1.5">
                    {course.phases[0].modules.slice(0, 4).map((m, i) => (
                      <li key={m.title} className="flex gap-3 text-[0.8125rem] text-slate-700">
                        <span className="font-mono text-[0.6875rem] text-slate-400 w-5 shrink-0 mt-px">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {m.title}
                      </li>
                    ))}
                    {totalModules > 4 && (
                      <li className="text-[0.7812rem] text-slate-400 pl-8">
                        + {totalModules - 4} more modules
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 pb-6">
                  {format.map((f) => {
                    const Icon = f.icon;
                    return (
                      <span
                        key={f.text}
                        className="inline-flex items-center gap-1.5 text-[0.75rem] text-slate-500"
                      >
                        <Icon className="h-3.5 w-3.5 text-brand-600" />
                        {f.text}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="px-7 pb-7 flex gap-3">
                {course.comingSoon ? (
                  <Button
                    disabled
                    className="flex-1 h-11 bg-slate-100 text-slate-400 font-semibold rounded-md cursor-not-allowed"
                  >
                    Coming soon
                  </Button>
                ) : isEnrolled ? (
                  <Button
                    asChild
                    className="flex-1 h-11 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-md"
                  >
                    <Link href={`/dashboard/courses/${course.slug}`}>
                      Open Course
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 h-11 font-semibold border-slate-300 text-slate-800 hover:bg-slate-50 rounded-md"
                    >
                      <Link href={`/courses?syllabus=1#${course.slug}`}>View Curriculum</Link>
                    </Button>
                    <Button
                      asChild
                      className="flex-1 h-11 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-md"
                    >
                      <Link href={`/pricing?course=${course.slug}`}>Enroll Now</Link>
                    </Button>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
