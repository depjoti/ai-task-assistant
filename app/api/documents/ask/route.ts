import { NextResponse } from "next/server";

import { completeChat } from "@/lib/ai/chat";
import { embedText } from "@/lib/ai/embeddings";
import { searchTopK } from "@/lib/documents/store";
import { askRequestSchema, type AskResponse } from "@/features/documents/types/schema";

export const runtime = "nodejs";

const TOP_K = 4;

const SYSTEM_PROMPT =
  "Answer the user's question using only the provided context snippets. " +
  "If the answer isn't in the context, say you don't know — don't make anything up. " +
  "Reply in plain prose with no markdown formatting (no asterisks, headings, or bullet syntax).";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = askRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { question } = parsed.data;
  const queryEmbedding = await embedText(question);
  const matches = await searchTopK(queryEmbedding, TOP_K);

  if (matches.length === 0) {
    const response: AskResponse = {
      answer: "No documents have been uploaded yet, so I don't have anything to search.",
      sources: [],
    };
    return NextResponse.json(response);
  }

  const context = matches
    .map((match, index) => `[${index + 1}] (${match.documentName})\n${match.content}`)
    .join("\n\n");

  const answer = await completeChat({
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` }],
  });

  const response: AskResponse = {
    answer,
    sources: matches.map((match) => ({
      documentName: match.documentName,
      content: match.content,
      score: match.score,
    })),
  };
  return NextResponse.json(response);
}
