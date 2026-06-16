export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BillingClient } from "@/components/dashboard/billing-client";
import { PLANS } from "@/lib/stripe";

export const metadata = { title: "Facturation" };

export default async function BillingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { subscriptions: { where: { status: "ACTIVE" }, take: 1 } },
  });
  if (!user) redirect("/sign-in");

  const currentPlan = PLANS[user.plan as keyof typeof PLANS];
  const subscription = user.subscriptions[0];

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Facturation</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Gérez votre abonnement</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Plan actuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold">{currentPlan.name}</span>
                  <Badge variant={user.plan === "FREE" ? "secondary" : "default"}>
                    {user.plan === "FREE" ? "Gratuit" : `${currentPlan.price}€/mois`}
                  </Badge>
                </div>
                {subscription && (
                  <p className="text-sm text-zinc-500">
                    Renouvellement le {new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </div>
              <BillingClient plan={user.plan} stripeCustomerId={user.stripeCustomerId} />
            </div>
          </CardContent>
        </Card>

        {user.plan === "FREE" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(["PRO", "AGENCY"] as const).map((planKey) => {
              const plan = PLANS[planKey];
              return (
                <Card key={planKey} className={planKey === "PRO" ? "border-violet-300 dark:border-violet-700" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      <span className="text-2xl font-bold">{plan.price}€<span className="text-sm font-normal text-zinc-400">/mois</span></span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((f) => (
                        <li key={f} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                          <span className="text-violet-500">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    <BillingClient plan={user.plan} targetPlan={planKey} stripeCustomerId={user.stripeCustomerId} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
