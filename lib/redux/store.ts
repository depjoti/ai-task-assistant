import { combineSlices, configureStore } from "@reduxjs/toolkit";

import { chatSlice } from "@/features/chat/chatSlice";
import { documentsApi } from "@/features/documents/api/documentsApi";

// Feature slices are added here as they're built — this file stays a thin
// assembly point, not a dumping ground for feature state.
const rootReducer = combineSlices(chatSlice, documentsApi);

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(documentsApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
