import { describe, expect, it } from "vitest";

import { entriesLoaded, entryAdded, historySlice } from "./historySlice";
import type { HistoryEntry } from "./types/schema";

const { reducer, getInitialState } = historySlice;

const entry = (overrides: Partial<HistoryEntry> = {}): HistoryEntry => ({
  id: "1",
  type: "chat",
  title: "hello",
  summary: "hi there",
  timestamp: 1000,
  ...overrides,
});

describe("historySlice", () => {
  it("starts empty", () => {
    expect(getInitialState().entries).toEqual([]);
  });

  it("replaces entries wholesale on entriesLoaded", () => {
    const loaded = [entry({ id: "1" }), entry({ id: "2" })];
    const state = reducer(getInitialState(), entriesLoaded(loaded));

    expect(state.entries).toEqual(loaded);
  });

  it("adds new entries to the front, most recent first", () => {
    let state = reducer(getInitialState(), entryAdded(entry({ id: "1" })));
    state = reducer(state, entryAdded(entry({ id: "2" })));

    expect(state.entries.map((item) => item.id)).toEqual(["2", "1"]);
  });
});
