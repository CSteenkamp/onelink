import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Free Bio Link Page",
  description:
    "Build your personal link-in-bio page in 60 seconds. Choose from beautiful themes, add unlimited links, and share one URL everywhere. No credit card required.",
  openGraph: {
    title: "Create Your Free Bio Link Page — Linkist",
    description:
      "Build your personal link-in-bio page in 60 seconds. Free forever, Pro for $1/mo.",
    url: "https://linkist.vip/create",
  },
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
