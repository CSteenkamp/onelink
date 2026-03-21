import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await prisma.profile.update({
      where: { slug: params.slug },
      data: { views: { increment: 1 } },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
