// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full space-y-10">

          {/* Brand */}
          <div>
            <h1 className="text-display font-bold text-neutral-800 mb-3">
              PROXY
            </h1>
            <p className="text-large text-neutral-600 leading-relaxed">
              The system designed to help neurodivergent students access
              academic support — without needing to understand institutional
              bureaucracy.
            </p>
          </div>

          {/* The problem */}
          <div className="rounded-card bg-white border border-neutral-200 p-6 space-y-3">
            <p className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
              The problem
            </p>
            <p className="text-body text-neutral-700 leading-relaxed">
              The systems built to support neurodivergent learners require
              exactly the executive-function skills those learners struggle
              with most. To get help with planning, you must first navigate
              a multi-step bureaucratic process.
            </p>
            <p className="text-body text-neutral-700 leading-relaxed">
              PROXY removes that burden entirely.
            </p>
          </div>

          {/* How it works */}
          <div className="space-y-4">
            <p className="text-sm font-medium text-neutral-400 uppercase tracking-wide">
              How it works
            </p>
            <div className="grid gap-3">
              {[
                {
                  step: "1",
                  title: "Describe what is hard",
                  description:
                    "In your own words. No forms. No checkboxes. No clinical language required.",
                },
                {
                  step: "2",
                  title: "PROXY understands your situation",
                  description:
                    "AI identifies your functional barriers and maps them to the support you are entitled to.",
                },
                {
                  step: "3",
                  title: "Follow your personalised pathway",
                  description:
                    "Step by step. One action at a time. PROXY holds the map so you never get lost.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 rounded-card bg-white border border-neutral-200 p-5"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-body font-semibold text-neutral-800 mb-1">
                      {item.title}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Link
              href="/intake"
              className="block w-full rounded-card bg-primary-500 px-8 py-4 text-center text-large font-semibold text-white hover:bg-primary-600 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Find your support pathway →
            </Link>
            <p className="text-sm text-center text-neutral-400">
              No account required. Your information stays private.
            </p>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-200 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-neutral-400 text-center">
            PROXY — Institutional Navigation for Neurodivergent Learners
          </p>
        </div>
      </div>
    </div>
  );
}