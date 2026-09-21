import { ListTodo } from "lucide-react";

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
    return (
      <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center text-sm">
        <ListTodo className="text-muted-foreground/50 size-6" />
        <p>Submit a task to see its steps here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {steps.map((step, index) => (
        <TaskStep
          key={step.id}
          step={step}
          isLast={index === steps.length - 1}
          onApprove={() => onApprove(step.id)}
          onReject={() => onReject(step.id)}
          onRetry={() => onRetry(step.id)}
        />
      ))}
    </div>
  );
}
