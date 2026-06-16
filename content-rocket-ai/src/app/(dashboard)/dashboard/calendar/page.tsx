export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export const metadata = { title: "Calendrier éditorial" };

export default async function CalendarPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) redirect("/sign-in");

  const calendarGenerations = await prisma.generation.findMany({
    where: { userId: user.id, type: "EDITORIAL_CALENDAR" },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const isPro = user.plan === "PRO" || user.plan === "AGENCY";

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <Calendar className="h-6 w-6 text-violet-500" />
        <div>
          <h1 className="text-2xl font-bold">Calendrier éditorial</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Planifiez votre contenu sur 30 jours</p>
        </div>
      </div>

      {!isPro ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📅</div>
          <h2 className="text-xl font-bold mb-2">Fonctionnalité Pro</h2>
          <p className="text-zinc-500 mb-6">Le calendrier éditorial est disponible avec le plan Pro.</p>
          <a href="/dashboard/billing" className="text-violet-600 hover:underline font-medium">Passer au Pro →</a>
        </div>
      ) : calendarGenerations.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">
          <div className="text-4xl mb-3">📭</div>
          <p>Aucun calendrier généré. <a href="/dashboard/generator" className="text-violet-600 hover:underline">Générer un calendrier éditorial</a></p>
        </div>
      ) : (
        <div className="space-y-6">
          {calendarGenerations.map((gen: { id: string; niche: string; platform: string; content: unknown }) => {
            const content = gen.content as { calendar?: Array<{ day: number; topic: string; content_type: string; hook: string; best_time: string }> };
            const calendar = content.calendar || [];
            return (
              <Card key={gen.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Calendrier – {gen.niche} ({gen.platform})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {calendar.slice(0, 30).map((day) => (
                      <div key={day.day} className="rounded-xl border border-zinc-100 dark:border-zinc-800 p-3 text-xs">
                        <div className="font-bold text-violet-600 mb-1">J{day.day}</div>
                        <Badge variant="secondary" className="text-xs mb-1">{day.content_type}</Badge>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-snug">{day.topic}</p>
                        {day.best_time && <p className="text-zinc-400 mt-1">⏰ {day.best_time}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
