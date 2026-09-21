import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@/lib/redux/store";
import type { HistoryEntry } from "./types/schema";

interface HistoryState {
  entries: HistoryEntry[];
}

const initialState: HistoryState = { entries: [] };

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    entriesLoaded(state, action: PayloadAction<HistoryEntry[]>) {
      state.entries = action.payload;
    },
    entryAdded(state, action: PayloadAction<HistoryEntry>) {
      state.entries.unshift(action.payload);
    },
  },
});

export const { entriesLoaded, entryAdded } = historySlice.actions;

export const selectHistoryEntries = (state: RootState) => state.history.entries;
