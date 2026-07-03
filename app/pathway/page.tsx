// app/pathway/page.tsx
"use client";

import { useSessionStore } from "@/lib/state";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AccommodationsPanel } from "@/components/pathway/AccommodationsPanel";
import { ConversationPrep } from "@/components/pathway/ConversationPrep";

const NODE_TYPE_STYLES = {
  UNDERSTAND: "bg-blue-50 text-blue-700 border-blue-200",
  PREPARE: "bg-amber-50 text-amber-700 border-amber-200",
  ACT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CONVERSATION: "bg-purple-50 text-purple-700 border-purple-200",
};

const NODE_TYPE_ICONS = {
  UNDERSTAND: "📖",
  PREPARE: "📋",
  ACT: "✅",
  CONVERSATION: "💬",
};

const NODE_TYPE_LABELS = {
  UNDERSTAND: "Learn",
  PREPARE: "Prepare",
  ACT: "Do",
  CONVERSATION: "Talk",
};

export default function PathwayPage() {
  const router = useRouter();
  const session = useSessionStore((s) => s.session);
  const completeNode = useSessionStore((s) => s.completeNode);

  useEffect(() => {
    if (!session) router.push("/intake");
  }, [session, router]);

  if (!session) return null;

  const { pathway } = session;
  const completedCount = pathway.nodes.filter(
    (n) => n.status === "COMPLETED"
  ).length;
  const activeNode = pathway.nodes.find((n) => n.status === "ACTIVE");
  const totalNodes = pathway.nodes.length;
  const allDone = completedCount === totalNodes;
  const progressPercent = Math.round((completedCount / totalNodes) * 100);

  // Find the next step after the active one — used for "Next up" preview
  const activeIndex = pathway.nodes.findIndex((n) => n.status === "ACTIVE");
  const nextNode =
    activeIndex !== -1 ? pathway.nodes[activeIndex + 1] : undefined;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-large sm:text-heading font-semibold text-neutral-800 truncate">
              Your Pathway
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5 truncate">
              {session.intakeSession.barrierSummary.slice(0, 50)}...
            </p>
          </div>
          <div
            className="text-right flex-shrink-0"
            aria-live="polite"
            aria-atomic="true"
          >
            <p
              className="text-large sm:text-display font-bold text-primary-500"
              aria-label={`${completedCount} of ${totalNodes} steps completed`}
            >
              {completedCount}/{totalNodes}
            </p>
            <p className="text-xs text-neutral-400" aria-hidden="true">
              steps done
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-3">
          <div
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Pathway progress: ${progressPercent}% complete`}
            className="h-1.5 bg-neutral-100 rounded-full overflow-hidden"
          >
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-slow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* All done banner */}
      {allDone && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6" role="status">
          <div className="rounded-card bg-primary-500 p-5 sm:p-6 text-white text-center">
            <p className="text-large sm:text-display font-bold mb-2">
              <span aria-hidden="true">🎉 </span>
              Pathway Complete
            </p>
            <p className="text-body opacity-90">
              You have navigated every step. Your accommodation process is
              underway.
            </p>
          </div>
        </div>
      )}

      {/* Accommodations */}
      <div className="pt-6 sm:pt-8">
        <AccommodationsPanel
          barrierIds={session.intakeSession.matchedBarrierIds}
        />
      </div>

      {/* Steps */}
      <ol
        className="max-w-2xl mx-auto px-4 sm:px-6 py-4 space-y-3 list-none"
        aria-label="Your pathway steps"
      >
        {pathway.nodes.map((node, index) => {
          const isActive = node.status === "ACTIVE";
          const isCompleted = node.status === "COMPLETED";
          const isFuture = node.status === "FUTURE";

          return (
            <li
              key={node.id}
              aria-current={isActive ? "step" : undefined}
              className={`rounded-card border p-4 sm:p-5 transition-all duration-medium ${
                isActive
                  ? "border-primary-500 bg-white shadow-sm"
                  : isCompleted
                  ? "border-neutral-100 bg-neutral-50"
                  : "border-neutral-100 bg-white opacity-50"
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                    isCompleted
                      ? "bg-primary-500 text-white"
                      : isActive
                      ? "bg-primary-50 text-primary-600 border-2 border-primary-500"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                  aria-hidden="true"
                >
                  {isCompleted ? "✓" : index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        NODE_TYPE_STYLES[node.type]
                      }`}
                      aria-hidden="true"
                    >
                      <span aria-hidden="true">
                        {NODE_TYPE_ICONS[node.type]}{" "}
                      </span>
                      {NODE_TYPE_LABELS[node.type]}
                    </span>
                  </div>

                  <h2
                    className={`text-body font-semibold mb-1 ${
                      isFuture ? "text-neutral-400" : "text-neutral-800"
                    }`}
                  >
                    {node.title}
                    {isCompleted && (
                      <span className="sr-only"> — completed</span>
                    )}
                    {isActive && (
                      <span className="sr-only"> — current step</span>
                    )}
                  </h2>

                  {(isActive || isCompleted) && (
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      {node.description}
                    </p>
                  )}

                  {isActive && (
                    <div className="mt-4 space-y-3">
                      {node.type === "CONVERSATION" && (
                        <ConversationPrep
                          stepTitle={node.title}
                          stepDescription={node.description}
                          barrierSummary={
                            session.intakeSession.barrierSummary
                          }
                        />
                      )}

                      <button
                        onClick={() => completeNode(node.id)}
                        aria-label={`Complete step ${index + 1}: ${node.title}`}
                        className="w-full sm:w-auto rounded-soft bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        {node.actionLabel} →
                      </button>

                      {/* Next up preview — only shown on active step, only if a next step exists */}
                      {nextNode && (
                        <p
                          className="text-xs text-neutral-400 pt-1"
                          aria-label={`Next step: ${nextNode.title}`}
                        >
                          <span aria-hidden="true">Next up: </span>
                          <span className="text-neutral-500 font-medium">
                            {nextNode.title}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Fixed bottom bar */}
      {activeNode && !allDone && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white px-4 sm:px-6 py-3 pb-safe">
          <div className="max-w-2xl mx-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p
                className="text-xs text-neutral-400 uppercase tracking-wide font-medium"
                aria-hidden="true"
              >
                Current step
              </p>
              <p
                className="text-sm font-semibold text-neutral-800 truncate"
                aria-hidden="true"
              >
                {activeNode.title}
              </p>
            </div>
            <button
              onClick={() => completeNode(activeNode.id)}
              aria-label={`Complete current step: ${activeNode.title}`}
              className="w-full sm:w-auto flex-shrink-0 rounded-soft bg-primary-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {activeNode.actionLabel} →
            </button>
          </div>
        </div>
      )}

      <div className="h-32 sm:h-24" />
    </div>
  );
}
