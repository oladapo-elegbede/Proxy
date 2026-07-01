// lib/constants/copy.ts
// All student-facing text in one place.
// Never hardcode copy inside components.

export const INTAKE_COPY = {
  prompt:
    "Something in your academic life isn't working the way it should. Tell me about it — in whatever way feels right. You can write a sentence, a paragraph, or just describe one moment that felt hard.",
  placeholder: "",
  submitLabel: "Help me find support",
  tooShortMessage:
    "Could you tell me a little more? Even a sentence or two helps me understand your situation.",
  errorMessage:
    "Something went wrong on our end. Your information is safe — please try again.",
  streamingLabel: "Understanding your situation...",
  confirmPrompt: "Does this sound like what you described?",
  confirmYes: "Yes, that's right",
  confirmNo: "Not quite — let me rephrase",
} as const;

export const INSTITUTION_OPTIONS = [
  { id: "inst-state-university", name: "State University" },
] as const;