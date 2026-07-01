// lib/types/ui.ts

export type IntakeViewState =
  | "IDLE"
  | "TYPING"
  | "SUBMITTED"
  | "STREAMING"
  | "CONFIRMED"
  | "TRANSITIONING";

export type PathwayViewState =
  | "LOADING"
  | "READY"
  | "NODE_SELECTED"
  | "TRANSITIONING";

export interface StreamingState {
  isStreaming: boolean;
  partialContent: string;
  isComplete: boolean;
}

export interface ToastMessage {
  id: string;
  type: "info" | "success" | "warning";
  message: string;
  durationMs: number;
}