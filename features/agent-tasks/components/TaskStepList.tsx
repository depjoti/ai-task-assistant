import { TaskStep } from "./TaskStep";
import type { TaskStep as TaskStepType } from "../types/schema";

interface TaskStepListProps {
  steps: TaskStepType[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRetry: (id: string) => void;
}

export function TaskStepList({ steps, onApprove, onReject, onRetry }: TaskStepListProps) {
  if (steps.length === 0) {
    return <p className="text-muted-foreground text-sm">Submit a task to see its steps here.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {steps.map((step) => (
        <TaskStep
          key={step.id}
          step={step}
          onApprove={() => onApprove(step.id)}
          onReject={() => onReject(step.id)}
          onRetry={() => onRetry(step.id)}
        />
      ))}
    </div>
  );
}
