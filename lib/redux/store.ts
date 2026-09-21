import { combineSlices, configureStore } from "@reduxjs/toolkit";

// Feature slices are added here as they're built (e.g. `.inject(chatSlice)`
// or combined directly) — this file stays a thin assembly point, not a
// dumping ground for feature state.
const rootReducer = combineSlices();

export type RootState = ReturnType<typeof rootReducer>;

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
