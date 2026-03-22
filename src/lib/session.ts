import { NextRequest } from "next/server";
import { parseSessionToken } from "@/lib/auth";

/**
 * Extract and verify session from request.
 * Checks Authorization header first, then falls back to cookie.
 */
export function getProfileIdFromRequest(req: NextRequest): string | null {
  const token =
    req.headers.get("authorization")?.replace("Bearer ", "") ||
    req.cookies.get("onelink_session")?.value;
  if (!token) return null;
  return parseSessionToken(token);
}
