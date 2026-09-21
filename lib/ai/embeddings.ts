import { requireEnv } from "@/lib/env";

const EMBEDDING_MODEL = "gemini-embedding-001";
const BATCH_SIZE = 50;

interface GeminiBatchEmbedResponse {
  embeddings: { values: number[] }[];
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const apiKey = requireEnv("GEMINI_API_KEY");
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:batchEmbedContents?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: batch.map((text) => ({
            model: `models/${EMBEDDING_MODEL}`,
            content: { parts: [{ text }] },
          })),
        }),
      },
    );

    if (!response.ok) {
      const message = await response.text().catch(() => response.statusText);
      throw new Error(`Embedding request failed: ${message}`);
    }

    const data = (await response.json()) as GeminiBatchEmbedResponse;
    results.push(...data.embeddings.map((embedding) => embedding.values));
  }

  return results;
}

export async function embedText(text: string): Promise<number[]> {
  const [embedding] = await embedTexts([text]);
  return embedding;
}
