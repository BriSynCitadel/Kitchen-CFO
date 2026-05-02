import { Router, type IRouter, type Request } from "express";
import { db } from "@workspace/db";
import { foodLogsTable } from "@workspace/db/schema";
import { eq, desc, sql, gte, and, lte } from "drizzle-orm";

import {
  CreateFoodLogBody,
  DeleteFoodLogParams,
  GetFoodLogSummaryQueryParams,
  GetFoodLogsQueryParams,
} from "@workspace/api-zod";
import { generateText } from "../lib/gemini";

function getUserId(req: Request): string {
  return req.user?.id ?? "demo_user";
}

const router: IRouter = Router();

const WEEKLY_NUTRIENTS = [
  { key: "vitaminD", label: "Vitamin D" },
  { key: "iron", label: "Iron" },
  { key: "calcium", label: "Calcium" },
  { key: "magnesium", label: "Magnesium" },
  { key: "zinc", label: "Zinc" },
  { key: "vitaminC", label: "Vitamin C" },
] as const;

router.get("/food-logs/weekly", async (req, res) => {
  try {
    // Strict 7-day window: start of day 6 days ago → end of today
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const userId = getUserId(req);
    const logs = await db
      .select()
      .from(foodLogsTable)
      .where(and(
        eq(foodLogsTable.replitUserId, userId),
        gte(foodLogsTable.loggedAt, startDate),
        lte(foodLogsTable.loggedAt, endDate),
      ))
      .orderBy(desc(foodLogsTable.loggedAt));

    // Group logs by calendar date using DATE() SQL semantics (same as the rest of the app)
    // We extract YYYY-MM-DD using local-time date parts to match DB DATE() behavior
    const logsByDate: Record<string, typeof logs> = {};
    for (const log of logs) {
      const d = log.loggedAt;
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!logsByDate[dateKey]) logsByDate[dateKey] = [];
      logsByDate[dateKey].push(log);
    }

    const dates = Object.keys(logsByDate);

    // Count how many distinct days each nutrient appeared (value > 0)
    const nutrients = WEEKLY_NUTRIENTS.map(({ key, label }) => {
      let daysHit = 0;
      for (const dateKey of dates) {
        const hasNutrient = logsByDate[dateKey].some((log) => {
          const n = log.nutrients as Record<string, unknown>;
          const micro = (n.micronutrients as Record<string, number>) || {};
          return (micro[key] || 0) > 0;
        });
        if (hasNutrient) daysHit++;
      }
      return { key, label, daysHit, totalDays: 7 };
    });

    // Generate one AI insight sentence
    let insight: string | null = null;
    try {
      const summary = nutrients
        .map((n) => `${n.label}: ${n.daysHit}/7 days`)
        .join(", ");
      const prompt = `You are a nutrition coach. Based on this week's micronutrient tracking data, write ONE concise sentence (max 25 words) that highlights either a strong area or the biggest gap. Keep it encouraging and specific. Data: ${summary}. Return JSON: {"insight": "Your sentence here."}`;
      const raw = await generateText(prompt);
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (typeof parsed.insight === "string") insight = parsed.insight;
    } catch {
      // AI unavailable — respond without insight
    }

    res.json({ nutrients, insight });
  } catch (err) {
    req.log.error({ err }, "Failed to get weekly trends");
    res.status(500).json({ error: "db_error", message: "Failed to get weekly trends" });
  }
});

router.get("/food-logs/summary", async (req, res) => {
  const parseResult = GetFoodLogSummaryQueryParams.safeParse(req.query);
  const date = parseResult.success && parseResult.data.date
    ? parseResult.data.date
    : new Date().toISOString().split("T")[0];

  try {
    const userId = getUserId(req);
    const logs = await db
      .select()
      .from(foodLogsTable)
      .where(and(eq(foodLogsTable.replitUserId, userId), sql`DATE(${foodLogsTable.loggedAt}) = ${date}`));

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbohydrates = 0;
    let totalFat = 0;
    let totalFiber = 0;
    const microTotals: Record<string, number> = {};

    for (const log of logs) {
      const n = log.nutrients as Record<string, unknown>;
      totalCalories += (n.calories as number) || 0;
      totalProtein += (n.protein as number) || 0;
      totalCarbohydrates += (n.carbohydrates as number) || 0;
      totalFat += (n.fat as number) || 0;
      totalFiber += (n.fiber as number) || 0;

      const micro = (n.micronutrients as Record<string, number>) || {};
      for (const [key, val] of Object.entries(micro)) {
        microTotals[key] = (microTotals[key] || 0) + (val || 0);
      }
    }

    const mealTypes = new Set(logs.map((l) => l.mealType));

    res.json({
      date,
      totalCalories,
      totalProtein,
      totalCarbohydrates,
      totalFat,
      totalFiber,
      micronutrientTotals: microTotals,
      mealCount: mealTypes.size,
      logCount: logs.length,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get summary");
    res.status(500).json({ error: "db_error", message: "Failed to get summary" });
  }
});

router.get("/food-logs", async (req, res) => {
  const parseResult = GetFoodLogsQueryParams.safeParse(req.query);
  const { date, limit = 50, offset = 0 } = parseResult.success ? parseResult.data : {};

  try {
    const userId = getUserId(req);
    let query = db.select().from(foodLogsTable).$dynamic();

    if (date) {
      query = query.where(and(eq(foodLogsTable.replitUserId, userId), sql`DATE(${foodLogsTable.loggedAt}) = ${date}`));
    } else {
      query = query.where(eq(foodLogsTable.replitUserId, userId));
    }

    const logs = await query
      .orderBy(desc(foodLogsTable.loggedAt))
      .limit(limit ?? 50)
      .offset(offset ?? 0);

    const total = logs.length;
    res.json({
      logs: logs.map(({ imageBase64, ...rest }) => ({
        ...rest,
        imageUrl: imageBase64 ? "data-available" : null,
      })),
      total,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get food logs");
    res.status(500).json({ error: "db_error", message: "Failed to get food logs" });
  }
});

router.post("/food-logs", async (req, res) => {
  const parseResult = CreateFoodLogBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "validation_error", message: parseResult.error.message });
    return;
  }

  const { foodName, quantity, mealType, nutrients, imageBase64, notes, loggedAt } = parseResult.data;

  try {
    const [created] = await db
      .insert(foodLogsTable)
      .values({
        replitUserId: getUserId(req),
        foodName,
        quantity: quantity ?? null,
        mealType,
        nutrients: nutrients as Record<string, unknown>,
        imageBase64: imageBase64 ?? null,
        notes: notes ?? null,
        loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
      })
      .returning();

    res.status(201).json({
      ...created,
      imageUrl: created.imageBase64 ? "data-available" : null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create food log");
    res.status(500).json({ error: "db_error", message: "Failed to create food log" });
  }
});

router.delete("/food-logs/:id", async (req, res) => {
  const parseResult = DeleteFoodLogParams.safeParse(req.params);
  if (!parseResult.success) {
    res.status(400).json({ error: "validation_error", message: "Invalid ID" });
    return;
  }

  try {
    const deleted = await db
      .delete(foodLogsTable)
      .where(and(eq(foodLogsTable.id, parseResult.data.id), eq(foodLogsTable.replitUserId, getUserId(req))))
      .returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "not_found", message: "Food log not found" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete food log");
    res.status(500).json({ error: "db_error", message: "Failed to delete food log" });
  }
});

export default router;
