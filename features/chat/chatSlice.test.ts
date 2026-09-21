import { describe, expect, it } from "vitest";

import {
  assistantMessageChunkAppended,
  assistantMessageStarted,
  chatSlice,
  streamFailed,
  systemPromptChanged,
  userMessageSent,
} from "./chatSlice";

const { reducer, getInitialState } = chatSlice;

describe("chatSlice", () => {
  it("appends a user message and clears any prior error", () => {
    const state = reducer(
      { ...getInitialState(), error: "previous failure" },
      userMessageSent({ id: "1", content: "hello" }),
    );

    expect(state.messages).toEqual([{ id: "1", role: "user", content: "hello" }]);
    expect(state.error).toBeNull();
  });

  it("starts an empty assistant message and marks status as streaming", () => {
    const state = reducer(getInitialState(), assistantMessageStarted({ id: "2" }));

    expect(state.messages).toEqual([{ id: "2", role: "assistant", content: "" }]);
    expect(state.status).toBe("streaming");
  });

  it("appends chunks to the matching assistant message only", () => {
    let state = reducer(getInitialState(), userMessageSent({ id: "1", content: "hi" }));
    state = reducer(state, assistantMessageStarted({ id: "2" }));
    state = reducer(state, assistantMessageChunkAppended({ id: "2", delta: "Hel" }));
    state = reducer(state, assistantMessageChunkAppended({ id: "2", delta: "lo" }));

    expect(state.messages).toEqual([
      { id: "1", role: "user", content: "hi" },
      { id: "2", role: "assistant", content: "Hello" },
    ]);
  });

  it("records an error message and sets status to error on failure", () => {
    const state = reducer(getInitialState(), streamFailed("network down"));

    expect(state.status).toBe("error");
    expect(state.error).toBe("network down");
  });

  it("drops the empty assistant placeholder if nothing streamed before the failure", () => {
    let state = reducer(getInitialState(), userMessageSent({ id: "1", content: "hi" }));
    state = reducer(state, assistantMessageStarted({ id: "2" }));
    state = reducer(state, streamFailed("network down"));

    expect(state.messages).toEqual([{ id: "1", role: "user", content: "hi" }]);
  });

  it("keeps a partially streamed assistant message on failure", () => {
    let state = reducer(getInitialState(), userMessageSent({ id: "1", content: "hi" }));
    state = reducer(state, assistantMessageStarted({ id: "2" }));
    state = reducer(state, assistantMessageChunkAppended({ id: "2", delta: "partial" }));
    state = reducer(state, streamFailed("network down"));

    expect(state.messages).toEqual([
      { id: "1", role: "user", content: "hi" },
      { id: "2", role: "assistant", content: "partial" },
    ]);
  });

  it("updates the system prompt", () => {
    const state = reducer(getInitialState(), systemPromptChanged("Be concise."));

    expect(state.systemPrompt).toBe("Be concise.");
  });
});
