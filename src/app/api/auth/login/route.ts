import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken } from "@/lib/auth";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export async function POST(req: NextRequest) {
  try {
    const { loginCode, password } = await req.json();
    if (!loginCode || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { loginCode: loginCode.trim().toUpperCase() },
    });

    const valid = profile
      ? await verifyPassword(password, profile.adminPassword)
      : await verifyPassword(password, "$2a$12$invalidhashpaddingtopreventshortexit");

    if (!profile || !valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
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
