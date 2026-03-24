import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { UpdateSettingsBody } from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrCreateSettings() {
  const [existing] = await db.select().from(settingsTable).limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(settingsTable)
    .values({ defaultMealType: "other", unitSystem: "metric" })
    .returning();

  return created;
}

router.get("/settings", async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const geminiEnvSet = !!process.env.GEMINI_API_KEY;
    const geminiDbSet = !!settings.geminiApiKey;

    res.json({
      geminiApiKeySet: geminiEnvSet || geminiDbSet,
      geminiApiKeySource: geminiEnvSet ? "env" : geminiDbSet ? "database" : "none",
      defaultMealType: settings.defaultMealType,
      unitSystem: settings.unitSystem,
      updatedAt: settings.updatedAt?.toISOString() ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get settings");
    res.status(500).json({ error: "db_error", message: "Failed to get settings" });
  }
});

router.put("/settings", async (req, res) => {
  const parseResult = UpdateSettingsBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "validation_error", message: parseResult.error.message });
    return;
  }

  const { geminiApiKey, defaultMealType, unitSystem } = parseResult.data;

  try {
    const existing = await getOrCreateSettings();

    const [updated] = await db
      .update(settingsTable)
      .set({
        geminiApiKey: geminiApiKey !== undefined ? (geminiApiKey || null) : existing.geminiApiKey,
        defaultMealType: defaultMealType ?? existing.defaultMealType,
        unitSystem: unitSystem ?? existing.unitSystem,
        updatedAt: new Date(),
      })
      .where(eq(settingsTable.id, existing.id))
      .returning();

    const geminiEnvSet = !!process.env.GEMINI_API_KEY;
    const geminiDbSet = !!(updated ?? existing).geminiApiKey;

    res.json({
      geminiApiKeySet: geminiEnvSet || geminiDbSet,
      geminiApiKeySource: geminiEnvSet ? "env" : geminiDbSet ? "database" : "none",
      defaultMealType: (updated ?? existing).defaultMealType,
      unitSystem: (updated ?? existing).unitSystem,
      updatedAt: (updated ?? existing).updatedAt?.toISOString() ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update settings");
    res.status(500).json({ error: "db_error", message: "Failed to update settings" });
  }
});

export default router;
