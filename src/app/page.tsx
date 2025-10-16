// This is the main page of the DeWallify application. It serves as the primary user interface for the text formatting functionality.

"use client";

import { useTextFormatting } from "@/hooks/use-text-formatting";
import { HeaderSection } from "@/components/formatter/header-section";
import { ErrorMessage } from "@/components/formatter/error-message";
import { TextEditorPanel } from "@/components/formatter/text-editor-panel";
import { FeatureCards } from "@/components/formatter/feature-cards";
import { SAMPLE_TEXT } from "@/lib/sample-text";
import { useState } from "react";
import { Github, PencilLine } from "lucide-react";

export default function DocumentFormatter() {
  const {
    inputText,
    setInputText,
    formattedText,
    isFormatting,
    error,
    formatText,
    copyToClipboard,
    clearAll,
    provider,
    setProvider,
  } = useTextFormatting();

  const [isCopied, setIsCopied] = useState(false);

  const handleSampleText = () => {
    setInputText(SAMPLE_TEXT);
  };

  const handleCopy = async () => {
    await copyToClipboard();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-sky-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <HeaderSection />

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Main Content */}
        <div className="grid [@media(min-width:1090px)]:grid-cols-2 gap-6 mb-8">
          {/* Input Panel */}
          <TextEditorPanel
            type="input"
            value={inputText}
            onChange={setInputText}
            onFormat={formatText}
            onClear={clearAll}
            isFormatting={isFormatting}
            isInputEmpty={!inputText.trim()}
            provider={provider}
            onProviderChange={(p) => setProvider(p)}
            onSampleText={handleSampleText}
          />

          {/* Output Panel */}
          <TextEditorPanel
            type="output"
            value={formattedText}
            isFormatting={isFormatting}
            onCopy={handleCopy}
            isCopied={isCopied}
          />
        </div>

        {/* Features */}
        <FeatureCards />
        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground mt-12 mb-4">
          &copy; {new Date().getFullYear()} DeWallify. All rights reserved.
          <br />
          Built with ❤️ By The Creative Geek
        </div>
        {/*GitHub icon and link */}
        <div className="text-center">
          <a
            href="https://github.com/Creative-Geek/Dewallify"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <Github className="inline-block h-4 w-4 mr-1" />
            GitHub
          </a>
          <span className="mx-2 text-muted-foreground">•</span>
          <button
            data-tally-open="n0pJPB"
            className="text-muted-foreground hover:text-primary"
          >
            <PencilLine className="inline-block h-4 w-4 mr-1" />
            Suggest A Feature Or Report A Problem
          </button>
        </div>
      </div>
    </div>
  );
}
