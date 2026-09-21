import { Redis } from "@upstash/redis";

import { requireEnv } from "@/lib/env";

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

const DOCUMENTS_KEY = "documents";
const CHUNKS_KEY = "chunks";

let client: Redis | null = null;

function getRedis(): Redis {
  if (!client) {
    client = new Redis({
      url: requireEnv("UPSTASH_REDIS_REST_URL"),
      token: requireEnv("UPSTASH_REDIS_REST_TOKEN"),
    });
  }
  return client;
}

// Only one document is kept at a time — uploading a new one replaces
// whatever was there before, rather than accumulating a library.
export async function addDocument(document: DocumentSummary, documentChunks: DocumentChunk[]): Promise<void> {
  const redis = getRedis();
  await redis.del(DOCUMENTS_KEY, CHUNKS_KEY);
  await redis.hset(DOCUMENTS_KEY, { [document.id]: document });

  if (documentChunks.length > 0) {
    const chunkEntries = Object.fromEntries(documentChunks.map((chunk) => [chunk.id, chunk]));
    await redis.hset(CHUNKS_KEY, chunkEntries);
  }
}

export async function listDocuments(): Promise<DocumentSummary[]> {
  const redis = getRedis();
  const all = await redis.hgetall<Record<string, DocumentSummary>>(DOCUMENTS_KEY);
  return all ? Object.values(all) : [];
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

export async function searchTopK(queryEmbedding: number[], k: number): Promise<ScoredChunk[]> {
  const redis = getRedis();
  const all = await redis.hgetall<Record<string, DocumentChunk>>(CHUNKS_KEY);
  const chunks = all ? Object.values(all) : [];

  return chunks
    .map((chunk) => ({ ...chunk, score: cosineSimilarity(queryEmbedding, chunk.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
