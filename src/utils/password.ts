import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;

  return {
    hash: hash.toString("hex"),
    salt,
  };
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string,
) {
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const stored = Buffer.from(hash, "hex");

  if (derived.length !== stored.length) {
    return false;
  }

  return timingSafeEqual(derived, stored);
}
