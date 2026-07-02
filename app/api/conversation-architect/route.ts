// app/api/conversation-architect/route.ts

import { NextRequest, NextResponse } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import {
  buildConversationSystemPrompt,
  buildConversationUserPrompt,
} from "@/lib/ai/prompts/conversation";

export interface ConversationScript {
  opening: string;
  coreStatement: string;
  likelyResponses: { response: string; reply: string }[];
  ifItGetsHard: string;
  closing: string;
}

function cleanJson(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: {
    stepTitle: string;
    stepDescription: string;
    barrierSummary: string;
  };

  try {
    body = await request.json() as typeof body;
  } catch {
    return NextResponse.json(
      { success: false, error: { userMessage: "Invalid request." } },
      { status: 400 }
    );
  }

  if (!body.stepTitle || !body.barrierSummary) {
    return NextResponse.json(
      { success: false, error: { userMessage: "Missing required fields." } },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY not set");

    const groq = createGroq({ apiKey });

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system: buildConversationSystemPrompt(),
      prompt: buildConversationUserPrompt(
        body.stepTitle,
        body.stepDescription,
        body.barrierSummary
      ),
    });

    const script = JSON.parse(cleanJson(text)) as ConversationScript;

    return NextResponse.json({ success: true, data: script });
  } catch (error) {
    console.error("CONVERSATION PIPELINE ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          userMessage: "Something went wrong generating your script. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}