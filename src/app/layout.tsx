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
  title: "Linkist — Your Internet, One Link",
  description:
    "Create your personal landing page in 60 seconds. All your links, socials, and content — one beautiful page. Free forever, $1/mo to unlock everything.",
  keywords: [
    "free linktree alternative",
    "bio link page",
    "link in bio",
    "personal landing page",
    "linkist",
  ],
  openGraph: {
    title: "Linkist — Your Internet, One Link",
    description:
      "Create your personal landing page in 60 seconds. All your links, socials, and content — one beautiful page.",
    url: "https://linkist.vip",
    siteName: "Linkist",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkist — Your Internet, One Link",
    description:
      "Create your personal landing page in 60 seconds. Free forever, $1/mo to unlock everything.",
  },
  alternates: {
    canonical: "https://linkist.vip",
  },
  metadataBase: new URL("https://linkist.vip"),
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔗</text></svg>",
  },
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
