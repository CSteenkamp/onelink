import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Linkist",
  description: "How Linkist collects, uses, and protects your personal data.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#0F172A] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-xl font-bold gradient-text inline-block mb-8">
          Linkist
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: 23 March 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Who We Are</h2>
            <p>
              Linkist (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the website at linkist.vip. We provide a
              personal landing page service that lets users create link-in-bio pages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. Data We Collect</h2>
            <p>We collect the following personal data:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Account data:</strong> Email address, display name, username (slug), and password (stored hashed, never in plain text).</li>
              <li><strong>Profile content:</strong> Bio text, social links, avatar image, and header image that you choose to upload.</li>
              <li><strong>Usage data:</strong> Page view counts and link click counts (aggregated, not per-visitor).</li>
              <li><strong>Payment data:</strong> If you upgrade to Pro, Stripe processes your payment. We store only your Stripe customer ID — we never see or store your card details.</li>
              <li><strong>Technical data:</strong> IP addresses are processed for rate limiting and security but are not stored permanently.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Why We Collect It</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To create and maintain your account</li>
              <li>To display your public profile page</li>
              <li>To provide analytics on your page performance (Pro feature)</li>
              <li>To process payments via Stripe</li>
              <li>To protect the service from abuse (rate limiting, security)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. How We Store and Protect Your Data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Passwords are hashed with bcrypt (never stored in plain text).</li>
              <li>Sessions use signed, HttpOnly, Secure cookies.</li>
              <li>Images are stored in Amazon S3 with server-side encryption.</li>
              <li>Database is PostgreSQL with encrypted connections.</li>
              <li>All traffic is served over HTTPS.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Who We Share Data With</h2>
            <p>We do not sell your data. We share data only with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Stripe:</strong> For payment processing (Pro upgrades).</li>
              <li><strong>Amazon Web Services:</strong> For image storage (S3).</li>
            </ul>
            <p>Your public profile content (display name, bio, social links, avatar) is publicly visible by design — that is the purpose of the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">6. Cookies</h2>
            <p>
              We use a single functional cookie (<code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">onelink_session</code>) to
              keep you logged in. This is strictly necessary for the service to function. We do not use
              advertising, analytics, or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">7. Your Rights</h2>
            <p>Under GDPR, POPIA, CCPA, and similar laws you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Access:</strong> Download a copy of all your data from your account settings.</li>
              <li><strong>Deletion:</strong> Permanently delete your account and all associated data.</li>
              <li><strong>Rectification:</strong> Update your data at any time from your dashboard.</li>
              <li><strong>Portability:</strong> Export your data in JSON format.</li>
              <li><strong>Withdraw consent:</strong> Delete your account to withdraw consent for data processing.</li>
            </ul>
            <p>
              You can exercise these rights directly from your admin dashboard, or by contacting us at the email below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">8. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. When you delete your account,
              all personal data (profile, links, images) is permanently deleted within 30 days.
              Aggregated, anonymized analytics may be retained.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">9. Children</h2>
            <p>
              Linkist is not intended for users under 13 years of age. We do not knowingly collect data
              from children under 13. If you believe a child has created an account, please contact us
              and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. Material changes will be communicated via
              email or a notice on the site. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">11. Contact</h2>
            <p>
              For privacy-related questions or requests, email us at{" "}
              <a href="mailto:privacy@linkist.vip" className="text-purple-400 hover:text-purple-300">
                privacy@linkist.vip
              </a>.
            </p>
          </section>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex gap-4 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-gray-300">Terms of Service</Link>
          <Link href="/" className="hover:text-gray-300">Home</Link>
        </div>
      </div>
    </main>
  );
}
