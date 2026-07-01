// lib/types/api.ts

// Generic success and error wrappers for every API response.
// This ensures every endpoint returns a consistent shape.

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    // Machine-readable code for logging
    code: ProxyErrorCode;
    // Technical detail for server logs — never shown to student
    message: string;
    // Student-facing message — always written in product language
    userMessage: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export type ProxyErrorCode =
  | "PIPELINE_FAILURE"
  | "INSTITUTION_NOT_FOUND"
  | "BARRIER_NOT_MATCHED"
  | "KNOWLEDGE_GRAPH_ERROR"
  | "VALIDATION_ERROR"
  | "RATE_LIMIT"
  | "CRISIS_DETECTED"
  | "UNKNOWN";

// --- Intake endpoint ---

export interface IntakeRequest {
  description: string;
  institutionId: string;
}

export interface IntakeResponse {
  barrierSummary: string;
  matchedBarrierIds: string[];
  matchedAccommodationIds: string[];
  emotionalMode: "CALM" | "ANXIOUS" | "CRISIS";
  confidenceScore: number;
}

// --- Pathway endpoint ---

export interface PathwayRequest {
  matchedBarrierIds: string[];
  matchedAccommodationIds: string[];
  institutionId: string;
  emotionalMode: "CALM" | "ANXIOUS" | "CRISIS";
}

export interface PathwayResponse {
  pathway: import("./pathway").Pathway;
}