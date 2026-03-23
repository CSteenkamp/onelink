import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken } from "@/lib/auth";
import { getProfileIdFromRequest } from "@/lib/session";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// POST: Login with email + password
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { email: email.toLowerCase().trim() } });

    // Constant-time: always verify even if profile not found (prevents timing attack)
    const valid = profile
      ? await verifyPassword(password, profile.adminPassword)
      : await verifyPassword(password, "$2a$12$invalidhashpaddingtopreventshortexit");

    if (!profile || !valid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const sessionToken = createSessionToken(profile.id, profile.tokenVersion);
    const response = NextResponse.json({ slug: profile.slug });
    response.cookies.set("onelink_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: Verify session and return profile data (used by admin dashboard)
export async function PUT(req: NextRequest) {
  try {
    const profileId = await getProfileIdFromRequest(req);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        socialLinks: { orderBy: { order: "asc" } },
        subscription: { select: { status: true } },
      },
    });
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    return NextResponse.json({
      profile: {
        id: profile.id,
        slug: profile.slug,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        headerImage: profile.headerImage,
        theme: profile.theme,
        plan: profile.plan,
        views: profile.views,
        email: profile.email,
        subscriptionStatus: profile.subscription?.status || null,
      },
      socialLinks: profile.socialLinks,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
