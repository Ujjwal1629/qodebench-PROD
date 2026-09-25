import Link from "next/link";
import { ArrowRight, PlayCircle, FileText, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COURSES } from "@/lib/course-catalog";
import { EnrollButton } from "@/components/courses/enroll-button";

const format = [
  { icon: PlayCircle, text: "Recorded video + written theory for every topic" },
  { icon: FileText, text: "Q&A thread under each lesson, answered by the instructor" },
  { icon: Radio, text: "Live doubt-clearing session every weekend" },
];

export function Courses() {
  return (
    <section id="courses" className="bg-slate-50 py-20 lg:py-28 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-[0.8125rem] font-semibold tracking-[0.16em] uppercase text-brand-600 mb-4">
            Courses
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-slate-950 tracking-tight mb-4">
            Pick your track. The format is the same for both.
          </h2>
        </div>

        {/* Shared format line */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 mb-14">
          {format.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.text} className="flex items-center gap-2.5 text-[0.875rem] text-slate-700">
                <Icon className="h-5 w-5 text-brand-600 shrink-0" />
                {f.text}
              </div>
            );
          })}
        </div>

        {/* Course cards */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {COURSES.map((course) => (
            <article
              key={course.slug}
              className="flex flex-col bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-[0_16px_40px_-20px_rgba(15,23,42,0.2)] transition-all duration-200"
            >
              <div className="p-8 pb-0">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[0.75rem] font-semibold tracking-wider uppercase text-slate-500">
                    {course.tag}
                  </span>
                  <span
                    className={`text-[0.75rem] font-medium px-2.5 py-1 rounded-full border ${course.statusColor}`}
                  >
                    {course.status}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-slate-950 mb-3">{course.title}</h3>
                <p className="text-[0.9375rem] text-slate-600 leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Meta row */}
                <dl className="flex gap-8 pb-6 border-b border-slate-100">
                  {course.meta.map((m) => (
                    <div key={m.label}>
                      <dt className="text-[0.75rem] text-slate-500 mb-0.5">{m.label}</dt>
                      <dd className="text-[0.875rem] font-semibold text-slate-900">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Curriculum preview — capped height with fade, full syllabus lives on /courses */}
              <div className="px-8 pt-6 relative">
                <p className="text-[0.75rem] font-semibold tracking-wider uppercase text-slate-500 mb-4">
                  Curriculum
                </p>
                <div className="h-[280px] overflow-hidden">
                  {course.phases.map((phase) => (
                    <div key={phase.name} className="mb-2">
                      {course.phases.length > 1 && (
                        <p className="flex items-baseline justify-between gap-3 pt-2 pb-1.5">
                          <span className="text-[0.8125rem] font-semibold text-brand-700">
                            {phase.name}
                          </span>
                          <span className="text-[0.7188rem] text-slate-400 shrink-0">
                            {phase.detail}
                          </span>
                        </p>
                      )}
                      <ol>
                        {phase.modules.map((module, i) => (
                          <li
                            key={module.title}
                            className="flex items-baseline gap-4 py-2.5 border-b border-slate-100 last:border-0"
                          >
                            <span className="font-mono text-[0.75rem] text-slate-400 w-5 shrink-0">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="flex-1 text-[0.875rem] font-medium text-slate-800">
                              {module.title}
                            </span>
                            <span className="text-[0.75rem] text-slate-500 shrink-0 hidden sm:block">
                              {module.detail}
                            </span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>

                {/* Fade + view more */}
                <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white via-white/90 to-transparent flex items-end justify-center pb-1">
                  <Link
                    href={`/courses?syllabus=1#${course.slug}`}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-slate-300 bg-white text-[0.8125rem] font-semibold text-slate-700 hover:border-slate-400 hover:text-slate-950 shadow-sm transition-colors"
                  >
                    View Full Curriculum
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="mt-auto p-8 pt-6">
                <EnrollButton courseSlug={course.slug} className="w-full h-11 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-md" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
