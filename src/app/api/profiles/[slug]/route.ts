import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileIdFromRequest } from "@/lib/session";
import { isValidUrl, isValidEmail, sanitizeString } from "@/lib/auth";
import { THEMES } from "@/lib/constants";

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
        headerImage: profile.headerImage,
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
    const profileId = await getProfileIdFromRequest(req);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({ where: { slug: params.slug } });
    if (!profile || profile.id !== profileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { displayName, bio, avatarUrl, headerImage, theme, email, customColor } = body;

    // Validate inputs
    if (displayName !== undefined && (displayName.trim().length < 1 || displayName.trim().length > 100)) {
      return NextResponse.json({ error: "Display name must be 1-100 characters" }, { status: 400 });
    }
    if (bio !== undefined && bio.length > 280) {
      return NextResponse.json({ error: "Bio must be 280 characters or less" }, { status: 400 });
    }
    if (avatarUrl !== undefined && avatarUrl !== "" && !isValidUrl(avatarUrl)) {
      return NextResponse.json({ error: "Avatar URL must be a valid http/https URL" }, { status: 400 });
    }
    if (headerImage !== undefined && headerImage !== "" && !isValidUrl(headerImage)) {
      return NextResponse.json({ error: "Header image URL must be a valid http/https URL" }, { status: 400 });
    }
    if (theme !== undefined && !(theme in THEMES)) {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
    }
    if (theme !== undefined && THEMES[theme as keyof typeof THEMES]?.pro && profile.plan !== "pro") {
      return NextResponse.json({ error: "This theme requires a Pro plan" }, { status: 403 });
    }
    if (headerImage && headerImage !== "" && profile.plan !== "pro") {
      return NextResponse.json({ error: "Header images require a Pro plan" }, { status: 403 });
    }
    if (email !== undefined && email !== "" && !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const updated = await prisma.profile.update({
      where: { id: profileId },
      data: {
        ...(displayName !== undefined && { displayName: sanitizeString(displayName, 100) }),
        ...(bio !== undefined && { bio: bio ? sanitizeString(bio, 280) : null }),
        ...(avatarUrl !== undefined && { avatarUrl: avatarUrl || null }),
        ...(headerImage !== undefined && { headerImage: headerImage || null }),
        ...(theme !== undefined && { theme }),
        ...(customColor !== undefined && { customColor: customColor || null }),
        ...(email !== undefined && { email: email || null }),
      },
    });

    return NextResponse.json({
      profile: {
        id: updated.id,
        slug: updated.slug,
        displayName: updated.displayName,
        bio: updated.bio,
        avatarUrl: updated.avatarUrl,
        headerImage: updated.headerImage,
        theme: updated.theme,
        plan: updated.plan,
        views: updated.views,
        email: updated.email,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
