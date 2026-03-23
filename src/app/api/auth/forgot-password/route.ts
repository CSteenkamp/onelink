import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always return success to prevent email enumeration
    if (!profile) {
      return NextResponse.json({ success: true });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.profile.update({
      where: { id: profile.id },
      data: { resetToken, resetTokenExpiry },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://linkist.vip";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail(profile.email, resetUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
