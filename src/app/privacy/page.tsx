import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | AI Image Toolkit",
  description:
    "Learn how AI Image Toolkit collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "July 14, 2026";

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <div className="space-y-10 text-base leading-7 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              1. Introduction
            </h2>

            <p className="mt-3">
              This Privacy Policy explains how AI Image Toolkit
              (&quot;we&quot;, &quot;us&quot;, or &quot;the Service&quot;)
              collects, uses, stores, and protects personal data when you use
              our website and image-processing tools.
            </p>

            <p className="mt-3">
              We process personal data in accordance with applicable data
              protection laws, including the Swiss Federal Act on Data
              Protection and, where applicable, the General Data Protection
              Regulation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              2. Data controller
            </h2>

            <p className="mt-3">
              The person responsible for processing personal data through the
              Service is:
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 p-5">
              <p className="font-medium text-slate-900">Dawid Frankowicz</p>
              <p>Switzerland</p>
              <p>
                Email:{" "}
                <a
                  href="mailto:dawiditwork@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  dawiditwork@gmail.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              3. Information we collect
            </h2>

            <p className="mt-3">
              Depending on how you use the Service, we may collect the
              following categories of information:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Account information:</strong> email address, account
                identifier, authentication data, and account creation date.
              </li>

              <li>
                <strong>Uploaded content:</strong> images and files that you
                upload, process, convert, save, or export through the Service.
              </li>

              <li>
                <strong>Project information:</strong> project names, image
                references, selected transformations, and related settings.
              </li>

              <li>
                <strong>Transaction information:</strong> payment status,
                purchased credit package, transaction identifier, and billing
                metadata. Full card details are handled by the payment provider
                and are not stored by us.
              </li>

              <li>
                <strong>Technical information:</strong> IP address, browser
                type, device information, server logs, error information, and
                basic security data.
              </li>

              <li>
                <strong>Communications:</strong> information you provide when
                contacting us for support or feedback.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              4. How we use your information
            </h2>

            <p className="mt-3">We may use personal data to:</p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Create and manage user accounts.</li>
              <li>Authenticate users and maintain secure sessions.</li>
              <li>Upload, store, process, transform, and deliver images.</li>
              <li>Save and display user projects.</li>
              <li>Manage credits, purchases, and payment confirmations.</li>
              <li>Send account verification and service-related emails.</li>
              <li>Prevent fraud, abuse, and unauthorized access.</li>
              <li>Diagnose technical problems and improve the Service.</li>
              <li>Comply with applicable legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              5. Legal grounds for processing
            </h2>

            <p className="mt-3">
              Where the GDPR applies, we process personal data based on one or
              more of the following legal grounds:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                Performance of a contract when processing is necessary to
                provide the Service.
              </li>

              <li>
                Legitimate interests, such as securing, maintaining, and
                improving the Service.
              </li>

              <li>
                Compliance with legal obligations, including accounting or
                fraud-prevention requirements.
              </li>

              <li>
                Consent, where we specifically ask you to provide it.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              6. Service providers
            </h2>

            <p className="mt-3">
              We use third-party providers to operate the Service. These
              providers may process limited personal data on our behalf:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Vercel</strong> – website hosting and application
                infrastructure.
              </li>

              <li>
                <strong>Neon</strong> – database hosting.
              </li>

              <li>
                <strong>ImageKit</strong> – image storage, delivery, and image
                transformations.
              </li>

              <li>
                <strong>Polar</strong> – checkout, payment processing, and
                transaction management.
              </li>

              <li>
                <strong>Resend</strong> – delivery of account verification and
                service emails.
              </li>
            </ul>

            <p className="mt-4">
              These providers process data according to their own privacy
              policies and contractual obligations. Some providers may process
              data outside Switzerland or the European Economic Area.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              7. Image processing
            </h2>

            <p className="mt-3">
              Images uploaded to the Service may be transferred to and
              processed by our image infrastructure provider. Depending on the
              selected tool, processing may include resizing, format
              conversion, background removal, upscaling, cropping, AI-assisted
              editing, or PDF generation.
            </p>

            <p className="mt-3">
              You should only upload files that you are legally permitted to
              use and process. Do not upload highly sensitive, confidential, or
              unlawful material.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              8. Cookies and local storage
            </h2>

            <p className="mt-3">
              The Service may use essential cookies or similar browser storage
              technologies to keep users signed in, maintain sessions, remember
              required settings, and protect the Service against abuse.
            </p>

            <p className="mt-3">
              We do not currently use advertising cookies. If non-essential
              analytics or marketing technologies are introduced, this Privacy
              Policy and any required consent mechanism will be updated.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              9. Data retention
            </h2>

            <p className="mt-3">
              We retain personal data only for as long as reasonably necessary
              to provide the Service, maintain security, comply with legal
              obligations, resolve disputes, and enforce our agreements.
            </p>

            <p className="mt-3">
              Account and project data may remain stored until the account or
              relevant project is deleted. Certain transaction and technical
              records may be retained for longer where required by law or
              necessary for security and fraud prevention.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              10. Data security
            </h2>

            <p className="mt-3">
              We use reasonable technical and organizational measures designed
              to protect personal data against unauthorized access, loss,
              misuse, alteration, or disclosure.
            </p>

            <p className="mt-3">
              However, no online service or method of electronic storage can be
              guaranteed to be completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              11. Your rights
            </h2>

            <p className="mt-3">
              Depending on the law applicable to you, you may have the right
              to:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Request access to your personal data.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of personal data.</li>
              <li>Object to or restrict certain processing.</li>
              <li>Request a portable copy of certain data.</li>
              <li>Withdraw consent where processing is based on consent.</li>
              <li>
                Submit a complaint to a competent data protection authority.
              </li>
            </ul>

            <p className="mt-4">
              To exercise your rights, contact us using the email address
              provided in this Privacy Policy. We may need to verify your
              identity before completing a request.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              12. Children
            </h2>

            <p className="mt-3">
              The Service is not intended for children under the age of 16. We
              do not knowingly collect personal data from children under 16
              without appropriate authorization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              13. Changes to this Privacy Policy
            </h2>

            <p className="mt-3">
              We may update this Privacy Policy when the Service, our providers,
              or applicable laws change. The updated version will be published
              on this page with a revised &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900">
              14. Contact
            </h2>

            <p className="mt-3">
              Questions or requests concerning privacy may be sent to:
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
