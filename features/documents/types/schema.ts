import { z } from "zod";

export const documentSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  chunkCount: z.number(),
});
export type DocumentSummary = z.infer<typeof documentSummarySchema>;

export const listDocumentsResponseSchema = z.object({
  documents: z.array(documentSummarySchema),
});
export type ListDocumentsResponse = z.infer<typeof listDocumentsResponseSchema>;

export const uploadDocumentResponseSchema = z.object({
  document: documentSummarySchema,
});
export type UploadDocumentResponse = z.infer<typeof uploadDocumentResponseSchema>;

export const askRequestSchema = z.object({
  question: z.string().min(1),
});
export type AskRequest = z.infer<typeof askRequestSchema>;

export const sourceSnippetSchema = z.object({
  documentName: z.string(),
  content: z.string(),
  score: z.number(),
});
export type SourceSnippet = z.infer<typeof sourceSnippetSchema>;

export const askResponseSchema = z.object({
  answer: z.string(),
  sources: z.array(sourceSnippetSchema),
});
export type AskResponse = z.infer<typeof askResponseSchema>;
