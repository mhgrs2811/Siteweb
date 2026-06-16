export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Zap, TrendingUp, History, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, GENERATION_LIMIT_FREE } from "@/lib/utils";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { generations: { take: 5, orderBy: { createdAt: "desc" } } },
  });

  if (!user) {
    redirect("/sign-in");
  }

  const usagePercent = user.plan === "FREE"
    ? Math.min(100, (user.generationsUsed / GENERATION_LIMIT_FREE) * 100)
    : 0;

  const stats = [
    { label: "Générations ce mois", value: user.generationsUsed, icon: Zap, color: "text-violet-500" },
    { label: "Total générations", value: user.generations.length, icon: TrendingUp, color: "text-blue-500" },
    { label: "Plan actuel", value: user.plan, icon: Star, color: "text-amber-500" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Bienvenue ! Prêt à créer du contenu viral ?</p>
      </div>

      {/* Usage bar for free plan */}
      {user.plan === "FREE" && (
        <div className="mb-6 rounded-xl border border-violet-200 dark:border-violet-900 bg-violet-50 dark:bg-violet-950/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-violet-700 dark:text-violet-400">
              Générations utilisées : {user.generationsUsed}/{GENERATION_LIMIT_FREE}
            </span>
            <Link href="/dashboard/billing">
              <Button size="sm">Passer au Pro</Button>
            </Link>
          </div>
          <div className="h-2 bg-violet-200 dark:bg-violet-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full transition-all"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick start */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Générer du contenu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Créez des hooks viraux, scripts complets, hashtags et plus en quelques secondes.
            </p>
            <Link href="/dashboard/generator">
              <Button className="gap-2 w-full">
                <Zap className="h-4 w-4" />
                Lancer le générateur
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Dernières générations
              <Link href="/dashboard/history" className="text-xs text-violet-600 font-normal hover:underline">
                Voir tout
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.generations.length === 0 ? (
              <p className="text-sm text-zinc-400">Aucune génération encore.</p>
            ) : (
              <ul className="space-y-2">
                {user.generations.map((gen: { id: string; niche: string; audience: string; platform: string; type: string; createdAt: Date }) => (
                  <li key={gen.id} className="flex items-center justify-between text-sm py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                    <div>
                      <span className="font-medium">{gen.niche}</span>
                      <span className="text-zinc-400 ml-2">{gen.platform}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{gen.type.replace("_", " ")}</Badge>
                      <span className="text-zinc-400 text-xs">{formatDate(gen.createdAt)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
