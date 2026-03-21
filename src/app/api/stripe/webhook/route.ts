import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    // In production, verify Stripe webhook signature
    const event = JSON.parse(body);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const profileId = session.metadata?.profileId;
      if (profileId) {
        await prisma.profile.update({
          where: { id: profileId },
          data: { plan: "pro" },
        });
        await prisma.subscription.upsert({
          where: { profileId },
          create: {
            profileId,
            stripeCustomerId: session.customer,
            plan: "pro",
            status: "active",
          },
          update: {
            stripeCustomerId: session.customer,
            plan: "pro",
            status: "active",
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
