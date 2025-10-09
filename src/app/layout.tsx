import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
  title: "DeWallify - Transform Your Text with AI",
  description:
    "A free, web-based utility that takes plain text and uses AI to automatically format it with Markdown for improved readability. Copy as rich text for Word, Docs, or anywhere.",
  keywords: [
    "text formatter",
    "markdown",
    "AI",
    "document formatting",
    "text formatting",
    "wall of text",
  ],
  authors: [{ name: "DeWallify" }],
  openGraph: {
    title: "DeWallify - Transform Your Text with AI",
    description:
      "Transform walls of text into beautifully formatted, readable content with AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}
