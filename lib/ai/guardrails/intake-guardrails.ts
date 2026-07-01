// lib/ai/guardrails/intake-guardrails.ts
// Input and output validation for the intake pipeline.

import { getBarrierById, getAccommodationById } from "@/lib/knowledge";
import type { FunctionalBarrierId, AccommodationId } from "@/lib/types";

const INJECTION_PATTERNS = [
  /ignore previous instructions/i,
  /ignore all instructions/i,
  /you are now/i,
  /new system prompt/i,
  /forget your instructions/i,
];

export interface GuardrailResult {
  passed: boolean;
  reason?: string;
}

export function validateIntakeInput(description: string): GuardrailResult {
  if (description.trim().length < 10) {
    return {
      passed: false,
      reason: "TOO_SHORT",
    };
  }

  if (description.length > 2000) {
    return {
      passed: false,
      reason: "TOO_LONG",
    };
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(description)) {
      return {
        passed: false,
        reason: "INJECTION_DETECTED",
      };
    }
  }

  return { passed: true };
}

export function validateIntakeOutput(output: {
  matchedBarrierIds: string[];
  matchedAccommodationIds: string[];
}): GuardrailResult {
  for (const id of output.matchedBarrierIds) {
    const exists = getBarrierById(id as FunctionalBarrierId);
    if (!exists) {
      return {
        passed: false,
        reason: `HALLUCINATED_BARRIER_ID: ${id}`,
      };
    }
  }

  for (const id of output.matchedAccommodationIds) {
    const exists = getAccommodationById(id as AccommodationId);
    if (!exists) {
      return {
        passed: false,
        reason: `HALLUCINATED_ACCOMMODATION_ID: ${id}`,
      };
    }
  }

  return { passed: true };
}