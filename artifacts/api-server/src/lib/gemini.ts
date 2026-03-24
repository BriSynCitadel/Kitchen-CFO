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

export async function analyzeImage(
  imageBase64: string,
  mimeType: string,
  prompt: string,
  overrideKey?: string,
): Promise<string> {
  const apiKey = await getGeminiApiKey(overrideKey);
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: mimeType as "image/jpeg" | "image/png" | "image/webp",
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
}

export async function generateText(
  prompt: string,
  overrideKey?: string,
): Promise<string> {
  const apiKey = await getGeminiApiKey(overrideKey);
  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      maxOutputTokens: 8192,
    },
  });

  return response.text ?? "{}";
}
