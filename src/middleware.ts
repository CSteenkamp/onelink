import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (resets on server restart; use Redis for multi-instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  entry.count++;
  const allowed = entry.count <= limit;
  return { allowed, remaining: Math.max(0, limit - entry.count) };
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  });
}, 5 * 60 * 1000);

// Rate limit configs per route pattern
const RATE_LIMITS: { pattern: RegExp; limit: number; windowMs: number }[] = [
  // Auth: 10 attempts per 15 min
  { pattern: /^\/api\/admin\/auth$/, limit: 10, windowMs: 15 * 60 * 1000 },
  { pattern: /^\/api\/auth\/login$/, limit: 10, windowMs: 15 * 60 * 1000 },
  // Signup: 5 per hour
  { pattern: /^\/api\/profiles\/create$/, limit: 5, windowMs: 60 * 60 * 1000 },
  // Click/view tracking: 30 per minute per IP
  { pattern: /^\/api\/links\/[^/]+\/click$/, limit: 30, windowMs: 60 * 1000 },
  { pattern: /^\/api\/views\//, limit: 30, windowMs: 60 * 1000 },
  // Password reset: 5 per hour
  { pattern: /^\/api\/auth\/forgot-password$/, limit: 5, windowMs: 60 * 60 * 1000 },
  { pattern: /^\/api\/auth\/reset-password$/, limit: 10, windowMs: 60 * 60 * 1000 },
  // Image upload: 20 per hour
  { pattern: /^\/api\/upload$/, limit: 20, windowMs: 60 * 60 * 1000 },
  // Slug check: 30 per minute
  { pattern: /^\/api\/profiles\/check-slug$/, limit: 30, windowMs: 60 * 1000 },
  // General API: 100 per minute
  { pattern: /^\/api\//, limit: 100, windowMs: 60 * 1000 },
];

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self'; connect-src 'self' https://linkist-data.s3.us-east-1.amazonaws.com; frame-ancestors 'none';",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const ip = getClientIp(req);

    for (const config of RATE_LIMITS) {
      if (config.pattern.test(pathname)) {
        const key = `${ip}:${config.pattern.source}`;
        const { allowed, remaining } = rateLimit(key, config.limit, config.windowMs);

        if (!allowed) {
          return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            {
              status: 429,
              headers: {
                "Retry-After": "60",
                "X-RateLimit-Remaining": "0",
              },
            }
          );
        }

        // Add rate limit headers to the response later
        const response = NextResponse.next();
        response.headers.set("X-RateLimit-Remaining", String(remaining));
        // Add security headers
        for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
          response.headers.set(key, value);
        }
        return response;
      }
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and _next internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
