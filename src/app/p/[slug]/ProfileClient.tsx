"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ProfileData {
  id: string;
  slug: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  headerImage: string | null;
  theme: string;
  plan: string;
}

interface LinkData {
  id: string;
  title: string;
  url: string;
  icon: string | null;
}

interface SocialLinkData {
  id: string;
  platform: string;
  url: string;
}

interface ThemeStyle {
  bg: string;
  card: string;
  text: string;
  subtext: string;
  hover: string;
  socialBg?: string;
  light?: boolean;
}

interface SocialPlatform {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface Props {
  profile: ProfileData;
  links: LinkData[];
  socialLinks: SocialLinkData[];
  theme: ThemeStyle;
  socialPlatforms: readonly SocialPlatform[];
}

export default function ProfileClient({ profile, links, socialLinks, theme, socialPlatforms }: Props) {
  // Track page view
  useEffect(() => {
    fetch(`/api/views/${profile.slug}`, { method: "POST" }).catch(() => {});
  }, [profile.slug]);

  function handleLinkClick(linkId: string) {
    fetch(`/api/links/${linkId}/click`, { method: "POST" }).catch(() => {});
  }

  function getSocialPlatform(platformId: string): SocialPlatform | undefined {
    return socialPlatforms.find((p) => p.id === platformId);
  }

  return (
    <main className={`min-h-screen ${theme.bg} flex flex-col items-center px-4 ${profile.headerImage ? "pt-0 pb-12" : "py-12"}`}>
      <div className="w-full max-w-md">
        {/* Header Image */}
        {profile.headerImage && (
          <div className="w-full h-48 -mx-4 mb-6 overflow-hidden rounded-b-2xl animate-fade-in" style={{ width: "calc(100% + 2rem)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.headerImage}
              alt="Header"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6 animate-fade-in">
          <div className="avatar-ring mb-4">
            {profile.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-4xl">
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Name + badge */}
          <h1 className={`text-2xl font-bold ${theme.text} flex items-center gap-2`}>
            {profile.displayName}
            {profile.plan === "pro" && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-[10px]" title="Pro">
                ✓
              </span>
            )}
          </h1>

          {/* Bio */}
          {profile.bio && (
            <p className={`${theme.subtext} text-center mt-2 max-w-xs text-sm leading-relaxed`}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Social links */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-3 mb-8 animate-fade-in-delay-1 flex-wrap">
            {socialLinks.map((social) => {
              const platform = getSocialPlatform(social.platform);
              if (!platform) return null;
              const defaultBg = theme.socialBg || "rgba(255,255,255,0.1)";
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-200 hover:scale-110"
                  style={{ backgroundColor: defaultBg }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = platform.color;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = defaultBg;
                  }}
                  title={platform.name}
                >
                  {platform.icon}
                </a>
              );
            })}
          </div>
        )}

        {/* Links */}
        <div className="space-y-3 animate-fade-in-delay-2">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link.id)}
              className={`link-card block w-full rounded-xl px-5 py-4 text-center font-medium transition-all duration-200 ${theme.card} ${theme.text} ${theme.hover}`}
            >
              {link.icon && <span className="mr-2">{link.icon}</span>}
              {link.title}
            </a>
          ))}
        </div>

        {/* Powered by */}
        {profile.plan !== "pro" && (
          <div className="mt-12 text-center animate-fade-in-delay-3">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-400 text-xs transition-colors"
            >
              Powered by Linkist
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
