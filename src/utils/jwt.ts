import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import Cookies from "cookies";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
const COOKIE_NAME = "access_token";
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

type TokenPayload = {
  userId: string;
};

function parseCookie(req: Request, name: string) {
  const header = req.headers.cookie;

  if (!header) {
    return null;
  }

  const match = header
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.slice(name.length + 1));
}

export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as TokenPayload & jwt.JwtPayload;
}

export function getTokenFromRequest(req: Request) {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  return parseCookie(req, COOKIE_NAME);
}

export function setAuthCookie(req: Request, res: Response, token: string) {
  const cookies = new Cookies(req, res);
  cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE_MS,
    sameSite: "lax",
    path: "/",
  });
}

export function clearAuthCookie(req: Request, res: Response) {
  const cookies = new Cookies(req, res);
  cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    maxAge: 0,
    sameSite: "lax",
    path: "/",
  });
}
