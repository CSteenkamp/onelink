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
  },
  ocean: {
    name: "Ocean",
    bg: "bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900",
    card: "bg-white/10 backdrop-blur-sm border border-white/10",
    text: "text-white",
    subtext: "text-gray-300",
    hover: "hover:bg-white/20",
  },
  sunset: {
    name: "Sunset",
    bg: "bg-gradient-to-br from-orange-600 via-pink-600 to-purple-800",
    card: "bg-white/15 backdrop-blur-sm border border-white/15",
    text: "text-white",
    subtext: "text-gray-200",
    hover: "hover:bg-white/25",
  },
  forest: {
    name: "Forest",
    bg: "bg-gradient-to-br from-green-900 via-emerald-900 to-slate-900",
    card: "bg-white/10 backdrop-blur-sm border border-white/10",
    text: "text-white",
    subtext: "text-gray-300",
    hover: "hover:bg-white/20",
  },
  candy: {
    name: "Candy",
    bg: "bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600",
    card: "bg-white/20 backdrop-blur-sm border border-white/20",
    text: "text-white",
    subtext: "text-gray-100",
    hover: "hover:bg-white/30",
  },
  minimal: {
    name: "Minimal",
    bg: "bg-gray-50",
    card: "bg-white border border-gray-200 shadow-sm",
    text: "text-gray-900",
    subtext: "text-gray-600",
    hover: "hover:bg-gray-100",
  },
  neon: {
    name: "Neon",
    bg: "bg-black",
    card: "bg-gray-900 border border-purple-500/50 shadow-lg shadow-purple-500/20",
    text: "text-white",
    subtext: "text-gray-400",
    hover: "hover:border-purple-400 hover:shadow-purple-400/30",
  },
} as const;

export type ThemeId = keyof typeof THEMES;

export const PLAN_LIMITS = {
  free: { maxLinks: 5, analytics: false, customColors: false, emailCapture: false },
  pro: { maxLinks: Infinity, analytics: true, customColors: true, emailCapture: true },
} as const;

export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/3cIeVc0HjbZ3evnczTeAg07";
