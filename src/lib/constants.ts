export const SOCIAL_PLATFORMS = [
  { id: "twitter", name: "Twitter / X", color: "#1DA1F2", icon: "𝕏", placeholder: "@username", inputType: "text" as const },
  { id: "instagram", name: "Instagram", color: "#E4405F", icon: "📷", placeholder: "https://instagram.com/...", inputType: "url" as const },
  { id: "tiktok", name: "TikTok", color: "#000000", icon: "🎵", placeholder: "https://tiktok.com/@...", inputType: "url" as const },
  { id: "youtube", name: "YouTube", color: "#FF0000", icon: "▶️", placeholder: "https://youtube.com/...", inputType: "url" as const },
  { id: "twitch", name: "Twitch", color: "#9146FF", icon: "🎮", placeholder: "https://twitch.tv/...", inputType: "url" as const },
  { id: "onlyfans", name: "OnlyFans", color: "#00AFF0", icon: "💎", placeholder: "https://onlyfans.com/...", inputType: "url" as const },
  { id: "spotify", name: "Spotify", color: "#1DB954", icon: "🎧", placeholder: "https://open.spotify.com/...", inputType: "url" as const },
  { id: "github", name: "GitHub", color: "#333333", icon: "💻", placeholder: "https://github.com/...", inputType: "url" as const },
  { id: "linkedin", name: "LinkedIn", color: "#0077B5", icon: "💼", placeholder: "https://linkedin.com/in/...", inputType: "url" as const },
  { id: "facebook", name: "Facebook", color: "#1877F2", icon: "📘", placeholder: "https://facebook.com/...", inputType: "url" as const },
  { id: "snapchat", name: "Snapchat", color: "#FFFC00", icon: "👻", placeholder: "username", inputType: "text" as const },
  { id: "discord", name: "Discord", color: "#5865F2", icon: "🎙️", placeholder: "username or invite link", inputType: "text" as const },
  { id: "telegram", name: "Telegram", color: "#26A5E4", icon: "✈️", placeholder: "@username", inputType: "text" as const },
  { id: "whatsapp", name: "WhatsApp", color: "#25D366", icon: "📱", placeholder: "+1234567890", inputType: "tel" as const },
  { id: "email", name: "Email", color: "#6B7280", icon: "✉️", placeholder: "you@example.com", inputType: "email" as const },
  { id: "website", name: "Website", color: "#FFFFFF", icon: "🌐", placeholder: "https://...", inputType: "url" as const },
] as const;

/**
 * Convert user input to a clickable URL based on platform.
 * Handles usernames, phone numbers, emails, and already-valid URLs.
 */
export function formatSocialUrl(platformId: string, input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;

  switch (platformId) {
    case "twitter": {
      if (trimmed.startsWith("http")) return trimmed;
      const handle = trimmed.replace(/^@/, "");
      return `https://x.com/${handle}`;
    }
    case "discord": {
      if (trimmed.startsWith("http")) return trimmed;
      // Discord invite codes
      if (/^[a-zA-Z0-9]+$/.test(trimmed)) return `https://discord.gg/${trimmed}`;
      return trimmed;
    }
    case "whatsapp": {
      if (trimmed.startsWith("http")) return trimmed;
      const phone = trimmed.replace(/[^0-9+]/g, "").replace(/^\+/, "");
      return `https://wa.me/${phone}`;
    }
    case "telegram": {
      if (trimmed.startsWith("http")) return trimmed;
      const username = trimmed.replace(/^@/, "");
      return `https://t.me/${username}`;
    }
    case "snapchat": {
      if (trimmed.startsWith("http")) return trimmed;
      return `https://snapchat.com/add/${trimmed}`;
    }
    case "email": {
      if (trimmed.startsWith("mailto:")) return trimmed;
      if (trimmed.includes("@")) return `mailto:${trimmed}`;
      return trimmed;
    }
    default:
      return trimmed;
  }
}

/**
 * Extract a display label from a social URL (e.g., "https://x.com/searchclaw" → "@searchclaw")
 */
export function extractSocialLabel(platformId: string, url: string): string {
  try {
    switch (platformId) {
      case "twitter": {
        const match = url.match(/(?:x\.com|twitter\.com)\/([^/?]+)/);
        return match ? `@${match[1]}` : url;
      }
      case "instagram": {
        const match = url.match(/instagram\.com\/([^/?]+)/);
        return match ? `@${match[1]}` : url;
      }
      case "tiktok": {
        const match = url.match(/tiktok\.com\/@?([^/?]+)/);
        return match ? `@${match[1]}` : url;
      }
      case "github": {
        const match = url.match(/github\.com\/([^/?]+)/);
        return match ? match[1] : url;
      }
      case "youtube": {
        const match = url.match(/youtube\.com\/(?:@|channel\/|c\/)?([^/?]+)/);
        return match ? match[1] : url;
      }
      case "twitch": {
        const match = url.match(/twitch\.tv\/([^/?]+)/);
        return match ? match[1] : url;
      }
      case "linkedin": {
        const match = url.match(/linkedin\.com\/in\/([^/?]+)/);
        return match ? match[1] : url;
      }
      case "discord": {
        const match = url.match(/discord\.gg\/([^/?]+)/);
        return match ? match[1] : url;
      }
      case "telegram": {
        const match = url.match(/t\.me\/([^/?]+)/);
        return match ? `@${match[1]}` : url;
      }
      case "whatsapp": {
        const match = url.match(/wa\.me\/(\d+)/);
        return match ? `+${match[1]}` : url;
      }
      case "snapchat": {
        const match = url.match(/snapchat\.com\/add\/([^/?]+)/);
        return match ? match[1] : url;
      }
      case "email": {
        return url.replace("mailto:", "");
      }
      case "facebook": {
        const match = url.match(/facebook\.com\/([^/?]+)/);
        return match ? match[1] : url;
      }
      case "spotify": {
        const match = url.match(/open\.spotify\.com\/(?:artist|user)\/([^/?]+)/);
        return match ? match[1] : url;
      }
      case "onlyfans": {
        const match = url.match(/onlyfans\.com\/([^/?]+)/);
        return match ? match[1] : url;
      }
      case "website": {
        return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
      }
      default:
        return url;
    }
  } catch {
    return url;
  }
}

export type SocialPlatformId = (typeof SOCIAL_PLATFORMS)[number]["id"];

export const THEMES = {
  midnight: {
    name: "Midnight",
    bg: "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900",
    card: "bg-white/10 backdrop-blur-sm border border-white/10",
    text: "text-white",
    subtext: "text-gray-300",
    hover: "hover:bg-white/20",
    socialBg: "rgba(255,255,255,0.1)",
    light: false,
  },
  glass: {
    name: "Glass",
    bg: "bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900",
    card: "bg-white/5 backdrop-blur-xl border border-white/[0.08] shadow-lg shadow-black/20",
    text: "text-white",
    subtext: "text-gray-400",
    hover: "hover:bg-white/10 hover:border-white/15",
    socialBg: "rgba(255,255,255,0.06)",
    light: false,
  },
  rose: {
    name: "Rosé",
    bg: "bg-gradient-to-b from-rose-50 via-pink-50 to-orange-50",
    card: "bg-white/80 backdrop-blur-sm border border-rose-200/60 shadow-sm shadow-rose-100",
    text: "text-rose-950",
    subtext: "text-rose-700",
    hover: "hover:bg-white hover:border-rose-300 hover:shadow-md hover:shadow-rose-100",
    socialBg: "rgba(190,18,60,0.08)",
    light: true,
  },
  terminal: {
    name: "Terminal",
    bg: "bg-[#0a0a0a]",
    card: "bg-[#0a0a0a] border border-green-500/30 font-mono",
    text: "text-green-400",
    subtext: "text-green-600",
    hover: "hover:bg-green-500/10 hover:border-green-400/50",
    socialBg: "rgba(34,197,94,0.1)",
    light: false,
  },
  neon: {
    name: "Neon",
    bg: "bg-black",
    card: "bg-gray-900 border border-purple-500/50 shadow-lg shadow-purple-500/20",
    text: "text-white",
    subtext: "text-gray-400",
    hover: "hover:border-purple-400 hover:shadow-purple-400/30",
    socialBg: "rgba(168,85,247,0.15)",
    light: false,
  },
} as const;

export type ThemeId = keyof typeof THEMES;

export const PLAN_LIMITS = {
  free: { maxLinks: 5, analytics: false, customColors: false, emailCapture: false },
  pro: { maxLinks: Infinity, analytics: true, customColors: true, emailCapture: true },
} as const;

export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/3cIeVcblX6EJ1IB8jDeAg08";
