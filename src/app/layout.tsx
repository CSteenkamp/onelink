import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "OneLink — Your Internet, One Link",
  description:
    "Create your personal landing page in 60 seconds. All your links, socials, and content — one beautiful page. Free forever, $10 to unlock everything.",
  keywords: [
    "free linktree alternative",
    "bio link page",
    "link in bio",
    "personal landing page",
    "onelink",
  ],
  openGraph: {
    title: "OneLink — Your Internet, One Link",
    description:
      "Create your personal landing page in 60 seconds. All your links, socials, and content — one beautiful page.",
    url: "https://onelink.wagnerway.co.za",
    siteName: "OneLink",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OneLink — Your Internet, One Link",
    description:
      "Create your personal landing page in 60 seconds. Free forever, $10 to unlock everything.",
  },
  alternates: {
    canonical: "https://onelink.wagnerway.co.za",
  },
  metadataBase: new URL("https://onelink.wagnerway.co.za"),
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
      </body>
    </html>
  );
}
