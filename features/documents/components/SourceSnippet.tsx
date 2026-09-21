import { Badge } from "@/components/ui/badge";
import type { SourceSnippet as SourceSnippetType } from "../types/schema";

export function SourceSnippet({ source }: { source: SourceSnippetType }) {
  return (
    <div className="rounded-lg border p-3 text-sm">
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="truncate font-medium">{source.documentName}</span>
        <Badge variant="outline">{Math.round(source.score * 100)}% match</Badge>
      </div>
      <p className="text-muted-foreground whitespace-pre-wrap">{source.content}</p>
    </div>
  );
}
