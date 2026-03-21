import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseSessionToken } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { slug: params.slug },
      include: {
        links: { where: { enabled: true }, orderBy: { order: "asc" } },
        socialLinks: { orderBy: { order: "asc" } },
      },
    });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    return NextResponse.json({
      profile: {
        slug: profile.slug,
        displayName: profile.displayName,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        theme: profile.theme,
        plan: profile.plan,
        views: profile.views,
      },
      links: profile.links,
      socialLinks: profile.socialLinks,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profileId = parseSessionToken(token);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({ where: { slug: params.slug } });
    if (!profile || profile.id !== profileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { displayName, bio, avatarUrl, theme, email } = body;

    const updated = await prisma.profile.update({
      where: { id: profileId },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(theme !== undefined && { theme }),
        ...(email !== undefined && { email }),
      },
    });

    return NextResponse.json({
      profile: {
        id: updated.id,
        slug: updated.slug,
        displayName: updated.displayName,
        bio: updated.bio,
        avatarUrl: updated.avatarUrl,
        theme: updated.theme,
        plan: updated.plan,
        views: updated.views,
        loginCode: updated.loginCode,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
