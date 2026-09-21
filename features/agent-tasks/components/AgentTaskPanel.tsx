"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgentTask } from "../hooks/useAgentTask";
import { TaskStepList } from "./TaskStepList";
import { TaskSubmitForm } from "./TaskSubmitForm";

export function AgentTaskPanel() {
  const { steps, status, error, submitTask, approveStep, rejectStep, retryStep } = useAgentTask();
  const isBusy = status === "planning" || status === "running";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <TaskSubmitForm disabled={isBusy} onSubmit={submitTask} />
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-3 p-4">
          {status === "planning" && <p className="text-muted-foreground text-sm">Planning steps…</p>}
          {error && <p className="text-destructive text-sm">{error}</p>}
          {status === "rejected" && (
            <p className="text-muted-foreground text-sm">Task stopped — a step was rejected.</p>
          )}
          <TaskStepList steps={steps} onApprove={approveStep} onReject={rejectStep} onRetry={retryStep} />
        </div>
      </ScrollArea>
    </div>
  );
}
