"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { THEMES, SOCIAL_PLATFORMS, STRIPE_PAYMENT_LINK, type ThemeId } from "@/lib/constants";

interface ProfileData {
  id: string;
  slug: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  theme: string;
  plan: string;
  views: number;
  loginCode: string;
}

interface LinkData {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  clicks: number;
  enabled: boolean;
  order: number;
}

interface SocialLinkData {
  id: string;
  platform: string;
  url: string;
  order: number;
}

export default function AdminPageWrapper() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#0F172A] flex items-center justify-center"><div className="text-gray-400">Loading...</div></main>}>
      <AdminPage />
    </Suspense>
  );
}

function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showLoginCode = searchParams.get("loginCode");

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "links" | "social" | "analytics">("profile");

  // Edit states
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [theme, setTheme] = useState<ThemeId>("midnight");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // New link
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkIcon, setNewLinkIcon] = useState("");

  // New social
  const [newSocialPlatform, setNewSocialPlatform] = useState("twitter");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  const getSession = useCallback(() => {
    const match = document.cookie.match(/onelink_session=([^;]+)/);
    return match ? match[1] : null;
  }, []);

  const fetchProfile = useCallback(async () => {
    const token = getSession();
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      const res = await fetch("/api/admin/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      setProfile(data.profile);
      setDisplayName(data.profile.displayName);
      setBio(data.profile.bio || "");
      setAvatarUrl(data.profile.avatarUrl || "");
      setTheme(data.profile.theme as ThemeId);
      setLinks(data.links);
      setSocialLinks(data.socialLinks);
    } catch {
      router.push("/login");
    }
    setLoading(false);
  }, [getSession, router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function saveProfile() {
    const token = getSession();
    if (!profile || !token) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`/api/profiles/${profile.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ displayName, bio, avatarUrl, theme }),
      });
      if (res.ok) {
        setSaveMsg("Saved!");
        const data = await res.json();
        setProfile(data.profile);
      } else {
        setSaveMsg("Error saving.");
      }
    } catch {
      setSaveMsg("Error saving.");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  }

  async function addLink() {
    const token = getSession();
    if (!newLinkTitle || !newLinkUrl || !token) return;
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: newLinkTitle, url: newLinkUrl, icon: newLinkIcon || null }),
    });
    if (res.ok) {
      const data = await res.json();
      setLinks([...links, data.link]);
      setNewLinkTitle("");
      setNewLinkUrl("");
      setNewLinkIcon("");
    }
  }

  async function deleteLink(id: string) {
    const token = getSession();
    if (!token) return;
    await fetch(`/api/links/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setLinks(links.filter((l) => l.id !== id));
  }

  async function toggleLink(id: string, enabled: boolean) {
    const token = getSession();
    if (!token) return;
    await fetch(`/api/links/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ enabled: !enabled }),
    });
    setLinks(links.map((l) => (l.id === id ? { ...l, enabled: !enabled } : l)));
  }

  async function moveLink(id: string, direction: "up" | "down") {
    const idx = links.findIndex((l) => l.id === id);
    if (idx < 0) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= links.length) return;
    const newLinks = [...links];
    [newLinks[idx], newLinks[newIdx]] = [newLinks[newIdx], newLinks[idx]];
    setLinks(newLinks);
    const token = getSession();
    if (!token) return;
    await fetch("/api/links/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ linkIds: newLinks.map((l) => l.id) }),
    });
  }

  async function addSocial() {
    const token = getSession();
    if (!newSocialUrl || !token) return;
    const res = await fetch("/api/social", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ platform: newSocialPlatform, url: newSocialUrl }),
    });
    if (res.ok) {
      const data = await res.json();
      setSocialLinks([...socialLinks, data.socialLink]);
      setNewSocialUrl("");
    }
  }

  async function deleteSocial(id: string) {
    const token = getSession();
    if (!token) return;
    await fetch(`/api/social/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setSocialLinks(socialLinks.filter((s) => s.id !== id));
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </main>
    );
  }

  if (!profile) return null;

  const isPro = profile.plan === "pro";

  return (
    <main className="min-h-screen bg-[#0F172A] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-xl font-bold gradient-text">🔗 OneLink</Link>
          <div className="flex items-center gap-3">
            <a
              href={`/p/${profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-lg"
            >
              Preview ↗
            </a>
            {!isPro && (
              <a
                href={STRIPE_PAYMENT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-lg font-medium"
              >
                Upgrade to Pro — $3
              </a>
            )}
          </div>
        </div>

        {/* Login code banner */}
        {showLoginCode && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
            <p className="text-purple-300 text-sm font-medium mb-1">Save your login code!</p>
            <p className="text-white font-mono text-lg tracking-wider">{profile.loginCode}</p>
            <p className="text-gray-400 text-xs mt-1">
              You&apos;ll need this code + your password to log back in.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 rounded-xl p-1">
          {(["profile", "links", "social", ...(isPro ? ["analytics" as const] : [])] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio ({bio.length}/280)</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 280))}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Avatar URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
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
            <div className="flex items-center gap-3">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {saveMsg && <span className="text-green-400 text-sm">{saveMsg}</span>}
            </div>
            <div className="border-t border-white/10 pt-6 mt-6">
              <p className="text-gray-400 text-sm">
                Your page: <a href={`/p/${profile.slug}`} className="text-purple-400 hover:text-purple-300" target="_blank">onelink.wagnerway.co.za/p/{profile.slug}</a>
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Login code: <span className="text-white font-mono">{profile.loginCode}</span>
              </p>
            </div>
          </div>
        )}

        {/* Links Tab */}
        {activeTab === "links" && (
          <div className="space-y-6">
            {/* Add link form */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-medium mb-3">Add New Link</h3>
              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr] gap-2">
                <input
                  type="text"
                  value={newLinkIcon}
                  onChange={(e) => setNewLinkIcon(e.target.value)}
                  placeholder="Icon (emoji)"
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-center w-full sm:w-20"
                />
                <input
                  type="text"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  placeholder="Link title"
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={addLink}
                disabled={!newLinkTitle || !newLinkUrl}
                className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-500 transition-colors disabled:opacity-50"
              >
                Add Link
              </button>
              {!isPro && links.length >= 5 && (
                <p className="text-yellow-400 text-xs mt-2">Free plan is limited to 5 links. <a href={STRIPE_PAYMENT_LINK} className="underline" target="_blank">Upgrade to Pro</a> for unlimited.</p>
              )}
            </div>

            {/* Links list */}
            {links.map((link, idx) => (
              <div key={link.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveLink(link.id, "up")} disabled={idx === 0} className="text-gray-400 hover:text-white disabled:opacity-30 text-xs">▲</button>
                  <button onClick={() => moveLink(link.id, "down")} disabled={idx === links.length - 1} className="text-gray-400 hover:text-white disabled:opacity-30 text-xs">▼</button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium text-sm truncate">
                    {link.icon && <span className="mr-1">{link.icon}</span>}
                    {link.title}
                  </div>
                  <div className="text-gray-500 text-xs truncate">{link.url}</div>
                  {isPro && <div className="text-gray-400 text-xs mt-1">{link.clicks} clicks</div>}
                </div>
                <button
                  onClick={() => toggleLink(link.id, link.enabled)}
                  className={`w-10 h-6 rounded-full transition-colors ${link.enabled ? "bg-purple-600" : "bg-gray-600"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform mx-1 ${link.enabled ? "translate-x-4" : ""}`} />
                </button>
                <button onClick={() => deleteLink(link.id)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
              </div>
            ))}
            {links.length === 0 && <p className="text-gray-500 text-center py-8">No links yet. Add your first one above!</p>}
          </div>
        )}

        {/* Social Tab */}
        {activeTab === "social" && (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-medium mb-3">Add Social Link</h3>
              <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2">
                <select
                  value={newSocialPlatform}
                  onChange={(e) => setNewSocialPlatform(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id} className="bg-gray-900">
                      {p.icon} {p.name}
                    </option>
                  ))}
                </select>
                <input
                  type="url"
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={addSocial}
                disabled={!newSocialUrl}
                className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-500 transition-colors disabled:opacity-50"
              >
                Add Social
              </button>
            </div>

            {socialLinks.map((social) => {
              const platform = SOCIAL_PLATFORMS.find((p) => p.id === social.platform);
              return (
                <div key={social.id} className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-3">
                  <span className="text-xl">{platform?.icon || "🔗"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm">{platform?.name || social.platform}</div>
                    <div className="text-gray-500 text-xs truncate">{social.url}</div>
                  </div>
                  <button onClick={() => deleteSocial(social.id)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                </div>
              );
            })}
            {socialLinks.length === 0 && <p className="text-gray-500 text-center py-8">No social links yet.</p>}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && isPro && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                <div className="text-3xl font-bold text-white">{profile.views}</div>
                <div className="text-gray-400 text-sm mt-1">Total Views</div>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                <div className="text-3xl font-bold text-white">{links.reduce((sum, l) => sum + l.clicks, 0)}</div>
                <div className="text-gray-400 text-sm mt-1">Total Clicks</div>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-medium mb-4">Top Links</h3>
              {[...links].sort((a, b) => b.clicks - a.clicks).map((link) => (
                <div key={link.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-gray-300 text-sm truncate mr-4">
                    {link.icon && <span className="mr-1">{link.icon}</span>}
                    {link.title}
                  </span>
                  <span className="text-purple-400 font-medium text-sm whitespace-nowrap">{link.clicks} clicks</span>
                </div>
              ))}
              {links.length === 0 && <p className="text-gray-500 text-sm">No links to analyze yet.</p>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
