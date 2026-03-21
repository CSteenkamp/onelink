"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loginCode, setLoginCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!loginCode || !password) {
      setError("Please enter your login code and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginCode: loginCode.trim().toUpperCase(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials.");
        setLoading(false);
        return;
      }
      document.cookie = `onelink_session=${data.sessionToken}; path=/; max-age=${60 * 60 * 24 * 365}`;
      router.push("/admin");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="text-2xl font-bold gradient-text inline-block mb-8">
          🔗 OneLink
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-gray-400 mb-8">Enter your login code and password to manage your page.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Login Code</label>
            <input
              type="text"
              value={loginCode}
              onChange={(e) => setLoginCode(e.target.value.toUpperCase())}
              placeholder="e.g. A1B2C3D4E5F6"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors font-mono tracking-wider"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your admin password"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don&apos;t have one?{" "}
          <Link href="/create" className="text-purple-400 hover:text-purple-300">
            Create your OneLink
          </Link>
        </p>
      </div>
    </main>
  );
}
