import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Non authentifié" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user?.stripeCustomerId) return Response.json({ error: "Aucun abonnement actif" }, { status: 400 });

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur Stripe" }, { status: 500 });
  }
}
