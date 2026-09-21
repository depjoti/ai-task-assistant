import { getEnv } from "@/lib/env";
import { getOpenAIClient } from "./client";

interface StreamChatCompletionArgs {
  messages: { role: "user" | "assistant"; content: string }[];
  systemPrompt?: string;
}

const DEFAULT_CHAT_MODEL = "gpt-4o-mini";

export async function streamChatCompletion({ messages, systemPrompt }: StreamChatCompletionArgs) {
  const client = getOpenAIClient();

  return client.chat.completions.create({
    model: getEnv().OPENAI_MODEL ?? DEFAULT_CHAT_MODEL,
    stream: true,
    messages: [
      ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
      ...messages,
    ],
  });
}
