export const dynamic = "force-dynamic";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export const metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <Settings className="h-6 w-6 text-violet-500" />
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Profil</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {user?.imageUrl && (
                <img src={user.imageUrl} alt="Avatar" className="h-16 w-16 rounded-full" />
              )}
              <div>
                <p className="font-semibold">{user?.fullName || "Utilisateur"}</p>
                <p className="text-sm text-zinc-500">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
            </div>
            <p className="text-sm text-zinc-400">
              Pour modifier votre profil, rendez-vous sur votre espace Clerk.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Préférences</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">Langue : Français</p>
            <p className="text-sm text-zinc-500 mt-2">Les préférences avancées arrivent bientôt.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
