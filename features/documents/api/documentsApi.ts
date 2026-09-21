import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  AskRequest,
  AskResponse,
  DocumentSummary,
  ListDocumentsResponse,
  UploadDocumentResponse,
} from "../types/schema";

export const documentsApi = createApi({
  reducerPath: "documentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/documents" }),
  tagTypes: ["Document"],
  endpoints: (builder) => ({
    listDocuments: builder.query<DocumentSummary[], void>({
      query: () => "",
      transformResponse: (response: ListDocumentsResponse) => response.documents,
      providesTags: ["Document"],
    }),
    uploadDocument: builder.mutation<DocumentSummary, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return { url: "/upload", method: "POST", body: formData };
      },
      transformResponse: (response: UploadDocumentResponse) => response.document,
      invalidatesTags: ["Document"],
    }),
    askQuestion: builder.mutation<AskResponse, AskRequest>({
      query: (body) => ({ url: "/ask", method: "POST", body }),
    }),
    deleteDocument: builder.mutation<void, void>({
      query: () => ({ url: "", method: "DELETE" }),
      invalidatesTags: ["Document"],
    }),
  }),
});

export const {
  useListDocumentsQuery,
  useUploadDocumentMutation,
  useAskQuestionMutation,
  useDeleteDocumentMutation,
} = documentsApi;
