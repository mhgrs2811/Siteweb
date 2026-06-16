import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, PLANS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Non authentifié" }, { status: 401 });

    const { plan } = await req.json();
    const planData = PLANS[plan as "PRO" | "AGENCY"];
    if (!planData?.priceId) return Response.json({ error: "Plan invalide" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { clerkId: userId },
      });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planData.priceId!, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
      metadata: { userId: user.id, plan },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur Stripe" }, { status: 500 });
  }
}
