// This is the root layout for the application. It sets up the HTML structure, includes global styles, defines metadata, and configures fonts.

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster"; // Updated import
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dewallify.creative-geek.tech"),
  title: "DeWallify - Instant Report & Essay Formatter for Word/Docs",
  description:
    "Tired of messy text? DeWallify is a free AI tool for students to instantly format reports, essays, and notes. Paste your text, and copy clean, professional formatting directly into Word or Google Docs.",
  keywords: [
    "report formatter",
    "essay formatting",
    "text formatter for students",
    "format text for Word",
    "document formatting",
    "AI text formatting",
    "free student tools",
    "copy and paste formatting",
    "academic writing",
    "report writing",
  ],
  authors: [{ name: "DeWallify" }],
  openGraph: {
    title: "DeWallify - Instant Report & Essay Formatter",
    description:
      "Transform messy notes into perfectly formatted reports and essays for Word or Google Docs with one click. Free and AI-powered.",
    url: "https://dewallify.creative-geek.tech",
    type: "website",
    images: [
      {
        url: "/images/DeWallify-Logo.png",
        width: 1200,
        height: 1200,
        alt: "DeWallify Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DeWallify - AI-Powered Text & Markdown Formatter",
    description:
      "Transform walls of text into beautifully formatted, readable content.",
    images: ["/images/DeWallify-Logo.png"],
  },
  icons: {
    icon: "/images/DeWallify-Logo.png",
    shortcut: "/images/DeWallify-Logo.png",
    apple: "/images/DeWallify-Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/DeWallify-Logo.png" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {children}
        <Toaster /> {/* Toaster component from designandstyling */}
        <Analytics />
      </body>
    </html>
  );
}
