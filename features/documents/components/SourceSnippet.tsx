import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { SourceSnippet as SourceSnippetType } from "../types/schema";

export function SourceSnippet({ source }: { source: SourceSnippetType }) {
  return (
    <div className="bg-card rounded-lg border p-3 text-sm">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 font-medium">
          <FileText className="text-muted-foreground size-3.5 shrink-0" />
          <span className="truncate">{source.documentName}</span>
        </span>
        <Badge variant="outline" className="text-primary border-primary/30 shrink-0">
          {Math.round(source.score * 100)}% match
        </Badge>
      </div>
      <p className="text-muted-foreground whitespace-pre-wrap">{source.content}</p>
    </div>
  );
}
