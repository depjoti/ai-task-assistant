import { NextResponse } from "next/server";

import { listDocuments } from "@/lib/documents/store";
import type { ListDocumentsResponse } from "@/features/documents/types/schema";

export async function GET() {
  const response: ListDocumentsResponse = { documents: await listDocuments() };
  return NextResponse.json(response);
}
