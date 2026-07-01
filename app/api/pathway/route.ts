// app/api/pathway/route.ts

import { NextRequest, NextResponse } from "next/server";
import { runPathwayPipeline } from "@/lib/ai/pipelines";
import { checkRateLimit } from "@/lib/utils/rate-limit";
import { log } from "@/lib/utils/logger";
import type { PathwayRequest } from "@/lib/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const start = Date.now();
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  if (!checkRateLimit(ip, "pathway")) {
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

  let body: PathwayRequest;
  try {
    body = (await request.json()) as PathwayRequest;
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

  // Only require institutionId and at least one barrier
  if (!body.institutionId || !body.matchedBarrierIds?.length) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Missing required fields",
          userMessage: "Something went wrong. Please go back and try again.",
        },
      },
      { status: 400 }
    );
  }

  const result = await runPathwayPipeline(body);
  const duration = Date.now() - start;

  if (!result.success) {
    log({
      level: "error",
      route: "pathway",
      statusCode: 500,
      errorCode: result.error.code,
      durationMs: duration,
    });
    return NextResponse.json(
      { success: false, error: result.error },
      { status: result.error.code === "INSTITUTION_NOT_FOUND" ? 404 : 500 }
    );
  }

  log({ level: "info", route: "pathway", statusCode: 200, durationMs: duration });
  return NextResponse.json({ success: true, data: result.data }, { status: 200 });
}