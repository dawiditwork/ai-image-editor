import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | AI Image Editor",
  description: "Get in touch with the AI Image Editor developer.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Home
        </Link>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
          Contact
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          Have a question, found a bug, or would like to get in touch?
          Feel free to contact me using the information below.
        </p>

        <div className="mt-10 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Email
            </h2>

            <a
              href="mailto:dawiditwork@gmail.com"
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              dawiditwork@gmail.com
            </a>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              GitHub
            </h2>

            <a
              href="https://github.com/dawiditwork"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 hover:underline"
            >
              github.com/dawiditwork
            </a>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Location
            </h2>

            <p className="mt-2 text-slate-600">
              Switzerland 🇨🇭
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
