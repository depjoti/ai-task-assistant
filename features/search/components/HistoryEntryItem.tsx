import { Badge } from "@/components/ui/badge";
import type { HistoryEntry } from "../types/schema";

const TYPE_LABEL: Record<HistoryEntry["type"], string> = {
  chat: "Chat",
  document_qa: "Document Q&A",
  agent_task: "Agent task",
};

export function HistoryEntryItem({ entry }: { entry: HistoryEntry }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium">{entry.title}</span>
        <Badge variant="outline">{TYPE_LABEL[entry.type]}</Badge>
      </div>
      <p className="text-muted-foreground line-clamp-2 text-sm whitespace-pre-wrap">{entry.summary}</p>
      <p className="text-muted-foreground mt-1 text-xs">{new Date(entry.timestamp).toLocaleString()}</p>
    </div>
  );
}
