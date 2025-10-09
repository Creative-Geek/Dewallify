"use client";

import { useTextFormatting } from "@/hooks/use-text-formatting";
import { HeaderSection } from "@/components/formatter/header-section";
import { ErrorMessage } from "@/components/formatter/error-message";
import { TextEditorPanel } from "@/components/formatter/text-editor-panel";
import { FeatureCards } from "@/components/formatter/feature-cards";
import { useState } from "react";

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
  } = useTextFormatting();

  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F0] via-[#FFF8E8] to-[#F5E6D3] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <HeaderSection />

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Input Panel */}
          <TextEditorPanel
            type="input"
            value={inputText}
            onChange={setInputText}
            onFormat={formatText}
            onClear={clearAll}
            isFormatting={isFormatting}
            isInputEmpty={!inputText.trim()}
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
      </div>
    </div>
  );
}
