import bcrypt from "bcryptjs";

import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "onelink-default-secret-change-me";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function generateLoginCode(): string {
  return crypto.randomBytes(6).toString("hex").toUpperCase();
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createSessionToken(profileId: string): string {
  const payload = JSON.stringify({
    sub: profileId,
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

export function parseSessionToken(token: string): string | null {
  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return null;

    // Verify signature
    const expectedSig = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(payloadB64)
      .digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    // Parse and check expiry
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString());
    if (!payload.sub || !payload.exp || Date.now() > payload.exp) {
      return null;
    }

    return payload.sub;
  } catch {
    return null;
  }
}

// Validation helpers
const URL_REGEX = /^https?:\/\/.+/;

export function isValidUrl(url: string): boolean {
  return URL_REGEX.test(url);
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
