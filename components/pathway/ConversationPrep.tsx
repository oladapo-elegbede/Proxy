// components/pathway/ConversationPrep.tsx
"use client";

import { useState } from "react";
import type { ConversationScript } from "@/app/api/conversation-architect/route";

interface ConversationPrepProps {
  stepTitle: string;
  stepDescription: string;
  barrierSummary: string;
}

export function ConversationPrep({
  stepTitle,
  stepDescription,
  barrierSummary,
}: ConversationPrepProps) {
  const [script, setScript] = useState<ConversationScript | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateScript() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/conversation-architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepTitle, stepDescription, barrierSummary }),
      });

      const json = await response.json() as
        | { success: true; data: ConversationScript }
        | { success: false; error: { userMessage: string } };

      if (!json.success) {
        setError(json.error.userMessage);
        return;
      }

      setScript(json.data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      {/* Loading announcement for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {loading && "Generating your conversation script. Please wait."}
        {script && "Your conversation preparation script is ready."}
        {error && `Error: ${error}`}
      </div>

      {!script && (
        <div>
          <button
            onClick={generateScript}
            disabled={loading}
            aria-busy={loading}
            aria-label="Generate a preparation script for this conversation"
            className="rounded-soft border border-primary-500 px-5 py-2.5 text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors duration-fast disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <span aria-hidden="true">📝 </span>
            {loading ? "Preparing your script..." : "Prepare what to say"}
          </button>
          {error && (
            <p className="mt-2 text-sm text-warning" role="alert">
              {error}
            </p>
          )}
        </div>
      )}

      {script && (
        <section
          aria-labelledby="prep-script-heading"
          className="space-y-0 rounded-card border border-primary-100 bg-primary-50 overflow-hidden"
        >
          <div className="px-5 py-3 border-b border-primary-100">
            <h3
              id="prep-script-heading"
              className="text-sm font-semibold text-primary-600"
            >
              <span aria-hidden="true">📝 </span>
              What to say
            </h3>
          </div>

          <dl className="divide-y divide-primary-100">
            <div className="px-5 py-4">
              <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                How to open
              </dt>
              <dd className="text-body text-neutral-800 italic">
                &ldquo;{script.opening}&rdquo;
              </dd>
            </div>

            <div className="px-5 py-4">
              <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                Your core message
              </dt>
              <dd className="text-body text-neutral-700">
                {script.coreStatement}
              </dd>
            </div>

            {script.likelyResponses.map((item, index) => (
              <div key={index} className="px-5 py-4">
                <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                  If they say...
                </dt>
                <dd className="text-sm text-neutral-500 mb-3 italic">
                  &ldquo;{item.response}&rdquo;
                </dd>
                <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-1">
                  You can say...
                </dt>
                <dd className="text-sm text-neutral-700">{item.reply}</dd>
              </div>
            ))}

            <div className="px-5 py-4">
              <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                If it gets hard
              </dt>
              <dd className="text-body text-neutral-800 italic">
                &ldquo;{script.ifItGetsHard}&rdquo;
              </dd>
            </div>

            <div className="px-5 py-4">
              <dt className="text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                How to close
              </dt>
              <dd className="text-body text-neutral-700">{script.closing}</dd>
            </div>
          </dl>
        </section>
      )}
    </div>
  );
}