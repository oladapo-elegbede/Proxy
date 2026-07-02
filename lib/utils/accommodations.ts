// lib/utils/accommodations.ts

import accommodationsData from "@/data/knowledge-graph/accommodations.json";
import barriersData from "@/data/knowledge-graph/functional-barriers.json";

export interface AccommodationSummary {
  id: string;
  formalName: string;
  plainLanguageDescription: string;
  whatChangesInPractice: string;
}

const accommodationMap = new Map<string, AccommodationSummary>();
for (const acc of accommodationsData as AccommodationSummary[]) {
  accommodationMap.set(acc.id, acc);
}

const barrierAccommodationMap = new Map<string, string[]>();
for (const barrier of barriersData as { id: string; accommodationIds: string[] }[]) {
  barrierAccommodationMap.set(barrier.id, barrier.accommodationIds);
}

export function getAccommodationsFromBarriers(
  barrierIds: string[]
): AccommodationSummary[] {
  const accIds = new Set<string>();

  for (const barrierId of barrierIds) {
    const ids = barrierAccommodationMap.get(barrierId) ?? [];
    for (const id of ids) {
      accIds.add(id);
    }
  }

  const result: AccommodationSummary[] = [];
  for (const id of accIds) {
    const acc = accommodationMap.get(id);
    if (acc !== undefined) {
      result.push(acc);
    }
  }
  return result;
}