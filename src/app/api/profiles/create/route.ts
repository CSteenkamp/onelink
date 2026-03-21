import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateLoginCode, createSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, displayName, bio, avatarUrl, theme, password } = body;

    if (!slug || !displayName || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (slug.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await prisma.profile.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    const loginCode = generateLoginCode();
    const hashedPassword = await hashPassword(password);

    const profile = await prisma.profile.create({
      data: {
        slug: slug.toLowerCase(),
        displayName,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
        theme: theme || "midnight",
        loginCode,
        adminPassword: hashedPassword,
      },
    });

    const sessionToken = createSessionToken(profile.id);

    return NextResponse.json({
      profile: { id: profile.id, slug: profile.slug },
      loginCode,
      sessionToken,
    });
  } catch (error) {
    console.error("Create profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
