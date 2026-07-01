// lib/types/knowledge-graph.ts

// Branded types prevent accidentally passing the wrong ID type.
// A plain string cannot be used where a FunctionalBarrierId is expected.
export type FunctionalBarrierId = string & { readonly __brand: "FunctionalBarrierId" };
export type AccommodationId = string & { readonly __brand: "AccommodationId" };
export type InstitutionId = string & { readonly __brand: "InstitutionId" };
export type ProcessStepId = string & { readonly __brand: "ProcessStepId" };

export interface FunctionalBarrier {
  id: FunctionalBarrierId;
  plainLanguageDescription: string;
  academicLabel: string;
  manifestations: string[];
  accommodationIds: AccommodationId[];
}

export interface InstitutionObjection {
  objection: string;
  response: string;
}

export interface LegalBasis {
  description: string;
  reference: string;
}

export interface AccommodationNode {
  id: AccommodationId;
  formalName: string;
  plainLanguageDescription: string;
  whatChangesInPractice: string;
  barrierIds: FunctionalBarrierId[];
  commonObjections: InstitutionObjection[];
  legalBasis: LegalBasis;
}

export type PathwayNodeType = "UNDERSTAND" | "PREPARE" | "ACT" | "CONVERSATION";

export interface InstitutionProcessStep {
  stepId: ProcessStepId;
  order: number;
  title: string;
  description: string;
  nodeType: PathwayNodeType;
  canRunInParallel: boolean;
  blockedUntilStepId?: ProcessStepId;
  sourceUrl: string;
}

export interface DocumentationRequirement {
  name: string;
  description: string;
  required: boolean;
  alternativeIfUnavailable?: string;
}

export interface ProcessingTimelines {
  standardDays: number;
  rushAvailable: boolean;
  rushDays?: number;
  sourceUrl: string;
}

export interface DisabilityServicesOffice {
  officeName: string;
  url: string;
  contactEmail: string;
  sourceUrl: string;
  sourceAccessedDate: string;
}

export type InstitutionType =
  | "large-public-university"
  | "small-liberal-arts"
  | "community-college"
  | "ivy-league"
  | "technical-institute";

export interface InstitutionDefinition {
  id: InstitutionId;
  name: string;
  type: InstitutionType;
  disabilityServices: DisabilityServicesOffice;
  processSteps: InstitutionProcessStep[];
  documentationRequirements: DocumentationRequirement[];
  processingTimelines: ProcessingTimelines;
}

export interface KnowledgeGraph {
  barriers: Map<FunctionalBarrierId, FunctionalBarrier>;
  accommodations: Map<AccommodationId, AccommodationNode>;
  institutions: Map<InstitutionId, InstitutionDefinition>;
}