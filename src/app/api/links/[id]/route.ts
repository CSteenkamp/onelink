import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseSessionToken } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profileId = parseSessionToken(token);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const link = await prisma.link.findUnique({ where: { id: params.id } });
    if (!link || link.profileId !== profileId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const updated = await prisma.link.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.url !== undefined && { url: body.url }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.enabled !== undefined && { enabled: body.enabled }),
      },
    });
    return NextResponse.json({ link: updated });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profileId = parseSessionToken(token);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const link = await prisma.link.findUnique({ where: { id: params.id } });
    if (!link || link.profileId !== profileId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.link.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
