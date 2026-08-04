import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | AI Image Toolkit",
  description: "Terms governing the use of AI Image Toolkit.",
};

const LAST_UPDATED = "July 14, 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900">
      <article className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to home
          </Link>

          <h1 className="mt-6 text-4xl font-bold tracking-tight">
            Terms of Service
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-10 text-base leading-7 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              1. Acceptance of the Terms
            </h2>

            <p className="mt-3">
              These Terms of Service govern your access to and use of AI Image
              Toolkit. By creating an account or using the Service, you agree to
              these Terms and our Privacy Policy.
            </p>

            <p className="mt-3">
              If you do not agree to these Terms, you must not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              2. The Service
            </h2>

            <p className="mt-3">
              AI Image Toolkit provides image-processing features including
              image resizing, format conversion, cropping, background removal,
              upscaling, AI-assisted editing, project storage, and PDF export.
            </p>

            <p className="mt-3">
              Features may be added, modified, restricted, suspended, or
              removed at any time. Some features may be experimental or
              provided through third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              3. Accounts
            </h2>

            <p className="mt-3">
              You are responsible for providing accurate account information
              and keeping your login credentials secure. You are responsible
              for activity performed through your account.
            </p>

            <p className="mt-3">
              You must notify us if you believe your account has been accessed
              without authorization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              4. Uploaded content
            </h2>

            <p className="mt-3">
              You retain your rights to images and other content you upload to
              the Service.
            </p>

            <p className="mt-3">
              By uploading content, you grant us and our service providers a
              limited permission to store, transmit, process, transform, and
              display that content only as necessary to operate and provide the
              Service.
            </p>

            <p className="mt-3">
              You confirm that you own the uploaded content or have all
              permissions required to use and process it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              5. Prohibited use
            </h2>

            <p className="mt-3">You must not use the Service to:</p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Break any applicable law or regulation.</li>
              <li>Infringe copyrights, trademarks, or privacy rights.</li>
              <li>
                Upload illegal, abusive, defamatory, or malicious material.
              </li>
              <li>
                Create or distribute deceptive content intended to harm,
                impersonate, defraud, or mislead another person.
              </li>
              <li>
                Upload malware or attempt to compromise the Service or another
                system.
              </li>
              <li>
                Bypass usage limits, credit requirements, authentication, or
                security protections.
              </li>
              <li>
                Use automated systems to overload, scrape, or disrupt the
                Service.
              </li>
              <li>
                Process highly sensitive personal information without proper
                authorization.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              6. AI-generated and processed results
            </h2>

            <p className="mt-3">
              AI-assisted features may produce unexpected, inaccurate,
              incomplete, or unsuitable results. You are responsible for
              reviewing all generated or processed content before using,
              publishing, or distributing it.
            </p>

            <p className="mt-3">
              We do not guarantee that generated results are unique, error-free,
              appropriate for a particular purpose, or free from third-party
              claims.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              7. Credits and paid features
            </h2>

            <p className="mt-3">
              Certain features may require credits. The number of credits
              required for a feature may be displayed before processing begins.
            </p>

            <p className="mt-3">
              Credits have no monetary value outside the Service, cannot be
              exchanged for cash, and may not be transferred between accounts.
            </p>

            <p className="mt-3">
              We may modify credit prices or feature costs for future
              transactions. Changes will not retroactively reduce credits
              already added to an account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              8. Payments and refunds
            </h2>

            <p className="mt-3">
              Payments are processed by a third-party payment provider. You may
              be required to accept the provider&apos;s separate terms and
              privacy policy.
            </p>

            <p className="mt-3">
              Except where required by applicable law, purchases of digital
              credits are final once credits have been delivered or used.
            </p>

            <p className="mt-3">
              If credits were not delivered because of a verified technical
              error, contact us so that we can investigate the transaction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              9. Availability and usage limits
            </h2>

            <p className="mt-3">
              We do not guarantee uninterrupted access to the Service. Features
              may temporarily become unavailable because of maintenance,
              technical failures, provider outages, capacity restrictions, or
              monthly third-party processing limits.
            </p>

            <p className="mt-3">
              We may introduce reasonable file-size, storage, processing,
              credit, or rate limits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              10. Intellectual property
            </h2>

            <p className="mt-3">
              The Service, including its source code, interface, design,
              branding, and original website content, is protected by
              applicable intellectual property laws.
            </p>

            <p className="mt-3">
              These Terms do not transfer ownership of the Service or its
              underlying technology to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              11. Suspension and termination
            </h2>

            <p className="mt-3">
              We may restrict, suspend, or terminate access to the Service where
              reasonably necessary to prevent abuse, investigate security
              incidents, comply with legal obligations, or respond to a
              violation of these Terms.
            </p>

            <p className="mt-3">
              You may stop using the Service at any time. You may also request
              deletion of your account and associated personal data, subject to
              legal retention requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              12. Disclaimer
            </h2>

            <p className="mt-3">
              The Service is provided on an &quot;as is&quot; and &quot;as
              available&quot; basis. To the maximum extent permitted by law, we
              make no warranties regarding availability, reliability,
              accuracy, suitability, or fitness for a particular purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              13. Limitation of liability
            </h2>

            <p className="mt-3">
              To the maximum extent permitted by applicable law, we are not
              liable for indirect, incidental, consequential, or special
              damages, loss of profits, loss of data, business interruption, or
              damage resulting from reliance on processed or AI-generated
              content.
            </p>

            <p className="mt-3">
              Nothing in these Terms excludes liability that cannot legally be
              excluded or limited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              14. Governing law
            </h2>

            <p className="mt-3">
              These Terms are governed by the laws of Switzerland, without
              regard to conflict-of-law principles. Mandatory consumer
              protection rights applicable in your country remain unaffected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              15. Changes to these Terms
            </h2>

            <p className="mt-3">
              We may update these Terms when the Service, pricing, providers, or
              applicable laws change. The latest version will be published on
              this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              16. Contact
            </h2>

            <p className="mt-3">
              Questions regarding these Terms may be sent to:
            </p>

            <p className="mt-3">
              <a
                href="mailto:dawiditwork@gmail.com"
                className="font-medium text-blue-600 hover:underline"
              >
                dawiditwork@gmail.com
              </a>
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
