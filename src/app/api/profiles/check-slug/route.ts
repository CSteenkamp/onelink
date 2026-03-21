import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug || slug.length < 3) {
      return NextResponse.json({ available: false });
    }
    const existing = await prisma.profile.findUnique({ where: { slug: slug.toLowerCase() } });
    return NextResponse.json({ available: !existing });
  } catch {
    return NextResponse.json({ available: false }, { status: 500 });
  }
}
