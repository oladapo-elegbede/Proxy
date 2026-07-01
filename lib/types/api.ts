// lib/types/api.ts

import type { Pathway } from "./pathway";

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: ProxyErrorCode;
    message: string;
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

export interface PathwayRequest {
  matchedBarrierIds: string[];
  matchedAccommodationIds: string[];
  institutionId: string;
  emotionalMode: "CALM" | "ANXIOUS" | "CRISIS";
}

export interface PathwayResponse {
  pathway: Pathway;
}