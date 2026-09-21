"use client";

import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { useCallback, useState } from "react";

import { useRecordHistoryEntry } from "@/features/search/hooks/useRecordHistoryEntry";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAskQuestionMutation } from "../api/documentsApi";
import type { AskResponse } from "../types/schema";

export function useDocumentQA() {
  const [askQuestionMutation, { isLoading }] = useAskQuestionMutation();
  const [result, setResult] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recordHistoryEntry = useRecordHistoryEntry();

  const askQuestion = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isLoading) return;

      setError(null);
      try {
        const response = await askQuestionMutation({ question: trimmed }).unwrap();
        setResult(response);
        recordHistoryEntry("document_qa", trimmed, response.answer);
      } catch (err) {
        setError(getApiErrorMessage(err as FetchBaseQueryError | SerializedError) ?? "Something went wrong");
      }
    },
    [askQuestionMutation, isLoading, recordHistoryEntry],
  );

  return {
    askQuestion,
    isLoading,
    answer: result?.answer ?? null,
    sources: result?.sources ?? [],
    error,
  };
}
