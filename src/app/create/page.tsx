"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { THEMES, type ThemeId } from "@/lib/constants";

function resizeImage(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(file.type === "image/png" ? "image/png" : "image/jpeg", 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function CreateProfile() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const [avatarError, setAvatarError] = useState("");

  const selectedTheme = THEMES[theme];

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError("");

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setAvatarError("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }
    if (file.size > 500 * 1024) {
      setAvatarError("Image must be under 500KB.");
      return;
    }

    try {
      const dataUrl = await resizeImage(file, 200);
      setAvatarUrl(dataUrl);
    } catch {
      setAvatarError("Failed to process image.");
    }
  }

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
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-2xl font-bold gradient-text inline-block mb-8">
          🔗 Linkist
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Create your Linkist</h1>
        <p className="text-gray-400 mb-8">Set up your personal landing page in under 60 seconds.</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form */}
          <div className="flex-1 max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username <span className="text-pink-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">linkist.vip/p/</span>
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

              {/* Avatar Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    {avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={avatarUrl}
                        alt="Avatar preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/50"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center text-gray-500 text-xl">
                        {displayName ? displayName.charAt(0).toUpperCase() : "?"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {avatarUrl ? "Change Photo" : "Upload Photo"}
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => { setAvatarUrl(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                        className="ml-2 text-sm text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                    <p className="text-gray-500 text-xs mt-1">JPEG, PNG, or WebP. Max 500KB.</p>
                    {avatarError && <p className="text-red-400 text-xs mt-1">{avatarError}</p>}
                  </div>
                </div>
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

              {/* Live Preview - Mobile (above password) */}
              <div className="lg:hidden">
                <label className="block text-sm font-medium text-gray-300 mb-2">Preview</label>
                <LivePreview
                  displayName={displayName}
                  bio={bio}
                  avatarUrl={avatarUrl}
                  theme={selectedTheme}
                />
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
                {submitting ? "Creating..." : "Create My Linkist"}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              Already have one?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300">
                Log in
              </Link>
            </p>
          </div>

          {/* Live Preview - Desktop (side panel) */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-8">
              <label className="block text-sm font-medium text-gray-300 mb-2">Live Preview</label>
              <LivePreview
                displayName={displayName}
                bio={bio}
                avatarUrl={avatarUrl}
                theme={selectedTheme}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function LivePreview({
  displayName,
  bio,
  avatarUrl,
  theme,
}: {
  displayName: string;
  bio: string;
  avatarUrl: string;
  theme: (typeof THEMES)[ThemeId];
}) {
  const name = displayName || "Your Name";
  const bioText = bio || "Your bio will appear here";

  return (
    <div className={`rounded-2xl overflow-hidden ${theme.bg} p-6 ${theme.light ? "border border-gray-200 shadow-md" : "border border-white/10"}`}>
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="avatar-ring mb-3">
          {avatarUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={avatarUrl}
              alt="Preview"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name */}
        <h2 className={`text-lg font-bold ${theme.text}`}>{name}</h2>

        {/* Bio */}
        <p className={`${theme.subtext} text-xs mt-1 max-w-[200px] leading-relaxed`}>
          {bioText}
        </p>

        {/* Sample Links */}
        <div className="w-full mt-4 space-y-2">
          <div className={`rounded-xl px-4 py-2.5 text-center text-xs font-medium ${theme.card} ${theme.text}`}>
            My Website
          </div>
          <div className={`rounded-xl px-4 py-2.5 text-center text-xs font-medium ${theme.card} ${theme.text}`}>
            Follow me on Twitter
          </div>
        </div>
      </div>
    </div>
  );
}
