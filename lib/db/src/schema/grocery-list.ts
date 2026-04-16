import { pgTable, serial, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";

export type GroceryItem = {
  name: string;
  category: "whole_food" | "produce" | "spice" | "condiment" | "pantry";
  why: string | null;
  targetMarker: string | null;
  alreadyOwned: boolean;
};

export const groceryListsTable = pgTable("grocery_lists", {
  id: serial("id").primaryKey(),
  replitUserId: varchar("replit_user_id").notNull().default("demo_user"),
  items: jsonb("items").$type<GroceryItem[]>().notNull().default([]),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export type GroceryList = typeof groceryListsTable.$inferSelect;
