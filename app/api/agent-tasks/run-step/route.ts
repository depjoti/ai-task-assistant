import { NextResponse } from "next/server";

import { runDraftEmailStep, runSummarizeStep } from "@/lib/ai/agentTasks";
import { runStepRequestSchema, type RunStepResponse } from "@/features/agent-tasks/types/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = runStepRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { kind, input } = parsed.data;
  const output = kind === "summarize" ? await runSummarizeStep(input) : await runDraftEmailStep(input);

  const response: RunStepResponse = { output };
  return NextResponse.json(response);
}
