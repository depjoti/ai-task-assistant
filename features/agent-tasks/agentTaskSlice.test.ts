import { describe, expect, it } from "vitest";

import {
  agentTaskSlice,
  approvalGranted,
  approvalRejected,
  planReceived,
  stepCompleted,
  stepFailed,
  stepStatusChanged,
  taskCompleted,
  taskFailed,
  taskStarted,
} from "./agentTaskSlice";
import type { TaskStep } from "./types/schema";

const { reducer, getInitialState } = agentTaskSlice;

const step = (overrides: Partial<TaskStep> = {}): TaskStep => ({
  id: "1",
  title: "Summarize",
  kind: "summarize",
  requiresApproval: false,
  approved: false,
  status: "pending",
  ...overrides,
});

describe("agentTaskSlice", () => {
  it("resets state and enters planning on taskStarted", () => {
    const state = reducer(
      { ...getInitialState(), steps: [step()], error: "old error" },
      taskStarted({ goal: "do a thing", input: "some text" }),
    );

    expect(state).toMatchObject({ goal: "do a thing", input: "some text", steps: [], status: "planning", error: null });
  });

  it("stores the plan and moves to running on planReceived", () => {
    const steps = [step({ id: "1" }), step({ id: "2", kind: "draft_email", requiresApproval: true })];
    const state = reducer(getInitialState(), planReceived(steps));

    expect(state.steps).toEqual(steps);
    expect(state.status).toBe("running");
  });

  it("updates a single step's status without touching others", () => {
    const initial = { ...getInitialState(), steps: [step({ id: "1" }), step({ id: "2" })] };
    const state = reducer(initial, stepStatusChanged({ id: "2", status: "running" }));

    expect(state.steps[0].status).toBe("pending");
    expect(state.steps[1].status).toBe("running");
  });

  it("marks a step done with its output and clears any prior error", () => {
    const initial = { ...getInitialState(), steps: [step({ id: "1", status: "running", error: "previous" })] };
    const state = reducer(initial, stepCompleted({ id: "1", output: "the summary" }));

    expect(state.steps[0]).toMatchObject({ status: "done", output: "the summary", error: undefined });
  });

  it("marks a step failed with an error message", () => {
    const initial = { ...getInitialState(), steps: [step({ id: "1", status: "running" })] };
    const state = reducer(initial, stepFailed({ id: "1", error: "network down" }));

    expect(state.steps[0]).toMatchObject({ status: "failed", error: "network down" });
  });

  it("approves a step: flips approved and resets status to pending", () => {
    const initial = {
      ...getInitialState(),
      steps: [step({ id: "1", requiresApproval: true, status: "awaiting_approval" })],
    };
    const state = reducer(initial, approvalGranted({ id: "1" }));

    expect(state.steps[0]).toMatchObject({ approved: true, status: "pending" });
  });

  it("rejects a step and stops the whole task", () => {
    const initial = {
      ...getInitialState(),
      steps: [step({ id: "1", requiresApproval: true, status: "awaiting_approval" })],
      status: "running" as const,
    };
    const state = reducer(initial, approvalRejected({ id: "1" }));

    expect(state.steps[0].status).toBe("rejected");
    expect(state.status).toBe("rejected");
  });

  it("marks the task done", () => {
    const state = reducer({ ...getInitialState(), status: "running" }, taskCompleted());
    expect(state.status).toBe("done");
  });

  it("marks the task failed with an error message", () => {
    const state = reducer(getInitialState(), taskFailed("could not plan task"));
    expect(state.status).toBe("error");
    expect(state.error).toBe("could not plan task");
  });
});
