import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, parseSessionToken } from "@/lib/auth";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// POST: Login with slug + password (also supports legacy loginCode)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, loginCode, password } = body;

    if ((!slug && !loginCode) || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    let profile;
    if (slug) {
      profile = await prisma.profile.findUnique({ where: { slug: slug.trim().toLowerCase() } });
    } else {
      profile = await prisma.profile.findUnique({ where: { loginCode: loginCode.trim().toUpperCase() } });
    }

    // Constant-time: always verify even if profile not found (prevents timing attack)
    const valid = profile
      ? await verifyPassword(password, profile.adminPassword)
      : await verifyPassword(password, "$2a$12$invalidhashpaddingtopreventshortexit");

    if (!profile || !valid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const sessionToken = createSessionToken(profile.id);
    const response = NextResponse.json({ sessionToken, slug: profile.slug });
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
    const token =
      req.headers.get("authorization")?.replace("Bearer ", "") ||
      req.cookies.get("onelink_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profileId = parseSessionToken(token);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        links: { orderBy: { order: "asc" } },
        socialLinks: { orderBy: { order: "asc" } },
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
        theme: profile.theme,
        plan: profile.plan,
        views: profile.views,
        loginCode: profile.loginCode,
      },
      links: profile.links,
      socialLinks: profile.socialLinks,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
