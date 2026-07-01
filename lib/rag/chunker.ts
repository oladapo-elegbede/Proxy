// lib/rag/chunker.ts
// Splits policy documents into overlapping chunks for embedding.

export interface DocumentChunk {
  text: string;
  metadata: {
    sourceDocument: string;
    sourceUrl: string;
    institution: string;
    documentType: "federal-law" | "institution-policy" | "best-practice";
    chunkIndex: number;
    characterOffset: number;
  };
}

const CHUNK_SIZE = 400;
const CHUNK_OVERLAP = 50;

export function chunkDocument(
  text: string,
  metadata: Omit<DocumentChunk["metadata"], "chunkIndex" | "characterOffset">
): DocumentChunk[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: DocumentChunk[] = [];

  let currentChunk = "";
  let currentOffset = 0;
  let chunkIndex = 0;

  for (const sentence of sentences) {
    const words = (currentChunk + " " + sentence).trim().split(/\s+/);

    if (words.length > CHUNK_SIZE && currentChunk.length > 0) {
      // Save current chunk
      chunks.push({
        text: currentChunk.trim(),
        metadata: { ...metadata, chunkIndex, characterOffset: currentOffset },
      });

      // Keep overlap from end of current chunk
      const overlapWords = currentChunk.trim().split(/\s+/).slice(-CHUNK_OVERLAP);
      currentChunk = overlapWords.join(" ") + " " + sentence;
      currentOffset += currentChunk.length;
      chunkIndex++;
    } else {
      currentChunk = words.join(" ");
    }
  }

  // Save final chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      text: currentChunk.trim(),
      metadata: { ...metadata, chunkIndex, characterOffset: currentOffset },
    });
  }

  return chunks;
}