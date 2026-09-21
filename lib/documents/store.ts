export interface DocumentSummary {
  id: string;
  name: string;
  chunkCount: number;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  documentName: string;
  content: string;
  embedding: number[];
}

export interface ScoredChunk extends DocumentChunk {
  score: number;
}

// In-memory and process-scoped: fine for `next dev` and for demoing this
// feature, but it resets on restart and won't be shared across serverless
// instances in a real deployment. A production version would swap this for
// a persistent vector store without touching any other layer.
const documents = new Map<string, DocumentSummary>();
const chunks: DocumentChunk[] = [];

export function addDocument(document: DocumentSummary, documentChunks: DocumentChunk[]): void {
  documents.set(document.id, document);
  chunks.push(...documentChunks);
}

export function listDocuments(): DocumentSummary[] {
  return Array.from(documents.values());
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dot / denominator;
}

export function searchTopK(queryEmbedding: number[], k: number): ScoredChunk[] {
  return chunks
    .map((chunk) => ({ ...chunk, score: cosineSimilarity(queryEmbedding, chunk.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
