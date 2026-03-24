import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { foodLogsTable } from "@workspace/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import {
  CreateFoodLogBody,
  DeleteFoodLogParams,
  GetFoodLogSummaryQueryParams,
  GetFoodLogsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/food-logs/summary", async (req, res) => {
  const parseResult = GetFoodLogSummaryQueryParams.safeParse(req.query);
  const date = parseResult.success && parseResult.data.date
    ? parseResult.data.date
    : new Date().toISOString().split("T")[0];

  try {
    const logs = await db
      .select()
      .from(foodLogsTable)
      .where(sql`DATE(${foodLogsTable.loggedAt}) = ${date}`);

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
    let query = db.select().from(foodLogsTable).$dynamic();

    if (date) {
      query = query.where(sql`DATE(${foodLogsTable.loggedAt}) = ${date}`);
    }

    const logs = await query
      .orderBy(desc(foodLogsTable.loggedAt))
      .limit(limit ?? 50)
      .offset(offset ?? 0);

    const total = logs.length;
    res.json({
      logs: logs.map((l) => ({
        ...l,
        imageUrl: l.imageBase64 ? "data-available" : null,
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
      .where(eq(foodLogsTable.id, parseResult.data.id))
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
