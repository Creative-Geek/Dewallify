// This is the main page of the DeWallify application. It serves as the primary user interface for the text formatting functionality.

"use client";

import { useTextFormatting } from "@/hooks/use-text-formatting";
import { HeaderSection } from "@/components/formatter/header-section";
import { ErrorMessage } from "@/components/formatter/error-message";
import { TextEditorPanel } from "@/components/formatter/text-editor-panel";
import { FeatureCards } from "@/components/formatter/feature-cards";
import { useState } from "react";
import { Github, PencilLine } from "lucide-react";

const SAMPLE_TEXT = `The Dawn of Artificial Intelligence A New Frontier in Technology Artificial intelligence, or AI, represents a pivotal development in computer science, focusing on the creation of intelligent machines that can work and react like humans. Some of the core capabilities being developed in AI systems include learning, reasoning, problem-solving, perception, and language understanding. From simple algorithms to complex neural networks, the field is rapidly evolving, aiming to simulate and even surpass human cognitive abilities in various tasks. Types and Applications AI is not a monolithic entity; it is often categorized into different types. The most prevalent form today is Narrow AI, which is designed to perform a specific task, such as voice assistants or facial recognition software. The next theoretical stage is General AI, a system with the ability to understand, learn, and apply knowledge across a wide range of tasks at a human level. Beyond that lies Superintelligence, an intellect that would far surpass the brightest human minds. The applications are already vast, spanning healthcare diagnostics, autonomous vehicles, financial trading, and personalized entertainment. The Societal Impact The integration of AI into our daily lives raises profound questions and challenges. While it promises to drive unprecedented economic growth and solve complex global problems, it also brings concerns about job displacement due to automation, the potential for algorithmic bias, and ethical dilemmas surrounding privacy and autonomous decision-making. As we move forward, a global conversation about regulation and ethical guidelines is essential to ensure that the development of AI aligns with humanity's best interests and contributes positively to society's future.`;

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
