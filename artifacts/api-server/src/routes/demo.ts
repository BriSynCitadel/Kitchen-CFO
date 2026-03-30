import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { profilesTable, inventoryTable, foodLogsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const DEMO_USER_ID = "demo_user";

const router: IRouter = Router();

router.post("/demo/load", async (req, res) => {
  const now = new Date();

  function daysAgo(n: number, hour: number, minute = 0) {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    d.setHours(hour, minute, 0, 0);
    return d;
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
    { name: "Chicken Breast", category: "protein", quantity: "1.5 lbs" },
    { name: "Brown Rice", category: "grains", quantity: "2 lb bag" },
    { name: "Broccoli", category: "produce", quantity: "1 large head" },
    { name: "Almonds", category: "pantry", quantity: "12 oz bag" },
    { name: "Lemon", category: "produce", quantity: "4 lemons" },
    { name: "Canned Tuna", category: "protein", quantity: "3 cans (5 oz each)" },
    { name: "Rolled Oats", category: "grains", quantity: "42 oz container" },
    { name: "Avocado", category: "produce", quantity: "2 ripe" },
    { name: "Whole Milk", category: "dairy", quantity: "1 gallon" },
    { name: "Chia Seeds", category: "pantry", quantity: "12 oz bag" },
  ];

  const demoLogs = [
    // Day 0 (today)
    {
      foodName: "Greek Yogurt with Blueberries & Chia",
      quantity: "1 cup yogurt + ½ cup blueberries",
      mealType: "breakfast",
      nutrients: { calories: 220, protein: 18, carbohydrates: 28, fat: 4, fiber: 4, micronutrients: { calcium: 200, vitaminC: 14, zinc: 1.4, magnesium: 30 } },
      loggedAt: daysAgo(0, 8),
    },
    {
      foodName: "Spinach & Salmon Bowl",
      quantity: "1 bowl",
      mealType: "lunch",
      nutrients: { calories: 480, protein: 38, carbohydrates: 22, fat: 24, fiber: 6, micronutrients: { vitaminD: 18, vitaminB12: 4.2, iron: 5.8, omega3: 2200, magnesium: 62 } },
      loggedAt: daysAgo(0, 12, 30),
    },
    {
      foodName: "Roasted Sweet Potato",
      quantity: "1 medium",
      mealType: "snack",
      nutrients: { calories: 130, protein: 2, carbohydrates: 30, fat: 0.5, fiber: 4, micronutrients: { vitaminA: 961, vitaminC: 22, potassium: 440, magnesium: 33 } },
      loggedAt: daysAgo(0, 15, 30),
    },
    {
      foodName: "Baked Chicken Breast with Broccoli",
      quantity: "6 oz chicken + 1 cup broccoli",
      mealType: "dinner",
      nutrients: { calories: 390, protein: 45, carbohydrates: 16, fat: 10, fiber: 5, micronutrients: { vitaminC: 90, vitaminD: 4, calcium: 80, magnesium: 48, zinc: 3.2, iron: 2.1 } },
      loggedAt: daysAgo(0, 19),
    },

    // Day 1 (yesterday)
    {
      foodName: "Oatmeal with Almonds and Banana",
      quantity: "1 cup oats + 1 oz almonds",
      mealType: "breakfast",
      nutrients: { calories: 380, protein: 12, carbohydrates: 55, fat: 14, fiber: 8, micronutrients: { magnesium: 95, zinc: 2.1, iron: 3.4, calcium: 60, vitaminC: 10 } },
      loggedAt: daysAgo(1, 8),
    },
    {
      foodName: "Tuna Salad Wrap",
      quantity: "1 whole wheat wrap + 1 can tuna",
      mealType: "lunch",
      nutrients: { calories: 420, protein: 34, carbohydrates: 38, fat: 12, fiber: 5, micronutrients: { vitaminB12: 2.8, iron: 2.4, calcium: 90, zinc: 2.5, vitaminD: 8 } },
      loggedAt: daysAgo(1, 13),
    },
    {
      foodName: "Avocado & Egg Toast",
      quantity: "2 eggs + ½ avocado on sourdough",
      mealType: "dinner",
      nutrients: { calories: 450, protein: 20, carbohydrates: 32, fat: 28, fiber: 7, micronutrients: { vitaminD: 6, vitaminB12: 1.6, iron: 3.0, calcium: 70, magnesium: 55 } },
      loggedAt: daysAgo(1, 19, 30),
    },

    // Day 2
    {
      foodName: "Chia Pudding with Berries",
      quantity: "1 cup chia pudding + ½ cup mixed berries",
      mealType: "breakfast",
      nutrients: { calories: 290, protein: 10, carbohydrates: 34, fat: 13, fiber: 12, micronutrients: { calcium: 350, vitaminC: 28, magnesium: 80, iron: 3.8, zinc: 1.6 } },
      loggedAt: daysAgo(2, 8, 30),
    },
    {
      foodName: "Brown Rice & Chicken Bowl",
      quantity: "1 cup rice + 5 oz chicken",
      mealType: "lunch",
      nutrients: { calories: 520, protein: 42, carbohydrates: 60, fat: 9, fiber: 4, micronutrients: { magnesium: 72, zinc: 3.8, iron: 2.8, vitaminD: 3, calcium: 50 } },
      loggedAt: daysAgo(2, 12),
    },
    {
      foodName: "Handful of Almonds",
      quantity: "1 oz (about 23 almonds)",
      mealType: "snack",
      nutrients: { calories: 165, protein: 6, carbohydrates: 6, fat: 14, fiber: 3.5, micronutrients: { magnesium: 76, calcium: 76, zinc: 0.9, iron: 1.1, vitaminE: 7.3 } },
      loggedAt: daysAgo(2, 15),
    },
    {
      foodName: "Salmon with Roasted Vegetables",
      quantity: "6 oz salmon + 2 cups vegetables",
      mealType: "dinner",
      nutrients: { calories: 510, protein: 44, carbohydrates: 28, fat: 24, fiber: 8, micronutrients: { vitaminD: 22, vitaminB12: 5.8, iron: 4.2, calcium: 110, magnesium: 78, zinc: 3.5, vitaminC: 45 } },
      loggedAt: daysAgo(2, 19),
    },

    // Day 3
    {
      foodName: "Scrambled Eggs with Spinach",
      quantity: "3 eggs + 1 cup spinach",
      mealType: "breakfast",
      nutrients: { calories: 310, protein: 22, carbohydrates: 6, fat: 20, fiber: 1.5, micronutrients: { vitaminD: 5, vitaminB12: 1.5, iron: 3.6, calcium: 110, magnesium: 40 } },
      loggedAt: daysAgo(3, 7, 30),
    },
    {
      foodName: "Lemon Chicken with Brown Rice",
      quantity: "5 oz chicken + 3/4 cup rice",
      mealType: "lunch",
      nutrients: { calories: 490, protein: 40, carbohydrates: 52, fat: 10, fiber: 3, micronutrients: { vitaminC: 18, magnesium: 60, zinc: 3.2, iron: 2.5, calcium: 40 } },
      loggedAt: daysAgo(3, 12, 30),
    },
    {
      foodName: "Greek Yogurt",
      quantity: "1 cup plain",
      mealType: "snack",
      nutrients: { calories: 130, protein: 15, carbohydrates: 9, fat: 4, fiber: 0, micronutrients: { calcium: 250, vitaminB12: 1.4, zinc: 1.5, magnesium: 20 } },
      loggedAt: daysAgo(3, 16),
    },
    {
      foodName: "Garlic Shrimp with Broccoli",
      quantity: "6 oz shrimp + 1.5 cups broccoli",
      mealType: "dinner",
      nutrients: { calories: 340, protein: 36, carbohydrates: 18, fat: 12, fiber: 6, micronutrients: { vitaminC: 120, vitaminD: 5, calcium: 130, magnesium: 60, zinc: 3.8, iron: 3.0 } },
      loggedAt: daysAgo(3, 19),
    },

    // Day 4
    {
      foodName: "Oatmeal with Blueberries",
      quantity: "1 cup oats + 1 cup blueberries",
      mealType: "breakfast",
      nutrients: { calories: 310, protein: 8, carbohydrates: 60, fat: 4, fiber: 9, micronutrients: { vitaminC: 24, magnesium: 55, iron: 2.8, calcium: 30, zinc: 1.2 } },
      loggedAt: daysAgo(4, 8),
    },
    {
      foodName: "Spinach Salad with Tuna",
      quantity: "2 cups spinach + 1 can tuna",
      mealType: "lunch",
      nutrients: { calories: 290, protein: 30, carbohydrates: 10, fat: 12, fiber: 4, micronutrients: { vitaminD: 8, vitaminB12: 2.4, iron: 5.2, calcium: 100, magnesium: 70, vitaminC: 35 } },
      loggedAt: daysAgo(4, 13),
    },
    {
      foodName: "Baked Sweet Potato with Greek Yogurt",
      quantity: "1 large sweet potato + ½ cup yogurt",
      mealType: "dinner",
      nutrients: { calories: 350, protein: 14, carbohydrates: 62, fat: 4, fiber: 7, micronutrients: { vitaminA: 1280, vitaminC: 35, calcium: 180, magnesium: 58, potassium: 660, zinc: 1.8 } },
      loggedAt: daysAgo(4, 18, 30),
    },

    // Day 5
    {
      foodName: "Whole Milk Latte & Almonds",
      quantity: "12 oz latte + 1 oz almonds",
      mealType: "breakfast",
      nutrients: { calories: 290, protein: 11, carbohydrates: 22, fat: 18, fiber: 3.5, micronutrients: { calcium: 310, magnesium: 78, vitaminD: 4, zinc: 1.3 } },
      loggedAt: daysAgo(5, 9),
    },
    {
      foodName: "Chicken & Avocado Bowl",
      quantity: "5 oz chicken + ½ avocado + greens",
      mealType: "lunch",
      nutrients: { calories: 470, protein: 38, carbohydrates: 14, fat: 28, fiber: 8, micronutrients: { vitaminC: 22, magnesium: 55, zinc: 3.0, iron: 2.0, calcium: 65, vitaminD: 4 } },
      loggedAt: daysAgo(5, 12, 30),
    },
    {
      foodName: "Salmon Stir Fry with Rice",
      quantity: "6 oz salmon + 1 cup brown rice + vegetables",
      mealType: "dinner",
      nutrients: { calories: 580, protein: 46, carbohydrates: 56, fat: 20, fiber: 6, micronutrients: { vitaminD: 24, vitaminB12: 6.0, iron: 3.5, calcium: 100, magnesium: 90, zinc: 4.0, vitaminC: 40 } },
      loggedAt: daysAgo(5, 19),
    },

    // Day 6
    {
      foodName: "Chia & Oat Smoothie",
      quantity: "1 large smoothie (banana, oats, chia, milk)",
      mealType: "breakfast",
      nutrients: { calories: 380, protein: 14, carbohydrates: 62, fat: 9, fiber: 10, micronutrients: { calcium: 280, magnesium: 85, vitaminC: 18, iron: 3.2, zinc: 2.0 } },
      loggedAt: daysAgo(6, 8),
    },
    {
      foodName: "Egg & Vegetable Frittata",
      quantity: "3-egg frittata with broccoli & spinach",
      mealType: "lunch",
      nutrients: { calories: 340, protein: 26, carbohydrates: 12, fat: 20, fiber: 4, micronutrients: { vitaminD: 6, vitaminB12: 1.8, iron: 4.5, calcium: 160, magnesium: 52, vitaminC: 55 } },
      loggedAt: daysAgo(6, 12),
    },
    {
      foodName: "Tuna with Sweet Potato & Greens",
      quantity: "1 can tuna + 1 sweet potato",
      mealType: "dinner",
      nutrients: { calories: 410, protein: 32, carbohydrates: 44, fat: 10, fiber: 7, micronutrients: { vitaminD: 10, vitaminB12: 2.8, vitaminA: 960, vitaminC: 28, iron: 4.0, calcium: 90, magnesium: 75, zinc: 2.8 } },
      loggedAt: daysAgo(6, 18, 30),
    },
  ];

  const userId = DEMO_USER_ID;

  try {
    await db.transaction(async (tx) => {
      // Upsert demo profile
      const [existingProfile] = await tx
        .select()
        .from(profilesTable)
        .where(eq(profilesTable.replitUserId, userId))
        .limit(1);
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
          await tx.update(profilesTable)
            .set({ ...profileData, updatedAt: new Date() })
            .where(eq(profilesTable.id, existingProfile.id));
        } else {
          await tx.insert(profilesTable).values({
            replitUserId: userId,
            ...profileData,
            dietaryPreferences: [],
            allergies: [],
            medicalConditions: [],
          });
        }
      } catch (err) {
        req.log.warn({ err }, "Demo load: profile upsert failed (non-fatal)");
      }

      // Clear this user's food logs and replace with rich 7-day demo set
      await tx.delete(foodLogsTable).where(eq(foodLogsTable.replitUserId, userId));
      for (const log of demoLogs) {
        await tx.insert(foodLogsTable).values({
          replitUserId: userId,
          foodName: log.foodName,
          quantity: log.quantity,
          mealType: log.mealType,
          nutrients: log.nutrients,
          loggedAt: log.loggedAt,
        });
      }

      // Upsert inventory (skip duplicates for this user)
      try {
        for (const item of demoInventory) {
          await tx.insert(inventoryTable)
            .values({ replitUserId: userId, name: item.name, category: item.category, quantity: item.quantity })
            .onConflictDoNothing();
        }
      } catch (err) {
        req.log.warn({ err }, "Demo load: inventory inserts failed (non-fatal)");
      }
    });
  } catch (err) {
    req.log.warn({ err }, "Demo load: transaction failed (returning success anyway)");
  }

  res.json({ success: true });
});

export default router;
