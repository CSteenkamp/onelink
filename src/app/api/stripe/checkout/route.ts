import { NextRequest, NextResponse } from "next/server";
import { getProfileIdFromRequest } from "@/lib/session";

const PRICE_ID = process.env.STRIPE_PRICE_ID;

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey || !PRICE_ID) {
      console.error("Stripe not configured: STRIPE_SECRET_KEY or STRIPE_PRICE_ID missing");
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const profileId = await getProfileIdFromRequest(req);
    if (!profileId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secretKey);

    const origin = req.headers.get("origin") || "https://linkist.vip";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription" as const,
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      metadata: { profileId },
      subscription_data: {
        metadata: { profileId },
      },
      success_url: `${origin}/admin?upgraded=true`,
      cancel_url: `${origin}/admin?cancelled=true`,
    } as Parameters<typeof stripe.checkout.sessions.create>[0]);

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
