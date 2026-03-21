import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { loginCode, password } = await req.json();
    if (!loginCode || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { loginCode: loginCode.trim().toUpperCase() },
    });
    if (!profile) {
      return NextResponse.json({ error: "Invalid login code" }, { status: 401 });
    }

    const valid = await verifyPassword(password, profile.adminPassword);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const sessionToken = createSessionToken(profile.id);
    return NextResponse.json({ sessionToken, slug: profile.slug });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
