import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfileIdFromRequest } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const profileId = await getProfileIdFromRequest(req);
    if (!profileId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { profileId },
    });

    if (!subscription?.stripeSubscriptionId) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secretKey);

    // Cancel at period end so user keeps Pro until the billing cycle ends
    const updated = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    let endDate = "the end of your billing period";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodEnd = (updated as any).current_period_end;
    if (periodEnd && typeof periodEnd === "number") {
      endDate = new Date(periodEnd * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    // Mark subscription as cancelling in our database
    await prisma.subscription.update({
      where: { profileId },
      data: { status: "cancelling" },
    });

    return NextResponse.json({ success: true, endDate });
  } catch (err) {
    console.error("Stripe cancel error:", err);
    return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
}
