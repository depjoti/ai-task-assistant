import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { makeStore } from "@/lib/redux/store";
import { useChatStream } from "./useChatStream";

const { streamChatMock } = vi.hoisted(() => ({ streamChatMock: vi.fn() }));

vi.mock("../api/streamChat", () => ({
  streamChat: streamChatMock,
}));

function renderUseChatStream() {
  const store = makeStore();
  const wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>;
  return renderHook(() => useChatStream(), { wrapper });
}

describe("useChatStream", () => {
  beforeEach(() => {
    streamChatMock.mockReset();
  });

  it("streams deltas into the assistant message and returns to idle", async () => {
    streamChatMock.mockImplementation(async (_req, onDelta: (delta: string) => void) => {
      onDelta("Hel");
      onDelta("lo");
    });

    const { result } = renderUseChatStream();

    await act(async () => {
      await result.current.sendMessage("hi there");
    });

    expect(result.current.messages).toEqual([
      { id: expect.any(String), role: "user", content: "hi there" },
      { id: expect.any(String), role: "assistant", content: "Hello" },
    ]);
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
  });

  it("sets an error and keeps the partial assistant message on failure", async () => {
    streamChatMock.mockImplementation(async (_req, onDelta: (delta: string) => void) => {
      onDelta("partial");
      throw new Error("network down");
    });

    const { result } = renderUseChatStream();

    await act(async () => {
      await result.current.sendMessage("hi there");
    });

    expect(result.current.status).toBe("error");
    expect(result.current.error).toBe("network down");
    expect(result.current.messages[1]).toMatchObject({ role: "assistant", content: "partial" });
  });

  it("treats an aborted stream as a clean stop, not an error", async () => {
    streamChatMock.mockImplementation(async () => {
      throw new DOMException("aborted", "AbortError");
    });

    const { result } = renderUseChatStream();

    await act(async () => {
      await result.current.sendMessage("hi there");
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
  });

  it("ignores empty or whitespace-only input", async () => {
    const { result } = renderUseChatStream();

    await act(async () => {
      await result.current.sendMessage("   ");
    });

    expect(streamChatMock).not.toHaveBeenCalled();
    expect(result.current.messages).toHaveLength(0);
  });

  it("ignores a new send while a stream is already in progress", async () => {
    let resolveFirst: () => void = () => {};
    streamChatMock.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveFirst = resolve;
        }),
    );

    const { result } = renderUseChatStream();

    let firstSend: Promise<void>;
    act(() => {
      firstSend = result.current.sendMessage("first");
    });

    await waitFor(() => expect(result.current.status).toBe("streaming"));

    await act(async () => {
      await result.current.sendMessage("second");
    });

    expect(streamChatMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveFirst();
      await firstSend;
    });
  });

  it("updates the system prompt", () => {
    const { result } = renderUseChatStream();

    act(() => {
      result.current.updateSystemPrompt("Be terse.");
    });

    expect(result.current.systemPrompt).toBe("Be terse.");
  });
});
