import { Router, type IRouter, type Request } from "express";
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
  "folate", "uricAcid", "potassium", "freeT4", "freeT3",
] as const;

type LabMarkerKey = typeof LAB_MARKER_KEYS[number];
type LabResult = Record<LabMarkerKey, number | null>;

const LAB_EXTRACTION_PROMPT = `You are a medical lab report parser. Examine this document carefully and extract lab test results.

You must return a JSON object with EXACTLY these 17 keys:
vitaminD, vitaminB12, iron, ferritin, crp, glucose, totalCholesterol, ldl, hdl, magnesium, zinc, tsh, folate, uricAcid, potassium, freeT4, freeT3

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

Return ONLY valid JSON with all 17 keys. Example (if only vitaminD and tsh were found):
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
  "freeT3": null
}`;

function getUserId(req: Request): string {
  return req.user?.id ?? "demo_user";
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
  const userId = getUserId(req);

  req.log.info({ userId, mimeType }, "Lab import request received");

  let raw: string;
  try {
    raw = await analyzeImage(fileBase64, mimeType, LAB_EXTRACTION_PROMPT);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lab import failed";
    if (message.includes("No Gemini API key")) {
      res.status(400).json({ error: "no_api_key", message });
      return;
    }
    req.log.error({ err }, "Gemini lab extraction error");
    res.status(500).json({ error: "import_failed", message });
    return;
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    req.log.error({ raw }, "Failed to parse Gemini lab extraction response as JSON");
    res.status(502).json({
      error: "parse_failed",
      message: "Could not read the lab results from this document. Please try a clearer image or PDF.",
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
