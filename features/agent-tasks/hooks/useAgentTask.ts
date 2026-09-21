"use client";

import type { SerializedError } from "@reduxjs/toolkit";
import { nanoid } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { useCallback } from "react";

import { useRecordHistoryEntry } from "@/features/search/hooks/useRecordHistoryEntry";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAppDispatch, useAppSelector, useAppStore } from "@/lib/redux/hooks";
import { usePlanTaskMutation, useRunStepMutation } from "../api/agentTasksApi";
import {
  approvalGranted,
  approvalRejected,
  planReceived,
  selectTaskError,
  selectTaskGoal,
  selectTaskInput,
  selectTaskSteps,
  selectTaskStatus,
  stepCompleted,
  stepFailed,
  stepStatusChanged,
  taskCompleted,
  taskFailed,
  taskStarted,
} from "../agentTaskSlice";
import type { TaskStep } from "../types/schema";

export function useAgentTask() {
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const steps = useAppSelector(selectTaskSteps);
  const status = useAppSelector(selectTaskStatus);
  const error = useAppSelector(selectTaskError);

  const [planTaskMutation] = usePlanTaskMutation();
  const [runStepMutation] = useRunStepMutation();
  const recordHistoryEntry = useRecordHistoryEntry();

  const inputForStep = useCallback(
    (index: number): string => {
      const state = store.getState();
      if (index === 0) return selectTaskInput(state);
      return selectTaskSteps(state)[index - 1]?.output ?? "";
    },
    [store],
  );

  const runFrom = useCallback(
    async (startIndex: number) => {
      const currentSteps = selectTaskSteps(store.getState());
      let lastOutput = "";

      for (let index = startIndex; index < currentSteps.length; index += 1) {
        const step = currentSteps[index];

        if (step.requiresApproval && !step.approved) {
          dispatch(stepStatusChanged({ id: step.id, status: "awaiting_approval" }));
          return;
        }

        dispatch(stepStatusChanged({ id: step.id, status: "running" }));

        try {
          const response = await runStepMutation({ kind: step.kind, input: inputForStep(index) }).unwrap();
          dispatch(stepCompleted({ id: step.id, output: response.output }));
          lastOutput = response.output;
        } catch (err) {
          dispatch(
            stepFailed({
              id: step.id,
              error: getApiErrorMessage(err as FetchBaseQueryError | SerializedError) ?? "Step failed",
            }),
          );
          return;
        }
      }

      dispatch(taskCompleted());
      recordHistoryEntry("agent_task", selectTaskGoal(store.getState()), lastOutput);
    },
    [dispatch, inputForStep, recordHistoryEntry, runStepMutation, store],
  );

  const submitTask = useCallback(
    async (goal: string, input: string) => {
      dispatch(taskStarted({ goal, input }));

      try {
        const response = await planTaskMutation({ goal }).unwrap();
        const plannedSteps: TaskStep[] = response.steps.map((step) => ({
          ...step,
          id: nanoid(),
          approved: false,
          status: "pending",
        }));
        dispatch(planReceived(plannedSteps));
        await runFrom(0);
      } catch (err) {
        dispatch(
          taskFailed(getApiErrorMessage(err as FetchBaseQueryError | SerializedError) ?? "Could not plan task"),
        );
      }
    },
    [dispatch, planTaskMutation, runFrom],
  );

  const approveStep = useCallback(
    async (id: string) => {
      dispatch(approvalGranted({ id }));
      const index = selectTaskSteps(store.getState()).findIndex((step) => step.id === id);
      if (index === -1) return;
      await runFrom(index);
    },
    [dispatch, runFrom, store],
  );

  const rejectStep = useCallback(
    (id: string) => {
      dispatch(approvalRejected({ id }));
    },
    [dispatch],
  );

  const retryStep = useCallback(
    async (id: string) => {
      const index = selectTaskSteps(store.getState()).findIndex((step) => step.id === id);
      if (index === -1) return;
      await runFrom(index);
    },
    [runFrom, store],
  );

  return { steps, status, error, submitTask, approveStep, rejectStep, retryStep };
}
