export const SOCIAL_PLATFORMS = [
  { id: "twitter", name: "Twitter / X", color: "#1DA1F2", icon: "𝕏" },
  { id: "instagram", name: "Instagram", color: "#E4405F", icon: "📷" },
  { id: "tiktok", name: "TikTok", color: "#000000", icon: "🎵" },
  { id: "youtube", name: "YouTube", color: "#FF0000", icon: "▶️" },
  { id: "twitch", name: "Twitch", color: "#9146FF", icon: "🎮" },
  { id: "onlyfans", name: "OnlyFans", color: "#00AFF0", icon: "💎" },
  { id: "spotify", name: "Spotify", color: "#1DB954", icon: "🎧" },
  { id: "github", name: "GitHub", color: "#333333", icon: "💻" },
  { id: "linkedin", name: "LinkedIn", color: "#0077B5", icon: "💼" },
  { id: "facebook", name: "Facebook", color: "#1877F2", icon: "📘" },
  { id: "snapchat", name: "Snapchat", color: "#FFFC00", icon: "👻" },
  { id: "discord", name: "Discord", color: "#5865F2", icon: "🎙️" },
  { id: "telegram", name: "Telegram", color: "#26A5E4", icon: "✈️" },
  { id: "whatsapp", name: "WhatsApp", color: "#25D366", icon: "📱" },
  { id: "email", name: "Email", color: "#6B7280", icon: "✉️" },
  { id: "website", name: "Website", color: "#FFFFFF", icon: "🌐" },
] as const;

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
