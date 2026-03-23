import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CookieNotice from "@/components/CookieNotice";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Linkist — Free Linktree Alternative | One Link For Everything",
    template: "%s | Linkist",
  },
  description:
    "Create your free bio link page in 60 seconds. All your links, socials, and content — one beautiful page. Free forever, Pro for $1/mo. No signup needed to start.",
  keywords: [
    "free linktree alternative",
    "linktree alternative free",
    "bio link page",
    "link in bio",
    "link in bio tool",
    "personal landing page",
    "linkist",
    "free link in bio",
    "instagram link in bio",
    "tiktok link in bio",
    "onlyfans link in bio",
    "creator link page",
    "social media links",
    "one link for everything",
    "bio link free",
    "linktree competitor",
  ],
  openGraph: {
    title: "Linkist — Free Linktree Alternative | Your Internet, One Link",
    description:
      "Create your free bio link page in 60 seconds. Beautiful themes, unlimited customization. Free forever — Pro just $1/mo. Used by creators, influencers & businesses.",
    url: "https://linkist.vip",
    siteName: "Linkist",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkist — Free Linktree Alternative",
    description:
      "Your links, socials & content — one beautiful page. Free forever, Pro $1/mo. 30-day free trial.",
    creator: "@linkistvip",
  },
  alternates: {
    canonical: "https://linkist.vip",
  },
  metadataBase: new URL("https://linkist.vip"),
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔗</text></svg>",
  },
  category: "technology",
  applicationName: "Linkist",
  creator: "Linkist",
  publisher: "Linkist",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)]`}
      >
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
