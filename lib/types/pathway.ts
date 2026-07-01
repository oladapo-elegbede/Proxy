// lib/types/pathway.ts

export type PathwayNodeType = "UNDERSTAND" | "PREPARE" | "ACT" | "CONVERSATION";

export type PathwayNodeStatus =
  | "ACTIVE"
  | "FUTURE"
  | "COMPLETED"
  | "BLOCKED"
  | "WAITING";

export interface PathwayNode {
  id: string;
  type: PathwayNodeType;
  status: PathwayNodeStatus;
  title: string;
  description: string;
  actionLabel: string;
  estimatedDurationMinutes: number;
  accommodationIds: string[];
  blockedUntilNodeId?: string;
  blockedReason?: string;
  sourceUrl?: string;
}

export interface PathwayEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  isConditional: boolean;
}

export interface Pathway {
  id: string;
  institutionId: string;
  nodes: PathwayNode[];
  edges: PathwayEdge[];
  activeNodeId: string;
  estimatedTotalDays: number;
  generatedAt: string;
}

export interface PathwayPosition {
  pathwayId: string;
  activeNodeId: string;
  completedNodeIds: string[];
  pendingThreadIds: string[];
}