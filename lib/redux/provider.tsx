"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { loadHistoryFromStorage } from "@/features/search/api/historyStorage";
import { entriesLoaded } from "@/features/search/historySlice";
import { makeStore } from "./store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    store.dispatch(entriesLoaded(loadHistoryFromStorage()));
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
