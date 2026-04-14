import { Router, type IRouter } from "express";
import { z } from "zod";
import { analyzeImage, generateText, isOverloadedError } from "../lib/gemini";
import { AnalyzeFoodBody, AnalyzeFoodResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const FOOD_ANALYSIS_PROMPT = `Analyze this food or drink image and return a JSON object with the following structure. Be precise and thorough.

CRITICAL DESCRIPTION RULE: The "description" field must describe the food or drink item itself — what it is, its estimated serving size, and key nutritional highlights. Never describe the scene, the person, or the packaging context. Do not mention hands, people, backgrounds, or how the item is being held. If a packaged product is visible, identify the product by name and describe its contents, not the act of holding it. Example of what NOT to write: "A person is holding a bottle of..." or "A hand is visible holding...". Example of what to write: "500ml bottle of Innocent Orange Juice — 225 kcal per serving, high in vitamin C, 44g natural sugars."

{
  "analysisType": "meal",
  "description": "What the food/drink IS — its name, estimated serving size, and key nutritional highlights",
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

const FOOD_ANALYSIS_PERMISSIVE_PROMPT = `Look at this image carefully. Even if the food or drink is partially visible, dimly lit, or mixed with other items, identify any food or drink items you can see and estimate their nutritional content. If you see a menu, read the text and identify the dish.

CRITICAL DESCRIPTION RULE: The "description" field must describe the food or drink item itself — what it is, its estimated serving size, and key nutritional highlights. Never describe the scene, person, or packaging context. Do not mention hands, people, backgrounds, or how the item is being held.

Return a JSON object with the same structure as a normal food analysis:

{
  "analysisType": "meal",
  "description": "What the food/drink IS — its name, estimated serving size, and key nutritional highlights",
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

const TEXT_ANALYSIS_PROMPT = (foodName: string, ingredients: string | null | undefined, portionSize: string | null | undefined) => `
You are a precise nutrition scientist. Estimate the full nutritional breakdown for the following food entry.

Food name: "${foodName}"
${ingredients ? `Ingredients / components: ${ingredients}` : ""}
${portionSize ? `Portion size: ${portionSize}` : ""}

Return a JSON object in EXACTLY this format — no extra text, no markdown, just valid JSON:

{
  "analysisType": "meal",
  "description": "${portionSize ? portionSize + " of " : ""}${foodName}${ingredients ? " — key ingredients: " + ingredients.slice(0, 80) : ""}. Nutritional estimates based on standard food composition databases.",
  "items": [
    {
      "name": "${foodName}",
      "quantity": "${portionSize || "1 serving"}",
      "confidence": 0.85,
      "nutrients": {
        "calories": 0,
        "protein": 0,
        "carbohydrates": 0,
        "sugar": 0,
        "fiber": 0,
        "fat": 0,
        "saturatedFat": 0,
        "transFat": 0,
        "cholesterol": 0,
        "micronutrients": {
          "vitaminA": 0, "vitaminB1": 0, "vitaminB2": 0, "vitaminB3": 0,
          "vitaminB6": 0, "vitaminB9": 0, "vitaminB12": 0, "vitaminC": 0,
          "vitaminD": 0, "vitaminE": 0, "vitaminK": 0,
          "calcium": 0, "iron": 0, "magnesium": 0, "phosphorus": 0,
          "potassium": 0, "sodium": 0, "zinc": 0, "selenium": 0,
          "copper": 0, "manganese": 0, "chromium": 0, "iodine": 0,
          "omega3": 0, "omega6": 0
        }
      }
    }
  ],
  "totalNutrients": {
    "calories": 0,
    "protein": 0,
    "carbohydrates": 0,
    "sugar": 0,
    "fiber": 0,
    "fat": 0,
    "saturatedFat": 0,
    "transFat": 0,
    "cholesterol": 0,
    "micronutrients": {
      "vitaminA": 0, "vitaminB1": 0, "vitaminB2": 0, "vitaminB3": 0,
      "vitaminB6": 0, "vitaminB9": 0, "vitaminB12": 0, "vitaminC": 0,
      "vitaminD": 0, "vitaminE": 0, "vitaminK": 0,
      "calcium": 0, "iron": 0, "magnesium": 0, "phosphorus": 0,
      "potassium": 0, "sodium": 0, "zinc": 0, "selenium": 0,
      "copper": 0, "manganese": 0, "chromium": 0, "iodine": 0,
      "omega3": 0, "omega6": 0
    }
  },
  "inventoryItems": []
}

Replace ALL zeros with accurate numeric estimates from standard food composition databases (USDA, NIH, etc). Never return null — use 0 only if a nutrient is truly absent. Calories in kcal. Protein/carbs/fat/fiber in grams. Vitamins in mg or mcg. Minerals in mg or mcg.
`;

const AnalyzeTextBody = z.object({
  foodName: z.string().min(1),
  ingredients: z.string().nullable().optional(),
  portionSize: z.string().nullable().optional(),
  geminiApiKey: z.string().nullable().optional(),
});

router.post("/analyze/text", async (req, res) => {
  const parseResult = AnalyzeTextBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "validation_error", message: parseResult.error.message });
    return;
  }

  const { foodName, ingredients, portionSize, geminiApiKey } = parseResult.data;

  try {
    const prompt = TEXT_ANALYSIS_PROMPT(foodName, ingredients, portionSize);
    const raw = await generateText(prompt, geminiApiKey ?? undefined);

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      parsed = {
        analysisType: "meal",
        description: `${portionSize ? portionSize + " of " : ""}${foodName}`,
        items: [],
        totalNutrients: { calories: 0, protein: 0, carbohydrates: 0, fat: 0 },
        inventoryItems: [],
      };
    }

    const validated = AnalyzeFoodResponse.safeParse(parsed);
    res.json(validated.success ? validated.data : { ...parsed, _warning: "Response validation warning" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    if (message.includes("No Gemini API key")) {
      res.status(400).json({ error: "no_api_key", message });
      return;
    }
    if (isOverloadedError(err)) {
      res.status(503).json({ error: "ai_busy", message: "Our AI is a little busy right now — please try again in a moment" });
      return;
    }
    req.log.error({ err }, "Text food analysis error");
    res.status(500).json({ error: "analysis_failed", message });
  }
});

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
          parsed = parseRaw(retryRaw);
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
    if (isOverloadedError(err)) {
      res.status(503).json({ error: "ai_busy", message: "Our AI is a little busy right now — please try again in a moment" });
      return;
    }
    req.log.error({ err }, "Food analysis error");
    res.status(500).json({ error: "analysis_failed", message });
  }
});

export default router;
