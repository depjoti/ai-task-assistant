import type { HistoryEntry } from "../types/schema";

const STORAGE_KEY = "agent-history";

export function loadHistoryFromStorage(): HistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistoryToStorage(entries: HistoryEntry[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // localStorage can throw (quota exceeded, private browsing) — history
    // just won't persist across reloads in that case.
  }
}
