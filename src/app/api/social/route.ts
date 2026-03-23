import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileIdFromRequest } from "@/lib/session";
import { isValidUrl, isValidEmail, sanitizeString } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const profileId = await getProfileIdFromRequest(req);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const socialLinks = await prisma.socialLink.findMany({
      where: { profileId },
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ socialLinks });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const profileId = await getProfileIdFromRequest(req);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { platform, url } = await req.json();
    if (!platform || !url) return NextResponse.json({ error: "Platform and URL required" }, { status: 400 });
    const isMailto = url.startsWith("mailto:");
    if (!isValidUrl(url) && !(isMailto && isValidEmail(url.slice(7)))) {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const count = await prisma.socialLink.count({ where: { profileId } });
    const socialLink = await prisma.socialLink.create({
      data: { profileId, platform: sanitizeString(platform, 50), url, order: count },
    });
    return NextResponse.json({ socialLink });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
