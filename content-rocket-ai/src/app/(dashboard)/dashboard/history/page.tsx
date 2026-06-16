export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { History } from "lucide-react";

export const metadata = { title: "Historique" };

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  const generations = await prisma.generation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <History className="h-6 w-6 text-violet-500" />
        <div>
          <h1 className="text-2xl font-bold">Historique</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">{generations.length} générations</p>
        </div>
      </div>

      {generations.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">
          <div className="text-4xl mb-3">📭</div>
          <p>Aucune génération encore. <a href="/dashboard/generator" className="text-violet-600 hover:underline">Créer votre premier contenu</a></p>
        </div>
      ) : (
        <div className="space-y-3">
          {generations.map((gen: { id: string; niche: string; audience: string; objective: string; platform: string; type: string; createdAt: Date }) => (
            <Card key={gen.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{gen.niche}</span>
                      <Badge variant="secondary">{gen.platform}</Badge>
                      <Badge>{gen.type.replace(/_/g, " ")}</Badge>
                    </div>
                    <p className="text-sm text-zinc-500">Audience: {gen.audience} · Objectif: {gen.objective}</p>
                  </div>
                  <span className="text-xs text-zinc-400">{formatDate(gen.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
