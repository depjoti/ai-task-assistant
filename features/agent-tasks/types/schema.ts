import { z } from "zod";

export const taskStepKindSchema = z.enum(["summarize", "draft_email"]);
export type TaskStepKind = z.infer<typeof taskStepKindSchema>;

// Whether a step type is side-effecting enough to require an explicit
// human approval before it runs. Derived from the step's kind rather than
// left to the planner's judgment, so it's always consistent.
export const STEP_REQUIRES_APPROVAL: Record<TaskStepKind, boolean> = {
  summarize: false,
  draft_email: true,
};

export const taskStepStatusSchema = z.enum([
  "pending",
  "awaiting_approval",
  "running",
  "done",
  "failed",
  "rejected",
]);
export type TaskStepStatus = z.infer<typeof taskStepStatusSchema>;

// What the planning LLM call must produce.
export const plannedStepSchema = z.object({
  title: z.string().min(1),
  kind: taskStepKindSchema,
});
export type PlannedStep = z.infer<typeof plannedStepSchema>;

export const rawPlanSchema = z.object({
  steps: z.array(plannedStepSchema).min(1).max(4),
});

// Full runtime step, as tracked in the Redux slice.
export const taskStepSchema = plannedStepSchema.extend({
  id: z.string(),
  requiresApproval: z.boolean(),
  approved: z.boolean(),
  status: taskStepStatusSchema,
  output: z.string().optional(),
  error: z.string().optional(),
});
export type TaskStep = z.infer<typeof taskStepSchema>;

export const planRequestSchema = z.object({
  goal: z.string().min(1),
});
export type PlanRequest = z.infer<typeof planRequestSchema>;

const plannedStepWithApprovalSchema = plannedStepSchema.extend({
  requiresApproval: z.boolean(),
});

export const planResponseSchema = z.object({
  steps: z.array(plannedStepWithApprovalSchema),
});
export type PlanResponse = z.infer<typeof planResponseSchema>;

export const runStepRequestSchema = z.object({
  kind: taskStepKindSchema,
  input: z.string().min(1),
});
export type RunStepRequest = z.infer<typeof runStepRequestSchema>;

export const runStepResponseSchema = z.object({
  output: z.string(),
});
export type RunStepResponse = z.infer<typeof runStepResponseSchema>;
