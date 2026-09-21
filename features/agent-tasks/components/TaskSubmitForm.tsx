"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TaskSubmitFormProps {
  disabled: boolean;
  onSubmit: (goal: string, input: string) => void;
}

export function TaskSubmitForm({ disabled, onSubmit }: TaskSubmitFormProps) {
  const [goal, setGoal] = useState("Summarize this, then draft a 3-bullet email about it.");
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!goal.trim() || !input.trim() || disabled) return;
    onSubmit(goal, input);
  };

  return (
    <div className="flex flex-col gap-2 border-b p-4">
      <label className="text-sm font-medium" htmlFor="task-goal">
        Task
      </label>
      <Textarea
        id="task-goal"
        value={goal}
        onChange={(event) => setGoal(event.target.value)}
        rows={2}
        disabled={disabled}
      />
      <label className="text-sm font-medium" htmlFor="task-input">
        Source content
      </label>
      <Textarea
        id="task-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Paste the text this task should work on…"
        rows={4}
        disabled={disabled}
      />
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !goal.trim() || !input.trim()}
        className="self-start"
      >
        Run task
      </Button>
    </div>
  );
}
