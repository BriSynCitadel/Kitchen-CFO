import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { profilesTable, inventoryTable, foodLogsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/demo/load", async (req, res) => {
  try {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const [existingProfile] = await db.select().from(profilesTable).limit(1);

    if (existingProfile) {
      await db
        .update(profilesTable)
        .set({
          age: 34,
          gender: "female",
          heightCm: 165,
          weightKg: 65,
          activityLevel: "moderately_active",
          healthGoals: ["energy", "inflammation", "weight_loss"],
          symptoms: ["fatigue", "brain_fog", "inflammation"],
          labValues: {
            vitaminD: 18,
            crp: 4.2,
            vitaminB12: 280,
            ferritin: 15,
            iron: 72,
            glucose: 92,
            totalCholesterol: 195,
            ldl: 118,
            hdl: 52,
            magnesium: 1.8,
            zinc: 68,
          },
          dailyCalorieTarget: 1800,
          updatedAt: new Date(),
        })
        .where(eq(profilesTable.id, existingProfile.id));
    } else {
      await db.insert(profilesTable).values({
        age: 34,
        gender: "female",
        heightCm: 165,
        weightKg: 65,
        activityLevel: "moderately_active",
        healthGoals: ["energy", "inflammation", "weight_loss"],
        symptoms: ["fatigue", "brain_fog", "inflammation"],
        dietaryPreferences: [],
        allergies: [],
        medicalConditions: [],
        labValues: {
          vitaminD: 18,
          crp: 4.2,
          vitaminB12: 280,
          ferritin: 15,
          iron: 72,
          glucose: 92,
          totalCholesterol: 195,
          ldl: 118,
          hdl: 52,
          magnesium: 1.8,
          zinc: 68,
        },
        dailyCalorieTarget: 1800,
      });
    }

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

    for (const item of demoInventory) {
      await db
        .insert(inventoryTable)
        .values({
          name: item.name,
          category: item.category as any,
          quantity: item.quantity,
        })
        .onConflictDoNothing();
    }

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
          micronutrients: {
            vitaminD: 18,
            vitaminB12: 4.2,
            iron: 5.8,
            omega3: 2200,
            magnesium: 62,
          },
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
          micronutrients: {
            calcium: 200,
            vitaminC: 14,
            zinc: 1.2,
            magnesium: 28,
          },
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
          micronutrients: {
            vitaminA: 961,
            vitaminC: 22,
            potassium: 440,
            magnesium: 33,
          },
        },
        loggedAt: new Date(todayStart.getTime() + 15 * 60 * 60 * 1000),
      },
    ];

    for (const log of demoLogs) {
      await db.insert(foodLogsTable).values({
        foodName: log.foodName,
        quantity: log.quantity,
        mealType: log.mealType,
        nutrients: log.nutrients,
        loggedAt: log.loggedAt,
      });
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to load demo data");
    res.status(500).json({ error: "server_error", message: "Failed to load demo data" });
  }
});

export default router;
