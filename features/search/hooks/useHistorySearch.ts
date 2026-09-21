"use client";

import { useMemo, useState } from "react";

import { useAppSelector } from "@/lib/redux/hooks";
import { selectHistoryEntries } from "../historySlice";

export function useHistorySearch() {
  const entries = useAppSelector(selectHistoryEntries);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return entries;
    return entries.filter(
      (entry) => entry.title.toLowerCase().includes(trimmed) || entry.summary.toLowerCase().includes(trimmed),
    );
  }, [entries, query]);

  return { query, setQuery, results };
}
