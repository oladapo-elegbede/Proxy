// components/intake/IntakeContainer.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IntakePrompt } from "./IntakePrompt";
import { IntakeInput } from "./IntakeInput";
import { IntakeResponse } from "./IntakeResponse";
import { useSessionStore } from "@/lib/state";
import { INSTITUTION_OPTIONS } from "@/lib/constants/copy";
import type { IntakeResponse as IntakeResponseType, Pathway } from "@/lib/types";

type Phase =
  | "input"
  | "streaming"
  | "confirming"
  | "loading-pathway"
  | "pathway-error";

const INTAKE_TIMEOUT_MS = 30_000;

export function IntakeContainer() {
  const router = useRouter();
  const { setSession, setEmotionalMode } = useSessionStore();

  const [phase, setPhase] = useState<Phase>("input");
  const [partialContent, setPartialContent] = useState("");
  const [intakeResult, setIntakeResult] = useState<IntakeResponseType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pathwayError, setPathwayError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const institutionId = INSTITUTION_OPTIONS[0].id;

  async function handleSubmit(description: string) {
    setPhase("streaming");
    setPartialContent("");
    setError(null);

    // Create abort controller for timeout
    const controller = new AbortController();
    abortRef.current = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, INTAKE_TIMEOUT_MS);

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, institutionId }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const json = await response.json() as
        | { success: true; data: IntakeResponseType }
        | { success: false; error: { userMessage: string } };

      if (!json.success) {
        setError(json.error.userMessage);
        setPhase("input");
        return;
      }

      // Simulate streaming by revealing text gradually
      const summary = json.data.barrierSummary;
      let index = 0;
      const interval = setInterval(() => {
        index += 3;
        setPartialContent(summary.slice(0, index));
        if (index >= summary.length) {
          clearInterval(interval);
          setIntakeResult(json.data);
          setPhase("confirming");
        }
      }, 20);
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error && err.name === "AbortError") {
        setError(
          "This is taking longer than expected. Please check your connection and try again."
        );
      } else {
        setError("Something went wrong on our end. Please try again.");
      }
      setPhase("input");
    }
  }

  async function handleConfirm() {
    if (!intakeResult) return;
    setPhase("loading-pathway");
    setPathwayError(null);
    setEmotionalMode(intakeResult.emotionalMode);

    await generatePathway(intakeResult);
  }

  async function handleRetryPathway() {
    if (!intakeResult) return;
    setPhase("loading-pathway");
    setPathwayError(null);
    await generatePathway(intakeResult);
  }

  async function generatePathway(intake: IntakeResponseType) {
    try {
      const response = await fetch("/api/pathway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchedBarrierIds: intake.matchedBarrierIds,
          matchedAccommodationIds: intake.matchedAccommodationIds,
          institutionId,
          emotionalMode: intake.emotionalMode,
        }),
      });

      const json = await response.json() as
        | { success: true; data: { pathway: Pathway } }
        | { success: false; error: { userMessage: string } };

      if (!json.success) {
        setPathwayError(json.error.userMessage);
        setPhase("pathway-error");
        return;
      }

      const now = new Date().toISOString();
      setSession({
        id: Math.random().toString(36).slice(2),
        intakeSession: {
          id: Math.random().toString(36).slice(2),
          barrierSummary: intake.barrierSummary,
          matchedBarrierIds: intake.matchedBarrierIds,
          matchedAccommodationIds: intake.matchedAccommodationIds,
          institutionId,
          emotionalMode: intake.emotionalMode,
          createdAt: now,
        },
        pathway: json.data.pathway,
        position: {
          pathwayId: json.data.pathway.id,
          activeNodeId: json.data.pathway.activeNodeId,
          completedNodeIds: [],
          pendingThreadIds: [],
        },
        artifacts: [],
        pendingThreads: [],
        emotionalMode: intake.emotionalMode,
        languageMode: "PLAIN",
        createdAt: now,
        updatedAt: now,
      });

      router.push("/pathway");
    } catch {
      setPathwayError(
        "Something went wrong building your pathway. Please try again."
      );
      setPhase("pathway-error");
    }
  }

  function handleDeny() {
    setPhase("input");
    setIntakeResult(null);
    setPartialContent("");
    setError(null);
  }

  return (
    <div className="space-y-8">
      {/* Input phase */}
      {phase === "input" && (
        <>
          <IntakePrompt />
          <IntakeInput onSubmit={handleSubmit} isDisabled={false} />
          {error && (
            <p className="text-sm text-warning" role="alert">
              {error}
            </p>
          )}
        </>
      )}

      {/* Streaming phase */}
      {phase === "streaming" && (
        <IntakeResponse
          barrierSummary=""
          isStreaming={true}
          partialContent={partialContent}
          onConfirm={handleConfirm}
          onDeny={handleDeny}
        />
      )}

      {/* Confirming phase */}
      {phase === "confirming" && intakeResult && (
        <IntakeResponse
          barrierSummary={intakeResult.barrierSummary}
          isStreaming={false}
          partialContent=""
          onConfirm={handleConfirm}
          onDeny={handleDeny}
        />
      )}

      {/* Loading pathway phase */}
      {phase === "loading-pathway" && (
        <div
          className="rounded-card bg-white border border-neutral-200 p-6 space-y-3"
          role="status"
          aria-live="polite"
        >
          <p className="text-sm font-medium text-primary-600 uppercase tracking-wide">
            Building your pathway...
          </p>
          <p className="text-body text-neutral-500">
            We are mapping your situation to the support you are entitled to.
            This takes a few seconds.
          </p>
          <div className="flex gap-1 mt-2" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary-300 animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pathway error phase — retry without losing confirmed barrier */}
      {phase === "pathway-error" && intakeResult && (
        <div className="space-y-6">
          <div
            className="rounded-card bg-white border border-neutral-200 p-6 space-y-4"
            role="region"
            aria-label="PROXY response"
          >
            <p className="text-sm font-medium text-primary-600 uppercase tracking-wide">
              We understood your situation
            </p>
            <p className="text-body text-neutral-700 leading-relaxed">
              {intakeResult.barrierSummary}
            </p>
          </div>

          <div
            className="rounded-card border border-warning bg-amber-50 p-5 space-y-4"
            role="alert"
          >
            <p className="text-body text-neutral-700">
              {pathwayError ??
                "Something went wrong building your pathway. Your situation was understood — we just need to try again."}
            </p>
            <button
              onClick={handleRetryPathway}
              className="rounded-soft bg-primary-500 px-6 py-3 text-body font-medium text-white hover:bg-primary-600 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Try again →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}