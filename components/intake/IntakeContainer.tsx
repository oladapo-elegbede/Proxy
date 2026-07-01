// components/intake/IntakeContainer.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IntakePrompt } from "./IntakePrompt";
import { IntakeInput } from "./IntakeInput";
import { IntakeResponse } from "./IntakeResponse";
import { useSessionStore } from "@/lib/state";
import { INSTITUTION_OPTIONS } from "@/lib/constants/copy";
import type { IntakeResponse as IntakeResponseType, Pathway } from "@/lib/types";

type Phase = "input" | "streaming" | "confirming" | "loading";

export function IntakeContainer() {
  const router = useRouter();
  const { setSession, setEmotionalMode } = useSessionStore();

  const [phase, setPhase] = useState<Phase>("input");
  const [partialContent, setPartialContent] = useState("");
  const [intakeResult, setIntakeResult] = useState<IntakeResponseType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const institutionId = INSTITUTION_OPTIONS[0].id;

  async function handleSubmit(description: string) {
    setPhase("streaming");
    setPartialContent("");
    setError(null);

    try {
      const response = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, institutionId }),
      });

      const json = await response.json() as
        | { success: true; data: IntakeResponseType }
        | { success: false; error: { userMessage: string } };

      if (!json.success) {
        setError(json.error.userMessage);
        setPhase("input");
        return;
      }

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
    } catch {
      setError("Something went wrong. Please try again.");
      setPhase("input");
    }
  }

  async function handleConfirm() {
    if (!intakeResult || phase === "loading") return;
    setPhase("loading");
    setError(null);

    try {
      const response = await fetch("/api/pathway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchedBarrierIds: intakeResult.matchedBarrierIds,
          matchedAccommodationIds: intakeResult.matchedAccommodationIds,
          institutionId,
          emotionalMode: intakeResult.emotionalMode,
        }),
      });

      const json = await response.json() as
        | { success: true; data: { pathway: Pathway } }
        | { success: false; error: { userMessage: string } };

      if (!json.success) {
        setError(json.error.userMessage);
        setPhase("confirming");
        return;
      }

      const now = new Date().toISOString();
      setEmotionalMode(intakeResult.emotionalMode);
      setSession({
        id: Math.random().toString(36).slice(2),
        intakeSession: {
          id: Math.random().toString(36).slice(2),
          barrierSummary: intakeResult.barrierSummary,
          matchedBarrierIds: intakeResult.matchedBarrierIds,
          matchedAccommodationIds: intakeResult.matchedAccommodationIds,
          institutionId,
          emotionalMode: intakeResult.emotionalMode,
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
        emotionalMode: intakeResult.emotionalMode,
        languageMode: "PLAIN",
        createdAt: now,
        updatedAt: now,
      });

      router.push("/pathway");
    } catch {
      setError("Something went wrong. Please try again.");
      setPhase("confirming");
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
      {phase === "input" && (
        <>
          <IntakePrompt />
          <IntakeInput onSubmit={handleSubmit} isDisabled={false} />
          {error && (
            <p className="text-sm text-warning" role="alert">{error}</p>
          )}
        </>
      )}

      {phase === "streaming" && (
        <IntakeResponse
          barrierSummary=""
          isStreaming={true}
          partialContent={partialContent}
          onConfirm={handleConfirm}
          onDeny={handleDeny}
        />
      )}

      {phase === "confirming" && intakeResult && (
        <>
          <IntakeResponse
            barrierSummary={intakeResult.barrierSummary}
            isStreaming={false}
            partialContent=""
            onConfirm={handleConfirm}
            onDeny={handleDeny}
          />
          {error && (
            <p className="text-sm text-warning" role="alert">{error}</p>
          )}
        </>
      )}

      {phase === "loading" && (
        <div className="text-body text-neutral-400 animate-pulse">
          Building your pathway...
        </div>
      )}
    </div>
  );
}