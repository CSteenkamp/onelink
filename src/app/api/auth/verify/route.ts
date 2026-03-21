import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  // In production, verify the magic link token and create session
  return NextResponse.json({ message: "Magic link verification not yet implemented" });
}
