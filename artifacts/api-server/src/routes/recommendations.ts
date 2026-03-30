import { Router, type IRouter, type Request } from "express";
import { db } from "@workspace/db";
import { profilesTable, inventoryTable, foodLogsTable, recommendationsTable } from "@workspace/db/schema";
import { desc, sql, eq, and } from "drizzle-orm";
import { generateText } from "../lib/gemini";

function getUserId(req: Request): string {
  return req.user?.id ?? "demo_user";
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
1. LAB VALUES: If labValues are present, identify which markers may be suboptimal based on standard reference ranges (e.g. Vitamin D < 30 ng/mL is insufficient; B12 < 300 pg/mL is low; ferritin < 20 ng/mL is low; CRP > 3 mg/L indicates inflammation; fasting glucose > 100 mg/dL is prediabetic). For each out-of-range marker, prioritize foods that are clinically proven to improve that marker. Name the specific marker in the "reason" field.
2. SYMPTOMS: If symptoms are listed (fatigue, brain_fog, inflammation, digestive_issues, poor_sleep, hormonal_imbalance), prioritize foods and nutrients with evidence-based support for those symptoms. For example: fatigue → iron, B12, CoQ10-rich foods; brain_fog → omega-3, B vitamins, antioxidants; inflammation → turmeric, omega-3, leafy greens; digestive_issues → fermented foods, fiber, prebiotics; poor_sleep → magnesium, tryptophan, complex carbs; hormonal_imbalance → cruciferous vegetables, flaxseed, zinc-rich foods.
3. DIETARY PREFERENCES & ALLERGIES: Strictly respect dietary restrictions and allergies.
4. KITCHEN FIRST: Prioritize recipes using ingredients already in their inventory.
5. VARIETY: Include a mix of meals, snacks, specific ingredients, and nutrient tips.

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
      "targetMarker": "Vitamin D",
      "userValue": 18,
      "optimalRange": "≥50 ng/mL"
    }
  ]
}

Field rules:
- "targetMarker": Include ONLY when this recommendation primarily addresses a specific lab marker that is outside the normal range. Use the human-readable name (e.g., "Vitamin D", "Vitamin B12", "CRP", "Ferritin", "Magnesium", "Zinc"). Set to null if no specific lab marker is targeted.
- "userValue": The user's actual current lab value as a number (e.g., 18). Set to null if targetMarker is null.
- "optimalRange": The reference range string (e.g., "≥50 ng/mL", "≥400 pg/mL", "≤1.0 mg/L"). Set to null if targetMarker is null.

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
      const items = parsed.recommendations || [];
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
      throw geminiErr;
    }
  } catch (err) {
    req.log.error({ err }, "Failed to refresh recommendations");
    res.status(500).json({ error: "generation_failed", message: "Failed to generate recommendations" });
  }
});

export default router;
