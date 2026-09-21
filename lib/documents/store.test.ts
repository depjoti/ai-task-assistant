import { beforeEach, describe, expect, it, vi } from "vitest";

const { redisData } = vi.hoisted(() => ({ redisData: {} as Record<string, Record<string, unknown>> }));

vi.mock("@upstash/redis", () => ({
  Redis: class {
    async hset(key: string, kv: Record<string, unknown>) {
      redisData[key] = { ...(redisData[key] ?? {}), ...kv };
      return Object.keys(kv).length;
    }
    async hgetall(key: string) {
      return redisData[key] && Object.keys(redisData[key]).length > 0 ? redisData[key] : null;
    }
    async del(...keys: string[]) {
      let deleted = 0;
      for (const key of keys) {
        if (redisData[key]) deleted += 1;
        delete redisData[key];
      }
      return deleted;
    }
  },
}));

vi.mock("@/lib/env", () => ({
  requireEnv: vi.fn(() => "test-value"),
}));

import { addDocument, clearDocuments, listDocuments, searchTopK } from "./store";

describe("document store", () => {
  beforeEach(() => {
    for (const key of Object.keys(redisData)) delete redisData[key];
  });

  it("lists documents that were added", async () => {
    await addDocument({ id: "doc-1", name: "notes.txt", chunkCount: 1 }, [
      { id: "c1", documentId: "doc-1", documentName: "notes.txt", content: "hello", embedding: [1, 0] },
    ]);

    expect(await listDocuments()).toEqual([{ id: "doc-1", name: "notes.txt", chunkCount: 1 }]);
  });

  it("ranks chunks by cosine similarity to the query, most similar first", async () => {
    await addDocument({ id: "doc-1", name: "a.txt", chunkCount: 3 }, [
      { id: "c1", documentId: "doc-1", documentName: "a.txt", content: "exact match", embedding: [1, 0] },
      { id: "c2", documentId: "doc-1", documentName: "a.txt", content: "orthogonal", embedding: [0, 1] },
      { id: "c3", documentId: "doc-1", documentName: "a.txt", content: "opposite", embedding: [-1, 0] },
    ]);

    const results = await searchTopK([1, 0], 3);

    expect(results.map((r) => r.id)).toEqual(["c1", "c2", "c3"]);
    expect(results[0].score).toBeCloseTo(1);
    expect(results[1].score).toBeCloseTo(0);
    expect(results[2].score).toBeCloseTo(-1);
  });

  it("limits results to k", async () => {
    await addDocument({ id: "doc-1", name: "a.txt", chunkCount: 3 }, [
      { id: "c1", documentId: "doc-1", documentName: "a.txt", content: "one", embedding: [1, 0] },
      { id: "c2", documentId: "doc-1", documentName: "a.txt", content: "two", embedding: [0.9, 0.1] },
      { id: "c3", documentId: "doc-1", documentName: "a.txt", content: "three", embedding: [0, 1] },
    ]);

    expect(await searchTopK([1, 0], 2)).toHaveLength(2);
  });

  it("returns a score of 0 for a zero-vector embedding instead of dividing by zero", async () => {
    await addDocument({ id: "doc-1", name: "a.txt", chunkCount: 1 }, [
      { id: "c1", documentId: "doc-1", documentName: "a.txt", content: "zero", embedding: [0, 0] },
    ]);

    const [result] = await searchTopK([1, 0], 1);
    expect(result.score).toBe(0);
  });

  it("returns an empty list when nothing has been added", async () => {
    expect(await listDocuments()).toEqual([]);
    expect(await searchTopK([1, 0], 5)).toEqual([]);
  });

  it("replaces the previous document instead of accumulating a library", async () => {
    await addDocument({ id: "doc-1", name: "first.txt", chunkCount: 1 }, [
      { id: "c1", documentId: "doc-1", documentName: "first.txt", content: "first content", embedding: [1, 0] },
    ]);

    await addDocument({ id: "doc-2", name: "second.txt", chunkCount: 1 }, [
      { id: "c2", documentId: "doc-2", documentName: "second.txt", content: "second content", embedding: [0, 1] },
    ]);

    expect(await listDocuments()).toEqual([{ id: "doc-2", name: "second.txt", chunkCount: 1 }]);

    const results = await searchTopK([0, 1], 10);
    expect(results.map((r) => r.id)).toEqual(["c2"]);
  });

  it("clears the document and its chunks", async () => {
    await addDocument({ id: "doc-1", name: "a.txt", chunkCount: 1 }, [
      { id: "c1", documentId: "doc-1", documentName: "a.txt", content: "hello", embedding: [1, 0] },
    ]);

    await clearDocuments();

    expect(await listDocuments()).toEqual([]);
    expect(await searchTopK([1, 0], 5)).toEqual([]);
  });
});
