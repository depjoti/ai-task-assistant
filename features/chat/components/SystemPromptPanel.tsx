"use client";

import { ChevronDown, Settings2 } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface SystemPromptPanelProps {
  value: string;
  onChange: (value: string) => void;
}

export function SystemPromptPanel({ value, onChange }: SystemPromptPanelProps) {
  const [open, setOpen] = useState(false);
  const fieldId = useId();

  return (
    <div className="border-b">
      <Button
        type="button"
        variant="ghost"
        className="text-muted-foreground hover:text-foreground w-full justify-between rounded-none px-4 py-2.5 text-sm font-medium"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={fieldId}
      >
        <span className="flex items-center gap-1.5">
          <Settings2 className="size-3.5" />
          System prompt
        </span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </Button>
      {open && (
        <div id={fieldId} className="px-4 pb-4">
          <Textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={3}
            aria-label="System prompt"
            className="text-sm"
          />
        </div>
      )}
    </div>
  );
}
