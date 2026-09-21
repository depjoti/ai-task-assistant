import { describe, expect, it } from "vitest";

import { makeStore } from "./store";

describe("makeStore", () => {
  it("creates an independent store instance per call", () => {
    const storeA = makeStore();
    const storeB = makeStore();

    expect(storeA).not.toBe(storeB);
    expect(storeA.getState()).toEqual(storeB.getState());
  });
});
