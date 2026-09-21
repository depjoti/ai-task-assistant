const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 150;

export function chunkText(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const chunks: string[] = [];
  let start = 0;

  while (start < normalized.length) {
    const end = Math.min(start + CHUNK_SIZE, normalized.length);
    const chunk = normalized.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    if (end === normalized.length) break;
    start = end - CHUNK_OVERLAP;
  }

  return chunks;
}
