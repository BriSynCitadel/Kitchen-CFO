import { Router, type IRouter } from "express";
import { analyzeImage } from "../lib/gemini";
import { AnalyzeFoodBody, AnalyzeFoodResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const FOOD_ANALYSIS_PROMPT = `Analyze this food image and return a JSON object with the following structure. Be precise and thorough.

{
  "analysisType": "meal",
  "description": "Brief description of what you see",
  "items": [
    {
      "name": "Food item name",
      "quantity": "Estimated portion (e.g. '1 cup', '200g', '1 medium')",
      "confidence": 0.95,
      "nutrients": {
        "calories": 250,
        "protein": 15,
        "carbohydrates": 30,
        "sugar": 5,
        "fiber": 3,
        "fat": 8,
        "saturatedFat": 2,
        "transFat": 0,
        "cholesterol": 45,
        "micronutrients": {
          "vitaminA": 150, "vitaminB1": 0.2, "vitaminB2": 0.3, "vitaminB3": 5,
          "vitaminB6": 0.4, "vitaminB9": 40, "vitaminB12": 1.2, "vitaminC": 15,
          "vitaminD": 2, "vitaminE": 1.5, "vitaminK": 20,
          "calcium": 120, "iron": 2.5, "magnesium": 35, "phosphorus": 180,
          "potassium": 400, "sodium": 300, "zinc": 1.5, "selenium": 12,
          "copper": 0.2, "manganese": 0.5, "chromium": 8, "iodine": 45,
          "omega3": 0.3, "omega6": 1.2
        }
      }
    }
  ],
  "totalNutrients": {
    "calories": 250,
    "protein": 15,
    "carbohydrates": 30,
    "sugar": 5,
    "fiber": 3,
    "fat": 8,
    "saturatedFat": 2,
    "transFat": 0,
    "cholesterol": 45,
    "micronutrients": { same structure as above, totaled across all items }
  },
  "inventoryItems": []
}

For all numeric nutrient values, use reasonable scientific estimates based on standard food composition databases. Never return null for nutrients - use 0 if trace/negligible. Calories in kcal. Protein/carbs/fat/fiber in grams. Vitamins in mg or mcg as appropriate. Minerals in mg or mcg as appropriate.`;

const RECEIPT_ANALYSIS_PROMPT = `Analyze this receipt/grocery list image. Return a JSON object listing all food/grocery items found:

{
  "analysisType": "receipt",
  "description": "Receipt/grocery items identified",
  "items": [],
  "totalNutrients": { "calories": 0, "protein": 0, "carbohydrates": 0, "fat": 0 },
  "inventoryItems": [
    {
      "name": "Item name",
      "quantity": "Amount if visible",
      "category": "produce|protein|dairy|grains|pantry|beverages|condiments|frozen|other"
    }
  ]
}

Focus on extracting all food items. Guess categories intelligently.`;

const INVENTORY_ANALYSIS_PROMPT = `Analyze this photo of a fridge, pantry, or kitchen shelf. List all identifiable food items:

{
  "analysisType": "inventory",
  "description": "Items identified in the photo",
  "items": [],
  "totalNutrients": { "calories": 0, "protein": 0, "carbohydrates": 0, "fat": 0 },
  "inventoryItems": [
    {
      "name": "Item name",
      "quantity": "Estimated amount if visible",
      "category": "produce|protein|dairy|grains|pantry|beverages|condiments|frozen|other"
    }
  ]
}`;

const FOOD_ANALYSIS_PERMISSIVE_PROMPT = `Look at this image carefully. Even if the food is partially visible, dimly lit, or mixed with other items, identify any food items you can see and estimate their nutritional content. If you see a menu, read the text and identify the dish.

Return a JSON object with the same structure as a normal food analysis:

{
  "analysisType": "meal",
  "description": "Brief description of what you see",
  "items": [
    {
      "name": "Food item name",
      "quantity": "Estimated portion (e.g. '1 cup', '200g', '1 medium')",
      "confidence": 0.7,
      "nutrients": {
        "calories": 250,
        "protein": 15,
        "carbohydrates": 30,
        "sugar": 5,
        "fiber": 3,
        "fat": 8,
        "saturatedFat": 2,
        "transFat": 0,
        "cholesterol": 45,
        "micronutrients": {
          "vitaminA": 150, "vitaminB1": 0.2, "vitaminB2": 0.3, "vitaminB3": 5,
          "vitaminB6": 0.4, "vitaminB9": 40, "vitaminB12": 1.2, "vitaminC": 15,
          "vitaminD": 2, "vitaminE": 1.5, "vitaminK": 20,
          "calcium": 120, "iron": 2.5, "magnesium": 35, "phosphorus": 180,
          "potassium": 400, "sodium": 300, "zinc": 1.5, "selenium": 12,
          "copper": 0.2, "manganese": 0.5, "chromium": 8, "iodine": 45,
          "omega3": 0.3, "omega6": 1.2
        }
      }
    }
  ],
  "totalNutrients": {
    "calories": 250,
    "protein": 15,
    "carbohydrates": 30,
    "sugar": 5,
    "fiber": 3,
    "fat": 8,
    "saturatedFat": 2,
    "transFat": 0,
    "cholesterol": 45,
    "micronutrients": { same structure as above, totaled across all items }
  },
  "inventoryItems": []
}

For all numeric nutrient values, use reasonable scientific estimates. Never return null for nutrients - use 0 if trace/negligible.`;

router.post("/analyze", async (req, res) => {
  const parseResult = AnalyzeFoodBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "validation_error", message: parseResult.error.message });
    return;
  }

  const { imageBase64, mimeType = "image/jpeg", analysisType = "meal", geminiApiKey } = parseResult.data;

  const prompt =
    analysisType === "receipt"
      ? RECEIPT_ANALYSIS_PROMPT
      : analysisType === "inventory"
        ? INVENTORY_ANALYSIS_PROMPT
        : FOOD_ANALYSIS_PROMPT;

  const parseRaw = (raw: string): Record<string, unknown> => {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return {
        analysisType,
        description: "Unable to parse analysis",
        items: [],
        totalNutrients: { calories: 0, protein: 0, carbohydrates: 0, fat: 0 },
        inventoryItems: [],
      };
    }
  };

  try {
    const raw = await analyzeImage(imageBase64, mimeType, prompt, geminiApiKey ?? undefined);
    let parsed = parseRaw(raw);

    // Auto-retry meal scans that return zero items using a more permissive prompt
    if (analysisType === "meal") {
      const items = parsed.items;
      if (!Array.isArray(items) || items.length === 0) {
        req.log.info("Meal scan returned no items — retrying with permissive prompt");
        try {
          const retryRaw = await analyzeImage(imageBase64, mimeType, FOOD_ANALYSIS_PERMISSIVE_PROMPT, geminiApiKey ?? undefined);
          const retryParsed = parseRaw(retryRaw);
          const retryItems = retryParsed.items;
          if (Array.isArray(retryItems) && retryItems.length > 0) {
            parsed = retryParsed;
          }
        } catch {
          // Retry failed — fall through and return the original empty result
        }
      }
    }

    const validated = AnalyzeFoodResponse.safeParse(parsed);
    if (!validated.success) {
      res.json({ ...parsed, _warning: "Response validation warning" });
    } else {
      res.json(validated.data);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    if (message.includes("No Gemini API key")) {
      res.status(400).json({ error: "no_api_key", message });
      return;
    }
    req.log.error({ err }, "Food analysis error");
    res.status(500).json({ error: "analysis_failed", message });
  }
});

export default router;
