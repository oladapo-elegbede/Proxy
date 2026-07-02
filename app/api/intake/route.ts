// app/api/intake/route.ts

import { NextRequest, NextResponse } from "next/server";
import { runIntakePipeline } from "@/lib/ai/pipelines";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import type { IntakeRequest } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const start = Date.now();
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  if (!checkRateLimit(ip, "intake")) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RATE_LIMIT",
          message: "Rate limit exceeded",
          userMessage: "Too many requests. Please wait a moment and try again.",
        },
      },
      { status: 429 }
    );
  }

  let body: IntakeRequest;
  try {
    body = (await request.json()) as IntakeRequest;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid JSON body",
          userMessage: "Something went wrong. Please try again.",
        },
      },
      { status: 400 }
    );
  }

  if (!body.description || !body.institutionId) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Missing description or institutionId",
          userMessage: "Please describe your situation and select your institution.",
        },
      },
      { status: 400 }
    );
  }

  try {
    const result = await runIntakePipeline(body);
    const duration = Date.now() - start;

    if (!result.success) {
      console.error("INTAKE PIPELINE FAILED:", result.error.message);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.error.code === "VALIDATION_ERROR" ? 422 : 500 }
      );
    }

    console.log("INTAKE SUCCESS:", duration + "ms");
    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("INTAKE ROUTE EXCEPTION:", message);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNKNOWN",
          message,
          userMessage: "Something went wrong on our end. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}