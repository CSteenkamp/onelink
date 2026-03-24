import Link from "next/link";
import Footer from "@/components/Footer";

function ProfileMockup() {
  return (
    <div className="w-full max-w-[320px] mx-auto">
      <div className="rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 p-6 border border-white/10 shadow-2xl shadow-purple-500/20">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-4">
          <div className="avatar-ring mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl">
              ✨
            </div>
          </div>
          <h3 className="text-white font-bold text-lg">Sarah Chen</h3>
          <p className="text-gray-300 text-sm text-center mt-1">
            Designer & Creator | Making the internet beautiful ✨
          </p>
        </div>
        {/* Social icons */}
        <div className="flex justify-center gap-2 mb-4">
          {["📷", "𝕏", "▶️", "🎵"].map((icon, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm hover:bg-white/20 transition-colors">
              {icon}
            </div>
          ))}
        </div>
        {/* Links */}
        {["🎨 My Portfolio", "📹 Latest Video", "🛒 Shop Prints", "📧 Newsletter"].map((link, i) => (
          <div key={i} className="mb-2 bg-white/10 rounded-xl px-4 py-3 text-white text-sm text-center hover:bg-white/20 transition-all cursor-pointer">
            {link}
          </div>
        ))}
        <p className="text-center text-gray-500 text-xs mt-4">Powered by Linkist</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0F172A]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="text-2xl font-bold gradient-text">Linkist</div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
            Log In
          </Link>
          <Link
            href="/create"
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Create Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-16 pb-24 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              <span className="gradient-text">Your Internet,</span>
              <br />
              <span className="text-white">One Link</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-lg">
              Create your personal landing page in 60 seconds. All your links, socials, and content
              — one beautiful page. <span className="text-white font-medium">Free forever</span>,
              $1/mo to unlock everything.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/create"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity text-center"
              >
                Create Your Linkist — Free
              </Link>
            </div>
            <p className="text-gray-500 text-sm mt-4">Build and share in under 60 seconds.</p>
          </div>
          <div className="animate-fade-in-delay-1">
            <ProfileMockup />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Three steps. Sixty seconds.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Pick a username", desc: "Choose your unique handle — it becomes your URL", icon: "🔗" },
              { step: "2", title: "Add your links", desc: "Drop in your links, socials, and content", icon: "✨" },
              { step: "3", title: "Share everywhere", desc: "One link for Instagram, Twitter, email — everywhere", icon: "🚀" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-purple-400 font-mono text-sm mb-2">Step {item.step}</div>
                <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Linkist */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Why Linkist?
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Everything you need. Nothing you don&apos;t.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { icon: "💸", title: "Ridiculously affordable", desc: "Free to start, $1/mo for Pro. No surprise fees, no annual lock-in." },
              { icon: "🎨", title: "Beautiful themes", desc: "Free themes included. Unlock premium themes and custom colors with Pro." },
              { icon: "🤝", title: "Creator-friendly", desc: "No content restrictions. Your page, your rules. Everyone welcome." },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Simple pricing
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Start free. Upgrade when you need more.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-white font-bold text-xl mb-1">Free</h3>
              <div className="text-3xl font-bold text-white mb-6">
                $0 <span className="text-sm font-normal text-gray-400">forever</span>
              </div>
              <ul className="space-y-3 text-gray-300 text-sm mb-8">
                {["2 links", "2 free themes", "Social icons", "Shareable page", "Custom bio & avatar"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/create"
                className="block text-center border border-white/20 text-white px-6 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                Get Started
              </Link>
            </div>
            {/* Pro */}
            <div className="rounded-2xl border-2 border-purple-500 bg-gradient-to-b from-purple-500/10 to-transparent p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                BEST VALUE
              </div>
              <h3 className="text-white font-bold text-xl mb-1">Pro</h3>
              <div className="text-3xl font-bold text-white mb-1">
                $1 <span className="text-sm font-normal text-gray-400">per month</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">30-day free trial included</p>
              <ul className="space-y-3 text-gray-300 text-sm mb-8">
                {[
                  "Unlimited links",
                  "All premium themes",
                  "Click analytics",
                  "Custom colors",
                  "Priority badge",
                  "Email capture",
                  "Everything in Free",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-purple-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/create"
                className="block text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started — Upgrade Later
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to claim your link?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of creators who&apos;ve ditched overpriced subscriptions.
          </p>
          <Link
            href="/create"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Create Your Linkist — Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Linkist. Your internet, one link.
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/create" className="hover:text-white transition-colors">Create</Link>
            <Link href="/login" className="hover:text-white transition-colors">Log In</Link>
          </div>
        </div>
      </footer>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Linkist",
            url: "https://linkist.vip",
            description: "Create your personal landing page in 60 seconds. All your links, socials, and content — one beautiful page.",
            applicationCategory: "UtilityApplication",
            offers: [
              { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
              { "@type": "Offer", price: "1", priceCurrency: "USD", name: "Pro" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is Linkist?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Linkist is a personal landing page builder that lets you create a beautiful page with all your links, socials, and content in under 60 seconds.",
                },
              },
              {
                "@type": "Question",
                name: "How much does Linkist cost?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Linkist is free forever with 2 links and 2 themes. Pro is just $1/month for unlimited links, all themes, analytics, and more.",
                },
              },
              {
                "@type": "Question",
                name: "Why choose Linkist?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Linkist offers premium features at a fraction of the cost of other link-in-bio tools — just $1/month for unlimited links, all themes, analytics, and more.",
                },
              },
            ],
          }),
        }}
      />
      <Footer />
    </main>
  );
}
