export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Blog – Conseils création de contenu viral TikTok Instagram YouTube",
  description: "Découvrez nos guides pour créer du contenu viral sur TikTok, Instagram Reels, YouTube Shorts. Stratégies, hooks, scripts et conseils d'experts.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Blog & Ressources</h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
              Guides, stratégies et conseils pour créer du contenu viral et booster votre audience.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 text-zinc-400">
              <p>Articles bientôt disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: { id: string; slug: string; title: string; description: string; category: string; tags: string[]; createdAt: Date }) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-6">
                      <Badge className="mb-3">{post.category}</Badge>
                      <h2 className="font-bold text-lg mb-2 leading-snug">{post.title}</h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-3">{post.description}</p>
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>{formatDate(post.createdAt)}</span>
                        <div className="flex gap-1">
                          {post.tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
