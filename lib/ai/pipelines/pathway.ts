// lib/ai/pipelines/pathway.ts

import Anthropic from "@anthropic-ai/sdk";
import { buildPathwaySystemPrompt, buildPathwayUserPrompt } from "@/lib/ai/prompts/pathway";
import { getInstitutionById, getAccommodationById } from "@/lib/knowledge";
import type { PathwayRequest, PathwayResponse, ProxyErrorCode } from "@/lib/types";
import type { AccommodationId, InstitutionId } from "@/lib/types";

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

export async function runPathwayPipeline(
  input: PathwayRequest
): Promise<PipelineResult<PathwayResponse>> {
  // Step 1: Load institution from Knowledge Graph
  const institution = getInstitutionById(input.institutionId as InstitutionId);

  if (!institution) {
    return {
      success: false,
      error: {
        code: "INSTITUTION_NOT_FOUND",
        message: `Institution not found: ${input.institutionId}`,
        userMessage:
          "We don't have specific information about your institution yet. We're working on adding more institutions. In the meantime, the general pathway below will guide you.",
      },
    };
  }

  // Step 2: Load accommodations from Knowledge Graph
  const accommodations = input.matchedAccommodationIds
    .map((id) => getAccommodationById(id as AccommodationId))
    .filter((acc) => acc !== undefined);

  // Step 3: Build prompts
  const systemPrompt = buildPathwaySystemPrompt(institution, accommodations);
  const userPrompt = buildPathwayUserPrompt(
    input.matchedBarrierIds.join(", "),
    input.matchedAccommodationIds
  );

  // Step 4: Call AI
  try {
    const client = getClient();

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
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
          userMessage: "Something went wrong generating your pathway. Please try again.",
        },
      };
    }

    // Step 5: Parse JSON
    let pathway: PathwayResponse["pathway"];
    try {
      pathway = JSON.parse(rawText) as PathwayResponse["pathway"];
    } catch {
      return {
        success: false,
        error: {
          code: "PIPELINE_FAILURE",
          message: `JSON parse failed: ${rawText}`,
          userMessage: "Something went wrong generating your pathway. Please try again.",
        },
      };
    }

    return { success: true, data: { pathway } };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "PIPELINE_FAILURE",
        message: error instanceof Error ? error.message : "Unknown error",
        userMessage: "Something went wrong generating your pathway. Please try again.",
      },
    };
  }
}
