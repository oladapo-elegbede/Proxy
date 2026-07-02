// lib/knowledge/loader.ts
// Uses static imports so Vercel bundles the JSON files correctly.

import type {
  FunctionalBarrier,
  FunctionalBarrierId,
  AccommodationNode,
  AccommodationId,
  InstitutionDefinition,
  InstitutionId,
  KnowledgeGraph,
} from "@/lib/types";

import barriersData from "@/data/knowledge-graph/functional-barriers.json";
import accommodationsData from "@/data/knowledge-graph/accommodations.json";
import institutionData from "@/data/knowledge-graph/institutions/inst-state-university.json";

let graph: KnowledgeGraph | null = null;

export function getKnowledgeGraph(): KnowledgeGraph {
  if (graph) return graph;

  const barriers = new Map<FunctionalBarrierId, FunctionalBarrier>();
  for (const barrier of barriersData as FunctionalBarrier[]) {
    barriers.set(barrier.id, barrier);
  }

  const accommodations = new Map<AccommodationId, AccommodationNode>();
  for (const accommodation of accommodationsData as AccommodationNode[]) {
    accommodations.set(accommodation.id, accommodation);
  }

  const institutions = new Map<InstitutionId, InstitutionDefinition>();
  const inst = institutionData as InstitutionDefinition;
  institutions.set(inst.id, inst);

  graph = { barriers, accommodations, institutions };
  return graph;
}