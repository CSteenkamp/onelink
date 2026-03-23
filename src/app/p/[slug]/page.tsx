import { prisma } from "@/lib/prisma";
import { THEMES, SOCIAL_PLATFORMS, type ThemeId } from "@/lib/constants";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profile = await prisma.profile.findUnique({ where: { slug: params.slug } });
  if (!profile) return { title: "Not Found" };
  const description = profile.bio || `${profile.displayName}'s Linkist page`;
  return {
    title: `${profile.displayName} — Linkist`,
    description,
    openGraph: {
      title: `${profile.displayName} — Linkist`,
      description,
      url: `https://linkist.vip/p/${profile.slug}`,
      type: "profile",
      ...(profile.avatarUrl && { images: [{ url: profile.avatarUrl, width: 200, height: 200 }] }),
    },
    twitter: {
      card: profile.headerImage ? "summary_large_image" : "summary",
      title: `${profile.displayName} — Linkist`,
      description,
      ...(profile.headerImage ? { images: [profile.headerImage] } : profile.avatarUrl ? { images: [profile.avatarUrl] } : {}),
    },
    alternates: {
      canonical: `https://linkist.vip/p/${profile.slug}`,
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const profile = await prisma.profile.findUnique({
    where: { slug: params.slug },
    include: {
      links: { where: { enabled: true }, orderBy: { order: "asc" } },
      socialLinks: { orderBy: { order: "asc" } },
    },
  });

  if (!profile) notFound();

  const themeId = (profile.theme as ThemeId) || "midnight";
  const theme = THEMES[themeId] || THEMES.midnight;

  // Increment views via API call on client
  const socialPlatforms = SOCIAL_PLATFORMS;

  return (
    <>
      <ProfileClient
        profile={{
          id: profile.id,
          slug: profile.slug,
          displayName: profile.displayName,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          headerImage: profile.headerImage,
          theme: themeId,
          plan: profile.plan,
        }}
        links={profile.links.map((l) => ({
          id: l.id,
          title: l.title,
          url: l.url,
          icon: l.icon,
        }))}
        socialLinks={profile.socialLinks.map((s) => ({
          id: s.id,
          platform: s.platform,
          url: s.url,
        }))}
        theme={theme}
        socialPlatforms={socialPlatforms}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: profile.displayName,
            description: profile.bio,
            url: `https://linkist.vip/p/${profile.slug}`,
            ...(profile.avatarUrl && { image: profile.avatarUrl }),
            ...(profile.socialLinks.length > 0 && {
              sameAs: profile.socialLinks.map((s) => s.url).filter((u) => u.startsWith("http")),
            }),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Linkist", item: "https://linkist.vip" },
              { "@type": "ListItem", position: 2, name: profile.displayName, item: `https://linkist.vip/p/${profile.slug}` },
            ],
          }),
        }}
      />
    </>
  );
}
