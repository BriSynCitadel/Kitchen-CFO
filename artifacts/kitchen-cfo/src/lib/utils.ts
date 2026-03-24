import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number | null | undefined, decimals = 1): string {
  if (num === null || num === undefined) return "0";
  return Number.isInteger(num) ? num.toString() : num.toFixed(decimals);
}

export async function fileToBase64(file: File): Promise<{ base64: string, mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        // Return only the base64 part, stripping the data:image/... prefix if needed
        const result = event.target.result;
        const base64 = result.split(',')[1] || result;
        resolve({ base64, mimeType: file.type });
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
