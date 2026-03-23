import { NextRequest, NextResponse } from "next/server";
import { parseSessionToken } from "@/lib/auth";

const PRICE_ID = process.env.STRIPE_PRICE_ID || "price_1TDOkxBiNvYQF2cPip69DIa0";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    // Get profileId from session cookie
    const sessionToken = req.cookies.get("onelink_session")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const profileId = parseSessionToken(sessionToken);
    if (!profileId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secretKey);

    const origin = req.headers.get("origin") || "https://linkist.vip";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      metadata: { profileId },
      success_url: `${origin}/admin?upgraded=true`,
      cancel_url: `${origin}/admin?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
