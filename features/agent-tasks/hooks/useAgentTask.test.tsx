import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { makeStore } from "@/lib/redux/store";
import { useAgentTask } from "./useAgentTask";

const { planTaskMock, runStepMock } = vi.hoisted(() => ({
  planTaskMock: vi.fn(),
  runStepMock: vi.fn(),
}));

vi.mock("../api/agentTasksApi", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/agentTasksApi")>();
  return {
    ...actual,
    usePlanTaskMutation: () => [
      (...args: unknown[]) => ({ unwrap: () => planTaskMock(...args) }),
      { isLoading: false },
    ],
    useRunStepMutation: () => [
      (...args: unknown[]) => ({ unwrap: () => runStepMock(...args) }),
      { isLoading: false },
    ],
  };
});

function renderUseAgentTask() {
  const store = makeStore();
  const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
  return renderHook(() => useAgentTask(), { wrapper });
}

describe("useAgentTask", () => {
  beforeEach(() => {
    planTaskMock.mockReset();
    runStepMock.mockReset();
  });

  it("runs all steps automatically when none require approval", async () => {
    planTaskMock.mockResolvedValue({
      steps: [{ title: "Summarize", kind: "summarize", requiresApproval: false }],
    });
    runStepMock.mockResolvedValue({ output: "a summary" });

    const { result } = renderUseAgentTask();

    await act(async () => {
      await result.current.submitTask("summarize this", "some long text");
    });

    expect(result.current.status).toBe("done");
    expect(result.current.steps).toHaveLength(1);
    expect(result.current.steps[0]).toMatchObject({ status: "done", output: "a summary" });
  });

  it("pauses at a step requiring approval instead of running it", async () => {
    planTaskMock.mockResolvedValue({
      steps: [
        { title: "Summarize", kind: "summarize", requiresApproval: false },
        { title: "Draft email", kind: "draft_email", requiresApproval: true },
      ],
    });
    runStepMock.mockResolvedValueOnce({ output: "a summary" });

    const { result } = renderUseAgentTask();

    await act(async () => {
      await result.current.submitTask("summarize then email", "some long text");
    });

    expect(result.current.status).toBe("running");
    expect(result.current.steps[0].status).toBe("done");
    expect(result.current.steps[1].status).toBe("awaiting_approval");
    expect(runStepMock).toHaveBeenCalledTimes(1);
  });

  it("runs the approved step using the previous step's output as input, then completes", async () => {
    planTaskMock.mockResolvedValue({
      steps: [
        { title: "Summarize", kind: "summarize", requiresApproval: false },
        { title: "Draft email", kind: "draft_email", requiresApproval: true },
      ],
    });
    runStepMock.mockResolvedValueOnce({ output: "a summary" }).mockResolvedValueOnce({ output: "an email" });

    const { result } = renderUseAgentTask();

    await act(async () => {
      await result.current.submitTask("summarize then email", "some long text");
    });

    const draftStepId = result.current.steps[1].id;

    await act(async () => {
      await result.current.approveStep(draftStepId);
    });

    expect(runStepMock).toHaveBeenLastCalledWith({ kind: "draft_email", input: "a summary" });
    expect(result.current.status).toBe("done");
    expect(result.current.steps[1]).toMatchObject({ status: "done", output: "an email", approved: true });
  });

  it("stops the task when a step is rejected", async () => {
    planTaskMock.mockResolvedValue({
      steps: [{ title: "Draft email", kind: "draft_email", requiresApproval: true }],
    });

    const { result } = renderUseAgentTask();

    await act(async () => {
      await result.current.submitTask("draft an email", "some long text");
    });

    const stepId = result.current.steps[0].id;

    act(() => {
      result.current.rejectStep(stepId);
    });

    expect(result.current.status).toBe("rejected");
    expect(result.current.steps[0].status).toBe("rejected");
    expect(runStepMock).not.toHaveBeenCalled();
  });

  it("retries a failed step and continues on success", async () => {
    planTaskMock.mockResolvedValue({
      steps: [{ title: "Summarize", kind: "summarize", requiresApproval: false }],
    });
    runStepMock.mockRejectedValueOnce(new Error("network down")).mockResolvedValueOnce({ output: "a summary" });

    const { result } = renderUseAgentTask();

    await act(async () => {
      await result.current.submitTask("summarize this", "some long text");
    });

    expect(result.current.steps[0]).toMatchObject({ status: "failed", error: "network down" });

    const stepId = result.current.steps[0].id;

    await act(async () => {
      await result.current.retryStep(stepId);
    });

    expect(result.current.steps[0]).toMatchObject({ status: "done", output: "a summary" });
    expect(result.current.status).toBe("done");
  });
});
