import bcrypt from "bcryptjs";

import crypto from "crypto";

const JWT_SECRET: string = process.env.JWT_SECRET || "linkist-default-secret-change-in-prod";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createSessionToken(profileId: string, tokenVersion: number = 0): string {
  const payload = JSON.stringify({
    sub: profileId,
    tv: tokenVersion,
    iat: Date.now(),
    exp: Date.now() + SESSION_MAX_AGE_MS,
  });
  const payloadB64 = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(payloadB64)
    .digest("base64url");
  return `${payloadB64}.${signature}`;
}

export interface SessionData {
  profileId: string;
  tokenVersion: number;
}

export function parseSessionToken(token: string): SessionData | null {
  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return null;

    // Verify signature
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(payloadB64)
      .digest("base64url");

    const sigBuf = Buffer.from(signature);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    // Parse and check expiry
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    if (!payload.sub || !payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return { profileId: payload.sub, tokenVersion: payload.tv ?? 0 };
  } catch {
    return null;
  }
}

// Validation helpers
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9_-]{3,30}$/.test(slug);
}

export function sanitizeString(str: string, maxLength: number): string {
  return str.trim().slice(0, maxLength);
}
