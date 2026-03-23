import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

// Force dynamic rendering so Prisma isn't called at build time
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let profileUrls: MetadataRoute.Sitemap = [];
  try {
    const profiles = await prisma.profile.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });

    profileUrls = profiles.map((profile) => ({
      url: `https://linkist.vip/p/${profile.slug}`,
      lastModified: profile.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB unavailable (e.g. build time) — skip profile URLs
  }

  return [
    {
      url: "https://linkist.vip",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://linkist.vip/create",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://linkist.vip/login",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: "https://linkist.vip/privacy",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://linkist.vip/terms",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...profileUrls,
  ];
}
