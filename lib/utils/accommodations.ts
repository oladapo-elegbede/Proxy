// lib/utils/accommodations.ts
// Client-safe accommodation lookup using static import.

import accommodationsData from "@/data/knowledge-graph/accommodations.json";

interface AccommodationSummary {
  id: string;
  formalName: string;
  plainLanguageDescription: string;
  whatChangesInPractice: string;
}

const accommodationMap = new Map<string, AccommodationSummary>();
for (const acc of accommodationsData as AccommodationSummary[]) {
  accommodationMap.set(acc.id, acc);
}

export function getAccommodationSummaries(ids: string[]): AccommodationSummary[] {
  return ids
    .map((id) => accommodationMap.get(id))
    .filter((acc): acc is AccommodationSummary => acc !== undefined);
}