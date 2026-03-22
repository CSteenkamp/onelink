import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileIdFromRequest } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const profileId = getProfileIdFromRequest(req);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { linkIds } = await req.json();
    if (!Array.isArray(linkIds)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Verify all links belong to the authenticated user
    const links = await prisma.link.findMany({
      where: { id: { in: linkIds }, profileId },
      select: { id: true },
    });
    if (links.length !== linkIds.length) {
      return NextResponse.json({ error: "Unauthorized: some links don't belong to you" }, { status: 403 });
    }

    await Promise.all(
      linkIds.map((id: string, index: number) =>
        prisma.link.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
