import { beforeEach, describe, expect, it } from "vitest";

import { loadHistoryFromStorage, saveHistoryToStorage } from "./historyStorage";
import type { HistoryEntry } from "../types/schema";

const entry: HistoryEntry = { id: "1", type: "chat", title: "hi", summary: "hello", timestamp: 1000 };

describe("historyStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns an empty array when nothing is stored", () => {
    expect(loadHistoryFromStorage()).toEqual([]);
  });

  it("round-trips entries through localStorage", () => {
    saveHistoryToStorage([entry]);
    expect(loadHistoryFromStorage()).toEqual([entry]);
  });

  it("returns an empty array for corrupt JSON instead of throwing", () => {
    window.localStorage.setItem("agent-history", "{not valid json");
    expect(loadHistoryFromStorage()).toEqual([]);
  });

  it("returns an empty array when the stored value isn't an array", () => {
    window.localStorage.setItem("agent-history", JSON.stringify({ not: "an array" }));
    expect(loadHistoryFromStorage()).toEqual([]);
  });
});
