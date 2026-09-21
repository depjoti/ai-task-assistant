import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  // Lets the OpenAI SDK point at any OpenAI-compatible endpoint (e.g. Groq's
  // free tier) instead of api.openai.com, without swapping SDKs.
  OPENAI_BASE_URL: z.string().url().optional(),
  OPENAI_MODEL: z.string().optional(),
});

let cached: z.infer<typeof envSchema> | null = null;

export function getEnv() {
  if (!cached) {
    cached = envSchema.parse({
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
      OPENAI_MODEL: process.env.OPENAI_MODEL,
    });
  }
  return cached;
}
