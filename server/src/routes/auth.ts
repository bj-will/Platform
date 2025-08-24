import { Router } from "express";
import { db } from "../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }
  const [user] = await db.select().from(users).where(eq(users.wallet, username));
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token });
});

export default router;