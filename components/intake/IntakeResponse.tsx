// components/intake/IntakeResponse.tsx
"use client";

import { INTAKE_COPY } from "@/lib/constants/copy";

interface IntakeResponseProps {
  barrierSummary: string;
  isStreaming: boolean;
  partialContent: string;
  onConfirm: () => void;
  onDeny: () => void;
}

export function IntakeResponse({
  barrierSummary,
  isStreaming,
  partialContent,
  onConfirm,
  onDeny,
}: IntakeResponseProps) {
  const displayText = isStreaming ? partialContent : barrierSummary;

  return (
    <div className="space-y-6">
      <div
        role="region"
        aria-label="PROXY response"
        aria-live="polite"
        aria-atomic="false"
        className="rounded-card bg-white border border-neutral-200 p-6 space-y-4"
      >
        <p className="text-sm font-medium text-primary-600 uppercase tracking-wide">
          {INTAKE_COPY.streamingLabel}
        </p>
        <p className="text-body text-neutral-700 leading-relaxed">
          {displayText}
          {isStreaming && (
            <span
              className="inline-block w-2 h-4 bg-primary-500 ml-1 animate-pulse"
              aria-hidden="true"
            />
          )}
        </p>

        {/* Short screen reader announcement when streaming completes */}
        {!isStreaming && barrierSummary && (
          <p className="sr-only" role="status">
            Done. Does this sound right?
          </p>
        )}
      </div>

      {!isStreaming && barrierSummary && (
        <div
          role="group"
          aria-labelledby="confirm-prompt"
          className="space-y-3"
        >
          <p
            id="confirm-prompt"
            className="text-body text-neutral-600"
          >
            {INTAKE_COPY.confirmPrompt}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onConfirm}
              aria-describedby="confirm-prompt"
              className="w-full sm:w-auto rounded-soft bg-primary-500 px-6 py-3 text-body font-medium text-white hover:bg-primary-600 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {INTAKE_COPY.confirmYes}
            </button>
            <button
              onClick={onDeny}
              aria-describedby="confirm-prompt"
              className="w-full sm:w-auto rounded-soft border border-neutral-200 px-6 py-3 text-body font-medium text-neutral-600 hover:bg-neutral-100 transition-colors duration-fast focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2"
            >
              {INTAKE_COPY.confirmNo}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}