import { Router } from "express";
import { db } from "../db/db";
import { events } from "../db/schema";
import { requireAdmin } from "../middleware/requireAdmin";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/:projectId", async (req, res) => {
  const { projectId } = req.params;

  try {
    const result = await db
      .select()
      .from(events)
      .where(eq(events.projectId, Number(projectId)))
      .orderBy(events.id);

    res.json(result);
  } catch (err) {
    console.error(projectId, err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  const [e] = await db.insert(events).values(req.body).returning();
  res.json(e);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const [e] = await db.update(events).set(req.body).where(eq(events.id, +req.params.id)).returning();
  res.json(e);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(events).where(eq(events.id, +req.params.id));
  res.json({ ok: true });
});

export default router;
