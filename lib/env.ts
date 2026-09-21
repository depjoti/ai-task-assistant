import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
});

let cached: z.infer<typeof envSchema> | null = null;

export function getEnv() {
  if (!cached) {
    cached = envSchema.parse({
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    });
  }
  return cached;
}
