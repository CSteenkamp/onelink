import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In — Linkist",
  description: "Log in to your Linkist account to manage your bio link page.",
  robots: { index: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
