"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { THEMES, type ThemeId } from "@/lib/constants";

export default function CreateProfile() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [theme, setTheme] = useState<ThemeId>("midnight");
  const [password, setPassword] = useState("");
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function checkSlug(value: string) {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-_]/g, "");
    setSlug(cleaned);
    if (cleaned.length < 3) {
      setSlugAvailable(null);
      return;
    }
    setSlugChecking(true);
    try {
      const res = await fetch("/api/profiles/check-slug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: cleaned }),
      });
      const data = await res.json();
      setSlugAvailable(data.available);
    } catch {
      setSlugAvailable(null);
    }
    setSlugChecking(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!slug || !displayName || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (slug.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/profiles/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, displayName, bio, avatarUrl, theme, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setSubmitting(false);
        return;
      }
      // Cookie is set server-side with HttpOnly flag
      router.push(`/admin?loginCode=${data.loginCode}`);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0F172A] px-4 py-8">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="text-2xl font-bold gradient-text inline-block mb-8">
          🔗 OneLink
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Create your OneLink</h1>
        <p className="text-gray-400 mb-8">Set up your personal landing page in under 60 seconds.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username <span className="text-pink-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">onelink.wagnerway.co.za/p/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => checkSlug(e.target.value)}
                placeholder="yourname"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            {slugChecking && <p className="text-gray-400 text-xs mt-1">Checking...</p>}
            {slugAvailable === true && <p className="text-green-400 text-xs mt-1">Available!</p>}
            {slugAvailable === false && <p className="text-red-400 text-xs mt-1">Already taken.</p>}
          </div>

          {/* Display name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Display Name <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Sarah Chen"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bio <span className="text-gray-500 text-xs">({bio.length}/280)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 280))}
              placeholder="Designer & Creator | Making the internet beautiful ✨"
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Avatar URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(THEMES) as [ThemeId, (typeof THEMES)[ThemeId]][]).map(([id, t]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTheme(id)}
                  className={`rounded-lg p-3 text-xs font-medium text-center transition-all ${t.bg} ${
                    theme === id ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-[#0F172A]" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <span className={t.text}>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Admin Password <span className="text-pink-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <p className="text-gray-500 text-xs mt-1">You&apos;ll use this to manage your page later.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || slugAvailable === false}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create My OneLink"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have one?{" "}
          <Link href="/login" className="text-purple-400 hover:text-purple-300">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
