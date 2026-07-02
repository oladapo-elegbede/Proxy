// components/intake/IntakeInput.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { INTAKE_COPY } from "@/lib/constants/copy";

interface IntakeInputProps {
  onSubmit: (description: string) => void;
  isDisabled: boolean;
}

export function IntakeInput({ onSubmit, isDisabled }: IntakeInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (value.trim().length >= 10) {
        onSubmit(value.trim());
      }
    }
  }

  function handleSubmit() {
    if (value.trim().length >= 10) {
      onSubmit(value.trim());
    }
  }

  const isTooShort = value.length > 0 && value.trim().length < 10;
  const isReady = value.trim().length >= 10;
  const isNearLimit = value.length > 1800;
  const remaining = 2000 - value.length;

  return (
    <div className="space-y-4">
      {/* Visible label */}
      <label
        htmlFor="intake-textarea"
        className="block text-sm font-medium text-neutral-600"
      >
        Describe what has been difficult
        <span className="sr-only">
          {" "}(minimum 10 characters, maximum 2000 characters)
        </span>
      </label>

      <div className="relative">
        <textarea
          ref={textareaRef}
          id="intake-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          aria-describedby="intake-prompt intake-hint intake-error"
          aria-invalid={isTooShort}
          aria-required="true"
          maxLength={2000}
          rows={4}
          className="w-full resize-none rounded-card border border-neutral-200 bg-white px-4 py-4 text-body text-neutral-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50 transition-colors duration-fast"
        />

        {isNearLimit && (
          <p
            id="char-count"
            className="absolute bottom-3 right-3 text-xs text-muted"
            aria-live="polite"
            aria-atomic="true"
          >
            {remaining} left
          </p>
        )}
      </div>

      {isTooShort && (
        <p
          id="intake-error"
          className="text-sm text-neutral-400"
          role="alert"
        >
          {INTAKE_COPY.tooShortMessage}
        </p>
      )}

      {isNearLimit && (
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {remaining} characters remaining
        </p>
      )}

      {/* Stack on mobile, side by side on sm+ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          id="intake-hint"
          className="text-sm text-neutral-400 order-2 sm:order-1"
        >
          Press Ctrl + Enter to submit
        </p>
        <button
          onClick={handleSubmit}
          disabled={!isReady || isDisabled}
          aria-disabled={!isReady || isDisabled}
          className="order-1 sm:order-2 w-full sm:w-auto rounded-soft bg-primary-500 px-6 py-3 text-body font-medium text-white transition-colors duration-fast hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {INTAKE_COPY.submitLabel}
        </button>
      </div>
    </div>
  );
}