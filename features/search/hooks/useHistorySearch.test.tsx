import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";

import { makeStore } from "@/lib/redux/store";
import { entriesLoaded } from "../historySlice";
import type { HistoryEntry } from "../types/schema";
import { useHistorySearch } from "./useHistorySearch";

const entries: HistoryEntry[] = [
  { id: "1", type: "chat", title: "Weather in Paris", summary: "It's sunny today.", timestamp: 3 },
  { id: "2", type: "document_qa", title: "What is the vacation policy?", summary: "15 days per year.", timestamp: 2 },
  { id: "3", type: "agent_task", title: "Summarize the changelog", summary: "Draft email sent.", timestamp: 1 },
];

function renderWithEntries() {
  const store = makeStore();
  store.dispatch(entriesLoaded(entries));
  const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
  return renderHook(() => useHistorySearch(), { wrapper });
}

describe("useHistorySearch", () => {
  it("returns all entries when the query is empty", () => {
    const { result } = renderWithEntries();
    expect(result.current.results).toHaveLength(3);
  });

  it("matches by title, case-insensitively", () => {
    const { result } = renderWithEntries();

    act(() => result.current.setQuery("PARIS"));

    expect(result.current.results.map((entry) => entry.id)).toEqual(["1"]);
  });

  it("matches by summary content", () => {
    const { result } = renderWithEntries();

    act(() => result.current.setQuery("15 days"));

    expect(result.current.results.map((entry) => entry.id)).toEqual(["2"]);
  });

  it("returns no results when nothing matches", () => {
    const { result } = renderWithEntries();

    act(() => result.current.setQuery("nonexistent"));

    expect(result.current.results).toHaveLength(0);
  });
});
