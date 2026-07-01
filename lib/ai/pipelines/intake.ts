// lib/ai/pipelines/intake.ts

import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { buildIntakeSystemPrompt, buildIntakeUserPrompt } from "@/lib/ai/prompts/intake";
import { validateIntakeInput, validateIntakeOutput } from "@/lib/ai/guardrails/intake-guardrails";
import type { IntakeRequest, IntakeResponse, ProxyErrorCode } from "@/lib/types";

export interface PipelineError {
  code: ProxyErrorCode;
  message: string;
  userMessage: string;
}

export type PipelineResult<T> =
  | { success: true; data: T }
  | { success: false; error: PipelineError };

function getClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");
  return createGroq({ apiKey });
}

function cleanJson(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function runIntakePipeline(
  input: IntakeRequest
): Promise<PipelineResult<IntakeResponse>> {
  const inputCheck = validateIntakeInput(input.description);

  if (!inputCheck.passed) {
    return {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: `Input validation failed: ${inputCheck.reason ?? "unknown"}`,
        userMessage:
          inputCheck.reason === "TOO_SHORT"
            ? "Could you tell me a little more? Even a sentence or two helps."
            : "Something in your message looks unusual. Please describe your situation in your own words.",
      },
    };
  }

  try {
    const groq = getClient();
    const systemPrompt = buildIntakeSystemPrompt();
    const userPrompt = buildIntakeUserPrompt(input.description);

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      prompt: userPrompt,
    });

    let parsed: IntakeResponse;
    try {
      parsed = JSON.parse(cleanJson(text)) as IntakeResponse;
    } catch {
      return {
        success: false,
        error: {
          code: "PIPELINE_FAILURE",
          message: `JSON parse failed: ${text}`,
          userMessage: "Something went wrong on our end. Please try again.",
        },
      };
    }

    const outputCheck = validateIntakeOutput({
      matchedBarrierIds: parsed.matchedBarrierIds,
      matchedAccommodationIds: parsed.matchedAccommodationIds,
    });

    if (!outputCheck.passed) {
      return {
        success: false,
        error: {
          code: "PIPELINE_FAILURE",
          message: `Output guardrail failed: ${outputCheck.reason ?? "unknown"}`,
          userMessage: "Something went wrong on our end. Please try again.",
        },
      };
    }

    if (parsed.emotionalMode === "CRISIS") {
      return {
        success: true,
        data: {
          ...parsed,
          barrierSummary:
            "It sounds like things are really difficult right now. Before anything else, please know that help is available. If you are in crisis, contact the 988 Suicide and Crisis Lifeline by calling or texting 988. When you are ready, PROXY is here to help you find academic support.",
        },
      };
    }

    return { success: true, data: parsed };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "PIPELINE_FAILURE",
        message: error instanceof Error ? error.message : "Unknown error",
        userMessage: "Something went wrong on our end. Please try again.",
      },
    };
  }
}