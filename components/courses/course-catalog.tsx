"use client";

import { useState } from "react";
import { ChevronDown, PlayCircle, FileText, Radio } from "lucide-react";
import { COURSES } from "@/lib/course-catalog";
import { EnrollButton } from "@/components/courses/enroll-button";
import { cn } from "@/lib/utils";

const format = [
  { icon: PlayCircle, text: "Recorded video + written theory for every topic" },
  { icon: FileText, text: "Q&A thread under each lesson, answered by the instructor" },
  { icon: Radio, text: "Live doubt-clearing session every weekend" },
];

export function CourseCatalog() {
  // Active phase per course, keyed by course slug
  const [activePhases, setActivePhases] = useState<Record<string, number>>({});
  // Open module per course, keyed by "slug:phase" → module index
  const [openModules, setOpenModules] = useState<Record<string, number | null>>({});

  const getActivePhase = (slug: string) => activePhases[slug] ?? 0;

  const toggleModule = (slug: string, phase: number, index: number) => {
    const key = `${slug}:${phase}`;
    setOpenModules((prev) => ({
      ...prev,
      [key]: prev[key] === index ? null : index,
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8">
      {/* Shared format line */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4 sm:gap-10 pb-14">
        {format.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.text} className="flex items-center gap-2.5 text-[14px] text-slate-700">
              <Icon className="h-5 w-5 text-brand-600 shrink-0" />
              {f.text}
            </div>
          );
        })}
      </div>

      <div className="space-y-10">
        {COURSES.map((course) => {
          const phaseIndex = getActivePhase(course.slug);
          const phase = course.phases[phaseIndex] ?? course.phases[0];
          const openKey = `${course.slug}:${phaseIndex}`;

          return (
            <article
              key={course.slug}
              id={course.slug}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden scroll-mt-32"
            >
              {/* Course header */}
              <div className="p-8 lg:p-10 border-b border-slate-200">
                <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[12px] font-semibold tracking-wider uppercase text-slate-500">
                        {course.tag}
                      </span>
                      <span
                        className={`text-[12px] font-medium px-2.5 py-1 rounded-full border ${course.statusColor}`}
                      >
                        {course.status}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-slate-950 mb-3">
                      {course.title}
                    </h2>
                    <p className="text-[15px] text-slate-600 leading-relaxed max-w-2xl mb-6">
                      {course.description}
                    </p>
                    <dl className="flex flex-wrap gap-x-10 gap-y-3">
                      {course.meta.map((m) => (
                        <div key={m.label}>
                          <dt className="text-[12px] text-slate-500 mb-0.5">{m.label}</dt>
                          <dd className="text-[14px] font-semibold text-slate-900">{m.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="shrink-0">
                    <EnrollButton className="h-12 px-8 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-md" />
                    <p className="text-[12px] text-slate-500 mt-2.5 text-center">
                      Included in every paid plan
                    </p>
                  </div>
                </div>
              </div>

              {/* Curriculum */}
              <div className="p-8 lg:p-10 pt-6 lg:pt-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  <p className="text-[12px] font-semibold tracking-wider uppercase text-slate-500">
                    Curriculum
                    <span className="normal-case tracking-normal font-normal text-slate-400 ml-2">
                      {phase.detail}
                    </span>
                  </p>

                  {/* Phase toggle */}
                  {course.phases.length > 1 && (
                    <div className="flex gap-2">
                      {course.phases.map((p, pi) => (
                        <button
                          key={p.name}
                          onClick={() =>
                            setActivePhases((prev) => ({ ...prev, [course.slug]: pi }))
                          }
                          className={cn(
                            "px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors",
                            phaseIndex === pi
                              ? "bg-brand-600 border-brand-600 text-white"
                              : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
                          )}
                        >
                          {p.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200">
                  {phase.modules.map((module, i) => {
                    const isOpen = openModules[openKey] === i;
                    const expandable = module.lessons.length > 0;
                    return (
                      <div key={module.title} className="border-b border-slate-200">
                        <button
                          onClick={() => expandable && toggleModule(course.slug, phaseIndex, i)}
                          className={cn(
                            "w-full flex items-center gap-5 py-4 text-left group",
                            !expandable && "cursor-default"
                          )}
                          aria-expanded={isOpen}
                        >
                          <span className="font-mono text-[13px] text-slate-400 group-hover:text-brand-600 transition-colors w-6 shrink-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1">
                            <span className="block text-[15px] font-semibold text-slate-950">
                              {module.title}
                            </span>
                          </span>
                          <span className="text-[13px] text-slate-500 shrink-0 hidden sm:block">
                            {module.detail}
                          </span>
                          {expandable && (
                            <ChevronDown
                              className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          )}
                        </button>

                        {isOpen && expandable && (
                          <ul className="pb-5 pl-11 space-y-2">
                            {module.lessons.map((lesson) => (
                              <li
                                key={lesson}
                                className="flex gap-3 text-[14px] text-slate-600 leading-snug"
                              >
                                <PlayCircle className="h-4 w-4 text-slate-300 mt-0.5 shrink-0" />
                                {lesson}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
