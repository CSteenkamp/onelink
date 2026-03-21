import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.link.update({
      where: { id: params.id },
      data: { clicks: { increment: 1 } },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
