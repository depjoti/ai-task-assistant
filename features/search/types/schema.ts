import { z } from "zod";

export const historyEntryTypeSchema = z.enum(["chat", "document_qa", "agent_task"]);
export type HistoryEntryType = z.infer<typeof historyEntryTypeSchema>;

export const historyEntrySchema = z.object({
  id: z.string(),
  type: historyEntryTypeSchema,
  title: z.string(),
  summary: z.string(),
  timestamp: z.number(),
});
export type HistoryEntry = z.infer<typeof historyEntrySchema>;
