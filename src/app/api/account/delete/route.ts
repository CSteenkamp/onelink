import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileIdFromRequest } from "@/lib/session";
import { verifyPassword } from "@/lib/auth";
import { deleteObjectsByPrefix } from "@/lib/s3";

export async function POST(req: NextRequest) {
  try {
    const profileId = await getProfileIdFromRequest(req);
    if (!profileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ error: "Password is required to delete your account" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { id: profileId } });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const valid = await verifyPassword(password, profile.adminPassword);
    if (!valid) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    // Delete all S3 objects for this profile
    try {
      await deleteObjectsByPrefix(`avatar/${profileId}/`);
      await deleteObjectsByPrefix(`header/${profileId}/`);
    } catch {
      // Continue even if S3 deletion fails
    }

    // Delete profile (cascades to links, socialLinks, subscription)
    await prisma.profile.delete({ where: { id: profileId } });

    // Clear session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("onelink_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
