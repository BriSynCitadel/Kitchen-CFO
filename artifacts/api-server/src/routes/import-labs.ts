import { Router, type IRouter, type Request, type Response } from "express";
import { analyzeImage } from "../lib/gemini";

const router: IRouter = Router();

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const LAB_MARKER_KEYS = [
  "vitaminD", "vitaminB12", "iron", "ferritin", "crp", "glucose",
  "totalCholesterol", "ldl", "hdl", "magnesium", "zinc", "tsh",
  "folate", "uricAcid", "potassium", "freeT4", "freeT3", "sodium",
] as const;

type LabMarkerKey = typeof LAB_MARKER_KEYS[number];
type LabResult = Record<LabMarkerKey, number | null>;

const LAB_EXTRACTION_PROMPT = `You are a medical lab report parser. Examine this document carefully and extract lab test results.

You must return a JSON object with EXACTLY these 18 keys:
vitaminD, vitaminB12, iron, ferritin, crp, glucose, totalCholesterol, ldl, hdl, magnesium, zinc, tsh, folate, uricAcid, potassium, freeT4, freeT3, sodium

For each marker:
- If the value is explicitly present in the document, return the numeric value (no units, no reference ranges).
- If the marker is NOT found in the document, return null.
- Never guess or estimate values.
- If units differ from the expected unit listed below, convert before returning.

Expected units:
- vitaminD: Vitamin D / 25-OH Vitamin D (ng/mL)
- vitaminB12: Vitamin B12 / Cobalamin (pg/mL)
- iron: Serum Iron (mcg/dL)
- ferritin: Ferritin (ng/mL)
- crp: C-Reactive Protein / CRP (mg/L)
- glucose: Fasting Glucose / Blood Sugar (mg/dL)
- totalCholesterol: Total Cholesterol (mg/dL)
- ldl: LDL Cholesterol (mg/dL)
- hdl: HDL Cholesterol (mg/dL)
- magnesium: Serum Magnesium (mg/dL)
- zinc: Serum Zinc (mcg/dL)
- tsh: TSH / Thyroid Stimulating Hormone (mIU/L)
- folate: Folate / Folic Acid (ng/mL)
- uricAcid: Uric Acid (mg/dL)
- potassium: Potassium (mEq/L or mmol/L)
- freeT4: Free T4 / Free Thyroxine (ng/dL)
- freeT3: Free T3 / Free Triiodothyronine (pg/mL)
- sodium: Serum Sodium / Sodium (mEq/L)

Return ONLY valid JSON with all 18 keys. Example (if only vitaminD and tsh were found):
{
  "vitaminD": 32.5,
  "vitaminB12": null,
  "iron": null,
  "ferritin": null,
  "crp": null,
  "glucose": null,
  "totalCholesterol": null,
  "ldl": null,
  "hdl": null,
  "magnesium": null,
  "zinc": null,
  "tsh": 2.1,
  "folate": null,
  "uricAcid": null,
  "potassium": null,
  "freeT4": null,
  "freeT3": null,
  "sodium": null
}`;

function getUserId(req: Request, res: Response): string | null {
  if (!req.user?.id) {
    res.status(401).json({ error: "unauthorized", message: "Authentication required" });
    return null;
  }
  return req.user.id;
}

router.post("/import-labs", async (req, res) => {
  const body = req.body as { fileBase64?: unknown; mimeType?: unknown };

  if (!body.fileBase64 || typeof body.fileBase64 !== "string" || body.fileBase64.trim() === "") {
    res.status(400).json({ error: "validation_error", message: "fileBase64 is required" });
    return;
  }
  if (!body.mimeType || typeof body.mimeType !== "string" || !ALLOWED_MIME_TYPES.has(body.mimeType)) {
    res.status(400).json({
      error: "validation_error",
      message: "mimeType must be one of: image/jpeg, image/png, image/webp, application/pdf",
    });
    return;
  }

  const fileBase64 = body.fileBase64;
  const mimeType = body.mimeType;
  const userId = getUserId(req, res);
  if (!userId) return;

  req.log.info({ userId, mimeType }, "Lab import request received");

  // Enforce a server-side file size limit (base64 of a 15MB file ≈ 20MB string)
  const MAX_BASE64_BYTES = 20 * 1024 * 1024;
  if (fileBase64.length > MAX_BASE64_BYTES) {
    res.status(413).json({
      error: "file_too_large",
      message: "The file is too large to process. Please use a PDF under 15 MB or a smaller image.",
    });
    return;
  }

  let raw: string;
  try {
    // Wrap in a 60-second timeout — multi-page PDFs can be slow
    const geminiPromise = analyzeImage(fileBase64, mimeType, LAB_EXTRACTION_PROMPT);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Lab extraction timed out. Please try a smaller or simpler document.")), 60_000)
    );
    raw = await Promise.race([geminiPromise, timeoutPromise]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lab import failed";
    if (message.includes("No Gemini API key")) {
      res.status(400).json({ error: "no_api_key", message });
      return;
    }
    req.log.error({ err }, "Gemini lab extraction error");
    res.status(500).json({
      error: "import_failed",
      message: message.includes("timed out")
        ? message
        : "The document could not be analysed. Please ensure it is a clear, readable lab report and try again.",
    });
    return;
  }

  // Strip markdown code fences — Gemini occasionally wraps JSON in ```json ... ``` blocks
  const stripped = raw.replace(/^```(?:json)?\s*\n?([\s\S]*?)\n?```\s*$/s, "$1").trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(stripped) as Record<string, unknown>;
  } catch {
    req.log.error({ raw }, "Failed to parse Gemini lab extraction response as JSON");
    res.status(502).json({
      error: "parse_failed",
      message: "Could not read the lab results from this document. Please try a clearer image or PDF, or enter your values manually.",
    });
    return;
  }

  const labValues: LabResult = {} as LabResult;
  let found = 0;

  for (const key of LAB_MARKER_KEYS) {
    const value = parsed[key];
    if (value !== null && typeof value === "number" && isFinite(value)) {
      labValues[key] = value;
      found++;
    } else {
      labValues[key] = null;
    }
  }

  res.json({ labValues, found });
});

export default router;
