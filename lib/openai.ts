import OpenAI from "openai";

const globalForOpenAI = globalThis as unknown as {
  openai: OpenAI | undefined;
};

export const openai =
  globalForOpenAI.openai ??
  new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

if (process.env.NODE_ENV !== "production") {
  globalForOpenAI.openai = openai;
}

export const AI_MODELS = {
  vision: "gpt-4o",
  text: "gpt-4o-mini",
  embedding: "text-embedding-3-small",
  transcription: "whisper-1",
  tts: "tts-1",
} as const;
