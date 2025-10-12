// This component renders the main header section of the application, including the logo, title, and a brief description.

import Image from "next/image";
import { Sparkles } from "lucide-react";

export function HeaderSection() {
  return (
    <div className="mb-8 text-center">
      {/* Logo */}
      <Image
        src="/images/DeWallify-Logo.png"
        alt="DeWallify Logo"
        width={300}
        height={300}
        className="mx-auto mb-4"
        priority
      />
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2">
        <Sparkles
          className="h-4 w-4 text-primary-foreground"
          strokeWidth={1.5}
        />
        <span className="text-sm font-medium text-primary-foreground">
          AI Powered
        </span>
      </div>
      <h1 className="mr-3 ml-3 mb-3 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
        Document Formatter
      </h1>
      <p className="text-pretty text-lg text-muted-foreground">
        Paste your plaintext and let AI transform it into beautifully formatted
        content
      </p>
    </div>
  );
}
