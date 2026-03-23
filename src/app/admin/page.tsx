"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { THEMES, SOCIAL_PLATFORMS, formatSocialUrl, type ThemeId } from "@/lib/constants";
import ImageUpload from "@/components/ImageUpload";

interface ProfileData {
  id: string;
  slug: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  headerImage: string | null;
  theme: string;
  plan: string;
  views: number;
  email: string;
  subscriptionStatus: string | null;
}

interface SocialLinkData {
  id: string;
  platform: string;
  url: string;
  order: number;
}

// Helper for authenticated API calls — cookies are sent automatically
function authFetch(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    credentials: "include",
  });
}

export default function AdminPageWrapper() {
  return <AdminPage />;
}

function AdminPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "social" | "analytics" | "account">("profile");

  // Edit states
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [theme, setTheme] = useState<ThemeId>("midnight");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Account management
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelMsg, setCancelMsg] = useState("");

  // New social
  const [newSocialPlatform, setNewSocialPlatform] = useState("twitter");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await authFetch("/api/admin/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      setHeaderImage(data.profile.headerImage || "");
      setTheme(data.profile.theme as ThemeId);
      setSocialLinks(data.socialLinks);
    } catch {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function saveProfile() {
    if (!profile) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await authFetch(`/api/profiles/${profile.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, bio, avatarUrl, headerImage, theme }),
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

  async function addSocial() {
    if (!newSocialUrl) return;
    const formattedUrl = formatSocialUrl(newSocialPlatform, newSocialUrl);
    const res = await authFetch("/api/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform: newSocialPlatform, url: formattedUrl }),
    });
    if (res.ok) {
      const data = await res.json();
      setSocialLinks([...socialLinks, data.socialLink]);
      setNewSocialUrl("");
    }
  }

  async function deleteSocial(id: string) {
    await authFetch(`/api/social/${id}`, { method: "DELETE" });
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
          <Link href="/" className="text-xl font-bold gradient-text">Linkist</Link>
          <div className="flex items-center gap-3">
            <a
              href={`/p/${profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-lg"
            >
              Preview ↗
            </a>
            {isPro ? (
              <span className="text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-lg font-semibold shadow-lg shadow-amber-500/20 flex items-center gap-1.5">
                <span className="text-xs">&#9733;</span> PRO
              </span>
            ) : (
              <button
                onClick={async () => {
                  try {
                    const res = await fetch("/api/stripe/checkout", { method: "POST" });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                    else alert(data.error || "Failed to start checkout");
                  } catch { alert("Network error"); }
                }}
                className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1.5 rounded-lg font-medium"
              >
                Upgrade to Pro — $1/mo
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/5 rounded-xl p-1">
          {(["profile", "social", ...(isPro ? ["analytics" as const] : []), "account"] as const).map((tab) => (
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
            <ImageUpload
              currentImageUrl={avatarUrl}
              onImageChange={setAvatarUrl}
              imageType="avatar"
              label="Avatar"
            />
            <ImageUpload
              currentImageUrl={headerImage}
              onImageChange={setHeaderImage}
              imageType="header"
              label="Header Image"
            />
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
                Your page: <a href={`/p/${profile.slug}`} className="text-purple-400 hover:text-purple-300" target="_blank">linkist.vip/p/{profile.slug}</a>
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Email: <span className="text-white">{profile.email}</span>
              </p>
            </div>
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
                  onChange={(e) => { setNewSocialPlatform(e.target.value); setNewSocialUrl(""); }}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id} className="bg-gray-900">
                      {p.icon} {p.name}
                    </option>
                  ))}
                </select>
                <input
                  type={SOCIAL_PLATFORMS.find((p) => p.id === newSocialPlatform)?.inputType || "url"}
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                  placeholder={SOCIAL_PLATFORMS.find((p) => p.id === newSocialPlatform)?.placeholder || "https://..."}
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
            <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-white">{profile.views}</div>
              <div className="text-gray-400 text-sm mt-1">Total Views</div>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === "account" && (
          <div className="space-y-6">
            {/* Export Data */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-medium mb-2">Export Your Data</h3>
              <p className="text-gray-400 text-sm mb-4">
                Download a JSON file containing all your profile data, links, and settings.
              </p>
              <a
                href="/api/account/export"
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-500 transition-colors"
              >
                Download My Data
              </a>
            </div>

            {/* Subscription Management */}
            {isPro && (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-white font-medium mb-2">Subscription</h3>
                {profile.subscriptionStatus === "cancelling" ? (
                  <p className="text-amber-400 text-sm">
                    Your subscription is set to cancel at the end of your billing period. You&apos;ll keep Pro features until then.
                  </p>
                ) : cancelMsg ? (
                  <p className="text-amber-400 text-sm">{cancelMsg}</p>
                ) : !cancelConfirm ? (
                  <div>
                    <p className="text-gray-400 text-sm mb-4">
                      You&apos;re on the Pro plan. You can cancel anytime — you&apos;ll keep Pro features until the end of your billing period.
                    </p>
                    <button
                      onClick={() => setCancelConfirm(true)}
                      className="text-sm text-gray-400 hover:text-white border border-white/10 px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-amber-300 text-sm">
                      Are you sure? You&apos;ll keep Pro features until the end of your current billing period.
                    </p>
                    <div className="flex gap-3">
                      <button
                        disabled={cancelling}
                        onClick={async () => {
                          setCancelling(true);
                          try {
                            const res = await authFetch("/api/stripe/cancel", { method: "POST" });
                            if (res.ok) {
                              const data = await res.json();
                              setCancelMsg(`Subscription cancelled. You'll keep Pro features until ${data.endDate}.`);
                            } else {
                              const data = await res.json();
                              setCancelMsg(data.error || "Failed to cancel.");
                            }
                          } catch {
                            setCancelMsg("Network error.");
                          }
                          setCancelling(false);
                        }}
                        className="text-sm bg-amber-600/20 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-lg font-medium hover:bg-amber-600/30 transition-colors disabled:opacity-50"
                      >
                        {cancelling ? "Cancelling..." : "Yes, Cancel"}
                      </button>
                      <button
                        onClick={() => setCancelConfirm(false)}
                        className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Keep Pro
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delete Account */}
            <div className="bg-red-500/5 rounded-xl p-6 border border-red-500/20">
              <h3 className="text-red-400 font-medium mb-2">Delete Account</h3>
              <p className="text-gray-400 text-sm mb-4">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="bg-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600/30 transition-colors"
                >
                  Delete My Account
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-red-300 text-sm font-medium">
                    Enter your password to confirm deletion:
                  </p>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full bg-white/5 border border-red-500/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                  />
                  {deleteError && (
                    <p className="text-red-400 text-sm">{deleteError}</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        setDeleteError("");
                        if (!deletePassword) {
                          setDeleteError("Password is required.");
                          return;
                        }
                        const res = await authFetch("/api/account/delete", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ password: deletePassword }),
                        });
                        if (res.ok) {
                          router.push("/");
                        } else {
                          const data = await res.json();
                          setDeleteError(data.error || "Failed to delete account.");
                        }
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-500 transition-colors"
                    >
                      Permanently Delete
                    </button>
                    <button
                      onClick={() => {
                        setDeleteConfirm(false);
                        setDeletePassword("");
                        setDeleteError("");
                      }}
                      className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
