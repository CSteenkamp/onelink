import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const profile = await prisma.profile.findFirst({ where: { email } });
    if (!profile) {
      // Don't reveal whether the email exists
      return NextResponse.json({ message: "If an account exists with that email, a magic link has been sent." });
    }

    // In production, send email with verification link
    // For now, return success message
    return NextResponse.json({ message: "If an account exists with that email, a magic link has been sent." });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
