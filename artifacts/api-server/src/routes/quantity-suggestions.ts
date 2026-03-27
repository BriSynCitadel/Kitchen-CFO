import { Router, type IRouter } from "express";
import { generateText } from "../lib/gemini";

const router: IRouter = Router();

router.post("/quantity-suggestions", async (req, res) => {
  const { itemName } = req.body ?? {};

  if (typeof itemName !== "string" || itemName.trim().length < 2) {
    res.status(400).json({ error: "validation_error", message: "itemName must be a non-empty string" });
    return;
  }

  try {
    const prompt = `Return a JSON array of exactly 3 to 4 common US or metric quantity formats for "${itemName.trim()}" as a grocery/pantry item. Be short and practical (e.g. "1 lb", "12 oz", "1 bunch", "2 cups"). Return ONLY the raw JSON array with no markdown, no backticks, no explanation. Example: ["1 lb","16 oz","2 cups","1 bunch"]`;

    const raw = await generateText(prompt);

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      res.json({ suggestions: [] });
      return;
    }

    // Accept a bare array or an object whose first array-valued key contains the suggestions
    let candidates: unknown[] = [];
    if (Array.isArray(parsed)) {
      candidates = parsed;
    } else if (parsed !== null && typeof parsed === "object") {
      const values = Object.values(parsed as Record<string, unknown>);
      const firstArray = values.find((v) => Array.isArray(v));
      if (Array.isArray(firstArray)) candidates = firstArray;
    }

    const suggestions = candidates
      .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
      .slice(0, 4);

    res.json({ suggestions });
  } catch (err) {
    req.log.warn({ err }, "Quantity suggestions unavailable");
    res.json({ suggestions: [] });
  }
});

export default router;
