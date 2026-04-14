import { GoogleGenAI } from "@google/genai";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db/schema";

async function getGeminiApiKey(overrideKey?: string): Promise<string> {
  if (overrideKey) return overrideKey;

  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

  const [settings] = await db.select().from(settingsTable).limit(1);
  if (settings?.geminiApiKey) return settings.geminiApiKey;

  throw new Error(
    "No Gemini API key configured. Please add your GEMINI_API_KEY in Settings.",
  );
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export function isOverloadedError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return (
    msg.includes("503") ||
    msg.includes("overloaded") ||
    msg.includes("high demand") ||
    msg.includes("unavailable") ||
    msg.includes("service unavailable") ||
    msg.includes("resource_exhausted") ||
    msg.includes("too many requests") ||
    msg.includes("rate limit")
  );
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (isOverloadedError(err) && attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        lastErr = err;
      } else {
        throw err;
      }
    }
  }
  throw lastErr;
}

export async function analyzeImage(
  imageBase64: string,
  mimeType: string,
  prompt: string,
  overrideKey?: string,
): Promise<string> {
  const apiKey = await getGeminiApiKey(overrideKey);
  const ai = new GoogleGenAI({ apiKey });

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: mimeType as "image/jpeg" | "image/png" | "image/webp" | "application/pdf",
                data: imageBase64,
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    return response.text ?? "{}";
  });
}

export async function generateText(
  prompt: string,
  overrideKey?: string,
): Promise<string> {
  const apiKey = await getGeminiApiKey(overrideKey);
  const ai = new GoogleGenAI({ apiKey });

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    return response.text ?? "{}";
  });
}
