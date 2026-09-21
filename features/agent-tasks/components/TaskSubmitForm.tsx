"use client";

import { Loader2, Play } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TaskSubmitFormProps {
  isBusy: boolean;
  onSubmit: (goal: string, input: string) => void;
}

export function TaskSubmitForm({ isBusy, onSubmit }: TaskSubmitFormProps) {
  const [goal, setGoal] = useState("Summarize this, then draft a 3-bullet email about it.");
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!goal.trim() || !input.trim() || isBusy) return;
    onSubmit(goal, input);
  };

  return (
    <div className="flex flex-col gap-3 border-b p-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" htmlFor="task-goal">
          Task
        </label>
        <Textarea
          id="task-goal"
          value={goal}
          onChange={(event) => setGoal(event.target.value)}
          rows={2}
          disabled={isBusy}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" htmlFor="task-input">
          Source content
        </label>
        <Textarea
          id="task-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste the text this task should work on…"
          rows={4}
          disabled={isBusy}
        />
      </div>
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isBusy || !goal.trim() || !input.trim()}
        className="self-start"
      >
        {isBusy ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
        Run task
      </Button>
    </div>
  );
}
