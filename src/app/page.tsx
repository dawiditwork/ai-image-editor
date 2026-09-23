import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  Expand,
  FileText,
  ImageIcon,
  Play,
  RefreshCw,
  Scissors,
  Sparkles,
  Target,
  Upload,
  WandSparkles,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import FaqSection from "~/components/faq-section";
const tools = [
  {
    icon: WandSparkles,
    title: "AI Image Edit",
    description:
      "Describe what you want to change and let AI transform your image.",
    type: "AI",
  },
  {
    icon: Scissors,
    title: "Background Removal",
    description:
      "Remove backgrounds from portraits, products and object photos.",
    type: "AI",
  },
  {
    icon: Expand,
    title: "AI Upscaling",
    description: "Improve sharpness and enlarge low-resolution images.",
    type: "AI",
  },
  {
    icon: Target,
    title: "Smart Subject Focus",
    description: "Automatically detect and focus on the main subject.",
    type: "AI",
  },
  {
    icon: RefreshCw,
    title: "Format Converter",
    description: "Convert images between JPG, PNG and WebP for free.",
    type: "FREE",
  },
  {
    icon: FileText,
    title: "Images to PDF",
    description: "Turn one or multiple images into a downloadable PDF.",
    type: "FREE",
  },
];

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload your image",
    description: "Choose a JPG, PNG or WebP file from your device.",
  },
  {
    icon: Sparkles,
    number: "02",
    title: "Choose a tool",
    description: "Use AI editing or one of the free image utilities.",
  },
  {
    icon: Download,
    number: "03",
    title: "Download the result",
    description: "Export the finished image or create a PDF document.",
  },
];

const faq = [
  {
    question: "Which features are free?",
    answer:
      "Resize Images, Format Converter, Smart Subject Focus and PDF tools are completely free and never use AI credits.",
  },
  {
    question: "Which image formats are supported?",
    answer:
      "Upload JPG, PNG and WebP images. Export your images in JPG, PNG, WebP or PDF.",
  },
  {
    question: "How do AI credits work?",
    answer:
      "AI credits are only used for AI Image Edit, Background Removal and AI Upscaling. Every new account includes 10 free AI credits. Free tools never consume credits.",
  },
  {
    question: "Do I need an account?",
    answer:
      "Yes. Create a free account to save your projects and receive 10 free AI credits.",
  },
  {
    question: "Can I use AI Image Toolkit on mobile?",
    answer:
      "Yes. AI Image Toolkit works on desktop, tablet and mobile devices directly in your browser.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 text-slate-950">
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2">
            <Image
              src="/examples/logo AI.png"
              alt="AI Image Toolkit"
              width={48}
              height={48}
              priority
              className="h-11 w-11 transition duration-300 group-hover:scale-110 md:h-14 md:w-14"
            />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-sm font-bold text-transparent sm:text-xl">
              AI Image Toolkit
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#tools"
              className="text-sm font-medium text-slate-600 hover:text-slate-950"
            >
              Tools
            </Link>
            <Link
              href="#examples"
              className="text-sm font-medium text-slate-600 hover:text-slate-950"
            >
              Examples
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-slate-600 hover:text-slate-950"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium text-slate-600 hover:text-slate-950"
            >
              FAQ
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/auth/sign-in">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-3 sm:px-5"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="gap-2 rounded-full bg-slate-950 px-4 hover:bg-slate-800 sm:px-5"
              >
                Try Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden py-16 sm:py-24">
          <div className="absolute inset-x-0 top-0 -z-10 mx-auto h-96 max-w-5xl rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl" />

          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm shadow-sm">
                <Sparkles className="h-4 w-4 text-blue-600" />
                AI editing · Image conversion · PDF export
              </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-5xl">
              Your all-in-one
              <span className="block text-slate-900">
                Image Toolkit
              </span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Edit, enhance, resize, convert and export images from one simple
                workspace. Use powerful AI tools and free utilities for everyday
                tasks.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="w-full gap-2 rounded-full px-8 shadow-xl shadow-blue-500/20 sm:w-auto"
                  >
                    <Play className="h-5 w-5" />
                    Open Image Tools
                  </Button>
                </Link>
                <Link href="#tools">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2 rounded-full bg-white/80 px-8 sm:w-auto"
                  >
                    <ImageIcon className="h-5 w-5" />
                    Explore Features
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-600 lg:justify-start">
                {[
                  "No credit card required",
                  "10 free AI credits",
                  "Free PDF tools",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

               <div className="relative mx-auto w-full max-w-7xl lg:scale-[1.08]">
  <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />

  <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
    <Image
      src="/examples/Example.jpg"
      alt="AI Image ToolkitDashboard"
      width={1600}
      height={900}
      priority
      className="h-auto w-full"
    />
            </div>
          </div>
          </div>
        </section>

        <section id="tools" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need for your images
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                AI-powered editing and everyday image utilities in one
                workspace.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Card
                    key={tool.title}
                    className="group border-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <CardContent className="p-6">
                      <div className="mb-5 flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100">
                          <Icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${tool.type === "FREE" ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700"}`}
                        >
                          {tool.type}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold">{tool.title}</h3>
                      <p className="mt-3 leading-7 text-slate-600">
                        {tool.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="examples" className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Before{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  & after
                </span>
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                See what the AI tools can do in just a few seconds.
              </p>
            </div>

                <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10">
              <Image
                src="/examples/Example functions.png"
                alt="Before and After AI Examples"
                width={2200}
                height={1200}
                className="block h-auto w-full"
              />
            </div>
          </div>
          </div>
        </section>

        <section className="bg-white py-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mx-auto mb-16 max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Edit any image in{" "}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          3 simple steps
        </span>
      </h2>

      <p className="mt-4 text-lg text-slate-600">
        Upload your image, choose a tool and download the result in seconds.
      </p>
    </div>

    <div className="relative grid gap-8 md:grid-cols-3">

      {/* Connecting line */}
      <div className="absolute left-1/2 top-8 hidden h-[2px] w-[65%] -translate-x-1/2 bg-gradient-to-r from-blue-200 via-purple-300 to-blue-200 md:block" />

      {steps.map((step) => {
        const Icon = step.icon;

        return (
          <div
            key={step.number}
            className="group relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-purple-100 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                <Icon className="h-7 w-7 text-purple-600" />
              </div>

              <span className="text-4xl font-black text-slate-100 transition-colors duration-300 group-hover:text-blue-100">
                {step.number}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              {step.title}
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              {step.description}
            </p>
          </div>
        );
      })}
    </div>
  </div>
</section>

        <section
  id="pricing"
  className="bg-gradient-to-br from-slate-50 to-blue-50/50 py-20"
>
  <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
    <div className="mx-auto mb-14 max-w-2xl text-center">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Simple pricing
      </h2>

      <p className="mt-4 text-lg text-slate-600">
        Use everyday image tools for free and spend credits only on AI
        features.
      </p>
    </div>

    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="border-slate-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold">Free Tools</h3>

          <div className="mt-4 text-5xl font-bold">$0</div>

          <p className="mt-3 text-slate-600">
            Useful image utilities with no credit cost.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Image resizing",
              "JPG, PNG and WebP conversion",
              "Single image to PDF",
              "Multiple images to PDF",
              "Smart subject focus",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link href="/dashboard">
            <Button
              variant="outline"
              size="lg"
              className="mt-8 w-full rounded-xl"
            >
              Use Free Tools
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="relative border-2 border-blue-500 bg-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/15">
        <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 text-xs font-semibold text-white">
          AI FEATURES
        </span>

        <CardContent className="p-8">
          <h3 className="text-2xl font-bold">AI Credits</h3>

          <div className="mt-4 text-5xl font-bold">
            10 free
            <span className="ml-2 text-lg font-medium text-slate-500">
              credits
            </span>
          </div>

          <p className="mt-3 text-slate-600">
            Start free and add more credits whenever you need them.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Background removal",
              "AI upscaling",
              "AI image editing",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Link href="/dashboard">
            <Button
              size="lg"
              className="mt-8 w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Get 10 Free Credits
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

       <section id="faq" className="bg-white py-20">
  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
    <div className="mb-14 text-center">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Frequently asked{" "}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          questions
        </span>
      </h2>

      <p className="mt-4 text-lg text-slate-600">
        Everything you need to know before getting started.
      </p>
    </div>

    <FaqSection items={faq} />
  </div>
</section>
     <section className="bg-gradient-to-r from-blue-100/70 to-purple-100/70 py-20">
  <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
      Ready to transform your images?
    </h2>

    <p className="mt-4 text-lg text-slate-600">
      Start with free image tools and get 10 AI credits when you create your
      account.
    </p>

    <Link href="/dashboard">
      <Button
        size="lg"
        className="mt-8 gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
      >
        <Sparkles className="h-5 w-5" />
        Start Editing Free
      </Button>
    </Link>
  </div>
</section>
</main>

<footer className="border-t border-slate-200 bg-slate-100">
  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
      <div>
        <div className="flex items-center justify-center gap-2 md:justify-start">
          <Image
            src="/examples/logo AI.png"
            alt="AI Image Toolkit"
            width={40}
            height={40}
          />

          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent">
            AI Image Toolkit
          </span>
        </div>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
          Edit, enhance, resize, convert, and export images directly in your
          browser with powerful AI and free image tools.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-600">
        <Link
          href="#tools"
          className="transition-colors hover:text-blue-600"
        >
          Tools
        </Link>

        <Link
          href="#pricing"
          className="transition-colors hover:text-blue-600"
        >
          Pricing
        </Link>

        <Link
          href="#faq"
          className="transition-colors hover:text-blue-600"
        >
          FAQ
        </Link>

        <Link
          href="/privacy"
          className="transition-colors hover:text-blue-600"
        >
          Privacy Policy
        </Link>

        <Link
          href="/terms"
          className="transition-colors hover:text-blue-600"
        >
          Terms of Service
        </Link>

        <Link
          href="/contact"
          className="transition-colors hover:text-blue-600"
        >
          Contact
        </Link>

        <Link
          href="https://github.com/dawiditwork"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-blue-600"
        >
          GitHub
        </Link>

        <Link
          href="https://www.linkedin.com/in/dawid-f-978307425/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-blue-600"
        >
          LinkedIn
        </Link>
      </div>
    </div>

    <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 sm:flex-row sm:text-left">
      <p>© 2026 AI Image Toolkit. All rights reserved.</p>

      <p>
        Designed &amp; Developed by{" "}
        <span className="font-medium text-slate-700">
          Dawid Frankowicz
        </span>
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}
