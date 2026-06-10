import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LuminProvider } from "@/lib/lumin-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumin — Turn Threads feedback into PRs",
  description: "AI-powered product development platform that transforms user feedback from Instagram Threads into actionable GitHub pull requests.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col"><LuminProvider>{children}</LuminProvider></body>
    </html>
  );
}
