import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileIdFromRequest } from "@/lib/session";
import { isValidUrl, sanitizeString } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const profileId = await getProfileIdFromRequest(req);
    if (!profileId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const link = await prisma.link.findUnique({ where: { id: params.id } });
    if (!link || link.profileId !== profileId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    if (body.url !== undefined && !isValidUrl(body.url)) {
      return NextResponse.json({ error: "URL must start with http:// or https://" }, { status: 400 });
    }

    const updated = await prisma.link.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: sanitizeString(body.title, 200) }),
        ...(body.url !== undefined && { url: body.url }),
        ...(body.icon !== undefined && { icon: body.icon ? sanitizeString(body.icon, 10) : null }),
        ...(body.enabled !== undefined && { enabled: Boolean(body.enabled) }),
      },
    });
    return NextResponse.json({ link: updated });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const profileId = await getProfileIdFromRequest(req);
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
