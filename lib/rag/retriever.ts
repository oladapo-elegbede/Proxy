// lib/rag/retriever.ts
// Retrieves relevant policy chunks from Pinecone using semantic search.

import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

export interface PolicyChunk {
  text: string;
  sourceDocument: string;
  sourceUrl: string;
  institution: string;
  documentType: string;
  relevanceScore: number;
  chunkIndex: number;
}

export interface RightsQueryContext {
  accommodationType?: string;
  institutionId?: string;
}

const MINIMUM_RELEVANCE_SCORE = 0.7;
const MAX_RESULTS = 5;

function getPineconeClient(): Pinecone {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) throw new Error("PINECONE_API_KEY is not set");
  return new Pinecone({ apiKey });
}

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey });
}

async function generateEmbedding(text: string): Promise<number[]> {
  const openai = getOpenAIClient();
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  const embedding = response.data[0]?.embedding;
  if (!embedding) throw new Error("Failed to generate embedding");
  return embedding;
}

export async function retrievePolicyChunks(
  query: string,
  _context: RightsQueryContext
): Promise<PolicyChunk[]> {
  const indexName = process.env.PINECONE_INDEX_NAME ?? "proxy-policy-corpus";

  const pinecone = getPineconeClient();
  const index = pinecone.index(indexName);

  const queryEmbedding = await generateEmbedding(query);

  const results = await index.query({
    vector: queryEmbedding,
    topK: MAX_RESULTS,
    includeMetadata: true,
  });

  return results.matches
    .filter((match) => (match.score ?? 0) >= MINIMUM_RELEVANCE_SCORE)
    .map((match) => ({
      text: String(match.metadata?.["text"] ?? ""),
      sourceDocument: String(match.metadata?.["sourceDocument"] ?? ""),
      sourceUrl: String(match.metadata?.["sourceUrl"] ?? ""),
      institution: String(match.metadata?.["institution"] ?? "federal"),
      documentType: String(match.metadata?.["documentType"] ?? ""),
      relevanceScore: match.score ?? 0,
      chunkIndex: Number(match.metadata?.["chunkIndex"] ?? 0),
    }));
}