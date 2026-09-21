"use client";

import { Loader2, XCircle } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgentTask } from "../hooks/useAgentTask";
import { TaskStepList } from "./TaskStepList";
import { TaskSubmitForm } from "./TaskSubmitForm";

export function AgentTaskPanel() {
  const { steps, status, error, submitTask, approveStep, rejectStep, retryStep } = useAgentTask();
  // Not just `status === "running"` — that stays true while paused on an
  // approval checkpoint too, which would show the submit button as busy
  // while it's actually just waiting on the user.
  const isBusy = status === "planning" || steps.some((step) => step.status === "running");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <TaskSubmitForm isBusy={isBusy} onSubmit={submitTask} />
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-1 flex-col gap-3 p-4">
          {status === "planning" && (
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <Loader2 className="size-3.5 animate-spin" />
              Planning steps…
            </p>
          )}
          {error && <p className="text-destructive text-sm">{error}</p>}
          {status === "rejected" && (
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <XCircle className="size-3.5" />
              Task stopped — a step was rejected.
            </p>
          )}
          <TaskStepList steps={steps} onApprove={approveStep} onReject={rejectStep} onRetry={retryStep} />
        </div>
      </ScrollArea>
    </div>
  );
}
