// This is the root layout for the application. It sets up the HTML structure, includes global styles, defines metadata, and configures fonts.

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "@/components/ui/toaster"; // Updated import
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://dewallify.creative-geek.tech"),
  title: "DeWallify - AI-Powered Text & Markdown Formatter",
  description:
    "A free, web-based utility that takes plain text and uses AI to automatically format it with Markdown for improved readability. Copy as rich text for Word, Docs, or anywhere.",
  keywords: [
    "text formatter",
    "markdown",
    "AI",
    "document formatting",
    "text formatting",
    "wall of text",
    "copy as markdown",
    "rich text",
  ],
  authors: [{ name: "DeWallify" }],
  openGraph: {
    title: "DeWallify - AI-Powered Text & Markdown Formatter",
    description:
      "Transform walls of text into beautifully formatted, readable content with AI.",
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
      "Transform walls of text into beautifully formatted, readable content with AI.",
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
      </body>
    </html>
  );
}
