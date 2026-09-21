import { NextResponse } from "next/server";

import { clearDocuments, listDocuments } from "@/lib/documents/store";
import type { ListDocumentsResponse } from "@/features/documents/types/schema";

export async function GET() {
  const response: ListDocumentsResponse = { documents: await listDocuments() };
  return NextResponse.json(response);
}

export async function DELETE() {
  await clearDocuments();
  return new NextResponse(null, { status: 204 });
}
