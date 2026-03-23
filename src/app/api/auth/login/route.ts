import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken } from "@/lib/auth";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, loginCode, password } = body;

    if ((!slug && !loginCode) || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    let profile;
    if (slug) {
      profile = await prisma.profile.findUnique({
        where: { slug: slug.trim().toLowerCase() },
      });
    } else {
      profile = await prisma.profile.findUnique({
        where: { loginCode: loginCode.trim().toUpperCase() },
      });
    }

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
