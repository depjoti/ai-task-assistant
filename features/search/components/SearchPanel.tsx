"use client";

import { Input } from "@/components/ui/input";
import { useHistorySearch } from "../hooks/useHistorySearch";
import { HistoryEntryItem } from "./HistoryEntryItem";

export function SearchPanel() {
  const { query, setQuery, results } = useHistorySearch();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b p-4">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search past chats, documents, and tasks…"
          aria-label="Search history"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {results.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {query ? "No matches found." : "Nothing here yet — use the app and it'll show up in your history."}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {results.map((entry) => (
              <HistoryEntryItem key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
