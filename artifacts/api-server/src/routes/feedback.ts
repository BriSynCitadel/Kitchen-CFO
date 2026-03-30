import { Router, type IRouter, type Request } from "express";
import { db } from "@workspace/db";
import { feedbackTable } from "@workspace/db/schema";
import { desc, eq } from "drizzle-orm";

function getUserId(req: Request): string {
  return req.user?.id ?? "demo_user";
}

const router: IRouter = Router();

router.post("/feedback", async (req, res) => {
  const { rating, liked, improvements } = req.body ?? {};

  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    res.status(400).json({ error: "validation_error", message: "rating must be an integer between 1 and 5" });
    return;
  }

  if (liked !== undefined && liked !== null && typeof liked !== "string") {
    res.status(400).json({ error: "validation_error", message: "liked must be a string or null" });
    return;
  }

  if (improvements !== undefined && improvements !== null && typeof improvements !== "string") {
    res.status(400).json({ error: "validation_error", message: "improvements must be a string or null" });
    return;
  }

  try {
    const [created] = await db
      .insert(feedbackTable)
      .values({
        replitUserId: getUserId(req),
        rating,
        liked: liked ?? null,
        improvements: improvements ?? null,
      })
      .returning();

    res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Failed to save feedback");
    res.status(500).json({ error: "db_error", message: "Failed to save feedback" });
  }
});

router.get("/feedback", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(feedbackTable)
      .where(eq(feedbackTable.replitUserId, getUserId(req)))
      .orderBy(desc(feedbackTable.createdAt));

    res.json({ feedback: rows, total: rows.length });
  } catch (err) {
    req.log.error({ err }, "Failed to get feedback");
    res.status(500).json({ error: "db_error", message: "Failed to get feedback" });
  }
});

export default router;
