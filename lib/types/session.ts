// lib/types/session.ts

import type { Pathway, PathwayPosition } from "./pathway";

export type EmotionalMode = "CALM" | "ANXIOUS" | "CRISIS";

export type LanguageMode = "PLAIN" | "INSTITUTIONAL";

export type ArtifactType =
  | "POSITION_STATEMENT"
  | "PREPARATION_KIT"
  | "RIGHTS_SUMMARY";

export interface Artifact {
  id: string;
  type: ArtifactType;
  content: string;
  generatedAt: string;
  studentReviewed: boolean;
  studentApproved: boolean;
}

export interface PendingThread {
  id: string;
  description: string;
  expectedResponseDate?: string;
  blockingNodeIds: string[];
}

export interface IntakeSession {
  id: string;
  // Plain language summary only — never store raw intake text
  barrierSummary: string;
  matchedBarrierIds: string[];
  matchedAccommodationIds: string[];
  institutionId: string;
  emotionalMode: EmotionalMode;
  createdAt: string;
}

export interface StudentSession {
  id: string;
  intakeSession: IntakeSession;
  pathway: Pathway;
  position: PathwayPosition;
  artifacts: Artifact[];
  pendingThreads: PendingThread[];
  emotionalMode: EmotionalMode;
  languageMode: LanguageMode;
  createdAt: string;
  updatedAt: string;
}