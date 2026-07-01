// app/pathway/page.tsx
"use client";

import { useSessionStore } from "@/lib/state";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PathwayPage() {
  const router = useRouter();
  const session = useSessionStore((s) => s.session);

  useEffect(() => {
    if (!session) {
      router.push("/intake");
    }
  }, [session, router]);

  if (!session) return null;

  const { pathway } = session;
  const activeNode = pathway.nodes.find(
    (n) => n.id === pathway.activeNodeId
  );

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-display font-semibold text-neutral-800 mb-2">
          Your Pathway
        </h1>
        <p className="text-body text-neutral-400 mb-10">
          Here is your personalised route to academic support.
        </p>

        <div className="space-y-4">
          {pathway.nodes.map((node, index) => (
            <div
              key={node.id}
              className={`rounded-card border p-6 transition-all duration-medium ${
                node.status === "ACTIVE"
                  ? "border-primary-500 bg-white shadow-sm"
                  : node.status === "COMPLETED"
                  ? "border-neutral-200 bg-neutral-50 opacity-60"
                  : "border-neutral-200 bg-white opacity-40"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-neutral-400">
                  Step {index + 1}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    node.type === "CONVERSATION"
                      ? "bg-primary-50 text-primary-600"
                      : node.type === "ACT"
                      ? "bg-green-50 text-green-600"
                      : node.type === "PREPARE"
                      ? "bg-yellow-50 text-yellow-600"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {node.type}
                </span>
                {node.status === "COMPLETED" && (
                  <span className="text-xs text-primary-500 font-medium">
                    ✓ Done
                  </span>
                )}
                {node.status === "ACTIVE" && (
                  <span className="text-xs text-primary-500 font-medium">
                    ← You are here
                  </span>
                )}
              </div>
              <h2 className="text-large font-semibold text-neutral-800 mb-1">
                {node.title}
              </h2>
              <p className="text-body text-neutral-600">{node.description}</p>
            </div>
          ))}
        </div>

        {activeNode && (
          <div className="mt-10 rounded-card bg-primary-500 p-6 text-white">
            <p className="text-sm font-medium mb-1 opacity-80">Next action</p>
            <p className="text-large font-semibold">{activeNode.actionLabel}</p>
          </div>
        )}
      </div>
    </div>
  );
}