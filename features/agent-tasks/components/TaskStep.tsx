import { AlertCircle, CheckCircle2, CircleDashed, Loader2, RotateCcw, XCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { ApprovalCheckpoint } from "./ApprovalCheckpoint";
import type { TaskStep as TaskStepType, TaskStepStatus } from "../types/schema";

interface TaskStepProps {
  step: TaskStepType;
  onApprove?: () => void;
  onReject?: () => void;
  onRetry?: () => void;
}

const STATUS_CONFIG: Record<TaskStepStatus, { label: string; icon: ReactNode; className: string }> = {
  pending: { label: "Pending", icon: <CircleDashed className="size-4" />, className: "text-muted-foreground" },
  awaiting_approval: {
    label: "Needs approval",
    icon: <AlertCircle className="size-4" />,
    className: "text-amber-600",
  },
  running: { label: "Running", icon: <Loader2 className="size-4 animate-spin" />, className: "text-blue-600" },
  done: { label: "Done", icon: <CheckCircle2 className="size-4" />, className: "text-green-600" },
  failed: { label: "Failed", icon: <XCircle className="size-4" />, className: "text-destructive" },
  rejected: { label: "Rejected", icon: <XCircle className="size-4" />, className: "text-muted-foreground" },
};

export function TaskStep({ step, onApprove, onReject, onRetry }: TaskStepProps) {
  const config = STATUS_CONFIG[step.status];

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{step.title}</span>
        <span className={`flex items-center gap-1 text-xs ${config.className}`}>
          {config.icon}
          {config.label}
        </span>
      </div>

      {step.status === "done" && step.output && (
        <p className="text-muted-foreground mt-2 text-sm whitespace-pre-wrap">{step.output}</p>
      )}

      {step.status === "failed" && (
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-destructive text-sm">{step.error}</p>
          {onRetry && (
            <Button type="button" size="sm" variant="outline" onClick={onRetry}>
              <RotateCcw className="size-3.5" />
              Retry
            </Button>
          )}
        </div>
      )}

      {step.status === "awaiting_approval" && onApprove && onReject && (
        <ApprovalCheckpoint stepTitle={step.title} onApprove={onApprove} onReject={onReject} />
      )}
    </div>
  );
}
