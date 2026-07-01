// lib/ai/pipelines/pathway.ts

import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
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

function getClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not set");
  return createGroq({ apiKey });
}

export async function runPathwayPipeline(
  input: PathwayRequest
): Promise<PipelineResult<PathwayResponse>> {
  const institution = getInstitutionById(input.institutionId as InstitutionId);

  if (!institution) {
    return {
      success: false,
      error: {
        code: "INSTITUTION_NOT_FOUND",
        message: `Institution not found: ${input.institutionId}`,
        userMessage:
          "We don't have specific information about your institution yet. We're working on adding more institutions.",
      },
    };
  }

  const accommodations = input.matchedAccommodationIds
    .map((id) => getAccommodationById(id as AccommodationId))
    .filter((acc) => acc !== undefined);

  const systemPrompt = buildPathwaySystemPrompt(institution, accommodations);
  const userPrompt = buildPathwayUserPrompt(
    input.matchedBarrierIds.join(", "),
    input.matchedAccommodationIds
  );

  try {
    const groq = getClient();

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: systemPrompt,
      prompt: userPrompt,
    });

    let pathway: PathwayResponse["pathway"];
    try {
      pathway = JSON.parse(text) as PathwayResponse["pathway"];
    } catch {
      return {
        success: false,
        error: {
          code: "PIPELINE_FAILURE",
          message: `JSON parse failed: ${text}`,
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
