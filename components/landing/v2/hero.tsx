import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CoursesLink } from "@/components/courses/courses-link";

const tools = [
  "Playwright",
  "Selenium",
  "TypeScript",
  "JavaScript",
  "Postman",
  "GitHub Actions",
  "PromptFoo",
  "DeepEval",
  "LangChain",
  "LangGraph",
  "OpenAI",
  "Claude",
  "Gemini",
  "Giskard",
  "CI/CD",
];

export function Hero() {
  return (
    <section className="relative bg-white pt-36 lg:pt-44 border-b border-slate-200 overflow-hidden">
      {/* Subtle diagonal line texture, kept very light */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent, transparent 120px, rgb(241 245 249) 120px, rgb(241 245 249) 121px)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <p className="text-[0.8125rem] font-semibold tracking-[0.16em] uppercase text-brand-600 mb-6">
          Online QA Engineering Courses
        </p>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.15] text-slate-950 tracking-tight mb-6">
          Learn Playwright and AI Testing.
          <br className="hidden lg:block" />{" "}
          Become a job-ready QA engineer.
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
          Structured video courses with theory notes beside every lesson, a Q&amp;A thread
          for your doubts, and a live session with the instructor every weekend.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 text-[0.9375rem] font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-md"
          >
            <CoursesLink>
              View Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </CoursesLink>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 px-8 text-[0.9375rem] font-semibold border-slate-300 text-slate-800 hover:bg-slate-50 rounded-md"
          >
            <Link href="/signup">Start Learning Free</Link>
          </Button>
        </div>

        {/* Courses line — Scaler-style program listing */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 text-[0.8125rem]">
          <span className="font-semibold tracking-[0.14em] uppercase text-slate-400 sm:mr-5">
            Courses
          </span>
          <span className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-slate-700 font-medium">
            <span>Playwright Test Automation</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span>AI &amp; ML Testing Professional Course</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span>Live Weekend Q&amp;A</span>
          </span>
        </div>
      </div>

      {/* Tools marquee — anchors the hero and hints there's more below */}
      <div className="relative mt-14 lg:mt-16 border-t border-slate-200 bg-slate-50/60">
        <div className="max-w-7xl mx-auto flex items-center">
          <span className="hidden md:block shrink-0 pl-6 lg:pl-8 pr-8 py-5 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase text-slate-400 bg-slate-50/60 relative z-10">
            Tools you&apos;ll master
          </span>

          <div className="relative flex-1 overflow-hidden py-5">
            {/* Edge fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10" />

            <div className="flex w-max animate-marquee gap-10 pr-10">
              {[...tools, ...tools].map((tool, i) => (
                <span
                  key={`${tool}-${i}`}
                  className="flex items-center gap-10 text-[0.875rem] font-semibold text-slate-500 whitespace-nowrap"
                >
                  {tool}
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
