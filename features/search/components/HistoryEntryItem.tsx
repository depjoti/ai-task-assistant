import { FileText, ListChecks, MessageSquare } from "lucide-react";
import type { ComponentType } from "react";

import { Badge } from "@/components/ui/badge";
import type { HistoryEntry } from "../types/schema";

const TYPE_META: Record<HistoryEntry["type"], { label: string; icon: ComponentType<{ className?: string }> }> = {
  chat: { label: "Chat", icon: MessageSquare },
  document_qa: { label: "Document Q&A", icon: FileText },
  agent_task: { label: "Agent task", icon: ListChecks },
};

export function HistoryEntryItem({ entry }: { entry: HistoryEntry }) {
  const { label, icon: Icon } = TYPE_META[entry.type];

  return (
    <div className="bg-card rounded-lg border p-3 transition-colors">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium">{entry.title}</span>
        <Badge variant="secondary" className="shrink-0 gap-1">
          <Icon className="size-3" />
          {label}
        </Badge>
      </div>
      <p className="text-muted-foreground line-clamp-2 text-sm whitespace-pre-wrap">{entry.summary}</p>
      <p className="text-muted-foreground mt-1.5 text-xs">{new Date(entry.timestamp).toLocaleString()}</p>
    </div>
  );
}
