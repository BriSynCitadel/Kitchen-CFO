import { Router, type IRouter, type Request } from "express";
import { db } from "@workspace/db";
import { profilesTable, inventoryTable, groceryListsTable, type GroceryItem } from "@workspace/db/schema";
import { desc, eq } from "drizzle-orm";
import { generateText, isOverloadedError } from "../lib/gemini";

function getUserId(req: Request): string {
  return req.user?.id ?? "demo_user";
}

const WHY_BANNED_TERMS = [
  "treat",
  "cure",
  "diagnose",
  "prescribe",
  "medical advice",
  "guarantee",
  "proven to",
  "clinically proven",
];

const VALID_CATEGORIES = new Set(["whole_food", "produce", "spice", "condiment", "pantry"]);
const MAX_ITEMS = 12;
const MIN_ITEMS = 10;

function sanitizeWhy(why: unknown): string | null {
  if (typeof why !== "string" || !why.trim()) return null;
  const lower = why.toLowerCase();
  for (const term of WHY_BANNED_TERMS) {
    if (lower.includes(term)) return null;
  }
  return why;
}

function normalizeItemName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function isAlreadyOwned(itemName: string, inventoryNormalized: string[]): boolean {
  const normalized = normalizeItemName(itemName);
  if (!normalized) return false;
  return inventoryNormalized.some(
    (inv) => inv === normalized || inv.includes(normalized) || normalized.includes(inv)
  );
}

function processItems(
  rawItems: Record<string, unknown>[],
  inventoryNormalized: string[]
): GroceryItem[] {
  const processed: GroceryItem[] = rawItems
    .filter((item) => typeof item.name === "string" && item.name.trim())
    .map((item) => ({
      name: String(item.name).trim(),
      category: VALID_CATEGORIES.has(String(item.category))
        ? (String(item.category) as GroceryItem["category"])
        : "pantry",
      why: sanitizeWhy(item.why),
      targetMarker:
        typeof item.targetMarker === "string" && item.targetMarker.trim()
          ? item.targetMarker.trim()
          : null,
      alreadyOwned: isAlreadyOwned(String(item.name), inventoryNormalized),
    }));

  return processed.slice(0, MAX_ITEMS);
}

async function buildGroceryListContext(userId: string): Promise<{
  prompt: string;
  inventoryNormalized: string[];
}> {
  const [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.replitUserId, userId))
    .limit(1);

  const inventory = await db
    .select()
    .from(inventoryTable)
    .where(eq(inventoryTable.replitUserId, userId))
    .orderBy(desc(inventoryTable.addedAt));

  const inventoryNormalized = inventory.map((i) => normalizeItemName(i.name));
  const inventoryNames = inventory.map((i) => i.name.toLowerCase());
  const inventorySummary = inventoryNames.join(", ") || "Nothing logged yet";

  const profileSummary = profile
    ? {
        age: profile.age,
        gender: profile.gender,
        activityLevel: profile.activityLevel,
        dietaryPreferences: profile.dietaryPreferences,
        healthGoals: profile.healthGoals,
        allergies: profile.allergies,
        medicalConditions: profile.medicalConditions,
        symptoms: profile.symptoms,
        culturalBackground: profile.culturalBackground,
        labValues: profile.labValues,
      }
    : null;

  const prompt = `You are a functional medicine nutrition advisor. Generate a weekly grocery list for this user based on their health profile, lab results, symptoms, and kitchen inventory.

USER PROFILE:
${JSON.stringify(profileSummary, null, 2)}

CURRENT KITCHEN INVENTORY (items they already have):
${inventorySummary}

RULES:
1. LAB-FIRST PRIORITY: Items addressing out-of-range lab markers must appear first (highest priority). Reference ranges:
   - Vitamin D < 30 ng/mL → low (optimal 30–80)
   - Vitamin B12 < 300 pg/mL → low (optimal 300–900)
   - Ferritin < 20 ng/mL → low; > 200 → high
   - CRP > 3 mg/L → elevated inflammation
   - Fasting glucose > 100 mg/dL → prediabetic range
   - HbA1c > 5.7% → prediabetic (optimal < 5.7%)
   - Fasting insulin > 6 mIU/L → insulin resistance risk
   - Cortisol (morning) < 10 or > 20 mcg/dL → suboptimal
   - Folate < 2.7 ng/mL → deficient
   - Uric acid > 7.0 mg/dL → hyperuricemia risk
   - Potassium < 3.5 mEq/L → low; > 5.0 → high
   - Free T4/T3 out of range → thyroid support needed
   - Magnesium < 1.7 mg/dL → deficient
   - Zinc < 60 mcg/dL → low
   Spice-to-marker guidance: CRP elevated → turmeric, ginger, black pepper; HbA1c/insulin elevated → cinnamon, fenugreek, apple cider vinegar; cortisol elevated → ashwagandha powder, holy basil; digestive_issues → ginger, fennel seeds, cumin; poor_sleep → chamomile, passionflower tea; inflammation → turmeric, oregano, rosemary.
2. INCLUDE ALL CATEGORIES: Include a mix of whole foods (proteins, grains), produce (vegetables, fruit), and specific spices/seasonings/condiments tied to the user's markers or symptoms.
3. CULTURAL RELEVANCE: If culturalBackground is set, surface culturally appropriate foods FIRST within each category. Examples:
   - Caribbean → plantains, callaloo, scotch bonnet, coconut oil, ackee, dasheen, breadfruit, sorrel
   - West African → egusi, palm oil, uda, uziza, stockfish, bitter leaf, fufu flour, dawadawa
   - South Asian → ghee, fenugreek, curry leaves, mustard seeds, dal, tamarind, moringa
   - East Asian → miso, shiitake mushrooms, edamame, sesame oil, mirin, nori
   - Mediterranean → olive oil, za'atar, sumac, tahini, preserved lemon, pomegranate
   - Latin American → achiote, epazote, chayote, nopales, piloncillo, dried chiles
   - Ethiopian → berbere, injera teff flour, niter kibbeh, mitmita, fenugreek
   These culturally relevant items should STILL address the same underlying lab marker or symptom needs.
4. DIETARY RESTRICTIONS: Strictly respect all allergies and dietary preferences.
5. QUANTITY: Generate exactly ${MIN_ITEMS}–${MAX_ITEMS} items total, ordered from most to least relevant to the user's specific lab markers and symptoms.

Return ONLY valid JSON in this exact format:
{
  "items": [
    {
      "name": "Turmeric",
      "category": "spice",
      "why": "Your CRP came back at 4.2 mg/L, above the optimal range of below 3 mg/L. Curcumin, the active compound in turmeric, is well-supported in nutritional research for its role in modulating the body's inflammatory response.",
      "targetMarker": "CRP"
    }
  ]
}

Field rules:
- "name": Specific food, spice, or condiment name (e.g. "Wild Salmon", "Ground Turmeric", "Apple Cider Vinegar", "Callaloo").
- "category": One of "whole_food", "produce", "spice", "condiment", "pantry".
- "why": 1–2 sentences explaining the nutritional connection. Cite the user's actual lab value and unit where applicable. Use warm, educational language. NEVER use these words: treat, cure, diagnose, prescribe, medical advice, guarantee, proven to, clinically proven.
- "targetMarker": The specific lab marker name this item addresses (e.g. "CRP", "Vitamin D", "HbA1c"). Set to null if tied to a symptom or general goal rather than a specific out-of-range lab value.
- Do NOT include an "alreadyOwned" field — this is determined server-side.`;

  return { prompt, inventoryNormalized };
}

const router: IRouter = Router();

router.get("/grocery-list", async (req, res) => {
  try {
    const userId = getUserId(req);
    const [cached] = await db
      .select()
      .from(groceryListsTable)
      .where(eq(groceryListsTable.replitUserId, userId))
      .orderBy(desc(groceryListsTable.generatedAt))
      .limit(1);

    if (cached) {
      res.json({
        items: cached.items,
        generatedAt: cached.generatedAt.toISOString(),
        cached: true,
      });
      return;
    }

    res.json({ items: [], generatedAt: null, cached: false });
  } catch (err) {
    req.log.error({ err }, "Failed to get grocery list");
    res.status(500).json({ error: "fetch_failed", message: "Failed to get grocery list" });
  }
});

router.post("/grocery-list", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { prompt, inventoryNormalized } = await buildGroceryListContext(userId);

    try {
      const raw = await generateText(prompt);

      let parsed: { items?: Record<string, unknown>[] };
      try {
        parsed = JSON.parse(raw);
      } catch {
        req.log.warn({ raw: raw.slice(0, 500) }, "Gemini returned non-JSON for grocery list");
        throw new Error("Invalid JSON response from AI");
      }

      const items = processItems(parsed.items ?? [], inventoryNormalized);

      const [saved] = await db
        .insert(groceryListsTable)
        .values({ replitUserId: userId, items })
        .returning();

      res.json({
        items,
        generatedAt: saved.generatedAt.toISOString(),
        cached: false,
      });
    } catch (geminiErr: unknown) {
      const message = geminiErr instanceof Error ? geminiErr.message : "Unknown error";
      if (message.includes("No Gemini API key")) {
        res.status(400).json({ error: "no_api_key", message });
        return;
      }
      if (isOverloadedError(geminiErr)) {
        res.status(503).json({
          error: "ai_busy",
          message: "Our AI is a little busy right now — please try again in a moment",
        });
        return;
      }
      throw geminiErr;
    }
  } catch (err) {
    req.log.error({ err }, "Failed to generate grocery list");
    res.status(500).json({ error: "generation_failed", message: "Failed to generate grocery list" });
  }
});

export default router;
