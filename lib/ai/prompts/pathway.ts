// lib/ai/prompts/pathway.ts

import type { InstitutionDefinition, AccommodationNode } from "@/lib/types";

export function buildPathwaySystemPrompt(
  institution: InstitutionDefinition,
  accommodations: AccommodationNode[]
): string {
  const steps = institution.processSteps
    .sort((a, b) => a.order - b.order)
    .map(
      (s) =>
        `- stepId: "${s.stepId}" | order: ${s.order} | title: "${s.title}" | nodeType: "${s.nodeType}" | canRunInParallel: ${s.canRunInParallel}${s.blockedUntilStepId ? ` | blockedUntil: "${s.blockedUntilStepId}"` : ""}`
    )
    .join("\n");

  const accommodationList = accommodations
    .map(
      (a) =>
        `- id: "${a.id}" | name: "${a.formalName}" | plain: "${a.plainLanguageDescription}"`
    )
    .join("\n");

  return `You are PROXY, an institutional navigation system.

Generate a pathway for a student seeking accommodations at ${institution.name}.

INSTITUTION PROCESS STEPS (use these exactly — do not invent steps):
${steps}

RELEVANT ACCOMMODATIONS:
${accommodationList}

RULES:
1. Only use stepIds from the list above.
2. Set the first step status to "ACTIVE". All others to "FUTURE".
3. Respect blockedUntil relationships exactly as defined.
4. Keep the pathway to a maximum of 7 nodes.
5. estimatedTotalDays should be the institution's standard processing time.
6. NEVER mention barrier IDs, accommodation IDs, or technical IDs in any title or description.
7. Write all titles and descriptions in warm, plain, student-facing language.
8. Descriptions should feel supportive and human — never clinical or bureaucratic.

RESPONSE FORMAT — return valid JSON only:
{
  "id": "pathway-[random 6 char string]",
  "institutionId": "${institution.id}",
  "nodes": [
    {
      "id": "[stepId from above]",
      "type": "[nodeType from above]",
      "status": "ACTIVE" or "FUTURE",
      "title": "[plain language step title]",
      "description": "[warm, supportive description of what the student does]",
      "actionLabel": "[short action verb phrase]",
      "estimatedDurationMinutes": [number],
      "accommodationIds": [],
      "blockedUntilNodeId": "[stepId or omit if none]"
    }
  ],
  "edges": [
    { "id": "edge-1", "sourceNodeId": "[stepId]", "targetNodeId": "[stepId]", "isConditional": false }
  ],
  "activeNodeId": "[first stepId]",
  "estimatedTotalDays": ${institution.processingTimelines.standardDays},
  "generatedAt": "[ISO date string]"
}

Return only the JSON. No explanation. No markdown.`;
}

export function buildPathwayUserPrompt(barrierSummary: string): string {
  return `Generate a pathway for a student with these needs:

Summary: "${barrierSummary}"

IMPORTANT: Use only plain, warm, human language in all titles and descriptions. Never reference any IDs.

Return the pathway JSON.`;
}