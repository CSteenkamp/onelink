import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  generateLoginCode,
  createSessionToken,
  isValidSlug,
  isValidUrl,
  sanitizeString,
} from "@/lib/auth";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, displayName, bio, avatarUrl, theme, password } = body;

    if (!slug || !displayName || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim();
    if (!isValidSlug(cleanSlug)) {
      return NextResponse.json(
        { error: "Username must be 3-30 characters, only lowercase letters, numbers, hyphens, underscores" },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (displayName.trim().length < 1 || displayName.trim().length > 100) {
      return NextResponse.json({ error: "Display name must be 1-100 characters" }, { status: 400 });
    }
    if (bio && bio.length > 280) {
      return NextResponse.json({ error: "Bio must be 280 characters or less" }, { status: 400 });
    }
    if (avatarUrl && !isValidUrl(avatarUrl)) {
      return NextResponse.json({ error: "Avatar URL must be a valid http/https URL" }, { status: 400 });
    }

    const existing = await prisma.profile.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    const loginCode = generateLoginCode();
    const hashedPassword = await hashPassword(password);

    const profile = await prisma.profile.create({
      data: {
        slug: cleanSlug,
        displayName: sanitizeString(displayName, 100),
        bio: bio ? sanitizeString(bio, 280) : null,
        avatarUrl: avatarUrl || null,
        theme: theme || "midnight",
        loginCode,
        adminPassword: hashedPassword,
      },
    });

    const sessionToken = createSessionToken(profile.id);

    const response = NextResponse.json({
      profile: { id: profile.id, slug: profile.slug },
      loginCode,
      sessionToken,
    });
    response.cookies.set("onelink_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.error("Create profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
