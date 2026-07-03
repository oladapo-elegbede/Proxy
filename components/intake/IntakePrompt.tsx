// components/intake/IntakePrompt.tsx

import { INTAKE_COPY } from "@/lib/constants/copy";

export function IntakePrompt() {
  return (
    <div className="mb-6 space-y-2">
      <p
        id="intake-prompt"
        className="text-large text-neutral-700 leading-relaxed"
      >
        {INTAKE_COPY.prompt}
      </p>
      <p className="text-sm text-neutral-400">
        {INTAKE_COPY.inputHint}
      </p>
    </div>
  );
}