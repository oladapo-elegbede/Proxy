// app/api/intake/route.ts

import { NextRequest, NextResponse } from "next/server";
import { runIntakePipeline } from "@/lib/ai/pipelines";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { log } from "@/lib/utils/logger";
import type { IntakeRequest } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const start = Date.now();
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  // Rate limit check
  if (!checkRateLimit(ip, "intake")) {
    log({ level: "warn", route: "intake", statusCode: 429, message: "Rate limit exceeded" });
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RATE_LIMIT",
          message: "Rate limit exceeded",
          userMessage: "You have made too many requests. Please wait a moment and try again.",
        },
      },
      { status: 429 }
    );
  }

  // Parse body
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

  // Validate required fields
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

  // Run pipeline
  const result = await runIntakePipeline(body);
  const duration = Date.now() - start;

  if (!result.success) {
    log({
      level: "error",
      route: "intake",
      statusCode: 500,
      errorCode: result.error.code,
      durationMs: duration,
    });
    return NextResponse.json(
      { success: false, error: result.error },
      { status: result.error.code === "VALIDATION_ERROR" ? 422 : 500 }
    );
  }

  log({ level: "info", route: "intake", statusCode: 200, durationMs: duration });
  return NextResponse.json({ success: true, data: result.data }, { status: 200 });
}