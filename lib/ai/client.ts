import OpenAI from "openai";

import { getEnv, requireEnv } from "@/lib/env";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: requireEnv("OPENAI_API_KEY"), baseURL: getEnv().OPENAI_BASE_URL });
  }
  return client;
}
