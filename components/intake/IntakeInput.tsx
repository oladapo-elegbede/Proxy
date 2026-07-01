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

  // Auto-resize textarea as user types
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

  return (
    <div className="space-y-4">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          aria-label="Describe what has been difficult"
          aria-describedby="intake-prompt intake-hint"
          rows={4}
          className="w-full resize-none rounded-card border border-neutral-200 bg-white px-5 py-4 text-body text-neutral-800 placeholder-transparent focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100 disabled:opacity-50 transition-colors duration-fast"
        />
        {value.length > 1800 && (
          <p className="absolute bottom-3 right-4 text-sm text-muted">
            {2000 - value.length} characters remaining
          </p>
        )}
      </div>

      {isTooShort && (
        <p className="text-sm text-neutral-400" role="alert">
          {INTAKE_COPY.tooShortMessage}
        </p>
      )}

      <div className="flex items-center justify-between">
        <p id="intake-hint" className="text-sm text-neutral-400">
          Press Ctrl + Enter to submit
        </p>
        <button
          onClick={handleSubmit}
          disabled={!isReady || isDisabled}
          className="rounded-soft bg-primary-500 px-6 py-3 text-body font-medium text-white transition-colors duration-fast hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {INTAKE_COPY.submitLabel}
        </button>
      </div>
    </div>
  );
}