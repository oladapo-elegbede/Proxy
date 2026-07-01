// lib/rag/citation-builder.ts
// Converts retrieved policy chunks into structured citations for display.

import type { PolicyChunk } from "./retriever";

export interface Citation {
  shortDescription: string;
  sourceUrl: string;
  institution: string;
  documentType: string;
}

export function buildCitations(chunks: PolicyChunk[]): Citation[] {
  const seen = new Set<string>();
  const citations: Citation[] = [];

  for (const chunk of chunks) {
    // Deduplicate by source document
    if (seen.has(chunk.sourceDocument)) continue;
    seen.add(chunk.sourceDocument);

    citations.push({
      shortDescription: formatDescription(chunk.sourceDocument, chunk.documentType),
      sourceUrl: chunk.sourceUrl,
      institution: chunk.institution,
      documentType: chunk.documentType,
    });
  }

  return citations;
}

function formatDescription(sourceDocument: string, documentType: string): string {
  if (documentType === "federal-law") {
    return sourceDocument;
  }
  if (documentType === "institution-policy") {
    return `Institutional Policy — ${sourceDocument}`;
  }
  return sourceDocument;
}