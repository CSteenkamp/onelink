import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export function generateLoginCode(): string {
  return uuidv4().replace(/-/g, "").substring(0, 12).toUpperCase();
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createSessionToken(profileId: string): string {
  const payload = `${profileId}:${Date.now()}`;
  return Buffer.from(payload).toString("base64");
}

export function parseSessionToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const [profileId] = decoded.split(":");
    return profileId || null;
  } catch {
    return null;
  }
}
