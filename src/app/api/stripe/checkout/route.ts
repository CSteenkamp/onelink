import { NextResponse } from "next/server";
import { STRIPE_PAYMENT_LINK } from "@/lib/constants";

export async function POST() {
  return NextResponse.json({ url: STRIPE_PAYMENT_LINK });
}
