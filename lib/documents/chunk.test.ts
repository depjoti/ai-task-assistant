import { describe, expect, it } from "vitest";

import { chunkText } from "./chunk";

describe("chunkText", () => {
  it("returns an empty array for empty or whitespace-only input", () => {
    expect(chunkText("")).toEqual([]);
    expect(chunkText("   \n  ")).toEqual([]);
  });

  it("returns a single chunk for short text", () => {
    expect(chunkText("Hello world.")).toEqual(["Hello world."]);
  });

  it("splits long text into overlapping chunks that together cover the source", () => {
    // Varying content (not a repeated char) so a boundary/off-by-one bug in
    // the overlap math would actually be caught by the assertions below.
    const text = Array.from({ length: 2000 }, (_, i) => String(i % 10)).join("");
    const chunks = chunkText(text);

    expect(chunks.length).toBeGreaterThan(1);
    // every chunk stays within the configured size
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(800);
    }
    // consecutive chunks overlap by the configured amount rather than
    // skipping or duplicating content at the wrong offset
    expect(chunks[0].slice(-150)).toBe(chunks[1].slice(0, 150));
    expect(chunks[0].slice(-150)).toBe(text.slice(650, 800));
  });

  it("normalizes CRLF line endings before chunking", () => {
    const chunks = chunkText("line one\r\nline two");
    expect(chunks[0]).toBe("line one\nline two");
  });
});
