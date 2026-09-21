"use client";

import { nanoid } from "@reduxjs/toolkit";
import { useCallback, useRef } from "react";

import { useRecordHistoryEntry } from "@/features/search/hooks/useRecordHistoryEntry";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { streamChat } from "../api/streamChat";
import {
  assistantMessageChunkAppended,
  assistantMessageStarted,
  selectChatError,
  selectChatMessages,
  selectChatStatus,
  selectChatSystemPrompt,
  streamCompleted,
  streamFailed,
  systemPromptChanged,
  userMessageSent,
} from "../chatSlice";

export function useChatStream() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectChatMessages);
  const systemPrompt = useAppSelector(selectChatSystemPrompt);
  const status = useAppSelector(selectChatStatus);
  const error = useAppSelector(selectChatError);
  const abortRef = useRef<AbortController | null>(null);
  const recordHistoryEntry = useRecordHistoryEntry();

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || status === "streaming") return;

      const userId = nanoid();
      dispatch(userMessageSent({ id: userId, content: trimmed }));

      const history = [...messages, { role: "user" as const, content: trimmed }].map(
        ({ role, content: messageContent }) => ({ role, content: messageContent }),
      );

      const assistantId = nanoid();
      dispatch(assistantMessageStarted({ id: assistantId }));

      const controller = new AbortController();
      abortRef.current = controller;

      let fullResponse = "";

      try {
        await streamChat(
          { messages: history, systemPrompt },
          (delta) => {
            fullResponse += delta;
            dispatch(assistantMessageChunkAppended({ id: assistantId, delta }));
          },
          controller.signal,
        );
        dispatch(streamCompleted());
        recordHistoryEntry("chat", trimmed.slice(0, 80), fullResponse);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          dispatch(streamCompleted());
          return;
        }
        dispatch(streamFailed(err instanceof Error ? err.message : "Something went wrong"));
      } finally {
        abortRef.current = null;
      }
    },
    [dispatch, messages, status, systemPrompt, recordHistoryEntry],
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const updateSystemPrompt = useCallback(
    (value: string) => dispatch(systemPromptChanged(value)),
    [dispatch],
  );

  return { messages, systemPrompt, status, error, sendMessage, stopStreaming, updateSystemPrompt };
}
