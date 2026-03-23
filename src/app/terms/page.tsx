import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Linkist",
  description: "Terms and conditions for using the Linkist platform.",
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#0F172A] px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-xl font-bold gradient-text inline-block mb-8">
          Linkist
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-gray-400 text-sm mb-8">Last updated: 23 March 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">1. Agreement</h2>
            <p>
              By creating an account or using Linkist (&quot;the Service&quot;), you agree to these Terms of Service
              and our <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>.
              If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">2. Eligibility</h2>
            <p>
              You must be at least 13 years old to use the Service. By using Linkist, you represent that
              you meet this age requirement. If you are between 13 and 18, you must have permission from
              a parent or legal guardian.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">3. Your Account</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>You must provide accurate information (including a valid email address).</li>
              <li>One person may not maintain more than one free account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">4. Acceptable Use</h2>
            <p>You may not use the Service to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Link to or promote illegal content, fraud, phishing, or scams.</li>
              <li>Distribute malware or harmful software.</li>
              <li>Harass, threaten, or abuse others.</li>
              <li>Infringe on intellectual property rights.</li>
              <li>Impersonate another person or entity.</li>
              <li>Spam or send unsolicited content.</li>
              <li>Attempt to exploit, hack, or disrupt the Service.</li>
              <li>Host or link to child sexual abuse material (CSAM) or content that exploits minors.</li>
            </ul>
            <p>
              We reserve the right to remove content or suspend accounts that violate these terms,
              without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">5. Content Ownership</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You retain ownership of all content you create on the Service (links, bio, images).</li>
              <li>
                By posting content, you grant us a worldwide, non-exclusive, royalty-free license to
                display, distribute, and store your content solely for the purpose of operating the Service.
              </li>
              <li>This license ends when you delete your content or account.</li>
              <li>We may remove any content that violates these terms or applicable law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">6. Payments and Refunds</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Pro upgrade is a one-time payment of $10 USD, processed by Stripe.</li>
              <li>
                Refunds may be requested within 7 days of purchase if you have not substantially used
                Pro features. Contact us at the email below.
              </li>
              <li>We reserve the right to change pricing for future purchases. Existing upgrades are not affected.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">7. Account Termination</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You may delete your account at any time from your dashboard.</li>
              <li>
                We may suspend or terminate your account for violations of these terms, with or
                without notice.
              </li>
              <li>Upon termination, your profile and data will be permanently deleted.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">8. Content Takedown</h2>
            <p>
              If you believe content on the Service infringes your rights or violates the law,
              contact us at{" "}
              <a href="mailto:abuse@linkist.vip" className="text-purple-400 hover:text-purple-300">
                abuse@linkist.vip
              </a>{" "}
              with details. We will review and act on valid complaints within a reasonable timeframe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">9. Limitation of Liability</h2>
            <p>
              The Service is provided &quot;as is&quot; without warranties of any kind. To the maximum extent
              permitted by law:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>We are not liable for any indirect, incidental, or consequential damages.</li>
              <li>We are not responsible for content posted by users.</li>
              <li>We do not guarantee uninterrupted or error-free service.</li>
              <li>Our total liability is limited to the amount you paid us in the 12 months preceding any claim.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">10. Governing Law</h2>
            <p>
              These terms are governed by the laws of the Republic of South Africa. Any disputes shall
              be resolved in the courts of South Africa, unless otherwise required by applicable
              consumer protection law in your jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">11. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Material changes will be communicated via
              email or a notice on the site. Continued use after changes constitutes acceptance of the
              new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-3">12. Contact</h2>
            <p>
              For questions about these terms, email us at{" "}
              <a href="mailto:hello@linkist.vip" className="text-purple-400 hover:text-purple-300">
                hello@linkist.vip
              </a>.
            </p>
          </section>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex gap-4 text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
          <Link href="/" className="hover:text-gray-300">Home</Link>
        </div>
      </div>
    </main>
  );
}
