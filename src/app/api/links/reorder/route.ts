import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profileId = parseSessionToken(token);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { linkIds } = await req.json();
    if (!Array.isArray(linkIds)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
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
