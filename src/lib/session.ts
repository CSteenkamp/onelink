import { NextRequest } from "next/server";
import { parseSessionToken, type SessionData } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Extract and verify session from request.
 * Checks Authorization header first, then falls back to cookie.
 * Returns profileId only if tokenVersion matches the database.
 */
export async function getProfileIdFromRequest(req: NextRequest): Promise<string | null> {
  const token =
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    req.cookies.get("onelink_session")?.value;
  if (!token) return null;

  const session = parseSessionToken(token);
  if (!session) return null;

  // Verify tokenVersion against database
  const profile = await prisma.profile.findUnique({
    where: { id: session.profileId },
    select: { tokenVersion: true },
  });

  if (!profile || profile.tokenVersion !== session.tokenVersion) {
    return null;
  }

  return session.profileId;
}

/**
 * Extract session data without database verification.
 * Use only when you need the raw token data.
 */
export function getSessionDataFromRequest(req: NextRequest): SessionData | null {
  const token =
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    req.cookies.get("onelink_session")?.value;
  if (!token) return null;
  return parseSessionToken(token);
}
