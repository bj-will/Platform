import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET) as { role: string };
    if (payload.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
