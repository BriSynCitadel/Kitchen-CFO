import { pgTable, serial, jsonb, timestamp, integer, text } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const recommendationItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  reason: z.string(),
  category: z.enum(["meal", "snack", "ingredient", "nutrient_tip"]),
  ingredients: z.array(z.string()),
  priority: z.enum(["high", "medium", "low"]),
});

export type RecommendationItem = z.infer<typeof recommendationItemSchema>;

export const recommendationsTable = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  items: jsonb("items").$type<RecommendationItem[]>().notNull().default([]),
  basedOn: jsonb("based_on").$type<{
    profileComplete: boolean;
    inventoryItemCount: number;
    recentLogCount: number;
  }>().notNull().default({ profileComplete: false, inventoryItemCount: 0, recentLogCount: 0 }),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Recommendations = typeof recommendationsTable.$inferSelect;
