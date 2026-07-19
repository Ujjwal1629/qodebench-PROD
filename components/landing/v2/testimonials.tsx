const testimonials = [
  {
    quote:
      "The Playwright course and interview questions helped me crack my automation testing interview. Being able to ask a doubt under the exact lesson and get an answer made the difference.",
    name: "Priya Sharma",
    role: "QA Engineer, TCS",
    initials: "PS",
  },
  {
    quote:
      "Real-world practice challenges are exactly what I needed. I went from manual testing to automation in two months — the weekend sessions kept me from getting stuck.",
    name: "Rahul Verma",
    role: "Automation Tester",
    initials: "RV",
  },
  {
    quote:
      "As someone switching to QA, QodeBench gave me the practical experience and confidence I was missing. The structured path from basics to Playwright made complex concepts click.",
    name: "Vikram Joshi",
    role: "Career Switcher → QA",
    initials: "VJ",
  },
];

export function Testimonials() {
  return (
    <section id="reviews" className="bg-white py-20 lg:py-28 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-[13px] font-semibold tracking-[0.14em] uppercase text-brand-600 mb-4">
            Learner Stories
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-slate-950 tracking-tight">
            People who learned here, in their own words.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col justify-between bg-white border border-slate-200 rounded-xl p-8"
            >
              <blockquote className="font-serif text-[17px] leading-relaxed text-slate-800 mb-8">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-6 border-t border-slate-100">
                <span className="h-10 w-10 rounded-full bg-slate-950 text-white text-[13px] font-semibold flex items-center justify-center shrink-0">
                  {t.initials}
                </span>
                <span>
                  <span className="block text-[14px] font-semibold text-slate-950">{t.name}</span>
                  <span className="block text-[13px] text-slate-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
