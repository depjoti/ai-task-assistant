"use client";

import { nanoid } from "@reduxjs/toolkit";
import { useCallback } from "react";

import { useAppDispatch, useAppStore } from "@/lib/redux/hooks";
import { saveHistoryToStorage } from "../api/historyStorage";
import { entryAdded, selectHistoryEntries } from "../historySlice";
import type { HistoryEntryType } from "../types/schema";

export function useRecordHistoryEntry() {
  const dispatch = useAppDispatch();
  const store = useAppStore();

  return useCallback(
    (type: HistoryEntryType, title: string, summary: string) => {
      dispatch(entryAdded({ id: nanoid(), type, title, summary, timestamp: Date.now() }));
      saveHistoryToStorage(selectHistoryEntries(store.getState()));
    },
    [dispatch, store],
  );
}
