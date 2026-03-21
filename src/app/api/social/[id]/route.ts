import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseSessionToken } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profileId = parseSessionToken(token);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const socialLink = await prisma.socialLink.findUnique({ where: { id: params.id } });
    if (!socialLink || socialLink.profileId !== profileId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.socialLink.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
