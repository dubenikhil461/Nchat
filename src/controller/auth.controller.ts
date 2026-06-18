import type { RequestHandler } from "express";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db } from "../config/db.ts";
import { publisher } from "../config/redis.ts";
import { Auth } from "../schemas/auth.schema.ts";
import type { LoginInput, RegisterInput } from "../validations/auth.validation.ts";
import {
  clearAuthCookie,
  getTokenFromRequest,
  setAuthCookie,
  signToken,
} from "../utils/jwt.ts";
import { hashPassword, verifyPassword } from "../utils/password.ts";
import { sanitizeUser } from "../utils/sanitize-user.ts";

function createUserId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 6);
}

async function blacklistToken(token: string) {
  const decoded = jwt.decode(token) as jwt.JwtPayload | null;

  if (!decoded?.exp) {
    return;
  }

  const ttlMs = decoded.exp * 1000 - Date.now();

  if (ttlMs <= 0) {
    return;
  }

  await publisher.set(`blacklist:${token}`, "1", "PX", ttlMs);
}

export const register: RequestHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body as RegisterInput;

    const [existingUser] = await db
      .select({ id: Auth.id })
      .from(Auth)
      .where(eq(Auth.email, email));

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const { hash, salt } = await hashPassword(password);
    const id = createUserId();

    await db.insert(Auth).values({
      id,
      name,
      email,
      password: hash,
      saltString: salt,
    });

    const [user] = await db.select().from(Auth).where(eq(Auth.id, id));

    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Failed to create user",
      });
    }

    const token = signToken(user.id);
    setAuthCookie(req, res, token);

    return res.status(201).json({
      success: true,
      data: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body as LoginInput;

    const [user] = await db.select().from(Auth).where(eq(Auth.email, email));

    if (!user?.password || !user.saltString) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked",
      });
    }

    const isValidPassword = await verifyPassword(
      password,
      user.password,
      user.saltString,
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = signToken(user.id);
    setAuthCookie(req, res, token);

    return res.status(200).json({
      success: true,
      data: sanitizeUser(user),
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
  }
};

export const logout: RequestHandler = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);

    if (token) {
      await blacklistToken(token);
    }

    clearAuthCookie(req, res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
