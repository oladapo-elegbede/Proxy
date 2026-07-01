// components/intake/IntakePrompt.tsx

import { INTAKE_COPY } from "@/lib/constants/copy";

export function IntakePrompt() {
  return (
    <div className="mb-8 space-y-3">
      <p
        id="intake-prompt"
        className="text-large text-neutral-700 leading-relaxed"
      >
        {INTAKE_COPY.prompt}
      </p>
    </div>
  );
}