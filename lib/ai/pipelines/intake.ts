// lib/ai/pipelines/intake.ts
// Intake AI pipeline — takes student description, returns matched barriers.

import Anthropic from "@anthropic-ai/sdk";
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

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
}

export async function runIntakePipeline(
  input: IntakeRequest
): Promise<PipelineResult<IntakeResponse>> {
  // Step 1: Validate input
  const inputCheck = validateIntakeInput(input.description);

  if (!inputCheck.passed) {
    if (inputCheck.reason === "TOO_SHORT") {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Input too short",
          userMessage:
            "Could you tell me a little more about what's been difficult? Even a sentence or two helps me understand your situation.",
        },
      };
    }
    if (inputCheck.reason === "INJECTION_DETECTED") {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Injection attempt detected",
          userMessage:
            "Something in your message looks unusual. Please describe your situation in your own words.",
        },
      };
    }
  }

  // Step 2: Call AI
  try {
    const client = getClient();
    const systemPrompt = buildIntakeSystemPrompt();
    const userPrompt = buildIntakeUserPrompt(input.description);

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const rawText =
      response.content[0]?.type === "text" ? response.content[0].text : null;

    if (!rawText) {
      return {
        success: false,
        error: {
          code: "PIPELINE_FAILURE",
          message: "Empty response from AI",
          userMessage:
            "Something went wrong on our end. Your information is safe — please try again.",
        },
      };
    }

    // Step 3: Parse JSON
    let parsed: IntakeResponse;
    try {
      parsed = JSON.parse(rawText) as IntakeResponse;
    } catch {
      return {
        success: false,
        error: {
          code: "PIPELINE_FAILURE",
          message: `JSON parse failed: ${rawText}`,
          userMessage:
            "Something went wrong on our end. Your information is safe — please try again.",
        },
      };
    }

    // Step 4: Validate output against Knowledge Graph
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
          userMessage:
            "Something went wrong on our end. Your information is safe — please try again.",
        },
      };
    }

    // Step 5: Handle crisis mode
    if (parsed.emotionalMode === "CRISIS") {
      return {
        success: true,
        data: {
          ...parsed,
          barrierSummary:
            "It sounds like things are really difficult right now. Before we look at academic support, please know that help is available. If you are in crisis, contact the 988 Suicide and Crisis Lifeline by calling or texting 988. When you are ready, PROXY is here to help you access academic support.",
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
        userMessage:
          "Something went wrong on our end. Your information is safe — please try again.",
      },
    };
  }
}