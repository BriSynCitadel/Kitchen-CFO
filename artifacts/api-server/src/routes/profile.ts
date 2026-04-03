import { Router, type IRouter, type Request } from "express";
import { db } from "@workspace/db";
import { profilesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { UpdateProfileBody } from "@workspace/api-zod";

const router: IRouter = Router();

function getUserId(req: Request): string {
  return req.user?.id ?? "demo_user";
}

async function getOrCreateProfile(userId: string) {
  const [existing] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.replitUserId, userId))
    .limit(1);
  if (existing) return existing;

  const [created] = await db
    .insert(profilesTable)
    .values({
      replitUserId: userId,
      dietaryPreferences: [],
      healthGoals: [],
      allergies: [],
      medicalConditions: [],
      symptoms: [],
    })
    .returning();

  return created;
}

router.get("/profile", async (req, res) => {
  try {
    const profile = await getOrCreateProfile(getUserId(req));
    res.json(profile);
  } catch (err) {
    req.log.error({ err }, "Failed to get profile");
    res.status(500).json({ error: "db_error", message: "Failed to get profile" });
  }
});

router.put("/profile", async (req, res) => {
  const parseResult = UpdateProfileBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "validation_error", message: parseResult.error.message });
    return;
  }

  try {
    const userId = getUserId(req);
    const existing = await getOrCreateProfile(userId);
    const data = parseResult.data;

    const [updated] = await db
      .update(profilesTable)
      .set({
        age: data.age ?? existing.age,
        gender: data.gender ?? existing.gender,
        heightCm: data.heightCm ?? existing.heightCm,
        weightKg: data.weightKg ?? existing.weightKg,
        bloodType: data.bloodType ?? existing.bloodType,
        activityLevel: data.activityLevel ?? existing.activityLevel,
        dietaryPreferences: data.dietaryPreferences ?? existing.dietaryPreferences,
        healthGoals: data.healthGoals ?? existing.healthGoals,
        allergies: data.allergies ?? existing.allergies,
        medicalConditions: data.medicalConditions ?? existing.medicalConditions,
        labValues: (data.labValues as Record<string, number | null>) ?? existing.labValues,
        symptoms: data.symptoms ?? existing.symptoms,
        culturalBackground: data.culturalBackground !== undefined ? data.culturalBackground : existing.culturalBackground,
        dailyCalorieTarget: data.dailyCalorieTarget ?? existing.dailyCalorieTarget,
        updatedAt: new Date(),
      })
      .where(eq(profilesTable.id, existing.id))
      .returning();

    res.json(updated ?? existing);
  } catch (err) {
    req.log.error({ err }, "Failed to update profile");
    res.status(500).json({ error: "db_error", message: "Failed to update profile" });
  }
});

export default router;
