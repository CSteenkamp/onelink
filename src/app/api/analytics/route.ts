import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseSessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profileId = parseSessionToken(token);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: { links: { orderBy: { clicks: "desc" } } },
    });
    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (profile.plan !== "pro") {
      return NextResponse.json({ error: "Pro plan required" }, { status: 403 });
    }

    return NextResponse.json({
      views: profile.views,
      totalClicks: profile.links.reduce((sum, l) => sum + l.clicks, 0),
      topLinks: profile.links.slice(0, 10).map((l) => ({
        id: l.id,
        title: l.title,
        clicks: l.clicks,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
