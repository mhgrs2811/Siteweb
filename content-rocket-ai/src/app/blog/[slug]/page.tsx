import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl font-bold leading-tight mb-4">{post.title}</h1>
            <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-4">{post.description}</p>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span>{formatDate(post.createdAt)}</span>
              <div className="flex gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="prose prose-zinc dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </main>
      <Footer />
    </>
  );
}
