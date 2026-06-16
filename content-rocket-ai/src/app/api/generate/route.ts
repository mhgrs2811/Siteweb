import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai, CONTENT_PROMPTS } from "@/lib/openai";
import { GENERATION_LIMIT_FREE } from "@/lib/utils";
import type { ContentType, Platform } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: "Non authentifié" }, { status: 401 });

    const body = await req.json();
    const { niche, audience, objective, platform, contentType } = body as {
      niche: string;
      audience: string;
      objective: string;
      platform: Platform;
      contentType: ContentType;
    };

    if (!niche || !audience || !objective || !platform || !contentType) {
      return Response.json({ error: "Champs manquants" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });

    // Check limit
    if (user.plan === "FREE") {
      const now = new Date();
      const resetDate = new Date(user.generationsReset);
      const monthDiff = (now.getFullYear() - resetDate.getFullYear()) * 12 + (now.getMonth() - resetDate.getMonth());

      if (monthDiff >= 1) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { generationsUsed: 0, generationsReset: now },
        });
      }

      if (user.generationsUsed >= GENERATION_LIMIT_FREE) {
        return Response.json({ error: "Limite de générations atteinte. Passez au plan Pro." }, { status: 403 });
      }
    }

    const promptFn = CONTENT_PROMPTS[contentType];
    const prompt = promptFn(niche, audience, objective, platform);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tu es un expert en création de contenu viral pour les réseaux sociaux. Réponds toujours en JSON valide uniquement, sans markdown." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    let content: Record<string, unknown>;
    try {
      content = JSON.parse(raw);
    } catch {
      content = { result: raw };
    }

    // Save generation
    const generation = await prisma.generation.create({
      data: {
        userId: user.id,
        type: contentType,
        niche,
        audience,
        objective,
        platform,
        content: content as import("@prisma/client").Prisma.InputJsonValue,
      },
    });

    // Increment usage for free users
    if (user.plan === "FREE") {
      await prisma.user.update({
        where: { id: user.id },
        data: { generationsUsed: { increment: 1 } },
      });
    }

    return Response.json({ content: content as import("@prisma/client").Prisma.InputJsonValue, generationId: generation.id });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
