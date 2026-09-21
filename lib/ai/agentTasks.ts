import { rawPlanSchema, type PlannedStep } from "@/features/agent-tasks/types/schema";
import { completeChat } from "./chat";

const PLAN_SYSTEM_PROMPT = `You are a task planner. Break the user's goal into an ordered sequence of 1 to 4 steps.
Each step must have a "title" (short, human-readable) and a "kind", which must be exactly one of:
- "summarize": condense the given text into a short summary
- "draft_email": write a short email based on the given text

Respond with ONLY a JSON object of this exact shape, no other text and no markdown code fences:
{"steps": [{"title": string, "kind": "summarize" | "draft_email"}, ...]}`;

export async function planTask(goal: string): Promise<PlannedStep[]> {
  const raw = await completeChat({
    systemPrompt: PLAN_SYSTEM_PROMPT,
    messages: [{ role: "user", content: goal }],
    jsonMode: true,
  });

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    throw new Error("The planner returned invalid JSON");
  }

  const { steps } = rawPlanSchema.parse(parsedJson);
  return steps;
}

export async function runSummarizeStep(input: string): Promise<string> {
  return completeChat({
    systemPrompt: "Summarize the given text in 2-3 concise sentences. Plain prose only, no markdown formatting.",
    messages: [{ role: "user", content: input }],
  });
}

export async function runDraftEmailStep(input: string): Promise<string> {
  return completeChat({
    systemPrompt:
      "Draft a short, professional email with exactly 3 bullet points, based on the given content. " +
      "Plain text only: no markdown formatting, no subject line needed.",
    messages: [{ role: "user", content: input }],
  });
}
