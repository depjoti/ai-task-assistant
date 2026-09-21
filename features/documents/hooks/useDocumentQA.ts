"use client";

import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { useCallback, useState } from "react";

import { useAskQuestionMutation } from "../api/documentsApi";
import { getApiErrorMessage } from "../api/errors";
import type { AskResponse } from "../types/schema";

export function useDocumentQA() {
  const [askQuestionMutation, { isLoading }] = useAskQuestionMutation();
  const [result, setResult] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      try {
        const response = await askQuestionMutation({ question: trimmed }).unwrap();
        setResult(response);
      } catch (err) {
        setError(getApiErrorMessage(err as FetchBaseQueryError | SerializedError) ?? "Something went wrong");
      }
    },
    [askQuestionMutation, isLoading],
  );

  return {
    askQuestion,
    isLoading,
    answer: result?.answer ?? null,
    sources: result?.sources ?? [],
    error,
  };
}
