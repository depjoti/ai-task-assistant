import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type { PlanRequest, PlanResponse, RunStepRequest, RunStepResponse } from "../types/schema";

export const agentTasksApi = createApi({
  reducerPath: "agentTasksApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/agent-tasks" }),
  endpoints: (builder) => ({
    planTask: builder.mutation<PlanResponse, PlanRequest>({
      query: (body) => ({ url: "/plan", method: "POST", body }),
    }),
    runStep: builder.mutation<RunStepResponse, RunStepRequest>({
      query: (body) => ({ url: "/run-step", method: "POST", body }),
    }),
  }),
});

export const { usePlanTaskMutation, useRunStepMutation } = agentTasksApi;
