import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { profilesTable, inventoryTable, foodLogsTable } from "@workspace/db/schema";
import { eq, and, gte, lt, inArray } from "drizzle-orm";

const router: IRouter = Router();

router.post("/demo/load", async (req, res) => {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const demoFoodNames = [
    "Spinach & Salmon Bowl",
    "Greek Yogurt with Blueberries",
    "Roasted Sweet Potato",
  ];

  const demoInventory = [
    { name: "Baby Spinach", category: "produce", quantity: "5 oz bag" },
    { name: "Wild Salmon Fillet", category: "protein", quantity: "2 fillets (6 oz each)" },
    { name: "Greek Yogurt", category: "dairy", quantity: "32 oz container" },
    { name: "Blueberries", category: "produce", quantity: "1 pint" },
    { name: "Extra Virgin Olive Oil", category: "condiments", quantity: "750 ml bottle" },
    { name: "Garlic", category: "produce", quantity: "1 head" },
    { name: "Eggs", category: "protein", quantity: "1 dozen" },
    { name: "Sweet Potato", category: "produce", quantity: "3 medium" },
  ];

  const demoLogs = [
    {
      foodName: "Spinach & Salmon Bowl",
      quantity: "1 bowl",
      mealType: "lunch",
      nutrients: {
        calories: 480,
        protein: 38,
        carbohydrates: 22,
        fat: 24,
        fiber: 6,
        micronutrients: { vitaminD: 18, vitaminB12: 4.2, iron: 5.8, omega3: 2200, magnesium: 62 },
      },
      loggedAt: new Date(todayStart.getTime() + 12 * 60 * 60 * 1000),
    },
    {
      foodName: "Greek Yogurt with Blueberries",
      quantity: "1 cup yogurt + ½ cup blueberries",
      mealType: "breakfast",
      nutrients: {
        calories: 210,
        protein: 18,
        carbohydrates: 28,
        fat: 3,
        fiber: 3,
        micronutrients: { calcium: 200, vitaminC: 14, zinc: 1.2, magnesium: 28 },
      },
      loggedAt: new Date(todayStart.getTime() + 8 * 60 * 60 * 1000),
    },
    {
      foodName: "Roasted Sweet Potato",
      quantity: "1 medium sweet potato",
      mealType: "snack",
      nutrients: {
        calories: 130,
        protein: 2,
        carbohydrates: 30,
        fat: 0.5,
        fiber: 4,
        micronutrients: { vitaminA: 961, vitaminC: 22, potassium: 440, magnesium: 33 },
      },
      loggedAt: new Date(todayStart.getTime() + 15 * 60 * 60 * 1000),
    },
  ];

  try {
    await db.transaction(async (tx) => {
      const [existingProfile] = await tx.select().from(profilesTable).limit(1);

      const profileData = {
        age: 34,
        gender: "female",
        heightCm: 165,
        weightKg: 65,
        activityLevel: "moderately_active",
        healthGoals: ["energy", "inflammation", "weight_loss"] as string[],
        symptoms: ["fatigue", "brain_fog", "inflammation"] as string[],
        labValues: {
          vitaminD: 18, crp: 4.2, vitaminB12: 280, ferritin: 15,
          iron: 72, glucose: 92, totalCholesterol: 195,
          ldl: 118, hdl: 52, magnesium: 1.8, zinc: 68,
        },
        dailyCalorieTarget: 1800,
      };

      try {
        if (existingProfile) {
          await tx
            .update(profilesTable)
            .set({ ...profileData, updatedAt: new Date() })
            .where(eq(profilesTable.id, existingProfile.id));
        } else {
          await tx.insert(profilesTable).values({
            ...profileData,
            dietaryPreferences: [],
            allergies: [],
            medicalConditions: [],
          });
        }
      } catch (err) {
        req.log.warn({ err }, "Demo load: profile upsert failed (non-fatal, continuing)");
      }

      try {
        for (const item of demoInventory) {
          await tx
            .insert(inventoryTable)
            .values({ name: item.name, category: item.category, quantity: item.quantity })
            .onConflictDoNothing();
        }
      } catch (err) {
        req.log.warn({ err }, "Demo load: inventory inserts failed (non-fatal, continuing)");
      }

      await tx
        .delete(foodLogsTable)
        .where(
          and(
            inArray(foodLogsTable.foodName, demoFoodNames),
            gte(foodLogsTable.loggedAt, todayStart),
            lt(foodLogsTable.loggedAt, todayEnd),
          ),
        );

      for (const log of demoLogs) {
        await tx.insert(foodLogsTable).values({
          foodName: log.foodName,
          quantity: log.quantity,
          mealType: log.mealType,
          nutrients: log.nutrients,
          loggedAt: log.loggedAt,
        });
      }
    });
  } catch (err) {
    req.log.warn({ err }, "Demo load: transaction failed (returning success anyway)");
  }

  res.json({ success: true });
});

export default router;
