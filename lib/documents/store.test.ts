import { beforeEach, describe, expect, it, vi } from "vitest";

describe("document store", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("lists documents that were added", async () => {
    const { addDocument, listDocuments } = await import("./store");

    addDocument({ id: "doc-1", name: "notes.txt", chunkCount: 1 }, [
      { id: "c1", documentId: "doc-1", documentName: "notes.txt", content: "hello", embedding: [1, 0] },
    ]);

    expect(listDocuments()).toEqual([{ id: "doc-1", name: "notes.txt", chunkCount: 1 }]);
  });

  it("ranks chunks by cosine similarity to the query, most similar first", async () => {
    const { addDocument, searchTopK } = await import("./store");

    addDocument({ id: "doc-1", name: "a.txt", chunkCount: 3 }, [
      { id: "c1", documentId: "doc-1", documentName: "a.txt", content: "exact match", embedding: [1, 0] },
      { id: "c2", documentId: "doc-1", documentName: "a.txt", content: "orthogonal", embedding: [0, 1] },
      { id: "c3", documentId: "doc-1", documentName: "a.txt", content: "opposite", embedding: [-1, 0] },
    ]);

    const results = searchTopK([1, 0], 3);

    expect(results.map((r) => r.id)).toEqual(["c1", "c2", "c3"]);
    expect(results[0].score).toBeCloseTo(1);
    expect(results[1].score).toBeCloseTo(0);
    expect(results[2].score).toBeCloseTo(-1);
  });

  it("limits results to k", async () => {
    const { addDocument, searchTopK } = await import("./store");

    addDocument({ id: "doc-1", name: "a.txt", chunkCount: 3 }, [
      { id: "c1", documentId: "doc-1", documentName: "a.txt", content: "one", embedding: [1, 0] },
      { id: "c2", documentId: "doc-1", documentName: "a.txt", content: "two", embedding: [0.9, 0.1] },
      { id: "c3", documentId: "doc-1", documentName: "a.txt", content: "three", embedding: [0, 1] },
    ]);

    expect(searchTopK([1, 0], 2)).toHaveLength(2);
  });

  it("returns a score of 0 for a zero-vector embedding instead of dividing by zero", async () => {
    const { addDocument, searchTopK } = await import("./store");

    addDocument({ id: "doc-1", name: "a.txt", chunkCount: 1 }, [
      { id: "c1", documentId: "doc-1", documentName: "a.txt", content: "zero", embedding: [0, 0] },
    ]);

    const [result] = searchTopK([1, 0], 1);
    expect(result.score).toBe(0);
  });
});
