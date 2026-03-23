import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileIdFromRequest } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const profileId = await getProfileIdFromRequest(req);
    if (!profileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        links: true,
        socialLinks: true,
        subscription: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      profile: {
        slug: profile.slug,
        displayName: profile.displayName,
        email: profile.email,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        headerImage: profile.headerImage,
        theme: profile.theme,
        plan: profile.plan,
        views: profile.views,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
      links: profile.links.map((l) => ({
        title: l.title,
        url: l.url,
        icon: l.icon,
        clicks: l.clicks,
        enabled: l.enabled,
        createdAt: l.createdAt,
      })),
      socialLinks: profile.socialLinks.map((s) => ({
        platform: s.platform,
        url: s.url,
      })),
      subscription: profile.subscription
        ? {
            plan: profile.subscription.plan,
            status: profile.subscription.status,
            createdAt: profile.subscription.createdAt,
          }
        : null,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="linkist-data-${profile.slug}.json"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
