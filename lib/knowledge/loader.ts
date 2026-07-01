// lib/knowledge/loader.ts
// Loads and validates all Knowledge Graph JSON files at startup.
// Builds in-memory Maps for O(1) lookup by ID.

import { readFileSync } from "fs";
import { join } from "path";
import type {
  FunctionalBarrier,
  FunctionalBarrierId,
  AccommodationNode,
  AccommodationId,
  InstitutionDefinition,
  InstitutionId,
  KnowledgeGraph,
} from "@/lib/types";

function loadJson<T>(filePath: string): T {
  const fullPath = join(process.cwd(), filePath);
  const raw = readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

function buildKnowledgeGraph(): KnowledgeGraph {
  // Load raw JSON arrays
  const rawBarriers = loadJson<FunctionalBarrier[]>(
    "data/knowledge-graph/functional-barriers.json"
  );
  const rawAccommodations = loadJson<AccommodationNode[]>(
    "data/knowledge-graph/accommodations.json"
  );
  const rawInstitution = loadJson<InstitutionDefinition>(
    "data/knowledge-graph/institutions/inst-state-university.json"
  );

  // Build Maps for fast lookup
  const barriers = new Map<FunctionalBarrierId, FunctionalBarrier>();
  for (const barrier of rawBarriers) {
    barriers.set(barrier.id, barrier);
  }

  const accommodations = new Map<AccommodationId, AccommodationNode>();
  for (const accommodation of rawAccommodations) {
    accommodations.set(accommodation.id, accommodation);
  }

  const institutions = new Map<InstitutionId, InstitutionDefinition>();
  institutions.set(rawInstitution.id, rawInstitution);

  return { barriers, accommodations, institutions };
}

// Singleton — built once, reused on every request
let graph: KnowledgeGraph | null = null;

export function getKnowledgeGraph(): KnowledgeGraph {
  if (!graph) {
    graph = buildKnowledgeGraph();
  }
  return graph;
}