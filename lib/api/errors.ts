import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

export function getApiErrorMessage(error: FetchBaseQueryError | SerializedError | undefined): string | null {
  if (!error) return null;

  if ("status" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "error" in data && typeof (data as { error?: unknown }).error === "string") {
      return (data as { error: string }).error;
    }
    return `Request failed (${error.status})`;
  }

  return error.message ?? "Something went wrong";
}
