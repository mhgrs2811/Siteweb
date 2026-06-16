export const dynamic = "force-dynamic";
import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://contentrocket.ai";

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const blogUrls = posts.map((post: { slug: string; updatedAt: Date }) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    ...blogUrls,
  ];
}
