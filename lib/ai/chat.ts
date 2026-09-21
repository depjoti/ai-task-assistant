import { getEnv } from "@/lib/env";
import { getOpenAIClient } from "./client";

interface ChatCompletionArgs {
  messages: { role: "user" | "assistant"; content: string }[];
  systemPrompt?: string;
  jsonMode?: boolean;
}

const DEFAULT_CHAT_MODEL = "gpt-4o-mini";

function buildMessages({ messages, systemPrompt }: ChatCompletionArgs) {
  return [
    ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
    ...messages,
  ];
}

export async function streamChatCompletion(args: ChatCompletionArgs) {
  const client = getOpenAIClient();

  return client.chat.completions.create({
    model: getEnv().OPENAI_MODEL ?? DEFAULT_CHAT_MODEL,
    stream: true,
    messages: buildMessages(args),
  });
}

export async function completeChat(args: ChatCompletionArgs): Promise<string> {
  const client = getOpenAIClient();

  const completion = await client.chat.completions.create({
    model: getEnv().OPENAI_MODEL ?? DEFAULT_CHAT_MODEL,
    stream: false,
    response_format: args.jsonMode ? { type: "json_object" } : undefined,
    messages: buildMessages(args),
  });

  return completion.choices[0]?.message?.content ?? "";
}
