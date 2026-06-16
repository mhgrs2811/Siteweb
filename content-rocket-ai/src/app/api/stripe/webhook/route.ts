import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.metadata?.userId) {
          const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
          if (!subId) break;
          const sub = await stripe.subscriptions.retrieve(subId);
          const plan = session.metadata.plan as "PRO" | "AGENCY";

          await prisma.user.update({
            where: { id: session.metadata.userId },
            data: { plan },
          });

          const item = sub.items.data[0];
          await prisma.subscription.upsert({
            where: { stripeSubscriptionId: sub.id },
            create: {
              userId: session.metadata.userId,
              stripeSubscriptionId: sub.id,
              stripePriceId: item.price.id,
              status: "ACTIVE",
              currentPeriodStart: new Date((sub as unknown as { current_period_start: number }).current_period_start * 1000),
              currentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
            },
            update: {
              status: "ACTIVE",
              currentPeriodStart: new Date((sub as unknown as { current_period_start: number }).current_period_start * 1000),
              currentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const status = event.type === "customer.subscription.deleted" ? "CANCELED" : "ACTIVE";

        const subscription = await prisma.subscription.findUnique({ where: { stripeSubscriptionId: sub.id } });
        if (subscription) {
          await prisma.subscription.update({
            where: { stripeSubscriptionId: sub.id },
            data: {
              status,
              currentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
            },
          });

          if (status === "CANCELED") {
            await prisma.user.update({ where: { id: subscription.userId }, data: { plan: "FREE" } });
          }
        }
        break;
      }
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
  }

  return new Response("OK", { status: 200 });
}
