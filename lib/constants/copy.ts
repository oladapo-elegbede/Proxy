// lib/constants/copy.ts
// All student-facing text in one place.
// Never hardcode copy inside components.

export const INTAKE_COPY = {
  // Main prompt — one clear invitation, no format instructions
  prompt:
    "Something in your academic life isn't working the way it should. Tell me what's been hard.",

  // Supporting hint shown below the textarea
  inputHint: "Write as much or as little as feels right.",

  placeholder: "",
  submitLabel: "Help me find support",

  tooShortMessage:
    "Could you say a little more? Even one sentence helps.",

  errorMessage:
    "Something went wrong. Please try again.",

  streamingLabel: "Understanding your situation...",

  confirmPrompt: "Does this sound right?",
  confirmYes: "Yes, that's right",
  confirmNo: "Not quite — let me rephrase",
} as const;

export const INSTITUTION_OPTIONS = [
  { id: "inst-state-university", name: "State University" },
] as const;