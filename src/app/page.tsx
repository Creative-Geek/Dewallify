"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  Copy,
  CheckCircle,
  AlertCircle,
  FileText,
  Wand2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function DocumentFormatter() {
  const [inputText, setInputText] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [isFormatting, setIsFormatting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Configure marked to be synchronous
    marked.setOptions({ async: false });
    // DOMPurify is typically initialized with window, but it's already handled by the library itself
    // when imported in a browser environment. No explicit initialization needed here.
  }, []);

  const handleFormat = async () => {
    if (!inputText.trim()) {
      setError("Please paste some text to format");
      return;
    }

    setIsFormatting(true);
    setError(null);
    setFormattedText("");

    try {
      const response = await fetch("/api/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      setFormattedText(data.formatted);
    } catch (error) {
      setError("Oops! Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsFormatting(false);
    }
  };

  const handleCopy = async () => {
    if (!formattedText) return;

    try {
      // Convert markdown to HTML for rich text clipboard
      const markdownToHtml = (md: string) => {
        let html = md;

        // Headers
        html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
        html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
        html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

        // Bold and italic
        html = html.replace(
          /\*\*\*(.+?)\*\*\*/g,
          "<strong><em>$1</em></strong>"
        );
        html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

        // Code
        html = html.replace(/`(.+?)`/g, "<code>$1</code>");

        // Lists
        html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
        html = html.replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>");

        // Blockquotes
        html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

        // Line breaks
        html = html.replace(/\n\n/g, "</p><p>");
        html = "<p>" + html + "</p>";

        return html;
      };

      const htmlContent = markdownToHtml(formattedText);

      // Copy both plain text and HTML
      const clipboardItem = new ClipboardItem({
        "text/plain": new Blob([formattedText], { type: "text/plain" }),
        "text/html": new Blob([htmlContent], { type: "text/html" }),
      });

      await navigator.clipboard.write([clipboardItem]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // Fallback to plain text copy
      await navigator.clipboard.writeText(formattedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInputText("");
    setFormattedText("");
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F0] via-[#FFF8E8] to-[#F5E6D3] p-4 md:p-8">
      <style>{`
        :root {
          --paper-cream: #FAF7F0;
          --warm-taupe: #6B5B4F;
          --soft-coral: #FFB4A2;
          --pale-mint: #B5EAD7;
          --soft-lavender: #E0BBE4;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
          <h1 className="mb-3 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Document Formatter
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Paste your plaintext and let AI transform it into beautifully
            formatted content
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-4">
            <Card className="bg-red-50 border-2 border-red-200 p-4 rounded-3xl">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Input Panel */}
          <Card className="h-full bg-white/80 backdrop-blur-sm border-2 border-[#E0BBE4]/30 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#6B5B4F]">
                Paste Your Text
              </h2>
              <span className="text-sm text-[#8B7E74]">
                {inputText.length} characters
              </span>
            </div>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your unformatted text here... It can be notes, emails, articles, or any wall of text that needs structure."
              className="min-h-[500px] text-[#6B5B4F] text-base leading-relaxed border-2 border-[#E0BBE4]/20 rounded-2xl p-4 resize-none focus:border-[#FFB4A2] focus:ring-2 focus:ring-[#FFB4A2]/20 transition-all placeholder:text-[#8B7E74]/50"
            />
          </Card>

          {/* Output Panel */}
          <Card className="h-full bg-white/80 backdrop-blur-sm border-2 border-[#B5EAD7]/30 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#6B5B4F]">
                Formatted Output
              </h2>
              {formattedText && (
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-2 border-[#B5EAD7] hover:bg-[#B5EAD7]/20 text-[#6B5B4F] transition-all"
                >
                  {isCopied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="min-h-[500px] max-h-[500px] overflow-y-auto border-2 border-[#B5EAD7]/20 rounded-2xl p-6 bg-white/50">
              {isFormatting ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin">
                    <Sparkles className="w-12 h-12 text-[#FFB4A2]" />
                  </div>
                  <p className="mt-4 text-[#8B7E74]">Formatting your text...</p>
                </div>
              ) : formattedText ? (
                <div
                  className="prose prose-sm max-w-none text-[#6B5B4F] [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-3 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-3 [&_ol]:space-y-1 [&_li]:mb-1 [&_li]:leading-relaxed [&_strong]:font-bold [&_strong]:text-[#FFB4A2] [&_em]:italic [&_em]:text-[#E0BBE4] [&_code]:bg-[#E0BBE4]/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_pre]:bg-[#E0BBE4]/10 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:text-sm [&_pre]:font-mono [&_pre]:overflow-x-auto [&_pre]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-[#FFB4A2] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-[#8B7E74] [&_table]:min-w-full [&_table]:border-2 [&_table]:border-[#E0BBE4]/20 [&_table]:rounded-lg [&_table]:mb-3 [&_th]:border [&_th]:border-[#E0BBE4]/20 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold [&_th]:text-left [&_th]:text-[#6B5B4F] [&_th]:bg-[#E0BBE4]/10 [&_td]:border [&_td]:border-[#E0BBE4]/20 [&_td]:px-3 [&_td]:py-2 [&_td]:text-[#6B5B4F] [&_hr]:my-6 [&_hr]:border-t-2 [&_hr]:border-[#E0BBE4]/20 [&_a]:text-[#FFB4A2] [&_a]:hover:text-[#E0BBE4] [&_a]:underline"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      marked.parse(formattedText) as string
                    ),
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 mb-4 rounded-full bg-[#B5EAD7]/10 flex items-center justify-center">
                    <Sparkles
                      className="w-12 h-12 text-[#B5EAD7]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <p className="text-[#8B7E74]">
                    Your beautifully formatted text will appear here
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Format Button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleFormat}
            disabled={isFormatting || !inputText.trim()}
            className="relative px-8 py-6 text-lg font-semibold text-white bg-gradient-to-r from-[#FFB4A2] to-[#E0BBE4] hover:from-[#FFB4A2]/90 hover:to-[#E0BBE4]/90 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Sparkles className="w-5 h-5 mr-2 inline" />
            {isFormatting ? "Formatting..." : "Format with AI"}
          </Button>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Card className="rounded-3xl border-2 border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 w-fit rounded-full bg-primary p-3">
              <Sparkles
                className="h-6 w-6 text-primary-foreground"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="mb-2 font-semibold text-card-foreground">
              AI Powered
            </h3>
            <p className="text-sm text-muted-foreground">
              Smart formatting using advanced AI models
            </p>
          </Card>

          <Card className="rounded-3xl border-2 border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 w-fit rounded-full bg-secondary p-3">
              <FileText
                className="h-6 w-6 text-secondary-foreground"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="mb-2 font-semibold text-card-foreground">
              Professional Output
            </h3>
            <p className="text-sm text-muted-foreground">
              Get document-ready formatted text instantly
            </p>
          </Card>

          <Card className="rounded-3xl border-2 border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 w-fit rounded-full bg-accent p-3">
              <Copy
                className="h-6 w-6 text-accent-foreground"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="mb-2 font-semibold text-card-foreground">
              Easy Copy
            </h3>
            <p className="text-sm text-muted-foreground">
              One-click copy to use anywhere you need
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
