// app/pathway/page.tsx
"use client";

import { useSessionStore } from "@/lib/state";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

export default function PathwayPage() {
  const router = useRouter();
  const session = useSessionStore((s) => s.session);

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

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-heading font-semibold text-neutral-800">
              Your Pathway
            </h1>
            <p className="text-sm text-neutral-400 mt-0.5">
              {session.intakeSession.barrierSummary.slice(0, 60)}...
            </p>
          </div>
          <div className="text-right">
            <p className="text-display font-bold text-primary-500">
              {completedCount}/{totalNodes}
            </p>
            <p className="text-sm text-neutral-400">steps done</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto mt-4">
          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-slow"
              style={{ width: `${(completedCount / totalNodes) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-3">
        {pathway.nodes.map((node, index) => {
          const isActive = node.status === "ACTIVE";
          const isCompleted = node.status === "COMPLETED";
          const isFuture = node.status === "FUTURE";

          return (
            <div
              key={node.id}
              className={`rounded-card border p-5 transition-all duration-medium ${
                isActive
                  ? "border-primary-500 bg-white shadow-sm"
                  : isCompleted
                  ? "border-neutral-100 bg-neutral-50"
                  : "border-neutral-100 bg-white opacity-50"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Step number / check */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isCompleted
                      ? "bg-primary-500 text-white"
                      : isActive
                      ? "bg-primary-50 text-primary-600 border-2 border-primary-500"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                        NODE_TYPE_STYLES[node.type]
                      }`}
                    >
                      {NODE_TYPE_ICONS[node.type]} {node.type}
                    </span>
                    {isActive && (
                      <span className="text-xs text-primary-500 font-medium">
                        You are here
                      </span>
                    )}
                  </div>

                  <h2
                    className={`text-body font-semibold mb-1 ${
                      isFuture ? "text-neutral-400" : "text-neutral-800"
                    }`}
                  >
                    {node.title}
                  </h2>

                  {(isActive || isCompleted) && (
                    <p className="text-sm text-neutral-500 leading-relaxed">
                      {node.description}
                    </p>
                  )}

                  {isActive && (
                    <div className="mt-4">
                      <button className="rounded-soft bg-primary-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-600 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                        {node.actionLabel} →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom bar */}
      {activeNode && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white px-6 py-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wide font-medium">
                Current step
              </p>
              <p className="text-body font-semibold text-neutral-800">
                {activeNode.title}
              </p>
            </div>
            <button className="rounded-soft bg-primary-500 px-6 py-3 text-body font-medium text-white hover:bg-primary-600 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              {activeNode.actionLabel} →
            </button>
          </div>
        </div>
      )}

      {/* Spacer for fixed bottom bar */}
      <div className="h-24" />
    </div>
  );
}