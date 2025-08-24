import { Router } from "express";
import { db } from "../db/db";
import { projects } from "../db/schema";
import { requireAdmin } from "../middleware/requireAdmin";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const ps = await db.select().from(projects);
  res.json(ps);
});

router.post("/", requireAdmin, async (req, res) => {
  const [p] = await db.insert(projects).values(req.body).returning();
  res.json(p);
});

router.put("/:id", requireAdmin, async (req, res) => {
  const [p] = await db.update(projects).set(req.body).where(eq(projects.id, +req.params.id)).returning();
  res.json(p);
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
      return res.status(400).send('Invalid ID'); // Handle invalid ID
  }
  console.log(req.params)
  try {
      await db.delete(projects).where(eq(projects.id, id));
      console.log('Project deleted successfully');
  } catch (error) {
      console.error('Error deleting project:', error);
      return res.status(500).send('Internal Server Error');
  }
  res.json({ ok: true });
});

export default router;
