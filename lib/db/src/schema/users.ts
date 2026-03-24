import { pgTable, serial, text, real, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const profilesTable = pgTable("profiles", {
  id: serial("id").primaryKey(),
  age: integer("age"),
  gender: text("gender"),
  heightCm: real("height_cm"),
  weightKg: real("weight_kg"),
  bloodType: text("blood_type"),
  activityLevel: text("activity_level"),
  dietaryPreferences: jsonb("dietary_preferences").$type<string[]>().default([]).notNull(),
  healthGoals: jsonb("health_goals").$type<string[]>().default([]).notNull(),
  allergies: jsonb("allergies").$type<string[]>().default([]).notNull(),
  medicalConditions: jsonb("medical_conditions").$type<string[]>().default([]).notNull(),
  labValues: jsonb("lab_values").$type<Record<string, number | null>>(),
  dailyCalorieTarget: real("daily_calorie_target"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProfileSchema = createInsertSchema(profilesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profilesTable.$inferSelect;

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  geminiApiKey: text("gemini_api_key"),
  defaultMealType: text("default_meal_type").default("other").notNull(),
  unitSystem: text("unit_system").default("metric").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingsSchema = createInsertSchema(settingsTable).omit({ id: true, updatedAt: true });
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settingsTable.$inferSelect;
