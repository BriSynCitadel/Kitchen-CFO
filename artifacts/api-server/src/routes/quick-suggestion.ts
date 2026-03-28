import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { profilesTable, inventoryTable, foodLogsTable } from "@workspace/db/schema";
import { desc, sql } from "drizzle-orm";
import { generateText } from "../lib/gemini";

const router: IRouter = Router();

router.post("/quick-suggestion", async (req, res) => {
  try {
    const [profile, inventory, todayLogs] = await Promise.all([
      db.select().from(profilesTable).limit(1),
      db.select().from(inventoryTable).orderBy(desc(inventoryTable.addedAt)),
      db
        .select()
        .from(foodLogsTable)
        .where(sql`${foodLogsTable.loggedAt} >= CURRENT_DATE`)
        .orderBy(desc(foodLogsTable.loggedAt)),
    ]);

    const p = profile[0] ?? null;

    const labValues = p?.labValues as Record<string, number> | null | undefined;
    const labSummary = labValues
      ? Object.entries(labValues)
          .filter(([, v]) => v != null)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")
      : null;

    const todayFoods =
      todayLogs.length > 0
        ? todayLogs.map((l) => {
            const nutrients = l.nutrients as Record<string, unknown> | null;
            const cal = nutrients?.calories;
            return cal ? `${l.foodName} (~${cal} kcal)` : l.foodName;
          }).join(", ")
        : null;

    const kitchenItems =
      inventory.length > 0
        ? inventory.map((i) => i.name).join(", ")
        : null;

    const healthGoals = p?.healthGoals?.length
      ? p.healthGoals.join(", ")
      : null;

    const symptoms = p?.symptoms?.length
      ? p.symptoms.join(", ")
      : null;

    const dietaryPrefs = p?.dietaryPreferences?.length
      ? p.dietaryPreferences.join(", ")
      : null;

    const prompt = `You are a personal functional-medicine nutritionist. Your job is to suggest ONE specific meal or food combination for the user to eat right now — synthesizing exactly what they ate today, what's in their kitchen, and what their bloodwork shows they're missing.

TODAY'S FOOD LOG:
${todayFoods ?? "Nothing logged yet today"}

KITCHEN INVENTORY (what they have right now):
${kitchenItems ?? "No items logged in inventory"}

LAB VALUES:
${labSummary ?? "No lab values on file"}

HEALTH GOALS: ${healthGoals ?? "Not specified"}
SYMPTOMS: ${symptoms ?? "None reported"}
DIETARY PREFERENCES / RESTRICTIONS: ${dietaryPrefs ?? "None specified"}

RULES:
1. Prioritize ingredients they actually have in their kitchen inventory.
2. If they have out-of-range lab values, pick a meal that directly addresses the most impactful deficiency.
3. Consider what they already ate today — avoid redundancy, fill nutritional gaps.
4. Be specific: name an actual meal (e.g. "Sautéed Spinach & Eggs with Sardines"), not a vague category.
5. The description must be one sentence, max 20 words, explaining why this meal is right for them right now.
6. If a lab marker is being targeted, include labMarker (human-readable, e.g. "Vitamin D"), userValue (number), and optimalRange (string).

Return ONLY valid JSON with no markdown:
{
  "title": "Specific Meal Name",
  "description": "One sentence, max 20 words, why this is perfect for them right now.",
  "labMarker": "Vitamin D" | null,
  "userValue": 18 | null,
  "optimalRange": "≥50 ng/mL" | null
}`;

    try {
      const raw = await generateText(prompt);

      let parsed: {
        title: string;
        description: string;
        labMarker?: string | null;
        userValue?: number | null;
        optimalRange?: string | null;
      };

      try {
        parsed = JSON.parse(raw);
      } catch {
        res.status(500).json({ error: "parse_failed", message: "AI returned unparseable response" });
        return;
      }

      if (!parsed.title || !parsed.description) {
        res.status(500).json({ error: "invalid_response", message: "AI response missing required fields" });
        return;
      }

      res.json({
        title: parsed.title,
        description: parsed.description,
        labMarker: parsed.labMarker ?? null,
        userValue: parsed.userValue ?? null,
        optimalRange: parsed.optimalRange ?? null,
      });
    } catch (geminiErr: unknown) {
      const message = geminiErr instanceof Error ? geminiErr.message : "Unknown error";
      if (message.includes("No Gemini API key")) {
        res.status(400).json({ error: "no_api_key", message });
        return;
      }
      throw geminiErr;
    }
  } catch (err) {
    req.log.error({ err }, "Failed to generate quick suggestion");
    res.status(500).json({ error: "generation_failed", message: "Failed to generate suggestion" });
  }
});

export default router;
