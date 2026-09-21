import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@/lib/redux/store";
import type { TaskStep, TaskStepStatus } from "./types/schema";

export type AgentTaskStatus = "idle" | "planning" | "running" | "done" | "error" | "rejected";

interface AgentTaskState {
  goal: string;
  input: string;
  steps: TaskStep[];
  status: AgentTaskStatus;
  error: string | null;
}

const initialState: AgentTaskState = {
  goal: "",
  input: "",
  steps: [],
  status: "idle",
  error: null,
};

export const agentTaskSlice = createSlice({
  name: "agentTask",
  initialState,
  reducers: {
    taskStarted(state, action: PayloadAction<{ goal: string; input: string }>) {
      state.goal = action.payload.goal;
      state.input = action.payload.input;
      state.steps = [];
      state.status = "planning";
      state.error = null;
    },
    planReceived(state, action: PayloadAction<TaskStep[]>) {
      state.steps = action.payload;
      state.status = "running";
    },
    stepStatusChanged(state, action: PayloadAction<{ id: string; status: TaskStepStatus }>) {
      const step = state.steps.find((item) => item.id === action.payload.id);
      if (step) step.status = action.payload.status;
    },
    stepCompleted(state, action: PayloadAction<{ id: string; output: string }>) {
      const step = state.steps.find((item) => item.id === action.payload.id);
      if (step) {
        step.status = "done";
        step.output = action.payload.output;
        step.error = undefined;
      }
    },
    stepFailed(state, action: PayloadAction<{ id: string; error: string }>) {
      const step = state.steps.find((item) => item.id === action.payload.id);
      if (step) {
        step.status = "failed";
        step.error = action.payload.error;
      }
    },
    approvalGranted(state, action: PayloadAction<{ id: string }>) {
      const step = state.steps.find((item) => item.id === action.payload.id);
      if (step) {
        step.approved = true;
        step.status = "pending";
      }
    },
    approvalRejected(state, action: PayloadAction<{ id: string }>) {
      const step = state.steps.find((item) => item.id === action.payload.id);
      if (step) step.status = "rejected";
      state.status = "rejected";
    },
    taskCompleted(state) {
      state.status = "done";
    },
    taskFailed(state, action: PayloadAction<string>) {
      state.status = "error";
      state.error = action.payload;
    },
  },
});

export const {
  taskStarted,
  planReceived,
  stepStatusChanged,
  stepCompleted,
  stepFailed,
  approvalGranted,
  approvalRejected,
  taskCompleted,
  taskFailed,
} = agentTaskSlice.actions;

export const selectTaskGoal = (state: RootState) => state.agentTask.goal;
export const selectTaskInput = (state: RootState) => state.agentTask.input;
export const selectTaskSteps = (state: RootState) => state.agentTask.steps;
export const selectTaskStatus = (state: RootState) => state.agentTask.status;
export const selectTaskError = (state: RootState) => state.agentTask.error;
