import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileImage,
  ImageIcon,
  Maximize2,
  ScanSearch,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { Providers } from "~/components/providers";

const tools = [
  {
    icon: ImageIcon,
    label: "Remove Background",
  },
  {
    icon: WandSparkles,
    label: "AI Edit",
  },
  {
    icon: Maximize2,
    label: "Upscale",
  },
  {
    icon: ScanSearch,
    label: "Smart Crop",
  },
  {
    icon: FileImage,
    label: "Convert & Export",
  },
];

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Providers>
      <div className="flex min-h-screen">
        {/* Left Side */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-[size:30px_30px] bg-grid-white/[0.05]" />

          <div className="absolute top-20 right-20 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute right-16 bottom-20 h-36 w-36 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute top-1/2 right-6 h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />

          <div className="relative z-10 flex w-full flex-col justify-center px-10 xl:px-14">
            <Link href="/" className="mb-10 flex items-center gap-3">
              <Image
                src="/examples/logo AI.png"
                alt="AI Image Toolkit"
                width={56}
                height={56}
                className="drop-shadow-lg"
              />

              <span className="text-3xl font-bold text-white">
                AI Image Toolkit
              </span>
            </Link>

            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
                <Sparkles className="h-4 w-4 text-emerald-300" />
                <span className="text-sm font-medium text-blue-100">
                  AI-Powered Image Toolkit
                </span>
              </div>

              <h1 className="mb-5 text-4xl font-extrabold leading-tight text-white xl:text-5xl">
                One Platform.
                <br />
                <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
                  Every Image Tool.
                </span>
              </h1>

              <p className="mb-7 max-w-lg text-lg leading-relaxed text-blue-100/80">
                Edit, enhance, convert and transform your images with powerful
                AI and professional image tools — all in one place.
              </p>

              <div className="mb-8 flex max-w-lg flex-wrap gap-3">
                {tools.map((tool) => (
                  <div
                    key={tool.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-blue-50 backdrop-blur transition-colors hover:bg-white/10"
                  >
                    <tool.icon className="h-4 w-4 text-cyan-300" />
                    <span>{tool.label}</span>
                  </div>
                ))}
              </div>

              <div className="grid max-w-lg grid-cols-3 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
                  <div className="text-2xl font-bold text-white">10</div>
                  <div className="text-xs text-blue-200">Free Credits</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
                  <div className="text-2xl font-bold text-white">10+</div>
                  <div className="text-xs text-blue-200">Editing Tools</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
                  <div className="text-2xl font-bold text-emerald-300">
                    24/7
                  </div>
                  <div className="text-xs text-blue-200">Available</div>
                </div>
              </div>

              <p className="mt-5 text-sm text-blue-100/60">
                Fast • Simple • AI Powered
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30 px-6 py-12 lg:px-8">
          <div className="w-full max-w-lg">
            <div className="mb-8 text-center lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src="/examples/logo AI.png"
                  alt="AI Image Toolkit"
                  width={42}
                  height={42}
                />

                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                  AI Image Toolkit
                </span>
              </Link>
            </div>

            {children}

            <p className="mt-4 text-center text-sm text-slate-600">
              Back to{" "}
              <Link
                href="/"
                className="font-medium text-blue-600 transition-colors hover:text-blue-500"
              >
                homepage
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Providers>
  );
}