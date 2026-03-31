import { Router, type IRouter, type Request } from "express";
import { analyzeImage } from "../lib/gemini";

const router: IRouter = Router();

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

const LAB_EXTRACTION_PROMPT = `You are a medical lab report parser. Examine this document carefully and extract ONLY lab test results that are actually present.

Extract values for these specific markers if and only if they appear in the document:
- vitaminD: Vitamin D / 25-OH Vitamin D (ng/mL)
- vitaminB12: Vitamin B12 / Cobalamin (pg/mL)
- iron: Serum Iron (mcg/dL)
- ferritin: Ferritin (ng/mL)
- crp: C-Reactive Protein / CRP (mg/L)
- glucose: Fasting Glucose / Blood Sugar (mg/dL)
- totalCholesterol: Total Cholesterol (mg/dL)
- ldl: LDL Cholesterol (mg/dL)
- hdl: HDL Cholesterol (mg/dL)
- magnesium: Magnesium / Serum Magnesium (mg/dL)
- zinc: Zinc / Serum Zinc (mcg/dL)
- tsh: TSH / Thyroid Stimulating Hormone (mIU/L)
- folate: Folate / Folic Acid (ng/mL)
- uricAcid: Uric Acid (mg/dL)
- potassium: Potassium (mEq/L or mmol/L)
- freeT4: Free T4 / Free Thyroxine (ng/dL)
- freeT3: Free T3 / Free Triiodothyronine (pg/mL)

CRITICAL RULES:
1. Only include a key if the value is explicitly shown in the document.
2. If a marker is NOT found in the document, omit it entirely (do not include it as null or 0).
3. Never guess or estimate values.
4. Return numeric values only — no units, no reference ranges, just the number.
5. If units differ from the expected unit listed above, convert to the listed unit before returning.

Return a JSON object with ONLY the keys found, like:
{
  "vitaminD": 32.5,
  "ferritin": 18,
  "tsh": 2.1
}

If no lab markers are found at all, return an empty object: {}`;

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
    res.status(400).json({ error: "validation_error", message: "mimeType must be one of: image/jpeg, image/png, image/webp, application/pdf" });
    return;
  }

  const fileBase64 = body.fileBase64;
  const mimeType = body.mimeType;
  const userId = getUserId(req);

  req.log.info({ userId, mimeType }, "Lab import request received");

  try {
    const raw = await analyzeImage(fileBase64, mimeType, LAB_EXTRACTION_PROMPT);

    let extracted: Record<string, number> = {};
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const validKeys = new Set([
        "vitaminD", "vitaminB12", "iron", "ferritin", "crp", "glucose",
        "totalCholesterol", "ldl", "hdl", "magnesium", "zinc", "tsh",
        "folate", "uricAcid", "potassium", "freeT4", "freeT3",
      ]);
      for (const [key, value] of Object.entries(parsed)) {
        if (validKeys.has(key) && typeof value === "number" && isFinite(value)) {
          extracted[key] = value;
        }
      }
    } catch {
      req.log.warn("Failed to parse Gemini lab extraction response");
    }

    res.json({ labValues: extracted, found: Object.keys(extracted).length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lab import failed";
    if (message.includes("No Gemini API key")) {
      res.status(400).json({ error: "no_api_key", message });
      return;
    }
    req.log.error({ err }, "Lab import error");
    res.status(500).json({ error: "import_failed", message });
  }
});

export default router;
