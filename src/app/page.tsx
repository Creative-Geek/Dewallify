"use client";

import { useState, useEffect } from "react";
import Image from "next/image"; // Added Image import
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, Copy, FileText, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function DocumentFormatter() {
  const [inputText, setInputText] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [isFormatting, setIsFormatting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Configure marked to be synchronous
    marked.setOptions({ async: false });
    // DOMPurify is typically initialized with window, but it's already handled by the library itself
    // when imported in a browser environment. No explicit initialization needed here.
  }, []);

  const handleFormat = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Oops!",
        description: "Please paste some text first",
        variant: "destructive",
      });
      return;
    }

    setIsFormatting(true);
    try {
      const response = await fetch("/api/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();
      setFormattedText(data.formatted);

      toast({
        title: "✨ Formatted!",
        description: "Your document is ready",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFormatting(false);
    }
  };

  const handleCopy = async () => {
    if (!formattedText) return;

    const htmlContent = marked.parse(formattedText) as string;
    const sanitizedHtml = DOMPurify.sanitize(htmlContent);

    // Create DOCX-compatible HTML with proper styling and modern fonts
    const docxCompatibleHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Formatted Document</title>
          <style>
            /* Reset and base styles */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.4;
              color: #000000;
              background: white;
            }

            /* Headings */
            h1 { font-size: 16pt; font-weight: bold; margin: 12pt 0 6pt 0; color: #000000; }
            h2 { font-size: 14pt; font-weight: bold; margin: 10pt 0 4pt 0; color: #000000; }
            h3 { font-size: 12pt; font-weight: bold; margin: 8pt 0 3pt 0; color: #000000; }
            h4 { font-size: 11pt; font-weight: bold; margin: 6pt 0 2pt 0; color: #000000; }
            h5 { font-size: 11pt; font-weight: bold; margin: 4pt 0 2pt 0; color: #000000; }
            h6 { font-size: 11pt; font-weight: bold; margin: 3pt 0 1pt 0; color: #000000; }

            /* Paragraphs */
            p { margin: 0 0 8pt 0; line-height: 1.4; }

            /* Lists */
            ul, ol { margin: 0 0 8pt 0; padding-left: 20pt; }
            li { margin: 2pt 0; line-height: 1.4; }

            /* Bold and italic */
            strong { font-weight: bold; }
            em { font-style: italic; }

            /* Code */
            code {
              font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
              background: #f5f5f5;
              padding: 1pt 2pt;
              border-radius: 2pt;
            }
            pre {
              font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
              background: #f5f5f5;
              padding: 6pt;
              border-radius: 3pt;
              margin: 0 0 8pt 0;
              white-space: pre-wrap;
              word-wrap: break-word;
            }

            /* Blockquotes */
            blockquote {
              border-left: 3pt solid #cccccc;
              padding-left: 8pt;
              margin: 8pt 0;
              font-style: italic;
              background: #f9f9f9;
            }

            /* Tables */
            table { border-collapse: collapse; margin: 8pt 0; width: 100%; }
            th, td {
              border: 1pt solid #cccccc;
              padding: 4pt 6pt;
              vertical-align: top;
            }
            th { background: #f5f5f5; font-weight: bold; }

            /* Links */
            a { color: #0066cc; text-decoration: none; }
            a:hover { text-decoration: underline; }

            /* Horizontal rules */
            hr { border: none; border-top: 1pt solid #cccccc; margin: 12pt 0; }
          </style>
        </head>
        <body>
          ${sanitizedHtml}
        </body>
      </html>
    `.trim();

    try {
      // For better DOCX compatibility, also try the modern Clipboard API
      if (navigator.clipboard && window.ClipboardItem) {
        // Strip center tags from plain text for clean copying
        const plainTextForCopy = formattedText
          .replace(/<center>/g, "")
          .replace(/<\/center>/g, "");

        await navigator.clipboard.write([
          new ClipboardItem({
            "text/plain": new Blob([plainTextForCopy], { type: "text/plain" }),
            "text/html": new Blob([docxCompatibleHtml], { type: "text/html" }),
          }),
        ]);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = formattedText;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("Fallback: Could not copy text: ", err);
        }
        document.body.removeChild(textArea);
      }

      toast({
        title: "📋 Copied!",
        description: "Formatted text (rich and plain) copied to clipboard",
      });
    } catch (error) {
      console.error("Failed to copy rich text:", error);
      toast({
        title: "Error",
        description: "Failed to copy rich text. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setInputText("");
    setFormattedText("");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
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
            <Sparkles className="h-4 w-4 text-primary-foreground" />
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

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <Card className="flex flex-col gap-4 rounded-[2rem] border-2 border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-secondary p-2">
                <FileText className="h-5 w-5 text-secondary-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-card-foreground">
                Your Text
              </h2>
            </div>

            <Textarea
              placeholder={`Paste your plaintext here...\n\nTry something like:\n- Meeting notes\n- Email drafts\n- Article content\n- Any unformatted text!`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[300px] resize-none rounded-3xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />

            <div className="flex gap-3">
              <Button
                onClick={handleFormat}
                disabled={isFormatting || !inputText.trim()}
                className="flex-1 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                size="lg"
              >
                {isFormatting ? (
                  <>
                    <Wand2 className="mr-2 h-5 w-5 animate-spin" />
                    Formatting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Format with AI
                  </>
                )}
              </Button>

              <Button
                onClick={handleClear}
                variant="outline"
                className="rounded-full border-2 border-border bg-background text-foreground hover:bg-muted"
                size="lg"
              >
                Clear
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="flex flex-col gap-4 rounded-[2rem] border-2 border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-accent p-2">
                <Sparkles className="h-5 w-5 text-accent-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-card-foreground">
                Formatted Result
              </h2>
            </div>

            <div className="min-h-[300px] flex-1 rounded-3xl border-2 border-border bg-background p-4">
              {formattedText ? (
                <div
                  className="prose prose-sm max-w-none text-foreground [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-3 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-3 [&_ol]:space-y-1 [&_li]:mb-1 [&_li]:leading-relaxed [&_strong]:font-bold [&_em]:italic [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:text-sm [&_pre]:font-mono [&_pre]:overflow-x-auto [&_pre]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_table]:min-w-full [&_table]:border-collapse [&_table]:mb-3 [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:bg-muted [&_th]:font-semibold [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_hr]:my-6 [&_hr]:border-t-2 [&_hr]:border-border"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      marked.parse(formattedText) as string
                    ),
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center">
                  <div className="space-y-2">
                    <div className="mx-auto rounded-full bg-muted p-4">
                      <Wand2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your formatted text will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleCopy}
              disabled={!formattedText}
              className="w-full rounded-full bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90"
              size="lg"
            >
              <Copy className="mr-2 h-5 w-5" />
              Copy Formatted Text
            </Button>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Card className="rounded-3xl border-2 border-border bg-card p-6 text-center">
            <div className="mx-auto mb-3 w-fit rounded-full bg-primary p-3">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
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
              <FileText className="h-6 w-6 text-secondary-foreground" />
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
              <Copy className="h-6 w-6 text-accent-foreground" />
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
