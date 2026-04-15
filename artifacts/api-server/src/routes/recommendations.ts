import { Router, type IRouter, type Request } from "express";
import { db } from "@workspace/db";
import { profilesTable, inventoryTable, foodLogsTable, recommendationsTable } from "@workspace/db/schema";
import { desc, sql, eq, and } from "drizzle-orm";
import { generateText, isOverloadedError } from "../lib/gemini";

function getUserId(req: Request): string {
  return req.user?.id ?? "demo_user";
}

const INSIGHT_BANNED_TERMS = [
  "treat",
  "cure",
  "diagnose",
  "prescribe",
  "medical advice",
  "guarantee",
  "proven to",
  "clinically proven",
];

function sanitizeInsight(insight: unknown): string | null {
  if (typeof insight !== "string" || !insight.trim()) return null;
  const lower = insight.toLowerCase();
  for (const term of INSIGHT_BANNED_TERMS) {
    if (lower.includes(term)) return null;
  }
  return insight;
}

type RawRecommendation = Record<string, unknown>;

function sanitizeItems(items: RawRecommendation[]): RawRecommendation[] {
  return items.map((item) => ({
    ...item,
    insight: sanitizeInsight(item.insight),
  }));
}

const router: IRouter = Router();

async function buildRecommendationPrompt(userId: string): Promise<{
  prompt: string;
  profileComplete: boolean;
  inventoryItemCount: number;
  recentLogCount: number;
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
  const recentLogs = await db
    .select()
    .from(foodLogsTable)
    .where(and(eq(foodLogsTable.replitUserId, userId), sql`${foodLogsTable.loggedAt} >= NOW() - INTERVAL '3 days'`))
    .orderBy(desc(foodLogsTable.loggedAt))
    .limit(20);

  const profileSummary = profile
    ? {
        age: profile.age,
        gender: profile.gender,
        bloodType: profile.bloodType,
        activityLevel: profile.activityLevel,
        dietaryPreferences: profile.dietaryPreferences,
        healthGoals: profile.healthGoals,
        allergies: profile.allergies,
        medicalConditions: profile.medicalConditions,
        symptoms: profile.symptoms,
        culturalBackground: profile.culturalBackground,
        dailyCalorieTarget: profile.dailyCalorieTarget,
        labValues: profile.labValues,
      }
    : null;

  const inventorySummary = inventory
    .map((i) => `${i.name} (${i.category}${i.quantity ? ", " + i.quantity : ""})`)
    .join(", ");
  const recentFoods = recentLogs.map((l) => l.foodName).join(", ");

  const prompt = `You are a functional medicine nutrition advisor specializing in bioindividual nutrition. Based on the following user data, generate 6 highly personalized food and nutrient recommendations.

USER PROFILE:
${JSON.stringify(profileSummary, null, 2)}

KITCHEN INVENTORY (items they have):
${inventorySummary || "No items logged yet"}

RECENTLY EATEN (last 3 days):
${recentFoods || "No recent logs"}

IMPORTANT ANALYSIS RULES:
1. LAB VALUES: If labValues are present, identify which markers may be suboptimal based on standard reference ranges below. For each out-of-range marker, prioritize foods that are well-supported by nutritional research for that marker. Name the specific marker in the "reason" field.
   Reference ranges:
   - Vitamin D < 30 ng/mL → insufficient (optimal 30–80)
   - Vitamin B12 < 300 pg/mL → low (optimal 300–900)
   - Ferritin < 20 ng/mL → low; > 200 ng/mL → high
   - CRP > 3 mg/L → elevated inflammation
   - Fasting glucose > 100 mg/dL → prediabetic range
   - HbA1c > 5.7% → prediabetic; > 6.5% → diabetic (optimal < 5.7%)
   - Fasting insulin > 6 mIU/L → insulin resistance risk (optimal 2–6)
   - Cortisol (morning) < 10 mcg/dL → low; > 20 mcg/dL → elevated (optimal 10–20)
   - Folate < 2.7 ng/mL → deficient (optimal 2.7–17)
   - Uric acid > 7.0 mg/dL → hyperuricemia risk (optimal 2.4–7.0)
   - Potassium < 3.5 mEq/L → hypokalemia; > 5.0 → hyperkalemia (optimal 3.5–5.0)
   - Free T4 < 0.8 ng/dL → low thyroid; > 1.8 → elevated (optimal 0.8–1.8)
   - Free T3 < 2.3 pg/mL → low thyroid; > 4.2 → elevated (optimal 2.3–4.2)
   - TSH > 4.0 mIU/L → hypothyroid risk; < 0.4 → hyperthyroid risk
   - Magnesium < 1.7 mg/dL → deficient (optimal 1.7–2.2)
   Food-to-marker guidance: HbA1c/insulin elevated → reduce refined carbs, add cinnamon, legumes, vinegar, fiber; cortisol elevated → ashwagandha-containing foods, magnesium-rich foods, dark chocolate; cortisol low → regular balanced meals, complex carbs, adequate protein; folate low → leafy greens, lentils, fortified foods; uric acid high → reduce red meat, alcohol, fructose; add cherries, coffee, low-fat dairy; potassium low → bananas, sweet potato, avocado, spinach; thyroid markers low → selenium-rich foods (Brazil nuts, sardines), iodine (seaweed, eggs), zinc.
2. SYMPTOMS: If symptoms are listed (fatigue, brain_fog, inflammation, digestive_issues, poor_sleep, hormonal_imbalance), prioritize foods and nutrients with evidence-based support for those symptoms. For example: fatigue → iron, B12, CoQ10-rich foods; brain_fog → omega-3, B vitamins, antioxidants; inflammation → turmeric, omega-3, leafy greens; digestive_issues → fermented foods, fiber, prebiotics; poor_sleep → magnesium, tryptophan, complex carbs; hormonal_imbalance → cruciferous vegetables, flaxseed, zinc-rich foods.
3. DIETARY PREFERENCES & ALLERGIES: Strictly respect dietary restrictions and allergies.
4. CULTURAL BACKGROUND: If culturalBackground is set, prioritize foods, dishes, and ingredients that are familiar and traditional within that culinary culture. For example: West African → fufu, egusi, jollof rice, leafy greens; South Asian → dal, turmeric milk, roti, lentils; Mediterranean → olive oil, legumes, grilled fish; Latin American → beans, plantains, achiote, corn. Always frame recommendations using culturally relevant ingredients that also address the user's nutritional deficiencies.
5. KITCHEN FIRST: Prioritize recipes using ingredients already in their inventory.
6. VARIETY: Include a mix of meals, snacks, specific ingredients, and nutrient tips.

Generate exactly 6 recommendations. Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "1-2 sentence description of the food/meal",
      "reason": "Specific reason referencing their lab value, symptom, or health goal — be precise and personal",
      "category": "meal|snack|ingredient|nutrient_tip",
      "ingredients": ["ingredient1", "ingredient2"],
      "priority": "high|medium|low",
      "cookTime": "20 min",
      "difficulty": "Easy",
      "targetMarker": "Vitamin D",
      "userValue": 18,
      "optimalRange": "≥50 ng/mL",
      "insight": "Your Vitamin D came back at 18 ng/mL, which sits below the 30–80 ng/mL optimal range. Vitamin D plays a central role in immune signalling, muscle function, and mood regulation — when levels run low, fatigue and reduced immune resilience are commonly reported. Foods that are naturally rich in Vitamin D include fatty fish like salmon and mackerel, egg yolks, beef liver, and fortified dairy or plant-based milks."
    }
  ]
}

Field rules:
- "cookTime": Realistic preparation + cook time for the meal (e.g., "10 min", "25 min", "1 hr"). For ingredient tips or nutrient tips, use "No cooking".
- "difficulty": One of "Easy", "Medium", or "Advanced" based on cooking skill required.
- "targetMarker": Include ONLY when this recommendation primarily addresses a specific lab marker that is outside the normal range. Use the human-readable name (e.g., "Vitamin D", "Vitamin B12", "CRP", "Ferritin", "Magnesium", "Zinc"). Set to null if no specific lab marker is targeted.
- "userValue": The user's actual current lab value as a number (e.g., 18). Set to null if targetMarker is null.
- "optimalRange": The reference range string (e.g., "≥50 ng/mL", "≥400 pg/mL", "≤1.0 mg/L"). Set to null if targetMarker is null.
- "insight": A 2–4 sentence explanation written in second person, warm and educational. Structure it as: (1) cite the user's actual lab value with unit and state where it sits relative to the optimal range OR describe the relevant symptom/goal connection; (2) explain the biological or nutritional mechanism in plain language — what role this nutrient or food plays in the body; (3) name 3–5 specific foods that are naturally rich in the relevant nutrient. Set to null ONLY when this recommendation is purely inventory-based with no clear nutritional deficiency or symptom connection. NEVER use any of these words: treat, cure, diagnose, prescribe, medical advice, guarantee, proven to, clinically proven.

Assign "high" priority to recommendations that directly address lab values outside normal ranges or active symptoms. Be specific — mention the lab marker or symptom by name in the reason field.`;

  return {
    prompt,
    profileComplete: !!(profile?.healthGoals?.length),
    inventoryItemCount: inventory.length,
    recentLogCount: recentLogs.length,
  };
}

router.get("/recommendations", async (req, res) => {
  try {
    const userId = getUserId(req);
    const [cached] = await db
      .select()
      .from(recommendationsTable)
      .where(eq(recommendationsTable.replitUserId, userId))
      .orderBy(desc(recommendationsTable.generatedAt))
      .limit(1);

    if (cached) {
      res.json({
        recommendations: cached.items,
        generatedAt: cached.generatedAt.toISOString(),
        basedOn: cached.basedOn,
        cached: true,
      });
      return;
    }

    res.json({
      recommendations: [],
      generatedAt: new Date().toISOString(),
      basedOn: { profileComplete: false, inventoryItemCount: 0, recentLogCount: 0 },
      cached: false,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get recommendations");
    res.status(500).json({ error: "generation_failed", message: "Failed to get recommendations" });
  }
});

router.post("/recommendations", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { prompt, profileComplete, inventoryItemCount, recentLogCount } = await buildRecommendationPrompt(userId);

    try {
      const raw = await generateText(prompt);
      const parsed = JSON.parse(raw);
      const items = sanitizeItems(parsed.recommendations || []);
      const basedOn = { profileComplete, inventoryItemCount, recentLogCount };

      const [saved] = await db
        .insert(recommendationsTable)
        .values({ replitUserId: userId, items, basedOn })
        .returning();

      res.json({
        recommendations: items,
        generatedAt: saved.generatedAt.toISOString(),
        basedOn,
        cached: false,
      });
    } catch (geminiErr: unknown) {
      const message = geminiErr instanceof Error ? geminiErr.message : "Unknown error";
      if (message.includes("No Gemini API key")) {
        res.status(400).json({ error: "no_api_key", message });
        return;
      }
      if (isOverloadedError(geminiErr)) {
        res.status(503).json({ error: "ai_busy", message: "Our AI is a little busy right now — please try again in a moment" });
        return;
      }
      throw geminiErr;
    }
  } catch (err) {
    req.log.error({ err }, "Failed to refresh recommendations");
    res.status(500).json({ error: "generation_failed", message: "Failed to generate recommendations" });
  }
});

export default router;
