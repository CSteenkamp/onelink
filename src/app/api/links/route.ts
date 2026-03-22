import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileIdFromRequest } from "@/lib/session";
import { isValidUrl, sanitizeString } from "@/lib/auth";
import { PLAN_LIMITS } from "@/lib/constants";

export async function GET(req: NextRequest) {
  try {
    const profileId = getProfileIdFromRequest(req);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const links = await prisma.link.findMany({
      where: { profileId },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ links });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const profileId = getProfileIdFromRequest(req);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({ where: { id: profileId } });
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const plan = profile.plan as keyof typeof PLAN_LIMITS;
    const linkCount = await prisma.link.count({ where: { profileId } });
    if (linkCount >= PLAN_LIMITS[plan].maxLinks) {
      return NextResponse.json({ error: "Link limit reached. Upgrade to Pro for unlimited links." }, { status: 403 });
    }

    const { title, url, icon } = await req.json();
    if (!title || !url) return NextResponse.json({ error: "Title and URL required" }, { status: 400 });
    if (!isValidUrl(url)) {
      return NextResponse.json({ error: "URL must start with http:// or https://" }, { status: 400 });
    }

    const link = await prisma.link.create({
      data: {
        profileId,
        title: sanitizeString(title, 200),
        url,
        icon: icon ? sanitizeString(icon, 10) : null,
        order: linkCount,
      },
    });
    return NextResponse.json({ link });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
