import { z } from "zod";

export const chatRoleSchema = z.enum(["user", "assistant"]);
export type ChatRole = z.infer<typeof chatRoleSchema>;

export const chatMessageSchema = z.object({
  id: z.string(),
  role: chatRoleSchema,
  content: z.string(),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: chatRoleSchema,
        content: z.string().min(1),
      }),
    )
    .min(1),
  systemPrompt: z.string().optional(),
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;
