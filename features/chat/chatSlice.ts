import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@/lib/redux/store";
import type { ChatMessage } from "./types/schema";

export type ChatStatus = "idle" | "streaming" | "error";

interface ChatState {
  messages: ChatMessage[];
  systemPrompt: string;
  status: ChatStatus;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  systemPrompt: "You are a helpful assistant.",
  status: "idle",
  error: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    systemPromptChanged(state, action: PayloadAction<string>) {
      state.systemPrompt = action.payload;
    },
    userMessageSent(state, action: PayloadAction<{ id: string; content: string }>) {
      state.messages.push({ id: action.payload.id, role: "user", content: action.payload.content });
      state.error = null;
    },
    assistantMessageStarted(state, action: PayloadAction<{ id: string }>) {
      state.messages.push({ id: action.payload.id, role: "assistant", content: "" });
      state.status = "streaming";
    },
    assistantMessageChunkAppended(state, action: PayloadAction<{ id: string; delta: string }>) {
      const message = state.messages.find((item) => item.id === action.payload.id);
      if (message) message.content += action.payload.delta;
    },
    streamCompleted(state) {
      state.status = "idle";
    },
    streamFailed(state, action: PayloadAction<string>) {
      state.status = "error";
      state.error = action.payload;

      const last = state.messages[state.messages.length - 1];
      if (last?.role === "assistant" && last.content === "") {
        state.messages.pop();
      }
    },
  },
});

export const {
  systemPromptChanged,
  userMessageSent,
  assistantMessageStarted,
  assistantMessageChunkAppended,
  streamCompleted,
  streamFailed,
} = chatSlice.actions;

export const selectChatMessages = (state: RootState) => state.chat.messages;
export const selectChatSystemPrompt = (state: RootState) => state.chat.systemPrompt;
export const selectChatStatus = (state: RootState) => state.chat.status;
export const selectChatError = (state: RootState) => state.chat.error;
