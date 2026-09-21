"use client";

import { History, Search, SearchX } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useHistorySearch } from "../hooks/useHistorySearch";
import { HistoryEntryItem } from "./HistoryEntryItem";

export function SearchPanel() {
  const { query, setQuery, results } = useHistorySearch();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b p-4">
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search past chats, documents, and tasks…"
            aria-label="Search history"
            className="pl-9"
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {results.length === 0 ? (
          <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center text-sm">
            {query ? (
              <>
                <SearchX className="text-muted-foreground/50 size-6" />
                <p>No matches found.</p>
              </>
            ) : (
              <>
                <History className="text-muted-foreground/50 size-6" />
                <p>Nothing here yet — use the app and it&apos;ll show up in your history.</p>
              </>
            )}
          </div>
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
