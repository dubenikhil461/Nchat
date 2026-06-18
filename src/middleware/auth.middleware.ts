import type { RequestHandler } from "express";
import { eq } from "drizzle-orm";
import { db } from "../config/db.ts";
import { publisher } from "../config/redis.ts";
import { Auth } from "../schemas/auth.schema.ts";
import { getTokenFromRequest, verifyToken } from "../utils/jwt.ts";

async function isTokenBlacklisted(token: string) {
  const blacklisted = await publisher.get(`blacklist:${token}`);
  return Boolean(blacklisted);
}

export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (await isTokenBlacklisted(token)) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    const payload = verifyToken(token);
    const userId = payload.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const [user] = await db
      .select()
      .from(Auth)
      .where(eq(Auth.id, userId));

    if (!user || user.isBlocked) {
      return res.status(401).json({
        success: false,
        message: "User not found or blocked",
      });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
