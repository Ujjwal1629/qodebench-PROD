import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CourseCatalog } from "@/components/courses/course-catalog";
import { Footer } from "@/components/landing/v2/footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Courses – QodeBench | Playwright & AI Testing",
  description:
    "Structured QA engineering courses: Playwright Test Automation and AI-Powered Testing. Video lessons with theory notes, Q&A under every topic, and live weekend sessions.",
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ syllabus?: string }>;
}) {
  // Logged-in users get the dashboard course list instead of the sales catalog,
  // unless they explicitly asked for the public syllabus view.
  const { syllabus } = await searchParams;

  if (syllabus !== "1") {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) redirect("/dashboard/courses");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page header */}
      <section className="bg-white pt-40 lg:pt-44 pb-14 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-[0.8125rem] font-semibold tracking-[0.16em] uppercase text-brand-600 mb-5">
            Course Catalog
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.15] text-slate-950 tracking-tight mb-5">
            Our courses
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Every course follows the same format — watch the video, read the theory,
            ask your doubts under the lesson, and clear them live every weekend. One
            subscription unlocks everything.
          </p>
        </div>
      </section>

      <section className="py-14 lg:py-16">
        <CourseCatalog />
      </section>

      <Footer />
    </div>
  );
}
