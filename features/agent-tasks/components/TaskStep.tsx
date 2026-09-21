import { AlertCircle, CheckCircle2, CircleDashed, Loader2, RotateCcw, XCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApprovalCheckpoint } from "./ApprovalCheckpoint";
import type { TaskStep as TaskStepType, TaskStepStatus } from "../types/schema";

interface TaskStepProps {
  step: TaskStepType;
  isLast?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onRetry?: () => void;
}

const STATUS_CONFIG: Record<
  TaskStepStatus,
  { label: string; icon: ReactNode; textClassName: string; dotClassName: string }
> = {
  pending: {
    label: "Pending",
    icon: <CircleDashed className="size-3.5" />,
    textClassName: "text-muted-foreground",
    dotClassName: "bg-muted text-muted-foreground",
  },
  awaiting_approval: {
    label: "Needs approval",
    icon: <AlertCircle className="size-3.5" />,
    textClassName: "text-amber-600 dark:text-amber-400",
    dotClassName: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  running: {
    label: "Running",
    icon: <Loader2 className="size-3.5 animate-spin" />,
    textClassName: "text-primary",
    dotClassName: "bg-primary/15 text-primary",
  },
  done: {
    label: "Done",
    icon: <CheckCircle2 className="size-3.5" />,
    textClassName: "text-emerald-600 dark:text-emerald-400",
    dotClassName: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  failed: {
    label: "Failed",
    icon: <XCircle className="size-3.5" />,
    textClassName: "text-destructive",
    dotClassName: "bg-destructive/10 text-destructive",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="size-3.5" />,
    textClassName: "text-muted-foreground",
    dotClassName: "bg-muted text-muted-foreground",
  },
};

export function TaskStep({ step, isLast, onApprove, onReject, onRetry }: TaskStepProps) {
  const config = STATUS_CONFIG[step.status];

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={cn("flex size-7 shrink-0 items-center justify-center rounded-full", config.dotClassName)}>
          {config.icon}
        </div>
        {!isLast && <div className="bg-border mt-1 w-px flex-1" />}
      </div>

      <div className={cn("min-w-0 flex-1", !isLast && "pb-5")}>
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-sm font-medium">{step.title}</span>
          <span className={cn("text-xs font-medium", config.textClassName)}>{config.label}</span>
        </div>

        {step.status === "done" && step.output && (
          <p className="text-muted-foreground mt-1.5 text-sm whitespace-pre-wrap">{step.output}</p>
        )}

        {step.status === "failed" && (
          <div className="mt-1.5 flex items-center justify-between gap-2">
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
    </div>
  );
}
