// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-20">
        <div className="max-w-2xl w-full space-y-8 sm:space-y-10">

          {/* Brand */}
          <div>
            <h1 className="text-heading sm:text-display font-bold text-neutral-800 mb-3">
              PROXY
            </h1>
            <p className="text-body sm:text-large text-neutral-600 leading-relaxed">
              Helps neurodivergent students access academic support —
              without navigating bureaucracy alone.
            </p>
          </div>

          {/* The problem */}
          <section aria-labelledby="problem-heading">
            <div className="rounded-card bg-white border border-neutral-200 p-4 sm:p-6 space-y-2">
              <h2
                id="problem-heading"
                className="text-sm font-medium text-neutral-400 uppercase tracking-wide"
              >
                The problem
              </h2>
              <p className="text-body text-neutral-700 leading-relaxed">
                Getting academic support requires exactly the skills
                neurodivergent students struggle with most — planning,
                self-advocacy, navigating multiple offices.
              </p>
              <p className="text-body text-primary-600 font-medium">
                PROXY does that work for you.
              </p>
            </div>
          </section>

          {/* How it works */}
          <section aria-labelledby="how-it-works-heading">
            <h2
              id="how-it-works-heading"
              className="text-sm font-medium text-neutral-400 uppercase tracking-wide mb-4"
            >
              How it works
            </h2>
            <ol className="space-y-3 list-none">
              {[
                {
                  step: "1",
                  title: "Describe what is hard",
                  description:
                    "In your own words. No forms. No diagnosis required.",
                },
                {
                  step: "2",
                  title: "PROXY understands",
                  description:
                    "AI identifies your barriers and maps them to support you are entitled to.",
                },
                {
                  step: "3",
                  title: "Follow your pathway",
                  description:
                    "One step at a time. PROXY holds the map.",
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="flex gap-3 sm:gap-4 rounded-card bg-white border border-neutral-200 p-4 sm:p-5"
                >
                  <div
                    className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs sm:text-sm font-bold"
                    aria-hidden="true"
                  >
                    {item.step}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-body font-semibold text-neutral-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-500">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* CTA */}
          <div className="space-y-3">
            <Link
              href="/intake"
              className="block w-full rounded-card bg-primary-500 px-6 sm:px-8 py-4 text-center text-body sm:text-large font-semibold text-white hover:bg-primary-600 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Find your support pathway
              <span aria-hidden="true"> →</span>
            </Link>
            <p className="text-sm text-center text-neutral-400">
              No account required. Your information stays private.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-neutral-400 text-center">
            PROXY — Institutional Navigation for Neurodivergent Learners
          </p>
        </div>
      </footer>
    </div>
  );
}