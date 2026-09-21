import { NextResponse } from "next/server";

import { embedTexts } from "@/lib/ai/embeddings";
import { chunkText } from "@/lib/documents/chunk";
import { extractText } from "@/lib/documents/extractText";
import { addDocument, type DocumentChunk } from "@/lib/documents/store";
import type { UploadDocumentResponse } from "@/features/documents/types/schema";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "text/plain", "text/markdown"];

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file is required" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File is too large (max 5MB)" }, { status: 400 });
  }

  const isAcceptedType =
    ACCEPTED_TYPES.includes(file.type) || /\.(pdf|txt|md)$/i.test(file.name);
  if (!isAcceptedType) {
    return NextResponse.json({ error: "Only PDF, .txt, and .md files are supported" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const text = await extractText({ name: file.name, type: file.type, buffer });
  const pieces = chunkText(text);

  if (pieces.length === 0) {
    return NextResponse.json({ error: "No extractable text found in that file" }, { status: 400 });
  }

  const embeddings = await embedTexts(pieces);
  const documentId = crypto.randomUUID();

  const documentChunks: DocumentChunk[] = pieces.map((content, index) => ({
    id: crypto.randomUUID(),
    documentId,
    documentName: file.name,
    content,
    embedding: embeddings[index],
  }));

  addDocument({ id: documentId, name: file.name, chunkCount: documentChunks.length }, documentChunks);

  const response: UploadDocumentResponse = {
    document: { id: documentId, name: file.name, chunkCount: documentChunks.length },
  };
  return NextResponse.json(response);
}
