import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Non authentifié" }, { status: 401 });

    const clerkUser = await currentUser();
    if (!clerkUser) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: clerkUser.fullName,
        imageUrl: clerkUser.imageUrl,
      },
      update: {
        name: clerkUser.fullName,
        imageUrl: clerkUser.imageUrl,
      },
    });

    return Response.json({ user });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
