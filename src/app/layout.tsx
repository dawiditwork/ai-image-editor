import "../styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "~/components/ui/sonner"


export const metadata: Metadata = {
  title: "AI Image Toolkit",
  description:
    "An all-in-one image toolkit with AI-powered editing and free image utilities.",
  icons: {
    icon: [
      {
        url: "/favicon2.png",
        type: "image/png",
      },
    ],
    shortcut: "/favicon2.png",
    apple: "/favicon2.png",
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
