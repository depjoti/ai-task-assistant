import { NextResponse } from "next/server";

import { planTask } from "@/lib/ai/agentTasks";
import { planRequestSchema, STEP_REQUIRES_APPROVAL, type PlanResponse } from "@/features/agent-tasks/types/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = planRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const plannedSteps = await planTask(parsed.data.goal);

  const response: PlanResponse = {
    steps: plannedSteps.map((step) => ({ ...step, requiresApproval: STEP_REQUIRES_APPROVAL[step.kind] })),
  };
  return NextResponse.json(response);
}
