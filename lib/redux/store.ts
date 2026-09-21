import { combineSlices, configureStore } from "@reduxjs/toolkit";

import { agentTaskSlice } from "@/features/agent-tasks/agentTaskSlice";
import { agentTasksApi } from "@/features/agent-tasks/api/agentTasksApi";
import { chatSlice } from "@/features/chat/chatSlice";
import { documentsApi } from "@/features/documents/api/documentsApi";

// Feature slices are added here as they're built — this file stays a thin
// assembly point, not a dumping ground for feature state.
const rootReducer = combineSlices(chatSlice, agentTaskSlice, documentsApi, agentTasksApi);

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(documentsApi.middleware, agentTasksApi.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
