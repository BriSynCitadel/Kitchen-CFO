import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { profilesTable, inventoryTable, foodLogsTable, recommendationsTable } from "@workspace/db/schema";
import { desc, sql } from "drizzle-orm";
import { generateText } from "../lib/gemini";

const router: IRouter = Router();

async function buildRecommendationPrompt(): Promise<{
  prompt: string;
  profileComplete: boolean;
  inventoryItemCount: number;
  recentLogCount: number;
}> {
  const [profile] = await db.select().from(profilesTable).limit(1);
  const inventory = await db.select().from(inventoryTable).orderBy(desc(inventoryTable.addedAt));
  const recentLogs = await db
    .select()
    .from(foodLogsTable)
    .where(sql`${foodLogsTable.loggedAt} >= NOW() - INTERVAL '3 days'`)
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
        dailyCalorieTarget: profile.dailyCalorieTarget,
        labValues: profile.labValues,
      }
    : null;

  const inventorySummary = inventory
    .map((i) => `${i.name} (${i.category}${i.quantity ? ", " + i.quantity : ""})`)
    .join(", ");
  const recentFoods = recentLogs.map((l) => l.foodName).join(", ");

  const prompt = `You are a personalized nutrition advisor. Based on the following user data, generate 6 food recommendations.

USER PROFILE:
${JSON.stringify(profileSummary, null, 2)}

KITCHEN INVENTORY (items they have):
${inventorySummary || "No items logged yet"}

RECENTLY EATEN (last 3 days):
${recentFoods || "No recent logs"}

Generate exactly 6 recommendations that:
1. Align with their dietary preferences and health goals
2. Account for their blood type and any medical conditions
3. Prioritize ingredients they already have in their kitchen
4. Address any nutritional gaps based on recent eating patterns
5. Are varied (mix of meals and snacks)

Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "1-2 sentence description of the food/meal",
      "reason": "Specific reason why this is good for them based on their profile",
      "category": "meal|snack|ingredient|nutrient_tip",
      "ingredients": ["ingredient1", "ingredient2"],
      "priority": "high|medium|low"
    }
  ]
}

Prioritize high-value recommendations specific to their health goals and what's in their kitchen.`;

  return {
    prompt,
    profileComplete: !!(profile?.healthGoals?.length),
    inventoryItemCount: inventory.length,
    recentLogCount: recentLogs.length,
  };
}

router.get("/recommendations", async (req, res) => {
  try {
    const [cached] = await db
      .select()
      .from(recommendationsTable)
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

    const { prompt, profileComplete, inventoryItemCount, recentLogCount } = await buildRecommendationPrompt();

    try {
      const raw = await generateText(prompt);
      const parsed = JSON.parse(raw);
      const items = parsed.recommendations || [];
      const basedOn = { profileComplete, inventoryItemCount, recentLogCount };

      const [saved] = await db
        .insert(recommendationsTable)
        .values({ items, basedOn })
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
        res.json({
          recommendations: [],
          generatedAt: new Date().toISOString(),
          basedOn: { profileComplete: false, inventoryItemCount: 0, recentLogCount: 0 },
          cached: false,
          _error: "no_api_key",
        });
        return;
      }
      throw geminiErr;
    }
  } catch (err) {
    req.log.error({ err }, "Failed to get recommendations");
    res.status(500).json({ error: "generation_failed", message: "Failed to get recommendations" });
  }
});

router.post("/recommendations", async (req, res) => {
  try {
    const { prompt, profileComplete, inventoryItemCount, recentLogCount } = await buildRecommendationPrompt();

    try {
      const raw = await generateText(prompt);
      const parsed = JSON.parse(raw);
      const items = parsed.recommendations || [];
      const basedOn = { profileComplete, inventoryItemCount, recentLogCount };

      const [saved] = await db
        .insert(recommendationsTable)
        .values({ items, basedOn })
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
