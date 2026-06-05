import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { inventoryTable } from "@workspace/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

import {
  AddInventoryItemBody,
  UpdateInventoryItemBody,
  UpdateInventoryItemParams,
  DeleteInventoryItemParams,
} from "@workspace/api-zod";

function getUserId(req: Request, res: Response): string | null {
  if (!req.user?.id) {
    res.status(401).json({ error: "unauthorized", message: "Authentication required" });
    return null;
  }
  return req.user.id;
}

const router: IRouter = Router();

router.get("/inventory", async (req, res) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  try {
    const items = await db
      .select()
      .from(inventoryTable)
      .where(eq(inventoryTable.replitUserId, userId))
      .orderBy(desc(inventoryTable.addedAt));

    res.json({ items, total: items.length });
  } catch (err) {
    req.log.error({ err }, "Failed to get inventory");
    res.status(500).json({ error: "db_error", message: "Failed to get inventory" });
  }
});

router.post("/inventory", async (req, res) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  const parseResult = AddInventoryItemBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "validation_error", message: parseResult.error.message });
    return;
  }

  const { name, category, quantity, unit, expiryDate, notes } = parseResult.data;

  try {
    // Check for an existing item with the same name (case-insensitive) for this user
    const [existing] = await db
      .select()
      .from(inventoryTable)
      .where(and(eq(inventoryTable.replitUserId, userId), sql`lower(${inventoryTable.name}) = lower(${name})`))
      .limit(1);

    if (existing) {
      // Return the existing item so the UI can show it's already tracked
      res.status(200).json({ ...existing, duplicate: true });
      return;
    }

    const [created] = await db
      .insert(inventoryTable)
      .values({
        replitUserId: userId,
        name,
        category,
        quantity: quantity ?? null,
        unit: unit ?? null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        notes: notes ?? null,
      })
      .returning();

    res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Failed to add inventory item");
    res.status(500).json({ error: "db_error", message: "Failed to add inventory item" });
  }
});

router.put("/inventory/:id", async (req, res) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  const paramsResult = UpdateInventoryItemParams.safeParse(req.params);
  if (!paramsResult.success) {
    res.status(400).json({ error: "validation_error", message: "Invalid ID" });
    return;
  }

  const bodyResult = UpdateInventoryItemBody.safeParse(req.body);
  if (!bodyResult.success) {
    res.status(400).json({ error: "validation_error", message: bodyResult.error.message });
    return;
  }

  const { id } = paramsResult.data;
  const { name, category, quantity, unit, expiryDate, notes } = bodyResult.data;

  try {
    const [updated] = await db
      .update(inventoryTable)
      .set({
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        quantity: quantity ?? null,
        unit: unit ?? null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        notes: notes ?? null,
        updatedAt: new Date(),
      })
      .where(and(eq(inventoryTable.id, id), eq(inventoryTable.replitUserId, userId)))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "not_found", message: "Inventory item not found" });
      return;
    }

    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update inventory item");
    res.status(500).json({ error: "db_error", message: "Failed to update inventory item" });
  }
});

router.delete("/inventory/:id", async (req, res) => {
  const userId = getUserId(req, res);
  if (!userId) return;

  const paramsResult = DeleteInventoryItemParams.safeParse(req.params);
  if (!paramsResult.success) {
    res.status(400).json({ error: "validation_error", message: "Invalid ID" });
    return;
  }

  try {
    const deleted = await db
      .delete(inventoryTable)
      .where(and(eq(inventoryTable.id, paramsResult.data.id), eq(inventoryTable.replitUserId, userId)))
      .returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "not_found", message: "Inventory item not found" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete inventory item");
    res.status(500).json({ error: "db_error", message: "Failed to delete inventory item" });
  }
});

export default router;
