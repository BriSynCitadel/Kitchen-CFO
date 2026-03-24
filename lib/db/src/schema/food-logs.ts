import { pgTable, serial, text, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const foodLogsTable = pgTable("food_logs", {
  id: serial("id").primaryKey(),
  foodName: text("food_name").notNull(),
  quantity: text("quantity"),
  mealType: text("meal_type").notNull().default("other"),
  nutrients: jsonb("nutrients").$type<Record<string, unknown>>().notNull(),
  imageBase64: text("image_base64"),
  notes: text("notes"),
  loggedAt: timestamp("logged_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFoodLogSchema = createInsertSchema(foodLogsTable).omit({ id: true, createdAt: true });
export type InsertFoodLog = z.infer<typeof insertFoodLogSchema>;
export type FoodLog = typeof foodLogsTable.$inferSelect;

