// app/intake/page.tsx
import type { Metadata } from "next";
import { IntakeContainer } from "@/components/intake/IntakeContainer";

export const metadata: Metadata = {
  title: "PROXY — Tell us what's happening",
};

export default function IntakePage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-10">
          <h1 className="text-display font-semibold text-neutral-800 mb-2">
            PROXY
          </h1>
          <p className="text-body text-neutral-400">
            Institutional navigation for neurodivergent learners.
          </p>
        </div>
        <IntakeContainer />
      </div>
    </div>
  );
}