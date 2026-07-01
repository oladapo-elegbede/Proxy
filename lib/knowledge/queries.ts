// lib/knowledge/queries.ts
// Pure query functions for the Knowledge Graph.
// All AI pipelines use these functions — never access the graph directly.

import { getKnowledgeGraph } from "./loader";
import type {
  FunctionalBarrier,
  FunctionalBarrierId,
  AccommodationNode,
  AccommodationId,
  InstitutionDefinition,
  InstitutionId,
  InstitutionProcessStep,
  InstitutionObjection,
} from "@/lib/types";

export function getBarrierById(
  id: FunctionalBarrierId
): FunctionalBarrier | undefined {
  return getKnowledgeGraph().barriers.get(id);
}

export function getAllBarriers(): FunctionalBarrier[] {
  return Array.from(getKnowledgeGraph().barriers.values());
}

export function getAccommodationById(
  id: AccommodationId
): AccommodationNode | undefined {
  return getKnowledgeGraph().accommodations.get(id);
}

export function getAllAccommodations(): AccommodationNode[] {
  return Array.from(getKnowledgeGraph().accommodations.values());
}

export function getAccommodationsForBarrier(
  barrierId: FunctionalBarrierId
): AccommodationNode[] {
  const barrier = getBarrierById(barrierId);
  if (!barrier) return [];

  return barrier.accommodationIds
    .map((id) => getAccommodationById(id))
    .filter((acc): acc is AccommodationNode => acc !== undefined);
}

export function getInstitutionById(
  id: InstitutionId
): InstitutionDefinition | undefined {
  return getKnowledgeGraph().institutions.get(id);
}

export function getAllInstitutions(): InstitutionDefinition[] {
  return Array.from(getKnowledgeGraph().institutions.values());
}

export function getProcessStepsForInstitution(
  institutionId: InstitutionId
): InstitutionProcessStep[] {
  const institution = getInstitutionById(institutionId);
  if (!institution) return [];
  return [...institution.processSteps].sort((a, b) => a.order - b.order);
}

export function getObjectionsForAccommodation(
  accommodationId: AccommodationId
): InstitutionObjection[] {
  const accommodation = getAccommodationById(accommodationId);
  if (!accommodation) return [];
  return accommodation.commonObjections;
}