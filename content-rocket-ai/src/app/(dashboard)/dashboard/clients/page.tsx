export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export const metadata = { title: "Clients" };

export default async function ClientsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { clients: true },
  });
  if (!user) redirect("/sign-in");

  const isAgency = user.plan === "AGENCY";

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <Users className="h-6 w-6 text-violet-500" />
        <div>
          <h1 className="text-2xl font-bold">Gestion des clients</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">{user.clients.length} client(s)</p>
        </div>
      </div>

      {!isAgency ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-xl font-bold mb-2">Fonctionnalité Agency</h2>
          <p className="text-zinc-500 mb-6">La gestion multi-clients est disponible avec le plan Agency.</p>
          <a href="/dashboard/billing" className="text-violet-600 hover:underline font-medium">Passer au plan Agency →</a>
        </div>
      ) : user.clients.length === 0 ? (
        <div className="text-center py-20 text-zinc-400">
          <p>Aucun client ajouté.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.clients.map((client: { id: string; name: string; niche: string | null; notes: string | null }) => (
            <Card key={client.id}>
              <CardHeader><CardTitle>{client.name}</CardTitle></CardHeader>
              <CardContent>
                {client.niche && <p className="text-sm text-zinc-500">Niche: {client.niche}</p>}
                {client.notes && <p className="text-sm text-zinc-400 mt-1">{client.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
